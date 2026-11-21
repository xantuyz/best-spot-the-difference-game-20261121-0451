// input.js — mouse, keyboard, dan konversi koordinat.
// Klik dipetakan dari piksel layar ke koordinat logis panel 600x480, sehingga
// posisi klik tetap benar setelah resize dan di devicePixelRatio berbeda.

export const KEY_HINT = 'h';
export const KEY_PAUSE = 'Escape';
export const KEY_MUTE = 'm';
export const KEY_CONFIRM = 'Enter';
export const CURSOR_STEP = 12;
export const CURSOR_FAST_STEP = 48;

/**
 * Petakan posisi pointer (clientX/clientY) ke koordinat logis panel.
 * Mengembalikan { x, y } atau null bila pointer di luar kanvas.
 */
export function mapPointerToSceneCoordinates(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  const x = ((clientX - rect.left) / rect.width) * 600;
  const y = ((clientY - rect.top) / rect.height) * 480;
  if (x < 0 || x > 600 || y < 0 || y > 480) return null;
  return { x, y };
}

/**
 * Ikat kontrol mouse + keyboard ke dua kanvas. `handlers` berisi:
 *  onPanelClick(panelIndex, x, y) — klik di dalam panel
 *  onHint() / onPauseToggle() / onMuteToggle() / onConfirm()
 *  onCursorMove(panelIndex, x, y) / onCursorActivate(panelIndex, x, y)
 *  onFirstGesture() — dipanggil sekali saat interaksi pertama (untuk audio).
 */
export function bindMouseAndKeyboardControls(leftCanvas, rightCanvas, handlers) {
  let gestureDone = false;
  function noteGesture() {
    if (gestureDone) return;
    gestureDone = true;
    if (handlers.onFirstGesture) handlers.onFirstGesture();
  }

  function bindCanvas(canvas, panelIndex) {
    canvas.addEventListener('pointerdown', (event) => {
      noteGesture();
      const point = mapPointerToSceneCoordinates(canvas, event.clientX, event.clientY);
      if (point) handlers.onPanelClick(panelIndex, point.x, point.y);
    });
  }
  bindCanvas(leftCanvas, 0);
  bindCanvas(rightCanvas, 1);

  // Kursor keyboard: panah menggerakkan bidik, Spasi/Enter mengaktifkan.
  const cursor = { panel: 0, x: 300, y: 240, visible: false };
  function moveCursor(dx, dy) {
    cursor.visible = true;
    cursor.x += dx;
    cursor.y += dy;
    if (cursor.x < 0) {
      if (cursor.panel === 1) { cursor.panel = 0; cursor.x = 600 + cursor.x; }
      else cursor.x = 0;
    }
    if (cursor.x > 600) {
      if (cursor.panel === 0) { cursor.panel = 1; cursor.x -= 600; }
      else cursor.x = 600;
    }
    cursor.y = Math.max(0, Math.min(480, cursor.y));
    handlers.onCursorMove(cursor.panel, cursor.x, cursor.y);
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      noteGesture();
      const step = event.shiftKey ? CURSOR_FAST_STEP : CURSOR_STEP;
      if (key === 'ArrowLeft') moveCursor(-step, 0);
      if (key === 'ArrowRight') moveCursor(step, 0);
      if (key === 'ArrowUp') moveCursor(0, -step);
      if (key === 'ArrowDown') moveCursor(0, step);
      return;
    }
    if (key === ' ' || key === KEY_CONFIRM) {
      if (cursor.visible && handlers.onCursorActivate) {
        event.preventDefault();
        noteGesture();
        handlers.onCursorActivate(cursor.panel, cursor.x, cursor.y);
        return;
      }
      if (key === KEY_CONFIRM && handlers.onConfirm) {
        handlers.onConfirm();
      }
      return;
    }
    const lower = key.toLowerCase();
    if (lower === KEY_HINT) {
      noteGesture();
      if (handlers.onHint) handlers.onHint();
    } else if (key === KEY_PAUSE) {
      if (handlers.onPauseToggle) handlers.onPauseToggle();
    } else if (lower === KEY_MUTE) {
      if (handlers.onMuteToggle) handlers.onMuteToggle();
    }
  });

  return cursor;
}
