<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'administrador') {
    http_response_code(403);
    echo json_encode(['exito' => false, 'mensaje' => 'Acceso denegado.']);
    exit();
}

require_once '../config/Database.php';
require_once '../controllers/AdminController.php';

try {
    $db = Database::obtenerInstancia()->obtenerConexion();
    $controladorAdmin = new AdminController($db);
    $controladorAdmin->obtenerUsuarios();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Error interno del servidor: ' . $e->getMessage()]);
}
