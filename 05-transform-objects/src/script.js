import './style.css';
import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 1 // Example 1
mesh.position.set(1, 1, 1) // Example 2
scene.add(mesh);

/*
Positions:
    y axis is going upwards
    z axis is going backwards
    x axis is going to the right
*/

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(1, 1, 3);
scene.add(camera);


console.log(mesh.position.length());
console.log(mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)));
console.log(mesh.position.distanceTo(camera.position));
mesh.position.normalize(); // Normalizes the vector (length = 1)
console.log(mesh.position.length());

// Axis Helper
const axisHelper = new THREE.AxesHelper(2); // 2 is the length of the axis
scene.add(axisHelper);

// Scale
mesh.scale.set(2, 0.5, 0.5);

// Rotation
mesh.rotation.reorder('YXZ'); // Reorders the rotation order
mesh.rotation.y = Math.PI * 0.25;
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.z = Math.PI * 0.25;

// Look at something
camera.lookAt(mesh.position);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube1.position.x = -2;
cube3.position.x = 2;
group.add(cube1);
group.add(cube2);
group.add(cube3);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);