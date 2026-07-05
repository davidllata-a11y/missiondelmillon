// CONFIGURACIÓN REAL DE TUS PIERNAS
const zonas = [
  { nombre: "muslo_alto", filas: 10, columnas: 21, circ: 63.5 },
  { nombre: "muslo_medio_alto", filas: 10, columnas: 19, circ: 56.5 },
  { nombre: "muslo_medio_bajo", filas: 10, columnas: 16, circ: 48 },
  { nombre: "antes_rodilla", filas: 5, columnas: 14, circ: 40.5 },
  { nombre: "rodilla", filas: 5, columnas: 13, circ: 39.5 },
  { nombre: "debajo_rodilla", filas: 10, columnas: 12, circ: 35.5 },
  { nombre: "pantorrilla", filas: 12, columnas: 13, circ: 38 },
  { nombre: "pantorrilla_baja", filas: 12, columnas: 10, circ: 29 },
  { nombre: "tobillo", filas: 10, columnas: 8, circ: 23 }
];

const tooltip = document.getElementById("tooltip");

// GENERAR UNA PIERNA
function generarPierna(idPierna) {
  const contenedor = document.getElementById(idPierna);

  zonas.forEach(z => {
    for (let f = 0; f < z.filas; f++) {
      const fila = document.createElement("div");
      fila.classList.add("fila");

      for (let c = 0; c < z.columnas; c++) {
        const celda = document.createElement("div");
        celda.classList.add("celda", "disponible");

        // ID único
        celda.dataset.id = `${idPierna}-${z.nombre}-f${f}-c${c}`;
        celda.dataset.zona = z.nombre;
        celda.dataset.fila = f;
        celda.dataset.columna = c;
        celda.dataset.circ = z.circ;

        // CLICK → seleccionar
        celda.onclick = () => {
          celda.classList.toggle("seleccionada");
        };

        // TOOLTIP
        celda.onmousemove = (e) => {
          tooltip.style.opacity = 1;
          tooltip.style.left = (e.pageX + 15) + "px";
          tooltip.style.top = (e.pageY + 15) + "px";

          tooltip.innerHTML = `
            <b>Parcela:</b> ${celda.dataset.id}<br>
            <b>Zona:</b> ${celda.dataset.zona}<br>
            <b>Fila:</b> ${celda.dataset.fila}<br>
            <b>Columna:</b> ${celda.dataset.columna}<br>
            <b>Circunferencia real:</b> ${celda.dataset.circ} cm<br>
            <b>Estado:</b> ${celda.classList.contains("seleccionada") ? "Seleccionada" : "Disponible"}
          `;
        };

        celda.onmouseleave = () => {
          tooltip.style.opacity = 0;
        };

        fila.appendChild(celda);
      }

      contenedor.appendChild(fila);
    }
  });
}

// GENERAR LAS DOS PIERNAS
generarPierna("pierna-izquierda");
generarPierna("pierna-derecha");
// ===============================
// SISTEMA DE ESTADOS
// ===============================

function cambiarEstadoSeleccionados(nuevoEstado) {
  document.querySelectorAll(".celda.seleccionada").forEach(celda => {
    celda.classList.remove("disponible", "reservada", "vendida", "seleccionada");
    celda.classList.add(nuevoEstado);
  });
}

// ===============================
// GUARDAR ESTADO EN localStorage
// ===============================

function guardarEstado() {
  const estado = {};

  document.querySelectorAll(".celda").forEach(celda => {
    if (celda.classList.contains("vendida")) estado[celda.dataset.id] = "vendida";
    else if (celda.classList.contains("reservada")) estado[celda.dataset.id] = "reservada";
    else if (celda.classList.contains("seleccionada")) estado[celda.dataset.id] = "seleccionada";
    else estado[celda.dataset.id] = "disponible";
  });

  localStorage.setItem("estadoPiernas", JSON.stringify(estado));
  alert("Estado guardado");
}

// ===============================
// CARGAR ESTADO DESDE localStorage
// ===============================

function cargarEstado() {
  const estado = JSON.parse(localStorage.getItem("estadoPiernas"));
  if (!estado) return alert("No hay estado guardado");

  document.querySelectorAll(".celda").forEach(celda => {
    celda.classList.remove("disponible", "reservada", "vendida", "seleccionada");
    celda.classList.add(estado[celda.dataset.id]);
  });

  alert("Estado cargado");
}

// ===============================
// EXPORTAR JSON
// ===============================

function exportarJSON() {
  const estado = JSON.parse(localStorage.getItem("estadoPiernas"));
  if (!estado) return alert("No hay estado guardado");

  const blob = new Blob([JSON.stringify(estado, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "estadoPiernas.json";
  a.click();
}

// ===============================
// IMPORTAR JSON
// ===============================

document.getElementById("btn-importar").onclick = () => {
  document.getElementById("input-importar").click();
};

document.getElementById("input-importar").onchange = function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const estado = JSON.parse(reader.result);

    document.querySelectorAll(".celda").forEach(celda => {
      celda.classList.remove("disponible", "reservada", "vendida", "seleccionada");
      celda.classList.add(estado[celda.dataset.id]);
    });

    localStorage.setItem("estadoPiernas", JSON.stringify(estado));
    alert("Estado importado");
  };

  reader.readAsText(file);
};

// ===============================
// BOTONES
// ===============================

document.getElementById("btn-liberar").onclick = () => cambiarEstadoSeleccionados("disponible");
document.getElementById("btn-reservar").onclick = () => cambiarEstadoSeleccionados("reservada");
document.getElementById("btn-vender").onclick = () => cambiarEstadoSeleccionados("vendida");
document.getElementById("btn-guardar").onclick = guardarEstado;
document.getElementById("btn-cargar").onclick = cargarEstado;
document.getElementById("btn-exportar").onclick = exportarJSON;
