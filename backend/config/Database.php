<?php

class Database {
    private $host = 'localhost';
    private $db_nombre = 'draftosaurus_db';
    private $usuario = 'root';
    private $contrasena = '';
    private $conexion;

    private static $instancia = null;

    private function __construct() {
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_nombre . ';charset=utf8mb4';
        $opciones = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, 
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       
            PDO::ATTR_EMULATE_PREPARES   => false,                  
        ];

        try {
            $this->conexion = new PDO($dsn, $this->usuario, $this->contrasena, $opciones);
        } catch (PDOException $e) {
            die('Error de Conexión: ' . $e->getMessage());
        }
    }

    public static function obtenerInstancia() {
        if (self::$instancia == null) {
            self::$instancia = new Database();
        }
        return self::$instancia;
    }

    public function obtenerConexion() {
        return $this->conexion;
    }

    private function __clone() { }
    public function __wakeup() { }
}
?>
