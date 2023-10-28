import type { SerializeFrom } from "@remix-run/node";
import type { BETypes } from "../../backend/src/types";

export type FETypes = {
  Dog: SerializeFrom<BETypes["Dog"]>;
  Post: SerializeFrom<BETypes["Post"]>;
};
