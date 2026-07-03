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
  1000
);
camera.position.set(0, 2, 12); // Cámara más lejos
camera.lookAt(0, 0, 0);

// Luz direccional fuerte
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 10);
scene.add(light);

// Luz ambiental suave
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemi);

// Variable para el modelo
let model;

// Cargar modelo
const loader = new THREE.GLTFLoader();
loader.load(
  "models/piernas.glb",
  function (gltf) {
    console.log("MODEL LOADED OK");

    model = gltf.scene;
    scene.add(model);

    // Colocar el modelo en el centro
    model.position.set(0, 0, 0);

    // Escala más pequeña para que se vea entero
    model.scale.set(0.8, 0.8, 0.8);

    // Rotación inicial
    model.rotation.y = Math.PI;
  },
  undefined,
  function (error) {
    console.error("ERROR LOADING MODEL:", error);
  }
);

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Rotación visible
  if (model) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
animate();
