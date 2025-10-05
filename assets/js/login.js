/**
 * logica de registro e inicio de sesión
 * comunica con el backend para registrar usuarios e iniciar sesion.
 */
document.addEventListener('DOMContentLoaded', () => {

    const formularioRegistro = document.getElementById('formulario-registro');
    const formularioLogin = document.getElementById('formulario-login');
    const enlaceLogin = document.getElementById('enlace-login');
    const enlaceRegistro = document.getElementById('enlace-registro');
    const panelTitulo = document.getElementById('panel-titulo');
    const panelDescripcion = document.getElementById('panel-descripcion');

    const parametrosUrl = new URLSearchParams(window.location.search);
    const formularioActivo = parametrosUrl.get('form');

    if (formularioActivo === 'login') {
        formularioRegistro.style.display = 'none';
        formularioLogin.style.display = 'flex';
        panelTitulo.textContent = 'Iniciar Sesión';
        panelDescripcion.textContent = '¡Qué bueno verte de nuevo!';
    }

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

        const nombreUsuario = document.getElementById('nombre-usuario-registro').value.trim();
        const email = document.getElementById('email').value.trim();
        const edad = document.getElementById('edad').value.trim();
        const contrasena = document.getElementById('contrasena-registro').value;
        const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

        if (!nombreUsuario || !email || !edad || !contrasena || !confirmarContrasena) {
            mostrarNotificacion('Todos los campos son obligatorios.', 'error');
            return;
        }

        if (parseInt(edad, 10) < 0) {
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

        const datos = new FormData();
        datos.append('nombre_usuario', nombreUsuario);
        datos.append('email', email);
        datos.append('edad', edad);
        datos.append('contrasena', contrasena);

        fetch('../backend/Registro y Login/registro_usuario.php', {
            method: 'POST',
            body: datos
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.exito) {
                mostrarNotificacion(data.mensaje, 'success');
                formularioRegistro.reset(); 
                enlaceLogin.click(); 
            } else {
                mostrarNotificacion(data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Ocurrió un error de conexión. Inténtalo de nuevo.', 'error');
        });
    });

    formularioLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const nombreUsuario = document.getElementById('nombre-usuario-login').value.trim();
        const contrasena = document.getElementById('contrasena-login').value;

        if (!nombreUsuario || !contrasena) {
            mostrarNotificacion('Por favor, ingresa tu usuario y contraseña.', 'error');
            return;
        }

        const datos = new FormData();
        datos.append('nombre_usuario', nombreUsuario);
        datos.append('contrasena', contrasena);

        fetch('../backend/Registro y Login/login_usuario.php', {
            method: 'POST',
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                mostrarNotificacion(data.mensaje, 'success');
                setTimeout(() => {
                    window.location.href = '../index.php';
                }, 1500); 
            } else {
                mostrarNotificacion(data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Ocurrió un error de conexión. Inténtalo de nuevo.', 'error');
        });
    });
});