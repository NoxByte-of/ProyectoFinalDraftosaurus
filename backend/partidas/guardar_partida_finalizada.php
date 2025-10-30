<?php

session_start();

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/PartidaController.php';

try {
    $db = Database::obtenerInstancia()->obtenerConexion();
    $controladorPartida = new PartidaController($db);
    $controladorPartida->guardarFinalizada();

} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500); 
    echo json_encode(['exito' => false, 'mensaje' => 'Error interno del servidor: ' . $e->getMessage()]);
}

