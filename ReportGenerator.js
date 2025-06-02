//"Nombra las clases como cosas, y los métodos como acciones."
window.addEventListener("DOMContentLoaded", setFechaActual);

let contCamposHoas = 0;

function setFechaActual() {
  const inputFecha = document.getElementById("fecha-input");
  const hoy = new Date();

  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const day = String(hoy.getDate()).padStart(2, "0");

  const fechaActual = `${year}-${month}-${day}`;
  inputFecha.value = fechaActual;
}

function CambiarReporte(tipo) {
  switch (tipo) {
    case "fumigacion":
      document.getElementById("r-fumigacion").className = "row g-3";
      document.getElementById("r-recoleccion").className = "row g-3 d-none";
      document.getElementById("r-entregas").className = "row g-3 d-none";
      break;
    case "recolecta":
      document.getElementById("r-fumigacion").className = "row g-3 d-none";
      document.getElementById("r-recoleccion").className = "row g-3";
      document.getElementById("r-entregas").className = "row g-3 d-none";
      break;
    case "entrega":
      document.getElementById("r-fumigacion").className = "row g-3 d-none";
      document.getElementById("r-recoleccion").className = "row g-3 d-none";
      document.getElementById("r-entregas").className = "row g-3";
      break;
  }
}
function addHojaFumigacion() {
  contCamposHoas++;
  let divFumigacion = document.getElementById("seccion-F-hojas");

  let newDiv = document.createElement("div");
  newDiv.innerHTML = `
            <div class="col-sm-6">
                <label for="input-comentario-${contCamposHoas}" class="form-label">Comentario / subtitulo</label>
                <input type="text" class="form-control" id="input-comentario-${contCamposHoas}" list="datalistFumigacion">
                <datalist id="datalistFumigacion">
                  <option value="Fumigación para Control de plagas">
                  <option value="Mantenimiento a dispositivos: Control de roedores">
                  <option value="Mantenimiento a dispositivos: Control de voladores"></option>
                </datalist>
            </div>
            <div class="col-sm-6">
                <div class="mb-3">
                  <label for="filesImagenes-${contCamposHoas}" class="form-label">Fotos</label>
                  <input class="form-control" type="file" id="filesImagenes-${contCamposHoas}" multiple>
                </div>
            </div>
    `;
  newDiv.className = "row";
  divFumigacion.appendChild(newDiv);
}

function GenerarReporte() {
  document.getElementById("titulo-reporte").innerHTML =
    "<strong>SERVICIO:</strong> MANEJO INTEGRADO DE PLAGAS (MIP)";
  AgregarLogo();
  document.getElementById("fecha-reporte").innerText = formatearFecha();
  // crear hojas
  const divPrincipal = document.getElementById("hojas");
  divPrincipal.innerHTML = "";
  for (let i = 0; i <= contCamposHoas; i++) {
    CrearHoja(i);
  }
  // mostar hoja 1
  document.getElementById("hoja-portada").className =
    "hoja-carta bg-white shadow";
}

function formatearFecha() {
  var fechaInput = document.getElementById("fecha-input").value;
  const meses = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];

  const partes = fechaInput.split("-"); // ["2025", "05", "01"]
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]); // Año, mes (0-11), día

  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();

  return `VILLAHERMOSA, TABASCO ${dia} DE ${mes} DEL ${año}`;
}
function AgregarLogo() {
  const input = document.getElementById("logoCliente");
  const archivo = input.files[0];
  const contenedor = document.getElementById("imagenLogo");

  if (archivo && archivo.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      contenedor.innerHTML = ""; // Limpia si ya había algo
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "650px"; // Ajusta el tamaño como necesites
      img.style.height = "auto";
      contenedor.appendChild(img);
    };
    reader.readAsDataURL(archivo);
  }
}
function CrearHoja(cont) {
  const hojaDiv = document.createElement("div");
  hojaDiv.className = "hoja-carta bg-white shadow";

  const cabeceraDiv = document.createElement("div");
  cabeceraDiv.className = "cabecera";
  cabeceraDiv.innerHTML = `<img src="img/cabecera-2.png" alt="Cabecera"></img>`;

  const contenidoDiv = document.createElement("div");
  contenidoDiv.className =
    "contenido container-fluid d-flex justify-content-center align-items-center";

  const rowTitulo = document.createElement("div");
  rowTitulo.className = "row";
  rowTitulo.innerHTML = `<div class="col-12">
            <h4 class="mb-3 text-center" id="subtitulo-hoja"> ${
              document.getElementById("input-comentario-" + cont).value
            } </h4>
          </div>`;

  const allimagenesDiv = AgregarImagenes(cont);

  const pieDiv = document.createElement("div");
  pieDiv.className = "pie position-relative";
  pieDiv.innerHTML = `<p class="fecha-pie position-absolute text-end" id="fecha-reporte">
                        ${formatearFecha()}
                        </p>
                        <!-- Imagen del pie -->
                        <img src="img/footer-2.png" alt="Footer"></img>`;

  hojaDiv.appendChild(cabeceraDiv);
  hojaDiv.appendChild(contenidoDiv);
  contenidoDiv.appendChild(rowTitulo);
  contenidoDiv.appendChild(allimagenesDiv);
  hojaDiv.appendChild(pieDiv);

  const divPrincipal = document.getElementById("hojas");
  divPrincipal.appendChild(hojaDiv);
}
function AgregarImagenes(contInput) {
  let contenedor = document.createElement("div");
  contenedor.className = "row justify-content-md-center";
  const input = document.getElementById("filesImagenes-" + contInput);

  const archivos = Array.from(input.files);
  const total = archivos.length;

  // Calcula el tamaño de columna en Bootstrap (12 columnas por fila)
  let colSize = 12;
  if (total >= 1 && total <= 6) colSize = 4; // 4 imágenes por fila
  else if (total > 6) colSize = 3; // 3 imágenes por fila
  else if (total === 2) colSize = 6; // 2 imágenes por fila
  else colSize = 12; // 1 imagen ocupa toda la fila
  let cont = 0;
  archivos.forEach((archivo) => {
    if (archivo.type.startsWith("image/") && cont < 12) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const div = document.createElement("div");
        div.className = `col-${colSize} sin-mmargen`; // Bootstrap grid

        const cuadradoDiv = document.createElement("div");
        cuadradoDiv.className = "div-ajustar"; // cuadrado con aspect-ratio

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "img-ajustar";
        //

        cuadradoDiv.appendChild(img);
        div.appendChild(cuadradoDiv);
        contenedor.appendChild(div);
      };
      reader.readAsDataURL(archivo);
    }
    cont++;
  });
  return contenedor;
}
