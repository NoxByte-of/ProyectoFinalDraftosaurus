/**
  Lógica para la configuración del modo seguimiento.
  - Genera campos de nombre de jugador dinámicamente.
  - Permite crear la partida incluso con campos vacíos, asignando nombres por defecto.
  - Lógica unificada con la configuración del modo digital para consistencia.
 */
document.addEventListener('DOMContentLoaded', function() {

    const contenedorConfiguracion = document.getElementById('seccion-configuracion-partida');
    
    if (contenedorConfiguracion) {
        const btnIniciarConfiguracion = document.getElementById('btn-iniciar-configuracion');
        const seccionBienvenida = document.getElementById('seccion-bienvenida');
        const selectorJugadores = document.getElementById('numero-jugadores');
        const contenedorCamposNombres = document.getElementById('campos-nombres');
        const btnCrearPartida = document.getElementById('btn-crear-partida');

        // 1. Mostrar el formulario de configuración al hacer clic en el botón de inicio.
        if (btnIniciarConfiguracion && seccionBienvenida) {
            btnIniciarConfiguracion.addEventListener('click', (e) => {
                e.preventDefault();
                seccionBienvenida.classList.add('hidden');
                contenedorConfiguracion.classList.remove('hidden');
            });
        }
        
        // 2. Función para crear los campos para los nombres de los jugadores
        const actualizarCamposDeNombre = () => {
            const cantidad = parseInt(selectorJugadores.value, 10);
            contenedorCamposNombres.innerHTML = ''; 
            
            // Habilita o deshabilita el botón de crear partida según si se eligió un número de jugadores.
            if (cantidad > 0) {
                btnCrearPartida.disabled = false;
                btnCrearPartida.classList.remove('btn-disabled'); // Asegura que no tenga la clase de deshabilitado
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

        // 3. Añadir el listener al selector de jugadores y llamar a la función una vez para inicializar.
        if (selectorJugadores) {
            selectorJugadores.addEventListener('change', actualizarCamposDeNombre);
            actualizarCamposDeNombre();
        }

        // 4. Guardar la configuración y redirigir al tablero.
        if (btnCrearPartida) {
            btnCrearPartida.addEventListener('click', () => {
                const playerInputElements = contenedorCamposNombres.querySelectorAll('.nombre-jugador-input');
                
                // Mapea los nombres. Si un input está vacío, le asigna un nombre por defecto.
                const nombres = Array.from(playerInputElements).map((input, index) => {
                    return input.value.trim() || `Jugador ${index + 1}`;
                });

                // Guarda los nombres en localStorage para usarlos en el tablero.php
                localStorage.setItem('jugadoresDraftosaurus', JSON.stringify(nombres));
                window.location.href = 'tablero.php';
            });
        }
    }
});

