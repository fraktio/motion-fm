import * as envNames from "../envNames";

describe("config", () => {
  describe("envNames", () => {
    it("should have the correct values", () => {
      expect(envNames).toMatchSnapshot();
    });
  });
});
