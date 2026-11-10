/* =========================================================
   GridNode — comportamento do site
   Para trocar o WhatsApp ou o e-mail, edite as duas linhas abaixo.
   ========================================================= */
const WHATSAPP = '5531972043051';
const EMAIL = 'contato.gridnode@gmail.com';

const hasGsap = typeof window.gsap !== 'undefined';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* ---------- rotas (páginas) ---------- */
const ROUTES = {
  '/': { view: 'home', title: 'GridNode — sites e sistemas sob medida' },
  '/orcamento': { view: 'orcamento', title: 'Quero ser cliente · GridNode' },
  '/cliente': { view: 'cliente', title: 'Central do cliente · GridNode' },
  '/projetos/forno-lume': { view: 'p-forno', title: 'Forno Lume (projeto conceito) · GridNode' },
  '/projetos/sereno': { view: 'p-sereno', title: 'Sereno Clínica (projeto conceito) · GridNode' },
  '/projetos/raiz': { view: 'p-raiz', title: 'Raiz Distribuidora (projeto conceito) · GridNode' }
};
const views = document.querySelectorAll('.view');
let currentView = null;
let pendingSection = null;

function pathNow() {
  const p = location.hash.replace(/^#/, '');
  return ROUTES[p] ? p : '/';
}

function showView(path) {
  const route = ROUTES[path] || ROUTES['/'];
  views.forEach(v => { v.hidden = v.dataset.view !== route.view; });
  currentView = route.view;
  document.title = route.title;
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (pendingSection) {
    const el = document.getElementById(pendingSection);
    pendingSection = null;
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  if (route.view === 'home') onHomeShown();
}

/* a aranha glitch no meio da tela na troca de página */
const veil = document.getElementById('veil');
function withVeil(swap) {
  if (!hasGsap || reduced) { swap(); return; }
  const bars = veil.querySelectorAll('.veil-bars i');
  const spider = veil.querySelector('.veil-spider');
  gsap.timeline()
    .set(veil, { visibility: 'visible' })
    .to(veil, { opacity: 1, duration: 0.16, ease: 'steps(3)' })
    .fromTo(bars, { xPercent: -110 }, { xPercent: 110, duration: 0.55, stagger: 0.035, ease: 'steps(7)' }, 0)
    .fromTo(spider, { scale: 0.8, opacity: 0, x: -14 }, { scale: 1, opacity: 1, x: 0, duration: 0.22, ease: 'steps(4)' }, 0.04)
    .to(spider, { x: 10, duration: 0.06, yoyo: true, repeat: 3, ease: 'steps(1)' }, 0.26)
    .add(swap, 0.34)
    .to(spider, { scale: 1.08, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.56)
    .to(veil, { opacity: 0, duration: 0.24, ease: 'steps(3)' }, 0.6)
    .set(veil, { visibility: 'hidden' });
}

window.addEventListener('hashchange', () => withVeil(() => showView(pathNow())));

/* links que levam a uma seção da home (serviços, processo, projetos) */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-goto]');
  if (!a) return;
  e.preventDefault();
  const id = a.dataset.goto;
  closeMenu();
  if (currentView === 'home') {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  } else {
    pendingSection = id;
    if (location.hash === '#/' || location.hash === '') withVeil(() => showView('/'));
    else location.hash = '#/';
  }
});

/* ---------- menu do celular ---------- */
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
function closeMenu() {
  menu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = 'menu';
}
menuBtn.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'fechar' : 'menu';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const topBar = document.getElementById('top');
window.addEventListener('scroll', () => topBar.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

/* ---------- hero: objetos entrando, flutuando e seguindo o mouse ---------- */
const hero = document.getElementById('hero');
const heroObjs = [...document.querySelectorAll('.hero-obj')];
const spiderTilt = document.getElementById('spiderTilt');
let heroPlayed = false;

function playHeroIntro() {
  if (heroPlayed || !hasGsap || reduced) return;
  heroPlayed = true;
  gsap.from('.hero-text > *', { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
  gsap.from(heroObjs, { y: 70, opacity: 0, scale: 0.94, filter: 'blur(10px)', duration: 1.5, ease: 'expo.out', stagger: 0.12, delay: 0.35 });
}

if (finePointer && !reduced) {
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    heroObjs.forEach(o => {
      const d = Number(o.dataset.depth || -30);
      o.querySelector('.par').style.transform = `translate(${(mx * d).toFixed(1)}px, ${(my * d).toFixed(1)}px)`;
    });
    spiderTilt.style.transform =
      `perspective(900px) rotateY(${(mx * 34).toFixed(1)}deg) rotateX(${(-my * 26).toFixed(1)}deg) translate(${(mx * 24).toFixed(1)}px, ${(my * 18).toFixed(1)}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroObjs.forEach(o => { o.querySelector('.par').style.transform = ''; });
    spiderTilt.style.transform = '';
  });
}

/* ---------- processo: do rascunho ao deploy ---------- */
const stage = document.getElementById('stage');
const stageBox = document.getElementById('stageBox');
const stLabel = document.getElementById('stLabel');
const stepDesc = document.getElementById('stepDesc');
const stepBtns = [...document.querySelectorAll('.step-btn')];
const deployWord = document.querySelector('.deploy');
const STEPS = [
  { label: '01 / esboço', desc: 'Entendemos a rotina do seu negócio e rascunhamos a solução.' },
  { label: '02 / wireframe', desc: 'Organizamos as telas e o caminho que o seu cliente vai fazer.' },
  { label: '03 / design', desc: 'Cores, textos e a cara da sua marca.' },
  { label: '04 / código', desc: 'Tudo vira um site ou sistema de verdade.' },
  { label: '05 / no ar', desc: 'Publicado, testado e com manutenção mensal inclusa.' }
];
let step = 2;
function setStep(i) {
  if (i === step) return;
  step = i;
  stage.dataset.step = String(i);
  stLabel.textContent = STEPS[i].label;
  stepDesc.textContent = STEPS[i].desc;
  stepBtns.forEach((b, k) => {
    b.setAttribute('aria-selected', String(k === i));
    b.classList.toggle('is-done', k < i);
  });
  deployWord.classList.toggle('is-live', i === 4);
}
stepBtns.forEach((b, i) => b.addEventListener('click', () => { stopAuto(); setStep(i); }));

// a tela fica em 640x420 e escala para caber em qualquer largura
function fitStage() {
  const s = stageBox.clientWidth / 640;
  stage.style.transform = `scale(${s})`;
}
new ResizeObserver(fitStage).observe(stageBox);
fitStage();

// no computador: as etapas avançam com a rolagem. no celular: avançam sozinhas.
let autoTimer = null;
function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
function startAuto() {
  if (autoTimer || reduced) return;
  autoTimer = setInterval(() => setStep((step + 1) % 5), 2600);
}

if (hasGsap && window.ScrollTrigger && !reduced) {
  ScrollTrigger.matchMedia({
    '(min-width: 980px)': () => {
      const st = ScrollTrigger.create({
        trigger: '#processo',
        start: 'top top+=76',
        end: '+=1500',
        pin: true,
        onUpdate: self => setStep(Math.min(4, Math.floor(self.progress * 5)))
      });
      return () => st.kill();
    },
    '(max-width: 979px)': () => {
      const st = ScrollTrigger.create({
        trigger: '#processo', start: 'top 70%', end: 'bottom 30%',
        onToggle: self => (self.isActive ? startAuto() : stopAuto())
      });
      return () => { st.kill(); stopAuto(); };
    }
  });
}

/* ---------- formulários: viram mensagem pronta no WhatsApp ---------- */
function waUrl(text) { return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`; }
function mailUrl(subject, text) { return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`; }

function setMsg(form, text, ok) {
  const p = form.querySelector('.form-msg');
  p.textContent = text;
  p.classList.toggle('is-error', !ok);
  p.classList.toggle('is-ok', ok);
}

function validate(form, extra) {
  const bad = [...form.querySelectorAll('[required]')].find(el => !el.value.trim());
  if (bad) {
    setMsg(form, 'Preencha os campos marcados com *.', false);
    bad.focus();
    return false;
  }
  if (extra && !extra()) return false;
  return true;
}

function bindForm(form, build, subject, extra) {
  const send = via => {
    if (!validate(form, extra)) return;
    const text = build(new FormData(form));
    if (via === 'wa') {
      const url = waUrl(text);
      window.open(url, '_blank', 'noopener');
      setMsg(form, 'Sua mensagem está pronta no WhatsApp. É só tocar em enviar. ', true);
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Se não abriu, toque aqui.';
      form.querySelector('.form-msg').appendChild(a);
    } else {
      location.href = mailUrl(subject, text);
      setMsg(form, 'Abrimos o seu e-mail com a mensagem pronta.', true);
    }
  };
  form.addEventListener('submit', e => { e.preventDefault(); send('wa'); });
  form.querySelector('[data-email]').addEventListener('click', () => send('email'));
}

const formLead = document.getElementById('formLead');
bindForm(
  formLead,
  d => {
    const precisa = d.getAll('precisa').join(', ');
    let t = `Olá, GridNode! Quero ser cliente.\n\nNome: ${d.get('nome')}\nNegócio: ${d.get('negocio')}\nÁrea: ${d.get('area')}\nPreciso de: ${precisa}\nPara quando: ${d.get('quando')}`;
    if (d.get('mensagem').trim()) t += `\n\nSobre o negócio: ${d.get('mensagem').trim()}`;
    return t;
  },
  'Quero ser cliente',
  () => {
    if (formLead.querySelectorAll('input[name="precisa"]:checked').length) return true;
    setMsg(formLead, 'Marque pelo menos uma opção em “O que você precisa?”.', false);
    formLead.querySelector('input[name="precisa"]').focus();
    return false;
  }
);

const formCliente = document.getElementById('formCliente');
bindForm(
  formCliente,
  d => {
    let t = `Olá, GridNode! Já sou cliente.\n\nNome: ${d.get('nome')}\nEmpresa: ${d.get('empresa')}\nAssunto: ${d.get('assunto')}\nUrgência: ${d.get('urgencia')}\n\n${d.get('mensagem').trim()}`;
    if (d.get('link').trim()) t += `\n\nLink: ${d.get('link').trim()}`;
    return t;
  },
  'Central do cliente'
);

// cartões de assunto preenchem o formulário
const topics = [...document.querySelectorAll('.topic')];
topics.forEach(btn => btn.addEventListener('click', () => {
  topics.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  const sel = document.getElementById('c-assunto');
  sel.value = btn.dataset.topic;
  if (btn.dataset.topic === 'Algo não está funcionando') document.getElementById('c-urg').value = 'Urgente: parou de funcionar';
  document.getElementById('c-nome').focus({ preventScroll: true });
  formCliente.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}));

/* ---------- início ---------- */
function onHomeShown() { playHeroIntro(); }
document.getElementById('ano').textContent = new Date().getFullYear();
showView(pathNow());
