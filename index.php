<?php
require_once 'backend/config/idioma_manager.php';
require_once 'backend/config/Traductor.php';
$traductor = new Traductor($idioma_seleccionado);
?>
<!DOCTYPE html>
<html lang="<?php echo $traductor->obtenerIdiomaActual(); ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $traductor->traducir('page_title_index'); ?></title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="assets/css/style.css">

</head>

<body data-usuario-logueado="<?php echo isset($_SESSION['nombre_usuario']) ? 'true' : 'false'; ?>">

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
                <a class="navbar-brand" href="index.php">
                    <img src="assets/imagenes/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">
                </a>
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php"><?php echo $traductor->traducir('nav_inicio'); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pages/modo_seguimiento.php"><?php echo $traductor->traducir('nav_seguimiento'); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="pages/modo_juego_digital.php"><?php echo $traductor->traducir('nav_juego'); ?></a>
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
                                <a class="nav-link btn-login" href="pages/admin.php"><?php echo $traductor->traducir('nav_panel_admin'); ?></a>
                            </li>
                        <?php endif; ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link btn-login" href="#" role="button">
                                <?php echo $traductor->traducir('nav_mi_cuenta'); ?>
                            </a>
                            <div class="dropdown-content">
                                <a href="pages/historial.php"><?php echo $traductor->traducir('nav_ver_historial'); ?></a>
                                <a href="pages/ajustes.php"><?php echo $traductor->traducir('nav_ajustes'); ?></a>
                                <a href="backend/Registro y Login/logout.php"><?php echo $traductor->traducir('nav_cerrar_sesion'); ?></a>
                            </div>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="pages/login.php?form=register"><?php echo $traductor->traducir('nav_registrarse'); ?></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link btn-login" href="pages/login.php?form=login"><?php echo $traductor->traducir('nav_iniciar_sesion'); ?></a>
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
        <h2><?php echo $traductor->traducir('index_jugar_titulo'); ?></h2>
        <p><?php echo $traductor->traducir('index_jugar_subtitulo'); ?></p>
        <a href="pages/modo_juego_digital.php"><button class="btn"><?php echo $traductor->traducir('index_jugar_boton'); ?></button></a>
      </div>
      <div class="col-md-6 text-center">
        <h2><?php echo $traductor->traducir('index_registrar_titulo'); ?></h2>
        <p><?php echo $traductor->traducir('index_registrar_subtitulo'); ?></p>
        <a href="pages/modo_seguimiento.php"><button class="btn"><?php echo $traductor->traducir('index_registrar_boton'); ?></button></a>
      </div>
    </div>

    <?php if (isset($_SESSION['nombre_usuario'])): ?>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <div class="mx-auto" style="max-width: 900px;">
            <h2 class="text-center"><?php echo $traductor->traducir('index_partidas_progreso'); ?></h2><br>
            <table class="table table-striped table-bordered custom-table">
              <thead>
                <tr>
                  <th><?php echo $traductor->traducir('index_tabla_fecha'); ?></th>
                  <th><?php echo $traductor->traducir('index_tabla_accion'); ?></th>
                  <th><?php echo $traductor->traducir('index_tabla_eliminar'); ?></th>
                </tr>
              </thead>
              <tbody id="tbody-partidas-guardadas">
                <tr>
                  <td colspan="3" class="text-center"><?php echo $traductor->traducir('index_partidas_cargando'); ?></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <?php endif; ?>
  </div>
</section>

<section class="seccion-informacion py-5">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h2><?php echo $traductor->traducir('index_como_jugar_titulo'); ?></h2>
        <p><?php echo $traductor->traducir('index_como_jugar_texto'); ?></p>
      </div>
      <div class="col-md-6 text-center bg-transparent">
        <h2><?php echo $traductor->traducir('index_aprende_jugar_titulo'); ?></h2><br>
        <button id="btn-abrir-tutorial-main" class="btn"><?php echo $traductor->traducir('index_aprende_jugar_boton'); ?></button>
    </div>
  </div>
</section>
</main>

 <footer class="bg-custom text-center text-lg-start">
     <div class="container p-4">
       <p class="mb-1"><?php echo str_replace('{año}', date("Y"), $traductor->traducir('footer_copyright')); ?></p>
       <p class="mb-0"><?php echo $traductor->traducir('footer_contacto'); ?> <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

<div id="quienes-somos-modal-overlay" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-close-quienes-somos-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
        <h2 class="font-display"><?php echo $traductor->traducir('modal_sobre_noxbyte_titulo'); ?></h2>
        <div class="logo-container">
            <img src="assets/imagenes/logonoxbyte.png" alt="Logo de NoxByte" class="quienes-somos-logo">
        </div>
        <p style="text-align: center; margin-bottom: 1rem;">
             <?php echo $traductor->traducir('modal_sobre_noxbyte_contacto'); ?> <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a>
        </p>
        <div class="modal-scrollable-content">
            <p><?php echo $traductor->traducir('modal_sobre_noxbyte_texto1'); ?></p>
            <p><?php echo $traductor->traducir('modal_sobre_noxbyte_texto2'); ?></p>
            <p><?php echo $traductor->traducir('modal_sobre_noxbyte_texto3'); ?></p>
            <p class="modal-thanks"><?php echo $traductor->traducir('modal_sobre_noxbyte_gracias'); ?></p>
        </div>
    </div>
</div>

<div id="tutorial-modal" class="tutorial__superposicion" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo">
    <div id="tutorial-container" class="tutorial__contenedor">
        <h2 id="tutorial-titulo" class="tutorial__encabezado"><?php echo $traductor->traducir('tutorial_titulo'); ?></h2>
        <button id="tutorial-close-btn" class="tutorial__boton-cerrar" aria-label="Cerrar Tutorial">&times;</button>
        <div class="tutorial__area-contenido">
            <div id="welcome-screen-tutorial" class="tutorial__pantalla">
                <h3><?php echo $traductor->traducir('tutorial_bienvenida_titulo'); ?></h3>
                <p><?php echo $traductor->traducir('tutorial_bienvenida_texto'); ?></p>
                <button id="tutorial-start-btn" class="btn-menu"><?php echo $traductor->traducir('tutorial_bienvenida_boton'); ?></button>
            </div>
            <div class="tutorial__vista-juego oculta">
                <div class="tutorial__tablero-contenedor">
                    <img src="assets/imagenes/tablerodraftosaurus.png" alt="Tablero de Draftosaurus" class="tutorial__imagen-tablero">
                    <div id="tutorial-slots-container" class="tutorial__slots-superpuestos"></div>
                </div>
                <div class="tutorial__barra-lateral">
                    <section id="dice-area-tutorial" class="tutorial__panel-lateral">
                        <h3><?php echo $traductor->traducir('tutorial_dado_restriccion'); ?></h3>
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
                    <section id="player-hand-area" class="tutorial__panel-lateral">
                        <h3><?php echo $traductor->traducir('tutorial_tu_mano'); ?></h3>
                        <div id="player-hand-tutorial" class="tutorial__mano-dinosaurios"></div>
                    </section>
                </div>
            </div>
            <div id="end-screen-tutorial" class="tutorial__pantalla oculta">
                 <h3><?php echo $traductor->traducir('tutorial_final_titulo'); ?></h3>
                 <p><?php echo $traductor->traducir('tutorial_final_texto'); ?></p>
                 <button id="tutorial-close-btn-end" class="tutorial__boton"><?php echo $traductor->traducir('tutorial_final_boton'); ?></button>
            </div>
        </div>
    </div>
</div>
<div id="notificacion-container-tutorial"></div>
<div id="highlight-overlay-tutorial" class="tutorial__caja-resaltado" style="display: none;"></div>
<div id="highlight-overlay-hand-tutorial" class="tutorial__caja-resaltado" style="display: none;"></div>
<div id="tutorial-tooltip" class="tutorial__tooltip" style="display: none;">
    <p id="tooltip-content"></p>
    <div class="tutorial__tooltip-navegacion">
        <button id="tooltip-next-btn" class="tutorial__boton"><?php echo $traductor->traducir('tutorial_boton_entendido'); ?></button>
    </div>
</div>

<div id="confirmacion-modal-overlay" class="modal-overlay">
    <div class="modal-content card-parchment">
        <h2 class="font-display"><?php echo $traductor->traducir('modal_confirm_titulo'); ?></h2>
        <p id="confirmacion-modal-texto" class="descripcion-panel" style="font-size: 1.2rem; margin-top: 1rem;"></p>
        <div class="modal-acciones">
            <button id="btn-cancelar-eliminacion" class="btn"><?php echo $traductor->traducir('modal_confirm_cancelar'); ?></button>
            <button id="btn-confirmar-eliminacion" class="btn btn-eliminar"><?php echo $traductor->traducir('modal_confirm_aceptar'); ?></button>
        </div>
    </div>
</div>

<div id="notificacion-container"></div>

<script>
    window.translations = <?php echo json_encode($traductor->obtenerTodosLosTextos()); ?>;
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="assets/js/comunes.js"></script>
<script src="assets/js/idioma.js"></script>
<script src="assets/js/traductor.js"></script>
<script src="assets/js/index.js"></script>
<script src="assets/js/tutorial.js"></script>

</body>
</html>

