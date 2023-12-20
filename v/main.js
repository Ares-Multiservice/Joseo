M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, getDoc, onSnapshot, query, where, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYNAIFu_BU4oav3I3PCFncS9QU5GvkiAU",
  authDomain: "joseodo-72673.firebaseapp.com",
  projectId: "joseodo-72673",
  storageBucket: "joseodo-72673.appspot.com",
  messagingSenderId: "1098719522238",
  appId: "1:1098719522238:web:1cd896005f5264ad40ddef"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fs = getFirestore(app);



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
    leer()
  });

  body.classList.remove('fixed-container');
  loader.classList.add('hide');
};
observador()

// Función para realizar la lectura inicial

async function leer() {
  const fotoDeperfil = document.querySelector('#userPhoto');
  const nombreCont = document.querySelector('#userName');
  const profecionCont = document.querySelector('#userProfecion');
  const ubicacionCont = document.querySelector('#userUbicacion');
  const descripcionCont = document.querySelector('#userDescripcion');

  // var hrefValue = window.location.href;
  var pathname = window.location.pathname;
  const removerdor = pathname.replace('/v/', '');
  const queryString = removerdor.toString();
  const documentId = decodeURIComponent(queryString);

  // leer los datos
  if (documentId !== '') {
    const docRef = doc(fs, "perfiles", documentId);
    const docSnap = await getDoc(docRef);
    const imagenes = [docSnap.data().imagenes];

    if (docSnap.exists()) {
      const { profileImage, nombre, profecion, ubicacion, descripcion, estrellas } = docSnap.data();
      fotoDeperfil.src = profileImage;
      nombreCont.textContent = nombre;
      profecionCont.textContent = profecion;
      ubicacionCont.textContent = ubicacion;
      descripcionCont.textContent = descripcion;

    }
  }

}


document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.reload();
  }).catch((err) => {
    alert("ha ocurrido un error inesperado, intente de nuevo mas tarde")
  });
})
