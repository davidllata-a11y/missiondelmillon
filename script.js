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
camera.position.set(0, 0, 10);

// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

const loader = new THREE.GLTFLoader();
loader.load(
  "models/piernas.glb",
  function (gltf) {
    console.log("MODEL LOADED OK");

    const model = gltf.scene;
    scene.add(model);

    // Obtener caja del modelo
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Centrar modelo
    model.position.set(-center.x, -center.y, -center.z);

    // Escala segura (ni demasiado grande ni demasiado pequeña)
    const scaleFactor = 1 / maxDim; 
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Cámara a distancia segura
    camera.position.set(0, 0, 3);
    camera.far = 1000;
    camera.updateProjectionMatrix();

    // Apuntar la cámara al centro
    camera.lookAt(0, 0, 0);
  },
  undefined,
  function (error) {
    console.error("ERROR LOADING MODEL:", error);
  }
);


// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
