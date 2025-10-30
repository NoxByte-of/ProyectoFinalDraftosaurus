<?php
session_start();

require_once '../config/Database.php';
require_once '../controllers/AuthController.php';

try {
    $db = Database::obtenerInstancia()->obtenerConexion();
    
    $controladorAuth = new AuthController($db);
    
    $controladorAuth->login();

} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['exito' => false, 'mensaje' => 'Ha ocurrido un error inesperado: ' . $e->getMessage()]);
}


