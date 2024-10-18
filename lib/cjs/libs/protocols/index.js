"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolContract = void 0;
const flowx_1 = require("./flowx");
const aftermath_1 = require("./aftermath");
const cetus_1 = require("./cetus");
const deepbook_1 = require("./deepbook");
const kriya_1 = require("./kriya");
const turbos_1 = require("./turbos");
const suiswap_1 = require("./suiswap");
const bluemove_1 = require("./bluemove");
const kriyaV3_1 = require("./kriyaV3");
const sponsored_1 = require("./deepbookV3/sponsored");
exports.ProtocolContract = {
  cetus: cetus_1.CetusContract,
  turbos: turbos_1.TurbosContract,
  bluemove: bluemove_1.BluemoveContract,
  kriya: kriya_1.KriyaContract,
  suiswap: suiswap_1.SuiswapContract,
  aftermath: aftermath_1.AfterMathContract,
  deepbook: deepbook_1.DeepBookContract,
  deepbook_v3: sponsored_1.SponsoredDeepBookV3Contract,
  flowx: flowx_1.FlowXContract,
  kriya_v3: kriyaV3_1.KriyaV3Contract,
};
