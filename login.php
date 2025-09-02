<!-- este archivo es lo que ve el usuario, toda la logica esta en login.js, y en backend/login_usuario.php y registro_usuario.php-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro / Inicio de Sesión - Draftosaurus</title>
    <link rel="stylesheet" href="assets/css/style.css">
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

        <a href="index.php" class="btn-menu btn-volver btn-peligro">Volver al Menú</a>

    </main>

    <footer>
    <div class="footer-contenido">
        <p>© 2025 NoxByte. Todos los derechos reservados.</p>
        <p>Instituto Tecnológico de Informática</p>
    </div>
</footer>

    <div id="notificacion-container"></div>

    <script src="assets/js/comunes.js"></script>
    <script src="assets/js/login.js"></script>
</body>
</html>
