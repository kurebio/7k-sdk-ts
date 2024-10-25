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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoinOjectIdsByAmount = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const suiClient_1 = require("../suiClient");
const orderByKey = (array, key, sortBy) => {
  if (!(array === null || array === void 0 ? void 0 : array.length)) {
    return;
  }
  let swapped;
  const compareFunctionName =
    sortBy === "desc" ? "isLessThan" : "isGreaterThan";
  do {
    swapped = false;
    for (let i = 0; i < array.length - 1; i++) {
      if (
        new bignumber_js_1.default(array[i][key])[compareFunctionName](
          array[i + 1][key],
        )
      ) {
        const temp = array[i];
        array[i] = array[i + 1];
        array[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  return array;
};
const getCoinOjectIdsByAmount = (address, amount, coinType) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let coinBalances = [];
    let hasNextPage = true;
    let nextCursor = undefined;
    while (hasNextPage) {
      try {
        const coins = yield (0, suiClient_1.getSuiClient)().getCoins({
          owner: address,
          coinType,
          cursor: nextCursor,
        });
        coinBalances = [...coinBalances, ...coins.data];
        hasNextPage = coins.hasNextPage;
        nextCursor = coins.nextCursor;
      } catch (error) {
        console.error("Error fetching data:", error);
        hasNextPage = false;
      }
    }
    // sort coin balance before get object id
    const coinObj = orderByKey(
      coinBalances.map((item) => {
        return Object.assign(Object.assign({}, item), {
          balance: item.balance,
        });
      }),
      "balance",
      "desc",
    );
    let balance = "0";
    const objectIds = [];
    const objectCoins = [];
    for (const coin of coinObj !== null && coinObj !== void 0 ? coinObj : []) {
      balance = new bignumber_js_1.default(coin.balance)
        .plus(balance)
        .toFixed();
      objectIds.push(coin.coinObjectId);
      objectCoins.push(coin);
      if (new bignumber_js_1.default(balance).isGreaterThanOrEqualTo(amount)) {
        break;
      }
    }
    return { objectIds, balance, objectCoins };
  });
exports.getCoinOjectIdsByAmount = getCoinOjectIdsByAmount;