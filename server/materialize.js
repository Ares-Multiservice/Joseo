
import { guardarPropiedad } from './main.js';



export var thumbnails = new Splide('#thumbnail-carousel', {
    // fixedHeight: 75,
    // fixedWidth: 75,
    gap: 1,
    perPage: 5,
    perMove: 1,
    rewind: true,
    pagination: true,
    arrows: false,
    // isNavigation: true,
    breakpoints: {
        640: {
            perPage: 4,
        },
    },
});

thumbnails.mount();

const crearPropiedad = document.getElementById('crearPropiedad');
const inputs = document.querySelectorAll('.input-field input, textarea, select');

const expresiones = {
    nombre: /^([a-zA-ZÀ-ÿ0-9\s]{2,27})$/,
    precio: /^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{2})?$/,
    descripcion: /^([a-zA-ZÀ-ÿ0-9]{1,30})\s([a-zA-ZÀ-ÿ0-9\s]{1,170})$/,
    selects: /^[a-zA-ZÀ-ÿ]{3,100}$/,
    selectsNum: /^[0-9]{1,2}$/,
}

const campos = {
    imagenes: false,
    nombre: false,
    precio: false,
    descripcion: false,
    tipo: false,
    ubicacion: false,
    habitaciones: false,
    baños: false,
    parqueos: false
};

const validar = (e) => {
    switch (e.target.name) {
        case 'nombre':
            validarCampo(expresiones.nombre, e.target, 'nombre');
            break;
        case "precio":
            validarCampo(expresiones.precio, e.target, 'precio');
            break;
        case "descripcion":
            validarCampo(expresiones.descripcion, e.target, 'descripcion');
            break;
        case "tipo":
            validarCampo2(e.target, 'tipo');
            break;
        case "ubicacion":
            validarCampo2(e.target, 'ubicacion');
            break;
        case "habitaciones":
            validarCampo2(e.target, 'habitaciones');
            break;
        case "baños":
            validarCampo2(e.target, 'baños');
            break;
        case "parqueos":
            validarCampo2(e.target, 'parqueos');
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(campo).classList.add('valid');
        document.getElementById(campo).classList.remove('invalid');
        campos[campo] = true;
    } else {
        document.getElementById(campo).classList.remove('valid');
        document.getElementById(campo).classList.add('invalid');
        campos[campo] = false;
    }
};

const validarCampo2 = (input, campo) => {
    if (input.value !== '') {
        document.getElementById(campo).classList.add('valid');
        document.getElementById(campo).classList.remove('invalid');
        campos[campo] = true;
    } else {
        document.getElementById(campo).classList.remove('valid');
        document.getElementById(campo).classList.add('invalid');
        campos[campo] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validar);
    input.addEventListener('blur', validar);
    input.addEventListener('change', validar);
    input.addEventListener('click', validar);
});

const checkBox = document.getElementById('opcion');
checkBox.addEventListener('change', () => {
    if (checkBox.checked) {
        checkBox.value = 'Venta'
    } else {
        checkBox.value = 'Alquiler';
    }
})

const selectFileBtn = document.querySelector('#selectfiles');
const thumbnailCarousel = document.querySelector('#thumbnail-carousel');
const splideList = document.querySelector('#splideList');
const dataerror = document.querySelector('#dataerror');
const filelength = document.querySelector('#filelength');

selectFileBtn.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const files = event.target.files;

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
                thumbnails.refresh();
                updateButtonColor();
                disabelBtn();
            });

            listItem.appendChild(deleteButton);
            listItem.appendChild(image);
            splideList.appendChild(listItem);
        } else {
            alert(`El archivo ${file.name} no es una imagen JPEG, JPG o PNG y será omitido.`);
        }
    }
    thumbnails.refresh();
    thumbnailCarousel.classList.remove('hide');
    updateButtonColor();
    disabelBtn();
}

function updateButtonColor() {
    if (splideList.children.length > 0) {
        selectFileBtn.classList.add('green');
        selectFileBtn.classList.remove('blue-grey');
        campos.imagenes = true;

    } else {
        selectFileBtn.classList.remove('green');
        selectFileBtn.classList.add('blue-grey');
        campos.imagenes = false;

    }
}

function disabelBtn() {
    // Desactivar el botón si se alcanza el límite de 10 imágenes
    if (splideList.children.length >= 10) {
        selectFileBtn.disabled = true;
        selectFileBtn.classList.add('hide');
    } else {
        selectFileBtn.disabled = false;
        selectFileBtn.classList.remove('hide');
        if (splideList.children.length >= 1) {
            filelength.textContent = `(${splideList.children.length} de 10) imagenes seleccionadas`;
        } else {
            filelength.textContent = `Sube (10 imagenes maximo)`;

        }
    }
}

crearPropiedad.addEventListener('click', () => {
    if (campos.imagenes && campos.nombre && campos.precio && campos.descripcion && campos.tipo && campos.ubicacion && campos.habitaciones && campos.baños && campos.parqueos) {
        guardarPropiedad();
    } else {
        dataerror.classList.remove('hide');
        setTimeout(() => { dataerror.classList.add('hide'); }, 3000);
    }
});


