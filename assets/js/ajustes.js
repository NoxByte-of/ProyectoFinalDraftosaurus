class PaginaAjustes {
    constructor() {
        this.btnAbrirModalNombre = document.getElementById('btn-abrir-modal-nombre');
        this.btnAbrirModalContrasena = document.getElementById('btn-abrir-modal-contrasena');
        this.btnAbrirModalIdioma = document.getElementById('btn-abrir-modal-idioma');
        this.btnEliminarCuenta = document.getElementById('btn-eliminar-cuenta');

        this.modalCambiarNombre = document.getElementById('modal-cambiar-nombre');
        this.modalCambiarContrasena = document.getElementById('modal-cambiar-contrasena');
        this.modalCambiarIdioma = document.getElementById('modal-cambiar-idioma');

        this.formCambiarNombre = document.getElementById('form-cambiar-nombre');
        this.formCambiarContrasena = document.getElementById('form-cambiar-contrasena');
        this.formCambiarIdioma = document.getElementById('form-cambiar-idioma');

        this.botonesCerrarModal = document.querySelectorAll('.modal-close-btn');

        this.modalConfirm = new ModalConfirmacion('confirmacion-modal-overlay');

    }

    inicializar() {
        if (this.btnAbrirModalNombre) {
            this.btnAbrirModalNombre.addEventListener('click', () => this._abrirModal('modal-cambiar-nombre'));
        }
        if (this.btnAbrirModalContrasena) {
            this.btnAbrirModalContrasena.addEventListener('click', () => this._abrirModal('modal-cambiar-contrasena'));
        }
        if (this.btnAbrirModalIdioma) {
            this.btnAbrirModalIdioma.addEventListener('click', () => this._abrirModal('modal-cambiar-idioma'));
        }

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

        if (this.formCambiarNombre) {
            this.formCambiarNombre.addEventListener('submit', (evento) => this._manejarCambioNombre(evento));
        }
        if (this.formCambiarContrasena) {
            this.formCambiarContrasena.addEventListener('submit', (evento) => this._manejarCambioContrasena(evento));
        }
        if (this.formCambiarIdioma) {
            this.formCambiarIdioma.addEventListener('submit', (evento) => this._manejarCambioIdioma(evento));
        }
        if (this.btnEliminarCuenta) {
            this.btnEliminarCuenta.addEventListener('click', () => this._manejarEliminarCuenta());
        }
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
        const nombreActual = formData.get('nombre_usuario_actual')?.trim() ?? '';
        const nombreNuevo = formData.get('nuevo_nombre_usuario')?.trim() ?? '';

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

    async _manejarCambioIdioma(evento) {
        evento.preventDefault();
        const botonSubmit = this.formCambiarIdioma.querySelector('button[type="submit"]');
        botonSubmit.disabled = true;

        const formData = new FormData(this.formCambiarIdioma);
        const idiomaSeleccionado = formData.get('idioma_preferido');

        if (!idiomaSeleccionado) {
             window.notificador.mostrar(traducirJS('ajustes_error_seleccionar_idioma'), 'error');
             botonSubmit.disabled = false;
             return;
        }

        try {
            const respuesta = await fetch('../backend/ajustes/cambiar_idioma.php', {
                method: 'POST',
                body: formData
            });

            const datos = await respuesta.json();

            if (datos.exito) {
                window.notificador.mostrar(datos.mensaje, 'success');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                window.notificador.mostrar(datos.mensaje, 'error');
                botonSubmit.disabled = false;
            }
        } catch (error) {
            console.error('Error al cambiar idioma preferido:', error);
            window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
            botonSubmit.disabled = false;
        }
    }

    _manejarEliminarCuenta() {
        const mensajeConfirmacion = traducirJS('ajustes_modal_eliminar_texto');
        this.modalConfirm.mostrar(mensajeConfirmacion)
            .then(async () => {
                this.btnEliminarCuenta.disabled = true;
                this.btnEliminarCuenta.textContent = traducirJS('ajustes_boton_eliminando');

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
                        this.btnEliminarCuenta.disabled = false;
                        this.btnEliminarCuenta.textContent = traducirJS('ajustes_btn_eliminar_cuenta');
                    }
                } catch (error) {
                    console.error('Error al eliminar la cuenta:', error);
                    window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
                    this.btnEliminarCuenta.disabled = false;
                    this.btnEliminarCuenta.textContent = traducirJS('ajustes_btn_eliminar_cuenta');
                }
            })
            .catch(() => {
                console.log("Eliminación cancelada por el usuario.");
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.main-ajustes')) {
        const pagina = new PaginaAjustes();
        pagina.inicializar();
    }
});

