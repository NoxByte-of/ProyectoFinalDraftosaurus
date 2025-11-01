class JuegoDigitalUI {
    constructor(juego) {
        this.juego = juego;
        this._cacheElementosDOM();
        this.dinoSeleccionadoInfo = null;
        this.dinoArrastradoInfo = null;
    }

    _cacheElementosDOM() {
        this.elementosDOM = {
            contenedorJuego: document.getElementById('game-container'),
            contenedorPestanas: document.getElementById('tabs-jugadores-digital'),
            tituloTablero: document.getElementById('board-title'),
            puntuacionTablero: document.querySelector('#board-score span'),
            contenedorSlots: document.getElementById('contenedor-slots-tablero'),
            infoRonda: document.getElementById('round-number'),
            infoTurno: document.getElementById('turn-number'),
            infoJugadorActivo: document.getElementById('active-player-name'),
            btnLanzarDado: document.getElementById('roll-dice-btn'),
            btnGuardarSalir: document.getElementById('btn-guardar-salir'),
            textoResultadoDado: document.getElementById('dice-result-text'),
            dado: document.getElementById('dice-digital'),
            contenedorMano: document.getElementById('current-player-hand'),
            modalFinJuego: {
                overlay: document.getElementById('end-game-modal'),
                contenedorPuntuaciones: document.getElementById('final-scores-container'),
                contenedorGanador: document.getElementById('winner-container'),
                btnCerrar: document.getElementById('btn-close-end-game-modal'),
            },
            modalGuardadoFinal: {
                overlay: document.getElementById('guardar-partida-modal-overlay'),
                inputNombre: document.getElementById('nombre-partida-finalizada'),
                btnConfirmar: document.getElementById('btn-confirmar-guardado-final'),
                btnCancelar: document.getElementById('btn-cancelar-guardado-final'),
            },
            paneles: {
                infoPartida: document.getElementById('info-partida'),
                areaDado: document.getElementById('dice-area'),
                areaMano: document.getElementById('player-hand-area'),
                accionesFinJuego: document.getElementById('end-game-actions-container'),
                accionesJuego: document.getElementById('game-actions-area'),
            }
        };
    }

    inicializarEventos() {
        this.elementosDOM.btnLanzarDado?.addEventListener('click', () => this.juego.manejarLanzamientoDado());
        this.elementosDOM.btnGuardarSalir?.addEventListener('click', () => this.juego.manejarGuardarPartida());

        this.elementosDOM.contenedorPestanas?.addEventListener('click', e => {
            if (e.target.matches('.tab-jugador-digital')) {
                this.juego.cambiarVistaJugador(parseInt(e.target.dataset.jugadorIndex));
            }
        });

        this.elementosDOM.contenedorSlots?.addEventListener('dragover', e => this._manejadorDragOver(e));
        this.elementosDOM.contenedorSlots?.addEventListener('drop', e => this._manejadorDrop(e));
        this.elementosDOM.contenedorSlots?.addEventListener('click', e => this._manejadorClicSlot(e));

        // Eventos del modal de fin de juego (ahora debería funcionar)
        this.elementosDOM.modalFinJuego?.btnCerrar?.addEventListener('click', () => this.ocultarModalFinJuego());
        document.getElementById('btn-ver-puntuaciones')?.addEventListener('click', () => this.mostrarModalFinJuego());
        this.elementosDOM.modalFinJuego?.overlay?.addEventListener('click', e => {
            if (e.target === this.elementosDOM.modalFinJuego.overlay) {
                this.ocultarModalFinJuego();
            }
        });

        const { modalGuardadoFinal } = this.elementosDOM;
        if (modalGuardadoFinal?.overlay) {
            modalGuardadoFinal.btnCancelar?.addEventListener('click', () => this.ocultarModalGuardadoFinal());
            modalGuardadoFinal.overlay.addEventListener('click', e => {
                if (e.target === modalGuardadoFinal.overlay) {
                    this.ocultarModalGuardadoFinal();
                }
            });
            modalGuardadoFinal.inputNombre?.addEventListener('input', () => {
                const nombreValido = modalGuardadoFinal.inputNombre.value.trim().length > 0;
                if (modalGuardadoFinal.btnConfirmar) {
                    modalGuardadoFinal.btnConfirmar.disabled = !nombreValido;
                }
            });
            modalGuardadoFinal.btnConfirmar?.addEventListener('click', () => {
                const nombrePartida = modalGuardadoFinal.inputNombre?.value.trim() ?? '';
                if (nombrePartida) {
                     this.juego.manejarConfirmacionGuardadoFinal(nombrePartida);
                }
            });
        }
    }

    abrirModalGuardadoFinal() {
        if (!this.elementosDOM.modalGuardadoFinal?.overlay) return;
        if (this.elementosDOM.modalGuardadoFinal.inputNombre) this.elementosDOM.modalGuardadoFinal.inputNombre.value = '';
        if (this.elementosDOM.modalGuardadoFinal.btnConfirmar) this.elementosDOM.modalGuardadoFinal.btnConfirmar.disabled = true;
        this.elementosDOM.modalGuardadoFinal.overlay.classList.add('visible');
    }

    ocultarModalGuardadoFinal() {
        this.elementosDOM.modalGuardadoFinal?.overlay?.classList.remove('visible');
    }

    mostrarModalFinJuego() {
        this.elementosDOM.modalFinJuego?.overlay?.classList.add('visible');
    }
    ocultarModalFinJuego() {
        this.elementosDOM.modalFinJuego?.overlay?.classList.remove('visible');
    }

    renderizarTodo() {
        const estado = this.juego.obtenerEstado();
        if (!estado) return;

        this.renderizarPestanas(estado);
        this.renderizarInfoPartida(estado);
        this.renderizarTablero(estado);
        this.renderizarMano(estado);

        // Lógica para mostrar/ocultar paneles
        const { paneles, btnGuardarSalir } = this.elementosDOM;
        const estaFinalizada = estado.partidaFinalizada;
        const modoVisualizacion = this.juego.enModoVisualizacion;

        paneles.infoPartida?.classList.toggle('hidden', estaFinalizada);
        paneles.areaDado?.classList.toggle('hidden', estaFinalizada);
        paneles.areaMano?.classList.toggle('hidden', estaFinalizada);
        
        // Corrección de la lógica de visibilidad de botones
        paneles.accionesJuego?.classList.toggle('hidden', modoVisualizacion);
        paneles.accionesFinJuego?.classList.toggle('hidden', !estaFinalizada);

        if (btnGuardarSalir) {
            btnGuardarSalir.textContent = traducirJS(estaFinalizada ? 'digital_modal_guardar_titulo' : 'digital_btn_guardar_salir');
        }
    }

    renderizarPestanas(estado) {
        if (!this.elementosDOM.contenedorPestanas) return;
        this.elementosDOM.contenedorPestanas.innerHTML = '';
        estado.jugadores.forEach((jugador, index) => {
            const pestana = document.createElement('button');
            pestana.className = 'tab-jugador-digital';
            pestana.textContent = jugador.nombre;
            pestana.dataset.jugadorIndex = index;
            pestana.classList.toggle('active', index === estado.indiceJugadorVista);
            pestana.classList.add(estado.jugadoresQueHanJugadoEsteTurno.includes(jugador.id) ? 'listo' : 'pendiente');
            this.elementosDOM.contenedorPestanas.appendChild(pestana);
        });
    }

    renderizarInfoPartida(estado) {
        if (this.elementosDOM.infoRonda) this.elementosDOM.infoRonda.textContent = estado.rondaActual;
        if (this.elementosDOM.infoTurno) this.elementosDOM.infoTurno.textContent = estado.turnoActual;
        if (this.elementosDOM.infoJugadorActivo && estado.jugadores[estado.indiceJugadorDado]) {
             this.elementosDOM.infoJugadorActivo.textContent = estado.jugadores[estado.indiceJugadorDado].nombre;
        } else if (this.elementosDOM.infoJugadorActivo) {
             this.elementosDOM.infoJugadorActivo.textContent = '---';
        }

        if (this.elementosDOM.btnLanzarDado) this.elementosDOM.btnLanzarDado.disabled = estado.restriccionDado !== null;

        if(this.elementosDOM.textoResultadoDado) {
            // --- INICIO DE LA CORRECCIÓN ---
            // Se usa replace(/-/g, '_') para reemplazar TODOS los guiones
            const claveTraduccionDado = estado.restriccionDado
                ? 'tablero_dado_' + estado.restriccionDado.replace(/-/g, '_') 
                : 'digital_dado_resultado_ninguna';
            // --- FIN DE LA CORRECCIÓN ---
            this.elementosDOM.textoResultadoDado.textContent = traducirJS(claveTraduccionDado);
        }
    }

    renderizarTablero(estado) {
        const jugador = estado.jugadores[estado.indiceJugadorVista];
        if (!jugador) return;

        if (this.elementosDOM.tituloTablero) {
            const idiomaActual = window.translations?.lang_en === "English" ? 'en' : 'es';
            let tituloTexto;
            if (idiomaActual === 'en') {
                tituloTexto = traducirJS('digital_parque_titulo_en', { nombre: jugador.nombre });
            } else {
                const traduccionBase = traducirJS('tablero_parque_de');
                tituloTexto = `${traduccionBase} ${jugador.nombre}`;
            }
            this.elementosDOM.tituloTablero.textContent = tituloTexto;
        }

        if(this.elementosDOM.puntuacionTablero) {
             this.elementosDOM.puntuacionTablero.textContent = jugador.puntuacionTotal || 0;
        }

        this.elementosDOM.contenedorSlots?.querySelectorAll('.dino-slot-digital').forEach(slot => {
             MotorJuego.TIPOS_DINO.forEach(tipo => slot.classList.remove(tipo));
             slot.classList.remove('ocupado');
        });

        if(this.elementosDOM.contenedorSlots) {
            for (const recinto in jugador.parque) {
                jugador.parque[recinto]?.forEach((dino) => {
                    if (dino && dino.slotId) {
                        const slotParaDino = this.elementosDOM.contenedorSlots.querySelector(`.dino-slot-digital[data-slot-id="${dino.slotId}"]`);
                        if (slotParaDino) {
                            slotParaDino.classList.add(dino.especie, 'ocupado');
                        } else {
                             console.warn(`Slot no encontrado para ${dino.slotId}`);
                        }
                    }
                });
            }
        }
    }

    renderizarMano(estado) {
        if (!this.elementosDOM.contenedorMano) return;
        this.elementosDOM.contenedorMano.innerHTML = '';
        const jugador = estado.jugadores[estado.indiceJugadorVista];

        if (!jugador) return;

        if (estado.partidaFinalizada) {
            this.elementosDOM.contenedorMano.innerHTML = `<p class="mensaje-mano">${traducirJS('digital_mano_partida_finalizada')}</p>`;
            return;
        }

        if (estado.jugadoresQueHanJugadoEsteTurno.includes(jugador.id)) {
            this.elementosDOM.contenedorMano.innerHTML = `<p class="mensaje-mano">${traducirJS('digital_mano_esperando')}</p>`;
            return;
        }

        jugador.mano?.forEach(dino => {
            if (dino) {
                 this.elementosDOM.contenedorMano.appendChild(this._crearElementoDino(dino));
            }
        });
    }

    _crearElementoDino(dino) {
        const dinoEl = document.createElement('div');
        dinoEl.className = 'dino-selector';
        dinoEl.dataset.dinoType = dino.especie;
        dinoEl.id = dino.id;
        dinoEl.draggable = true;
        dinoEl.addEventListener('dragstart', e => this._manejadorArrastre(e, dino));
        dinoEl.addEventListener('dragend', e => this._manejadorFinArrastre(e));
        dinoEl.addEventListener('click', () => this._manejadorClicDino(dinoEl, dino));
        return dinoEl;
    }

    _manejadorArrastre(e, dino) {
        if (!this.juego.puedeJugarElJugadorActual()) { e.preventDefault(); return; }
        this.dinoArrastradoInfo = { id: dino.id, especie: dino.especie };
        e.dataTransfer.setData('text/plain', dino.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { if(e.target) e.target.style.opacity = '0.5'; }, 0);
        this.resaltarSlotsValidos(dino.especie);
    }

    _manejadorFinArrastre(e) {
        if(e.target) e.target.style.opacity = '1';
        this.dinoArrastradoInfo = null;
        this.limpiarResaltadoSlots();
    }

    _manejadorClicDino(dinoEl, dino) {
        if (!this.juego.puedeJugarElJugadorActual()) return;
        if (dinoEl.classList.contains('selected')) {
            dinoEl.classList.remove('selected');
            this.dinoSeleccionadoInfo = null;
            this.limpiarResaltadoSlots();
        } else {
            this.elementosDOM.contenedorMano?.querySelector('.dino-selector.selected')?.classList.remove('selected');
            dinoEl.classList.add('selected');
            this.dinoSeleccionadoInfo = { id: dino.id, especie: dino.especie, elemento: dinoEl };
            this.resaltarSlotsValidos(dino.especie);
        }
    }

    _manejadorDragOver(e) {
        if (e.target.classList.contains('slot-valido')) {
            e.preventDefault();
             e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    }

    _manejadorDrop(e) {
        e.preventDefault();
        if (e.target.classList.contains('slot-valido') && this.dinoArrastradoInfo) {
            this.juego.colocarDinosaurio(e.target.dataset.slotId, this.dinoArrastradoInfo);
        }
         this.dinoArrastradoInfo = null;
         this.limpiarResaltadoSlots();
         const dinoArrastradoEl = this.elementosDOM.contenedorMano?.querySelector(`[id="${e.dataTransfer.getData('text/plain')}"]`);
         if (dinoArrastradoEl) dinoArrastradoEl.style.opacity = '1';
    }

    _manejadorClicSlot(e) {
        if (this.dinoSeleccionadoInfo && e.target.classList.contains('slot-valido')) {
            this.juego.colocarDinosaurio(e.target.dataset.slotId, this.dinoSeleccionadoInfo);
             if(this.dinoSeleccionadoInfo.elemento) {
                 this.dinoSeleccionadoInfo.elemento.classList.remove('selected');
             }
             this.dinoSeleccionadoInfo = null;
             this.limpiarResaltadoSlots();
        }
    }

    resaltarSlotsValidos(tipoDino) {
        this.limpiarResaltadoSlots();
        const slotsValidos = this.juego.obtenerSlotsValidos(tipoDino);
        slotsValidos.forEach(slotId => {
            const slot = this.elementosDOM.contenedorSlots?.querySelector(`.dino-slot-digital[data-slot-id="${slotId}"]`);
            if (slot) slot.classList.add('slot-valido');
        });
    }

    limpiarResaltadoSlots() {
        this.elementosDOM.contenedorSlots?.querySelectorAll('.slot-valido').forEach(s => s.classList.remove('slot-valido'));
    }

    animarLanzamientoDado(indiceCara) {
         if (!this.elementosDOM.dado) return;
        const rotaciones = [
            { x: 0, y: 0 }, { x: 0, y: 180 }, { x: 0, y: -90 },
            { x: 0, y: 90 }, { x: -90, y: 0 }, { x: 90, y: 0 }
        ];
        const vueltasAleatoriasX = (Math.floor(Math.random() * 3) + 2) * 360;
        const vueltasAleatoriasY = (Math.floor(Math.random() * 3) + 2) * 360;
        const vueltasAleatoriasZ = (Math.floor(Math.random() * 3) + 2) * 360;
        const rotacionFinal = rotaciones[indiceCara] || {x:0, y:0};
        this.elementosDOM.dado.style.transform = `
            rotateX(${vueltasAleatoriasX + rotacionFinal.x}deg)
            rotateY(${vueltasAleatoriasY + rotacionFinal.y}deg)
            rotateZ(${vueltasAleatoriasZ}deg)
        `;
    }

    mostrarResultadosFinales(estado) {
        if (!this.elementosDOM.modalFinJuego?.overlay) return;

        const jugadoresOrdenados = [...estado.jugadores].sort((a, b) => {
            if (b.puntuacionTotal !== a.puntuacionTotal) {
                return b.puntuacionTotal - a.puntuacionTotal;
            }
            return MotorJuego.contarTRex(a) - MotorJuego.contarTRex(b);
        });

        if (this.elementosDOM.modalFinJuego.contenedorPuntuaciones) {
            this.elementosDOM.modalFinJuego.contenedorPuntuaciones.innerHTML = '';
        } else {
             console.error("Contenedor de puntuaciones finales no encontrado");
             return;
        }

        const primerJugador = jugadoresOrdenados[0];
        const ganadores = jugadoresOrdenados.filter(jugador =>
            jugador.puntuacionTotal === primerJugador?.puntuacionTotal &&
            MotorJuego.contarTRex(jugador) === MotorJuego.contarTRex(primerJugador || {})
        );

        jugadoresOrdenados.forEach(jugador => {
            const p = jugador.puntuacionDetallada || {};
            const esGanador = ganadores.some(g => g.id === jugador.id);
            const resultadoDiv = document.createElement('div');
            resultadoDiv.className = 'jugador-resultados';
            resultadoDiv.innerHTML = `<h3>${jugador.nombre} ${esGanador ? '⭐' : ''}</h3>
                <ul>
                    <li><span>${traducirJS('tablero_recinto_bosque_semejanza')}:</span> <span>${p.bosqueSemejanza || 0}</span></li>
                    <li><span>${traducirJS('tablero_recinto_prado_diferencia')}:</span> <span>${p.pradoDiferencia || 0}</span></li>
                    <li><span>${traducirJS('tablero_recinto_pradera_amor')}:</span> <span>${p.praderaAmor || 0}</span></li>
                    <li><span>${traducirJS('tablero_recinto_trio_frondoso')}:</span> <span>${p.trioFrondoso || 0}</span></li>
                    <li><span>${traducirJS('tablero_recinto_rey_selva')}:</span> <span>${p.reySelva || 0}</span></li>
                    <li><span>${traducirJS('tablero_recinto_isla_solitaria')}:</span> <span>${p.islaSolitaria || 0}</span></li>
                    <li><span>${traducirJS('tablero_recinto_rio')}:</span> <span>${p.rio || 0}</span></li>
                    <li><span>Bonus T-Rex:</span> <span>${p.bonusTRex || 0}</span></li>
                </ul>
                <p class="total-puntos"><strong>Total: ${jugador.puntuacionTotal || 0} Puntos</strong></p>`;
            this.elementosDOM.modalFinJuego.contenedorPuntuaciones.appendChild(resultadoDiv);
        });

        let mensajeGanador = traducirJS('resultados_no_ganador');
        if (ganadores.length > 1) {
            const nombresGanadores = ganadores.map(g => g.nombre).join(' y ');
            mensajeGanador = traducirJS('resultados_empate', {nombresGanadores});
        } else if (ganadores.length === 1) {
            mensajeGanador = traducirJS('resultados_ganador', {nombreGanador: ganadores[0].nombre});
        }

        if(this.elementosDOM.modalFinJuego.contenedorGanador) {
            this.elementosDOM.modalFinJuego.contenedorGanador.innerHTML = `<p>${mensajeGanador}</p>`;
        }
        this.mostrarModalFinJuego();
    }

    notificar(mensaje, tipo = 'info') {
        if (window.notificador) {
            window.notificador.mostrar(mensaje, tipo);
        } else {
            console.error('El notificador global no está disponible. Mensaje:', mensaje);
             alert(`[${tipo.toUpperCase()}] ${mensaje}`);
        }
    }
}

class JuegoDigital {
    constructor(configuracion, ui) {
        this.configuracion = configuracion;
        this.ui = ui;
        this.estado = null;
        this.enModoVisualizacion = false;
    }

    iniciar() {
        this.estado = this._crearEstadoInicial(this.configuracion);
        this._repartirDinos();
        this.ui.inicializarEventos();
        this.ui.renderizarTodo();
    }

    cargarDesdeEstado(estadoGuardado) {
        try {
             if (!estadoGuardado || !Array.isArray(estadoGuardado.jugadores) || estadoGuardado.jugadores.length === 0) {
                 throw new Error("El estado guardado es inválido o está incompleto.");
             }
            this.estado = estadoGuardado;
            this.configuracion = {
                playerCount: estadoGuardado.numeroDeJugadores ?? estadoGuardado.jugadores.length,
                playerNames: estadoGuardado.jugadores.map(j => j.nombre)
            };
            this.ui.inicializarEventos();
            this.ui.renderizarTodo();

            if (this.estado.partidaFinalizada) {
                this.ui.notificar(traducirJS('notif_digital_visualizando'), 'info');
                setTimeout(() => {
                    this.ui.mostrarResultadosFinales(this.estado);
                }, 500);
            } else {
                this.ui.notificar(traducirJS('notif_digital_reanudada'), 'success');
            }
        } catch(error) {
             console.error("Error al cargar desde estado:", error);
             this.ui.notificar(traducirJS('notif_digital_error_reanudar') + `: ${error.message}`, 'error');
             this.iniciar();
        }
    }

    obtenerEstado() {
        return this.estado;
    }

    _crearEstadoInicial({ playerCount, playerNames }) {
        const bolsaDeDinos = this._crearBolsaDeDinos(playerCount);
        this._barajarArray(bolsaDeDinos);
        const jugadores = Array.from({ length: playerCount }, (_, i) => ({
            id: i,
            nombre: playerNames[i] || `${traducirJS('config_placeholder_nombre_defecto', {numero: i + 1})}`,
            parque: { bosqueSemejanza: [], pradoDiferencia: [], praderaAmor: [], trioFrondoso: [], reySelva: [], islaSolitaria: [], rio: [] },
            mano: [],
            puntuacionTotal: 0,
            puntuacionDetallada: {}
        }));

        return {
            numeroDeJugadores: playerCount,
            bolsaDeDinos: bolsaDeDinos,
            jugadores: jugadores,
            rondaActual: 1,
            turnoActual: 1,
            indiceJugadorDado: 0,
            indiceJugadorVista: 0,
            restriccionDado: null,
            jugadoresQueHanJugadoEsteTurno: [],
            partidaFinalizada: false
        };
    }

    cambiarVistaJugador(nuevoIndice) {
        if (this.estado.indiceJugadorVista !== nuevoIndice && nuevoIndice >= 0 && nuevoIndice < this.estado.numeroDeJugadores) {
            this.estado.indiceJugadorVista = nuevoIndice;
            this.ui.renderizarTodo();
        }
    }

    puedeJugarElJugadorActual() {
        if (this.estado.partidaFinalizada) return false;
        const jugadorActual = this.estado.jugadores[this.estado.indiceJugadorVista];
        if (!jugadorActual) return false;
        if (this.estado.jugadoresQueHanJugadoEsteTurno.includes(jugadorActual.id)) {
            return false;
        }
        if (this.estado.restriccionDado === null) {
            const nombreJugadorDado = this.estado.jugadores[this.estado.indiceJugadorDado]?.nombre || 'Jugador activo';
            if (this.estado.indiceJugadorVista === this.estado.indiceJugadorDado) {
                this.ui.notificar(traducirJS('notif_digital_debes_lanzar'), 'error');
            } else {
                this.ui.notificar(traducirJS('notif_digital_jugador_no_activo', {nombreJugadorActivo: nombreJugadorDado}), 'error');
            }
            return false;
        }
        return true;
    }

    manejarLanzamientoDado() {
        if (this.estado.partidaFinalizada) return;
        if (this.estado.restriccionDado !== null) return;
        if (this.estado.indiceJugadorVista !== this.estado.indiceJugadorDado) {
            const nombreJugadorActivo = this.estado.jugadores[this.estado.indiceJugadorDado]?.nombre || 'Jugador activo';
            this.ui.notificar(traducirJS('notif_digital_jugador_no_activo', {nombreJugadorActivo: nombreJugadorActivo}), 'error');
            return;
        }

        const caras = ['boscosa', 'llanura', 'cafeteria', 'banos', 'vacio', 'sin-t-rex'];
        let resultado = caras[Math.floor(Math.random() * caras.length)];

        this.estado.restriccionDado = resultado;

        const indiceCaraDado = { 'boscosa': 0, 'banos': 1, 'llanura': 2, 'cafeteria': 3, 'vacio': 4, 'sin-t-rex': 5 }[resultado];

        this.ui.animarLanzamientoDado(indiceCaraDado);

        setTimeout(() => {
            this.ui.renderizarInfoPartida(this.estado);
             // --- INICIO DE LA CORRECCIÓN ---
             // Se usa replace(/-/g, '_') para reemplazar TODOS los guiones
             const claveTraduccionDado = this.estado.restriccionDado ? 'tablero_dado_' + this.estado.restriccionDado.replace(/-/g, '_') : null;
             // --- FIN DE LA CORRECCIÓN ---
             const textoRestriccion = claveTraduccionDado ? traducirJS(claveTraduccionDado) : 'Error';
             this.ui.notificar(traducirJS('notif_dado_lanzado', {restriccion: textoRestriccion}), 'info');
        }, 2000);
    }

    async manejarGuardarPartida() {
        if (this.estado.partidaFinalizada) {
             this.ui.abrirModalGuardadoFinal();
             return;
        }

        try {
            const estadoJuegoJSON = JSON.stringify(this.estado);
            const respuesta = await fetch('/backend/partidas/guardar_partida.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: estadoJuegoJSON,
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || `Error HTTP ${respuesta.status}`);

            if (datos.exito) {
                this.ui.notificar(datos.mensaje || traducirJS('partida_guardada_exito'), 'success');
                setTimeout(() => window.location.href = '../index.php', 1500);
            } else {
                this.ui.notificar(datos.mensaje || traducirJS('partida_error_guardar_db'), 'error');
            }
        } catch (error) {
            console.error('Error al guardar partida en progreso:', error);
            this.ui.notificar(`${traducirJS('notif_error_conexion')}: ${error.message}`, 'error');
        }
    }

    async manejarConfirmacionGuardadoFinal(nombrePartida) {
        const botonConfirmar = this.ui.elementosDOM.modalGuardadoFinal?.btnConfirmar;
        if (botonConfirmar) {
            botonConfirmar.disabled = true;
            botonConfirmar.textContent = traducirJS('digital_dado_guardando');
        }

        try {
            const datosParaGuardar = { nombre_partida: nombrePartida, estado_juego: JSON.stringify(this.estado) };
            const respuesta = await fetch('/backend/partidas/guardar_partida_finalizada.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosParaGuardar)
            });
             const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || `Error HTTP ${respuesta.status}`);

            if (datos.exito) {
                this.ui.notificar(datos.mensaje || traducirJS('historial_guardado_exito'), 'success');
                this.ui.ocultarModalGuardadoFinal();
                setTimeout(() => window.location.href = '../index.php', 1500);
            } else {
                 this.ui.notificar(datos.mensaje || traducirJS('partida_error_guardar_historial_db'), 'error');
                 if (botonConfirmar) {
                     botonConfirmar.disabled = false;
                     botonConfirmar.textContent = traducirJS('digital_btn_guardar_final');
                 }
            }
        } catch (error) {
            console.error('Error al guardar partida finalizada:', error);
            this.ui.notificar(`${traducirJS('notif_error_conexion')}: ${error.message}`, 'error');
             if (botonConfirmar) {
                 botonConfirmar.disabled = false;
                 botonConfirmar.textContent = traducirJS('digital_btn_guardar_final');
             }
        }
    }

    colocarDinosaurio(slotId, dinoInfo) {
        const jugador = this.estado.jugadores[this.estado.indiceJugadorVista];
        if (!jugador || !jugador.mano) return;

        const indiceDinoEnMano = jugador.mano.findIndex(d => d && d.id === dinoInfo.id);
        if (indiceDinoEnMano === -1) {
            console.warn(`Dino con ID ${dinoInfo.id} no encontrado en la mano del jugador ${jugador.nombre}`);
            return;
        }

        const dino = jugador.mano.splice(indiceDinoEnMano, 1)[0];
         const slotElement = document.querySelector(`.dino-slot-digital[data-slot-id="${slotId}"]`);
         const recintoElement = slotElement?.closest('.recinto-digital');
         if (!recintoElement) {
             console.error(`No se pudo encontrar el recinto para el slot ${slotId}`);
             jugador.mano.splice(indiceDinoEnMano, 0, dino);
             this.ui.notificar("Error al identificar el recinto.", "error");
             return;
         }
         const claveRecinto = recintoElement.dataset.recinto;

        if (!jugador.parque[claveRecinto]) jugador.parque[claveRecinto] = [];
        jugador.parque[claveRecinto].push({ especie: dino.especie, id: dino.id, slotId: slotId });

        this.estado.jugadoresQueHanJugadoEsteTurno.push(jugador.id);
        this._recalcularPuntuaciones();
        this.ui.dinoSeleccionadoInfo = null;

        if (this.estado.jugadoresQueHanJugadoEsteTurno.length === this.estado.numeroDeJugadores) {
            const turnoActual = this.estado.turnoActual;
            const proximoTurno = turnoActual === 6 ? 1 : turnoActual + 1;
            const proximaRonda = turnoActual === 6 ? this.estado.rondaActual + 1 : this.estado.rondaActual;
            if (proximaRonda <= 2) {
                const mensaje = traducirJS('notif_digital_turno_finalizado', {turnoActual, proximoTurno, proximaRonda});
                this.ui.notificar(mensaje, 'success');
            }
            setTimeout(() => this._finalizarTurno(), 1000);
        } else {
            let proximoIndice = (this.estado.indiceJugadorVista + 1) % this.estado.numeroDeJugadores;
            while(this.estado.jugadoresQueHanJugadoEsteTurno.includes(this.estado.jugadores[proximoIndice]?.id)) {
                proximoIndice = (proximoIndice + 1) % this.estado.numeroDeJugadores;
            }
            this.estado.indiceJugadorVista = proximoIndice;
            const nombreProximoJugador = this.estado.jugadores[proximoIndice]?.nombre || 'Siguiente jugador';
            this.ui.notificar(traducirJS('notif_digital_turno_de', {nombreProximoJugador: nombreProximoJugador}), 'info');
        }

        this.ui.renderizarTodo();
    }

    _finalizarTurno() {
        if (this.estado.turnoActual === 6) {
            this._finalizarRonda();
            return;
        }

        const manosActuales = this.estado.jugadores.map(j => j.mano || []);
        const numJugadores = this.estado.numeroDeJugadores;
        for (let i = 0; i < numJugadores; i++) {
            const indiceAnterior = (i - 1 + numJugadores) % numJugadores;
            this.estado.jugadores[i].mano = manosActuales[indiceAnterior];
        }

        this.estado.turnoActual++;
        this.estado.indiceJugadorDado = (this.estado.indiceJugadorDado + 1) % numJugadores;
        this.estado.indiceJugadorVista = this.estado.indiceJugadorDado;
        this.estado.restriccionDado = null;
        this.estado.jugadoresQueHanJugadoEsteTurno = [];

        this.ui.renderizarTodo();
    }

    _finalizarRonda() {
        if (this.estado.rondaActual === 2) {
            this.finalizarPartida();
            return;
        }

        this.ui.notificar(traducirJS('notif_digital_fin_ronda', {rondaActual: this.estado.rondaActual}), 'success');

        this.estado.rondaActual++;
        this.estado.turnoActual = 1;
        this.estado.indiceJugadorDado = 0;
        this.estado.indiceJugadorVista = 0;
        this.estado.jugadoresQueHanJugadoEsteTurno = [];
        this.estado.restriccionDado = null;

        this._repartirDinos();
        this.ui.renderizarTodo();
    }

    finalizarPartida() {
        this.estado.partidaFinalizada = true;
        this._recalcularPuntuaciones();
        this.ui.mostrarResultadosFinales(this.estado);
        this.ui.renderizarTodo();
    }

    obtenerSlotsValidos(tipoDino) {
        const jugador = this.estado.jugadores[this.estado.indiceJugadorVista];
        if (!jugador) return [];

        let slotsValidos = [];
        let haySlotsGenerales = false;

         const tableroVisible = document.querySelector(`#contenedor-slots-tablero`);
         if (!tableroVisible) return [];

         const todosLosRecintos = tableroVisible.querySelectorAll('.recinto-digital');

        todosLosRecintos.forEach(recintoEl => {
            const claveRecinto = recintoEl.dataset.recinto;
            if (!claveRecinto || claveRecinto === 'rio') return;

            const dinosEnRecinto = jugador.parque[claveRecinto] || [];
             const primerSlotVacioEl = recintoEl.querySelector('.dino-slot-digital:not(.ocupado)');

            if (!primerSlotVacioEl) return;

            if (this._esMovimientoValido(claveRecinto, tipoDino, dinosEnRecinto)) {
                slotsValidos.push(primerSlotVacioEl.dataset.slotId);
                haySlotsGenerales = true;
            }
        });

        if (!haySlotsGenerales) {
            const recintoRio = tableroVisible.querySelector('.recinto-digital[data-recinto="rio"]');
             if (recintoRio) {
                 recintoRio.querySelectorAll('.dino-slot-digital:not(.ocupado)').forEach(slot => {
                     if (slot.dataset.slotId) slotsValidos.push(slot.dataset.slotId);
                 });
             }
        }
        return slotsValidos;
    }

    _esMovimientoValido(claveRecinto, tipoDino, dinosEnRecinto) {
        if (claveRecinto === 'bosqueSemejanza' && dinosEnRecinto.length > 0 && dinosEnRecinto[0].especie !== tipoDino) return false;
        if (claveRecinto === 'pradoDiferencia' && dinosEnRecinto.some(d => d.especie === tipoDino)) return false;

        const jugador = this.estado.jugadores[this.estado.indiceJugadorVista];
        if (jugador && jugador.id !== this.estado.indiceJugadorDado && this.estado.restriccionDado) {
            const zonas = {
                cafeteria: ['praderaAmor', 'trioFrondoso', 'bosqueSemejanza'],
                banos: ['reySelva', 'islaSolitaria', 'pradoDiferencia'],
                boscosa: ['bosqueSemejanza', 'reySelva', 'trioFrondoso'],
                llanura: ['pradoDiferencia', 'islaSolitaria', 'praderaAmor']
            };

            let cumpleRestriccion = true;
            switch (this.estado.restriccionDado) {
                case 'cafeteria': if (!zonas.cafeteria.includes(claveRecinto)) cumpleRestriccion = false; break;
                case 'banos': if (!zonas.banos.includes(claveRecinto)) cumpleRestriccion = false; break;
                case 'boscosa': if (!zonas.boscosa.includes(claveRecinto)) cumpleRestriccion = false; break;
                case 'llanura': if (!zonas.llanura.includes(claveRecinto)) cumpleRestriccion = false; break;
                case 'vacio': if (dinosEnRecinto.length > 0) cumpleRestriccion = false; break;
                case 'sin-t-rex':
                    if (dinosEnRecinto.some(d => d.especie === 't-rex')) {
                         cumpleRestriccion = false;
                    }
                    break;
            }

            if (!cumpleRestriccion) return false;
        }
        return true;
    }

    _recalcularPuntuaciones() {
        this.estado.jugadores.forEach(jugador => {
            const res = MotorJuego.calcularPuntuacionTotal(jugador, this.estado.jugadores);
            jugador.puntuacionDetallada = res.puntajes;
            jugador.puntuacionTotal = res.total;
        });
    }

    _crearBolsaDeDinos(numJugadores) {
        const dinosPorEspecie = { 5: 10, 4: 8, 3: 6, 2: 8 }[numJugadores] || 10;
        let idCounter = 0;
        return MotorJuego.TIPOS_DINO.flatMap(especie =>
            Array.from({ length: dinosPorEspecie }, () => ({ id: `dino-${idCounter++}`, especie }))
        );
    }

    _repartirDinos() {
        this.estado.jugadores.forEach(jugador => {
            if (this.estado.bolsaDeDinos.length < 6) {
                 console.warn("No hay suficientes dinos en la bolsa para repartir.");
                 return;
            }
            jugador.mano = this.estado.bolsaDeDinos.splice(0, 6);
        });
    }

    _barajarArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const contenedorJuego = document.getElementById('game-container');
    if (!contenedorJuego) return;

    const partidaParaVisualizarJSON = sessionStorage.getItem('partidaParaVisualizar');
    const partidaParaReanudarJSON = sessionStorage.getItem('partidaParaReanudar');
    const configNuevaPartidaJSON = sessionStorage.getItem('draftosaurusGameConfig');

    const ui = new JuegoDigitalUI(null);
    let juego;

    try {
        if (partidaParaVisualizarJSON) {
            sessionStorage.removeItem('partidaParaVisualizar');
            const estadoGuardado = JSON.parse(partidaParaVisualizarJSON);
            juego = new JuegoDigital({}, ui);
            juego.enModoVisualizacion = true;
            ui.juego = juego;
            juego.cargarDesdeEstado(estadoGuardado);
            contenedorJuego.classList.remove('hidden');

        } else if (partidaParaReanudarJSON) {
            sessionStorage.removeItem('partidaParaReanudar');
            const estadoGuardado = JSON.parse(partidaParaReanudarJSON);
             juego = new JuegoDigital({}, ui);
             ui.juego = juego;
            juego.cargarDesdeEstado(estadoGuardado);
            contenedorJuego.classList.remove('hidden');

        } else if (configNuevaPartidaJSON) {
            sessionStorage.removeItem('draftosaurusGameConfig');
            const configuracion = JSON.parse(configNuevaPartidaJSON);
             if (!configuracion || typeof configuracion.playerCount !== 'number' || !Array.isArray(configuracion.playerNames)) {
                 throw new Error("Configuración de nueva partida inválida.");
             }
            juego = new JuegoDigital(configuracion, ui);
            ui.juego = juego;
            juego.iniciar();
            contenedorJuego.classList.remove('hidden');
        } else {
            console.log("No se encontró configuración ni partida guardada. Redirigiendo...");
            window.location.href = 'modo_juego_digital.php';
        }
    } catch (error) {
        console.error("Error al inicializar el juego:", error);
        if (ui) {
             ui.notificar(traducirJS('notif_digital_error_reanudar') + `: ${error.message}`, "error");
        } else {
             alert(traducirJS('notif_digital_error_reanudar') + `: ${error.message}`);
        }
        setTimeout(() => {
             window.location.href = 'modo_juego_digital.php';
        }, 2000);
    }
});
