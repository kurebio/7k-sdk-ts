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
exports.swapWithRoute = swapWithRoute;
const protocols_1 = require("./protocols");
function swapWithRoute(_a) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function* ({ route, inputCoinObject, currentAccount, tx }) {
      let inputTokenObject = inputCoinObject;
      let txbResultToReturn;
      for (const swap of route) {
        const ContractClass = protocols_1.ProtocolContract[swap.pool.type];
        const contractInstance = new ContractClass({
          swapInfo: swap,
          inputCoinObject: inputTokenObject,
          currentAccount,
        });
        const tokenOut = yield contractInstance.swap(tx);
        inputTokenObject = tokenOut;
        txbResultToReturn = tokenOut;
      }
      return txbResultToReturn;
    },
  );
}