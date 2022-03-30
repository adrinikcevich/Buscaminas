const tableroHTML = document.querySelector(".tablero");
const selectorTamaño = document.querySelector("#tamaño");
const selectorDificultad = document.querySelector("#dificultad");
const btnNuevaPartida = document.querySelector(".nueva-partida");
const btnJugarDeNuevo = document.querySelector(".jugar-de-nuevo");
const btnConfig = document.querySelector(".config-btn");
const btnCloseModal = document.querySelector(".btn-closemodal");
const marcas = document.querySelector(".marcas");
const modalGanador = document.querySelector(".modal-ganador__container");
const modalConfig = document.querySelector(".modal-config__container");
let marcasRestantes;
let minas;
let jugando = true;
let perdio = false;
let tamañoTablero = {
  filas: 20,
  columnas: 20,
};
let porcentajeMinas = 0.3;
let tableroLogico = [];
minas = Math.round(
  tamañoTablero.filas * tamañoTablero.columnas * porcentajeMinas
);
marcasRestantes = minas;
marcas.innerHTML = marcasRestantes;

const generarTableroHTML = (filas, columnas) => {
  let html = "";
  for (let f = 0; f < filas; f++) {
    html += `<tr>`;
    for (let c = 0; c < columnas; c++) {
      html += `<td id="${f}.${c}" class="celda">`;
      html += `</td>`;
    }
    html += `</tr>`;
  }
  tableroHTML.innerHTML = html;
  tamañoTablero.filas = filas;
  tamañoTablero.columnas = columnas;
};

const generarTableroLogico = () => {
  limpiarTabla();
  ponerMinas(minas);
  contadorMinas();
};

const limpiarTabla = () => {
  tableroLogico = [];
  for (let c = 0; c < tamañoTablero.columnas; c++) {
    tableroLogico.push([]);
  }
};

const ponerMinas = (cantMinas) => {
  for (let i = 0; i < cantMinas; i++) {
    let c;
    let f;
    do {
      c = Math.floor(Math.random() * tamañoTablero.columnas);
      f = Math.floor(Math.random() * tamañoTablero.filas);
      
    } while (tableroLogico[c][f]);

    tableroLogico[c][f] = {
      valor: -1,
      estado: null,
    };
  }
};

const contadorMinas = () => {
  for (let f = 0; f < tamañoTablero.filas; f++) {
    for (let c = 0; c < tamañoTablero.columnas; c++) {
      if (!tableroLogico[c][f]) {
        let contador = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            try {
              if (tableroLogico[c + i][f + j].valor === -1) contador++;
            } catch {}
          }
        }
        tableroLogico[c][f] = {
          valor: contador,
          estado: null,
        };
      }
    }
  }
};

const refrescarMinas = () => {
  minas = Math.round(
    tamañoTablero.filas * tamañoTablero.columnas * porcentajeMinas
  );
  marcasRestantes = minas;
  refrescarMarcas();
};
const refrescarMarcas = () => {
  marcas.innerHTML = marcasRestantes;
};
const mostrarMinas = () => {
  let i = 0;
  for (let f = 0; f < tamañoTablero.filas; f++) {
    for (let c = 0; c < tamañoTablero.columnas; c++) {
      if (tableroLogico[f][c].valor === -1) {
        i++;
        let celda = document.getElementById(`${f}.${c}`);
        if (tableroLogico[f][c].estado !== "marcado") {
          celda.innerHTML =
            "<span class='iconify' data-icon='fxemoji:bomb'></span>";
          tableroLogico[f][c].estado = "descubierto";
        }
        celda.classList.add("bomb");
      }
    }
  }
};
const refrescarTablero = () => {
  for (let f = 0; f < tamañoTablero.filas; f++) {
    for (let c = 0; c < tamañoTablero.columnas; c++) {
      let celda = document.getElementById(`${c}.${f}`);
      if (tableroLogico[c][f].estado === "descubierto") {
        switch (tableroLogico[c][f].valor) {
          case -1:
            perdio = true;
            jugando = false;
            break;
          case 0:
            celda.classList.add("espacio");
            break;
          default:
            celda.innerHTML = tableroLogico[c][f].valor;
            celda.classList.add(tableroLogico[c][f].valor);
            break;
        }
      } else if (tableroLogico[c][f].estado === "marcado") {
        celda.innerHTML =
          '<span class="iconify" data-icon="icon-park:flag"></span>';
      } else {
        celda.innerHTML = "";
      }
    }
  }
  verificarGanador();
};
const resetearPartida = () => {
  jugando = true;
  perdio = false;
};
const nuevoJuego = () => {
  resetearPartida();
  generarTableroHTML(tamañoTablero.columnas, tamañoTablero.filas);
  generarTableroLogico();
  refrescarTablero()
  añadirEventos();
  añadirEventosPorCelda();
};

const abrirArea = (c, f) => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) {
        continue;
      }
      try {
        if (tableroLogico[c + j][f + i].estado !== "descubierto") {
          if (tableroLogico[c + j][f + i].estado !== "marcado") {
            tableroLogico[c + j][f + i].estado = "descubierto";

            if (tableroLogico[c + j][f + i].valor === 0) {
              abrirArea(c + j, f + i);
            }
          }
        }
      } catch (e) {}
    }
  }
};
const nuevoJuegoSinEventos = () =>{
  resetearPartida();
  generarTableroHTML(tamañoTablero.columnas, tamañoTablero.filas);
  generarTableroLogico();
  refrescarTablero()
  añadirEventosPorCelda();
}
const descubrirCelda = (f, c) => {
  if (!jugando) return;
  if (tableroLogico[f][c].estado === "marcado") return;
  tableroLogico[f][c].estado = "descubierto";
  if (tableroLogico[f][c].valor === 0) {
    abrirArea(f, c);
  }
  refrescarTablero();
  if (perdio) {
    return mostrarMinas();
  }
};
const verificarGanador = () => {
  for (let f = 0; f < tamañoTablero.filas; f++) {
    for (let c = 0; c < tamañoTablero.columnas; c++) {
      if (
        tableroLogico[f][c].valor !== -1 &&
        tableroLogico[f][c].estado !== "descubierto"
      )
        return;
    }
  }
  modalGanador.classList.remove("hidden");
  jugando = false;
};
const marcarCelda = (f, c) => {
  if (!jugando) return;
  let celda = document.getElementById(`${f}.${c}`)
  if (tableroLogico[f][c].estado !== "descubierto") {
    if (tableroLogico[f][c].estado === "marcado") {
      tableroLogico[f][c].estado = undefined;
      marcasRestantes++;
      celda.classList.remove("celda-marcada")
    } else if (marcasRestantes > 0) {
      tableroLogico[f][c].estado = "marcado";
      marcasRestantes--;
      celda.classList.add("celda-marcada")
    }

    refrescarMarcas();
  }

  refrescarTablero();
};
const añadirEventosPorCelda = () =>{
  for (let f = 0; f < tamañoTablero.filas; f++) {
    for (let c = 0; c < tamañoTablero.columnas; c++) {
      let celda = document.getElementById(`${c}.${f}`);
      celda.addEventListener("click", () => descubrirCelda(c, f));
      celda.addEventListener("contextmenu", () => marcarCelda(c, f));
    }
  }
}
const añadirEventos = () => {
  selectorTamaño.addEventListener("change", () => {
    if (selectorTamaño.value === "small") {
      tamañoTablero.filas = 10;
      tamañoTablero.columnas = 10;
    } else if (selectorTamaño.value === "medium") {
      tamañoTablero.filas = 20;
      tamañoTablero.columnas = 20;
    } else {
      tamañoTablero.filas = 25;
      tamañoTablero.columnas = 25;
    }
    refrescarMinas();

    nuevoJuegoSinEventos();
  });
  
  

  selectorDificultad.addEventListener("change", () => {
    switch (selectorDificultad.value) {
      case "facil":
        porcentajeMinas = 0.1;

        break;
      case "normal":
        porcentajeMinas = 0.3;

        break;
      case "dificil":
        porcentajeMinas = 0.5;

        break;
      case "imposible":
        porcentajeMinas = 0.7;

        break;
    }

    refrescarMinas();
    nuevoJuegoSinEventos();
  });

  btnConfig.addEventListener("click", () => {
    modalConfig.classList.remove("hidden");
  });
  btnCloseModal.addEventListener("click", () => {
    modalConfig.classList.add("hidden");
  });
  btnNuevaPartida.addEventListener("click", () => {
    nuevoJuegoSinEventos();
  });
  btnJugarDeNuevo.addEventListener("click", () => {
    modalGanador.classList.add("hidden");
    nuevoJuegoSinEventos();
  });
};

nuevoJuego();

//problema

/* lista1 = [
  {id: 1,nombre: "Juan"},
  {id: 2,nombre: "Matias"},
  {id: 3,nombre: "Elias"},
  {id: 4,nombre: "Sebastian"}
];
lista2 = [
  {id: 5,nombre: "Esteban"},
  {id: 2,nombre: "Rodrigo"},
  {id: 7,nombre: "Matias"},
  {id: 8,nombre: "Pedro"}
];
lista1.forEach(element => {
  let coincidencia = false
  for (let i = 0; i < lista2.length; i++) {
    
    if(element.id === lista2[i].id){
      coincidencia = true
      //Coincidencia de ID
      if(element.nombre !== lista2[i].nombre){
        //Conflicto, mismo ID != nombre
      }
    }
    if(element.nombre === lista2[i].nombre){
      //Coincidencia de Nombre
      coincidencia = true
    }
  }
  if(!coincidencia){
    //muestra elementos de la lista 1 que no estan en la lista 2
    console.log(element)
  }
});
 */
