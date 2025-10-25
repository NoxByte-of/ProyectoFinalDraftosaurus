<?php

class Usuario {
    private $conexion;
    private $nombre_tabla = "usuario";

    public $id_usuario;
    public $nombre_usuario;
    public $email;
    public $contrasena;
    public $edad;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function contarTotal() {
        $query = "SELECT COUNT(id_usuario) as total FROM " . $this->nombre_tabla;
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$resultado['total'];
    }

    public function obtenerTodos() {
        $query = "SELECT 
                    id_usuario, 
                    nombre_usuario, 
                    email, 
                    edad, 
                    rol,
                    fecha_registro, 
                    idioma_preferido, 
                    fecha_ultimo_cambio_nombre 
                  FROM " . $this->nombre_tabla . " 
                  ORDER BY FIELD(rol, 'administrador', 'jugador'), fecha_registro DESC";
        
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        return $stmt;
    }
 
    public function actualizarCampoPorAdmin($id_usuario, $campo, $valor) {
        $campos_permitidos = ['nombre_usuario', 'edad'];
        if (!in_array($campo, $campos_permitidos)) {
            return ['exito' => false, 'mensaje' => 'El campo especificado no se puede editar.'];
        }

        if ($campo === 'nombre_usuario') {
            if (empty(trim($valor))) {
                return ['exito' => false, 'mensaje' => 'El nombre de usuario no puede estar vacío.'];
            }
            if ($this->nombreUsuarioExiste($valor, $id_usuario)) {
                return ['exito' => false, 'mensaje' => 'Ese nombre de usuario ya está en uso.'];
            }
        }

        if ($campo === 'edad') {
            if (!is_numeric($valor) || $valor < 0) {
                return ['exito' => false, 'mensaje' => 'La edad debe ser un número válido.'];
            }
        }

        $query = "UPDATE " . $this->nombre_tabla . " SET " . $campo . " = :valor WHERE id_usuario = :id_usuario";
        
        try {
            $stmt = $this->conexion->prepare($query);
            $stmt->bindParam(':valor', $valor);
            $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                return ['exito' => true, 'mensaje' => 'Dato actualizado correctamente.'];
            } else {
                return ['exito' => false, 'mensaje' => 'Error al ejecutar la actualización.'];
            }
        } catch (PDOException $e) {
            return ['exito' => false, 'mensaje' => 'Error de base de datos: ' . $e->getMessage()];
        }
    }

    public function crear() {
        $query = "INSERT INTO " . $this->nombre_tabla . "
                  SET
                    nombre_usuario = :nombre_usuario,
                    email = :email,
                    edad = :edad,
                    contrasena = :contrasena";

        $stmt = $this->conexion->prepare($query);

        $this->nombre_usuario = htmlspecialchars(strip_tags($this->nombre_usuario));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->edad = htmlspecialchars(strip_tags($this->edad));
        
        $this->contrasena = password_hash($this->contrasena, PASSWORD_DEFAULT);

        $stmt->bindParam(':nombre_usuario', $this->nombre_usuario);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':edad', $this->edad);
        $stmt->bindParam(':contrasena', $this->contrasena);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function nombreUsuarioOEmailExisten() {
        $query = "SELECT id_usuario FROM " . $this->nombre_tabla . "
                  WHERE nombre_usuario = :nombre_usuario OR email = :email
                  LIMIT 1";

        $stmt = $this->conexion->prepare($query);
        $this->nombre_usuario = htmlspecialchars(strip_tags($this->nombre_usuario));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':nombre_usuario', $this->nombre_usuario);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }

    
    public function nombreUsuarioExiste($nombre_usuario, $id_usuario_actual) {
        $query = "SELECT id_usuario FROM " . $this->nombre_tabla . "
                  WHERE nombre_usuario = :nombre_usuario AND id_usuario != :id_usuario_actual
                  LIMIT 1";

        $stmt = $this->conexion->prepare($query);
        $nombre_usuario_limpio = htmlspecialchars(strip_tags($nombre_usuario));
        $stmt->bindParam(':nombre_usuario', $nombre_usuario_limpio);
        $stmt->bindParam(':id_usuario_actual', $id_usuario_actual);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function buscarPorNombreUsuario() {
        $query = "SELECT id_usuario, nombre_usuario, contrasena, rol FROM " . $this->nombre_tabla . "
                  WHERE nombre_usuario = :nombre_usuario
                  LIMIT 1";
        
        $stmt = $this->conexion->prepare($query);
        $this->nombre_usuario = htmlspecialchars(strip_tags($this->nombre_usuario));
        $stmt->bindParam(':nombre_usuario', $this->nombre_usuario);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function buscarPorId($id_usuario) {
        $query = "SELECT * FROM " . $this->nombre_tabla . " WHERE id_usuario = :id_usuario LIMIT 1";
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        if ($stmt->rowCount() == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function actualizarNombre($id_usuario, $nuevo_nombre_usuario) {
        $usuario = $this->buscarPorId($id_usuario);
        
        if ($usuario['fecha_ultimo_cambio_nombre'] !== null) {
            try {
                $fecha_ultimo_cambio = new DateTime($usuario['fecha_ultimo_cambio_nombre']);
                $fecha_permitida = $fecha_ultimo_cambio->add(new DateInterval('P30D'));
                $ahora = new DateTime();

                if ($ahora < $fecha_permitida) {
                    $intervalo = $ahora->diff($fecha_permitida);
                    $dias_restantes = $intervalo->days + 1;
                    return [
                        'exito' => false,
                        'mensaje' => '',
                        'dias_restantes' => $dias_restantes
                    ];
                }
            } catch (Exception $e) {
                return ['exito' => false, 'mensaje' => 'Error al procesar la fecha del último cambio.'];
            }
        }
        
        if ($this->nombreUsuarioExiste($nuevo_nombre_usuario, $id_usuario)) {
             return ['exito' => false, 'mensaje' => 'Ese nombre de usuario ya está en uso. Por favor, elige otro.'];
        }

        $query = "UPDATE " . $this->nombre_tabla . " 
                  SET nombre_usuario = :nuevo_nombre_usuario, fecha_ultimo_cambio_nombre = CURDATE() 
                  WHERE id_usuario = :id_usuario";
        
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':nuevo_nombre_usuario', $nuevo_nombre_usuario);
        $stmt->bindParam(':id_usuario', $id_usuario);
        
        if ($stmt->execute()) {
            return ['exito' => true, 'mensaje' => '¡Nombre de usuario actualizado con éxito!'];
        }
        
        return ['exito' => false, 'mensaje' => 'Error al actualizar el nombre de usuario.'];
    }


    public function actualizarContrasena($id_usuario, $contrasena_actual, $nueva_contrasena) {
        $usuario = $this->buscarPorId($id_usuario);

        if (!$usuario || !password_verify($contrasena_actual, $usuario['contrasena'])) {
            return ['exito' => false, 'mensaje' => 'La contraseña actual es incorrecta.'];
        }

        $nueva_contrasena_hash = password_hash($nueva_contrasena, PASSWORD_DEFAULT);

        $query = "UPDATE " . $this->nombre_tabla . " SET contrasena = :nueva_contrasena WHERE id_usuario = :id_usuario";
        
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':nueva_contrasena', $nueva_contrasena_hash);
        $stmt->bindParam(':id_usuario', $id_usuario);

        if ($stmt->execute()) {
            return ['exito' => true, 'mensaje' => '¡Contraseña actualizada con éxito!'];
        }

        return ['exito' => false, 'mensaje' => 'Error al actualizar la contraseña.'];
    }

    public function eliminarPorId($id_usuario) {
        $query = "DELETE FROM " . $this->nombre_tabla . " WHERE id_usuario = :id_usuario";
        
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }

        return false;
    }
}
?>
