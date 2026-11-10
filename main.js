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

/* endereços antigos (#/orcamento etc.) continuam funcionando */
const OLD = {
  '#/orcamento': '/orcamento/', '#/cliente': '/cliente/',
  '#/projetos/forno-lume': '/projetos/forno-lume/', '#/projetos/sereno': '/projetos/sereno/', '#/projetos/raiz': '/projetos/raiz/'
};
const goOld = () => { if (OLD[location.hash]) location.replace(OLD[location.hash]); };
goOld();
window.addEventListener('hashchange', goOld);

/* ---------- transição: a aranha glitch no meio da tela ---------- */
const veil = document.getElementById('veil');
const root = document.documentElement;
function safeSession(fn) { try { return fn(); } catch (e) { return null; } }

// chegando de outra página do site: a aranha some revelando a página nova
function veilOut() {
  if (!root.classList.contains('veil-in')) return;
  if (!hasGsap || reduced) { root.classList.remove('veil-in'); return; }
  const spider = veil.querySelector('.veil-spider');
  const bars = veil.querySelectorAll('.veil-bars i');
  gsap.timeline({ onComplete: () => { root.classList.remove('veil-in'); gsap.set([veil, spider, bars], { clearProps: 'all' }); } })
    .fromTo(bars, { xPercent: -10 }, { xPercent: 110, duration: 0.4, stagger: 0.03, ease: 'steps(6)' }, 0)
    .to(spider, { x: 10, duration: 0.06, yoyo: true, repeat: 3, ease: 'steps(1)' }, 0)
    .to(spider, { scale: 1.08, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.22)
    .to(veil, { opacity: 0, duration: 0.24, ease: 'steps(3)' }, 0.28);
}

// saindo para outra página do site
function veilIn(href) {
  safeSession(() => sessionStorage.setItem('gn-veil', '1'));
  if (!hasGsap || reduced) { location.href = href; return; }
  const bars = veil.querySelectorAll('.veil-bars i');
  const spider = veil.querySelector('.veil-spider');
  gsap.timeline({ onComplete: () => { location.href = href; } })
    .set(veil, { visibility: 'visible' })
    .to(veil, { opacity: 1, duration: 0.16, ease: 'steps(3)' })
    .fromTo(bars, { xPercent: -110 }, { xPercent: -10, duration: 0.3, stagger: 0.03, ease: 'steps(5)' }, 0)
    .fromTo(spider, { scale: 0.8, opacity: 0, x: -14 }, { scale: 1, opacity: 1, x: 0, duration: 0.22, ease: 'steps(4)' }, 0.04);
}

document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  const samePage = url.pathname === location.pathname;
  if (samePage && url.hash) return; // rolagem dentro da mesma página
  if (samePage && !url.hash && url.search === location.search) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); return; }
  e.preventDefault();
  closeMenu();
  veilIn(url.href);
});

// voltar pelo botão do navegador não deixa a tela preta
window.addEventListener('pageshow', e => {
  if (e.persisted) { root.classList.remove('veil-in'); if (hasGsap) gsap.set(veil, { clearProps: 'all' }); }
});

/* ---------- menu do celular ---------- */
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
function closeMenu() {
  if (!menu) return;
  menu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = 'menu';
}
menuBtn?.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'fechar' : 'menu';
});
menu?.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const topBar = document.getElementById('top');
window.addEventListener('scroll', () => topBar.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

/* ---------- hero da home ---------- */
const hero = document.getElementById('hero');
if (hero) {
  const heroObjs = [...document.querySelectorAll('.hero-obj')];
  const spiderTilt = document.getElementById('spiderTilt');
  if (hasGsap && !reduced) {
    const delay = root.classList.contains('veil-in') ? 0.35 : 0;
    gsap.from('.hero-text > *', { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.1 + delay });
    gsap.from(heroObjs, { y: 70, opacity: 0, scale: 0.94, filter: 'blur(10px)', duration: 1.5, ease: 'expo.out', stagger: 0.12, delay: 0.35 + delay });
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
}

/* ---------- processo: do rascunho ao deploy ---------- */
const stage = document.getElementById('stage');
if (stage) {
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
  const setStep = i => {
    if (i === step) return;
    step = i;
    stage.dataset.step = String(i);
    stLabel.textContent = STEPS[i].label;
    stepDesc.textContent = STEPS[i].desc;
    stepBtns.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.classList.toggle('is-done', k < i); });
    deployWord.classList.toggle('is-live', i === 4);
  };
  let autoTimer = null;
  const stopAuto = () => { clearInterval(autoTimer); autoTimer = null; };
  const startAuto = () => { if (!autoTimer && !reduced) autoTimer = setInterval(() => setStep((step + 1) % 5), 2600); };
  stepBtns.forEach((b, i) => b.addEventListener('click', () => { stopAuto(); setStep(i); }));

  const fitStage = () => { stage.style.transform = `scale(${stageBox.clientWidth / 640})`; };
  new ResizeObserver(fitStage).observe(stageBox);
  fitStage();

  if (hasGsap && window.ScrollTrigger && !reduced) {
    ScrollTrigger.matchMedia({
      '(min-width: 980px)': () => {
        const st = ScrollTrigger.create({
          trigger: '#processo', start: 'top top+=76', end: '+=1500', pin: true,
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
}

/* ---------- formulários: viram mensagem pronta no WhatsApp ---------- */
const waUrl = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const mailUrl = (subject, text) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

function setMsg(form, text, ok) {
  const p = form.querySelector('.form-msg');
  p.textContent = text;
  p.classList.toggle('is-error', !ok);
  p.classList.toggle('is-ok', ok);
}
function validate(form, extra) {
  const bad = [...form.querySelectorAll('[required]')].find(el => !el.value.trim());
  if (bad) { setMsg(form, 'Preencha os campos marcados com *.', false); bad.focus(); return false; }
  return extra ? extra() : true;
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
if (formLead) {
  // vindo de uma página de serviço, o serviço já chega marcado
  const pre = { site: 'Site', sistema: 'Sistema de gestão', whatsapp: 'Atendente de WhatsApp', cardapio: 'Cardápio ou catálogo digital' };
  const want = pre[new URLSearchParams(location.search).get('servico')];
  if (want) formLead.querySelectorAll('input[name="precisa"]').forEach(i => { if (i.value === want) i.checked = true; });

  bindForm(
    formLead,
    d => {
      let t = `Olá, GridNode! Quero ser cliente.\n\nNome: ${d.get('nome')}\nNegócio: ${d.get('negocio')}\nÁrea: ${d.get('area')}\nPreciso de: ${d.getAll('precisa').join(', ')}\nPara quando: ${d.get('quando')}`;
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
}

const formCliente = document.getElementById('formCliente');
if (formCliente) {
  bindForm(
    formCliente,
    d => {
      let t = `Olá, GridNode! Já sou cliente.\n\nNome: ${d.get('nome')}\nEmpresa: ${d.get('empresa')}\nAssunto: ${d.get('assunto')}\nUrgência: ${d.get('urgencia')}\n\n${d.get('mensagem').trim()}`;
      if (d.get('link').trim()) t += `\n\nLink: ${d.get('link').trim()}`;
      return t;
    },
    'Central do cliente'
  );
  const topics = [...document.querySelectorAll('.topic')];
  topics.forEach(btn => btn.addEventListener('click', () => {
    topics.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    document.getElementById('c-assunto').value = btn.dataset.topic;
    if (btn.dataset.topic === 'Algo não está funcionando') document.getElementById('c-urg').value = 'Urgente: parou de funcionar';
    document.getElementById('c-nome').focus({ preventScroll: true });
    formCliente.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }));
}

/* ---------- início ---------- */
document.querySelectorAll('.ano').forEach(el => { el.textContent = new Date().getFullYear(); });
veilOut();
