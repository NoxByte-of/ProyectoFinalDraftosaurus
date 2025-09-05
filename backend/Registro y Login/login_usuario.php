<?php
// backend/Registro y Login/login_usuario.php

// Incluimos el archivo de conexión.
require_once '../config/conexion.php';

// Inicia la sesión para poder guardar información del usuario.
session_start();

header('Content-Type: application/json');
$respuesta = ['exito' => false, 'mensaje' => ''];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombreUsuario = $_POST['nombre_usuario'] ?? null;
    $contrasena = $_POST['contrasena'] ?? null;

    if (!$nombreUsuario || !$contrasena) {
        $respuesta['mensaje'] = 'El nombre de usuario y la contraseña son obligatorios.';
        echo json_encode($respuesta);
        exit;
    }

    // --- Búsqueda del usuario en la base de datos ---
    $stmt = $conexion->prepare("SELECT id_usuario, contrasena FROM usuario WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $nombreUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        // El usuario existe, ahora verificamos la contraseña.
        $usuario = $resultado->fetch_assoc();
        
        // Compara la contraseña enviada con la hasheada en la base de datos.
        if (password_verify($contrasena, $usuario['contrasena'])) {
            // La contraseña es correcta.
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = "¡Bienvenido de nuevo, $nombreUsuario!";

            // Guarda información del usuario en la sesión.
            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nombre_usuario'] = $nombreUsuario;

        } else {
            // La contraseña es incorrecta.
            $respuesta['mensaje'] = 'Nombre de usuario o contraseña incorrectos.';
        }
    } else {
        // El usuario no existe.
        $respuesta['mensaje'] = 'Nombre de usuario o contraseña incorrectos.';
    }

    $stmt->close();
    $conexion->close();

} else {
    $respuesta['mensaje'] = 'Método de solicitud no válido.';
}

echo json_encode($respuesta);
?>
