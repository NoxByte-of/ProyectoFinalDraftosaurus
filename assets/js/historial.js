
class PaginaHistorial {
    constructor() {
        this.tbodyHistorial = document.getElementById('tbody-historial-partidas');
        this.modalConfirm = new ModalConfirmacion('confirmacion-modal-overlay');
    }

    inicializar() {
        if (!this.tbodyHistorial) {
            return;
        }

        this.cargarHistorial();

        this.tbodyHistorial.addEventListener('click', evento => {
            if (evento.target.matches('.btn-visualizar')) {
                this.manejarVisualizarPartida(evento);
            }
            if (evento.target.matches('.btn-eliminar-historial')) {
                this.manejarEliminarPartida(evento);
            }
        });
    }

    async cargarHistorial() {
        try {
            const respuesta = await fetch('../backend/partidas/obtener_partidas_finalizadas.php');
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();

            if (datos.exito) {
                this.renderizarTabla(datos.partidas);
            } else {
                this.mostrarMensajeEnTabla(datos.mensaje || traducirJS('historial_error_carga'));
            }
        } catch (error) {
            console.error('Error al cargar el historial de partidas:', error);
            this.mostrarMensajeEnTabla(traducirJS('historial_error_carga'));
        }
    }

    renderizarTabla(partidas) {
        this.tbodyHistorial.innerHTML = '';
        if (partidas.length === 0) {
            this.mostrarMensajeEnTabla(traducirJS('historial_vacio'));
            return;
        }

        partidas.forEach(partida => {
            const fila = document.createElement('tr');
            const fechaFormateada = this.formatearFecha(partida.fecha_guardado);

            fila.innerHTML = `
                <td>${this.escaparHTML(partida.nombre_partida)}</td>
                <td>${fechaFormateada}</td>
                <td>
                    <button class="btn btn-visualizar" data-id-partida="${partida.id_partida_finalizada}">${traducirJS('historial_tabla_visualizar')}</button>
                </td>
                <td>
                    <button class="btn btn-eliminar btn-eliminar-historial" data-id-partida="${partida.id_partida_finalizada}">${traducirJS('historial_tabla_eliminar')}</button>
                </td>
            `;
            this.tbodyHistorial.appendChild(fila);
        });
    }

    async manejarVisualizarPartida(evento) {
        const boton = evento.target;
        const idPartida = boton.dataset.idPartida;
        boton.disabled = true;
        boton.textContent = traducirJS('historial_btn_cargando');

        try {
            const respuesta = await fetch(`../backend/partidas/cargar_partida_finalizada.php?id=${idPartida}`);
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();

            if (datos.exito) {
                sessionStorage.setItem('partidaParaVisualizar', datos.estado_juego);
                window.location.href = 'modo_digital.php';
            } else {
                window.notificador.mostrar(datos.mensaje || traducirJS('notif_historial_no_se_pudo_cargar'), 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('historial_tabla_visualizar');
            }
        } catch (error) {
            console.error('Error al intentar visualizar la partida:', error);
            window.notificador.mostrar(traducirJS('notif_historial_error_conexion_cargar'), 'error');
            boton.disabled = false;
            boton.textContent = traducirJS('historial_tabla_visualizar');
        }
    }

    async manejarEliminarPartida(evento) {
        const boton = evento.target;
        const idPartida = boton.dataset.idPartida;
        const mensajeConfirmacion = traducirJS('historial_modal_eliminar_texto');

        try {
            await this.modalConfirm.mostrar(mensajeConfirmacion);
            
            boton.disabled = true;
            boton.textContent = traducirJS('historial_btn_borrando');

            const formData = new FormData();
            formData.append('id_partida', idPartida);

            const respuesta = await fetch('../backend/partidas/eliminar_partida_finalizada.php', {
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
                    if (this.tbodyHistorial.children.length === 0) {
                        this.mostrarMensajeEnTabla(traducirJS('historial_vacio'));
                    }
                });
            } else {
                window.notificador.mostrar(datos.mensaje, 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('historial_tabla_eliminar');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error al eliminar la partida del historial:', error);
                window.notificador.mostrar(traducirJS('notif_historial_error_conexion_eliminar'), 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('historial_tabla_eliminar');
            }
        }
    }

    mostrarMensajeEnTabla(mensaje) {
        this.tbodyHistorial.innerHTML = `<tr><td colspan="4" class="text-center">${mensaje}</td></tr>`;
    }

    formatearFecha(fechaMySQL) {
        const fecha = new Date(fechaMySQL);
        const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };
        return `${fecha.toLocaleDateString('es-UY', opcionesFecha)} - ${fecha.toLocaleTimeString('es-UY', opcionesHora)}`;
    }

    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const paginaHistorial = new PaginaHistorial();
    paginaHistorial.inicializar();
});
