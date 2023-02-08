import { pipe } from "fp-ts/function";
import * as C from "io-ts/Codec";
import * as D from "io-ts/Decoder";
import * as E from "io-ts/Encoder";
import { DateTime } from "luxon";

const decoder: D.Decoder<unknown, DateTime> = pipe(
  D.string,
  D.parse((s) => {
    if (s === "none") {
      return D.success(DateTime.fromISO("1970-01-01T00:00:00.000Z"));
    }

    const d = DateTime.fromISO(s, { zone: "utc" });

    if (d.isValid) {
      return D.success(d);
    }

    return D.failure(s, `Invalid datetime string reason: ${d.invalidReason}`);
  }),
);

const encoder: E.Encoder<string, DateTime> = {
  encode: (a) => a.toFormat("yyyy-MM-ddTHH:mm:ss"),
};

export const HueDateTimeCodec: C.Codec<unknown, string, DateTime> = C.make(
  decoder,
  encoder,
);
