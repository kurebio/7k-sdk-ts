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
exports.FlowXContract = void 0;
const base_1 = require("../base");
const PACKAGE_ID =
  "0xba153169476e8c3114962261d1edc70de5ad9781b83cc617ecc8c1923191cae0";
const MODULE_NAME = "router";
const CONTAINER_OBJECT_ID =
  "0xb65dcbf63fd3ad5d0ebfbf334780dc9f785eff38a4459e37ab08fa79576ee511";
class FlowXContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const coinInType = this.swapInfo.assetIn;
      const coinOutType = this.swapInfo.assetOut;
      const [tokenOut] = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::swap_exact_input_direct`,
        typeArguments: [coinInType, coinOutType],
        arguments: [tx.object(CONTAINER_OBJECT_ID), this.inputCoinObject],
      });
      return tokenOut;
    });
  }
}
exports.FlowXContract = FlowXContract;
