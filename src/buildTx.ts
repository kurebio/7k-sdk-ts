import {
  Transaction,
  type TransactionObjectArgument,
  type TransactionResult,
} from "@mysten/sui/transactions";
import BigNumber from "bignumber.js";
import { getSplitCoinForTx } from "./libs/getSplitCoinForTx";
import { groupSwapRoutes } from "./libs/groupSwapRoutes";
import { swapWithRoute } from "./libs/swapWithRoute";
import { denormalizeTokenType } from "./utils/token";
import { SuiUtils } from "./utils/sui";
import type { BuildTxParams } from "./types/tx";
import { _7K_CONFIG, _7K_PACKAGE_ID, _7K_VAULT } from "./constants/_7k";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { MATH_PACKAGE_ID } from "./constants/math";

export const buildTx = async ({
  quoteResponse,
  accountAddress,
  slippage,
  commission: _commission,
  devInspect,
  extendTx,
}: BuildTxParams) => {
  const {
    tx: _tx,
    coinIn,
    useCoinInDirectly,
    forceMinOutToZero,
  } = extendTx || {};
  let coinOut: TransactionObjectArgument | undefined;

  if (!accountAddress) {
    throw new Error("Sender address is required");
  }

  if (!quoteResponse.routes) {
    throw new Error("Invalid quote response: 'routes' are required");
  }

  if (!isValidSuiAddress(_commission.partner)) {
    throw new Error("Invalid commission partner address");
  }

  const tx = _tx || new Transaction();

  const routes = groupSwapRoutes(quoteResponse);

  const splits = routes.map((group) => group[0]?.amount ?? "0");

  let coinData: TransactionResult;
  let coinInAmount: TransactionResult | undefined;
  if (coinIn) {
    if (useCoinInDirectly) {
      const sumSplits = splits.reduce(
        (prev, curr) => prev.plus(BigNumber(curr)),
        new BigNumber(0),
      );
      const splitPercentages = splits.map((split) =>
        new BigNumber(split).div(sumSplits),
      );
      const precision = BigNumber(1000000);
      const amount = tx.moveCall({
        target: "0x2::coin::value",
        arguments: [coinIn],
        typeArguments: [denormalizeTokenType(quoteResponse.tokenIn)],
      });
      coinInAmount = amount;
      coinData = tx.splitCoins(
        coinIn,
        splitPercentages.map((p) =>
          tx.moveCall({
            target: `${MATH_PACKAGE_ID}::math::mul_factor`,
            arguments: [
              amount,
              tx.pure.u64(
                p
                  .multipliedBy(precision)
                  // reduce for safety
                  .multipliedBy(0.999)
                  .toFixed(0),
              ),
              tx.pure.u64(precision.toFixed(0)),
            ],
          }),
        ),
      );
    } else {
      coinData = tx.splitCoins(coinIn, splits);
      SuiUtils.transferOrDestroyZeroCoin(
        tx,
        quoteResponse.tokenIn,
        coinIn,
        accountAddress,
      );
    }
  } else {
    const { coinData: _data } = await getSplitCoinForTx(
      accountAddress,
      quoteResponse.swapAmountWithDecimal,
      splits,
      denormalizeTokenType(quoteResponse.tokenIn),
      tx,
      devInspect,
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
    coinOut = mergeCoin;

    let minReceived: TransactionResult;
    {
      const slippagePrecision = BigNumber(1000000);
      const slippageDecimal = slippagePrecision.multipliedBy(slippage);
      minReceived = tx.moveCall({
        target: `${MATH_PACKAGE_ID}::math::mul_factor`,
        arguments: [
          coinInAmount as any,
          tx.pure.u64(slippageDecimal.toFixed(0)),
          tx.pure.u64(slippagePrecision.toFixed(0)),
        ],
      });
    }

    const [partner] = tx.moveCall({
      target: "0x1::option::some",
      typeArguments: [`address`],
      arguments: [tx.pure.address(_commission.partner)],
    });

    tx.moveCall({
      target: `${_7K_PACKAGE_ID}::settle::settle`,
      typeArguments: [quoteResponse.tokenIn, quoteResponse.tokenOut],
      arguments: [
        tx.object(_7K_CONFIG),
        tx.object(_7K_VAULT),
        coinInAmount ?? tx.pure.u64(quoteResponse.swapAmountWithDecimal),
        mergeCoin,
        !forceMinOutToZero ? minReceived : tx.pure.u64(0),
        !forceMinOutToZero
          ? tx.pure.u64(quoteResponse.returnAmountWithDecimal)
          : tx.pure.u64(0),
        partner,
        tx.pure.u64(_commission.commissionBps),
      ],
    });

    if (!extendTx) {
      tx.transferObjects([mergeCoin], tx.pure.address(accountAddress));
    }
  }

  return { tx, coinOut };
};
