
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
<<<<<<< HEAD

<body>
	<!-- SECCION HEADER -->
	<header class="header">
		<nav class="navbar bg-custom navbar-expand-lg  position-relative">
			<div class="container-fluid d-flex align-items-center justify-content-between">
				<img src="../assets/img/logo-draftosaurus.png" alt="Logo Draftosaurus" class="logo-img">
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
					aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav ms-auto">
						<li class="nav-item">
							<a class="nav-link" href="../index.php">Inicio</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="pages/app.php">Seguimiento</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="juego.php">Juego</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="registro.php">Registrarse</a>
						</li>
						<li class="nav-item">
							<a class="nav-link btn-login" href="login.php">Iniciar Sesión</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</header>

	<!-- FIN DE SECCION HEADER -->
	<main>
		
		<!-- FORMULARIO PARA INGRESO DE JUGADORES -->
		<div class="container py-5">
			<div class="row justify-content-center">
				<div class="col-md-8 col-lg-6">
					<div class="card shadow rounded-4 border-0">
						<div class="card-body p-4">
							<h1 class="card-title text-center mb-4 text-warning-emphasis">Draftosaurus - Nuevo
								Seguimiento</h1>
							<!-- Tiene una alerta hecha con bootstrap para se muestre que es importante ingresarlos en orden, editarlo luego -->
							<p class="alert alert-danger">Seleccionar cantidad de jugadores con su nombre, ingresarlos en el sentido de la ronda</p>
							<form>
								<!-- Cantidad de jugadores, luego con JS debe haber un codigo para que muestre la cantidad de opciones para escribir los nombres de los jugadores, segun la cantidad de jugadores que el usuario seleccione -->
								<div class="mb-3">
									<label for="cantidad-jugadores" class="form-label">Cantidad de jugadores</label>
									<select class="form-select" id="cantidad-jugadores" name="cantidad-jugadores">
										<option selected disabled>Selecciona una opción</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
									</select>
								</div>

								<!-- Nombres de jugadores, luego con JS debe haber un codigo para que muestre la cantidad de opciones para escribir los nombres de los jugadores, segun la cantidad de jugadores que el usuario seleccione -->
								<div class="mb-3">
									<label class="form-label">Nombres de los jugadores</label>
									<input type="text" class="form-control mb-2" name="jugador1" placeholder="Jugador 1"
										required>
									<input type="text" class="form-control mb-2" name="jugador2" placeholder="Jugador 2"
										required>
									<input type="text" class="form-control mb-2" name="jugador3"
										placeholder="Jugador 3">
									<input type="text" class="form-control mb-2" name="jugador4"
										placeholder="Jugador 4">
								</div>

								<!-- Botón para iniciar, cambiar el estilo del boton -->
								<div class="d-grid">
									<button type="submit" class="btn btn-warning text-white fw-bold">Iniciar
										Partida</button>
								</div>
							</form>

						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- El mapa tiene un d-none(Display none) hecho con bootstrap para que no se muestre, con JS, luego de enviar el form, debe haber un codigo para que se muestre, por ahora queda así -->
		<div class="container p-5">
			<div class="row">
				<div class="col-12 col-md-6 text-end p-0">
					<img src="../assets/img/1.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
				</div>
				<div class="col-12 col-md-6 p-0">
					<img src="../assets/img/2.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
				</div>
				<div class="col-12 col-md-6 text-end p-0">
					<img src="../assets/img/3.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
				</div>
				<div class="col-12 col-md-6 p-0">
					<img src="../assets/img/4.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
				</div>
				<div class="col-12 col-md-6 text-end p-0">
					<img src="../assets/img/5.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
				</div>
				<div class="col-12 col-md-6 p-0">
					<img src="../assets/img/6.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
				</div>
			</div>
		</div>
	</main>
	<!-- FOOTER -->
	<footer class="bg-custom text-center text-lg-start mt-5">
		<div class="container p-4">
			<p class="mb-1">© NoxByte. Todos los derechos reservados.</p>
			<p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
		</div>
	</footer>
	<!-- FIN DEL FOOTER -->}
	 
=======

<body>
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
  <main>
    <!-- FORMULARIO PARA INGRESO DE JUGADORES -->
    <div class="container py-5 d-none">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow rounded-4 border-0">
            <div class="card-body p-4">
              <h1 class="card-title text-center mb-4 text-warning-emphasis">Draftosaurus - Nuevo Seguimiento</h1>
              <!-- Tiene una alerta hecha con bootstrap para se muestre que es importante ingresarlos en orden, editarlo luego -->
              <p class="alert alert-danger">Seleccionar cantidad de jugadores con su nombre, ingresarlos en el sentido de
                la ronda</p>
              <form>
                <!-- Cantidad de jugadores, luego con JS debe haber un codigo para que muestre la cantidad de opciones para escribir los nombres de los jugadores, segun la cantidad de jugadores que el usuario seleccione -->
                <div class="mb-3">
                  <label for="cantidad-jugadores" class="form-label">Cantidad de jugadores</label>
                  <select class="form-select" id="cantidad-jugadores" name="cantidad-jugadores">
                    <option selected disabled>Selecciona una opción</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <!-- Nombres de jugadores, luego con JS debe haber un codigo para que muestre la cantidad de opciones para escribir los nombres de los jugadores, segun la cantidad de jugadores que el usuario seleccione -->
                <div class="mb-3">
                  <label class="form-label">Nombres de los jugadores</label>
                  <input type="text" class="form-control mb-2" name="jugador1" placeholder="Jugador 1" required>
                  <input type="text" class="form-control mb-2" name="jugador2" placeholder="Jugador 2" required>
                  <input type="text" class="form-control mb-2" name="jugador3" placeholder="Jugador 3">
                  <input type="text" class="form-control mb-2" name="jugador4" placeholder="Jugador 4">
                </div>

                <!-- Botón para iniciar, cambiar el estilo del boton -->
                <div class="d-grid">
                  <button type="submit" class="btn btn-warning text-white fw-bold">Iniciar Partida</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- El mapa tiene un d-none(Display none) hecho con bootstrap para que no se muestre, con JS, luego de enviar el form, debe haber un codigo para que se muestre, por ahora queda así -->
    <div class="container p-5">
      <div class="row">
        <div class="col-12 col-md-6 text-end p-0">
          <img src="../assets/img/1.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
        </div>
        <div class="col-12 col-md-6 p-0">
          <img src="../assets/img/2.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
        </div>
        <div class="col-12 col-md-6 text-end p-0">
          <img src="../assets/img/3.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
        </div>
        <div class="col-12 col-md-6 p-0">
          <img src="../assets/img/4.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
        </div>
        <div class="col-12 col-md-6 text-end p-0">
          <img src="../assets/img/5.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
        </div>
        <div class="col-12 col-md-6 p-0">
          <img src="../assets/img/6.jpg" class="img-fluid mx-auto d-block" style="width: 60%;" alt="">
        </div>
      </div>
    </div>
  </main>
  <!-- FOOTER -->
  <footer class="bg-custom text-center text-lg-start mt-auto">
    <div class="container p-4">
      <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
      <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
    </div>
  </footer>
  <!-- FIN DEL FOOTER -->
>>>>>>> b8caf35fbddb00ed3ca536ea896d17443103bdd9
</body>

</html>