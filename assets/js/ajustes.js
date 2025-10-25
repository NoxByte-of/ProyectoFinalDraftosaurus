
class PaginaAjustes {
    constructor() {
        this.btnAbrirModalNombre = document.getElementById('btn-abrir-modal-nombre');
        this.btnAbrirModalContrasena = document.getElementById('btn-abrir-modal-contrasena');
        this.btnEliminarCuenta = document.getElementById('btn-eliminar-cuenta');

        this.modalCambiarNombre = document.getElementById('modal-cambiar-nombre');
        this.modalCambiarContrasena = document.getElementById('modal-cambiar-contrasena');

        this.formCambiarNombre = document.getElementById('form-cambiar-nombre');
        this.formCambiarContrasena = document.getElementById('form-cambiar-contrasena');

        this.botonesCerrarModal = document.querySelectorAll('.modal-close-btn');

        this.modalConfirmarEliminacion = {
            overlay: document.getElementById('confirmacion-eliminar-cuenta-modal'),
            btnConfirmar: document.getElementById('btn-confirmar-eliminacion-cuenta'),
            btnCancelar: document.getElementById('btn-cancelar-eliminacion-cuenta')
        };
    }

    inicializar() {
        this.btnAbrirModalNombre.addEventListener('click', () => this._abrirModal('modal-cambiar-nombre'));
        this.btnAbrirModalContrasena.addEventListener('click', () => this._abrirModal('modal-cambiar-contrasena'));

        this.botonesCerrarModal.forEach(btn => {
            btn.addEventListener('click', () => this._cerrarModal(btn.dataset.modalId));
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (evento) => {
                if (evento.target === overlay) {
                    this._cerrarModal(overlay.id);
                }
            });
        });

        this.formCambiarNombre.addEventListener('submit', (evento) => this._manejarCambioNombre(evento));
        this.formCambiarContrasena.addEventListener('submit', (evento) => this._manejarCambioContrasena(evento));
    
        this.btnEliminarCuenta.addEventListener('click', () => this._manejarEliminarCuenta());
    }

    _abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('visible');
        }
    }

    _cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('visible');
        }
    }

    async _manejarCambioNombre(evento) {
        evento.preventDefault();
        const botonSubmit = this.formCambiarNombre.querySelector('button[type="submit"]');
        botonSubmit.disabled = true;

        const formData = new FormData(this.formCambiarNombre);
        const nombreActual = formData.get('nombre_usuario_actual').trim();
        const nombreNuevo = formData.get('nuevo_nombre_usuario').trim();

        if (!nombreActual || !nombreNuevo) {
            window.notificador.mostrar(traducirJS('notif_ambos_nombres_obligatorios'), 'error');
            botonSubmit.disabled = false;
            return;
        }

        try {
            const respuesta = await fetch('../backend/ajustes/cambiar_nombre.php', {
                method: 'POST',
                body: formData
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje, 'success');
                setTimeout(() => {
                    this._cerrarModal('modal-cambiar-nombre');
                    location.reload();
                }, 1500);
            } else {
                window.notificador.mostrar(datos.mensaje, 'error');
            }
        } catch (error) {
            console.error('Error al cambiar el nombre:', error);
            window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
        } finally {
            botonSubmit.disabled = false;
        }
    }

    async _manejarCambioContrasena(evento) {
        evento.preventDefault();
        const botonSubmit = this.formCambiarContrasena.querySelector('button[type="submit"]');
        botonSubmit.disabled = true;
        
        const formData = new FormData(this.formCambiarContrasena);
        const contrasenaActual = formData.get('contrasena_actual');
        const nuevaContrasena = formData.get('nueva_contrasena');
        const confirmarContrasena = formData.get('confirmar_nueva_contrasena');

        if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
            window.notificador.mostrar(traducirJS('notif_todos_campos_obligatorios'), 'error');
            botonSubmit.disabled = false;
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            window.notificador.mostrar(traducirJS('notif_contrasenas_no_coinciden'), 'error');
            botonSubmit.disabled = false;
            return;
        }

        if (nuevaContrasena.length < 8) {
            window.notificador.mostrar(traducirJS('notif_contrasena_corta'), 'error');
            botonSubmit.disabled = false;
            return;
        }

        try {
            const respuesta = await fetch('../backend/ajustes/cambiar_contrasena.php', {
                method: 'POST',
                body: formData
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje, 'success');
                this.formCambiarContrasena.reset();
                setTimeout(() => this._cerrarModal('modal-cambiar-contrasena'), 1500);
            } else {
                window.notificador.mostrar(datos.mensaje, 'error');
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
        } finally {
            botonSubmit.disabled = false;
        }
    }

    _manejarEliminarCuenta() {
        this._abrirModal('confirmacion-eliminar-cuenta-modal');

        new Promise((resolve, reject) => {
            this.modalConfirmarEliminacion.btnConfirmar.onclick = resolve;
            this.modalConfirmarEliminacion.btnCancelar.onclick = reject;
        })
        .then(async () => {
            this._cerrarModal('confirmacion-eliminar-cuenta-modal');
            
            try {
                const respuesta = await fetch('../backend/ajustes/eliminar_cuenta.php', {
                    method: 'POST'
                });

                const datos = await respuesta.json();

                if (datos.exito) {
                    window.notificador.mostrar(datos.mensaje, 'success');
                    setTimeout(() => {
                        window.location.href = '../index.php'; 
                    }, 2000);
                } else {
                    window.notificador.mostrar(datos.mensaje, 'error');
                }
            } catch (error) {
                console.error('Error al eliminar la cuenta:', error);
                window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
            }
        })
        .catch(() => {
            this._cerrarModal('confirmacion-eliminar-cuenta-modal');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.main-ajustes')) {
        const pagina = new PaginaAjustes();
        pagina.inicializar();
    }
});
