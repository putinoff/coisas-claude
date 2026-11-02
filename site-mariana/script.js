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
  { tit: 'Seu sorriso', t: 'Ele liga o meu dia mais rápido que a partida de uma BMW.' },
  { tit: 'Seu jeitinho', t: 'Essa fofura de Hello Kitty que você tem sem nem tentar.' },
  { tit: 'Única', t: 'Você é tipo uma BMW: linda, potente e sem igual no mundo.', bmw: true },
  { tit: 'Seu abraço', t: 'O meu lugar favorito para estacionar.' },
  { tit: 'Nossas risadas', t: 'Aquelas sem motivo nenhum, que viram as melhores lembranças.' },
  { tit: 'Todo dia', t: 'Porque é em você que eu penso antes de dormir — e ao acordar.' },
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
   SHOWROOM 3D
   ========================================================= */
(function showroom() {
  const canvas = document.getElementById('scene');
  const carregando = document.getElementById('carregando');
  if (typeof THREE === 'undefined') { carregando.textContent = 'Não foi possível carregar o 3D.'; return; }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0c0b0e, 11, 26);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  /* ---------- reflexos: um "estúdio" virtual vira mapa de ambiente ---------- */
  (function ambiente() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const estudio = new THREE.Scene();
    estudio.add(new THREE.Mesh(
      new THREE.BoxGeometry(30, 14, 30),
      new THREE.MeshBasicMaterial({ color: 0x141116, side: THREE.BackSide })
    ));
    const painel = (w, h, cor, forca, pos, rot) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(cor).multiplyScalar(forca), side: THREE.DoubleSide })
      );
      m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      estudio.add(m);
    };
    painel(18, 4, 0xffffff, 4, [0, 6.8, 0], [Math.PI / 2, 0, 0]);
    painel(10, 3, 0xffffff, 2.5, [-14.8, 3, 2], [0, Math.PI / 2, 0]);
    painel(10, 3, 0xffc6d6, 2.5, [14.8, 3, -2], [0, -Math.PI / 2, 0]);
    painel(14, 1.2, 0xffffff, 2, [0, 1.5, -14.8]);
    painel(14, 1.2, 0xffe0ea, 1.6, [0, 1.5, 14.8], [0, Math.PI, 0]);
    scene.environment = pmrem.fromScene(estudio, 0.035).texture;
    pmrem.dispose();
  })();

  /* ---------- luzes ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1a20, 0.35));
  const chave = new THREE.DirectionalLight(0xffffff, 1.5);
  chave.position.set(3, 9, 4);
  chave.castShadow = true;
  chave.shadow.mapSize.set(2048, 2048);
  Object.assign(chave.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
  chave.shadow.bias = -0.0004;
  chave.shadow.radius = 4;
  scene.add(chave);
  const contraRosa = new THREE.SpotLight(0xff6f9c, 3, 18, 0.6, 1);
  contraRosa.position.set(-6, 4, -5);
  scene.add(contraRosa);
  const contraAzul = new THREE.SpotLight(0x6f9cff, 2, 18, 0.6, 1);
  contraAzul.position.set(6, 3, -6);
  scene.add(contraAzul);

  /* ---------- texturas desenhadas em canvas ---------- */
  function gradienteRadial(cores, tam = 256) {
    const c = document.createElement('canvas');
    c.width = c.height = tam;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(tam / 2, tam / 2, 0, tam / 2, tam / 2, tam / 2);
    cores.forEach(([p, cor]) => grd.addColorStop(p, cor));
    g.fillStyle = grd;
    g.fillRect(0, 0, tam, tam);
    return new THREE.CanvasTexture(c);
  }
  function texturaLogo() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const anel = g.createLinearGradient(0, 0, 256, 256);
    anel.addColorStop(0, '#f2f2f2'); anel.addColorStop(0.5, '#8d8d8d'); anel.addColorStop(1, '#e6e6e6');
    g.fillStyle = anel; g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#0d0d0f'; g.beginPath(); g.arc(128, 128, 118, 0, Math.PI * 2); g.fill();
    ['#1c69d4', '#ffffff', '#1c69d4', '#ffffff'].forEach((cor, i) => {
      g.fillStyle = cor;
      g.beginPath(); g.moveTo(128, 128);
      g.arc(128, 128, 74, -Math.PI / 2 + i * Math.PI / 2, i * Math.PI / 2);
      g.fill();
    });
    g.strokeStyle = '#bdbdbd'; g.lineWidth = 5;
    g.beginPath(); g.arc(128, 128, 74, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#fff'; g.font = '600 38px Helvetica, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    [['B', -0.72], ['M', 0], ['W', 0.72]].forEach(([l, a]) => {
      g.save(); g.translate(128, 128); g.rotate(a); g.fillText(l, 0, -96); g.restore();
    });
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }
  function texturaPlaca(texto) {
    const c = document.createElement('canvas');
    c.width = 520; c.height = 170;
    const g = c.getContext('2d');
    g.fillStyle = '#f5f5f2'; g.fillRect(0, 0, 520, 170);
    g.fillStyle = '#0a3d91'; g.fillRect(0, 0, 520, 42);
    g.fillStyle = '#fff'; g.font = '600 24px Helvetica, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('BRASIL', 260, 22);
    // bandeirinha
    g.fillStyle = '#009c3b'; g.fillRect(462, 9, 40, 26);
    g.fillStyle = '#ffdf00'; g.beginPath(); g.moveTo(482, 11); g.lineTo(499, 22); g.lineTo(482, 33); g.lineTo(465, 22); g.fill();
    g.fillStyle = '#002776'; g.beginPath(); g.arc(482, 22, 6, 0, Math.PI * 2); g.fill();
    // texto da placa
    g.fillStyle = '#151515';
    g.font = 'bold 96px "Arial Narrow", Arial, sans-serif';
    const largura = g.measureText(texto).width;
    g.save();
    g.translate(260, 110);
    g.scale(Math.min(1, 470 / largura), 1);
    g.fillText(texto, 0, 0);
    g.restore();
    g.strokeStyle = '#222'; g.lineWidth = 8; g.strokeRect(4, 4, 512, 162);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  /* ---------- piso do showroom ---------- */
  const piso = new THREE.Mesh(
    new THREE.CircleGeometry(16, 96),
    new THREE.MeshStandardMaterial({
      color: 0x0e0c10, roughness: 0.75, metalness: 0.2, envMapIntensity: 0.3,
      alphaMap: gradienteRadial([[0, '#fff'], [0.45, '#fff'], [1, '#000']]),
      transparent: true,
    })
  );
  piso.rotation.x = -Math.PI / 2;
  piso.receiveShadow = true;
  scene.add(piso);

  const sombraContato = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 2.8),
    new THREE.MeshBasicMaterial({
      map: gradienteRadial([[0, 'rgba(0,0,0,0.85)'], [0.55, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]),
      transparent: true, depthWrite: false,
    })
  );
  sombraContato.rotation.x = -Math.PI / 2;
  sombraContato.position.y = 0.004;
  scene.add(sombraContato);

  const brilhoChao = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 11),
    new THREE.MeshBasicMaterial({
      map: gradienteRadial([[0, 'rgba(255,120,160,0.18)'], [0.5, 'rgba(255,120,160,0.04)'], [1, 'rgba(255,120,160,0)']]),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
  );
  brilhoChao.rotation.x = -Math.PI / 2;
  brilhoChao.position.y = 0.002;
  scene.add(brilhoChao);

  const aro = new THREE.Mesh(
    new THREE.TorusGeometry(3.6, 0.008, 8, 160),
    new THREE.MeshBasicMaterial({ color: 0xe3a3b7 })
  );
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.01;
  scene.add(aro);

  /* ---------- materiais do carro ---------- */
  const M = {
    pintura: new THREE.MeshPhysicalMaterial({
      color: 0xd9849f, metalness: 0.55, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.3,
    }),
    vidro: new THREE.MeshPhysicalMaterial({ color: 0x07080b, metalness: 0.9, roughness: 0.04, clearcoat: 1, envMapIntensity: 1.6 }),
    cromo: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.08 }),
    pretoBrilho: new THREE.MeshStandardMaterial({ color: 0x060606, metalness: 0.6, roughness: 0.15 }),
    pretoFosco: new THREE.MeshStandardMaterial({ color: 0x0c0c0c, metalness: 0.1, roughness: 0.6 }),
    pneu: new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.88, side: THREE.DoubleSide }),
    roda: new THREE.MeshStandardMaterial({ color: 0x3a3d43, metalness: 1, roughness: 0.28 }),
    disco: new THREE.MeshStandardMaterial({ color: 0x8a8a8a, metalness: 1, roughness: 0.45 }),
    pinca: new THREE.MeshStandardMaterial({ color: 0x1c69d4, metalness: 0.3, roughness: 0.35 }),
    farol: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcfe6ff, emissiveIntensity: 0.25 }),
    lanterna: new THREE.MeshStandardMaterial({ color: 0x4a0008, emissive: 0xff1030, emissiveIntensity: 0.35 }),
    logo: new THREE.MeshStandardMaterial({ map: texturaLogo(), metalness: 0.4, roughness: 0.25 }),
    placa: new THREE.MeshStandardMaterial({ map: texturaPlaca('MARIANA'), roughness: 0.45 }),
    laco: new THREE.MeshPhysicalMaterial({ color: 0xd63b6b, roughness: 0.4, clearcoat: 0.7 }),
  };

  const carro = new THREE.Group();
  scene.add(carro);
  const add = (geo, mat, pos, rot, pai = carro) => {
    const m = new THREE.Mesh(geo, mat);
    if (pos) m.position.set(...pos);
    if (rot) m.rotation.set(...rot);
    m.castShadow = true;
    pai.add(m);
    return m;
  };
  const retArredondado = (w, h, r) => {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };

  // carroceria (perfil lateral de cupê, com caixas de roda)
  const perfil = new THREE.Shape();
  perfil.moveTo(-2.15, 0.32);
  perfil.lineTo(-1.87, 0.32);
  perfil.absarc(-1.35, 0.4, 0.52, Math.PI, 0, true);
  perfil.lineTo(0.83, 0.32);
  perfil.absarc(1.35, 0.4, 0.52, Math.PI, 0, true);
  perfil.lineTo(2.1, 0.32);
  perfil.quadraticCurveTo(2.32, 0.34, 2.33, 0.55);
  perfil.quadraticCurveTo(2.33, 0.8, 2.05, 0.86);
  perfil.quadraticCurveTo(1.4, 0.95, 0.8, 1.0);
  perfil.lineTo(-1.7, 1.02);
  perfil.quadraticCurveTo(-2.15, 1.02, -2.25, 0.9);
  perfil.quadraticCurveTo(-2.32, 0.6, -2.25, 0.4);
  perfil.lineTo(-2.15, 0.32);
  const corpoGeo = new THREE.ExtrudeGeometry(perfil, {
    depth: 1.5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.1, bevelSegments: 10, curveSegments: 40,
  });
  corpoGeo.translate(0, 0, -0.75);
  add(corpoGeo, M.pintura);

  // cabine de vidro (mais estreita que a carroceria, como num carro de verdade)
  const cabine = new THREE.Shape();
  cabine.moveTo(0.78, 0.98);
  cabine.quadraticCurveTo(0.35, 1.22, 0.02, 1.4);
  cabine.quadraticCurveTo(-0.55, 1.51, -1.1, 1.41);
  cabine.quadraticCurveTo(-1.55, 1.25, -1.88, 1.0);
  cabine.lineTo(0.78, 0.98);
  const cabineGeo = new THREE.ExtrudeGeometry(cabine, {
    depth: 1.1, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.06, bevelSegments: 8, curveSegments: 32,
  });
  cabineGeo.translate(0, 0, -0.55);
  add(cabineGeo, M.vidro);

  // grade "duplo rim"
  [-0.18, 0.18].forEach(z => {
    const moldura = retArredondado(0.3, 0.25, 0.08);
    moldura.holes.push(retArredondado(0.25, 0.2, 0.06));
    add(new THREE.ExtrudeGeometry(moldura, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }),
      M.cromo, [2.39, 0.64, z], [0, Math.PI / 2, 0]);
    add(new THREE.ExtrudeGeometry(retArredondado(0.26, 0.21, 0.065), { depth: 0.02, bevelEnabled: false }),
      M.pretoBrilho, [2.38, 0.64, z], [0, Math.PI / 2, 0]);
    for (let i = -3; i <= 3; i++) add(new THREE.BoxGeometry(0.02, 0.2, 0.008), M.cromo, [2.415, 0.64, z + i * 0.034]);
  });

  // faróis com "angel eyes"
  const olhosAnjo = [];
  [-1, 1].forEach(l => {
    add(new THREE.BoxGeometry(0.12, 0.1, 0.42), M.pretoBrilho, [2.34, 0.74, l * 0.62], [0, 0, -0.35]);
    [0.52, 0.72].forEach(z => {
      olhosAnjo.push(add(new THREE.TorusGeometry(0.048, 0.009, 8, 32), M.farol, [2.405, 0.745, l * z], [0, Math.PI / 2, 0]));
      add(new THREE.CircleGeometry(0.04, 24), M.cromo, [2.398, 0.745, l * z], [0, Math.PI / 2, 0]);
    });
  });
  // entrada de ar, splitter e placa dianteira
  add(new THREE.BoxGeometry(0.06, 0.12, 1.5), M.pretoBrilho, [2.38, 0.42, 0]);
  add(new THREE.BoxGeometry(0.3, 0.03, 1.7), M.pretoFosco, [2.25, 0.25, 0]);
  add(new THREE.PlaneGeometry(0.44, 0.144), M.placa, [2.425, 0.43, 0], [0, Math.PI / 2, 0]);

  // traseira: lanternas em L, difusor, escapes, placa e logo
  [-1, 1].forEach(l => {
    add(new THREE.BoxGeometry(0.05, 0.07, 0.42), M.lanterna, [-2.33, 0.9, l * 0.6]);
    add(new THREE.BoxGeometry(0.05, 0.16, 0.07), M.lanterna, [-2.33, 0.84, l * 0.78]);
    const escape = add(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 24, 1, true), M.cromo, [-2.3, 0.3, l * 0.55], [0, 0, Math.PI / 2]);
    escape.material = M.cromo;
    add(new THREE.CircleGeometry(0.042, 24), M.pretoFosco, [-2.31, 0.3, l * 0.55], [0, -Math.PI / 2, 0]);
  });
  add(new THREE.BoxGeometry(0.1, 0.08, 1.0), M.pretoFosco, [-2.3, 0.3, 0]);
  add(new THREE.PlaneGeometry(0.44, 0.144), M.placa, [-2.385, 0.58, 0], [0, -Math.PI / 2, 0]);
  add(new THREE.CircleGeometry(0.075, 40), M.logo, [-2.392, 0.79, 0], [0, -Math.PI / 2, 0]);

  // logo no capô
  const logoCapo = new THREE.Group();
  logoCapo.position.set(2.02, 0.968, 0);
  logoCapo.rotation.z = -0.12;
  add(new THREE.CircleGeometry(0.075, 40), M.logo, [0, 0, 0], [-Math.PI / 2, 0, -Math.PI / 2], logoCapo);
  carro.add(logoCapo);

  // detalhes laterais: retrovisores, maçanetas, frisos e saia
  [-1, 1].forEach(l => {
    add(new THREE.BoxGeometry(0.08, 0.035, 0.1), M.pretoFosco, [0.66, 1.06, l * 0.98]);
    add(new THREE.SphereGeometry(0.1, 24, 16), M.pintura, [0.64, 1.09, l * 1.04]).scale.set(1.1, 0.55, 0.55);
    add(new THREE.BoxGeometry(0.16, 0.025, 0.02), M.cromo, [-0.45, 0.92, l * 0.955]);
    add(new THREE.BoxGeometry(0.008, 0.6, 0.006), M.pretoFosco, [0.79, 0.66, l * 0.951]);
    add(new THREE.BoxGeometry(0.008, 0.6, 0.006), M.pretoFosco, [-0.8, 0.66, l * 0.951]);
    add(new THREE.BoxGeometry(1.62, 0.07, 0.05), M.pretoFosco, [0, 0.27, l * 0.93]);
  });

  // antena "barbatana" com um lacinho da Kitty
  add(new THREE.ConeGeometry(0.045, 0.12, 20), M.pretoBrilho, [-1.0, 1.52, 0]).scale.set(2.4, 1, 0.7);
  const laco = new THREE.Group();
  laco.position.set(-1.0, 1.62, 0);
  [-1, 1].forEach(l => {
    const aba = add(new THREE.SphereGeometry(0.06, 20, 14), M.laco, [l * 0.07, 0, 0], [0, 0, l * -0.3], laco);
    aba.scale.set(1.3, 0.95, 0.5);
  });
  add(new THREE.SphereGeometry(0.03, 16, 12), M.laco, [0, 0, 0.01], null, laco);
  carro.add(laco);

  // rodas com raios em V, disco e pinça M azul
  const rodas = [];
  function criarRoda(lado) {
    const roda = new THREE.Group();
    const giro = new THREE.Group();
    roda.add(giro);
    const perfilPneu = [[0.27, -0.13], [0.35, -0.142], [0.39, -0.128], [0.404, -0.07], [0.404, 0.07], [0.39, 0.128], [0.35, 0.142], [0.27, 0.13]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    add(new THREE.LatheGeometry(perfilPneu, 64), M.pneu, null, [Math.PI / 2, 0, 0], giro);
    add(new THREE.CylinderGeometry(0.272, 0.272, 0.24, 48, 1, true), M.roda, null, [Math.PI / 2, 0, 0], giro).material.side = THREE.DoubleSide;
    add(new THREE.TorusGeometry(0.266, 0.01, 8, 64), M.cromo, [0, 0, 0.115], null, giro);
    const raioGeo = new THREE.BoxGeometry(0.25, 0.034, 0.03);
    raioGeo.translate(0.135, 0, 0);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      [-0.13, 0.13].forEach(k => add(raioGeo, M.roda, [0, 0, 0.1], [0, 0, a + k], giro));
    }
    add(new THREE.CylinderGeometry(0.07, 0.078, 0.05, 32), M.roda, [0, 0, 0.1], [Math.PI / 2, 0, 0], giro);
    add(new THREE.CircleGeometry(0.038, 32), M.logo, [0, 0, 0.127], null, giro);
    add(new THREE.CylinderGeometry(0.21, 0.21, 0.022, 48), M.disco, [0, 0, -0.01], [Math.PI / 2, 0, 0], giro);
    add(new THREE.BoxGeometry(0.11, 0.17, 0.07), M.pinca, [0.12, 0.13, 0.02], [0, 0, -0.75], roda);
    roda.rotation.y = lado > 0 ? 0 : Math.PI;
    roda.userData.sentido = lado > 0 ? -1 : 1;
    roda.userData.giro = giro;
    return roda;
  }
  [[-1.35, 1], [1.35, 1], [-1.35, -1], [1.35, -1]].forEach(([x, l]) => {
    const r = criarRoda(l);
    r.position.set(x, 0.404, l * 0.79);
    carro.add(r);
    rodas.push(r);
  });

  // faróis de verdade (iluminam o chão quando ligados)
  const fachos = [-0.6, 0.6].map(z => {
    const s = new THREE.SpotLight(0xe6f1ff, 0, 12, 0.42, 0.7, 1);
    s.position.set(2.4, 0.74, z);
    s.target.position.set(7, 0, z * 1.5);
    carro.add(s, s.target);
    return s;
  });

  /* ---------- partículas de luz (bokeh) ---------- */
  const N = 220;
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 9;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * 7;
    pos[i * 3 + 2] = Math.sin(a) * r;
    vel[i] = 0.08 + Math.random() * 0.25;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particulas = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.09, color: 0xffb8cc, transparent: true, opacity: 0.7, depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: gradienteRadial([[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.5)'], [1, 'rgba(255,255,255,0)']], 64),
  }));
  scene.add(particulas);

  /* ---------- câmera: arrastar para girar ---------- */
  const alvo = new THREE.Vector3(0, 0.75, 0);
  let theta = 0.75, phi = 1.28, raioBase = 10, raio = 18;
  let arrastando = false, ultX = 0, ultY = 0, ultimoToque = -1e9, movido = 0;
  let velTheta = 0;
  canvas.addEventListener('pointerdown', e => {
    arrastando = true; movido = 0; ultX = e.clientX; ultY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!arrastando) return;
    const dx = e.clientX - ultX, dy = e.clientY - ultY;
    movido += Math.abs(dx) + Math.abs(dy);
    velTheta = -dx * 0.006;
    theta += velTheta;
    phi = Math.min(1.48, Math.max(0.75, phi - dy * 0.004));
    ultX = e.clientX; ultY = e.clientY;
    ultimoToque = performance.now();
  });
  canvas.addEventListener('pointerup', e => { arrastando = false; if (movido < 6) toque(e); });
  canvas.addEventListener('pointercancel', () => { arrastando = false; });

  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  function toque(e) {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    if (ray.intersectObject(carro, true).length) {
      explodir(e.clientX, e.clientY, 14);
      somSino();
      piscar = 1;
    }
  }

  /* ---------- painel ---------- */
  const corAlvo = new THREE.Color(0xd9849f);
  let metalAlvo = 0.55;
  let ligado = false, acelerando = 0, velRoda = 0, piscar = 0;
  document.querySelectorAll('.cor').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.cor').forEach(x => x.classList.remove('ativa'));
    b.classList.add('ativa');
    corAlvo.set(b.dataset.cor);
    metalAlvo = parseFloat(b.dataset.metal);
    document.getElementById('nomeCor').textContent = b.dataset.nome;
  }));
  const btnPartida = document.getElementById('btnPartida');
  btnPartida.addEventListener('click', () => {
    ligado = !ligado;
    btnPartida.classList.toggle('ligado', ligado);
    btnPartida.querySelector('span').textContent = ligado ? 'Desligar' : 'Dar partida';
    if (ligado) somPartida();
  });
  document.getElementById('btnAcelerar').addEventListener('click', () => {
    if (!ligado) { ligado = true; btnPartida.classList.add('ligado'); btnPartida.querySelector('span').textContent = 'Desligar'; }
    acelerando = 2.6;
    somAcelerar();
  });
  document.getElementById('btnBuzina').addEventListener('click', e => {
    somBuzina();
    piscar = 1;
    const r = e.currentTarget.getBoundingClientRect();
    explodir(r.left + r.width / 2, r.top, 10);
  });

  /* ---------- tamanho ---------- */
  function redimensionar() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const prop = w / h;
    raioBase = prop < 0.6 ? 25 : prop < 0.8 ? 21 : prop < 1.2 ? 18 : 12.5;
    alvo.y = prop < 0.8 ? -0.3 : prop < 1.2 ? 0.3 : 0.75;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', redimensionar);
  redimensionar();

  let visivel = true;
  new IntersectionObserver(([en]) => { visivel = en.isIntersecting; }).observe(canvas);

  /* ---------- loop ---------- */
  const relogio = new THREE.Clock();
  let t = 0, primeiroQuadro = true;
  function quadro() {
    requestAnimationFrame(quadro);
    const dt = Math.min(relogio.getDelta(), 0.05);
    if (!visivel) return;
    t += dt;

    // entrada cinematográfica + giro automático
    raio += (raioBase - raio) * Math.min(1, dt * 1.4);
    if (!arrastando) {
      velTheta *= 0.94;
      theta += velTheta;
      if (performance.now() - ultimoToque > 3000) theta += dt * 0.12;
    }

    // pintura muda de cor suavemente
    M.pintura.color.lerp(corAlvo, Math.min(1, dt * 4));
    M.pintura.metalness += (metalAlvo - M.pintura.metalness) * Math.min(1, dt * 4);

    // luzes
    const alvoFarol = ligado ? 3.2 : 0.25;
    M.farol.emissiveIntensity += (alvoFarol - M.farol.emissiveIntensity) * Math.min(1, dt * 6);
    M.lanterna.emissiveIntensity += ((ligado ? 2.2 : 0.35) - M.lanterna.emissiveIntensity) * Math.min(1, dt * 6);
    if (piscar > 0) {
      piscar = Math.max(0, piscar - dt * 2);
      const pisca = Math.sin(piscar * Math.PI * 4) > 0 ? 4 : 0.3;
      M.farol.emissiveIntensity = Math.max(M.farol.emissiveIntensity, pisca);
    }
    fachos.forEach(f => { f.intensity += ((ligado ? 2.5 : 0) - f.intensity) * Math.min(1, dt * 5); });

    // motor
    if (acelerando > 0) { acelerando -= dt; velRoda = Math.min(velRoda + dt * 30, 40); }
    else velRoda = Math.max(velRoda - dt * 12, 0);
    rodas.forEach(r => { r.userData.giro.rotation.z += r.userData.sentido * velRoda * dt; });
    const vibra = ligado ? Math.sin(t * 60) * 0.0025 : 0;
    carro.position.y = vibra;
    carro.rotation.z += ((acelerando > 0 ? 0.02 : 0) - carro.rotation.z) * Math.min(1, dt * 4);
    laco.rotation.z = Math.sin(t * 2.2) * 0.08 + (acelerando > 0 ? Math.sin(t * 25) * 0.15 : 0);
    aro.material.color.setHSL(0.95, 0.55, 0.74 + Math.sin(t * 2) * 0.05);
    aro.scale.setScalar(1 + (velRoda / 40) * 0.04);

    // partículas sobem devagar
    const p = pGeo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      p[i * 3 + 1] += vel[i] * dt;
      if (p[i * 3 + 1] > 7) p[i * 3 + 1] = 0;
    }
    pGeo.attributes.position.needsUpdate = true;

    camera.position.set(
      alvo.x + raio * Math.sin(phi) * Math.cos(theta),
      alvo.y + raio * Math.cos(phi),
      alvo.z + raio * Math.sin(phi) * Math.sin(theta)
    );
    camera.lookAt(alvo);
    renderer.render(scene, camera);

    if (primeiroQuadro) {
      primeiroQuadro = false;
      canvas.classList.add('pronto');
      carregando.classList.add('some');
    }
  }
  quadro();
})();

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
        <div class="face frente">
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
   REVELAR AO ROLAR
   ========================================================= */
const observador = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visivel'); observador.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.revelar').forEach(el => observador.observe(el));
