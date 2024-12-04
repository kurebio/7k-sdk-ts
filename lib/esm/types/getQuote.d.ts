import { QuoteResponse, SourceDex } from "./types/aggregator";
interface Params {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  sources?: SourceDex[];
}
export declare const DEFAULT_SOURCES: SourceDex[];
export declare function getQuote({
  tokenIn,
  tokenOut,
  amountIn,
  sources,
}: Params): Promise<QuoteResponse>;
export {};
//# sourceMappingURL=getQuote.d.ts.map
