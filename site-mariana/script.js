/* =========================================================
   SEÇÕES DO SITE — cada função cuida de uma parte da página
   (os textos ficam em conteudo.js; sons e brilhos em efeitos.js)
   ========================================================= */
import {
  CARTA, RECADOS_KITTY, RECADO_FINAL_KITTY, MOTIVOS, DATA_INICIO,
  DESEJOS_ESTRELAS, MENSAGEM_CONSTELACAO, VALES,
} from './conteudo.js?v=6';
import { reduzido, explodir, chuva, onda, reanimar, som, somSino, somNota, somBatida } from './efeitos.js';
import { abrirCorrida } from './corrida.js?v=6';

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const fmt = n => n.toLocaleString('pt-BR');
const toqueFino = matchMedia('(pointer: fine)').matches;
const ativar = (el, fn) => {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
};
function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}
// centro de um elemento, para efeitos disparados pelo teclado
function pontoDe(e, el) {
  if (e && e.clientX) return [e.clientX, e.clientY];
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}

/* =========================================================
   ABERTURA — some quando o primeiro carro chega
   ========================================================= */
function intro() {
  const el = $('intro');
  const barra = $('introBarra');
  let feito = false;
  function fechar() {
    if (feito) return;
    feito = true;
    el.classList.add('some');
    document.body.classList.add('iniciado');
    setTimeout(() => el.remove(), 1400);
  }
  document.addEventListener('showroom:progresso', e => { barra.style.transform = `scaleX(${e.detail})`; });
  document.addEventListener('showroom:pronto', fechar);
  setTimeout(fechar, reduzido ? 600 : 5000); // nunca segura a página por muito tempo
}

/* =========================================================
   TOPO FIXO — progresso, seção atual, menu do celular e som
   ========================================================= */
function topo() {
  const cab = $('topo');
  const barra = $('progresso');
  const menu = $('menu');
  const btnMenu = $('btnMenu');
  const btnSom = $('btnSom');
  const hero = $('hero');
  const links = [...menu.querySelectorAll('a')];

  let agendado = false;
  function rolar() {
    agendado = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    cab.classList.toggle('solido', scrollY > hero.offsetHeight - 90);
  }
  addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(rolar); } }, { passive: true });
  addEventListener('resize', rolar);
  rolar();

  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('atual', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  obs.observe(hero);
  links.forEach(a => { const s = document.querySelector(a.hash); if (s) obs.observe(s); });

  function abrirMenu(abrir) {
    cab.classList.toggle('menu-aberto', abrir);
    btnMenu.setAttribute('aria-expanded', abrir);
    btnMenu.setAttribute('aria-label', abrir ? 'Fechar o menu' : 'Abrir o menu');
    document.documentElement.classList.toggle('travado', abrir);
  }
  btnMenu.addEventListener('click', () => abrirMenu(!cab.classList.contains('menu-aberto')));
  links.forEach(a => a.addEventListener('click', () => abrirMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') abrirMenu(false); });
  matchMedia('(min-width: 961px)').addEventListener('change', () => abrirMenu(false));

  function pintarSom() {
    btnSom.setAttribute('aria-pressed', som.ligado);
    btnSom.setAttribute('aria-label', som.ligado ? 'Desligar o som' : 'Ligar o som');
    btnSom.classList.toggle('mudo', !som.ligado);
  }
  btnSom.addEventListener('click', () => {
    som.alternar();
    pintarSom();
    somNota(6, 'sine', 0.06);
  });
  pintarSom();
}

/* =========================================================
   HELLO KITTY — recados sem repetir + uma reação para cada
   ========================================================= */
function kitty() {
  const card = $('kittyCard');
  const recado = $('recado');
  const texto = $('recadoTexto');
  const num = $('recadoNum');
  const pontos = $('recadoPontos');
  const total = RECADOS_KITTY.length;
  let ordem = embaralhar([...RECADOS_KITTY.keys()]);
  let lidos = 0;
  let nota = 0;

  for (let i = 0; i < total; i++) pontos.appendChild(document.createElement('i'));

  if (toqueFino && !reduzido) {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', (0.5 - y) * 14 + 'deg');
      card.style.setProperty('--ry', (x - 0.5) * 14 + 'deg');
      card.style.setProperty('--bx', x * 100 + '%');
      card.style.setProperty('--by', y * 100 + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  function proximo() {
    if (lidos >= total) {
      // todos lidos: um recado bônus e a rodada recomeça
      lidos = 0;
      ordem = embaralhar([...RECADOS_KITTY.keys()]);
      [...pontos.children].forEach(p => p.classList.remove('lido'));
      return { item: { t: RECADO_FINAL_KITTY, r: 'bochecha' }, rotulo: 'Recado bônus' };
    }
    const item = RECADOS_KITTY[ordem[lidos]];
    pontos.children[lidos].classList.add('lido');
    lidos++;
    return { item, rotulo: `Recado ${pad(lidos)} de ${pad(total)}` };
  }

  function tocar(e) {
    const { item, rotulo } = proximo();
    const [x, y] = pontoDe(e, card);

    card.dataset.reacao = item.r;
    reanimar(card, 'tocada');
    onda(card, x, y);
    explodir(x, y, 5);
    item.r === 'laco' ? somSino() : somNota(4 + (nota++ % 5), 'sine', 0.09);

    recado.classList.add('troca');
    setTimeout(() => {
      texto.textContent = item.t;
      num.textContent = rotulo;
      recado.classList.remove('troca');
      reanimar(recado, 'chegou');
    }, reduzido ? 0 : 260);
  }
  ativar(card, tocar);
}

/* =========================================================
   NOSSO TEMPO
   ========================================================= */
function tempo() {
  const inicio = new Date(DATA_INICIO).getTime();
  const els = {};
  document.querySelectorAll('#relogio [data-u]').forEach(el => { els[el.dataset.u] = el; });
  const pens = $('pensamentos');
  const sol = $('porDoSol');

  function por(el, v) {
    if (el.textContent === v) return;
    el.textContent = v;
    if (!reduzido) reanimar(el, 'tick');
  }
  function atualizar() {
    const s = Math.floor(Math.max(0, Date.now() - inicio) / 1000);
    por(els.dias, fmt(Math.floor(s / 86400)));
    por(els.horas, pad(Math.floor(s % 86400 / 3600)));
    por(els.min, pad(Math.floor(s % 3600 / 60)));
    por(els.seg, pad(s % 60));
    pens.textContent = fmt(Math.floor(s / 90)); // uma vez a cada minuto e meio, no mínimo
    sol.textContent = fmt(Math.floor(s / 86400));
  }
  atualizar();
  setInterval(atualizar, 1000);

  const btn = $('coracaoBatida');
  const bat = $('batidas');
  let n = 0;
  btn.addEventListener('click', e => {
    n++;
    bat.textContent = fmt(n);
    reanimar(bat, 'tick');
    reanimar(btn, 'forte');
    const [x, y] = pontoDe(e, btn);
    explodir(x, y, 4 + Math.min(n, 8));
    somBatida();
    if (n % 25 === 0) chuva(24);
  });
}

/* =========================================================
   CARTA — selo, aba, papel subindo e a carta se abrindo
   ========================================================= */
function carta() {
  const env = $('envelope');
  const cena = $('envelopeCena');
  const art = $('cartaTexto');
  const btn = $('btnGuardarCarta');
  let estado = 'fechada';

  art.innerHTML = [
    '<span class="carta-orn" aria-hidden="true">✦</span>',
    `<p class="saudacao">${CARTA.saudacao}</p>`,
    ...CARTA.paragrafos.map(p => `<p>${p}</p>`),
    `<p class="assinatura">${CARTA.assinatura}</p>`,
  ].join('');
  const linhas = [...art.querySelectorAll('p')];

  function abrir() {
    if (estado !== 'fechada') return;
    estado = 'abrindo';
    env.classList.add('aberto');
    somSino();
    setTimeout(() => {
      cena.classList.add('sai');
      setTimeout(mostrarCarta, reduzido ? 0 : 450);
    }, reduzido ? 0 : 2300);
  }
  function mostrarCarta() {
    cena.hidden = true;
    art.hidden = false;
    btn.hidden = false;
    linhas.forEach(p => p.classList.remove('vis'));
    reanimar(art, 'mostrar');
    linhas.forEach((p, i) => setTimeout(() => p.classList.add('vis'), reduzido ? 0 : 450 + i * 520));
    art.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' });
    estado = 'aberta';
  }
  function guardar() {
    if (estado !== 'aberta') return;
    art.hidden = true;
    btn.hidden = true;
    // o envelope volta fechado na hora; só a cena aparece suavemente
    env.classList.add('sem-transicao');
    env.classList.remove('aberto');
    cena.hidden = false;
    void cena.offsetWidth;
    env.classList.remove('sem-transicao');
    cena.classList.remove('sai');
    estado = 'fechada';
    cena.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'center' });
    env.focus({ preventScroll: true });
  }
  ativar(env, abrir);
  btn.addEventListener('click', guardar);
}

/* =========================================================
   MOTIVOS — cartões que viram
   ========================================================= */
const ICONES = {
  sorriso: '<circle cx="12" cy="12" r="9"/><path d="M8.2 14a4.6 4.6 0 0 0 7.6 0"/><path d="M9 9.6v.1M15 9.6v.1"/>',
  laco: '<path d="M12 12 4.5 7.6v8.8L12 12l7.5-4.4v8.8L12 12z"/><circle cx="12" cy="12" r="1.7"/>',
  carro: '<path d="M3 15.6v-2.3c0-.8.5-1.4 1.2-1.6l2.4-.7 2.2-2.9A2 2 0 0 1 10.4 7.4h3.9a2 2 0 0 1 1.5.7l2.6 3 1.5.4c.8.2 1.1.8 1.1 1.6v2.5"/><circle cx="7.2" cy="16" r="1.9"/><circle cx="16.8" cy="16" r="1.9"/><path d="M9.1 16h5.8"/>',
  abraco: '<path d="M12 19.5s-7-4.3-7-9.6a3.9 3.9 0 0 1 7-2.4 3.9 3.9 0 0 1 7 2.4c0 5.3-7 9.6-7 9.6z"/>',
  brilho: '<path d="M11 4c.6 4.2 2.4 6 6.6 6.6-4.2.6-6 2.4-6.6 6.6-.6-4.2-2.4-6-6.6-6.6C8.6 10 10.4 8.2 11 4z"/><path d="M18.5 3.5v3M17 5h3"/>',
  lua: '<path d="M19.5 14.6A7.9 7.9 0 1 1 9.4 4.5a6.3 6.3 0 0 0 10.1 10.1z"/>',
};

function motivos() {
  const grade = $('grade');
  MOTIVOS.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'flip';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', 'false');
    el.setAttribute('aria-label', `Motivo ${i + 1}: ${m.tit}. Toque para ler.`);
    el.style.setProperty('--d', i * 0.08 + 's');
    el.innerHTML = `
      <div class="flip-inner">
        <div class="face frente">
          <div class="frente-topo">
            <span class="num">${pad(i + 1)}</span>
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">${ICONES[m.icone] || ICONES.abraco}</svg>
          </div>
          <div>
            <div class="tit">${m.tit}</div>
            <div class="toque">Toque para ler <span aria-hidden="true">→</span></div>
          </div>
        </div>
        <div class="face verso${m.bmw ? ' bmw' : ''}">
          ${m.bmw ? '<div class="m-faixas" aria-hidden="true"><i></i><i></i><i></i></div>' : ''}
          <p>${m.t}</p>
          <small>${pad(i + 1)} · ${m.tit}</small>
        </div>
      </div>`;
    ativar(el, () => {
      const virado = el.classList.toggle('virado');
      el.setAttribute('aria-pressed', virado);
      if (virado) somNota(i + 2, 'sine', 0.05);
    });
    grade.appendChild(el);
  });
}

/* =========================================================
   CÉU ESTRELADO — constelação em forma de coração
   ========================================================= */
function ceu() {
  const sec = $('ceu');
  const cv = $('ceuCanvas');
  const ctx = cv.getContext('2d');
  const txt = $('desejoTexto');
  const caixa = $('desejo');
  const elAchadas = $('achadas');
  const barra = $('ceuBarra');
  const hud = sec.querySelector('.ceu-hud');
  const N = DESEJOS_ESTRELAS.length;
  const raioToque = toqueFino ? 28 : 38;
  $('totalEstrelas').textContent = N;

  let W = 0, H = 0, fundo = [], especiais = [], cadentes = [], achadas = 0, completo = 0, visivel = false;
  const mouse = { x: 0.5, y: 0.5, px: -999, py: -999 };

  function montar() {
    const dpr = Math.min(devicePixelRatio, 2);
    const novoW = cv.clientWidth, novoH = cv.clientHeight;
    // a barra do navegador no celular muda só um pouco a altura: não refaz o céu à toa
    const refazerFundo = novoW !== W || Math.abs(novoH - H) > 120;
    W = novoW; H = novoH;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (refazerFundo || !fundo.length) {
      const cores = ['#ffffff', '#f3e3c3', '#f6d4dd', '#e9e3f3'];
      fundo = Array.from({ length: Math.round(W * H / (toqueFino ? 2600 : 3400)) }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2,
        f: Math.random() * 6.28, v: 0.01 + Math.random() * 0.03, z: Math.random(),
        cor: cores[Math.floor(Math.random() * cores.length)],
      }));
    }
    // o coração ocupa o espaço livre entre o contador e a caixa de desejo
    const rc = cv.getBoundingClientRect();
    const topoLivre = hud.getBoundingClientRect().bottom - rc.top + 30;
    const baseLivre = caixa.getBoundingClientRect().top - rc.top - 30;
    const esc = Math.max(5, Math.min(W * 0.026, (baseLivre - topoLivre) / 29));
    const cx = W / 2, cy = (topoLivre + baseLivre) / 2 - 3 * esc;
    const antigas = especiais;
    especiais = DESEJOS_ESTRELAS.map((d, i) => {
      const t = Math.PI * 2 * i / N;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { x: cx + x * esc, y: cy - y * esc, f: i, achada: antigas[i] ? antigas[i].achada : false, brilho: 0, d };
    });
  }
  montar();
  addEventListener('resize', montar);
  new IntersectionObserver(es => {
    visivel = es[0].isIntersecting;
    if (visivel) setTimeout(montar, 1200); // espera o conteúdo terminar de aparecer
  }).observe(sec);

  const perto = (x, y) => especiais.find(s => (s.x - x) ** 2 + (s.y - y) ** 2 < raioToque * raioToque);

  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    mouse.px = e.clientX - r.left; mouse.py = e.clientY - r.top;
    mouse.x = mouse.px / W; mouse.y = mouse.py / H;
    cv.style.cursor = perto(mouse.px, mouse.py) ? 'pointer' : 'crosshair';
  });
  cv.addEventListener('pointerleave', () => { mouse.px = mouse.py = -999; });
  cv.addEventListener('click', e => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const s = perto(x, y);
    if (!s) { // toque no vazio: estrela cadente
      cadentes.push({ x, y, vx: -6 - Math.random() * 4, vy: 3 + Math.random() * 2, vida: 1 });
      return;
    }
    s.brilho = 1;
    mostrar(s.d);
    somNota(s.f);
    explodir(e.clientX, e.clientY, 5);
    if (!s.achada) {
      s.achada = true;
      achadas++;
      elAchadas.textContent = achadas;
      barra.style.width = achadas / N * 100 + '%';
      if (achadas === N) setTimeout(completar, 900);
    }
  });
  function mostrar(t) {
    txt.style.opacity = 0;
    caixa.classList.add('novo');
    setTimeout(() => { txt.textContent = t; txt.style.opacity = 1; caixa.classList.remove('novo'); }, 260);
  }
  function completar() {
    caixa.classList.add('completo');
    mostrar(MENSAGEM_CONSTELACAO);
    chuva(30);
    somSino();
  }

  function estrela4(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  }

  let t = 0;
  function quadro() {
    requestAnimationFrame(quadro);
    if (!visivel) return;
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    const ox = (mouse.x - 0.5) * 24, oy = (mouse.y - 0.5) * 24;
    // céu de fundo com paralaxe
    for (const s of fundo) {
      if (!reduzido) s.f += s.v;
      ctx.globalAlpha = 0.3 + Math.sin(s.f) * 0.3 + 0.3 * s.z;
      ctx.fillStyle = s.cor;
      ctx.beginPath(); ctx.arc(s.x + ox * s.z, s.y + oy * s.z, s.r, 0, 6.28); ctx.fill();
    }
    // linhas da constelação
    if (completo < 1 && achadas === N) completo = Math.min(1, completo + 0.01);
    ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const a = especiais[i], b = especiais[(i + 1) % N];
      if (!(a.achada && b.achada)) continue;
      ctx.globalAlpha = 0.5 + completo * 0.45;
      ctx.strokeStyle = completo > 0 ? '#f0c9d3' : '#e6cf9e';
      ctx.shadowColor = '#e6cf9e'; ctx.shadowBlur = 4 + completo * 12;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    // brilho rosado no centro quando completa
    if (completo > 0) {
      const g = ctx.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H * 0.5, Math.min(W, H) * 0.4);
      g.addColorStop(0, `rgba(212, 139, 160, ${0.22 * completo})`); g.addColorStop(1, 'rgba(212, 139, 160, 0)');
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // estrelas especiais
    for (const s of especiais) {
      s.brilho *= 0.95;
      const pulso = reduzido ? 0.6 : 0.5 + Math.sin(t * 2.2 + s.f) * 0.5;
      const hover = (s.x - mouse.px) ** 2 + (s.y - mouse.py) ** 2 < 900 ? 1 : 0;
      const r = (s.achada ? 8 : 5 + pulso * 4) + hover * 4 + s.brilho * 10;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.2);
      g.addColorStop(0, s.achada ? 'rgba(240, 201, 211, .85)' : 'rgba(230, 207, 158, .8)');
      g.addColorStop(1, 'rgba(230, 207, 158, 0)');
      ctx.globalAlpha = 0.6 + pulso * 0.4;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r * 3.2, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = '#fffaf0';
      estrela4(s.x, s.y, r);
    }
    // estrelas cadentes (aleatórias + toques no vazio)
    if (!reduzido && Math.random() < 0.004) cadentes.push({ x: Math.random() * W * 0.6 + W * 0.4, y: Math.random() * H * 0.3, vx: -7, vy: 3, vida: 1 });
    for (let i = cadentes.length - 1; i >= 0; i--) {
      const c = cadentes[i];
      c.x += c.vx; c.y += c.vy; c.vida -= 0.018;
      if (c.vida <= 0) { cadentes.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 12, c.y - c.vy * 12);
      g.addColorStop(0, `rgba(255, 246, 228, ${c.vida})`); g.addColorStop(1, 'rgba(255, 246, 228, 0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 12, c.y - c.vy * 12); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  quadro();
}

/* =========================================================
   VALES / RASPADINHAS
   ========================================================= */
function vales() {
  const lista = $('listaVales');
  const elAbertos = $('valesAbertos');
  const status = $('valesStatus');
  let abertos = 0;
  $('valesTotal').textContent = VALES.length;

  VALES.forEach((v, i) => {
    const el = document.createElement('div');
    el.className = `vale tom-${v.tom}`;
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Raspadinha ${i + 1}: raspe, ou aperte Enter, para revelar`);
    el.innerHTML = `
      <div class="vale-premio">
        <span class="emoji" aria-hidden="true">${v.emoji}</span>
        <small>Vale nº ${pad(i + 1)}</small>
        <strong>${v.tit}</strong>
        <em>${v.obs}</em>
      </div>
      <canvas aria-hidden="true"></canvas>`;
    lista.appendChild(el);

    const cv = el.querySelector('canvas');
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    let pronto = false, raspando = false, ultimo = null, cont = 0, largura = 0;

    // camada dourada de raspar
    function pintar() {
      if (el.classList.contains('raspado')) return;
      const r = cv.getBoundingClientRect();
      if (!r.width || r.width === largura) return;
      largura = r.width;
      const dpr = Math.min(devicePixelRatio, 2);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, '#d9bf8c'); g.addColorStop(0.35, '#b8945c'); g.addColorStop(0.5, '#f1e0b8');
      g.addColorStop(0.65, '#c4a066'); g.addColorStop(1, '#a8834d');
      ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
      // trama fina de brilho
      ctx.fillStyle = 'rgba(255, 248, 230, .18)';
      for (let y = 0; y < r.height; y += 6) for (let x = (y / 6 % 2) * 3; x < r.width; x += 6) ctx.fillRect(x, y, 1, 1);
      ctx.strokeStyle = 'rgba(255, 248, 230, .55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10.5, 10.5, r.width - 21, r.height - 21);
      ctx.fillStyle = 'rgba(70, 48, 20, .78)';
      ctx.textAlign = 'center';
      ctx.font = '500 11px Inter, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('RASPE AQUI', r.width / 2, r.height / 2 - 6);
      ctx.letterSpacing = '0px';
      ctx.font = 'italic 500 22px "Cormorant Garamond", serif';
      ctx.fillText('uma surpresa ♥', r.width / 2, r.height / 2 + 20);
      ctx.globalCompositeOperation = 'destination-out';
      pronto = true;
    }
    requestAnimationFrame(pintar);
    if (document.fonts) document.fonts.ready.then(() => { largura = 0; pintar(); });
    addEventListener('resize', pintar);

    const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    function raspar(p) {
      ctx.lineWidth = 40; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      if (ultimo) ctx.moveTo(ultimo.x, ultimo.y); else ctx.moveTo(p.x - 0.1, p.y);
      ctx.lineTo(p.x, p.y); ctx.stroke();
      ultimo = p;
      if (++cont % 8 === 0) verificar();
    }
    function verificar() {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let vazio = 0, total = 0;
      for (let k = 3; k < d.length; k += 64) { total++; if (d[k] === 0) vazio++; }
      if (vazio / total > 0.5) revelar();
    }
    function revelar() {
      if (el.classList.contains('raspado')) return;
      el.classList.add('raspado');
      el.setAttribute('aria-label', `Vale ${i + 1}: ${v.tit} — ${v.obs}`);
      const r = el.getBoundingClientRect();
      explodir(r.left + r.width / 2, r.top + r.height / 2, 8);
      somSino();
      abertos++;
      elAbertos.textContent = abertos;
      reanimar(status, 'chegou');
      if (abertos === VALES.length) {
        status.innerHTML = 'Todos revelados. <em>Válidos para sempre — é só me mostrar esta tela.</em>';
        status.classList.add('completo');
        chuva(24);
      }
    }
    cv.addEventListener('pointerdown', e => {
      if (!pronto) return;
      raspando = true; ultimo = null;
      try { cv.setPointerCapture(e.pointerId); } catch (_) {}
      raspar(pos(e));
    });
    cv.addEventListener('pointermove', e => { if (raspando) raspar(pos(e)); });
    const parar = () => { raspando = false; ultimo = null; };
    cv.addEventListener('pointerup', parar);
    cv.addEventListener('pointercancel', parar);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); revelar(); } });
  });
}

/* =========================================================
   PERGUNTA FINAL — o "não" foge, o "sim" comemora
   ========================================================= */
function final() {
  const sec = $('final');
  const nao = $('btnNao');
  const sim = $('btnSim');
  const resposta = $('resposta');
  const frases = ['Não', 'Tem certeza?', 'Pensa bem…', 'Botão errado', 'Impossível', 'Nem tenta'];
  let n = 0;

  // foge para um ponto visível dentro da própria seção
  function fugir() {
    const r = sec.getBoundingClientRect();
    const w = nao.offsetWidth, h = nao.offsetHeight;
    const topo = Math.max(0, -r.top) + 80;
    const base = Math.min(r.height, innerHeight - r.top) - h - 16;
    nao.classList.add('fugindo');
    nao.style.left = 16 + Math.random() * Math.max(0, r.width - w - 32) + 'px';
    nao.style.top = topo + Math.random() * Math.max(0, base - topo) + 'px';
    nao.textContent = frases[++n % frases.length];
  }
  if (toqueFino) nao.addEventListener('pointerenter', fugir);
  nao.addEventListener('click', e => { e.preventDefault(); fugir(); });

  sim.addEventListener('click', e => {
    nao.hidden = true;
    sim.classList.add('aceito');
    resposta.classList.add('mostrar');
    const [x, y] = pontoDe(e, sim);
    explodir(x, y, 10);
    chuva(48);
    somSino();
    // depois da comemoração, a Kitty pega o volante
    setTimeout(abrirCorrida, 2600);
  });
  const btnCorrida = $('btnCorrida');
  btnCorrida.addEventListener('click', abrirCorrida);
  document.addEventListener('corrida:fechou', () => { btnCorrida.hidden = false; });
}

/* =========================================================
   REVELAR AO ROLAR
   ========================================================= */
function revelarAoRolar() {
  const els = document.querySelectorAll('.revelar');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visivel')); return; }
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

intro();
topo();
kitty();
tempo();
carta();
motivos();
ceu();
vales();
final();
revelarAoRolar();
