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
exports.getSplitCoinForTx = void 0;
const transactions_1 = require("@mysten/sui/transactions");
const getCoinOjectIdsByAmount_1 = require("./getCoinOjectIdsByAmount");
const tokens_1 = require("../constants/tokens");
const getSplitCoinForTx = (
  account,
  amount,
  splits,
  coinType,
  inheritTx,
  inspecTransaction,
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const tx =
      inheritTx !== null && inheritTx !== void 0
        ? inheritTx
        : new transactions_1.Transaction();
    const { objectIds } = yield (0,
    getCoinOjectIdsByAmount_1.getCoinOjectIdsByAmount)(
      account,
      amount,
      coinType,
    );
    const coinObjectId = objectIds[0];
    if (coinType === tokens_1.SUI_TYPE) {
      let coin;
      if (inspecTransaction) {
        if (objectIds.length > 1) {
          tx.mergeCoins(
            tx.object(coinObjectId),
            objectIds.slice(1).map((item) => tx.object(item)),
          );
        }
        coin = tx.splitCoins(tx.object(coinObjectId), splits);
      } else {
        coin = tx.splitCoins(tx.gas, splits);
      }
      return { tx, coinData: coin };
    }
    if (objectIds.length > 1) {
      tx.mergeCoins(
        tx.object(coinObjectId),
        objectIds.slice(1).map((item) => tx.object(item)),
      );
    }
    // split correct amount to swap
    const coinData = tx.splitCoins(tx.object(coinObjectId), splits);
    return { tx, coinData };
  });
exports.getSplitCoinForTx = getSplitCoinForTx;