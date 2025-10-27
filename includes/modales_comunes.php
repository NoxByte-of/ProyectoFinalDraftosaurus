<?php

if (!isset($traductor)) {

    $idioma_manager_path = __DIR__ . '/../backend/config/idioma_manager.php';
    $traductor_path = __DIR__ . '/../backend/config/Traductor.php';

    if (file_exists($idioma_manager_path) && file_exists($traductor_path)) {
        require_once $idioma_manager_path;
        require_once $traductor_path;
        $traductor = new Traductor($idioma_seleccionado);
    } else {
        $traductor = new class {
            public function traducir($clave) { return $clave; }
        };
        error_log("Advertencia: No se pudo inicializar el Traductor en modales_comunes.php");
    }
}

$basePathPrefix = (strpos($_SERVER['SCRIPT_NAME'], '/pages/') !== false) ? '../' : '';

?>

<div id="quienes-somos-modal-overlay" class="modal-overlay">
    <div class="modal-content card-parchment">
        <button id="btn-close-quienes-somos-modal" class="modal-close-btn" aria-label="<?php echo $traductor->traducir('tablero_btn_cerrar'); ?>">&times;</button>
        <h2 class="font-display"><?php echo $traductor->traducir('modal_sobre_noxbyte_titulo'); ?></h2>
        <div class="logo-container">
            <img src="<?php echo $basePathPrefix; ?>assets/imagenes/logonoxbyte.png" alt="Logo de NoxByte" class="quienes-somos-logo">
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
        <button id="tutorial-close-btn" class="tutorial__boton-cerrar" aria-label="<?php echo $traductor->traducir('tablero_btn_cerrar'); ?> Tutorial">&times;</button>
        <div class="tutorial__area-contenido">
            <div id="welcome-screen-tutorial" class="tutorial__pantalla">
                <h3><?php echo $traductor->traducir('tutorial_bienvenida_titulo'); ?></h3>
                <p><?php echo $traductor->traducir('tutorial_bienvenida_texto'); ?></p>
                <button id="tutorial-start-btn" class="btn-menu"><?php echo $traductor->traducir('tutorial_bienvenida_boton'); ?></button>
            </div>
            <div class="tutorial__vista-juego oculta">
                <div class="tutorial__tablero-contenedor">
                     <img src="<?php echo $basePathPrefix; ?>assets/imagenes/tablerodraftosaurus.png" alt="Tablero de Draftosaurus" class="tutorial__imagen-tablero">
                    <div id="tutorial-slots-container" class="tutorial__slots-superpuestos">
                        </div>
                </div>
                <div class="tutorial__barra-lateral">
                    <section id="dice-area-tutorial" class="tutorial__panel-lateral">
                        <h3><?php echo $traductor->traducir('tutorial_dado_restriccion'); ?></h3>
                        <div class="tutorial__contenedor-dado">
                            <div id="dice-tutorial" class="tutorial__dado">
                                <div class="tutorial__dado-cara frontal"><img src="<?php echo $basePathPrefix; ?>assets/imagenes/boscoso.png" alt="Cara Bosque"></div>
                                <div class="tutorial__dado-cara trasera"><img src="<?php echo $basePathPrefix; ?>assets/imagenes/banos.png" alt="Cara Baños"></div>
                                <div class="tutorial__dado-cara derecha"><img src="<?php echo $basePathPrefix; ?>assets/imagenes/llanura.png" alt="Cara Pradera"></div>
                                <div class="tutorial__dado-cara izquierda"><img src="<?php echo $basePathPrefix; ?>assets/imagenes/cafe.png" alt="Cara Cafetería"></div>
                                <div class="tutorial__dado-cara superior"><img src="<?php echo $basePathPrefix; ?>assets/imagenes/recintovacio.png" alt="Cara Recinto Vacío"></div>
                                <div class="tutorial__dado-cara inferior"><img src="<?php echo $basePathPrefix; ?>assets/imagenes/trex.png" alt="Cara Sin T-Rex"></div>
                            </div>
                        </div>
                    </section>
                    <section id="player-hand-area" class="tutorial__panel-lateral">
                        <h3><?php echo $traductor->traducir('tutorial_tu_mano'); ?></h3>
                        <div id="player-hand-tutorial" class="tutorial__mano-dinosaurios">
                             </div>
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
