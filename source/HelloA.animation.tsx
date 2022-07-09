import React from "react";
import { AnimationModule } from "graphics-renderer";
import getColormap from "colormap";
import {
  getStructuredRhythmMap,
  GetStructuredRhythmMapApi,
} from "./library/rhythm/getStructuredRhythmMap";
import { RhythmMap, RhythmStructure } from "./library/rhythm/models";

const HelloRainbowAnimationModule: AnimationModule = {
  moduleName: "Hello-Rainbow",
  frameCount: 30,
  getFrameDescription: getHelloRainbowFrameDescription,
  frameSize: {
    width: 1024 * 2,
    height: 1024 * 2,
  },
  animationSettings: {
    frameRate: 6,
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
    nshades: baseRhythmMap.rhythmResolution,
    format: "hex",
    alpha: 1,
  });
  const cellSize = frameSize / baseRhythmMap.rhythmResolution / 2;
  return (
    <svg viewBox={`0 0 ${frameSize} ${frameSize}`}>
      <rect x={0} y={0} width={frameSize} height={frameSize} fill={"black"} />
      {baseRhythmMap.rhythmPoints.map((depthIndex) => {
        const rowLength = frameSize - 2 * depthIndex * cellSize;
        const rowX = depthIndex * cellSize;
        const rowY = depthIndex * cellSize;
        const cellWidth = rowLength / baseRhythmMap.rhythmResolution;
        const depthStructuredRhythmMap = getPhasedRhythmMap({
          someRhythmMap: structuredRhythmMaps[depthIndex],
          rhythmPhase:
            structuredRhythmMaps[depthIndex].rhythmPoints[
              structuredRhythmMaps[depthIndex].rhythmPoints.length -
                baseCommonalityWave[depthIndex]
            ],
        });
        const depthFillColor =
          rainbowColormap[
            (depthIndex +
              frameIndex +
              (depthIndex % 2 === 0 ? 0 : rainbowColormap.length / 2)) %
              rainbowColormap.length
          ];
        return (
          <g>
            {depthStructuredRhythmMap.rhythmPoints.map((someRhythmPoint) => {
              return (
                <g>
                  <rect
                    x={someRhythmPoint * cellWidth + rowX}
                    y={rowY}
                    width={cellWidth}
                    height={cellSize}
                    fill={depthFillColor}
                  />
                  <rect
                    x={
                      rowX + rowLength - cellWidth - someRhythmPoint * cellWidth
                    }
                    y={rowY}
                    width={cellWidth}
                    height={cellSize}
                    fill={depthFillColor}
                  />
                </g>
              );
            })}
            {depthStructuredRhythmMap.rhythmPoints.map((someRhythmPoint) => {
              return (
                <g>
                  <rect
                    x={someRhythmPoint * cellWidth + rowX}
                    y={rowY + rowLength - cellSize}
                    width={cellWidth}
                    height={cellSize}
                    fill={depthFillColor}
                  />
                  <rect
                    x={
                      rowX + rowLength - cellWidth - someRhythmPoint * cellWidth
                    }
                    y={rowY + rowLength - cellSize}
                    width={cellWidth}
                    height={cellSize}
                    fill={depthFillColor}
                  />
                </g>
              );
            })}
            {depthStructuredRhythmMap.rhythmPoints.map((someRhythmPoint) => {
              return (
                <g>
                  <rect
                    x={rowX}
                    y={someRhythmPoint * cellWidth + rowY}
                    width={cellSize}
                    height={cellWidth}
                    fill={depthFillColor}
                  />
                  <rect
                    x={rowX}
                    y={
                      rowY + rowLength - cellWidth - someRhythmPoint * cellWidth
                    }
                    width={cellSize}
                    height={cellWidth}
                    fill={depthFillColor}
                  />
                </g>
              );
            })}
            {depthStructuredRhythmMap.rhythmPoints.map((someRhythmPoint) => {
              return (
                <g>
                  <rect
                    x={rowX + rowLength - cellSize}
                    y={someRhythmPoint * cellWidth + rowY}
                    width={cellSize}
                    height={cellWidth}
                    fill={depthFillColor}
                  />
                  <rect
                    x={rowX + rowLength - cellSize}
                    y={
                      rowY + rowLength - cellWidth - someRhythmPoint * cellWidth
                    }
                    width={cellSize}
                    height={cellWidth}
                    fill={depthFillColor}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
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
            structureType: "terminalStructure",
            rhythmDensity: 18,
            rhythmOrientation: mapIndex % 18,
            // rhythmPhase: 0,
            // subStructure: {
            //   structureType: "interposedStructure",
            //   rhythmDensity: 13,
            //   rhythmOrientation: mapIndex % 13,
            //   rhythmPhase: 0,
            //   subStructure: {
            //     structureType: "terminalStructure",
            //     rhythmDensity: 11,
            //     rhythmOrientation: mapIndex % 11,
            // rhythmPhase: 0,
            //   subStructure: {
            //     structureType: "interposedStructure",
            //     rhythmDensity: 7,
            //     rhythmOrientation: mapIndex % 7,
            //     rhythmPhase: 0,
            //     subStructure: {
            //       structureType: "terminalStructure",
            //       rhythmDensity: 6,
            //       rhythmOrientation: mapIndex % 6,
            //     },
            // },
            // },
            // },
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
