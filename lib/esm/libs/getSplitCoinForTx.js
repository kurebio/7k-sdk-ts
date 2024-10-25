import { Transaction } from "@mysten/sui/transactions";
import { getCoinOjectIdsByAmount } from "./getCoinOjectIdsByAmount";
import { SUI_TYPE } from "../constants/tokens";
export const getSplitCoinForTx = async (
  account,
  amount,
  splits,
  coinType,
  inheritTx,
  inspecTransaction,
) => {
  const tx = inheritTx ?? new Transaction();
  const { objectIds } = await getCoinOjectIdsByAmount(
    account,
    amount,
    coinType,
  );
  const coinObjectId = objectIds[0];
  if (coinType === SUI_TYPE) {
    let coin;
    if (inspecTransaction) {
      if (objectIds.length > 1) {
        tx.mergeCoins(
          tx.object(coinObjectId),
          objectIds.slice(1).map((item) => tx.object(item)),
        );
      }
      coin = tx.splitCoins(tx.object(coinObjectId), splits);
    } else {
      coin = tx.splitCoins(tx.gas, splits);
    }
    return { tx, coinData: coin };
  }
  if (objectIds.length > 1) {
    tx.mergeCoins(
      tx.object(coinObjectId),
      objectIds.slice(1).map((item) => tx.object(item)),
    );
  }
  // split correct amount to swap
  const coinData = tx.splitCoins(tx.object(coinObjectId), splits);
  return { tx, coinData };
};