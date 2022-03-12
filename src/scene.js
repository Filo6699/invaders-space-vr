import * as THREE from 'three'

export function createScene() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(innerWidth, innerHeight)
  renderer.xr.enabled = true
  // local-floor is not needed, everything is relative to the head anyway
  renderer.xr.setReferenceSpaceType('local')
  document.body.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.05, 100)
  scene.add(camera)

  const world = new THREE.Group()
  scene.add(world)

  const backdrop = new THREE.Group()
  const grid = new THREE.GridHelper(60, 60, 0x444444, 0x444444)
  grid.position.y = -1.6
  backdrop.add(grid)
  world.add(backdrop)

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  })

  return { renderer, scene, camera, world, backdrop }
}
