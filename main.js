
M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy, startAfter, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVeuOW5_frVCb1DLd-AUBe4MsGaMURHtI",
  authDomain: "urbanopropiedades-d3933.firebaseapp.com",
  projectId: "urbanopropiedades-d3933",
  storageBucket: "urbanopropiedades-d3933.appspot.com",
  messagingSenderId: "326435470836",
  appId: "1:326435470836:web:e0524962b868c45ce34da1"
};
// Initialize Firebase
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

// Obtener referencias a los elementos del DOM
const leerPropiedades = document.querySelector('#leerPropiedades');
const paginacionBtn = document.querySelector('#paginacion');
const filtrarTipo = document.getElementById('filtrarTipo');
const filtrarUbicacion = document.getElementById('filtrarUbicacion');
const filtrarOption = document.getElementById('filtrarOpcion');

// Variables para la paginación
let lastDocument = null;
const pageSize = 16;

// Función para realizar la lectura inicial
async function leer() {
  // Agregar eventos de cambio a los elementos de filtro
  filtrarTipo.addEventListener('change', filtrar);
  filtrarUbicacion.addEventListener('change', filtrar);
  filtrarOption.addEventListener('change', filtrar);

  // Limpiar el contenido antes de mostrar los nuevos resultados
  leerPropiedades.innerHTML = '';

  // Realizar la consulta a la base de datos
  const querys = query(collection(fs, "propiedades"), orderBy("nombre"), limit(pageSize));
  await mostrarResultados(querys);

  // Agregar evento de clic al botón de paginación
  paginacionBtn.addEventListener('click', cargarMas);
}

// Función para mostrar los resultados
async function mostrarResultados(q) {
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    const { tipo, ubicacion, imagenes, nombre, precio } = doc.data();
    const documentId = nombre.replace(/\s/g, '');

    const tarjetaHTML = `<div class="col s6 m4 l3">
      <a href="./propiedad/search?${documentId}">
        <div class="card carta">
          <div class="card-image">
            <img src="${imagenes.url3}" alt="i" />
          </div>
          <div class="card-content blue-grey-text text-darken-3">
            <b class="card-title truncate">${nombre}</b>
            <p><b>Tipo:</b> <span>${tipo}</span></p>
            <p><b>Ubicacion:</b> <span>${ubicacion}</span></p>
            <b>$ <span>${precio}</span>.00 DOP</b>
          </div>
        </div>
      </a>
    </div>`;

    leerPropiedades.innerHTML += tarjetaHTML;
  });

  // Actualizar el último documento recuperado
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  lastDocument = lastVisible;
}

// Función para realizar la filtración
async function filtrar() {
  // Limpiar el contenido antes de mostrar los nuevos resultados
  leerPropiedades.innerHTML = '';

  // Construir la consulta base
  let q = query(collection(fs, "propiedades"), orderBy("nombre"), limit(pageSize));

  // Agregar condiciones según las opciones seleccionadas
  if (filtrarTipo.value) {
    q = query(q, where("tipo", "==", filtrarTipo.value));
  }

  if (filtrarUbicacion.value) {
    q = query(q, where("ubicacion", "==", filtrarUbicacion.value));
  }

  // Verificar si el checkbox está marcado
  if (filtrarOption.checked) {
    q = query(q, where("opcion", "==", "Venta"));
  } else {
    q = query(q, where("opcion", "==", "Alquiler"));
  }

  // Realizar la consulta a la base de datos con las condiciones aplicadas
  await mostrarResultados(q);
}

 async function cargarMas() {
   // Construir la consulta para obtener la siguiente página
   let q = query(collection(fs, "propiedades"), orderBy("nombre"), startAfter(lastDocument), limit(pageSize));
 
   // Aplicar condiciones de filtración si es necesario
   if (filtrarTipo.value) {
     q = query(q, where("tipo", "==", filtrarTipo.value));
   }
 
   if (filtrarUbicacion.value) {
     q = query(q, where("ubicacion", "==", filtrarUbicacion.value));
   }
 
   if (filtrarOption.checked) {
     q = query(q, where("opcion", "==", "Venta"));
   } else {
     q = query(q, where("opcion", "==", "Alquiler"));
   }
 
   // Mostrar los resultados de la siguiente página
   await mostrarResultados(q);
 }

// Llamar a la función de lectura inicial
leer();
