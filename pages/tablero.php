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
<title><?php echo $traductor->traducir('tablero_titulo_pagina'); ?> - Draftosaurus - NoxByte</title>

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
                                <a href="../backend/Registro y Login/logout.php"><?php echo $traductor->traducir('nav_cerrar_sesion'); ?></a>
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
                        <span><?php echo $traductor->traducir('tablero_info_ronda'); ?></span>
                        <strong id="ronda-actual">1</strong> / 2
                    </div>
                    <div class="info-item">
                        <span><?php echo $traductor->traducir('tablero_info_turno'); ?></span>
                        <strong id="turno-actual">1</strong> / 6
                    </div>
                    <div class="info-item">
                        <span><?php echo $traductor->traducir('tablero_info_jugador_activo'); ?></span>
                        <strong id="jugador-activo-dados"></strong>
                    </div>
                </div>
            </div>

            <div class="panel-tablero">
                <div id="gestion-turno-dados">
                    <div class="control-grupo">
                        <h4><?php echo $traductor->traducir('tablero_restriccion_dado'); ?></h4>
                        <p class="descripcion-control"><?php echo $traductor->traducir('tablero_restriccion_subtitulo'); ?></p>
                        <div id="restricciones-dados-container">
                            <button class="btn-dado" data-restriccion="boscosa"><?php echo $traductor->traducir('tablero_dado_boscosa'); ?></button>
                            <button class="btn-dado" data-restriccion="llanura"><?php echo $traductor->traducir('tablero_dado_llanura'); ?></button>
                            <button class="btn-dado" data-restriccion="cafeteria"><?php echo $traductor->traducir('tablero_dado_cafeteria'); ?></button>
                            <button class="btn-dado" data-restriccion="banos"><?php echo $traductor->traducir('tablero_dado_banos'); ?></button>
                            <button class="btn-dado" data-restriccion="vacio"><?php echo $traductor->traducir('tablero_dado_vacio'); ?></button>
                            <button class="btn-dado" data-restriccion="sin-t-rex"><?php echo $traductor->traducir('tablero_dado_sin_t_rex'); ?></button>
                            <button class="btn-dado active" data-restriccion="ninguna"><?php echo $traductor->traducir('tablero_dado_ninguna'); ?></button>
                        </div>
                    </div>

                    <div class="control-grupo">
                        <h4><?php echo $traductor->traducir('tablero_acciones_turno'); ?></h4>
                        <div class="acciones-turno-grid">
                            <button id="btn-lanzar-dado" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_lanzar_dado'); ?></button>
                            <button id="btn-siguiente-turno" class="btn-menu" disabled><?php echo $traductor->traducir('tablero_btn_siguiente_turno'); ?></button>
                            <button id="btn-ver-historial" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_ver_historial'); ?></button>
                            <button id="btn-reiniciar-partida" class="btn-menu btn-peligro"><?php echo $traductor->traducir('tablero_btn_reiniciar_partida'); ?></button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-tablero">
                <div id="panel-de-control">
                    <div id="mano-virtual-container" class="control-grupo">
                        <h4 id="titulo-mano-virtual"><?php echo $traductor->traducir('tablero_tu_mano_titulo', ['ronda' => 1]); ?></h4>
                        <div id="mano-virtual-dinos"></div>
                        <p id="mano-virtual-info" class="hidden">
                            <?php echo $traductor->traducir('tablero_tu_mano_subtitulo'); ?>
                        </p>
                        <div class="mano-botones-container">
                            <button id="btn-registrar-mano" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_elegir_mano'); ?></button>
                            <button id="btn-mano-aleatoria" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_mano_aleatoria'); ?></button>
                        </div>
                    </div>
                    <div id="acciones-jugador" class="control-grupo">
                        <h4><?php echo $traductor->traducir('tablero_acciones_rapidas'); ?></h4>
                        <button id="btn-deshacer" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_deshacer'); ?></button>
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <button id="btn-finalizar-partida" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_finalizar_partida'); ?></button>
            </div>
        </div>
    </div>
</main>

 <footer class="bg-custom text-center text-lg-start mt-5">
     <div class="container p-4">
       <p class="mb-1">© <?php echo date("Y"); ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>



<template id="plantilla-parque-jugador">
    <div class="parque-container">
        <section class="tablero-juego">
            <div class="encabezado-parque">
                 <h2 class="nombre-jugador-parque"><?php echo $traductor->traducir('tablero_parque_de'); ?> <span></span></h2>
                <div class="puntuacion-total-jugador">
                    <?php echo $traductor->traducir('tablero_puntuacion'); ?> <span class="puntos">0</span>
                </div>
            </div>
            <div class="parque-jugador">
                <div class="recinto" data-recinto="bosqueSemejanza" data-zona="boscosa">
                    <h3><?php echo $traductor->traducir('tablero_recinto_bosque_semejanza'); ?> <span class="recinto-icono">☕</span></h3>
                    <div class="dino-slots-container">
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-0"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-1"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-2"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-3"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-4"></div>
                        <div class="dino-slot" data-slot-id="bosqueSemejanza-5"></div>
                    </div>
                    <div class="recinto-puntuacion"><span class="punto">2</span>
                    <span class="punto">4</span><span class="punto">8</span>
                    <span class="punto">12</span><span class="punto">18</span>
                    <span class="punto">24</span></div>
                </div>
                <div class="recinto" data-recinto="reySelva" data-zona="boscosa">
                    <h3><?php echo $traductor->traducir('tablero_recinto_rey_selva'); ?> <span class="recinto-icono">🚻</span></h3>
                    <div class="dino-slots-container"><div class="dino-slot" data-slot-id="reySelva-0"></div></div>
                </div>
                <div class="recinto" data-recinto="trioFrondoso" data-zona="boscosa">
                    <h3><?php echo $traductor->traducir('tablero_recinto_trio_frondoso'); ?> <span class="recinto-icono">☕</span></h3>
                    <div class="dino-slots-container"><div class="dino-slot" data-slot-id="trioFrondoso-0"></div>
                    <div class="dino-slot" data-slot-id="trioFrondoso-1"></div>
                    <div class="dino-slot" data-slot-id="trioFrondoso-2"></div>
                </div>
                </div>
                <div class="recinto" data-recinto="pradoDiferencia" data-zona="llanura">
                    <h3><?php echo $traductor->traducir('tablero_recinto_prado_diferencia'); ?> <span class="recinto-icono">🚻</span></h3>
                    <div class="dino-slots-container"><div class="dino-slot" data-slot-id="pradoDiferencia-0"></div>
                    <div class="dino-slot" data-slot-id="pradoDiferencia-1"></div>
                    <div class="dino-slot" data-slot-id="pradoDiferencia-2"></div>
                    <div class="dino-slot" data-slot-id="pradoDiferencia-3"></div>
                    <div class="dino-slot" data-slot-id="pradoDiferencia-4"></div>
                    <div class="dino-slot" data-slot-id="pradoDiferencia-5"></div>
                </div>
                    <div class="recinto-puntuacion"><span class="punto">1</span><span class="punto">3</span>
                    <span class="punto">6</span><span class="punto">10</span><span class="punto">15</span>
                    <span class="punto">21</span>
                </div>
                </div>
                <div class="recinto" data-recinto="praderaAmor" data-zona="llanura">
                    <h3><?php echo $traductor->traducir('tablero_recinto_pradera_amor'); ?> <span class="recinto-icono">☕</span></h3>
                    <div class="dino-slots-container"><div class="dino-slot" data-slot-id="praderaAmor-0"></div>
                    <div class="dino-slot" data-slot-id="praderaAmor-1"></div>
                    <div class="dino-slot" data-slot-id="praderaAmor-2"></div>
                    <div class="dino-slot" data-slot-id="praderaAmor-3"></div>
                    <div class="dino-slot" data-slot-id="praderaAmor-4"></div>
                    <div class="dino-slot" data-slot-id="praderaAmor-5"></div>
                </div>
                </div>
                <div class="recinto" data-recinto="islaSolitaria" data-zona="llanura">
                    <h3><?php echo $traductor->traducir('tablero_recinto_isla_solitaria'); ?> <span class="recinto-estado"></span>
                    <span class="recinto-icono">🚻</span></h3>
                    <div class="dino-slots-container"><div class="dino-slot" data-slot-id="islaSolitaria-0"></div></div>
                </div>
                <div class="recinto" data-recinto="rio" data-zona="neutra">
                    <h3><?php echo $traductor->traducir('tablero_recinto_rio'); ?></h3>
                    <div class="dino-slots-container"><div class="dino-slot" data-slot-id="rio-0"></div>
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

<div id="resultados-modal-overlay" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-close-resultados-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
        <h2 class="font-display"><?php echo $traductor->traducir('tablero_modal_resultados_titulo'); ?></h2>
        <div id="resultados-finales-container" class="modal-scrollable-content"></div>
        <div id="ganador-container" class="ganador"></div>
    </div>
</div>

<div id="historial-modal-overlay" class="modal-overlay">
    <div class="modal-content">
        <button id="btn-cerrar-historial-modal-cruz" class="modal-close-btn">&times;</button>
        <h2 class="modal-titulo"><?php echo $traductor->traducir('tablero_modal_historial_titulo'); ?></h2>
        <div id="historial-body" class="modal-scrollable-content"></div>
        <div class="modal-acciones" style="margin-top: 1.5rem; text-align: center;">
            <button id="btn-menu-cerrar-historial" class="btn-menu"><?php echo $traductor->traducir('tablero_btn_cerrar'); ?></button>
        </div>
    </div>
</div>

<div id="modal-registro-mano-overlay" class="modal-overlay modal-registro-mano">
    <div class="modal-content">
        <button id="btn-cerrar-modal-mano" class="modal-close-btn">&times;</button>
        <h2><?php echo $traductor->traducir('tablero_modal_mano_titulo'); ?></h2>
        <p class="modal-descripcion"><?php echo $traductor->traducir('tablero_modal_mano_subtitulo'); ?></p>
        <div id="selector-dinos-mano" class="modal-scrollable-content"></div>
        <div id="total-mano-container">
            <?php echo $traductor->traducir('tablero_modal_total'); ?> <span id="total-dinos-mano">0</span> / 6
        </div>
        <div class="modal-acciones" style="margin-top: 1.5rem; text-align: center;">
            <button id="btn-confirmar-mano" class="btn-menu" disabled><?php echo $traductor->traducir('tablero_btn_confirmar_mano'); ?></button>
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
<script src="../assets/js/tablero.js"></script>
<script src="../assets/js/tutorial.js"></script>

</body>
</html>
