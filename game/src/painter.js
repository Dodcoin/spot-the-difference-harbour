// Harbour Lights: draws each scene onto a canvas, twice, from one shared
// picture. The left panel is the plain scene; the right panel applies the
// scene's differences (the `applied` set of difference ids). Because both
// panels come from the same drawing code, they match except where a
// difference was deliberately hidden.
import { SCENE_WIDTH, SCENE_HEIGHT } from './scenes.js';

export function makePanel(canvas) {
  canvas.width = SCENE_WIDTH;
  canvas.height = SCENE_HEIGHT;
  return canvas.getContext('2d');
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, scale, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 9 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 6 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 6 * scale, x + 9 * scale, y);
  ctx.stroke();
}

function waveLines(ctx, yTop, yBottom, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2;
  for (let y = yTop; y < yBottom; y += 18) {
    for (let x = 8; x < SCENE_WIDTH; x += 46) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10, y - 5, x + 22, y);
      ctx.stroke();
    }
  }
}

function plankPier(ctx, yTop, colour, dark) {
  ctx.fillStyle = colour;
  ctx.fillRect(0, yTop, SCENE_WIDTH, SCENE_HEIGHT - yTop);
  ctx.fillStyle = dark;
  for (let y = yTop + 14; y < SCENE_HEIGHT; y += 16) {
    ctx.fillRect(0, y, SCENE_WIDTH, 2);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let x = 30; x < SCENE_WIDTH; x += 62) {
    ctx.fillRect(x, yTop, 3, SCENE_HEIGHT - yTop);
  }
}

function drawHarbour(ctx, applied) {
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, '#2c3a67');
  sky.addColorStop(0.55, '#c96f4a');
  sky.addColorStop(1, '#f7c873');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_WIDTH, 250);
  ctx.fillStyle = '#ffd97a';
  ctx.beginPath();
  ctx.arc(432, 158, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,217,122,0.25)';
  ctx.beginPath();
  ctx.arc(432, 158, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,235,200,0.85)';
  ellipse(ctx, 120, 70, 52, 14);
  ellipse(ctx, 300, 46, 64, 16);
  ellipse(ctx, 200, 110, 44, 12);
  gull(ctx, 96, 120, 1, '#2c2c34');
  gull(ctx, 210, 92, 0.8, '#2c2c34');
  if (applied.has('gull')) gull(ctx, 150, 80, 1, '#2c2c34');
  const sea = ctx.createLinearGradient(0, 250, 0, SCENE_HEIGHT);
  sea.addColorStop(0, '#3d6a8c');
  sea.addColorStop(1, '#16324f');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 250, SCENE_WIDTH, 170);
  waveLines(ctx, 268, 400, 'rgba(255,255,255,0.25)');
  ctx.fillStyle = '#1d2f45';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(0, 210);
  ctx.lineTo(90, 228);
  ctx.lineTo(150, 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a5a3b';
  ctx.fillRect(180, 210, 120, 40);
  ctx.fillStyle = '#6e4527';
  ctx.beginPath();
  ctx.moveTo(170, 212);
  ctx.lineTo(240, 176);
  ctx.lineTo(310, 212);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = applied.has('window') ? '#ffd76a' : '#2c2c34';
  ctx.fillRect(288, 228, 18, 18);
  if (applied.has('window')) {
    ctx.fillStyle = 'rgba(255,215,106,0.3)';
    ellipse(ctx, 297, 237, 26, 22);
  }
  ctx.fillStyle = '#5d3a24';
  ctx.fillRect(330, 262, 10, 26);
  plankPier(ctx, 300, '#7a5233', '#5d3a24');
  ctx.fillStyle = '#f2ede4';
  ctx.beginPath();
  ctx.moveTo(452, 300);
  ctx.lineTo(460, 120);
  ctx.lineTo(488, 120);
  ctx.lineTo(496, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(456, 168, 36, 16);
  ctx.fillRect(453, 232, 42, 16);
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(456, 104, 36, 16);
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(474, 96, 9, 0, Math.PI * 2);
  ctx.fill();
  if (applied.has('beam')) {
    ctx.fillStyle = 'rgba(255,223,120,0.35)';
    ctx.beginPath();
    ctx.moveTo(474, 96);
    ctx.lineTo(300, 40);
    ctx.lineTo(300, 130);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,223,120,0.5)';
    ctx.beginPath();
    ctx.arc(474, 96, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f2ede4';
  ctx.fillRect(448, 118, 52, 6);
  ctx.fillStyle = '#a34d2d';
  ctx.beginPath();
  ctx.moveTo(336, 296);
  ctx.lineTo(404, 296);
  ctx.lineTo(392, 276);
  ctx.lineTo(348, 276);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a3a20';
  ctx.fillRect(336, 292, 68, 5);
  ctx.fillStyle = '#5d3a24';
  ctx.fillRect(368, 232, 4, 46);
  ctx.fillStyle = '#f2ede4';
  ctx.beginPath();
  ctx.moveTo(368, 236);
  ctx.lineTo(368, 274);
  ctx.lineTo(342, 274);
  ctx.closePath();
  ctx.fill();
  if (applied.has('flag')) {
    ctx.fillStyle = '#f2c078';
    ctx.fillRect(370, 236, 24, 16);
  } else {
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(372, 238);
    ctx.lineTo(392, 244);
    ctx.lineTo(372, 250);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#3d6a8c';
  ellipse(ctx, 372, 296, 34, 8);
  if (!applied.has('crate')) {
    ctx.fillStyle = '#b98a4a';
    ctx.fillRect(72, 326, 46, 26);
    ctx.fillStyle = '#8a6a35';
    ctx.fillRect(72, 326, 46, 4);
    ctx.fillRect(72, 348, 46, 4);
    ctx.fillStyle = '#b98a4a';
    ctx.fillRect(84, 300, 34, 26);
  } else {
    ctx.fillStyle = '#7a5233';
    ctx.fillRect(70, 298, 50, 56);
  }
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(30, 306, 6, 44);
  ctx.fillRect(200, 306, 6, 44);
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(33, 302, 8, 0, Math.PI * 2);
  ctx.arc(203, 302, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('HARBOUR', 14, 20);
}

function drawMarket(ctx, applied) {
  ctx.fillStyle = '#101736';
  ctx.fillRect(0, 0, SCENE_WIDTH, 300);
  ctx.fillStyle = '#f4ead2';
  for (const [sx, sy, sr] of [[60, 40, 1.4], [150, 90, 1], [240, 30, 1.6], [330, 120, 1], [420, 40, 1.2], [60, 170, 1], [520, 130, 1.4], [380, 180, 1]]) {
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f7ead0';
  ctx.beginPath();
  ctx.arc(486, 62, 26, 0, Math.PI * 2);
  ctx.fill();
  if (applied.has('moon')) {
    ctx.fillStyle = '#101736';
    ctx.beginPath();
    ctx.arc(496, 56, 24, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f7ead0';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('NIGHT MARKET', 14, 20);
  plankPier(ctx, 300, '#6b4a2c', '#4e3319');
  for (const [sx, awn, goods] of [[40, '#c0392b', 'fish'], [210, '#2e7d4f', 'fruit'], [390, '#2b5f8a', 'lanterns']]) {
    ctx.fillStyle = '#8a6a35';
    ctx.fillRect(sx, 150, 130, 150);
    ctx.fillStyle = '#5d3a24';
    ctx.fillRect(sx, 150, 130, 10);
    ctx.fillStyle = awn;
    ctx.beginPath();
    ctx.moveTo(sx - 8, 150);
    ctx.lineTo(sx + 138, 150);
    ctx.lineTo(sx + 122, 112);
    ctx.lineTo(sx + 8, 112);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(sx + 8 + i * 32, 112, 14, 38);
    }
    if (goods === 'fish') {
      ctx.fillStyle = '#9fb6c9';
      for (const [fx, fy] of [[sx + 18, 176], [sx + 52, 176], [sx + 86, 176]]) {
        ellipse(ctx, fx, fy, 14, 7);
      }
      ctx.fillStyle = '#2c2c34';
      ctx.fillRect(sx + 14, 196, 100, 34);
      ctx.fillStyle = '#f7ead0';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(applied.has('sign') ? 'FISH 9' : 'FISH 5', sx + 30, 218);
    }
    if (goods === 'fruit') {
      ctx.fillStyle = '#e07840';
      for (const [fx, fy] of [[sx + 24, 176], [sx + 48, 176], [sx + 72, 176], [sx + 96, 176]]) {
        ctx.beginPath();
        ctx.arc(fx, fy, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#7fb069';
      for (const [fx, fy] of [[sx + 36, 196], [sx + 60, 196], [sx + 84, 196]]) {
        ctx.beginPath();
        ctx.arc(fx, fy, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (goods === 'lanterns') {
      ctx.fillStyle = applied.has('lantern') ? '#4fc3c3' : '#ff9d3c';
      ctx.beginPath();
      ctx.arc(sx + 65, 176, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff9d3c';
      ctx.beginPath();
      ctx.arc(sx + 30, 176, 11, 0, Math.PI * 2);
      ctx.arc(sx + 100, 176, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9fb6c9';
      for (const [fx, fy] of [[sx + 30, 206], [sx + 65, 206], [sx + 100, 206]]) {
        ellipse(ctx, fx, fy, 12, 6);
      }
      if (applied.has('basket')) {
        ctx.fillStyle = '#9fb6c9';
        ellipse(ctx, sx + 65, 232, 16, 8);
        ctx.fillStyle = '#8a6a35';
        ctx.fillRect(sx + 45, 232, 40, 8);
      }
    }
  }
  if (applied.has('awning')) {
    ctx.fillStyle = '#f2c531';
    ctx.fillRect(226, 112, 16, 38);
    ctx.fillRect(290, 112, 16, 38);
  }
  ctx.strokeStyle = '#3a2c1c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 60);
  ctx.quadraticCurveTo(280, 100, 540, 58);
  ctx.stroke();
  const bulbs = [[80, 68], [160, 80], [240, 86], [336, 74], [420, 70], [500, 62]];
  for (const [bx, by] of bulbs) {
    const out = applied.has('bulb') && bx === 336;
    ctx.fillStyle = out ? '#3a3a44' : '#ffd76a';
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
    if (!out) {
      ctx.fillStyle = 'rgba(255,215,106,0.25)';
      ctx.beginPath();
      ctx.arc(bx, by, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (applied.has('cat')) {
    ctx.fillStyle = '#2c2c34';
    ellipse(ctx, 132, 362, 18, 12);
    ctx.beginPath();
    ctx.arc(132, 342, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(124, 334);
    ctx.lineTo(128, 324);
    ctx.lineTo(132, 334);
    ctx.moveTo(136, 334);
    ctx.lineTo(140, 324);
    ctx.lineTo(144, 334);
    ctx.fill();
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(148, 366);
    ctx.quadraticCurveTo(162, 360, 158, 344);
    ctx.stroke();
  }
}

function drawCottage(ctx, applied) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#7ec8e3');
  sky.addColorStop(1, '#e8f6ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_WIDTH, 260);
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(496, 56, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ellipse(ctx, 110, 60, 48, 13);
  ellipse(ctx, 300, 44, 56, 14);
  ellipse(ctx, 420, 100, 40, 11);
  ctx.fillStyle = '#79b264';
  ctx.fillRect(0, 260, SCENE_WIDTH, 160);
  ctx.fillStyle = '#5d9b4a';
  ellipse(ctx, 90, 300, 120, 26);
  ellipse(ctx, 470, 310, 110, 24);
  ctx.fillStyle = '#f7ead0';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText("KEEPER'S COTTAGE", 14, 20);
  ctx.fillStyle = '#8a6a35';
  ctx.fillRect(40, 220, 44, 60);
  ctx.fillStyle = '#6e4527';
  ctx.beginPath();
  ctx.moveTo(34, 222);
  ctx.lineTo(62, 196);
  ctx.lineTo(90, 222);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2c1c';
  ctx.fillRect(56, 246, 12, 34);
  if (!applied.has('bucket')) {
    ctx.strokeStyle = '#3a2c1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(62, 246);
    ctx.lineTo(62, 236);
    ctx.stroke();
    ctx.fillStyle = '#8a6a35';
    ctx.fillRect(56, 232, 12, 8);
  }
  ctx.fillStyle = '#f2ede4';
  ctx.fillRect(200, 170, 160, 110);
  ctx.fillStyle = '#b0563a';
  ctx.beginPath();
  ctx.moveTo(188, 172);
  ctx.lineTo(280, 108);
  ctx.lineTo(372, 172);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a6a35';
  ctx.fillRect(330, 96, 22, 52);
  if (applied.has('smoke')) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ellipse(ctx, 344, 78, 12, 9);
    ellipse(ctx, 352, 60, 15, 10);
    ellipse(ctx, 340, 42, 11, 8);
  }
  if (applied.has('roofcat')) {
    ctx.fillStyle = '#2c2c34';
    ellipse(ctx, 262, 132, 16, 10);
    ctx.beginPath();
    ctx.arc(248, 122, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(242, 116);
    ctx.lineTo(245, 107);
    ctx.lineTo(248, 116);
    ctx.fill();
  }
  ctx.fillStyle = '#5d9b4a';
  ctx.fillRect(212, 220, 44, 50);
  ctx.fillStyle = applied.has('curtain') ? '#f2ede4' : '#7ec8e3';
  ctx.fillRect(218, 226, 32, 38);
  ctx.fillStyle = '#5d9b4a';
  ctx.fillRect(218, 226, 32, 4);
  ctx.fillRect(218, 260, 32, 4);
  ctx.fillRect(218, 226, 4, 38);
  ctx.fillRect(246, 226, 4, 38);
  if (applied.has('curtain')) {
    ctx.fillStyle = '#c96f4a';
    ctx.fillRect(220, 228, 6, 34);
    ctx.fillRect(242, 228, 6, 34);
  }
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(272, 232, 30, 48);
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(298, 256, 3, 0, Math.PI * 2);
  ctx.fill();
  if (applied.has('wreath')) {
    ctx.strokeStyle = '#2e7d4f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(287, 250, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(287, 239, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#8a6a35';
  ctx.fillRect(316, 232, 44, 50);
  ctx.fillStyle = '#7ec8e3';
  ctx.fillRect(322, 238, 32, 38);
  ctx.strokeStyle = '#3a2c1c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(400, 160);
  ctx.lineTo(400, 210);
  ctx.moveTo(470, 160);
  ctx.lineTo(470, 210);
  ctx.stroke();
  ctx.strokeStyle = '#5d3a24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(400, 168);
  ctx.lineTo(470, 168);
  ctx.stroke();
  if (!applied.has('shirt')) {
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(416, 168, 22, 26);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(416, 168, 22, 4);
  }
  ctx.fillStyle = '#e8b4b8';
  for (const [rx, ry] of [[88, 326], [104, 336], [76, 340]]) {
    ctx.beginPath();
    ctx.arc(rx, ry, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  if (applied.has('rose')) {
    ctx.fillStyle = '#e75480';
    ctx.beginPath();
    ctx.arc(96, 318, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#2e7d4f';
  ellipse(ctx, 92, 348, 26, 8);
  ctx.fillStyle = '#8a6a35';
  ctx.fillRect(150, 300, 4, 34);
  ctx.fillRect(176, 300, 4, 34);
  ctx.fillRect(202, 300, 4, 34);
  ctx.fillRect(146, 306, 64, 4);
  ctx.fillRect(146, 322, 64, 4);
  if (applied.has('picket')) {
    ctx.fillStyle = '#e8e2d2';
    ctx.fillRect(158, 298, 6, 36);
  }
  ctx.fillStyle = '#d9c9a3';
  for (const [px, py] of [[272, 296], [282, 330], [292, 362]]) {
    ellipse(ctx, px, py, 14, 7);
  }
  if (!applied.has('stone')) {
    ctx.fillStyle = '#d9c9a3';
    ellipse(ctx, 300, 386, 14, 7);
  }
  ctx.fillStyle = '#6e4527';
  ctx.fillRect(480, 300, 5, 40);
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(482, 292, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7a4a2b';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ellipse(ctx, 482 + Math.cos(a) * 17, 292 + Math.sin(a) * 17, 5, 5);
  }
  if (applied.has('sunflower')) {
    ctx.fillStyle = '#6e4527';
    ctx.fillRect(510, 306, 5, 34);
    ctx.fillStyle = '#ffd76a';
    ctx.beginPath();
    ctx.arc(512, 298, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7a4a2b';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ellipse(ctx, 512 + Math.cos(a) * 14, 298 + Math.sin(a) * 14, 4, 4);
    }
  }
}

export function drawScene(ctx, sceneIndex, applied) {
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  if (sceneIndex === 0) drawHarbour(ctx, applied);
  else if (sceneIndex === 1) drawMarket(ctx, applied);
  else drawCottage(ctx, applied);
}

export function drawFoundMarker(ctx, diff, pulse) {
  const r = diff.r + 4 + (pulse ? Math.sin(pulse * 6) * 2 : 0);
  ctx.strokeStyle = '#ffd76a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2e7d4f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r + 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#2e7d4f';
  ctx.beginPath();
  ctx.arc(diff.x + diff.r * 0.55, diff.y - diff.r * 0.55, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(diff.x + diff.r * 0.55 - 5, diff.y - diff.r * 0.55);
  ctx.lineTo(diff.x + diff.r * 0.55 - 1, diff.y - diff.r * 0.55 + 4);
  ctx.lineTo(diff.x + diff.r * 0.55 + 5, diff.y - diff.r * 0.55 - 4);
  ctx.stroke();
}

export function drawHintPulse(ctx, diff, time) {
  const r = diff.r + 6 + Math.sin(time * 4) * 5;
  ctx.strokeStyle = 'rgba(255,215,106,0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
}
