import { Transaction } from "@mysten/sui/transactions";
import BigNumber from "bignumber.js";
import { getSplitCoinForTx } from "./libs/getSplitCoinForTx";
import { groupSwapRoutes } from "./libs/groupSwapRoutes";
import { swapWithRoute } from "./libs/swapWithRoute";
import { denormalizeTokenType } from "./utils/token";
import { SuiUtils } from "./utils/sui";
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
}) => {
  const { tx: _tx, coinIn, useCoinInDirectly } = extendTx || {};
  let coinOut;
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
  let coinData;
  if (coinIn) {
    if (useCoinInDirectly) {
      coinData = coinIn;
    } else {
      coinData = tx.splitCoins(coinIn, splits);
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
  const coinObjects = [];
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
    const mergeCoin =
      coinObjects.length > 1
        ? SuiUtils.mergeCoins(coinObjects, tx)
        : coinObjects[0];
    coinOut = mergeCoin;
    let minReceived;
    {
      const slippagePrecision = BigNumber(1000000);
      const slippageDecimal = slippagePrecision.multipliedBy(slippage);
      minReceived = tx.moveCall({
        target: `${MATH_PACKAGE_ID}::math::mulfactor`,
        arguments: [
          tx.moveCall({
            target: `0x2::coin::value`,
            arguments: [coinData],
            typeArguments: [denormalizeTokenType(quoteResponse.tokenIn)],
          }),
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
        tx.pure.u64(quoteResponse.swapAmountWithDecimal),
        mergeCoin,
        minReceived,
        tx.pure.u64(quoteResponse.returnAmountWithDecimal),
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