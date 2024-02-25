
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, setDoc, doc, deleteDoc, updateDoc, deleteField, getDocs, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata, getBlob } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
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
const st = getStorage(app);

document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = "../"
  }).catch((err) => {
    alert("ha ocurrido un error inesperado, intente de nuevo mas tarde")
  });
})

const body = document.querySelector('body');
const loader = document.querySelector('.load-container');
const steps = document.querySelectorAll('.step');
const stepsIcons = document.querySelectorAll('.step .check');

function viewLoadWindows() {
  body.classList.add('fixed-container');
  loader.classList.remove('hide');
}
viewLoadWindows()

function hideLoadWindows() {
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
        steps[0].classList.add('valid');
        stepsIcons[0].classList.remove('hide');
      } else {
        dropDownImage.src = '/';
        navImage.src = photoURL;
      }

      if (displayName) {
        var nombre = `${displayName}`;
        nombre = nombre.split(' ');
        dropDownName.textContent = nombre[0];
        document.title = displayName;
      }
      if (emailVerified) {
        navWrapperMessage.classList.add('hide');
        steps[2].classList.add('valid');
        stepsIcons[2].classList.remove('hide');
      } else {
        navWrapperMessage.classList.remove('hide');
      }
      entrarBtn.classList.add('hide');
      userMenuTrigger.classList.remove('hide');
    } else {
      // User is signed out.
      entrarBtn.classList.remove('hide');
      userMenuTrigger.classList.add('hide');
      body.innerHTML = ' <span class="center-align"><h5> Pagina no encontrada</h5><a href="../" class="cursor-pointer"> ir a inicio </a></span>'
    }
    leer(user)
  });
};
observador()


// Función para realizar la lectura inicial

async function leer(user) {
  const uid = user.uid;
  const fotoDeperfil = document.querySelector('#userPhoto');
  const nombreCont = document.querySelector('#userName');
  const verPerfilBtn = document.querySelector('#ver-perfil-btn');

  const profecionUbicacionCont = document.querySelector('#userProfecionUbicacion');
  const dataPresentacion = document.querySelector('#data-presentacion');
  const presentacionCont = document.querySelector('#userpresentacion');
  const recomendaciones = document.querySelector('#recoms');

  // pintar en el modal de edicion de perfil
  const cardUsuario = document.getElementById('modal-card-usuario');
  const cardNombre = document.getElementById('modal-card-nombre');
  const cardProfecion = document.getElementById('modal-card-profecion');
  const cardHabilidades = document.getElementById('modal-card-habilidades');
  const cardUbicacion = document.getElementById('modal-card-ubicacion');
  const cardTelefono = document.getElementById('modal-card-telefono');

  // inputs de edicion de perfil
  const editUsuario = document.getElementById('editUsuario');
  const editNombre = document.getElementById('editNombre');
  const editNombre2 = document.getElementById('editNombre2');
  const editProfecion = document.getElementById('editProfecion');
  const editHabilidades = document.getElementById('editHabilidades');
  const editUbicacion = document.getElementById('editUbicacion');
  const editTelefono = document.getElementById('editTelefono');

  // var hrefValue = window.location.href;
  // var pathname = window.location.pathname;
  // const removerdor = pathname.replace('/perfil/', '');
  // const queryString = removerdor.toString();
  // const documentId = decodeURIComponent(queryString);

  const expresiones = {
    usuario: /^([a-zA-ZÀ-ÿ0-9]{3,15})([_-]?)([a-zA-ZÀ-ÿ0-9]{3,15})$/,
    nombre: /^([a-zA-ZÀ-ÿ]{3,20})$/,
    telefono: /^\((809|829|849)\)\s\d{3}\-\d{4}$/
  }

  const campos = {
    usuario: false,
    faceboo: false,
    instagram: false,
    xtwitter: false,
    linkedin: false,
    youtube: false
  }

  const docRef = doc(fs, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  // obtener la fecha actual
  var fechaActual = new Date();

  var mesesAbreviados = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  var año = fechaActual.getFullYear();
  var mes = mesesAbreviados[fechaActual.getMonth()]; // Obtener el nombre del mes abreviado
  var dia = fechaActual.getDate();
  var hora = fechaActual.getHours();
  var minuto = fechaActual.getMinutes();
  var segundo = fechaActual.getSeconds();
  var meridiano = hora >= 12 ? 'PM' : 'AM';

  // Convertir la hora a formato de 12 horas
  hora = hora % 12;
  hora = hora === 0 ? 12 : hora;

  // // Ejemplo de uso
  var codigoGenerado = `${año}${dia}${hora < 10 ? '0' : ''}${hora}${minuto < 10 ? '0' : ''}${minuto}${segundo < 10 ? '0' : ''}${segundo}`;

  if (docSnap.exists()) {
    const { id, photoURL, imagenDeFondo, nombre, presentacion, profecion, habilidades,
      provincia, ubicacion, phoneNumber, redessociales, recoms, notificaciones, servicios } = docSnap.data();
    // leer las informaciones y pintarlas en leer usuario
    if (photoURL) {
      fotoDeperfil.src = photoURL;
    }
    nombreCont.textContent = nombre;
    profecionUbicacionCont.textContent = `${profecion} en ${provincia}`;
    presentacionCont.textContent = presentacion;
    dataPresentacion.textContent = presentacion;
    recomendaciones.textContent = recoms + ' puntos';
    verPerfilBtn.href = `../v/${id}`

    // leer las notificaciones
    async function leerNotificaciones() {

      M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), { closeOnClick: false });

      const alertsBtn = document.querySelector('#alertsBtn');
      const alertsContainer = document.getElementById('alertsContainer');
      const vefifAlerts = document.querySelector('#verifAlerts');

      // comprobar que no hayan elementos con la clase active y si hay alguno activar el boton de notificaciones
      function activeBtn() {
        const liElements = alertsContainer.querySelectorAll('li');
        liElements.forEach(li => {
          if (li.classList.contains('active')) {
            // Código si la clase 'active' está presente en algún li
            alertsBtn.innerHTML = `<i class="fa-solid fa-bell"></i>`;
            alertsBtn.classList.add('red', 'pulse', 'btn-floating', 'btn-small');
          } else {
            alertsBtn.innerHTML = `<i class="fa-regular fa-bell"></i>`;
            alertsBtn.classList.remove('red', 'pulse', 'btn-floating', 'btn-small');
          }
        });

      }

      // Ordenar el array en base a la propiedad 'date' de manera descendente
      // Convertir el objeto a un array de objetos
      const notificacionesArray = Object.values(notificaciones);

      notificacionesArray.sort((a, b) => b.id - a.id);
      alertsContainer.innerHTML = '';

      notificacionesArray.forEach(notif => {
        var docs = notificaciones[notif.id] = notif;
        const id = docs.id;
        const img = docs.img;
        const text = docs.text;
        const date = docs.date;

        if (notif) {
          vefifAlerts.classList.add('hide');
          alertsContainer.classList.remove('hide');
        }

        const notificacionActive = () => {
          alertsContainer.innerHTML += `
                  <li class="active" data-id="${id}">
                      <a>
                          <div class="valign-wrapper">
                              <img class="circle" src="${img}" alt="user">&nbsp;
                              <span>${text}</span>
                          </div>
                          <div class="center"><b>${date}</b></div>
                      </a>
                  </li>`;
        }

        const notificacionDisable = () => {
          alertsContainer.innerHTML += `
                  <li class="" data-id="${id}">
                      <a>
                          <div class="valign-wrapper">
                              <img class="circle" src="${img}" alt="user">&nbsp;
                              <span>${text}</span>
                          </div>
                          <div class="center"><b>${date}</b></div>
                      </a>
                  </li>`;
        }

        if (docs.visible) {
          notificacionActive();
          activeBtn()

          alertsContainer.addEventListener('click', (e) => {
            const element = e.target;
            const dataId = element.dataset.id;

            setDoc(docRef, {
              notificaciones: {
                [dataId]: {
                  visible: false
                }
              },
            }, { merge: true }).then(() => {
              element.classList.remove('active');
              activeBtn()
            });
          });
        } else {
          notificacionDisable();
        }
      });

    }
    leerNotificaciones();

    // pintar en el modal de edicion de perfil
    cardUsuario.textContent = id;
    cardNombre.textContent = nombre;
    cardProfecion.textContent = profecion;
    cardUbicacion.textContent = provincia;
    if (habilidades) {

      habilidades.forEach(valor => {
        // Buscar la opción con el valor correspondiente y marcarla como seleccionada
        const option = editHabilidades.querySelector(`option[value="${valor}"]`);
        if (option) {
          option.selected = true;
          // Opcional: Mostrar los valores en otro lugar (cardHabilidades)
          cardHabilidades.innerHTML += ` (${valor}) `;
        }
      });
      steps[4].classList.add('valid');
      stepsIcons[4].classList.remove('hide');

    }

    // pintar en el input de edicion de informacion
    editUsuario.value = id;
    var nombreSplit = nombre.split(' ');
    editNombre.value = nombreSplit[0];
    editNombre2.value = nombreSplit[1];
    editProfecion.value = profecion;
    editUbicacion.value = provincia;

    // pintar el numero de telefono el modal de edicion de perfil y el input de edicion
    if (phoneNumber) {
      cardTelefono.textContent = phoneNumber;
      editTelefono.value = phoneNumber.replace("+1 ", "");
      steps[3].classList.add('valid');
      stepsIcons[3].classList.remove('hide');
    } else {
      cardTelefono.textContent = 'vacio';
    }

    async function editarUsuario() {

      const userIdform = document.querySelector('#userIdForm');
      const saveUserIdBtn = document.querySelector('#guardar-usuario');
      const verifUsuario = document.querySelector('#verif-usuario');
      const cancelUserId = document.querySelector('#cancelUserId');

      saveUserIdBtn.addEventListener('click', async () => {
        viewLoadWindows();
        // Verificamos si el usuario ya existe en la base de datos
        const userExists = await checkUserExists(editUsuario.value);

        if (!userExists && campos.usuario) {
          setDoc(docRef, {
            id: editUsuario.value,
            notificaciones: {
              [codigoGenerado]: {
                id: codigoGenerado,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, haz cambiado tu id de usuario con exito <i class="fa-regular fa-face-smile"></i> !`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }
          }, { merge: true })
            .then(() => {
              window.location.reload();
            })
            .catch(() => {
              hideLoadWindows();
              alert('Ha ocurrido un error inesperado, vuelve a intentarlo después.');
            });
        } else {
          hideLoadWindows();
          alert('El usuario ya está registrado o el formato es inválido.');
        }
      });

      cancelUserId.addEventListener('click', () => {
        saveUserIdBtn.classList.add('hide');
        userIdform.reset();
        editUsuario.value = id;
      });

      const querySnapshot = await getDocs(collection(fs, 'usuarios'));
      querySnapshot.forEach((doc) => {
        const validarCampo = (expresion, input) => {
          const userId = doc.data().id;
          if (input.value !== userId) {
            if (!expresion.test(input.value)) {
              editUsuario.classList.add('invalid');
              verifUsuario.classList.remove('hide');
              saveUserIdBtn.classList.add('hide');
              campos.usuario = false;
            } else {
              editUsuario.classList.remove('invalid'); // Corregimos este caso
              verifUsuario.classList.add('hide');
              saveUserIdBtn.classList.remove('hide');
              campos.usuario = true;
            }
          } else {
            editUsuario.classList.remove('invalid'); // Corregimos este caso
            verifUsuario.classList.add('hide');
            saveUserIdBtn.classList.remove('hide');
            campos.usuario = true;
          }
        };

        editUsuario.addEventListener('keyup', (e) => {
          validarCampo(expresiones.usuario, e.target);
        });

        editUsuario.addEventListener('blur', (e) => {
          validarCampo(expresiones.usuario, e.target);
        });
      });
    }

    // Función para verificar si el usuario ya está registrado en la base de datos
    async function checkUserExists(username) {
      const querySnapshot = await getDocs(query(collection(fs, 'usuarios'), where('id', '==', username)));
      return querySnapshot.size > 0;
    }
    editarUsuario();

    // editar nombre
    function editarNombre() {
      const nameform = document.querySelector('#nameForm');
      const saveUserNameBtn = document.querySelector('#saveUserName');
      const cancelUserName = document.querySelector('#cancelUserName');

      saveUserNameBtn.addEventListener('click', () => {
        viewLoadWindows()
        updateProfile(auth.currentUser, {
          displayName: `${editNombre.value} ${editNombre2.value}`
          //  photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
          setDoc(docRef, {
            nombre: `${editNombre.value} ${editNombre2.value}`,
            notificaciones: {
              [codigoGenerado]: {
                id: codigoGenerado,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, haz cambiado tu nombre con exito <i class="fa-regular fa-face-smile"></i> !`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }
          }, { merge: true }).then(() => {
            window.location.reload();
          })
        }).catch(() => {
          hideLoadWindows()
          alert('ha ocurrido un error inesperado, vuelve a intentarlo despues..');
        });
      });

      cancelUserName.addEventListener('click', () => {
        saveUserNameBtn.classList.add('hide');
        nameform.reset();
        editNombre.value = nombreSplit[0];
        editNombre2.value = nombreSplit[1];
      });

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
            presentacion: presentacionCont.value,
            notificaciones: {
              [codigoGenerado]: {
                id: codigoGenerado,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, haz cambiado tu presentacion con exito <i class="fa-regular fa-face-smile"></i> !`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }
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

    // editar profecion y habilidades
    const guardarProfecion = document.getElementById('guardar-profecion');
    function editarProfecion() {
      const selectedValues = Array.from(editHabilidades.selectedOptions).map(option => option.value);
      if (editProfecion.value !== profecion || editHabilidades.selectedOptions) {
        guardarProfecion.classList.remove('hide');
      } else {
        guardarProfecion.classList.add('hide');
      }
      const guardarProfeciones = (selectValues) => {
        setDoc(docRef, {
          profecion: editProfecion.value,
          habilidades: selectValues,
          notificaciones: {
            [codigoGenerado]: {
              id: codigoGenerado,
              visible: true,
              img: '/imagenes/logo bg azul.png',
              text: `<b>${nombre}</b>, haz cambiado tu profecion con exito <i class="fa-regular fa-face-smile"></i> !`,
              date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
            }
          }
        }, { merge: true })
          .then(() => {
            window.location.reload();
          })
          .catch(() => {
            hideLoadWindows();
            alert('Ha ocurrido un error inesperado, vuelve a intentarlo después.');
          });
      }
      guardarProfecion.addEventListener('click', () => {
        if (!editHabilidades.value) {
          guardarProfeciones(false)
        } else {
          guardarProfeciones(selectedValues)
        }

      })
    }
    editProfecion.addEventListener('change', () => { editarProfecion() });
    editHabilidades.addEventListener('change', () => { editarProfecion() });


    // mapa de edicion de ubicaciones
    // mapa de edicion de ubicaciones
    // mapa de edicion de ubicaciones
    var marker = '';
    function leerMapa() {
      var map = L.map('map-container', {
        center: [ubicacion.LatitudX, ubicacion.LongitudY],
        zoom: 24,
        fullscreenControl: {
          pseudoFullscreen: false, // if true, fullscreen to page width and height
          position: 'topright'
        }

      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      marker = L.marker([ubicacion.LatitudX, ubicacion.LongitudY], { draggable: true }).addTo(map);
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
        maxZoom: 30,
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

    }
    // editar ubicacion
    const guardarUbicacion = document.getElementById('guardar-ubicacion');
    const openUbicacionmodal = document.getElementById('openUbicacionmodal');
    function editarUbicacion() {
      if (editUbicacion.value !== provincia) {
        guardarUbicacion.classList.remove('hide');
      } else {
        guardarUbicacion.classList.add('hide');
      }
      const guardarUbicaciones = () => {
        setDoc(docRef, {
          provincia: editUbicacion.value,
          ubicacion: {
            LatitudX: marker.getLatLng().lat,
            LongitudY: marker.getLatLng().lng
          },
          notificaciones: {
            [codigoGenerado]: {
              id: codigoGenerado,
              visible: true,
              img: '/imagenes/logo bg azul.png',
              text: `<b>${nombre}</b>, haz cambiado tu ubicacion con exito <i class="fa-regular fa-face-smile"></i> !`,
              date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
            }
          }
        }, { merge: true })
          .then(() => {
            window.location.reload();
          })
          .catch(() => {
            hideLoadWindows();
            alert('Ha ocurrido un error inesperado, vuelve a intentarlo después.');
          });
      }
      guardarUbicacion.addEventListener('click', () => {
        guardarUbicaciones()
      })
    }
    editUbicacion.addEventListener('change', () => { editarUbicacion() });
    openUbicacionmodal.addEventListener('click', () => { setTimeout(() => { leerMapa() }, 50); })

    // editar foto del perfil
    // editar foto del perfil

    const editarUserPhotoURL = () => {

      // Inicializar el modal
      var modal = M.Modal.init(document.getElementById('modal-editarFoto'));

      // Inicializar Cropper.js
      var cropper;

      // Función para manejar el cambio en la selección de la imagen
      function handleImageSelect(event) {
        var file = event.target.files;

        if (file && file.length > 0) {
          var reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById('croppperImg').src = e.target.result;
            modal.open(); // Abrir el modal automáticamente

            // Inicializar Cropper.js después de abrir el modal para asegurar que se renderice correctamente
            cropper = new Cropper(document.getElementById('croppperImg'), {
              aspectRatio: 1, // Relación de aspecto cuadrada para un área de corte circular
              viewMode: 1, // Fijar el área de recorte, la imagen se mueve dentro de ella
              dragMode: 'move', // Habilitar el modo de arrastre para mover la imagen dentro del área de recorte
              cropBoxResizable: false, // Desactivar el redimensionamiento del cuadro de recorte
              cropBoxMovable: false, // Desactivar el movimiento del cuadro de recorte
              autoCrop: true, // Activar el recorte automático al cargar la imagen
              background: false
            });
          };
          reader.readAsDataURL(file[0]);
        }

        // Manejar el clic en el botón de recorte dentro del modal
        document.getElementById('guardar-foto').addEventListener('click', function () {
          var canvas = cropper.getCroppedCanvas({
            width: 300, // Ajusta el ancho del lienzo recortado según tus necesidades
            height: 300, // Ajusta la altura del lienzo recortado según tus necesidades
          });

          // Mostrar la imagen recortada en la consola (puedes ajustar según tus necesidades)
          if (canvas) {
            canvas.toBlob((blob) => {
              // var imageURL = URL.createObjectURL(blob);  // Crea un objeto de URL a partir del Blob
              // console.log('URL del Blob:', imageURL);
              // Puedes realizar acciones adicionales con la imagen recortada aquí
              // Create the file metadata

              const metadata = {
                contentType: 'image/jpeg',
                customMetadata: {
                  timeUploaded: new Date().toISOString()
                }
              };

              // Upload file and metadata to the object 'images/mountains.jpg'
              const storageRef = ref(st, `${uid}/galeria/${file[0].name}`);
              const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

              // Listen for state changes, errors, and completion of the upload.
              uploadTask.on('state_changed',
                () => {
                  viewLoadWindows()
                  modal.close();
                },
                (error) => {
                  hideLoadWindows();
                  modal.open();
                  alert('algo salio mal, vuelve a intentarlo en un rato');
                },
                () => {
                  // Upload completed successfully, now we can get the download URL
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateProfile(auth.currentUser, {
                      photoURL: downloadURL
                    }).then(() => {
                      setDoc(docRef, {
                        photoURL: downloadURL,
                        notificaciones: {
                          [codigoGenerado]: {
                            id: codigoGenerado,
                            visible: true,
                            img: '/imagenes/logo bg azul.png',
                            text: `<b>${nombre}</b>, haz cambiado tu foto de perfil !`,
                            date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
                          }
                        }

                      }, { merge: true }).then(() => {
                        window.location.reload();
                      })
                    }).catch(function () {
                      alert('algo salio mal, vuelve a intentarlo en un rato');
                      hideLoadWindows();
                      modal.open();
                    })
                  }).catch(function () {
                    alert('algo salio mal, vuelve a intentarlo en un rato');
                    hideLoadWindows();
                    modal.open();
                  });
                }
              );
            })
          }

        });

        document.getElementById('cancelUserFoto').addEventListener('click', function () {
          cropper.destroy();
          croppperImg.src = '';
        });
      }

      // Manejar el cambio de selección de la imagen
      document.getElementById('seleccionar-imagen-input').addEventListener('change', handleImageSelect);

    };
    editarUserPhotoURL();

    // editar numero de telefono
    // editar numero de telefono
    // editar numero de telefono

    // editar nombre
    function editarTelefono() {
      const telefonoform = document.querySelector('#telefonoForm');
      const saveTelefonoBtn = document.querySelector('#guardar-telefono');
      const cancelTelefono = document.querySelector('#cancelTelefono');

      saveTelefonoBtn.addEventListener('click', () => {
        viewLoadWindows();

        setDoc(docRef, {
          phoneNumber: `+1 ${editTelefono.value}`,
          notificaciones: {
            [codigoGenerado]: {
              id: codigoGenerado,
              visible: true,
              img: '/imagenes/logo bg azul.png',
              text: `<b>${nombre}</b>, haz agregado tu nuevo numero de telefono con exito!`,
              date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
            }
          }
        }, { merge: true }).then(() => {
          window.location.reload();
        }).catch(() => {
          hideLoadWindows()
          alert('ha ocurrido un error inesperado, vuelve a intentarlo despues..');
        });
      });

      cancelTelefono.addEventListener('click', () => {
        saveTelefonoBtn.classList.add('hide');
        telefonoform.reset();
        editTelefono.value = phoneNumber;
      });

      const validar = (e) => {
        switch (e.target.name) {
          case "telefono":
            validarCampo(expresiones.telefono, e.target);
            break;
        }
      }

      const validarCampo = (expresion, input) => {
        if (expresion.test(input.value)) {
          saveTelefonoBtn.classList.remove('hide');
          editTelefono.classList.add('valid');
          editTelefono.classList.remove('invalid');
        } else {
          saveTelefonoBtn.classList.add('hide');
          editTelefono.classList.remove('valid');
          editTelefono.classList.add('invalid');
        }
      }

      editTelefono.addEventListener('keyup', validar);
    }
    editarTelefono();

    // editar redes sociales
    function eventRedesSociales() {
      const form = document.getElementById('redesSocialesForm');
      const inputs = document.querySelectorAll('#redesSocialesForm input');

      function validarCampo(input, campo) {
        const button = document.getElementById(`save${campo}`);
        function activarBoton() {
          if (input.value === redessociales[campo]) {
            button.classList.add('hide');
          } else {
            button.classList.remove('hide');
          }
        }

        if (input.value.length > 3) {
          input.classList.add('valid');
          input.classList.remove('invalid');
          activarBoton()
          campos[campo] = true;
        } else {
          input.classList.remove('valid');
          input.classList.add('invalid');
          button.classList.add('hide');
          campos[campo] = false;
        }

        function guardarRedes() {
          viewLoadWindows();

          setDoc(docRef, {
            redessociales: { [campo]: input.value, },
            notificaciones: {
              [codigoGenerado]: {
                id: codigoGenerado,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, haz agregado el enlace a ${campo} con exito!`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }
          }, { merge: true }).then(() => {
            window.location.reload();
          }).catch(() => {
            hideLoadWindows()
            alert('ha ocurrido un error inesperado, vuelve a intentarlo despues..');
          });
        }

        button.addEventListener('click', () => {
          if (campos[campo]) {
            guardarRedes()
          }
        });

      }

      inputs.forEach(input => {
        input.addEventListener('keyup', (e) => { validarCampo(e.target, e.target.name) });
        input.addEventListener('blur', (e) => { validarCampo(e.target, e.target.name) });
      });

      document.getElementById('cancelRedesSociales').addEventListener('click', function () {
        form.reset();
      });

      function leerRedesSociales() {

        if (redessociales) {
          steps[5].classList.add('valid');
          stepsIcons[5].classList.remove('hide');
        }

        // Dropdown Structure
        const redBoton = document.querySelectorAll('#drop-redes-sociales .red-social');
        redBoton[0].addEventListener('click', () => {
          const enlace = 'https://www.joseo.do/' + id;
          redBoton[1].title = enlace;
          navigator.clipboard.writeText(enlace) // Copiar el texto al portapapeles
            .then(() => {
              M.toast({ html: '¡Copiado!' }); // Mostrar un mensaje de éxito
            })
            .catch(err => {
              console.error('Error al copiar el texto: ', err); // Manejar cualquier error
            });
        });
        if (redessociales.facebook) {
          const enlace = 'https://facebook.com/' + redessociales.facebook;
          redBoton[1].href = enlace;
          redBoton[1].title = enlace;
          redBoton[1].classList.add('green-text');
          inputs[0].value = redessociales.facebook;
        }
        if (redessociales.instagram) {
          const enlace = 'https://instagram.com/' + redessociales.instagram;
          redBoton[2].href = enlace;
          redBoton[2].title = enlace;
          redBoton[2].classList.add('green-text');
          inputs[1].value = redessociales.instagram;
        }
        if (redessociales.xtwitter) {
          const enlace = 'https://twitter.com/' + redessociales.xtwitter;
          redBoton[3].href = enlace;
          redBoton[3].title = enlace;
          redBoton[3].classList.add('green-text');
          inputs[2].value = redessociales.xtwitter;
        }
        if (redessociales.linkedin) {
          const enlace = 'https://linkedin.com/' + redessociales.linkedin;
          redBoton[4].href = enlace;
          redBoton[4].title = enlace;
          redBoton[4].classList.add('green-text');
          inputs[3].value = redessociales.linkedin;
        }
        if (redessociales.youtube) {
          const enlace = 'https://youtube.com/@' + redessociales.youtube;
          redBoton[5].href = enlace;
          redBoton[5].title = enlace;
          redBoton[5].classList.add('green-text');
          inputs[4].value = redessociales.youtube;
        }
      }

      document.addEventListener('DOMContentLoaded', leerRedesSociales())

    }

    eventRedesSociales()

    function leerGaleria() {
      const imageContainer = document.getElementById('contenedor-imagenes');
      const parallaxImage = document.getElementById('parallax-image');
      const eliminarFotoBtn = document.getElementById('eliminar-foto-btn');
      const usarfotobtn = document.getElementById('usar-antigua-foto-btn');
      const ordenSelect = document.getElementById('ordenar-imagenes');

      const listRef = ref(st, `${uid}/galeria`);
      listAll(listRef).then(async (result) => {

        async function renderizarImagenes(querySnapshot) {
          // Volver a mostrar las fotos ordenadas
          imageContainer.innerHTML = '';

          for (const imageRef of querySnapshot) {
            // const metadata = await getMetadata(imageRef);

            const url = await getDownloadURL(imageRef);

            // comprobar que no se pueda borrar la imagen de perfil actual
            if (url === photoURL) {
              imageContainer.innerHTML += `
                <div class="col s6 m4 l3 mis-fotos">
                  <img class="materialboxed responsive-img" src="${url}">
                </div>
              `;
            } else {
              imageContainer.innerHTML += `
                <div class="col s6 m4 l3 mis-fotos">
                  <img class="materialboxed responsive-img" src="${url}">
                  <a data-id='${imageRef}' href='#modal-foto-opciones' class="modal-trigger trigger" title='Opciones'>
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </a>
                </div>
              `;
            }
          }

          // Agrega un evento de clic al botón de eliminar
          imageContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('modal-trigger')) {
              eliminarFotoBtn.dataset.id = target.dataset.id;
              usarfotobtn.dataset.id = target.parentElement.querySelector('img').src;
            }
          });
        }

        async function ordenarImagenes() {

          // Obtener el valor seleccionado en el select
          const ordenSeleccionado = ordenSelect.value;

          // Obtener metadatos para cada imagen y organizar según la propiedad updated
          const imagesWithMetadata = await Promise.all(
            result.items.map(async (imageRef) => {
              const metadata = await getMetadata(imageRef);
              return { imageRef, metadata };
            })
          );

          // Ordenar las imágenes según la opción seleccionada
          imagesWithMetadata.sort((a, b) => {
            const timestampA = new Date(a.metadata.updated).getTime();
            const timestampB = new Date(b.metadata.updated).getTime();

            return ordenSeleccionado === 'Ascendente' ? timestampA - timestampB : timestampB - timestampA;
          });

          // Renderizar las imágenes ordenadas
          renderizarImagenes(imagesWithMetadata.map((item) => item.imageRef));
        }

        // Agrega un evento change al select para reordenar las imágenes
        ordenSelect.addEventListener('change', ordenarImagenes);

        // Llama a la función para ordenar y renderizar inicialmente
        ordenarImagenes();

        // async function parallaxAutoplay() {
        //   const items = result.items;
        //   if (items.length !== 0) {
        //     let index = 0;

        //     const updateParallaxImage = async () => {
        //       const url = await getDownloadURL(items[index]);
        //       parallaxImage.src = url;
        //     };

        //     setInterval(() => {
        //       index = (index < items.length - 1) ? index + 1 : 0;
        //       updateParallaxImage();
        //     }, 30000);

        //     updateParallaxImage();

        //   }
        // }
        // parallaxAutoplay();

        // usar foto como perfil
        usarfotobtn.addEventListener('click', async (e) => {
          const imageRef = e.target.dataset.id;
          try {
            await updateProfile(auth.currentUser, {
              photoURL: imageRef
            });

            await setDoc(docRef, {
              photoURL: imageRef,
              notificaciones: {
                [codigoGenerado]: {
                  id: codigoGenerado,
                  visible: true,
                  img: '/imagenes/logo bg azul.png',
                  text: `<b>${nombre}</b>, has cambiado tu foto de perfil !`,
                  date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
                }
              }
            }, { merge: true });

            window.location.reload();
          } catch (error) {
            alert('Ha ocurrido un error. Inténtalo de nuevo más tarde.');
          }
        });

        // En tu modal, manejas el clic del botón de eliminación
        eliminarFotoBtn.addEventListener('click', async (e) => {
          const imageRef = e.target.dataset.id;
          // Elimina la imagen de Firebase Storage
          await deleteObject(ref(st, imageRef))
            .then(() => window.location.reload())
            .catch(() => alert('No se ha podido borrar, intenta luego'));
        });
      });
    }
    leerGaleria();

    // guardar Nuevo servicio 
    // guardar Nuevo servicio 

    document.getElementById('guardar-servicio').addEventListener('click', () => {
      guardarServicio();
    });

    var modal = M.Modal.init(document.getElementById('modal-crear-servicio'));

    async function guardarServicio() {
      viewLoadWindows();
      const servicioTitle = document.getElementById('servicio-title').value;
      const servicioDescripcion = document.getElementById('servicio-descripcion').value;
      const splideList = document.querySelector('#splideList');
      const documentId = servicioTitle.replace(/\s/g, "");

      if (servicioTitle !== '' && servicioDescripcion !== '' && splideList && splideList.children.length > 0) {
        modal.close();
        viewLoadWindows();

        try {
          // Crear una referencia única para cada servicio
          const storageRef = ref(st, `${uid}/servicios/${documentId}`);

          // Iterar sobre las imágenes en el carusel
          await Promise.all(Array.from(splideList.children).map(async (item, index) => {
            const file = item.querySelector('img');
            const response = await fetch(file.src);
            const blob = await response.blob();
            const imageName = `url${index + 1}`;

            // Subir la imagen a Firebase Storage
            const imageRef = ref(storageRef, file.alt);
            const uploadTask = uploadBytes(imageRef, blob);
            const snapshot = await uploadTask;

            // Obtener la URL de descarga de la imagen
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Almacenar la URL en Firestore
            await setDoc(docRef, {
              servicios: {
                [documentId]: {
                  imagenes: { [imageName]: downloadURL }
                }
              }
            }, { merge: true });
          }));

          // Almacenar la información general del servicio en Firestore
          await setDoc(docRef, {
            servicios: {
              [documentId]: {
                id: documentId,
                title: servicioTitle,
                desc: servicioDescripcion
              }
            },
            notificaciones: {
              [codigoGenerado]: {
                id: codigoGenerado,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, Se ha creado tu servicio !`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }
          }, { merge: true });

          window.location.reload();
        } catch (error) {
          hideLoadWindows();
          modal.open();
          console.error('Error al subir el documento:', error);
          alert('Ha ocurrido un error al subir el documento. Intente de nuevo más tarde.');
        }

      } else {
        alert('Aún falta algo para crearlo');
        hideLoadWindows();
      }
    }

    function leerServicios() {
      const crearServicioBtn = document.getElementById('crear-servicio-btn');
      const serviciosContent = document.getElementById('leer-servicios');
      const ordenSelect = document.getElementById('orden-select');

      // Asegúrate de tener el elemento correcto aquí

      function renderizarservicios(querySnapshot) {
        // Resto del código para renderizar los servicios
        serviciosContent.innerHTML = '';

        querySnapshot.forEach(docs => {
          const imagenes = Object.values(docs.imagenes);
          const { title, desc } = docs;
          const proyectId = docs.id;
          serviciosContent.innerHTML += `
        <div class="col s6 m4">
            <div class="card card-servicios">
                <a href="../servicio/search?id=${id}&servicio=${proyectId}">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${imagenes[0]}"
                            alt="img" class="activator" />

                    <a data-id='${proyectId}' href='#modal-servicio-opciones' class="modal-trigger trigger"
                        title='Opciones'><i class="fa-solid fa-ellipsis-vertical"></i></a>
                    </div>
                </a>
                <div class="card-content">
                    <b class="activator valign-wrapper space-between"><span
                            class="truncate">${title}</span>
                        <i class="material-icons cursor-pointer">visibility</i></b>
                </div>
                <div class="card-reveal">
                    <b class="activator valign-wrapper space-between"><span
                            class="truncate">${title}</span>
                        <i class="material-icons cursor-pointer card-title activator">close</i></b>
                    <p>${desc}</p>
                </div>
            </div>
        </div>
           `;
        });

        if (querySnapshot.length === 12) {
          crearServicioBtn.classList.add('disabled');
        } else if (querySnapshot.length === 0) {
          serviciosContent.innerHTML = '<p class="center">Aun no hay servicios en este perfil...</p>';
        } else if (querySnapshot.length !== 0) {
          steps[1].classList.add('valid');
          stepsIcons[1].classList.remove('hide');
        }

      }

      function ordenarservicios() {
        const querySnapshot = Object.values(servicios);

        // Obtener el valor seleccionado en el select
        const ordenSeleccionado = ordenSelect.value;

        // Ordenar los servicios según la opción seleccionada
        querySnapshot.sort((a, b) => {
          const idA = a.id.toString();
          const idB = b.id.toString();

          if (ordenSeleccionado === 'Ascendente') {
            return idA.localeCompare(idB);
          } else if (ordenSeleccionado === 'Descendente') {
            return idB.localeCompare(idA);
          }
        });

        // Renderizar los servicios ordenados
        renderizarservicios(querySnapshot);
      }

      // Agrega un evento change al select para reordenar los servicios
      ordenSelect.addEventListener('change', ordenarservicios);

      // Llama a la función para ordenar y renderizar inicialmente
      ordenarservicios();

      // carusel splide
      var carusel = new Splide('#splide-carousel', {
        fixedHeight: 290,
        gap: 5,
        perPage: 1,
        perMove: 1,
        rewind: true,
        arrows: true
      });

      carusel.mount();

      const form = document.querySelector('#crear-servicio-btn form');
      const selectFileBtn = document.querySelector('#crear-servicio-btn');
      const selectMoreFileBtn = document.querySelector('#agregar-mas-imagenes');
      const eliminarServicioBtn = document.getElementById('eliminar-servicio-btn');
      const splideCarousel = document.querySelector('#splide-carousel');
      const splideList = document.querySelector('#splideList');
      const h5Header = document.querySelector('#modal-crear-servicio h5 b');

      const title = document.querySelector('#servicio-title');
      const descripcion = document.querySelector('#servicio-descripcion');

      // cancela la edicion del servicio
      document.querySelector('#cancelar-servicio').addEventListener('click', () => {
        modal.close();
        form.reset();
        splideList.innerHTML = ''
      });

      serviciosContent.addEventListener('click', (e) => {
        const element = e.target;
        if (element.classList.contains('trigger')) {
          const doc = servicios[element.dataset.id];
          handleFileSelect(doc.imagenes);
          title.value = doc.title;
          descripcion.value = doc.desc;
          h5Header.textContent = "Editar servicio";
          eliminarServicioBtn.dataset.id = doc.id;

        }
      });

      // boton inicial de seleccion de imagenes
      selectFileBtn.addEventListener('change', (e) => {
        const files = e.target.files;
        handleMoreFileSelect(files);
        title.value = '';
        descripcion.value = '';
        modal.open();
        h5Header.textContent = "Agregar servicio";

      });

      // agregar mas imagenes al carusel
      selectMoreFileBtn.addEventListener('change', (e) => {
        const files = e.target.files;
        handleMoreFileSelect(files);
      });

      function handleFileSelect(doc) {
        splideCarousel.classList.remove('hide');
        const imagenes = Object.values(doc);

        imagenes.forEach(url => {

          const listItem = document.createElement('li');
          listItem.classList.add('splide__slide');

          var image = document.createElement('img');
          image.src = url;

          const deleteButton = document.createElement('a');
          deleteButton.innerHTML = '<i class="fa-solid fa-xmark" title="eliminar"></i>';
          deleteButton.addEventListener('click', () => {
            listItem.remove();
            carusel.refresh();
            disableBtn();
          });

          listItem.appendChild(deleteButton);
          listItem.appendChild(image);
          splideList.appendChild(listItem);

        });
        carusel.refresh();
        disableBtn();

      }

      function handleMoreFileSelect(files) {
        splideCarousel.classList.remove('hide');

        // bucle iterador de imagenes
        for (const file of files) {
          if (splideList.children.length >= 10) {
            alert('Solo puedes seleccionar 10 imágenes, algunas fueron omitidas.');
            break;
          }

          const extension = file.name.split('.').pop().toLowerCase();
          const allowedExtensions = ['jpeg', 'jpg', 'png'];

          if (allowedExtensions.includes(extension)) {
            const listItem = document.createElement('li');
            listItem.classList.add('splide__slide');

            var image = document.createElement('img');
            image.src = URL.createObjectURL(file);
            image.alt = file.name;

            const deleteButton = document.createElement('a');
            deleteButton.innerHTML = '<i class="fa-solid fa-xmark" title="eliminar"></i>';
            deleteButton.addEventListener('click', () => {
              listItem.remove();
              carusel.refresh();
              disableBtn();
            });

            listItem.appendChild(deleteButton);
            listItem.appendChild(image);
            splideList.appendChild(listItem);
          } else {
            alert(`El archivo ${file.name} no es una imagen JPEG, JPG o PNG y será omitido.`);
          }
        }
        carusel.refresh();
        disableBtn();
      }

      function disableBtn() {
        // Desactivar el botón si se alcanza el límite de 10 imágenes
        if (splideList.children.length >= 10) {
          selectMoreFileBtn.classList.add('disabled');
        } else {
          selectMoreFileBtn.classList.remove('disabled');
        }
        // si no hay imagenes aparece el mensaje que indica que se deben agregar algunas imagenes
        const noFileAlert = document.getElementById('no-file-alert');
        if (!splideList.children.length > 0) {
          console.log(splideList.children.length);
          splideCarousel.classList.add('hide');
          noFileAlert.classList.remove('hide');
        } else {
          splideCarousel.classList.remove('hide');
          noFileAlert.classList.add('hide');

        }
      }


    } leerServicios()

    document.getElementById('eliminar-servicio-btn').addEventListener('click', async (e) => {
      viewLoadWindows();

      const folderName = e.target.dataset.id;
      eliminarStorageRef(folderName)
      // Eliminar el campo del documento
      await updateDoc(docRef, {
        [`servicios.${folderName}`]: deleteField()
      }).then(async () => {

        // Recargar la página después de completar todas las operaciones
        window.location.reload();

      }).catch((err) => {
        alert(err)
      });

    });

    async function eliminarStorageRef(folderName) {

      const listRef = ref(st, `${uid}/servicios/${folderName}`);

      // Obtener una lista de todos los objetos en el directorio
      const listResult = await listAll(listRef);

      // Eliminar cada objeto en el directorio
      const deletePromises = listResult.items.map((item) => deleteObject(item));

      // Esperar a que todas las eliminaciones se completen
      await Promise.all(deletePromises);

      // Ahora puedes eliminar el directorio en sí
      await deleteObject(listRef);

    }

    document.getElementById('guardar-imagenes').addEventListener('click', async () => {
      viewLoadWindows();
      const splideList = document.querySelector('#splideList2');

      if (splideList && splideList.children.length > 0) {
        modal.close();
        viewLoadWindows();

        try {
          // Crear una referencia única para cada servicio
          const storageRef = ref(st, `${uid}/galeria`);
          const metadata = {
            customMetadata: {
              timeUploaded: new Date().toISOString()
            }
          };

          // Iterar sobre las imágenes en el carusel
          await Promise.all(Array.from(splideList.children).map(async (item) => {
            const file = item.querySelector('img');
            const response = await fetch(file.src);
            const blob = await response.blob();

            // Subir la imagen a Firebase Storage
            const imageRef = ref(storageRef, file.alt);
            const uploadTask = uploadBytes(imageRef, blob, metadata);

          }));

          // Almacenar la información general del servicio en Firestore
          await setDoc(docRef, {
            notificaciones: {
              [codigoGenerado]: {
                id: codigoGenerado,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, Se han subido imagenes a tu cuenta!`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }
          }, { merge: true }).then(() => {

          }).catch((err) => {

          });

          window.location.reload();

        } catch (error) {
          hideLoadWindows();
          modal.open();
          console.error('Error al subir el documento:', error);
          alert('Ha ocurrido un error al subir el documento. Intente de nuevo más tarde.');
        }

      } else {
        alert('Aún falta algo para crearlo');
        hideLoadWindows();
      }

    })

    // leer si ya se completaron los pasos y ocultar el desplegable
    function hideStepsContainer() {
      const contenedorPadre = document.querySelector('.steps-container');
      let todosVisibles = true;

      steps.forEach(step => {
        if (!step.classList.contains('valid')) {
          todosVisibles = false;
        }
      });

      if (todosVisibles) {
        contenedorPadre.classList.add('hide');
      }
    }

    hideStepsContainer();


    // se ejecuta cuando la ventana carge
    document.addEventListener('DOMContentLoaded', hideLoadWindows())


    function cambiarFondoPanel() {
      // panel del usuario
      const panel = document.querySelector('#panel-container');

      // fondo animado
      const fondo = document.querySelector('#fondo.parallax-container');

      // previsualizar el fondo seleccionado
      const fondosContainer = document.getElementById('backGrounds-container');
      const input = document.getElementById('cambiarfondo-input');
      const previewFondo = document.querySelector('.preview-selected');
      const fondoImage = document.querySelectorAll('#backGrounds-container img');
      const boton = document.querySelector('#save-panel-color');

      // Crear una referencia única para cada servicio
      const storageRef = ref(st, `${uid}/imagenes de fondo`);

      // Función para guardar el color en localStorage
      async function guardarNuevoFondo(file, fileName) {
        try {
          if (fileName !== null) {
            const metadata = {
              contentType: 'image/jpeg',
              customMetadata: {
                timeUploaded: new Date().toISOString()
              }
            };

            // Subir la imagen a Firebase Storage
            const imageRef = ref(storageRef, fileName);
            const uploadTask = await uploadBytes(imageRef, file, metadata);

            // Obtener la URL de descarga de la imagen
            const downloadURL = await getDownloadURL(uploadTask.ref);

            // Almacenar la información general del servicio en Firestore
            await setDoc(docRef, {
              imagenDeFondo: downloadURL
            }, { merge: true });
            M.toast({ html: 'En hora buena, has cambiado el fondo de pantalla con exito!' });

          } else {
            await setDoc(docRef, {
              imagenDeFondo: file
            }, { merge: true });
            M.toast({ html: 'En hora buena, has cambiado el fondo de pantalla con exito!' });

          }
        } catch (error) {
          alert(error);
        }

      }

      async function iterarImagenesDeFondo() {

        listAll(storageRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              getDownloadURL(itemRef)
                .then((url) => {
                  const div = document.createElement('div');
                  div.classList.add('col', 's4', 'm3');
                  const img = document.createElement('img');
                  img.classList.add('circle', 'hoverable');
                  img.src = url;
                  // div.innerHTML = `<img src="${url}" class="circle hoverable" alt="fondo">`

                  const deleteButton = document.createElement('a');
                  deleteButton.classList.add('delete-new-bg');
                  deleteButton.innerHTML = '<i class="fa-solid fa-xmark cursor-pointer red" title="eliminar"></i>';
                  deleteButton.addEventListener('click', () => {
                    // Delete the file
                    deleteObject(itemRef).then(() => {
                      // File deleted successfully
                      div.remove();
                    }).catch((error) => {
                      // Uh-oh, an error occurred!
                      alert(error)
                    });

                  });

                  div.appendChild(img);
                  div.appendChild(deleteButton);
                  fondosContainer.appendChild(div);

                  // Seleccionar el círculo correspondiente al color de fondo
                  // if (img.src === imagenDeFondo) {
                  //   img.classList.add('selected');
                  // } else {
                  //   img.classList.remove('selected');
                  // }
                })
            });
          }).catch((error) => {
            // Uh-oh, an error occurred!
            console.error(error);
          });

        if (imagenDeFondo) {
          establecerFondo(imagenDeFondo);
        } else {
          establecerFondo('/imagenes/fondo01.jpg');
        }

      } iterarImagenesDeFondo();

      input.addEventListener('change', () => {
        const imagen = input.files[0];
        const blobURL = URL.createObjectURL(imagen);
        if (imagen) {
          fondoImage.forEach(imagen => {
            imagen.classList.remove('selected');
          });

          previewFondo.style.backgroundImage = `url('${blobURL}')`;

          boton.classList.remove('disabled');
        }
      });

      // Guardar el color seleccionado en localStorage al hacer clic en el botón
      boton.addEventListener('click', () => {
        const imagen = input.files[0];
        guardarNuevoFondo(imagen, imagen.name);
      });

      // Función para establecer el color de fondo

      function establecerFondo(imagen) {
        fondo.style.backgroundImage = `url(${imagen})`;
        previewFondo.style.backgroundImage = `url(${imagen})`;

        // Seleccionar el círculo correspondiente al color de fondo
        fondoImage.forEach(img => {
          if (img.src === imagen) {
            img.classList.add('selected');
          } else {
            img.classList.remove('selected');
          }
        });
      }

      fondoImage.forEach(img => {
        img.addEventListener('click', (e) => {
          const backGround = e.target.src;
          document.querySelectorAll('.circle.selected').forEach(selectedBg => {
            selectedBg.classList.remove('selected');
          });

          img.classList.add('selected');
          boton.classList.remove('disabled');
          previewFondo.style.backgroundImage = `url(${backGround})`;

          if (backGround === imagenDeFondo) {
            boton.classList.add('disabled');
          } else {
            boton.classList.remove('disabled');
          }

          // Guardar el color seleccionado en localStorage al hacer clic en el botón
          boton.addEventListener('click', async () => {
            establecerFondo(backGround);
            guardarNuevoFondo(backGround, null)
          });
        });
      });


    }

    cambiarFondoPanel();


  }
}