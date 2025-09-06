<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partidas Guardadas - Draftosaurus - NoxByte</title>

    <!-- Nuevas Fuentes y Bootstrap -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Piedra&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Darumadrop+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <header>
        <h1>Partidas Guardadas</h1>
    </header>

    <main class="main-partidas-guardadas">
        <div class="panel-partidas">
            <h2>Partidas Recientes</h2>
            <div class="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Resultado</th>
                            <th>Puntaje Total</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Victoria de Jugador 1</td>
                            <td>32</td>
                            <td>2025-06-01</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Empate (Jugador 1 y Jugador 2)</td>
                            <td>28</td>
                            <td>2025-05-30</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Victoria de Jugador 4</td>
                            <td>29</td>
                            <td>2025-05-28</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Victoria de Jugador 3</td>
                            <td>27</td>
                            <td>2025-05-25</td>
                        </tr>
                        <!-- esto es un boceto, se añaden dinamicamente las partidas en el futuro -->
                    </tbody>
                </table>
            </div>
        </div>

        <a href="../index.php" class="btn-menu btn-volver">Volver al Menú</a>
    </main>

<footer class="bg-custom text-center text-lg-start mt-5">
     <div class="container p-4">
       <p class="mb-1">© <?= date("Y") ?> NoxByte. Todos los derechos reservados.</p>
       <p class="mb-0">📧 Contacto: <a href="mailto:noxbyte.of@gmail.com">noxbyte.of@gmail.com</a></p>
      </div>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>
