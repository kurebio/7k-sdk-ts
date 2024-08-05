import {
  TransactionBlock,
  TransactionObjectArgument,
  TransactionResult,
} from "@mysten/sui.js/transactions";
import BigNumber from "bignumber.js";
import { getSplitCoinForTx } from "./libs/getSplitCoinForTx";
import { groupSwapRoutes } from "./libs/groupSwapRoutes";
import { swapWithRoute } from "./libs/swapWithRoute";
import { denormalizeTokenType } from "./utils/token";
import { SuiUtils } from "./utils/sui";
import { BuildTxParams } from "./types/tx";
import { _7K_CONFIG, _7K_PACKAGE_ID } from "./constants/_7k";
import { isValidSuiAddress } from "@mysten/sui.js/utils";

export const buildTx = async ({
  quoteResponse,
  accountAddress,
  slippage,
  commission: _commission,
  isGasEstimate,
  extendTx,
}: BuildTxParams) => {
  const { tx: _tx, coinIn } = extendTx || {};
  if (!accountAddress) {
    throw new Error("Sender address is required");
  }

  if (!quoteResponse.routes) {
    throw new Error("Invalid quote response: 'routes' are required");
  }

  if (!isValidSuiAddress(_commission.partner)) {
    throw new Error("Invalid commission partner address");
  }

  const tx = _tx || new TransactionBlock();

  const routes = groupSwapRoutes(quoteResponse);

  const splits = routes.map((group) => group[0]?.amount ?? "0");

  let coinData: TransactionResult;
  if (coinIn) {
    coinData = tx.splitCoins(
      coinIn,
      splits.map((split) => tx.pure(split)),
    );
  } else {
    const { coinData: _data } = await getSplitCoinForTx(
      accountAddress,
      quoteResponse.swapAmountWithDecimal,
      splits,
      denormalizeTokenType(quoteResponse.tokenIn),
      tx,
      isGasEstimate,
    );
    coinData = _data;
  }

  const coinObjects: TransactionObjectArgument[] = [];
  await Promise.all(
    routes.map(async (route, index) => {
      const inputCoinObject = coinData[index];
      const coinRes = await swapWithRoute({
        route,
        inputCoinObject,
        currentAccount: accountAddress,
        tx,
      });
      if (coinRes) {
        coinObjects.push(coinRes);
      }
    }),
  );
  if (coinObjects.length > 0) {
    const mergeCoin: any =
      coinObjects.length > 1
        ? SuiUtils.mergeCoins(coinObjects, tx)
        : coinObjects[0];
    const minReceived = new BigNumber(1)
      .minus(slippage)
      .multipliedBy(quoteResponse.returnAmountWithDecimal)
      .toFixed(0);

    const commission = getCommission(tx, _commission);

    tx.moveCall({
      target: `${_7K_PACKAGE_ID}::settle::settle`,
      typeArguments: [quoteResponse.tokenIn, quoteResponse.tokenOut],
      arguments: [
        tx.object(_7K_CONFIG),
        tx.pure.u64(quoteResponse.swapAmountWithDecimal),
        mergeCoin,
        tx.pure.u64(minReceived),
        tx.pure.u64(quoteResponse.returnAmountWithDecimal),
        commission,
      ],
    });
    tx.transferObjects([mergeCoin], tx.pure.address(accountAddress));
  }

  return tx;
};

const getCommission = (
  tx: TransactionBlock,
  commission?: { partner: string; commissionBps: number },
) => {
  if (commission) {
    const [commissionInner] = tx.moveCall({
      target: `${_7K_PACKAGE_ID}::commission::new`,
      typeArguments: [],
      arguments: [
        tx.pure.address(commission.partner),
        tx.pure.u64(commission.commissionBps),
      ],
    });
    const [result] = tx.moveCall({
      target: "0x1::option::some",
      typeArguments: [`${_7K_PACKAGE_ID}::commission::Commission`],
      arguments: [commissionInner],
    });
    return result;
  }
  return tx.moveCall({
    target: "0x1::option::none",
    typeArguments: [`${_7K_PACKAGE_ID}::commission::Commission`],
    arguments: [],
  })[0];
};
