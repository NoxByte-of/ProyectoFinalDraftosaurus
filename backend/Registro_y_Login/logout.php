<?php

session_start();

require_once '../config/Database.php';
require_once '../controllers/AuthController.php';

try {
    $db = Database::obtenerInstancia()->obtenerConexion();
    $controladorAuth = new AuthController($db);
    $controladorAuth->logout();

} catch (Exception $e) {
    header("Location: ../../index.php");
    exit;
}
?>
