import {
  Transaction,
  type TransactionObjectArgument,
} from "@mysten/sui/transactions";
import type { BuildTxParams } from "./types/tx";
export declare const buildTx: ({
  quoteResponse,
  accountAddress,
  slippage,
  commission: _commission,
  devInspect,
  extendTx,
}: BuildTxParams) => Promise<{
  tx: Transaction;
  coinOut: TransactionObjectArgument | undefined;
}>;
//# sourceMappingURL=buildTx.d.ts.map
