import { SUI_FULL_TYPE } from "./constants/tokens";
import { getTokenPrice } from "./utils/price";
export async function getSuiPrice() {
  return await getTokenPrice(SUI_FULL_TYPE);
}
