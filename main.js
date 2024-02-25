M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter, startAt, endBefore, endAt } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYNAIFu_BU4oav3I3PCFncS9QU5GvkiAU",
  authDomain: "joseodo-72673.firebaseapp.com",
  projectId: "joseodo-72673",
  storageBucket: "joseodo-72673.appspot.com",
  messagingSenderId: "1098719522238",
  appId: "1:1098719522238:web:1cd896005f5264ad40ddef"
};

const app = initializeApp(firebaseConfig);
const fs = getFirestore(app);
const auth = getAuth(app);



function observador() {
  const body = document.querySelector('body');
  const loader = document.querySelector('.load-container');
  const entrarBtn = document.getElementById('entrarBtn');
  const userMenuTrigger = document.getElementById('userMenu-trigger');
  const dropDownName = document.getElementById('dropDown-name');
  const dropDownImage = document.getElementById('dropDown-image');
  const navImage = document.getElementById('nav-image');
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      if (photoURL) {
        dropDownImage.src = photoURL;
        navImage.src = photoURL;
      }
      if (displayName) {

        var nombre = `${displayName}`;
        nombre = nombre.split(' ');
        dropDownName.textContent = nombre[0];
      }
      entrarBtn.classList.add('hide');
      userMenuTrigger.classList.remove('hide');
    } else {
      // User is signed out.
      entrarBtn.classList.remove('hide');
      userMenuTrigger.classList.add('hide');
    }
  });

  body.classList.remove('fixed-container');
  loader.classList.add('hide');
};
observador()


document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.reload();
  }).catch((err) => {
    alert("ha ocurrido un error inesperado, intente de nuevo mas tarde")
  });
})

const leerUsuarios = document.querySelector('#leerUsuarios');
const noHayCoincidencias = document.querySelector('#noHayCoincidencias');
const textoIndicador = document.querySelectorAll('#textoIndicador span');
const paginacionBackBtn = document.querySelector('#paginacionBack');
const paginacionNextBtn = document.querySelector('#paginacionNext');
const filtrarHabilidad = document.getElementById('filtrarHabilidad');
const filtrarUbicacion = document.getElementById('filtrarUbicacion');

const cantidadPorPagina = 16;
var ultimoDoc = null;
var primerDoc = null;


const leerDocumentos = (document) => {
  const documentos = document.docs;
  const user = auth.currentUser;
  if (documentos.length > 0) {
    leerUsuarios.innerHTML = '';
    documentos.forEach((docSnap) => {
      const { id, nombre, photoURL, recoms, profecion, provincia } = docSnap.data();
      // const documentId = nombre.replace(/\s/g, '');
      if (user.emailVerified) {
        const tarjetaHTML = `
      <div class="col s6 m4 l3 xl2">
          <a href="./v/${id}">
           <div class="card carta">
               <div class="card-image">
                   <img src="${photoURL}" alt="i" />
                   <span class="badge blue accent-4"><i class="fa-regular fa-thumbs-up"></i> ${recoms}</span>
               </div>
               <div class="card-content blue-grey-text text-darken-3">
                   <b class="truncate">${nombre}</b>
                   <p><span>${profecion}</span></p>
                   <p><span>${provincia}</span></p>
               </div>
           </div>
         </a>
           </div>`;
        leerUsuarios.innerHTML += tarjetaHTML;
      }
    });
    ultimoDoc = documentos[documentos.length - 1] || null;
    primerDoc = documentos[0] || null;
    // paginacionBackBtn.classList.add('disabled');
    // paginacionNextBtn.classList.remove('disabled');
    noHayCoincidencias.classList.add('hide');
  } else {
    noHayCoincidencias.classList.remove('hide');

  }
}

async function paginarDocumentos(orden, paginar) {
  const querySnapshot = query(collection(fs, "usuarios"));
  let queryInicial = query(querySnapshot, paginar, limit(cantidadPorPagina));
  // Agregar condiciones según las opciones seleccionadas
  var habilidades = filtrarHabilidad.value;
  if (habilidades) {
    const queryString = habilidades.toString();
    const filtro = decodeURIComponent(queryString);
    queryInicial = query(queryInicial, where("profecion", "==", filtro));
    textoIndicador[0].textContent = `${filtro}`;
  } else {
    textoIndicador[0].textContent = `Todas las profeciones`;
  }

  var ubicacion = filtrarUbicacion.value;
  if (ubicacion) {
    const remplazo = ubicacion.replace('Ã±', 'ñ')
    const queryString = remplazo.toString();
    const filtro = decodeURIComponent(queryString);
    queryInicial = query(queryInicial, where("provincia", "==", filtro));
    textoIndicador[1].textContent = `En ${filtro}`;
  } else {
    textoIndicador[1].textContent = `En todo el pais`;
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
filtrarHabilidad.addEventListener('change', () => paginarDocumentos(null));
filtrarUbicacion.addEventListener('change', () => paginarDocumentos(null));
// filtrarOption.addEventListener('change', () => paginarDocumentos(null));
paginacionNextBtn.addEventListener('click', paginaSiguiente)
paginacionBackBtn.addEventListener('click', paginaAnterior)