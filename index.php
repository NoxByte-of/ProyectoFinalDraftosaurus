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
                <tr><th>1</th><td>Jugador1</td><td>3500</td><td>2025-06-01</td></tr>
                <tr><th>2</th><td>Jugador2</td><td>2800</td><td>2025-05-30</td></tr>
                <tr><th>3</th><td>Jugador3</td><td>3200</td><td>2025-05-28</td></tr>
                <tr><th>4</th><td>Jugador4</td><td>4000</td><td>2025-05-25</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección Jugar -->
        <div class="col-md-6 text-center mt-4 mt-md-0">
          <h2>¡Juega Draftosaurus!</h2>
          <p>Demuestra que sos el mejor estratega jurásico.</p>
          <button class="btn btn-success">Jugar ahora</button>
          
        </div>
      </div>
    </div>
  </section>
</header>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-SvWIf0XJL7wDDqd9d15qg6KGkEVfTl6lR6c50v4+oE2+p5TwqOETJ+5uVr6UQkkY" 
        crossorigin="anonymous"></script>
<?php include("includes/footer.php"); ?>

