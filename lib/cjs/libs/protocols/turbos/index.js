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
exports.TurbosContract = void 0;
const utils_1 = require("@mysten/sui/utils");
const base_1 = require("../base");
const utils_2 = require("../utils");
const constants_1 = require("./constants");
const PACKAGE_ID =
  "0x1a3c42ded7b75cdf4ebc7c7b7da9d1e1db49f16fcdca934fac003f35f39ecad9";
const MODULE_NAME = "swap_router";
const VERSION =
  "0xf1cf0e81048df168ebeb1b8030fad24b3e0b53ae827c25053fff0779c1445b6f";
class TurbosContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const a2b = this.swapInfo.swapXtoY;
      const { poolId, address } = {
        poolId: this.swapInfo.poolId,
        address: this.currentAccount,
      };
      const typeArguments = this.getTypeParams();
      const inputAmount = this.getInputCoinValue(tx);
      const [tokenOut, tokenIn] = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::swap_${a2b ? "a_b" : "b_a"}_with_return_`,
        typeArguments: typeArguments,
        arguments: [
          tx.object(poolId),
          tx.makeMoveVec({
            elements: [this.inputCoinObject],
          }),
          inputAmount,
          tx.pure.u64(0),
          tx.pure.u128(
            (0, utils_2.getDefaultSqrtPriceLimit)(
              this.swapInfo.swapXtoY,
            ).toString(),
          ),
          tx.pure.bool(true),
          tx.pure.address(this.currentAccount),
          tx.pure.u64(Date.now() + constants_1.ONE_MINUTE * 3),
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
          tx.object(VERSION),
        ],
      });
      tx.transferObjects([tokenIn], address);
      return tokenOut;
    });
  }
}
exports.TurbosContract = TurbosContract;
