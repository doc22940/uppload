import { MicrolinkBaseClass } from "../../src/helpers/microlink";
import {
  NineGag,
  ArtStation,
  DeviantArt,
  Facebook,
  Flickr,
  Instagram,
  Pinterest,
  Screenshot,
  Twitter,
  URL
} from "../../src";

const services = [
  new NineGag(),
  new ArtStation(),
  new DeviantArt(),
  new Facebook(),
  new Flickr(),
  new Instagram(),
  new Pinterest(),
  new Screenshot(),
  new Twitter(),
  new URL()
];

const microlink = new MicrolinkBaseClass();

describe("validator", () => {
  it("is a function", () =>
    expect(typeof microlink.validator).toBe("function"));
  it("returns a bool", () =>
    expect(typeof microlink.validator("")).toBe("boolean"));
});

describe("template", () => {
  it("is a function", () => expect(typeof microlink.template).toBe("function"));
  it("returns a string", () =>
    expect(typeof microlink.template()).toBe("string"));
  it("has a form", () => expect(microlink.template()).toContain("<form"));
  it("has an input", () => expect(microlink.template()).toContain("<input"));
});

for (const currentService of services) {
  describe(`${currentService.name} service`, () => {
    it("validator is a function", () =>
      expect(typeof currentService.validator).toBe("function"));
    it("validator returns bool", () =>
      expect(typeof currentService.validator("")).toBe("boolean"));
    it("validator validates url", () =>
      expect(
        typeof currentService.validator(currentService.exampleURL)
      ).toBeTruthy());
  });
}
