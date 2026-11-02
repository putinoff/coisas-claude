/* =========================================================
   SHOWROOM 3D — carros reais (glTF) num estúdio com reflexo
   ========================================================= */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

/* ---------- a garagem: edite à vontade ---------- */
const CARROS = [
  {
    id: 'bmw', marca: 'BMW', modelo: 'M4 CSL', arquivo: 'modelos/bmw.glb',
    cv: '550 cv', zero: '3,7 s', vmax: '307 km/h', tom: 1,
    frase: 'A favorita da casa, com a cor dela.',
    pintura: /^M4xNME_(Paint|Paint2|Colorable1)(\.\d+)?$/,
    rodas: /^M4xNME_wheels_enkeif\d*$/,
    farois: /highbeam|runningY|Lights$/i, lanternas: /taillight|fogred/i,
  },
  {
    id: 'porsche', marca: 'Porsche', modelo: '911 Carrera 4S', arquivo: 'modelos/porsche.glb',
    cv: '450 cv', zero: '3,6 s', vmax: '306 km/h', tom: 1.12,
    frase: 'Clássica e elegante, igualzinha a você.',
    pintura: /^paint$/,
    rodas: /^Cylinder00[01]_[012]$/,
    farois: /^lights$/, lanternas: /^coat$/,
  },
  {
    id: 'ferrari', marca: 'Ferrari', modelo: '458 Spider', arquivo: 'modelos/ferrari.glb', giro: Math.PI,
    cv: '570 cv', zero: '3,4 s', vmax: '320 km/h', tom: 1.3,
    frase: 'Paixão italiana, do tamanho da minha por você.',
    pintura: /^Body_Color$/,
    rodas: /^wheel_(fl|fr|rl|rr)$/i,
    farois: /Projector_Glass|Turn_Signal/i, lanternas: /Taillight/i,
  },
  {
    id: 'lambo', marca: 'Lamborghini', modelo: 'Urus', arquivo: 'modelos/lambo.glb',
    cv: '650 cv', zero: '3,6 s', vmax: '305 km/h', tom: 0.9,
    frase: 'Um touro bravo — mas que vira gatinho perto de você.',
    pintura: /^WhiteCar$/,
    rodas: /^(FL|FR|RL|RR)$/,
    farois: /LightsFrontLed|LightsGlassFront/i, lanternas: /emitbrake|LightsGlassBack/i,
  },
  {
    id: 'koenigsegg', marca: 'Koenigsegg', modelo: 'Jesko', arquivo: 'modelos/jesko.glb', giro: -Math.PI / 2,
    cv: '1.600 cv', zero: '2,5 s', vmax: '+480 km/h', tom: 1.45,
    frase: 'Hipercarro sueco. Raro no mundo, como você.',
    pintura: /^L1Mtl$/,
    rodas: null, // neste modelo as quatro rodas são uma malha só
    farois: /^L(3|5|7)Mtl$/, lanternas: /^(L6Mtl|Rg1Mtl)$/,
  },
  {
    id: 'bugatti', marca: 'Bugatti', modelo: 'Chiron', arquivo: 'modelos/chiron.glb',
    cv: '1.500 cv', zero: '2,4 s', vmax: '420 km/h', tom: 0.8,
    frase: '16 cilindros, e mesmo assim perde pro meu coração quando te vê.',
    pintura: /^paint_primary$/,
    rodas: /^wheel_(FL|FR|RL|RR)$/,
    farois: /headlight_emit|headlight_lens/i, lanternas: /taillight_emit/i,
  },
];

const COMPRIMENTO = 4.6; // todo carro é normalizado para esse comprimento

const canvas = document.getElementById('scene');
const carregando = document.getElementById('carregando');
const textoCarregando = carregando.querySelector('b');
const leve = matchMedia('(pointer: coarse)').matches || innerWidth < 700;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, leve ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0c0b0e, 12, 30);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

/* ---------- reflexos de estúdio (com um toque rosa) ---------- */
(function ambiente() {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const estudio = new RoomEnvironment(renderer);
  const painel = (cor, forca, pos, rot, w, h) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(cor).multiplyScalar(forca), side: THREE.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot);
    estudio.add(m);
  };
  painel(0xff7aa8, 6, [-6, 6, -4], [0, Math.PI / 3, 0], 3, 6);
  painel(0x8fb0ff, 4, [6, 6, -4], [0, -Math.PI / 3, 0], 3, 6);
  scene.environment = pmrem.fromScene(estudio, 0.04).texture;
  scene.environmentIntensity = 1;
  pmrem.dispose();
})();

/* ---------- luzes ---------- */
scene.add(new THREE.HemisphereLight(0xffffff, 0x2a1a20, 0.6));
const chave = new THREE.DirectionalLight(0xffffff, 2.2);
chave.position.set(3, 9, 4);
chave.castShadow = true;
chave.shadow.mapSize.set(leve ? 1024 : 2048, leve ? 1024 : 2048);
Object.assign(chave.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
chave.shadow.bias = -0.0003;
chave.shadow.normalBias = 0.02;
chave.shadow.radius = 5;
scene.add(chave);
const contraRosa = new THREE.SpotLight(0xff6f9c, 90, 0, 0.6, 1, 2);
contraRosa.position.set(-6, 4, -5);
scene.add(contraRosa);
const contraAzul = new THREE.SpotLight(0x6f9cff, 60, 0, 0.6, 1, 2);
contraAzul.position.set(6, 3, -6);
scene.add(contraAzul);

/* ---------- texturas simples desenhadas em canvas ---------- */
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

/* ---------- piso: espelho escuro + verniz por cima ---------- */
if (!leve) {
  const espelho = new Reflector(new THREE.CircleGeometry(16, 96), {
    textureWidth: innerWidth * 0.5, textureHeight: innerHeight * 0.5, color: 0x8a8a8a,
  });
  espelho.rotation.x = -Math.PI / 2;
  espelho.position.y = -0.001;
  scene.add(espelho);
}
const piso = new THREE.Mesh(
  new THREE.CircleGeometry(16, 96),
  new THREE.MeshStandardMaterial({
    color: 0x0e0c10, roughness: 0.55, metalness: 0.1, envMapIntensity: 0.4,
    transparent: true, opacity: leve ? 1 : 0.7,
    alphaMap: gradienteRadial([[0, '#fff'], [0.45, '#fff'], [1, '#000']]),
  })
);
piso.rotation.x = -Math.PI / 2;
piso.receiveShadow = true;
scene.add(piso);

const sombraContato = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    map: gradienteRadial([[0, 'rgba(0,0,0,0.9)'], [0.55, 'rgba(0,0,0,0.4)'], [1, 'rgba(0,0,0,0)']]),
    transparent: true, depthWrite: false, opacity: 0,
  })
);
sombraContato.rotation.x = -Math.PI / 2;
sombraContato.position.y = 0.004;
sombraContato.scale.set(5.8, 2.9, 1);
scene.add(sombraContato);

const brilhoChao = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshBasicMaterial({
    map: gradienteRadial([[0, 'rgba(255,120,160,0.2)'], [0.5, 'rgba(255,120,160,0.05)'], [1, 'rgba(255,120,160,0)']]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })
);
brilhoChao.rotation.x = -Math.PI / 2;
brilhoChao.position.y = 0.003;
scene.add(brilhoChao);

const aro = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.01, 8, 180), new THREE.MeshBasicMaterial({ color: 0xe3a3b7 }));
aro.rotation.x = Math.PI / 2;
aro.position.y = 0.006;
scene.add(aro);

/* ---------- partículas de luz (bokeh) ---------- */
const NP = 220;
const pPos = new Float32Array(NP * 3), pVel = new Float32Array(NP);
for (let i = 0; i < NP; i++) {
  const a = Math.random() * Math.PI * 2, r = 3.5 + Math.random() * 9;
  pPos.set([Math.cos(a) * r, Math.random() * 7, Math.sin(a) * r], i * 3);
  pVel[i] = 0.08 + Math.random() * 0.25;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
  size: 0.09, color: 0xffb8cc, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
  map: gradienteRadial([[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.5)'], [1, 'rgba(255,255,255,0)']], 64),
})));

/* ---------- materiais compartilhados ---------- */
const corAlvo = new THREE.Color(0xd9849f);
let metalAlvo = 0.55;
const pintura = new THREE.MeshPhysicalMaterial({
  color: corAlvo.clone(), metalness: 0.55, roughness: 0.32,
  clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.4,
});
const laco = new THREE.Group();
(function montarLaco() {
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xd63b6b, roughness: 0.4, clearcoat: 0.7 });
  [-1, 1].forEach(l => {
    const aba = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 14), mat);
    aba.position.x = l * 0.07; aba.rotation.z = l * -0.3; aba.scale.set(1.3, 0.95, 0.5);
    aba.castShadow = true;
    laco.add(aba);
  });
  laco.add(new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), mat));
})();

/* ---------- carregamento dos modelos ---------- */
const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/');
const loader = new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
const cache = {};

function carregar(cfg, progresso) {
  if (cache[cfg.id]) return cache[cfg.id];
  cache[cfg.id] = new Promise((ok, erro) => {
    loader.load(cfg.arquivo, g => ok(montar(g.scene, cfg)), e => {
      if (e.total) progresso(e.loaded / e.total);
    }, err => { delete cache[cfg.id]; erro(err); });
  });
  return cache[cfg.id];
}

const v3 = new THREE.Vector3();
function montar(raiz, cfg) {
  const carro = new THREE.Group();
  const corpo = new THREE.Group();
  carro.add(corpo);
  corpo.add(raiz);
  if (cfg.giro) raiz.rotation.y = cfg.giro;
  corpo.updateMatrixWorld(true);

  // deita o carro no eixo X (frente para +X), escala e apoia no chão
  let box = new THREE.Box3().setFromObject(corpo, true);
  box.getSize(v3);
  if (v3.z > v3.x && !cfg.giro) { raiz.rotation.y = Math.PI / 2; corpo.updateMatrixWorld(true); box = new THREE.Box3().setFromObject(corpo, true); box.getSize(v3); }
  const escala = COMPRIMENTO / v3.x;
  corpo.scale.setScalar(escala);
  corpo.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(corpo, true);
  const centro = box.getCenter(new THREE.Vector3());
  corpo.position.set(-centro.x, -box.min.y, -centro.z);
  corpo.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(corpo, true);
  const dims = box.getSize(new THREE.Vector3());

  // materiais: pintura trocável, vidro e luzes realistas
  const farois = [], lanternas = [];
  raiz.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const trocar = m => {
      if (!m) return m;
      if (cfg.pintura && cfg.pintura.test(m.name)) {
        if (m.normalMap) { const p = pintura.clone(); p.normalMap = m.normalMap; (pintura.userData.clones ||= []).push(p); return p; }
        return pintura;
      }
      if (cfg.farois && cfg.farois.test(m.name)) { m.emissive = new THREE.Color(0xdfeaff); m.userData.base = m.emissiveIntensity || 1; farois.push(m); }
      else if (cfg.lanternas && cfg.lanternas.test(m.name)) { m.emissive = new THREE.Color(0xff1030); lanternas.push(m); }
      if (m.transparent || /glass|window|vidro|G1Mtl|Fg1Mtl/i.test(m.name)) { m.envMapIntensity = 1.6; m.roughness = Math.min(m.roughness ?? 0.1, 0.08); }
      else if ('envMapIntensity' in m) m.envMapIntensity = 1.1;
      return m;
    };
    o.material = Array.isArray(o.material) ? o.material.map(trocar) : trocar(o.material);
  });

  // rodas: as peças de cada roda são agrupadas por proximidade
  // e ganham um pivô no centro do pneu para girar
  const rodas = [];
  if (cfg.rodas) {
    const achadas = [];
    raiz.traverse(o => { if (cfg.rodas.test(o.name)) achadas.push(o); });
    const grupos = [];
    achadas.filter(o => !achadas.some(a => a !== o && isAncestor(a, o))).forEach(o => {
      const b = new THREE.Box3().setFromObject(o, true);
      if (b.isEmpty()) return;
      const c = b.getCenter(new THREE.Vector3());
      const g = grupos.find(g => g.c.distanceTo(c) < 0.35);
      if (g) { g.partes.push(o); g.box.union(b); } else grupos.push({ c, box: b, partes: [o] });
    });
    grupos.forEach(g => {
      const pivo = new THREE.Group();
      carro.add(pivo);
      pivo.position.copy(g.box.getCenter(new THREE.Vector3()));
      pivo.updateMatrixWorld(true);
      g.partes.forEach(o => pivo.attach(o));
      rodas.push(pivo);
    });
  }

  // lacinho da Kitty no teto (acha o teto com um raio de cima para baixo)
  const ray = new THREE.Raycaster(new THREE.Vector3(-COMPRIMENTO * 0.08, 10, 0), new THREE.Vector3(0, -1, 0));
  const hit = ray.intersectObject(corpo, true)[0];
  const alturaTeto = hit ? hit.point.y : dims.y;

  // faróis de verdade (iluminam o chão quando ligados)
  const fachos = [-0.32, 0.32].map(z => {
    const s = new THREE.SpotLight(0xe6f1ff, 0, 14, 0.45, 0.7, 1.4);
    s.position.set(COMPRIMENTO / 2 - 0.05, dims.y * 0.45, z * dims.z);
    s.target.position.set(COMPRIMENTO / 2 + 6, 0, z * dims.z * 1.8);
    carro.add(s, s.target);
    return s;
  });

  carro.userData = { cfg, rodas, farois, lanternas, fachos, alturaTeto, dims };
  return carro;
}
function isAncestor(a, o) { for (let p = o.parent; p; p = p.parent) if (p === a) return true; return false; }

/* ---------- câmera: arrastar para girar ---------- */
const alvo = new THREE.Vector3(0, 0.7, 0);
let theta = 0.75, phi = 1.3, raioBase = 10, raio = 18;
let arrastando = false, ultX = 0, ultY = 0, ultimoToque = -1e9, movido = 0, velTheta = 0;
canvas.addEventListener('pointerdown', e => {
  arrastando = true; movido = 0; ultX = e.clientX; ultY = e.clientY;
  try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
});
canvas.addEventListener('pointermove', e => {
  if (!arrastando) return;
  const dx = e.clientX - ultX, dy = e.clientY - ultY;
  movido += Math.abs(dx) + Math.abs(dy);
  velTheta = -dx * 0.006;
  theta += velTheta;
  phi = Math.min(1.5, Math.max(0.75, phi - dy * 0.004));
  ultX = e.clientX; ultY = e.clientY;
  ultimoToque = performance.now();
});
canvas.addEventListener('pointerup', e => { arrastando = false; if (movido < 6) toque(e); });
canvas.addEventListener('pointercancel', () => { arrastando = false; });

const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
function toque(e) {
  if (!atual) return;
  const r = canvas.getBoundingClientRect();
  mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(mouse, camera);
  if (ray.intersectObject(atual, true).length) {
    explodir(e.clientX, e.clientY, 14);
    somSino();
    piscar = 1;
  }
}

/* ---------- troca de carros: um sai dirigindo, o outro chega ---------- */
let atual = null, saindo = null, chegada = 0, pedido = 0;
const garagem = document.getElementById('garagem');
const elMarca = document.getElementById('marcaCarro');
const elNome = document.getElementById('nomeCarro');
const elFrase = document.getElementById('fraseCarro');
const elCv = document.getElementById('specCv');
const elZero = document.getElementById('specZero');
const elVmax = document.getElementById('specVmax');

CARROS.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'carro-chip' + (i === 0 ? ' ativo' : '');
  b.setAttribute('role', 'tab');
  b.dataset.id = c.id;
  b.innerHTML = `<small>${c.marca}</small><span>${c.modelo}</span>`;
  b.addEventListener('click', () => escolher(c));
  garagem.appendChild(b);
});

function trocarTexto(el, t) {
  el.classList.remove('troca'); void el.offsetWidth; el.classList.add('troca');
  el.textContent = t;
}

async function escolher(cfg) {
  if (atual && atual.userData.cfg === cfg) return;
  const meu = ++pedido;
  garagem.querySelectorAll('.carro-chip').forEach(b => b.classList.toggle('ativo', b.dataset.id === cfg.id));
  trocarTexto(elMarca, cfg.marca); trocarTexto(elNome, cfg.modelo); trocarTexto(elFrase, cfg.frase);
  trocarTexto(elCv, cfg.cv); trocarTexto(elZero, cfg.zero); trocarTexto(elVmax, cfg.vmax);
  carregando.classList.remove('some');
  textoCarregando.textContent = `Trazendo ${cfg.marca === 'BMW' ? 'a' : 'o'} ${cfg.marca}…`;
  try {
    const carro = await carregar(cfg, p => {
      if (meu === pedido) textoCarregando.textContent = `Trazendo ${cfg.marca === 'BMW' ? 'a' : 'o'} ${cfg.marca}… ${Math.round(p * 100)}%`;
    });
    if (meu !== pedido) return;
    carregando.classList.add('some');
    if (atual) {
      if (saindo) scene.remove(saindo);
      saindo = atual;
      somAcelerarCarro(atual.userData.cfg);
    }
    atual = carro;
    laco.position.set(-COMPRIMENTO * 0.08, carro.userData.alturaTeto + 0.05, 0);
    carro.add(laco);
    carro.position.set(-14, 0, 0);
    chegada = 0;
    scene.add(carro);
    sombraContato.scale.set(carro.userData.dims.x * 1.25, carro.userData.dims.z * 1.45, 1);
  } catch (err) {
    console.error(err);
    if (meu === pedido) textoCarregando.textContent = 'Não consegui trazer esse carro agora.';
  }
}

/* ---------- painel ---------- */
let ligado = false, acelerando = 0, velRoda = 0, piscar = 0;
document.querySelectorAll('.cor').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.cor').forEach(x => x.classList.remove('ativa'));
  b.classList.add('ativa');
  corAlvo.set(b.dataset.cor);
  metalAlvo = parseFloat(b.dataset.metal);
  document.getElementById('nomeCor').textContent = b.dataset.nome;
}));
const tom = () => (atual ? atual.userData.cfg.tom : 1);
const escalaCurva = (curva, k) => curva.map(([t, hz]) => [t, hz * k]);
function somAcelerarCarro(cfg) { motor(escalaCurva([[0, 55], [0.8, 200], [1.0, 130], [1.8, 260], [2.6, 58]], cfg.tom), 2.8, 0.15); }
const btnPartida = document.getElementById('btnPartida');
function ligar(v) {
  ligado = v;
  btnPartida.classList.toggle('ligado', ligado);
  btnPartida.querySelector('span').textContent = ligado ? 'Desligar' : 'Dar partida';
}
btnPartida.addEventListener('click', () => {
  ligar(!ligado);
  if (ligado) motor(escalaCurva([[0, 30], [0.35, 38], [0.6, 140], [1.0, 70], [2.2, 52]], tom()), 2.4, 0.14);
});
document.getElementById('btnAcelerar').addEventListener('click', () => {
  if (!ligado) ligar(true);
  acelerando = 2.6;
  motor(escalaCurva([[0, 55], [0.8, 200], [1.0, 130], [1.8, 260], [2.6, 58]], tom()), 2.8, 0.17);
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
  raioBase = prop < 0.6 ? 24 : prop < 0.8 ? 20 : prop < 1.2 ? 16 : 11.5;
  alvo.y = prop < 0.8 ? -0.2 : prop < 1.2 ? 0.05 : 0.75;
  camera.updateProjectionMatrix();
}
addEventListener('resize', redimensionar);
redimensionar();

let visivel = true;
new IntersectionObserver(([en]) => { visivel = en.isIntersecting; }).observe(canvas);

/* ---------- loop ---------- */
const relogio = new THREE.Clock();
const suave = (a, b, k) => a + (b - a) * k;
let t = 0, primeiroQuadro = true;
function animarLuzes(carro, dt, ativo) {
  const { farois, lanternas, fachos } = carro.userData;
  let f = ativo && ligado ? 4 : 0.15;
  if (ativo && piscar > 0) f = Math.max(f, Math.sin(piscar * Math.PI * 4) > 0 ? 6 : 0.2);
  farois.forEach(m => { m.emissiveIntensity = suave(m.emissiveIntensity, f, Math.min(1, dt * 8)); });
  lanternas.forEach(m => { m.emissiveIntensity = suave(m.emissiveIntensity, ativo && ligado ? 3 : 0.3, Math.min(1, dt * 6)); });
  fachos.forEach(s => { s.intensity = suave(s.intensity, ativo && ligado ? 40 : 0, Math.min(1, dt * 5)); });
}
function girarRodas(carro, vel, dt) {
  carro.userData.rodas.forEach(r => { r.rotation.z -= vel * dt; });
}

function quadro() {
  requestAnimationFrame(quadro);
  const dtReal = Math.min(relogio.getDelta(), 0.5); // animações de troca seguem o relógio real
  const dt = Math.min(dtReal, 0.05);
  if (!visivel) return;
  t += dt;

  raio += (raioBase - raio) * Math.min(1, dt * 1.4);
  if (!arrastando) {
    velTheta *= 0.94;
    theta += velTheta;
    if (performance.now() - ultimoToque > 3000) theta += dt * 0.12;
  }

  pintura.color.lerp(corAlvo, Math.min(1, dt * 4));
  pintura.metalness = suave(pintura.metalness, metalAlvo, Math.min(1, dt * 4));
  if (pintura.userData.clones) pintura.userData.clones.forEach(c => { c.color.copy(pintura.color); c.metalness = pintura.metalness; });

  if (piscar > 0) piscar = Math.max(0, piscar - dt * 2);
  if (acelerando > 0) { acelerando -= dt; velRoda = Math.min(velRoda + dt * 30, 40); }
  else velRoda = Math.max(velRoda - dt * 12, 0);

  if (atual) {
    // chegada: desliza do lado esquerdo e freia no centro
    if (chegada < 1) {
      chegada = Math.min(1, chegada + dtReal * 0.55);
      const e = 1 - Math.pow(1 - chegada, 3);
      const xAnt = atual.position.x;
      atual.position.x = -14 * (1 - e);
      girarRodas(atual, (atual.position.x - xAnt) / 0.36, 1);
    }
    girarRodas(atual, velRoda, dt);
    animarLuzes(atual, dt, true);
    atual.position.y = ligado ? Math.sin(t * 60) * 0.002 : 0;
    atual.rotation.z = suave(atual.rotation.z, acelerando > 0 ? 0.015 : 0, Math.min(1, dt * 4));
    laco.rotation.z = Math.sin(t * 2.2) * 0.08 + (acelerando > 0 ? Math.sin(t * 25) * 0.15 : 0);
    sombraContato.position.x = atual.position.x;
    sombraContato.material.opacity = 1 - Math.min(1, Math.abs(atual.position.x) / 6);
  }
  if (saindo) {
    saindo.userData.vel = (saindo.userData.vel || 2) + dtReal * 14;
    saindo.position.x += saindo.userData.vel * dtReal;
    girarRodas(saindo, saindo.userData.vel / 0.36, dtReal);
    animarLuzes(saindo, dt, false);
    if (saindo.position.x > 18) { scene.remove(saindo); saindo.position.x = 0; saindo.userData.vel = 0; saindo = null; }
  }
  aro.material.color.setHSL(0.95, 0.55, 0.74 + Math.sin(t * 2) * 0.05);
  aro.scale.setScalar(1 + (velRoda / 40) * 0.04);

  const p = pGeo.attributes.position.array;
  for (let i = 0; i < NP; i++) {
    p[i * 3 + 1] += pVel[i] * dt;
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
  }
}
quadro();
escolher(CARROS[0]);

