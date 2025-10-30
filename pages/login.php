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
<title><?php echo $traductor->traducir('page_title_login'); ?> - Draftosaurus</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="../assets/css/style.css">


</head>
<body class="body-login">
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

<main class="main-login">
    <div class="panel-login">
        <h2 id="panel-titulo"><?php echo $traductor->traducir('login_crear_cuenta_titulo'); ?></h2>
        <p id="panel-descripcion" class="descripcion-panel"><?php echo $traductor->traducir('login_crear_cuenta_subtitulo'); ?></p>

        <form id="formulario-registro" novalidate>
            <input type="text" id="nombre-usuario-registro" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_usuario'); ?>">
            <input type="email" id="email" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_email'); ?>">
            <input type="number" id="edad" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_edad'); ?>" min="0">
            <input type="password" id="contrasena-registro" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_contrasena'); ?>">
            <input type="password" id="confirmar-contrasena" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_confirmar_contrasena'); ?>">

            <div class="botones-login">
                <button type="submit" class="btn-formulario"><?php echo $traductor->traducir('login_boton_registrarse'); ?></button>
            </div>

            <div class="enlace-cambio">
                <p><?php echo $traductor->traducir('login_pregunta_tienes_cuenta'); ?> <a href="#" id="enlace-login"><?php echo $traductor->traducir('login_enlace_inicia_sesion'); ?></a></p>
            </div>
        </form>

        <form id="formulario-login" novalidate style="display: none;">
            <input type="text" id="nombre-usuario-login" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_usuario'); ?>">
            <input type="password" id="contrasena-login" class="form-control" required placeholder="<?php echo $traductor->traducir('login_placeholder_contrasena'); ?>">

            <div class="botones-login">
                <button type="submit" class="btn-formulario"><?php echo $traductor->traducir('login_boton_iniciar_sesion'); ?></button>
            </div>

            <div class="enlace-cambio">
                <p><?php echo $traductor->traducir('login_pregunta_no_tienes_cuenta'); ?> <a href="#" id="enlace-registro"><?php echo $traductor->traducir('login_enlace_crea_una'); ?></a></p>
            </div>
        </form>
    </div>

    <a href="../index.php" class="btn-volver"><?php echo $traductor->traducir('login_boton_volver'); ?></a>
</main>



<?php require_once '../includes/modales_comunes.php'; ?>

<script>
    window.translations = <?php echo json_encode($traductor->obtenerTodosLosTextos()); ?>;
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="../assets/js/comunes.js"></script>
<script src="../assets/js/idioma.js"></script>
<script src="../assets/js/traductor.js"></script>
<script src="../assets/js/login.js"></script>
<script src="../assets/js/tutorial.js"></script>

</body>
</html>

