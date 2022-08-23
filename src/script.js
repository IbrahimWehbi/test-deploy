import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lab Table
 */
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
scene.add(labTable)

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
testTubeWood.rotation.x = - Math.PI * 0.5
testTubeWood.position.x = -4
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
testTubeVRod.position.x = -4
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
testTubeHRod.position.x = -3.75
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
testTubeMetalHolder.position.x = -3.2
testTubeMetalHolder.position.y = 2.2
scene.add(testTubeMetalHolder)

const EmptytestTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 3, 22),
    new THREE.MeshStandardMaterial({
        color: '#b5b5b5',
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.34
    })
)
EmptytestTube.castShadow = true
EmptytestTube.position.x = - 3.2
EmptytestTube.position.y = 2.4
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
EmptytestTubeBottom.position.x = - 3.2
EmptytestTubeBottom.position.y = 0.9
scene.add(EmptytestTubeBottom)

/**
 * Reagent Sample
 */
let reagentSampleHeight = 0.1
let reagentSamplRadius = 0.22
let NaOHTubeHeight = 1
let CuCl2TubeHeight = 1
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
reagentSample.position.x = - 3.2
reagentSample.position.y = 1
scene.add(reagentSample)

reagentSample.callback = addToReagent
EmptytestTube.callback = addToReagent
EmptytestTubeBottom.callback = addToReagent

let reagentSelected = "";
let reagentSampleClickedBefore = false;
function addToReagent() {
    if (reagentSampleHeight <= 2.7)
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
 const NaOHTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.5, NaOHTubeHeight, 22),
    new THREE.MeshStandardMaterial({
        color: 'rgba(255, 0, 0)',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.34
    })
)
NaOHTube.castShadow = true
NaOHTube.position.x = 2
NaOHTube.position.y = 0.5
scene.add(NaOHTube)

NaOHTube.callback = () =>
{
    reagentSelected = "NaOH"
}

/**
 * CuCl2Tube
 */
 const CuCl2Tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.5, CuCl2TubeHeight, 22),
    new THREE.MeshStandardMaterial({
        color: 'rgba(0, 0, 255)',
        metalness: 0,
        roughness: 0.5,
        transparent: true,
        opacity: 0.34
    })
)
CuCl2Tube.castShadow = true
CuCl2Tube.position.x = 4
CuCl2Tube.position.y = 0.5
scene.add(CuCl2Tube)

CuCl2Tube.callback = () =>
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
directionalLight.position.set(- 5, 5, 0)
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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2.5, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false

/**
 * Cursor
 */
 const cursor = {}
 cursor.x = 0
 cursor.y = 0
 
 window.addEventListener('mousemove', (event) =>
 {
     cursor.x = event.clientX / sizes.width - 0.5
     cursor.y = event.clientY / sizes.height - 0.5
 })

/**
 * Raycaster
 */
 let raycaster = new THREE.Raycaster();
 let mouse = new THREE.Vector2();
 
 function onDocumentMouseDown(event)
 {
    event.preventDefault();

    if (event.which === 3) resetReagent()

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children ); 

    if ( intersects.length > 0 )
    {
        if (intersects[0].object.callback) intersects[0].object.callback();
    }
}
window.addEventListener('mousedown', onDocumentMouseDown, false);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()