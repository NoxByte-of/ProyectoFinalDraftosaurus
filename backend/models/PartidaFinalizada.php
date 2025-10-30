<?php

class PartidaFinalizada {
    private $conexion;
    private $nombre_tabla = "partida_finalizada";

    public $id_partida_finalizada;
    public $id_usuario;
    public $nombre_partida;
    public $estado_juego;
    public $fecha_guardado;

    public function __construct($db) {
        $this->conexion = $db;
    }

    public function contarTotal() {
        $query = "SELECT COUNT(id_partida_finalizada) as total FROM " . $this->nombre_tabla;
        $stmt = $this->conexion->prepare($query);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$resultado['total'];
    }

    public function guardar() {
        $query = "INSERT INTO " . $this->nombre_tabla . " 
                  SET
                    id_usuario = :id_usuario,
                    nombre_partida = :nombre_partida,
                    estado_juego = :estado_juego";
        
        $stmt = $this->conexion->prepare($query);

        $this->id_usuario = htmlspecialchars(strip_tags($this->id_usuario));
        $this->nombre_partida = htmlspecialchars(strip_tags($this->nombre_partida));

        $stmt->bindParam(':id_usuario', $this->id_usuario);
        $stmt->bindParam(':nombre_partida', $this->nombre_partida);
        $stmt->bindParam(':estado_juego', $this->estado_juego);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function obtenerPorUsuario($id_usuario) {
        $query = "SELECT id_partida_finalizada, nombre_partida, fecha_guardado 
                  FROM " . $this->nombre_tabla . "
                  WHERE id_usuario = :id_usuario
                  ORDER BY fecha_guardado DESC";

        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }

    public function obtenerPorId($id_partida_finalizada, $id_usuario) {
        $query = "SELECT estado_juego FROM " . $this->nombre_tabla . "
                  WHERE id_partida_finalizada = :id_partida_finalizada AND id_usuario = :id_usuario
                  LIMIT 1";
        
        $stmt = $this->conexion->prepare($query);
        $stmt->bindParam(':id_partida_finalizada', $id_partida_finalizada, PDO::PARAM_INT);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    public function eliminar($id_partida_finalizada, $id_usuario) {
        $query = "DELETE FROM " . $this->nombre_tabla . " 
                  WHERE id_partida_finalizada = :id_partida_finalizada AND id_usuario = :id_usuario";

        $stmt = $this->conexion->prepare($query);

        $stmt->bindParam(':id_partida_finalizada', $id_partida_finalizada, PDO::PARAM_INT);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                return true;
            }
        }
        return false;
    }
}

