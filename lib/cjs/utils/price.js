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
exports.getTokenPrice = getTokenPrice;
const tokens_1 = require("../constants/tokens");
const PRICES_API = "https://prices.7k.ag";
function getTokenPrice(id_1) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function* (id, vsCoin = tokens_1.USDC_TOKEN_TYPE) {
      var _a;
      try {
        const response = yield fetch(
          `${PRICES_API}/price?ids=${id}&vsCoin=${vsCoin}`,
        );
        const prices = yield response.json();
        return (
          ((_a = prices === null || prices === void 0 ? void 0 : prices[id]) ===
            null || _a === void 0
            ? void 0
            : _a.price) || 0
        );
      } catch (error) {
        return 0;
      }
    },
  );
}
