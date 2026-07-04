// Crear renderer
const canvas = document.getElementById("canvas3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Crear escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Cámara (ajustada para que se vea del tamaño ideal)
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(0, 2, 15); // <-- ANTES 10, AHORA 15 (tu tamaño ideal)

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
    model.traverse((obj) => {
  if (obj.isMesh) {
    console.log("MESH:", obj.name);
  }
});


    // Escala ideal
    model.scale.set(0.05, 0.05, 0.05);

    model.rotation.y = Math.PI;

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
  camera.position.z -= 1;
  controls.update();
};

document.getElementById("zoomOutBtn").onclick = () => {
  camera.position.z += 1;
  controls.update();
};

document.getElementById("resetBtn").onclick = () => {
  camera.position.set(0, 2, 15); // <-- Vista inicial ideal
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
