<?php
// backend/Registro y Login/registro_usuario.php

// Incluimos el archivo de conexión a la base de datos.
// require_once se asegura de que el archivo se incluya una sola vez y detiene el script si no lo encuentra.
require_once '../config/conexion.php';

// Establece la cabecera para indicar que la respuesta será en formato JSON.
header('Content-Type: application/json');

// Prepara un array para la respuesta JSON.
$respuesta = ['exito' => false, 'mensaje' => ''];

// Verifica que la solicitud sea de tipo POST.
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtiene los datos enviados desde el formulario (frontend).
    $nombreUsuario = $_POST['nombre_usuario'] ?? null;
    $email = $_POST['email'] ?? null;
    $edad = $_POST['edad'] ?? null;
    $contrasena = $_POST['contrasena'] ?? null;

    // Valida que todos los campos necesarios hayan sido recibidos.
    if (!$nombreUsuario || !$email || !$edad || !$contrasena) {
        $respuesta['mensaje'] = 'Todos los campos son obligatorios.';
        echo json_encode($respuesta);
        exit;
    }

    // --- Verificación de usuario o email existente ---
    // Prepara una consulta para evitar inyecciones SQL.
    $stmt = $conexion->prepare("SELECT id_usuario FROM usuario WHERE nombre_usuario = ? OR email = ?");
    $stmt->bind_param("ss", $nombreUsuario, $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Si ya existe un usuario con ese nombre o email, envía un error.
        $respuesta['mensaje'] = 'El nombre de usuario o el correo electrónico ya están en uso.';
        $stmt->close();
        $conexion->close();
        echo json_encode($respuesta);
        exit;
    }
    $stmt->close();

    // --- Inserción del nuevo usuario ---
    // Hashea la contraseña para almacenarla de forma segura. NUNCA guardes contraseñas en texto plano.
    $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);

    // Prepara la consulta de inserción.
    $stmt = $conexion->prepare("INSERT INTO usuario (nombre_usuario, email, edad, contrasena) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $nombreUsuario, $email, $edad, $contrasenaHasheada);

    // Ejecuta la consulta y verifica si fue exitosa.
    if ($stmt->execute()) {
        $respuesta['exito'] = true;
        $respuesta['mensaje'] = "¡Registro exitoso, $nombreUsuario! Ahora puedes iniciar sesión.";
    } else {
        $respuesta['mensaje'] = 'Error al registrar el usuario: ' . $stmt->error;
    }

    // Cierra la sentencia y la conexión.
    $stmt->close();
    $conexion->close();

} else {
    // Si el método no es POST, devuelve un error.
    $respuesta['mensaje'] = 'Método de solicitud no válido.';
}

// Devuelve la respuesta en formato JSON al frontend.
echo json_encode($respuesta);
?>
