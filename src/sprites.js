import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const PIXEL = 0.07 // 7cm per pixel

export const TYPES = {
  squid: {
    points: 30,
    frames: [
      [
        '...##...',
        '..####..',
        '.######.',
        '##.##.##',
        '########',
        '..#..#..',
        '.#.##.#.',
        '#.#..#.#',
      ],
      [
        '...##...',
        '..####..',
        '.######.',
        '##.##.##',
        '########',
        '.#.##.#.',
        '#......#',
        '.#....#.',
      ],
    ],
  },
  crab: {
    points: 20,
    frames: [
      [
        '..#.....#..',
        '...#...#...',
        '..#######..',
        '.##.###.##.',
        '###########',
        '#.#######.#',
        '#.#.....#.#',
        '...##.##...',
      ],
      [
        '..#.....#..',
        '#..#...#..#',
        '#.#######.#',
        '###.###.###',
        '###########',
        '.#########.',
        '..#.....#..',
        '.#.......#.',
      ],
    ],
  },
  octopus: {
    points: 10,
    frames: [
      [
        '....####....',
        '.##########.',
        '############',
        '###..##..###',
        '############',
        '...##..##...',
        '..##.##.##..',
        '##........##',
      ],
      [
        '....####....',
        '.##########.',
        '############',
        '###..##..###',
        '############',
        '..###..###..',
        '.##..##..##.',
        '..##....##..',
      ],
    ],
  },
}

const BOOM = [
  '....#...#....',
  '.#...#.#...#.',
  '..#.......#..',
  '...#.....#...',
  '##.........##',
  '...#.....#...',
  '..#.#...#.#..',
  '.#...#.#...#.',
]

function voxelize(rows) {
  const w = rows[0].length
  const h = rows.length
  const cubes = []
  rows.forEach((row, y) => {
    ;[...row].forEach((c, x) => {
      if (c !== '#') return
      const cube = new THREE.BoxGeometry(PIXEL, PIXEL, PIXEL)
      cube.translate((x - (w - 1) / 2) * PIXEL, ((h - 1) / 2 - y) * PIXEL, 0)
      cubes.push(cube)
    })
  })
  return mergeGeometries(cubes)
}

export const invaderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

for (const type of Object.values(TYPES)) {
  type.geometries = type.frames.map(voxelize)
}

export const boomGeometry = voxelize(BOOM)
