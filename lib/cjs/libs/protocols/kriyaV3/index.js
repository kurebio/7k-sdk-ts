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
exports.KriyaV3Contract = void 0;
const base_1 = require("../base");
const utils_1 = require("@mysten/sui/utils");
const token_1 = require("../../../utils/token");
const PACKAGE_ID =
  "0xbd8d4489782042c6fafad4de4bc6a5e0b84a43c6c00647ffd7062d1e2bb7549e";
const VERSION_ID =
  "0xf5145a7ac345ca8736cf8c76047d00d6d378f30e81be6f6eb557184d9de93c78";
class KriyaV3Contract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const swapXtoY = this.swapInfo.swapXtoY;
      const coinInType = (0, token_1.normalizeTokenType)(this.swapInfo.assetIn);
      const coinOutType = (0, token_1.normalizeTokenType)(
        this.swapInfo.assetOut,
      );
      const poolId = this.swapInfo.poolId;
      const LowLimitPrice = 4295048017;
      const limitPrice = BigInt("79226673515401279992447579050");
      const [receive_a, receive_b, flash_receipt] = tx.moveCall({
        target: `${PACKAGE_ID}::trade::flash_swap`,
        typeArguments: this.getTypeParams(),
        arguments: [
          tx.object(poolId),
          tx.pure.bool(swapXtoY),
          tx.pure.bool(true),
          this.getInputCoinValue(tx),
          tx.pure.u128(swapXtoY ? LowLimitPrice : limitPrice),
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
          tx.object(VERSION_ID),
        ],
      });
      tx.moveCall({
        target: `0x2::balance::destroy_zero`,
        arguments: [swapXtoY ? receive_a : receive_b],
        typeArguments: [coinInType],
      });
      const [zeroOutCoin] = tx.moveCall({
        target: `0x2::balance::zero`,
        arguments: [],
        typeArguments: [coinOutType],
      });
      const inputCoinBalance = tx.moveCall({
        target: `0x2::coin::into_balance`,
        typeArguments: [coinInType],
        arguments: [this.inputCoinObject],
      });
      const pay_coin_a = swapXtoY ? inputCoinBalance : zeroOutCoin;
      const pay_coin_b = swapXtoY ? zeroOutCoin : inputCoinBalance;
      tx.moveCall({
        target: `${PACKAGE_ID}::trade::repay_flash_swap`,
        typeArguments: this.getTypeParams(),
        arguments: [
          tx.object(poolId),
          flash_receipt,
          pay_coin_a,
          pay_coin_b,
          tx.object(VERSION_ID),
        ],
      });
      const [tokenOut] = tx.moveCall({
        target: `0x2::coin::from_balance`,
        typeArguments: [coinOutType],
        arguments: [swapXtoY ? receive_b : receive_a],
      });
      return tokenOut;
    });
  }
}
exports.KriyaV3Contract = KriyaV3Contract;