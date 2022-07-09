import React from "react";
import { AnimationModule } from "graphics-renderer";
import getColormap from "colormap";
import { getStructuredRhythmMap } from "./library/rhythm/getStructuredRhythmMap";
import { RhythmMap, RhythmStructure } from "./library/rhythm/models";

const HelloRainbowAnimationModule: AnimationModule = {
  moduleName: "Hello-Rainbow",
  frameCount: 30,
  getFrameDescription: getHelloRainbowFrameDescription,
  frameSize: {
    width: 1024 * 3,
    height: 1024 * 3,
  },
  animationSettings: {
    frameRate: 9,
    constantRateFactor: 1,
  },
};

export default HelloRainbowAnimationModule;

const frameSize = 100;

interface GetHelloRainbowFrameDescriptionApi {
  frameCount: number;
  frameIndex: number;
}

async function getHelloRainbowFrameDescription(
  api: GetHelloRainbowFrameDescriptionApi
) {
  const { frameCount, frameIndex } = api;
  const structuredRhythmMaps = getStructuredRhythmMaps({ frameIndex });
  const baseRhythmMap = structuredRhythmMaps[frameIndex];
  const baseCommonalityWave = getStructuredRhythmCommonalityWave({
    someStructuredRhythmMap: baseRhythmMap,
  });
  const rainbowColormap = getColormap({
    colormap: "magma",
    nshades: frameCount,
    format: "hex",
    alpha: 1,
  });
  const depthSize = frameSize / baseRhythmMap.rhythmResolution / 2;
  return (
    <svg viewBox={`0 0 ${frameSize} ${frameSize}`}>
      <rect x={0} y={0} width={frameSize} height={frameSize} fill={"black"} />
      <g>
        {baseRhythmMap.rhythmPoints.map((depthIndex) => {
          const depthRhythmMap = getPhasedRhythmMap({
            someRhythmMap: structuredRhythmMaps[depthIndex],
            rhythmPhase:
              structuredRhythmMaps[depthIndex].rhythmPoints[
                structuredRhythmMaps[depthIndex].rhythmPoints.length -
                  baseCommonalityWave[depthIndex]
              ],
          });
          const depthCommonalityWave = getStructuredRhythmCommonalityWave({
            someStructuredRhythmMap: depthRhythmMap,
          });
          const depthFillColor =
            rainbowColormap[
              (depthIndex +
                frameIndex +
                (depthIndex % 2 === 0 ? 0 : rainbowColormap.length / 2)) %
                rainbowColormap.length
            ];
          const gridX = depthIndex * depthSize;
          const gridY = depthIndex * depthSize;
          const gridSize = frameSize - 2 * depthIndex * depthSize;
          const cellSize = gridSize / depthRhythmMap.rhythmResolution;
          return (
            <path
              fill={depthFillColor}
              d={depthCommonalityWave
                .map((someCellWeight, cellIndex) => {
                  const cellPointA = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX: cellIndex,
                    cellCoordY: someCellWeight,
                  });
                  const cellPointB = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX: depthRhythmMap.rhythmResolution - 1 - cellIndex,
                    cellCoordY: someCellWeight,
                  });
                  const cellPointC = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX: cellIndex,
                    cellCoordY:
                      depthRhythmMap.rhythmResolution - 1 - someCellWeight,
                  });
                  const cellPointD = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX: depthRhythmMap.rhythmResolution - cellIndex - 1,
                    cellCoordY:
                      depthRhythmMap.rhythmResolution - 1 - someCellWeight,
                  });

                  const cellPointE = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX: someCellWeight,
                    cellCoordY: cellIndex,
                  });
                  const cellPointF = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX: someCellWeight,
                    cellCoordY: depthRhythmMap.rhythmResolution - 1 - cellIndex,
                  });
                  const cellPointG = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX:
                      depthRhythmMap.rhythmResolution - 1 - someCellWeight,
                    cellCoordY: cellIndex,
                  });
                  const cellPointH = getCellPoint({
                    gridX,
                    gridY,
                    gridSize,
                    cellSize,
                    cellCoordX:
                      depthRhythmMap.rhythmResolution - 1 - someCellWeight,
                    cellCoordY: depthRhythmMap.rhythmResolution - cellIndex - 1,
                  });
                  return `${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointA.x,
                    y: cellPointA.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointB.x,
                    y: cellPointB.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointC.x,
                    y: cellPointC.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointD.x,
                    y: cellPointD.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointE.x,
                    y: cellPointE.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointF.x,
                    y: cellPointF.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointG.x,
                    y: cellPointG.y,
                  })} ${getRectPathCommands({
                    width: cellSize,
                    height: cellSize,
                    x: cellPointH.x,
                    y: cellPointH.y,
                  })}`;
                })
                .join(" ")}
            />
          );
        })}
      </g>
    </svg>
  );
}

interface GetRectPatchCommandsApi {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getRectPathCommands(api: GetRectPatchCommandsApi) {
  const { x, y, width, height } = api;
  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${
    y + height
  } L ${x} ${y}`;
}

interface GetCellPointApi {
  gridX: number;
  gridY: number;
  gridSize: number;
  cellSize: number;
  cellCoordX: number;
  cellCoordY: number;
}

function getCellPoint(api: GetCellPointApi) {
  const { cellCoordX, cellSize, gridX, cellCoordY, gridY } = api;
  return {
    x: cellCoordX * cellSize + gridX,
    y: cellCoordY * cellSize + gridY,
  };
}

interface GetPhasedRhythmMapApi {
  someRhythmMap: RhythmMap;
  rhythmPhase: number;
}

function getPhasedRhythmMap(api: GetPhasedRhythmMapApi): RhythmMap {
  const { someRhythmMap, rhythmPhase } = api;
  return {
    ...someRhythmMap,
    rhythmPoints: someRhythmMap.rhythmPoints.map(
      (someBaseRhythmPoint) =>
        (someBaseRhythmPoint - rhythmPhase + someRhythmMap.rhythmResolution) %
        someRhythmMap.rhythmResolution
    ),
  };
}

interface GetStructuredRhythmCommonalityWaveApi {
  someStructuredRhythmMap: ReturnType<typeof getStructuredRhythmMap>;
}

function getStructuredRhythmCommonalityWave(
  api: GetStructuredRhythmCommonalityWaveApi
) {
  const { someStructuredRhythmMap } = api;
  return new Array(someStructuredRhythmMap.rhythmPoints.length)
    .fill(undefined)
    .reduce<number[]>((commonalityWaveResult, _, phaseIndex) => {
      for (
        let pointIndex = 0;
        pointIndex < someStructuredRhythmMap.rhythmPoints.length;
        pointIndex++
      ) {
        commonalityWaveResult[
          (someStructuredRhythmMap.rhythmPoints[pointIndex] -
            someStructuredRhythmMap.rhythmPoints[phaseIndex] +
            someStructuredRhythmMap.rhythmResolution) %
            someStructuredRhythmMap.rhythmResolution
        ] += 1;
      }
      return commonalityWaveResult;
    }, new Array(someStructuredRhythmMap.rhythmResolution).fill(0));
}

interface GetStructuredRhythmMapsApi
  extends Pick<GetHelloRainbowFrameDescriptionApi, "frameIndex"> {}

function getStructuredRhythmMaps(api: GetStructuredRhythmMapsApi) {
  const { frameIndex } = api;
  const structuredRhythmMaps: Array<RhythmMap> = [];
  for (let mapIndex = 0; mapIndex < 30; mapIndex++) {
    const rhythmStructureA: RhythmStructure = {
      rhythmResolution: 30,
      rhythmPhase: frameIndex,
      structureType: "initialStructure",
      subStructure: {
        structureType: "interposedStructure",
        rhythmDensity: 29,
        rhythmOrientation: mapIndex % 29,
        rhythmPhase: 0,
        subStructure: {
          structureType: "interposedStructure",
          rhythmDensity: 19,
          rhythmOrientation: mapIndex % 19,
          rhythmPhase: 0,
          subStructure: {
            structureType: "interposedStructure",
            rhythmDensity: 17,
            rhythmOrientation: mapIndex % 17,
            rhythmPhase: 0,
            subStructure: {
              structureType: "interposedStructure",
              rhythmDensity: 13,
              rhythmOrientation: mapIndex % 13,
              rhythmPhase: 0,
              subStructure: {
                structureType: "interposedStructure",
                rhythmDensity: 11,
                rhythmOrientation: mapIndex % 11,
                rhythmPhase: 0,
                subStructure: {
                  structureType: "interposedStructure",
                  rhythmDensity: 7,
                  rhythmOrientation: mapIndex % 7,
                  rhythmPhase: 0,
                  subStructure: {
                    structureType: "terminalStructure",
                    rhythmDensity: 5,
                    rhythmOrientation: mapIndex % 5,
                  },
                },
              },
            },
          },
        },
      },
    };
    structuredRhythmMaps.push(
      getStructuredRhythmMap({
        someRhythmStructure: rhythmStructureA,
      })
    );
  }
  return structuredRhythmMaps;
}
