import {
  getUpdatedRecursiveSpatialStructure,
  GetUpdatedRecursiveSpatialStructureApi,
} from "../general";
import { RhythmStructure } from "./models";

export interface GetUpdatedRhytyhmStructureApi
  extends GetUpdatedRecursiveSpatialStructureApi<RhythmStructure> {}

export function getUpdatedRhythmStructure(
  api: GetUpdatedRhytyhmStructureApi
): RhythmStructure {
  const { baseStructure, getScopedStructureUpdates } = api;
  return getUpdatedRecursiveSpatialStructure({
    baseStructure,
    getScopedStructureUpdates,
  });
}
