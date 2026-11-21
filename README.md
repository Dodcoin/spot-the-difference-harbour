# Harbour Lights — Spot the Difference

[![Make.fun competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Dodcoin/spot-the-difference-harbour/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Dodcoin/spot-the-difference-harbour/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451): three hand-drawn harbourside scenes — Dusk Harbour (5 differences), Night Market on the Pier (7), and The Keeper's Cottage (10) — drawn procedurally on canvas, so the two panels match except for the differences hidden by design.

## Play

Serve `game/` with any static server (for example `npx serve game` or `python3 -m http.server` inside `game/`) and open `index.html` in a desktop browser. No network requests, no build step, all sounds synthesised with WebAudio.

- **Click** a difference on either panel to ring it with a gold marker.
- **Arrow keys** move the crosshair, **Enter/Space** marks, **Tab** switches panel, **H** asks for a hint (−50 points, 20s cooldown).
- A wrong click costs 25 points. Beat the clock for a time bonus on each cleared scene.

## Layout

- `main.ts` — submission program: copies `game/` and `screenshots/` to the output directory and writes `dossier.json` via `vendor/makefun-game.ts`.
- `game/index.html` + `game/styles.css` — page and presentation.
- `game/src/scenes.js` — scene data: difference positions and radii.
- `game/src/painter.js` — draws every scene twice from one picture (left plain, right with differences applied) and draws found markers and hint pulses.
- `game/src/gameState.js` — scene flow, clock, score, hints.
- `game/src/input.js` — mouse and keyboard input, crosshair.
- `game/src/sounds.js` — synthesised WebAudio sounds.
- `game/src/main.js` — entry point, HUD, overlays, screenshot staging (`?shot=cover|market|end|title`).

## License

MIT — see [LICENSE](LICENSE).
