M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
const auth = getAuth(app);

document.getElementById('entrar').addEventListener('click', () => {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = '../server/'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Correo electronico o contraseña invalidos')
        });
})

document.getElementById('sendrecoverpass').addEventListener('click', () => {
    var email = document.getElementById('recoverpass').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Correo de restablecimiento de contraseña enviado');
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems, {
                "dismissible": false
            });
            instances.close();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Correo electronico invalido')
            console.log(errorCode);
        });
})

