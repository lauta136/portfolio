document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const themeButton = document.querySelector('.theme-toggle');
const typedRole = document.querySelector('#typed-role');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
  mobileNav?.classList.toggle('is-open', !open);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
  });
});

themeButton?.addEventListener('click', () => {
  const light = document.body.classList.toggle('light-theme');
  themeButton.setAttribute('aria-label', light ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  themeButton.title = light ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
  themeButton.firstElementChild.textContent = light ? '☾' : '☼';
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (typedRole && !reducedMotion.matches) {
  const roles = ['Analista de Sistemas', 'Estudiante de Ingeniería en Sistemas'];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;
  const typeNext = () => {
    const role = roles[roleIndex];
    characterIndex += deleting ? -1 : 1;
    typedRole.textContent = role.slice(0, characterIndex);
    let delay = deleting ? 37 : 62;
    if (!deleting && characterIndex === role.length) {
      deleting = true;
      delay = 1900;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 330;
    }
    window.setTimeout(typeNext, delay);
  };
  window.setTimeout(typeNext, 2200);
}

const canvas = document.querySelector('.particle-field');
const context = canvas?.getContext('2d');
if (canvas && context && !reducedMotion.matches) {
  const section = canvas.closest('.hero');
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let inView = true;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(62, Math.max(26, Math.round(width / 18)));
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.4 + 0.45,
        tone: Math.random() > 0.84 ? 'red' : 'blue',
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    const limit = width < 620 ? 105 : 145;
    particles.forEach((point, index) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      const color = point.tone === 'red' ? '250,64,85' : '66,166,255';
      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${color},0.64)`;
      context.fill();
      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < limit) {
          const alpha = (1 - distance / limit) * 0.16;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(83,151,218,${alpha})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }
    });
    if (inView) animationFrame = window.requestAnimationFrame(draw);
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !animationFrame) animationFrame = window.requestAnimationFrame(draw);
    if (!inView && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }, { threshold: 0 });
  resize();
  draw();
  visibilityObserver.observe(section);
  window.addEventListener('resize', resize, { passive: true });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
