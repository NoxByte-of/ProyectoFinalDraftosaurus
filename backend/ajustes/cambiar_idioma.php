<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require_once '../config/Database.php';
require_once '../controllers/AjustesController.php';

try {
    $db = Database::obtenerInstancia()->obtenerConexion();
    $controladorAjustes = new AjustesController($db);
    $controladorAjustes->cambiarIdiomaPreferido();

} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    error_log("Error en cambiar_idioma.php: " . $e->getMessage());
    echo json_encode(['exito' => false, 'mensaje' => 'Ha ocurrido un error inesperado al intentar cambiar el idioma.']);
}


