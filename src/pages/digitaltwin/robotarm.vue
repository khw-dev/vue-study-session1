<template>
  <div ref="canvasContainer" class="fill-height w-100" style="height: 80vh" />
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL

const overrideSpeed = 100
const canvasContainer = ref(null)
const currentPhaseLabel = ref('')

let resizeObserver
let scene, camera, renderer, controls, animationId
let robotArmGroup
let handAnchor = null
let grippedObject = null
const robot = { j1: null, j2: null, j3: null, j4: null, j5: null, j6: null }

let currentPhase = 0
let phaseTimer = 0

const scenario = [
  { label: 'Home', joints: [-0.8, 0.3, 0.3, -0.8, 0, 0], grip: false },
  { label: 'Move to Pick', joints: [-1.2, 0.4, 0.4, -0.8, 0, 1.5], grip: false },
  { label: 'Picking', joints: [-1.2, 0.4, 0.4, -0.8, 0, 1.5], grip: true },
  { label: 'Lifting', joints: [1.2, 0.4, 0.4, -0.8, 0, 0], grip: true },
  { label: 'Moving', joints: [1.2, 0.4, 0.8, -1.8, 0, 0], grip: true },
  { label: 'Placing', joints: [1.2, 0.4, 0.8, -1.8, 0, 1.5], grip: true },
  { label: 'Releasing', joints: [1.2, 0.4, 0.8, -1.8, 0, 1.5], grip: false },
  { label: 'Return Home', joints: [-0.4, 0.2, 0.2, -0.6, 0, 0], grip: false },
]

function initThreeJS() {
  if (!canvasContainer.value) return

  // 1. Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xc8_cc_cf)

  // 2. Camera
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(2, 2, 2)

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: window.devicePixelRatio < 2,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = false
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.append(renderer.domElement)

  // 4. Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0.5, 0)
  controls.maxPolarAngle = Math.PI / 2.2

  // 5. Lights
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  const roomEnvironment = new RoomEnvironment()
  scene.environment = pmremGenerator.fromScene(roomEnvironment).texture

  const cameraLight = new THREE.DirectionalLight(0xb9_e4_fa, 1)
  cameraLight.position.set(10, 20, 10)

  camera.add(cameraLight)

  // 6. Environment
  const gridHelper = new THREE.GridHelper(20, 20, 0xa4_a7_ab, 0xa4_a7_ab)
  scene.add(gridHelper)
  const planeGeometry = new THREE.PlaneGeometry(20, 20)
  const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.1 })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)

  const ktx2Loader = new KTX2Loader()
  ktx2Loader.setTranscoderPath(`${baseUrl}basis/`)
  ktx2Loader.detectSupport(renderer)

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(`${baseUrl}draco/`)

  const loader = new GLTFLoader()
  loader.setKTX2Loader(ktx2Loader)
  loader.setDRACOLoader(dracoLoader)

  loader.load(
    `${baseUrl}robot-arm.glb`,
    (gltf) => {
      const model = gltf.scene
      scene.add(model)

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false
          child.receiveShadow = false
        }
      })

      robotArmGroup = model.getObjectByName('main')

      if (!robotArmGroup) {
        console.error('그룹을 찾을 수 없습니다. 블렌더 이름을 확인하세요.')
      }

      handAnchor = model.getObjectByName('holdobjecthand')

      robot.j1 = model.getObjectByName('0')
      robot.j2 = model.getObjectByName('1')
      robot.j3 = model.getObjectByName('2')
      robot.j4 = model.getObjectByName('3')
      robot.j5 = model.getObjectByName('4')
      robot.j6 = model.getObjectByName('5')

      animate()
    },
    undefined,
    (error) => {
      console.error('An error happened loading the GLTF:', error)
    }
  )
}

function animate() {
  animationId = requestAnimationFrame(animate)

  if (robotArmGroup) {
    runScenario()
  }

  if (controls) controls.update()
  if (renderer && scene && camera) renderer.render(scene, camera)
}

function runScenario() {
  const target = scenario[currentPhase]
  currentPhaseLabel.value = target.label

  const speed = 0.0005 * overrideSpeed

  robot.j1.rotation.z = THREE.MathUtils.lerp(robot.j1.rotation.z, target.joints[0], speed)
  robot.j2.rotation.x = THREE.MathUtils.lerp(robot.j2.rotation.x, target.joints[1], speed)
  robot.j3.rotation.z = THREE.MathUtils.lerp(robot.j3.rotation.z, target.joints[2], speed)
  robot.j4.rotation.x = THREE.MathUtils.lerp(robot.j4.rotation.x, target.joints[3], speed)
  robot.j5.rotation.y = THREE.MathUtils.lerp(robot.j5.rotation.y, target.joints[4], speed)
  robot.j6.rotation.x = THREE.MathUtils.lerp(robot.j6.rotation.x, target.joints[5], speed)

  if (target.grip) {
    gripObject()
  } else {
    releaseObject()
  }

  const dist =
    Math.abs(robot.j1.rotation.z - target.joints[0]) +
    Math.abs(robot.j2.rotation.x - target.joints[1])
  if (dist < 0.01) {
    phaseTimer++
    if (phaseTimer > 50 * (100 / Math.max(overrideSpeed, 1))) {
      phaseTimer = 0
      currentPhase++
      if (currentPhase >= scenario.length) currentPhase = 0
    }
  }
}

function gripObject() {
  if (!handAnchor || grippedObject) return

  const geometry = new THREE.BoxGeometry(6, 6, 6)
  const material = new THREE.MeshStandardMaterial({ color: 0xff_00_00 })
  grippedObject = new THREE.Mesh(geometry, material)

  grippedObject.position.set(0, 0, 0)

  handAnchor.add(grippedObject)
}

function releaseObject() {
  if (!handAnchor || !grippedObject) return

  handAnchor.remove(grippedObject)

  grippedObject.geometry.dispose()
  grippedObject.material.dispose()

  grippedObject = null
}

function onWindowResize() {
  if (!canvasContainer.value || !camera || !renderer) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  if (width === 0 || height === 0) return

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

onMounted(async () => {
  await nextTick()
  initThreeJS()

  resizeObserver = new ResizeObserver(() => {
    onWindowResize()
  })

  if (canvasContainer.value) {
    resizeObserver.observe(canvasContainer.value)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)

  if (resizeObserver) resizeObserver.disconnect()

  if (renderer) renderer.dispose()
})
</script>
