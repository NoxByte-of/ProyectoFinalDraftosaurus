<?php
class Traductor {
 
    private $textos = [];

    private $idioma_actual;

    public function __construct($idioma) {
        $this->idioma_actual = $idioma;
        $ruta_archivo = __DIR__ . '/../lang/' . $idioma . '.json';

        if (file_exists($ruta_archivo)) {
            $json_contenido = file_get_contents($ruta_archivo);
            $this->textos = json_decode($json_contenido, true);
        } else {
            error_log("Archivo de idioma no encontrado: " . $ruta_archivo);
        }
    }

    public function traducir($clave) {
        return $this->textos[$clave] ?? $clave;
    }

    public function obtenerIdiomaActual() {
        return $this->idioma_actual;
    }

    public function obtenerTodosLosTextos() {
        return $this->textos;
    }
}
?>

