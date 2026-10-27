/* Live calculators for the AI Engineer Path. Each widget renders into a host element and recomputes on input. */
(function () {
const W = {};
const $ = (host, s) => host.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tok = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';

/* ---------- number formatting ---------- */
const sig = (x, d = 3) => { if (!isFinite(x)) return x > 0 ? '∞' : (x < 0 ? '−∞' : 'NaN'); if (x === 0) return '0';
  const a = Math.abs(x); if (a >= 1e5 || a < 1e-3) return x.toExponential(d - 1).replace('e+', 'e'); return (+x.toPrecision(d)).toLocaleString('en-US', { maximumFractionDigits: 6 }); };
const big = x => { const a = Math.abs(x); if (a >= 1e12) return sig(x / 1e12) + ' T'; if (a >= 1e9) return sig(x / 1e9) + ' B'; if (a >= 1e6) return sig(x / 1e6) + ' M'; if (a >= 1e3) return sig(x / 1e3) + ' K'; return sig(x); };
const int = x => Math.round(x).toLocaleString('en-US');
const bytes = b => { const a = Math.abs(b); if (a >= 1e12) return sig(b / 1e12) + ' TB'; if (a >= 1e9) return sig(b / 1e9) + ' GB'; if (a >= 1e6) return sig(b / 1e6) + ' MB'; if (a >= 1e3) return sig(b / 1e3) + ' KB'; return sig(b) + ' B'; };
const secs = s => { if (!isFinite(s)) return '∞'; if (s < 1e-3) return sig(s * 1e6) + ' µs'; if (s < 1) return sig(s * 1e3) + ' ms'; if (s < 120) return sig(s) + ' s'; if (s < 7200) return sig(s / 60) + ' min'; if (s < 172800) return sig(s / 3600) + ' h'; return sig(s / 86400) + ' days'; };

/* ---------- control builders ---------- */
const num = (k, label, v, a = {}) => `<label class="cf"><span>${label}</span><input type="number" data-k="${k}" value="${v}"${a.min != null ? ` min="${a.min}"` : ''}${a.max != null ? ` max="${a.max}"` : ''} step="${a.step || 'any'}"></label>`;
const rng = (k, label, v, min, max, step) => `<label class="cf"><span>${label} <b data-o="${k}"></b></span><input type="range" data-k="${k}" value="${v}" min="${min}" max="${max}" step="${step}"></label>`;
const sel = (k, label, opts, v) => `<label class="cf"><span>${label}</span><select data-k="${k}">${opts.map(o => { const [val, txt] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(val)}"${String(val) === String(v) ? ' selected' : ''}>${esc(txt)}</option>`; }).join('')}</select></label>`;
const chk = (k, label, v) => `<label class="cf ck"><input type="checkbox" data-k="${k}"${v ? ' checked' : ''}><span>${label}</span></label>`;
const btn = (a, label, primary) => `<button type="button" class="btn${primary ? ' primary' : ''} sm" data-act="${a}">${label}</button>`;
function read(host) { const o = {}; host.querySelectorAll('[data-k]').forEach(el => { o[el.dataset.k] = el.type === 'checkbox' ? el.checked : (el.tagName === 'SELECT' ? el.value : parseFloat(el.value)); }); return o; }
function setv(host, k, v) { const el = host.querySelector(`[data-k="${k}"]`); if (!el) return; if (el.type === 'checkbox') el.checked = !!v; else el.value = v; }
function shell(host, controls, extra) { host.innerHTML = `<div class="calc-grid"><div class="calc-ctl">${controls}</div><div class="calc-out" aria-live="polite"></div></div>${extra || ''}`; return $(host, '.calc-out'); }
const kv = (label, value, cls) => `<div class="kvr${cls ? ' ' + cls : ''}"><span>${label}</span><b>${value}</b></div>`;
const bar = (label, frac, value, kind) => `<div class="cbar${kind ? ' ' + kind : ''}"><div class="cbar-l"><span>${label}</span><b>${value}</b></div><div class="cbar-t"><i style="width:${Math.max(0, Math.min(100, frac * 100)).toFixed(1)}%"></i></div></div>`;
const pill = (txt, kind) => `<span class="cpill ${kind || ''}">${txt}</span>`;
function live(host, fn) { const run = () => { host.querySelectorAll('[data-o]').forEach(o => { const el = host.querySelector(`[data-k="${o.dataset.o}"]`); if (el) o.textContent = o.dataset.fmt === 'pow' ? sig(Math.pow(10, +el.value), 2) : el.value; }); fn(read(host)); }; host.addEventListener('input', run); host.addEventListener('change', run); run(); return run; }
function canvas(el, h) { const c = el; const dpr = window.devicePixelRatio || 1; const w = c.clientWidth || 320; c.width = w * dpr; c.height = h * dpr; c.style.height = h + 'px'; const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return { ctx, w, h }; }
function rand(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

const GPUS = {
  T4: { name: 'NVIDIA T4 (16 GB)', mem: 16, bw: 320, fp32: 8.1, half: 65 },
  A10G: { name: 'NVIDIA A10G (24 GB) · g5', mem: 24, bw: 600, fp32: 31.2, half: null },
  L4: { name: 'NVIDIA L4 (24 GB) · g6', mem: 24, bw: 300, fp32: 30.3, half: 121 },
  A100_40: { name: 'NVIDIA A100 40 GB · p4d', mem: 40, bw: 1555, fp32: 19.5, half: 312 },
  A100_80: { name: 'NVIDIA A100 80 GB · p4de', mem: 80, bw: 2039, fp32: 19.5, half: 312 },
  H100: { name: 'NVIDIA H100 80 GB · p5', mem: 80, bw: 3350, fp32: 67, half: 989 }
};
const gpuOpts = keys => keys.map(k => [k, GPUS[k].name]);

/* =========================== A01 matmul =========================== */
W.matmul = host => {
  const out = shell(host, num('m', 'm (rows of A)', 4096, { min: 1 }) + num('k', 'k (inner dim)', 4096, { min: 1 }) + num('n', 'n (cols of B)', 4096, { min: 1 }) +
    sel('dt', 'Data type', [['4', 'fp32 (4 bytes)'], ['2', 'bf16 / fp16 (2 bytes)']], '2') + sel('gpu', 'GPU (vendor dense peak)', gpuOpts(['T4', 'L4', 'A100_80', 'H100']), 'A100_80') +
    `<p class="cnote">Presets: ${btn('p1', '4096²')} ${btn('p2', 'MNIST batch 64×784×10')} ${btn('p3', 'decode: 1×4096×4096')}</p>`);
  const run = live(host, v => {
    const g = GPUS[v.gpu], b = +v.dt, F = 2 * v.m * v.k * v.n, by = (v.m * v.k + v.k * v.n + v.m * v.n) * b;
    const P = (b === 4 ? g.fp32 : g.half) * 1e12, B = g.bw * 1e9, I = F / by, ridge = P / B, tc = F / P, tm = by / B, compute = tc >= tm;
    const pos = Math.log10(I / ridge);
    out.innerHTML = kv('FLOPs = 2mkn', big(F)) + kv('Bytes moved (A + B + C)', bytes(by)) + kv('Arithmetic intensity', sig(I) + ' FLOP/byte') +
      kv(`GPU ridge point (peak ÷ bandwidth)`, sig(ridge) + ' FLOP/byte') +
      bar('Intensity relative to ridge (log scale)', 0.5 + Math.max(-1, Math.min(1, pos / 3)) / 2, compute ? 'above: compute-bound' : 'below: memory-bound', compute ? 'good' : 'warn') +
      kv('Time if compute-limited', secs(tc)) + kv('Time if memory-limited', secs(tm)) +
      kv('Best-case time', secs(Math.max(tc, tm)), 'hl') + `<p class="cnote">${pill(compute ? 'compute-bound' : 'memory-bound', compute ? 'good' : 'warn')} Real kernels reach roughly 50–80% of these bounds.</p>`;
  });
  host.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return;
    const p = { p1: [4096, 4096, 4096], p2: [64, 784, 10], p3: [1, 4096, 4096] }[a.dataset.act]; ['m', 'k', 'n'].forEach((k, i) => setv(host, k, p[i])); run(); });
};

/* =========================== A02 softmax =========================== */
W.softmax = host => {
  const z0 = [2, 1, 0.1, -1];
  const out = shell(host, z0.map((z, i) => rng('z' + i, `logit z${i}`, z, -6, 6, 0.1)).join('') + rng('T', 'temperature T', 1, 0.1, 3, 0.05) +
    sel('y', 'true class y', [0, 1, 2, 3].map(i => [i, 'class ' + i]), 0));
  live(host, v => {
    const z = [0, 1, 2, 3].map(i => v['z' + i] / v.T), m = Math.max(...z), e = z.map(x => Math.exp(x - m)), S = e.reduce((a, b) => a + b, 0), p = e.map(x => x / S);
    const L = -Math.log(p[v.y]), H = -p.reduce((a, q) => a + (q > 0 ? q * Math.log(q) : 0), 0);
    let rows = '<table class="ctbl"><thead><tr><th>class</th><th>z/T</th><th>p</th><th>p − y</th></tr></thead><tbody>';
    p.forEach((q, i) => { const g = q - (i === +v.y ? 1 : 0);
      rows += `<tr class="${i === +v.y ? 'on' : ''}"><td>${i}${i === +v.y ? ' ✓' : ''}</td><td>${sig(z[i], 3)}</td><td><div class="minibar"><i style="width:${(q * 100).toFixed(1)}%"></i><span>${q.toFixed(3)}</span></div></td><td class="${g < 0 ? 'neg' : 'pos'}">${g >= 0 ? '+' : '−'}${Math.abs(g).toFixed(3)}</td></tr>`; });
    rows += '</tbody></table>';
    out.innerHTML = rows + kv('Cross-entropy L = −ln p_y', L.toFixed(4), 'hl') + kv('Entropy of p (nats)', H.toFixed(3)) + kv('Perplexity e^L', sig(Math.exp(L))) +
      `<p class="cnote">Negative gradient entries rise under gradient descent. The true class always has p − 1 ≤ 0; all others are ≥ 0, and they sum to zero.</p>`;
  });
};

/* =========================== A03 optimizer race =========================== */
W.optimizer = host => {
  const out = shell(host, sel('opt', 'Optimizer', [['all', 'Compare all three'], ['sgd', 'SGD'], ['mom', 'SGD + momentum 0.9'], ['adam', 'Adam (β 0.9, 0.999)']], 'all') +
    `<label class="cf"><span>learning rate η <b data-o="lr" data-fmt="pow"></b></span><input type="range" data-k="lr" value="-1.3" min="-3" max="0" step="0.01"></label>` +
    rng('kappa', 'condition number κ', 25, 1, 100, 1) + rng('steps', 'steps', 100, 10, 300, 10) + `<p class="cnote">${btn('run', '▶ Run', true)}</p>`,
    '<canvas class="ccanvas" aria-label="Optimizer paths on the loss contours"></canvas>');
  const cv = $(host, 'canvas');
  const f = (x, y, k) => 0.5 * (x * x + k * y * y);
  function path(kind, lr, k, n) {
    let x = -4, y = 1.5, vx = 0, vy = 0, mx = 0, my = 0, sx = 0, sy = 0; const pts = [[x, y]];
    for (let t = 1; t <= n; t++) {
      const gx = x, gy = k * y;
      if (kind === 'sgd') { x -= lr * gx; y -= lr * gy; }
      else if (kind === 'mom') { vx = 0.9 * vx + gx; vy = 0.9 * vy + gy; x -= lr * vx; y -= lr * vy; }
      else { mx = 0.9 * mx + 0.1 * gx; my = 0.9 * my + 0.1 * gy; sx = 0.999 * sx + 0.001 * gx * gx; sy = 0.999 * sy + 0.001 * gy * gy;
        const c1 = 1 - Math.pow(0.9, t), c2 = 1 - Math.pow(0.999, t); x -= lr * (mx / c1) / (Math.sqrt(sx / c2) + 1e-8); y -= lr * (my / c1) / (Math.sqrt(sy / c2) + 1e-8); }
      pts.push([x, y]); if (!isFinite(x) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) break;
    }
    return pts;
  }
  let anim = 0;
  function draw(v, progress) {
    const { ctx, w, h } = canvas(cv, 280), k = v.kappa, X = 5, Y = X * h / w;
    const px = x => (x + X) / (2 * X) * w, py = y => h - (y + Y) / (2 * Y) * h;
    ctx.fillStyle = tok('--paper'); ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = tok('--line'); ctx.lineWidth = 1;
    [0.05, 0.3, 1, 2.5, 5, 9, 14].forEach(c => { ctx.beginPath(); ctx.ellipse(px(0), py(0), Math.sqrt(2 * c) / (2 * X) * w, Math.sqrt(2 * c / k) / (2 * Y) * h, 0, 0, 2 * Math.PI); ctx.stroke(); });
    ctx.fillStyle = tok('--ink'); ctx.beginPath(); ctx.arc(px(0), py(0), 3, 0, 7); ctx.fill();
    const kinds = v.opt === 'all' ? ['sgd', 'mom', 'adam'] : [v.opt], cols = { sgd: tok('--k-compute'), mom: tok('--k-net'), adam: tok('--k-int') }, lr = Math.pow(10, v.lr);
    const res = [];
    kinds.forEach(kd => {
      const pts = path(kd, lr, k, v.steps), upto = Math.max(1, Math.floor(pts.length * progress));
      ctx.strokeStyle = cols[kd]; ctx.lineWidth = 2; ctx.beginPath();
      pts.slice(0, upto).forEach(([x, y], i) => { const a = px(Math.max(-1e4, Math.min(1e4, x))), b = py(Math.max(-1e4, Math.min(1e4, y))); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); });
      ctx.stroke(); const [lx, ly] = pts[upto - 1]; ctx.fillStyle = cols[kd]; ctx.beginPath(); ctx.arc(px(lx), py(ly), 4, 0, 7); ctx.fill();
      const last = pts[pts.length - 1], L = f(last[0], last[1], k); res.push([kd, L, pts.length - 1]);
    });
    return res;
  }
  const names = { sgd: 'SGD', mom: 'Momentum', adam: 'Adam' };
  function summary(v, res) {
    const lr = Math.pow(10, v.lr), lim = 2 / v.kappa;
    out.innerHTML = kv('Loss', `f(x, y) = ½(x² + ${v.kappa}·y²)`) + kv('SGD stability limit 2/κ', sig(lim) + (lr >= lim ? '  (η is above it)' : '')) +
      res.map(([kd, L, n]) => { const bad = !isFinite(L) || L > 1e6; return bar(`${names[kd]} · final loss after ${n} steps`, bad ? 1 : Math.min(1, Math.max(0, (Math.log10(L) + 8) / 10)), bad ? 'diverged' : sig(L), kd === 'sgd' ? 'c1' : kd === 'mom' ? 'c2' : 'c3'); }).join('') +
      `<p class="cnote">Start (−4, 1.5), minimum at the dot. Orange SGD, blue momentum, magenta Adam. Try η = 0.07 vs 0.081 with κ = 25.</p>`;
  }
  const run = live(host, v => summary(v, draw(v, 1)));
  host.addEventListener('click', e => { if (!e.target.closest('[data-act="run"]')) return; const v = read(host); cancelAnimationFrame(anim); const t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1600); const r = draw(v, p); if (p < 1) anim = requestAnimationFrame(step); else summary(v, r); }; anim = requestAnimationFrame(step); });
  addEventListener('resize', () => run && run());
};

/* =========================== A04 backprop =========================== */
W.backprop = host => {
  const init = { x: 2, y: 3, w1: 0.5, b1: 0, w2: 2, b2: 0.5, lr: 0.05 };
  const out = shell(host, Object.keys(init).map(k => num(k, { x: 'input x', y: 'target y', w1: 'w₁', b1: 'b₁', w2: 'w₂', b2: 'b₂', lr: 'learning rate η' }[k], init[k], { step: 0.01 })).join('') +
    `<p class="cnote">${btn('step', 'Take a step', true)} ${btn('reset', 'Reset')}</p>`);
  let hist = [];
  const calc = v => { const a = v.w1 * v.x + v.b1, h = Math.max(0, a), yh = v.w2 * h + v.b2, L = 0.5 * (yh - v.y) ** 2, dy = yh - v.y, gate = a > 0 ? 1 : 0;
    return { a, h, yh, L, dy, dw2: dy * h, db2: dy, dh: dy * v.w2, da: dy * v.w2 * gate, dw1: dy * v.w2 * gate * v.x, db1: dy * v.w2 * gate, gate }; };
  const run = live(host, v => { const r = calc(v); if (!hist.length) hist = [r.L];
    out.innerHTML = `<div class="two-col"><div><h5>Forward</h5>${kv('a = w₁x + b₁', sig(r.a, 4))}${kv('h = ReLU(a)', sig(r.h, 4))}${kv('ŷ = w₂h + b₂', sig(r.yh, 4))}${kv('L = ½(ŷ − y)²', sig(r.L, 4), 'hl')}</div>` +
      `<div><h5>Backward</h5>${kv('∂L/∂ŷ = ŷ − y', sig(r.dy, 4))}${kv('∂L/∂w₂ = ∂L/∂ŷ · h', sig(r.dw2, 4))}${kv('∂L/∂b₂', sig(r.db2, 4))}${kv('∂L/∂h = ∂L/∂ŷ · w₂', sig(r.dh, 4))}${kv(`∂L/∂a (ReLU gate ${r.gate ? 'open' : 'closed'})`, sig(r.da, 4))}${kv('∂L/∂w₁ = ∂L/∂a · x', sig(r.dw1, 4))}${kv('∂L/∂b₁', sig(r.db1, 4))}</div></div>` +
      `<p class="cnote">Loss history: ${hist.map(l => sig(l, 3)).join(' → ')}</p>`; });
  host.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'reset') { Object.keys(init).forEach(k => setv(host, k, init[k])); hist = []; }
    else { const v = read(host), r = calc(v); setv(host, 'w1', +(v.w1 - v.lr * r.dw1).toFixed(6)); setv(host, 'b1', +(v.b1 - v.lr * r.db1).toFixed(6)); setv(host, 'w2', +(v.w2 - v.lr * r.dw2).toFixed(6)); setv(host, 'b2', +(v.b2 - v.lr * r.db2).toFixed(6)); hist.push(calc(read(host)).L); }
    run(); });
  host.addEventListener('input', e => { if (e.target.dataset.k && e.isTrusted) { hist = []; } }, true);
};

/* =========================== A05 init / signal propagation =========================== */
W.init = host => {
  const out = shell(host, sel('init', 'Initialisation', [['normal', 'Normal, std = 1'], ['xavier', 'Xavier: std = √(2/(n_in+n_out))'], ['he', 'He: std = √(2/n_in)']], 'he') +
    sel('act', 'Activation', [['relu', 'ReLU'], ['tanh', 'tanh']], 'relu') + rng('depth', 'depth (layers)', 50, 5, 100, 5) +
    chk('res', 'add residual connections (x + f(x)/√depth)', false) + `<p class="cnote">Width 128, batch 64, seeded random weights. ${btn('go', 'Simulate', true)}</p>`,
    '<canvas class="ccanvas" aria-label="Activation standard deviation per layer"></canvas>');
  const cv = $(host, 'canvas');
  function simulate(v) {
    const n = 128, B = 64, r = rand(42); let x = new Float64Array(B * n); for (let i = 0; i < x.length; i++) x[i] = gauss(r);
    const std = v.init === 'normal' ? 1 : v.init === 'xavier' ? Math.sqrt(2 / (2 * n)) : Math.sqrt(2 / n), stds = [];
    const Wm = new Float64Array(n * n);
    for (let l = 0; l < v.depth; l++) {
      for (let i = 0; i < Wm.length; i++) Wm[i] = gauss(r) * std;
      const y = new Float64Array(B * n);
      for (let b = 0; b < B; b++) for (let j = 0; j < n; j++) { let s = 0; for (let i = 0; i < n; i++) s += x[b * n + i] * Wm[i * n + j]; y[b * n + j] = v.act === 'relu' ? Math.max(0, s) : Math.tanh(s); }
      if (v.res) for (let i = 0; i < y.length; i++) y[i] = x[i] + y[i] / Math.sqrt(v.depth);
      x = y; let m = 0, q = 0; for (let i = 0; i < x.length; i++) { m += x[i]; q += x[i] * x[i]; } m /= x.length; stds.push(Math.sqrt(Math.max(0, q / x.length - m * m)));
    }
    return stds;
  }
  function draw(stds) {
    const { ctx, w, h } = canvas(cv, 220), padL = 40, padB = 22, logs = stds.map(s => Math.log10(Math.max(s, 1e-300))), lo = Math.min(-2, Math.floor(Math.min(...logs))), hi = Math.max(1, Math.ceil(Math.max(...logs)));
    const X = i => padL + (w - padL - 8) * i / Math.max(1, stds.length - 1), Y = lg => 8 + (h - 8 - padB) * (hi - lg) / (hi - lo);
    ctx.fillStyle = tok('--paper'); ctx.fillRect(0, 0, w, h); ctx.font = '11px ' + tok('--mono'); ctx.fillStyle = tok('--muted'); ctx.strokeStyle = tok('--line');
    const stepT = Math.max(1, Math.ceil((hi - lo) / 6));
    for (let t = lo; t <= hi; t += stepT) { ctx.beginPath(); ctx.moveTo(padL, Y(t)); ctx.lineTo(w - 8, Y(t)); ctx.stroke(); ctx.fillText('1e' + t, 4, Y(t) + 4); }
    ctx.fillText('layer 1', padL, h - 6); ctx.fillText('layer ' + stds.length, w - 70, h - 6);
    ctx.strokeStyle = tok('--accent'); ctx.lineWidth = 2; ctx.beginPath(); logs.forEach((lg, i) => i ? ctx.lineTo(X(i), Y(lg)) : ctx.moveTo(X(i), Y(lg))); ctx.stroke();
  }
  const run = () => { const v = read(host); host.querySelectorAll('[data-o]').forEach(o => o.textContent = read(host)[o.dataset.o]); const s = simulate(v); draw(s);
    const last = s[s.length - 1], verdict = last > 1e3 ? ['exploding', 'bad'] : last < 1e-3 ? ['vanishing', 'warn'] : ['stable', 'good'];
    out.innerHTML = kv('std after layer 1', sig(s[0])) + kv(`std after layer ${s.length}`, sig(last), 'hl') + `<p class="cnote">${pill(verdict[0], verdict[1])} Matched pairs: ReLU + He and tanh + Xavier stay stable; std = 1 explodes (×√(n/2) = ×8 per ReLU layer here).</p>`; };
  host.addEventListener('change', run); host.addEventListener('click', e => { if (e.target.closest('[data-act="go"]')) run(); });
  host.addEventListener('input', e => { if (e.target.type === 'range') { const o = host.querySelector(`[data-o="${e.target.dataset.k}"]`); if (o) o.textContent = e.target.value; } });
  run(); addEventListener('resize', run);
};

/* =========================== A06 conv =========================== */
W.conv = host => {
  const out = shell(host, num('H', 'input height H', 224, { min: 1 }) + num('Wd', 'input width W', 224, { min: 1 }) + num('Cin', 'input channels', 3, { min: 1 }) + num('Cout', 'output channels (filters)', 64, { min: 1 }) +
    num('K', 'kernel size K', 7, { min: 1 }) + num('S', 'stride S', 2, { min: 1 }) + num('P', 'padding P', 3, { min: 0 }) + num('B', 'batch size', 1, { min: 1 }) + chk('bias', 'bias', false));
  live(host, v => {
    const Ho = Math.floor((v.H + 2 * v.P - v.K) / v.S) + 1, Wo = Math.floor((v.Wd + 2 * v.P - v.K) / v.S) + 1;
    if (Ho < 1 || Wo < 1) { out.innerHTML = `<p class="cnote">${pill('invalid', 'bad')} Kernel larger than the padded input.</p>`; return; }
    const params = v.K * v.K * v.Cin * v.Cout + (v.bias ? v.Cout : 0), macs = v.B * Ho * Wo * v.K * v.K * v.Cin * v.Cout, act = v.B * v.Cout * Ho * Wo;
    out.innerHTML = kv('Output size ⌊(H + 2P − K)/S⌋ + 1', `${Ho} × ${Wo}`) + kv('Output shape', `(${v.B}, ${v.Cout}, ${Ho}, ${Wo})`, 'hl') + kv('Parameters K²·C_in·C_out' + (v.bias ? ' + C_out' : ''), int(params)) +
      kv('Multiply-adds (MACs)', big(macs)) + kv('FLOPs (2 × MACs)', big(2 * macs)) + kv('Output activations (fp32 / bf16)', `${bytes(act * 4)} / ${bytes(act * 2)}`) +
      kv('Same as a dense layer? params', int(v.H * v.Wd * v.Cin * Ho * Wo * v.Cout)) + `<p class="cnote">Weight sharing: a dense layer with the same input/output sizes would need the parameter count in the last row.</p>`;
  });
};

/* =========================== A07 BPE =========================== */
W.bpe = host => {
  const def = 'low low low low low lower lower newest newest newest newest newest newest widest widest widest';
  host.innerHTML = `<div class="calc-grid"><div class="calc-ctl"><label class="cf"><span>Corpus</span><textarea data-k="text" rows="5">${def}</textarea></label><p class="cnote">${btn('merge', 'Merge once', true)} ${btn('merge5', 'Merge ×5')} ${btn('reset', 'Reset')}</p></div><div class="calc-out" aria-live="polite"></div></div>`;
  const out = $(host, '.calc-out'); let vocab, merges;
  function reset() { const words = {}; ($(host, 'textarea').value.toLowerCase().match(/\S+/g) || []).forEach(w => words[w] = (words[w] || 0) + 1);
    vocab = Object.entries(words).map(([w, c]) => ({ w, c, s: [...w, '</w>'] })); merges = []; }
  function step() { const pairs = new Map(); vocab.forEach(({ s, c }) => { for (let i = 0; i < s.length - 1; i++) { const k = s[i] + '\u0001' + s[i + 1]; pairs.set(k, (pairs.get(k) || 0) + c); } });
    if (!pairs.size) return false; let best = null, bc = 0; pairs.forEach((c, k) => { if (c > bc) { bc = c; best = k; } }); const [a, b] = best.split('\u0001');
    vocab.forEach(v => { const o = []; for (let i = 0; i < v.s.length; i++) { if (i < v.s.length - 1 && v.s[i] === a && v.s[i + 1] === b) { o.push(a + b); i++; } else o.push(v.s[i]); } v.s = o; });
    merges.push([a, b, bc]); return true; }
  function render() { const toks = vocab.reduce((t, v) => t + v.c * v.s.length, 0), uniq = new Set(); vocab.forEach(v => v.s.forEach(x => uniq.add(x)));
    out.innerHTML = kv('Merges applied', merges.length) + kv('Tokens in corpus', int(toks), 'hl') + kv('Distinct symbols in use', uniq.size) +
      `<h5>Merge rules (in order)</h5><ol class="merges">${merges.map(([a, b, c]) => `<li><code>${esc(a)}</code> + <code>${esc(b)}</code> → <code>${esc(a + b)}</code> <span>(${c})</span></li>`).join('') || '<li class="cnote">none yet</li>'}</ol>` +
      `<h5>Current segmentation</h5><div class="segs">${vocab.map(v => `<div><span class="cnt">×${v.c}</span>${v.s.map(x => `<span class="tokc">${esc(x)}</span>`).join('')}</div>`).join('')}</div>`; }
  reset(); render();
  host.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return; if (a.dataset.act === 'reset') reset(); else for (let i = 0; i < (a.dataset.act === 'merge5' ? 5 : 1); i++) step(); render(); });
  $(host, 'textarea').addEventListener('change', () => { reset(); render(); });
};

/* =========================== A08 attention =========================== */
W.attention = host => {
  const Q = [[1, 0], [0, 1], [1, 1]], K = [[1, 0], [0, 1], [1, 1]], V = [[1, 0], [0, 2], [1, 1]];
  const mat = (name, M) => `<div class="mat"><span>${name}</span><table>${M.map((r, i) => `<tr><th>t${i + 1}</th>${r.map((x, j) => `<td><input type="number" step="0.1" data-k="${name}${i}${j}" value="${x}" aria-label="${name} row ${i + 1} col ${j + 1}"></td>`).join('')}</tr>`).join('')}</table></div>`;
  const out = shell(host, `<div class="mats">${mat('Q', Q)}${mat('K', K)}${mat('V', V)}</div>` + chk('causal', 'causal mask', true) + chk('scale', 'divide by √d_k (d_k = 2)', true) + `<p class="cnote">${btn('reset', 'Reset to worked example')}</p>`);
  const show = (M, title, heat) => `<div class="mat out"><span>${title}</span><table>${M.map((r, i) => `<tr><th>t${i + 1}</th>${r.map(x => `<td${heat && isFinite(x) ? ` style="background:color-mix(in srgb, var(--accent) ${Math.round(x * 85)}%, transparent)"` : ''}>${isFinite(x) ? x.toFixed(3) : '−∞'}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const run = live(host, v => {
    const g = (n, i, j) => v[n + i + j], sc = v.scale ? Math.SQRT2 : 1, S = [], A = [], O = [];
    for (let i = 0; i < 3; i++) { S.push([]); for (let j = 0; j < 3; j++) S[i].push(v.causal && j > i ? -Infinity : (g('Q', i, 0) * g('K', j, 0) + g('Q', i, 1) * g('K', j, 1)) / sc); }
    S.forEach(r => { const m = Math.max(...r), e = r.map(x => isFinite(x) ? Math.exp(x - m) : 0), s = e.reduce((a, b) => a + b, 0); A.push(e.map(x => x / s)); });
    A.forEach((r, i) => O.push([0, 1].map(c => r.reduce((a, w, j) => a + w * g('V', j, c), 0))));
    out.innerHTML = `<div class="mats">${show(S, v.scale ? 'scores QKᵀ/√2' : 'scores QKᵀ')}${show(A, 'weights (softmax)', true)}${show(O, 'output A·V')}</div>` +
      `<p class="cnote">Each row of weights sums to 1. Row t3 should read 0.248, 0.248, 0.503 at the defaults. Turn off the mask and t1 starts attending to the future.</p>`;
  });
  host.addEventListener('click', e => { if (!e.target.closest('[data-act="reset"]')) return; [['Q', Q], ['K', K], ['V', V]].forEach(([n, M]) => M.forEach((r, i) => r.forEach((x, j) => setv(host, n + i + j, x)))); setv(host, 'causal', true); setv(host, 'scale', true); run(); });
};

/* =========================== A09 GPT params =========================== */
W.gptparams = host => {
  const P = { lab: [65, 128, 384, 6, 6], small: [50257, 1024, 768, 12, 12], medium: [50257, 1024, 1024, 24, 16], large: [50257, 1024, 1280, 36, 20], xl: [50257, 1024, 1600, 48, 25] };
  const out = shell(host, sel('preset', 'Preset', [['lab', 'A09 lab char-GPT'], ['small', 'GPT-2 small'], ['medium', 'GPT-2 medium'], ['large', 'GPT-2 large'], ['xl', 'GPT-2 XL'], ['custom', 'custom']], 'small') +
    num('V', 'vocab V', 50257, { min: 1 }) + num('ctx', 'context T', 1024, { min: 1 }) + num('d', 'width d', 768, { min: 8 }) + num('L', 'layers L', 12, { min: 1 }) + num('h', 'heads h', 12, { min: 1 }) + chk('tied', 'tie embedding and LM head', true));
  host.addEventListener('change', e => { if (e.target.dataset.k === 'preset' && P[e.target.value]) { ['V', 'ctx', 'd', 'L', 'h'].forEach((k, i) => setv(host, k, P[e.target.value][i])); } else if (['V', 'ctx', 'd', 'L', 'h'].includes(e.target.dataset.k)) setv(host, 'preset', 'custom'); }, true);
  live(host, v => {
    const d = v.d, blk = 12 * d * d + 13 * d, emb = v.V * d, pos = v.ctx * d, head = v.tied ? 0 : v.V * d, N = emb + pos + v.L * blk + 2 * d + head, Nne = v.L * blk;
    const fwd = 2 * Nne + 2 * v.L * v.ctx * d, D = 20 * N;
    out.innerHTML = (d % v.h ? `<p class="cnote">${pill('d must be divisible by h', 'bad')}</p>` : kv('head dimension d/h', d / v.h)) +
      kv('per block 12d² + 13d', int(blk)) + kv(`blocks × ${v.L}`, int(v.L * blk)) + kv('token + position embeddings', int(emb + pos)) + (head ? kv('untied LM head', int(head)) : '') +
      kv('total parameters N', `${int(N)} (${big(N)})`, 'hl') +
      kv('forward FLOPs / token ≈ 2N + 2·L·T·d', big(fwd)) + kv('training FLOPs / token ≈ 3 × forward', big(3 * fwd)) +
      kv('Chinchilla tokens 20N', big(D)) + kv('training compute 6·N·D', sig(6 * N * D) + ' FLOPs') +
      kv('weights fp32 / bf16 / int8 / int4', `${bytes(4 * N)} / ${bytes(2 * N)} / ${bytes(N)} / ${bytes(N / 2)}`) +
      `<p class="cnote">GPT-2 small should read exactly 124,439,808.</p>`;
  });
};

/* =========================== A10 training memory & time =========================== */
W.trainmem = host => {
  const out = shell(host, num('N', 'parameters (billions)', 7, { min: 0.01, step: 0.1 }) +
    sel('opt', 'Precision & optimizer', [['12', 'bf16 mixed + AdamW (2+2+12 = 16 B)'], ['6', 'bf16 mixed + 8-bit Adam (2+2+6 = 10 B)']], '12') +
    sel('shard', 'Sharding', [['ddp', 'DDP (full replica per GPU)'], ['z1', 'ZeRO-1 (shard optimizer)'], ['z2', 'ZeRO-2 (+ shard gradients)'], ['z3', 'ZeRO-3 / FSDP (+ shard weights)']], 'z3') +
    sel('gpu', 'GPU', gpuOpts(['L4', 'A100_40', 'A100_80', 'H100']), 'A100_80') + num('n', 'number of GPUs', 64, { min: 1, step: 1 }) +
    num('D', 'training tokens (billions, 0 = Chinchilla 20N)', 0, { min: 0 }) + rng('mfu', 'MFU %', 40, 10, 70, 1) + num('price', 'your price per GPU-hour (US$)', 4, { min: 0, step: 0.1 }));
  live(host, v => {
    const g = GPUS[v.gpu], N = v.N * 1e9, K = +v.opt, n = v.n;
    const mem = { ddp: (4 + K) * N, z1: 4 * N + K * N / n, z2: 2 * N + (2 + K) * N / n, z3: (4 + K) * N / n }[v.shard], frac = mem / (g.mem * 1e9);
    const D = v.D > 0 ? v.D * 1e9 : 20 * N, C = 6 * N * D, s = C / (n * g.half * 1e12 * v.mfu / 100), gh = s / 3600 * n;
    out.innerHTML = bar(`model state per GPU (no activations) vs ${g.mem} GB`, frac, bytes(mem), frac > 1 ? 'bad' : frac > 0.7 ? 'warn' : 'good') +
      `<p class="cnote">${pill(frac > 1 ? "doesn't fit" : frac > 0.7 ? 'tight: little room for activations' : 'fits with room for activations', frac > 1 ? 'bad' : frac > 0.7 ? 'warn' : 'good')}</p>` +
      kv('training tokens D', big(D) + (v.D > 0 ? '' : ' (20N)')) + kv('compute C = 6ND', sig(C) + ' FLOPs') + kv(`throughput at ${v.mfu}% MFU`, sig(n * g.half * v.mfu / 100) + ' TFLOP/s') +
      kv('wall-clock time', secs(s), 'hl') + kv('GPU-hours', int(gh)) + kv('estimated cost at your price', 'US$ ' + int(gh * v.price)) +
      `<p class="cnote">Peak uses the vendor's dense bf16 figure. Real runs also lose time to restarts, evaluation and data loading.</p>`;
  });
};

/* =========================== A11 LoRA =========================== */
W.lora = host => {
  const P = { l7: [4096, 4096, 11008, 32, 6.7], l3: [4096, 1024, 14336, 32, 8.0], g2: [768, 768, 3072, 12, 0.124] };
  const out = shell(host, sel('preset', 'Base model', [['l7', 'Llama-2-7B-style (MHA)'], ['l3', 'Llama-3-8B-style (GQA)'], ['g2', 'GPT-2 small-style'], ['custom', 'custom']], 'l7') +
    num('d', 'model width d', 4096) + num('dkv', 'K/V projection width', 4096) + num('ff', 'MLP width', 11008) + num('L', 'layers', 32) + num('N', 'total params (billions)', 6.7, { step: 0.1 }) +
    sel('r', 'rank r', [1, 2, 4, 8, 16, 32, 64, 128, 256], 8) +
    `<div class="cf"><span>Adapted matrices</span><div class="cks">${['q', 'k', 'v', 'o', 'gate', 'up', 'down'].map(m => chk('t_' + m, m, m === 'q' || m === 'v')).join('')}</div></div>` + chk('qlora', 'QLoRA: 4-bit frozen base', false));
  host.addEventListener('change', e => { if (e.target.dataset.k === 'preset' && P[e.target.value]) ['d', 'dkv', 'ff', 'L', 'N'].forEach((k, i) => setv(host, k, P[e.target.value][i])); }, true);
  live(host, v => {
    const r = +v.r, shapes = { q: [v.d, v.d], k: [v.d, v.dkv], v: [v.d, v.dkv], o: [v.d, v.d], gate: [v.d, v.ff], up: [v.d, v.ff], down: [v.ff, v.d] };
    let tr = 0, rows = ''; Object.entries(shapes).forEach(([m, [a, b]]) => { if (v['t_' + m]) { const p = r * (a + b) * v.L; tr += p; rows += kv(`${m}: r·(${a} + ${b}) × ${v.L}`, int(p)); } });
    const N = v.N * 1e9, full = 16 * N, lora = (v.qlora ? 0.5 : 2) * N + 16 * tr;
    out.innerHTML = rows + kv('trainable parameters', `${int(tr)} (${(tr / N * 100).toPrecision(2)}% of N)`, 'hl') +
      bar('full fine-tune: 16 B × N', 1, bytes(full), 'bad') + bar(`${v.qlora ? 'QLoRA' : 'LoRA'}: frozen base + 16 B × trainable`, lora / full, bytes(lora), lora < 22e9 ? 'good' : 'warn') +
      `<p class="cnote">Activations come on top of both. ${lora < 22e9 ? 'Fits a 24 GB GPU (g5/g6.xlarge) with a modest batch and context.' : 'Needs a larger GPU or QLoRA.'}</p>`;
  });
};

/* =========================== A12 KV cache & serving =========================== */
W.kvcache = host => {
  const P = { l2: [32, 32, 128, 6.7], l3: [32, 8, 128, 8.0], mi: [32, 8, 128, 7.2], g2: [12, 12, 64, 0.124] };
  const out = shell(host, sel('preset', 'Model shape', [['l2', 'Llama-2-7B (32 KV heads)'], ['l3', 'Llama-3-8B (GQA, 8 KV heads)'], ['mi', 'Mistral-7B (GQA, 8 KV heads)'], ['g2', 'GPT-2 small'], ['custom', 'custom']], 'l3') +
    num('L', 'layers L', 32) + num('kvh', 'KV heads', 8) + num('dh', 'head dim', 128) + num('N', 'params (billions)', 8.0, { step: 0.1 }) +
    sel('wb', 'Weight precision', [['16', 'fp16 / bf16'], ['8', 'int8'], ['4', 'int4']], '16') + sel('kb', 'KV-cache precision', [['2', 'fp16'], ['1', 'fp8 / int8']], '2') +
    num('T', 'context length (tokens)', 8192, { min: 1 }) + num('b', 'concurrent sequences', 8, { min: 1 }) + sel('gpu', 'GPU', gpuOpts(['A10G', 'L4', 'A100_40', 'A100_80', 'H100']), 'A10G'));
  host.addEventListener('change', e => { if (e.target.dataset.k === 'preset' && P[e.target.value]) ['L', 'kvh', 'dh', 'N'].forEach((k, i) => setv(host, k, P[e.target.value][i])); }, true);
  live(host, v => {
    const g = GPUS[v.gpu], Wb = v.N * 1e9 * (+v.wb) / 8, kvSeq = 2 * v.L * v.kvh * v.dh * v.T * (+v.kb), kvAll = kvSeq * v.b, cap = g.mem * 1e9, tot = Wb + kvAll;
    const maxB = Math.max(0, Math.floor((0.9 * cap - Wb) / kvSeq)), step = (Wb + kvAll) / (g.bw * 1e9);
    out.innerHTML = kv('weights', bytes(Wb)) + kv('KV cache per sequence 2·L·h_kv·d·T·bytes', bytes(kvSeq)) + kv(`KV cache × ${v.b} sequences`, bytes(kvAll)) +
      bar(`weights + KV vs ${g.mem} GB`, tot / cap, bytes(tot), tot > 0.9 * cap ? 'bad' : tot > 0.7 * cap ? 'warn' : 'good') +
      kv('max sequences at this context (90% of memory)', int(maxB), 'hl') +
      kv('decode step ≥ (weights + KV) / bandwidth', secs(step)) + kv('≈ tokens/s per sequence (upper bound)', sig(1 / step)) + kv('≈ tokens/s total (upper bound)', sig(v.b / step)) +
      `<p class="cnote">Bandwidth ${g.bw} GB/s. Real servers reach 50–80% of this bound. Prefill time is extra and compute-bound.</p>`;
  });
};

window.AIW = W;
})();
