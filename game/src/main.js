// Harbour Lights: entry point. Wires the panels, the HUD and the overlays,
// runs the clock, and stages screenshot states from the URL so the maker
// can photograph the game mid-hunt:
//   ?shot=title   title screen
//   ?shot=cover   scene 1 mid-hunt, 3 of 5 found, 92 seconds left
//   ?shot=market  scene 2 mid-hunt, 2 of 7 found, 88 seconds left
//   ?shot=end     game-complete screen with a full score card
import { SCENES, differenceAt } from './scenes.js';
import { drawScene, drawFoundMarker, drawHintPulse, makePanel } from './painter.js';
import {
  createGameState,
  currentScene,
  remainingCount,
  startGame,
  startScene,
  markFound,
  registerMiss,
  nextScene,
  useHint,
  tickClock,
} from './gameState.js';
import { attachPanelClicks, attachKeyboard, createCursor, drawCursor } from './input.js';
import {
  ensureAudio,
  playFindSound,
  playMissSound,
  playHintSound,
  playClickSound,
  playSceneClearSound,
  playGameCompleteSound,
  playTickSound,
} from './sounds.js';

const canvasA = document.getElementById('panel-left');
const canvasB = document.getElementById('panel-right');
const ctxA = makePanel(canvasA);
const ctxB = makePanel(canvasB);
const state = createGameState();
const cursor = createCursor();
const hover = { x: -1, y: -1, panel: 'left' };

const el = (id) => document.getElementById(id);
const timerEl = el('timer');
const timerFillEl = el('timer-fill');
const scoreEl = el('score');
const remainingEl = el('remaining');
const sceneNameEl = el('scene-name');
const messageEl = el('message');
const hintBtn = el('hint-btn');
const overlayEl = el('overlay');
const overlayCardEl = el('overlay-card');

let lastTickSecond = -1;

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return String(Math.floor(s / 60)).padStart(1, '0') + ':' + String(s % 60).padStart(2, '0');
}

function renderHud() {
  const scene = currentScene(state);
  sceneNameEl.textContent = 'Scene ' + (state.sceneIndex + 1) + ' of ' + SCENES.length + ' — ' + scene.name;
  timerEl.textContent = formatTime(state.timeLeft);
  const ratio = state.timeLeft / scene.timeLimitSeconds;
  timerFillEl.style.width = Math.round(ratio * 100) + '%';
  timerFillEl.classList.toggle('low', ratio < 0.25);
  scoreEl.textContent = 'Score ' + state.score;
  const remaining = remainingCount(state);
  remainingEl.textContent = remaining + ' of ' + scene.differences.length + ' left';
  remainingEl.classList.toggle('done', remaining === 0);
  messageEl.textContent = state.lastMessage;
  hintBtn.disabled = state.hintCooldown > 0 || state.screen !== 'play';
  hintBtn.textContent = state.hintCooldown > 0
    ? 'Hint (' + Math.ceil(state.hintCooldown) + 's)'
    : 'Hint  (-50)';
}

function renderPanels(nowMs) {
  const scene = currentScene(state);
  const foundIds = new Set(state.found);
  const appliedAll = new Set(scene.differences.map((d) => d.id));
  drawScene(ctxA, state.sceneIndex, new Set());
  drawScene(ctxB, state.sceneIndex, appliedAll);
  for (const id of state.foundOrder) {
    const diff = scene.differences.find((d) => d.id === id);
    if (!diff) continue;
    drawFoundMarker(ctxA, diff, nowMs / 1000);
    drawFoundMarker(ctxB, diff, nowMs / 1000);
  }
  if (state.hintTarget && nowMs < state.hintPulseUntil) {
    drawHintPulse(ctxA, state.hintTarget, nowMs / 1000);
    drawHintPulse(ctxB, state.hintTarget, nowMs / 1000);
  }
  drawCursor(ctxA, cursor.panel === 'left' ? cursor : { ...cursor, visible: false });
  drawCursor(ctxB, cursor.panel === 'right' ? cursor : { ...cursor, visible: false });
  if (hover.x >= 0 && state.screen === 'play') {
    const ctx = hover.panel === 'left' ? ctxA : ctxB;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(hover.x, hover.y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function showTitle() {
  state.screen = 'title';
  overlayEl.classList.remove('hidden');
  overlayCardEl.innerHTML =
    '<h1>Harbour Lights</h1>' +
    '<p class="tagline">A spot-the-difference hunt in three harbourside scenes.</p>' +
    '<p>Two pictures, side by side. One hides ' + SCENES[0].differences.length +
    ' changes, then ' + SCENES[1].differences.length + ', then ' + SCENES[2].differences.length +
    '. Click a difference — or steer with the arrow keys and press Enter.</p>' +
    '<p class="rules">Click a found difference to ring it &nbsp;·&nbsp; Wrong click −25 &nbsp;·&nbsp; Hint costs 50 and cools down 20s &nbsp;·&nbsp; Beat the clock for a time bonus.</p>' +
    '<button id="start-btn" class="big-btn">Start the hunt</button>' +
    '<p class="keys">Mouse to click · Arrow keys to move · Enter to mark · Tab switches panel · H for hint</p>';
  el('start-btn').addEventListener('click', () => {
    ensureAudio();
    playClickSound();
    overlayEl.classList.add('hidden');
    startGame(state);
  });
}

function showSceneClear() {
  overlayEl.classList.remove('hidden');
  const result = state.sceneResults[state.sceneResults.length - 1];
  const last = state.sceneIndex + 1 >= SCENES.length;
  overlayCardEl.innerHTML =
    '<h1>Scene clear!</h1>' +
    '<p class="tagline">' + currentScene(state).name + ' — every difference found.</p>' +
    '<p>Time bonus: <b>+' + result.bonus + '</b> &nbsp;·&nbsp; Score: <b>' + state.score + '</b></p>' +
    '<button id="next-btn" class="big-btn">' + (last ? 'See my results' : 'Next scene') + '</button>';
  el('next-btn').addEventListener('click', () => {
    ensureAudio();
    playClickSound();
    overlayEl.classList.add('hidden');
    nextScene(state);
    if (state.screen === 'game-complete') {
      playGameCompleteSound();
      showGameComplete();
    }
  });
}

function showTimeUp() {
  overlayEl.classList.remove('hidden');
  overlayCardEl.innerHTML =
    '<h1>Time&rsquo;s up!</h1>' +
    '<p class="tagline">' + currentScene(state).name + ' — you found ' + state.found.size +
    ' of ' + currentScene(state).differences.length + ' differences.</p>' +
    '<p>Score so far: <b>' + state.score + '</b></p>' +
    '<button id="next-btn" class="big-btn">Continue</button>';
  el('next-btn').addEventListener('click', () => {
    ensureAudio();
    playClickSound();
    overlayEl.classList.add('hidden');
    nextScene(state);
    if (state.screen === 'game-complete') showGameComplete();
  });
}

function showGameComplete() {
  state.screen = 'game-complete';
  overlayEl.classList.remove('hidden');
  const rows = state.sceneResults.map((r) =>
    '<tr><td>' + r.scene + '</td><td>' + r.found + '</td><td>' + r.timeLeft + 's</td><td>+' + r.bonus + '</td></tr>'
  ).join('');
  overlayCardEl.innerHTML =
    '<h1>Hunt complete!</h1>' +
    '<p class="tagline">Three scenes, ' + state.totalFound + ' differences found, best streak ' + state.bestStreak + '.</p>' +
    '<table class="results"><tr><th>Scene</th><th>Found</th><th>Time left</th><th>Bonus</th></tr>' + rows + '</table>' +
    '<p class="final-score">Final score: <b>' + state.score + '</b></p>' +
    '<button id="again-btn" class="big-btn">Play again</button>';
  el('again-btn').addEventListener('click', () => {
    ensureAudio();
    playClickSound();
    overlayEl.classList.add('hidden');
    startGame(state);
  });
}

function handleMark(panel, x, y) {
  if (state.screen !== 'play') return;
  ensureAudio();
  cursor.x = x;
  cursor.y = y;
  cursor.panel = panel;
  cursor.visible = true;
  const scene = currentScene(state);
  const diff = differenceAt(scene, x, y);
  if (diff && !state.found.has(diff.id)) {
    const wasLast = remainingCount(state) === 1;
    markFound(state, diff, Date.now());
    if (state.screen === 'scene-clear') {
      playSceneClearSound();
      renderPanels(Date.now());
      renderHud();
      showSceneClear();
    } else {
      playFindSound();
    }
    void wasLast;
  } else if (diff && state.found.has(diff.id)) {
    state.lastMessage = 'Already found: ' + diff.label + '.';
    playClickSound();
  } else {
    registerMiss(state);
    playMissSound();
  }
}

function handleAction(action) {
  if (action === 'hint') {
    ensureAudio();
    const target = useHint(state, Date.now());
    if (target) playHintSound();
  } else if (action === 'next') {
    if (state.screen === 'scene-clear' || state.screen === 'time-up') {
      const btn = el('next-btn');
      if (btn) btn.click();
    }
  } else if (action === 'restart') {
    startGame(state);
    overlayEl.classList.add('hidden');
  }
}

attachPanelClicks(canvasA, canvasB, (panel, x, y, hoverPanel) => {
  if (panel === 'hover') {
    hover.x = x;
    hover.y = y;
    hover.panel = hoverPanel;
    return;
  }
  handleMark(panel, x, y);
});
attachKeyboard(cursor, handleMark, handleAction);
hintBtn.addEventListener('click', () => handleAction('hint'));

function frame(nowMs) {
  const now = nowMs || performance.now();
  if (state.screen === 'play') {
    const second = Math.ceil(state.timeLeft);
    if (second !== lastTickSecond) {
      lastTickSecond = second;
      if (second <= 10 && second > 0) playTickSound();
    }
  }
  tickClock(state, 1 / 60, Date.now());
  if (state.screen === 'time-up') showTimeUp();
  renderPanels(Date.now());
  renderHud();
  requestAnimationFrame(frame);
}

function applyShotParam() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot === 'cover') {
    startGame(state);
    startScene(state, 0, ['beam', 'gull', 'window']);
    state.timeLeft = 92;
    state.score = 340;
    state.streak = 3;
    state.lastMessage = 'Found: Cottage window lit  (+112)';
  } else if (shot === 'market') {
    startGame(state);
    startScene(state, 1, ['moon', 'bulb']);
    state.timeLeft = 88;
    state.score = 615;
    state.streak = 2;
    state.lastMessage = 'Found: String-light bulb  (+118)';
  } else if (shot === 'end') {
    startGame(state);
    startScene(state, 2, SCENES[2].differences.map((d) => d.id));
    state.timeLeft = 0;
    state.totalFound = 22;
    state.bestStreak = 9;
    state.score = 2840;
    state.sceneResults = [
      { scene: 'Dusk Harbour', found: 5, timeLeft: 61, bonus: 555 },
      { scene: 'Night Market on the Pier', found: 7, timeLeft: 44, bonus: 470 },
      { scene: "The Keeper's Cottage", found: 10, timeLeft: 38, bonus: 440 },
    ];
    state.sceneIndex = 2;
    showGameComplete();
  } else {
    showTitle();
  }
  requestAnimationFrame(frame);
}

applyShotParam();
