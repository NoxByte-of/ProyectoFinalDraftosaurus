<?php
require_once '../backend/config/idioma_manager.php';
require_once '../backend/config/Traductor.php';
require_once '../backend/config/Database.php';
require_once '../backend/models/Usuario.php';

$traductor = new Traductor($idioma_seleccionado);

if (!isset($_SESSION['id_usuario'])) {
    header('Location: login.php?form=login');
    exit();
}

$db = Database::obtenerInstancia()->obtenerConexion();
$usuario_modelo = new Usuario($db);
$datos_usuario = $usuario_modelo->buscarPorId($_SESSION['id_usuario']);
$idioma_preferido_actual = $datos_usuario ? $datos_usuario['idioma_preferido'] : $idioma_seleccionado;

?>

<!DOCTYPE html>
<html lang="<?php echo $traductor->obtenerIdiomaActual(); ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $traductor->traducir('page_title_ajustes'); ?></title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="../assets/css/style.css">


</head>
<body data-usuario-logueado="true">

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

<main class="main-ajustes">
    <div class="panel-ajustes">
        <h2><?php echo $traductor->traducir('ajustes_titulo'); ?></h2>
        <p><?php echo $traductor->traducir('ajustes_subtitulo'); ?></p>
        <div class="menu-ajustes">
            <button class="btn-ajuste" id="btn-abrir-modal-nombre"><?php echo $traductor->traducir('ajustes_btn_cambiar_nombre'); ?></button>
            <button class="btn-ajuste" id="btn-abrir-modal-contrasena"><?php echo $traductor->traducir('ajustes_btn_cambiar_contrasena'); ?></button>
            <button class="btn-ajuste" id="btn-abrir-modal-idioma"><?php echo $traductor->traducir('ajustes_btn_seleccionar_idioma'); ?></button>
            <button onclick="window.location.href='../backend/Registro_y_Login/logout.php'" class="btn-ajuste btn-ajuste-peligro"><?php echo $traductor->traducir('ajustes_btn_cerrar_sesion'); ?></button>
            <button class="btn-ajuste btn-ajuste-peligro" id="btn-eliminar-cuenta"><?php echo $traductor->traducir('ajustes_btn_eliminar_cuenta'); ?></button>
        </div>
    </div>
</main>


 <footer class="bg-custom text-center text-lg-start mt-auto">
     <div class="container p-4">
       <p class="mb-1">© <?php echo date("Y"); ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

<div id="modal-cambiar-nombre" class="modal-overlay">
    <div class="modal-content">
        <button class="modal-close-btn" data-modal-id="modal-cambiar-nombre">&times;</button>
        <h2><?php echo $traductor->traducir('ajustes_modal_nombre_titulo'); ?></h2>
        <p class="descripcion-panel"><?php echo $traductor->traducir('ajustes_modal_nombre_subtitulo'); ?></p>
        <form id="form-cambiar-nombre" novalidate>
            <input type="text" id="nombre_usuario_actual" name="nombre_usuario_actual" class="form-control" required placeholder="<?php echo $traductor->traducir('ajustes_placeholder_nombre_actual'); ?>">
            <input type="text" id="nuevo_nombre_usuario" name="nuevo_nombre_usuario" class="form-control" required placeholder="<?php echo $traductor->traducir('ajustes_placeholder_nombre_nuevo'); ?>">
            <div class="modal-acciones">
                <button type="submit" class="btn"><?php echo $traductor->traducir('ajustes_boton_aceptar'); ?></button>
            </div>
        </form>
    </div>
</div>

<div id="modal-cambiar-contrasena" class="modal-overlay">
    <div class="modal-content">
        <button class="modal-close-btn" data-modal-id="modal-cambiar-contrasena">&times;</button>
        <h2><?php echo $traductor->traducir('ajustes_modal_contrasena_titulo'); ?></h2>
        <p class="descripcion-panel"><?php echo $traductor->traducir('ajustes_modal_contrasena_subtitulo'); ?></p>
        <form id="form-cambiar-contrasena" novalidate>
            <input type="password" id="contrasena_actual" name="contrasena_actual" class="form-control" required placeholder="<?php echo $traductor->traducir('ajustes_placeholder_contrasena_actual'); ?>">
            <input type="password" id="nueva_contrasena" name="nueva_contrasena" class="form-control" required placeholder="<?php echo $traductor->traducir('ajustes_placeholder_contrasena_nueva'); ?>">
            <input type="password" id="confirmar_nueva_contrasena" name="confirmar_nueva_contrasena" class="form-control" required placeholder="<?php echo $traductor->traducir('ajustes_placeholder_contrasena_confirmar'); ?>">
            <div class="modal-acciones">
                <button type="submit" class="btn"><?php echo $traductor->traducir('ajustes_boton_aceptar'); ?></button>
            </div>
        </form>
    </div>
</div>

<div id="modal-cambiar-idioma" class="modal-overlay">
    <div class="modal-content">
        <button class="modal-close-btn" data-modal-id="modal-cambiar-idioma">&times;</button>
        <h2><?php echo $traductor->traducir('ajustes_modal_idioma_titulo'); ?></h2>
        <p class="descripcion-panel"><?php echo $traductor->traducir('ajustes_modal_idioma_subtitulo'); ?></p>
        <form id="form-cambiar-idioma" novalidate>
            <div class="modal-idioma-opciones">
                <label class="modal-idioma-opcion">
                    <input type="radio" name="idioma_preferido" value="es" <?php echo ($idioma_preferido_actual === 'es') ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span><?php echo $traductor->traducir('lang_es'); ?></span>
                </label>
                <label class="modal-idioma-opcion">
                    <input type="radio" name="idioma_preferido" value="en" <?php echo ($idioma_preferido_actual === 'en') ? 'checked' : ''; ?>>
                    <span class="checkmark"></span>
                    <span><?php echo $traductor->traducir('lang_en'); ?></span>
                </label>
            </div>
            <div class="modal-acciones">
                <button type="submit" class="btn"><?php echo $traductor->traducir('ajustes_boton_guardar'); ?></button>
            </div>
        </form>
    </div>
</div>

<div id="confirmacion-eliminar-cuenta-modal" class="modal-overlay">
    <div class="modal-content card-parchment">
        <h2 class="font-display"><?php echo $traductor->traducir('ajustes_modal_eliminar_titulo'); ?></h2>
        <p class="descripcion-panel" style="font-size: 1.2rem; margin-top: 1rem;">
            <?php echo $traductor->traducir('ajustes_modal_eliminar_texto'); ?>
        </p>
        <div class="modal-acciones">
            <button id="btn-cancelar-eliminacion-cuenta" class="btn"><?php echo $traductor->traducir('ajustes_boton_cancelar'); ?></button>
            <button id="btn-confirmar-eliminacion-cuenta" class="btn btn-eliminar"><?php echo $traductor->traducir('ajustes_boton_eliminar'); ?></button>
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
<script src="../assets/js/ajustes.js"></script>
<script src="../assets/js/tutorial.js"></script>

</body>
</html>

