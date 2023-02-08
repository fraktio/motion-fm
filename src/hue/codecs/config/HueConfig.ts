import * as C from "io-ts/Codec";

export const HueConfigCodec = C.struct({
  name: C.string,
  datastoreversion: C.string,
  swversion: C.string,
  apiversion: C.string,
  mac: C.string,
  bridgeid: C.string,
});

export type HueConfigEncoded = C.OutputOf<typeof HueConfigCodec>;
export type HueConfigDecoded = C.TypeOf<typeof HueConfigCodec>;
