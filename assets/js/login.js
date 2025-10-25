
document.addEventListener('DOMContentLoaded', () => {

    const formularioRegistro = document.getElementById('formulario-registro');
    const formularioLogin = document.getElementById('formulario-login');
    const enlaceLogin = document.getElementById('enlace-login');
    const enlaceRegistro = document.getElementById('enlace-registro');
    const panelTitulo = document.getElementById('panel-titulo');
    const panelDescripcion = document.getElementById('panel-descripcion');

    const parametrosUrl = new URLSearchParams(window.location.search);
    const formularioActivo = parametrosUrl.get('form');

    const cambiarFormulario = (esLogin) => {
        if (esLogin) {
            formularioRegistro.style.display = 'none';
            formularioLogin.style.display = 'flex';
            panelTitulo.textContent = traducirJS('login_iniciar_sesion_titulo');
            panelDescripcion.textContent = traducirJS('login_iniciar_sesion_subtitulo');
        } else {
            formularioLogin.style.display = 'none';
            formularioRegistro.style.display = 'flex';
            panelTitulo.textContent = traducirJS('login_crear_cuenta_titulo');
            panelDescripcion.textContent = traducirJS('login_crear_cuenta_subtitulo');
        }
    };

    if (formularioActivo === 'login') {
        cambiarFormulario(true);
    }

    enlaceLogin.addEventListener('click', (evento) => {
        evento.preventDefault();
        cambiarFormulario(true);
    });

    enlaceRegistro.addEventListener('click', (evento) => {
        evento.preventDefault();
        cambiarFormulario(false);
    });

    formularioRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombreUsuario = document.getElementById('nombre-usuario-registro').value.trim();
        const email = document.getElementById('email').value.trim();
        const edad = document.getElementById('edad').value.trim();
        const contrasena = document.getElementById('contrasena-registro').value;
        const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

        if (!nombreUsuario || !email || !edad || !contrasena || !confirmarContrasena) {
            window.notificador.mostrar(traducirJS('notif_todos_campos_obligatorios'), 'error');
            return;
        }

        if (parseInt(edad, 10) < 0) {
            window.notificador.mostrar(traducirJS('notif_edad_negativa'), 'error');
            return;
        }

        if (contrasena.length < 8) {
            window.notificador.mostrar(traducirJS('notif_contrasena_corta'), 'error');
            return;
        }

        if (contrasena !== confirmarContrasena) {
            window.notificador.mostrar(traducirJS('notif_contrasenas_no_coinciden'), 'error');
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
                window.notificador.mostrar(data.mensaje, 'success');
                formularioRegistro.reset(); 
                enlaceLogin.click(); 
            } else {
                window.notificador.mostrar(data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
        });
    });

    formularioLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const nombreUsuario = document.getElementById('nombre-usuario-login').value.trim();
        const contrasena = document.getElementById('contrasena-login').value;

        if (!nombreUsuario || !contrasena) {
            window.notificador.mostrar(traducirJS('notif_ingresa_usuario_contrasena'), 'error');
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
                window.notificador.mostrar(data.mensaje, 'success');
                setTimeout(() => {
                    window.location.href = '../index.php';
                }, 1500); 
            } else {
                window.notificador.mostrar(data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.notificador.mostrar(traducirJS('notif_error_conexion'), 'error');
        });
    });
});
