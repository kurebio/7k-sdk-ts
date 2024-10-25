"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSwapRoutes = groupSwapRoutes;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const token_1 = require("../utils/token");
function groupSwapRoutes(quoteResponse) {
  if (!quoteResponse.routes || !quoteResponse.swaps) {
    return [];
  }
  const poolDetails = mapPoolIdsToDetails(quoteResponse.routes);
  const items = getTxSorSwaps(quoteResponse.swaps, poolDetails);
  const groupedItems = [];
  let currentGroup = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    currentGroup.push(item);
    const nextItem = items[i + 1];
    if (!nextItem || new bignumber_js_1.default(nextItem.amount).gt(0)) {
      groupedItems.push(currentGroup);
      currentGroup = [];
    }
  }
  if (currentGroup.length > 0) {
    groupedItems.push(currentGroup);
  }
  return groupedItems;
}
function mapPoolIdsToDetails(routes) {
  const poolTypes = {};
  routes.forEach((route) => {
    route.hops.forEach((hop) => {
      poolTypes[hop.poolId] = hop.pool;
    });
  });
  return poolTypes;
}
function getTxSorSwaps(swaps, poolDetails) {
  return swaps.map((swap) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const pool = poolDetails[swap.poolId];
    const assetIn = (0, token_1.denormalizeTokenType)(swap.assetIn);
    const assetOut = (0, token_1.denormalizeTokenType)(swap.assetOut);
    const coinX = {
      type: (0, token_1.denormalizeTokenType)(
        (_b =
          (_a = pool === null || pool === void 0 ? void 0 : pool.allTokens) ===
            null || _a === void 0
            ? void 0
            : _a[0]) === null || _b === void 0
          ? void 0
          : _b.address,
      ),
      decimals:
        (_d =
          (_c = pool === null || pool === void 0 ? void 0 : pool.allTokens) ===
            null || _c === void 0
            ? void 0
            : _c[0]) === null || _d === void 0
          ? void 0
          : _d.decimal,
    };
    const coinY = {
      type: (0, token_1.denormalizeTokenType)(
        (_f =
          (_e = pool === null || pool === void 0 ? void 0 : pool.allTokens) ===
            null || _e === void 0
            ? void 0
            : _e[1]) === null || _f === void 0
          ? void 0
          : _f.address,
      ),
      decimals:
        (_h =
          (_g = pool === null || pool === void 0 ? void 0 : pool.allTokens) ===
            null || _g === void 0
            ? void 0
            : _g[0]) === null || _h === void 0
          ? void 0
          : _h.decimal,
    };
    const swapXtoY = assetIn === coinX.type;
    return Object.assign(Object.assign({}, swap), {
      pool,
      assetIn,
      assetOut,
      coinX,
      coinY,
      swapXtoY,
    });
  });
}