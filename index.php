<?php
// Iniciar la sesión al principio de todo
session_start();
?>
<!DOCTYPE html>

<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Draftosaurus - NoxByte</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="assets/css/style.css">

</head>
<body>

<header class="header">
    <nav class="navbar bg-custom navbar-expand-lg position-relative">
        <div class="container-fluid">
            <img src="assets/imagenes/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="index.php">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pages/modo_seguimiento.php">Seguimiento</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pages/modo_juego_digital.php">Juego</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="btn-abrir-tutorial">Tutorial</a>
                    </li>
                     <li class="nav-item">
                        <a class="nav-link" href="#" id="btn-quienes-somos">Sobre NoxByte</a>
                    </li>

                    <?php if (isset($_SESSION['nombre_usuario'])): ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link btn-login" href="#" role="button">
                                Mi Cuenta
                            </a>
                            <div class="dropdown-content">
                                <a href="backend/Registro y Login/logout.php">Cerrar Sesión</a>
                            </div>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="pages/login.php?form=register">Registrarse</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link btn-login" href="pages/login.php?form=login">Iniciar Sesión</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>
</header>

<main class="main-content">
 <section class="seccion-juego py-5">
  <div class="container">
    <div class="row mb-5">
      <div class="col-md-6 text-center mb-4 mb-md-0">
        <h2>¡Juega Draftosaurus!</h2>
        <p>¡Demuestra que eres el mejor estratega jurásico y juega a nuestra versión digital de Draftosaurus!</p>
        <a href="pages/modo_juego_digital.php"><button class="btn">¡Jugar ahora!</button></a>
      </div>
      <div class="col-md-6 text-center">
        <h2>¡Registra tu partida!</h2>
        <p>Ingresa los detalles de tu partida física con la app de seguimiento para llevar un registro completo.</p>
        <a href="pages/modo_seguimiento.php"><button class="btn">Registrar ahora</button></a>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <div class="mx-auto" style="max-width: 900px;">
            <h2>Partidas Guardadas</h2><br>
            <table class="table table-striped table-bordered custom-table">
              <thead>
                <tr>
                  <th>Partidas</th>
                  <th>Guardados</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Partida 1</td>
                  <td>Reanudar</td>
                  <td>2025-06-01</td>
                </tr>
                <tr>
                  <td>Partida 2</td>
                  <td>Reanudar</td>
                  <td>2025-05-30</td>
                </tr>
                <tr>
                  <td>Partida 3</td>
                  <td>Reanudar</td>
                  <td>2025-05-28</td>
                </tr>
                <tr>
                  <td>Partida 4</td>
                  <td>Reanudar</td>
                  <td>2025-05-25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="seccion-informacion py-5">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h2>¿Cómo jugar?</h2>
        <p>Draftosaurus es un juego de mesa donde los jugadores deben crear el mejor parque jurásico posible. Cada
          jugador selecciona dinosaurios y los coloca estratégicamente en su parque para maximizar su puntaje.</p>
      </div>
      <div class="col-md-6 text-center bg-transparent">
        <h2>¡Aprende a Jugar!</h2><br>
        <button id="btn-abrir-tutorial-main" class="btn">Ver Tutorial</button>
    </div>
  </div>
</section>
</main>

 <footer class="bg-custom text-center text-lg-start">
     <div class="container p-4">
       <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

<div id="quienes-somos-modal-overlay" class="modal-overlay">
<div class="modal-content card-parchment">
<button id="btn-close-quienes-somos-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
<h2 class="font-display">Sobre NoxByte</h2>

        <div class="logo-container">
            <img src="assets/imagenes/logonoxbyte.png" alt="Logo de Ctrl+Zaurio" class="quienes-somos-logo">
        </div>
        <div class="modal-scrollable-content">
<p class="modal-slogan">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>

<p>Somos <strong>NoxByte</strong>, una empresa de desarrollo de software formada por los estudiantes del Instituto Tecnológico de Informática(ITI) Fabricio Figueroa, Bruno Mendez, Georgina Madera, Mateo Suarez y Giuliana Arregui.  </p>
<p>Nuestra misión es aplicar los conocimientos sobre la informática para desarrollar proyectos creativos y funcionales mediante el trabajo en equipo, el aprendizaje continuo y en enfrentar cada desafío que se nos proponga, tal como nos enseño el Instituto.</p>
<p>Este proyecto sobre "Draftosaurus", es un reflejo de nuestro compromiso en la informática y el entretenimiento, otorgando un proyecto de estrategia visualmente atractivo para jugadores como tú.</p>
<p class="modal-thanks"><em>Gracias por explorar nuestro trabajo. ¡Esperamos que disfrutes la aplicación!</em></p>

</div>
</div>
</div>

<div id="tutorial-modal" class="tutorial__superposicion" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo">
    <div id="tutorial-container" class="tutorial__contenedor">
        <h2 id="tutorial-titulo" class="tutorial__encabezado">Guía Del Juego</h2>
        <button id="tutorial-close-btn" class="tutorial__boton-cerrar" aria-label="Cerrar Tutorial">&times;</button>

        <div class="tutorial__area-contenido">
            
            <div id="welcome-screen-tutorial" class="tutorial__pantalla">
                <h3>¡Bienvenido al Tutorial!</h3>
                <p>¿Es tu primer dia? No te preocupes, ¡Esto te ayudará a ser todo un experto! </p>
                <button id="tutorial-start-btn" class="btn-menu">Iniciar Tutorial</button>
            </div>

            <div class="tutorial__vista-juego oculta">
                <div class="tutorial__tablero-contenedor">
                    <img src="assets/imagenes/tablerodraftosaurus.png" alt="Tablero de Draftosaurus" class="tutorial__imagen-tablero">
                    <div id="tutorial-slots-container" class="tutorial__slots-superpuestos">
                    </div>
                </div>
                <div class="tutorial__barra-lateral">
                    <section id="player-hand-area" class="tutorial__panel-lateral">
                        <h3>Tu Mano</h3>
                        <div id="player-hand-tutorial" class="tutorial__mano-dinosaurios"></div>
                    </section>
                    <section id="dice-area-tutorial" class="tutorial__panel-lateral">
                        <h3>Dado de Restricción</h3>
                        <div class="tutorial__contenedor-dado">
                            <div id="dice-tutorial" class="tutorial__dado">
                                <div class="tutorial__dado-cara frontal"><img src="assets/imagenes/boscoso.png" alt="Cara Bosque"></div>
                                <div class="tutorial__dado-cara trasera"><img src="assets/imagenes/banos.png" alt="Cara Baños"></div>
                                <div class="tutorial__dado-cara derecha"><img src="assets/imagenes/llanura.png" alt="Cara Pradera"></div>
                                <div class="tutorial__dado-cara izquierda"><img src="assets/imagenes/cafe.png" alt="Cara Cafetería"></div>
                                <div class="tutorial__dado-cara superior"><img src="assets/imagenes/recintovacio.png" alt="Cara Recinto Vacío"></div>
                                <div class="tutorial__dado-cara inferior"><img src="assets/imagenes/trex.png" alt="Cara Sin T-Rex"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div id="end-screen-tutorial" class="tutorial__pantalla oculta">
                 <h3>¡Tutorial Completado!</h3>
                 <p>Has aprendido los fundamentos para dirigir tu parque. ¡Bienvenido a Draftosaurus!</p>
                 <button id="tutorial-close-btn-end" class="tutorial__boton">Cerrar Tutorial</button>
            </div>
        </div>
    </div>

    <div id="highlight-overlay-tutorial" class="tutorial__caja-resaltado" style="display: none;"></div>
    <div id="highlight-overlay-hand-tutorial" class="tutorial__caja-resaltado" style="display: none;"></div>

    <div id="tutorial-tooltip" class="tutorial__tooltip" style="display: none;">
        <p id="tooltip-content"></p>
        <div class="tutorial__tooltip-navegacion">
            <button id="tooltip-next-btn" class="tutorial__boton">Entendido</button>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="assets/js/comunes.js"></script>
<script src="assets/js/index.js"></script>
<script src="assets/js/tutorial.js"></script>

</body>
</html>