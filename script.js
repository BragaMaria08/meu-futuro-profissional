/* ===========================================================
   MEU FUTURO PROFISSIONAL – script.js
   Funcionalidades:
   1) Tema claro/escuro (salvo no navegador)
   2) Menu responsivo (celular)
   3) Linha do tempo interativa
   4) Cartões expansíveis (tecnologia)
   5) Checklist de objetivos com barra de progresso
   6) Barras de habilidades animadas + animação ao rolar
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1) Tema claro/escuro ---------- */
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeBtn.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      themeBtn.textContent = '🌙';
    }
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('tema'); } catch (e) { /* ignora */ }
  if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    savedTheme = 'dark';
  }
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('tema', next); } catch (e) { /* ignora */ }
  });

  /* ---------- 2) Menu responsivo ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
    });
  });

  /* Destaca no menu a seção que está na tela */
  const sections = document.querySelectorAll('main section[id]');
  const linkMap = {};
  navLinks.querySelectorAll('a').forEach(a => { linkMap[a.getAttribute('href').slice(1)] = a; });

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Object.values(linkMap).forEach(a => a.classList.remove('active'));
        if (linkMap[entry.target.id]) linkMap[entry.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- 3) Linha do tempo interativa ---------- */
  const dots = document.querySelectorAll('.tl-dot');
  const panels = document.querySelectorAll('.tl-panel');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => { d.classList.remove('active'); d.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('show'));
      dot.classList.add('active');
      dot.setAttribute('aria-selected', 'true');
      document.getElementById(dot.dataset.target).classList.add('show');
    });
  });

  /* ---------- 4) Cartões expansíveis ---------- */
  document.querySelectorAll('.tech-head').forEach(head => {
    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      const isOpen = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!isOpen));
      body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
    });
  });

  /* ---------- 5) Checklist de objetivos ---------- */
  const checks = document.querySelectorAll('#goals input[type="checkbox"]');
  const fill = document.getElementById('goalFill');
  const percent = document.getElementById('goalPercent');

  function updateProgress() {
    const done = [...checks].filter(c => c.checked).length;
    const pct = Math.round((done / checks.length) * 100);
    fill.style.width = pct + '%';
    percent.textContent = pct + '%';
    try {
      localStorage.setItem('metas', JSON.stringify([...checks].map(c => c.checked)));
    } catch (e) { /* ignora */ }
  }

  try {
    const saved = JSON.parse(localStorage.getItem('metas') || '[]');
    saved.forEach((value, i) => { if (checks[i]) checks[i].checked = value; });
  } catch (e) { /* ignora */ }

  checks.forEach(c => c.addEventListener('change', updateProgress));
  updateProgress();

  /* ---------- 6) Animação ao rolar + barras de habilidades ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.level + '%';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
