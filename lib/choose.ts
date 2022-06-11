import type { PRNG } from "seedrandom";

export default function choose<T>(arr: Array<T>, srng: PRNG): T {
  return arr[Math.floor(srng() * arr.length)];
}
