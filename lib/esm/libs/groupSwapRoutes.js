import BigNumber from "bignumber.js";
import { denormalizeTokenType } from "../utils/token";
export function groupSwapRoutes(quoteResponse) {
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
    if (!nextItem || new BigNumber(nextItem.amount).gt(0)) {
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
    const pool = poolDetails[swap.poolId];
    const assetIn = denormalizeTokenType(swap.assetIn);
    const assetOut = denormalizeTokenType(swap.assetOut);
    const coinX = {
      type: denormalizeTokenType(pool?.allTokens?.[0]?.address),
      decimals: pool?.allTokens?.[0]?.decimal,
    };
    const coinY = {
      type: denormalizeTokenType(pool?.allTokens?.[1]?.address),
      decimals: pool?.allTokens?.[0]?.decimal,
    };
    const swapXtoY = assetIn === coinX.type;
    return {
      ...swap,
      pool,
      assetIn,
      assetOut,
      coinX,
      coinY,
      swapXtoY,
    };
  });
}