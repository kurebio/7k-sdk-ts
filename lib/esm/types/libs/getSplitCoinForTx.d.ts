import { Transaction, TransactionResult } from "@mysten/sui/transactions";
export declare const getSplitCoinForTx: (
  account: string,
  amount: string,
  splits: string[],
  coinType: string,
  inheritTx?: Transaction,
  inspecTransaction?: boolean,
) => Promise<{
  tx: Transaction;
  coinData: TransactionResult;
}>;
//# sourceMappingURL=getSplitCoinForTx.d.ts.map
