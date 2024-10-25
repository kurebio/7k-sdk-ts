import { TransactionArgument, Transaction } from "@mysten/sui/transactions";
import { CoinStruct, SuiObjectResponseQuery } from "@mysten/sui/client";
type DataPage<T> = {
  data: T[];
  nextCursor?: any;
  hasNextPage: boolean;
};
type PageQuery = {
  cursor?: any;
  limit?: number | null;
};
type PaginationArgs = "all" | PageQuery;
export declare const SuiUtils: {
  getSuiCoin(
    amount: bigint | TransactionArgument,
    txb: Transaction,
  ): TransactionArgument;
  mergeCoins(
    coinObjects: Array<string | TransactionArgument>,
    txb: Transaction,
  ): TransactionArgument | undefined;
  getCoinValue(
    coinType: string,
    coinObject: string | TransactionArgument,
    txb: Transaction,
  ): TransactionArgument;
  getExactCoinByAmount(
    coinType: string,
    coins: {
      objectId: string;
      balance: bigint;
    }[],
    amount: bigint,
    txb: Transaction,
  ): {
    $kind: "NestedResult";
    NestedResult: [number, number];
  };
  mergeAllUserCoins(
    coinType: string,
    signerAddress: string,
  ): Promise<Transaction | undefined>;
  mergeAllCoinsWithoutFetch(
    coins: CoinStruct[],
    coinType: string,
    txb: Transaction,
  ): void;
  getAllUserCoins({
    address,
    type,
  }: {
    type: string;
    address: string;
  }): Promise<CoinStruct[]>;
  getCoinsGreaterThanAmount(
    amount: bigint,
    coins: {
      objectId: string;
      balance: bigint;
    }[],
  ): string[];
  getOwnedObjectsByPage(
    owner: string,
    query: SuiObjectResponseQuery,
    paginationArgs?: PaginationArgs,
  ): Promise<DataPage<any>>;
  isValidStructTag(value: string): boolean;
};
export {};
//# sourceMappingURL=sui.d.ts.map
