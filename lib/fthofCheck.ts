import type { GoldenCookie } from "../lib/GoldenCookie";
import seedrandom from "seedrandom";
import choose from "../lib/choose";
import { getGoldenCookie } from "../lib/GoldenCookie";

const checkCookies = ({
  seed,
  spells,
  season,
  onScreenCookies,
  dragonFlight,
}: {
  seed: string;
  spells: number;
  season: string;
  onScreenCookies: number;
  ascensionMode: number;
  dragonFlight: boolean;
}): GoldenCookie => {
  const srnd = seedrandom(`${seed}/${spells}`);
  const roll = srnd();
  let force: string = null;
  if (roll < 1 - 0.15 * (onScreenCookies + 1)) {
    // Game.shimmerTypes.golden.initFunc
    // if (chime && ascensionMode !== 1) srnd();
    if (season === "valentines" || season === "easter") srnd();
    srnd();
    srnd();
    // Game.shimmerTypes.golden.initFunc end

    const choices = ["frenzy", "multiply cookies"];
    if (!dragonFlight) choices.push("click frenzy");
    if (srnd() < 0.1) choices.push("cookie storm", "cookie storm", "blab");
    if (srnd() < 0.25) choices.push("building special");
    if (srnd() < 0.15) {
      while (choices.length > 0) {
        choices.pop();
      }
      choices.push("cookie storm drop");
    }
    if (srnd() < 0.0001) choices.push("free sugar lump");
    force = choose(choices, srnd);
  } else {
    // Game.shimmerTypes.golden.initFunc
    // if (chime && ascensionMode !== 1) srnd();
    if (season === "valentines" || season === "easter") srnd();
    srnd();
    srnd();
    // Game.shimmerTypes.golden.initFunc end

    const choices = ["clot", "ruin cookies"];
    if (srnd() < 0.1) choices.push("cursed finger", "blood frenzy");
    if (srnd() < 0.003) choices.push("free sugar lump");
    if (srnd() < 0.1) {
      while (choices.length > 0) {
        choices.pop();
      }
      choices.push("blab");
    }
    force = choose(choices, srnd);
  }

  return getGoldenCookie(force);
};

export { checkCookies };
