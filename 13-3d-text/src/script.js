import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// Axies helper
const axiesHelper = new THREE.AxesHelper(2)
scene.add(axiesHelper)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json', // path to the font
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font, 
                size: 0.5, 
                height: 0.2,
                curveSegments: 5, // how many segments the curve is divided into
                bevelEnabled: true, // whether to add beveling. Beveling is a technique that adds a small amount of depth to the text
                bevelThickness: 0.03, // how deep into text is the bevel
                bevelSize: 0.02, // how far from text is the bevel
                bevelOffset: 0, // how far from text outline is the bevel
                bevelSegments: 4 // how many bevel segments there are
            }
        )
        /* textGeometry.computeBoundingBox() // compute the bounding box of the text
        textGeometry.translate( // center the text
            - (textGeometry.boundingBox.max.x - 0.02) * 0.5, 
            - (textGeometry.boundingBox.max.y - 0.02) * 0.5, 
            - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
        ) */
        textGeometry.center() // center the text
        //textGeometry.rotateX(- Math.PI * 0.5) // rotate the text

        //const material = new THREE.MeshBasicMaterial() // create a material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture }) // create a material
        //material.wireframe = true // make the material wireframe
        const text = new THREE.Mesh(textGeometry, material) // create a mesh
        scene.add(text) // add the mesh to the scene

        // Optimizing the geometry
        const donutGemetry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

        for(let i = 0; i < 100; i++)
        {
           
            const donut = new THREE.Mesh(donutGemetry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }
        console.timeEnd('donuts');
    }
);

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

//scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()