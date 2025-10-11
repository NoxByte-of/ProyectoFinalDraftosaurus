/**
  TODA la logica del MODO SEGUIMIENTO para tablero.html
  gestiona el estado completo de la partida
  version 2.3 - click-para-colocar.
 */

document.addEventListener('DOMContentLoaded', function() {

    const tableroPrincipal = document.getElementById('main-tablero');
    if (tableroPrincipal) {

        // aca guardamos todo lo importante del juego: jugadores, turnos, etc
        const TIPOS_DINO = window.MotorJuego.TIPOS_DINO;
        let estadoJuego = {
            jugadores: [],
            rondaActual: 1,
            turnoActual: 1,
            indiceJugadorActivoDados: 0,
            restriccionDados: 'ninguna',
            historialMovimientos: [],
            jugadoresQueJugaronEsteTurno: [],
            manos: {},
            manosOriginales: {},
        };
        // Variables para manejar la selección de dinosaurios.
        let dinosaurioSeleccionado = null; 
        let elementoDinoSeleccionado = null; 
        let indiceJugadorActivoTablero = 0;
        let scrollInterval = null;

        // para no andar buscando los botones y divs a cada rato, los guardamos aca
        const contenedorPestanas = document.getElementById('tabs-jugadores');
        const contenedorTableros = document.getElementById('tableros-container');
        const plantilla = document.getElementById('plantilla-parque-jugador');
        const btnFinalizarPartida = document.getElementById('btn-finalizar-partida');
        const btnSiguienteTurno = document.getElementById('btn-siguiente-turno');
        const btnLanzarDado = document.getElementById('btn-lanzar-dado');
        const btnDeshacer = document.getElementById('btn-deshacer');
        const contenedorRestricciones = document.getElementById('restricciones-dados-container');
        const modalResultadosOverlay = document.getElementById('resultados-modal-overlay');
        const btnCerrarModalResultados = document.getElementById('btn-close-resultados-modal');
        const btnManoAleatoria = document.getElementById('btn-mano-aleatoria');
        const dinosManoVirtual = document.getElementById('mano-virtual-dinos');
        const btnRegistrarMano = document.getElementById('btn-registrar-mano');
        const btnVerHistorial = document.getElementById('btn-ver-historial');
        const modalHistorialOverlay = document.getElementById('historial-modal-overlay');
        const cuerpoHistorial = document.getElementById('historial-body');
        const btnCerrarModalHistorial = document.getElementById('btn-cerrar-historial-modal');
        const btnReiniciarPartida = document.getElementById('btn-reiniciar-partida');

        // calcular los puntos, llamar motor del juego
        function calcularPuntuacionTotal(indiceJugador) {
            const jugador = estadoJuego.jugadores[indiceJugador];
            if (!jugador) return;

            const resultados = window.MotorJuego.calcularPuntuacionTotal(jugador, estadoJuego.jugadores);

            jugador.puntuacionDetallada = resultados.puntajes;
            jugador.puntuacionTotal = resultados.total;

            actualizarUIPuntuacion(indiceJugador);
        }

        // Todo lo que se ve en la pantalla se maneja desde aca
        function inicializarScrollAlArrastrar() {
            const SCROLL_SPEED = 15;
            const SCROLL_ZONE = 80;

            document.addEventListener('dragover', function(e) {
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }

                if (e.clientY < SCROLL_ZONE) {
                    scrollInterval = setInterval(() => {
                        window.scrollBy(0, -SCROLL_SPEED);
                    }, 15);
                } else if (e.clientY > window.innerHeight - SCROLL_ZONE) {
                    scrollInterval = setInterval(() => {
                        window.scrollBy(0, SCROLL_SPEED);
                    }, 15);
                }
            });

            const detenerScroll = () => {
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
            };

            document.addEventListener('dragend', detenerScroll);
            document.addEventListener('drop', detenerScroll);
        }

        function actualizarEstilosPestanas() {
            const pestanas = document.querySelectorAll('.tab-jugador');
            pestanas.forEach((pestana, index) => {
                pestana.classList.remove('listo', 'pendiente');
                if (estadoJuego.jugadoresQueJugaronEsteTurno.includes(index)) {
                    pestana.classList.add('listo');
                } else {
                    pestana.classList.add('pendiente');
                }
            });
        }

        function mostrarHistorial() {
            const nombresRecintos = {
                bosqueSemejanza: 'Bosque de la Semejanza',
                pradoDiferencia: 'Prado de la Diferencia',
                praderaAmor: 'Pradera del Amor',
                trioFrondoso: 'Trío Frondoso',
                reySelva: 'Rey de la Selva',
                islaSolitaria: 'Isla Solitaria',
                rio: 'Río'
            };

            cuerpoHistorial.innerHTML = '';

            if (estadoJuego.historialMovimientos.length === 0) {
                cuerpoHistorial.innerHTML = '<p>Aún no se han realizado movimientos.</p>';
            } else {
                const lista = document.createElement('ul');
                [...estadoJuego.historialMovimientos].reverse().forEach(mov => {
                    const li = document.createElement('li');
                    const nombreJugador = estadoJuego.jugadores[mov.indiceJugador].nombre;
                    const nombreRecinto = nombresRecintos[mov.claveRecinto] || mov.claveRecinto;
                    const tipoDino = mov.dino.type.charAt(0).toUpperCase() + mov.dino.type.slice(1);

                    li.innerHTML = `
                        <span class="historial-turno">RONDA ${mov.ronda}, TURNO ${mov.turno}</span>
                        <span class="historial-accion"><b>${nombreJugador}</b> colocó un <b>${tipoDino}</b> en <b>${nombreRecinto}</b>.</span>
                    `;
                    lista.appendChild(li);
                });
                cuerpoHistorial.appendChild(lista);
            }
            modalHistorialOverlay.classList.add('visible');
        }

        function limpiarVisualizacionSlots() {
            document.querySelectorAll('.dino-slot').forEach(s => s.classList.remove('slot-valido'));
            if (contenedorTableros) contenedorTableros.classList.remove('tablero-restringido');
        }

        function actualizarVisualizacionRestricciones() {
            const indiceJugador = indiceJugadorActivoTablero;
            const contenedorParque = document.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"]`);
            if (!contenedorParque) return;

            const todosLosRecintos = contenedorParque.querySelectorAll('.recinto');
            todosLosRecintos.forEach(r => r.classList.remove('recinto-restringido'));

            const restriccion = estadoJuego.restriccionDados;
            const esJugadorAfectado = indiceJugador !== estadoJuego.indiceJugadorActivoDados;

            if (!esJugadorAfectado || restriccion === 'ninguna' || restriccion === null) {
                return;
            }
            const zonas = {
                cafeteria: ['praderaAmor', 'trioFrondoso', 'bosqueSemejanza'],
                banos: ['reySelva', 'islaSolitaria', 'pradoDiferencia'],
                boscosa: ['bosqueSemejanza', 'reySelva', 'trioFrondoso'],
                llanura: ['pradoDiferencia', 'islaSolitaria', 'praderaAmor']
            };
            todosLosRecintos.forEach(recintoEl => {
                const claveRecinto = recintoEl.dataset.recinto;
                let restringido = false;

                switch (restriccion) {
                    case 'cafeteria':
                        if (!zonas.cafeteria.includes(claveRecinto)) restringido = true;
                        break;
                    case 'banos':
                        if (!zonas.banos.includes(claveRecinto)) restringido = true;
                        break;
                    case 'boscosa':
                        if (!zonas.boscosa.includes(claveRecinto)) restringido = true;
                        break;
                    case 'llanura':
                        if (!zonas.llanura.includes(claveRecinto)) restringido = true;
                        break;
                    case 'vacio':
                        if (estadoJuego.jugadores[indiceJugador].tablero[claveRecinto].length > 0) restringido = true;
                        break;
                    case 'sin-t-rex':
                        if (estadoJuego.jugadores[indiceJugador].tablero[claveRecinto].some(d => d.type === 't-rex')) restringido = true;
                        break;
                }
                if (restringido) {
                    recintoEl.classList.add('recinto-restringido');
                }
            });
        }

        function actualizarUIPuntuacion(indiceJugador) {
            const contenedorParque = document.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"]`);
            if (contenedorParque) {
                const elPuntos = contenedorParque.querySelector('.puntos');
                if (elPuntos) elPuntos.textContent = estadoJuego.jugadores[indiceJugador].puntuacionTotal;
            }
        }

        function actualizarUIInfoPartida() {
            const elRonda = document.getElementById('ronda-actual');
            const elTurno = document.getElementById('turno-actual');
            const elJugadorActivo = document.getElementById('jugador-activo-dados');
            const elRondaMano = document.getElementById('ronda-mano-virtual');

            if (elRonda) elRonda.textContent = estadoJuego.rondaActual;
            if (elTurno) elTurno.textContent = estadoJuego.turnoActual;
            if (elJugadorActivo && estadoJuego.jugadores.length > 0) elJugadorActivo.textContent = estadoJuego.jugadores[estadoJuego.indiceJugadorActivoDados].nombre;
            if (elRondaMano) elRondaMano.textContent = estadoJuego.rondaActual;

            document.querySelectorAll('.btn-dado').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.restriccion === estadoJuego.restriccionDados);
            });
        }

        function renderizarTableroCompleto() {
            if (!contenedorPestanas || !contenedorTableros) return;
            contenedorPestanas.innerHTML = '';
            contenedorTableros.innerHTML = '';
            estadoJuego.jugadores.forEach((jugador, index) => {
                const pestana = document.createElement('button');
                pestana.className = 'tab-jugador';
                pestana.textContent = jugador.nombre;
                pestana.dataset.jugadorIndex = index;
                if (index === indiceJugadorActivoTablero) pestana.classList.add('active');
                contenedorPestanas.appendChild(pestana);

                const clon = plantilla.content.cloneNode(true);
                const contenedorParque = clon.querySelector('.parque-container');
                contenedorParque.dataset.jugadorIndex = index;
                clon.querySelector('.nombre-jugador-parque').textContent = jugador.nombre;
                if (index !== indiceJugadorActivoTablero) contenedorParque.classList.add('hidden');
                contenedorTableros.appendChild(clon);
            });
        }

        function renderizarManoVirtual(indiceJugador) {
            if (!dinosManoVirtual) return;
            dinosManoVirtual.innerHTML = '';
            const mano = estadoJuego.manos[indiceJugador] || [];
            const infoMano = document.getElementById('mano-virtual-info');
            if (mano.length > 0) {
                const fragment = document.createDocumentFragment();
                mano.forEach(tipoDino => {
                    const elementoDino = document.createElement('div');
                    elementoDino.className = 'dino-selector';
                    elementoDino.dataset.dinoType = tipoDino;
                    elementoDino.title = tipoDino.charAt(0).toUpperCase() + tipoDino.slice(1);
                    elementoDino.draggable = true;

                    elementoDino.addEventListener('dragstart', (e) => {
                        if (elementoDino.classList.contains('colocado')) {
                            e.preventDefault();
                            return;
                        }
                        
                        if (elementoDinoSeleccionado) {
                            elementoDinoSeleccionado.classList.remove('selected');
                        }
                        elementoDinoSeleccionado = null;
                        
                        e.dataTransfer.setData('text/plain', tipoDino);
                        e.dataTransfer.effectAllowed = 'move';
                        document.body.classList.add('arrastrando');
                        dinosaurioSeleccionado = tipoDino;
                        actualizarVisualizacionSlots(tipoDino);
                        setTimeout(() => elementoDino.style.opacity = '0.5', 0);
                    });
                    
                    elementoDino.addEventListener('dragend', () => {
                        document.body.classList.remove('arrastrando');
                        limpiarVisualizacionSlots();
                        elementoDino.style.opacity = '1';
                    });

                    elementoDino.addEventListener('click', () => {
                        if (elementoDino.classList.contains('colocado')) return;

                        if (elementoDino.classList.contains('selected')) {
                            elementoDino.classList.remove('selected');
                            dinosaurioSeleccionado = null;
                            elementoDinoSeleccionado = null;
                            limpiarVisualizacionSlots();
                        } else {
                            if (elementoDinoSeleccionado) {
                                elementoDinoSeleccionado.classList.remove('selected');
                            }
                            
                            elementoDino.classList.add('selected');
                            dinosaurioSeleccionado = tipoDino;
                            elementoDinoSeleccionado = elementoDino;
                            actualizarVisualizacionSlots(tipoDino);
                        }
                    });

                    fragment.appendChild(elementoDino);
                });
                dinosManoVirtual.appendChild(fragment);
                if (infoMano) infoMano.classList.remove('hidden');
            } else {
                if (infoMano) infoMano.classList.add('hidden');
            }
        }

        function mostrarResultadosFinales() {
            
            estadoJuego.jugadores.forEach((_, index) => calcularPuntuacionTotal(index));
            
            
            estadoJuego.jugadores.sort((a, b) => {
                
                if (b.puntuacionTotal !== a.puntuacionTotal) {
                    return b.puntuacionTotal - a.puntuacionTotal;
                }
                
                const tRexA = window.MotorJuego.contarTRex(a);
                const tRexB = window.MotorJuego.contarTRex(b);
                return tRexA - tRexB;
            });
        
            const contenedorResultados = document.getElementById('resultados-finales-container');
            if (!contenedorResultados) return;
            contenedorResultados.innerHTML = '';
        
            
            const ganadorPrincipal = estadoJuego.jugadores[0];
            const puntuacionMaxima = ganadorPrincipal.puntuacionTotal;
            const tRexGanador = window.MotorJuego.contarTRex(ganadorPrincipal);
        
            const ganadores = estadoJuego.jugadores.filter(j => 
                j.puntuacionTotal === puntuacionMaxima && window.MotorJuego.contarTRex(j) === tRexGanador
            );
        
           
            estadoJuego.jugadores.forEach(jugador => {
                const p = jugador.puntuacionDetallada;
                const div = document.createElement('div');
                div.className = 'jugador-resultados';
                div.innerHTML = `
                    <h3>${jugador.nombre} ${ganadores.includes(jugador) ? '🏆' : ''}</h3>
                    <ul>
                        <li><span>Bosque de la Semejanza:</span> <span>${p.bosqueSemejanza || 0} pts</span></li>
                        <li><span>Prado de la Diferencia:</span> <span>${p.pradoDiferencia || 0} pts</span></li>
                        <li><span>Pradera del Amor:</span> <span>${p.praderaAmor || 0} pts</span></li>
                        <li><span>Trío Frondoso:</span> <span>${p.trioFrondoso || 0} pts</span></li>
                        <li><span>Río:</span> <span>${p.rio || 0} pts</span></li>
                        <hr>
                        <li><span>Isla Solitaria:</span> <span>${p.islaSolitaria || 0} pts</span></li>
                        <li><span>Rey de la Selva:</span> <span>${p.reySelva || 0} pts</span></li>
                        <li><span>Bonus T-Rex:</span> <span>${p.bonusTRex || 0} pts</span></li>
                    </ul>
                    <p class="total-puntos"><strong>Total: ${jugador.puntuacionTotal} Puntos</strong></p>
                `;
                contenedorResultados.appendChild(div);
            });
        
            let textoGanador;
            if (ganadores.length > 1) {
                textoGanador = `🎉 ¡Empate! Victoria compartida entre ${ganadores.map(g => g.nombre).join(' y ')}! 🎉`;
            } else {
                textoGanador = `🎉 ¡${ganadores[0].nombre} es el ganador! 🎉`;
            }
            const elGanador = document.getElementById('ganador-container');
            if (elGanador) elGanador.innerHTML = `<p>${textoGanador}</p>`;
        
            modalResultadosOverlay.classList.add('visible');
        }

        function reiniciarJuego() {
            if (!confirm('¿Estás seguro de que quieres reiniciar la partida? Se perderá todo el progreso actual.')) {
                return;
            }
            estadoJuego.rondaActual = 1;
            estadoJuego.turnoActual = 1;
            estadoJuego.indiceJugadorActivoDados = 0;
            estadoJuego.restriccionDados = 'ninguna';
            estadoJuego.historialMovimientos = [];
            estadoJuego.jugadoresQueJugaronEsteTurno = [];
            estadoJuego.manos = {};
            estadoJuego.manosOriginales = {};
            dinosaurioSeleccionado = null;
            elementoDinoSeleccionado = null;
            indiceJugadorActivoTablero = 0;
            estadoJuego.jugadores.forEach((jugador, index) => {
                jugador.tablero = {
                    bosqueSemejanza: [], pradoDiferencia: [], praderaAmor: [],
                    trioFrondoso: [], reySelva: [], islaSolitaria: [], rio: []
                };
                jugador.puntuacionTotal = 0;
                jugador.puntuacionDetallada = {};
                actualizarUIPuntuacion(index);
            });

            document.querySelectorAll('.dino-slot').forEach(slot => {
                slot.className = 'dino-slot';
            });

            dinosManoVirtual.innerHTML = '';
            document.getElementById('mano-virtual-info').classList.add('hidden');
            btnRegistrarMano.disabled = false;
            btnManoAleatoria.disabled = false;
            btnDeshacer.disabled = true;
            btnSiguienteTurno.disabled = true;
            modalResultadosOverlay.classList.remove('visible');

            actualizarUIInfoPartida();
            limpiarVisualizacionSlots();
            cambiarPestanaActiva(0);
            actualizarEstilosPestanas();
            if (window.mostrarNotificacion) window.mostrarNotificacion('Partida Reiniciada. ¡Mucha suerte!', 'success');
        }

        function esMovimientoValido(slot, tipoDino, indiceJugador, restriccion) {
            const elementoRecinto = slot.closest('.recinto');
            if (!elementoRecinto) return false;
            const claveRecinto = elementoRecinto.dataset.recinto;
            const jugador = estadoJuego.jugadores[indiceJugador];
            const dinosEnRecinto = jugador.tablero[claveRecinto];

            if (claveRecinto === 'bosqueSemejanza' || claveRecinto === 'pradoDiferencia') {
                const slotsDelRecinto = Array.from(elementoRecinto.querySelectorAll('.dino-slot'));
                const indiceSlot = slotsDelRecinto.findIndex(s => s === slot);

                if (indiceSlot > 0) {
                    const slotAnterior = slotsDelRecinto[indiceSlot - 1];
                    const anteriorOcupado = TIPOS_DINO.some(claseDino => slotAnterior.classList.contains(claseDino));
                    if (!anteriorOcupado) return false;
                }
                if (claveRecinto === 'bosqueSemejanza') {
                    if (dinosEnRecinto.length > 0 && dinosEnRecinto[0].type !== tipoDino) return false;
                } else if (claveRecinto === 'pradoDiferencia') {
                    if (dinosEnRecinto.some(d => d.type === tipoDino)) return false;
                }
            }

            if (indiceJugador !== estadoJuego.indiceJugadorActivoDados) {
                if (restriccion !== 'ninguna' && restriccion !== null) {
                    const zonas = {
                        cafeteria: ['praderaAmor', 'trioFrondoso', 'bosqueSemejanza'],
                        banos: ['reySelva', 'islaSolitaria', 'pradoDiferencia'],
                        boscosa: ['bosqueSemejanza', 'reySelva', 'trioFrondoso'],
                        llanura: ['pradoDiferencia', 'islaSolitaria', 'praderaAmor']
                    };

                    switch (restriccion) {
                        case 'cafeteria': if (!zonas.cafeteria.includes(claveRecinto)) return false; break;
                        case 'banos': if (!zonas.banos.includes(claveRecinto)) return false; break;
                        case 'boscosa': if (!zonas.boscosa.includes(claveRecinto)) return false; break;
                        case 'llanura': if (!zonas.llanura.includes(claveRecinto)) return false; break;
                        case 'vacio': if (dinosEnRecinto.length > 0) return false; break;
                        case 'sin-t-rex': if (dinosEnRecinto.some(d => d.type === 't-rex')) return false; break;
                    }
                }
            }
            return true;
        }

        function obtenerSlotsValidos(indiceJugador, tipoDino) {
            const contenedorParque = document.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"]`);
            if (!contenedorParque) return [];

            const todosLosSlots = contenedorParque.querySelectorAll('.dino-slot');
            const slotsValidos = [];

            todosLosSlots.forEach(slot => {
                const esOcupado = TIPOS_DINO.some(claseDino => slot.classList.contains(claseDino));
                if (esOcupado) return;

                const claveRecinto = slot.closest('.recinto')?.dataset.recinto;
                if (!claveRecinto || claveRecinto === 'rio') return;

                if (esMovimientoValido(slot, tipoDino, indiceJugador, estadoJuego.restriccionDados)) {
                    slotsValidos.push(slot);
                }
            });

            if (slotsValidos.length === 0) {
                contenedorParque.querySelectorAll('.recinto[data-recinto="rio"] .dino-slot').forEach(slot => {
                    const esOcupado = TIPOS_DINO.some(claseDino => slot.classList.contains(claseDino));
                    if (!esOcupado) slotsValidos.push(slot);
                });
            }

            return slotsValidos;
        }

        function actualizarVisualizacionSlots(tipoDino) {
            limpiarVisualizacionSlots();
            if (!tipoDino) return;

            const indiceJugador = indiceJugadorActivoTablero;
            if (estadoJuego.jugadoresQueJugaronEsteTurno.includes(indiceJugador)) {
                return;
            }
            const slotsValidos = obtenerSlotsValidos(indiceJugador, tipoDino);
            contenedorTableros.classList.add('tablero-restringido');
            if (slotsValidos.length > 0) {
                slotsValidos.forEach(slot => slot.classList.add('slot-valido'));
            }
        }

        function intentarColocarDinosaurio(slot) {
            if (!dinosaurioSeleccionado || !slot.classList.contains('slot-valido')) return;
            const manoJugador = estadoJuego.manos[indiceJugadorActivoTablero] || [];
            const indiceDinoEnMano = manoJugador.indexOf(dinosaurioSeleccionado);
            if (indiceDinoEnMano === -1) {
                if (window.mostrarNotificacion) window.mostrarNotificacion("Este dinosaurio no está en tu mano actual.", "error");
                return;
            }

            const indiceJugador = indiceJugadorActivoTablero;
            const claveRecinto = slot.closest('.recinto').dataset.recinto;
            const idSlot = slot.dataset.slotId;
            const nuevoDino = { type: dinosaurioSeleccionado, slotId: idSlot };
            
            estadoJuego.jugadores[indiceJugador].tablero[claveRecinto].push(nuevoDino);
            estadoJuego.historialMovimientos.push({
                indiceJugador, claveRecinto, dino: nuevoDino,
                turno: estadoJuego.turnoActual, ronda: estadoJuego.rondaActual
            });
            estadoJuego.jugadoresQueJugaronEsteTurno.push(indiceJugador);
            estadoJuego.manos[indiceJugador].splice(indiceDinoEnMano, 1);
            
            slot.classList.add(dinosaurioSeleccionado);
            slot.textContent = '';

            if (elementoDinoSeleccionado) {
                elementoDinoSeleccionado.classList.remove('selected');
                elementoDinoSeleccionado.classList.add('colocado');
            } else { 
                const dinoEnManoVisual = dinosManoVirtual.querySelector(`.dino-selector[data-dino-type="${dinosaurioSeleccionado}"]:not(.colocado)`);
                if (dinoEnManoVisual) dinoEnManoVisual.classList.add('colocado');
            }

            dinosaurioSeleccionado = null;
            elementoDinoSeleccionado = null;
            limpiarVisualizacionSlots();
            estadoJuego.jugadores.forEach((_, idx) => calcularPuntuacionTotal(idx));
            actualizarEstadoBotonSiguienteTurno();
            actualizarEstilosPestanas();
            actualizarVisualizacionRestricciones();
        }

        function deshacerUltimoMovimiento() {
            if (estadoJuego.historialMovimientos.length === 0) {
                if (window.mostrarNotificacion) window.mostrarNotificacion("No hay movimientos para deshacer.", 'info');
                return;
            }
            const movimientoParaDeshacer = estadoJuego.historialMovimientos.pop();
            const { indiceJugador, claveRecinto, dino } = movimientoParaDeshacer;
            const tableroJugador = estadoJuego.jugadores[indiceJugador].tablero;

            tableroJugador[claveRecinto] = tableroJugador[claveRecinto].filter(d => d.slotId !== dino.slotId);

            if (!estadoJuego.manos[indiceJugador]) estadoJuego.manos[indiceJugador] = [];
            estadoJuego.manos[indiceJugador].push(dino.type);

            const slot = document.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"] .dino-slot[data-slot-id="${dino.slotId}"]`);
            if (slot) slot.className = 'dino-slot';

            const indiceEnTurno = estadoJuego.jugadoresQueJugaronEsteTurno.indexOf(indiceJugador);
            if (movimientoParaDeshacer.turno === estadoJuego.turnoActual && movimientoParaDeshacer.ronda === estadoJuego.rondaActual && indiceEnTurno > -1) {
                estadoJuego.jugadoresQueJugaronEsteTurno.splice(indiceEnTurno, 1);
            }

            limpiarVisualizacionSlots();
            renderizarManoVirtual(indiceJugador);
            estadoJuego.jugadores.forEach((_, idx) => calcularPuntuacionTotal(idx));
            actualizarEstadoBotonSiguienteTurno();
            actualizarEstilosPestanas();
            if (window.mostrarNotificacion) window.mostrarNotificacion("Último movimiento deshecho.", 'success');
            actualizarVisualizacionRestricciones();
        }

        function lanzarDado() {
            const carasDelDado = ['boscosa', 'llanura', 'vacio', 'sin-t-rex', 'cafeteria', 'banos'];
            const resultado = carasDelDado[Math.floor(Math.random() * carasDelDado.length)];
            estadoJuego.restriccionDados = resultado;

            const nombreNotificacion = {
                boscosa: "Zona Boscosa", llanura: "Zona Llanura", vacio: "Recinto Vacío",
                'sin-t-rex': "Recinto sin T-Rex", cafeteria: "Zona Cafetería", banos: "Zona Baños"
            };
            if (window.mostrarNotificacion) window.mostrarNotificacion(`¡El dado ha caído en: ${nombreNotificacion[resultado].toUpperCase()}!`, 'success');
            actualizarUIInfoPartida();
            actualizarVisualizacionSlots(null);
            actualizarVisualizacionRestricciones();
        }

        function avanzarTurno() {
            if (estadoJuego.jugadoresQueJugaronEsteTurno.length !== estadoJuego.jugadores.length) {
                if (window.mostrarNotificacion) window.mostrarNotificacion("Aún no han jugado todos los jugadores en este turno.", 'error');
                return;
            }

            const manosRotadas = {};
            const numJugadores = estadoJuego.jugadores.length;
            for (let i = 0; i < numJugadores; i++) {
                const indiceJugadorQueRecibe = (i + 1) % numJugadores;
                manosRotadas[indiceJugadorQueRecibe] = estadoJuego.manos[i];
            }
            estadoJuego.manos = manosRotadas;


            if (estadoJuego.turnoActual === 6) {
                estadoJuego.turnoActual = 1;
                estadoJuego.rondaActual++;

                if (estadoJuego.rondaActual > 2) {
                    if (window.mostrarNotificacion) window.mostrarNotificacion("La partida ha terminado. ¡Calcula los resultados!", 'success');
                    btnFinalizarPartida.click();
                    return;
                }

                estadoJuego.manos = {};
                if (window.mostrarNotificacion) window.mostrarNotificacion(`¡Fin de la Ronda! Inicia Ronda ${estadoJuego.rondaActual}. Registren sus nuevas manos.`, "success");
            } else {
                estadoJuego.turnoActual++;
            }

            estadoJuego.indiceJugadorActivoDados = (estadoJuego.indiceJugadorActivoDados + 1) % estadoJuego.jugadores.length;
            estadoJuego.restriccionDados = 'ninguna';
            estadoJuego.jugadoresQueJugaronEsteTurno = [];

            actualizarUIInfoPartida();
            actualizarEstadoBotonSiguienteTurno();
            limpiarVisualizacionSlots();
            actualizarVisualizacionRestricciones();
            renderizarManoVirtual(indiceJugadorActivoTablero);
            actualizarEstilosPestanas();
            if (window.mostrarNotificacion) window.mostrarNotificacion(`Inicia el Turno ${estadoJuego.turnoActual} de la Ronda ${estadoJuego.rondaActual}.`, 'info');
        }

        function actualizarEstadoBotonSiguienteTurno() {
            if (!btnSiguienteTurno) return;
            if (estadoJuego.jugadoresQueJugaronEsteTurno.length === estadoJuego.jugadores.length) {
                btnSiguienteTurno.disabled = false;
                btnSiguienteTurno.classList.remove('btn-disabled');
            } else {
                btnSiguienteTurno.disabled = true;
                btnSiguienteTurno.classList.add('btn-disabled');
            }
        }

        function actualizarEstadoIslaSolitaria(indiceJugador) {
            const jugador = estadoJuego.jugadores[indiceJugador];
            const parqueCompleto = Object.values(jugador.tablero).flat();
            const dinoEnIsla = jugador.tablero.islaSolitaria[0];
            const contenedorParque = document.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"]`);
            if (!contenedorParque) return;
            const indicador = contenedorParque.querySelector('.recinto[data-recinto="islaSolitaria"] .recinto-estado');
            if (!indicador) return;
            indicador.classList.remove('estado-valido', 'estado-invalido');
            if (!dinoEnIsla) {
                return;
            }
            const conteoTotalEspecie = parqueCompleto.filter(d => d.type === dinoEnIsla.type).length;

            if (conteoTotalEspecie === 1) {
                indicador.classList.add('estado-valido');
            } else {
                indicador.classList.add('estado-invalido');
            }
        }

        function abrirModalRegistroMano() {
            const indiceJugador = indiceJugadorActivoTablero;
            const superposicion = document.createElement('div');
            superposicion.className = 'modal-overlay visible';
            const contenidoModal = document.createElement('div');
            contenidoModal.className = 'modal-content modal-registro-mano';
            contenidoModal.innerHTML = `
                <button class="modal-close-btn">&times;</button>
                <h2>Registrar Mano de ${estadoJuego.jugadores[indiceJugador].nombre}</h2>
                <div class="modal-scrollable-content"></div>
                <button id="btn-guardar-mano" class="btn btn-glow" style="margin-top: 1rem;">Guardar Mano</button>
            `;
            superposicion.appendChild(contenidoModal);
            document.body.appendChild(superposicion);

            const contenidoDesplazable = contenidoModal.querySelector('.modal-scrollable-content');
            let conteosDino = {};

            TIPOS_DINO.forEach(tipoDino => {
                conteosDino[tipoDino] = 0;
                const item = document.createElement('div');
                item.className = 'dino-registro-item';
                item.innerHTML = `
                    <div class="dino-selector" data-dino-type="${tipoDino}"></div>
                    <span class="dino-nombre">${tipoDino.charAt(0).toUpperCase() + tipoDino.slice(1)}</span>
                    <div class="dino-cantidad-controles">
                        <button class="btn-cantidad" data-tipo="${tipoDino}" data-accion="restar">-</button>
                        <span class="cantidad-display" data-tipo="${tipoDino}">0</span>
                        <button class="btn-cantidad" data-tipo="${tipoDino}" data-accion="sumar">+</button>
                    </div>
                `;
                contenidoDesplazable.appendChild(item);
            });

            const totalDinos = () => Object.values(conteosDino).reduce((a, b) => a + b, 0);
            contenidoDesplazable.addEventListener('click', e => {
                if (e.target.classList.contains('btn-cantidad')) {
                    const tipo = e.target.dataset.tipo;
                    const accion = e.target.dataset.accion;

                    if (accion === 'sumar' && totalDinos() < 6) {
                        conteosDino[tipo]++;
                    } else if (accion === 'restar' && conteosDino[tipo] > 0) {
                        conteosDino[tipo]--;
                    }
                    contenidoModal.querySelector(`.cantidad-display[data-tipo="${tipo}"]`).textContent = conteosDino[tipo];
                }
            });

            const cerrarModal = () => superposicion.remove();
            contenidoModal.querySelector('.modal-close-btn').addEventListener('click', cerrarModal);
            contenidoModal.querySelector('#btn-guardar-mano').addEventListener('click', () => {
                if (totalDinos() !== 6) {
                    if (window.mostrarNotificacion) window.mostrarNotificacion("Debes registrar exactamente 6 dinosaurios.", "error");
                    return;
                }

                const nuevaMano = [];
                for (const tipo in conteosDino) {
                    for (let i = 0; i < conteosDino[tipo]; i++) {
                        nuevaMano.push(tipo);
                    }
                }

                estadoJuego.manos[indiceJugador] = nuevaMano;
                if (!estadoJuego.manosOriginales[estadoJuego.rondaActual]) {
                    estadoJuego.manosOriginales[estadoJuego.rondaActual] = {};
                }
                estadoJuego.manosOriginales[estadoJuego.rondaActual][indiceJugador] = [...nuevaMano];

                renderizarManoVirtual(indiceJugador);
                cerrarModal();
            });
        }

        function generarManoAleatoria() {
            const indiceJugador = indiceJugadorActivoTablero;
            const manoAleatoria = [];
            for (let i = 0; i < 6; i++) {
                const indiceAleatorio = Math.floor(Math.random() * TIPOS_DINO.length);
                manoAleatoria.push(TIPOS_DINO[indiceAleatorio]);
            }
            estadoJuego.manos[indiceJugador] = manoAleatoria;

            if (!estadoJuego.manosOriginales[estadoJuego.rondaActual]) {
                estadoJuego.manosOriginales[estadoJuego.rondaActual] = {};
            }
            estadoJuego.manosOriginales[estadoJuego.rondaActual][indiceJugador] = [...manoAleatoria];

            renderizarManoVirtual(indiceJugador);
            if (window.mostrarNotificacion) window.mostrarNotificacion(`Mano aleatoria generada para ${estadoJuego.jugadores[indiceJugador].nombre}.`, 'success');
        }

        function cambiarPestanaActiva(index) {
            indiceJugadorActivoTablero = parseInt(index);
            document.querySelectorAll('.tab-jugador').forEach((pestana, i) => pestana.classList.toggle('active', i === indiceJugadorActivoTablero));
            document.querySelectorAll('.parque-container').forEach((parque, i) => parque.classList.toggle('hidden', i !== indiceJugadorActivoTablero));

            dinosaurioSeleccionado = null;
            elementoDinoSeleccionado = null;
            renderizarManoVirtual(indiceJugadorActivoTablero);
            limpiarVisualizacionSlots();
            actualizarVisualizacionRestricciones();
        }

        function anadirEventListeners() {
            if (contenedorTableros) {
                contenedorTableros.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    if (e.target.classList.contains('slot-valido')) {
                        e.dataTransfer.dropEffect = 'move';
                    } else {
                        e.dataTransfer.dropEffect = 'none';
                    }
                });
                contenedorTableros.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (e.target.classList.contains('slot-valido')) {
                        const tipoDino = e.dataTransfer.getData('text/plain');
                        dinosaurioSeleccionado = tipoDino;
                        elementoDinoSeleccionado = null; 
                        intentarColocarDinosaurio(e.target);
                    }
                    limpiarVisualizacionSlots();
                });
                //listener para colocar con click
                contenedorTableros.addEventListener('click', (e) => {
                    if (dinosaurioSeleccionado && e.target.classList.contains('slot-valido')) {
                        intentarColocarDinosaurio(e.target);
                    }
                });
            }
            if (btnVerHistorial) btnVerHistorial.addEventListener('click', mostrarHistorial);
            if (btnCerrarModalHistorial) btnCerrarModalHistorial.addEventListener('click', () => modalHistorialOverlay.classList.remove('visible'));
            if (modalHistorialOverlay) modalHistorialOverlay.addEventListener('click', (e) => {
                if (e.target === modalHistorialOverlay) modalHistorialOverlay.classList.remove('visible');
            });

            if (contenedorPestanas) contenedorPestanas.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-jugador')) {
                    cambiarPestanaActiva(e.target.dataset.jugadorIndex);
                }
            });
            if (btnRegistrarMano) btnRegistrarMano.addEventListener('click', abrirModalRegistroMano);
            if (btnSiguienteTurno) btnSiguienteTurno.addEventListener('click', avanzarTurno);
            if (btnLanzarDado) btnLanzarDado.addEventListener('click', lanzarDado);
            if (btnManoAleatoria) btnManoAleatoria.addEventListener('click', generarManoAleatoria);
            if (btnDeshacer) btnDeshacer.addEventListener('click', deshacerUltimoMovimiento);
            if (contenedorRestricciones) contenedorRestricciones.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-dado')) {
                    estadoJuego.restriccionDados = e.target.dataset.restriccion;
                    actualizarUIInfoPartida();
                    actualizarVisualizacionSlots(null);
                    actualizarVisualizacionRestricciones();
                }
            });
            if (btnFinalizarPartida) btnFinalizarPartida.addEventListener('click', mostrarResultadosFinales);
            if (btnCerrarModalResultados) btnCerrarModalResultados.addEventListener('click', () => modalResultadosOverlay.classList.remove('visible'));
            if(btnReiniciarPartida) btnReiniciarPartida.addEventListener('click', reiniciarJuego);
            
            inicializarScrollAlArrastrar();
        }

        // la función que arranca la partida cuando la página carga
        function inicializarJuego() {
            const nombresJugadores = JSON.parse(localStorage.getItem('jugadoresDraftosaurus'));
            if (!nombresJugadores || nombresJugadores.length === 0) {
                alert('No se encontraron jugadores. Por favor, configura una partida primero.');
                window.location.href = 'pages/modo_seguimiento.php';
                return;
            }
            estadoJuego.jugadores = nombresJugadores.map(nombre => ({
                nombre: nombre,
                tablero: {
                    bosqueSemejanza: [], pradoDiferencia: [], praderaAmor: [],
                    trioFrondoso: [], reySelva: [], islaSolitaria: [], rio: []
                },
                puntuacionDetallada: {},
                puntuacionTotal: 0
            }));
            renderizarTableroCompleto();
            actualizarUIInfoPartida();
            anadirEventListeners();
            actualizarEstadoBotonSiguienteTurno();
            renderizarManoVirtual(indiceJugadorActivoTablero);
            actualizarEstilosPestanas();
            actualizarVisualizacionSlots();
        }

        inicializarJuego();
    }
});
