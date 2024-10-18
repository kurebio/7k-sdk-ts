"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTx =
  exports.estimateGasFee =
  exports.getSuiPrice =
  exports.getQuote =
  exports.setSuiClient =
  exports.getSuiClient =
    void 0;
__exportStar(require("./types/aggregator"), exports);
const suiClient_1 = require("./suiClient");
Object.defineProperty(exports, "getSuiClient", {
  enumerable: true,
  get: function () {
    return suiClient_1.getSuiClient;
  },
});
Object.defineProperty(exports, "setSuiClient", {
  enumerable: true,
  get: function () {
    return suiClient_1.setSuiClient;
  },
});
const getQuote_1 = require("./getQuote");
Object.defineProperty(exports, "getQuote", {
  enumerable: true,
  get: function () {
    return getQuote_1.getQuote;
  },
});
const getSuiPrice_1 = require("./getSuiPrice");
Object.defineProperty(exports, "getSuiPrice", {
  enumerable: true,
  get: function () {
    return getSuiPrice_1.getSuiPrice;
  },
});
const estimateGasFee_1 = require("./estimateGasFee");
Object.defineProperty(exports, "estimateGasFee", {
  enumerable: true,
  get: function () {
    return estimateGasFee_1.estimateGasFee;
  },
});
const buildTx_1 = require("./buildTx");
Object.defineProperty(exports, "buildTx", {
  enumerable: true,
  get: function () {
    return buildTx_1.buildTx;
  },
});
exports.default = {
  getSuiClient: suiClient_1.getSuiClient,
  setSuiClient: suiClient_1.setSuiClient,
  getQuote: getQuote_1.getQuote,
  getSuiPrice: getSuiPrice_1.getSuiPrice,
  estimateGasFee: estimateGasFee_1.estimateGasFee,
  buildTx: buildTx_1.buildTx,
};
