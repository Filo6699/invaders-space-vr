import * as THREE from 'three'
import { TYPES, boomGeometry, invaderMaterial } from './sprites.js'

// og game is 11 wide, doesnt fit on a phone screen
const COLS = 5
const ROWS = ['squid', 'crab', 'octopus']
const COL_STEP = 0.16
const ROW_STEP = 0.75
const SWING = 0.25
const STEP = 0.03
const DROP = 0.25

export class Swarm {
  constructor(parent) {
    this.group = new THREE.Group()
    parent.add(this.group)
    this.invaders = []
    this.dying = []
  }

  reset() {
    this.group.clear()
    this.invaders = []
    this.dying = []
    this.radius = 6
    this.height = 1.1
    this.offset = 0
    this.dir = 1
    this.frame = 0
    this.timer = 0

    for (let r = 0; r < ROWS.length; r++) {
      for (let c = 0; c < COLS; c++) {
        const type = TYPES[ROWS[r]]
        const mesh = new THREE.Mesh(type.geometries[0], invaderMaterial)
        mesh.userData = { type, row: r, angle: (c - (COLS - 1) / 2) * COL_STEP }
        this.group.add(mesh)
        this.invaders.push(mesh)
      }
    }
    this.total = this.invaders.length
    this.place()
  }

  place() {
    for (const inv of this.invaders) {
      const a = inv.userData.angle + this.offset
      const y = this.height + (ROWS.length - 1 - inv.userData.row) * ROW_STEP
      inv.position.set(Math.sin(a) * this.radius, y, -Math.cos(a) * this.radius)
      inv.lookAt(0, y, 0) // face the player
      inv.geometry = inv.userData.type.geometries[this.frame]
    }
  }

  update(dt) {
    for (const inv of this.dying) inv.userData.ttl -= dt
    for (const inv of this.dying.filter(o => o.userData.ttl <= 0)) this.group.remove(inv)
    this.dying = this.dying.filter(o => o.userData.ttl > 0)

    this.timer -= dt
    if (this.timer > 0 || this.cleared) return false
    this.timer = 0.08 + (0.7 * this.invaders.length) / this.total

    if (Math.abs(this.offset + this.dir * STEP) > SWING) {
      this.dir *= -1
      this.height -= DROP
      this.radius -= DROP * 0.6
    } else {
      this.offset += this.dir * STEP
    }
    this.frame ^= 1
    this.place()
    return true
  }

  hit(point, radius) {
    // TODO: через прямоугольники считать
    const inv = this.invaders.find(o => o.position.distanceTo(point) < radius)
    if (!inv) return null
    this.invaders.splice(this.invaders.indexOf(inv), 1)
    inv.geometry = boomGeometry
    inv.userData.ttl = 0.2
    this.dying.push(inv)
    return inv
  }

  // TODO ufo on top row
  shooter() {
    if (this.cleared) return null
    const pick = this.invaders[Math.floor(Math.random() * this.invaders.length)]
    return this.invaders
      .filter(o => o.userData.angle === pick.userData.angle)
      .reduce((a, b) => (a.userData.row > b.userData.row ? a : b))
  }

  get cleared() {
    return this.invaders.length === 0
  }

  get landed() {
    return this.height < -0.6
  }
}
