M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "../"
  }).catch((err) => {
    alert("ha ocurrido un error inesperado, intente de nuevo mas tarde")
  });
})
const body = document.querySelector('body');
const loader = document.querySelector('.load-container');

function viewload() {
  body.classList.add('fixed-container');
  loader.classList.remove('hide');

}
function stopload() {
  body.classList.remove('fixed-container');
  loader.classList.add('hide');
}

function observador() {
  const navWrapperMessage = document.querySelector('.nav-wrapper-message');
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
      if (emailVerified) {
        navWrapperMessage.classList.add('hide');
      } else {
        navWrapperMessage.classList.remove('hide');
      }
      entrarBtn.classList.add('hide');
      userMenuTrigger.classList.remove('hide');
    } else {
      // User is signed out.
      entrarBtn.classList.remove('hide');
      userMenuTrigger.classList.add('hide');
    }
    leer(user)
  });
  stopload()
};
observador()
function leerNotificaciones(uid) {
  //leer las notificaciones
  onSnapshot(doc(fs, "usuarios", uid), (doc) => {
    console.log("Current data: ", doc.data());
  });

}

// mapa de ubicaciones
// mapa de ubicaciones
// mapa de ubicaciones

var map = L.map('map-container', {
  center: [18.833515396433512, -70.42233734767194],
  zoom: 6.4,
  fullscreenControl: {
    pseudoFullscreen: false, // if true, fullscreen to page width and height
    position: 'topright'
  }

});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([18.833515396433512, -70.42233734767194], { draggable: true }).addTo(map);
function updateMarkerLocation(latlng) {
  marker.setLatLng(latlng);
}

marker.on('dragend', function (event) {
  updateMarkerLocation(event.target.getLatLng());
});

map.on('click', function (e) {
  updateMarkerLocation(e.latlng);
});

var geoLocation = L.control.locate({
  setView: true,
  maxZoom: 16,
  // position: 'topright',
  showCompass: false,
  drawMarker: false,
  showPopup: false

}).addTo(map);


// Evento al obtener la geolocalización del usuario
map.on('locationfound', function (e) {
  // var radius = e.accuracy / 2;
  // L.circle(e.latlng, radius).addTo(map);
  updateMarkerLocation(e.latlng);
});

// Función para realizar la lectura inicial
async function leer(user) {
  const uid = user.uid;
  const fotoDeperfil = document.querySelector('#userPhoto');
  const nombreCont = document.querySelector('#userName');
  // notificaciones
  const alertsBtn = document.querySelector('#alertsBtn');
  const alertsContainer = document.querySelector('#alertsContainer');
  const vefifAlerts = document.querySelector('#vefifAlerts');

  const profecionUbicacionCont = document.querySelector('#userProfecionUbicacion');
  const presentacionCont = document.querySelector('#userpresentacion');
  const recomendaciones = document.querySelector('#recoms');

  // pintar en el modal de edicion de perfil
  const cardUsuario = document.getElementById('modal-card-usuario');
  const cardNombre = document.getElementById('modal-card-nombre');
  const cardProfecion = document.getElementById('modal-card-profecion');
  const cardUbicacion = document.getElementById('modal-card-ubicacion');

  // inputs de edicion de perfil
  const editNombre = document.getElementById('editNombre');
  const editNombre2 = document.getElementById('editNombre2');
  const editProfecion = document.getElementById('editProfecion');
  const editUbicacion = document.getElementById('editUbicacion');

  // var hrefValue = window.location.href;
  // var pathname = window.location.pathname;
  // const removerdor = pathname.replace('/perfil/', '');
  // const queryString = removerdor.toString();
  // const documentId = decodeURIComponent(queryString);

  const docRef = doc(fs, "usuarios", uid);
  const docSnap = await getDoc(docRef);
  // const imagenes = [docSnap.data().imagenes];

  if (docSnap.exists()) {
    const { id, photoURL, nombre, profecion, provincia, presentacion, recoms, notificaciones } = docSnap.data();
    fotoDeperfil.src = photoURL;
    nombreCont.textContent = nombre;
    // leer las notificaciones

    alertsContainer.innerHTML = '';
    if (notificaciones) {
      vefifAlerts.classList.add('hide');
      alertsContainer.classList.remove('hide');
    }
    // Recorrer el objeto de notificaciones con un bucle for...in
    for (var key in notificaciones) {
      if (notificaciones.hasOwnProperty(key)) {
        var notificacion = notificaciones[key];
        console.log(notificaciones);

        alertsContainer.innerHTML += `
        <li class="active"><a href="#!">
                <div class="valign-wrapper">
                <img class="circle" src="${notificacion.img}" alt="user">&nbsp;
                <span>${notificacion.text}</span>
                </div>
                <div class="center"><b>${notificacion.date}</b></div>
            </a>
        </li>`
  
        if (notificacion.visible) {
          alertsBtn.innerHTML = `<i class="fa-solid fa-bell"></i>`
          alertsBtn.classList.add('red');
          alertsBtn.classList.add('pulse');
          alertsBtn.classList.add('btn-floating');
          alertsBtn.classList.add('btn-small');
          alertsContainer.querySelector('li').classList.add('active');
        } else {
          alertsBtn.innerHTML = `<i class="fa-regular fa-bell"></i>`
          alertsBtn.classList.remove('red');
          alertsBtn.classList.remove('pulse');
          alertsBtn.classList.remove('btn-floating');
          alertsBtn.classList.remove('btn-small');
          alertsContainer.querySelector('li').classList.remove('active');
  
        }
  
  
        alertsContainer.addEventListener('click', (e) => {
          const element = e.target;
          element.classList.remove('active');
          setDoc(docRef, {
            notificaciones: {
              notificacion1: {
                visible: false
              }
            }
          }, { merge: true }).then(() => {
            alertsBtn.innerHTML = `<i class="fa-regular fa-bell"></i>`
            alertsBtn.classList.remove('red');
            alertsBtn.classList.remove('pulse');
            alertsBtn.classList.remove('btn-floating');
            alertsBtn.classList.remove('btn-small');
          })
  
        })
      }
    }


    // continuar con la lectura de las notificaciones, hacer que al leerse se descative el active 

    profecionUbicacionCont.textContent = `${profecion} en ${provincia}`;
    presentacionCont.textContent = presentacion;
    recomendaciones.textContent = recoms;


    // pintar en el modal de edicion de perfil
    cardUsuario.textContent = id;
    cardNombre.textContent = nombre;
    cardProfecion.textContent = profecion;
    cardUbicacion.textContent = provincia;

    // pintar en el input de edicion de informacion
    var nombreSplit = nombre.split(' ');
    editNombre.value = nombreSplit[0];
    editNombre2.value = nombreSplit[1];
    editProfecion.value = profecion;
    editUbicacion.value = provincia;

    // editar nombre
    function editarNombre() {
      const nameform = document.querySelector('#nameForm');
      const saveUserNameBtn = document.querySelector('#saveUserName');
      const cancelUserName = document.querySelector('#cancelUserName');

      saveUserNameBtn.addEventListener('click', () => {
        viewload()
        updateProfile(auth.currentUser, {
          displayName: `${editNombre.value} ${editNombre2.value}`
          //  photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
          setDoc(docRef, {
            id: `${editNombre.value}${editNombre2.value}`,
            nombre: `${editNombre.value} ${editNombre2.value}`
          }, { merge: true }).then(() => {
            window.location.reload();
          })
        }).catch(() => {
          stopload()
          alert('ha ocurrido un error inesperado, vuelve a intentarlo despues..');
        });
      });

      cancelUserName.addEventListener('click', () => {
        saveUserNameBtn.classList.add('hide');
        nameform.reset();
        editNombre.value = nombreSplit[0];
        editNombre2.value = nombreSplit[1];
      });

      const expresiones = {
        nombre: /^([a-zA-ZÀ-ÿ]{3,20})$/,
      }

      const validar = (e) => {
        switch (e.target.name) {
          case "nombre":
            validarCampo(expresiones.nombre, e.target);
            break;
          case "apellido":
            validarCampo(expresiones.nombre, e.target);
            break;
        }
      }

      const validarCampo = (expresion, input) => {
        if (expresion.test(input.value)) {
          if (editNombre.value !== nombreSplit[0] || editNombre2.value !== nombreSplit[1]) {
            saveUserNameBtn.classList.remove('hide');
            editNombre.classList.add('valid');
            editNombre2.classList.add('valid');
          } else {
            saveUserNameBtn.classList.add('hide');
            editNombre.classList.add('invalid');
            editNombre2.classList.add('invalid');
          }
        } else {
          saveUserNameBtn.classList.add('hide');
          editNombre.classList.add('invalid');
          editNombre2.classList.add('invalid');
        }
      }

      editNombre.addEventListener('keyup', validar);
      editNombre2.addEventListener('keyup', validar);
    }
    editarNombre();



    // editar presentacion
    // editar presentacion
    // editar presentacion
    presentacionCont.addEventListener('keyup', viewpresentacionBtns);
    function viewpresentacionBtns() {
      const form = document.querySelector('#presentacionForm');
      const presentacionBtns = document.querySelector('#actionUserpresentacion');
      const saveUserpresentacion = document.querySelector('#saveUserpresentacion');
      const cancelUserpresentacion = document.querySelector('#cancelUserpresentacion');
      if (presentacionCont.value !== presentacion) {
        presentacionBtns.classList.remove('hide');
        saveUserpresentacion.addEventListener('click', () => {
          setDoc(docRef, {
            presentacion: presentacionCont.value
          }, { merge: true }).then(() => {
            window.location.reload();
          }).catch(() => {
            alert('ha ocurrido un error inesperado, vuelve a intentarlo despues..')
          });
        });
        cancelUserpresentacion.addEventListener('click', () => {
          presentacionBtns.classList.add('hide');
          form.reset();
        });
      } else {
        presentacionBtns.classList.add('hide');
      }
    }

  }

}