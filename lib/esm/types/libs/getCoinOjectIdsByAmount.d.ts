import { CoinStruct } from "@mysten/sui/client";
export declare const getCoinOjectIdsByAmount: (
  address: string,
  amount: string,
  coinType: string,
) => Promise<{
  objectIds: string[];
  objectCoins: CoinStruct[];
  balance: string;
}>;
//# sourceMappingURL=getCoinOjectIdsByAmount.d.ts.map