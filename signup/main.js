M.AutoInit();

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
var ui = new firebaseui.auth.AuthUI(firebase.auth());

const signContainer = document.getElementById('signContainer');
const signDataRegister = document.getElementById('signDataRegister');
const backBtn = document.getElementById('backBtn');
const logo = document.querySelector('.logo');

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
        logo.style.marginLeft = "0"
      } else {
        history.back();
      }
      return false;
    },
    uiShown: function () {
      //ejecuta cuando se renderize el widget.
      // Ocultar el cargador.
      document.getElementById('load').classList.add('hide');
      document.querySelector('body').classList.remove('fixed-container');
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '../',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
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
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '../',
  // Privacy policy url.
  privacyPolicyUrl: '../'
};

ui.start("#signContainer", uiConfig);


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

function crearFirestore(profecion, descripcion, provincia) {
  const auth = firebase.auth();
  const user = auth.currentUser;
  if (user) {
    var uid = user.uid;
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var phoneNumber = user.phoneNumber;
    // remover los espacios al nombre y leer la ñ
    const pathname = displayName.replace(/\s/g, "");
    const queryString = pathname.toString();
    const documentId = decodeURIComponent(queryString);
    // leer la ñ
    
    const provinciaString = provincia.toString();
    const provinciaValue = decodeURIComponent(provinciaString);
    fs.collection("usuarios").doc(`${uid}`).set({
      id: documentId,
      photoURL: photoURL,
      nombre: displayName,
      descripcion: descripcion,
      email: email,
      emailVerified: emailVerified,
      phoneNumber: phoneNumber,
      recoms: 0,
      profecion: profecion,
      provincia: provinciaValue,
      ubicacion: {
        LatitudX: marker.getLatLng().lat,
        LongitudY: marker.getLatLng().lng
      },
      misRecomendados: false,
      meRecomendaron: false
    }).then(() => {
      window.location.href = "../perfil/";
    })
  }
}
const profecion = document.getElementById('profecion');
const descripcion = document.getElementById('descripcion');
const provincia = document.getElementById('provincia');
document.getElementById('guardarDataBtn').addEventListener('click', () => {
  if (profecion.value && descripcion.value && provincia.value) {
    crearFirestore(profecion.value, descripcion.value, provincia.value)
  } else {
    alert('Completa el formulario antes de guardar');
  }
})