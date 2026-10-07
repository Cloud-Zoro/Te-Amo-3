(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const preguntas = JSON.parse($("datos-preguntas").textContent);
  const mensajesNo = JSON.parse($("datos-no").textContent);
  const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Audio (se genera con el navegador, sin archivos) ----------
  let ctx = null;
  const ESCALA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // pentatónica
  const MELODIA = [2, 4, 5, 4, 6, 5, 3, 7]; // índices de ESCALA, se repite si hay más preguntas

  function audio() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tono(freq, dur = 0.5, tipo = "triangle", vol = 0.18, retraso = 0) {
    const a = audio();
    const t = a.currentTime + retraso;
    const o = a.createOscillator(), g = a.createGain();
    o.type = tipo; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  const notaDe = (i) => ESCALA[MELODIA[i % MELODIA.length]];
  const sonidoError = () => { tono(130, 0.25, "sawtooth", 0.07); tono(123, 0.3, "sawtooth", 0.06, 0.12); };

  // ---------- Piano roll ----------
  const roll = $("roll"), playhead = $("playhead");
  const total = preguntas.length;
  const FILAS = 8, ALTO_FILA = 18;
  const notasDOM = [];

  function posNota(i) {
    const fila = MELODIA[i % MELODIA.length];
    const ancho = 100 / total;
    return {
      left: `calc(${i * ancho}% + 4px)`,
      width: `calc(${ancho}% - 8px)`,
      top: `${(FILAS - 1 - fila) * ALTO_FILA + 2}px`,
    };
  }
  function crearNota(i, clase) {
    const n = document.createElement("div");
    n.className = "nota " + (clase || "");
    Object.assign(n.style, posNota(i));
    roll.appendChild(n);
    return n;
  }
  // notas "fantasma" que indican dónde irá cada una
  for (let i = 0; i < total; i++) crearNota(i, "fantasma");

  function agregarNota(i) {
    const n = crearNota(i);
    notasDOM[i] = n;
    tono(notaDe(i), 0.7);
    tono(notaDe(i) * 2, 0.5, "sine", 0.05);
  }

  function reproducirMelodia(alTerminar) {
    const paso = 0.42; // segundos por nota
    playhead.style.opacity = 1;
    const ancho = roll.clientWidth;
    playhead.style.transition = "none";
    playhead.style.transform = "translateX(0)";
    void playhead.offsetWidth;
    playhead.style.transition = `transform ${paso * total}s linear`;
    playhead.style.transform = `translateX(${ancho}px)`;
    notasDOM.forEach((n, i) => {
      tono(notaDe(i), 0.6, "triangle", 0.2, i * paso);
      tono(notaDe(i) * 2, 0.4, "sine", 0.05, i * paso);
      setTimeout(() => {
        n.classList.add("suena");
        setTimeout(() => n.classList.remove("suena"), paso * 900);
      }, i * paso * 1000);
    });
    // acorde final
    const tf = total * paso;
    [ESCALA[0], ESCALA[2], ESCALA[4], ESCALA[5]].forEach((f) => tono(f, 1.6, "triangle", 0.12, tf));
    setTimeout(() => {
      playhead.style.opacity = 0;
      if (alTerminar) alTerminar();
    }, tf * 1000 + 500);
  }

  // ---------- Pantallas ----------
  const pantallas = ["p-inicio", "p-quiz", "p-final", "p-carta"].map($);
  function ir(id) {
    pantallas.forEach((p) => p.classList.toggle("activa", p.id === id));
    window.scrollTo({ top: 0, behavior: reducir ? "auto" : "smooth" });
  }

  // ---------- Música de fondo (opcional) ----------
  const musica = $("musica"), btnMusica = $("btn-musica");
  if (btnMusica) {
    btnMusica.addEventListener("click", () => {
      if (musica.paused) { musica.play(); btnMusica.classList.remove("callada"); }
      else { musica.pause(); btnMusica.classList.add("callada"); }
    });
  }

  // ---------- Quiz ----------
  let actual = 0;
  const elPregunta = $("pregunta"), elOpciones = $("opciones"),
        elFeedback = $("feedback"), btnSig = $("btn-siguiente"), elContador = $("contador");

  function mostrarPregunta() {
    const q = preguntas[actual];
    elContador.textContent = `Nota ${actual + 1} de ${total}`;
    elPregunta.textContent = q.texto;
    elFeedback.textContent = ""; elFeedback.className = "feedback";
    btnSig.hidden = true;
    elOpciones.innerHTML = "";
    q.opciones.forEach((texto, idx) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "opcion"; b.textContent = texto;
      b.addEventListener("click", () => responder(idx, b));
      elOpciones.appendChild(b);
    });
    elPregunta.focus({ preventScroll: true });
  }

  function responder(idx, boton) {
    const q = preguntas[actual];
    const libre = q.correcta === null || q.correcta === undefined;
    if (libre || idx === q.correcta) {
      boton.classList.add("bien");
      [...elOpciones.children].forEach((b) => (b.disabled = true));
      elFeedback.textContent = q.ok;
      agregarNota(actual);
      btnSig.textContent = actual === total - 1 ? "Escuchar mi melodía" : "Siguiente";
      btnSig.hidden = false;
      btnSig.focus();
    } else {
      boton.classList.add("mal");
      boton.disabled = true;
      elFeedback.textContent = q.mal || "Esa no es, ¡inténtalo otra vez!";
      elFeedback.className = "feedback error";
      sonidoError();
    }
  }

  btnSig.addEventListener("click", () => {
    if (actual < total - 1) { actual++; mostrarPregunta(); }
    else { irAlFinal(); }
  });

  $("btn-empezar").addEventListener("click", () => {
    audio();
    if (musica) { musica.volume = 0.5; musica.play().catch(() => {}); btnMusica.hidden = false; }
    ir("p-quiz");
    mostrarPregunta();
  });

  // ---------- Final ----------
  function irAlFinal() {
    ir("p-final");
    setTimeout(() => reproducirMelodia(() => { $("zona-final").hidden = false; }), 600);
  }

  // Botón "No" que se escapa
  const btnNo = $("btn-no"), btnSi = $("btn-si");
  let intentos = 0;
  function escapar(e) {
    if (e) e.preventDefault();
    intentos++;
    btnNo.textContent = mensajesNo[Math.min(intentos, mensajesNo.length - 1)];
    btnNo.classList.add("escapa");
    const m = 12, r = btnNo.getBoundingClientRect();
    const x = m + Math.random() * (window.innerWidth - r.width - m * 2);
    const y = m + Math.random() * (window.innerHeight - r.height - m * 2);
    btnNo.style.left = x + "px"; btnNo.style.top = y + "px";
    btnSi.style.transform = `scale(${Math.min(1 + intentos * 0.08, 1.5)})`;
    tono(180 + intentos * 40, 0.15, "square", 0.05);
  }
  btnNo.addEventListener("pointerenter", escapar);
  btnNo.addEventListener("pointerdown", escapar);
  btnNo.addEventListener("click", escapar);

  btnSi.addEventListener("click", () => {
    ir("p-carta");
    confeti();
    [0, 2, 4, 5].forEach((i, k) => tono(ESCALA[i], 1.4, "triangle", 0.12, k * 0.12));
    const parrafos = [...document.querySelectorAll("#carta p")];
    if (reducir) return;
    parrafos.forEach((p) => p.classList.add("oculto"));
    parrafos.forEach((p, i) => setTimeout(() => p.classList.remove("oculto"), 700 + i * 1400));
  });

  $("btn-repetir").addEventListener("click", () => reproducirMelodia());

  // ---------- Confeti ----------
  function confeti() {
    const c = $("confeti"), g = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    g.scale(dpr, dpr);
    if (reducir) return;
    const colores = ["#39c5bb", "#bff5ef", "#e12885", "#ffffff"];
    const formas = ["♪", "♫", "♥", "rect"];
    const ps = Array.from({ length: 110 }, () => ({
      x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3.5,
      s: 14 + Math.random() * 18, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.15,
      col: colores[(Math.random() * colores.length) | 0],
      f: formas[(Math.random() * formas.length) | 0],
    }));
    let frames = 0;
    (function dibujar() {
      g.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.col;
        if (p.f === "rect") g.fillRect(-4, -7, 8, 14);
        else { g.font = `${p.s}px sans-serif`; g.fillText(p.f, 0, 0); }
        g.restore();
      });
      if (++frames < 420) requestAnimationFrame(dibujar);
      else g.clearRect(0, 0, innerWidth, innerHeight);
    })();
  }
})();
