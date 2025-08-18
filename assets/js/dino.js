const container = document.querySelector('.dino-container');
const gridSizeX = 100;  // ancho celda
const gridSizeY = 100;  // alto celda (una fila)

let selected = null;
let offsetX = 0;
let offsetY = 0;
let startLeft = 0;
let startTop = 0;

document.querySelectorAll('.dino-container .draggable').forEach(item => {
  item.addEventListener('mousedown', e => {
    selected = e.target;
    selected.style.zIndex = 1000;
    selected.classList.add('dragging');

    const rect = selected.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    startLeft = parseFloat(selected.style.left) || 0;
    startTop = parseFloat(selected.style.top) || 0;

    if (selected.parentElement !== container) {
      selected.style.left = (rect.left - containerRect.left) + 'px';
      selected.style.top = (rect.top - containerRect.top) + 'px';
      container.appendChild(selected);
    }

    e.preventDefault();
  });

  item.addEventListener('dragstart', e => e.preventDefault());
});

window.addEventListener('mousemove', e => {
  if (!selected) return;

  const containerRect = container.getBoundingClientRect();

  let newLeft = e.clientX - containerRect.left - offsetX;
  let newTop = e.clientY - containerRect.top - offsetY;

  // Aquí movemos libremente siempre, sin restricción
  selected.style.left = newLeft + 'px';
  selected.style.top = newTop + 'px';
});

window.addEventListener('mouseup', e => {
  if (!selected) return;

  const containerRect = container.getBoundingClientRect();
  const imgRect = selected.getBoundingClientRect();

  let relativeX = imgRect.left - containerRect.left;
  let relativeY = imgRect.top - containerRect.top;

  const centerX = relativeX + imgRect.width / 2;
  const centerY = relativeY + imgRect.height / 2;

  const insideX = centerX >= 0 && centerX <= container.clientWidth;
  const insideY = centerY >= 0 && centerY <= container.clientHeight;

  if (insideX && insideY) {
    // DENTRO DEL CONTENEDOR: Snap a cuadrícula con chequeo ocupación

    const maxCols = 6;
    const maxRows = 1;  // sólo una fila

    let col = Math.round(relativeX / gridSizeX);
    let row = 0; // sólo fila 0

    col = Math.min(Math.max(col, 0), maxCols - 1);

    function isOccupied(c, r) {
      return Array.from(container.querySelectorAll('.draggable'))
        .filter(img => img !== selected)
        .some(img => {
          const left = Math.round(parseFloat(img.style.left) / gridSizeX);
          const top = Math.round(parseFloat(img.style.top) / gridSizeY);
          return left === c && top === r;
        });
    }

    if (!isOccupied(col, row)) {
      selected.style.left = (col * gridSizeX) + 'px';
      selected.style.top = '0px';
    } else {
      // Celda ocupada: volver a la posición original
      selected.style.left = startLeft + 'px';
      selected.style.top = startTop + 'px';
    }
  } else {
    // FUERA DEL CONTENEDOR: queda donde lo soltaste (libre)
    // No hacemos nada, el movimiento libre ya lo hizo en mousemove
  }

  selected.style.zIndex = '';
  selected.classList.remove('dragging');
  selected = null;
});
