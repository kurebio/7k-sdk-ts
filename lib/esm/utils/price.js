import { USDC_TOKEN_TYPE } from "../constants/tokens";
const PRICES_API = "https://prices.7k.ag";
export async function getTokenPrice(id, vsCoin = USDC_TOKEN_TYPE) {
  try {
    const response = await fetch(
      `${PRICES_API}/price?ids=${id}&vsCoin=${vsCoin}`,
    );
    const prices = await response.json();
    return prices?.[id]?.price || 0;
  } catch (error) {
    return 0;
  }
}
