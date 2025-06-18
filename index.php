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
  <link rel="stylesheet" href="assets/css/header.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/footer.css">
  <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
  <title>Draftosaurus Online</title>
</head>

<body>
  <!-- SECCION HEADER -->
   <!-- AJUSTAR IMAGEN DEL LOGO, SE VE MUY CHICA -->
  <header class="header">
  <nav class="navbar bg-custom navbar-expand-lg">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      <img src="assets/img/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="index.php">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="pages/app.php">Seguimiento</a>
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
  
  <main class="main-content h-100">
    <section class="seccion-juego py-5">
      <div class="container">
        <div class="row align-items-start">
          <!-- Partidas Recientes -->
          <div class="col-md-6">
            <h2>Partidas recientes</h2><br>
            <div class="table-responsive">
              <table class="table table-striped table-bordered custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Puntaje</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>Jugador1</td>
                    <td>3500</td>
                    <td>2025-06-01</td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Jugador2</td>
                    <td>2800</td>
                    <td>2025-05-30</td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>Jugador3</td>
                    <td>3200</td>
                    <td>2025-05-28</td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>Jugador4</td>
                    <td>4000</td>
                    <td>2025-05-25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Secciones de juego y seguimiento -->
          <div class="col-md-6 d-flex flex-column justify-content-center">
            <div class="mb-4 text-center">
              <h2>¡Juega Draftosaurus!</h2>
              <p>¡Demuestra que eres el mejor estratega jurásico!</p>
              <a href=""><button class="btn mb-2">¡Jugar ahora!</button></a>
            </div>
            <div class="text-center">
              <h2>¡Registra tu partida!</h2>
              <p>Ingresa los detalles de tu partida física con la app de seguimiento para llevar un registro completo.
              </p>
              <a href="pages/app.php"><button class="btn">Registrar ahora</button></a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="seccion-informacion py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h2>¿Cómo jugar?</h2>
            <p>Draftosaurus es un juego de mesa donde los jugadores deben crear el mejor parque jurásico posible. Cada
              jugador selecciona dinosaurios y los coloca estratégicamente en su parque para maximizar su puntaje.</p>
          </div>
          <div class="col-md-6">
            <h2>Reglas del juego</h2>
            <p>El juego se juega en rondas, donde cada jugador elige un dinosaurio de su mano y lo coloca en su parque.
              Al
              final de la partida, se cuentan los puntos basados en la disposición de los dinosaurios y sus tipos.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <!-- FOOTER -->
  <footer class="bg-custom text-center text-lg-start mt-5">
    <div class="container p-4">
      <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
      <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
    </div>
  </footer>

  <!-- FIN DEL FOOTER -->
</body>

</html>
