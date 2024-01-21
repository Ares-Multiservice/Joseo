M.AutoInit();

const nav = document.querySelector('nav');
const main = document.querySelector('main');

// poner el nav de un color diferente despues de que llegue a sierta distancia
function onScroll() {
    if (window.scrollY > 510) {
        nav.classList.add('black-transparent');
        nav.classList.remove('transparent');
        // main.style.transition = 'padding-top 1s'; // Define la transición en CSS
        // main.style.paddingTop = '100px';
    } else {
        nav.classList.remove('black-transparent');
        nav.classList.add('transparent');
        // main.style.paddingTop = '0';
    }
}

// Asignar la función onScroll al evento scroll
window.addEventListener('scroll', onScroll);

window.addEventListener('DOMContentLoaded', () => {
    onScroll();
});

// funcion para poner las imagenes en pantalla completa al hacerle click
var bodyOverflow = '';

function openFullScreen(imagen) {
    if (imagen.requestFullscreen) {
        imagen.requestFullscreen();
    } else if (imagen.mozRequestFullScreen) {
        imagen.mozRequestFullScreen();
    } else if (imagen.webkitRequestFullscreen) {
        imagen.webkitRequestFullscreen();
    } else if (imagen.msRequestFullscreen) {
        imagen.msRequestFullscreen();
    }

    bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    imagen.classList.add('imagen-completa');
}

function closeFullScreen() {
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        document.body.style.overflow = bodyOverflow;

        var imagen = document.querySelector('.imagen-completa');
        if (imagen) {
            imagen.classList.remove('imagen-completa');
        }
    }
}

document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
        closeFullScreen();
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const imageContainer = document.querySelector('#contenedor-imagenes');
    imageContainer.addEventListener('click', (event) => {
        const imagen = event.target;

        if (imagen.classList.contains('materialboxed')) {

            if (document.fullscreenElement) {
                closeFullScreen();
            } else {
                openFullScreen(imagen);
            }
        }

    });
});

// Funcion para seleccionar las imagenes desde la computadora e iterarlas en el carusel

// carusel splide
var carusel = new Splide('#splide-carousel2', {
    fixedHeight: 390,
    gap: 5,
    perPage: 1,
    perMove: 1,
    rewind: true,
    arrows: true,
    pagination: true
});

carusel.mount();

var modal = M.Modal.init(document.querySelector('#modal-subir-imagenes'));
const selectFileBtn = document.querySelector('#agregar-imagenes-btn');
const form = document.querySelector('#agregar-imagenes-btn form');
const selectMoreFileBtn = document.querySelector('#agregar-mas-imagenes2');
const splideCarousel = document.querySelector('#splide-carousel2');
const splideList = document.querySelector('#splideList2');


// cancelar la creacion del nuevo servicio
document.querySelector('#cancelar-subir-imagenes').addEventListener('click', () => {
    modal.close();
    form.reset();
    splideList.innerHTML = ''
});

// boton inicial de seleccion de imagenes
selectFileBtn.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFileSelect(files);
    modal.open();

});

// agregar mas imagenes al carusel
selectMoreFileBtn.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFileSelect(files);
});

// iterar imagenes seleccionadas y agregarlas al carusel Imagenes
// y tambien agregarles el boton de eliminar imagen
function handleFileSelect(files) {
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
    const noFileAlert = document.getElementById('no-file-alert2');
    if (!splideList.children.length > 0) {
        console.log(splideList.children.length);
        splideCarousel.classList.add('hide');
        noFileAlert.classList.remove('hide');
    } else {
        splideCarousel.classList.remove('hide');
        noFileAlert.classList.add('hide');

    }
}

