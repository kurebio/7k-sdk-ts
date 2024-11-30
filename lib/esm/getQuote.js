import { normalizeTokenType } from "./utils/token";
const DEFAULT_SOURCES = [
  "suiswap",
  "turbos",
  "cetus",
  "bluemove",
  "kriya",
  "kriya_v3",
  "aftermath",
  "deepbook",
  "deepbook_v3",
  "flowx",
  "bluefin",
];
export async function getQuote({
  tokenIn,
  tokenOut,
  amountIn,
  sources = DEFAULT_SOURCES,
}) {
  const response = await fetch(
    `https://api.7k.ag/quote?amount=${amountIn}&from=${normalizeTokenType(tokenIn)}&to=${normalizeTokenType(tokenOut)}&sources=${sources}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch aggregator quote");
  }
  return response.json();
}
