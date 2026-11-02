/* =========================================================
   TEXTOS (fácil de editar)
   ========================================================= */
const CARTA = `Mariana, meu amor,

Se a vida fosse uma estrada, eu queria percorrer cada quilômetro dela do seu lado — com a janela aberta, a nossa música tocando e a sua mão segurando a minha.

Você é o meu lugar favorito, o meu sorriso sem motivo e a parte mais bonita de todos os meus dias. Com você, até trânsito parado vira passeio, e qualquer tarde comum ganha um tom de rosa, igualzinho ao laço da Hello Kitty.

Obrigado por ser tão carinhosa, tão linda e tão você. Prometo ser seu co-piloto, seu porto seguro e o seu fã número um, pra sempre.

Te amo mais do que ontem e menos do que amanhã.

Com todo o meu amor,
Lucas 💗`;

const FRASES_KITTY = [
  'Mariana, você é a pessoa mais fofa do universo! 🌸',
  'Sabia que alguém aí te ama muuuito? 💕',
  'Até eu fico com ciúmes do seu laço de fofura 🎀',
  'Seu sorriso brilha mais que farol de BMW ✨',
  'Hoje é um ótimo dia pra ganhar um beijinho 😘',
  'Você + ele = combinação perfeita 💞',
  'Lembrete oficial: você é linda! 💖',
];

const MOTIVOS = [
  { e: '😊', t: 'Seu sorriso, que liga o meu dia mais rápido que partida de BMW.' },
  { e: '🎀', t: 'Esse seu jeitinho Hello Kitty de ser fofa sem nem tentar.' },
  { e: '🚗', t: 'Você é tipo uma BMW: linda, potente e única no mundo.', bmw: true },
  { e: '🤗', t: 'Seu abraço, que é o meu lugar favorito de estacionar.' },
  { e: '😂', t: 'As nossas risadas sem motivo nenhum.' },
  { e: '🌙', t: 'Porque é em você que eu penso antes de dormir — todo dia.' },
];

/* =========================================================
   CORAÇÕES DE CLIQUE
   ========================================================= */
const EMOJIS = ['💖', '💕', '💗', '🎀', '💘', '✨'];
function explodirCoracoes(x, y, qtd = 8) {
  for (let i = 0; i < qtd; i++) {
    const c = document.createElement('div');
    c.className = 'coracao-voa';
    c.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 90;
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    c.style.setProperty('--dy', Math.sin(ang) * dist - 40 + 'px');
    c.style.setProperty('--rot', (Math.random() * 80 - 40) + 'deg');
    c.style.fontSize = (16 + Math.random() * 16) + 'px';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1500);
  }
}
document.addEventListener('pointerdown', e => {
  if (e.target.closest('#scene')) return; // o canvas cuida dos próprios corações
  explodirCoracoes(e.clientX, e.clientY, 5);
});

function chuvaDeCoracoes(qtd = 60) {
  for (let i = 0; i < qtd; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'chuva';
      c.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.fontSize = (18 + Math.random() * 26) + 'px';
      c.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }, i * 60);
  }
}

/* =========================================================
   NOME ANIMADO
   ========================================================= */
const nomeEl = document.getElementById('nome');
nomeEl.innerHTML = [...'Mariana'].map((l, i) =>
  `<span style="animation-delay:${i * 0.12}s">${l}</span>`).join('');

/* =========================================================
   SONS (Web Audio — sem arquivos externos)
   ========================================================= */
let audioCtx = null;
function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function somMotor() {
  const a = ctx(), t = a.currentTime;
  const osc = a.createOscillator(), osc2 = a.createOscillator();
  const filtro = a.createBiquadFilter(), g = a.createGain();
  osc.type = 'sawtooth'; osc2.type = 'square';
  osc.frequency.setValueAtTime(55, t);
  osc.frequency.exponentialRampToValueAtTime(190, t + 0.9);
  osc.frequency.exponentialRampToValueAtTime(120, t + 1.1);
  osc.frequency.exponentialRampToValueAtTime(240, t + 1.9);
  osc.frequency.exponentialRampToValueAtTime(60, t + 2.6);
  osc2.frequency.setValueAtTime(27.5, t);
  osc2.frequency.exponentialRampToValueAtTime(120, t + 1.9);
  osc2.frequency.exponentialRampToValueAtTime(30, t + 2.6);
  filtro.type = 'lowpass'; filtro.frequency.value = 700;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.1);
  g.gain.setValueAtTime(0.18, t + 1.9);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.7);
  osc.connect(filtro); osc2.connect(filtro); filtro.connect(g); g.connect(a.destination);
  osc.start(t); osc2.start(t); osc.stop(t + 2.8); osc2.stop(t + 2.8);
}
function somBuzina() {
  const a = ctx(), t = a.currentTime;
  [[0, 0.18], [0.25, 0.32]].forEach(([ini, fim]) => {
    [415, 523].forEach(f => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + ini);
      g.gain.exponentialRampToValueAtTime(0.07, t + ini + 0.02);
      g.gain.setValueAtTime(0.07, t + fim - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + fim);
      o.connect(g); g.connect(a.destination);
      o.start(t + ini); o.stop(t + fim + 0.02);
    });
  });
}
function somFofo() {
  const a = ctx(), t = a.currentTime;
  [880, 1175, 1568].forEach((f, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t + i * 0.08);
    g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.08 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.3);
    o.connect(g); g.connect(a.destination);
    o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.35);
  });
}

/* =========================================================
   CENA 3D — BMW + corações + laço
   ========================================================= */
(function cena3D() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf7a1c4, 14, 30);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

  // luzes
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffb3d1, 0.9));
  const sol = new THREE.DirectionalLight(0xffffff, 1.4);
  sol.position.set(5, 9, 6);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  sol.shadow.camera.left = -5; sol.shadow.camera.right = 5;
  sol.shadow.camera.top = 5; sol.shadow.camera.bottom = -5;
  scene.add(sol);
  const rosaLuz = new THREE.PointLight(0xff4f9a, 1.2, 14);
  rosaLuz.position.set(-4, 3, -3);
  scene.add(rosaLuz);
  const azulLuz = new THREE.PointLight(0x4f8fff, 0.9, 14);
  azulLuz.position.set(4, 2, -4);
  scene.add(azulLuz);

  // plataforma
  const plataforma = new THREE.Mesh(
    new THREE.CylinderGeometry(3.6, 3.8, 0.25, 64),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1 })
  );
  plataforma.position.y = -0.125;
  plataforma.receiveShadow = true;
  scene.add(plataforma);
  const anel = new THREE.Mesh(
    new THREE.TorusGeometry(3.7, 0.05, 12, 100),
    new THREE.MeshBasicMaterial({ color: 0xff2d6f })
  );
  anel.rotation.x = Math.PI / 2;
  anel.position.y = 0.01;
  scene.add(anel);

  /* ---------- BMW estilizada ---------- */
  const carro = new THREE.Group();
  scene.add(carro);

  const pintura = new THREE.MeshPhysicalMaterial({
    color: 0xff7eb3, metalness: 0.55, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08
  });
  const vidro = new THREE.MeshPhysicalMaterial({ color: 0x1a1a2a, metalness: 0.2, roughness: 0.05, clearcoat: 1 });
  const cromado = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1, roughness: 0.2 });
  const preto = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
  const pneuMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
  const farolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xbfe0ff, emissiveIntensity: 0.4 });
  const lanternaMat = new THREE.MeshStandardMaterial({ color: 0xff1a3c, emissive: 0xff0022, emissiveIntensity: 0.8 });

  // perfil lateral (cupê) com caixas de roda
  const perfil = new THREE.Shape();
  perfil.moveTo(-2.1, 0.35);
  perfil.lineTo(-1.78, 0.35);
  perfil.absarc(-1.3, 0.38, 0.48, Math.PI, 0, true);
  perfil.lineTo(0.82, 0.35);
  perfil.absarc(1.3, 0.38, 0.48, Math.PI, 0, true);
  perfil.lineTo(2.15, 0.35);
  perfil.lineTo(2.22, 0.55);
  perfil.quadraticCurveTo(2.22, 0.82, 1.9, 0.86);
  perfil.lineTo(0.85, 0.96);
  perfil.lineTo(0.15, 1.42);
  perfil.quadraticCurveTo(-0.45, 1.5, -1.0, 1.4);
  perfil.lineTo(-1.65, 1.0);
  perfil.lineTo(-2.1, 0.95);
  perfil.quadraticCurveTo(-2.26, 0.9, -2.22, 0.6);
  perfil.lineTo(-2.1, 0.35);
  const corpoGeo = new THREE.ExtrudeGeometry(perfil, {
    depth: 1.7, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.06, bevelSegments: 5, curveSegments: 28
  });
  corpoGeo.translate(0, 0, -0.85);
  const corpo = new THREE.Mesh(corpoGeo, pintura);
  corpo.castShadow = true;
  carro.add(corpo);

  // para-brisa + vidro traseiro
  const vidroPerfil = new THREE.Shape();
  vidroPerfil.moveTo(0.92, 0.94);
  vidroPerfil.lineTo(0.17, 1.44);
  vidroPerfil.lineTo(-0.95, 1.4);
  vidroPerfil.lineTo(-1.7, 0.97);
  vidroPerfil.lineTo(0.92, 0.94);
  const vidroGeo = new THREE.ExtrudeGeometry(vidroPerfil, {
    depth: 1.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.06, bevelSegments: 2
  });
  vidroGeo.translate(0, 0, -0.7);
  carro.add(new THREE.Mesh(vidroGeo, vidro));

  // janelas laterais
  const janela = new THREE.Shape();
  janela.moveTo(0.72, 1.0);
  janela.lineTo(0.2, 1.34);
  janela.quadraticCurveTo(-0.45, 1.4, -0.92, 1.33);
  janela.lineTo(-1.45, 1.02);
  janela.lineTo(0.72, 1.0);
  const janelaGeo = new THREE.ExtrudeGeometry(janela, { depth: 1.94, bevelEnabled: false });
  janelaGeo.translate(0, 0, -0.97);
  carro.add(new THREE.Mesh(janelaGeo, vidro));
  // coluna B
  const colunaB = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 1.96), pintura);
  colunaB.position.set(-0.35, 1.18, 0);
  colunaB.rotation.z = -0.15;
  carro.add(colunaB);

  // grade "duplo rim"
  [-0.18, 0.18].forEach(z => {
    const moldura = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.3), cromado);
    moldura.position.set(2.24, 0.62, z);
    carro.add(moldura);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.24), preto);
    rim.position.set(2.27, 0.62, z);
    carro.add(rim);
    for (let i = -2; i <= 2; i++) {
      const barra = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.012), cromado);
      barra.position.set(2.3, 0.62, z + i * 0.045);
      carro.add(barra);
    }
  });

  // faróis "angel eyes"
  const angelEyes = [];
  [-1, 1].forEach(lado => {
    const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.42), preto);
    caixa.position.set(2.17, 0.72, lado * 0.6);
    carro.add(caixa);
    [0.5, 0.7].forEach(z => {
      const anelLuz = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 24), farolMat);
      anelLuz.rotation.y = Math.PI / 2;
      anelLuz.position.set(2.23, 0.72, lado * z);
      carro.add(anelLuz);
      angelEyes.push(anelLuz);
    });
  });
  // lanternas
  [-1, 1].forEach(lado => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.45), lanternaMat);
    l.position.set(-2.24, 0.8, lado * 0.58);
    carro.add(l);
  });

  // faróis de verdade (spot) — ligam/desligam
  const spots = [];
  [-0.6, 0.6].forEach(z => {
    const s = new THREE.SpotLight(0xdff0ff, 0, 9, 0.45, 0.6);
    s.position.set(2.3, 0.72, z);
    s.target.position.set(6, 0, z);
    carro.add(s); carro.add(s.target);
    spots.push(s);
  });

  // logo BMW (textura desenhada em canvas)
  function texturaLogo() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#111'; g.beginPath(); g.arc(128, 128, 126, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#ccc'; g.lineWidth = 6; g.stroke();
    const quad = ['#1c69d4', '#fff', '#1c69d4', '#fff'];
    quad.forEach((cor, i) => {
      g.fillStyle = cor;
      g.beginPath(); g.moveTo(128, 128);
      g.arc(128, 128, 72, -Math.PI / 2 + i * Math.PI / 2, i * Math.PI / 2);
      g.fill();
    });
    g.strokeStyle = '#ccc'; g.lineWidth = 4;
    g.beginPath(); g.arc(128, 128, 72, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#fff'; g.font = 'bold 40px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    [['B', -0.75], ['M', 0], ['W', 0.75]].forEach(([letra, ang]) => {
      g.save(); g.translate(128, 128); g.rotate(ang);
      g.fillText(letra, 0, -98); g.restore();
    });
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }
  const logoTex = texturaLogo();
  const logoMat = new THREE.MeshStandardMaterial({ map: logoTex, metalness: 0.3, roughness: 0.3 });
  const logoCapo = new THREE.Mesh(new THREE.CircleGeometry(0.12, 40), logoMat);
  logoCapo.rotation.x = -Math.PI / 2;
  logoCapo.rotation.z = -Math.PI / 2;
  logoCapo.rotation.y = -0.09;
  logoCapo.position.set(1.85, 0.935, 0);
  carro.add(logoCapo);
  const logoMala = logoCapo.clone();
  logoMala.rotation.set(0, -Math.PI / 2, 0);
  logoMala.position.set(-2.3, 0.72, 0);
  carro.add(logoMala);

  // rodas
  const rodas = [];
  function criarRoda() {
    const roda = new THREE.Group();
    const pneu = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 40), pneuMat);
    pneu.rotation.x = Math.PI / 2;
    pneu.castShadow = true;
    roda.add(pneu);
    const aro = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.32, 40), cromado);
    aro.rotation.x = Math.PI / 2;
    roda.add(aro);
    const miolo = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.33, 40), preto);
    miolo.rotation.x = Math.PI / 2;
    roda.add(miolo);
    for (let i = 0; i < 5; i++) {
      const raio = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.34), cromado);
      raio.rotation.z = (i / 5) * Math.PI * 2;
      roda.add(raio);
    }
    const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.36, 20), cromado);
    cubo.rotation.x = Math.PI / 2;
    roda.add(cubo);
    return roda;
  }
  [[-1.3, -0.8], [-1.3, 0.8], [1.3, -0.8], [1.3, 0.8]].forEach(([x, z]) => {
    const r = criarRoda();
    r.position.set(x, 0.4, z);
    carro.add(r);
    rodas.push(r);
  });

  // laço Hello Kitty no teto
  const laco = new THREE.Group();
  const lacoMat = new THREE.MeshPhysicalMaterial({ color: 0xff2d6f, roughness: 0.35, clearcoat: 0.6 });
  [-1, 1].forEach(lado => {
    const aba = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), lacoMat);
    aba.scale.set(1.3, 0.95, 0.45);
    aba.position.set(lado * 0.24, 0, 0);
    aba.rotation.z = lado * -0.25;
    aba.castShadow = true;
    laco.add(aba);
  });
  const no = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 16), lacoMat);
  no.scale.set(1, 1, 0.7);
  no.position.z = 0.03;
  laco.add(no);
  laco.position.set(-0.45, 1.72, 0);
  carro.add(laco);

  carro.position.y = 0;
  carro.traverse(o => { if (o.isMesh) o.castShadow = true; });

  /* ---------- corações flutuantes ---------- */
  const forma = new THREE.Shape();
  forma.moveTo(5, 5);
  forma.bezierCurveTo(5, 5, 4, 0, 0, 0);
  forma.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  forma.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  forma.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  forma.bezierCurveTo(16, 7, 16, 0, 10, 0);
  forma.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const coracaoGeo = new THREE.ExtrudeGeometry(forma, {
    depth: 4, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.5, bevelSegments: 4, curveSegments: 20
  });
  coracaoGeo.center();
  coracaoGeo.rotateZ(Math.PI);
  coracaoGeo.scale(0.025, 0.025, 0.025);
  const coresCoracao = [0xff2d6f, 0xff7eb3, 0xffb3d1, 0xe0115f];
  const coracoes = [];
  for (let i = 0; i < 22; i++) {
    const m = new THREE.Mesh(coracaoGeo, new THREE.MeshPhysicalMaterial({
      color: coresCoracao[i % coresCoracao.length], roughness: 0.3, clearcoat: 1,
      emissive: 0xff2d6f, emissiveIntensity: 0.12
    }));
    const ang = Math.random() * Math.PI * 2;
    const raio = 4.3 + Math.random() * 2.3;
    m.position.set(Math.cos(ang) * raio, 0.8 + Math.random() * 4, Math.sin(ang) * raio);
    const s = 0.45 + Math.random() * 0.6;
    m.scale.setScalar(s);
    m.userData = { base: m.position.y, fase: Math.random() * 10, vel: 0.4 + Math.random() * 0.8 };
    scene.add(m);
    coracoes.push(m);
  }

  /* ---------- câmera com arrastar ---------- */
  let theta = 0.9, phi = 1.2, raioCam = 9;
  let arrastando = false, ultimoX = 0, ultimoY = 0, ultimoToque = 0, moveu = 0;
  const alvo = new THREE.Vector3(0, 0.8, 0);
  canvas.addEventListener('pointerdown', e => {
    arrastando = true; moveu = 0;
    ultimoX = e.clientX; ultimoY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!arrastando) return;
    const dx = e.clientX - ultimoX, dy = e.clientY - ultimoY;
    moveu += Math.abs(dx) + Math.abs(dy);
    theta -= dx * 0.008;
    phi = Math.min(1.45, Math.max(0.5, phi - dy * 0.006));
    ultimoX = e.clientX; ultimoY = e.clientY;
    ultimoToque = performance.now();
  });
  canvas.addEventListener('pointerup', e => {
    arrastando = false;
    if (moveu < 6) cliqueNoCarro(e);
  });
  canvas.addEventListener('pointercancel', () => { arrastando = false; });

  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  function cliqueNoCarro(e) {
    const r = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(mouse, camera);
    const hitCarro = ray.intersectObject(carro, true).length > 0;
    const hitCoracao = ray.intersectObjects(coracoes).length > 0;
    if (hitCarro) {
      explodirCoracoes(e.clientX, e.clientY, 14);
      pulo = 1; somFofo();
    } else if (hitCoracao) {
      explodirCoracoes(e.clientX, e.clientY, 8); somFofo();
    }
  }

  /* ---------- controles ---------- */
  let velocidadeRoda = 0, acelerando = 0, pulo = 0, faroisLigados = false;
  document.querySelectorAll('.cor').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cor').forEach(b => b.classList.remove('ativa'));
      btn.classList.add('ativa');
      pintura.color.set(btn.dataset.cor);
    });
  });
  document.getElementById('btnAcelerar').addEventListener('click', () => {
    acelerando = 2.4; somMotor();
  });
  document.getElementById('btnBuzina').addEventListener('click', e => {
    somBuzina(); pulo = 1;
    const r = e.currentTarget.getBoundingClientRect();
    explodirCoracoes(r.left + r.width / 2, r.top, 12);
  });
  document.getElementById('btnFarol').addEventListener('click', () => {
    faroisLigados = !faroisLigados;
    farolMat.emissiveIntensity = faroisLigados ? 2.5 : 0.4;
    spots.forEach(s => { s.intensity = faroisLigados ? 3 : 0; });
  });

  /* ---------- resize + loop ---------- */
  function redimensionar() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // em telas estreitas afasta a câmera pra o carro caber
    raioCam = w < h ? 12.5 : 9;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', redimensionar);
  redimensionar();

  let visivel = true;
  new IntersectionObserver(([en]) => { visivel = en.isIntersecting; }).observe(canvas);

  const relogio = new THREE.Clock();
  let tempo = 0;
  function animar() {
    requestAnimationFrame(animar);
    const dt = Math.min(relogio.getDelta(), 0.05);
    if (!visivel) return;
    tempo += dt;

    // giro automático quando ninguém está arrastando
    if (!arrastando && performance.now() - ultimoToque > 2500) theta += dt * 0.25;

    // aceleração
    if (acelerando > 0) {
      acelerando -= dt;
      velocidadeRoda = Math.min(velocidadeRoda + dt * 40, 35);
    } else {
      velocidadeRoda = Math.max(velocidadeRoda - dt * 18, 0);
    }
    rodas.forEach(r => { r.rotation.z -= velocidadeRoda * dt; });
    carro.rotation.z = acelerando > 0 ? 0.035 + Math.sin(tempo * 40) * 0.004 : carro.rotation.z * 0.9;
    carro.position.x = Math.sin(tempo * 50) * 0.008 * (velocidadeRoda / 35);
    anel.material.color.setHSL(0.93, 1, 0.55 + Math.sin(tempo * 3) * 0.08 + velocidadeRoda * 0.005);

    // pulinho
    if (pulo > 0) {
      pulo = Math.max(0, pulo - dt * 1.6);
      carro.position.y = Math.sin((1 - pulo) * Math.PI) * 0.35;
      laco.rotation.z = Math.sin((1 - pulo) * Math.PI * 4) * 0.3 * pulo;
    } else {
      carro.position.y = 0;
      laco.rotation.z = Math.sin(tempo * 2) * 0.06;
    }

    // corações
    coracoes.forEach(c => {
      const u = c.userData;
      c.position.y = u.base + Math.sin(tempo * u.vel + u.fase) * 0.4;
      c.rotation.y += dt * u.vel;
    });

    // câmera
    camera.position.set(
      alvo.x + raioCam * Math.sin(phi) * Math.cos(theta),
      alvo.y + raioCam * Math.cos(phi),
      alvo.z + raioCam * Math.sin(phi) * Math.sin(theta)
    );
    camera.lookAt(alvo);
    renderer.render(scene, camera);
  }
  animar();
})();

/* =========================================================
   HELLO KITTY
   ========================================================= */
const kittyCard = document.getElementById('kittyCard');
const balao = document.getElementById('balao');
const lacoSvg = document.getElementById('laco');
let fraseIdx = 0;
kittyCard.addEventListener('pointermove', e => {
  const r = kittyCard.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  kittyCard.style.transform = `rotateY(${x * 28}deg) rotateX(${-y * 28}deg)`;
});
kittyCard.addEventListener('pointerleave', () => { kittyCard.style.transform = ''; });
kittyCard.addEventListener('click', () => {
  balao.textContent = FRASES_KITTY[fraseIdx % FRASES_KITTY.length];
  fraseIdx++;
  balao.classList.add('pop');
  setTimeout(() => balao.classList.remove('pop'), 300);
  lacoSvg.classList.remove('balanca');
  void lacoSvg.getBoundingClientRect();
  lacoSvg.classList.add('balanca');
  somFofo();
});

/* =========================================================
   CARTA
   ========================================================= */
const envelope = document.getElementById('envelope');
const textoCarta = document.getElementById('textoCarta');
let cartaAberta = false;
function abrirCarta() {
  if (cartaAberta) return;
  cartaAberta = true;
  envelope.classList.add('aberto');
  document.getElementById('cliqueCarta').style.visibility = 'hidden';
  somFofo();
  setTimeout(() => {
    textoCarta.classList.add('mostrar');
    let i = 0;
    const cursor = '<span class="cursor-digita"></span>';
    const escrever = () => {
      i++;
      textoCarta.innerHTML = CARTA.slice(0, i).replace(/</g, '&lt;') + cursor;
      if (i < CARTA.length) {
        const ch = CARTA[i - 1];
        setTimeout(escrever, ch === '\n' ? 220 : ch === ',' || ch === '.' ? 120 : 28);
      } else {
        textoCarta.innerHTML = CARTA.replace(/</g, '&lt;');
      }
    };
    escrever();
  }, 1100);
}
envelope.addEventListener('click', abrirCarta);
envelope.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirCarta(); } });

/* =========================================================
   MOTIVOS (cards que viram em 3D)
   ========================================================= */
const grade = document.getElementById('grade');
MOTIVOS.forEach((m, i) => {
  const card = document.createElement('div');
  card.className = 'flip';
  card.innerHTML = `
    <div class="flip-inner">
      <div class="face frente"><div class="emoji">${m.e}</div><b>Motivo #${i + 1}</b><small>toque para virar</small></div>
      <div class="face verso${m.bmw ? ' bmw' : ''}">${m.t}</div>
    </div>`;
  card.addEventListener('click', () => card.classList.toggle('virado'));
  grade.appendChild(card);
});

/* =========================================================
   PERGUNTA FINAL
   ========================================================= */
const btnNao = document.getElementById('btnNao');
const textosNao = ['Não', 'Tem certeza?', 'Pensa bem...', 'Errou o botão 😜', 'Impossível!', 'Nem tenta 💕'];
let fugas = 0;
function fugir() {
  btnNao.classList.add('fugindo');
  const w = btnNao.offsetWidth, h = btnNao.offsetHeight;
  btnNao.style.left = Math.random() * (window.innerWidth - w - 20) + 10 + 'px';
  btnNao.style.top = Math.random() * (window.innerHeight - h - 20) + 10 + 'px';
  btnNao.textContent = textosNao[++fugas % textosNao.length];
}
btnNao.addEventListener('pointerenter', fugir);
btnNao.addEventListener('click', e => { e.preventDefault(); fugir(); });

document.getElementById('btnSim').addEventListener('click', () => {
  document.getElementById('resposta').classList.add('mostrar');
  btnNao.style.display = 'none';
  chuvaDeCoracoes(80);
  somFofo();
});

/* =========================================================
   REVELAR AO ROLAR
   ========================================================= */
const obs = new IntersectionObserver(entradas => {
  entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visivel'); obs.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.revelar').forEach(el => obs.observe(el));
