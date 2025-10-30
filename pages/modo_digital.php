<?php
require_once '../backend/config/idioma_manager.php';
require_once '../backend/config/Traductor.php';
$traductor = new Traductor($idioma_seleccionado);
?>
<!DOCTYPE html>

<html lang="<?php echo $traductor->obtenerIdiomaActual(); ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $traductor->traducir('digital_titulo_pagina'); ?> - NoxByte</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="../assets/css/style.css">


</head>
<body class="digital-body">

<header class="header">
    <nav class="navbar bg-custom navbar-expand-lg">
        <div class="container-fluid">
            <div class="navbar-left-items">
                <div class="language-selector-container">
                    <div class="language-dropdown">
                        <button class="btn-language">
                            <span><?php echo $traductor->traducir('lang_' . $traductor->obtenerIdiomaActual()); ?></span>
                            <span>▼</span>
                        </button>
                        <div class="language-dropdown-content">
                            <?php if ($traductor->obtenerIdiomaActual() !== 'es'): ?>
                                <a href="#" class="language-option" data-lang="es"><?php echo $traductor->traducir('lang_es'); ?></a>
                            <?php endif; ?>
                            <?php if ($traductor->obtenerIdiomaActual() !== 'en'): ?>
                                <a href="#" class="language-option" data-lang="en"><?php echo $traductor->traducir('lang_en'); ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <a class="navbar-brand" href="../index.php">
                    <img src="../assets/imagenes/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">
                </a>
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="../index.php"><?php echo $traductor->traducir('nav_inicio'); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="modo_seguimiento.php"><?php echo $traductor->traducir('nav_seguimiento'); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="modo_juego_digital.php"><?php echo $traductor->traducir('nav_juego'); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="btn-abrir-tutorial"><?php echo $traductor->traducir('nav_tutorial'); ?></a>
                    </li>
                     <li class="nav-item">
                        <a class="nav-link" href="#" id="btn-quienes-somos"><?php echo $traductor->traducir('nav_sobre_noxbyte'); ?></a>
                    </li>

                    <?php if (isset($_SESSION['nombre_usuario'])): ?>
                        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'administrador'): ?>
                            <li class="nav-item">
                                <a class="nav-link btn-login" href="admin.php"><?php echo $traductor->traducir('nav_panel_admin'); ?></a>
                            </li>
                        <?php endif; ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link btn-login" href="#" role="button">
                                <?php echo $traductor->traducir('nav_mi_cuenta'); ?>
                            </a>
                            <div class="dropdown-content">
                                <a href="historial.php"><?php echo $traductor->traducir('nav_ver_historial'); ?></a>
                                <a href="ajustes.php"><?php echo $traductor->traducir('nav_ajustes'); ?></a>
                                <a href="../backend/Registro_y_Login/logout.php"><?php echo $traductor->traducir('nav_cerrar_sesion'); ?></a>
                            </div>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="login.php?form=register"><?php echo $traductor->traducir('nav_registrarse'); ?></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link btn-login" href="login.php?form=login"><?php echo $traductor->traducir('nav_iniciar_sesion'); ?></a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>
</header>

<main id="game-container" class="hidden">

    <div id="columna-tablero-juego">

        <div class="panel-tablero-digital">
            <div id="tabs-jugadores-digital"></div>
            <div id="contenedor-imagen-tablero">

                <div id="board-header-digital">
                    <h2 id="board-title"><?php echo $traductor->traducir('digital_parque_de'); ?></h2>
                    <div id="board-score" class="puntuacion-total-jugador"><?php echo $traductor->traducir('digital_puntuacion'); ?> <span>0</span></div>
                </div>

                <img src="../assets/imagenes/tablerodraftosaurus.png" alt="Tablero de Draftosaurus" id="imagen-tablero-digital">

                <div id="contenedor-slots-tablero">
                    <div class="recinto-digital" data-recinto="bosqueSemejanza" data-zona="boscosa" style="top: 13%; left: 7.0%; width: 33.5%; height: 17%;">
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-0"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-1"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-2"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-3"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-4"></div>
                        <div class="dino-slot-digital" data-slot-id="bosqueSemejanza-5"></div>
                    </div>
                    <div class="recinto-digital" data-recinto="reySelva" data-zona="boscosa" style="top: 16.5%; left: 66.5%; width: 12%; height: 3%;">
                        <div class="dino-slot-digital" data-slot-id="reySelva-0"></div>
                    </div>
                    <div class="recinto-digital" data-recinto="trioFrondoso" data-zona="boscosa" style="top: 42%; left: 7.0%; width: 23%; height: 15%;">
                        <div class="fila-piramide-superior"><div class="dino-slot-digital" data-slot-id="trioFrondoso-0">

                        </div></div><div class="fila-piramide-inferior"><div class="dino-slot-digital" data-slot-id="trioFrondoso-1"></div>
                        <div class="dino-slot-digital" data-slot-id="trioFrondoso-2"></div>
                    </div></div>
                    <div class="recinto-digital" data-recinto="pradoDiferencia" data-zona="llanura" style="top: 47%; left: 60%; width: 33.5%; height: 17%;">
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-0"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-1"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-2"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-3"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-4"></div>
                        <div class="dino-slot-digital" data-slot-id="pradoDiferencia-5"></div>
                    </div>
                    <div class="recinto-digital" data-recinto="praderaAmor" data-zona="llanura" style="top: 70%; left: 5.8%; width: 29%; height: 19%;">
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-0"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-1"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-2"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-3"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-4"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-5"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-6"></div>
                        <div class="dino-slot-digital" data-slot-id="praderaAmor-7"></div>
                    </div>
                    <div class="recinto-digital" data-recinto="islaSolitaria" data-zona="llanura" style="top: 69%; left: 78%; width: 12%; height: 12%;">
                        <div class="dino-slot-digital" data-slot-id="islaSolitaria-0"></div></div>
                    <div class="recinto-digital" data-recinto="rio" data-zona="neutra" style="top: 78%; left: 48%; width: 18%; height: 15%;">
                        <div class="dino-slot-digital" data-slot-id="rio-0"></div><div class="dino-slot-digital" data-slot-id="rio-1"></div>
                        <div class="dino-slot-digital" data-slot-id="rio-2"></div><div class="dino-slot-digital" data-slot-id="rio-3"></div>
                        <div class="dino-slot-digital" data-slot-id="rio-4"></div><div class="dino-slot-digital" data-slot-id="rio-5"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="controls-column">

        <section id="info-partida">
            <div class="info-item"><span><?php echo $traductor->traducir('tablero_info_ronda'); ?></span><strong id="round-number">1</strong> / 2</div>
            <div class="info-item"><span><?php echo $traductor->traducir('tablero_info_turno'); ?></span><strong id="turn-number">1</strong> / 6</div>
            <div class="info-item"><span><?php echo $traductor->traducir('tablero_info_jugador_activo'); ?></span><strong id="active-player-name"></span></strong></div>
        </section>

        <section id="dice-area" class="control-grupo">
            <h4><?php echo $traductor->traducir('tablero_restriccion_dado'); ?></h4>
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
            <button id="roll-dice-btn" class="btn btn-accion"><?php echo $traductor->traducir('tablero_btn_lanzar_dado'); ?></button>
            <p class="text-sm mt-2">Restricción: <span id="dice-result-text" class="font-bold"></span></p>
        </section>

        <section id="player-hand-area" class="control-grupo">
            <h4><?php echo $traductor->traducir('digital_tu_mano'); ?></h4>
            <div id="current-player-hand"></div>
        </section>

        <section id="end-game-actions-container" class="control-grupo hidden">
             <button id="btn-ver-puntuaciones" class="btn btn-accion"><?php echo $traductor->traducir('digital_btn_ver_puntuaciones'); ?></button>
        </section>

        <section id="game-actions-area" class="control-grupo">
             <div class="acciones-turno-grid" style="margin-top: 1rem;">
                <button id="btn-guardar-salir" class="btn btn-accion"><?php echo $traductor->traducir('digital_btn_guardar_salir'); ?></button>
                <a href="../index.php" class="btn btn-accion"><?php echo $traductor->traducir('digital_btn_salir_sin_guardar'); ?></a>
            </div>
        </section>
    </div>
</main>

 <footer class="bg-custom text-center text-lg-start mt-5">
     <div class="container p-4">
       <p class="mb-1">© <?php echo date("Y"); ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

<div id="end-game-modal" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-close-end-game-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
        <h2 class="font-display"><?php echo $traductor->traducir('digital_modal_fin_titulo'); ?></h2>
        <div id="final-scores-container" class="modal-scrollable-content"></div>
        <div id="winner-container" class="ganador" style="margin-top: 1rem; flex-shrink: 0;"></div>
        <div class="acciones-turno-grid" style="margin-top: 1.5rem; gap: 10px;">
            <button class="btn btn-accion" onclick="window.location.href='modo_juego_digital.php'"><?php echo $traductor->traducir('digital_btn_jugar_nuevo'); ?></button>
            <a href="../index.php" class="btn btn-accion"><?php echo $traductor->traducir('digital_btn_volver_menu'); ?></a>
        </div>
    </div>
</div>

<div id="guardar-partida-modal-overlay" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-cancelar-guardado-final" class="modal-close-btn" aria-label="Cancelar">&times;</button>
        <h2 class="font-display"><?php echo $traductor->traducir('digital_modal_guardar_titulo'); ?></h2>
        <p class="descripcion-panel" style="font-size: 1.2rem; margin-top: 1rem;">
            <?php echo $traductor->traducir('digital_modal_guardar_texto'); ?>
        </p>
        <div class="form-group" style="margin-top: 1rem;">
            <input type="text" id="nombre-partida-finalizada" class="form-control" placeholder="<?php echo $traductor->traducir('digital_modal_guardar_placeholder'); ?>" maxlength="50">
        </div>
        <div class="modal-acciones">
            <button id="btn-confirmar-guardado-final" class="btn btn-accion" disabled><?php echo $traductor->traducir('digital_btn_guardar_final'); ?></button>
        </div>
    </div>
</div>


<?php require_once '../includes/modales_comunes.php'; ?>

<script>
    window.translations = <?php echo json_encode($traductor->obtenerTodosLosTextos()); ?>;
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="../assets/js/comunes.js"></script>
<script src="../assets/js/idioma.js"></script>
<script src="../assets/js/traductor.js"></script>
<script src="../assets/js/motor_juego.js"></script>
<script src="../assets/js/modo_digital.js"></script>
<script src="../assets/js/tutorial.js"></script>

</body>
</html>

