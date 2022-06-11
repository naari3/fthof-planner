import { GoldenCookieType } from "./GoldenCookie";
import { checkCookies } from "../lib/fthofCheck";

export default class ElderPredictor implements IterableIterator<Step[]> {
  seed: string;
  spells: number;
  dragonFlight: boolean;
  supremeIntellect: boolean;

  private cache: { [key: string]: GoldenCookieType } = {};

  constructor(init?: Partial<ElderPredictor>) {
    Object.assign(this, init);
  }

  [Symbol.iterator](): IterableIterator<Step[]> {
    return this;
  }

  next(): IteratorResult<Step[]> {
    const steps = onScreenCookiesSteps.flatMap((onCookies) =>
      this.generateStepPredict(this.spells, onCookies)
    );
    this.spells += 1;

    return {
      done: false,
      value: steps,
    };
  }

  private generateStepPredict(
    spells: number,
    onCookies: [number, number, number, number]
  ): Step[] {
    return seasonSteps.flatMap((seasons) =>
      seasons.map((season) => {
        return {
          goldenCookies: onCookies.map((cs, i) => {
            const key = `${this.seed}:${spells + i}:${cs}:${season}`;
            const cached = this.cache[key];
            const gc = cached
              ? cached
              : checkCookies({
                  seed: this.seed,
                  spells: spells + i,
                  ascensionMode: 0,
                  onScreenCookies: cs,
                  dragonFlight: this.dragonFlight,
                  supremeIntellect: this.supremeIntellect,
                  season,
                });
            if (cached === undefined) this.cache[key] = gc;
            return gc;
          }),
          seasons,
          onScreens: onCookies,
        };
      })
    );
  }
}

const bit_test = (num: number, bit: number) => (num >> bit) % 2 != 0;
const seasonSteps = [...Array(16).keys()].map((n) => [
  bit_test(n, 0) ? "" : "easter",
  bit_test(n, 1) ? "" : "easter",
  bit_test(n, 2) ? "" : "easter",
  bit_test(n, 3) ? "" : "easter",
]);
const onScreenCookiesSteps: [number, number, number, number][] = [
  [0, 0, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 1, 0, 1],
  [0, 1, 1, 1],
  [0, 0, 1, 2],
  [0, 1, 2, 0],
  [0, 1, 1, 2],
  [0, 1, 2, 1],
  [0, 1, 2, 2],
  [0, 1, 2, 3],
];

export type Step = {
  goldenCookies: GoldenCookieType[];
  seasons: string[];
  onScreens: number[];
};
