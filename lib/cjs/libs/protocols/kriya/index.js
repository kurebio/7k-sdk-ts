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
exports.KriyaContract = void 0;
const base_1 = require("../base");
const token_1 = require("../../../utils/token");
const PACKAGE_ID =
  "0xa0eba10b173538c8fecca1dff298e488402cc9ff374f8a12ca7758eebe830b66";
const MODULE_NAME = "spot_dex";
class KriyaContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const swapXtoY = this.swapInfo.swapXtoY;
      const coinInType = (0, token_1.normalizeTokenType)(this.swapInfo.assetIn);
      const coinOutType = (0, token_1.normalizeTokenType)(
        this.swapInfo.assetOut,
      );
      const poolId = this.swapInfo.poolId;
      const inputCoinObject = this.inputCoinObject;
      const [tokenOut] = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${swapXtoY ? "swap_token_x" : "swap_token_y"}`,
        typeArguments: [
          swapXtoY ? coinInType : coinOutType,
          swapXtoY ? coinOutType : coinInType,
        ],
        arguments: [
          tx.object(poolId),
          inputCoinObject,
          this.getInputCoinValue(tx),
          tx.pure.u64(0),
        ],
      });
      return tokenOut;
    });
  }
}
exports.KriyaContract = KriyaContract;
