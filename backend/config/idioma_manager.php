<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$idiomas_disponibles = ['es', 'en'];
$idioma_predeterminado = 'es';

$idioma_seleccionado = $idioma_predeterminado;

if (isset($_GET['lang']) && in_array($_GET['lang'], $idiomas_disponibles)) {
    $idioma_seleccionado = $_GET['lang'];
    $_SESSION['idioma'] = $idioma_seleccionado;
    setcookie('idioma', $idioma_seleccionado, time() + (365 * 24 * 60 * 60), "/");

} elseif (isset($_SESSION['idioma']) && in_array($_SESSION['idioma'], $idiomas_disponibles)) {
    $idioma_seleccionado = $_SESSION['idioma'];

} elseif (isset($_COOKIE['idioma']) && in_array($_COOKIE['idioma'], $idiomas_disponibles)) {
    $idioma_seleccionado = $_COOKIE['idioma'];
    $_SESSION['idioma'] = $idioma_seleccionado;

} elseif (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    $idioma_navegador = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
    if (in_array($idioma_navegador, $idiomas_disponibles)) {
        $idioma_seleccionado = $idioma_navegador;
        $_SESSION['idioma'] = $idioma_seleccionado;
        setcookie('idioma', $idioma_seleccionado, time() + (365 * 24 * 60 * 60), "/");
    }
}

if (!isset($_SESSION['idioma'])) {
    $_SESSION['idioma'] = $idioma_seleccionado;
}
if (!isset($_COOKIE['idioma'])) {
     setcookie('idioma', $idioma_seleccionado, time() + (365 * 24 * 60 * 60), "/");
}



