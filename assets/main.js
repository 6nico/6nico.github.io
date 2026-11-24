(() => {
  const EMAIL = "nolmos28@outlook.com";
  const LINKEDIN = "https://www.linkedin.com/in/nicolasolmosba/";
  const GITHUB = "https://github.com/6nico";
  const page = document.body.dataset.page || "";

  const icon = {
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2 3 10v10.3c0 .9.7 1.7 1.7 1.7H9v-6.5h6V22h4.3c.9 0 1.7-.8 1.7-1.7V10z"/></svg>',
    works: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.5C3 5.1 4.1 4 5.5 4h4l2 2.2h7c1.4 0 2.5 1.1 2.5 2.5v9.8c0 1.4-1.1 2.5-2.5 2.5h-13C4.1 21 3 19.9 3 18.5z"/></svg>',
    about: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2.5h9l5 5v13c0 .8-.7 1.5-1.5 1.5h-12.5c-.8 0-1.5-.7-1.5-1.5v-16.5c0-.8.7-1.5 1.5-1.5zm2 9h8v-1.8h-8zm0 4h8v-1.8h-8zm0 4h5v-1.8h-5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6.8C3 5.8 3.8 5 4.8 5h14.4c1 0 1.8.8 1.8 1.8v.3l-9 5.6-9-5.6zm0 2.6 8.5 5.3c.3.2.7.2 1 0L21 9.4v7.8c0 1-.8 1.8-1.8 1.8H4.8c-1 0-1.8-.8-1.8-1.8z"/></svg>',
  };

  // ---- Dock nav ----
  const dock = document.createElement("nav");
  dock.className = "dock";
  dock.setAttribute("aria-label", "Main");
  dock.innerHTML = `
    <a href="/" class="${page === "home" ? "active" : ""}" aria-label="Home">${icon.home}<span class="tip">Home</span></a>
    <a href="/works/" class="${page === "works" ? "active" : ""}" aria-label="Works">${icon.works}<span class="tip">Works</span></a>
    <a href="/about/" class="${page === "about" ? "active" : ""}" aria-label="About">${icon.about}<span class="tip">About</span></a>
    <span class="sep"></span>
    <a href="mailto:${EMAIL}" class="mail" aria-label="Email Nico">${icon.mail}<span class="tip">Email me</span></a>`;
  document.body.appendChild(dock);

  // ---- Contact + footer ----
  const footHost = document.getElementById("footer");
  if (footHost) {
    footHost.innerHTML = `
      <div class="wrap contact">
        <a class="card reveal" href="mailto:${EMAIL}"><span class="label">Let’s Talk</span><big>${EMAIL}</big></a>
        <a class="card reveal d1" href="${LINKEDIN}" target="_blank" rel="noopener"><span class="label">LinkedIn</span><big>in/nicolasolmosba</big></a>
      </div>
      <footer class="wrap foot">
        <div class="card bio reveal">
          <b style="font-size:13px">Hi, I’m Nico.</b>
          <p>From the sales floor to the<br>supply chain, I build tools<br>that make work lighter.</p>
          <div class="avatar">NO</div>
        </div>
        <div class="card links reveal d1">
          <div class="cols">
            <div><span class="label">Menu</span><a href="/">Home</a><a href="/works/">Works</a><a href="/about/">About</a></div>
            <div><span class="label">Follow</span><a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></div>
          </div>
          <div class="bottom">
            <span>© 2026, Nicolas Olmos · Built in San Diego</span>
            <span class="visca">Visca el Barça 🔵🔴</span>
            <a href="#top">Back to Top ↑</a>
          </div>
        </div>
      </footer>`;
  }

  // ---- Scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---- Typed code output ----
  document.querySelectorAll(".code-out[data-type]").forEach((el) => {
    const out = el.querySelector(".typed"), text = el.dataset.type;
    const tio = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      tio.disconnect();
      let i = 0;
      setTimeout(function tick() { out.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(tick, 70); }, 500);
    }, { threshold: 1 });
    tio.observe(el);
  });

  // ---- Count-up stats ----
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600 + Math.min(end, 700);
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(end * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));

  // ---- Carousel ----
  document.querySelectorAll(".carousel").forEach((car) => {
    const track = car.querySelector(".track");
    const cards = [...track.children];
    const dots = car.querySelector(".dots");
    cards.forEach(() => dots.appendChild(document.createElement("i")));
    const idx = () => {
      const x = track.scrollLeft;
      let best = 0, d = Infinity;
      cards.forEach((c, i) => { const dd = Math.abs(c.offsetLeft - cards[0].offsetLeft - x); if (dd < d) { d = dd; best = i; } });
      return best;
    };
    const paint = () => [...dots.children].forEach((d, i) => d.classList.toggle("on", i === idx()));
    const go = (i) => {
      const n = (i + cards.length) % cards.length;
      track.scrollTo({ left: cards[n].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
    };
    car.querySelector(".prev").onclick = () => go(idx() - 1);
    car.querySelector(".next-btn").onclick = () => go(idx() + 1);
    track.addEventListener("scroll", () => requestAnimationFrame(paint), { passive: true });
    paint();
  });

  // ---- About page: word-by-word reveal ----
  document.querySelectorAll("[data-words]").forEach((p) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
  });
  const words = [...document.querySelectorAll(".w")];
  if (words.length) {
    const update = () => {
      const line = innerHeight * 0.78;
      words.forEach((w) => w.classList.toggle("on", w.getBoundingClientRect().top < line));
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  // ---- Easter egg: type "messi" ----
  let buf = "";
  addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-5);
    if (buf === "messi") { buf = ""; confetti(); }
  });
  window.confetti = confetti;
  function confetti() {
    const colors = ["#004d98", "#a50044", "#edbb00", "#004d98", "#a50044"];
    const cx = innerWidth / 2, cy = innerHeight * 0.4;
    for (let i = 0; i < 90; i++) {
      const el = document.createElement("i");
      el.className = "confetti";
      el.style.background = colors[i % colors.length];
      document.body.appendChild(el);
      const ang = Math.random() * Math.PI * 2, v = 6 + Math.random() * 10;
      let x = cx, y = cy, vx = Math.cos(ang) * v, vy = Math.sin(ang) * v - 8, r = Math.random() * 360, life = 0;
      const step = () => {
        life++; vy += 0.35; vx *= 0.985; x += vx; y += vy; r += vx * 2;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
        el.style.opacity = Math.max(0, 1 - life / 120);
        if (life < 120) requestAnimationFrame(step); else el.remove();
      };
      requestAnimationFrame(step);
    }
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.textContent = "🐐 GOAT detected · Visca el Barça!"; document.body.appendChild(t); }
    setTimeout(() => t.classList.add("show"), 20);
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }
})();
