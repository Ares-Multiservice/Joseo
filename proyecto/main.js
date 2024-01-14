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
      // Cambiar el título de la página

      if (photoURL) {
        dropDownImage.src = photoURL;
        navImage.src = photoURL;
        // document.head.querySelector('.headIcon').href= photoURL;
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
  const pintarImagenes = document.querySelector('#pintarImagenes');
  const chipContact = document.querySelector('#chip-contact');
  const fotoDeperfil = document.querySelector('#userPhoto');
  const displayName = document.querySelector('#displayName');
  const miProfecion = document.querySelector('#profecionCont');
  const recomendaciones = document.querySelector('#recoms');
  const titulo = document.querySelector('#titulo');
  const descripcion = document.querySelector('#descripcion');

  // Obtener la URL actual
  var urlActual = window.location.href;
  // Crear un objeto URL
  var url = new URL(urlActual);
  // Obtener los parámetros de la consulta
  var proyectoId = url.searchParams.get("id");
  var proyecto = url.searchParams.get("proyecto");

  // leer los datos
  var filtrar = query(collection(fs, "usuarios"));
  // const query = await getDocs(filtrar);
  var docRef = query(filtrar, where(`id`, "==", proyectoId));
  const docSnap = await getDocs(docRef);
  docSnap.forEach((docSnap) => {
    const userUid = docSnap.id;
    const { id, photoURL, nombre, profecion, provincia, recoms } = docSnap.data();
    recomendaciones.textContent = recoms;
    document.title = 'Proyecto de ' + nombre;
    chipContact.href = `../v/${id}`;
    const querySnap = Object.values(docSnap.data().proyectos);

    // leer la informacion de los servicios
    querySnap.forEach((doc) => {
      const { id, title, desc } = doc;
      if (id === proyecto) {
        fotoDeperfil.src = photoURL;
        displayName.textContent = nombre;
        miProfecion.textContent = profecion;
        titulo.textContent = title;
        descripcion.textContent = desc;

      }
    })

    // pintar las imagenes
    // const carouselContainer = document.querySelector('.splide__list');

    // Limpiar el carrusel si ya existía
    // let carousel;
    // if (carouselContainer.children.length > 0) {
    //   carousel = new Splide('#image-carousel').destroy();
    // }

    // carousel = new Splide('#image-carousel', {
    //   type: 'slide', 
    //   perPage: 1,
    //   gap: 100,
    //   height: 450,
    //   arrows: false,
    //   autoplay: true,
    //   interval: 3000,
    //   loop: true
    // });

    // leer las imagenes del proyecto
    // Crear elemento de lista para Splide
    // const listItem = document.createElement('li');
    // listItem.classList.add('splide__slide');

    // // Crear imagen y establecer su fuente
    // const image = document.createElement('img');
    // image.src = imagen;

    // // Agregar la imagen al elemento de lista
    // listItem.appendChild(image);

    // // Agregar el elemento de lista al carrusel
    // carouselContainer.appendChild(listItem);

    // Montar el carrusel después de agregar todas las imágenes
    // carousel.mount();

    const proyectImg = Object.values(docSnap.data().proyectos[proyecto].imagenes);

    pintarImagenes.innerHTML = ''
    proyectImg.forEach(imagen => {
      pintarImagenes.innerHTML += `
      <div class="col s6 m4 l3">
          <img class="materialboxed responsive-img" src="${imagen}">
      </div>`;
    });

    const recomendarBtn = document.getElementById('recomendar-Btn');
    recomendarBtn.addEventListener('click', () => {
      recomedar(userUid, photoURL, nombre, profecion, provincia);
      recomendarBtn.classList.add('disabled');
    });


    if (user) {
      onSnapshot(doc(fs, "usuarios", user.uid), (doc) => {
        const userRecom = doc.data().misRecomendados[userUid];
        recomendarBtn.classList.remove('disabled');
        if (userRecom) {
          recomendarBtn.classList.add('green');
          recomendarBtn.classList.remove('red');
        } else {
          recomendarBtn.classList.add('red');
          recomendarBtn.classList.remove('green');
        }
      });
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

  });
}