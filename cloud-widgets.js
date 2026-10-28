/* Interactive calculators for the Cloud track. Reuses the helpers exported by ai-widgets.js (window.AIW._h). */
(function (C) {
const W = window.AIW, H = W._h;
const { num, rng, sel, chk, btn, read, setv, shell, kv, bar, pill, live, sig, int, canvas, tok, esc } = H;
const s = (en, ms) => ({ en, ms });

C.cloudCalcs = {
  m02: { type: 'iampolicy', title: s('IAM policy evaluation simulator', 'Simulator penilaian polisi IAM'),
    intro: s('Switch each policy on or off and watch AWS walk the same decision path it uses for every API call.', 'Hidupkan atau matikan setiap polisi dan lihat AWS mengikut laluan keputusan yang sama seperti untuk setiap panggilan API.') },
  m03: { type: 'subnets', title: s('VPC subnet planner', 'Perancang subnet VPC'),
    intro: s('Enter a VPC range and a subnet size. See how many subnets fit, how many addresses each has after AWS reserves five, and a ready-made layout.', 'Masukkan julat VPC dan saiz subnet. Lihat berapa banyak subnet muat, berapa alamat dalam setiap satu selepas AWS menyimpan lima, dan susun atur siap.') },
  m04: { type: 'autoscale', title: s('Auto Scaling over a day', 'Auto Scaling sepanjang hari'),
    intro: s('A day of traffic with a lunchtime spike. Press Play to watch target tracking add and remove instances hour by hour, then compare the cost with provisioning for the peak.', 'Trafik sehari dengan lonjakan waktu tengah hari. Tekan Main untuk melihat target tracking menambah dan membuang instance setiap jam, kemudian bandingkan kos dengan menyediakan kapasiti puncak.') },
  m11: { type: 'cdn', title: s('CDN cache-hit calculator', 'Kalkulator cache-hit CDN'),
    intro: s('See how the cache-hit ratio changes the load on your origin, the average latency users feel, and the data your origin must send.', 'Lihat bagaimana nisbah cache-hit mengubah beban pada origin, purata kependaman yang dirasai pengguna, dan data yang perlu dihantar origin.') },
  m15: { type: 'drpicker', title: s('Disaster-recovery strategy picker', 'Pemilih strategi pemulihan bencana'),
    intro: s('Set the business targets for downtime (RTO) and data loss (RPO). The tool picks the cheapest strategy that meets both and estimates its cost.', 'Tetapkan sasaran perniagaan untuk masa henti (RTO) dan kehilangan data (RPO). Alat ini memilih strategi paling murah yang memenuhi kedua-duanya dan menganggar kosnya.') },
  m16: { type: 'costcalc', title: s('Monthly bill estimator', 'Penganggar bil bulanan'),
    intro: s('A typical small web stack. Change the usage and see which line dominates the bill. Prices are editable approximations; check the AWS pricing pages for your Region.', 'Timbunan web kecil yang biasa. Ubah penggunaan dan lihat baris mana yang paling besar dalam bil. Harga ialah anggaran yang boleh diubah; semak halaman harga AWS untuk Region anda.') }
};

/* =========================== m02 IAM evaluation =========================== */
W.iampolicy = host => {
  const out = shell(host,
    chk('deny', 'An explicit <b>Deny</b> matches (any policy)', false) +
    chk('scp', 'Organization SCP allows the action', true) +
    sel('pb', 'Permissions boundary', [['none', 'none attached'], ['allow', 'attached and allows'], ['deny', 'attached, does not allow']], 'none') +
    chk('id', 'Identity policy (on the role) allows', true) +
    chk('res', 'Resource policy (e.g. bucket policy) allows', false) +
    chk('cross', 'Caller is in a <b>different</b> account', false) +
    `<p class="cnote">Presets: ${btn('p1', 'Admin blocked by SCP')} ${btn('p2', 'Cross-account read')} ${btn('p3', 'Missing bucket policy')}</p>`);
  const run = live(host, v => {
    const st = [];
    let verdict = null, why = '';
    st.push(['1', 'Any explicit Deny?', v.deny ? 'yes' : 'no', v.deny ? 'stop' : 'on']);
    if (v.deny) { verdict = false; why = 'An explicit Deny always wins, whatever else allows.'; }
    if (verdict === null) { st.push(['2', 'Organization SCP / RCP allows?', v.scp ? 'yes' : 'no', v.scp ? 'on' : 'stop']); if (!v.scp) { verdict = false; why = 'SCPs set the maximum permissions in the account. Not allowed there means denied, even for administrators.'; } }
    if (verdict === null) { const ok = v.pb !== 'deny'; st.push(['3', 'Permissions boundary allows?', v.pb === 'none' ? 'n/a' : ok ? 'yes' : 'no', ok ? 'on' : 'stop']); if (!ok) { verdict = false; why = 'The boundary caps what the role can ever be granted.'; } }
    if (verdict === null) {
      const grant = v.cross ? (v.id && v.res) : (v.id || v.res);
      st.push(['4', v.cross ? 'Both identity AND resource policy allow? (cross-account)' : 'Identity OR resource policy allows? (same account)', `id ${v.id ? '✓' : '✗'} · res ${v.res ? '✓' : '✗'}`, grant ? 'go' : 'stop']);
      verdict = grant; why = grant ? 'No deny, guardrails allow, and a policy grants the action.' : (v.cross ? 'Cross-account access needs the caller\'s own policy and the resource owner\'s policy to both allow.' : 'Nothing grants the action, so the default implicit deny applies.');
    }
    out.innerHTML = '<div class="flowsteps">' + st.map(([n, q, a, c]) => `<div class="${c}"><i>${n}</i><span>${q}</span><b>${esc(a)}</b></div>`).join('') + '</div>' +
      `<div class="verdict ${verdict ? 'good' : 'bad'}">${verdict ? 'ALLOW' : 'DENY'}</div><p class="cnote">${esc(why)}</p>`;
  });
  host.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return;
    const p = { p1: [false, false, 'none', true, false, false], p2: [false, true, 'none', true, true, true], p3: [false, true, 'none', true, false, true] }[a.dataset.act];
    ['deny', 'scp', 'pb', 'id', 'res', 'cross'].forEach((k, i) => setv(host, k, p[i])); run(); });
};

/* =========================== m03 subnet planner =========================== */
W.subnets = host => {
  const out = shell(host,
    `<label class="cf"><span>VPC CIDR</span><input type="text" data-k="cidr" value="10.0.0.0/16" spellcheck="false"></label>` +
    rng('sub', 'subnet prefix /', 24, 16, 28, 1) + sel('az', 'Availability Zones', [[2, '2'], [3, '3']], 2) + sel('tiers', 'tiers', [[2, '2: public, private'], [3, '3: public, app, data']], 3));
  const ipn = s => s.split('.').reduce((a, b) => a * 256 + (+b), 0), ips = n => [24, 16, 8, 0].map(sh => Math.floor(n / 2 ** sh) % 256).join('.');
  live(host, () => {
    const v = { cidr: host.querySelector('[data-k="cidr"]').value.trim(), sub: +host.querySelector('[data-k="sub"]').value, az: +host.querySelector('[data-k="az"]').value, tiers: +host.querySelector('[data-k="tiers"]').value };
    const m = v.cidr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
    if (!m || m.slice(1, 5).some(x => +x > 255) || +m[5] < 16 || +m[5] > 28) { out.innerHTML = `<p class="cnote">${pill('invalid', 'bad')} Use a block between /16 and /28, e.g. 10.0.0.0/16.</p>`; return; }
    const p = +m[5]; if (v.sub < p) { out.innerHTML = `<p class="cnote">${pill('too big', 'bad')} A subnet can't be larger than its VPC: choose a prefix ≥ /${p}.</p>`; return; }
    const size = 2 ** (32 - p), base = Math.floor(ipn(m.slice(1, 5).join('.')) / size) * size, per = 2 ** (32 - v.sub), count = 2 ** (v.sub - p), need = v.az * v.tiers;
    const names = v.tiers === 3 ? ['public', 'app', 'data'] : ['public', 'private'], rows = [];
    for (let t = 0; t < v.tiers; t++) for (let a = 0; a < v.az; a++) { const i = t * v.az + a; if (i < count) rows.push([`${names[t]} · AZ ${'abc'[a]}`, `${ips(base + i * per)}/${v.sub}`]); }
    const ok = count >= need;
    out.innerHTML = kv('VPC addresses', int(size)) + kv('subnets of /' + v.sub + ' that fit', int(count)) + kv('addresses per subnet', int(per)) +
      kv('usable per subnet (AWS reserves 5)', int(Math.max(0, per - 5)), 'hl') + kv('subnets needed (tiers × AZs)', need) +
      bar('share of the VPC used by this layout', Math.min(1, need / count), `${need} / ${count}`, ok ? (need / count > 0.5 ? 'warn' : 'good') : 'bad') +
      (base !== ipn(m.slice(1, 5).join('.')) ? `<p class="cnote">${pill('aligned', 'warn')} Network address corrected to ${ips(base)}/${p}.</p>` : '') +
      `<h5>Layout</h5><div class="subnets">${rows.map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>` +
      `<p class="cnote">${ok ? 'Leave spare ranges for future tiers and AZs.' : 'Not enough room: use a larger VPC or smaller subnets.'} Reserved: network address, VPC router (+1), DNS (+2), future use (+3) and broadcast (last).</p>`;
  });
};

/* =========================== m04 auto scaling =========================== */
W.autoscale = host => {
  const out = shell(host,
    rng('peak', 'peak traffic (requests/s)', 1200, 200, 4000, 100) + rng('cap', 'one instance handles (req/s at 100% CPU)', 150, 50, 400, 10) +
    rng('target', 'target CPU %', 50, 20, 90, 5) + rng('min', 'minimum instances', 2, 1, 6, 1) + rng('max', 'maximum instances', 20, 4, 40, 1) +
    rng('price', 'price per instance-hour (US$ ×100)', 8, 1, 50, 1) + rng('hour', 'hour of day', 12, 0, 23, 1) +
    `<p class="cnote">${btn('play', '▶ Play the day', true)}</p>`, '<canvas class="ccanvas" aria-label="Traffic and capacity over 24 hours"></canvas>');
  const cv = host.querySelector('canvas');
  const load = (h, peak) => peak * (0.18 + 0.32 * Math.max(0, Math.sin((h - 6) / 24 * 2 * Math.PI)) + 0.5 * Math.exp(-((h - 12.5) ** 2) / 2.2));
  const plan = v => { const L = [], N = []; for (let h = 0; h < 24; h++) { const l = load(h, v.peak); L.push(l); N.push(Math.min(v.max, Math.max(v.min, Math.ceil(l / (v.cap * v.target / 100))))); } return { L, N }; };
  function draw(v, P) {
    const { ctx, w, h } = canvas(cv, 200), pad = 30, maxY = Math.max(...P.L, ...P.N.map(n => n * v.cap)) * 1.1;
    const X = i => pad + (w - pad - 8) * i / 23, Y = y => h - 20 - (h - 34) * y / maxY;
    ctx.fillStyle = tok('--surface'); ctx.fillRect(0, 0, w, h); ctx.font = '11px ' + tok('--mono'); ctx.fillStyle = tok('--muted');
    [0, 6, 12, 18, 23].forEach(i => ctx.fillText(String(i).padStart(2, '0') + ':00', Math.min(X(i) - 14, w - 44), h - 5));
    ctx.fillStyle = tok('--accent-soft'); ctx.beginPath(); ctx.moveTo(X(0), Y(0)); P.N.forEach((n, i) => { ctx.lineTo(X(i), Y(n * v.cap)); if (i < 23) ctx.lineTo(X(i + 1), Y(n * v.cap)); }); ctx.lineTo(X(23), Y(0)); ctx.fill();
    ctx.strokeStyle = tok('--accent'); ctx.lineWidth = 1.5; ctx.beginPath(); P.N.forEach((n, i) => { i ? ctx.lineTo(X(i), Y(n * v.cap)) : ctx.moveTo(X(i), Y(n * v.cap)); if (i < 23) ctx.lineTo(X(i + 1), Y(n * v.cap)); }); ctx.stroke();
    ctx.strokeStyle = tok('--k-compute'); ctx.lineWidth = 2.2; ctx.beginPath(); P.L.forEach((l, i) => i ? ctx.lineTo(X(i), Y(l)) : ctx.moveTo(X(i), Y(l))); ctx.stroke();
    ctx.strokeStyle = tok('--ink'); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(v.hour), 8); ctx.lineTo(X(v.hour), h - 20); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = tok('--k-compute'); ctx.fillText('traffic', w - 120, 16); ctx.fillStyle = tok('--accent'); ctx.fillText('capacity', w - 64, 16);
  }
  let prevN = -1;
  const run = live(host, v => {
    const P = plan(v), n = P.N[v.hour], peakN = Math.max(...P.N), used = P.N.reduce((a, b) => a + b, 0), fixed = peakN * 24, price = v.price / 100, cpu = P.L[v.hour] / (n * v.cap) * 100;
    draw(v, P);
    const fleet = Array.from({ length: Math.max(peakN, n) }, (_, i) => `<i class="${i < n ? '' : 'off'}"${i < n && i >= prevN && prevN >= 0 ? '' : ' style="animation:none"'} title="instance ${i + 1}"></i>`).join('');
    prevN = n;
    out.innerHTML = kv(`${String(v.hour).padStart(2, '0')}:00 traffic`, int(P.L[v.hour]) + ' req/s') + kv('desired = ⌈load ÷ (capacity × target)⌉', `${n} instances`, 'hl') +
      kv('average CPU at this hour', sig(cpu) + ' %') + `<div class="fleet" aria-label="${n} running instances">${fleet}</div>` +
      kv('instance-hours today (auto scaling)', int(used)) + kv(`instance-hours if fixed at peak (${peakN})`, int(fixed)) +
      bar('cost with auto scaling vs fixed peak', used / fixed, `US$ ${(used * price).toFixed(2)} vs ${(fixed * price).toFixed(2)} per day`, 'good') +
      `<p class="cnote">${pill(`${Math.round((1 - used / fixed) * 100)}% saved`, 'good')}${cpu > 95 ? pill('at max: requests would queue', 'bad') : ''} Real groups also need warm-up time, so set the target below 100% to absorb spikes.</p>`;
  });
  let timer = 0;
  host.addEventListener('click', e => { if (!e.target.closest('[data-act="play"]')) return; clearInterval(timer); let h = 0; setv(host, 'hour', 0); prevN = -1; run();
    timer = setInterval(() => { h++; if (h > 23) { clearInterval(timer); return; } setv(host, 'hour', h); run(); }, 420); });
  addEventListener('resize', () => run());
};

/* =========================== m11 CDN =========================== */
W.cdn = host => {
  const out = shell(host,
    rng('rps', 'requests per second (peak)', 2000, 100, 20000, 100) + rng('hit', 'cache-hit ratio %', 85, 0, 99, 1) + rng('kb', 'average response size (KB)', 120, 5, 2000, 5) +
    rng('edge', 'latency from edge (ms)', 25, 5, 80, 1) + rng('origin', 'latency from origin (ms)', 180, 40, 600, 10));
  live(host, v => {
    const hit = v.hit / 100, orps = v.rps * (1 - hit), avgLat = hit * v.edge + (1 - hit) * (v.edge + v.origin), monthGB = v.rps * 0.35 * 2.628e6 * v.kb / 1e6, originGB = monthGB * (1 - hit);
    out.innerHTML = bar('requests reaching the origin', 1 - hit, int(orps) + ' req/s', hit > 0.8 ? 'good' : hit > 0.5 ? 'warn' : 'bad') +
      kv('origin servers needed at 500 req/s each', int(Math.ceil(orps / 500))) + kv('average latency users feel', sig(avgLat) + ' ms', 'hl') +
      kv('monthly traffic served (35% average of peak)', sig(monthGB / 1000) + ' TB') + kv('of which the origin sends', sig(originGB / 1000) + ' TB') +
      `<p class="cnote">Going from 80% to 95% hits cuts origin load by 4×, not 15%. Raise hits by removing tracking parameters and cookies from the cache key and using versioned file names.</p>`;
  });
};

/* =========================== m15 DR picker =========================== */
W.drpicker = host => {
  const fmtT = m => m < 1 ? Math.round(m * 60) + ' s' : m < 120 ? Math.round(m) + ' min' : sig(m / 60) + ' h';
  const out = shell(host,
    `<label class="cf"><span>RTO: max downtime <b data-x="rto"></b></span><input type="range" data-k="rto" min="0" max="100" value="55"></label>` +
    `<label class="cf"><span>RPO: max data loss <b data-x="rpo"></b></span><input type="range" data-k="rpo" min="0" max="100" value="50"></label>` +
    num('cost', 'primary environment cost (US$/month)', 5000, { min: 0, step: 100 }));
  const scale = x => 0.25 * Math.pow(10, x / 100 * Math.log10(48 * 60 / 0.25));        // 15 s .. 48 h, log scale
  const S = [
    ['Multi-site active/active', 1, 1, 1.0, 'Full stack serving traffic in both Regions; data replicated continuously.'],
    ['Warm standby', 15, 1, 0.35, 'A scaled-down full copy runs all the time; scale it up during failover.'],
    ['Pilot light', 120, 15, 0.12, 'Data is replicated; compute is defined in code but switched off until needed.'],
    ['Backup & restore', 48 * 60, 24 * 60, 0.05, 'Only backups exist in the DR Region; everything is rebuilt from them.']
  ];
  live(host, v => {
    const rto = scale(v.rto), rpo = scale(v.rpo);
    host.querySelector('[data-x="rto"]').textContent = fmtT(rto); host.querySelector('[data-x="rpo"]').textContent = fmtT(rpo);
    let pick = 0; for (let i = S.length - 1; i >= 0; i--) { if (S[i][1] <= rto && S[i][2] <= rpo) { pick = i; break; } }
    out.innerHTML = '<div class="flowsteps">' + S.map((x, i) => `<div class="${i === pick ? 'go' : ''}"><i>${'$'.repeat(4 - i)}</i><span><b style="font-family:inherit">${x[0]}</b><br><span class="cnote">RTO ≈ ${fmtT(x[1])} · RPO ≈ ${fmtT(x[2])}</span></span><b>${Math.round(x[3] * 100)}%</b></div>`).join('') + '</div>' +
      `<div class="verdict good">${S[pick][0]}</div><p class="cnote">${esc(S[pick][4])}</p>` +
      kv('estimated extra cost for DR', `US$ ${int(v.cost * S[pick][3])} / month`, 'hl') + kv('as a share of the primary environment', Math.round(S[pick][3] * 100) + ' %') +
      `<p class="cnote">Percentages are rules of thumb. Whatever you pick, rehearse the failover: an untested plan is not a plan.</p>`;
  });
};

/* =========================== m16 cost estimator =========================== */
W.costcalc = host => {
  const out = shell(host,
    num('ec2', 'EC2 instances running 24/7', 4, { min: 0, step: 1 }) + num('ec2p', 'price per instance-hour (US$)', 0.0416, { min: 0, step: 0.001 }) +
    num('nat', 'NAT gateways', 2, { min: 0, step: 1 }) + num('natgb', 'GB through NAT per month', 2000, { min: 0, step: 100 }) +
    num('alb', 'load balancers', 1, { min: 0, step: 1 }) + num('out', 'data out to internet (GB/month)', 1500, { min: 0, step: 100 }) + num('s3', 'S3 storage (GB)', 500, { min: 0, step: 50 }) +
    chk('gw', 'add S3 gateway endpoint', false) + rng('s3share', 'share of NAT traffic going to S3 %', 60, 0, 100, 5) +
    `<p class="cnote">Defaults approximate us-east-1: NAT US$0.045/h + 0.045/GB, ALB 0.0225/h (+ LCUs), data out 0.09/GB, S3 0.023/GB-month, 730 h/month.</p>`);
  live(host, v => {
    const h = 730, natGB = v.natgb * (v.gw ? 1 - v.s3share / 100 : 1);
    const L = [['EC2 compute', v.ec2 * v.ec2p * h, 'c1'], ['NAT gateway hours', v.nat * 0.045 * h, 'c2'], ['NAT data processing', natGB * 0.045, 'c2'],
      ['Load balancer hours', v.alb * 0.0225 * h, 'c3'], ['Data transfer out', v.out * 0.09, 'c3'], ['S3 storage', v.s3 * 0.023, 'c4']];
    const total = L.reduce((a, x) => a + x[1], 0), top = L.slice().sort((a, b) => b[1] - a[1])[0], saved = v.gw ? v.natgb * v.s3share / 100 * 0.045 : 0;
    out.innerHTML = L.map(([n, c, k]) => bar(n, total ? c / total : 0, 'US$ ' + c.toFixed(0), k)).join('') + kv('estimated monthly total', 'US$ ' + int(total), 'hl') +
      `<p class="cnote">${pill('largest: ' + top[0], 'warn')}${v.gw ? pill(`gateway endpoint saves ~US$ ${int(saved)}/month`, 'good') : ''} Tick the gateway endpoint to see the classic NAT fix from module 03.</p>`;
  });
};
})(window.COURSE);
