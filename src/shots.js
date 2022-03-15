import * as THREE from 'three'

const FORWARD = new THREE.Vector3(0, 0, 1)

export class Shots {
  constructor(parent, geometry) {
    this.parent = parent
    this.geometry = geometry
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.list = []
  }

  fire(from, dir, speed) {
    // should pool these probably
    const shot = new THREE.Mesh(this.geometry, this.material)
    shot.position.copy(from)
    shot.quaternion.setFromUnitVectors(FORWARD, dir)
    shot.userData = { velocity: dir.clone().multiplyScalar(speed), life: 4 }
    this.parent.add(shot)
    this.list.push(shot)
  }

  update(dt) {
    for (const shot of [...this.list]) {
      shot.position.addScaledVector(shot.userData.velocity, dt)
      shot.userData.life -= dt
      if (shot.userData.life <= 0) this.remove(shot)
    }
  }

  remove(shot) {
    this.parent.remove(shot)
    this.list.splice(this.list.indexOf(shot), 1)
  }

  clear() {
    for (const shot of [...this.list]) this.remove(shot)
  }
}
