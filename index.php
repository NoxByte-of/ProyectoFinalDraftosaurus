<?php include("includes/header.php"); ?>

<header>
  <section class="seccion-juego py-5">
    <div class="container">
      <div class="row align-items-start">
        <!-- Partidas Recientes -->
        <div class="col-md-6">
          <h2>Partidas Recientes</h2>
          <div class="table-responsive">
            <table class="table table-striped table-bordered">
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
            <p>Demuestra que sos el mejor estratega jurásico.</p>
            <button class="btn mb-2">Jugar ahora!</button>
          </div>
          <div class="text-center">
            <h2>¡Registra tu partida!</h2>
            <p>Ingresa los detalles de tu partida física con la app de seguimiento para llevar un registro completo.</p>
            <button class="btn">Registrar ahora</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</header>
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
        <p>El juego se juega en rondas, donde cada jugador elige un dinosaurio de su mano y lo coloca en su parque. Al
          final de la partida, se cuentan los puntos basados en la disposición de los dinosaurios y sus tipos.</p>
      </div>
    </div>
  </div>

  <?php include("includes/footer.php"); ?>