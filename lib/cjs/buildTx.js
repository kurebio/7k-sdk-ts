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
exports.buildTx = void 0;
const transactions_1 = require("@mysten/sui/transactions");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const getSplitCoinForTx_1 = require("./libs/getSplitCoinForTx");
const groupSwapRoutes_1 = require("./libs/groupSwapRoutes");
const swapWithRoute_1 = require("./libs/swapWithRoute");
const token_1 = require("./utils/token");
const sui_1 = require("./utils/sui");
const _7k_1 = require("./constants/_7k");
const utils_1 = require("@mysten/sui/utils");
const math_1 = require("./constants/math");
const buildTx = (_a) =>
  __awaiter(
    void 0,
    [_a],
    void 0,
    function* ({
      quoteResponse,
      accountAddress,
      slippage,
      commission: _commission,
      devInspect,
      extendTx,
    }) {
      const { tx: _tx, coinIn, useCoinInDirectly } = extendTx || {};
      let coinOut;
      if (!accountAddress) {
        throw new Error("Sender address is required");
      }
      if (!quoteResponse.routes) {
        throw new Error("Invalid quote response: 'routes' are required");
      }
      if (!(0, utils_1.isValidSuiAddress)(_commission.partner)) {
        throw new Error("Invalid commission partner address");
      }
      const tx = _tx || new transactions_1.Transaction();
      const routes = (0, groupSwapRoutes_1.groupSwapRoutes)(quoteResponse);
      const splits = routes.map((group) => {
        var _a, _b;
        return (_b =
          (_a = group[0]) === null || _a === void 0 ? void 0 : _a.amount) !==
          null && _b !== void 0
          ? _b
          : "0";
      });
      let coinData;
      if (coinIn) {
        if (useCoinInDirectly) {
          coinData = coinIn;
        } else {
          coinData = tx.splitCoins(coinIn, splits);
        }
      } else {
        const { coinData: _data } = yield (0,
        getSplitCoinForTx_1.getSplitCoinForTx)(
          accountAddress,
          quoteResponse.swapAmountWithDecimal,
          splits,
          (0, token_1.denormalizeTokenType)(quoteResponse.tokenIn),
          tx,
          devInspect,
        );
        coinData = _data;
      }
      const coinObjects = [];
      yield Promise.all(
        routes.map((route, index) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const inputCoinObject = coinData[index];
            const coinRes = yield (0, swapWithRoute_1.swapWithRoute)({
              route,
              inputCoinObject,
              currentAccount: accountAddress,
              tx,
            });
            if (coinRes) {
              coinObjects.push(coinRes);
            }
          }),
        ),
      );
      if (coinObjects.length > 0) {
        const mergeCoin =
          coinObjects.length > 1
            ? sui_1.SuiUtils.mergeCoins(coinObjects, tx)
            : coinObjects[0];
        coinOut = mergeCoin;
        let minReceived;
        {
          const slippagePrecision = (0, bignumber_js_1.default)(1000000);
          const slippageDecimal = slippagePrecision.multipliedBy(slippage);
          minReceived = tx.moveCall({
            target: `${math_1.MATH_PACKAGE_ID}::math::mulfactor`,
            arguments: [
              tx.moveCall({
                target: `0x2::coin::value`,
                arguments: [coinData],
                typeArguments: [
                  (0, token_1.denormalizeTokenType)(quoteResponse.tokenIn),
                ],
              }),
              tx.pure.u64(slippageDecimal.toFixed(0)),
              tx.pure.u64(slippagePrecision.toFixed(0)),
            ],
          });
        }
        const [partner] = tx.moveCall({
          target: "0x1::option::some",
          typeArguments: [`address`],
          arguments: [tx.pure.address(_commission.partner)],
        });
        tx.moveCall({
          target: `${_7k_1._7K_PACKAGE_ID}::settle::settle`,
          typeArguments: [quoteResponse.tokenIn, quoteResponse.tokenOut],
          arguments: [
            tx.object(_7k_1._7K_CONFIG),
            tx.object(_7k_1._7K_VAULT),
            tx.pure.u64(quoteResponse.swapAmountWithDecimal),
            mergeCoin,
            minReceived,
            tx.pure.u64(quoteResponse.returnAmountWithDecimal),
            partner,
            tx.pure.u64(_commission.commissionBps),
          ],
        });
        if (!extendTx) {
          tx.transferObjects([mergeCoin], tx.pure.address(accountAddress));
        }
      }
      return { tx, coinOut };
    },
  );
exports.buildTx = buildTx;