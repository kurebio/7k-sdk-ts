export * from "./types/aggregator";
import { getSuiClient, setSuiClient } from "./suiClient";
import { getQuote } from "./getQuote";
import { getSuiPrice } from "./getSuiPrice";
import { estimateGasFee } from "./estimateGasFee";
import { buildTx } from "./buildTx";
export {
  getSuiClient,
  setSuiClient,
  getQuote,
  getSuiPrice,
  estimateGasFee,
  buildTx,
};
declare const _default: {
  getSuiClient: typeof getSuiClient;
  setSuiClient: typeof setSuiClient;
  getQuote: typeof getQuote;
  getSuiPrice: typeof getSuiPrice;
  estimateGasFee: typeof estimateGasFee;
  buildTx: ({
    quoteResponse,
    accountAddress,
    slippage,
    commission: _commission,
    devInspect,
    extendTx,
  }: import("./types/tx").BuildTxParams) => Promise<{
    tx: import("@mysten/sui/dist/cjs/transactions").Transaction;
    coinOut:
      | import("@mysten/sui/dist/cjs/transactions").TransactionObjectArgument
      | undefined;
  }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
