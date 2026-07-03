// Crear renderer
const canvas = document.getElementById("canvas3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
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
camera.position.set(0, 2, 5);

// Luz
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Cargar modelo
const loader = new THREE.GLTFLoader();
loader.load("models/piernas.glb", function (gltf) {
  const model = gltf.scene;
  scene.add(model);

  // AUTO AJUSTE CORREGIDO
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  // Centrar modelo correctamente
  model.position.set(
    model.position.x - center.x,
    model.position.y - center.y,
    model.position.z - center.z
  );

  // Escalar automáticamente
  const scaleFactor = 2 / size;
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);

  // Ajustar cámara automáticamente
  camera.position.set(0, 0, size * 1.5);
  camera.lookAt(0, 0, 0);
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
