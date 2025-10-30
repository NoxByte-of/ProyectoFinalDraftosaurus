class TableroUI {
    constructor(juego) {
        this.juego = juego;
        this.elementosDOM = {
            contenedorPestanas: document.getElementById('tabs-jugadores'),
            contenedorTableros: document.getElementById('tableros-container'),
            plantillaParque: document.getElementById('plantilla-parque-jugador'),
            infoRonda: document.getElementById('ronda-actual'),
            infoTurno: document.getElementById('turno-actual'),
            infoJugadorActivoDados: document.getElementById('jugador-activo-dados'),
            tituloManoVirtual: document.getElementById('titulo-mano-virtual'),
            contenedorRestricciones: document.getElementById('restricciones-dados-container'),
            manoVirtual: document.getElementById('mano-virtual-dinos'),
            infoManoVirtual: document.getElementById('mano-virtual-info'),
            btnSiguienteTurno: document.getElementById('btn-siguiente-turno'),
            modalResultados: {
                overlay: document.getElementById('resultados-modal-overlay'),
                contenedor: document.getElementById('resultados-finales-container'),
                ganador: document.getElementById('ganador-container'),
                btnCerrar: document.getElementById('btn-close-resultados-modal')
            },
            modalHistorial: {
                overlay: document.getElementById('historial-modal-overlay'),
                cuerpo: document.getElementById('historial-body'),
                btnCerrar: document.getElementById('btn-menu-cerrar-historial'),
                btnCerrarCruz: document.getElementById('btn-cerrar-historial-modal-cruz')
            },
            modalMano: {
                overlay: document.getElementById('modal-registro-mano-overlay'),
                cuerpoSelector: document.getElementById('selector-dinos-mano'),
                totalDisplay: document.getElementById('total-dinos-mano'),
                btnConfirmar: document.getElementById('btn-confirmar-mano'),
                btnCerrar: document.getElementById('btn-cerrar-modal-mano')
            }
        };
        this.dinoSeleccionadoInfo = null;
        this.dinoArrastradoInfo = null;
        this.modalConfirm = new ModalConfirmacion('confirmacion-modal-overlay');

        if (!this.elementosDOM.plantillaParque) {
            console.error("Error crítico: No se encontró la plantilla del parque (#plantilla-parque-jugador).");
        }
        if (!this.elementosDOM.contenedorTableros) {
            console.error("Error crítico: No se encontró el contenedor de tableros (#tableros-container).");
        }
    }

    inicializarEventos() {
        this.elementosDOM.contenedorPestanas?.addEventListener('click', e => {
            if (e.target.classList.contains('tab-jugador')) {
                const indice = parseInt(e.target.dataset.jugadorIndex, 10);
                this.juego.cambiarJugadorActivoTablero(indice);
            }
        });

        this.elementosDOM.contenedorTableros?.addEventListener('dragover', e => this.manejadorDragOver(e));
        this.elementosDOM.contenedorTableros?.addEventListener('drop', e => this.manejadorDrop(e));
        this.elementosDOM.contenedorTableros?.addEventListener('click', e => this.manejadorClicSlot(e));

        document.getElementById('btn-lanzar-dado')?.addEventListener('click', () => this.juego.lanzarDado());
        document.getElementById('btn-siguiente-turno')?.addEventListener('click', () => this.juego.avanzarTurno());
        document.getElementById('btn-deshacer')?.addEventListener('click', () => this.juego.deshacerMovimiento());
        document.getElementById('btn-reiniciar-partida')?.addEventListener('click', () => this.juego.reiniciar());
        document.getElementById('btn-finalizar-partida')?.addEventListener('click', () => this.mostrarResultadosFinales());
        document.getElementById('btn-registrar-mano')?.addEventListener('click', () => this.abrirModalRegistroMano());
        document.getElementById('btn-mano-aleatoria')?.addEventListener('click', () => this.juego.generarManoAleatoria());

        this.elementosDOM.contenedorRestricciones?.addEventListener('click', e => {
            if (e.target.classList.contains('btn-dado')) {
                this.juego.establecerRestriccion(e.target.dataset.restriccion);
            }
        });

        this.elementosDOM.modalResultados?.btnCerrar?.addEventListener('click', () => this.elementosDOM.modalResultados.overlay.classList.remove('visible'));
        document.getElementById('btn-ver-historial')?.addEventListener('click', () => this.mostrarHistorial());
        this.elementosDOM.modalHistorial?.btnCerrar?.addEventListener('click', () => this.elementosDOM.modalHistorial.overlay.classList.remove('visible'));
        this.elementosDOM.modalHistorial?.btnCerrarCruz?.addEventListener('click', () => this.elementosDOM.modalHistorial.overlay.classList.remove('visible'));
        this.elementosDOM.modalMano?.btnCerrar?.addEventListener('click', () => this.elementosDOM.modalMano.overlay.classList.remove('visible'));

        this.elementosDOM.modalMano?.btnConfirmar?.addEventListener('click', () => this._confirmarSeleccionMano());
    }

    renderizarTablerosIniciales() {
        if (this.elementosDOM.contenedorPestanas) this.elementosDOM.contenedorPestanas.innerHTML = '';
        if (this.elementosDOM.contenedorTableros) this.elementosDOM.contenedorTableros.innerHTML = '';

        if (!this.elementosDOM.plantillaParque || !this.elementosDOM.plantillaParque.content) {
            console.error("La plantilla del parque no es válida o no tiene contenido.");
            this.notificar("Error al inicializar la interfaz: falta plantilla.", "error");
            return;
        }

        const jugadores = this.juego.obtenerEstado().jugadores;
        const idiomaActual = window.translations?.lang_en === "English" ? 'en' : 'es';

        jugadores.forEach((jugador, index) => {
            const pestana = document.createElement('button');
            pestana.className = 'tab-jugador';
            pestana.textContent = jugador.nombre;
            pestana.dataset.jugadorIndex = index;
            if (this.elementosDOM.contenedorPestanas) {
                this.elementosDOM.contenedorPestanas.appendChild(pestana);
            }

            try {
                const clon = this.elementosDOM.plantillaParque.content.cloneNode(true);
                const contenedorParque = clon.querySelector('.parque-container');
                if (!contenedorParque) {
                    console.error("La plantilla clonada no contiene '.parque-container'");
                    return;
                }
                contenedorParque.dataset.jugadorIndex = index;

                const tituloParqueEl = clon.querySelector('.nombre-jugador-parque');
                if (tituloParqueEl) {
                    let tituloTexto;
                    if (idiomaActual === 'en') {
                        tituloTexto = traducirJS('tablero_parque_titulo_en', { nombre: jugador.nombre });
                    } else {
                        const traduccionBase = traducirJS('tablero_parque_de');
                        tituloTexto = `${traduccionBase} ${jugador.nombre}`;
                    }
                    tituloParqueEl.textContent = tituloTexto;
                } else {
                    console.warn(`No se encontró el H2 '.nombre-jugador-parque' en el tablero del jugador ${index}`);
                }

                if (this.elementosDOM.contenedorTableros) {
                    this.elementosDOM.contenedorTableros.appendChild(clon);
                }
            } catch (error) {
                console.error(`Error al clonar o procesar la plantilla para el jugador ${index}:`, error);
                this.notificar(`Error al crear tablero para ${jugador.nombre}.`, "error");
            }
        });
        this.actualizarVistaTablero();
    }

    actualizarInfoPartida() {
        const estado = this.juego.obtenerEstado();

        if (this.elementosDOM.infoRonda) {
            this.elementosDOM.infoRonda.textContent = estado.rondaActual;
        }
        if (this.elementosDOM.infoTurno) {
            this.elementosDOM.infoTurno.textContent = estado.turnoActual;
        }
        if (this.elementosDOM.infoJugadorActivoDados && estado.jugadores[estado.indiceJugadorActivoDados]) {
            this.elementosDOM.infoJugadorActivoDados.textContent = estado.jugadores[estado.indiceJugadorActivoDados].nombre;
        } else if (this.elementosDOM.infoJugadorActivoDados) {
             this.elementosDOM.infoJugadorActivoDados.textContent = '---';
             console.warn(`Índice de jugador activo para dados (${estado.indiceJugadorActivoDados}) fuera de rango.`);
        }
        if (this.elementosDOM.tituloManoVirtual) {
            this.elementosDOM.tituloManoVirtual.textContent = traducirJS('tablero_tu_mano_titulo', { ronda: estado.rondaActual });
        }

        this.elementosDOM.contenedorRestricciones?.querySelectorAll('.btn-dado').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.restriccion === estado.restriccionDados);
        });

        if (this.elementosDOM.btnSiguienteTurno) {
            this.elementosDOM.btnSiguienteTurno.disabled = !this.juego.todosJugaron();
        }
    }

    actualizarVistaTablero() {
        const estado = this.juego.obtenerEstado();
        this.elementosDOM.contenedorPestanas?.querySelectorAll('.tab-jugador').forEach((pestana, i) => {
            pestana.classList.toggle('active', i === estado.indiceJugadorActivoTablero);
            pestana.classList.remove('listo', 'pendiente');
            pestana.classList.add(estado.jugadoresQueJugaronEsteTurno.includes(i) ? 'listo' : 'pendiente');
        });
        this.elementosDOM.contenedorTableros?.querySelectorAll('.parque-container').forEach((parque, i) => {
            parque.classList.toggle('hidden', i !== estado.indiceJugadorActivoTablero);
        });
        this.aplicarFiltroVisualRestriccion();
        this.renderizarManoVirtual();
        this.limpiarResaltadoSlots();
    }

    actualizarTableroJugador(indiceJugador) {
        const estado = this.juego.obtenerEstado();
        const jugador = estado.jugadores[indiceJugador];
        const contenedorParque = this.elementosDOM.contenedorTableros?.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"]`);
        if (!contenedorParque) return;

        contenedorParque.querySelectorAll('.dino-slot').forEach(slot => {
            slot.className = 'dino-slot';
            slot.innerHTML = '';
        });

        for (const recinto in jugador.tablero) {
            jugador.tablero[recinto].forEach(dino => {
                const slot = contenedorParque.querySelector(`.dino-slot[data-slot-id="${dino.slotId}"]`);
                if (slot) {
                    slot.classList.add(dino.type);
                } else {
                    console.warn(`No se encontró el slot con ID "${dino.slotId}" para el jugador ${indiceJugador}`);
                }
            });
        }

        const elPuntos = contenedorParque.querySelector('.puntos');
        if (elPuntos) {
            elPuntos.textContent = jugador.puntuacionTotal;
        }

        const recintoIsla = contenedorParque.querySelector('.recinto[data-recinto="islaSolitaria"]');
        if (recintoIsla) {
            const iconoEstado = recintoIsla.querySelector('.recinto-estado');
             if (iconoEstado) {
                const puntosIsla = jugador.puntuacionDetallada?.islaSolitaria || 0;
                 iconoEstado.className = 'recinto-estado';
                 if (jugador.tablero.islaSolitaria.length > 0) {
                     iconoEstado.classList.add(puntosIsla > 0 ? 'estado-valido' : 'estado-invalido');
                 }
            }
        }
    }

    renderizarManoVirtual() {
        if (!this.elementosDOM.manoVirtual) return;

        this.elementosDOM.manoVirtual.innerHTML = '';
        const mano = this.juego.obtenerManoJugadorActivo();

        if (mano.length > 0) {
            mano.forEach(tipoDino => {
                const elementoDino = this.crearElementoDino(tipoDino);
                this.elementosDOM.manoVirtual.appendChild(elementoDino);
            });
            if (this.elementosDOM.infoManoVirtual) {
                this.elementosDOM.infoManoVirtual.classList.remove('hidden');
            }
        } else {
            if (this.elementosDOM.infoManoVirtual) {
                this.elementosDOM.infoManoVirtual.classList.add('hidden');
            }
        }
    }

    limpiarResaltadoSlots() {
        this.elementosDOM.contenedorTableros?.querySelectorAll('.dino-slot').forEach(s => s.classList.remove('slot-valido'));
        this.elementosDOM.contenedorTableros?.classList.remove('modo-colocacion');
    }

    resaltarSlotsValidos(tipoDino) {
        this.limpiarResaltadoSlots();
        if (!tipoDino) return;

        const slotsValidosIds = this.juego.obtenerSlotsValidos(tipoDino);

        const tableroVisible = this.elementosDOM.contenedorTableros?.querySelector(`.parque-container:not(.hidden)`);
        if (!tableroVisible) return;

        if (slotsValidosIds.length > 0) {
            this.elementosDOM.contenedorTableros?.classList.add('modo-colocacion');
            tableroVisible.querySelectorAll('.dino-slot').forEach(slot => {
                if (slotsValidosIds.includes(slot.dataset.slotId)) {
                    slot.classList.add('slot-valido');
                }
            });
        }
    }

    aplicarFiltroVisualRestriccion() {
        const estado = this.juego.obtenerEstado();
        const { restriccionDados, indiceJugadorActivoDados, jugadores } = estado;

        this.elementosDOM.contenedorTableros?.querySelectorAll('.parque-container').forEach((parque, index) => {
            const recintosDelParque = parque.querySelectorAll('.recinto');
            const jugador = jugadores[index];

            if (index === indiceJugadorActivoDados || !restriccionDados || restriccionDados === 'ninguna') {
                recintosDelParque.forEach(recinto => recinto.classList.remove('recinto-restringido'));
                return;
            }

            const zonas = {
                cafeteria: ['praderaAmor', 'trioFrondoso', 'bosqueSemejanza'],
                banos: ['reySelva', 'islaSolitaria', 'pradoDiferencia'],
                boscosa: ['bosqueSemejanza', 'reySelva', 'trioFrondoso'],
                llanura: ['pradoDiferencia', 'islaSolitaria', 'praderaAmor']
            };

            recintosDelParque.forEach(recinto => {
                const claveRecinto = recinto.dataset.recinto;
                let restringido = false;

                switch (restriccionDados) {
                    case 'cafeteria': if (!zonas.cafeteria.includes(claveRecinto)) restringido = true; break;
                    case 'banos': if (!zonas.banos.includes(claveRecinto)) restringido = true; break;
                    case 'boscosa': if (!zonas.boscosa.includes(claveRecinto)) restringido = true; break;
                    case 'llanura': if (!zonas.llanura.includes(claveRecinto)) restringido = true; break;
                    case 'vacio':
                        if (jugador.tablero[claveRecinto]?.length > 0) {
                            restringido = true;
                        }
                        break;
                    case 'sin-t-rex':
                        if (jugador.tablero[claveRecinto]?.some(d => d.type === 't-rex')) {
                            restringido = true;
                        }
                        break;
                }

                 if (claveRecinto === 'rio') {
                    restringido = false;
                 }

                recinto.classList.toggle('recinto-restringido', restringido);
            });
        });
    }

    manejadorDragOver(e) {
        if (e.target.classList.contains('slot-valido')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    }

    manejadorDrop(e) {
        e.preventDefault();
        if (e.target.classList.contains('slot-valido') && this.dinoArrastradoInfo) {
            const tipoDino = this.dinoArrastradoInfo.tipo;
            const slotId = e.target.dataset.slotId;
            this.juego.colocarDinosaurio(slotId, tipoDino);
        }
        this.dinoArrastradoInfo = null;
        document.body.classList.remove('arrastrando');
        this.limpiarResaltadoSlots();
    }

    manejadorClicSlot(e) {
        if (this.dinoSeleccionadoInfo && e.target.classList.contains('slot-valido')) {
            const slotId = e.target.dataset.slotId;
            const tipoDino = this.dinoSeleccionadoInfo.tipo;
            this.juego.colocarDinosaurio(slotId, tipoDino);

            if (this.dinoSeleccionadoInfo.elemento) {
                this.dinoSeleccionadoInfo.elemento.classList.remove('selected');
            }
            this.dinoSeleccionadoInfo = null;
            this.limpiarResaltadoSlots();
        }
    }

    crearElementoDino(tipoDino) {
        const elemento = document.createElement('div');
        elemento.className = 'dino-selector';
        elemento.dataset.dinoType = tipoDino;
        elemento.draggable = true;

        elemento.addEventListener('dragstart', e => {
            if (this.juego.jugadorActualYaJugo()) {
                e.preventDefault();
                this.notificar(traducirJS("notif_ya_jugaste"), "error");
                return;
            }
            this.dinoArrastradoInfo = { tipo: tipoDino };
            e.dataTransfer.setData('text/plain', tipoDino);
            e.dataTransfer.effectAllowed = 'move';
            document.body.classList.add('arrastrando');
            this.resaltarSlotsValidos(tipoDino);
            setTimeout(() => { if(elemento) elemento.style.opacity = '0.5'; }, 0);
        });

        elemento.addEventListener('dragend', () => {
            document.body.classList.remove('arrastrando');
            this.dinoArrastradoInfo = null;
            this.limpiarResaltadoSlots();
             if(elemento) elemento.style.opacity = '1';
        });

        elemento.addEventListener('click', () => {
            if (this.juego.jugadorActualYaJugo()) {
                this.notificar(traducirJS("notif_ya_jugaste"), "error");
                return;
            }
            if (elemento.classList.contains('selected')) {
                elemento.classList.remove('selected');
                this.dinoSeleccionadoInfo = null;
                this.limpiarResaltadoSlots();
            } else {
                this.elementosDOM.manoVirtual?.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                elemento.classList.add('selected');
                this.dinoSeleccionadoInfo = { tipo: tipoDino, elemento: elemento };
                this.resaltarSlotsValidos(tipoDino);
            }
        });
        return elemento;
    }

    mostrarResultadosFinales() {
        this.juego.recalcularPuntuaciones();
        const estado = this.juego.obtenerEstado();
        const jugadoresOrdenados = [...estado.jugadores].sort((a, b) => {
            if (b.puntuacionTotal !== a.puntuacionTotal) {
                return b.puntuacionTotal - a.puntuacionTotal;
            }
            return MotorJuego.contarTRex(a) - MotorJuego.contarTRex(b);
        });

        if (this.elementosDOM.modalResultados?.contenedor) {
            this.elementosDOM.modalResultados.contenedor.innerHTML = '';
        } else {
            console.error("Contenedor de resultados no encontrado.");
            return;
        }

        const puntuacionMaxima = jugadoresOrdenados.length > 0 ? jugadoresOrdenados[0].puntuacionTotal : 0;
        const tRexMinimoGanador = jugadoresOrdenados
            .filter(j => j.puntuacionTotal === puntuacionMaxima)
            .reduce((minTRex, j) => Math.min(minTRex, MotorJuego.contarTRex(j)), Infinity);

        const ganadores = jugadoresOrdenados.filter(j =>
            j.puntuacionTotal === puntuacionMaxima && MotorJuego.contarTRex(j) === tRexMinimoGanador
        );

        jugadoresOrdenados.forEach(jugador => {
            const p = jugador.puntuacionDetallada || {};
            const esGanador = ganadores.some(g => g.nombre === jugador.nombre);
            const div = document.createElement('div');
            div.className = 'jugador-resultados';
            div.innerHTML = `
                <h3>${jugador.nombre} ${esGanador ? '🏆' : ''}</h3>
                <ul>
                     <li><span>${traducirJS('resultados_recinto_bosqueSemejanza')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.bosqueSemejanza || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_pradoDiferencia')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.pradoDiferencia || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_praderaAmor')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.praderaAmor || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_trioFrondoso')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.trioFrondoso || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_reySelva')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.reySelva || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_islaSolitaria')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.islaSolitaria || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_rio')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.rio || 0})}</span></li>
                     <li><span>${traducirJS('resultados_recinto_bonusTRex')}:</span> <span>${traducirJS('resultados_puntos', {puntos: p.bonusTRex || 0})}</span></li>
                </ul>
                 <p class="total-puntos">${traducirJS('resultados_total_puntos', {puntos: jugador.puntuacionTotal || 0})}</p>
            `;
            this.elementosDOM.modalResultados.contenedor.appendChild(div);
        });

        let textoGanador = traducirJS('resultados_no_ganador');
        if (ganadores.length > 1) {
            textoGanador = traducirJS('resultados_empate', {nombresGanadores: ganadores.map(g => g.nombre).join(' y ')});
        } else if (ganadores.length === 1) {
            textoGanador = traducirJS('resultados_ganador', {nombreGanador: ganadores[0].nombre});
        }

        if (this.elementosDOM.modalResultados.ganador) {
            this.elementosDOM.modalResultados.ganador.innerHTML = `<p>${textoGanador}</p>`;
        }
        if (this.elementosDOM.modalResultados.overlay) {
            this.elementosDOM.modalResultados.overlay.classList.add('visible');
        }
    }

    mostrarHistorial() {
        const historial = this.juego.obtenerEstado().historialMovimientos;
        const cuerpo = this.elementosDOM.modalHistorial?.cuerpo;

        if (!cuerpo) {
            console.error("Contenedor del cuerpo del historial no encontrado.");
            return;
        }

        cuerpo.innerHTML = '';

        if (historial.length === 0) {
            cuerpo.innerHTML = `<p>${traducirJS('historial_mov_vacio')}</p>`;
        } else {
            const lista = document.createElement('ul');
            const nombresRecintos = {
                bosqueSemejanza: traducirJS("tablero_recinto_bosque_semejanza"),
                pradoDiferencia: traducirJS("tablero_recinto_prado_diferencia"),
                praderaAmor: traducirJS("tablero_recinto_pradera_amor"),
                trioFrondoso: traducirJS("tablero_recinto_trio_frondoso"),
                reySelva: traducirJS("tablero_recinto_rey_selva"),
                islaSolitaria: traducirJS("tablero_recinto_isla_solitaria"),
                rio: traducirJS("tablero_recinto_rio")
            };

            [...historial].reverse().forEach(mov => {
                const li = document.createElement('li');
                const nombreRecintoLegible = nombresRecintos[mov.claveRecinto] || mov.claveRecinto;
                const textoTurno = traducirJS('historial_mov_turno', {ronda: mov.ronda, turno: mov.turno});
                const tipoDino = mov.dino?.type ? mov.dino.type.replace('-', ' ') : 'desconocido';
                const textoMovimiento = traducirJS('historial_mov_texto', {
                    nombreJugador: mov.nombreJugador || 'Jugador desconocido',
                    tipoDino: tipoDino,
                    nombreRecinto: nombreRecintoLegible
                });

                li.innerHTML = `<span class="historial-turno">${textoTurno}</span> ${textoMovimiento}`;
                lista.appendChild(li);
            });
            cuerpo.appendChild(lista);
        }

        this.elementosDOM.modalHistorial?.overlay?.classList.add('visible');
    }

    abrirModalRegistroMano() {
        const cuerpoSelector = this.elementosDOM.modalMano?.cuerpoSelector;
        if (!cuerpoSelector) {
            console.error("Selector de dinos para el modal de mano no encontrado.");
            return;
        }

        cuerpoSelector.innerHTML = '';
        MotorJuego.TIPOS_DINO.forEach(tipo => {
            const item = document.createElement('div');
            item.className = 'dino-registro-item';
            item.innerHTML = `
                <div class="dino-selector" data-dino-type="${tipo}"></div>
                <span class="dino-nombre">${tipo.replace('-', ' ')}</span>
                <div class="dino-cantidad-controles">
                    <button class="btn-cantidad btn-restar" aria-label="Restar ${tipo}">-</button>
                    <span class="cantidad-display" data-tipo="${tipo}" aria-live="polite">0</span>
                    <button class="btn-cantidad btn-sumar" aria-label="Sumar ${tipo}">+</button>
                </div>
            `;
            cuerpoSelector.appendChild(item);
        });

        this._actualizarTotalModalMano();

        const nuevoCuerpoSelector = cuerpoSelector.cloneNode(true);
        cuerpoSelector.parentNode.replaceChild(nuevoCuerpoSelector, cuerpoSelector);
        this.elementosDOM.modalMano.cuerpoSelector = nuevoCuerpoSelector;

        nuevoCuerpoSelector.addEventListener('click', e => {
            if (e.target.classList.contains('btn-cantidad')) {
                const controles = e.target.closest('.dino-cantidad-controles');
                if (!controles) return;

                const display = controles.querySelector('.cantidad-display');
                if (!display) return;

                let cantidad = parseInt(display.textContent, 10);
                const totalActual = this._getTotalModalMano();

                if (e.target.classList.contains('btn-sumar')) {
                    if (totalActual >= 6) {
                         this.notificar(traducirJS("notif_mano_llena"), "error");
                         return;
                    }
                    cantidad++;
                } else {
                    cantidad = Math.max(0, cantidad - 1);
                }
                display.textContent = cantidad;
                this._actualizarTotalModalMano();
            }
        });

        this.elementosDOM.modalMano?.overlay?.classList.add('visible');
    }

    _getTotalModalMano() {
        if (!this.elementosDOM.modalMano?.cuerpoSelector) return 0;

        const displays = this.elementosDOM.modalMano.cuerpoSelector.querySelectorAll('.cantidad-display');
        return Array.from(displays).reduce((sum, el) => sum + parseInt(el.textContent || '0', 10), 0);
    }

    _actualizarTotalModalMano() {
        const total = this._getTotalModalMano();
        if (this.elementosDOM.modalMano?.totalDisplay) {
            this.elementosDOM.modalMano.totalDisplay.textContent = total;
        }
        if (this.elementosDOM.modalMano?.btnConfirmar) {
            this.elementosDOM.modalMano.btnConfirmar.disabled = total !== 6;
        }
    }

    _confirmarSeleccionMano() {
        const mano = [];
        if (!this.elementosDOM.modalMano?.cuerpoSelector) return;

        const displays = this.elementosDOM.modalMano.cuerpoSelector.querySelectorAll('.cantidad-display');
        displays.forEach(display => {
            const tipo = display.dataset.tipo;
            const cantidad = parseInt(display.textContent || '0', 10);
            for (let i = 0; i < cantidad; i++) {
                mano.push(tipo);
            }
        });
        this.juego.establecerMano(mano);
        this.elementosDOM.modalMano?.overlay?.classList.remove('visible');
    }

    notificar(mensaje, tipo = 'info') {
        if (window.notificador) {
            window.notificador.mostrar(mensaje, tipo);
        } else {
            console.warn("Notificador global no encontrado. Usando alert.");
            alert(`[${tipo.toUpperCase()}] ${mensaje}`);
        }
    }
}

class JuegoSeguimiento {
    constructor(nombresJugadores, ui) {
        this.ui = ui;
        this.estado = this.crearEstadoInicial(nombresJugadores);
    }

    crearEstadoInicial(nombresJugadores) {
        return {
            jugadores: nombresJugadores.map(nombre => ({
                nombre: nombre,
                tablero: {
                    bosqueSemejanza: [], pradoDiferencia: [], praderaAmor: [],
                    trioFrondoso: [], reySelva: [], islaSolitaria: [], rio: []
                },
                puntuacionDetallada: {},
                puntuacionTotal: 0
            })),
            rondaActual: 1,
            turnoActual: 1,
            indiceJugadorActivoDados: 0,
            indiceJugadorActivoTablero: 0,
            restriccionDados: 'ninguna',
            historialMovimientos: [],
            jugadoresQueJugaronEsteTurno: [],
            manos: {},
        };
    }

    iniciar() {
        this.ui.renderizarTablerosIniciales();
        this.ui.actualizarInfoPartida();
        this.ui.inicializarEventos();
    }

    obtenerEstado() { return this.estado; }
    obtenerManoJugadorActivo() {
        return this.estado.manos[this.estado.indiceJugadorActivoTablero] || [];
    }
    todosJugaron() {
        return this.estado.jugadoresQueJugaronEsteTurno.length === this.estado.jugadores.length;
    }
    jugadorActualYaJugo() {
        return this.estado.jugadoresQueJugaronEsteTurno.includes(this.estado.indiceJugadorActivoTablero);
    }

    cambiarJugadorActivoTablero(indice) {
        if (indice >= 0 && indice < this.estado.jugadores.length && indice !== this.estado.indiceJugadorActivoTablero) {
            this.estado.indiceJugadorActivoTablero = indice;
            this.ui.actualizarVistaTablero();
        }
    }

    lanzarDado() {
        const caras = ['boscosa', 'llanura', 'vacio', 'sin-t-rex', 'cafeteria', 'banos'];
        this.estado.restriccionDados = caras[Math.floor(Math.random() * caras.length)];

        // --- INICIO DE LA CORRECCIÓN ---
        // Se usa replace(/-/g, '_') para reemplazar TODOS los guiones
        const claveDadoFormateada = this.estado.restriccionDados.replace(/-/g, '_');
        // --- FIN DE LA CORRECCIÓN ---
        const claveTraduccionDado = 'tablero_dado_' + claveDadoFormateada;
        const textoRestriccion = traducirJS(claveTraduccionDado);

        this.ui.notificar(traducirJS('notif_dado_lanzado', {restriccion: textoRestriccion}));
        this.ui.actualizarInfoPartida();
        this.ui.aplicarFiltroVisualRestriccion();
        this.ui.resaltarSlotsValidos(this.ui.dinoSeleccionadoInfo?.tipo);
    }

    establecerRestriccion(restriccion) {
        if (this.estado.restriccionDados !== restriccion) {
            this.estado.restriccionDados = restriccion;
            this.ui.actualizarInfoPartida();
            this.ui.aplicarFiltroVisualRestriccion();
            this.ui.resaltarSlotsValidos(this.ui.dinoSeleccionadoInfo?.tipo);
        }
    }

    avanzarTurno() {
        if (!this.todosJugaron()) {
            this.ui.notificar(traducirJS("notif_todos_jugaron"), "error");
            return;
        }

        const numJugadores = this.estado.jugadores.length;
        if (Object.keys(this.estado.manos).length === numJugadores) {
            const manosRotadas = {};
            for (let i = 0; i < numJugadores; i++) {
                const indiceOrigen = (i - 1 + numJugadores) % numJugadores;
                manosRotadas[i] = this.estado.manos[indiceOrigen];
            }
            this.estado.manos = manosRotadas;
        }

        if (this.estado.turnoActual === 6) {
            this.estado.turnoActual = 1;
            this.estado.rondaActual++;
            this.estado.manos = {};

            if (this.estado.rondaActual > 2) {
                this.ui.notificar(traducirJS("notif_partida_finalizada"), "success");
                this.ui.mostrarResultadosFinales();
                this.ui.actualizarInfoPartida();
                this.ui.actualizarVistaTablero();
                return;
            } else {
                 this.ui.notificar(traducirJS('notif_inicia_ronda', {ronda: this.estado.rondaActual}), "success");
            }
        } else {
            this.estado.turnoActual++;
        }

        this.estado.indiceJugadorActivoDados = (this.estado.indiceJugadorActivoDados + 1) % numJugadores;
        this.estado.restriccionDados = 'ninguna';
        this.estado.jugadoresQueJugaronEsteTurno = [];

        this.ui.actualizarInfoPartida();
        this.ui.actualizarVistaTablero();
    }

    colocarDinosaurio(slotId, tipoDino) {
        const indiceJugador = this.estado.indiceJugadorActivoTablero;

        if (this.jugadorActualYaJugo()) {
            this.ui.notificar(traducirJS("notif_ya_jugaste"), "error");
            return;
        }

        const jugador = this.estado.jugadores[indiceJugador];
        const mano = this.estado.manos[indiceJugador] || [];
        const tieneManosRegistradas = Object.keys(this.estado.manos).length > 0;
        const indiceDinoEnMano = mano.indexOf(tipoDino);

        if (tieneManosRegistradas && indiceDinoEnMano === -1) {
             this.ui.notificar(traducirJS("notif_no_en_mano"), "error");
             return;
        }

        const slotElement = document.querySelector(`.parque-container[data-jugador-index="${indiceJugador}"] [data-slot-id="${slotId}"]`);
        if (!slotElement || !slotElement.closest('.recinto')) {
            console.error(`Error: No se encontró el recinto para el slot ${slotId}`);
            this.ui.notificar("Error interno al colocar el dinosaurio.", "error");
            return;
        }
        const claveRecinto = slotElement.closest('.recinto').dataset.recinto;

        const nuevoDino = { type: tipoDino, slotId: slotId };
        if (!jugador.tablero[claveRecinto]) {
            jugador.tablero[claveRecinto] = [];
        }
        jugador.tablero[claveRecinto].push(nuevoDino);

        this.estado.historialMovimientos.push({
            indiceJugador,
            nombreJugador: jugador.nombre,
            claveRecinto,
            dino: { ...nuevoDino },
            ronda: this.estado.rondaActual,
            turno: this.estado.turnoActual
        });

        if (indiceDinoEnMano !== -1) {
             mano.splice(indiceDinoEnMano, 1);
        }

        this.estado.jugadoresQueJugaronEsteTurno.push(indiceJugador);

        this.recalcularPuntuaciones();
        this.ui.actualizarTableroJugador(indiceJugador);
        this.ui.actualizarInfoPartida();
        this.ui.actualizarVistaTablero();
        this.ui.notificar(traducirJS('notif_dino_colocado', {nombreJugador: jugador.nombre, tipoDino: tipoDino.replace('-', ' ')}), 'success');

        this.ui.dinoSeleccionadoInfo = null;
        this.ui.limpiarResaltadoSlots();
    }

    deshacerMovimiento() {
        const ultimoMovimiento = this.estado.historialMovimientos.pop();

        if (!ultimoMovimiento) {
             this.ui.notificar(traducirJS("notif_no_hay_deshacer"), "info");
             return;
        }

        const { indiceJugador, claveRecinto, dino } = ultimoMovimiento;
        const jugador = this.estado.jugadores[indiceJugador];

        if (jugador.tablero[claveRecinto]) {
            jugador.tablero[claveRecinto] = jugador.tablero[claveRecinto].filter(d => d.slotId !== dino.slotId);
        }

        if (this.estado.manos[indiceJugador]) {
             this.estado.manos[indiceJugador].push(dino.type);
        }

        const indiceEnTurno = this.estado.jugadoresQueJugaronEsteTurno.indexOf(indiceJugador);
        if (indiceEnTurno > -1) {
            this.estado.jugadoresQueJugaronEsteTurno.splice(indiceEnTurno, 1);
        }

        this.recalcularPuntuaciones();
        this.ui.actualizarTableroJugador(indiceJugador);
        this.ui.actualizarInfoPartida();
        this.ui.actualizarVistaTablero();
        this.ui.notificar(traducirJS("notif_movimiento_deshecho"), "success");

        this.ui.dinoSeleccionadoInfo = null;
        this.ui.limpiarResaltadoSlots();
    }

    reiniciar() {
        this.ui.modalConfirm?.mostrar(traducirJS('modal_confirmar_reinicio_texto'))
            .then(() => {
                this._ejecutarReinicio();
            })
            .catch(() => {
                console.log("Reinicio cancelado por el usuario.");
            });
    }

    _ejecutarReinicio() {
        const nombres = this.estado.jugadores.map(j => j.nombre);
        this.estado = this.crearEstadoInicial(nombres);
        this.estado.jugadores.forEach((_, i) => this.ui.actualizarTableroJugador(i));
        this.ui.actualizarInfoPartida();
        this.ui.actualizarVistaTablero();
        this.ui.notificar(traducirJS("notif_partida_reiniciada"), "success");
        this.ui.dinoSeleccionadoInfo = null;
        this.ui.limpiarResaltadoSlots();
    }

    establecerMano(manoArray) {
        const indice = this.estado.indiceJugadorActivoTablero;
        if (Array.isArray(manoArray) && manoArray.length === 6) {
            this.estado.manos[indice] = [...manoArray];
            this.ui.renderizarManoVirtual();
            this.ui.notificar(traducirJS('notif_mano_registrada', {nombreJugador: this.estado.jugadores[indice].nombre}), 'success');
        } else {
            console.error("Intento de establecer una mano inválida:", manoArray);
            this.ui.notificar("Error al registrar la mano. Debe contener 6 dinosaurios.", "error");
        }
    }

    generarManoAleatoria() {
        const indice = this.estado.indiceJugadorActivoTablero;
        const mano = [];
        for (let i = 0; i < 6; i++) {
            const tipoAleatorio = MotorJuego.TIPOS_DINO[Math.floor(Math.random() * MotorJuego.TIPOS_DINO.length)];
            mano.push(tipoAleatorio);
        }
        this.establecerMano(mano);
    }

    recalcularPuntuaciones() {
        this.estado.jugadores.forEach((jugador, indice) => {
            const resultado = MotorJuego.calcularPuntuacionTotal(jugador, this.estado.jugadores);
            this.estado.jugadores[indice].puntuacionDetallada = resultado.puntajes;
            this.estado.jugadores[indice].puntuacionTotal = resultado.total;
        });
    }

    obtenerSlotsValidos(tipoDino) {
        if (!tipoDino) return [];

        const indice = this.estado.indiceJugadorActivoTablero;
        const jugador = this.estado.jugadores[indice];
        const esJugadorRestringido = indice !== this.estado.indiceJugadorActivoDados;
        const restriccion = esJugadorRestringido ? this.estado.restriccionDados : 'ninguna';

        let slotsPotenciales = [];

        for (const claveRecinto in jugador.tablero) {
            if (this._esMovimientoValido(claveRecinto, tipoDino, jugador.tablero, restriccion)) {
                const contenedorParque = document.querySelector(`.parque-container[data-jugador-index="${indice}"]`);
                if (!contenedorParque) continue;

                const recintoElement = contenedorParque.querySelector(`.recinto[data-recinto="${claveRecinto}"]`);
                if (!recintoElement) continue;

                const slotsEnRecinto = recintoElement.querySelectorAll('.dino-slot');
                const primerSlotVacio = Array.from(slotsEnRecinto).find(slot => {
                    return !MotorJuego.TIPOS_DINO.some(dinoClass => slot.classList.contains(dinoClass));
                });

                if (primerSlotVacio && primerSlotVacio.dataset.slotId) {
                    slotsPotenciales.push(primerSlotVacio.dataset.slotId);
                }
            }
        }

        if (slotsPotenciales.length === 0) {
            const contenedorParque = document.querySelector(`.parque-container[data-jugador-index="${indice}"]`);
            if (contenedorParque) {
                const recintoRio = contenedorParque.querySelector('.recinto[data-recinto="rio"]');
                if (recintoRio) {
                    const slotsRio = recintoRio.querySelectorAll('.dino-slot');
                    const primerSlotVacioRio = Array.from(slotsRio).find(slot => {
                        return !MotorJuego.TIPOS_DINO.some(dinoClass => slot.classList.contains(dinoClass));
                    });
                    if (primerSlotVacioRio && primerSlotVacioRio.dataset.slotId) {
                        slotsPotenciales.push(primerSlotVacioRio.dataset.slotId);
                    }
                }
            }
        }

        return slotsPotenciales;
    }

    _esMovimientoValido(claveRecinto, tipoDino, tablero, restriccion) {
        if (claveRecinto === 'rio') return false;

        const dinosEnRecinto = tablero[claveRecinto] || [];

        if (restriccion !== 'ninguna') {
            const zonas = {
                cafeteria: ['praderaAmor', 'trioFrondoso', 'bosqueSemejanza'],
                banos: ['reySelva', 'islaSolitaria', 'pradoDiferencia'],
                boscosa: ['bosqueSemejanza', 'reySelva', 'trioFrondoso'],
                llanura: ['pradoDiferencia', 'islaSolitaria', 'praderaAmor']
            };
            let cumpleRestriccion = false;
            switch (restriccion) {
                case 'cafeteria': cumpleRestriccion = zonas.cafeteria.includes(claveRecinto); break;
                case 'banos': cumpleRestriccion = zonas.banos.includes(claveRecinto); break;
                case 'boscosa': cumpleRestriccion = zonas.boscosa.includes(claveRecinto); break;
                case 'llanura': cumpleRestriccion = zonas.llanura.includes(claveRecinto); break;
                case 'vacio': cumpleRestriccion = dinosEnRecinto.length === 0; break;
                case 'sin-t-rex': cumpleRestriccion = !dinosEnRecinto.some(d => d.type === 't-rex'); break;
                default: cumpleRestriccion = true;
            }
            if (!cumpleRestriccion) return false;
        }

        switch (claveRecinto) {
            case 'bosqueSemejanza':
                if (dinosEnRecinto.length > 0 && dinosEnRecinto[0].type !== tipoDino) return false;
                break;
            case 'pradoDiferencia':
                if (dinosEnRecinto.some(d => d.type === tipoDino)) return false;
                break;
        }

        return true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('main-tablero')) {
        let nombresJugadores = [];
        try {
            const nombresGuardados = localStorage.getItem('jugadoresDraftosaurus');
            if (nombresGuardados) {
                nombresJugadores = JSON.parse(nombresGuardados);
            }
        } catch (e) {
            console.error("Error al leer nombres de jugadores desde localStorage:", e);
        }

        if (!Array.isArray(nombresJugadores) || nombresJugadores.length === 0) {
            if(window.notificador && typeof traducirJS === 'function') {
                window.notificador.mostrar(traducirJS('notif_no_jugadores'), 'error');
            } else {
                alert('No se encontraron jugadores. Por favor, configura una partida primero.');
            }
            setTimeout(() => {
                 window.location.href = 'modo_seguimiento.php';
            }, 1500);
            return;
        }

        const ui = new TableroUI(null);
        const juego = new JuegoSeguimiento(nombresJugadores, ui);
        ui.juego = juego;
        juego.iniciar();
    }
});
