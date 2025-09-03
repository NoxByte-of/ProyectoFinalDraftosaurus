<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurar Partida Digital - Draftosaurus - NoxByte</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <header>
        <h1>Draftosaurus</h1>
    </header>

    <main class="main-configuracion">
        <div id="seccion-bienvenida">
            <div class="panel-configuracion">
                <h2>Juego Digital</h2>
                <p>
                    <strong style="display: block; text-align: center; margin-bottom: 0.5rem;">¡Bienvenido al Modo Digital!</strong>
                    Juega una partida completa de Draftosaurus directamente en tu dispositivo. ¡Invita a tus amigos y que comience la aventura!
                </p>
                <div class="botones-configuracion">
                    <a href="#" id="btn-iniciar-configuracion" class="btn-menu">Iniciar Configuración</a>
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

    <footer>
    <div class="footer-contenido">
        <p>© 2025 NoxByte. Todos los derechos reservados.</p>
        <p>Instituto Tecnológico de Informática</p>
    </div>
</footer>
    <script src="../assets/js/comunes.js"></script>
    <script src="../assets/js/configuracion_digital.js"></script>
    
</body>
</html>
