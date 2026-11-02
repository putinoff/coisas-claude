/* =========================================================
   TEXTOS — edite aqui à vontade
   ========================================================= */
const CARTA = {
  saudacao: 'Mariana, meu amor,',
  paragrafos: [
    'Se a vida fosse uma estrada, eu queria percorrer cada quilômetro dela do seu lado — com a janela aberta, a nossa música tocando e a sua mão segurando a minha.',
    'Você é o meu lugar favorito, o meu sorriso sem motivo e a parte mais bonita de todos os meus dias. Com você, até trânsito parado vira passeio, e qualquer tarde comum ganha um tom de rosa, igualzinho ao laço da Hello Kitty.',
    'Obrigado por ser tão carinhosa, tão linda e tão você. Prometo ser seu co-piloto, seu porto seguro e o seu fã número um, pra sempre.',
    'Te amo mais do que ontem e menos do que amanhã.',
  ],
  assinatura: 'Lucas',
};

const RECADOS_KITTY = [
  'Mariana, você é a pessoa mais fofa do universo.',
  'Sabia que tem alguém que pensa em você o dia inteiro?',
  'Seu sorriso brilha mais que farol de BMW à noite.',
  'Hoje é um ótimo dia pra ganhar um beijinho.',
  'Você e ele: a combinação mais bonita que eu já vi.',
  'Lembrete oficial da Kitty: você é linda.',
];

const MOTIVOS = [
  { tit: 'Seu sorriso', t: 'Ele liga o meu dia mais rápido que a partida de uma BMW.', icone: '😊', g: 'linear-gradient(145deg, #ff9a9e, #fecfef)' },
  { tit: 'Seu jeitinho', t: 'Essa fofura de Hello Kitty que você tem sem nem tentar.', icone: '🎀', g: 'linear-gradient(145deg, #f78ca0, #f9748f 40%, #fe9a8b)' },
  { tit: 'Única', t: 'Você é tipo uma BMW: linda, potente e sem igual no mundo.', bmw: true, icone: '🏎️', g: 'linear-gradient(145deg, #4facfe, #6a5cf0)' },
  { tit: 'Seu abraço', t: 'O meu lugar favorito para estacionar.', icone: '🤗', g: 'linear-gradient(145deg, #c471f5, #fa71cd)' },
  { tit: 'Nossas risadas', t: 'Aquelas sem motivo nenhum, que viram as melhores lembranças.', icone: '😂', g: 'linear-gradient(145deg, #f6a96b, #ff7eb3)' },
  { tit: 'Todo dia', t: 'Porque é em você que eu penso antes de dormir — e ao acordar.', icone: '🌙', g: 'linear-gradient(145deg, #a18cd1, #fbc2eb)' },
];

/* Data em que vocês começaram (ano-mês-diaThora:minuto) — troque pela de vocês */
const DATA_INICIO = '2025-08-12T00:00:00';

/* Uma frase para cada estrela da constelação (a quantidade define o desenho) */
const DESEJOS_ESTRELAS = [
  'Que a gente viaje o mundo inteiro, de janela aberta.',
  'Que nunca falte motivo pra você sorrir.',
  'Que todo domingo tenha preguiça e abraço.',
  'Que a gente ria até a barriga doer, sempre.',
  'Que eu te faça sentir amada todos os dias.',
  'Que a nossa playlist nunca acabe.',
  'Que cada aniversário seu seja mais bonito que o anterior.',
  'Que a gente envelheça junto, de mãos dadas.',
  'Que cada viagem vire uma história pra contar.',
  'Que você nunca duvide do quanto é especial.',
  'Que a gente dance na cozinha, mesmo sem música.',
  'Que todos os seus sonhos tenham a minha torcida.',
];
const MENSAGEM_CONSTELACAO = 'Você completou o céu: ele desenha um coração. O meu, que é todinho seu.';

/* Raspadinhas */
const VALES = [
  { emoji: '🍝', tit: 'Um jantar romântico', obs: 'você escolhe o lugar, eu pago a conta', g: 'linear-gradient(135deg, #ff6a88, #ff99ac)' },
  { emoji: '🚗', tit: 'Um passeio sem destino', obs: 'janela aberta e sua playlist no máximo', g: 'linear-gradient(135deg, #4facfe, #8e7cf3)' },
  { emoji: '🎀', tit: 'Um dia Hello Kitty', obs: 'filme, doce e tudo do jeitinho que você quiser', g: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { emoji: '💆‍♀️', tit: 'Uma massagem', obs: 'sem hora pra acabar, válido pra sempre', g: 'linear-gradient(135deg, #43e2b0, #38b6d8)' },
  { emoji: '🍫', tit: 'Chocolate ilimitado', obs: 'resgate a qualquer momento de TPM ou não', g: 'linear-gradient(135deg, #f6a96b, #e8638c)' },
  { emoji: '💋', tit: '1.000 beijos', obs: 'parcelados em quantas vezes você quiser', g: 'linear-gradient(135deg, #c471f5, #fa71cd)' },
];

/* =========================================================
   EFEITOS DOM
   ========================================================= */
function explodir(x, y, qtd = 10) {
  for (let i = 0; i < qtd; i++) {
    const p = document.createElement('div');
    p.className = 'particula';
    p.textContent = Math.random() < 0.7 ? '♥' : '✦';
    const ang = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 90;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.fontSize = (10 + Math.random() * 14) + 'px';
    p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(ang) * dist - 30 + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
}
function chuva(qtd = 70) {
  for (let i = 0; i < qtd; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'chuva';
      c.textContent = Math.random() < 0.75 ? '♥' : '✦';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.fontSize = (12 + Math.random() * 22) + 'px';
      c.style.opacity = 0.5 + Math.random() * 0.5;
      c.style.animationDuration = (3 + Math.random() * 3) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 6200);
    }, i * 70);
  }
}

/* =========================================================
   SONS (Web Audio — nenhum arquivo externo)
   ========================================================= */
let audioCtx = null;
function audio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function motor(curva, duracao, volume = 0.16) {
  const a = audio(), t = a.currentTime;
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
const somPartida = () => motor([[0, 30], [0.35, 38], [0.6, 140], [1.0, 70], [2.2, 52]], 2.4, 0.14);
const somAcelerar = () => motor([[0, 55], [0.8, 200], [1.0, 130], [1.8, 260], [2.6, 58]], 2.8, 0.17);
function somBuzina() {
  const a = audio(), t = a.currentTime;
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
function somSino() {
  const a = audio(), t = a.currentTime;
  [1046, 1318, 1568].forEach((hz, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = hz;
    const ini = t + i * 0.09;
    g.gain.setValueAtTime(0.0001, ini);
    g.gain.exponentialRampToValueAtTime(0.08, ini + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ini + 0.6);
    o.connect(g); g.connect(a.destination);
    o.start(ini); o.stop(ini + 0.65);
  });
}

/* =========================================================
   HELLO KITTY
   ========================================================= */
(function kitty() {
  const card = document.getElementById('kittyCard');
  const recado = document.getElementById('recado');
  const texto = document.getElementById('recadoTexto');
  const laco = document.getElementById('laco');
  let i = 0;
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.transform = `rotateY(${(x - 0.5) * 18}deg) rotateX(${(0.5 - y) * 18}deg)`;
    card.style.setProperty('--bx', x * 100 + '%');
    card.style.setProperty('--by', y * 100 + '%');
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  function novoRecado(e) {
    texto.style.opacity = 0;
    recado.classList.add('troca');
    setTimeout(() => {
      texto.textContent = RECADOS_KITTY[i++ % RECADOS_KITTY.length];
      texto.style.opacity = 1;
      recado.classList.remove('troca');
    }, 300);
    laco.classList.remove('balanca');
    void laco.getBoundingClientRect();
    laco.classList.add('balanca');
    somSino();
    if (e && e.clientX) explodir(e.clientX, e.clientY, 8);
  }
  card.addEventListener('click', novoRecado);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); novoRecado(); } });
})();

/* =========================================================
   CARTA
   ========================================================= */
(function carta() {
  const env = document.getElementById('envelope');
  const art = document.getElementById('carta-texto');
  const instrucao = document.getElementById('instrucao');
  let aberta = false;
  function abrir() {
    if (aberta) return;
    aberta = true;
    env.classList.add('aberto');
    instrucao.style.opacity = 0;
    somSino();
    const linhas = [`<p class="saudacao">${CARTA.saudacao}</p>`]
      .concat(CARTA.paragrafos.map(p => `<p>${p}</p>`))
      .concat(`<p class="assinatura">${CARTA.assinatura}</p>`);
    setTimeout(() => {
      art.innerHTML = linhas.join('');
      art.classList.add('mostrar');
      art.querySelectorAll('p').forEach((p, n) => setTimeout(() => p.classList.add('vis'), 400 + n * 650));
      setTimeout(() => art.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }, 1300);
  }
  env.addEventListener('click', abrir);
  env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
})();

/* =========================================================
   MOTIVOS
   ========================================================= */
(function motivos() {
  const grade = document.getElementById('grade');
  MOTIVOS.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'flip';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.innerHTML = `
      <div class="flip-inner">
        <div class="face frente" style="--g:${m.g}">
          <span class="icone">${m.icone}</span>
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <div><div class="tit">${m.tit}</div><div class="toque">Toque para ler</div></div>
        </div>
        <div class="face verso${m.bmw ? ' bmw' : ''}">
          ${m.bmw ? '<div class="m-faixas"><i></i><i></i><i></i></div>' : ''}
          <p>${m.t}</p>
        </div>
      </div>`;
    const virar = () => el.classList.toggle('virado');
    el.addEventListener('click', virar);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); virar(); } });
    grade.appendChild(el);
  });
})();

/* =========================================================
   PERGUNTA FINAL
   ========================================================= */
(function final() {
  const nao = document.getElementById('btnNao');
  const frases = ['Não', 'Tem certeza?', 'Pensa bem…', 'Botão errado', 'Impossível', 'Nem tenta'];
  let n = 0;
  function fugir() {
    nao.classList.add('fugindo');
    nao.style.left = 10 + Math.random() * (window.innerWidth - nao.offsetWidth - 20) + 'px';
    nao.style.top = 10 + Math.random() * (window.innerHeight - nao.offsetHeight - 20) + 'px';
    nao.textContent = frases[++n % frases.length];
  }
  nao.addEventListener('pointerenter', fugir);
  nao.addEventListener('click', e => { e.preventDefault(); fugir(); });
  document.getElementById('btnSim').addEventListener('click', () => {
    document.getElementById('resposta').classList.add('mostrar');
    nao.style.display = 'none';
    chuva(80);
    somSino();
  });
})();

/* =========================================================
   FUNDO: partículas flutuantes + rastro do cursor
   ========================================================= */
(function fundo() {
  const cv = document.getElementById('fundo');
  const ctx = cv.getContext('2d');
  const hero = document.getElementById('hero');
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, dpr, cores = ['#ff8fb3', '#ffc4a8', '#c9a7ff', '#ff5c8a'];
  const flutuantes = [], rastro = [];
  const mouse = { x: -999, y: -999 };

  function tamanho() {
    dpr = Math.min(devicePixelRatio, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  tamanho();
  addEventListener('resize', tamanho);

  const qtd = reduzido ? 0 : Math.round(Math.min(24, W / 55));
  for (let i = 0; i < qtd; i++) flutuantes.push(novo(true));
  function novo(inicio) {
    return {
      x: Math.random() * W, y: inicio ? Math.random() * H : H + 30,
      r: 4 + Math.random() * 8, vy: 0.15 + Math.random() * 0.45,
      fase: Math.random() * 6.28, giro: (Math.random() - 0.5) * 0.02, a: Math.random() * 6.28,
      cor: Math.floor(Math.random() * 4), tipo: Math.random() < 0.55 ? 'c' : (Math.random() < 0.5 ? 'e' : 'b'),
      op: 0.18 + Math.random() * 0.3, vx: 0,
    };
  }

  function coracao(x, y, r, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(r / 16, r / 16);
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.bezierCurveTo(-16, -6, -8, -18, 0, -9);
    ctx.bezierCurveTo(8, -18, 16, -6, 0, 6);
    ctx.fill(); ctx.restore();
  }
  function estrela(x, y, r, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rr = i % 2 ? r * 0.28 : r;
      const ang = i * Math.PI / 4;
      ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  // paleta muda conforme a seção visível
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.target.dataset.cores) cores = e.target.dataset.cores.split(',');
  }), { threshold: 0.4 });
  document.querySelectorAll('section[data-cores]').forEach(s => obs.observe(s));

  let ultimo = 0;
  if (matchMedia('(pointer: fine)').matches && !reduzido) {
    addEventListener('pointermove', e => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      const agora = performance.now();
      if (agora - ultimo < 28 || !cv.classList.contains('ativo')) return;
      ultimo = agora;
      rastro.push({
        x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.2, vy: -0.4 - Math.random() * 0.8,
        r: 3 + Math.random() * 5, vida: 1, cor: cores[Math.floor(Math.random() * cores.length)],
        a: Math.random() * 6.28, tipo: Math.random() < 0.5 ? 'c' : 'e',
      });
    });
  }

  function loop() {
    requestAnimationFrame(loop);
    const ativo = hero.getBoundingClientRect().bottom < H * 0.35;
    cv.classList.toggle('ativo', ativo);
    if (!ativo && !rastro.length) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of flutuantes) {
      p.fase += 0.012; p.a += p.giro;
      // repulsão suave do cursor
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 14000) { p.vx += dx / Math.sqrt(d2 + 1) * 0.35; }
      p.vx *= 0.94;
      p.x += Math.sin(p.fase) * 0.35 + p.vx;
      p.y -= p.vy;
      if (p.y < -30) Object.assign(p, novo(false));
      ctx.globalAlpha = p.op;
      ctx.fillStyle = cores[p.cor % cores.length];
      if (p.tipo === 'c') coracao(p.x, p.y, p.r, Math.sin(p.fase) * 0.3);
      else if (p.tipo === 'e') estrela(p.x, p.y, p.r * 0.8, p.a);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.45, 0, 6.28); ctx.fill(); }
    }
    for (let i = rastro.length - 1; i >= 0; i--) {
      const p = rastro[i];
      p.x += p.vx; p.y += p.vy; p.vida -= 0.022; p.a += 0.05;
      if (p.vida <= 0) { rastro.splice(i, 1); continue; }
      ctx.globalAlpha = p.vida * 0.9;
      ctx.fillStyle = p.cor;
      ctx.shadowColor = p.cor; ctx.shadowBlur = 8;
      if (p.tipo === 'c') coracao(p.x, p.y, p.r * p.vida + 2, 0); else estrela(p.x, p.y, p.r * p.vida + 2, p.a);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
  loop();
})();

/* =========================================================
   PROGRESSO DE ROLAGEM + PONTOS DE NAVEGAÇÃO
   ========================================================= */
(function navegacao() {
  const barra = document.getElementById('progresso');
  const pontos = document.getElementById('pontos');
  const links = [...pontos.querySelectorAll('a')];
  function rolar() {
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    pontos.classList.toggle('ativo', scrollY > innerHeight * 0.6);
  }
  addEventListener('scroll', rolar, { passive: true });
  rolar();
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('atual', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -45% 0px' });
  links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) obs.observe(s); });
})();

/* =========================================================
   KITTY: lacinhos flutuando
   ========================================================= */
(function lacinhos() {
  const palco = document.querySelector('.kitty-palco');
  [['🎀', '4%', '8%', 0], ['💗', '88%', '14%', -1.5], ['✨', '6%', '78%', -3], ['🎀', '86%', '80%', -2.2], ['💕', '48%', '-4%', -4]]
    .forEach(([e, x, y, d]) => {
      const s = document.createElement('span');
      s.className = 'mini-laco'; s.textContent = e;
      s.style.left = x; s.style.top = y; s.style.animationDelay = d + 's';
      palco.appendChild(s);
    });
})();

/* =========================================================
   NOSSO TEMPO
   ========================================================= */
(function tempo() {
  const inicio = new Date(DATA_INICIO).getTime();
  const els = {};
  document.querySelectorAll('#relogio [data-u]').forEach(el => els[el.dataset.u] = el);
  const pens = document.getElementById('pensamentos');
  const sol = document.getElementById('porDoSol');
  const fmt = n => n.toLocaleString('pt-BR');
  function por(el, v) {
    if (el.textContent === v) return;
    el.textContent = v;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
  }
  function atualizar() {
    const ms = Math.max(0, Date.now() - inicio);
    const s = Math.floor(ms / 1000);
    por(els.dias, fmt(Math.floor(s / 86400)));
    por(els.horas, String(Math.floor(s % 86400 / 3600)).padStart(2, '0'));
    por(els.min, String(Math.floor(s % 3600 / 60)).padStart(2, '0'));
    por(els.seg, String(s % 60).padStart(2, '0'));
    pens.textContent = fmt(Math.floor(s / 90)); // uma vez a cada minuto e meio, no mínimo
    sol.textContent = fmt(Math.floor(s / 86400));
  }
  atualizar();
  setInterval(atualizar, 1000);

  const btn = document.getElementById('coracaoBatida');
  const bat = document.getElementById('batidas');
  let n = 0;
  btn.addEventListener('click', e => {
    n++;
    bat.textContent = fmt(n);
    btn.classList.remove('forte'); void btn.offsetWidth; btn.classList.add('forte');
    const r = btn.getBoundingClientRect();
    explodir(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2, 6 + Math.min(n, 14));
    const a = audio(), t = a.currentTime;
    [0, 0.14].forEach((d, i) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(i ? 70 : 85, t + d); o.frequency.exponentialRampToValueAtTime(40, t + d + 0.15);
      g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.35, t + d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.18);
      o.connect(g); g.connect(a.destination); o.start(t + d); o.stop(t + d + 0.2);
    });
    if (n % 25 === 0) chuva(30);
  });
})();

/* =========================================================
   CÉU ESTRELADO / CONSTELAÇÃO DE CORAÇÃO
   ========================================================= */
(function ceu() {
  const sec = document.getElementById('ceu');
  const cv = document.getElementById('ceuCanvas');
  const ctx = cv.getContext('2d');
  const txt = document.getElementById('desejoTexto');
  const caixa = document.getElementById('desejo');
  const elAchadas = document.getElementById('achadas');
  const barra = document.getElementById('ceuBarra');
  const N = DESEJOS_ESTRELAS.length;
  document.getElementById('totalEstrelas').textContent = N;
  let W, H, dpr, fundo = [], especiais = [], cadentes = [], achadas = 0, completo = 0, visivel = false;
  const mouse = { x: 0.5, y: 0.5, px: -999, py: -999 };

  function montar() {
    dpr = Math.min(devicePixelRatio, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fundo = Array.from({ length: Math.round(W * H / 2600) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.2,
      f: Math.random() * 6.28, v: 0.01 + Math.random() * 0.03, z: Math.random(),
      cor: ['#ffffff', '#c9d8ff', '#ffd6f0', '#fff1b8'][Math.floor(Math.random() * 4)],
    }));
    // estrelas especiais desenhando um coração
    // o coração ocupa o espaço livre entre o contador e a caixa de desejo
    const rc = cv.getBoundingClientRect();
    const topo = document.querySelector('.ceu-hud').getBoundingClientRect().bottom - rc.top + 30;
    const base = caixa.getBoundingClientRect().top - rc.top - 30;
    const esc = Math.max(5, Math.min(W * 0.026, (base - topo) / 29));
    const cx = W / 2, cy = (topo + base) / 2 - 3 * esc;
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

  new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) setTimeout(montar, 1200); }).observe(sec);

  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    mouse.px = e.clientX - r.left; mouse.py = e.clientY - r.top;
    mouse.x = mouse.px / W; mouse.y = mouse.py / H;
    cv.style.cursor = perto(mouse.px, mouse.py) ? 'pointer' : 'crosshair';
  });
  cv.addEventListener('pointerleave', () => { mouse.px = mouse.py = -999; });
  function perto(x, y) {
    return especiais.find(s => (s.x - x) ** 2 + (s.y - y) ** 2 < 30 * 30);
  }
  cv.addEventListener('click', e => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const s = perto(x, y);
    if (!s) { // clique no vazio: estrela cadente
      cadentes.push({ x, y, vx: -6 - Math.random() * 4, vy: 3 + Math.random() * 2, vida: 1 });
      return;
    }
    s.brilho = 1;
    mostrar(s.d);
    sino(s.f);
    explodir(e.clientX, e.clientY, 8);
    if (!s.achada) {
      s.achada = true;
      achadas++;
      elAchadas.textContent = achadas;
      barra.style.width = achadas / N * 100 + '%';
      if (achadas === N) setTimeout(final, 900);
    }
  });
  function mostrar(t) {
    txt.style.opacity = 0;
    caixa.classList.add('novo');
    setTimeout(() => { txt.textContent = t; txt.style.opacity = 1; caixa.classList.remove('novo'); }, 280);
  }
  function sino(i) {
    const a = audio(), t = a.currentTime;
    const notas = [523, 587, 659, 784, 880, 988, 1046, 1175, 1318, 1568];
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = notas[i % notas.length];
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 1.5);
  }
  function final() {
    caixa.classList.add('completo');
    mostrar(MENSAGEM_CONSTELACAO);
    chuva(50);
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
      s.f += s.v;
      ctx.globalAlpha = 0.35 + Math.sin(s.f) * 0.35 + 0.3 * s.z;
      ctx.fillStyle = s.cor;
      ctx.beginPath(); ctx.arc(s.x + ox * s.z, s.y + oy * s.z, s.r, 0, 6.28); ctx.fill();
    }
    // linhas da constelação
    if (completo < 1 && achadas === N) completo = Math.min(1, completo + 0.01);
    ctx.lineWidth = 1.4; ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const a = especiais[i], b = especiais[(i + 1) % N];
      if (!(a.achada && b.achada)) continue;
      ctx.globalAlpha = 0.55 + completo * 0.4;
      ctx.strokeStyle = completo > 0 ? `rgba(255, 190, 220, 1)` : 'rgba(201, 216, 255, 1)';
      ctx.shadowColor = '#ff9ec4'; ctx.shadowBlur = 6 + completo * 14;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    // brilho rosa no centro quando completa
    if (completo > 0) {
      const g = ctx.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H * 0.5, Math.min(W, H) * 0.4);
      g.addColorStop(0, `rgba(255, 111, 165, ${0.28 * completo})`); g.addColorStop(1, 'rgba(255, 111, 165, 0)');
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // estrelas especiais
    for (const s of especiais) {
      s.brilho *= 0.95;
      const pulso = 0.5 + Math.sin(t * 2.2 + s.f) * 0.5;
      const hover = (s.x - mouse.px) ** 2 + (s.y - mouse.py) ** 2 < 900 ? 1 : 0;
      const r = (s.achada ? 9 : 6 + pulso * 4) + hover * 4 + s.brilho * 10;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.2);
      g.addColorStop(0, s.achada ? 'rgba(255, 214, 240, .9)' : 'rgba(255, 241, 184, .8)');
      g.addColorStop(1, 'rgba(255, 241, 184, 0)');
      ctx.globalAlpha = 0.6 + pulso * 0.4;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r * 3.2, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
      estrela4(s.x, s.y, r);
    }
    // estrelas cadentes (aleatórias + cliques)
    if (Math.random() < 0.006) cadentes.push({ x: Math.random() * W * 0.6 + W * 0.4, y: Math.random() * H * 0.3, vx: -7, vy: 3, vida: 1 });
    for (let i = cadentes.length - 1; i >= 0; i--) {
      const c = cadentes[i];
      c.x += c.vx; c.y += c.vy; c.vida -= 0.018;
      if (c.vida <= 0) { cadentes.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 12, c.y - c.vy * 12);
      g.addColorStop(0, `rgba(255,255,255,${c.vida})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 12, c.y - c.vy * 12); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  quadro();
})();

/* =========================================================
   VALES / RASPADINHAS
   ========================================================= */
(function vales() {
  const lista = document.getElementById('listaVales');
  VALES.forEach(v => {
    const el = document.createElement('div');
    el.className = 'vale';
    el.innerHTML = `
      <div class="vale-premio" style="--g:${v.g}">
        <span class="emoji">${v.emoji}</span>
        <small>Vale</small>
        <strong>${v.tit}</strong>
        <em>${v.obs}</em>
      </div>
      <canvas aria-label="Raspadinha: raspe para revelar"></canvas>`;
    lista.appendChild(el);
    const cv = el.querySelector('canvas');
    const ctx = cv.getContext('2d');
    let pronto = false, raspando = false, ultimo = null, cont = 0;

    function pintar() {
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(devicePixelRatio, 2);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, '#e9e4ef'); g.addColorStop(0.45, '#c9c2d4'); g.addColorStop(0.55, '#f4f1f8'); g.addColorStop(1, '#b8b0c6');
      ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
      // padrão de corações prateados
      ctx.fillStyle = 'rgba(255,255,255,.45)';
      ctx.font = '16px serif';
      for (let y = 18; y < r.height; y += 30) for (let x = (y / 30 % 2) * 18 + 10; x < r.width; x += 36) ctx.fillText('♥', x, y);
      ctx.fillStyle = 'rgba(80, 60, 100, .75)';
      ctx.textAlign = 'center';
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillText('RASPE AQUI', r.width / 2, r.height / 2 - 4);
      ctx.font = 'italic 500 22px "Cormorant Garamond", serif';
      ctx.fillText('uma surpresa ♥', r.width / 2, r.height / 2 + 22);
      ctx.globalCompositeOperation = 'destination-out';
      pronto = true;
    }
    requestAnimationFrame(pintar);
    document.fonts && document.fonts.ready.then(() => { if (!el.classList.contains('raspado')) { ctx.globalCompositeOperation = 'source-over'; pintar(); } });

    function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function raspar(p) {
      ctx.lineWidth = 38; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      if (ultimo) ctx.moveTo(ultimo.x, ultimo.y); else ctx.moveTo(p.x - 0.1, p.y);
      ctx.lineTo(p.x, p.y); ctx.stroke();
      ultimo = p;
      if (++cont % 8 === 0) verificar();
    }
    function verificar() {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let vazio = 0, total = 0;
      for (let i = 3; i < d.length; i += 64) { total++; if (d[i] === 0) vazio++; }
      if (vazio / total > 0.5) revelar();
    }
    function revelar() {
      if (el.classList.contains('raspado')) return;
      el.classList.add('raspado');
      const r = el.getBoundingClientRect();
      explodir(r.left + r.width / 2, r.top + r.height / 2, 16);
      somSino();
    }
    cv.addEventListener('pointerdown', e => { if (!pronto) return; raspando = true; ultimo = null; try { cv.setPointerCapture(e.pointerId); } catch (_) {} raspar(pos(e)); });
    cv.addEventListener('pointermove', e => { if (raspando) raspar(pos(e)); });
    const parar = () => { raspando = false; ultimo = null; };
    cv.addEventListener('pointerup', parar);
    cv.addEventListener('pointercancel', parar);
  });
})();

/* =========================================================
   REVELAR AO ROLAR
   ========================================================= */
const observador = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visivel'); observador.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.revelar').forEach(el => observador.observe(el));
