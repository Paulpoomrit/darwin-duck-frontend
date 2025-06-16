import { DirectionalLight, EquirectangularReflectionMapping, GridHelper, Scene } from 'three'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

export default class Environment {
  scene: Scene
  light: DirectionalLight

  constructor(scene: Scene) {
    this.scene = scene

    this.scene.add(new GridHelper(50, 50))

    this.light = new DirectionalLight(0xffffff, Math.PI)
    this.light.position.set(65.7, 19.2, 50.2)
    this.light.castShadow = true
    this.scene.add(this.light)

  }

  async init() {
    await new RGBELoader().loadAsync('img/venice_sunset_1k.hdr').then((texture) => {
      texture.mapping = EquirectangularReflectionMapping
      this.scene.environment = texture
      this.scene.background = texture
      this.scene.backgroundBlurriness = 0.4
    })
  }
}