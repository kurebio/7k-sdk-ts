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
exports.SpringSuiContract = void 0;
const utils_1 = require("@mysten/sui/utils");
const base_1 = require("../base");
const PACKAGE_ID =
  "0x82e6f4f75441eae97d2d5850f41a09d28c7b64a05b067d37748d471f43aaf3f7";
class SpringSuiContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      // coinX is always SUI
      const coinY = this.swapInfo.pool.allTokens[1];
      const isStake = this.swapInfo.swapXtoY;
      const [coinOut] = tx.moveCall({
        target: `${PACKAGE_ID}::liquid_staking::${isStake ? "mint" : "redeem"}`,
        typeArguments: [coinY.address],
        arguments: [
          tx.object(this.swapInfo.poolId),
          isStake
            ? tx.object(utils_1.SUI_SYSTEM_STATE_OBJECT_ID)
            : this.inputCoinObject,
          isStake
            ? this.inputCoinObject
            : tx.object(utils_1.SUI_SYSTEM_STATE_OBJECT_ID),
        ],
      });
      return coinOut;
    });
  }
}
exports.SpringSuiContract = SpringSuiContract;