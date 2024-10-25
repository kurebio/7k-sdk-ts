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
exports.DeepBookContract = void 0;
const utils_1 = require("@mysten/sui/utils");
const base_1 = require("../base");
const _7k_1 = require("../../../constants/_7k");
const PACKAGE_ID = "0xdee9";
const MODULE_NAME = "clob_v2";
class DeepBookContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const swapXtoY = this.swapInfo.swapXtoY;
      const poolId = this.swapInfo.poolId;
      const clientOrderId = Date.now();
      const currentAddress = this.currentAccount;
      const typeArgs = this.getTypeParams();
      const lotSize =
        (_a = this.swapInfo.extra) === null || _a === void 0
          ? void 0
          : _a.lotSize;
      const [baseAsset, quoteAsset] = typeArgs;
      const accountCap = this.createAccountCap(tx);
      const amountIn = this.getInputCoinValue(tx);
      let result;
      if (swapXtoY) {
        const amountInRound = tx.moveCall({
          target: `${_7k_1._7K_PACKAGE_ID}::math::m_round_down`,
          arguments: [
            amountIn, // input coin value
            tx.pure.u64(lotSize), // lot size
          ],
        });
        const [base_coin_ret, quote_coin_ret] = tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::swap_exact_base_for_quote`,
          typeArguments: [baseAsset, quoteAsset],
          arguments: [
            tx.object(poolId),
            tx.pure.u64(clientOrderId),
            accountCap,
            amountInRound,
            this.inputCoinObject, // coin 0 ~ base
            tx.moveCall({
              typeArguments: [quoteAsset],
              target: `0x2::coin::zero`,
              arguments: [],
            }), // coin 1 ~ quote
            tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
          ],
        });
        this.deleteAccountCap(tx, accountCap);
        tx.transferObjects([base_coin_ret], currentAddress);
        result = quote_coin_ret;
      } else {
        const [base_coin_ret, quote_coin_ret] = tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::swap_exact_quote_for_base`,
          typeArguments: [baseAsset, quoteAsset],
          arguments: [
            tx.object(poolId),
            tx.pure.u64(clientOrderId),
            accountCap,
            amountIn,
            tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
            this.inputCoinObject, // coin 1 ~ quote
          ],
        });
        this.deleteAccountCap(tx, accountCap);
        tx.transferObjects([quote_coin_ret], currentAddress);
        result = base_coin_ret;
      }
      return result;
    });
  }
  createAccountCap(tx) {
    const [cap] = tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_account`,
      arguments: [],
    });
    return cap;
  }
  deleteAccountCap(tx, accountCap) {
    tx.moveCall({
      target: `${PACKAGE_ID}::custodian_v2::delete_account_cap`,
      arguments: [accountCap],
    });
  }
}
exports.DeepBookContract = DeepBookContract;