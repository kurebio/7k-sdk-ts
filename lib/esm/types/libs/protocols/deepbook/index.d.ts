import { Transaction } from "@mysten/sui/transactions";
import { BaseContract } from "../base";
export declare class DeepBookContract extends BaseContract {
  swap(tx: Transaction): Promise<{
    $kind: "NestedResult";
    NestedResult: [number, number];
  }>;
  private createAccountCap;
  private deleteAccountCap;
}
//# sourceMappingURL=index.d.ts.map