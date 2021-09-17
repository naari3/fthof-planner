import { GoldenCookieType } from "./GoldenCookie";
import { checkCookies } from "../lib/fthofCheck";

export default class Predictor implements IterableIterator<GoldenCookieType[]> {
  seed: string;
  onScreenCookies: number;
  spells: number;
  dragonFlight: boolean;

  constructor(init?: Partial<Predictor>) {
    Object.assign(this, init);
  }

  clone(): Predictor {
    return new Predictor({
      seed: this.seed,
      onScreenCookies: this.onScreenCookies,
      spells: this.spells,
      dragonFlight: this.dragonFlight,
    });
  }

  [Symbol.iterator](): IterableIterator<GoldenCookieType[]> {
    return this;
  }

  next(): IteratorResult<GoldenCookieType[]> {
    const options = {
      seed: this.seed,
      spells: this.spells,
      onScreenCookies: this.onScreenCookies,
      ascensionMode: 0,
      dragonFlight: this.dragonFlight,
    };
    this.spells += 1;

    return {
      done: false,
      value: [
        checkCookies({
          ...options,
          season: "",
        }),
        checkCookies({
          ...options,
          season: "easter",
        }),
      ],
    };
  }
}
