
class MotorJuego {

    static TIPOS_DINO = ["t-rex", "spinosaurus", "brachiosaurus", "triceratops", "parasaurolophus", "stegosaurus"];

    static contarTRex(jugador) {
        const tablero = jugador.tablero || jugador.parque;
        if (!tablero) return 0;
        return Object.values(tablero).flat().filter(d => (d.type || d.especie) === 't-rex').length;
    };

    static _calcularPraderaAmor(dinos) {
        const conteos = {};
        dinos.forEach(dino => conteos[dino.type || dino.especie] = (conteos[dino.type || dino.especie] || 0) + 1);
        let pares = 0;
        Object.values(conteos).forEach(conteo => pares += Math.floor(conteo / 2));
        return pares * 5;
    };

    static _calcularTrioFrondoso(dinos) {
        return (dinos.length === 3) ? 7 : 0;
    }

    static _calcularBosqueSemejanza(dinos) {
        if (dinos.length === 0) return 0;
        const primeraEspecie = dinos[0].type || dinos[0].especie;
        if (!dinos.every(dino => (dino.type || dino.especie) === primeraEspecie)) return 0;
        const puntosPorCantidad = { 1: 2, 2: 4, 3: 8, 4: 12, 5: 18, 6: 24 };
        return puntosPorCantidad[dinos.length] || 0;
    };

    static _calcularPradoDiferencia(dinos) {
        const especiesUnicas = new Set(dinos.map(d => d.type || d.especie));
        if (especiesUnicas.size !== dinos.length) return 0;
        const puntosPorCantidad = { 1: 1, 2: 3, 3: 6, 4: 10, 5: 15, 6: 21 };
        return puntosPorCantidad[dinos.length] || 0;
    };

    static _calcularReySelva(jugadorActual, todosLosJugadores) {
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

    static _calcularIslaSolitaria(dinoEnIsla, parqueCompleto) {
        if (dinoEnIsla.length === 0) return 0;
        const tipoDino = dinoEnIsla[0].type || dinoEnIsla[0].especie;
        const conteoTotal = parqueCompleto.filter(d => (d.type || d.especie) === tipoDino).length;
        return conteoTotal === 1 ? 7 : 0;
    };

    static _calcularBonusTRex(tablero) {
        let bono = 0;
        for (const claveRecinto in tablero) {
            if (claveRecinto !== 'rio' && tablero[claveRecinto].some(d => (d.type || d.especie) === 't-rex')) {
                bono++;
            }
        }
        return bono;
    };

    static calcularPuntuacionTotal(jugador, todosLosJugadores) {
        const tablero = jugador.tablero || jugador.parque;
        if (!tablero) return { puntajes: {}, total: 0 };

        const parqueCompleto = Object.values(tablero).flat();
        let puntajes = {};
        puntajes.praderaAmor = this._calcularPraderaAmor(tablero.praderaAmor);
        puntajes.trioFrondoso = this._calcularTrioFrondoso(tablero.trioFrondoso);
        puntajes.bosqueSemejanza = this._calcularBosqueSemejanza(tablero.bosqueSemejanza);
        puntajes.pradoDiferencia = this._calcularPradoDiferencia(tablero.pradoDiferencia);
        puntajes.rio = tablero.rio.length;
        puntajes.islaSolitaria = this._calcularIslaSolitaria(tablero.islaSolitaria, parqueCompleto);
        puntajes.bonusTRex = this._calcularBonusTRex(tablero);
        puntajes.reySelva = this._calcularReySelva(jugador, todosLosJugadores);

        const total = Object.values(puntajes).reduce((sum, val) => sum + val, 0);

        return { puntajes, total };
    }
}
