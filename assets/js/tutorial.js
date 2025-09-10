/**
 * Lógica del tutorial interactivo
 * Versión 5.7 - muchos bugs :(... solucionados :D
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const botonAbrirTutorial = document.getElementById('btn-abrir-tutorial');
    const modalSuperposicion = document.getElementById('tutorial-modal');

    // BUG FIX BOTONES DUPLICAOS
    const btnAbrirTutorialMain = document.getElementById('btn-abrir-tutorial-main');

    if (!modalSuperposicion) {
        console.error("No se encontró el modal del tutorial en el DOM.");
        return;
    }

    const botonesAbrir = [botonAbrirTutorial, btnAbrirTutorialMain].filter(btn => btn !== null);

    if (botonesAbrir.length === 0) {
        console.error("No se encontraron botones para abrir el tutorial.");
        return;
    }

    const botonCerrarTutorial = document.getElementById('tutorial-close-btn');
    const botonCerrarTutorialFin = document.getElementById('tutorial-close-btn-end');
    const botonIniciarTutorial = document.getElementById('tutorial-start-btn');
    const botonSiguienteTooltip = document.getElementById('tooltip-next-btn');
    
    const pantallaBienvenida = document.getElementById('welcome-screen-tutorial');
    const pantallaJuego = document.querySelector('.tutorial__vista-juego');
    const pantallaFin = document.getElementById('end-screen-tutorial');
    
    const cajaResaltadoRecinto = document.getElementById('highlight-overlay-tutorial');
    const cajaResaltadoMano = document.getElementById('highlight-overlay-hand-tutorial');
    
    const tooltip = document.getElementById('tutorial-tooltip');
    const tooltipContenido = document.getElementById('tooltip-content');
    
    const manoDinosaurios = document.getElementById('player-hand-tutorial');
    const panelMano = document.getElementById('player-hand-area');
    const dado = document.getElementById('dice-tutorial');
    const contenedorSlots = document.getElementById('tutorial-slots-container');

    let pasoActual = 0;
    let dinosaurioArrastrado = null;

    const DEFINICION_RECINTOS = {
        bosqueSemejanza: { id: 'pen-1', texto: 'El "Bosque de la Semejanza". Aquí, todos los dinos deben ser de la misma especie.', dinoValido: 'parasaurolophus', style: 'top: 8%; left: 6%; width: 33.5%; height: 17%;', slots: 1 },
        reySelva: { id: 'pen-4', texto: 'El "Rey de la Selva" te da 7 puntos si tienes más dinos de la especie que coloques que tus rivales.', dinoValido: 'triceratops', style: 'top: 8%; left: 62%; width: 12%; height: 12%;', slots: 1 },
        trioFrondoso: { id: 'pen-3', texto: 'El "Trío Frondoso". Ganas 7 puntos si colocas exactamente 3 dinos.', dinoValido: 't-rex', style: 'top: 40%; left: 14%; width: 23%; height: 15%;', slots: 1 },
        pradoDiferencia: { id: 'pen-0', texto: 'Este es el "Prado de la Diferencia". Aquí solo puedes colocar especies distintas.', dinoValido: 'brachiosaurus', style: 'top: 44%; left: 55%; width: 33.5%; height: 17%;', slots: 1 },
        praderaAmor: { id: 'pen-2', texto: 'La "Pradera del Amor", obtienes 5 puntos por parejas de dinosaurios de la misma especie.', dinoValido: 'spinosaurus', style: 'top: 70%; left: 15%; width: 29%; height: 16%;', slots: 1 },
        islaSolitaria: { id: 'pen-5', texto: 'La "Isla Solitaria" da puntos si el dino es el único de su especie en todo tu parque.', dinoValido: 'stegosaurus', style: 'top: 69%; left: 72%; width: 12%; height: 12%;', slots: 1 }
    };
    
    const PASOS_TUTORIAL = [
        { tipo: 'informativo', pantalla: pantallaBienvenida },
        { tipo: 'informativo', pantalla: pantallaJuego, elementoDestacado: '#player-hand-area', texto: '¡Empecemos! En cada ronda debes tomar 6 dinosaurios de la bolsa. ¡Esto se hace automaticamente!', accion: () => poblarMano(['brachiosaurus', 'parasaurolophus', 'spinosaurus', 't-rex', 'triceratops', 'stegosaurus']) },
        { tipo: 'informativo', elementoDestacado: '#player-hand-area', texto: '¡Genial! Estos 6 dinosaurios están en tu mano ahora. Tu objetivo es elegir uno y colocarlo en un recinto del parque.' },
        ...Object.values(DEFINICION_RECINTOS).map(recinto => ({
            tipo: 'interactivo',
            elementoDestacado: `#${recinto.id}`,
            texto: `${recinto.texto} Arrastra el ${recinto.dinoValido.replace('-', ' ')} aquí.`,
            accion: () => prepararZonaDeArrastre(recinto.id, [recinto.dinoValido]),
        })),
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Ahora explicaremos el dado. Al inicio de cada turno, un jugador lo lanza, este jugador es llamado "Jugador Activo". La cara que toque en el dado crea una restricción para los demás jugadores, pero no afecta al jugador activo.', accion: () => lanzarDado(0) },
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Esta cara es "Zona Boscosa". Obliga a colocar en uno de los 3 recintos del bosque en el tablero.', accion: () => lanzarDado(0) },
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Esta es la "Zona de Baños". Obliga a colocar en uno de los 3 recintos del lado derecho del tablero.', accion: () => lanzarDado(1) },
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Esta cara es "Zona de llanura". Obliga a colocar en los 3 recintos ubicados en la Zona de llanura.', accion: () => lanzarDado(2) },
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Esta es la "Zona Cafetería". Obliga a colocar en los 3 recintos de la parte izquierda del tablero.', accion: () => lanzarDado(3) },
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Esta cara es "Recinto Vacío" y te obliga a colocar tu dinosaurio en un recinto que esté completamente vacío en tu parque.', accion: () => lanzarDado(4) },
        { tipo: 'informativo', elementoDestacado: '#dice-area-tutorial', texto: 'Y por último, esta cara prohíbe colocar tu dinosaurio en un recinto que ya hayas colocado un T-Rex.', accion: () => lanzarDado(5) },
        { tipo: 'informativo', pantalla: pantallaFin }
    ];
    
    function generarTableroTutorial() {
        contenedorSlots.innerHTML = '';
        for (const key in DEFINICION_RECINTOS) {
            const recintoData = DEFINICION_RECINTOS[key];
            const recintoEl = document.createElement('div');
            recintoEl.id = recintoData.id;
            recintoEl.className = 'tutorial__recinto';
            recintoEl.style.cssText = recintoData.style;
            
            const slotEl = document.createElement('div');
            slotEl.className = 'tutorial__dino-slot';
            recintoEl.appendChild(slotEl);
            
            contenedorSlots.appendChild(recintoEl);
        }
    }

    function iniciarTutorial() {
        modalSuperposicion.classList.add('visible');
        pasoActual = 0;
        generarTableroTutorial();
        manoDinosaurios.innerHTML = '';
        ejecutarPaso(pasoActual);
    }

    function cerrarTutorial() {
        modalSuperposicion.classList.remove('visible');
    }

    function avanzarPaso() {
        pasoActual++;
        if (pasoActual < PASOS_TUTORIAL.length) {
            ejecutarPaso(pasoActual);
        } else {
            mostrarPantalla(pantallaFin);
        }
    }

    function ejecutarPaso(indice) {
        const paso = PASOS_TUTORIAL[indice];

        panelMano.classList.remove('elemento-resaltado-tutorial');

        pantallaBienvenida.classList.add('oculta');
        pantallaJuego.classList.add('oculta');
        pantallaFin.classList.add('oculta');
        
        tooltip.style.display = 'none';
        cajaResaltadoRecinto.style.display = 'none';
        cajaResaltadoMano.style.display = 'none';
        desactivarTodasLasZonasDeArrastre();

        if (paso.pantalla) {
            paso.pantalla.classList.remove('oculta');
        } else {
            pantallaJuego.classList.remove('oculta');
        }

        if (paso.elementoDestacado) {
            const elemento = document.querySelector(paso.elementoDestacado);
            if (elemento) {
                // BUG FIX
                const cajaCorrecta = paso.elementoDestacado === '#player-hand-area' ? cajaResaltadoMano : cajaResaltadoRecinto;
                posicionarAyuda(elemento, paso.texto, cajaCorrecta);
                if (!paso.pantalla || paso.pantalla === pantallaJuego) {
                     panelMano.classList.add('elemento-resaltado-tutorial');
                }
            }
        }

        if (paso.accion) {
            paso.accion();
        }

        botonSiguienteTooltip.style.display = paso.tipo === 'informativo' ? 'block' : 'none';
    }

    function mostrarPantalla(pantalla) {
        pantalla.classList.remove('oculta');
    }

    function poblarMano(dinos) {
        manoDinosaurios.innerHTML = '';
        dinos.forEach(tipo => {
            const elemento = document.createElement('div');
            elemento.className = `tutorial__dinosaurio ${tipo}`;
            elemento.draggable = true;
            elemento.dataset.tipo = tipo;

            elemento.addEventListener('dragstart', e => {
                dinosaurioArrastrado = elemento;
                setTimeout(() => elemento.style.opacity = '0.5', 0);
                e.dataTransfer.effectAllowed = 'move';
            });
            elemento.addEventListener('dragend', () => {
                if(dinosaurioArrastrado) dinosaurioArrastrado.style.opacity = '1';
                dinosaurioArrastrado = null;
            });

            manoDinosaurios.appendChild(elemento);
        });
    }

    function prepararZonaDeArrastre(idRecinto, tiposAceptados) {
        const recinto = document.getElementById(idRecinto);
        if (recinto) {
            recinto.classList.add('tutorial__recinto--objetivo-valido');
            recinto.dataset.tiposAceptados = JSON.stringify(tiposAceptados);
            recinto.addEventListener('dragover', onDragOver);
            recinto.addEventListener('drop', onDrop);
        }
    }

    function desactivarTodasLasZonasDeArrastre() {
        document.querySelectorAll('.tutorial__recinto').forEach(recinto => {
            recinto.classList.remove('tutorial__recinto--objetivo-valido');
            recinto.removeEventListener('dragover', onDragOver);
            recinto.removeEventListener('drop', onDrop);
        });
    }

    function onDragOver(e) {
        e.preventDefault();
    }

    function onDrop(e) {
        e.preventDefault();
        const recinto = e.currentTarget;
        const tiposAceptados = JSON.parse(recinto.dataset.tiposAceptados);

        if (dinosaurioArrastrado && tiposAceptados.includes(dinosaurioArrastrado.dataset.tipo)) {
            const slotVacio = recinto.querySelector('.tutorial__dino-slot:not(.ocupado)');
            if (slotVacio) {
                slotVacio.className = `tutorial__dino-slot ocupado ${dinosaurioArrastrado.dataset.tipo}`;
                dinosaurioArrastrado.style.visibility = 'hidden';
                dinosaurioArrastrado.draggable = false;
                avanzarPaso();
            }
        } else {
             if (window.mostrarNotificacion) {
                window.mostrarNotificacion("¡Ese dinosaurio no puede ir ahí!", "error");
            } else {
                alert("¡Ese dinosaurio no puede ir ahí!");
            }
        }
    }

    function posicionarAyuda(elemento, texto, cajaResaltado) {
        const rect = elemento.getBoundingClientRect();
        const margen = 10;

        cajaResaltado.style.width = `${rect.width + margen * 2}px`;
        cajaResaltado.style.height = `${rect.height + margen * 2}px`;
        cajaResaltado.style.top = `${rect.top - margen}px`;
        cajaResaltado.style.left = `${rect.left - margen}px`;
        cajaResaltado.style.display = 'block';

        if (texto) {
            tooltipContenido.textContent = texto;
            tooltip.style.display = 'block';
            const tooltipRect = tooltip.getBoundingClientRect();
            const contenedorRect = modalSuperposicion.getBoundingClientRect();

            let top, left;
            
            // BUG FIX
            if (elemento.id === 'player-hand-area' || elemento.id === 'dice-area-tutorial') {
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - (margen * 2);
                if (left < contenedorRect.left) {
                    left = rect.right + margen;
                }
            } else {
                top = rect.bottom + margen;
                if (top + tooltipRect.height > contenedorRect.bottom) {
                    top = rect.top - tooltipRect.height - margen;
                }
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                if (left < contenedorRect.left) left = contenedorRect.left + margen;
                if (left + tooltipRect.width > contenedorRect.right) {
                    left = contenedorRect.right - tooltipRect.width - margen;
                }
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
    }

    function lanzarDado(indiceCara) {
        
        const rotaciones = [
            { x: 0, y: 0 },       // 0: boscosa 
            { x: 0, y: 180 },     // 1: baños
            { x: 0, y: -90 },     // 2: llanura 
            { x: 0, y: 90 },      // 3: cafeteria 
            { x: -90, y: 0 },     // 4: recinto vacio 
            { x: 90, y: 0 }       // 5: sin-t-rex 
        ];
        
        const giroAleatorioY = 360 * (Math.floor(Math.random() * 2) + 3);
        const giroAleatorioX = 360 * (Math.floor(Math.random() * 2) + 3);
        
        const rotacionFinal = rotaciones[indiceCara];
        dado.style.transform = `rotateX(${giroAleatorioX + rotacionFinal.x}deg) rotateY(${giroAleatorioY + rotacionFinal.y}deg)`;
    }
    
    botonesAbrir.forEach(btn => btn.addEventListener('click', iniciarTutorial));
    botonCerrarTutorial.addEventListener('click', cerrarTutorial);
    botonCerrarTutorialFin.addEventListener('click', cerrarTutorial);
    botonIniciarTutorial.addEventListener('click', avanzarPaso);
    botonSiguienteTooltip.addEventListener('click', avanzarPaso);
});
