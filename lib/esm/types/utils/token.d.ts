import { SuiscanToken } from "../types/token";
export declare function normalizeTokenType(type: string): string;
export declare function denormalizeTokenType(type: string): string;
export declare function checkIsSui(
  type: string,
): type is
  | "0x2::sui::SUI"
  | "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI";
export declare function getSuiscanTokenMetadata(
  type: string,
): Promise<SuiscanToken>;
//# sourceMappingURL=token.d.ts.map