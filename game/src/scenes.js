// Harbour Lights: scene data for the spot-the-difference hunt.
// Each scene names its differences by id, position and radius in scene
// coordinates (the play field is 560 by 420). The painter draws the
// "different" version of a difference only on the right-hand panel.
export const SCENE_WIDTH = 560;
export const SCENE_HEIGHT = 420;

export const SCENES = [
  {
    id: 'harbour-dusk',
    name: 'Dusk Harbour',
    subtitle: 'The lighthouse wakes as the fishing boats come home.',
    timeLimitSeconds: 150,
    parSeconds: 90,
    differences: [
      { id: 'beam', x: 428, y: 96, r: 30, label: 'Lighthouse beam' },
      { id: 'gull', x: 150, y: 80, r: 22, label: 'Extra gull' },
      { id: 'flag', x: 372, y: 252, r: 22, label: 'Boat flag' },
      { id: 'crate', x: 96, y: 348, r: 28, label: 'Crate on the pier' },
      { id: 'window', x: 296, y: 238, r: 20, label: 'Cottage window lit' },
    ],
  },
  {
    id: 'night-market',
    name: 'Night Market on the Pier',
    subtitle: 'Lanterns, fish baskets and one very patient cat.',
    timeLimitSeconds: 135,
    parSeconds: 80,
    differences: [
      { id: 'cat', x: 132, y: 356, r: 26, label: 'Market cat' },
      { id: 'lantern', x: 455, y: 176, r: 22, label: 'Lantern colour' },
      { id: 'basket', x: 455, y: 232, r: 26, label: 'Extra fish basket' },
      { id: 'moon', x: 486, y: 62, r: 30, label: 'Moon phase' },
      { id: 'awning', x: 268, y: 128, r: 24, label: 'Awning stripe' },
      { id: 'bulb', x: 336, y: 74, r: 16, label: 'String-light bulb' },
      { id: 'sign', x: 95, y: 212, r: 24, label: 'Price sign' },
    ],
  },
  {
    id: 'keepers-cottage',
    name: "The Keeper's Cottage",
    subtitle: 'Ten small changes hide in the lighthouse garden.',
    timeLimitSeconds: 120,
    parSeconds: 75,
    differences: [
      { id: 'smoke', x: 348, y: 66, r: 26, label: 'Chimney smoke' },
      { id: 'rose', x: 96, y: 330, r: 22, label: 'Rose bush bloom' },
      { id: 'shirt', x: 430, y: 190, r: 24, label: 'Shirt on the line' },
      { id: 'roofcat', x: 262, y: 128, r: 22, label: 'Cat on the roof' },
      { id: 'curtain', x: 236, y: 252, r: 22, label: 'Curtains' },
      { id: 'stone', x: 300, y: 386, r: 20, label: 'Path stone' },
      { id: 'picket', x: 160, y: 316, r: 18, label: 'Fence picket' },
      { id: 'bucket', x: 62, y: 240, r: 22, label: 'Well bucket' },
      { id: 'sunflower', x: 512, y: 300, r: 24, label: 'Sunflower' },
      { id: 'wreath', x: 287, y: 250, r: 20, label: 'Door wreath' },
    ],
  },
];

export function totalDifferences() {
  let total = 0;
  for (const scene of SCENES) total += scene.differences.length;
  return total;
}

export function differenceAt(scene, x, y) {
  for (const diff of scene.differences) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}
