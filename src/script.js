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

// Loaded Bottle models
let bottle1Group = new THREE.Group()
let bottle2Group = new THREE.Group()

// Load External Assets
gltfLoader.load(
    '/models/Apple/apple.glb',
    (gltf) =>
    {
        const appleGroup = gltf.scene.children[0]
        appleGroup.scale.set(4, 4, 4)
        appleGroup.position.set(- 4, 0.2 ,2)
        appleGroup.rotation.set(0, 0, 1.3)
        appleGroup.castShadow = true
        scene.add(gltf.scene.children[0])
    }
)
gltfLoader.load(
    '/models/frappe.glb',
    (gltf) =>
    {
        const appleGroup = gltf.scene.children[0]
        appleGroup.scale.set(4, 4, 4)
        appleGroup.position.set(5, 0.2, 2)
        appleGroup.castShadow = true
        scene.add(gltf.scene.children[0])
    }
)
gltfLoader.load(
    '/models/laptop.glb',
    (gltf) =>
    {
        const appleGroup = gltf.scene.children[0]
        appleGroup.scale.set(4, 4, 4)
        appleGroup.rotation.set(0, - 0.5, 0)
        appleGroup.position.set(3, 0.2, 0)
        appleGroup.castShadow = true
        scene.add(gltf.scene.children[0])
    }
)

/**
 * Environment map
 */
 const textureLoader = new THREE.TextureLoader();
 let envPlaneTexture;
 textureLoader.load(
	"/textures/sunset-scenery.jpg",
    
	// onLoad callback
	function ( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
		envPlaneTexture = new THREE.MeshPhongMaterial( {
			map: texture,
            // doubleSide: true
		 })
         /**
         * Env Plane
         */
        let envPlaneGroup = new THREE.Group()
        scene.add(envPlaneGroup)
        const envPlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(128, 64, 32),
            envPlaneTexture
        )
        envPlane.position.z = - 50
        envPlaneGroup.add(envPlane)
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.' );
	}
)
 const cubeTextureLoader = new THREE.CubeTextureLoader()
 const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])
environmentMap.encoding = THREE.sRGBEncoding
// scene.background = environmentMap
scene.environment = environmentMap

/**
 * Lab Table
 */
let labTableGroup = new THREE.Group()
scene.add(labTableGroup)

const labTable = new THREE.Mesh(
    new THREE.BoxBufferGeometry(14, 5, 0.4),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
labTable.receiveShadow = true
labTable.rotation.x = - Math.PI * 0.5
labTable.position.y -= 0.2
labTableGroup.add(labTable)

/**
 * Invis Plane
 */
const invisPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(14, 5),
    new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0
    })
)
invisPlane.userData.invisPlane = true
invisPlane.visible = false
invisPlane.position.y = 2.8
invisPlane.position.z = 0
scene.add(invisPlane)

/**
 * pipette
 */
const pipetteGroup = new THREE.Group()
pipetteGroup.position.x = 1
pipetteGroup.position.y = 1.2
scene.add(pipetteGroup)

// plastic part
const pipettePlastic = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.015, 0.8, 36),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
pipettePlastic.castShadow = true
pipettePlastic.position.x = 0
pipettePlastic.position.y = 0.4
pipetteGroup.add(pipettePlastic)

// rubber part
const pipetteRubber = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 32, 16),
    new THREE.MeshBasicMaterial({
        color: 0x292723,
        metalness: 0,
        roughness: 0.6,
    })
)
pipetteRubber.castShadow = true
pipetteRubber.position.x = 0
pipetteRubber.position.y = 0.9
pipetteGroup.add( pipetteRubber )

/**
 * Test Tube Holder
 */
const testTubeWood = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.4),
    new THREE.MeshStandardMaterial({
        color: '#36220a',
        metalness: 0,
        roughness: 1
    })
)
testTubeWood.castShadow = true
testTubeWood.receiveShadow = true
testTubeWood.rotation.x = - Math.PI * 0.5
testTubeWood.position.x = - 2
testTubeWood.position.y = 0.2
scene.add(testTubeWood)

const testTubeVRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.5, 36),
    new THREE.MeshStandardMaterial({
        color: '#7d7c7c',
        metalness: 0.6,
        roughness: 0.2
    })
)
testTubeVRod.castShadow = true
testTubeVRod.position.x = - 2
testTubeVRod.position.y = 1.4
scene.add(testTubeVRod)

const testTubeHRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 36),
    new THREE.MeshStandardMaterial({
        color: '#7d7c7c',
        metalness: 0.6,
        roughness: 0.2
    })
)
testTubeHRod.castShadow = true
testTubeHRod.rotation.z = - Math.PI * 0.5
testTubeHRod.position.x = -1.75
testTubeHRod.position.y = 2.2
scene.add(testTubeHRod)

const testTubeMetalHolder = new THREE.Mesh(
    new THREE.TorusGeometry(0.29, 0.0389, 8, 50),
    new THREE.MeshStandardMaterial({
        color: '#7d7c7c',
        metalness: 0.6,
        roughness: 0.2
    })
)
testTubeMetalHolder.castShadow = true
testTubeMetalHolder.rotation.x = - Math.PI * 0.5
testTubeMetalHolder.position.x = - 1.2
testTubeMetalHolder.position.y = 2.2
scene.add(testTubeMetalHolder)

// empty tube on metal holder
const EmptytestTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 2.4, 22),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
EmptytestTube.castShadow = true
EmptytestTube.position.x = - 1.2
EmptytestTube.position.y = 2.1
scene.add(EmptytestTube)

let radius = 0.25;
let radialSegments = 32;
const EmptytestTubeBottom = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, radialSegments, Math.round(radialSegments / 4), 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
EmptytestTubeBottom.castShadow = true
EmptytestTubeBottom.rotation.x = Math.PI
EmptytestTubeBottom.position.x = - 1.2
EmptytestTubeBottom.position.y = 0.9
scene.add(EmptytestTubeBottom)

/**
 * Reagent Sample
 */
let reagentSampleHeight = 0.1
let reagentSamplRadius = 0.22
let NaOHLiquidHeight = 0.8
let CuCl2LiquidHeight = 0.8
const reagentSample = new THREE.Mesh(
    new THREE.CylinderGeometry(reagentSamplRadius, reagentSamplRadius, reagentSampleHeight, 22),
    new THREE.MeshStandardMaterial({
        color: '#ffffff',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.34
    })
)
reagentSample.position.x = - 1.2
reagentSample.position.y = 1
scene.add(reagentSample)

reagentSample.callback = addToReagent
EmptytestTube.callback = addToReagent
EmptytestTubeBottom.callback = addToReagent

let reagentSelected = "";
let reagentSampleClickedBefore = false;
function addToReagent() {
    if (reagentSampleHeight <= 2.2)
    {
        if (reagentSelected == "NaOH")
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

            // increase reagent with red
            reagentSampleHeight += 0.1
            reagentSample.geometry.dispose()
            reagentSample.geometry = new THREE.CylinderGeometry(reagentSamplRadius, reagentSamplRadius, reagentSampleHeight, 22)
            reagentSample.position.y += 0.05
        }
        else if (reagentSelected == "CuCl2")
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

            // increase reagent with blue
            reagentSampleHeight += 0.1
            reagentSample.geometry.dispose()
            reagentSample.geometry = new THREE.CylinderGeometry(reagentSamplRadius, reagentSamplRadius, reagentSampleHeight, 22)
            reagentSample.position.y += 0.05
        }
    }
}

function resetReagent() {
    // reset geometry
    reagentSample.geometry.dispose()
    reagentSampleHeight = 0.1
    reagentSample.geometry = new THREE.CylinderGeometry(reagentSamplRadius, reagentSamplRadius, reagentSampleHeight, 22)
    reagentSample.position.y = 1
    // reset color
    reagentSample.material.color.setRGB(1, 1, 1)
    reagentSampleClickedBefore = false
}

/**
 * NaOHTube
 */
// red liquid
const NaOHTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, NaOHLiquidHeight, 22),
    new THREE.MeshStandardMaterial({
        color: 'rgba(255, 0, 0)',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.34
    })
)
NaOHTube.castShadow = true
NaOHTube.position.x = 0.5
NaOHTube.position.y = 0.5
scene.add(NaOHTube)

// red liquid beaker
const NaOHBeakerHeight = 1.2
const NaOHBeaker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, NaOHBeakerHeight, 32),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
NaOHBeaker.name = "beaker"
NaOHBeaker.castShadow = true
NaOHBeaker.position.x = 0.5
NaOHBeaker.position.y = 0.6
scene.add(NaOHBeaker)
NaOHBeaker.callback = () =>
{
    reagentSelected = "NaOH"
}

/**
 * CuCl2Tube
 */
// blue liquid
 const CuCl2Tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, CuCl2LiquidHeight, 22),
    new THREE.MeshStandardMaterial({
        color: 'rgba(0, 0, 255)',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.34
    })
)
CuCl2Tube.castShadow = true
CuCl2Tube.position.x = 2.5
CuCl2Tube.position.y = 0.5
scene.add(CuCl2Tube)

// blue liquid beaker
const CuCl2BeakerHeight = 1.2
const CuCl2Beaker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, CuCl2BeakerHeight, 32),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
CuCl2Beaker.name = "beaker"
CuCl2Beaker.castShadow = true
CuCl2Beaker.position.x = 2.5
CuCl2Beaker.position.y = 0.6
scene.add(CuCl2Beaker)
CuCl2Beaker.callback = () =>
{
    reagentSelected = "CuCl2"
}

/**
 * Lights
 */
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

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
 * Cursor
 */
 const cursor = {}
 cursor.x = 0
 cursor.y = 0
 
 let INTERSECTED;
 const pointer = new THREE.Vector2();

 window.addEventListener('mousemove', (event) =>
 {
    // for camera damping
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
 })

/**
 * Raycaster
 */
 let raycaster = new THREE.Raycaster();
 
 function onDocumentMouseDown(event)
 {
    event.preventDefault();

    if (event.which === 3)
    {
        resetReagent()
        return
    }
    else if (event.which === 2)
    {
        return
    }

    raycaster.setFromCamera(pointer, camera);

    let intersects = raycaster.intersectObjects(scene.children); 

    if (intersects.length > 0)
    {
        if (intersects[0].object.callback) intersects[0].object.callback();
    }
}

window.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('contextmenu', event => event.preventDefault());

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
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 10 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 10 * deltaTime
    camera.lookAt(new THREE.Vector3(0, 2, 0))
    camera.updateMatrixWorld()

    // find intersections
    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if (intersects.length > 0)
    {
        for (let i of intersects)
        {
            if (i.object.userData.invisPlane)
            {
                // update pipette
                pipetteGroup.position.x = i.point.x
                pipetteGroup.position.y = i.point.y
            }
        }
        if (INTERSECTED != intersects[0].object)
        {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0x00ff00);
        }
    }
    else
    {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
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
        opacity: 0.34
    })
)
EmptytestTube1.castShadow = true
EmptytestTube1.position.x = 0.8
EmptytestTube1.position.y = 2.1
testTube1.add(EmptytestTube1)

const EmptytestTubeBottom1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, radialSegments, Math.round(radialSegments / 4), 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
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
    new THREE.CylinderGeometry(reagentSamplRadius, reagentSamplRadius, 1, 22),
    new THREE.MeshStandardMaterial({
        color: '#5f4087',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.34
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
        opacity: 0.34
    })
)
tubeOnGround1.castShadow = true
tubeOnGround1.position.x = 0.8
tubeOnGround1.position.y = 2.1
tubeOnGroundGroup.add(tubeOnGround1)

const tubeOnGroundBottom1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, radialSegments, Math.round(radialSegments / 4), 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
tubeOnGroundBottom1.castShadow = true
tubeOnGroundBottom1.rotation.x = Math.PI
tubeOnGroundBottom1.position.x = 0.8
tubeOnGroundBottom1.position.y = 0.9
tubeOnGroundGroup.add(tubeOnGroundBottom1)