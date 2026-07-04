// Crear renderer
const canvas = document.getElementById("canvas3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Crear escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Cámara (más cerca para que se vea grande al iniciar)
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0, 2, 10); // <-- ANTES 30, AHORA 10 (MUCHO MÁS CERCA)

// Controles (ratón + táctil)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();

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

    // Escala más grande para que se vea bien al abrir
    model.scale.set(0.05, 0.05, 0.05); // <-- ANTES 0.02, AHORA 0.05

    model.rotation.y = Math.PI;

    // Asegurar que la cámara mire al modelo
    controls.target.copy(model.position);
    controls.update();
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
  camera.position.z -= 1; // Zoom más suave
  controls.update();
};

document.getElementById("zoomOutBtn").onclick = () => {
  camera.position.z += 1;
  controls.update();
};

document.getElementById("resetBtn").onclick = () => {
  camera.position.set(0, 2, 10); // Vista inicial grande
  controls.target.set(0, 0, 0);
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
