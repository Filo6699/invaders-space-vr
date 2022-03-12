import { createScene } from './scene.js'

const { renderer, scene, camera } = createScene()

renderer.setAnimationLoop(() => renderer.render(scene, camera))
