<?php

session_start();

require_once '../config/Database.php';
require_once '../controllers/AjustesController.php';

try {
   
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Content-Type: application/json');
        http_response_code(405); 
        echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
        exit();
    }
    
    $db = Database::obtenerInstancia()->obtenerConexion();
    $controladorAjustes = new AjustesController($db);
    $controladorAjustes->eliminarCuenta();

} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Ha ocurrido un error inesperado: ' . $e->getMessage()]);
}

