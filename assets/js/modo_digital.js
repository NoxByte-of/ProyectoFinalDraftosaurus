/**
 Logica para el Modo Digital
  version 6.8 - Añadida funcionalidad de click-para-colocar para compatibilidad móvil.
 */

//  INICIALIZACION Y CONFIGURACIÓN DEL JUEGO 
document.addEventListener('DOMContentLoaded', () => {
    const configPartidaJSON = sessionStorage.getItem('draftosaurusGameConfig');

    if (configPartidaJSON) {
        const configPartida = JSON.parse(configPartidaJSON);
        configuracionInicial = { ...configPartida };
        setTimeout(() => iniciarPartida(configPartida.playerCount, configPartida.playerNames), 100);
        sessionStorage.removeItem('draftosaurusGameConfig');
    } else {
        window.location.href = 'modo_juego_digital.php';
    }
});

// CONSTANTES GLOBALES 
const RESTRICCIONES_DADO = {
    'boscosa': { texto: 'Zona Boscosa' },
    'llanura': { texto: 'Zona Llanura' },
    'cafeteria': { texto: 'Zona Cafetería' },
    'banos': { texto: 'Zona Baños' },
    'vacio': { texto: 'Recinto Vacío' },
    'sin-t-rex': { texto: 'Sin T-Rex' },
};
const MAPA_CARAS_DADO = { 'boscosa': 0, 'banos': 1, 'llanura': 2, 'cafeteria': 3, 'vacio': 4, 'sin-t-rex': 5 };

//  ESTADOS
let estadoJuego = {};
let configuracionInicial = {};
// Variables para manejar la selección de dinosaurios.
let dinosaurioSiendoArrastrado = null; // Para la especie en drag & drop
let idDinoArrastrado = null; // Para el ID en drag & drop
let dinoSeleccionadoInfo = null; // Para la selección por click {id, especie, elemento}

//  FUNCIONES PRINCIPALES DEL JUEGO 
function iniciarPartida(numeroDeJugadores, nombresJugadores = []) {
    let bolsaDeDinos = crearBolsaDeDinos(numeroDeJugadores);
    barajarArray(bolsaDeDinos);

    estadoJuego = {
        numeroDeJugadores,
        bolsaDeDinos,
        jugadores: Array.from({ length: numeroDeJugadores }, (_, i) => ({
            id: i,
            nombre: nombresJugadores[i] || `Jugador ${i + 1}`,
            parque: crearParqueVacio(),
            mano: [],
            puntuacionTotal: 0,
            puntuacionDetallada: {}
        })),
        rondaActual: 1,
        turnoActual: 1,
        indiceJugadorDado: 0,
        indiceJugadorVista: 0,
        restriccionDado: null,
        jugadoresQueHanJugadoEsteTurno: [],
    };

    repartirDinos();
    
    document.getElementById('game-container').classList.remove('hidden');
    document.getElementById('roll-dice-btn').addEventListener('click', manejarLanzamientoDado);
    document.getElementById('tabs-jugadores-digital').addEventListener('click', cambiarVistaJugador);

    configurarListenersDeJuego();
    renderizarTodo();
}

function finalizarTurno() {
    const manos = estadoJuego.jugadores.map(j => j.mano);
    for (let i = 0; i < estadoJuego.numeroDeJugadores; i++) {
        const indiceAnterior = (i - 1 + estadoJuego.numeroDeJugadores) % estadoJuego.numeroDeJugadores;
        estadoJuego.jugadores[i].mano = manos[indiceAnterior];
    }
    
    if (estadoJuego.turnoActual === 6) {
        finalizarRonda();
        return;
    }
    
    estadoJuego.turnoActual++;
    estadoJuego.indiceJugadorDado = (estadoJuego.indiceJugadorDado + 1) % estadoJuego.numeroDeJugadores;
    estadoJuego.indiceJugadorVista = estadoJuego.indiceJugadorDado; 
    estadoJuego.restriccionDado = null;
    estadoJuego.jugadoresQueHanJugadoEsteTurno = [];
    
    renderizarTodo();
}

function finalizarRonda() {
    if (estadoJuego.rondaActual === 2) {
        finalizarPartida();
        return;
    }
    
    window.mostrarNotificacion(`Fin de la Ronda ${estadoJuego.rondaActual}. ¡Nuevos dinosaurios!`, 'success');
    
    estadoJuego.rondaActual++;
    estadoJuego.turnoActual = 1;
    estadoJuego.indiceJugadorDado = 0;
    estadoJuego.indiceJugadorVista = 0;
    estadoJuego.jugadoresQueHanJugadoEsteTurno = [];
    estadoJuego.restriccionDado = null;
    
    repartirDinos();
    renderizarTodo();
}

function finalizarPartida() {
    estadoJuego.jugadores.forEach(jugador => {
        const resultados = window.MotorJuego.calcularPuntuacionTotal(jugador, estadoJuego.jugadores);
        jugador.puntuacionDetallada = resultados.puntajes;
        jugador.puntuacionTotal = resultados.total;
    });

    estadoJuego.jugadores.sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);

    const contenedorResultados = document.getElementById('final-scores-container');
    const contenedorGanador = document.getElementById('winner-container');
    const modal = document.getElementById('end-game-modal');
    
    contenedorResultados.innerHTML = '';
    const puntuacionMaxima = estadoJuego.jugadores[0].puntuacionTotal;
    const ganadores = estadoJuego.jugadores.filter(j => j.puntuacionTotal === puntuacionMaxima);
    
    contenedorGanador.innerHTML = `<p>🏆 ¡Victoria para ${ganadores.map(g => g.nombre).join(' y ')}! 🏆</p>`;

    estadoJuego.jugadores.forEach((jugador) => {
        const p = jugador.puntuacionDetallada;
        const resultadoDiv = document.createElement('div');
        resultadoDiv.className = 'jugador-resultados'; 
        resultadoDiv.innerHTML = `
            <h3>${jugador.nombre} ${ganadores.includes(jugador) ? '⭐' : ''}</h3>
            <ul>
                <li><span>Bosque Semejanza:</span> <span>${p.bosqueSemejanza || 0}</span></li>
                <li><span>Prado Diferencia:</span> <span>${p.pradoDiferencia || 0}</span></li>
                <li><span>Pradera Amor:</span> <span>${p.praderaAmor || 0}</span></li>
                <li><span>Trío Frondoso:</span> <span>${p.trioFrondoso || 0}</span></li>
                <li><span>Rey Selva:</span> <span>${p.reySelva || 0}</span></li>
                <li><span>Isla Solitaria:</span> <span>${p.islaSolitaria || 0}</span></li>
                <li><span>Río:</span> <span>${p.rio || 0}</span></li>
                <li><span>Bonus T-Rex:</span> <span>${p.bonusTRex || 0}</span></li>
            </ul>
            <p class="total-puntos"><strong>Total: ${jugador.puntuacionTotal} Puntos</strong></p>
        `;
        contenedorResultados.appendChild(resultadoDiv);
    });

    modal.classList.add('visible');
    modal.querySelector('#btn-close-end-game-modal').onclick = () => modal.classList.remove('visible');
}

function reiniciarPartida() {
    document.getElementById('end-game-modal').classList.remove('visible');
    if (configuracionInicial && configuracionInicial.playerCount > 0) {
        setTimeout(() => {
            iniciarPartida(configuracionInicial.playerCount, configuracionInicial.playerNames);
        }, 350);
    } else {
        window.location.href = 'modo_juego_digital.php';
    }
}


//  LÓGICA DE DRAG & DROP Y VALIDACIÓN 

function configurarListenersDeJuego() {
    const contenedorSlots = document.getElementById('contenedor-slots-tablero');

    // Listener para Drag & Drop
    contenedorSlots.addEventListener('dragover', e => {
        if (e.target.classList.contains('slot-valido')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    });

    contenedorSlots.addEventListener('drop', e => {
        e.preventDefault();
        if (e.target.classList.contains('slot-valido')) {
            const dinoId = e.dataTransfer.getData('text/plain');
            if (!dinoId || !dinosaurioSiendoArrastrado) return;
            const dinoInfo = { id: dinoId, especie: dinosaurioSiendoArrastrado };
            colocarDinosaurio(e.target, dinoInfo);
        }
        limpiarResaltadoSlots();
    });

    // Listener para Click-to-Place
    contenedorSlots.addEventListener('click', e => {
        if (dinoSeleccionadoInfo && e.target.classList.contains('slot-valido')) {
            colocarDinosaurio(e.target, dinoSeleccionadoInfo);
        }
    });
}

function manejarArrastre(e) {
    const dinoElemento = e.currentTarget;
    const jugadorActual = estadoJuego.jugadores[estadoJuego.indiceJugadorVista];

    if (estadoJuego.jugadoresQueHanJugadoEsteTurno.includes(jugadorActual.id) || dinoElemento.classList.contains('colocado')) {
        e.preventDefault();
        return;
    }
    if (!estadoJuego.restriccionDado) {
        window.mostrarNotificacion(`¡${estadoJuego.jugadores[estadoJuego.indiceJugadorDado].nombre} debe lanzar el dado!`, 'error');
        e.preventDefault();
        return;
    }

    dinosaurioSiendoArrastrado = dinoElemento.dataset.dinoType;
    idDinoArrastrado = dinoElemento.id;
    e.dataTransfer.setData('text/plain', idDinoArrastrado);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
        dinoElemento.style.opacity = '0.5';
        document.body.classList.add('arrastrando');
    }, 0);

    resaltarSlotsValidos(dinosaurioSiendoArrastrado);
}


function manejarFinArrastre(e) {
    const dinoElemento = e.currentTarget;
    if (dinoElemento) {
        dinoElemento.style.opacity = '1';
    }
    dinosaurioSiendoArrastrado = null;
    idDinoArrastrado = null;
    document.body.classList.remove('arrastrando');
    limpiarResaltadoSlots();
}

// Función unificada para colocar dinosaurios (usada por drop y click)
function colocarDinosaurio(slot, dinoInfo) {
    const jugador = estadoJuego.jugadores[estadoJuego.indiceJugadorVista];
    const indiceDinoEnMano = jugador.mano.findIndex(d => d.id === dinoInfo.id);
    
    if (indiceDinoEnMano === -1) return;

    const dino = jugador.mano[indiceDinoEnMano];
    const claveRecinto = slot.closest('.recinto-digital').dataset.recinto;
    
    jugador.parque[claveRecinto].push({ especie: dino.especie, id: dino.id });
    jugador.mano.splice(indiceDinoEnMano, 1);
    
    const dinoElementoEnMano = document.getElementById(dino.id);
    if(dinoElementoEnMano) {
        dinoElementoEnMano.classList.add('colocado');
        dinoElementoEnMano.draggable = false;
        dinoElementoEnMano.classList.remove('selected');
    }
    
    dinoSeleccionadoInfo = null; // Limpiar selección después de colocar
    
    estadoJuego.jugadoresQueHanJugadoEsteTurno.push(jugador.id);
    
    if (estadoJuego.jugadoresQueHanJugadoEsteTurno.length === estadoJuego.numeroDeJugadores) {
        window.mostrarNotificacion('¡Dino Colocado, comienza nuevo turno!', 'success');
        setTimeout(finalizarTurno, 500);
    } else {
        window.mostrarNotificacion('¡Dino colocado! Esperando a los demás jugadores.', 'success');
        
        let proximoIndice = (estadoJuego.indiceJugadorVista + 1) % estadoJuego.numeroDeJugadores;
        while(estadoJuego.jugadoresQueHanJugadoEsteTurno.includes(proximoIndice)) {
            proximoIndice = (proximoIndice + 1) % estadoJuego.numeroDeJugadores;
        }
        estadoJuego.indiceJugadorVista = proximoIndice;
    }
    renderizarTodo();
}

function manejarLanzamientoDado() {
    if (estadoJuego.jugadores[estadoJuego.indiceJugadorVista].id !== estadoJuego.indiceJugadorDado) {
        window.mostrarNotificacion(`No es tu turno de lanzar. Esperando a ${estadoJuego.jugadores[estadoJuego.indiceJugadorDado].nombre}.`, 'error');
        return;
    }
    if (estadoJuego.restriccionDado) return;

    const caras = Object.keys(RESTRICCIONES_DADO);
    const resultado = caras[Math.floor(Math.random() * caras.length)];
    estadoJuego.restriccionDado = resultado;

    const textoDado = RESTRICCIONES_DADO[resultado].texto;
    
    setTimeout(() => {
        window.mostrarNotificacion(`¡El dado cayó en: ${textoDado}!`, 'info');
    }, 2000);

    document.getElementById('roll-dice-btn').disabled = true;
    lanzarDadoDigital(MAPA_CARAS_DADO[resultado]);
    
    setTimeout(renderizarInfoPartida, 2100); 
}

function resaltarSlotsValidos(tipoDino) {
    const jugador = estadoJuego.jugadores[estadoJuego.indiceJugadorVista];
    const todosLosRecintos = document.querySelectorAll('.recinto-digital');
    let haySlotsValidosGenerales = false;

    todosLosRecintos.forEach(recintoEl => {
        const claveRecinto = recintoEl.dataset.recinto;
        if (claveRecinto === 'rio') return; 

        const dinosEnRecinto = jugador.parque[claveRecinto];
        const slotsDelRecinto = recintoEl.querySelectorAll('.dino-slot-digital');

        slotsDelRecinto.forEach((slot, index) => {
            let esValido = true;

            if (slot.classList.contains('ocupado')) {
                esValido = false;
            }

            if (esValido) {
                switch (claveRecinto) {
                    case 'bosqueSemejanza':
                        if (dinosEnRecinto.length > 0 && dinosEnRecinto[0].especie !== tipoDino) esValido = false;
                        break;
                    case 'pradoDiferencia':
                        if (dinosEnRecinto.some(d => d.especie === tipoDino)) esValido = false;
                        break;
                }
            }
            
            if (esValido && (claveRecinto === 'bosqueSemejanza' || claveRecinto === 'pradoDiferencia')) {
                const primerSlotVacioIndex = Array.from(slotsDelRecinto).findIndex(s => !s.classList.contains('ocupado'));
                if (index !== primerSlotVacioIndex) {
                    esValido = false;
                }
            }

            if (esValido && jugador.id !== estadoJuego.indiceJugadorDado && estadoJuego.restriccionDado) {
                const restriccion = estadoJuego.restriccionDado;
                const zonas = {
                    cafeteria: ['praderaAmor', 'trioFrondoso', 'bosqueSemejanza'],
                    banos: ['reySelva', 'islaSolitaria', 'pradoDiferencia'],
                    boscosa: ['bosqueSemejanza', 'reySelva', 'trioFrondoso'],
                    llanura: ['pradoDiferencia', 'islaSolitaria', 'praderaAmor']
                };
                switch (restriccion) {
                    case 'cafeteria': if (!zonas.cafeteria.includes(claveRecinto)) esValido = false; break;
                    case 'banos': if (!zonas.banos.includes(claveRecinto)) esValido = false; break;
                    case 'boscosa': if (!zonas.boscosa.includes(claveRecinto)) esValido = false; break;
                    case 'llanura': if (!zonas.llanura.includes(claveRecinto)) esValido = false; break;
                    case 'vacio': if (dinosEnRecinto.length > 0) esValido = false; break;
                    case 'sin-t-rex': if (dinosEnRecinto.some(d => d.especie === 't-rex')) esValido = false; break;
                }
            }

            if (esValido) {
                slot.classList.add('slot-valido');
                haySlotsValidosGenerales = true;
            }
        });
    });

    if (!haySlotsValidosGenerales) {
        document.querySelectorAll('.recinto-digital[data-recinto="rio"] .dino-slot-digital:not(.ocupado)')
            .forEach(slot => slot.classList.add('slot-valido'));
    }
}

function limpiarResaltadoSlots() {
    document.querySelectorAll('.slot-valido').forEach(s => s.classList.remove('slot-valido'));
}


//  RENDERIZADO Y UI 
function renderizarTodo() {
    renderizarPestanas();
    renderizarInfoPartida();
    renderizarMano();
    renderizarTablero();
}

function renderizarPestanas() {
    const contenedorPestanas = document.getElementById('tabs-jugadores-digital');
    contenedorPestanas.innerHTML = '';
    estadoJuego.jugadores.forEach((jugador, index) => {
        const pestana = document.createElement('button');
        pestana.className = 'tab-jugador-digital';
        pestana.textContent = jugador.nombre;
        pestana.dataset.jugadorIndex = index;

        if (estadoJuego.jugadoresQueHanJugadoEsteTurno.includes(jugador.id)) {
            pestana.classList.add('listo');
        } else {
            pestana.classList.add('pendiente');
        }

        if (index === estadoJuego.indiceJugadorVista) {
            pestana.classList.add('active');
        }
        contenedorPestanas.appendChild(pestana);
    });
}

function renderizarInfoPartida() {
    document.getElementById('round-number').textContent = estadoJuego.rondaActual;
    document.getElementById('turn-number').textContent = estadoJuego.turnoActual;
    document.getElementById('active-player-name').textContent = estadoJuego.jugadores[estadoJuego.indiceJugadorDado].nombre;
    document.getElementById('roll-dice-btn').disabled = estadoJuego.restriccionDado !== null;
    document.getElementById('dice-result-text').textContent = estadoJuego.restriccionDado ? RESTRICCIONES_DADO[estadoJuego.restriccionDado].texto : 'Lanza el dado';
}

function renderizarMano() {
    const contenedorMano = document.getElementById('current-player-hand');
    contenedorMano.innerHTML = '';

    const jugador = estadoJuego.jugadores[estadoJuego.indiceJugadorVista];
    if (!jugador) return;

    if (estadoJuego.jugadoresQueHanJugadoEsteTurno.includes(jugador.id)) {
         contenedorMano.innerHTML = '<p style="color: #5D4037; text-align: center; width: 100%;">Esperando a los demás jugadores...</p>';
         return;
    }
    
    
    jugador.mano.forEach(dino => {
        contenedorMano.appendChild(crearElementoDino(dino));
    });
}

function renderizarTablero() {
    const jugador = estadoJuego.jugadores[estadoJuego.indiceJugadorVista];
    if (!jugador) return;

    const resultados = window.MotorJuego.calcularPuntuacionTotal(jugador, estadoJuego.jugadores);
    jugador.puntuacionTotal = resultados.total;
    document.getElementById('board-title').textContent = `Parque de ${jugador.nombre}`;
    document.querySelector('#board-score span').textContent = jugador.puntuacionTotal;


    document.querySelectorAll('.dino-slot-digital').forEach(slot => {
        slot.className = 'dino-slot-digital';
    });

    for (const recinto in jugador.parque) {
        const dinosEnRecinto = jugador.parque[recinto];
        const slotsDelRecinto = document.querySelectorAll(`.recinto-digital[data-recinto="${recinto}"] .dino-slot-digital`);
        
        dinosEnRecinto.forEach((dino, index) => {
            let slotParaDino = null;
            if (recinto === 'bosqueSemejanza' || recinto === 'pradoDiferencia' || recinto === 'rio') {
                slotParaDino = slotsDelRecinto[index];
            } else {
                slotParaDino = Array.from(slotsDelRecinto).find(s => !s.classList.contains('ocupado'));
            }
            
            if (slotParaDino) {
                slotParaDino.classList.add(dino.especie, 'ocupado');
            }
        });
    }
}

function cambiarVistaJugador(e) {
    if (e.target.classList.contains('tab-jugador-digital')) {
        const nuevoIndice = parseInt(e.target.dataset.jugadorIndex, 10);
        if (nuevoIndice !== estadoJuego.indiceJugadorVista) {
            estadoJuego.indiceJugadorVista = nuevoIndice;
            renderizarTodo();
        }
    }
}

function crearBolsaDeDinos(numJugadores) {
    const dinosPorEspecie = { 5: 10, 4: 8, 3: 6, 2: 8 }[numJugadores] || 10;
    let idCounter = 0;
    return Object.keys(window.MotorJuego.TIPOS_DINO).flatMap(indice => {
        const especie = window.MotorJuego.TIPOS_DINO[indice];
        return Array.from({ length: dinosPorEspecie }, () => ({ id: `dino-${idCounter++}`, especie }));
    });
}

const crearParqueVacio = () => ({
    bosqueSemejanza: [], pradoDiferencia: [], praderaAmor: [],
    trioFrondoso: [], reySelva: [], islaSolitaria: [], rio: []
});

function repartirDinos() {
    estadoJuego.jugadores.forEach(jugador => {
        if (estadoJuego.bolsaDeDinos.length < 6) return;
        jugador.mano = estadoJuego.bolsaDeDinos.splice(0, 6);
    });
}

const barajarArray = (array) => array.sort(() => Math.random() - 0.5);

function crearElementoDino(dino) {
    const dinoEl = document.createElement('div');
    dinoEl.className = 'dino-selector'; 
    dinoEl.dataset.dinoType = dino.especie;
    dinoEl.id = dino.id;
    dinoEl.title = dino.especie.charAt(0).toUpperCase() + dino.especie.slice(1);
    
    dinoEl.draggable = true;
    dinoEl.addEventListener('dragstart', manejarArrastre);
    dinoEl.addEventListener('dragend', manejarFinArrastre);

    // Lógica para seleccionar con click.
    dinoEl.addEventListener('click', () => {
        const jugadorActual = estadoJuego.jugadores[estadoJuego.indiceJugadorVista];
        if (estadoJuego.jugadoresQueHanJugadoEsteTurno.includes(jugadorActual.id) || dinoEl.classList.contains('colocado')) {
            return;
        }
        if (!estadoJuego.restriccionDado) {
            window.mostrarNotificacion(`¡${estadoJuego.jugadores[estadoJuego.indiceJugadorDado].nombre} debe lanzar el dado!`, 'error');
            return;
        }

        // Deseleccionar si se hace clic en el mismo dino
        if (dinoEl.classList.contains('selected')) {
            dinoEl.classList.remove('selected');
            dinoSeleccionadoInfo = null;
            limpiarResaltadoSlots();
        } else {
            // Deseleccionar el anterior si existía
            if (dinoSeleccionadoInfo && dinoSeleccionadoInfo.elemento) {
                dinoSeleccionadoInfo.elemento.classList.remove('selected');
            }
            
            // Seleccionar el nuevo
            dinoEl.classList.add('selected');
            dinoSeleccionadoInfo = { id: dino.id, especie: dino.especie, elemento: dinoEl };
            resaltarSlotsValidos(dino.especie);
        }
    });

    return dinoEl;
}

function lanzarDadoDigital(indiceCara) {
    const dado = document.getElementById('dice-digital');
    if (!dado) return;
    const rotaciones = [
        { x: 0, y: 0 },       // 0: boscosa (frontal)
        { x: 0, y: 180 },     // 1: banos (trasera)
        { x: 0, y: -90 },     // 2: llanura (derecha)
        { x: 0, y: 90 },      // 3: cafeteria (izquierda)
        { x: -90, y: 0 },     // 4: vacio (superior)
        { x: 90, y: 0 }       // 5: sin-t-rex (inferior)
    ];
    const giroAleatorioY = 360 * (Math.floor(Math.random() * 2) + 2);
    const giroAleatorioX = 360 * (Math.floor(Math.random() * 2) + 2);
    const rotacionObjetivo = rotaciones[indiceCara];
    dado.style.transform = `rotateX(${giroAleatorioX + rotacionObjetivo.x}deg) rotateY(${giroAleatorioY + rotacionObjetivo.y}deg)`;
}

