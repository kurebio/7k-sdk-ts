import {
  Transaction,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { Commission, QuoteResponse } from "./aggregator";
import BigNumber from "bignumber.js";

export interface CommonParams {
  quoteResponse: QuoteResponse;
  accountAddress: string;
  slippage: BigNumber.Value;
  commission: Commission;
  extendTx?: {
    tx: Transaction;
    coinIn?: TransactionObjectArgument;
    useCoinInDirectly?: boolean;
    // It's dangerous to set this to true
    forceMinOutToZero?: boolean;
  };
}

export interface BuildTxParams extends CommonParams {
  devInspect?: boolean;
}

export interface EstimateGasFeeParams extends CommonParams {
  suiPrice?: number;
}
