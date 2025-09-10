<?php

require_once '../config/conexion.php';

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

    $stmt = $conexion->prepare("SELECT id_usuario, contrasena FROM usuario WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $nombreUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        
        if (password_verify($contrasena, $usuario['contrasena'])) {
            $respuesta['exito'] = true;
            $respuesta['mensaje'] = "¡Bienvenido de nuevo, $nombreUsuario!";

            $_SESSION['id_usuario'] = $usuario['id_usuario'];
            $_SESSION['nombre_usuario'] = $nombreUsuario;
        } else {
            $respuesta['mensaje'] = 'Nombre de usuario o contraseña incorrectos.';
        }
    } else {
        $respuesta['mensaje'] = 'Nombre de usuario o contraseña incorrectos.';
    }

    $stmt->close();
    $conexion->close();

} else {
    $respuesta['mensaje'] = 'Método de solicitud no válido.';
}

echo json_encode($respuesta);
?>
