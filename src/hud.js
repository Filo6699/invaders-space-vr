import * as THREE from 'three'

export class Hud {
  constructor(camera) {
    this.canvas = document.querySelector('#hud')
    this.ctx = this.canvas.getContext('2d')
    this.texture = new THREE.CanvasTexture(this.canvas)

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.05),
      new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, depthTest: false })
    )
    this.mesh.position.set(0, 0.15, -0.6)
    this.mesh.renderOrder = 1
    this.mesh.visible = false
    camera.add(this.mesh)

    this.last = null
  }

  draw(score) {
    if (score === this.last) return
    this.last = score

    const { ctx, canvas } = this
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '20px monospace'
    ctx.textBaseline = 'top'
    ctx.fillStyle = '#fff'
    ctx.fillText(`SCORE ${score}`, 12, 20)
    this.texture.needsUpdate = true
  }
}
