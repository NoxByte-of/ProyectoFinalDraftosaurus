<?php

session_start();

require_once '../config/Database.php';
require_once '../controllers/AjustesController.php';

try {
    $db = Database::obtenerInstancia()->obtenerConexion();
    $controladorAjustes = new AjustesController($db);
    $controladorAjustes->cambiarContrasena();

} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Ha ocurrido un error inesperado: ' . $e->getMessage()]);
}
?>
