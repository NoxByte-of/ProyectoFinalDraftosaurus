
class Tutorial {
    constructor() {
        this.dom = {
            modalSuperposicion: document.getElementById('tutorial-modal'),
            botonCerrar: document.getElementById('tutorial-close-btn'),
            botonCerrarFin: document.getElementById('tutorial-close-btn-end'),
            botonIniciar: document.getElementById('tutorial-start-btn'),
            botonSiguienteTooltip: document.getElementById('tooltip-next-btn'),
            pantallaBienvenida: document.getElementById('welcome-screen-tutorial'),
            pantallaJuego: document.querySelector('.tutorial__vista-juego'),
            pantallaFin: document.getElementById('end-screen-tutorial'),
            cajaResaltadoRecinto: document.getElementById('highlight-overlay-tutorial'),
            cajaResaltadoMano: document.getElementById('highlight-overlay-hand-tutorial'),
            tooltip: document.getElementById('tutorial-tooltip'),
            tooltipContenido: document.getElementById('tooltip-content'),
            manoDinosaurios: document.getElementById('player-hand-tutorial'),
            panelMano: document.getElementById('player-hand-area'),
            dado: document.getElementById('dice-tutorial'),
            contenedorSlots: document.getElementById('tutorial-slots-container'),
            tableroContenedor: document.querySelector('.tutorial__tablero-contenedor')
        };
        
        this.notificador = new Notificador('notificacion-container-tutorial');

        this.pasoActual = 0;
        this.dinosaurioArrastrado = null;
        this.dinoSeleccionado = null;
        this.elementoDinoSeleccionado = null;
        this.pasosDefinidos = false; 

        this.DEFINICION_RECINTOS = {
            bosqueSemejanza: { id: 'pen-1', clave_texto: 'tutorial_paso_recinto_bosque', dinoValido: 'parasaurolophus', style: 'top: 6.5%; left: 10%; width: 34%; height: 18%;', slots: 1 },
            reySelva: { id: 'pen-4', clave_texto: 'tutorial_paso_recinto_rey', dinoValido: 'triceratops', style: 'top: 6.5%; left: 60%; width: 14%; height: 12%;', slots: 1 },
            trioFrondoso: { id: 'pen-3', clave_texto: 'tutorial_paso_recinto_trio', dinoValido: 't-rex', style: 'top: 38%; left: 15%; width: 21%; height: 18%;', slots: 1 },
            pradoDiferencia: { id: 'pen-0', clave_texto: 'tutorial_paso_recinto_prado', dinoValido: 'brachiosaurus', style: 'top: 42%; left: 53%; width: 34%; height: 18%;', slots: 1 },
            praderaAmor: { id: 'pen-2', clave_texto: 'tutorial_paso_recinto_amor', dinoValido: 'spinosaurus', style: 'top: 73%; left: 10.5%; width: 31%; height: 19%;', slots: 1 },
            islaSolitaria: { id: 'pen-5', clave_texto: 'tutorial_paso_recinto_isla', dinoValido: 'stegosaurus', style: 'top: 68%; left: 69.5%; width: 14%; height: 14%;', slots: 1 }
        };

        this.PASOS_TUTORIAL = [];
    }

    _definirPasos() {
        if (this.pasosDefinidos) return;

        this.PASOS_TUTORIAL = [
            { tipo: 'informativo', pantalla: this.dom.pantallaBienvenida },
            { tipo: 'informativo', pantalla: this.dom.pantallaJuego, elementoDestacado: '#player-hand-area', texto: traducirJS('tutorial_paso_inicio_mano_texto'), accion: () => this._poblarMano(['brachiosaurus', 'parasaurolophus', 'spinosaurus', 't-rex', 'triceratops', 'stegosaurus']) },
            { tipo: 'informativo', elementoDestacado: '#player-hand-area', texto: traducirJS('tutorial_paso_mano_lista') },
            ...Object.values(this.DEFINICION_RECINTOS).map(recinto => ({
                tipo: 'interactivo',
                elementoDestacado: `#${recinto.id}`,
                texto: traducirJS(recinto.clave_texto),
                accion: () => this._prepararZonaDeArrastreYClick(recinto.id, [recinto.dinoValido]),
            })),
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_intro'), accion: () => this._lanzarDado(0) },
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_boscosa'), accion: () => this._lanzarDado(0) },
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_banos'), accion: () => this._lanzarDado(1) },
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_llanura'), accion: () => this._lanzarDado(2) },
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_cafeteria'), accion: () => this._lanzarDado(3) },
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_vacio'), accion: () => this._lanzarDado(4) },
            { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: traducirJS('tutorial_paso_dado_sin_trex'), accion: () => this._lanzarDado(5) },
            { tipo: 'informativo', pantalla: this.dom.pantallaFin }
        ];

        this.pasosDefinidos = true;
    }

    inicializar(selectorTriggers) {
        if (!this.dom.modalSuperposicion) return;

        document.querySelectorAll(selectorTriggers).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.iniciar();
            });
        });

        this.dom.botonCerrar.addEventListener('click', () => this.cerrar());
        this.dom.botonCerrarFin.addEventListener('click', () => this.cerrar());
        this.dom.botonIniciar.addEventListener('click', () => this._avanzarPaso());
        this.dom.botonSiguienteTooltip.addEventListener('click', () => this._avanzarPaso());
    }

    iniciar() {
        this._definirPasos();

        if (this.dom.tableroContenedor) {
            this.dom.tableroContenedor.style.maxWidth = '950px';
        }

        this.dom.modalSuperposicion.classList.add('visible');
        this.pasoActual = 0;
        this._generarTableroTutorial();
        this.dom.manoDinosaurios.innerHTML = '';
        this._ejecutarPaso(this.pasoActual);
    }

    cerrar() {
        this.dom.modalSuperposicion.classList.remove('visible');
        this.dom.tooltip.style.display = 'none';
        this.dom.cajaResaltadoRecinto.style.display = 'none';
        this.dom.cajaResaltadoMano.style.display = 'none';
    }

    _avanzarPaso() {
        this.pasoActual++;
        if (this.pasoActual < this.PASOS_TUTORIAL.length) {
            this._ejecutarPaso(this.pasoActual);
        } else {
            this._mostrarPantalla(this.dom.pantallaFin);
        }
    }

    _ejecutarPaso(indice) {
        const paso = this.PASOS_TUTORIAL[indice];

        this.dom.pantallaBienvenida.classList.add('oculta');
        this.dom.pantallaJuego.classList.add('oculta');
        this.dom.pantallaFin.classList.add('oculta');
        this.dom.tooltip.style.display = 'none';
        this.dom.cajaResaltadoRecinto.style.display = 'none';
        this.dom.cajaResaltadoMano.style.display = 'none';
        this._desactivarTodasLasZonasInteractivas();
        
        this.dom.panelMano.classList.remove('elemento-resaltado-tutorial');

        if (paso.pantalla) {
            paso.pantalla.classList.remove('oculta');
        } else {
            this.dom.pantallaJuego.classList.remove('oculta');
        }

        if (paso.elementoDestacado) {
            const elemento = document.querySelector(paso.elementoDestacado);
            if (elemento) {
                if (paso.elementoDestacado === '#player-hand-area') {
                    this.dom.panelMano.classList.add('elemento-resaltado-tutorial');
                }
                const esMano = paso.elementoDestacado === '#player-hand-area';
                const cajaResaltado = esMano ? this.dom.cajaResaltadoMano : this.dom.cajaResaltadoRecinto;
                this._posicionarAyuda(elemento, paso.texto, cajaResaltado);

                if (esMano || paso.tipo === 'interactivo') {
                    this.dom.cajaResaltadoMano.style.display = 'block';
                }
            }
        }

        if (paso.accion) {
            paso.accion();
        }

        this.dom.botonSiguienteTooltip.style.display = paso.tipo === 'informativo' ? 'block' : 'none';
    }

    _generarTableroTutorial() {
        this.dom.contenedorSlots.innerHTML = '';
        for (const key in this.DEFINICION_RECINTOS) {
            const recintoData = this.DEFINICION_RECINTOS[key];
            const recintoEl = document.createElement('div');
            recintoEl.id = recintoData.id;
            recintoEl.className = 'tutorial__recinto';
            recintoEl.style.cssText = recintoData.style;
            
            const slotEl = document.createElement('div');
            slotEl.className = 'tutorial__dino-slot';
            recintoEl.appendChild(slotEl);
            
            this.dom.contenedorSlots.appendChild(recintoEl);
        }
    }

    _poblarMano(dinos) {
        this.dom.manoDinosaurios.innerHTML = '';
        dinos.forEach(tipo => {
            const elemento = document.createElement('div');
            elemento.className = `tutorial__dinosaurio ${tipo}`;
            elemento.draggable = true;
            elemento.dataset.tipo = tipo;

            elemento.addEventListener('dragstart', e => {
                this.dinosaurioArrastrado = elemento;
                setTimeout(() => elemento.style.opacity = '0.5', 0);
                e.dataTransfer.effectAllowed = 'move';
            });
            elemento.addEventListener('dragend', () => {
                if (this.dinosaurioArrastrado) this.dinosaurioArrastrado.style.opacity = '1';
                this.dinosaurioArrastrado = null;
            });

            elemento.addEventListener('click', () => this._manejarClickEnDino(elemento));
            this.dom.manoDinosaurios.appendChild(elemento);
        });
    }

    _manejarClickEnDino(elemento) {
        const paso = this.PASOS_TUTORIAL[this.pasoActual];
        if (paso.tipo !== 'interactivo') return;

        const tiposAceptados = JSON.parse(document.getElementById(paso.elementoDestacado.substring(1)).dataset.tiposAceptados);
        if (!tiposAceptados.includes(elemento.dataset.tipo)) {
            this.notificador.mostrar(traducirJS("notif_tutorial_dino_incorrecto"), "error");
            return;
        }

        if (elemento.classList.contains('seleccionado')) {
            elemento.classList.remove('seleccionado');
            this.dinoSeleccionado = null;
            this.elementoDinoSeleccionado = null;
            this._limpiarClaseRecintos('tutorial__recinto--objetivo-valido');
        } else {
            if (this.elementoDinoSeleccionado) {
                this.elementoDinoSeleccionado.classList.remove('seleccionado');
            }
            elemento.classList.add('seleccionado');
            this.dinoSeleccionado = elemento.dataset.tipo;
            this.elementoDinoSeleccionado = elemento;
            document.getElementById(paso.elementoDestacado.substring(1)).classList.add('tutorial__recinto--objetivo-valido');
        }
    }

    _prepararZonaDeArrastreYClick(idRecinto, tiposAceptados) {
        const recinto = document.getElementById(idRecinto);
        if (recinto) {
            recinto.dataset.tiposAceptados = JSON.stringify(tiposAceptados);
            recinto.addEventListener('dragover', this._onDragOver.bind(this));
            recinto.addEventListener('drop', this._onDrop.bind(this));
            recinto.addEventListener('click', this._onRecintoClick.bind(this));
        }
    }

    _desactivarTodasLasZonasInteractivas() {
        document.querySelectorAll('.tutorial__recinto').forEach(recinto => {
            recinto.classList.remove('tutorial__recinto--objetivo-valido');
            recinto.removeEventListener('dragover', this._onDragOver);
            recinto.removeEventListener('drop', this._onDrop);
            recinto.removeEventListener('click', this._onRecintoClick);
        });
        this._limpiarClaseRecintos('tutorial__recinto--objetivo-valido');
    }

    _onDragOver(e) { e.preventDefault(); }

    _onDrop(e) {
        e.preventDefault();
        const recinto = e.currentTarget;
        const tiposAceptados = JSON.parse(recinto.dataset.tiposAceptados);

        if (this.dinosaurioArrastrado && tiposAceptados.includes(this.dinosaurioArrastrado.dataset.tipo)) {
            this._colocarDinoEnRecinto(recinto, this.dinosaurioArrastrado);
        } else {
            this.notificador.mostrar(traducirJS("notif_tutorial_lugar_incorrecto"), "error");
        }
    }

    _onRecintoClick(e) {
        const recinto = e.currentTarget;
        if (recinto.classList.contains('tutorial__recinto--objetivo-valido') && this.dinoSeleccionado && this.elementoDinoSeleccionado) {
            this._colocarDinoEnRecinto(recinto, this.elementoDinoSeleccionado);
        }
    }

    _colocarDinoEnRecinto(recinto, elementoDino) {
        const slotVacio = recinto.querySelector('.tutorial__dino-slot:not(.ocupado)');
        if (slotVacio) {
            slotVacio.className = `tutorial__dino-slot ocupado ${elementoDino.dataset.tipo}`;
            elementoDino.style.visibility = 'hidden';
            elementoDino.draggable = false;
            elementoDino.classList.remove('seleccionado');
            this.dinoSeleccionado = null;
            this.elementoDinoSeleccionado = null;
            this.dinosaurioArrastrado = null;
            this.notificador.mostrar(traducirJS("notif_tutorial_bien_hecho"), "success");
            setTimeout(() => this._avanzarPaso(), 1200);
        }
    }
    
    _lanzarDado(indiceCara) {
        const rotaciones = [
            { x: 0, y: 0 }, { x: 0, y: 180 }, { x: 0, y: -90 }, 
            { x: 0, y: 90 }, { x: -90, y: 0 }, { x: 90, y: 0 }
        ];
        
        const girosCompletos = Math.floor(Math.random() * 3) + 2;
        const giroAleatorioX = 360 * girosCompletos;
        const giroAleatorioY = 360 * girosCompletos;
        const giroAleatorioZ = 360 * girosCompletos;

        const rotacionFinal = rotaciones[indiceCara];
        this.dom.dado.style.transform = `rotateX(${giroAleatorioX + rotacionFinal.x}deg) rotateY(${giroAleatorioY + rotacionFinal.y}deg) rotateZ(${giroAleatorioZ}deg)`;
    }
    
    _mostrarPantalla(pantalla) { pantalla.classList.remove('oculta'); }
    _limpiarClaseRecintos(clase) { document.querySelectorAll('.tutorial__recinto').forEach(r => r.classList.remove(clase)); }
    _posicionarAyuda(elemento, texto, cajaResaltado) {
        const rect = elemento.getBoundingClientRect();
        const margen = 10;
        cajaResaltado.style.width = `${rect.width + margen * 2}px`;
        cajaResaltado.style.height = `${rect.height + margen * 2}px`;
        cajaResaltado.style.top = `${rect.top - margen}px`;
        cajaResaltado.style.left = `${rect.left - margen}px`;
        cajaResaltado.style.display = 'block';

        if (texto) {
            this.dom.tooltipContenido.textContent = texto;
            const tooltip = this.dom.tooltip;
            tooltip.style.display = 'block';
            const tooltipRect = tooltip.getBoundingClientRect();
            let top = rect.bottom + margen;
            if (top + tooltipRect.height > window.innerHeight - margen) {
                top = rect.top - tooltipRect.height - margen;
            }
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            if (left < margen) left = margen;
            if (left + tooltipRect.width > window.innerWidth - margen) {
                left = window.innerWidth - tooltipRect.width - margen;
            }
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    }
}
