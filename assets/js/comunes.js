/**
código que se comparte en toda la pagina
 notificaciones
 lógica "sobre noxbyte"(variable quienes somos).
 */

document.addEventListener('DOMContentLoaded', function() {

    // notificaciones
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const container = document.getElementById('notificacion-container');
        if (!container) {
            alert(mensaje);
            return;
        }
        const notif = document.createElement('div');
        notif.className = `notificacion ${tipo}`;
        notif.textContent = mensaje;
        container.appendChild(notif);
        
        setTimeout(() => notif.classList.add('visible'), 10);
        setTimeout(() => {
            notif.classList.remove('visible');
            notif.addEventListener('transitionend', () => notif.remove());
        }, 4000);
    }

    window.mostrarNotificacion = mostrarNotificacion;

    //  "SOBRE NOXBYTE" modal"
    const btnQuienesSomos = document.getElementById('btn-quienes-somos');
    const modalQuienesSomosOverlay = document.getElementById('quienes-somos-modal-overlay');
    if (btnQuienesSomos && modalQuienesSomosOverlay) {
        const btnCerrarModalQuienesSomos = document.getElementById('btn-close-quienes-somos-modal');
        const mostrarModal = () => modalQuienesSomosOverlay.classList.add('visible');
        const ocultarModal = () => modalQuienesSomosOverlay.classList.remove('visible');

        btnQuienesSomos.addEventListener('click', mostrarModal);
        btnCerrarModalQuienesSomos.addEventListener('click', ocultarModal);
        modalQuienesSomosOverlay.addEventListener('click', (e) => e.target === modalQuienesSomosOverlay && ocultarModal());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && ocultarModal());
    }
});
