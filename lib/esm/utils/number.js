import BigNumber from "bignumber.js";
export function formatBalance(balance, decimals) {
  return new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals));
}
export function formatRawBalance(balance, decimals) {
  const rawBalance = new BigNumber(balance).multipliedBy(
    new BigNumber(10).pow(decimals),
  );
  return new BigNumber(rawBalance.toFixed(0));
}