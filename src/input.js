import * as THREE from 'three'

function laser() {
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -3)])
  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }))
}

export function setupInput({ renderer, scene, camera, onFire }) {
  const el = renderer.domElement
  const raycaster = new THREE.Raycaster()
  let drag = null
  let yaw = 0
  let pitch = 0

  el.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, y: e.clientY, yaw, pitch, moved: false }
    el.setPointerCapture(e.pointerId)
  })

  el.addEventListener('pointercancel', () => (drag = null))

  el.addEventListener('pointermove', e => {
    if (!e.buttons) drag = null
    if (!drag) return
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    if (Math.hypot(dx, dy) > 8) drag.moved = true // so a tap with a shaky finger still shoots
    if (!drag.moved) return
    yaw = drag.yaw + dx * 0.005
    pitch = THREE.MathUtils.clamp(drag.pitch + dy * 0.005, -1.2, 1.2)
    camera.rotation.set(pitch, yaw, 0, 'YXZ')
  })

  el.addEventListener('pointerup', e => {
    if (drag && !drag.moved) {
      const ndc = new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      onFire(raycaster.ray.origin.clone(), raycaster.ray.direction.clone())
    }
    drag = null
  })

  for (const i of [0, 1]) {
    const controller = renderer.xr.getController(i)
    controller.addEventListener('connected', e => {
      if (e.data.targetRayMode === 'tracked-pointer') controller.add(laser())
    })
    controller.addEventListener('disconnected', () => controller.clear())
    controller.addEventListener('select', () => {
      const origin = new THREE.Vector3().setFromMatrixPosition(controller.matrixWorld)
      const dir = new THREE.Vector3(0, 0, -1).transformDirection(controller.matrixWorld)
      onFire(origin, dir)
    })
    scene.add(controller)
  }

  return {
    reset() {
      yaw = 0
      pitch = 0
      camera.position.set(0, 0, 0)
      camera.rotation.set(0, 0, 0)
    },
  }
}
