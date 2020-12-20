import type { prng } from "seedrandom";

export default function choose<T>(arr: Array<T>, srng: prng): T {
  return arr[Math.floor(srng() * arr.length)];
}
