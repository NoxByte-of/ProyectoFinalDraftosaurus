<?php

require_once __DIR__ . '/../models/PartidaGuardada.php';
require_once __DIR__ . '/../models/PartidaFinalizada.php';
require_once __DIR__ . '/../config/Traductor.php'; 
require_once __DIR__ . '/../config/idioma_manager.php';

class PartidaController {
    private $conexion;
    private $partidaGuardada;
    private $partidaFinalizada;
    private $traductor; 

    public function __construct($db) {
        global $idioma_seleccionado; 
        $this->conexion = $db;
        $this->partidaGuardada = new PartidaGuardada($this->conexion);
        $this->partidaFinalizada = new PartidaFinalizada($this->conexion);
        $this->traductor = new Traductor($idioma_seleccionado); 
    }


    public function guardar() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('partida_error_guardar_db')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $datosJSON = file_get_contents('php://input');

        if (empty($datosJSON)) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_no_datos');
            echo json_encode($respuesta);
            return;
        }

        $this->partidaGuardada->id_usuario = $_SESSION['id_usuario'];
        $this->partidaGuardada->estado_juego = $datosJSON;

        if ($this->partidaGuardada->guardar()) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('partida_guardada_exito');
        } else {
            http_response_code(500);
        }

        echo json_encode($respuesta);
    }

    public function obtener() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => '', 'partidas' => []];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $stmt = $this->partidaGuardada->obtenerPorUsuario($id_usuario);

        if ($stmt) {
            $partidas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $respuesta['exito'] = true;
            $respuesta['partidas'] = $partidas;
        } else {
            http_response_code(500);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_obtener');
        }

        echo json_encode($respuesta);
    }

    public function cargar() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => ''];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_partida_guardada = $_GET['id'] ?? null;

        if (!$id_partida_guardada) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_id_no_especificado');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $partida = $this->partidaGuardada->obtenerPorId($id_partida_guardada, $id_usuario);

        if ($partida) {
            $respuesta['exito'] = true;
            $respuesta['estado_juego'] = $partida['estado_juego'];
        } else {
            http_response_code(404);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_no_encontrada');
        }

        echo json_encode($respuesta);
    }

    public function eliminar() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('partida_error_eliminar')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_partida_guardada = $_POST['id_partida'] ?? null;

        if (!$id_partida_guardada) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_id_no_especificado');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];

        if ($this->partidaGuardada->eliminar($id_partida_guardada, $id_usuario)) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('partida_eliminada_exito');
        } else {
            http_response_code(404);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_no_encontrada_o_permiso');
        }

        echo json_encode($respuesta);
    }

    public function guardarFinalizada() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => ''];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $datosRecibidos = json_decode(file_get_contents('php://input'), true);

        if (empty($datosRecibidos) || !isset($datosRecibidos['estado_juego']) || !isset($datosRecibidos['nombre_partida'])) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_datos_incompletos_finalizada');
            echo json_encode($respuesta);
            return;
        }

        $nombrePartida = trim($datosRecibidos['nombre_partida']);
        if (empty($nombrePartida)) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_nombre_vacio_finalizada');
            echo json_encode($respuesta);
            return;
        }

        $this->partidaFinalizada->id_usuario = $_SESSION['id_usuario'];
        $this->partidaFinalizada->nombre_partida = $nombrePartida;
        $this->partidaFinalizada->estado_juego = $datosRecibidos['estado_juego'];

        if ($this->partidaFinalizada->guardar()) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('historial_guardado_exito'); // Usamos la clave existente
        } else {
            http_response_code(500);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_guardar_historial_db');
        }

        echo json_encode($respuesta);
    }

    public function obtenerFinalizadas() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => '', 'partidas' => []];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $stmt = $this->partidaFinalizada->obtenerPorUsuario($id_usuario);

        if ($stmt) {
            $partidas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $respuesta['exito'] = true;
            $respuesta['partidas'] = $partidas;
        } else {
            http_response_code(500);
            $respuesta['mensaje'] = $this->traductor->traducir('historial_error_carga'); // Usamos clave existente
        }

        echo json_encode($respuesta);
    }

    public function cargarFinalizada() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => ''];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_partida_finalizada = $_GET['id'] ?? null;

        if (!$id_partida_finalizada) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_id_no_especificado');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];
        $partida = $this->partidaFinalizada->obtenerPorId($id_partida_finalizada, $id_usuario);

        if ($partida) {
            $respuesta['exito'] = true;
            $respuesta['estado_juego'] = $partida['estado_juego'];
        } else {
            http_response_code(404);
            $respuesta['mensaje'] = $this->traductor->traducir('historial_error_no_encontrada');
        }

        echo json_encode($respuesta);
    }

    public function eliminarFinalizada() {
        header('Content-Type: application/json');
        $respuesta = ['exito' => false, 'mensaje' => $this->traductor->traducir('historial_error_eliminar')];

        if (!isset($_SESSION['id_usuario'])) {
            http_response_code(403);
            $respuesta['mensaje'] = $this->traductor->traducir('error_acceso_denegado_sesion');
            echo json_encode($respuesta);
            return;
        }

        $id_partida_finalizada = $_POST['id_partida'] ?? null;

        if (!$id_partida_finalizada) {
            http_response_code(400);
            $respuesta['mensaje'] = $this->traductor->traducir('partida_error_id_no_especificado');
            echo json_encode($respuesta);
            return;
        }

        $id_usuario = $_SESSION['id_usuario'];

        if ($this->partidaFinalizada->eliminar($id_partida_finalizada, $id_usuario)) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = $this->traductor->traducir('historial_eliminada_exito');
        } else {
            http_response_code(404);
             $respuesta['mensaje'] = $this->traductor->traducir('historial_error_no_encontrada_o_permiso');
        }

        echo json_encode($respuesta);
    }
}
?>
