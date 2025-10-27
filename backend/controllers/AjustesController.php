<?php
require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../config/Traductor.php';
require_once __DIR__ . '/../config/idioma_manager.php';

class AjustesController {
    private $conexion;
    private $usuario_modelo;
    private $traductor;

    public function __construct($db) {
        global $idioma_seleccionado;
        $this->conexion = $db;
        $this->usuario_modelo = new Usuario($this->conexion);
        $this->traductor = new Traductor($idioma_seleccionado);
    }

    public function cambiarNombre() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('ajustes_error_actualizar_nombre')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $nombre_usuario_actual = $_POST['nombre_usuario_actual'] ?? '';
        $nuevo_nombre_usuario = $_POST['nuevo_nombre_usuario'] ?? '';

        if (empty($nombre_usuario_actual) || empty($nuevo_nombre_usuario)) {
            $respuesta['mensaje'] = $this->traductor->traducir('notif_todos_campos_obligatorios');
            echo json_encode($respuesta);
            return;
        }

        if ($_SESSION['nombre_usuario'] !== $nombre_usuario_actual) {
            $respuesta['mensaje'] = $this->traductor->traducir('ajustes_error_nombre_actual_incorrecto');
            echo json_encode($respuesta);
            return;
        }

        $resultado = $this->usuario_modelo->actualizarNombre($id_usuario, $nuevo_nombre_usuario);

        if ($resultado['exito']) {
            $_SESSION['nombre_usuario'] = $nuevo_nombre_usuario;
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('ajustes_nombre_actualizado_exito');
        } else {
            if (isset($resultado['dias_restantes']) && $resultado['dias_restantes'] > 0) {
                $dias = $resultado['dias_restantes'];
                $mensajeTraducido = $this->traductor->traducir('ajustes_error_espera_nombre');
                $respuesta['mensaje'] = str_replace('{dias}', $dias, $mensajeTraducido);
            }
            elseif (!empty($resultado['mensaje'])) {
                // Intenta traducir el mensaje específico del modelo, si no, usa el mensaje original
                $mensajeTraducidoEspecifico = $this->traductor->traducir($resultado['mensaje']);
                // Si la traducción es la misma que la clave, significa que no encontró traducción específica
                $respuesta['mensaje'] = ($mensajeTraducidoEspecifico !== $resultado['mensaje']) ? $mensajeTraducidoEspecifico : $resultado['mensaje'];

            }
            else {
                $respuesta['mensaje'] = $this->traductor->traducir('ajustes_error_actualizar_nombre');
            }
        }

        echo json_encode($respuesta);
    }

    public function cambiarContrasena() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('ajustes_error_actualizar_contrasena')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $contrasena_actual = $_POST['contrasena_actual'] ?? '';
        $nueva_contrasena = $_POST['nueva_contrasena'] ?? '';
        $confirmar_nueva_contrasena = $_POST['confirmar_nueva_contrasena'] ?? '';

        if (empty($contrasena_actual) || empty($nueva_contrasena) || empty($confirmar_nueva_contrasena)) {
            $respuesta['mensaje'] = $this->traductor->traducir('notif_todos_campos_obligatorios');
            echo json_encode($respuesta);
            return;
        }

        if ($nueva_contrasena !== $confirmar_nueva_contrasena) {
            $respuesta['mensaje'] = $this->traductor->traducir('notif_contrasenas_no_coinciden');
            echo json_encode($respuesta);
            return;
        }

        if (strlen($nueva_contrasena) < 8) {
            $respuesta['mensaje'] = $this->traductor->traducir('notif_contrasena_corta');
            echo json_encode($respuesta);
            return;
        }

        $resultado = $this->usuario_modelo->actualizarContrasena($id_usuario, $contrasena_actual, $nueva_contrasena);

        if ($resultado['exito']) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('ajustes_contrasena_actualizada_exito');
        } else {

            if (!empty($resultado['mensaje'])) {
                 $mensajeTraducidoEspecifico = $this->traductor->traducir($resultado['mensaje']);
                 $respuesta['mensaje'] = ($mensajeTraducidoEspecifico !== $resultado['mensaje']) ? $mensajeTraducidoEspecifico : $resultado['mensaje'];
            }
            else {
                $respuesta['mensaje'] = $this->traductor->traducir('ajustes_error_actualizar_contrasena');
            }
        }

        echo json_encode($respuesta);
    }


    public function eliminarCuenta() {
        header('Content-Type: application/json');

        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('ajustes_error_eliminar_cuenta')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];

        if ($this->usuario_modelo->eliminarPorId($id_usuario)) {

            session_unset();
            session_destroy();

            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }

            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('ajustes_cuenta_eliminada_exito');
        } else {
             http_response_code(500);
        }

        echo json_encode($respuesta);
    }

    public function cambiarIdiomaPreferido() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('ajustes_error_actualizar_idioma')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
             http_response_code(405);
             $respuesta['mensaje'] = $this->traductor->traducir('auth_metodo_no_valido');
             echo json_encode($respuesta);
             return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $nuevo_idioma = $_POST['idioma_preferido'] ?? null;

        if (empty($nuevo_idioma)) {
             http_response_code(400);
             $respuesta['mensaje'] = $this->traductor->traducir('ajustes_error_idioma_no_proporcionado');
             echo json_encode($respuesta);
             return;
        }

        $idiomas_validos = ['es', 'en'];
        if (!in_array($nuevo_idioma, $idiomas_validos)) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('ajustes_error_idioma_invalido');
            echo json_encode($respuesta);
            return;
        }

        $resultado_db = $this->usuario_modelo->actualizarIdiomaPreferido($id_usuario, $nuevo_idioma);

        if ($resultado_db['exito']) {
            $_SESSION['idioma'] = $nuevo_idioma;
            setcookie('idioma', $nuevo_idioma, time() + (365 * 24 * 60 * 60), "/");

            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('ajustes_idioma_actualizado_exito');
        } else {
             http_response_code(500);
            $respuesta['mensaje'] = $resultado_db['mensaje'] ?: $this->traductor->traducir('ajustes_error_actualizar_idioma');
        }

        echo json_encode($respuesta);
    }
}
?>

