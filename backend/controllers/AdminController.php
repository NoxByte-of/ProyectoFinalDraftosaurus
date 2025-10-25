<?php

require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../models/PartidaGuardada.php';
require_once __DIR__ . '/../models/PartidaFinalizada.php';

class AdminController {
    private $conexion;
    private $usuario_modelo;
    private $partida_guardada_modelo;
    private $partida_finalizada_modelo;

    public function __construct($db) {
        $this->conexion = $db;
        $this->usuario_modelo = new Usuario($this->conexion);
        $this->partida_guardada_modelo = new PartidaGuardada($this->conexion);
        $this->partida_finalizada_modelo = new PartidaFinalizada($this->conexion);
    }

    public function obtenerUsuarios() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => '', 'usuarios' => []];

        try {
            $stmt = $this->usuario_modelo->obtenerTodos();
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $respuesta['exito'] = true;
            $respuesta['usuarios'] = $usuarios;

        } catch (Exception $e) {
            http_response_code(500);
            $respuesta['mensaje'] = 'Error al obtener los usuarios: ' . $e->getMessage();
        }

        echo json_encode($respuesta);
    }
    
    public function eliminarUsuario() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => ''];

        $id_usuario_a_eliminar = $_POST['id_usuario'] ?? null;

        if (!$id_usuario_a_eliminar) {
            http_response_code(400);
            $respuesta['mensaje'] = 'No se proporcionó el ID del usuario a eliminar.';
            echo json_encode($respuesta);
            return;
        }

        if ($id_usuario_a_eliminar == $_SESSION['id_usuario']) {
            http_response_code(403);
            $respuesta['mensaje'] = 'No puedes eliminar tu propia cuenta desde el panel de administración.';
            echo json_encode($respuesta);
            return;
        }
        
        if ($this->usuario_modelo->eliminarPorId($id_usuario_a_eliminar)) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = 'Usuario eliminado correctamente.';
        } else {
            http_response_code(500);
            $respuesta['mensaje'] = 'Error al intentar eliminar el usuario de la base de datos.';
        }

        echo json_encode($respuesta);
    }

    public function actualizarUsuario() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => ''];

        $id_usuario = $_POST['id_usuario'] ?? null;
        $campo = $_POST['campo'] ?? null;
        $valor = $_POST['valor'] ?? null;

        if (!$id_usuario || !$campo || $valor === null) {
            http_response_code(400);
            $respuesta['mensaje'] = 'Datos incompletos para la actualización.';
            echo json_encode($respuesta);
            return;
        }

        $resultado = $this->usuario_modelo->actualizarCampoPorAdmin($id_usuario, $campo, $valor);

        echo json_encode($resultado);
    }

    public function obtenerEstadisticas() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => ''];

        try {
            $totalUsuarios = $this->usuario_modelo->contarTotal();
            $totalPartidasGuardadas = $this->partida_guardada_modelo->contarTotal();
            $totalPartidasFinalizadas = $this->partida_finalizada_modelo->contarTotal();

            $respuesta['exito'] = true;
            $respuesta['estadisticas'] = [
                'total_usuarios' => $totalUsuarios,
                'partidas_en_progreso' => $totalPartidasGuardadas,
                'partidas_finalizadas' => $totalPartidasFinalizadas
            ];

        } catch (Exception $e) {
            http_response_code(500);
            $respuesta['mensaje'] = 'Error al obtener las estadísticas: ' . $e->getMessage();
        }

        echo json_encode($respuesta);
    }
}
?>

