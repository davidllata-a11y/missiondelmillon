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
camera.position.set(0, 2, 15);

// Controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();

// Luces
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 20);
scene.add(light);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemi);

// Variables
let model;
let autoRotate = true;
let modoParcelas = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Cargar modelo
const loader = new THREE.GLTFLoader();
loader.load(
  "models/piernas.glb",
  function (gltf) {
    console.log("✔ MODELO CARGADO");

    model = gltf.scene;
    scene.add(model);

    model.position.set(0, 0, 0);
    model.scale.set(0.05, 0.05, 0.05);
    model.rotation.y = Math.PI;

    model.traverse((obj) => {
      if (obj.isMesh) {
        console.log("MESH:", obj.name);
      }
    });

    controls.target.copy(model.position);
    controls.update();
  },
  undefined,
  function (error) {
    console.error("❌ ERROR: No se pudo cargar models/piernas.glb");
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
  camera.position.set(0, 2, 15);
  controls.target.set(0, 0, 0);
  controls.update();
};

// MODO PARCELAS
document.getElementById("parcelasBtn").onclick = () => {
  modoParcelas = !modoParcelas;

  if (modoParcelas) {
    alert("Modo Parcelas ACTIVADO.\nHaz clic en la pierna para crear una parcela.");
  } else {
    alert("Modo Parcelas DESACTIVADO.");
  }
};

// CLICK PARA CREAR PARCELA
window.addEventListener("click", (event) => {
  if (!modoParcelas) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersecciones = raycaster.intersectObject(model, true);

  if (intersecciones.length > 0) {
    const punto = intersecciones[0].point;

    // MOSTRAR Y EN CONSOLA
    console.log("Y:", punto.y);

    // Crear marcador verde
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const marcador = new THREE.Mesh(geometry, material);

    marcador.position.copy(punto);
    scene.add(marcador);

    alert(
      "Parcela creada:\n" +
      "x: " + punto.x.toFixed(3) + "\n" +
      "y: " + punto.y.toFixed(3) + "\n" +
      "z: " + punto.z.toFixed(3)
    );
  }
});

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
