M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, getDoc, onSnapshot, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
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

function viewLoadWindows() {
  body.classList.add('fixed-container');
  loader.classList.remove('hide');
}

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
  // notificaciones
  const alertsBtn = document.querySelector('#alertsBtn');
  const alertsContainer = document.querySelector('#alertsContainer');
  const vefifAlerts = document.querySelector('#verifAlerts');

  const profecionUbicacionCont = document.querySelector('#userProfecionUbicacion');
  const presentacionCont = document.querySelector('#userpresentacion');
  const recomendaciones = document.querySelector('#recoms');

  // pintar en el modal de edicion de perfil
  const cardUsuario = document.getElementById('modal-card-usuario');
  const cardNombre = document.getElementById('modal-card-nombre');
  const cardProfecion = document.getElementById('modal-card-profecion');
  const cardHabilidades = document.getElementById('modal-card-habilidades');
  const cardUbicacion = document.getElementById('modal-card-ubicacion');

  // inputs de edicion de perfil
  const editUsuario = document.getElementById('editUsuario');
  const editNombre = document.getElementById('editNombre');
  const editNombre2 = document.getElementById('editNombre2');
  const editProfecion = document.getElementById('editProfecion');
  const editHabilidades = document.getElementById('editHabilidades');
  const editUbicacion = document.getElementById('editUbicacion');

  // var hrefValue = window.location.href;
  // var pathname = window.location.pathname;
  // const removerdor = pathname.replace('/perfil/', '');
  // const queryString = removerdor.toString();
  // const documentId = decodeURIComponent(queryString);

  const expresiones = {
    usuario: /^([a-zA-ZÀ-ÿ0-9]{3,15})([_-]?)([a-zA-ZÀ-ÿ0-9]{3,15})$/,
    nombre: /^([a-zA-ZÀ-ÿ]{3,20})$/
  }

  const campos = {
    usuario: false
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

  // // obtener un id generado al azar
  // function generarCodigo() {
  //   var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   var codigo = '';
  //   for (var i = 0; i < 8; i++) {
  //     var indice = Math.floor(Math.random() * caracteres.length);
  //     codigo += caracteres.charAt(indice);
  //   }
  //   return codigo;
  // }

  // // Ejemplo de uso
  // var codigoGenerado = generarCodigo();

  if (docSnap.exists()) {
    const { id, photoURL, nombre, presentacion, profecion, habilidades, provincia, ubicacion, recoms, notificaciones, proyectos } = docSnap.data();
    // leer las informaciones y pintarlas en leer usuario
    if (photoURL) {
      fotoDeperfil.src = photoURL;
    }
    nombreCont.textContent = nombre;
    profecionUbicacionCont.textContent = `${profecion} en ${provincia}`;
    presentacionCont.textContent = presentacion;
    recomendaciones.textContent = recoms;
    verPerfilBtn.href = `../v/${id}`

    // leer las notificaciones
    async function leerNotificaciones() {

      // Convertir el objeto a un array de objetos
      const organizador = Object.values(notificaciones);
      
      // Ordenar el array en base a la propiedad 'date' de manera descendente
     const notif = organizador.sort((a, b) => new Date(b.id) - new Date(a.id));

      alertsContainer.innerHTML = '';
      // Recorrer el objeto de notificaciones con un bucle for...in
      for (var key in notif) {
        if (notif[key]) {
          vefifAlerts.classList.add('hide');
          alertsContainer.classList.remove('hide');
        }

        if (notif.hasOwnProperty(key)) {
          var docs = notif[key];
          const id = docs.id;
          const img = docs.img;
          const text = docs.text;
          const date = docs.date;


          const botonActive = () => {
            alertsBtn.innerHTML = `<i class="fa-solid fa-bell"></i>`
            alertsBtn.classList.add('red');
            alertsBtn.classList.add('pulse');
            alertsBtn.classList.add('btn-floating');
            alertsBtn.classList.add('btn-small');
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

          const botonDisable = () => {
            alertsBtn.innerHTML = `<i class="fa-regular fa-bell"></i>`
            alertsBtn.classList.remove('red');
            alertsBtn.classList.remove('pulse');
            alertsBtn.classList.remove('btn-floating');
            alertsBtn.classList.remove('btn-small');
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
            botonActive();

            alertsContainer.addEventListener('click', (e) => {
              const element = e.target;
              const dataId = element.dataset.id;

              setDoc(docRef, {
                notificaciones: {
                  [dataId]: {
                    visible: false
                  }
                }
              }, { merge: true }).then(() => {
                botonDisable();
              });
            });
          } else {
            botonDisable();
          }
        }
      }
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

    }

    // pintar en el input de edicion de informacion
    editUsuario.value = id;
    var nombreSplit = nombre.split(' ');
    editNombre.value = nombreSplit[0];
    editNombre2.value = nombreSplit[1];
    editProfecion.value = profecion;
    editUbicacion.value = provincia;

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
              [`${dia}${año}${hora}${minuto}${segundo}`]: {
                id: `${dia}${año}${hora}${minuto}${segundo}`,
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
              [`${dia}${año}${hora}${minuto}${segundo}`]: {
                id: `${dia}${año}${hora}${minuto}${segundo}`,
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
              [`${dia}${año}${hora}${minuto}${segundo}`]: {
                id: `${dia}${año}${hora}${minuto}${segundo}`,
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
            [`${dia}${año}${hora}${minuto}${segundo}`]: {
              id: `${dia}${año}${hora}${minuto}${segundo}`,
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
            [`${dia}${año}${hora}${minuto}${segundo}`]: {
              id: `${dia}${año}${hora}${minuto}${segundo}`,
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
              dragMode: 'none', // Habilitar el modo de arrastre para mover la imagen dentro del área de recorte
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
              /** @type {any} */
              const metadata = {
                contentType: 'image/jpeg'
              };

              // Upload file and metadata to the object 'images/mountains.jpg'
              const storageRef = ref(st, `${uid}/fotos de perfil/${file[0].name}`);
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
                          [`${dia}${año}${hora}${minuto}${segundo}`]: {
                            id: `${dia}${año}${hora}${minuto}${segundo}`,
                            visible: true,
                            img: '/imagenes/logo bg azul.png',
                            text: `<b>${nombre}</b>, haz cambiado tu foto de perfil con exito <i class="fa-regular fa-face-smile"></i> !`,
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

    // guardar Nuevo trabajo 
    // guardar Nuevo trabajo 

    document.getElementById('guardar-trabajo').addEventListener('click', () => {
      guardarTrabajo()
    });
    var modal = M.Modal.init(document.getElementById('modal-crearTrabajo'));
    function guardarTrabajo() {
      viewLoadWindows()
      const trabajoTitle = document.getElementById('trabajo-title').value;
      const trabajoDescripcion = document.getElementById('trabajo-descripcion').value;
      const splideList = document.querySelector('#splideList');
      const documentId = trabajoTitle.replace(/\s/g, "");

      // hacerle una carpeta a cada usuario para que guarde sus fotos en storage, comenzando desde el sign up

      if (trabajoTitle !== '' && trabajoDescripcion !== '' && splideList && splideList.children.length > 0) {
        modal.close()
        viewLoadWindows()
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
            const storageRef = ref(st, `${uid}/proyectos/${file.alt}`);
            // Subir la imagen a Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadPromises.push(uploadTask.then(async (snapshot) => {
              // subir imagenes a firebase
              const downloadURL = await getDownloadURL(snapshot.ref);
              await setDoc(docRef, {
                proyectos: {
                  [documentId]: {
                    imagenes: { [imageName]: downloadURL }
                  }
                }
              }, { merge: true })
              referencesUploaded++;
            }))
            if (referencesUploaded === imageNumber) {
              break;
            }
          }

          // realizar acciones después de que todas las imágenes se hayan subido y almacenado en Firestore
          await Promise.all(uploadPromises);
          setDoc(docRef, {
            proyectos: {
              [documentId]: {
                id: documentId,
                title: trabajoTitle,
                desc: trabajoDescripcion
              }
            },
            notificaciones: {
              [`${dia}${año}${hora}${minuto}${segundo}`]: {
                id: `${dia}${año}${hora}${minuto}${segundo}`,
                visible: true,
                img: '/imagenes/logo bg azul.png',
                text: `<b>${nombre}</b>, Se ha creado tu proyecto <i class="fa-regular fa-face-smile"></i> !`,
                date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
              }
            }

          }, { merge: true }).then(() => {
            window.location.reload();

          }).catch((error) => {
            hideLoadWindows()
            modal.open()
            alert('ha ocurrido un error al subir el documento, intenta de nuevo mas tarde');
          });

        });

      } else {
        alert('Aun falta algo para crearlo');
        hideLoadWindows()
      }
    }
    // se ejecuta cuando la ventana carge
    document.addEventListener('DOMContentLoaded', hideLoadWindows())
    
  }
}
