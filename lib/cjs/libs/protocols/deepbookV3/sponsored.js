"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsoredDeepBookV3Contract = void 0;
const base_1 = require("../base");
const utils_1 = require("@mysten/sui/utils");
const PACKAGE_ID =
  "0x951a01360d85b06722edf896852bf8005b81cdb26375235c935138987f629502";
const FUND_ID =
  "0xf245e7a4b83ed9a26622f5818a158c2ba7a03b91e62717b557a7df1d4dab38df";
class SponsoredDeepBookV3Contract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const [coinX] = this.swapInfo.pool.allTokens;
      const swapXtoY = coinX.address === this.swapInfo.assetIn;
      const [base, quote] = tx.moveCall({
        target: `${PACKAGE_ID}::sponsored::${swapXtoY ? "swap_exact_base_for_quote" : "swap_exact_quote_for_base"}`,
        typeArguments: this.getTypeParams(),
        arguments: [
          tx.object(FUND_ID),
          tx.object(this.swapInfo.poolId),
          this.inputCoinObject,
          tx.pure.u64(0),
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
        ],
      });
      const coinIn = swapXtoY ? base : quote;
      const coinOut = swapXtoY ? quote : base;
      tx.transferObjects([coinIn], this.currentAccount);
      return coinOut;
    });
  }
}
exports.SponsoredDeepBookV3Contract = SponsoredDeepBookV3Contract;
