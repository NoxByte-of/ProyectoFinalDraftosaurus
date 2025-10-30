<?php

class PartidaGuardada {
    private $conexion;
    private $nombre_tabla = "partida_guardada";
    public $id_partida_guardada;
    public $id_usuario;
    public $estado_juego;
    public $fecha_guardado;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function contarTotal() {
        $query = "SELECT COUNT(id_partida_guardada) as total FROM " . $this->nombre_tabla;
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$resultado['total'];
    }

    public function guardar() {
        $query = "INSERT INTO " . $this->nombre_tabla . " (id_usuario, estado_juego) VALUES (:id_usuario, :estado_juego)";
        
        $stmt = $this->conexion->prepare($query);

        $this->id_usuario = htmlspecialchars(strip_tags($this->id_usuario));

        $stmt->bindParam(':id_usuario', $this->id_usuario);
        $stmt->bindParam(':estado_juego', $this->estado_juego);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function obtenerPorUsuario($id_usuario) {
        $query = "SELECT id_partida_guardada, fecha_guardado FROM " . $this->nombre_tabla . "
                  WHERE id_usuario = :id_usuario
                  ORDER BY fecha_guardado DESC";

        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        
        return $stmt;
    }

    public function obtenerPorId($id_partida_guardada, $id_usuario) {
        $query = "SELECT estado_juego FROM " . $this->nombre_tabla . "
                  WHERE id_partida_guardada = :id_partida_guardada AND id_usuario = :id_usuario
                  LIMIT 1";
        
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_partida_guardada', $id_partida_guardada);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function eliminar($id_partida_guardada, $id_usuario) {
        $query = "DELETE FROM " . $this->nombre_tabla . " 
                  WHERE id_partida_guardada = :id_partida_guardada AND id_usuario = :id_usuario";

        $stmt = $this->conexion->prepare($query);

        $stmt->bindParam(':id_partida_guardada', $id_partida_guardada);
        $stmt->bindParam(':id_usuario', $id_usuario);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                return true;
            }
        }
        return false;
    }
}

