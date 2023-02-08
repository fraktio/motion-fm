import * as C from "io-ts/Codec";

export const HueUnauthorizedCodec = C.struct({
  error: C.struct({
    type: C.number,
    address: C.string,
    description: C.string,
  }),
});

export const isHueUnauthenticated = (body: unknown): boolean => {
  const result = C.array(HueUnauthorizedCodec).decode(body);

  if (result._tag !== "Right") {
    return false;
  }

  if (result.right.length === 0) {
    return false;
  }

  if (result.right.some((error) => error.error.type === 1)) {
    return true;
  }

  return false;
};
