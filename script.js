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
camera.position.set(0, 1, 8); // Cámara alejada para ver el modelo entero
camera.lookAt(0, 0, 0);

// Luz fuerte
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

// Luz ambiental
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

    // Escala razonable (ni gigante ni minúsculo)
    model.scale.set(2, 2, 2);

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

  // Si el modelo existe, lo rotamos
  if (model) {
    model.rotation.y += 0.01; // Rotación suave
  }

  renderer.render(scene, camera);
}
animate();
