import { Transaction } from "@mysten/sui/transactions";
import { BaseContract } from "../base";
export declare class FlowXContract extends BaseContract {
  swap(tx: Transaction): Promise<{
    $kind: "NestedResult";
    NestedResult: [number, number];
  }>;
}
//# sourceMappingURL=index.d.ts.map