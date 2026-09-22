let Titulo = document.title;

window.addEventListener('blur', () => {
    Titulo = document.title;
    document.title = "No te vallas, regresa :(";
});

window.addEventListener('focus', () => {
    document.title = Titulo;
});

const canvas = document.getElementById('Flor');
const ctx = canvas.getContext('2d');

const BotonVer = document.getElementById("BVer");
const BotonCerrar = document.getElementById("BotonCerrar");

const ContenedorInicio = document.querySelector(".Contenedor-Binicio");
const ContenedorEmergente = document.querySelector(".Con-Emergente");
const ContenedorTexto = document.querySelector(".Texto");

function AjustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

AjustarCanvas();

window.addEventListener("resize", () => {
    AjustarCanvas();
});

ContenedorEmergente.style.display = "none";
ContenedorTexto.style.display = "none";
canvas.style.display = "none";

BotonVer.addEventListener('click', function() {
    ContenedorEmergente.style.display = "flex";
});

BotonCerrar.addEventListener('click', function() {

    ContenedorEmergente.style.display = "none";
    ContenedorInicio.style.display = "none";

    ContenedorTexto.style.display = "block";
    canvas.style.display = "block";

    AjustarCanvas();

    CrearVarias();
});

function DibujarPetalo(
    x,
    y,
    RadioX,
    scala,
    Rotacion,
    color,
    pasos
) {

    const Numero = scala;
    const AnguloIncrement = (Math.PI / pasos) * 2;

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(Rotacion);
    ctx.scale(1, Numero);

    ctx.beginPath();

    for (let i = 0; i <= pasos; i++) {

        const AnguloActual = i * AnguloIncrement;

        const currentRadius =
            Math.sin(AnguloActual) * RadioX;

        const PuntoY =
            Math.sin(AnguloActual) * currentRadius;

        const PuntoX =
            Math.cos(AnguloActual) * currentRadius;

        if (i === 0) {
            ctx.moveTo(PuntoX, PuntoY);
        } else {
            ctx.lineTo(PuntoX, PuntoY);
        }
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function DibujarFlorSinTallo(
    x,
    y,
    NumeroPetalos,
    RadioXPetalo,
    RadioYPetalo,
    AltoTrazo
) {

    const PasosTallo = 50;
    const AltoTallo = AltoTrazo / PasosTallo;

    let NuevaY = y;

    const DibujarTallo = () => {

        if (NuevaY < y + AltoTrazo) {

            ctx.beginPath();

            ctx.moveTo(x, y);
            ctx.lineTo(x, NuevaY);

            ctx.lineWidth = 3;
            ctx.strokeStyle = 'green';

            ctx.stroke();

            NuevaY += AltoTallo;

            setTimeout(DibujarTallo, 20);
        }
    };

    DibujarTallo();

    const AnguloIncrement =
        (Math.PI * 2) / NumeroPetalos;

    let contadorPetalos = 0;

    function dibujarSiguientePetalo() {

        if (contadorPetalos < NumeroPetalos) {

            const Angulo =
                contadorPetalos * AnguloIncrement;

            DibujarPetalo(
                x,
                y,
                RadioXPetalo,
                2,
                Angulo,
                'yellow',
                100
            );

            contadorPetalos++;

            setTimeout(
                dibujarSiguientePetalo,
                120
            );

        } else {

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                9,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = 'orange';

            ctx.fill();
        }
    }

    dibujarSiguientePetalo();
}

function PosicionValida(x, y, posiciones) {

    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;

    const anchoCaja =
        Math.min(520, canvas.width * 0.68);

    const altoCaja = 240;

    const distanciaX =
        Math.abs(x - centroX);

    const distanciaY =
        Math.abs(y - centroY);

    if (
        distanciaX < anchoCaja / 2 &&
        distanciaY < altoCaja / 2
    ) {
        return false;
    }

    for (let flor of posiciones) {

        const distancia =
            Math.sqrt(
                Math.pow(x - flor.x, 2) +
                Math.pow(y - flor.y, 2)
            );

        if (distancia < 115) {
            return false;
        }
    }

    return true;
}

function CrearVarias() {

    const numFlores = 30;

    const posiciones = [];

    const margen = 65;

    let intentos = 0;

    while (
        posiciones.length < numFlores &&
        intentos < 10000
    ) {

        intentos++;

        const x =
            Math.random() *
            (canvas.width - margen * 2) +
            margen;

        const y =
            Math.random() *
            (canvas.height - margen * 2) +
            margen;

        if (PosicionValida(x, y, posiciones)) {

            posiciones.push({
                x: x,
                y: y
            });

            const tamaño =
                17 + Math.random() * 11;

            DibujarFlorSinTallo(
                x,
                y,
                8,
                tamaño,
                80,
                90 + Math.random() * 70
            );
        }
    }
}