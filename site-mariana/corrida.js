/* =========================================================
   CORRIDA — a Hello Kitty dirige até o coração dele
   (abre quando ela aceita ser a co-piloto)
   ========================================================= */
import { CORRIDA } from './conteudo.js?v=6';
import { reduzido, explodir, chuva, motor, somNota, somSino, somBatida } from './efeitos.js';

const $ = id => document.getElementById(id);
const el = $('corrida');
const canvas = $('corridaCanvas');
const g = canvas.getContext('2d');
const elCoracoes = $('corridaCoracoes');
const elRota = $('corridaRota');
const elPlaca = $('corridaPlaca');
const elInicio = $('corridaInicio');
const elFim = $('corridaFim');

const TAU = Math.PI * 2;
const DURACAO = 42;      // segundos de estrada sem bater em nada
const PISTA_TELAS = 34;  // comprimento da estrada, em alturas de tela
const ROSA = '#d9849f', ROSA_CLARO = '#f0c9d3', OURO = '#c6a46a', OURO_CLARO = '#e6cf9e';
const CORES_TRAFEGO = [['#2b2b33', '#4a4a55'], ['#cfc8bd', '#f3eee6'], ['#1b2747', '#34497a'], ['#5d1f2c', '#8f3446']];

/* ---------- desenhos ---------- */
// a mesma Kitty do site (viewBox 300×260)
const KITTY = {
  orelhas: ['M64 96 L54 22 Q56 10 68 16 L130 54 Z', 'M236 96 L246 22 Q244 10 232 16 L170 54 Z'].map(d => new Path2D(d)),
  laco: ['M210 54 Q172 10 180 60 Q174 104 212 72 Z', 'M232 62 Q274 22 276 68 Q284 110 236 86 Z'].map(d => new Path2D(d)),
  bigodes: [[12, 142, 58, 150], [8, 170, 56, 170], [14, 198, 58, 188], [288, 142, 242, 150], [292, 170, 244, 170], [286, 198, 242, 188]],
};
function elipse(x, cx, cy, rx, ry) { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, TAU); }
function desenharKitty(x) {
  x.lineJoin = 'round'; x.lineCap = 'round';
  x.strokeStyle = '#1d1a1c'; x.fillStyle = '#fff'; x.lineWidth = 6;
  KITTY.orelhas.forEach(p => { x.fill(p); x.stroke(p); });
  elipse(x, 150, 142, 126, 96); x.fill(); x.stroke();
  x.fillStyle = '#f4a6bb';
  [80, 220].forEach(cx => { elipse(x, cx, 180, 17, 9); x.fill(); });
  x.fillStyle = '#1d1a1c';
  [101, 199].forEach(cx => { elipse(x, cx, 150, 10, 14); x.fill(); });
  x.fillStyle = '#f5c518'; x.lineWidth = 4.5;
  elipse(x, 150, 174, 13, 9); x.fill(); x.stroke();
  x.lineWidth = 5; x.beginPath();
  KITTY.bigodes.forEach(([a, b, c, d]) => { x.moveTo(a, b); x.lineTo(c, d); });
  x.stroke();
  x.fillStyle = '#d63b6b';
  KITTY.laco.forEach(p => { x.fill(p); x.stroke(p); });
  x.beginPath(); x.arc(222, 70, 16, 0, TAU); x.fill(); x.stroke();
}

// carro visto de cima, apontando para cima, em unidades 100×180
function desenharCarro(x, [escura, clara], comKitty) {
  x.fillStyle = '#121013';
  [[0, 30], [88, 30], [0, 124], [88, 124]].forEach(([px, py]) => { x.beginPath(); x.roundRect(px, py, 12, 32, 4); x.fill(); });
  const lata = x.createLinearGradient(8, 0, 92, 0);
  lata.addColorStop(0, escura); lata.addColorStop(0.5, clara); lata.addColorStop(1, escura);
  x.fillStyle = lata;
  x.beginPath(); x.roundRect(8, 4, 84, 172, [36, 36, 24, 24]); x.fill();
  x.fillStyle = 'rgba(255, 255, 255, .16)';
  elipse(x, 50, 32, 26, 20); x.fill();
  x.fillStyle = escura; // retrovisores
  elipse(x, 6, 74, 6, 4); x.fill(); elipse(x, 94, 74, 6, 4); x.fill();
  x.fillStyle = '#fff4d6';
  elipse(x, 25, 13, 9, 4.5); x.fill(); elipse(x, 75, 13, 9, 4.5); x.fill();
  x.fillStyle = '#ff2f55';
  x.beginPath(); x.roundRect(15, 168, 22, 5, 2); x.roundRect(63, 168, 22, 5, 2); x.fill();
  const vidro = x.createLinearGradient(0, 62, 0, 86);
  vidro.addColorStop(0, '#4a3a4c'); vidro.addColorStop(1, '#1d1620');
  x.fillStyle = vidro;
  x.beginPath(); x.moveTo(17, 64); x.lineTo(83, 64); x.lineTo(77, 86); x.lineTo(23, 86); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(255, 255, 255, .35)'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(28, 69); x.lineTo(40, 69); x.stroke();
  if (comKitty) {
    x.fillStyle = OURO; // faixas douradas no capô
    x.fillRect(42, 6, 5, 56); x.fillRect(53, 6, 5, 56);
    x.fillStyle = '#2a1c23'; // cockpit aberto (conversível)
    x.beginPath(); x.roundRect(20, 86, 60, 64, 16); x.fill();
    const s = 92 / 300;
    x.save();
    x.translate(50 - 150 * s, 118 - 142 * s);
    x.scale(s, s);
    desenharKitty(x);
    x.restore();
  } else {
    x.fillStyle = escura; // teto fechado
    x.beginPath(); x.roundRect(22, 86, 56, 52, 12); x.fill();
    x.fillStyle = vidro;
    x.beginPath(); x.moveTo(25, 140); x.lineTo(75, 140); x.lineTo(71, 154); x.lineTo(29, 154); x.closePath(); x.fill();
  }
}

function sprite(w, h, desenho) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
  const x = c.getContext('2d');
  x.scale(c.width / 100, c.height / 180);
  desenho(x);
  return c;
}

function caminhoCoracao(x, cx, cy, s) {
  x.beginPath();
  x.moveTo(cx, cy + s * 0.5);
  x.bezierCurveTo(cx - s * 0.65, cy + s * 0.05, cx - s * 0.55, cy - s * 0.55, cx, cy - s * 0.22);
  x.bezierCurveTo(cx + s * 0.55, cy - s * 0.55, cx + s * 0.65, cy + s * 0.05, cx, cy + s * 0.5);
  x.closePath();
}
function caminhoEstrela(x, cx, cy, r) {
  x.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  x.closePath();
}
// número pseudoaleatório fixo para cada posição da estrada (enfeites não "pulam")
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

/* ---------- medidas ---------- */
let W, H, dpr, pistaW, faixaW, centro, u, carroW, carroH, carroY, distPx;
let spriteKitty, spritesTrafego;
function medir() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  pistaW = Math.min(W * 0.76, 460);
  faixaW = pistaW / 3;
  centro = W / 2;
  carroW = u = Math.min(faixaW * 0.62, H * 0.1);
  carroH = carroW * 1.8;
  carroY = H * 0.74;
  distPx = H * PISTA_TELAS;
  spriteKitty = sprite(carroW, carroH, x => desenharCarro(x, ['#c96f8c', '#f6bccb'], true));
  spritesTrafego = CORES_TRAFEGO.map(c => sprite(carroW, carroH, x => desenharCarro(x, c, false)));
  if (estado !== 'fechado') carroX = xFaixa(faixa);
}
const xFaixa = f => centro + (f - 1) * faixaW;
const yDe = p => carroY - (p - prog) * distPx;

/* ---------- estado ---------- */
let estado = 'fechado', raf = 0, ultimo = 0, focoAntes = null;
let prog, partida, rolado, faixa, carroX, inclina, objetos, particulas, textos, proxFileira;
let coracoes, sustos, lento, turbo, invencivel, tremor, placaIdx, chegada, fumaca, balao;

function zerar() {
  prog = 0; partida = 0; rolado = rolado || 0; faixa = 1; carroX = xFaixa(1); inclina = 0;
  objetos = []; particulas = []; textos = []; proxFileira = 0.02;
  coracoes = 0; sustos = 0; lento = 0; turbo = 0; invencivel = 0; tremor = 0;
  placaIdx = 0; chegada = 0; fumaca = 0; balao = null;
  elCoracoes.textContent = '0';
  elRota.style.setProperty('--p', 0);
}

/* ---------- objetos da estrada ---------- */
const TAM = { coracao: [0.5, 0.5], estrela: [0.55, 0.55], cone: [0.42, 0.5], poca: [0.85, 0.42], carro: [1, 1.8] };
function novo(tipo, f, p) {
  const [w, h] = TAM[tipo];
  objetos.push({ tipo, faixa: f, p, w, h, fase: Math.random() * TAU, cor: Math.floor(Math.random() * CORES_TRAFEGO.length) });
}
function gerarFileira() {
  const p = prog + (carroY + carroH) / distPx;
  const faixas = [0, 1, 2].sort(() => Math.random() - 0.5);
  // um carro devagar ocupa a faixa dele por um tempo: nunca fecha as três
  const lerdo = objetos.find(o => o.tipo === 'carro' && !o.foi && yDe(o.p) < H);
  const bloqueadas = lerdo ? [lerdo.faixa] : [];
  const livres = faixas.filter(f => !bloqueadas.includes(f));
  const nObst = prog < 0.12 || lerdo ? 1 : Math.random() < 0.45 ? 2 : 1;
  livres.splice(0, nObst).forEach(f => {
    const r = Math.random();
    novo(!lerdo && prog > 0.2 && r < 0.28 ? 'carro' : r < 0.62 ? 'cone' : 'poca', f, p);
  });
  if (livres.length) {
    const f = livres[Math.floor(Math.random() * livres.length)];
    if (Math.random() < 0.12 && prog > 0.1) novo('estrela', f, p);
    else if (Math.random() < 0.8) for (let k = 0; k < 3; k++) novo('coracao', f, p + k * carroH * 0.75 / distPx);
  }
  proxFileira = prog + H * (0.78 - prog * 0.22 + Math.random() * 0.22) / distPx;
}

function bater(o) {
  o.foi = true;
  if (invencivel > 0 || turbo > 0) { o.voando = { vx: (o.faixa - faixa || (Math.random() < 0.5 ? -1 : 1)) * 520, vr: 9 }; return; }
  sustos++;
  lento = o.tipo === 'poca' ? 0.6 : 1;
  invencivel = 1.3;
  tremor = reduzido ? 0 : 0.35;
  if (o.tipo !== 'poca') o.voando = { vx: (Math.random() < 0.5 ? -1 : 1) * 420, vr: 8 };
  balao = { txt: o.tipo === 'poca' ? 'Splash!' : CORRIDA.sustos[sustos % CORRIDA.sustos.length], vida: 1.6 };
  for (let i = 0; i < 12; i++) faisca(carroX, carroY - carroH * 0.4, o.tipo === 'poca' ? '#9fb7d6' : OURO_CLARO, 'brilho');
  somBatida();
  navigator.vibrate?.(60);
}
function pegar(o) {
  o.foi = o.pego = true;
  const x = xFaixa(o.faixa), y = yDe(o.p);
  if (o.tipo === 'estrela') {
    turbo = 2.6;
    textos.push({ txt: 'Turbo!', x, y, vida: 1, cor: OURO_CLARO });
    for (let i = 0; i < 16; i++) faisca(x, y, OURO_CLARO, 'brilho');
    somSino();
    return;
  }
  coracoes++;
  elCoracoes.textContent = coracoes;
  textos.push({ txt: '+1', x, y, vida: 1, cor: ROSA_CLARO });
  for (let i = 0; i < 7; i++) faisca(x, y, i % 2 ? ROSA : ROSA_CLARO, 'coracao');
  somNota(coracoes % 10, 'sine', 0.07);
}
function faisca(x, y, cor, tipo) {
  if (reduzido && particulas.length > 20) return;
  const a = Math.random() * TAU, v = 60 + Math.random() * 180;
  particulas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0.6 + Math.random() * 0.5, cor, tipo, s: u * (0.08 + Math.random() * 0.1) });
}

/* ---------- controles ---------- */
function virar(lado) {
  if (estado !== 'correndo') return;
  faixa = Math.max(0, Math.min(2, faixa + lado));
}
canvas.addEventListener('pointerdown', e => { e.preventDefault(); virar(e.clientX < carroX ? -1 : 1); });
addEventListener('keydown', e => {
  if (estado === 'fechado') return;
  if (e.key === 'Escape') { fechar(); return; }
  if (/^(ArrowLeft|a|A)$/.test(e.key)) { e.preventDefault(); virar(-1); }
  if (/^(ArrowRight|d|D)$/.test(e.key)) { e.preventDefault(); virar(1); }
});
addEventListener('resize', () => { if (estado !== 'fechado') medir(); });

/* ---------- abrir, jogar, chegar ---------- */
export function abrirCorrida() {
  if (estado !== 'fechado') return;
  focoAntes = document.activeElement;
  el.hidden = false;
  document.documentElement.classList.add('travado');
  estado = 'inicio';
  medir();
  zerar();
  elInicio.hidden = false;
  elFim.hidden = true;
  $('corridaPartir').focus({ preventScroll: true });
  ultimo = performance.now();
  raf = requestAnimationFrame(quadro);
}
function partir() {
  zerar();
  estado = 'correndo';
  elInicio.hidden = elFim.hidden = true;
  canvas.focus({ preventScroll: true });
  motor([[0, 30], [0.35, 38], [0.6, 140], [1.0, 90], [2.2, 70]], 2.4, 0.12);
}
function fechar() {
  estado = 'fechado';
  cancelAnimationFrame(raf);
  el.hidden = true;
  elPlaca.classList.remove('mostrar');
  document.documentElement.classList.remove('travado');
  document.dispatchEvent(new CustomEvent('corrida:fechou'));
  focoAntes?.focus?.({ preventScroll: true });
}
function mostrarPlaca(i) {
  elPlaca.innerHTML = `<small>Km ${i + 1}</small>${CORRIDA.placas[i]}`;
  elPlaca.classList.remove('mostrar'); void elPlaca.offsetWidth; elPlaca.classList.add('mostrar');
}
function terminar() {
  estado = 'fim';
  $('corridaChegada').textContent = CORRIDA.chegada;
  $('corridaChegadaSub').textContent = CORRIDA.chegadaSub;
  $('corridaStats').textContent = `${coracoes} ${coracoes === 1 ? 'coração coletado' : 'corações coletados'} no caminho`;
  elFim.hidden = false;
  $('corridaDeNovo').focus({ preventScroll: true });
  chuva(60);
  explodir(W / 2, H / 2, 14);
  somSino();
}
$('corridaPartir').addEventListener('click', partir);
$('corridaDeNovo').addEventListener('click', partir);
$('corridaSair').addEventListener('click', fechar);
$('corridaFechar').addEventListener('click', fechar);
$('corridaConvite').textContent = CORRIDA.convite;

/* ---------- loop ---------- */
function atualizar(dt) {
  const correndo = estado === 'correndo';
  if (correndo) {
    partida = Math.min(1, partida + dt / 1.4);
    lento = Math.max(0, lento - dt / 1.6);
    turbo = Math.max(0, turbo - dt);
    invencivel = Math.max(0, invencivel - dt);
    const vel = partida * (1 - 0.6 * lento) * (turbo > 0 ? 1.55 : 1) / DURACAO;
    prog = Math.min(1, prog + vel * dt);
    rolado += vel * dt * distPx;

    if (prog >= proxFileira && prog < 0.93) gerarFileira();
    while (placaIdx < CORRIDA.placas.length && prog >= 0.03 + placaIdx * (0.9 / CORRIDA.placas.length)) mostrarPlaca(placaIdx++);
    elRota.style.setProperty('--p', prog.toFixed(4));
    if (prog >= 1) { estado = 'chegando'; chegada = 0; faixa = 1; }

    // fumacinha de corações saindo do escapamento
    fumaca -= dt;
    if (fumaca <= 0 && !reduzido) {
      fumaca = turbo > 0 ? 0.03 : 0.09;
      particulas.push({ x: carroX + (Math.random() - 0.5) * carroW * 0.4, y: carroY + carroH * 0.5, vx: (Math.random() - 0.5) * 30, vy: 90 + vel * distPx * 0.6, vida: 0.7, cor: turbo > 0 ? OURO_CLARO : ROSA_CLARO, tipo: 'coracao', s: u * 0.09 });
    }
  } else if (estado === 'chegando') {
    chegada += dt;
    rolado += Math.max(0, 1 - chegada) * distPx / DURACAO * dt;
    if (chegada > 2.6) terminar();
  } else {
    rolado += H * 0.12 * dt; // estrada andando devagar atrás dos cartões
  }

  carroX += (xFaixa(faixa) - carroX) * Math.min(1, dt * 12);
  inclina = (xFaixa(faixa) - carroX) / faixaW * 0.45;
  tremor = Math.max(0, tremor - dt);

  // carros do trânsito andam (mais devagar que a Kitty)
  objetos.forEach(o => {
    if (o.tipo === 'carro' && !o.voando) o.p += 0.4 / DURACAO * dt;
    if (o.voando) { o.dx = (o.dx || 0) + o.voando.vx * dt; o.rot = (o.rot || 0) + o.voando.vr * dt; o.voando.vx *= 0.97; }
  });
  if (correndo) objetos.forEach(o => {
    if (o.foi) return;
    const dx = Math.abs(xFaixa(o.faixa) - carroX), dy = Math.abs(yDe(o.p) - carroY);
    const coleta = o.tipo === 'coracao' || o.tipo === 'estrela';
    const folga = coleta ? 1 : 0.72;
    if (dx < (carroW + o.w * u) * 0.5 * folga && dy < (carroH + o.h * u) * 0.5 * folga) coleta ? pegar(o) : bater(o);
  });
  objetos = objetos.filter(o => !o.pego && yDe(o.p) < H + carroH * 2);

  particulas.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy = p.vy * 0.96 + (p.tipo === 'coracao' ? 0 : 160 * dt); p.vida -= dt; });
  particulas = particulas.filter(p => p.vida > 0);
  textos.forEach(t => { t.y -= 50 * dt; t.vida -= dt; });
  textos = textos.filter(t => t.vida > 0);
  if (balao) { balao.vida -= dt; if (balao.vida <= 0) balao = null; }
}

function desenharCenario() {
  // fundo: noite com o brilho rosa do destino lá no alto
  g.fillStyle = '#100c0f';
  g.fillRect(0, 0, W, H);
  const ceu = g.createLinearGradient(0, 0, 0, H * 0.5);
  ceu.addColorStop(0, `rgba(212, 139, 160, ${0.18 + prog * 0.25})`);
  ceu.addColorStop(1, 'rgba(212, 139, 160, 0)');
  g.fillStyle = ceu;
  g.fillRect(0, 0, W, H * 0.5);

  const esq = centro - pistaW / 2, dir = centro + pistaW / 2;
  // brilhinhos no acostamento (paralaxe mais lenta)
  const passoB = H * 0.06;
  for (let k = Math.floor((rolado * 0.6 - H) / passoB); k * passoB < rolado * 0.6 + H * 0.3; k++) {
    const y = carroY + rolado * 0.6 - k * passoB;
    const lado = hash(k) < 0.5, x = lado ? hash(k + 7) * (esq - 8) : dir + 8 + hash(k + 7) * (W - dir - 8);
    g.fillStyle = `rgba(230, 207, 158, ${0.15 + hash(k + 3) * 0.35})`;
    g.fillRect(x, y, 1.6, 1.6);
  }

  // asfalto
  const asf = g.createLinearGradient(esq, 0, dir, 0);
  asf.addColorStop(0, '#1c161a'); asf.addColorStop(0.5, '#272026'); asf.addColorStop(1, '#1c161a');
  g.fillStyle = asf;
  g.fillRect(esq, 0, pistaW, H);

  // zebras rosa e marfim nas bordas
  const zebra = H * 0.05, zw = Math.max(4, u * 0.1);
  for (let k = Math.floor((rolado - H) / zebra); k * zebra < rolado + H; k++) {
    const y = carroY + rolado - k * zebra - zebra;
    g.fillStyle = k % 2 ? ROSA : '#efe6dc';
    g.fillRect(esq - zw, y, zw, zebra + 0.5);
    g.fillRect(dir, y, zw, zebra + 0.5);
  }

  // faixas tracejadas douradas
  const traco = H * 0.12;
  g.fillStyle = 'rgba(230, 207, 158, .5)';
  for (let k = Math.floor((rolado - H) / traco); k * traco < rolado + H; k++) {
    const y = carroY + rolado - k * traco - traco * 0.5;
    [-0.5, 0.5].forEach(l => g.fillRect(centro + l * faixaW - 1.5, y, 3, traco * 0.5));
  }

  // postes de luz e arbustos de coração nas laterais
  const passo = H * 0.24, folgaLado = Math.max(0, esq - zw);
  for (let k = Math.floor((rolado - H) / passo); k * passo < rolado + H; k++) {
    const y = carroY + rolado - k * passo;
    const lado = k % 2 ? -1 : 1, r = hash(k);
    const x = lado < 0 ? folgaLado * (0.35 + r * 0.3) : W - folgaLado * (0.35 + r * 0.3);
    if (folgaLado < 18) continue;
    if (r < 0.55) {
      const luz = g.createRadialGradient(x, y, 0, x, y, u * 0.9);
      luz.addColorStop(0, 'rgba(255, 220, 170, .35)'); luz.addColorStop(1, 'rgba(255, 220, 170, 0)');
      g.fillStyle = luz; g.fillRect(x - u, y - u, u * 2, u * 2);
      g.fillStyle = OURO_CLARO; elipse(g, x, y, u * 0.09, u * 0.09); g.fill();
    } else {
      g.fillStyle = r < 0.8 ? '#5e2a3b' : '#3e2a31';
      caminhoCoracao(g, x, y, Math.min(folgaLado * 0.6, u * 0.45)); g.fill();
    }
  }
}

function desenharObjeto(o) {
  const x = xFaixa(o.faixa) + (o.dx || 0), y = yDe(o.p);
  if (y < -carroH * 2) return;
  g.save();
  g.translate(x, y);
  if (o.rot) g.rotate(o.rot);
  const s = u;
  if (o.tipo === 'coracao') {
    const b = Math.sin(performance.now() / 260 + o.fase) * s * 0.05;
    g.shadowColor = ROSA; g.shadowBlur = s * 0.5;
    g.fillStyle = ROSA;
    caminhoCoracao(g, 0, b, s * 0.5); g.fill();
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255, 255, 255, .45)';
    elipse(g, -s * 0.11, b - s * 0.1, s * 0.06, s * 0.04); g.fill();
  } else if (o.tipo === 'estrela') {
    g.rotate(performance.now() / 700);
    g.shadowColor = OURO_CLARO; g.shadowBlur = s * 0.6;
    g.fillStyle = OURO_CLARO;
    caminhoEstrela(g, 0, 0, s * 0.3); g.fill();
  } else if (o.tipo === 'cone') {
    g.fillStyle = 'rgba(0, 0, 0, .35)';
    elipse(g, 0, s * 0.26, s * 0.24, s * 0.08); g.fill();
    g.fillStyle = '#ff7a2f';
    g.beginPath(); g.moveTo(0, -s * 0.28); g.lineTo(s * 0.18, s * 0.22); g.lineTo(-s * 0.18, s * 0.22); g.closePath(); g.fill();
    g.fillStyle = '#fff';
    g.beginPath(); g.moveTo(-s * 0.075, -s * 0.06); g.lineTo(s * 0.075, -s * 0.06); g.lineTo(s * 0.11, s * 0.06); g.lineTo(-s * 0.11, s * 0.06); g.closePath(); g.fill();
    g.fillStyle = '#c4501a';
    g.beginPath(); g.roundRect(-s * 0.23, s * 0.2, s * 0.46, s * 0.08, 2); g.fill();
  } else if (o.tipo === 'poca') {
    g.fillStyle = 'rgba(120, 150, 190, .35)';
    elipse(g, 0, 0, s * 0.42, s * 0.2); g.fill();
    g.fillStyle = 'rgba(200, 220, 255, .25)';
    elipse(g, -s * 0.1, -s * 0.04, s * 0.18, s * 0.06); g.fill();
  } else if (o.tipo === 'carro') {
    g.fillStyle = 'rgba(0, 0, 0, .4)';
    g.beginPath(); g.roundRect(-carroW * 0.48, -carroH * 0.46, carroW * 0.96, carroH * 0.98, carroW * 0.3); g.fill();
    g.drawImage(spritesTrafego[o.cor], -carroW / 2, -carroH / 2, carroW, carroH);
  }
  g.restore();
}

function desenharKittyCarro() {
  // na chegada o carro entra no coração e some
  let y = carroY, escala = 1, alfa = 1;
  if (chegada > 0) {
    const t = Math.min(1, chegada / 1.5), e = t * t;
    y = carroY - e * H * 0.3;
    escala = 1 - e * 0.55;
    alfa = 1 - e;
  }
  if (alfa <= 0) return;
  const tx = tremor > 0 ? (Math.random() - 0.5) * u * 0.12 : 0;
  g.save();
  g.translate(carroX + tx, y);
  g.rotate(inclina);
  g.scale(escala, escala);
  g.globalAlpha = invencivel > 0 && Math.floor(invencivel * 10) % 2 ? 0.55 * alfa : alfa;
  g.fillStyle = 'rgba(0, 0, 0, .45)';
  g.beginPath(); g.roundRect(-carroW * 0.5, -carroH * 0.44, carroW, carroH * 0.98, carroW * 0.32); g.fill();
  if (turbo > 0) { g.shadowColor = OURO_CLARO; g.shadowBlur = u * 0.6; }
  g.drawImage(spriteKitty, -carroW / 2, -carroH / 2, carroW, carroH);
  g.restore();
}

function desenharDestino() {
  // o coração dele, esperando no fim da estrada
  const pCoracao = 1 + H * 0.3 / distPx;
  const y = yDe(pCoracao);
  if (y < -pistaW) return;
  let s = pistaW * 0.78 * (1 + Math.sin(performance.now() / 300) * 0.04), letreiro = 0.92;
  if (chegada > 1.3) { const t = Math.min(1, (chegada - 1.3) / 1.1); s *= 1 + t * t * 14; letreiro *= Math.max(0, 1 - t * 3); }
  g.save();
  g.shadowColor = ROSA; g.shadowBlur = u * 1.5;
  const grad = g.createRadialGradient(centro, y - s * 0.1, s * 0.05, centro, y, s * 0.6);
  grad.addColorStop(0, '#f6bccb'); grad.addColorStop(0.6, ROSA); grad.addColorStop(1, '#a14d66');
  g.fillStyle = grad;
  caminhoCoracao(g, centro, y, s); g.fill();
  g.shadowBlur = 0;
  g.fillStyle = `rgba(250, 246, 240, ${letreiro})`;
  g.font = `${Math.round(s * 0.15)}px "Great Vibes", cursive`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('meu coração', centro, y - s * 0.08);
  g.restore();
}

function desenharEfeitos() {
  particulas.forEach(p => {
    g.globalAlpha = Math.min(1, p.vida * 2);
    g.fillStyle = p.cor;
    if (p.tipo === 'coracao') { caminhoCoracao(g, p.x, p.y, p.s * 2); g.fill(); }
    else g.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
  });
  g.globalAlpha = 1;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  textos.forEach(t => {
    g.globalAlpha = Math.min(1, t.vida * 2);
    g.fillStyle = t.cor;
    g.font = `500 ${Math.round(u * 0.32)}px Inter, sans-serif`;
    g.fillText(t.txt, t.x, t.y);
  });
  g.globalAlpha = 1;
  if (balao) {
    g.font = `500 ${Math.round(Math.max(12, u * 0.24))}px Inter, sans-serif`;
    const w = g.measureText(balao.txt).width + 24, h = Math.max(30, u * 0.5);
    const x = Math.max(8, Math.min(W - w - 8, carroX - w / 2)), y = carroY - carroH * 0.5 - h - 14;
    g.globalAlpha = Math.min(1, balao.vida * 3);
    g.fillStyle = '#faf6f0';
    g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill();
    g.beginPath(); g.moveTo(carroX - 7, y + h - 1); g.lineTo(carroX + 7, y + h - 1); g.lineTo(carroX, y + h + 8); g.fill();
    g.fillStyle = '#1c1719';
    g.fillText(balao.txt, x + w / 2, y + h / 2 + 1);
    g.globalAlpha = 1;
  }
  if (turbo > 0 && !reduzido) { // riscos de velocidade
    g.strokeStyle = 'rgba(230, 207, 158, .25)'; g.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      const x = hash(i + Math.floor(performance.now() / 60)) * W, y = hash(i * 3 + Math.floor(performance.now() / 60)) * H;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + H * 0.08); g.stroke();
    }
  }
}

function quadro(agora) {
  if (estado === 'fechado') return;
  raf = requestAnimationFrame(quadro);
  const dt = Math.min(0.05, (agora - ultimo) / 1000);
  ultimo = agora;
  atualizar(dt);
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  desenharCenario();
  desenharDestino();
  objetos.forEach(desenharObjeto);
  desenharKittyCarro();
  desenharEfeitos();
}
