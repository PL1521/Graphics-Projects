import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

//THREE.PerspectiveCamera( fov angle, aspect ratio, near depth, far depth );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.target.set(0, 5, 0);

// Rendering 3D axis
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};
const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

// ***** Assignment 2 *****
// Setting up the lights
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 5, 5); // Position the light
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0.5, .0, 1.0).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x505050);  // Soft white light
scene.add(ambientLight);

const phong_material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color
    shininess: 100   // Shininess of the material
});

// Start here.
const l = 0.5
const positions = new Float32Array([
    // Front face
    -l, -l,  l, // 0
     l, -l,  l, // 1
     l,  l,  l, // 2
    -l,  l,  l, // 3

    // Left face
    -l, -l, -l, // 4
    -l, -l,  l, // 5
    -l,  l,  l, // 6 
    -l,  l, -l, // 7
  
    // Top face
    -l,  l,  l, // 8
     l,  l,  l, // 9
     l,  l, -l, // 10
    -l,  l, -l, // 11 
  
    // Bottom face
    -l, -l, -l, // 12
     l, -l, -l, // 13
     l, -l,  l, // 14
    -l, -l,  l, // 15 
  
    // Right face
     l, -l,  l, // 16
     l, -l, -l, // 17
     l,  l, -l, // 18
     l,  l,  l, // 19

     // Back face
      l, -l, -l, // 20
     -l, -l, -l, // 21
     -l,  l, -l, // 22
      l,  l, -l, // 23
  ]);
  
  const indices = [
    // Front face
    0, 1, 2,
    0, 2, 3,
  
    // Left face
    4, 5, 6,
    4, 6, 7,
  
    // Top face
    8, 9, 10,
    8, 10, 11,
  
    // Bottom face
    12, 13, 14,
    12, 14, 15,
  
    // Right face
    16, 17, 18,
    16, 18, 19,

    // Back face
    20, 21, 22,
    20, 22, 23,
  ];
  
  // Compute normals
  // Ex. Every normal vector starting from the front face points along the positive z-axis
  const normals = new Float32Array([
    // Front face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
  
    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  
    // Bottom face
    0, -1, 0,
    0, -1, 0, 
    0, -1, 0,
    0, -1, 0,
  
    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1
  ]);

const custom_cube_geometry = new THREE.BufferGeometry();
custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

// TODO: Implement wireframe geometry
const wireframe_vertices = new Float32Array([
  // Front face
  -l, -l,  l,  l, -l,  l,
  l, -l,  l,  l,  l,  l,
  l,  l,  l, -l,  l,  l,
  -l,  l,  l, -l, -l,  l,
  // Back face
  -l, -l, -l,  l, -l, -l,
  l, -l, -l,  l,  l, -l,
  l,  l, -l, -l,  l, -l,
  -l,  l, -l, -l, -l, -l,
  // Connecting edges
  -l, -l,  l, -l, -l, -l,
   l, -l,  l,  l, -l, -l,
   l,  l,  l,  l,  l, -l,
  -l,  l,  l, -l,  l, -l
]);

const wireframe_geometry = new THREE.BufferGeometry();
wireframe_geometry.setAttribute( 'position', new THREE.BufferAttribute( wireframe_vertices, 3 ) );
const wireframe_cube = new THREE.LineSegments( wireframe_geometry );

function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}
// TODO: Implement the other transformation functions.
function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta), 0, 0,
    Math.sin(theta),  Math.cos(theta), 0, 0,
             0,           0, 1, 0,
             0,           0, 0, 1
	);
}
function scalingMatrix(sx, sy, sz) {
  return new THREE.Matrix4().set(
    sx, 0,  0, 0,
    0, sy,  0, 0,
    0,  0, sz, 0,
    0,  0,  0, 1
  );
}

//Only showed one cube, wanted seven hence the following for loop(s)
//let cube = new THREE.Mesh( custom_cube_geometry, phong_material );
//scene.add(cube);

//Create mesh cubes
let mesh_cubes = [];
for (let i = 0; i < 7; i++) {
	let cube = new THREE.Mesh(custom_cube_geometry, phong_material);
	cube.matrixAutoUpdate = false;
  cube.visible = true; //set mesh cubes to visible initially
	mesh_cubes.push(cube);
	scene.add(cube);
}

//Create wireframe cubes
let wireframe_cubes = [];
for (let i = 0; i < 7; i++) {
  let cube = wireframe_cube.clone();
	cube.matrixAutoUpdate = false;
  cube.visible = false; //set wireframe cubes to invisible initially
	wireframe_cubes.push(cube);
	scene.add(cube);
}

//Switches visible states for wireframe and mesh cubes
function toggleWireframe() {
  for (let i = 0; i < mesh_cubes.length; i++) {
    wireframe_cubes[i].visible = !wireframe_cubes[i].visible;
    mesh_cubes[i].visible = !mesh_cubes[i].visible;
  }
}

let animation_time = 0;
let delta_animation_time = 0;
let rotation_angle = 0;
const clock = new THREE.Clock();

const MAX_ANGLE = 20 * Math.PI / 360; // 20 degrees converted to radians
const T = 3; // oscilation period in seconds
let paused_start_time = 0;
let delta_pause_time = 0;

function animate() {
  
  delta_animation_time = clock.getDelta();
  if (still) {
    paused_start_time = clock.getElapsedTime();
    delta_pause_time = clock.getElapsedTime() - paused_start_time;
  } else
  {
    animation_time += delta_animation_time - delta_pause_time;
    delta_pause_time = 0; // reset pause time after resuming
  }

  // TODO
  // Animate the cube
  rotation_angle = MAX_ANGLE / 2 * (1 + Math.sin(animation_time * 2 * Math.PI / T));

  //Define matrices
  const rotation = rotationMatrixZ(rotation_angle);
  const scaling = scalingMatrix(1.0, 1.5, 1.0); //Scales the matrix's height by 1.5
  const translation1 = translationMatrix(l, l * 1.5, 0); //Translates l in the x and l * 1.5 in the y direction
  const translation2 = translationMatrix(-l, 2 * l * 1.5 - l * 1.5, 0); // Undoes the previous transformation and stacks the cubes
  let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update
  model_transformation.multiplyMatrices(scaling, model_transformation);

  //Choose which cubes to show
  const activeCubes = mesh_cubes[0].visible ? mesh_cubes : wireframe_cubes;
      
  //Apply transformations
  for (let i = 0; i < activeCubes.length; i++) {
    activeCubes[i].matrix.copy(model_transformation);
    model_transformation.multiplyMatrices(translation1, model_transformation); // First call translation (l,l * 1.5,0)
    model_transformation.multiplyMatrices(rotation, model_transformation); // Then call rotation
    model_transformation.multiplyMatrices(translation2, model_transformation); // Then call translation back down (l,l * 1.5,0) and then up (0, 2 * l * 1.5, 0)
  }

  renderer.render( scene, camera );
  controls.update();
}

renderer.setAnimationLoop( animate );

// TODO: Add event listener
let still = false;
window.addEventListener('keydown', onKeyPress); // onKeyPress is called each time a key is pressed
// Function to handle keypress
function onKeyPress(event) {
    switch (event.key) {
        case 's': // Note we only do this if s is pressed.
            still = !still;
            break;
        case 'w':
            toggleWireframe();
            break;
        default:
            console.log(`Key ${event.key} pressed`);
    }
}

/*
//First part of the animation (where rotation was fixed and not a function of time)
// TODO: Transform cubes
const rotation = rotationMatrixZ(Math.PI / 9); //Rotates counterclockwise by 20 degrees
const scaling = scalingMatrix(1.0, 1.5, 1.0); //Scales the matrix in the y-direction by 1.5
const translation1 = translationMatrix(l, l * 1.5, 0); //Translates l in the x and y direction
const translation2 = translationMatrix(-l, 2 * l * 1.5 - l * 1.5, 0); // Undoes the previous transformation and stacks the cubes
let model_transformation = new THREE.Matrix4(); // model transformation matrix we will update
model_transformation.multiplyMatrices(scaling, model_transformation);
for (let i = 0; i < cubes.length; i++) {
  cubes[i].matrix.copy(model_transformation);
  model_transformation.multiplyMatrices(translation1, model_transformation); // First call translation (l,l * 1.5,0)
  model_transformation.multiplyMatrices(rotation, model_transformation); // Then call rotation
  model_transformation.multiplyMatrices(translation2, model_transformation); // Then call translation back down (l,l * 1.5,0) and then up (0, 2 * l * 1.5, 0)
}
*/