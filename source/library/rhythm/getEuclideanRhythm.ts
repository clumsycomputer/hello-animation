import { Rhythm } from "./models";

export interface GetEuclideanRhythmApi extends GetEuclideanRhythmBaseApi {}

export function getEuclideanRhythm(api: GetEuclideanRhythmApi): Rhythm {
  const { lhsCount, rhsCount } = api;
  const euclideanRhythmBase = getEuclideanRhythmBase(api);
  const rhythmLength = lhsCount + rhsCount;
  const rhythmFrequency = rhythmLength / euclideanRhythmBase.length;
  return new Array(rhythmFrequency).fill(euclideanRhythmBase).flat();
}

interface GetEuclideanRhythmBaseApi {
  lhsCount: number;
  lhsRhythm: Rhythm;
  rhsCount: number;
  rhsRhythm: Rhythm;
}

function getEuclideanRhythmBase(api: GetEuclideanRhythmBaseApi): Rhythm {
  const { rhsCount, lhsRhythm, lhsCount, rhsRhythm } = api;
  if (rhsCount === 0) {
    return lhsRhythm;
  }
  return lhsCount > rhsCount
    ? getEuclideanRhythmBase({
        lhsRhythm,
        rhsCount,
        lhsCount: lhsCount - rhsCount,
        rhsRhythm: [...lhsRhythm, ...rhsRhythm],
      })
    : getEuclideanRhythmBase({
        lhsCount,
        rhsRhythm,
        rhsCount: rhsCount - lhsCount,
        lhsRhythm: [...lhsRhythm, ...rhsRhythm],
      });
}
