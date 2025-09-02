<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenid@ a Draftosaurus - NoxByte</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="body-centrado">
    
     
     <div class="contenedor-menu-principal"></div>
    <header class="encabezado-principal">
            <h1>Draftosaurus</h1>
           <!-- <img src="assets/imagenes/mascota.png" alt="Mascota NoxByte" id="mascota-bienvenida">-->
        </header>
    
     <main class="menu-navegacion">
            <nav>
                <a href="modo_juego_digital.php" class="btn-menu">
                    <span class="texto-boton">¡Jugar Draftosaurus!</span>
                </a>
                <a href="modo_seguimiento.php" class="btn-menu">
                    <span class="texto-boton">Modo Seguimiento</span>
                </a>
                <a href="partidas_guardadas.php" class="btn-menu">
                    <span class="texto-boton">Partidas Guardadas</span>
                </a>
                <button id="btn-abrir-tutorial" class="btn-menu">
                    <span class="texto-boton">Tutorial</span>
                </button>     
                <a href="login.php" class="btn-menu">
                    <span class="texto-boton">Iniciar Sesión</span>
                </a>    
                <button id="btn-quienes-somos" class="btn-menu">
                    <span class="texto-boton">Sobre NoxByte</span>
                </button>
            </nav>
        </main>
    
    <footer>
    <div class="footer-contenido">
        <p>© 2025 NoxByte. Todos los derechos reservados.</p>
        <p>Instituto Tecnológico de Informática</p>
    </div>
</footer>

   <div id="quienes-somos-modal-overlay" class="modal-overlay">
        <div class="modal-content card-parchment">
            <button id="btn-close-quienes-somos-modal" class="modal-close-btn" aria-label="Cerrar ventana modal">&times;</button>
            <h2 class="font-display">Sobre NoxByte</h2>
            
            <div class="logo-container">
                <img src="assets/imagenes/logonoxbyte.png" alt="Logo de Ctrl+Zaurio" class="quienes-somos-logo">
            </div>
            <div class="modal-scrollable-content">
    <p class="modal-slogan">📧 Contacto: noxbyte.of@gmail.com</p>

    <p>Somos <strong>NoxByte</strong>, una empresa de desarrollo de software formada por los estudiantes del Instituto Tecnológico de Informática(ITI) Fabricio Figueroa, Bruno Mendez, Georgina Madera, Mateo Suarez y Giuliana Arregui.  </p>
    <p>Nuestra misión es aplicar los conocimientos sobre la informática para desarrollar proyectos creativos y funcionales mediante el trabajo en equipo, el aprendizaje continuo y en enfrentar cada desafío que se nos proponga, tal como nos enseño el Instituto.</p>
    <p>Este proyecto sobre "Draftosaurus", es un reflejo de nuestro compromiso en la informática y el entretenimiento, otorgando un proyecto de estrategia visualmente atractivo para jugadores como tú.</p>
    <p class="modal-thanks"><em>Gracias por explorar nuestro trabajo. ¡Esperamos que disfrutes la aplicación!</em></p>
</div>
        </div>
    </div>

    
    <div id="tutorial-modal" class="tutorial__superposicion" role="dialog" aria-modal="true" aria-labelledby="tutorial-titulo">
        <div id="tutorial-container" class="tutorial__contenedor">
            <h2 id="tutorial-titulo" class="tutorial__encabezado">Guía Del Juego</h2>
            <button id="tutorial-close-btn" class="tutorial__boton-cerrar" aria-label="Cerrar Tutorial">&times;</button>
    
            <div class="tutorial__area-contenido">
                
                <div id="welcome-screen-tutorial" class="tutorial__pantalla">
                    <h3>¡Bienvenido al Tutorial!</h3>
                    <p>¿Es tu primer dia? No te preocupes, ¡Esto te ayudará a ser todo un experto! </p>
                    <button id="tutorial-start-btn" class="btn-menu">Iniciar Tutorial</button>
                </div>
    
                <div class="tutorial__vista-juego oculta">
                    <div class="tutorial__tablero-contenedor">
                        <img src="assets/imagenes/tablerodraftosaurus.png" alt="Tablero de Draftosaurus" class="tutorial__imagen-tablero">
                        <div id="tutorial-slots-container" class="tutorial__slots-superpuestos">
                        </div>
                    </div>
                    <div class="tutorial__barra-lateral">
                        <section id="player-hand-area" class="tutorial__panel-lateral">
                            <h3>Tu Mano</h3>
                            <div id="player-hand-tutorial" class="tutorial__mano-dinosaurios"></div>
                        </section>
                        <section id="dice-area-tutorial" class="tutorial__panel-lateral">
                            <h3>Dado de Restricción</h3>
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
                    </div>
                </div>
    
                <div id="end-screen-tutorial" class="tutorial__pantalla oculta">
                     <h3>¡Tutorial Completado!</h3>
                     <p>Has aprendido los fundamentos para dirigir tu parque. ¡Bienvenido a Draftosaurus!</p>
                     <button id="tutorial-close-btn-end" class="tutorial__boton">Cerrar Tutorial</button>
                </div>
            </div>
        </div>
    
        <div id="highlight-overlay-tutorial" class="tutorial__caja-resaltado" style="display: none;"></div>
        <div id="highlight-overlay-hand-tutorial" class="tutorial__caja-resaltado" style="display: none;"></div>

        <div id="tutorial-tooltip" class="tutorial__tooltip" style="display: none;">
            <p id="tooltip-content"></p>
            <div class="tutorial__tooltip-navegacion">
                <button id="tooltip-next-btn" class="tutorial__boton">Entendido</button>
            </div>
        </div>
    </div>


    <script src="assets/js/comunes.js"></script>
    <script src="assets/js/index.js"></script>
    <script src="assets/js/tutorial.js"></script>

</body>
</html>
