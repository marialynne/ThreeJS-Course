import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';

/**
 * Debug
 */
const gui = new dat.GUI();


/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('onStart');
};
loadingManager.onLoad = () => {
    console.log('onLoad');
};
loadingManager.onProgress = () => {
    console.log('onProgress');
};
loadingManager.onError = () => {
    console.log('onError');
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);


const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const enviromentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg', // right
    '/textures/environmentMaps/0/nx.jpg', // left
    '/textures/environmentMaps/0/py.jpg', // top
    '/textures/environmentMaps/0/ny.jpg', // bottom
    '/textures/environmentMaps/0/pz.jpg', // front
    '/textures/environmentMaps/0/nz.jpg', // back
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
/* const material = new THREE.MeshBasicMaterial();
material.map = doorColorTexture;
material.color = new THREE.Color(0xff00ff);
material.transparent = true;
material.wireframe = true;
material.alphaMap = doorAlphaTexture;
material.opacity = 0.5;
material.side = THREE.DoubleSide; 
material.side = THREE.BackSide; // Avoid
material.side = THREE.FrontSide; // default */

/* const material = new THREE.MeshNormalMaterial();
material.flatShading = true; */

/* const material = new THREE.MeshMatcapMaterial();
material.matcap = textureLoader.load('/textures/matcaps/8.png');
*/

/* const material = new THREE.MeshDepthMaterial();
material.depthPacking = THREE.RGBADepthPacking;
material.wireframe = true;
*/

/* const material = new THREE.MeshLambertMaterial(); */

/* const material = new THREE.MeshPhongMaterial(); // Less performant than MeshLambertMaterial
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff);
material.map = doorColorTexture;
 */

/* const material = new THREE.MeshToonMaterial();
material.gradientTextures = textureLoader.load('/textures/gradients/5.jpg'); */
/* gradientTextures.minFilter = THREE.NearestFilter;
gradientTextures.magFilter = THREE.NearestFilter; */
/* gradientTextures.generateMipmaps = false; */

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7; // Try not to combine metalness and roughness with metalnessMap and roughnessMap
material.roughness = 0;
material.envMap = enviromentMapTexture;

// default is 0 and 1 respectively
/* material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlphaTexture; // To use alphaMap, you need to set transparent to true
 */
//material.wireframe = true;


gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
);
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere.position.x = -1.5;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
);
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
);
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.x = 1.5;
scene.add(sphere, plane, torus);

/**
 * Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);


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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()