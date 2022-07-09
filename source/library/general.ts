import {
  Circle,
  InitialSpatialStructureBase,
  InterposedSpatialStructureBase,
  Point,
  RecursiveSpatialStructure,
  TerminalSpatialStructureBase,
} from "./models";

// export interface GetCirclePointApi {
//   someCircle: Circle;
//   pointAngle: number;
// }

// export function getCirclePoint(api: GetCirclePointApi): Point {
//   const { pointAngle, someCircle } = api;
//   return [
//     Math.cos(pointAngle) * someCircle.radius + someCircle.center[0],
//     Math.sin(pointAngle) * someCircle.radius + someCircle.center[1],
//   ];
// }

// export interface GetRotatedPointApi {
//   basePoint: Point;
//   anchorPoint: Point;
//   rotationAngle: number;
// }

// export function getRotatedPoint(api: GetRotatedPointApi): Point {
//   const { basePoint, anchorPoint, rotationAngle } = api;
//   const originCenteredPoint: Point = [
//     basePoint[0] - anchorPoint[0],
//     basePoint[1] - anchorPoint[1],
//   ];
//   return [
//     originCenteredPoint[0] * Math.cos(rotationAngle) -
//       originCenteredPoint[1] * Math.sin(rotationAngle) +
//       anchorPoint[0],
//     originCenteredPoint[0] * Math.sin(rotationAngle) +
//       originCenteredPoint[1] * Math.cos(rotationAngle) +
//       anchorPoint[1],
//   ];
// }

// export interface GetNormalizedAngleBetweenPointsApi {
//   basePoint: Point;
//   targetPoint: Point;
// }

// export function getNormalizedAngleBetweenPoints(
//   api: GetNormalizedAngleBetweenPointsApi
// ): number {
//   const { targetPoint, basePoint } = api;
//   return getNormalizedAngle({
//     someAngle: Math.atan2(
//       targetPoint[1] - basePoint[1],
//       targetPoint[0] - basePoint[0]
//     ),
//   });
// }

// export interface GetDistanceBetweenPointsApi {
//   pointA: Point;
//   pointB: Point;
// }

// export function getDistanceBetweenPoints(
//   api: GetDistanceBetweenPointsApi
// ): number {
//   const { pointA, pointB } = api;
//   const deltaX = pointB[0] - pointA[0];
//   const deltaY = pointB[1] - pointA[1];
//   return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
// }

// export interface GetNormalizedAngleApi {
//   someAngle: number;
// }

// export function getNormalizedAngle(api: GetNormalizedAngleApi) {
//   const { someAngle } = api;
//   return ((someAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
// }

// export interface GetMidPointBetweenPointsApi {
//   pointA: Point;
//   pointB: Point;
// }

// export function getMidPointBetweenPoints(
//   api: GetMidPointBetweenPointsApi
// ): Point {
//   const { pointA, pointB } = api;
//   return [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
// }

// export interface GetMirroredPointApi {
//   basePoint: Point;
//   originPoint: Point;
//   mirrorAngle: number;
// }

// export interface GetMinimumDistanceBetweenPointAndLineApi {
//   somePoint: Point;
//   someLine: [Point, Point];
// }

// export function getMinimumDistanceBetweenPointAndLine(
//   api: GetMinimumDistanceBetweenPointAndLineApi
// ) {
//   const { someLine, somePoint } = api;
//   const lineDeltaX = someLine[1][0] - someLine[0][0];
//   const lineDeltaY = someLine[1][1] - someLine[0][1];
//   return (
//     Math.abs(
//       lineDeltaX * (someLine[0][1] - somePoint[1]) -
//         (someLine[0][0] - somePoint[0]) * lineDeltaY
//     ) / Math.pow(Math.pow(lineDeltaX, 2) + Math.pow(lineDeltaY, 2), 0.5)
//   );
// }

// export interface GetIntersectionPointApi {
//   lineA: [Point, Point];
//   lineB: [Point, Point];
// }

// // adjusted & optimized implementation of http://paulbourke.net/geometry/pointlineplane/
// export function getIntersectionPoint(api: GetIntersectionPointApi): Point {
//   const { lineB, lineA } = api;
//   const deltaYB = lineB[1][1] - lineB[0][1];
//   const deltaXA = lineA[1][0] - lineA[0][0];
//   const deltaXB = lineB[1][0] - lineB[0][0];
//   const deltaYA = lineA[1][1] - lineA[0][1];
//   const slopeA =
//     (deltaXB * (lineA[0][1] - lineB[0][1]) -
//       deltaYB * (lineA[0][0] - lineB[0][0])) /
//     (deltaYB * deltaXA - deltaXB * deltaYA);
//   return [lineA[0][0] + slopeA * deltaXA, lineA[0][1] + slopeA * deltaYA];
// }

export interface GetUpdatedRecursiveSpatialStructureApi<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure
> {
  baseStructure: BaseRecursiveSpatialStructure;
  getScopedStructureUpdates: (api: {
    baseStructure: BaseRecursiveSpatialStructure;
    scopedStructureBase:
      | BaseRecursiveSpatialStructure
      | BaseRecursiveSpatialStructure["subStructure"];
    structureIndex: number;
  }) => ScopedStructureUpdates<
    | BaseRecursiveSpatialStructure
    | BaseRecursiveSpatialStructure["subStructure"]
  >;
}

type ScopedStructureUpdates<
  SomeScopedStructure extends
    | RecursiveSpatialStructure
    | RecursiveSpatialStructure["subStructure"]
> = SomeScopedStructure extends InitialSpatialStructureBase<infer T>
  ? Omit<SomeScopedStructure, "structureType" | "subStructure">
  : SomeScopedStructure extends InterposedSpatialStructureBase<infer T>
  ? Omit<SomeScopedStructure, "structureType" | "subStructure">
  : SomeScopedStructure extends TerminalSpatialStructureBase
  ? Omit<SomeScopedStructure, "structureType">
  : never;

export function getUpdatedRecursiveSpatialStructure<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure<
    InterposedSpatialStructureBase<any>,
    TerminalSpatialStructureBase
  >
>(api: GetUpdatedRecursiveSpatialStructureApi<BaseRecursiveSpatialStructure>) {
  const { baseStructure, getScopedStructureUpdates } = api;
  return getUpdatedScopedStructure({
    baseStructure,
    getScopedStructureUpdates,
    scopedStructure: baseStructure,
    structureIndex: 0,
  });
}

interface GetUpdatedScopedStructureApi<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure,
  CurrentScopedStructure extends
    | BaseRecursiveSpatialStructure
    | BaseRecursiveSpatialStructure["subStructure"]
> extends Pick<
    GetUpdatedRecursiveSpatialStructureApi<BaseRecursiveSpatialStructure>,
    "baseStructure" | "getScopedStructureUpdates"
  > {
  scopedStructure: CurrentScopedStructure;
  structureIndex: number;
}

function getUpdatedScopedStructure<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure,
  CurrentScopedStructure extends
    | BaseRecursiveSpatialStructure
    | BaseRecursiveSpatialStructure["subStructure"]
>(
  api: GetUpdatedScopedStructureApi<
    BaseRecursiveSpatialStructure,
    CurrentScopedStructure
  >
): CurrentScopedStructure {
  const {
    baseStructure,
    getScopedStructureUpdates,
    structureIndex,
    scopedStructure,
  } = api;
  const scopedStructureUpdates = getScopedStructureUpdates({
    baseStructure,
    structureIndex,
    scopedStructureBase: scopedStructure,
  });
  switch (scopedStructure.structureType) {
    case "initialStructure":
    case "interposedStructure":
      const updatedSubStructure = getUpdatedScopedStructure({
        baseStructure,
        getScopedStructureUpdates,
        scopedStructure: scopedStructure.subStructure,
        structureIndex: structureIndex + 1,
      });
      return {
        ...scopedStructure,
        ...scopedStructureUpdates,
        subStructure: updatedSubStructure,
      };
    case "terminalStructure":
      return {
        ...scopedStructure,
        ...scopedStructureUpdates,
      };
  }
}
