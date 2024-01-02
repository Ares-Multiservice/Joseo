M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, updateDoc, deleteField, getDocs, getDoc, onSnapshot, query, where, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.reload();
  }).catch((err) => {
    alert("ha ocurrido un error inesperado, intente de nuevo mas tarde")
  });
})

const sendMessageBtn = document.getElementById('sendMessageBtn');
const recomendarBtn = document.getElementById('recomendarBtn');
function observador() {
  const body = document.querySelector('body');
  const loader = document.querySelector('.load-container');
  const navUserActive = document.getElementById('navUserActive');
  const navUserInactive = document.getElementById('navUserInactive');
  const navImage = document.getElementById('nav-image');
  const dropDownImage = document.getElementById('dropDown-image');
  const dropDownName = document.getElementById('dropDown-name');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var photoURL = user.photoURL;
      if (photoURL) {
        dropDownImage.src = photoURL;
        navImage.src = photoURL;
      }
      if (displayName) {
        var nombre = `${displayName}`;
        nombre = nombre.split(' ');
        dropDownName.textContent = nombre[0];
      }
      navUserActive.classList.remove('hide');
      navUserInactive.classList.add('hide');
      sendMessageBtn.classList.remove('disabled');
      // recomendarBtn.classList.remove('disabled');
    } else {
      // User is signed out.
      navUserActive.classList.add('hide');
      navUserInactive.classList.remove('hide');
      sendMessageBtn.classList.add('disabled');
      // recomendarBtn.classList.add('disabled');
    }
    leer(user)
  });

  body.classList.remove('fixed-container');
  loader.classList.add('hide');
};
observador()

// Función para realizar la lectura inicial

async function leer(user) {
  const fotoDeperfil = document.querySelector('#userPhoto');
  const nombreCont = document.querySelector('#userName');
  const profecionUbicacionCont = document.querySelector('#userProfecionUbicacion');
  const descripcionCont = document.querySelector('#userDescripcion');
  const descripcionContainer = document.querySelector('#descripcionContainer');
  const recomendaciones = document.querySelector('#recoms');

  // var hrefValue = window.location.href;
  var pathname = window.location.pathname;
  const pathname1 = pathname.replace('/v/', '');
  const pathname2 = pathname1.replace(/\s/g, "");
  const pathname3 = pathname2.toString();
  const documentId = decodeURIComponent(pathname3);

  // leer los datos
  if (documentId !== '' || documentId !== 'index.html') {
    var filtrar = query(collection(fs, "usuarios"));
    // const query = await getDocs(filtrar);
    var docRef = query(filtrar, where("id", "==", documentId));
    const docSnap = await getDocs(docRef);
    docSnap.forEach((docSnap) => {
      const userId = docSnap.id;
      const { photoURL, nombre, profecion, provincia, presentacion} = docSnap.data();
      fotoDeperfil.src = photoURL;
      nombreCont.textContent = nombre;
      profecionUbicacionCont.textContent = `${profecion} en ${provincia}`;


      if (presentacion !== '') {
      descripcionCont.textContent = presentacion;
      descripcionContainer.classList.remove('hide')
      } else {
      descripcionContainer.classList.add('hide')
        
      }

      if(user) {
      onSnapshot(doc(fs, "usuarios", user.uid), (doc) => {
        const userRecom = doc.data().misRecomendados[userId];
        recomendarBtn.classList.remove('disabled');
       const span = recomendarBtn.querySelector('span');
        if (userRecom) {
          recomendarBtn.classList.add('green');
          recomendarBtn.classList.remove('red');
          span.textContent = 'recomendado';
        } else {
          recomendarBtn.classList.add('red');
          recomendarBtn.classList.remove('green');
          span.textContent = 'recomendar';
        }
      });
      }
      
      onSnapshot(doc(fs, "usuarios", userId), (doc) => {
       const recoms = doc.data().recoms;
      recomendaciones.textContent = recoms;
      })

      recomendarBtn.addEventListener('click', () => {
        recomedar(userId, photoURL, nombre, profecion, provincia);
        recomendarBtn.classList.add('disabled');
      })
    });
  }

}

async function recomedar(userId, photoURL, nombre, profecion, provincia) {

  const user = auth.currentUser;
  var username = user.displayName;
  var userFoto = user.photoURL;

  const docRef1 = doc(fs, 'usuarios', userId); // leyendo el usuario que se recomendara
  const docSnap = await getDoc(docRef1); // leyendo el usuario que se recomendara


  const docRef2 = doc(fs, 'usuarios', user.uid); // leyendo los usuarios que he recomendado
  const docSnap2 = await getDoc(docRef2); // leyendo los usuarios que he recomendado


  const misRecomendados = docSnap.data().misRecomendados;
  const userRecom = docSnap2.data().misRecomendados[userId];
  if (misRecomendados) {
    if (userRecom) {
      restarRecoms()
    } else {
      sumarRecoms()
    }
  } else {
    sumarRecoms()
  }


  function sumarRecoms() {

    // agregando recomendacion al usuario que se esta recomendando
    setDoc(docRef1, {
      meRecomendaron: {
        [userId]: {
          photoURL: userFoto,
          nombre: username
        }
      },
      recoms: increment(1)
    }, { merge: true });

    setDoc(docRef2, {
      misRecomendados: {
        [userId]: {
          photoURL: photoURL,
          nombre: nombre,
          profecion: profecion,
          provincia: provincia
        }
      }
    }, { merge: true });

    recomendarBtn.classList.remove('disabled');
  }

  function restarRecoms() {

    // removiendo recomendacion al usuario que se esta des-recomendando
    setDoc(docRef1, {
      meRecomendaron: {
        [userId]: deleteField()
      },
      recoms: increment(-1)
    }, { merge: true });

    setDoc(docRef2, {
      misRecomendados: {
        [userId]: deleteField()
      }
    }, { merge: true });
  }

  recomendarBtn.classList.remove('disabled');

}