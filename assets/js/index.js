
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
                this.mostrarMensajeEnTabla(datos.mensaje || traducirJS('index_partidas_cargando'));
            }
        } catch (error) {
            console.error('Error al cargar las partidas guardadas:', error);
            this.mostrarMensajeEnTabla(traducirJS('notif_error_conexion'));
        }
    }

    async manejarReanudarPartida(evento) {
        const boton = evento.target;
        const idPartida = boton.dataset.idPartida;
        boton.disabled = true;
        boton.textContent = traducirJS('text_cargando');

        try {
            const respuesta = await fetch(`backend/partidas/cargar_partida.php?id=${idPartida}`);
            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            const datos = await respuesta.json();

            if (datos.exito) {
                sessionStorage.setItem('partidaParaReanudar', datos.estado_juego);
                window.location.href = 'pages/modo_digital.php';
            } else {
                window.notificador.mostrar(datos.mensaje || traducirJS('notif_historial_no_se_pudo_cargar'), 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('btn_reanudar');
            }
        } catch (error) {
            console.error('Error al intentar reanudar la partida:', error);
            window.notificador.mostrar(traducirJS('notif_historial_error_conexion_cargar'), 'error');
            boton.disabled = false;
            boton.textContent = traducirJS('btn_reanudar');
        }
    }

    async manejarEliminarPartida(evento) {
        const boton = evento.target;
        const idPartida = boton.dataset.idPartida;
        const mensajeConfirmacion = traducirJS('modal_confirmar_eliminacion_partida_texto');

        try {
            await this.modalConfirm.mostrar(mensajeConfirmacion);
            
            boton.disabled = true;
            boton.textContent = traducirJS('text_eliminando');

            const formData = new FormData();
            formData.append('id_partida', idPartida);

            const respuesta = await fetch('backend/partidas/eliminar_partida.php', {
                method: 'POST',
                body: formData
            });

            if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
            const datos = await respuesta.json();

            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje, 'success');
                const fila = boton.closest('tr');
                fila.classList.add('table-row-fade-out');
                fila.addEventListener('transitionend', () => {
                    fila.remove();
                    if (this.tbodyPartidas.children.length === 0) {
                        this.mostrarMensajeEnTabla(traducirJS('index_partidas_vacias'));
                    }
                });
            } else {
                window.notificador.mostrar(datos.mensaje, 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('btn_eliminar_guardado');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error al eliminar la partida:', error);
                window.notificador.mostrar(traducirJS('notif_historial_error_conexion_eliminar'), 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('btn_eliminar_guardado');
            }
        }
    }

    renderizarTabla(partidas) {
        this.tbodyPartidas.innerHTML = '';
        if (partidas.length === 0) {
            this.mostrarMensajeEnTabla(traducirJS('index_partidas_vacias'));
            return;
        }

        partidas.forEach(partida => {
            const fila = document.createElement('tr');
            const fechaFormateada = this.formatearFecha(partida.fecha_guardado);

            fila.innerHTML = `
                <td>${fechaFormateada}</td>
                <td>
                    <button class="btn btn-reanudar" data-id-partida="${partida.id_partida_guardada}">${traducirJS('btn_reanudar')}</button>
                </td>
                <td>
                    <button class="btn btn-eliminar" data-id-partida="${partida.id_partida_guardada}">${traducirJS('btn_eliminar_guardado')}</button>
                </td>
            `;
            this.tbodyPartidas.appendChild(fila);
        });
    }

    mostrarMensajeEnTabla(mensaje) {
        this.tbodyPartidas.innerHTML = `<tr><td colspan="3" class="text-center">${mensaje}</td></tr>`;
    }

    formatearFecha(fechaMySQL) {
        const fecha = new Date(fechaMySQL);
        const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };
        return `${fecha.toLocaleDateString('es-UY', opcionesFecha)} - ${fecha.toLocaleTimeString('es-UY', opcionesHora)}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const tutorial = new Tutorial();
    tutorial.inicializar('#btn-abrir-tutorial, #btn-abrir-tutorial-main');
    
    const modalConfirmacion = new ModalConfirmacion('confirmacion-modal-overlay');

    const paginaPrincipal = new PaginaPrincipal(modalConfirmacion);
    paginaPrincipal.inicializar();
});
