M.AutoInit();

var thumbnails = new Splide('#splide-carousel', {
    fixedHeight: 240,
    fixedWidth: 240,
    gap: 1,
    perPage: 2,
    perMove: 1,
    rewind: true,
    // pagination: true,
    arrows: true,
    // isNavigation: true,
    // breakpoints: {
    //     640: {
    //         perPage: 2,
    //     },
    // },
});

thumbnails.mount();

var modal = M.Modal.init(document.querySelector('#modal-crearServicio'));
const selectFileBtn = document.querySelector('#selectFileBtn');
const selectMoreFileBtn = document.querySelector('#agregar-mas-imagenes');
const splideCarousel = document.querySelector('#splide-carousel');
const splideList = document.querySelector('#splideList');

selectFileBtn.addEventListener('change', (e) => {
    handleFileSelect(e);
    modal.open();

});
selectMoreFileBtn.addEventListener('change', (e) => {
    handleFileSelect(e);
});

function handleFileSelect(event) {
    const files = event.target.files;
    splideCarousel.classList.remove('hide');

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
                disableBtn();
            });

            listItem.appendChild(deleteButton);
            listItem.appendChild(image);
            splideList.appendChild(listItem);
        } else {
            alert(`El archivo ${file.name} no es una imagen JPEG, JPG o PNG y será omitido.`);
        }
    }
    thumbnails.refresh();
    disableBtn();
}

function disableBtn() {
    // Desactivar el botón si se alcanza el límite de 10 imágenes
    if (splideList.children.length >= 10) {
        selectMoreFileBtn.classList.add('disabled');
    } else {
        selectMoreFileBtn.classList.remove('disabled');
    }
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