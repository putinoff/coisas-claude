/* =========================================================
   EFEITOS COMPARTILHADOS — partículas discretas e sons
   (Web Audio, nenhum arquivo externo)
   ========================================================= */

export const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- partículas ---------- */
const CORES = ['#e6cf9e', '#c6a46a', '#f0c9d3', '#d48ba0'];

// pequena explosão de brilhos no ponto tocado
export function explodir(x, y, qtd = 6) {
  if (reduzido) return;
  for (let i = 0; i < qtd; i++) {
    const p = document.createElement('span');
    p.className = 'particula';
    p.textContent = Math.random() < 0.65 ? '✦' : '♥';
    const ang = Math.random() * Math.PI * 2;
    const dist = 36 + Math.random() * 54;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.color = CORES[i % CORES.length];
    p.style.fontSize = (8 + Math.random() * 9) + 'px';
    p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(ang) * dist - 20 + 'px');
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

// chuva leve de brilhos dourados e corações (momentos especiais)
export function chuva(qtd = 36) {
  if (reduzido) return;
  for (let i = 0; i < qtd; i++) {
    setTimeout(() => {
      const c = document.createElement('span');
      c.className = 'chuva';
      c.textContent = Math.random() < 0.6 ? '✦' : '♥';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.color = CORES[Math.floor(Math.random() * CORES.length)];
      c.style.fontSize = (9 + Math.random() * 14) + 'px';
      c.style.setProperty('--deriva', (Math.random() - 0.5) * 120 + 'px');
      c.style.animationDuration = (4 + Math.random() * 3) + 's';
      document.body.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }, i * 90);
  }
}

// onda de toque dentro de um elemento (feedback visual)
export function onda(el, x, y) {
  if (reduzido) return;
  const r = el.getBoundingClientRect();
  const o = document.createElement('span');
  o.className = 'onda';
  o.style.left = (x ?? r.left + r.width / 2) - r.left + 'px';
  o.style.top = (y ?? r.top + r.height / 2) - r.top + 'px';
  el.appendChild(o);
  o.addEventListener('animationend', () => o.remove());
}

// reinicia uma animação CSS (remove e recoloca a classe)
export function reanimar(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

/* ---------- som ---------- */
let ctx = null;
let ligado = true;
try { ligado = localStorage.getItem('mariana-som') !== 'off'; } catch (_) {}

export const som = {
  get ligado() { return ligado; },
  alternar() {
    ligado = !ligado;
    try { localStorage.setItem('mariana-som', ligado ? 'on' : 'off'); } catch (_) {}
    if (ctx) ligado ? ctx.resume() : ctx.suspend();
    return ligado;
  },
};

export function audio() {
  if (!ligado) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ronco de motor: curva = [[tempo, hz], ...]
export function motor(curva, duracao, volume = 0.16) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const o1 = a.createOscillator(), o2 = a.createOscillator();
  const f = a.createBiquadFilter(), g = a.createGain();
  o1.type = 'sawtooth'; o2.type = 'square';
  curva.forEach(([tempo, hz], i) => {
    const m = i === 0 ? 'setValueAtTime' : 'exponentialRampToValueAtTime';
    o1.frequency[m](hz, t + tempo);
    o2.frequency[m](hz / 2, t + tempo);
  });
  f.type = 'lowpass'; f.frequency.value = 520; f.Q.value = 4;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.12);
  g.gain.setValueAtTime(volume, t + duracao - 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  o1.connect(f); o2.connect(f); f.connect(g); g.connect(a.destination);
  o1.start(t); o2.start(t); o1.stop(t + duracao + 0.05); o2.stop(t + duracao + 0.05);
}

export function somBuzina() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  [[0, 0.16], [0.22, 0.5]].forEach(([ini, fim]) => {
    [392, 494].forEach(hz => {
      const o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
      o.type = 'square'; o.frequency.value = hz;
      f.type = 'lowpass'; f.frequency.value = 2200;
      g.gain.setValueAtTime(0.0001, t + ini);
      g.gain.exponentialRampToValueAtTime(0.06, t + ini + 0.02);
      g.gain.setValueAtTime(0.06, t + fim - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + fim);
      o.connect(f); f.connect(g); g.connect(a.destination);
      o.start(t + ini); o.stop(t + fim + 0.02);
    });
  });
}

// sininho de três notas
export function somSino() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  [1046, 1318, 1568].forEach((hz, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = hz;
    const ini = t + i * 0.09;
    g.gain.setValueAtTime(0.0001, ini);
    g.gain.exponentialRampToValueAtTime(0.07, ini + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ini + 0.6);
    o.connect(g); g.connect(a.destination);
    o.start(ini); o.stop(ini + 0.65);
  });
}

// uma nota suave (escala para as estrelas e a Kitty)
const NOTAS = [523, 587, 659, 784, 880, 988, 1046, 1175, 1318, 1568];
export function somNota(i, tipo = 'triangle', volume = 0.1) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator(), g = a.createGain();
  o.type = tipo; o.frequency.value = NOTAS[i % NOTAS.length];
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t + 1.5);
}

// batida de coração (duas pancadas graves)
export function somBatida() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  [0, 0.14].forEach((d, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(i ? 70 : 85, t + d);
    o.frequency.exponentialRampToValueAtTime(40, t + d + 0.15);
    g.gain.setValueAtTime(0.0001, t + d);
    g.gain.exponentialRampToValueAtTime(0.35, t + d + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.18);
    o.connect(g); g.connect(a.destination);
    o.start(t + d); o.stop(t + d + 0.2);
  });
}
