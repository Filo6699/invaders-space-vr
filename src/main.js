import * as THREE from 'three'
import { createScene } from './scene.js'
import { Swarm } from './swarm.js'
import { Shots } from './shots.js'
import { Hud } from './hud.js'
import { setupInput } from './input.js'

const { renderer, scene, camera, world } = createScene()
const swarm = new Swarm(world)
const lasers = new Shots(world, new THREE.BoxGeometry(0.03, 0.03, 0.5))
const bombs = new Shots(world, new THREE.BoxGeometry(0.06, 0.2, 0.06))
const hud = new Hud(camera)
const head = new THREE.Vector3()
const clock = new THREE.Clock()

const state = { playing: false, score: 0, cooldown: 0, bombTimer: 0 }

setupInput({ renderer, scene, camera, onFire: fire })
document.querySelector('#play').onclick = startGame

function startGame() {
  Object.assign(state, { playing: true, score: 0, bombTimer: 2 })
  document.body.classList.add('playing')
  swarm.reset()
  lasers.clear()
  bombs.clear()
}

function fire(origin, dir) {
  if (!state.playing || state.cooldown > 0) return
  state.cooldown = 0.3
  lasers.fire(world.worldToLocal(origin), dir, 12)
}

function dropBomb() {
  const inv = swarm.shooter()
  if (!inv) return
  const dir = head.clone().sub(inv.position).normalize()
  bombs.fire(inv.position, dir, 2.5)
}

function update(dt) {
  state.cooldown -= dt
  swarm.update(dt)
  lasers.update(dt)
  bombs.update(dt)
  world.worldToLocal(camera.getWorldPosition(head))

  for (const shot of [...lasers.list]) {
    const inv = swarm.hit(shot.position, 0.45)
    const bomb = bombs.list.find(b => b.position.distanceTo(shot.position) < 0.35)
    if (!inv && !bomb) continue
    lasers.remove(shot)
    if (inv) state.score += inv.userData.type.points
    else bombs.remove(bomb)
  }

  // bombs dont do anything yet, they just vanish when they reach u
  for (const bomb of [...bombs.list]) {
    if (bomb.position.distanceTo(head) < 0.35) bombs.remove(bomb)
  }

  state.bombTimer -= dt
  if (state.bombTimer <= 0) {
    dropBomb()
    state.bombTimer = 1.5 + Math.random() * 1.5
  }

  if (swarm.cleared || swarm.landed) swarm.reset()
}

swarm.reset()

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05)
  if (state.playing) update(dt)
  hud.draw(state.score)
  renderer.render(scene, camera)
})
