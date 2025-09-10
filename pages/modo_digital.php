<!DOCTYPE html>

<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Draftosaurus - Modo Digital - NoxByte</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="../assets/css/style.css">

</head>
<body class="digital-body">

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
                    <li class="nav-item">
                        <a class="nav-link" href="login.php">Registrarse</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn-login" href="login.php">Iniciar Sesión</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

<main id="game-container" class="hidden">
    
    <div id="columna-tablero-juego">
       
        <div class="panel-tablero-digital">
            <div id="tabs-jugadores-digital">
              
            </div>
            <div id="contenedor-imagen-tablero">
                
                <div id="board-header-digital">
                    <h2 id="board-title">Parque de...</h2>
                    <div id="board-score" class="puntuacion-total-jugador">Puntuación: <span>0</span></div>
                </div>

                <img src="../assets/imagenes/tablerodraftosaurus.png" alt="Tablero de Draftosaurus" id="imagen-tablero-digital">
                
                <div id="contenedor-slots-tablero">
                    <!-- Bosque de la Semejanza  -->
                    <div class="recinto-digital" data-recinto="bosqueSemejanza" data-zona="boscosa" style="top: 13%; left: 6%; width: 33.5%; height: 17%;">
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-0"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-1"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-2"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-3"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-4"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-5"></div>
                    </div>
                    
                    <!-- Rey de la Selva  -->
                    <div class="recinto-digital" data-recinto="reySelva" data-zona="boscosa" style="top: 16.5%; left: 66.5%; width: 12%; height: 3%;">
                        <div class="dino-slot-digital" data-slot-id="reySelva-0"></div>
                    </div>

                    <!--  Trío Frondoso -->
                    <div class="recinto-digital" data-recinto="trioFrondoso" data-zona="boscosa" style="top: 42%; left: 7.5%; width: 23%; height: 15%;">
                        <div class="fila-piramide-superior">
                            <div class="dino-slot-digital" data-slot-id="trioFrondoso-0"></div>
                        </div>
                        <div class="fila-piramide-inferior">
                            <div class="dino-slot-digital" data-slot-id="trioFrondoso-1"></div>
                            <div class="dino-slot-digital" data-slot-id="trioFrondoso-2"></div>
                        </div>
                    </div>

                    <!-- Prado de la Diferencia  -->
                    <div class="recinto-digital" data-recinto="pradoDiferencia" data-zona="llanura" style="top: 47%; left: 59.5%; width: 33.5%; height: 17%;">
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-0"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-1"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-2"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-3"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-4"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-5"></div>
                    </div>
                    
                    <!-- Pradera del Amor  -->
                    <div class="recinto-digital" data-recinto="praderaAmor" data-zona="llanura" style="top: 70%; left: 10%; width: 29%; height: 16%;">
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-0"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-1"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-2"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-3"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-4"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-5"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-6"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-7"></div>
                    </div>
                    
                    <!-- Isla Solitaria  -->
                    <div class="recinto-digital" data-recinto="islaSolitaria" data-zona="llanura" style="top: 69%; left: 78%; width: 12%; height: 12%;">
                         <div class="dino-slot-digital" data-slot-id="islaSolitaria-0"></div>
                    </div>
                    
                   <!-- Río  -->
                    <div class="recinto-digital" data-recinto="rio" data-zona="neutra" style="top: 78%; left: 48%; width: 18%; height: 15%;">
                       <div class="dino-slot-digital" data-slot-id="rio-0"></div>
                       <div class="dino-slot-digital" data-slot-id="rio-1"></div>
                       <div class="dino-slot-digital" data-slot-id="rio-2"></div>
                       <div class="dino-slot-digital" data-slot-id="rio-3"></div>
                       <div class="dino-slot-digital" data-slot-id="rio-4"></div>
                       <div class="dino-slot-digital" data-slot-id="rio-5"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="controls-column">
        <section id="info-partida">
            <div class="info-item"><span>Ronda:</span><strong id="round-number">1</strong> / 2</div>
            <div class="info-item"><span>Turno:</span><strong id="turn-number">1</strong> / 6</div>
            <div class="info-item"><span>Jugador Activo:</span><strong id="active-player-name"></span></strong></div>
        </section>

        <section id="dice-area" class="control-grupo">
            <h4>Dado de Restricción</h4>
            
            <div id="dice-container-digital">
                <div id="dice-digital">
                    <div class="face-digital front"><img src="../assets/imagenes/boscoso.png" alt="Cara Bosque"></div>
                    <div class="face-digital back"><img src="../assets/imagenes/banos.png" alt="Cara Baños"></div>
                    <div class="face-digital right"><img src="../assets/imagenes/llanura.png" alt="Cara Pradera"></div>
                    <div class="face-digital left"><img src="../assets/imagenes/cafe.png" alt="Cara Cafetería"></div>
                    <div class="face-digital top"><img src="../assets/imagenes/recintovacio.png" alt="Cara Recinto Vacío"></div>
                    <div class="face-digital bottom"><img src="../assets/imagenes/trex.png" alt="Cara Sin T-Rex"></div>
                </div>
            </div>
            
            <button id="roll-dice-btn" class="btn btn-accion">Lanzar Dado</button>
            <p class="text-sm mt-2">Restricción: <span id="dice-result-text" class="font-bold">Ninguna</span></p>
        </section>

        <section id="player-hand-area" class="control-grupo">
            <h4>Tu Mano de Dinosaurios</h4>
            <div id="current-player-hand">
               
            </div>
        </section>
    </div>
</main>

 <footer class="bg-custom text-center text-lg-start mt-5">
     <div class="container p-4">
       <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

<div id="end-game-modal" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-close-end-game-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
        <h2 class="font-display">¡Partida Finalizada!</h2>
        <div id="final-scores-container" class="modal-scrollable-content"></div>
        <div id="winner-container" class="ganador" style="margin-top: 1rem; flex-shrink: 0;"></div>
        <button onclick="reiniciarPartida()" class="btn btn-info mt-4" style="flex-shrink: 0;">Jugar de Nuevo</button>
    </div>
</div>

<div id="notificacion-container"></div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="../assets/js/comunes.js"></script>
<script src="../assets/js/motor_juego.js"></script> 
<script src="../assets/js/modo_digital.js"></script>

</body>
</html>