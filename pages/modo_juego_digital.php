<?php
session_start();
?>
<!DOCTYPE html>

<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Configurar Partida Digital - Draftosaurus - NoxByte</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

<link rel="stylesheet" href="../assets/css/style.css">

</head>
<body data-usuario-logueado="<?php echo isset($_SESSION['nombre_usuario']) ? 'true' : 'false'; ?>">
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

<main class="main-configuracion flex-grow-1">
    <div id="seccion-bienvenida">
        <div class="panel-configuracion">
            <h2>Juego Digital</h2>
            <p>
                <strong style="display: block; text-align: center; margin-bottom: 0.5rem;">¡Bienvenido al Modo Digital!</strong>
                Juega una partida completa de Draftosaurus directamente en tu dispositivo. ¡Invita a tus amigos y que comience la aventura!
            </p>
            <div class="botones-configuracion">
                <a href="#" id="btn-iniciar-configuracion" class="btn-menu">Iniciar</a>
                <a href="../index.php" class="btn-menu">Volver al Menú</a>
            </div>
        </div>
    </div>

    <section id="seccion-configuracion-partida" class="panel-configuracion hidden">
        <h2>Configuración</h2>
        <div class="form-group">
            <label for="numero-jugadores">1. Selecciona el número de jugadores:</label>
            <select id="numero-jugadores" class="form-control">
                <option value="0" selected disabled>Elige una opción...</option>
                <option value="2">2 Jugadores</option>
                <option value="3">3 Jugadores</option>
                <option value="4">4 Jugadores</option>
                <option value="5">5 Jugadores</option>
            </select>
        </div>

        <div id="nombres-jugadores-container" class="form-group">
            <label>2. Introduce los nombres:</label>
            <div id="campos-nombres"></div>
        </div>

        <div class="botones-configuracion">
            <button id="btn-crear-partida" class="btn-menu" disabled>¡Crear Partida!</button>
        </div>
    </section>

</main>

 <footer class="bg-custom text-center text-lg-start mt-auto">
     <div class="container p-4">
       <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

<div id="notificacion-container"></div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="../assets/js/comunes.js"></script>
<script src="../assets/js/configuracion_digital.js"></script>

</body>
</html>

