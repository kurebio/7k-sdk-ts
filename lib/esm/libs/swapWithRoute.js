import { ProtocolContract } from "./protocols";
export async function swapWithRoute({
  route,
  inputCoinObject,
  currentAccount,
  tx,
}) {
  let inputTokenObject = inputCoinObject;
  let txbResultToReturn;
  for (const swap of route) {
    const ContractClass = ProtocolContract[swap.pool.type];
    const contractInstance = new ContractClass({
      swapInfo: swap,
      inputCoinObject: inputTokenObject,
      currentAccount,
    });
    const tokenOut = await contractInstance.swap(tx);
    inputTokenObject = tokenOut;
    txbResultToReturn = tokenOut;
  }
  return txbResultToReturn;
}
