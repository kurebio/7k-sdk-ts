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
exports.getQuote = getQuote;
const token_1 = require("./utils/token");
const DEFAULT_SOURCES = [
  "suiswap",
  "turbos",
  "cetus",
  "bluemove",
  "kriya",
  "kriya_v3",
  "aftermath",
  "deepbook",
  "deepbook_v3",
  "flowx",
];
function getQuote(_a) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function* ({ tokenIn, tokenOut, amountIn, sources = DEFAULT_SOURCES }) {
      const response = yield fetch(
        `https://api.7k.ag/quote?amount=${amountIn}&from=${(0, token_1.normalizeTokenType)(tokenIn)}&to=${(0, token_1.normalizeTokenType)(tokenOut)}&sources=${sources}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch aggregator quote");
      }
      return response.json();
    },
  );
}
