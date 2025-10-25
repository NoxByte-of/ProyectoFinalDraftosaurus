
class PaginaAdmin {
    constructor() {
        this.contenedorAdmin = document.getElementById('admin-container');
        this.modalConfirm = new ModalConfirmacion('confirmacion-modal-overlay');
        
        this.modalVerEditar = new ModalUI('ver-editar-usuario-modal');
        
        this.menuInicialHTML = this.contenedorAdmin.innerHTML;
        this.usuariosData = []; 
    }

    inicializar() {
        this.contenedorAdmin.addEventListener('click', evento => {
            if (evento.target.id === 'btn-gestionar-usuarios') {
                evento.preventDefault();
                this.mostrarGestionUsuarios();
            }
            if (evento.target.id === 'btn-estadisticas') {
                evento.preventDefault();
                this.mostrarEstadisticas();
            }
            if (evento.target.id === 'btn-volver-menu') {
                evento.preventDefault();
                this.mostrarMenuPrincipal();
            }
            if (evento.target.matches('.btn-eliminar-admin')) {
                this.manejarEliminarUsuario(evento.target);
            }
            if (evento.target.matches('.btn-ver-editar')) {
                this.mostrarModalVerEditar(evento.target);
            }
        });

        if (this.modalVerEditar.modalOverlay) {
            this.modalVerEditar.modalOverlay.addEventListener('click', evento => {
                if (evento.target.matches('.btn-editar-campo')) {
                    this.activarModoEdicion(evento.target);
                }
            });
        }
    }

    mostrarMenuPrincipal() {
        this.contenedorAdmin.innerHTML = this.menuInicialHTML;
    }

    async mostrarGestionUsuarios() {
        this.contenedorAdmin.innerHTML = `
            <h2>${traducirJS('admin_usuarios_titulo')}</h2>
            <p>${traducirJS('admin_usuarios_cargando')}</p>
            <div class="table-responsive">
                <table class="table custom-table-admin"></table>
            </div>
            <div class="menu-admin" style="margin-top: 1.5rem;">
                <a href="#" class="btn-admin" id="btn-volver-menu">${traducirJS('admin_btn_volver')}</a>
            </div>
        `;

        try {
            const respuesta = await fetch('../backend/admin/obtener_usuarios.php');
            if (!respuesta.ok) {
                const error = await respuesta.json();
                throw new Error(error.mensaje || `Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            if (datos.exito) {
                this.usuariosData = datos.usuarios;
                this.renderizarTablaUsuarios(datos.usuarios);
            } else {
                throw new Error(datos.mensaje || 'No se pudieron cargar los usuarios.');
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            const errorMsg = `${traducirJS('admin_usuarios_error')} ${error.message}`;
            this.contenedorAdmin.querySelector('p').textContent = errorMsg;
            window.notificador.mostrar(error.message, 'error');
        }
    }
    
    async mostrarEstadisticas() {
        this.contenedorAdmin.innerHTML = `
            <h2>${traducirJS('admin_estadisticas_titulo')}</h2>
            <p>${traducirJS('admin_estadisticas_cargando')}</p>
            <div class="estadisticas-container"></div>
            <div class="menu-admin" style="margin-top: 1.5rem;">
                <a href="#" class="btn-admin" id="btn-volver-menu">${traducirJS('admin_btn_volver')}</a>
            </div>
        `;

        try {
            const respuesta = await fetch('../backend/admin/obtener_estadisticas.php');
            if (!respuesta.ok) {
                const error = await respuesta.json();
                throw new Error(error.mensaje || `Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            if (datos.exito) {
                this.renderizarEstadisticas(datos.estadisticas);
            } else {
                throw new Error(datos.mensaje || 'No se pudieron cargar las estadísticas.');
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            const errorMsg = `${traducirJS('admin_estadisticas_error')} ${error.message}`;
            this.contenedorAdmin.querySelector('p').textContent = errorMsg;
            window.notificador.mostrar(error.message, 'error');
        }
    }

    renderizarEstadisticas(estadisticas) {
        const contenedor = this.contenedorAdmin.querySelector('.estadisticas-container');
        contenedor.innerHTML = `
            <div class="stat-card">
                <span class="stat-valor">${estadisticas.total_usuarios}</span>
                <span class="stat-titulo">${traducirJS('admin_stat_usuarios')}</span>
            </div>
            <div class="stat-card">
                <span class="stat-valor">${estadisticas.partidas_en_progreso}</span>
                <span class="stat-titulo">${traducirJS('admin_stat_partidas_progreso')}</span>
            </div>
            <div class="stat-card">
                <span class="stat-valor">${estadisticas.partidas_finalizadas}</span>
                <span class="stat-titulo">${traducirJS('admin_stat_partidas_historial')}</span>
            </div>
        `;
        this.contenedorAdmin.querySelector('p').textContent = traducirJS('admin_estadisticas_subtitulo');
    }

    renderizarTablaUsuarios(usuarios) {
        const tabla = this.contenedorAdmin.querySelector('.custom-table-admin');
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>${traducirJS('admin_tabla_usuario')}</th>
                    <th>${traducirJS('admin_tabla_ver_editar')}</th>
                    <th>${traducirJS('admin_tabla_eliminar')}</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = tabla.querySelector('tbody');

        if (usuarios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3">${traducirJS('admin_tabla_no_hay_usuarios')}</td></tr>`;
            return;
        }

        usuarios.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.dataset.idUsuario = usuario.id_usuario;
            
            const esAdmin = usuario.rol === 'administrador';
            const nombreUsuario = this.escaparHTML(usuario.nombre_usuario);

            fila.innerHTML = `
                <td>${nombreUsuario} ${esAdmin ? '⭐' : ''}</td>
                <td>
                    <button class="btn btn-ver-editar" data-id-usuario="${usuario.id_usuario}">
                        ${traducirJS('admin_tabla_ver_editar')}
                    </button>
                </td>
                <td>
                    <button class="btn btn-eliminar btn-eliminar-admin" 
                            data-id-usuario="${usuario.id_usuario}" 
                            data-nombre-usuario="${nombreUsuario}"
                            ${esAdmin ? 'disabled' : ''}>
                        ${traducirJS('admin_tabla_eliminar')}
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
        
        this.contenedorAdmin.querySelector('p').textContent = traducirJS('admin_usuarios_subtitulo');
    }
    
    mostrarModalVerEditar(boton) {
        const idUsuario = boton.dataset.idUsuario;
        const usuario = this.usuariosData.find(u => u.id_usuario == idUsuario);

        if (!usuario) {
            window.notificador.mostrar(traducirJS('notif_admin_datos_no_encontrados'), 'error');
            return;
        }
        
        const contenidoModal = `
            <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_nombre_usuario')}</strong>
                <div class="campo-editable" id="info-nombre_usuario">
                    <span>${this.escaparHTML(usuario.nombre_usuario)}</span>
                    <button class="btn btn-editar-campo" data-campo="nombre_usuario" data-id-usuario="${idUsuario}">${traducirJS('admin_btn_editar')}</button>
                </div>
            </div>
            <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_email')}</strong>
                <span>${this.escaparHTML(usuario.email)}</span>
            </div>
            <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_edad')}</strong>
                <div class="campo-editable" id="info-edad">
                    <span>${usuario.edad}</span>
                    <button class="btn btn-editar-campo" data-campo="edad" data-id-usuario="${idUsuario}">${traducirJS('admin_btn_editar')}</button>
                </div>
            </div>
            <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_fecha_registro')}</strong>
                <span>${usuario.fecha_registro}</span>
            </div>
            <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_ultimo_cambio')}</strong>
                <span>${usuario.fecha_ultimo_cambio_nombre || traducirJS('admin_modal_nunca')}</span>
            </div>
             <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_rol')}</strong>
                <span>${usuario.rol}</span>
            </div>
            <div class="info-usuario-item">
                <strong>${traducirJS('admin_modal_idioma')}</strong>
                <span>${usuario.idioma_preferido}</span>
            </div>
        `;

        this.modalVerEditar.modalOverlay.querySelector('.modal-scrollable-content').innerHTML = contenidoModal;
        this.modalVerEditar.mostrar();
    }
    
    activarModoEdicion(boton) {
        const campo = boton.dataset.campo;
        const idUsuario = boton.dataset.idUsuario;
        const contenedor = document.getElementById(`info-${campo}`);
        const valorActual = contenedor.querySelector('span').textContent;
        const tipoInput = campo === 'edad' ? 'number' : 'text';
        
        contenedor.innerHTML = `
            <form class="form-edicion-inline">
                <input type="${tipoInput}" class="form-control" value="${this.escaparHTML(valorActual)}" required>
                <button type="submit" class="btn">${traducirJS('admin_btn_guardar')}</button>
                <button type="button" class="btn btn-cancelar">${traducirJS('admin_btn_cancelar')}</button>
            </form>
        `;

        const form = contenedor.querySelector('form');
        form.addEventListener('submit', evento => {
            evento.preventDefault();
            const nuevoValor = form.querySelector('input').value;
            this.guardarCambio(idUsuario, campo, nuevoValor, contenedor, valorActual);
        });

        form.querySelector('.btn-cancelar').addEventListener('click', () => {
            contenedor.innerHTML = `
                <span>${this.escaparHTML(valorActual)}</span>
                <button class="btn btn-editar-campo" data-campo="${campo}" data-id-usuario="${idUsuario}">${traducirJS('admin_btn_editar')}</button>
            `;
        });
    }

    async guardarCambio(idUsuario, campo, nuevoValor, contenedor, valorOriginal) {
        const botonGuardar = contenedor.querySelector('.btn');
        botonGuardar.disabled = true;
        botonGuardar.textContent = '...';

        try {
            const formData = new FormData();
            formData.append('id_usuario', idUsuario);
            formData.append('campo', campo);
            formData.append('valor', nuevoValor);
            
            const respuesta = await fetch('../backend/admin/actualizar_usuario.php', {
                method: 'POST',
                body: formData
            });

            const datos = await respuesta.json();
            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje, 'success');
                
                const usuarioIndex = this.usuariosData.findIndex(u => u.id_usuario == idUsuario);
                if(usuarioIndex > -1) this.usuariosData[usuarioIndex][campo] = nuevoValor;

                contenedor.innerHTML = `
                    <span>${this.escaparHTML(nuevoValor)}</span>
                    <button class="btn btn-editar-campo" data-campo="${campo}" data-id-usuario="${idUsuario}">${traducirJS('admin_btn_editar')}</button>
                `;
                
                this.actualizarFilaTabla(idUsuario, campo, nuevoValor);

            } else {
                throw new Error(datos.mensaje);
            }

        } catch (error) {
            window.notificador.mostrar(error.message, 'error');
            contenedor.innerHTML = `
                <span>${this.escaparHTML(valorOriginal)}</span>
                <button class="btn btn-editar-campo" data-campo="${campo}" data-id-usuario="${idUsuario}">${traducirJS('admin_btn_editar')}</button>
            `;
        }
    }

    actualizarFilaTabla(idUsuario, campo, nuevoValor) {
        if (campo !== 'nombre_usuario') return;

        const fila = this.contenedorAdmin.querySelector(`tr[data-id-usuario="${idUsuario}"]`);
        if(fila) {
            const celdaNombre = fila.querySelector('td:first-child');
            const esAdmin = celdaNombre.textContent.includes('⭐');
            celdaNombre.textContent = `${this.escaparHTML(nuevoValor)} ${esAdmin ? '⭐' : ''}`;
        }
    }

    async manejarEliminarUsuario(boton) {
        const idUsuario = boton.dataset.idUsuario;
        const nombreUsuario = boton.dataset.nombreUsuario;
        let mensajeConfirmacion = traducirJS('admin_modal_confirmar_eliminacion_texto');
        mensajeConfirmacion = mensajeConfirmacion.replace('{nombreUsuario}', nombreUsuario);

        try {
            await this.modalConfirm.mostrar(mensajeConfirmacion);
            
            boton.disabled = true;
            boton.textContent = traducirJS('admin_btn_eliminando');

            const formData = new FormData();
            formData.append('id_usuario', idUsuario);

            const respuesta = await fetch('../backend/admin/eliminar_usuario.php', {
                method: 'POST',
                body: formData
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje, 'success');
                const fila = boton.closest('tr');
                fila.classList.add('table-row-fade-out');
                fila.addEventListener('transitionend', () => fila.remove());
            } else {
                throw new Error(datos.mensaje);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error al eliminar usuario:', error);
                window.notificador.mostrar(error.message, 'error');
                boton.disabled = false;
                boton.textContent = traducirJS('admin_tabla_eliminar');
            }
        }
    }

    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.main-admin')) {
        const paginaAdmin = new PaginaAdmin();
        paginaAdmin.inicializar();
    }
});

