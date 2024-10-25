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
exports.BluemoveContract = void 0;
const base_1 = require("../base");
const sui_1 = require("../../../utils/sui");
const PACKAGE_ID =
  "0x08cd33481587d4c4612865b164796d937df13747d8c763b8a178c87e3244498f";
const DEX_INFO_ID =
  "0x3f2d9f724f4a1ce5e71676448dc452be9a6243dac9c5b975a588c8c867066e92";
class BluemoveContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const [coinOut] = tx.moveCall({
        target: `${PACKAGE_ID}::router::swap_exact_input_`,
        typeArguments: [this.swapInfo.assetIn, this.swapInfo.assetOut],
        arguments: [
          sui_1.SuiUtils.getCoinValue(
            this.swapInfo.swapXtoY
              ? this.swapInfo.coinX.type
              : this.swapInfo.coinY.type,
            this.inputCoinObject,
            tx,
          ), // input amount
          this.inputCoinObject, // input coin
          tx.pure.u64(0), // min output amount
          tx.object(DEX_INFO_ID),
        ],
      });
      return coinOut;
    });
  }
}
exports.BluemoveContract = BluemoveContract;
