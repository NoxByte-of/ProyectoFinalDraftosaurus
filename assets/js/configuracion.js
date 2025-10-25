
document.addEventListener('DOMContentLoaded', function() {

    const contenedorConfiguracion = document.getElementById('seccion-configuracion-partida');
    
    if (contenedorConfiguracion) {
        const btnIniciarConfiguracion = document.getElementById('btn-iniciar-configuracion');
        const seccionBienvenida = document.getElementById('seccion-bienvenida');
        const selectorJugadores = document.getElementById('numero-jugadores');
        const contenedorCamposNombres = document.getElementById('campos-nombres');
        const btnCrearPartida = document.getElementById('btn-crear-partida');


        if (btnIniciarConfiguracion && seccionBienvenida) {
            btnIniciarConfiguracion.addEventListener('click', (e) => {
                e.preventDefault();
                seccionBienvenida.classList.add('hidden');
                contenedorConfiguracion.classList.remove('hidden');
            });
        }
    
        const actualizarCamposDeNombre = () => {
            const cantidad = parseInt(selectorJugadores.value, 10);
            contenedorCamposNombres.innerHTML = ''; 
            
            if (cantidad > 0) {
                btnCrearPartida.disabled = false;
                btnCrearPartida.classList.remove('btn-disabled'); 
            } else {
                btnCrearPartida.disabled = true;
                btnCrearPartida.classList.add('btn-disabled');
            }

            for (let i = 1; i <= cantidad; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                const placeholderText = traducirJS('config_placeholder_nombre_jugador').replace('{numero}', i);
                input.placeholder = placeholderText;
                input.className = 'nombre-jugador-input form-control'; 
                contenedorCamposNombres.appendChild(input);
            }
        };

        if (selectorJugadores) {
            selectorJugadores.addEventListener('change', actualizarCamposDeNombre);
            actualizarCamposDeNombre();
        }

        if (btnCrearPartida) {
            btnCrearPartida.addEventListener('click', () => {
                const playerInputElements = contenedorCamposNombres.querySelectorAll('.nombre-jugador-input');
                
                const nombres = Array.from(playerInputElements).map((input, index) => {
                    const nombrePorDefecto = traducirJS('config_placeholder_nombre_defecto').replace('{numero}', index + 1);
                    return input.value.trim() || nombrePorDefecto;
                });

                localStorage.setItem('jugadoresDraftosaurus', JSON.stringify(nombres));
                window.location.href = 'tablero.php';
            });
        }
    }
});
