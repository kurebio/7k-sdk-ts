"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContract = void 0;
const utils_1 = require("@mysten/sui/utils");
const sui_1 = require("../../utils/sui");
class BaseContract {
  constructor({ swapInfo, inputCoinObject, currentAccount }) {
    this.swapInfo = swapInfo;
    this.inputCoinObject = inputCoinObject;
    this.currentAccount = currentAccount;
  }
  getInputCoinValue(tx) {
    return sui_1.SuiUtils.getCoinValue(
      this.swapInfo.assetIn,
      this.inputCoinObject,
      tx,
    );
  }
  getTypeParams() {
    var _a;
    return (0, utils_1.parseStructTag)(
      ((_a = this.swapInfo.extra) === null || _a === void 0
        ? void 0
        : _a.poolStructTag) || "",
    ).typeParams.map(utils_1.normalizeStructTag);
  }
}
exports.BaseContract = BaseContract;