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
exports.normalizeTokenType = normalizeTokenType;
exports.denormalizeTokenType = denormalizeTokenType;
exports.checkIsSui = checkIsSui;
exports.getSuiscanTokenMetadata = getSuiscanTokenMetadata;
const explorer_1 = require("../constants/explorer");
const tokens_1 = require("../constants/tokens");
function normalizeTokenType(type) {
  return type === tokens_1.SUI_TYPE ? tokens_1.SUI_FULL_TYPE : type;
}
function denormalizeTokenType(type) {
  return type === tokens_1.SUI_FULL_TYPE ? tokens_1.SUI_TYPE : type;
}
function checkIsSui(type) {
  return type === tokens_1.SUI_FULL_TYPE || type === tokens_1.SUI_TYPE;
}
function getSuiscanTokenMetadata(type) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(
      `${explorer_1.EXPLORER.ADDRESS}/api/sui-backend/mainnet/api/coins/${denormalizeTokenType(type)}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token metadata");
    }
    const data = yield response.json();
    return Object.assign(Object.assign({}, data), {
      type: normalizeTokenType(data.type || ""),
    });
  });
}