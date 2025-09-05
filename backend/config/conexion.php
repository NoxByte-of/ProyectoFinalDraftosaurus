<?php

define('DB_HOST', 'localhost'); 
define('DB_USUARIO', 'root');   
define('DB_CONTRASENA', ''); 
define('DB_NOMBRE', 'draftosaurus_db'); 

$conexion = new mysqli(DB_HOST, DB_USUARIO, DB_CONTRASENA, DB_NOMBRE);

if ($conexion->connect_error) {
    die("Error de Conexión: " . $conexion->connect_error);
}

$conexion->set_charset("utf8mb4");

return $conexion;
?>
