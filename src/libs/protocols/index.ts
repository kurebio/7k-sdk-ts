import { FlowXContract } from "./flowx";
import { AfterMathContract } from "./aftermath";
import { CetusContract } from "./cetus";
import { DeepBookContract } from "./deepbook";
import { KriyaContract } from "./kriya";
import { TurbosContract } from "./turbos";
import { SuiswapContract } from "./suiswap";
import { BluemoveContract } from "./bluemove";

export const ProtocolContract = {
  cetus: CetusContract,
  turbos: TurbosContract,
  bluemove: BluemoveContract,
  kriya: KriyaContract,
  suiswap: SuiswapContract,
  aftermath: AfterMathContract,
  deepbook: DeepBookContract,
  flowx: FlowXContract,
};
