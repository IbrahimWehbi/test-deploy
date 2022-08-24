import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// Raycaster
let raycaster = new THREE.Raycaster()
let INTERSECTED = null

// Cursor
 const cursor = { x: 0, y: 0}
 const pointer = new THREE.Vector2()

// Groups
const labTableGroup = new THREE.Group()
const pipetteGroup = new THREE.Group()
const testTubeHolderGroup = new THREE.Group()
const emptyTubeGroup = new THREE.Group()

// Textures
let envPlaneTexture = null

// Materials
const labTableMaterial = new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
})
const woodMaterial = new THREE.MeshStandardMaterial({
    color: '#36220a',
    metalness: 0,
    roughness: 1
})
const metalMaterial = new THREE.MeshStandardMaterial({
    color: '#7d7c7c',
    metalness: 0.6,
    roughness: 0.2
})
const glassTubeMaterial = new THREE.MeshStandardMaterial({
    color: '#b5b5b5',
    metalness: 0.6,
    roughness: 0.2,
    transparent: true,
    opacity: 0.32
})
const transparentReagentMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.16
})
const redLiquidMaterial = new THREE.MeshStandardMaterial({
    color: 'rgba(255, 0, 0)',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.32
})
const blueLiquidMaterial = new THREE.MeshStandardMaterial({
    color: 'rgba(0, 0, 255)',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
    opacity: 0.32
})

// Constants
const RADIAL_SEGMENTS = 32
const TUBE_RADIUS = 0.25

function GLTFModelCastsShadow(gltfScene)
{
    gltfScene.traverse((child) =>
    {
        if (child.isMesh)
        {
            child.castShadow = true
            child.receiveShadow = true
        }

    })
}

/**
 * GLTF Models Loading
 */
// Apple
gltfLoader.load(
    './models/Apple/apple.glb',
    (gltf) =>
    {
        GLTFModelCastsShadow(gltf.scene)
        const appleGroup = gltf.scene.children[0]
        appleGroup.scale.set(4, 4, 4)
        appleGroup.position.set(- 4, 0.18, 2)
        // gui.add(appleGroup.position, 'x').min(- 3).max(3).step(0.01).name('appleGroup pos x')
        // gui.add(appleGroup.position, 'y').min(- 3).max(3).step(0.01).name('appleGroup pos y')
        // gui.add(appleGroup.position, 'z').min(- 3).max(3).step(0.01).name('appleGroup pos z')
        appleGroup.rotation.set(- 0.25, 1.23, 1.38)
        // gui.add(appleGroup.rotation, 'x').min(- 3).max(3).step(0.01).name('appleGroup rot x')
        // gui.add(appleGroup.rotation, 'y').min(- 3).max(3).step(0.01).name('appleGroup rot y')
        // gui.add(appleGroup.rotation, 'z').min(- 3).max(3).step(0.01).name('appleGroup rot z')
        scene.add(appleGroup)
    }
)
// Frappe
gltfLoader.load(
    './models/frappe.glb',
    (gltf) =>
    {
        GLTFModelCastsShadow(gltf.scene)
        const frappeGroup = gltf.scene.children[0]
        frappeGroup.scale.set(4, 4, 4)
        frappeGroup.position.set(5, 0, 2)
        // gui.add(frappeGroup.position, 'x').min(- 3).max(3).step(0.01).name('frappeGroup x')
        // gui.add(frappeGroup.position, 'y').min(- 3).max(3).step(0.01).name('frappeGroup y')
        // gui.add(frappeGroup.position, 'z').min(- 3).max(3).step(0.01).name('frappeGroup x')
        frappeGroup.castShadow = true
        scene.add(frappeGroup)
    }
)
// Laptop
gltfLoader.load(
    './models/laptop.glb',
    (gltf) =>
    {
        GLTFModelCastsShadow(gltf.scene)
        const laptopGroup = gltf.scene.children[0]
        laptopGroup.scale.set(4, 4, 4)
        laptopGroup.rotation.set(0, - 0.5, 0)
        laptopGroup.position.set(3, 0, 0)
        laptopGroup.castShadow = true
        scene.add(laptopGroup)
    }
)

/**
 * Environment map
 */
// Vertical Plane in the distance with sun-set texture
 textureLoader.load(
	"./textures/sunset-scenery.jpg",
	// onLoad callback
	function (texture)
    {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
		envPlaneTexture = new THREE.MeshPhongMaterial( {
			map: texture,
		 })
        // Env Plane
        const envPlaneGroup = new THREE.Group()
        scene.add(envPlaneGroup)
        const envPlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(156, 92, 512),
            envPlaneTexture
        )
        envPlane.position.z = - 50
        envPlaneGroup.add(envPlane)
	},
	// onProgress callback currently not supported
	undefined,
	// onError callback
	function (err)
    {
		console.error('An error happened.')
	}
)
// Sun-set cube map
const environmentMap = cubeTextureLoader.load([
    './textures/environmentMaps/0/px.png',
    './textures/environmentMaps/0/nx.png',
    './textures/environmentMaps/0/py.png',
    './textures/environmentMaps/0/ny.png',
    './textures/environmentMaps/0/pz.png',
    './textures/environmentMaps/0/nz.png'
])
environmentMap.encoding = THREE.sRGBEncoding
// scene.background = environmentMap
scene.environment = environmentMap

/**
 * World
 */
// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 1, 5, -5)
scene.add(directionalLight)

// Lab table
scene.add(labTableGroup)
const labTableWidth = 15
const labTableHeight = 6
const labTableDepth = 0.4
const labTableGeometry = new THREE.BoxBufferGeometry(
    labTableWidth, labTableHeight, labTableDepth
)
const labTable = new THREE.Mesh(labTableGeometry, labTableMaterial)
labTable.receiveShadow = true
labTable.rotation.x = - Math.PI * 0.5
labTable.position.y -= labTableDepth * 0.5
labTableGroup.add(labTable)
// Invis plane for locking y-axis of pipette on it 
const invisPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(labTableWidth, labTableHeight),
    new THREE.MeshPhysicalMaterial({ color: 0x000000 })
)
invisPlane.userData.invisPlane = true
invisPlane.visible = false
invisPlane.position.y = labTableHeight * 0.5
scene.add(invisPlane)
/**
 * pipette
 */
scene.add(pipetteGroup)
// Rubber part
const pipettePlasticHeight = 1 
const pipetteRubber = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, RADIAL_SEGMENTS, 16),
    new THREE.MeshBasicMaterial({ color: 0x292723 })
)
pipetteRubber.castShadow = true
pipetteRubber.position.y = pipettePlasticHeight
pipetteGroup.add(pipetteRubber)
// Plastic part
const pipettePlastic = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.016, pipettePlasticHeight, RADIAL_SEGMENTS),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.32
    })
)
pipettePlastic.castShadow = true
pipettePlastic.position.y = pipettePlasticHeight * 0.5
pipetteGroup.add(pipettePlastic)
/**
 * Test Tube Holder
 */
 testTubeHolderGroup.position.x = - 2
scene.add(testTubeHolderGroup)
// Woood stand
const testTubeWoodDepth = 0.4
const testTubeWood = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, testTubeWoodDepth),
    woodMaterial
)
testTubeWood.castShadow = true
testTubeWood.receiveShadow = true
testTubeWood.rotation.x = - Math.PI * 0.5
testTubeWood.position.y = testTubeWoodDepth * 0.5
// gui.add(testTubeWood.position, 'y').min(- 3).max(3).step(0.01).name('testTubeWood elevation')
testTubeHolderGroup.add(testTubeWood)
// Vertical beam metal holder
const testTubeRodRadius = 0.04
const testTubeVRodHeight = 2.5
const testTubeVRod = new THREE.Mesh(
    new THREE.CylinderGeometry(testTubeRodRadius, testTubeRodRadius, testTubeVRodHeight, RADIAL_SEGMENTS),
    metalMaterial
)
testTubeVRod.castShadow = true
testTubeVRod.position.y = testTubeWoodDepth + ( testTubeVRodHeight * 0.5 )
// gui.add(testTubeVRod.position, 'y').min(- 3).max(3).step(0.01).name('testTubeVRod elevation')
testTubeHolderGroup.add(testTubeVRod)
// Horizontal beam metal holder
const testTubeHRodHeight = 0.5
const testTubeHRod = new THREE.Mesh(
    new THREE.CylinderGeometry(testTubeRodRadius, testTubeRodRadius, testTubeHRodHeight, RADIAL_SEGMENTS),
    metalMaterial
)
testTubeHRod.castShadow = true
testTubeHRod.rotation.z = - Math.PI * 0.5
testTubeHRod.position.x = testTubeHRodHeight * 0.5
// gui.add(testTubeHRod.position, 'x').min(- 3).max(3).step(0.01).name('testTubeVRod x')
testTubeHRod.position.y = testTubeWoodDepth + ( testTubeVRodHeight * 0.75 )
testTubeHolderGroup.add(testTubeHRod)
// Horizontal ring metal holder
const testTubeMetalHolder = new THREE.Mesh(
    new THREE.TorusGeometry(0.285, 0.035, 6, 32),
    metalMaterial
)
testTubeMetalHolder.castShadow = true
testTubeMetalHolder.rotation.x = - Math.PI * 0.5
testTubeMetalHolder.position.x = 0.8
testTubeMetalHolder.position.y = testTubeWoodDepth + ( testTubeVRodHeight * 0.75 )
testTubeHolderGroup.add(testTubeMetalHolder)
/**
 * Empty Tube
 */
scene.add(emptyTubeGroup)
// cylinder
const emptyTestTubeCylinderHeight = 2.4
const EmptyTestTubeCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(TUBE_RADIUS, TUBE_RADIUS, emptyTestTubeCylinderHeight, RADIAL_SEGMENTS, 1),
    glassTubeMaterial
)
EmptyTestTubeCylinder.userData.testBeaker = true
EmptyTestTubeCylinder.castShadow = true
EmptyTestTubeCylinder.position.x = - 1.2
EmptyTestTubeCylinder.position.y = TUBE_RADIUS + emptyTestTubeCylinderHeight * 0.5 + 0.4
scene.add(EmptyTestTubeCylinder)
// hemisphere
const emptytestTubeBottom = new THREE.Mesh(
    new THREE.SphereBufferGeometry(
        TUBE_RADIUS,
        RADIAL_SEGMENTS,
        Math.round(RADIAL_SEGMENTS * 0.25),
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.5
    ),
    glassTubeMaterial
)
emptytestTubeBottom.castShadow = true
emptytestTubeBottom.position.x = - 1.2
emptytestTubeBottom.position.y = TUBE_RADIUS + 0.4
emptytestTubeBottom.rotation.x = Math.PI
scene.add(emptytestTubeBottom)
/**
 * Reagent Sample
 */
let reagentSampleHeight = 0.1
let reagentSampleRadius = TUBE_RADIUS * 0.85
const reagentSample = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentSampleRadius, reagentSampleRadius, reagentSampleHeight, RADIAL_SEGMENTS),
    transparentReagentMaterial
)
reagentSample.position.x = - 1.2
reagentSample.position.y = TUBE_RADIUS * 0.9 + 0.5
scene.add(reagentSample)

// onClick add to reagent if pipette has liquid
reagentSample.callback = addToReagent
EmptyTestTubeCylinder.callback = addToReagent
emptytestTubeBottom.callback = addToReagent

let reagentSelected = ""
let reagentSampleClickedBefore = false
function addToReagent()
{
    if (reagentSampleHeight <= 2.2)
    {
        if (reagentSelected == "NaOH") // increase reagent with red
        {
            if (!reagentSampleClickedBefore)
            {
                reagentSample.material.color.setRGB(0, 0, 0)
                reagentSampleClickedBefore = true
            }

            reagentSample.material.color.r += 0.1
            reagentSample.material.color.g = 0
            reagentSample.material.color.b -= 0.02
            if (reagentSample.material.color.r > 1) reagentSample.material.color.r = 1
            if (reagentSample.material.color.b < 0) reagentSample.material.color.b = 0

            reagentSample.material.opacity += 0.01
            reagentSampleHeight += 0.1
            reagentSample.geometry.dispose()
            reagentSample.geometry = new THREE.CylinderGeometry(reagentSampleRadius, reagentSampleRadius, reagentSampleHeight, RADIAL_SEGMENTS)
            reagentSample.position.y += 0.05

            // decrease red reagent amount
            NaOHLiquidHeight -= 0.05
            NaOHLiquid.geometry.dispose()
            NaOHLiquid.geometry = new THREE.CylinderGeometry(reagentRadius, reagentRadius, NaOHLiquidHeight, RADIAL_SEGMENTS)
            NaOHLiquid.position.y -= 0.025
        }
        else if (reagentSelected == "CuCl2") // increase reagent with blue
        {
            if (!reagentSampleClickedBefore)
            {
                reagentSample.material.color.setRGB(0, 0, 0)
                reagentSampleClickedBefore = true
            }

            reagentSample.material.color.r -= 0.02
            reagentSample.material.color.g = 0
            reagentSample.material.color.b += 0.1
            if (reagentSample.material.color.r < 0) reagentSample.material.color.r = 0
            if (reagentSample.material.color.b > 1) reagentSample.material.color.b = 1

            reagentSample.material.opacity += 0.01
            reagentSampleHeight += 0.1
            reagentSample.geometry.dispose()
            reagentSample.geometry = new THREE.CylinderGeometry(reagentSampleRadius, reagentSampleRadius, reagentSampleHeight, RADIAL_SEGMENTS)
            reagentSample.position.y += 0.05

            // decrease blue reagent amount
            CuCl2LiquidHeight -= 0.05
            CuCl2Liquid.geometry.dispose()
            CuCl2Liquid.geometry = new THREE.CylinderGeometry(reagentRadius, reagentRadius, CuCl2LiquidHeight, RADIAL_SEGMENTS)
            CuCl2Liquid.position.y -= 0.025
        }
    }
}

function resetReagent() {
    // reset geometry
    reagentSampleHeight = 0.1
    reagentSample.geometry.dispose()
    reagentSample.geometry = new THREE.CylinderGeometry(reagentSampleRadius, reagentSampleRadius, reagentSampleHeight, RADIAL_SEGMENTS)
    reagentSample.position.y =  TUBE_RADIUS * 0.9 + 0.5
    // reset color
    reagentSample.material.opacity = 0.16
    reagentSample.material.color.setRGB(1, 1, 1)
    reagentSampleClickedBefore = false
    // reset pipette
    reagentSelected = ""
    pipettePlastic.material.color.setHex(0xb5b5b5)
    // reset red/blue liquids
    CuCl2LiquidHeight = 1.1
    CuCl2Liquid.geometry.dispose()
    CuCl2Liquid.geometry = new THREE.CylinderGeometry(reagentRadius, reagentRadius, CuCl2LiquidHeight, RADIAL_SEGMENTS)
    CuCl2Liquid.position.y = 0.6

    NaOHLiquidHeight = 1.1
    NaOHLiquid.geometry.dispose()
    NaOHLiquid.geometry = new THREE.CylinderGeometry(reagentRadius, reagentRadius, NaOHLiquidHeight, RADIAL_SEGMENTS)
    NaOHLiquid.position.y = 0.6
    
}
/**
 * NaOH Liquid
 */
// red liquid
const reagentRadius = 0.5
let NaOHLiquidHeight = 1.1
const NaOHLiquid = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentRadius, reagentRadius, NaOHLiquidHeight, RADIAL_SEGMENTS),
    redLiquidMaterial
)
NaOHLiquid.castShadow = true
NaOHLiquid.position.x = 0.5
NaOHLiquid.position.y = 0.6
scene.add(NaOHLiquid)
// red liquid beaker
const NaOHBeakerHeight = 1.3
const NaOHBeaker = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentRadius + 0.05, reagentRadius + 0.05, NaOHBeakerHeight, RADIAL_SEGMENTS),
    glassTubeMaterial.clone()
)
NaOHBeaker.castShadow = true
NaOHBeaker.position.x = 0.5
NaOHBeaker.position.y = NaOHBeakerHeight * 0.5
scene.add(NaOHBeaker)
NaOHBeaker.callback = () =>
{
    reagentSelected = "NaOH"
    pipettePlastic.material.color.setHex(0xff0000)
}
/**
 * CuCl2 Liquid
 */
// blue liquid
let CuCl2LiquidHeight = 1.1
 const CuCl2Liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentRadius, reagentRadius, CuCl2LiquidHeight, RADIAL_SEGMENTS),
    blueLiquidMaterial
)
CuCl2Liquid.castShadow = true
CuCl2Liquid.position.x = 2.5
CuCl2Liquid.position.y = 0.6
scene.add(CuCl2Liquid)
// blue liquid beaker
const CuCl2BeakerHeight = 1.3
const CuCl2Beaker = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentRadius + 0.05, reagentRadius + 0.05, CuCl2BeakerHeight, RADIAL_SEGMENTS),
    glassTubeMaterial.clone()
)
CuCl2Beaker.castShadow = true
CuCl2Beaker.position.x = 2.5
CuCl2Beaker.position.y = CuCl2BeakerHeight * 0.5
scene.add(CuCl2Beaker)
CuCl2Beaker.callback = () =>
{
    reagentSelected = "CuCl2"
    pipettePlastic.material.color.setHex(0x0000ff)
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 3
camera.position.z = 11
camera.lookAt(new THREE.Vector3(0, 2, 0))
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // update custom camera controls
    const parallaxX = cursor.x * 4
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 6 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 10 * deltaTime
    camera.lookAt(new THREE.Vector3(0, 2, 0))
    camera.updateMatrixWorld()

    // find intersections
    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(scene.children, false)

    if (intersects.length > 0)
    {
        // update pipette on y-axis
        for (let i of intersects)
        {
            if (i.object.userData.invisPlane)
            {
                pipetteGroup.position.x = i.point.x
                pipetteGroup.position.y = i.point.y
            }
        }
        // update hovered as green
        if (INTERSECTED != intersects[0].object)
        {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

            INTERSECTED = intersects[0].object
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
            INTERSECTED.material.emissive.setHex(0x00ff00)
        }
    }
    else
    {
        // update greened materials back to original
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
        INTERSECTED = null
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Test Tube Holder 1
 */
let testTube1 = new THREE.Group()
testTube1.rotation.y = - 0.5
testTube1.position.x = - 3.3
testTube1.position.z = 1.4
scene.add(testTube1)

const testTubeWood1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.4),
    new THREE.MeshStandardMaterial({
        color: '#36220a',
        metalness: 0,
        roughness: 1
    })
)
testTubeWood1.castShadow = true
testTubeWood1.receiveShadow = true
testTubeWood1.rotation.x = - Math.PI * 0.5
testTubeWood1.position.y = 0.2
testTube1.add(testTubeWood1)

const testTubeVRod1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.5, 36),
    new THREE.MeshStandardMaterial({
        color: '#7d7c7c',
        metalness: 0.6,
        roughness: 0.2
    })
)
testTubeVRod1.castShadow = true
testTubeVRod1.position.y = 1.4
testTube1.add(testTubeVRod1)

const testTubeHRod1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 36),
    new THREE.MeshStandardMaterial({
        color: '#7d7c7c',
        metalness: 0.6,
        roughness: 0.2
    })
)
testTubeHRod1.castShadow = true
testTubeHRod1.rotation.z = - Math.PI * 0.5
testTubeHRod1.position.x = 0.25
testTubeHRod1.position.y = 2.2
testTube1.add(testTubeHRod1)

const testTubeMetalHolder1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.29, 0.0389, 8, 50),
    new THREE.MeshStandardMaterial({
        color: '#7d7c7c',
        metalness: 0.6,
        roughness: 0.2
    })
)
testTubeMetalHolder1.castShadow = true
testTubeMetalHolder1.rotation.x = - Math.PI * 0.5
testTubeMetalHolder1.position.x = 0.8
testTubeMetalHolder1.position.y = 2.2
testTube1.add(testTubeMetalHolder1)

// empty tube on metal holder
const EmptytestTube1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 2.4, 22),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.32
    })
)
EmptytestTube1.castShadow = true
EmptytestTube1.position.x = 0.8
EmptytestTube1.position.y = 2.1
testTube1.add(EmptytestTube1)

const EmptytestTubeBottom1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(TUBE_RADIUS, RADIAL_SEGMENTS, Math.round(RADIAL_SEGMENTS / 4), 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.32
    })
)
EmptytestTubeBottom1.castShadow = true
EmptytestTubeBottom1.rotation.x = Math.PI
EmptytestTubeBottom1.position.x = 0.8
EmptytestTubeBottom1.position.y = 0.9
testTube1.add(EmptytestTubeBottom1)

/**
 * Reagent Sample
 */
const reagentSample1 = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentSampleRadius, reagentSampleRadius, 1, 22),
    new THREE.MeshStandardMaterial({
        color: '#5f4087',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.32
    })
)
reagentSample1.position.x = 0.8
reagentSample1.position.y = 1.3
testTube1.add(reagentSample1)

// tube on the ground
let tubeOnGroundGroup = new THREE.Group()
tubeOnGroundGroup.rotation.x = 1.5
tubeOnGroundGroup.rotation.z = 1.5
tubeOnGroundGroup.position.x = - 2
tubeOnGroundGroup.position.y = 0.2
tubeOnGroundGroup.position.z = - 1.2
scene.add(tubeOnGroundGroup)

// empty tube on metal holder
const tubeOnGround1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 2.4, 22),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.32
    })
)
tubeOnGround1.castShadow = true
tubeOnGround1.position.x = 0.8
tubeOnGround1.position.y = 2.1
tubeOnGroundGroup.add(tubeOnGround1)

const tubeOnGroundBottom1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(TUBE_RADIUS, RADIAL_SEGMENTS, Math.round(RADIAL_SEGMENTS / 4), 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.32
    })
)
tubeOnGroundBottom1.castShadow = true
tubeOnGroundBottom1.rotation.x = Math.PI
tubeOnGroundBottom1.position.x = 0.8
tubeOnGroundBottom1.position.y = 0.9
tubeOnGroundGroup.add(tubeOnGroundBottom1)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('mousemove', (event) =>
{
   // for camera damping
   cursor.x = event.clientX / sizes.width - 0.5
   cursor.y = event.clientY / sizes.height - 0.5

   // for object intersects
   pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
   pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
})

// let arrow = null
window.addEventListener('mousedown', event =>
{
    event.preventDefault()

    if (event.which === 3) // right click
    {
        resetReagent()
        return
    }
    else if (event.which === 2) // scroll wheel click
    {
        return
    }
    else if (event.which === 1) // left click
    {
        // cast ray downwards if beaker is below fill it with reagent
        const rayOrigin = new THREE.Vector3()
        pipetteGroup.getWorldPosition(rayOrigin)
        const rayDir = pipetteGroup.up.clone().multiplyScalar(- 1)
        raycaster.set(rayOrigin, rayDir)
        // scene.remove (arrow)
        // arrow = new THREE.ArrowHelper(rayDir, rayOrigin, 12, Math.random() * 0xffffff )
        // scene.add(arrow)
        const modelsBelow = raycaster.intersectObjects(scene.children, false)
        if (modelsBelow.length > 0)
        {
            modelsBelow.forEach(model =>
            {
                if (model.object.userData.testBeaker && model.distance > 0) addToReagent()
            })
        }

        if (INTERSECTED)
        {
            if (INTERSECTED.callback) INTERSECTED.callback()
        }
    }
}, false)

window.addEventListener('contextmenu', event => event.preventDefault())

function removeObject3D(object3D)
{
    if (!(object3D instanceof THREE.Object3D)) return false
  
    if (object3D.geometry) object3D.geometry.dispose()
  
    if (object3D.material) {
        if (object3D.material instanceof Array) {
            object3D.material.forEach(material => { 
              // clearing all the maps
              for (const [prop, value] of Object.entries(material)) {
                if (value && value.dispose instanceof Function) value.dispose()
              }
              material.dispose()
            })
        } else {
            // clearing all the maps
            for (const [prop, value] of Object.entries(object3D.material)) {
              if (value && value.dispose instanceof Function) value.dispose()
            }
            object3D.material.dispose()
        }
    }
    object3D.removeFromParent() // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true
}