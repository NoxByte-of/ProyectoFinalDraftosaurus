<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
    crossorigin="anonymous"></script>
  <!-- etiqueta que puse para que no se visualice una version anterior de la pagina guardada en cache al trabajar e intentar verla en el navegador, se puede sacar despues -->
  <meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
  <!-- !! -->
  <link rel="stylesheet" href="../assets/css/header.css">
  <link rel="stylesheet" href="../assets/css/app.css">
  <link rel="stylesheet" href="../assets/css/footer.css">
  <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
  <title>Draftosaurus Online</title>
</head>
  <!-- SECCION HEADER -->
  <header class="header">
    <nav class="navbar  bg-custom navbar-expand-lg position-relative">
      <div class="container-fluid">
        <img src="../assets/img/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="#">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Seguimiento</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Juego</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Registrarse</a>
            </li>
            <li class="nav-item">
              <a class="nav-link btn-login" href="#">Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <!-- FIN DE SECCION HEADER -->
<div class="container p-5">
  <div class="row">
    <div class="col-12 col-sm-4 text-end p-0">
      <img src="../assets/img/1.jpg" class="img-fluid w-100" alt="">
    </div>
    <div class="col-12 col-sm-4 p-0">
      <img src="../assets/img/2.jpg" class="img-fluid w-100" alt="">
    </div>
    <div class="col-12 col-sm-4 text-end p-0">
      <img src="../assets/img/3.jpg" class="img-fluid w-100" alt="">
    </div>
    <div class="col-12 col-sm-4 p-0">
      <img src="../assets/img/4.jpg" class="img-fluid w-100" alt="">
    </div>
    <div class="col-12 col-sm-4 text-end p-0">
      <img src="../assets/img/5.jpg" class="img-fluid w-100" alt="">
    </div>
    <div class="col-12 col-sm-4 p-0">
      <img src="../assets/img/6.jpg" class="img-fluid w-100" alt="">
    </div>
  </div>
</div>

   <!-- FOOTER -->
  <footer class="bg-custom text-center text-lg-start mt-5">
    <div class="container p-4">
      <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
      <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
    </div>
  </footer>
<!-- FIN DEL FOOTER -->