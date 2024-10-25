"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBalance = formatBalance;
exports.formatRawBalance = formatRawBalance;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
function formatBalance(balance, decimals) {
  return new bignumber_js_1.default(balance).dividedBy(
    new bignumber_js_1.default(10).pow(decimals),
  );
}
function formatRawBalance(balance, decimals) {
  const rawBalance = new bignumber_js_1.default(balance).multipliedBy(
    new bignumber_js_1.default(10).pow(decimals),
  );
  return new bignumber_js_1.default(rawBalance.toFixed(0));
}