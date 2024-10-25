"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultSqrtPriceLimit = getDefaultSqrtPriceLimit;
const bn_js_1 = __importDefault(require("bn.js"));
const constants_1 = require("./constants");
function getDefaultSqrtPriceLimit(a2b) {
  return new bn_js_1.default(
    a2b ? constants_1.MIN_SQRT_PRICE : constants_1.MAX_SQRT_PRICE,
  );
}