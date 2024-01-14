M.AutoInit();

// document.addEventListener('DOMContentLoaded', function () {
//     var carousel = M.Carousel.init(document.querySelector('.carousel'), { fullWidth: true });
//     setInterval(() => {
//         carousel.next();
//     }, 6000);
// });

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
    console.log('se ejecuta');
    // const splideList = document.querySelector('#splide__list');
    // splideList.addEventListener('click', (event) => {
    //     const imagen = event.target;
    //     console.log(imagen);
    //     const splideSlide = imagen.parentElement;
    //     if (splideSlide.classList.contains('splide__slide')) {

    //         if (document.fullscreenElement) {
    //             closeFullScreen();
    //         } else {
    //             openFullScreen(imagen);
    //         }
    //     }

    // });

    const pintarImagenes = document.querySelector('#pintarImagenes');
    pintarImagenes.addEventListener('click', (event) => {
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
