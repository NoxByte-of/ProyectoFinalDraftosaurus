document.addEventListener('DOMContentLoaded', function() {
    
    //  Logica Configuración de Partida 
    const seccionConfiguracion = document.getElementById('seccion-configuracion-partida');
    if (seccionConfiguracion) {
        const btnIniciarConfiguracion = document.getElementById('btn-iniciar-configuracion');
        const seccionBienvenida = document.getElementById('seccion-bienvenida');
        const selectorJugadores = document.getElementById('numero-jugadores');
        const contenedorCamposNombres = document.getElementById('campos-nombres');
        const btnCrearPartida = document.getElementById('btn-crear-partida');

        if (btnIniciarConfiguracion && seccionBienvenida) {
            btnIniciarConfiguracion.addEventListener('click', (e) => {
                e.preventDefault();

                const usuarioLogueado = document.body.dataset.usuarioLogueado === 'true';

                if (usuarioLogueado) {
                    seccionBienvenida.classList.add('hidden');
                    seccionConfiguracion.classList.remove('hidden');
                } else {
                    if (window.mostrarNotificacion) {
                        window.mostrarNotificacion('Debes estar logeado para Jugar', 'error');
                    } else {
                        alert('Debes estar logeado para Jugar');
                    }
                }
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
                input.placeholder = `Nombre del Jugador ${i}`;
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
                const playerCount = parseInt(selectorJugadores.value, 10);
                const playerInputElements = contenedorCamposNombres.querySelectorAll('.nombre-jugador-input');
                
        
                const playerNames = Array.from(playerInputElements).map((input, index) => {
                    return input.value.trim() || `Jugador ${index + 1}`;
                });

                const gameConfig = {
                    playerCount: playerCount,
                    playerNames: playerNames
                };

                sessionStorage.setItem('draftosaurusGameConfig', JSON.stringify(gameConfig));
                window.location.href = 'modo_digital.php';
            });
        }
    }
});
