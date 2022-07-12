var canvas;
var contenidoCanvas;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 5;

const PALETA_HEIGHT = 100;
const PALETA_WIDTH = 10;

var paletaIzquierdaY = 300 - (PALETA_HEIGHT / 2);
var paletaDerechaY = 300 - (PALETA_HEIGHT / 2);

var puntosPlayer1 = 0;
var puntosPlayer2 = 0;

const WIN_SCORE = 3;

var mostrarPantallaFinal = false;

window.onload = function() {
    canvas = document.querySelector('.game');
    contenidoCanvas = canvas.getContext('2d');

    var fps = 60;
    //Loop
    setInterval(function() {
        moverTodo();
        dibujarTodo();
    }, 1000 / fps);
    canvas.addEventListener('mousemove',
        function(evt) {
            var mousePos = calcularPosicionMouse(evt);
            paletaIzquierdaY = mousePos.y - (PALETA_HEIGHT / 2);
            //Si el borde inferior de la paleta es mayor al tamaño maximo de la pantalla 
            if (paletaIzquierdaY + PALETA_HEIGHT > canvas.height) {
                paletaIzquierdaY = canvas.height - PALETA_HEIGHT;
            }
            //Si el borde superior de la paleta es mayor al tamaño minimo de la pantalla 
            if (paletaIzquierdaY < 0) {
                paletaIzquierdaY = 0;
            }
        }
    )
    canvas.addEventListener('mousedown', mouseMovimiento)
}

function mouseMovimiento(evt) {
    if (mostrarPantallaFinal) {
        puntosPlayer1 = 0;
        puntosPlayer2 = 0;
        mostrarPantallaFinal = false;
    }
}

function movimientoComputadora() {
    var paletaDerechaCentro = paletaDerechaY + (PALETA_HEIGHT / 2);
    if (paletaDerechaCentro < ballY) {
        paletaDerechaY += 3;
    } else {
        paletaDerechaY -= 3;
    }
    //Si el borde inferior de la paleta es mayor al tamaño maximo de la pantalla 
    if (paletaDerechaY + PALETA_HEIGHT > canvas.height) {
        paletaDerechaY = canvas.height - PALETA_HEIGHT;
    }
    //Si el borde superior de la paleta es mayor al tamaño minimo de la pantalla 
    if (paletaDerechaY < 0) {
        paletaDerechaY = 0;
    }
}

function resetearPelota() {
    if (puntosPlayer1 >= WIN_SCORE || puntosPlayer2 >= WIN_SCORE) {
        //Si alguno de los jugadores gano
        mostrarPantallaFinal = true;
    }
    ballSpeedX = 5;
    ballSpeedY = 5;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function calcularPosicionMouse(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY,
    }
}

function moverTodo() {
    //Si alguien gano
    if (mostrarPantallaFinal) {
        return;
    }
    //Cambiando la posicion horizontal de la pelota
    ballX += ballSpeedX;

    //Si la pelota sale del lado izquierdo de la pantalla
    if (ballX < 0) {
        puntosPlayer2++;
        resetearPelota();
    }
    //Si la pelota llega a X del grosor de la paleta
    if (ballX < 5) {
        //Si toca la paleta rebota
        if (ballY > paletaIzquierdaY && ballY < paletaIzquierdaY + PALETA_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            //que tan debajo o arriba del centro golpeo la pelota
            var deltaY = ballY - (paletaIzquierdaY + PALETA_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        }
    }

    //Si la pelota sale del lado derecho de la pantalla
    if (ballX + 10 > canvas.width) {
        puntosPlayer1++;
        resetearPelota();
    }
    //Si la pelota llega a X del grosor de la paleta
    if (ballX + 10 > canvas.width - 15) {
        //Si toca la paleta rebota
        if (ballY > paletaDerechaY && ballY < paletaDerechaY + PALETA_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paletaDerechaY + PALETA_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        }
    }

    //Cambiando la posicion vertical de la pelota
    ballY += ballSpeedY;
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    movimientoComputadora();
}

function dibujarTodo() {
    //Dibujando el fondo negro
    dibujar(0, 0, canvas.width, canvas.height, 'black');

    //Si alguien gano
    if (mostrarPantallaFinal) {
        contenidoCanvas.fillStyle = 'white';
        contenidoCanvas.font = 'bold 20px arial';
        if (puntosPlayer1 >= WIN_SCORE) {
            contenidoCanvas.fillText("¡Player 1 Ganó!", (canvas.width / 2) - 60, (canvas.height / 2) - 60);
        } else if (puntosPlayer2 >= WIN_SCORE) {
            contenidoCanvas.fillText("¡Player 2 Ganó!", (canvas.width / 2) - 60, (canvas.height / 2) - 60);
        }
        contenidoCanvas.fillText("Haz click para continuar", (canvas.width / 2) - 100, (canvas.height / 2));
        return;
    }

    //Dibujando la red
    for (var i = 10; i < 600; i += 40) {
        dibujar(canvas.width / 2, i, 5, 20, 'white');
    }

    //Dibujando la paleta izquierda
    dibujar(5, paletaIzquierdaY, PALETA_WIDTH, PALETA_HEIGHT, 'white');

    //Dibujando la paleta derecha
    dibujar(785, paletaDerechaY, PALETA_WIDTH, PALETA_HEIGHT, 'white');

    //Dibujando la pelota
    dibujar(ballX, ballY, 15, 15, 'white');

    //Estableciendo fuente al texto
    contenidoCanvas.font = 'bold 40px consolas';

    //Dibujando el score izquierdo
    contenidoCanvas.fillText('Player 1', 35, 50);
    contenidoCanvas.fillText(puntosPlayer1, 100, 125);

    //Dibujando el score derecho
    contenidoCanvas.fillText('Player 2', canvas.width - 200, 50);
    contenidoCanvas.fillText(puntosPlayer2, canvas.width - 100, 125);
}

function dibujar(x, y, width, height, color) {
    contenidoCanvas.fillStyle = color;
    contenidoCanvas.fillRect(x, y, width, height);
}