<?php
session_start();
?>
<!DOCTYPE html>

<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tablero de Juego - Draftosaurus - NoxByte</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="../assets/css/style.css">

</head>
<body>
<header class="header">
<nav class="navbar bg-custom navbar-expand-lg position-relative">
<div class="container-fluid">
<img src="../assets/imagenes/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">
<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ms-auto">
        <li class="nav-item">
            <a class="nav-link" aria-current="page" href="../index.php">Inicio</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="modo_seguimiento.php">Seguimiento</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="modo_juego_digital.php">Juego</a>
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
                    <a href="../backend/Registro y Login/logout.php">Cerrar Sesión</a>
                </div>
            </li>
        <?php else: ?>
            <li class="nav-item">
                <a class="nav-link" href="login.php?form=register">Registrarse</a>
            </li>
            <li class="nav-item">
                <a class="nav-link btn-login" href="login.php?form=login">Iniciar Sesión</a>
            </li>
        <?php endif; ?>
    </ul>
</div>
</div>
</nav>
</header>

<main id="main-tablero">

    <div class="seguimiento-layout">

        <div id="tablero-columna-izquierda">
            <div class="panel-tablero panel-tablero-full-height">
                <div id="tabs-jugadores"></div>
                <div id="tableros-container"></div>
            </div>
        </div>

        <div id="controles-columna-derecha">

            <div class="panel-tablero">
                <div id="info-partida">
                    <div class="info-item">
                        <span>Ronda:</span>
                        <strong id="ronda-actual">1</strong> / 2
                    </div>
                    <div class="info-item">
                        <span>Turno:</span>
                        <strong id="turno-actual">1</strong> / 6
                    </div>
                    <div class="info-item">
                        <span>Jugador Activo:</span>
                        <strong id="jugador-activo-dados"></strong>
                    </div>
                </div>
            </div>

            <div class="panel-tablero">
                <div id="gestion-turno-dados">
                    <div class="control-grupo">
                        <h4>Restricción del Dado</h4>
                        <p class="descripcion-control">(Aplica a todos MENOS al Jugador Activo)</p>
                        <div id="restricciones-dados-container">
                            <button class="btn-dado" data-restriccion="boscosa">Zona Boscosa</button>
                            <button class="btn-dado" data-restriccion="llanura">Zona Llanura</button>
                            <button class="btn-dado" data-restriccion="cafeteria">Zona de Cafetería</button>
                            <button class="btn-dado" data-restriccion="banos">Zona de Baños</button>
                            <button class="btn-dado" data-restriccion="vacio">Recinto Vacío</button>
                            <button class="btn-dado" data-restriccion="sin-t-rex">Sin T-Rex</button>
                            <button class="btn-dado active" data-restriccion="ninguna">Ninguna</button>
                        </div>
                    </div>
                    <div class="control-grupo">
                        <h4>Acciones del Turno</h4>
                        <div class="acciones-turno-grid">
                            <button id="btn-lanzar-dado" class="btn-menu">Lanzar Dado</button>
                            <button id="btn-siguiente-turno" class="btn-menu">Siguiente Turno</button>
                            <button id="btn-ver-historial" class="btn-menu">Ver Historial</button>
                            <button id="btn-reiniciar-partida" class="btn-menu btn-peligro">Reiniciar Partida</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-tablero">
                <div id="panel-de-control">
                    <div id="mano-virtual-container" class="control-grupo">
                        <h4>Tu Mano (Ronda <span id="ronda-mano-virtual">1</span>)</h4>
                        <div id="mano-virtual-dinos"></div>
                        <p id="mano-virtual-info" class="hidden">
                            Arrastra un dinosaurio de tu mano al recinto que quieras.
                        </p>
                        <div class="mano-botones-container">
                            <button id="btn-registrar-mano" class="btn-menu">Elegir Mano</button>
                            <button id="btn-mano-aleatoria" class="btn-menu">Mano Aleatoria</button>
                        </div>
                    </div>
                    <div id="acciones-jugador" class="control-grupo">
                        <h4>Acciones Rápidas</h4>
                        <button id="btn-deshacer" class="btn-menu">Deshacer Ultimo Movimiento</button>
                    </div>
                </div>
            </div>
    
            <div style="text-align: center;">
                <button id="btn-finalizar-partida" class="btn-menu">Finalizar Partida y Ver Resultados</button>
            </div>
        </div>
    </div>
</main>

 <footer class="bg-custom text-center text-lg-start mt-5">
     <div class="container p-4">
       <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

</footer>

<div id="notificacion-container"></div>

<template id="plantilla-parque-jugador">
    <div class="parque-container">
        <section class="tablero-juego">
            <div class="encabezado-parque">
                <h2>Parque de <span class="nombre-jugador-parque"></span></h2>
                <div class="puntuacion-total-jugador">
                    Puntuación: <span class="puntos">0</span>
                </div>
            </div>
            <div class="parque-jugador">
                <div class="recinto" data-recinto="bosqueSemejanza" data-zona="boscosa">
                    <h3>Bosque de la Semejanza <span class="recinto-icono">☕</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-0"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-1"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-2"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-3"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-4"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-5"></div>
                    </div>
                    <div class="recinto-puntuacion">
                        <span class="punto">2</span>
                        <span class="punto">4</span>
                        <span class="punto">8</span>
                        <span class="punto">12</span>
                        <span class="punto">18</span>
                        <span class="punto">24</span>
                    </div>
                </div>
                <div class="recinto" data-recinto="reySelva" data-zona="boscosa">
                    <h3>Rey de la Selva <span class="recinto-icono">🚻</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="reySelva-0"></div>
                    </div>
                </div>

                <div class="recinto" data-recinto="trioFrondoso" data-zona="boscosa">
                    <h3>Trío Frondoso <span class="recinto-icono">☕</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="trioFrondoso-0"></div>
                        <div class="dino-slot" data-slot-id="trioFrondoso-1"></div>
                        <div class="dino-slot" data-slot-id="trioFrondoso-2"></div>
                    </div>
                </div>
                <div class="recinto" data-recinto="pradoDiferencia" data-zona="llanura">
                    <h3>Prado de la Diferencia <span class="recinto-icono">🚻</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="pradoDiferencia-0"></div>
                        <div class="dino-slot" data-slot-id="pradoDiferencia-1"></div>
                        <div class="dino-slot" data-slot-id="pradoDiferencia-2"></div>
                        <div class="dino-slot" data-slot-id="pradoDiferencia-3"></div>
                        <div class="dino-slot" data-slot-id="pradoDiferencia-4"></div>
                        <div class="dino-slot" data-slot-id="pradoDiferencia-5"></div>
                    </div>
                    <div class="recinto-puntuacion">
                        <span class="punto">1</span>
                        <span class="punto">3</span>
                        <span class="punto">6</span>
                        <span class="punto">10</span>
                        <span class="punto">15</span>
                        <span class="punto">21</span>
                    </div>
                </div>

                <div class="recinto" data-recinto="praderaAmor" data-zona="llanura">
                    <h3>Pradera del Amor <span class="recinto-icono">☕</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="praderaAmor-0"></div>
                        <div class="dino-slot" data-slot-id="praderaAmor-1"></div>
                        <div class="dino-slot" data-slot-id="praderaAmor-2"></div>
                        <div class="dino-slot" data-slot-id="praderaAmor-3"></div>
                        <div class="dino-slot" data-slot-id="praderaAmor-4"></div>
                        <div class="dino-slot" data-slot-id="praderaAmor-5"></div>
                    </div>
                </div>
                <div class="recinto" data-recinto="islaSolitaria" data-zona="llanura">
                    <h3>Isla Solitaria <span class="recinto-estado"></span><span class="recinto-icono">🚻</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="islaSolitaria-0"></div>
                    </div>
                </div>

                <div class="recinto" data-recinto="rio" data-zona="neutra">
                    <h3>Río</h3>
                    <div class="dino-slots-container">
                       <div class="dino-slot" data-slot-id="rio-0"></div>
                       <div class="dino-slot" data-slot-id="rio-1"></div>
                       <div class="dino-slot" data-slot-id="rio-2"></div>
                       <div class="dino-slot" data-slot-id="rio-3"></div>
                       <div class="dino-slot" data-slot-id="rio-4"></div>
                       <div class="dino-slot" data-slot-id="rio-5"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="../assets/js/comunes.js"></script>
<script src="../assets/js/motor_juego.js"></script> 
<script src="../assets/js/tablero.js"></script>

<div id="resultados-modal-overlay" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-close-resultados-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
        <h2 class="font-display">Resultados Finales</h2>
        <div id="resultados-finales-container" class="modal-scrollable-content"></div>
        <div id="ganador-container" class="ganador"></div>
    </div>
</div>
<div id="historial-modal-overlay" class="modal-overlay">
    <div class="modal-content">
        <h2 class="modal-titulo">Historial de Movimientos</h2>
        <div id="historial-body" class="modal-body">
            </div>
       <button id="btn-cerrar-historial-modal" class="btn-menu">Cerrar</button>
    </div>
</div>
</body>

</html>
