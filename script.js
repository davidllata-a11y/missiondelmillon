// Crear renderer
const canvas = document.getElementById("canvas3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Crear escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Cámara
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0, 2, 30);
camera.lookAt(0, 0, 0);

// Controles (ratón + táctil)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;

// Luz direccional fuerte
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 20);
scene.add(light);

// Luz ambiental suave
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemi);

// Variable para el modelo
let model;
let autoRotate = true;

// Cargar modelo
const loader = new THREE.GLTFLoader();
loader.load(
  "models/piernas.glb",
  function (gltf) {
    console.log("MODEL LOADED OK");

    model = gltf.scene;
    scene.add(model);

    model.position.set(0, 0, 0);
    model.scale.set(0.02, 0.02, 0.02);
    model.rotation.y = Math.PI;
  },
  undefined,
  function (error) {
    console.error("ERROR LOADING MODEL:", error);
  }
);

// BOTONES
document.getElementById("rotateBtn").onclick = () => {
  autoRotate = !autoRotate;
};

document.getElementById("zoomInBtn").onclick = () => {
  camera.position.z -= 2;
};

document.getElementById("zoomOutBtn").onclick = () => {
  camera.position.z += 2;
};

document.getElementById("resetBtn").onclick = () => {
  camera.position.set(0, 2, 30);
  controls.update();
};

// Animación
function animate() {
  requestAnimationFrame(animate);

  if (model && autoRotate) {
    model.rotation.y += 0.01;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
