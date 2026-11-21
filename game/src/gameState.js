// Harbour Lights: the game's state — which scene is being hunted, what has
// been found, the clock, the score and the hint. Pure logic, no drawing.
import { SCENES } from './scenes.js';

export const FIND_POINTS = 100;
export const MISS_PENALTY = 25;
export const HINT_COST = 50;
export const HINT_COOLDOWN_SECONDS = 20;
export const SCENE_CLEAR_BONUS = 250;

export function createGameState() {
  return {
    screen: 'title',
    sceneIndex: 0,
    found: new Set(),
    foundOrder: [],
    score: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: SCENES[0].timeLimitSeconds,
    hintCooldown: 0,
    hintTarget: null,
    hintPulseUntil: 0,
    misses: 0,
    totalFound: 0,
    scenesCleared: 0,
    lastMessage: '',
    sceneResults: [],
    startedAt: 0,
  };
}

export function currentScene(state) {
  return SCENES[state.sceneIndex];
}

export function remainingCount(state) {
  return currentScene(state).differences.length - state.found.size;
}

export function startScene(state, index, presetFound) {
  state.sceneIndex = index;
  state.screen = 'play';
  state.found = new Set(presetFound || []);
  state.foundOrder = [...(presetFound || [])];
  state.timeLeft = SCENES[index].timeLimitSeconds;
  state.hintCooldown = 0;
  state.hintTarget = null;
  state.hintPulseUntil = 0;
  state.lastMessage = SCENES[index].subtitle;
  state.startedAt = Date.now();
}

export function startGame(state) {
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.misses = 0;
  state.totalFound = 0;
  state.scenesCleared = 0;
  state.sceneResults = [];
  startScene(state, 0, []);
}

export function markFound(state, diff, nowMs) {
  if (state.screen !== 'play') return false;
  if (state.found.has(diff.id)) return false;
  state.found.add(diff.id);
  state.foundOrder.push(diff.id);
  state.totalFound += 1;
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  const speedBonus = Math.max(0, Math.round(state.timeLeft / 5));
  state.score += FIND_POINTS + speedBonus;
  state.lastMessage = 'Found: ' + diff.label + '  (+' + (FIND_POINTS + speedBonus) + ')';
  if (remainingCount(state) === 0) {
    const bonus = SCENE_CLEAR_BONUS + Math.round(state.timeLeft) * 5;
    state.score += bonus;
    state.scenesCleared += 1;
    state.sceneResults.push({
      scene: currentScene(state).name,
      found: state.found.size,
      timeLeft: Math.round(state.timeLeft),
      bonus,
    });
    state.screen = 'scene-clear';
    state.lastMessage = 'Scene clear! Time bonus +' + bonus;
  }
  return true;
}

export function registerMiss(state) {
  if (state.screen !== 'play') return;
  state.misses += 1;
  state.streak = 0;
  state.score = Math.max(0, state.score - MISS_PENALTY);
  state.lastMessage = 'Not a difference there. (-' + MISS_PENALTY + ')';
}

export function nextScene(state) {
  if (state.sceneIndex + 1 < SCENES.length) {
    startScene(state, state.sceneIndex + 1, []);
  } else {
    state.screen = 'game-complete';
  }
}

export function useHint(state, nowMs) {
  if (state.screen !== 'play') return null;
  if (state.hintCooldown > 0) return null;
  const unfound = currentScene(state).differences.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  const target = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintTarget = target;
  state.hintPulseUntil = nowMs + 2500;
  state.hintCooldown = HINT_COOLDOWN_SECONDS;
  state.score = Math.max(0, state.score - HINT_COST);
  state.lastMessage = 'Hint: look near the ' + target.label.toLowerCase() + '  (-' + HINT_COST + ')';
  return target;
}

export function tickClock(state, dtSeconds, nowMs) {
  if (state.screen !== 'play') return;
  state.timeLeft = Math.max(0, state.timeLeft - dtSeconds);
  if (state.hintCooldown > 0) state.hintCooldown = Math.max(0, state.hintCooldown - dtSeconds);
  if (state.hintPulseUntil && nowMs > state.hintPulseUntil) state.hintTarget = null;
  if (state.timeLeft <= 0) {
    state.screen = 'time-up';
    state.sceneResults.push({
      scene: currentScene(state).name,
      found: state.found.size,
      timeLeft: 0,
      bonus: 0,
    });
    state.lastMessage = "Time's up on this scene.";
  }
}
