import { normalizeStructTag, parseStructTag } from "@mysten/sui/utils";
import { SuiUtils } from "../../utils/sui";
export class BaseContract {
  swapInfo;
  inputCoinObject;
  currentAccount;
  constructor({ swapInfo, inputCoinObject, currentAccount }) {
    this.swapInfo = swapInfo;
    this.inputCoinObject = inputCoinObject;
    this.currentAccount = currentAccount;
  }
  getInputCoinValue(tx) {
    return SuiUtils.getCoinValue(
      this.swapInfo.assetIn,
      this.inputCoinObject,
      tx,
    );
  }
  getTypeParams() {
    return parseStructTag(
      this.swapInfo.extra?.poolStructTag || "",
    ).typeParams.map(normalizeStructTag);
  }
}
