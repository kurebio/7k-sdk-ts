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
exports.estimateGasFee = estimateGasFee;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("@mysten/sui/utils");
const buildTx_1 = require("./buildTx");
const number_1 = require("./utils/number");
const suiClient_1 = require("./suiClient");
const getSuiPrice_1 = require("./getSuiPrice");
function estimateGasFee(_a) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function* ({
      quoteResponse,
      accountAddress,
      slippage,
      suiPrice: _suiPrice,
      extendTx,
      commission,
    }) {
      if (!accountAddress) return 0;
      const result = yield (0, buildTx_1.buildTx)({
        extendTx,
        quoteResponse,
        accountAddress,
        slippage,
        commission,
        devInspect: true,
      }).catch((err) => {
        console.log("build tx error: ", err);
        return undefined;
      });
      const { tx } = result || {};
      if (!tx) return 0;
      const suiPrice = _suiPrice || (yield (0, getSuiPrice_1.getSuiPrice)());
      const suiDecimals = utils_1.SUI_DECIMALS;
      const {
        effects: { gasUsed, status },
      } = yield (0, suiClient_1.getSuiClient)().devInspectTransactionBlock({
        sender: accountAddress,
        transactionBlock: tx,
      });
      if (status.status !== "success") return 0;
      const fee = new bignumber_js_1.default(gasUsed.computationCost)
        .plus(gasUsed.storageCost)
        .minus(gasUsed.storageRebate);
      const feeUsd = new bignumber_js_1.default(suiPrice).multipliedBy(
        (0, number_1.formatBalance)(fee, suiDecimals),
      );
      return feeUsd.toNumber();
    },
  );
}