/**
  logica (modo_seguimiento.html).
  
   bienvenida a la configuración.
   nombres de jugadores dinamicos.
   guardado de la configuración en localStorage por ahora despues implementar a backend.
 */

document.addEventListener('DOMContentLoaded', function() {

    const contenedorConfiguracion = document.getElementById('seccion-configuracion-partida');
    
    if (contenedorConfiguracion) {
        const btnIniciarConfiguracion = document.getElementById('btn-iniciar-configuracion');
        const seccionBienvenida = document.getElementById('seccion-bienvenida');
        const selectorJugadores = document.getElementById('numero-jugadores');
        const contenedorCamposNombres = document.getElementById('campos-nombres');
        const btnCrearPartida = document.getElementById('btn-crear-partida');

        // 1 Mostrar el formulario de configuración al hacer clic en el botón de inicio.
        btnIniciarConfiguracion.addEventListener('click', (e) => {
            e.preventDefault();
            seccionBienvenida.classList.add('hidden');
            contenedorConfiguracion.classList.remove('hidden');
        });

        // 2 Generar campos de texto según el número de jugadores seleccionado.
        selectorJugadores.addEventListener('change', function() {
            const cantidad = parseInt(this.value, 10);
            contenedorCamposNombres.innerHTML = ''; 
            
            if (cantidad > 0) {
                for (let i = 1; i <= cantidad; i++) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = `Nombre del Jugador ${i}`;
                    input.className = 'nombre-jugador-input form-control';
                    input.required = true;
                    contenedorCamposNombres.appendChild(input);
                }
            }
            validarNombres(); 
        });

        // 3 Función para habilitar/deshabilitar el botón de crear partida.
        const validarNombres = () => {
            const inputs = contenedorCamposNombres.querySelectorAll('input');
            const todosLlenos = [...inputs].every(input => input.value.trim() !== '');
            btnCrearPartida.disabled = !todosLlenos;
        };

        // 4 Validar en tiempo real mientras el usuario escribe.
        contenedorCamposNombres.addEventListener('input', validarNombres);

        // 5 Guardar la configuración y redirigir al tablero.
        btnCrearPartida.addEventListener('click', () => {
            const nombres = [...contenedorCamposNombres.querySelectorAll('input')].map(input => input.value.trim());
            localStorage.setItem('jugadoresDraftosaurus', JSON.stringify(nombres));
            window.location.href = 'tablero.php';
        });
    }
});
