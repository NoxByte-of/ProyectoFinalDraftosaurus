
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.language-dropdown');

    if (dropdown) {
        dropdown.addEventListener('click', (evento) => {
            const opcionIdioma = evento.target.closest('.language-option');
            
            if (opcionIdioma) {
                evento.preventDefault(); 

                const nuevoIdioma = opcionIdioma.dataset.lang;
                const urlActual = new URL(window.location.href);
                urlActual.searchParams.set('lang', nuevoIdioma);
                window.location.href = urlActual.toString();
            }
        });
    }
});
