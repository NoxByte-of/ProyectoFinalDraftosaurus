<!-- este archivo es lo que ve el usuario, toda la logica esta en login.js, y en backend/login_usuario.php y registro_usuario.php-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro / Inicio de Sesión - Draftosaurus</title>
    
    <!-- Nuevas Fuentes y Bootstrap -->
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
    <header>
        <h1>Draftosaurus</h1>
    </header>

    <main class="main-login">
        <div class="panel-login">
            <h2 id="panel-titulo">Crear una Cuenta</h2>
            <p id="panel-descripcion">¡Guarda tu progreso creando una cuenta!</p>
            
            <form id="formulario-registro" novalidate>
                <div class="form-group">
                    <label for="nombre-usuario-registro">Nombre de Usuario</label>
                    <input type="text" id="nombre-usuario-registro" class="form-control" required placeholder="Escribe tu nombre de usuario aquí">
                </div>
                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input type="email" id="email" class="form-control" required placeholder="tucorreo@ejemplo.com">
                </div>
                <div class="form-group">
                    <label for="edad">Edad</label>
            
                    <input type="number" id="edad" class="form-control" required placeholder="Escribe tu edad aquí" min="0">
                </div>
                <div class="form-group">
                    <label for="contrasena-registro">Contraseña</label>
                    <input type="password" id="contrasena-registro" class="form-control" required placeholder="Mínimo 8 caracteres">
                </div>
                <div class="form-group">
                    <label for="confirmar-contrasena">Confirmar Contraseña</label>
                    <input type="password" id="confirmar-contrasena" class="form-control" required placeholder="Repite tu contraseña">
                </div>

                <div class="botones-login">
                    <button type="submit" class="btn-menu">Registrarse</button>
                </div>

                <div class="enlace-cambio">
                    <p>¿Ya tienes una cuenta? <a href="#" id="enlace-login">Inicia Sesión</a></p>
                </div>
            </form>

            <form id="formulario-login" novalidate style="display: none;">
                <div class="form-group">
                    <label for="nombre-usuario-login">Nombre de Usuario</label>
                    <input type="text" id="nombre-usuario-login" class="form-control" required placeholder="Tu nombre de usuario">
                </div>
                <div class="form-group">
                    <label for="contrasena-login">Contraseña</label>
                    <input type="password" id="contrasena-login" class="form-control" required placeholder="Tu contraseña">
                </div>

                <div class="botones-login">
                    <button type="submit" class="btn-menu">Iniciar Sesión</button>
                </div>

                <div class="enlace-cambio">
                    <p>¿No tienes una cuenta? <a href="#" id="enlace-registro">Crea una</a></p>
                </div>
            </form>

        </div>

        <a href="../index.php" class="btn-menu btn-volver btn-peligro">Volver al Menú</a>

    </main>

    <footer class="bg-custom text-center text-lg-start mt-5">
     <div class="container p-4">
       <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>

    <div id="notificacion-container"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="../assets/js/comunes.js"></script>
    <script src="../assets/js/login.js"></script>
</body>
</html>
