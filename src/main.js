import * as THREE from 'three'
import { createScene } from './scene.js'
import { Swarm } from './swarm.js'

const { renderer, scene, camera, world } = createScene()
const swarm = new Swarm(world)
const clock = new THREE.Clock()

swarm.reset()

renderer.setAnimationLoop(() => {
  swarm.update(Math.min(clock.getDelta(), 0.05))
  if (swarm.landed) swarm.reset()
  renderer.render(scene, camera)
})
