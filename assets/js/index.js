/**
 * Lógica para (index.php).
 * 
 */
document.addEventListener('DOMContentLoaded', function() {
    const btnAbrirTutorialPrincipal = document.getElementById('btn-abrir-tutorial-main');
    const modalTutorial = document.getElementById('tutorial-modal');

    if (btnAbrirTutorialPrincipal && modalTutorial) {
        btnAbrirTutorialPrincipal.addEventListener('click', function() {
            modalTutorial.classList.add('visible');
            if (typeof iniciarTutorial === 'function') {
                iniciarTutorial();
            }
        });
    }
});

