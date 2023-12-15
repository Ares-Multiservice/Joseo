import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, getDoc, onSnapshot, query, where, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject, listAll, list } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
// import firebase from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"
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
const st = getStorage(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    leer()
  } else {
    window.location.href = '../signup/'
  }
});

document.getElementById('salir').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = '../signup/'
  })
});

const splideList = document.querySelector('#splideList');

export const guardarPropiedad = async () => {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const descripcion = document.getElementById('descripcion').value;
  const tipo = document.getElementById('tipo').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const opcion = document.getElementById('opcion').value;
  const habitaciones = document.getElementById('habitaciones').value;
  const baños = document.getElementById('baños').value;
  const parqueos = document.getElementById('parqueos').value;

  const loadWindous = document.querySelector('.load-windous');
  const body = document.querySelector('body');
  loadWindous.classList.remove('hide')
  body.classList.add('fixed');
  const documentId = nombre.replace(/\s/g, '');
  // Verificar si el nombre de la propiedad ya existe
  const docRef = doc(fs, "propiedades", documentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {

    loadWindous.classList.add('hide');
    body.classList.remove('fixed');
    document.getElementById('nombre-verified').classList.remove('hide');
    setTimeout(() => {
      document.getElementById('nombre-verified').classList.add('hide');
    }, 3000);
  } else {
    var elems = document.querySelector('#modal-newpropiedad');
    var instance = M.Modal.init(elems, { "dismissible": false });
    instance.close();
    await setDoc(docRef, {
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      tipo: tipo,
      ubicacion: ubicacion,
      opcion: opcion,
      habitaciones: habitaciones,
      baños: baños,
      parqueos: parqueos

    }, { merge: true });

    var loadText = document.querySelector('#loadWindows h5');
    loadText.textContent = 'Creando referencias...'

    // Iterar sobre las imágenes en el carusel
    Array.from(splideList.children).forEach(async (item) => {
      const file = item.querySelector('img');
      const uploadPromises = [];
      let referencesUploaded = 0;

      for (let i = 0; i < splideList.children.length; i++) {

        // Convertir la URL de la imagen a un Blob
        const response = await fetch(file.src);
        const blob = await response.blob();

        // Crear una referencia única para cada imagen (1 al 10)
        const imageNumber = i + 1;

        // Subir la imagen a Firebase Storage
        const imageName = `url${imageNumber}`;
        const storageRef = ref(st, `${documentId}/${file.alt}`);
        // Subir la imagen a Firebase Storage
        const uploadTask = uploadBytes(storageRef, blob);

        uploadPromises.push(uploadTask.then(async (snapshot) => {
          // subir imagenes a firebase
          const downloadURL = await getDownloadURL(snapshot.ref);
          await setDoc(docRef, { imagenes: { [imageName]: downloadURL } }, { merge: true })
          referencesUploaded++;

          loadText.textContent = 'Subiendo imagenes...';
        }))
        if (referencesUploaded === imageNumber) {
          break;
        }
      }

      // Puedes realizar acciones después de que todas las imágenes se hayan subido y almacenado en Firestore
      await Promise.all(uploadPromises);
      loadText.textContent = 'Finalizando...';
      // window.location.reload();
      loadWindous.classList.add('hide')
      body.classList.remove('fixed');

    });
  }
};

/// Obtener referencias a los elementos del DOM
const leerPropiedades = document.querySelector('#leerPropiedades');
const filtrarTipo = document.getElementById('filtrarTipo');
const filtrarUbicacion = document.getElementById('filtrarUbicacion');
const filtrarOption = document.getElementById('filtrarOpcion');


// Función para realizar la lectura inicial
async function leer() {
  // Agregar eventos de cambio a los elementos de filtro
  filtrarTipo.addEventListener('change', filtrar);
  filtrarUbicacion.addEventListener('change', filtrar);
  filtrarOption.addEventListener('change', filtrar);
  // Limpiar el contenido antes de mostrar los nuevos resultados
  leerPropiedades.innerHTML = '';

  // Realizar la consulta a la base de datos
  const querySnapshot = await getDocs(collection(fs, "propiedades"));

  querySnapshot.forEach(async (docu) => {
    const { tipo, ubicacion, imagenes, nombre, precio } = docu.data();

    const tarjetaHTML = `
      <div class="col s6 m4 l3 ">
        <div class="card carta">
          <div class="card-image">
            <img src="${imagenes.url3}">
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <b class="truncate nombre">${nombre}</b>
              <p class="truncate"><b>Tipo:</b> <span class="tipo">${tipo}</span></p>
              <p class="truncate"><b>Ubicacion:</b> <span class="ubicacion">${ubicacion}</span></p>
              <p><b class="truncate">Precio:</b> <span class="precio">${precio}</span></p>
            </div>
            <div class="card-action">
              <a href="#modal-editar" class="btn-small orange modal-trigger" title="editar">
                <i class="fa-solid fa-pen-to-square disabled"></i>
              </a>
              <a href="#modal-delete" class="btn btn-small red modal-trigger" title="borrar">
                <i class="fa-solid fa-trash disabled"></i>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    leerPropiedades.innerHTML += tarjetaHTML;
  });

  // Función para realizar la filtración
  async function filtrar() {
    // Limpiar el contenido antes de mostrar los nuevos resultados
    leerPropiedades.innerHTML = '';

    // Construir la consulta base
    let q = query(collection(fs, "propiedades"));

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
    const querySnapshot = await getDocs(q);

    // Filtrar y mostrar los resultados
    querySnapshot.forEach((docSnap) => {
      const imagenes = docSnap.data().imagenes;
      const nombre = docSnap.data().nombre;
      const tipo = docSnap.data().tipo;
      const ubicacion = docSnap.data().ubicacion;
      const precio = docSnap.data().precio;

      const tarjetaHTML = `
        <div class="col s6 m4 l3 ">
          <div class="card carta">
            <div class="card-image">
              <img src="${imagenes.url3}">
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <b class="truncate nombre">${nombre}</b>
                <p class="truncate"><b>Tipo:</b> <span class="tipo">${tipo}</span></p>
                <p class="truncate"><b>Ubicacion:</b> <span class="ubicacion">${ubicacion}</span></p>
                <p><b class="truncate">Precio:</b> <span class="precio">${precio}</span></p>
              </div>
              <div class="card-action">
                <a href="#modal-editar" class="btn-small orange modal-trigger" title="editar">
                  <i class="fa-solid fa-pen-to-square disabled"></i>
                </a>
                <a href="#modal-delete" class="btn btn-small red modal-trigger" title="borrar">
                  <i class="fa-solid fa-trash disabled"></i>
                </a>
              </div>
            </div>
          </div>
        </div>`;
      leerPropiedades.innerHTML += tarjetaHTML;
    });
  }
}

async function borrarPropiedad(documentId) {
  // const docRef = doc(fs, "propiedades", documentId);
  // const docSnap = await getDoc(docRef);

  const carpetaRef = ref(st, documentId);

  // Obtener la lista de objetos en la carpeta
  const objetosEnCarpeta = await list(carpetaRef);

  // Borrar cada objeto en la carpeta
  await Promise.all(objetosEnCarpeta.items.map(async (objeto) => {
    await deleteObject(objeto);
  }));

  // Borrar la carpeta después de borrar todos los objetos
  await deleteDoc(doc(fs, "propiedades", documentId))
  window.location.reload();
  await deleteObject(carpetaRef);

}

async function editarPropiedad(documentId) {

  const docRef = doc(fs, "propiedades", documentId);
  const docSnap = await getDoc(docRef);

  document.getElementById('editar-precio').value = docSnap.data().precio;
  document.getElementById('editar-descripcion').value = docSnap.data().descripcion;
  document.getElementById('editar-opcion').value = docSnap.data().opcion;
  const checkBox = document.getElementById('editar-opcion');
  if (checkBox.value === 'Alquiler') {
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }

}

// funciones de botones de las cartas
leerPropiedades.addEventListener('click', (event) => {
  const e = event.target;
  const cardStacked = e.parentElement.parentElement;
  const nombre = cardStacked.querySelector('b').textContent;
  const documentId = nombre.replace(/\s/g, '');
  if (e.classList.contains('red')) {
    document.querySelector('#deletePropiedad').addEventListener('click', () => {
      borrarPropiedad(documentId)
    });
  }

  if (e.classList.contains('orange')) {
    editarPropiedad(documentId)
  }
})