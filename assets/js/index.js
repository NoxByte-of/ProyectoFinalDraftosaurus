// assets/js/index.js

class PaginaPrincipal {
    constructor(modalConfirmacion) {
        this.tbodyPartidas = document.getElementById('tbody-partidas-guardadas');
        this.usuarioLogueado = document.body.dataset.usuarioLogueado === 'true';
        this.modalConfirm = modalConfirmacion; 
    }

    inicializar() {
        if (this.usuarioLogueado && this.tbodyPartidas) {
            this.cargarPartidasGuardadas();
            this.tbodyPartidas.addEventListener('click', evento => {
                if (evento.target.matches('.btn-reanudar')) {
                    this.manejarReanudarPartida(evento);
                }
                if (evento.target.matches('.btn-eliminar')) {
                    this.manejarEliminarPartida(evento);
                }
            });
        }
    }

    async cargarPartidasGuardadas() {
        try {
            const respuesta = await fetch('backend/partidas/obtener_partidas.php');
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            const datos = await respuesta.json();

            if (datos.exito) {
                this.renderizarTabla(datos.partidas);
            } else {
                this.mostrarMensajeEnTabla(datos.mensaje || (typeof traducirJS === 'function' ? traducirJS('index_partidas_cargando') : 'Error loading games.'));
            }
        } catch (error) {
            console.error('Error al cargar las partidas guardadas:', error);
            this.mostrarMensajeEnTabla(typeof traducirJS === 'function' ? traducirJS('notif_error_conexion') : 'Connection error.');
        }
    }

    async manejarReanudarPartida(evento) {
        const boton = evento.target;
        const idPartida = boton.dataset.idPartida;
        boton.disabled = true;
        boton.textContent = typeof traducirJS === 'function' ? traducirJS('text_cargando') : 'Loading...';

        try {
            const respuesta = await fetch(`backend/partidas/cargar_partida.php?id=${idPartida}`);
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            const datos = await respuesta.json();

            if (datos.exito) {
                sessionStorage.setItem('partidaParaReanudar', datos.estado_juego);
                window.location.href = 'pages/modo_digital.php';
            } else {
                const mensajeError = datos.mensaje || (typeof traducirJS === 'function' ? traducirJS('notif_historial_no_se_pudo_cargar') : 'Could not load game.');
                window.notificador.mostrar(mensajeError, 'error');
                boton.disabled = false;
                boton.textContent = typeof traducirJS === 'function' ? traducirJS('btn_reanudar') : 'Resume';
            }
        } catch (error) {
            console.error('Error al intentar reanudar la partida:', error);
            window.notificador.mostrar(typeof traducirJS === 'function' ? traducirJS('notif_historial_error_conexion_cargar') : 'Connection error while loading.', 'error');
            boton.disabled = false;
            boton.textContent = typeof traducirJS === 'function' ? traducirJS('btn_reanudar') : 'Resume';
        }
    }

    async manejarEliminarPartida(evento) {
        const boton = evento.target;
        const idPartida = boton.dataset.idPartida;
        const mensajeConfirmacion = typeof traducirJS === 'function' ? traducirJS('modal_confirmar_eliminacion_partida_texto') : 'Are you sure you want to delete this saved game?';

        try {
            await this.modalConfirm.mostrar(mensajeConfirmacion);
            boton.disabled = true;
            boton.textContent = typeof traducirJS === 'function' ? traducirJS('text_eliminando') : 'Deleting...';

            const formData = new FormData();
            formData.append('id_partida', idPartida);

            const respuesta = await fetch('backend/partidas/eliminar_partida.php', {
                method: 'POST',
                body: formData
            });

            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            const datos = await respuesta.json();

            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje || 'Partida eliminada', 'success');
                const fila = boton.closest('tr');
                if (fila) {
                    fila.classList.add('table-row-fade-out');
                    fila.addEventListener('transitionend', () => {
                        fila.remove();
                        if (this.tbodyPartidas && this.tbodyPartidas.children.length === 0) {
                            this.mostrarMensajeEnTabla(typeof traducirJS === 'function' ? traducirJS('index_partidas_vacias') : 'No games in progress.');
                        }
                    }, { once: true }); 
                }
            } else {
                const mensajeError = datos.mensaje || (typeof traducirJS === 'function' ? traducirJS('partida_error_eliminar') : 'Could not delete game.');
                window.notificador.mostrar(mensajeError, 'error');
                boton.disabled = false;
                boton.textContent = typeof traducirJS === 'function' ? traducirJS('btn_eliminar_guardado') : 'Delete Save';
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("cancelada")) {
                 console.log("Eliminación cancelada por el usuario.");
            } else {
                console.error('Error al eliminar la partida guardada:', error);
                window.notificador.mostrar(typeof traducirJS === 'function' ? traducirJS('notif_historial_error_conexion_eliminar') : 'Connection error while deleting.', 'error');
            }
            if (!(error instanceof Error && error.message.includes("cancelada"))) {
                boton.disabled = false;
                boton.textContent = typeof traducirJS === 'function' ? traducirJS('btn_eliminar_guardado') : 'Delete Save';
            }
        }
    }


    renderizarTabla(partidas) {
        if (!this.tbodyPartidas) return;
        this.tbodyPartidas.innerHTML = ''; 

        if (partidas.length === 0) {
            this.mostrarMensajeEnTabla(typeof traducirJS === 'function' ? traducirJS('index_partidas_vacias') : 'No games in progress.');
            return;
        }

        partidas.forEach(partida => {
            const fila = document.createElement('tr');
            const fechaFormateada = this.formatearFecha(partida.fecha_guardado);
            const textoReanudar = typeof traducirJS === 'function' ? traducirJS('btn_reanudar') : 'Resume';
            const textoEliminar = typeof traducirJS === 'function' ? traducirJS('btn_eliminar_guardado') : 'Delete Save';

            fila.innerHTML = `
                <td>${fechaFormateada}</td>
                <td>
                    <button class="btn btn-reanudar" data-id-partida="${partida.id_partida_guardada}">${textoReanudar}</button>
                </td>
                <td>
                    <button class="btn btn-eliminar" data-id-partida="${partida.id_partida_guardada}">${textoEliminar}</button>
                </td>
            `;
            this.tbodyPartidas.appendChild(fila);
        });
    }

    mostrarMensajeEnTabla(mensaje) {
        if (!this.tbodyPartidas) return;
        this.tbodyPartidas.innerHTML = `<tr><td colspan="3" class="text-center">${mensaje}</td></tr>`;
    }

    formatearFecha(fechaMySQL) {
        try {
            const fecha = new Date(fechaMySQL.replace(' ', 'T') + 'Z');
            if (isNaN(fecha)) throw new Error('Fecha inválida');

            const locale = navigator.language || 'es-UY';

            const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };

            const formateadorFecha = new Intl.DateTimeFormat(locale, opcionesFecha);
            const formateadorHora = new Intl.DateTimeFormat(locale, opcionesHora);

            return `${formateadorFecha.format(fecha)} - ${formateadorHora.format(fecha)}`;
        } catch (error) {
            console.error("Error formateando fecha:", fechaMySQL, error);
            return fechaMySQL; 
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {

    const modalConfirmacion = new ModalConfirmacion('confirmacion-modal-overlay');

    const paginaPrincipal = new PaginaPrincipal(modalConfirmacion);
    paginaPrincipal.inicializar();
});
