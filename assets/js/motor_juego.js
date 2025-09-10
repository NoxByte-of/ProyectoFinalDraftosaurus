/**
Contiene lógica principal, las reglas y los calculos de puntuación
  se comparte para ambos modos digital y seguimiento para no  duplicar codigo
 */

// toda la lógica en un objeto global y se llama a esto para aplicarlo al modo digital y seguimiento
window.MotorJuego = (function() {

    const TIPOS_DINO = ["t-rex", "spinosaurus", "brachiosaurus", "triceratops", "parasaurolophus", "stegosaurus"];


    /**
    Pradera del Amor
     */
    const calcularPraderaAmor = (dinos) => {
        const conteos = {};
        dinos.forEach(dino => conteos[dino.type || dino.especie] = (conteos[dino.type || dino.especie] || 0) + 1);
        let pares = 0;
        Object.values(conteos).forEach(conteo => pares += Math.floor(conteo / 2));
        return pares * 5;
    };

    /**
    trio frondoso
     */
    const calcularTrioFrondoso = (dinos) => (dinos.length === 3) ? 7 : 0;

    /**
     bosque de la semejanza
     */
    const calcularBosqueSemejanza = (dinos) => {
        if (dinos.length === 0) return 0;
        const primeraEspecie = dinos[0].type || dinos[0].especie;
        if (!dinos.every(dino => (dino.type || dino.especie) === primeraEspecie)) return 0;
        const puntosPorCantidad = { 1: 2, 2: 4, 3: 8, 4: 12, 5: 18, 6: 24 };
        return puntosPorCantidad[dinos.length] || 0;
    };

    /**
    prado de la diferencia
     */
    const calcularPradoDiferencia = (dinos) => {
        const especiesUnicas = new Set(dinos.map(d => d.type || d.especie));
        if (especiesUnicas.size !== dinos.length) return 0;
        const puntosPorCantidad = { 1: 1, 2: 3, 3: 6, 4: 10, 5: 15, 6: 21 };
        return puntosPorCantidad[dinos.length] || 0;
    };

    /**
    rey de la selva
     */
    const calcularReySelva = (jugadorActual, todosLosJugadores) => {
        const tableroActual = jugadorActual.tablero || jugadorActual.parque;
        const dinoEnRecinto = tableroActual.reySelva[0];
        if (!dinoEnRecinto) return 0;

        const tipoDino = dinoEnRecinto.type || dinoEnRecinto.especie;
        const conteoEsteJugador = Object.values(tableroActual).flat().filter(d => (d.type || d.especie) === tipoDino).length;

        const esElRey = todosLosJugadores.every(otroJugador => {
            if (otroJugador === jugadorActual) return true;
            const tableroOtro = otroJugador.tablero || otroJugador.parque;
            const conteoOtroJugador = Object.values(tableroOtro).flat().filter(d => (d.type || d.especie) === tipoDino).length;
            return conteoEsteJugador >= conteoOtroJugador;
        });

        return esElRey ? 7 : 0;
    };

    /**
     isla solitaria
     */
    const calcularIslaSolitaria = (dinoEnIsla, parqueCompleto) => {
        if (dinoEnIsla.length === 0) return 0;
        const tipoDino = dinoEnIsla[0].type || dinoEnIsla[0].especie;
        const conteoTotal = parqueCompleto.filter(d => (d.type || d.especie) === tipoDino).length;
        return conteoTotal === 1 ? 7 : 0;
    };

    /**
     extra T-Rex (excluyendo río).
     */
    const calcularBonusTRex = (tablero) => {
        let bono = 0;
        for (const claveRecinto in tablero) {
            if (claveRecinto !== 'rio' && tablero[claveRecinto].some(d => (d.type || d.especie) === 't-rex')) {
                bono++;
            }
        }
        return bono;
    };

    /**
     puntuación total de un jugador
     */
    function calcularPuntuacionTotal(jugador, todosLosJugadores) {
    
        const tablero = jugador.tablero || jugador.parque;
        if (!tablero) return { puntajes: {}, total: 0 };

        const parqueCompleto = Object.values(tablero).flat();
        let puntajes = {};

        puntajes.praderaAmor = calcularPraderaAmor(tablero.praderaAmor);
        puntajes.trioFrondoso = calcularTrioFrondoso(tablero.trioFrondoso);
        puntajes.bosqueSemejanza = calcularBosqueSemejanza(tablero.bosqueSemejanza);
        puntajes.pradoDiferencia = calcularPradoDiferencia(tablero.pradoDiferencia);
        puntajes.rio = tablero.rio.length;
        puntajes.islaSolitaria = calcularIslaSolitaria(tablero.islaSolitaria, parqueCompleto);
        puntajes.bonusTRex = calcularBonusTRex(tablero);
        puntajes.reySelva = calcularReySelva(jugador, todosLosJugadores);

        const total = Object.values(puntajes).reduce((sum, val) => sum + val, 0);

        return { puntajes, total };
    }

    
    return {
        calcularPuntuacionTotal,
        TIPOS_DINO
    };

})();
