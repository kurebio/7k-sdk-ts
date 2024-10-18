import { Transaction } from "@mysten/sui/transactions";
import { TxSorSwap } from "../types/aggregator";
import { TransactionResultItem } from "../types/sui";
export declare function swapWithRoute({
  route,
  inputCoinObject,
  currentAccount,
  tx,
}: {
  route: TxSorSwap[];
  inputCoinObject: TransactionResultItem;
  currentAccount: string;
  tx: Transaction;
}): Promise<TransactionResultItem | undefined>;
//# sourceMappingURL=swapWithRoute.d.ts.map
