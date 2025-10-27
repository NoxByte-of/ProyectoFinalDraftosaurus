
class Notificador {
    constructor(contenedorId) {
        this.contenedor = document.getElementById(contenedorId);
        if (!this.contenedor) {
            console.warn(`El contenedor de notificaciones con ID "${contenedorId}" no fue encontrado. Intentando crear uno.`);
            this.contenedor = document.createElement('div');
            this.contenedor.id = contenedorId;
            document.body.appendChild(this.contenedor);      
            Object.assign(this.contenedor.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '2000', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                width: 'auto', 
                pointerEvents: 'none' 
            });
        }
    }

    mostrar(mensaje, tipo = 'info') {
        if (!this.contenedor) {
            alert(mensaje);
            console.error(`Fallo al crear/encontrar el contenedor de notificaciones ID "${contenedorId}". Usando alert().`);
            return;
        }

        const notificacionEl = document.createElement('div');
        notificacionEl.className = `notificacion ${tipo}`;
        notificacionEl.textContent = mensaje;
        Object.assign(notificacionEl.style, {
            minWidth: '280px',
            maxWidth: '350px',
            color: 'white',
            padding: '12px 18px',
            borderRadius: '14px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
            fontFamily: "'Bubblegum Sans', sans-serif",
            fontSize: '1rem',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            border: '2px solid rgba(0,0,0,0.3)',
            backgroundColor: tipo === 'error' ? '#c0392b' : (tipo === 'success' ? '#27ae60' : '#2980b9'), 
            pointerEvents: 'auto' 
        });

        this.contenedor.appendChild(notificacionEl);
        notificacionEl.offsetHeight;

        requestAnimationFrame(() => {
            notificacionEl.style.opacity = '1';
            notificacionEl.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notificacionEl.style.opacity = '0';
            notificacionEl.style.transform = 'translateY(-20px)';
            notificacionEl.addEventListener('transitionend', () => notificacionEl.remove(), { once: true });
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
        this.modalContent = this.modalOverlay.querySelector('.modal-content');
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
         if (!this.modalOverlay) return;
        this.modalOverlay.classList.add('visible');
    }

    ocultar() {
         if (!this.modalOverlay) return;
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

        if (!this.textoModal || !this.btnConfirmar || !this.btnCancelar) {
            console.error(`Faltan elementos dentro del modal de confirmación con ID "${modalId}". Asegúrate de tener #confirmacion-modal-texto, #btn-confirmar-eliminacion y #btn-cancelar-eliminacion.`);
            this.modalOverlay = null;
        }
    }

    mostrar(mensaje) {
        return new Promise((resolve, reject) => {
            if (!this.modalOverlay) {
                console.warn("ModalConfirmacion no inicializado correctamente, usando window.confirm().");
                if (window.confirm(mensaje)) {
                    resolve();
                } else {
                    reject(new Error("Acción cancelada por el usuario (confirm nativo).")); 
                }
                return;
            }

            if (!this.textoModal || !this.btnConfirmar || !this.btnCancelar) {
                 reject(new Error("Elementos del modal de confirmación no encontrados al intentar mostrar."));
                 return;
            }

            this.textoModal.textContent = mensaje;
            super.mostrar();
            const controller = new AbortController();
            const signal = controller.signal;

            const manejarConfirmacion = () => {
                resolve();
                finalizar();
            };

            const manejarCancelacion = () => {
                reject(new Error("Acción cancelada por el usuario.")); 
                finalizar();
            };

            const manejarEscape = (e) => {
                if (e.key === 'Escape') {
                    manejarCancelacion();
                }
            };

             const manejarOverlayClick = (e) => {
                if (e.target === this.modalOverlay) {
                    manejarCancelacion();
                }
            };

            const finalizar = () => {
                this.ocultar();
                controller.abort(); 
            };

            this.btnConfirmar.addEventListener('click', manejarConfirmacion, { signal });
            this.btnCancelar.addEventListener('click', manejarCancelacion, { signal });
            this.modalOverlay.addEventListener('click', manejarOverlayClick, { signal });
            document.addEventListener('keydown', manejarEscape, { signal });
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.notificador = new Notificador('notificacion-container');
    const modalQuienesSomos = new ModalUI('quienes-somos-modal-overlay');
    if (modalQuienesSomos.modalOverlay) {
        modalQuienesSomos.inicializarTriggers('#btn-quienes-somos');
    } else {
        console.warn("El modal 'quienes-somos-modal-overlay' no se encontró. El botón 'Sobre NoxByte' no funcionará.");
    }

    if (typeof Tutorial === 'function' && document.getElementById('tutorial-modal')) {
        const tutorial = new Tutorial();
        tutorial.inicializar('#btn-abrir-tutorial, #btn-abrir-tutorial-main');
    } else if (typeof Tutorial !== 'function') {
         console.warn("La clase Tutorial no está definida (asegúrate de cargar tutorial.js). El botón 'Tutorial' no funcionará.");
    } else if (!document.getElementById('tutorial-modal')) {
         console.warn("El modal 'tutorial-modal' no se encontró en el DOM. El botón 'Tutorial' no funcionará.");
    }

});
