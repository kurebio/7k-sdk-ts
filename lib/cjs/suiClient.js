"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuiClient = getSuiClient;
exports.setSuiClient = setSuiClient;
const client_1 = require("@mysten/sui/client");
let suiClient = new client_1.SuiClient({
  url: (0, client_1.getFullnodeUrl)("mainnet"),
});
function getSuiClient() {
  return suiClient;
}
function setSuiClient(client) {
  suiClient = client;
}