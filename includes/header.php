<?php
// includes/header.php
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
<!-- etiqueta que puse para que no se visualice una version anterior de la pagina guardada en cache al trabajar e intentar verla en el navegador, se puede sacar despues -->
  <meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<!-- !! -->
<link rel="stylesheet" href="assets/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
  <title>Draftosaurus Online</title>
</head>

  <body>
  <nav class="navbar navbar-expand-lg navbar-light bg-custom">
    <div class="container-fluid">
      <img src="assets/img/logo-draftosaurus.png" alt="Draftosaurus Logo" class="logo-navbar" style="width: 150px; height: 200;margin-left: 30px;">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse w-100" id="navbarNav">
        <ul class="navbar-nav ms-auto text-center w-100 d-lg-flex justify-content-lg-end">
          <li class="nav-item ms-3">
            <a class="nav-link" href="#">Inicio</a>
          </li>
          <li class="nav-item ms-3">
            <a class="nav-link" href="#">Seguimiento</a>
          </li>
          <li class="nav-item ms-3">
            <a class="nav-link" href="#">Registrarse</a>
          </li>
          <li class="nav-item ms-3">
            <a class="nav-link btn-login mt-2 mt-lg-0" href="#">Iniciar sesión</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</body>

