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
  <link rel="stylesheet" href="../assets/css/reglas.css">
  <link rel="stylesheet" href="../assets/css/footer.css">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
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
              <a class="nav-link" aria-current="page" href="../index.php">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Seguimiento</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Juego</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="pages/registro.php">Registrarse</a>
            </li>
            <li class="nav-item">
              <a class="nav-link btn-login" href="pages/login.php">Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <!-- FIN DE SECCION HEADER -->
<div class="container p-5">
  <div class="row">
    <div class="col-12 text-center">
      <h1>Reglas del juego</h1>
     
<div id="textoCarousel" class="carousel slide" data-bs-ride="false">
  <div class="carousel-inner text-center p-5 bg-transparent">
    <div class="carousel-item active">
      <h2>Inicio</h2><br>
      <p>Cada jugador tendrá un tablero. Según la cantidad de jugadores</p>
      <p>se pondrán la siguiente cantidad de dinosaurios en la bolsa:</p><br>
      <p> -2 y 4 jugadores: 48 dinosaurios (retirar 2 por especie).</p>
      <p> -3 jugadores: 36 dinosaurios (retirar 4 por especie).</p>
      <p> -5 jugadores: Se usarán los 60 dinosaurios.</p><br>
      <p>El jugador más joven lanza el dado.</p>
    </div>
    <div class="carousel-item">
      <h2>Cómo jugar</h2><br>
      <p>El juego tiene 2 rondas de 6 turnos, en cada turno se darán seis dinosaurios aleatorios</p>
      <p>Exceptuando quién lance el dado, se deberá colocar un dinosaurio</p>
      <p>por ronda siguiendo las reglas y limitaciones dadas por el dado.</p>
      <p>Una vez todos hayan colocado su dinosaurio, se pasarán los restantes al</p>
      <p>siguiente jugador hasta terminar los turnos. En la siguiente ronda se repite el proceso.</p>
    </div>
    <div class="carousel-item">
      <h2>Frase 3</h2>
      <p>Este es el tercer texto del carrusel.</p>
    </div>
  </div>

  <!-- Controles -->
  <button class="carousel-control-prev" type="button" data-bs-target="#textoCarousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
    <span class="visually-hidden">Anterior</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#textoCarousel" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
    <span class="visually-hidden">Siguiente</span>
  </button>
</div>
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