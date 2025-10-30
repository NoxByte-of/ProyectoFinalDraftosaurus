<?php
require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../config/Traductor.php';
require_once __DIR__ . '/../config/idioma_manager.php';

class AuthController {
    private $conexion;
    private $usuario;
    private $traductor;

    public function __construct($db) {
        global $idioma_seleccionado;
        $this->conexion = $db;
        $this->usuario = new Usuario($this->conexion);
        $this->traductor = new Traductor($idioma_seleccionado);
    }

    public function registrar() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('auth_error_registro')];

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $respuesta['mensaje'] = $this->traductor->traducir('auth_metodo_no_valido');
            echo json_encode($respuesta);
            return;
        }

        $nombreUsuario = $_POST['nombre_usuario'] ?? null;
        $email = $_POST['email'] ?? null;
        $edad = $_POST['edad'] ?? null;
        $contrasena = $_POST['contrasena'] ?? null;

        if (!$nombreUsuario || !$email || !$edad || !$contrasena) {
            $respuesta['mensaje'] = $this->traductor->traducir('notif_todos_campos_obligatorios');
            echo json_encode($respuesta);
            return;
        }

        $this->usuario->nombre_usuario = $nombreUsuario;
        $this->usuario->email = $email;

        if ($this->usuario->nombreUsuarioOEmailExisten()) {
            $respuesta['mensaje'] = $this->traductor->traducir('auth_usuario_o_email_existen');
            echo json_encode($respuesta);
            return;
        }
        if (intval($edad) < 0) {
             $respuesta['mensaje'] = $this->traductor->traducir('notif_edad_negativa');
             echo json_encode($respuesta);
             return;
        }
        if (strlen($contrasena) < 8) {
             $respuesta['mensaje'] = $this->traductor->traducir('notif_contrasena_corta');
             echo json_encode($respuesta);
             return;
        }

        $this->usuario->edad = $edad;
        $this->usuario->contrasena = $contrasena;

        if ($this->usuario->crear()) {
            $respuesta['exito'] = true;
            $mensajeTraducido = $this->traductor->traducir('auth_registro_exitoso');
            $respuesta['mensaje'] = str_replace('{nombreUsuario}', htmlspecialchars($nombreUsuario), $mensajeTraducido);
        }

        echo json_encode($respuesta);
    }

    public function login() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('auth_error_login')];

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $respuesta['mensaje'] = $this->traductor->traducir('auth_metodo_no_valido');
            echo json_encode($respuesta);
            return;
        }

        $nombreUsuario = $_POST['nombre_usuario'] ?? null;
        $contrasenaPost = $_POST['contrasena'] ?? null;

        if (!$nombreUsuario || !$contrasenaPost) {
            $respuesta['mensaje'] = $this->traductor->traducir('auth_campos_login_obligatorios');
            echo json_encode($respuesta);
            return;
        }

        $this->usuario->nombre_usuario = $nombreUsuario;
        $datosUsuario = $this->usuario->buscarPorNombreUsuario();

        if ($datosUsuario && password_verify($contrasenaPost, $datosUsuario['contrasena'])) {
            $respuesta['exito'] = true;

            $mensajeTraducido = $this->traductor->traducir('auth_login_exitoso');
            $respuesta['mensaje'] = str_replace('{nombreUsuario}', htmlspecialchars($datosUsuario['nombre_usuario']), $mensajeTraducido);

            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }

            $_SESSION['id_usuario'] = $datosUsuario['id_usuario'];
            $_SESSION['nombre_usuario'] = $datosUsuario['nombre_usuario'];
            $_SESSION['rol'] = $datosUsuario['rol'];
            $_SESSION['idioma'] = $datosUsuario['idioma_preferido'] ?? 'es';

        } else {
             $respuesta['mensaje'] = $this->traductor->traducir('auth_error_login');
        }

        echo json_encode($respuesta);
    }

    public function logout() {
        if (session_status() == PHP_SESSION_NONE) {
             session_start();
        }
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();

        header("Location: ../../index.php");
        exit;
    }
}


