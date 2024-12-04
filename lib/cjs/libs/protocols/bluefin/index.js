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
exports.BluefinContract = void 0;
const base_1 = require("../base");
const utils_1 = require("@mysten/sui/utils");
const utils_2 = require("../utils");
const bn_js_1 = __importDefault(require("bn.js"));
const sui_1 = require("../../../utils/sui");
const PACKAGE_ID =
  "0xa31282fc0a0ad50cf5f20908cfbb1539a143f5a38912eb8823a8dd6cbf98bc44";
const CONFIG_ID =
  "0x03db251ba509a8d5d8777b6338836082335d93eecbdd09a11e190a1cff51c352";
class BluefinContract extends base_1.BaseContract {
  swap(tx) {
    return __awaiter(this, void 0, void 0, function* () {
      const [coinX, coinY] = this.swapInfo.pool.allTokens;
      const swapXtoY = this.swapInfo.swapXtoY;
      const amountIn = this.getInputCoinValue(tx);
      const coinInBalance = sui_1.SuiUtils.coinIntoBalance(
        tx,
        this.swapInfo.assetIn,
        this.inputCoinObject,
      );
      const coinOutBalance = sui_1.SuiUtils.zeroBalance(
        tx,
        this.swapInfo.assetOut,
      );
      const [balanceOutX, balanceOutY] = tx.moveCall({
        target: `${PACKAGE_ID}::pool::swap`,
        typeArguments: [coinX.address, coinY.address],
        arguments: [
          tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
          tx.object(CONFIG_ID),
          tx.object(this.swapInfo.poolId),
          swapXtoY ? coinInBalance : coinOutBalance,
          swapXtoY ? coinOutBalance : coinInBalance,
          tx.pure.bool(swapXtoY),
          tx.pure.bool(true),
          amountIn,
          tx.pure.u64(0),
          tx.pure.u128(
            (0, utils_2.getDefaultSqrtPriceLimit)(swapXtoY)
              .add(swapXtoY ? new bn_js_1.default(1) : new bn_js_1.default(-1))
              .toString(10),
          ),
        ],
      });
      const coinOutX = sui_1.SuiUtils.coinFromBalance(
        tx,
        coinX.address,
        balanceOutX,
      );
      const coinOutY = sui_1.SuiUtils.coinFromBalance(
        tx,
        coinY.address,
        balanceOutY,
      );
      sui_1.SuiUtils.transferOrDestroyZeroCoin(
        tx,
        this.swapInfo.assetIn,
        swapXtoY ? coinOutX : coinOutY,
        this.currentAccount,
      );
      return swapXtoY ? coinOutY : coinOutX;
    });
  }
}
exports.BluefinContract = BluefinContract;