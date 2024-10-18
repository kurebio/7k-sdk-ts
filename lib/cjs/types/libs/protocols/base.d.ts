import { Transaction } from "@mysten/sui/transactions";
import { TxSorSwap } from "../../types/aggregator";
import { TransactionResultItem } from "../../types/sui";
export interface BaseContractParams {
  swapInfo: TxSorSwap;
  inputCoinObject: TransactionResultItem;
  currentAccount: string;
}
export declare abstract class BaseContract {
  protected swapInfo: TxSorSwap;
  protected inputCoinObject: TransactionResultItem;
  protected currentAccount: string;
  constructor({
    swapInfo,
    inputCoinObject,
    currentAccount,
  }: BaseContractParams);
  abstract swap(tx: Transaction): Promise<TransactionResultItem>;
  protected getInputCoinValue(
    tx: Transaction,
  ): import("@mysten/sui/transactions").TransactionArgument;
  protected getTypeParams(): string[];
}
//# sourceMappingURL=base.d.ts.map
