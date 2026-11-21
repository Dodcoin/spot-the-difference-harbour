// Harbour Lights: mouse and keyboard input. The mouse clicks a panel; the
// keyboard drives a crosshair (arrow keys move it, Tab switches panel,
// Enter or Space marks the spot). All coordinates are scene coordinates.
import { SCENE_WIDTH, SCENE_HEIGHT } from './scenes.js';

export function createCursor() {
  return { x: SCENE_WIDTH / 2, y: SCENE_HEIGHT / 2, panel: 'left', visible: false };
}

export function attachPanelClicks(canvasA, canvasB, onMark) {
  const bind = (canvas, panel) => {
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT;
      onMark(panel, x, y);
    });
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT;
      onMark('hover', x, y, panel);
    });
  };
  bind(canvasA, 'left');
  bind(canvasB, 'right');
}

export function attachKeyboard(cursor, onMark, onAction) {
  window.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 24 : 8;
    let used = true;
    if (event.key === 'ArrowLeft') cursor.x = Math.max(0, cursor.x - step);
    else if (event.key === 'ArrowRight') cursor.x = Math.min(SCENE_WIDTH, cursor.x + step);
    else if (event.key === 'ArrowUp') cursor.y = Math.max(0, cursor.y - step);
    else if (event.key === 'ArrowDown') cursor.y = Math.min(SCENE_HEIGHT, cursor.y + step);
    else if (event.key === 'Tab') {
      event.preventDefault();
      cursor.panel = cursor.panel === 'left' ? 'right' : 'left';
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onMark(cursor.panel, cursor.x, cursor.y);
    } else if (event.key === 'h' || event.key === 'H') onAction('hint');
    else if (event.key === 'n' || event.key === 'N') onAction('next');
    else if (event.key === 'r' || event.key === 'R') onAction('restart');
    else used = false;
    if (used) cursor.visible = true;
  });
}

export function drawCursor(ctx, cursor) {
  if (!cursor.visible) return;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cursor.x - 20, cursor.y);
  ctx.lineTo(cursor.x - 8, cursor.y);
  ctx.moveTo(cursor.x + 8, cursor.y);
  ctx.lineTo(cursor.x + 20, cursor.y);
  ctx.moveTo(cursor.x, cursor.y - 20);
  ctx.lineTo(cursor.x, cursor.y - 8);
  ctx.moveTo(cursor.x, cursor.y + 8);
  ctx.lineTo(cursor.x, cursor.y + 20);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(cursor.panel === 'left' ? 'LEFT' : 'RIGHT', cursor.x + 18, cursor.y - 14);
}
