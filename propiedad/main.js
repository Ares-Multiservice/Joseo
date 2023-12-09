M.AutoInit();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, getDoc, onSnapshot, query, where, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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


// Función para realizar la lectura inicial
const leerPropiedades = document.querySelector('#leerPropiedades');
async function leer() {
    /// Obtener referencias a los elementos del DOM
    const nombreCont = document.querySelector('#nombre');
    const tipoCont = document.querySelector('#tipo');
    const ubicacionCont = document.querySelector('#ubicacion');
    const precioCont = document.querySelector('#precio');
    const opcionCont = document.querySelector('#opcion');
    const habitacionesCont = document.querySelector('#habitaciones');
    const bañosCont = document.querySelector('#baños');
    const parqueosCont = document.querySelector('#parqueos');
    const descripcionCont = document.querySelector('#descripcion');
    const whatsappBtn = document.querySelector('#whatsappBtn');
    const loadWndous = document.querySelector('#loadWndous');
    const preloader = document.querySelector('#loadWndous .preloader-wrapper');
    const notFound = document.querySelector('#loadWndous h3');

    var nombre = window.location.search
    var hrefValue = window.location.href
    var pathname = window.location.pathname
    const removerdor = nombre.replace('?', '');
    const queryString = removerdor.toString();
    const documentId = decodeURIComponent(queryString);
    // leer los datos
    if (documentId !== '') {
        const docRef = doc(fs, "propiedades", documentId);
        const docSnap = await getDoc(docRef);
        const imagenes = [docSnap.data().imagenes];

        if (docSnap.exists()) {
            const { nombre, precio, descripcion, tipo, ubicacion, opcion, habitaciones, baños, parqueos } = docSnap.data();
            nombreCont.textContent = nombre;
            tipoCont.textContent = tipo;
            ubicacionCont.textContent = ubicacion;
            precioCont.textContent = precio;
            opcionCont.textContent = opcion;
            habitacionesCont.textContent = habitaciones;
            bañosCont.textContent = baños;
            parqueosCont.textContent = parqueos
            descripcionCont.textContent = descripcion;
            // URL base de WhatsApp
            const whatsappBaseUrl = 'https://wa.me/';
            const phoneNumber = '18494068804';
            const messageText = `hola, me interesa la propiedad en ${opcion}: ${nombre} que esta en ${ubicacion}. ${hrefValue}`;
            const whatsappUrl = `${whatsappBaseUrl}${phoneNumber}?text=${encodeURIComponent(messageText)}`;
            whatsappBtn.href = whatsappUrl;

            // Carrusel full screen
            var main = new Splide('#main-carousel', {
                rewind: true,
                arrows: false
            });

            // Carrusel de miniaturas
            var thumbnails = new Splide('#thumbnail-carousel', {
                fixedWidth: 100,
                gap: 10,
                rewind: true,
                pagination: false,
                isNavigation: true,
                breakpoints: {
                    600: {
                        fixedWidth: 60,
                        fixedHeight: 44,
                    },
                },
            });

            main.sync(thumbnails);

            // Obtener referencia al contenedor del carrusel y la lista de imágenes
            const carusel1 = document.querySelector('#main-carousel .splide__list');
            const carusel2 = document.querySelector('#thumbnail-carousel .splide__list');
            carusel1.innerHTML = ''
            carusel2.innerHTML = ''
            var count = 0;
            // agregar las imagenes de la base de datos al carusel
            for (let i = 1; i <= 10; i++) {
                count = i;
                // carusel fullScreen
                imagenes.forEach(imagen => {
                    if (imagen[`url${[count]}`] !== undefined) {

                        const imageUrl = imagen[`url${[count]}`]
                        // Crear elemento de lista para Splide
                        const listItem = document.createElement('li');
                        listItem.classList.add('splide__slide');

                        // Crear imagen y establecer su fuente
                        const image = document.createElement('img');
                        image.src = imageUrl;

                        // Agregar la imagen al elemento de lista
                        listItem.appendChild(image);

                        // Agregar el elemento de lista al carrusel
                        carusel1.appendChild(listItem);
                    }

                });

                // carusel thump
                imagenes.forEach(imagen => {
                    if (imagen[`url${[count]}`] !== undefined) {

                        const imageUrl = imagen[`url${[count]}`]
                        // Crear elemento de lista para Splide
                        const listItem = document.createElement('li');
                        listItem.classList.add('splide__slide');

                        // Crear imagen y establecer su fuente
                        const image = document.createElement('img');
                        image.src = imageUrl;

                        // Agregar la imagen al elemento de lista
                        listItem.appendChild(image);

                        // Agregar el elemento de lista al carrusel
                        carusel2.appendChild(listItem);


                    }

                });
            }

            main.mount();
            thumbnails.mount();


            leerPropiedades.classList.remove('hide');
            loadWndous.classList.add('hide');
            notFound.classList.add('hide');
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            leerPropiedades.classList.add('hide')
            loadWndous.classList.remove('hide');
            preloader.classList.add('hide');
            notFound.classList.remove('hide');
        }
    }else if(pathname !== '') {
        leerPropiedades.classList.add('hide')
        loadWndous.classList.remove('hide');
        preloader.classList.add('hide');
        notFound.classList.remove('hide');
    }

}
leer();