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
exports.SuiswapContract = void 0;
const utils_1 = require("@mysten/sui/utils");
const base_1 = require("../base");
const PACKAGE_ID =
  "0xd075d51486df71e750872b4edf82ea3409fda397ceecc0b6aedf573d923c54a0";
const MODULE_NAME = "pool";
class SuiswapContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const poolId = this.swapInfo.poolId;
      const swapXtoY = this.swapInfo.swapXtoY;
      const inputCoin = this.inputCoinObject;
      const typeArguments = [
        this.swapInfo.coinX.type,
        this.swapInfo.coinY.type,
      ];
      const callFunc = swapXtoY
        ? "do_swap_x_to_y_direct"
        : "do_swap_y_to_x_direct";
      const inputAmount = this.getInputCoinValue(tx);
      const [tokenIn, tokenOut] = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${callFunc}`,
        typeArguments,
        arguments: [
          tx.object(poolId),
          tx.makeMoveVec({
            elements: [inputCoin],
          }),
          inputAmount,
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
        ],
      });
      tx.transferObjects([tokenIn], this.currentAccount);
      return tokenOut;
    });
  }
}
exports.SuiswapContract = SuiswapContract;