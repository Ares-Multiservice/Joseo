M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter, startAt, endBefore, endAt } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVeuOW5_frVCb1DLd-AUBe4MsGaMURHtI",
  authDomain: "urbanopropiedades-d3933.firebaseapp.com",
  projectId: "urbanopropiedades-d3933",
  storageBucket: "urbanopropiedades-d3933.appspot.com",
  messagingSenderId: "326435470836",
  appId: "1:326435470836:web:e0524962b868c45ce34da1"
};
const app = initializeApp(firebaseConfig);
const fs = getFirestore(app);

function onScroll() {
  var nav = document.querySelector('#nav');
  var main = document.querySelector('main');
  var scrollPosition = window.scrollY;

  if (scrollPosition > 450) {
    nav.classList.add('navbar-fixed');
    main.style.paddingTop = `50px`;

  } else {
    nav.classList.remove('navbar-fixed');
    main.style.paddingTop = "0";
  }

}

// Asignar la función onScroll al evento scroll
window.addEventListener('scroll', onScroll);

window.addEventListener('DOMContentLoaded', () => {
  onScroll()
});

const leerPropiedades = document.querySelector('#leerPropiedades');
const noHayPropiedades = document.querySelector('#noHayPropiedades');
const textoIndicador = document.querySelectorAll('#textoIndicador span');
const paginacionBackBtn = document.querySelector('#paginacionBack');
const paginacionNextBtn = document.querySelector('#paginacionNext');
const filtrarTipo = document.getElementById('filtrarTipo');
const filtrarUbicacion = document.getElementById('filtrarUbicacion');
const filtrarOption = document.getElementById('filtrarOpcion');

const cantidadPorPagina = 2;
var ultimoDoc = null;
var primerDoc = null;


const leerDocumentos = (document) => {
  const documentos = document.docs;
  if (documentos.length > 0) {
    leerPropiedades.innerHTML = '';
    documentos.forEach((docSnap) => {
      const { tipo, ubicacion, imagenes, nombre, precio } = docSnap.data();
      const documentId = nombre.replace(/\s/g, '');
      const tarjetaHTML = `
    <div class="col s6 m4 l3">
     <a href="./propiedad/search?${documentId}">
      <div class="card carta">
          <div class="card-image">
              <img src="${imagenes.url3}" alt="i" />
          </div>
          <div class="card-content blue-grey-text text-darken-3">
              <b class="card-title truncate">${nombre}</b>
              <p><b>Tipo:</b> <span>${tipo}</span></p>
              <p><b>Ubicacion:</b> <span>${ubicacion}</span></p>
              <b>$${precio}DOP</b>
          </div>
      </div>
    </a>
      </div>`;
      leerPropiedades.innerHTML += tarjetaHTML;
    });
    console.log(documentos);
    ultimoDoc = documentos[documentos.length - 1] || null;
    primerDoc = documentos[0] || null;
    // paginacionBackBtn.classList.add('disabled');
    // paginacionNextBtn.classList.remove('disabled');
    noHayPropiedades.classList.add('hide');
  }
}


async function paginarDocumentos(orden, paginar) {
  const querySnapshot = query(collection(fs, "propiedades"));
  let queryInicial = query(querySnapshot, paginar, limit(cantidadPorPagina));
  // Agregar condiciones según las opciones seleccionadas
  if (filtrarTipo.value) {
    queryInicial = query(queryInicial, where("tipo", "==", filtrarTipo.value));
    textoIndicador[0].textContent = `${filtrarTipo.value}s`;
  }else{
    textoIndicador[0].textContent = `Todas las propiedades`;
  }

  if (filtrarUbicacion.value) {
    queryInicial = query(queryInicial, where("ubicacion", "==", filtrarUbicacion.value));
    textoIndicador[2].textContent = `En ${filtrarUbicacion.value}`;
  }else{
    textoIndicador[2].textContent = `En todo el pais`;
  }

  // Verificar si el checkbox está marcado
  if (filtrarOption.checked) {
    queryInicial = query(queryInicial, where("opcion", "==", "Venta"));
    textoIndicador[1].textContent = `En venta`

  } else {
    queryInicial = query(queryInicial, where("opcion", "==", "Alquiler"));
    textoIndicador[1].textContent = `En alquiler`
  }

  const documentos = await getDocs(queryInicial);
  leerDocumentos(documentos);

};


// Cargar inicialmente los primeros documentos
paginarDocumentos('asc', null);


async function paginaSiguiente() {
  const siguiente = startAfter(ultimoDoc) || null;
  const orden = 'asc';
  paginarDocumentos(orden, siguiente);
  paginacionBackBtn.classList.remove('disabled');

};

async function paginaAnterior() {
  const anterior = endBefore(primerDoc) || null;
  const orden = 'asc';
  paginarDocumentos(orden, anterior);
}

// Agregar eventos de cambio a los elementos de filtro
filtrarTipo.addEventListener('change', () => paginarDocumentos(null));
filtrarUbicacion.addEventListener('change', () => paginarDocumentos(null));
filtrarOption.addEventListener('change', () => paginarDocumentos(null));
paginacionNextBtn.addEventListener('click', paginaSiguiente)
paginacionBackBtn.addEventListener('click', paginaAnterior)