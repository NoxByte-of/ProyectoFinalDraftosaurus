/**
 * 
 * lógica de registro e inicio de sesión,
 * 
 * edad implementada (jugador mas joven empieza?)

 */
document.addEventListener('DOMContentLoaded', () => {

    const formularioRegistro = document.getElementById('formulario-registro');
    const formularioLogin = document.getElementById('formulario-login');
    const enlaceLogin = document.getElementById('enlace-login');
    const enlaceRegistro = document.getElementById('enlace-registro');
    const panelTitulo = document.getElementById('panel-titulo');
    const panelDescripcion = document.getElementById('panel-descripcion');


    enlaceLogin.addEventListener('click', (evento) => {
        evento.preventDefault();
        formularioRegistro.style.display = 'none';
        formularioLogin.style.display = 'flex';
        panelTitulo.textContent = 'Iniciar Sesión';
        panelDescripcion.textContent = '¡Qué bueno verte de nuevo!';
    });

    enlaceRegistro.addEventListener('click', (evento) => {
        evento.preventDefault();
        formularioLogin.style.display = 'none';
        formularioRegistro.style.display = 'flex';
        panelTitulo.textContent = 'Crear una Cuenta';
        panelDescripcion.textContent = '¡Únete a la aventura y guarda tu progreso!';
    });

    formularioRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault(); 

        const nombreUsuario = document.getElementById('nombre-usuario-registro').value;
        const email = document.getElementById('email').value;
        const edadInput = document.getElementById('edad');
        const contrasena = document.getElementById('contrasena-registro').value;
        const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
        
       

        if (!nombreUsuario || !email || !edadInput.value || !contrasena || !confirmarContrasena) {
            mostrarNotificacion('Todos los campos son obligatorios.', 'error');
            return;
        }

        const edadValor = parseInt(edadInput.value, 10);
        if (!isNaN(edadValor) && edadValor < 0) {
            mostrarNotificacion('La edad no puede ser un número negativo.', 'error');
            return;
        }

        if (contrasena.length < 8) {
            mostrarNotificacion('La contraseña debe tener al menos 8 caracteres.', 'error');
            return;
        }

        if (contrasena !== confirmarContrasena) {
            mostrarNotificacion('Las contraseñas no coinciden.', 'error');
            return;
        }

        mostrarNotificacion(`¡Registro exitoso, ${nombreUsuario}!`, 'exito');
    });


    formularioLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        if (formularioLogin.checkValidity()) {
            mostrarNotificacion('¡Inicio de sesión exitoso!', 'exito');
        } else {
            mostrarNotificacion('Por favor, ingresa tu usuario y contraseña.', 'error');
        }
    });
});
