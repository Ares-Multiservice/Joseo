M.AutoInit();

// mapa de ubicaciones
// mapa de ubicaciones
// mapa de ubicaciones
var marker = '';
function leerMapa() {
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

  marker = L.marker([18.833515396433512, -70.42233734767194], { draggable: true }).addTo(map);
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

}

const firebaseConfig = {
  apiKey: "AIzaSyBYNAIFu_BU4oav3I3PCFncS9QU5GvkiAU",
  authDomain: "joseodo-72673.firebaseapp.com",
  projectId: "joseodo-72673",
  storageBucket: "joseodo-72673.appspot.com",
  messagingSenderId: "1098719522238",
  appId: "1:1098719522238:web:1cd896005f5264ad40ddef"
};

firebase.initializeApp(firebaseConfig);
const fs = firebase.firestore();
const auth = firebase.auth();
var ui = new firebaseui.auth.AuthUI(auth);

const signContainer = document.getElementById('signContainer');
const signDataRegister = document.getElementById('signDataRegister');
const signDataRegister2 = document.getElementById('signDataRegister2');
const backBtn = document.getElementById('backBtn');
const logo = document.querySelector('.logo');

// inicio de sesion y registro multi provedor ui de firebase
// inicio de sesion y registro multi provedor ui de firebase
// inicio de sesion y registro multi provedor ui de firebase

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult) {
      // El usuario inició sesión correctamente.
      // El tipo de retorno determina si continuamos la redirección automáticamente
      // o si dejamos que el desarrollador lo maneje.
      // User is signed in.
      var isNewUser = authResult.additionalUserInfo.isNewUser;
      if (isNewUser) {
        signContainer.classList.add('hide');
        signDataRegister.classList.remove('hide');
        backBtn.classList.add('hide');
        logo.style.marginLeft = "0";
        verifUser()
      } else {
        history.back();
      }
      return false;
    },
    uiShown: function () {
      //ejecuta cuando se renderize el widget.
      // Ocultar el cargador.
      // document.getElementById('load').classList.add('hide');
      // document.querySelector('body').classList.remove('fixed-container');
    }
  },
  // Utilizará una ventana emergente para el flujo de inicio de sesión
  //  de los proveedores de IDP en lugar de la redirección predeterminada.

  signInFlow: 'popup',
  signInSuccessUrl: '../',
  signInOptions: [
    // Deja las líneas como están para los proveedores que deseas ofrecer a tus usuarios.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    {
      provider: 'apple.com',
      providerName: 'Apple',
      buttonColor: '#2F2F2F',
      customParameters: {
        prompt: 'consent'
      }
    }, {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      fullLabel: 'Acceder con correo y contraseña',
      requireDisplayName: false
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '../',
  // Privacy policy url.
  privacyPolicyUrl: '../'
};

ui.start("#signContainer", uiConfig);


const expresiones = {
  usuario: /^([a-zA-ZÀ-ÿ0-9]{3,20})([_-]?)([a-zA-ZÀ-ÿ0-9]{3,20})$/,
  nombre: /^([a-zA-ZÀ-ÿ]{3,30})\s([a-zA-ZÀ-ÿ]{3,30})$/,
  correo: /^[a-zA-Z0-9_.-]+@(([g]|[h][o][t])mail|Outlook)+\.[c][o][m]$/,
  contraseña: /^.{4,16}$/, // 4 a 16 digitos.
  // identidad: /^[a-zA-Z0-9\-]{4,16}$/, // Letras, numeros y guion.
  // nacionalidad: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  // fecha: /^.{4,10}$/, //numeros
  direccion: /^.{4,100}$/, // Letras, numeros y guion.// Letras, espacios, numeros y guion., pueden llevar acentos.
  telefono: /^([+][0-9]{0,4}|[0-9]{0,4})(\s|\s)([0-9]{2,4})\2(([0-9]{3,4})\2([0-9]{4})|([0-9]{4}))$/, // 7 a 14 numeros.
}

const campos = {
  usuario: false,
  nombre: false,
  linea2: false,
  lugar_tel: false,
  fecha: false,
  hora: false
};
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

const usuario = document.getElementById('usuario');
const nombre = document.getElementById('nombre');
const profecion = document.getElementById('profecion');
const presentacion = document.getElementById('presentacion');
const provincia = document.getElementById('provincia');

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var phoneNumber = user.phoneNumber;
    // remover los espacios al nombre y leer la ñ
    const pathname = displayName.replace(/\s/g, "");
    // const queryString = pathname.toString();
    // const documentId = decodeURIComponent(queryString); // leer la ñ
    const sliceId = uid.slice(0, 4); // obtiene los primeros 4 caracteres del id
    const usuarioDefault = pathname + sliceId; // concatenar nombre mas 4 caracteres

    // var province = provincia.value;
    // const provinciaString = province.toString(); // lee la ñ en las provincias
    // const provinciaValue = decodeURIComponent(provinciaString);

    // pitarle el usuario y el nombre al los inputs
    if (displayName) {
      usuario.value = usuarioDefault;
      nombre.value = displayName;
    }


    function crearFirestore() {
      user.updateProfile({
        displayName: nombre.value
      }).then(() => {
        fs.collection("usuarios").doc(`${uid}`).set({
          id: usuario.value,
          photoURL: photoURL,
          nombre: nombre.value,
          presentacion: presentacion.value,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          recoms: 0,
          profecion: profecion.value,
          provincia: provincia.value,
          ubicacion: {
            LatitudX: marker.getLatLng().lat,
            LongitudY: marker.getLatLng().lng
          },
          misRecomendados: false,
          meRecomendaron: false,
          notificaciones: {
            [codigoGenerado]: {
              id: codigoGenerado,
              visible: true,
              img: '/imagenes/logo bg azul.png',
              text: `Bienvenid@ <b>${nombre.value}</b>, ahora puedes comenzar a resivir clientes`,
              date: `${mes} ${dia}, ${año} ${hora < 10 ? '0' : ''}${hora}:${minuto < 10 ? '0' : ''}${minuto} ${meridiano}`
            }
          }
        }).then(() => {
          window.location.href = "../perfil/";
        })
      })
    }

    document.getElementById('continuarDataBtn').addEventListener('click', () => {
      if (campos.usuario && campos.nombre && profecion.value && presentacion.value) {
        signDataRegister.classList.add('hide');
        signDataRegister2.classList.remove('hide');
        leerMapa();
      } else {
        alert('Completa el formulario antes de continuar');
      }
    });

    document.getElementById('regresarDataBtn').addEventListener('click', () => {
      signDataRegister.classList.remove('hide');
      signDataRegister2.className = 'hide';

    });

    document.getElementById('guardarDataBtn').addEventListener('click', () => {
      if (campos.usuario && campos.nombre && profecion.value && presentacion.value && provincia.value) {
        crearFirestore()
      } else {
        alert('Completa el formulario antes de guardar');
      }
    });

    // validar el nombre de usuario
    function verifNombre() {
      const element = document.getElementById(`verificar-nombre`);
      if (!expresiones.nombre.test(nombre.value)) {
        element.textContent = `nombre invalido`;
        campos.nombre = false;
      } else {
        element.textContent = "";
        campos.nombre = true;
      }
    };
    nombre.addEventListener('keyup', verifNombre);
    nombre.addEventListener('blur', verifNombre);
    document.addEventListener('DOMContentLoaded', verifNombre());

  }
});

// validar el identificador del usuario
function verifUser() {
  const verificarUsuario = document.getElementById('verificar-usuario');
  // leer si hay algún otro usuario con el mismo id que el del usuario actual
  fs.collection("usuarios")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var filtrarUsuarios = doc.data().id;
        // comprobar si el valor del input es igual a otro usuario 
        // y validarlo con la expresion regular
        if (usuario.value === filtrarUsuarios || !expresiones.usuario.test(usuario.value)) {
          verificarUsuario.textContent = 'usuario invalido';
          verificarUsuario.classList.remove('green-text');
          verificarUsuario.classList.add('red-text');
          campos.usuario = false;
        } else {
          verificarUsuario.textContent = 'usuario valido';
          verificarUsuario.classList.add('green-text');
          verificarUsuario.classList.remove('red-text');
          campos.usuario = true;
        }
      });
    })
    .catch((error) => {
      console.error("Error al obtener documentos: ", error);
    });
}
usuario.addEventListener('keyup', verifUser);
usuario.addEventListener('blur', verifUser);
// document.addEventListener('DOMContentLoaded', verifUser);