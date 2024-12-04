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
exports.ObricContract = void 0;
const utils_1 = require("@mysten/sui/utils");
const base_1 = require("../base");
const PACKAGE_ID =
  "0xb84e63d22ea4822a0a333c250e790f69bf5c2ef0c63f4e120e05a6415991368f";
const PYTH_STATE =
  "0x1f9310238ee9298fb703c3419030b35b22bb1cc37113e3bb5007c99aec79e5b8";
class ObricContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const [coinX, coinY] = this.swapInfo.pool.allTokens;
      const xToY = this.swapInfo.swapXtoY;
      const { x_price_id, y_price_id } = this.swapInfo.extra || {};
      if (!x_price_id || !y_price_id) {
        throw new Error("x_price_id and y_price_id are required");
      }
      const [coinOut] = tx.moveCall({
        target: `${PACKAGE_ID}::v2::${xToY ? "swap_x_to_y" : "swap_y_to_x"}`,
        typeArguments: [coinX.address, coinY.address],
        arguments: [
          tx.object(this.swapInfo.poolId),
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
          tx.object(PYTH_STATE),
          tx.object(x_price_id), // pyth pricefeed for x
          tx.object(y_price_id), // pyth pricefeed for y
          this.inputCoinObject,
        ],
      });
      return coinOut;
    });
  }
}
exports.ObricContract = ObricContract;
