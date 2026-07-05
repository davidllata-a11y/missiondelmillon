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
