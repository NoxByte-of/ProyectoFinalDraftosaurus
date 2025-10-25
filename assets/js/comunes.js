
class Notificador {
    constructor(contenedorId) {
        this.contenedor = document.getElementById(contenedorId);
        if (!this.contenedor) {
            console.error(`El contenedor de notificaciones con ID "${contenedorId}" no fue encontrado.`);
        }
    }

    mostrar(mensaje, tipo = 'info') {
        if (!this.contenedor) {
            alert(mensaje);
            return;
        }
        
        const notificacionEl = document.createElement('div');
        notificacionEl.className = `notificacion ${tipo}`;
        notificacionEl.textContent = mensaje;

        this.contenedor.appendChild(notificacionEl);

        setTimeout(() => notificacionEl.classList.add('visible'), 10);
        setTimeout(() => {
            notificacionEl.classList.remove('visible');
            notificacionEl.addEventListener('transitionend', () => notificacionEl.remove());
        }, 4000);
    }
}

class ModalUI {
    constructor(modalId) {
        this.modalOverlay = document.getElementById(modalId);
        if (!this.modalOverlay) {
            console.error(`El modal con ID "${modalId}" no fue encontrado.`);
            return;
        }
        this.btnClose = this.modalOverlay.querySelector('.modal-close-btn');
        this._bindEventos();
    }

    inicializarTriggers(selectorTriggers) {
        document.querySelectorAll(selectorTriggers).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrar();
            });
        });
    }

    _bindEventos() {
        if (this.btnClose) {
            this.btnClose.addEventListener('click', () => this.ocultar());
        }
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.ocultar();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('visible')) {
                this.ocultar();
            }
        });
    }

    mostrar() {
        this.modalOverlay.classList.add('visible');
    }

    ocultar() {
        this.modalOverlay.classList.remove('visible');
    }
}

class ModalConfirmacion extends ModalUI {
    constructor(modalId) {
        super(modalId); 
        if (!this.modalOverlay) return;

        this.textoModal = this.modalOverlay.querySelector('#confirmacion-modal-texto');
        this.btnConfirmar = this.modalOverlay.querySelector('#btn-confirmar-eliminacion');
        this.btnCancelar = this.modalOverlay.querySelector('#btn-cancelar-eliminacion');
    }

    mostrar(mensaje) {
        return new Promise((resolve, reject) => {
            if (!this.modalOverlay) {
                if (window.confirm(mensaje)) {
                    resolve();
                } else {
                    reject();
                }
                return;
            }

            this.textoModal.textContent = mensaje;
            super.mostrar(); 

            const manejarConfirmacion = () => {
                limpiarListeners();
                this.ocultar();
                resolve();
            };

            const manejarCancelacion = () => {
                limpiarListeners();
                this.ocultar();
                reject();
            };
            
            const manejarEscape = (e) => {
                if (e.key === 'Escape') {
                    manejarCancelacion();
                }
            };

            const limpiarListeners = () => {
                this.btnConfirmar.removeEventListener('click', manejarConfirmacion);
                this.btnCancelar.removeEventListener('click', manejarCancelacion);
                this.modalOverlay.removeEventListener('click', manejarOverlayClick);
                document.removeEventListener('keydown', manejarEscape);
            };

            const manejarOverlayClick = (e) => {
                if (e.target === this.modalOverlay) {
                    manejarCancelacion();
                }
            };
            
            this.btnConfirmar.addEventListener('click', manejarConfirmacion, { once: true });
            this.btnCancelar.addEventListener('click', manejarCancelacion, { once: true });
            this.modalOverlay.addEventListener('click', manejarOverlayClick);
            document.addEventListener('keydown', manejarEscape);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.notificador = new Notificador('notificacion-container');

    const modalQuienesSomos = new ModalUI('quienes-somos-modal-overlay');
    if (modalQuienesSomos.modalOverlay) {
        modalQuienesSomos.inicializarTriggers('#btn-quienes-somos');
    }
});
