export type GoldenCookieType = {
  force: string;
  wrath: boolean;
};

const gcDict: { [k: string]: GoldenCookieType } = {
  frenzy: { force: "Frenzy", wrath: false },
  "multiply cookies": { force: "Lucky", wrath: false },
  "click frenzy": { force: "Click Frenzy", wrath: false },
  "cookie storm": { force: "Cookie Storm", wrath: false },
  blab: { force: "Blab", wrath: false },
  "building special": { force: "Building Special", wrath: false },
  "cookie storm drop": { force: "Cookie Storm Drop", wrath: false },
  "free sugar lump": { force: "Free Sugar Lump", wrath: false },
  clot: { force: "Clot", wrath: true },
  "ruin cookies": { force: "Ruin", wrath: true },
  "cursed finger": { force: "Cursed finger", wrath: true },
  "blood frenzy": { force: "Elder frenzy", wrath: true },
};

export function getGoldenCookie(force: keyof typeof gcDict): GoldenCookieType {
  return gcDict[force];
}
