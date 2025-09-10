<?php

require_once '../config/conexion.php';

header('Content-Type: application/json');

$respuesta = ['exito' => false, 'mensaje' => ''];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombreUsuario = $_POST['nombre_usuario'] ?? null;
    $email = $_POST['email'] ?? null;
    $edad = $_POST['edad'] ?? null;
    $contrasena = $_POST['contrasena'] ?? null;

    if (!$nombreUsuario || !$email || !$edad || !$contrasena) {
        $respuesta['mensaje'] = 'Todos los campos son obligatorios.';
        echo json_encode($respuesta);
        exit;
    }

    $stmt = $conexion->prepare("SELECT id_usuario FROM usuario WHERE nombre_usuario = ? OR email = ?");
    $stmt->bind_param("ss", $nombreUsuario, $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $respuesta['mensaje'] = 'El nombre de usuario o el correo electrónico ya están en uso.';
        $stmt->close();
        $conexion->close();
        echo json_encode($respuesta);
        exit;
    }
    $stmt->close();

    $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);

    $stmt = $conexion->prepare("INSERT INTO usuario (nombre_usuario, email, edad, contrasena) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $nombreUsuario, $email, $edad, $contrasenaHasheada);

    if ($stmt->execute()) {
        $respuesta['exito'] = true;
        $respuesta['mensaje'] = "¡Registro exitoso, $nombreUsuario! Ahora puedes iniciar sesión.";
    } else {
        $respuesta['mensaje'] = 'Error al registrar el usuario: ' . $stmt->error;
    }

    $stmt->close();
    $conexion->close();

} else {
    $respuesta['mensaje'] = 'Método de solicitud no válido.';
}

echo json_encode($respuesta);
?>
