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
exports.CetusContract = void 0;
const base_1 = require("../base");
const utils_1 = require("@mysten/sui/utils");
const utils_2 = require("../utils");
const sui_1 = require("../../../utils/sui");
const GLOBAL_CONFIG_ID =
  "0xdaa46292632c3c4d8f31f23ea0f9b36a28ff3677e9684980e4438403a67a3d8f";
const INTEGRATE_PACKAGE_ID =
  "0x6f5e582ede61fe5395b50c4a449ec11479a54d7ff8e0158247adfda60d98970b";
class CetusContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const sqrtPriceLimit = (0, utils_2.getDefaultSqrtPriceLimit)(
        this.swapInfo.swapXtoY,
      );
      const typeArguments = [
        this.swapInfo.coinX.type,
        this.swapInfo.coinY.type,
      ];
      const [zeroOut] = tx.moveCall({
        target: "0x2::coin::zero",
        typeArguments: [
          this.swapInfo.swapXtoY
            ? this.swapInfo.coinY.type
            : this.swapInfo.coinX.type,
        ],
      });
      const amountIn = sui_1.SuiUtils.getCoinValue(
        this.swapInfo.swapXtoY
          ? this.swapInfo.coinX.type
          : this.swapInfo.coinY.type,
        this.inputCoinObject,
        tx,
      );
      const [receiveA, receiveB] = tx.moveCall({
        target: `${INTEGRATE_PACKAGE_ID}::router::swap`,
        typeArguments,
        arguments: [
          tx.object(GLOBAL_CONFIG_ID),
          tx.object(this.swapInfo.poolId),
          this.swapInfo.swapXtoY ? this.inputCoinObject : zeroOut, // coin A
          this.swapInfo.swapXtoY ? zeroOut : this.inputCoinObject, // coin B
          tx.pure.bool(this.swapInfo.swapXtoY), // a to b or b to a
          tx.pure.bool(true), // exact in or out
          amountIn, // swap amount
          tx.pure.u128(sqrtPriceLimit.toString()), // sqrt price limit
          tx.pure.bool(false),
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
        ],
      });
      sui_1.SuiUtils.transferOrDestroyZeroCoin(
        tx,
        this.swapInfo.assetIn,
        this.swapInfo.swapXtoY ? receiveA : receiveB,
        this.currentAccount,
      );
      return this.swapInfo.swapXtoY ? receiveB : receiveA;
    });
  }
}
exports.CetusContract = CetusContract;
