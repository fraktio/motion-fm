import * as C from "io-ts/Codec";

export const DayTimeCodec = C.struct({
  start: C.number,
  end: C.number,
});
