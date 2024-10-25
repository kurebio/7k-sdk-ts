import { EstimateGasFeeParams } from "./types/tx";
export declare function estimateGasFee({
  quoteResponse,
  accountAddress,
  slippage,
  suiPrice: _suiPrice,
  extendTx,
  commission,
}: EstimateGasFeeParams): Promise<number>;
//# sourceMappingURL=estimateGasFee.d.ts.map