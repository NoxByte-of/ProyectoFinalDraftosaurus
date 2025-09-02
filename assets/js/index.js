/**
 
 página principal (index.html).

  describir los modos de juego.
   mascota que muestra datos curiosos.
   
 */

document.addEventListener('DOMContentLoaded', function() {

    //  DESCRIPCIÓN DE MODOS(inactivo por ahora falta mejorarlo)
    const btnVerDescripcion = document.getElementById('btn-ver-descripcion');
    const textoDescripcionModos = document.getElementById('descripcion-modos-texto');

    if (btnVerDescripcion && textoDescripcionModos) {
        btnVerDescripcion.addEventListener('click', function() {
            const esVisible = textoDescripcionModos.classList.toggle('visible');
            btnVerDescripcion.classList.toggle('expanded');
           
            btnVerDescripcion.setAttribute('aria-expanded', esVisible);
            textoDescripcionModos.setAttribute('aria-hidden', !esVisible);
        });
        
        const esVisibleInicialmente = textoDescripcionModos.classList.contains('visible');
        btnVerDescripcion.setAttribute('aria-expanded', esVisibleInicialmente);
        textoDescripcionModos.setAttribute('aria-hidden', !esVisibleInicialmente);
    }

    //  MASCOTA (inactiva) 
    const mascota = document.getElementById('mascota-bienvenida');
    if (mascota) {
        const datosCuriosos = [
            "El nombre Draftosaurus viene de 'Drafting', la mecánica de elegir y pasar cartas (o dinos).",
            "El T-Rex vivió más cerca de la época de los humanos que de la del Estegosaurio.",
            "Algunos de los dinosaurios más pequeños tenían el tamaño de una gallina.",
            "El Spinosaurus es considerado el dinosaurio carnívoro más grande, ¡incluso más que el T-Rex!",
            "El Argentinosaurus, descubierto en Argentina, es uno de los animales terrestres más grandes que jamás haya existido.",
            "La palabra 'dinosaurio' significa 'lagarto terrible' en griego.",
            "El Estegosaurio tenía un cerebro del tamaño de una nuez, ¡pero su cuerpo era tan grande como un autobús!",
            "A pesar de sus brazos cortos, el T-Rex podía levantar más de 200 kg. ¡Más que suficiente para una buena selfie!",
            "El Parasaurolophus usaba su extraña cresta como un trombón para comunicarse. ¡El músico de la prehistoria!",
            "Algunos científicos creen que muchos dinosaurios, como el T-Rex, tenían plumas. ¡Imagina eso!",
            "Los dinosaurios dominaron la Tierra por más de 150 millones de años. Los humanos llevamos apenas unos 300,000.",
            "Se han encontrado fósiles de dinosaurios en todos los continentes, ¡incluso en la Antártida!",
            "El primer dinosaurio en ser nombrado oficialmente fue el Megalosaurus, en 1824.",
            "En Draftosaurus, el Río no siempre es un castigo. ¡A veces, un punto seguro es mejor que un plan arriesgado!",
            "El Triceratops tenía tres cuernos no solo para defenderse, sino también para atraer parejas. ¡Pura elegancia!",
            "El Brachiosaurus es famoso por su cuello largo. ¡Podía asomarse a una ventana de un cuarto piso sin problemas!",
            "El dinosaurio con el nombre más largo es el Micropachycephalosaurus... ¡Intenta decirlo rápido tres veces!",
            "Aunque vuelan en las películas, los Pterodáctilos no eran dinosaurios, sino reptiles voladores de un grupo diferente.",
        ];
        
        let ultimoDatoMostrado = -1;
        
        mascota.addEventListener('click', () => {
            let indiceAleatorio;
            do {
                indiceAleatorio = Math.floor(Math.random() * datosCuriosos.length);
            } while (indiceAleatorio === ultimoDatoMostrado);
            
            ultimoDatoMostrado = indiceAleatorio;
            
            if (window.mostrarNotificacion) {
                window.mostrarNotificacion(datosCuriosos[indiceAleatorio], 'info');
            } else {
                alert(datosCuriosos[indiceAleatorio]);
            }



            
        });
    }

});
