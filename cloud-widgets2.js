/* Interactive calculators for the remaining Cloud modules (0.1–0.5, 01, 05–10, 12–14, 17–19). Reuses window.AIW._h helpers. */
(function (C) {
const W = window.AIW, H = W._h;
const { num, rng, sel, chk, btn, read, setv, shell, kv, bar, pill, live, sig, big, int, bytes, secs, canvas, tok, esc } = H;
const s = (en, ms) => ({ en, ms });
const usd = x => 'US$ ' + (x >= 100 ? int(x) : x.toFixed(2));

Object.assign(C.cloudCalcs, {
  z1: { type: 'ownvscloud', title: s('Own servers vs cloud', 'Server sendiri vs cloud'),
    intro: s('Compare buying servers for your busiest day with renting only what you use. Move the utilisation slider to find the break-even point.', 'Bandingkan membeli server untuk hari paling sibuk dengan menyewa hanya apa yang digunakan. Gerakkan peluncur penggunaan untuk mencari titik pulang modal.') },
  z2: { type: 'ttfb', title: s('Page-load waterfall', 'Air terjun muat halaman'),
    intro: s('See every round trip before the first byte arrives: DNS, TCP, TLS and the request. Distance and protocol choices change the total.', 'Lihat setiap perjalanan pergi-balik sebelum bait pertama tiba: DNS, TCP, TLS dan permintaan. Jarak dan pilihan protokol mengubah jumlahnya.') },
  z3: { type: 'budgetsim', title: s('Budget alert simulator', 'Simulator amaran bajet'),
    intro: s('Forget a resource running and watch the month unfold: when does the alert fire, and what is the bill at month end?', 'Terlupa satu sumber yang berjalan dan lihat bulan berlalu: bila amaran dihantar, dan berapa bil pada hujung bulan?') },
  z4: { type: 's3site', title: s('Static website cost', 'Kos laman web statik'),
    intro: s('Estimate what your S3-hosted site costs as visitors grow.', 'Anggarkan kos laman yang dihos di S3 apabila pelawat bertambah.') },
  z5: { type: 'clibuilder', title: s('AWS CLI command builder', 'Pembina arahan AWS CLI'),
    intro: s('Build a command from parts and see what each part means before you run it.', 'Bina arahan daripada bahagian-bahagian dan lihat maksud setiap bahagian sebelum menjalankannya.') },
  m01: { type: 'regionlatency', title: s('Region latency & multi-AZ availability', 'Kependaman Region & ketersediaan multi-AZ'),
    intro: s('Pick where your users are and which Region you deploy to. Then see how running in more AZs changes expected downtime.', 'Pilih lokasi pengguna dan Region tempat anda menghantar aplikasi. Kemudian lihat bagaimana lebih banyak AZ mengubah jangkaan masa henti.') },
  m05: { type: 's3classes', title: s('S3 storage-class cost comparison', 'Perbandingan kos kelas storan S3'),
    intro: s('Same data, seven storage classes. Change how much you store and how often you read it back.', 'Data sama, tujuh kelas storan. Ubah jumlah yang disimpan dan kekerapan membacanya semula.') },
  m06: { type: 'ddbcap', title: s('DynamoDB capacity & cost', 'Kapasiti & kos DynamoDB'),
    intro: s('Turn item size and traffic into read/write capacity units, partitions and a monthly bill for both billing modes.', 'Tukar saiz item dan trafik kepada unit kapasiti baca/tulis, partition dan bil bulanan bagi kedua-dua mod bil.') },
  m07: { type: 'planSim', title: s('Infrastructure plan simulator', 'Simulator pelan infrastruktur'),
    intro: s('Edit the desired configuration and read the plan like a reviewer: update in place, or destroy and recreate?', 'Ubah konfigurasi yang dikehendaki dan baca pelan seperti penyemak: kemas kini di tempat, atau musnah dan cipta semula?') },
  m08: { type: 'lambdacost', title: s('Lambda cost & concurrency', 'Kos & keserentakan Lambda'),
    intro: s('Requests, duration and memory decide both the bill and how many copies run at once (Little\'s law).', 'Permintaan, tempoh dan memori menentukan bil dan berapa banyak salinan berjalan serentak (hukum Little).') },
  m09: { type: 'queuesim', title: s('Queue backlog simulator', 'Simulator tunggakan barisan gilir'),
    intro: s('A traffic spike hits a queue. Choose how many consumers you run and watch the backlog and message age over an hour.', 'Lonjakan trafik melanda barisan gilir. Pilih bilangan pengguna (consumer) dan lihat tunggakan serta umur mesej sepanjang sejam.') },
  m10: { type: 'fargate', title: s('Container sizing: Fargate vs EC2', 'Saiz container: Fargate vs EC2'),
    intro: s('Size a task, then compare paying per task on Fargate with packing tasks onto EC2 instances.', 'Tetapkan saiz task, kemudian bandingkan bayaran setiap task di Fargate dengan memadatkan task ke instance EC2.') },
  m12: { type: 'canary', title: s('Canary vs all-at-once', 'Canary vs serentak'),
    intro: s('A release has a bug. How many users see errors before the alarm rolls it back, with and without a canary?', 'Satu keluaran ada pepijat. Berapa ramai pengguna melihat ralat sebelum alarm membatalkannya, dengan dan tanpa canary?') },
  m13: { type: 'slo', title: s('SLO error budget & burn rate', 'Bajet ralat SLO & kadar bakar'),
    intro: s('Turn an availability target into allowed failures and minutes of downtime, then see how fast an incident burns the budget.', 'Tukar sasaran ketersediaan kepada kegagalan dan minit masa henti yang dibenarkan, kemudian lihat betapa cepat insiden membakar bajet.') },
  m14: { type: 'envelope', title: s('Envelope encryption, for real', 'Penyulitan sampul, secara sebenar'),
    intro: s('This runs real AES-256-GCM in your browser. Encrypt with a data key, wrap the data key with a "KMS" key, then decrypt, just as S3 and EBS do.', 'Ini menjalankan AES-256-GCM sebenar dalam pelayar anda. Sulitkan dengan kunci data, balut kunci data dengan kunci "KMS", kemudian nyahsulit, sama seperti S3 dan EBS.') },
  m17: { type: 'tgw', title: s('VPC peering vs Transit Gateway', 'VPC peering vs Transit Gateway'),
    intro: s('Watch connections explode as VPCs grow, and compare the monthly cost of a full mesh with a hub.', 'Lihat sambungan meletup apabila VPC bertambah, dan bandingkan kos bulanan mesh penuh dengan hab.') },
  m18: { type: 'athena', title: s('Athena scan cost: CSV vs Parquet', 'Kos imbasan Athena: CSV vs Parquet'),
    intro: s('Athena bills per byte scanned. See what columnar storage and partitioning do to every query.', 'Athena mengecaj setiap bait yang diimbas. Lihat kesan storan berlajur dan partition pada setiap pertanyaan.') },
  m19: { type: 'waradar', title: s('Well-Architected self-assessment', 'Penilaian kendiri Well-Architected'),
    intro: s('Tick the practices your workload already follows. The radar shows your weakest pillar and the top risks to fix first.', 'Tandakan amalan yang sudah diikuti beban kerja anda. Radar menunjukkan tonggak paling lemah dan risiko utama untuk dibaiki dahulu.') }
});

/* ---------- small drawing helper: bars over time ---------- */
function lineChart(cv, series, opt) {
  const { ctx, w, h } = canvas(cv, opt.h || 200), padL = 44, padB = 22, n = series[0].pts.length;
  const maxY = Math.max(opt.minMax || 0, ...series.flatMap(s => s.pts), ...(opt.hlines || []).map(x => x.y)) * 1.08 || 1;
  const X = i => padL + (w - padL - 10) * i / Math.max(1, n - 1), Y = y => h - padB - (h - padB - 10) * y / maxY;
  ctx.fillStyle = tok('--surface'); ctx.fillRect(0, 0, w, h); ctx.font = '11px ' + tok('--mono'); ctx.fillStyle = tok('--muted'); ctx.strokeStyle = tok('--line'); ctx.lineWidth = 1;
  for (let k = 0; k <= 4; k++) { const y = maxY * k / 4; ctx.beginPath(); ctx.moveTo(padL, Y(y)); ctx.lineTo(w - 10, Y(y)); ctx.stroke(); ctx.fillText(opt.fy ? opt.fy(y) : sig(y, 2), 2, Y(y) + 4); }
  (opt.xt || []).forEach(([i, t]) => ctx.fillText(t, Math.min(X(i) - 10, w - 50), h - 6));
  (opt.hlines || []).forEach(l => { ctx.strokeStyle = tok(l.c); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(padL, Y(l.y)); ctx.lineTo(w - 10, Y(l.y)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = tok(l.c); ctx.fillText(l.t, padL + 4, Y(l.y) - 4); });
  if (opt.vline != null) { ctx.strokeStyle = tok('--ink'); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(opt.vline), 8); ctx.lineTo(X(opt.vline), h - padB); ctx.stroke(); ctx.setLineDash([]); }
  series.forEach((sr, si) => { ctx.strokeStyle = tok(sr.c); ctx.lineWidth = 2.2; ctx.beginPath(); sr.pts.forEach((y, i) => i ? ctx.lineTo(X(i), Y(y)) : ctx.moveTo(X(i), Y(y))); ctx.stroke();
    ctx.fillStyle = tok(sr.c); ctx.fillText(sr.label, w - 10 - 90 * (series.length - si), 14); });
}

/* =========================== 0.1 own vs cloud =========================== */
W.ownvscloud = host => {
  const out = shell(host, num('peak', 'servers needed on the busiest day', 20, { min: 1, step: 1 }) + rng('util', 'average utilisation %', 25, 5, 100, 5) +
    num('buy', 'price to buy one server (US$)', 8000, { min: 0, step: 500 }) + num('ops', 'yearly power, space & staff per server (US$)', 2500, { min: 0, step: 100 }) +
    num('hr', 'cloud price per server-hour (US$)', 0.40, { min: 0, step: 0.01 }));
  live(host, v => {
    const own = v.peak * (v.buy / 3 + v.ops), cloudFlat = v.peak * 8760 * v.hr, cloudElastic = v.peak * (v.util / 100) * 8760 * v.hr * 1.15;
    const be = Math.min(100, own / (v.peak * 8760 * v.hr * 1.15) * 100), m = Math.max(own, cloudFlat, cloudElastic);
    out.innerHTML = bar('own servers (3-year life + running costs) / year', own / m, usd(own), 'c1') + bar('cloud, always on at peak size / year', cloudFlat / m, usd(cloudFlat), 'c2') +
      bar('cloud, scaled to actual use (+15% headroom) / year', cloudElastic / m, usd(cloudElastic), 'good') +
      kv('break-even utilisation for elastic cloud', sig(be) + ' %', 'hl') +
      `<p class="cnote">${cloudElastic < own ? pill('cloud cheaper', 'good') : pill('owning cheaper', 'warn')} Below about ${sig(be)}% average utilisation, renting only what you use wins. Real comparisons also count the speed of starting, global reach and not having to plan hardware months ahead.</p>`;
  });
};

/* =========================== 0.2 page-load waterfall =========================== */
W.ttfb = host => {
  const out = shell(host, sel('dist', 'Server distance', [[350, 'Kuala Lumpur → Singapore (~350 km)'], [3000, 'Kuala Lumpur → Hong Kong (~2,500 km)'], [6600, 'Kuala Lumpur → Sydney (~6,600 km)'], [10800, 'Kuala Lumpur → Ireland (~10,800 km)'], [15000, 'Kuala Lumpur → N. Virginia (~15,000 km)']], 350) +
    sel('tls', 'TLS version', [['13', 'TLS 1.3 (1 round trip)'], ['12', 'TLS 1.2 (2 round trips)']], '13') + chk('dnsc', 'DNS answer already cached', false) + chk('reuse', 'reuse an open connection (keep-alive)', false) +
    rng('srv', 'server processing time (ms)', 40, 0, 500, 10));
  live(host, v => {
    const rtt = 2 * (+v.dist) * 1.4 / 200 + 4;                                      // fibre ~200 km/ms, 1.4x route inflation, +4 ms local
    const parts = [['DNS lookup', v.dnsc ? 0 : 25, 'c3'], ['TCP handshake', v.reuse ? 0 : rtt, 'c2'], ['TLS handshake', v.reuse ? 0 : rtt * (v.tls === '13' ? 1 : 2), 'c1'], ['Request → first byte', rtt + v.srv, 'c4']];
    const total = parts.reduce((a, p) => a + p[1], 0);
    out.innerHTML = kv('one round trip (RTT)', sig(rtt) + ' ms') + parts.map(p => bar(p[0], p[1] / total, sig(p[1]) + ' ms', p[2])).join('') + kv('time to first byte', sig(total) + ' ms', 'hl') +
      `<p class="cnote">Light in fibre covers about 200 km per millisecond. Distance multiplies every round trip, which is why CDNs (module 11) terminate TLS close to the user.</p>`;
  });
};

/* =========================== 0.3 budget simulator =========================== */
W.budgetsim = host => {
  const out = shell(host, num('budget', 'monthly budget (US$)', 20, { min: 1, step: 1 }) + rng('th', 'alert threshold %', 80, 10, 100, 5) + num('base', 'normal spend per day (US$)', 0.25, { min: 0, step: 0.05 }) +
    chk('nat', 'forgot a NAT gateway (~US$1.08/day)', true) + chk('ec2', 'forgot an m5.large instance (~US$2.30/day)', false) + chk('rds', 'forgot an RDS db.t3.medium (~US$1.63/day)', false) + rng('start', 'forgotten on day', 5, 1, 28, 1),
    '<canvas class="ccanvas" aria-label="Cumulative spend over the month"></canvas>');
  const cv = host.querySelector('canvas');
  live(host, v => {
    const extra = (v.nat ? 1.08 : 0) + (v.ec2 ? 2.30 : 0) + (v.rds ? 1.63 : 0), pts = []; let c = 0, fire = null;
    for (let d = 1; d <= 30; d++) { c += v.base + (d >= v.start ? extra : 0); pts.push(c); if (fire === null && c >= v.budget * v.th / 100) fire = d; }
    lineChart(cv, [{ pts, c: '--accent', label: 'spend' }], { hlines: [{ y: v.budget, c: '--bad', t: 'budget' }, { y: v.budget * v.th / 100, c: '--pulse', t: v.th + '% alert' }], xt: [[0, 'day 1'], [14, 'day 15'], [29, 'day 30']], fy: y => '$' + sig(y, 2) });
    out.innerHTML = kv('extra cost per day from forgotten resources', usd(extra)) + kv('alert email arrives', fire ? `day ${fire}` : 'never this month', fire ? 'hl' : '') +
      kv('month-end bill', usd(c), 'hl') + bar('bill vs budget', Math.min(1, c / v.budget), Math.round(c / v.budget * 100) + '%', c > v.budget ? 'bad' : 'good') +
      `<p class="cnote">The alert only tells you. Spending continues until you delete the resource, which is why every lab ends with a clean-up step.</p>`;
  });
};

/* =========================== 0.4 S3 site cost =========================== */
W.s3site = host => {
  const out = shell(host, num('visits', 'visitors per month', 5000, { min: 0, step: 500 }) + rng('pages', 'pages per visit', 3, 1, 20, 1) + num('kb', 'page weight (KB, incl. images)', 800, { min: 1, step: 50 }) +
    rng('files', 'files per page (HTML, CSS, images)', 12, 1, 80, 1) + chk('free', 'apply always-free 100 GB/month data out', true));
  live(host, v => {
    const views = v.visits * v.pages, gets = views * v.files, gb = views * v.kb / 1e6, outGB = Math.max(0, gb - (v.free ? 100 : 0));
    const cReq = gets / 1000 * 0.0004, cOut = outGB * 0.09, cSto = 0.05 * 0.023, total = cReq + cOut + cSto;
    out.innerHTML = kv('page views', int(views)) + kv('GET requests', int(gets)) + kv('data sent', sig(gb) + ' GB') +
      bar('requests (US$0.0004 per 1,000 GETs)', total ? cReq / total : 0, usd(cReq), 'c2') + bar('data out (US$0.09/GB after free 100 GB)', total ? cOut / total : 0, usd(cOut), 'c1') + bar('storage (~50 MB)', total ? cSto / total : 0, usd(cSto), 'c4') +
      kv('estimated monthly total', usd(total), 'hl') + `<p class="cnote">Images dominate page weight. Compressing them and serving through CloudFront (module 11) usually cuts this further.</p>`;
  });
};

/* =========================== 0.5 CLI builder =========================== */
W.clibuilder = host => {
  const CMDS = {
    'sts get-caller-identity': { args: [], what: 'Asks AWS who you are: account number, user or role ARN.' },
    's3 ls': { args: [['path', 's3://my-bucket/', 'optional bucket or prefix to list']], what: 'Lists buckets, or the objects under a path.' },
    's3 mb': { args: [['path', 's3://my-new-bucket', 'bucket to create (globally unique name)']], what: 'Makes a bucket.' },
    's3 cp': { args: [['src', 'notes.txt', 'source file or s3:// path'], ['dst', 's3://my-bucket/notes.txt', 'destination']], what: 'Copies a file to or from S3.' },
    'ec2 describe-instances': { args: [], what: 'Describes your EC2 instances in the current Region (as JSON).' },
    'ec2 describe-regions': { args: [], what: 'Lists the Regions enabled for your account.' }
  };
  const out = shell(host, sel('cmd', 'service + action', Object.keys(CMDS).map(k => [k, 'aws ' + k]), 's3 cp') +
    `<label class="cf"><span>argument 1</span><input type="text" data-k="a1" value="notes.txt" spellcheck="false"></label><label class="cf"><span>argument 2</span><input type="text" data-k="a2" value="s3://my-bucket/notes.txt" spellcheck="false"></label>` +
    sel('out', '--output', [['', '(default: json)'], ['table', 'table'], ['text', 'text']], '') + chk('q', 'add --query to pick fields', false) + sel('region', '--region', [['', '(use default)'], ['ap-southeast-1', 'ap-southeast-1'], ['ap-southeast-5', 'ap-southeast-5'], ['us-east-1', 'us-east-1']], ''));
  let last = '';
  live(host, () => {
    const g = k => host.querySelector(`[data-k="${k}"]`), cmd = g('cmd').value, def = CMDS[cmd];
    if (cmd !== last) { last = cmd; g('a1').value = def.args[0] ? def.args[0][1] : ''; g('a2').value = def.args[1] ? def.args[1][1] : ''; }
    g('a1').disabled = !def.args[0]; g('a2').disabled = !def.args[1];
    const q = cmd === 'ec2 describe-instances' ? "'Reservations[].Instances[].[InstanceId,State.Name]'" : cmd === 'ec2 describe-regions' ? "'Regions[].RegionName'" : cmd === 'sts get-caller-identity' ? 'Account' : '';
    const parts = [['aws', 'the AWS CLI program'], [cmd.split(' ')[0], 'the service'], [cmd.split(' ')[1], 'the action: ' + def.what]];
    def.args.forEach((a, i) => { const val = g(i ? 'a2' : 'a1').value.trim(); if (val) parts.push([val, a[2]]); });
    if (g('q').checked && q) parts.push(['--query ' + q, 'keep only these fields (JMESPath)']);
    if (g('out').value) parts.push(['--output ' + g('out').value, 'format the answer as ' + g('out').value]);
    if (g('region').value) parts.push(['--region ' + g('region').value, 'run against this Region instead of the default']);
    const line = parts.map(p => p[0]).join(' ');
    out.innerHTML = `<div class="code"><span class="lang">bash</span><pre><code style="background:none;padding:0;font-size:inherit">${esc(line)}</code></pre></div>` +
      '<table class="ctbl"><tbody>' + parts.map(p => `<tr><td><b>${esc(p[0])}</b></td><td style="font-family:var(--body)">${esc(p[1])}</td></tr>`).join('') + '</tbody></table>' +
      `<p class="cnote">${g('q').checked && !q ? 'This action has no useful --query preset. ' : ''}Copy it into CloudShell. Every command follows the same pattern: program, service, action, then options.</p>`;
  });
};

/* =========================== 01 region latency + availability =========================== */
W.regionlatency = host => {
  const CITIES = { kl: ['Kuala Lumpur', 3.14, 101.69], jkt: ['Jakarta', -6.2, 106.85], syd: ['Sydney', -33.87, 151.21], tok: ['Tokyo', 35.68, 139.69], lon: ['London', 51.51, -0.13], nyc: ['New York', 40.71, -74.0] };
  const REG = { 'ap-southeast-1': ['Singapore', 1.35, 103.82], 'ap-southeast-5': ['Malaysia', 3.0, 101.6], 'ap-southeast-3': ['Jakarta', -6.2, 106.85], 'ap-northeast-1': ['Tokyo', 35.68, 139.69], 'ap-south-1': ['Mumbai', 19.08, 72.88], 'ap-southeast-2': ['Sydney', -33.87, 151.21], 'eu-west-1': ['Ireland', 53.35, -6.26], 'us-east-1': ['N. Virginia', 38.9, -77.4] };
  const out = shell(host, sel('city', 'Your users are in', Object.entries(CITIES).map(([k, c]) => [k, c[0]]), 'kl') +
    `<h5>Availability</h5>` + rng('az', 'availability of one AZ %', 99.5, 95, 99.99, 0.05) + rng('n', 'AZs you run in', 2, 1, 3, 1));
  const dist = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dl = r(b[1] - a[1]), dg = r(b[2] - a[2]); const h = Math.sin(dl / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(dg / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  live(host, v => {
    const c = CITIES[v.city], rows = Object.entries(REG).map(([k, r]) => { const d = dist(c, r); return [k, r[0], d, 2 * d * 1.4 / 200 + 4]; }).sort((a, b) => a[3] - b[3]), max = rows[rows.length - 1][3];
    const a = v.az / 100, comb = 1 - Math.pow(1 - a, v.n), down = (1 - comb) * 525600;
    out.innerHTML = rows.map((r, i) => bar(`${r[0]} (${r[1]}) · ${int(r[2])} km`, r[3] / max, '~' + sig(r[3]) + ' ms RTT', i === 0 ? 'good' : r[3] > 150 ? 'bad' : r[3] > 60 ? 'warn' : '')).join('') +
      `<h5>Running in ${v.n} AZ${v.n > 1 ? 's' : ''}</h5>` + kv('combined availability 1 − (1 − a)ⁿ', (comb * 100).toPrecision(6) + ' %', 'hl') + kv('expected downtime per year', down >= 60 ? sig(down / 60) + ' hours' : sig(down) + ' minutes') +
      `<p class="cnote">Latency is a straight-line estimate (fibre ~200 km/ms, 1.4× route inflation); real routes vary. The availability maths assumes AZ failures are independent, which is the reason AZs are physically separate.</p>`;
  });
};

/* =========================== 05 S3 classes =========================== */
W.s3classes = host => {
  const CL = [['Standard', 0.023, 0, 0], ['Intelligent-Tiering*', 0.0125, 0, 0], ['Standard-IA', 0.0125, 0.01, 30], ['One Zone-IA', 0.01, 0.01, 30], ['Glacier Instant Retrieval', 0.004, 0.03, 90], ['Glacier Flexible Retrieval', 0.0036, 0.01, 90], ['Glacier Deep Archive', 0.00099, 0.02, 180]];
  const out = shell(host, num('tb', 'data stored (TB)', 10, { min: 0.01, step: 1 }) + rng('read', 'share read back each month %', 5, 0, 100, 1) + rng('months', 'months kept', 12, 1, 84, 1) +
    `<p class="cnote">Per-GB prices approximate us-east-1. *Intelligent-Tiering shown at its infrequent tier for cold data, plus a small per-object monitoring fee not included.</p>`);
  live(host, v => {
    const gb = v.tb * 1000, rd = gb * v.read / 100, costs = CL.map(([n, st, rt, min]) => [n, (st * gb * Math.max(v.months, min / 30) + rt * rd * v.months), min]);
    const max = Math.max(...costs.map(c => c[1])), best = costs.reduce((a, b) => b[1] < a[1] ? b : a);
    out.innerHTML = costs.map(c => bar(`${c[0]}${c[2] ? ` (min ${c[2]} days)` : ''}`, c[1] / max, usd(c[1]), c === best ? 'good' : '')).join('') +
      kv(`cheapest over ${v.months} months`, best[0], 'hl') + `<p class="cnote">Cold classes are cheap to store but charge to read. Push "read back" up and watch Standard-IA and Glacier lose their advantage. Restore time matters too: Flexible takes minutes to hours, Deep Archive up to 12 hours.</p>`;
  });
};

/* =========================== 06 DynamoDB capacity =========================== */
W.ddbcap = host => {
  const out = shell(host, num('kb', 'item size (KB)', 3, { min: 0.1, step: 0.5 }) + num('r', 'reads per second', 500, { min: 0, step: 50 }) + sel('cons', 'read consistency', [['e', 'eventually consistent'], ['s', 'strongly consistent']], 'e') +
    num('w', 'writes per second', 100, { min: 0, step: 10 }) + rng('busy', 'share of the day at this rate %', 40, 5, 100, 5) +
    `<p class="cnote">On-demand ≈ US$0.125 per million reads and 0.625 per million writes; provisioned ≈ 0.00013 per RCU-hour and 0.00065 per WCU-hour (us-east-1, editable in code).</p>`);
  live(host, v => {
    const rcuPer = Math.ceil(v.kb / 4) * (v.cons === 's' ? 1 : 0.5), wcuPer = Math.ceil(v.kb), RCU = Math.ceil(v.r * rcuPer), WCU = Math.ceil(v.w * wcuPer);
    const parts = Math.max(1, Math.ceil(RCU / 3000 + WCU / 1000)), sec = 2.628e6 * v.busy / 100;
    const od = v.r * sec * rcuPer / 1e6 * 0.125 + v.w * sec * wcuPer / 1e6 * 0.625, prov = (RCU * 0.00013 + WCU * 0.00065) * 730;
    out.innerHTML = kv('read units per read (4 KB blocks)', rcuPer) + kv('write units per write (1 KB blocks)', wcuPer) + kv('peak read capacity (RCU)', int(RCU), 'hl') + kv('peak write capacity (WCU)', int(WCU), 'hl') +
      kv('minimum partitions (3,000 RCU / 1,000 WCU each)', parts) + bar('on-demand / month', od / Math.max(od, prov), usd(od), od <= prov ? 'good' : 'c2') + bar('provisioned at peak, 24/7 / month', prov / Math.max(od, prov), usd(prov), prov < od ? 'good' : 'c2') +
      `<p class="cnote">${od <= prov ? pill('on-demand wins', 'good') + 'Spiky or idle-heavy traffic favours on-demand.' : pill('provisioned wins', 'good') + 'Steady traffic favours provisioned (add auto scaling).'} A hot partition key caps you at one partition's limit no matter the table size.</p>`;
  });
};

/* =========================== 07 plan simulator =========================== */
W.planSim = host => {
  const cur = { bucket: 'acme-logs-prod', ver: true, itype: 't3.medium', tag: 'v1', eng: '16.3', dbname: 'orders' };
  const out = shell(host, `<h5>Desired configuration</h5>` +
    `<label class="cf"><span>aws_s3_bucket.logs · bucket name</span><input type="text" data-k="bucket" value="${cur.bucket}" spellcheck="false"></label>` + chk('ver', 'aws_s3_bucket.logs · versioning enabled', true) +
    sel('itype', 'aws_instance.web · instance_type', ['t3.medium', 't3.large', 'm7g.large'], 't3.medium') + `<label class="cf"><span>aws_instance.web · tag version</span><input type="text" data-k="tag" value="v1"></label>` +
    sel('eng', 'aws_db_instance.main · engine_version', ['16.3', '16.4', '17.2'], '16.3') + `<label class="cf"><span>aws_db_instance.main · db_name</span><input type="text" data-k="dbname" value="orders" spellcheck="false"></label>` +
    `<p class="cnote">${btn('reset', 'Reset to deployed state')}</p>`);
  live(host, () => {
    const g = k => { const el = host.querySelector(`[data-k="${k}"]`); return el.type === 'checkbox' ? el.checked : el.value.trim(); };
    const plan = [];
    const b = [], i = [], d = [];
    if (g('bucket') !== cur.bucket) b.push(['bucket', true]); if (g('ver') !== cur.ver) b.push(['versioning', false]);
    if (g('itype') !== cur.itype) i.push(['instance_type', false]); if (g('tag') !== cur.tag) i.push(['tags.version', false]);
    if (g('eng') !== cur.eng) d.push(['engine_version', false]); if (g('dbname') !== cur.dbname) d.push(['db_name', true]);
    [['aws_s3_bucket.logs', b, true], ['aws_instance.web', i, false], ['aws_db_instance.main', d, true]].forEach(([res, ch, stateful]) => {
      if (!ch.length) return; const rep = ch.some(c => c[1]);
      plan.push(`<div class="${rep ? 'stop' : 'on'}"><i>${rep ? '-/+' : '~'}</i><span><b style="font-family:var(--mono)">${res}</b> ${rep ? 'must be <b style="font-family:inherit">replaced</b>' : 'updated in place'}<br><span class="cnote">${ch.map(c => c[0] + (c[1] ? ' (forces replacement)' : '')).join(', ')}</span></span><b>${rep && stateful ? 'DATA LOSS' : rep ? 'downtime' : 'safe'}</b></div>`);
    });
    const adds = plan.filter(p => p.includes('-/+')).length, upd = plan.length - adds, danger = plan.some(p => p.includes('DATA LOSS'));
    out.innerHTML = (plan.length ? '<div class="flowsteps">' + plan.join('') + '</div>' : `<p class="cnote">${pill('no changes', 'good')} Infrastructure matches the configuration.</p>`) +
      kv('Plan', `${adds} to replace, ${upd} to change`, 'hl') +
      (danger ? `<div class="verdict bad">Stop and review</div><p class="cnote">Replacing a bucket or database destroys the old one first. Protect stateful resources with prevent_destroy / DeletionPolicy: Retain, and change names through a migration instead.</p>` : plan.length ? `<p class="cnote">${pill('safe to apply', 'good')} In-place updates keep the resource. Some (like instance type) still need a restart.</p>` : '');
  });
  host.addEventListener('click', e => { if (!e.target.closest('[data-act="reset"]')) return; Object.entries(cur).forEach(([k, v]) => setv(host, k, v)); host.dispatchEvent(new Event('input')); });
};

/* =========================== 08 Lambda =========================== */
W.lambdacost = host => {
  const out = shell(host, num('req', 'requests per month (millions)', 30, { min: 0, step: 1 }) + rng('ms', 'average duration (ms)', 120, 1, 3000, 1) +
    sel('mem', 'memory (MB)', [128, 256, 512, 1024, 1769, 2048, 4096, 10240], 512) + sel('arch', 'architecture', [['x86', 'x86_64'], ['arm', 'arm64 (Graviton)']], 'arm') +
    rng('peak', 'peak-to-average traffic ratio', 5, 1, 30, 1) + chk('ft', 'apply monthly free tier (1M requests, 400k GB-s)', false));
  live(host, v => {
    const req = v.req * 1e6, gbs = req * v.ms / 1000 * (+v.mem) / 1024, rate = v.arch === 'arm' ? 0.0000133334 : 0.0000166667;
    const cComp = Math.max(0, gbs - (v.ft ? 400000 : 0)) * rate, cReq = Math.max(0, req - (v.ft ? 1e6 : 0)) / 1e6 * 0.20, total = cComp + cReq;
    const avgRps = req / 2.628e6, conc = avgRps * v.ms / 1000, peakConc = conc * v.peak, far = Math.max(1, Math.ceil(peakConc / 20)) * 730 * (0.5 * 0.04048 + 1 * 0.004445);
    out.innerHTML = kv('compute used', big(gbs) + ' GB-seconds') + bar('compute', cComp / (total || 1), usd(cComp), 'c1') + bar('requests (US$0.20 per million)', cReq / (total || 1), usd(cReq), 'c2') +
      kv('Lambda monthly total', usd(total), 'hl') + kv('average concurrency = rate × duration', sig(conc)) + kv('peak concurrency', sig(peakConc) + (peakConc > 1000 ? ' (above the default 1,000 account limit)' : ''), peakConc > 1000 ? '' : '') +
      kv('rough always-on Fargate equivalent', usd(far)) +
      `<p class="cnote">${total < far ? pill('Lambda cheaper', 'good') : pill('containers cheaper', 'warn')} Concurrency follows Little's law: halve the duration and you halve the copies running at once. More memory also means more CPU, which often shortens the duration.</p>`;
  });
};

/* =========================== 09 queue backlog =========================== */
W.queuesim = host => {
  const out = shell(host, rng('base', 'normal arrivals (msg/s)', 50, 5, 500, 5) + rng('spike', 'spike arrivals (msg/s)', 400, 50, 3000, 50) + rng('dur', 'spike length (minutes)', 10, 1, 40, 1) +
    rng('cons', 'consumers', 4, 1, 50, 1) + rng('rate', 'messages per second per consumer', 30, 1, 200, 1), '<canvas class="ccanvas" aria-label="Queue depth over one hour"></canvas>');
  const cv = host.querySelector('canvas');
  live(host, v => {
    const cap = v.cons * v.rate, depth = []; let q = 0, maxQ = 0, maxAge = 0, cleared = null;
    for (let m = 0; m < 60; m++) { const arr = (m >= 10 && m < 10 + v.dur ? v.spike : v.base) * 60; q = Math.max(0, q + arr - cap * 60); depth.push(q); maxQ = Math.max(maxQ, q); maxAge = Math.max(maxAge, q / cap);
      if (cleared === null && m >= 10 + v.dur && q === 0) cleared = m; }
    lineChart(cv, [{ pts: depth, c: '--k-int', label: 'backlog' }], { xt: [[0, '0 min'], [10, 'spike'], [30, '30'], [59, '60 min']], fy: y => big(y), minMax: 1 });
    const ok = cap > v.base;
    out.innerHTML = kv('processing capacity', int(cap) + ' msg/s') + kv('peak backlog', int(maxQ) + ' messages', 'hl') + kv('oldest message waited', secs(maxAge)) +
      kv('backlog cleared', !ok ? 'never: capacity below normal traffic' : cleared !== null ? `minute ${cleared}` : 'not within the hour') +
      `<p class="cnote">${!ok ? pill('unstable', 'bad') : maxAge > 300 ? pill('slow recovery', 'warn') : pill('healthy', 'good')} Nothing was lost: the queue absorbed the spike. Scale consumers on the "age of oldest message" metric, and keep the visibility timeout above your processing time.</p>`;
  });
};

/* =========================== 10 Fargate vs EC2 =========================== */
W.fargate = host => {
  const VALID = { 0.25: [0.5, 2], 0.5: [1, 4], 1: [2, 8], 2: [4, 16], 4: [8, 30], 8: [16, 60], 16: [32, 120] };
  const EC2 = { 'm7g.large': [2, 8, 0.0816], 'm7g.xlarge': [4, 16, 0.1632], 'c7g.2xlarge': [8, 16, 0.289], 'r7g.xlarge': [4, 32, 0.2142] };
  const out = shell(host, sel('cpu', 'task vCPU', Object.keys(VALID).map(k => [k, k]), '0.5') + num('mem', 'task memory (GB)', 1, { min: 0.5, step: 0.5 }) + num('n', 'tasks running 24/7', 12, { min: 1, step: 1 }) +
    sel('ec2', 'EC2 instance to pack onto', Object.keys(EC2).map(k => [k, `${k} (${EC2[k][0]} vCPU, ${EC2[k][1]} GB)`]), 'm7g.xlarge') + chk('spot', 'Fargate Spot (~70% off, interruptible)', false));
  live(host, v => {
    const cpu = +v.cpu, [lo, hi] = VALID[cpu], valid = v.mem >= lo && v.mem <= hi;
    if (!valid) { out.innerHTML = `<p class="cnote">${pill('invalid size', 'bad')} With ${cpu} vCPU, Fargate allows ${lo}–${hi} GB of memory.</p>`; return; }
    const far = v.n * 730 * (cpu * 0.04048 + v.mem * 0.004445) * (v.spot ? 0.3 : 1), [ec, em, ep] = EC2[v.ec2];
    const per = Math.max(0, Math.min(Math.floor((ec - 0.1) / cpu), Math.floor((em * 0.9) / v.mem))), inst = per ? Math.ceil(v.n / per) : Infinity, ecCost = inst * 730 * ep;
    const used = per ? Math.min(1, v.n * cpu / (inst * ec)) : 0;
    out.innerHTML = kv('tasks per instance (after agent overhead)', per || 'does not fit') + kv('instances needed', isFinite(inst) ? inst : '–') + bar('CPU actually used on those instances', used, Math.round(used * 100) + '%', used > 0.7 ? 'good' : 'warn') +
      bar('Fargate / month', far / Math.max(far, ecCost || 0), usd(far), far <= ecCost ? 'good' : 'c2') + (isFinite(ecCost) ? bar('EC2 (on-demand) / month', ecCost / Math.max(far, ecCost), usd(ecCost), ecCost < far ? 'good' : 'c2') : '') +
      `<p class="cnote">EC2 can be cheaper when tasks pack tightly, but you then patch, scale and pay for the empty space. Fargate bills exactly the task size, with nothing to manage.</p>`;
  });
};

/* =========================== 12 canary =========================== */
W.canary = host => {
  const out = shell(host, num('rpm', 'requests per minute', 6000, { min: 1, step: 100 }) + rng('err', 'error rate of the buggy release %', 8, 0.5, 50, 0.5) +
    rng('w', 'canary traffic share %', 10, 1, 50, 1) + rng('detect', 'minutes for the alarm to trigger', 3, 1, 15, 1) + rng('rb', 'minutes to roll back', 2, 0, 15, 1));
  live(host, v => {
    const t = v.detect + v.rb, badAll = v.rpm * t * v.err / 100, badCan = badAll * v.w / 100;
    out.innerHTML = '<div class="flowsteps">' +
      `<div class="on"><i>1</i><span>Deploy v2 next to v1, send ${v.w}% of traffic to it</span><b>${int(v.rpm * v.w / 100)}/min</b></div>` +
      `<div class="on"><i>2</i><span>Alarm on v2's error rate fires after ${v.detect} min</span><b>${v.err}% &gt; threshold</b></div>` +
      `<div class="go"><i>3</i><span>Automatic rollback in ${v.rb} min</span><b>v1 only</b></div></div>` +
      bar('failed requests, all-at-once release', 1, int(badAll), 'bad') + bar('failed requests, canary release', badCan / badAll, int(badCan), 'good') +
      kv('users protected by the canary', `${int(badAll - badCan)} (${Math.round(100 - v.w)}%)`, 'hl') +
      `<p class="cnote">The blast radius equals the canary share. Smaller shares protect more users but need enough traffic for the alarm to be statistically meaningful.</p>`;
  });
};

/* =========================== 13 SLO =========================== */
W.slo = host => {
  const out = shell(host, sel('slo', 'SLO target', [[99, '99%'], [99.5, '99.5%'], [99.9, '99.9%'], [99.95, '99.95%'], [99.99, '99.99%']], 99.9) + num('req', 'requests per 30 days (millions)', 100, { min: 0.1, step: 10 }) +
    rng('cur', 'current error rate during an incident %', 2, 0.01, 20, 0.01) + `<h5>Logs</h5>` + num('gb', 'log ingestion per day (GB)', 20, { min: 0, step: 1 }) + sel('ret', 'retention', [[7, '7 days'], [30, '30 days'], [90, '90 days'], [365, '1 year'], [3650, 'never expire (10 y)']], 30));
  live(host, v => {
    const bud = 1 - v.slo / 100, fails = v.req * 1e6 * bud, mins = 43200 * bud, burn = (v.cur / 100) / bud, hoursLeft = 720 / burn;
    const ing = v.gb * 30 * 0.50, sto = v.gb * Math.min(+v.ret, 3650) * 0.03 * 0.15;
    out.innerHTML = kv('error budget (30 days)', (bud * 100).toPrecision(2) + ' % of requests') + kv('allowed failed requests', int(fails), 'hl') + kv('equivalent full outage', mins >= 60 ? sig(mins / 60) + ' hours' : sig(mins) + ' minutes') +
      kv('burn rate at current errors', sig(burn) + '×') + bar('budget remaining after 1 hour of this incident', Math.max(0, 1 - burn / 720), Math.max(0, 100 - burn / 7.2).toFixed(1) + '%', burn >= 14.4 ? 'bad' : burn >= 6 ? 'warn' : 'good') +
      kv('whole month\'s budget gone in', secs(hoursLeft * 3600), 'hl') +
      `<p class="cnote">${burn >= 14.4 ? pill('page now', 'bad') : burn >= 6 ? pill('ticket', 'warn') : pill('within budget', 'good')} A common rule: page when burn ≥ 14.4× over 1 hour (2% of the budget gone), open a ticket at 6× over 6 hours.</p>` +
      bar('log ingestion / month (US$0.50/GB)', ing / (ing + sto), usd(ing), 'c1') + bar('log storage / month (compressed, US$0.03/GB)', sto / (ing + sto), usd(sto), 'c2');
  });
};

/* =========================== 14 envelope encryption =========================== */
W.envelope = host => {
  host.innerHTML = `<div class="calc-grid"><div class="calc-ctl"><label class="cf"><span>Secret to protect</span><textarea data-k="pt" rows="3">Customer 42: card ending 4242, balance RM 1,250.00</textarea></label>
    <p class="cnote">${btn('enc', '1 · Encrypt', true)} ${btn('dec', '2 · Decrypt')} ${btn('tamper', 'Tamper with ciphertext')}</p>
    <p class="cnote">Keys live only in this page's memory. The "KMS key" here stands in for a key that, in real KMS, never leaves AWS's hardware security modules.</p></div><div class="calc-out" aria-live="polite"></div></div>`;
  const out = host.querySelector('.calc-out'), enc = new TextEncoder(), dec = new TextDecoder(), b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))), short = s => s.length > 44 ? s.slice(0, 44) + '…' : s;
  const subtle = window.crypto && window.crypto.subtle;
  if (!subtle) { out.innerHTML = `<p class="cnote">${pill('unavailable', 'warn')} Your browser blocked the Web Crypto API here (it needs HTTPS). Open the live site to try it.</p>`; return; }
  let st = null, kms = null;
  const show = (rows, extra) => { out.innerHTML = '<div class="flowsteps">' + rows.map(([i, t, b, c]) => `<div class="${c || 'on'}"><i>${i}</i><span>${t}</span><b>${esc(b)}</b></div>`).join('') + '</div>' + (extra || ''); };
  async function encrypt() {
    kms = kms || await subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['wrapKey', 'unwrapKey']);
    const dk = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12)), wiv = crypto.getRandomValues(new Uint8Array(12)), pt = host.querySelector('[data-k="pt"]').value;
    const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, dk, enc.encode(pt)), wrapped = await subtle.wrapKey('raw', dk, kms, { name: 'AES-GCM', iv: wiv }), raw = await subtle.exportKey('raw', dk);
    st = { iv, wiv, ct: new Uint8Array(ct), wrapped: new Uint8Array(wrapped) };
    show([['1', 'GenerateDataKey: fresh 256-bit data key', short(b64(raw)), 'on'], ['2', `Encrypt ${enc.encode(pt).length} bytes locally with AES-256-GCM`, short(b64(ct)), 'on'],
      ['3', 'Wrap the data key with the KMS key', short(b64(wrapped)), 'on'], ['4', 'Store ciphertext + wrapped key; discard the plain data key', `${st.ct.length + st.wrapped.length} bytes`, 'go']],
      kv('ciphertext size (data + 16-byte auth tag)', st.ct.length + ' bytes') + kv('wrapped data key (32 + 16 bytes)', st.wrapped.length + ' bytes') +
      `<p class="cnote">Only the small wrapped key goes to KMS for decryption. Gigabytes of data never leave your service, which is why envelope encryption is fast and cheap.</p>`);
  }
  async function decrypt() {
    if (!st) { await encrypt(); }
    try {
      const dk = await subtle.unwrapKey('raw', st.wrapped, kms, { name: 'AES-GCM', iv: st.wiv }, { name: 'AES-GCM' }, false, ['decrypt']);
      const pt = await subtle.decrypt({ name: 'AES-GCM', iv: st.iv }, dk, st.ct);
      show([['1', 'Decrypt (unwrap) the data key via KMS', 'allowed by key policy', 'on'], ['2', 'Decrypt data locally with the data key', 'auth tag verified', 'go']],
        `<div class="verdict good">${esc(dec.decode(pt))}</div><p class="cnote">In AWS, step 1 is a KMS Decrypt call: it is logged in CloudTrail and checked against the key policy. Disable the key and nobody can read the data.</p>`);
    } catch (e) {
      show([['1', 'Decrypt (unwrap) the data key via KMS', 'ok', 'on'], ['2', 'Decrypt data with AES-GCM', 'authentication failed', 'stop']],
        `<div class="verdict bad">Rejected</div><p class="cnote">GCM detected that the ciphertext was modified. Authenticated encryption protects integrity as well as secrecy.</p>`);
    }
  }
  host.addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'enc') encrypt(); else if (a.dataset.act === 'dec') decrypt();
    else if (st) { st.ct[0] ^= 1; show([['!', 'Flipped one bit of the stored ciphertext', 'byte 0', 'stop']], '<p class="cnote">Now press Decrypt.</p>'); } });
  encrypt();
};

/* =========================== 17 peering vs TGW =========================== */
W.tgw = host => {
  const out = shell(host, rng('n', 'number of VPCs', 8, 2, 100, 1) + num('gb', 'traffic between VPCs (GB/month)', 5000, { min: 0, step: 500 }) + rng('az', 'share of traffic crossing AZs %', 50, 0, 100, 5),
    '<canvas class="ccanvas" aria-label="Connections needed as VPCs grow"></canvas>');
  const cv = host.querySelector('canvas');
  live(host, v => {
    const mesh = v.n * (v.n - 1) / 2, routes = v.n * (v.n - 1), tgwCost = v.n * 0.05 * 730 + v.gb * 0.02, peerCost = v.gb * (v.az / 100) * 0.02;
    const xs = Array.from({ length: 30 }, (_, i) => i + 2);
    lineChart(cv, [{ pts: xs.map(n => n * (n - 1) / 2), c: '--bad', label: 'peerings' }, { pts: xs.map(n => n), c: '--accent', label: 'TGW links' }], { xt: [[0, '2 VPCs'], [14, '16'], [29, '31 VPCs']], h: 180 });
    out.innerHTML = kv('full-mesh peering connections n(n−1)/2', int(mesh), 'hl') + kv('route-table entries to maintain (mesh)', int(routes)) + kv('Transit Gateway attachments', v.n, 'hl') +
      bar('peering / month (only cross-AZ data billed)', peerCost / Math.max(peerCost, tgwCost), usd(peerCost), 'c2') + bar('Transit Gateway / month (attachments + US$0.02/GB)', tgwCost / Math.max(peerCost, tgwCost), usd(tgwCost), 'c1') +
      `<p class="cnote">${v.n - 1 > 50 ? pill(`each VPC needs ${v.n - 1} peerings: above the default quota of 50`, 'bad') : ''}Peering is cheaper on paper but isn't transitive and becomes unmanageable. A hub adds central routing and inspection; many teams switch at around 10–20 VPCs.</p>`;
  });
};

/* =========================== 18 Athena =========================== */
W.athena = host => {
  const out = shell(host, num('gb', 'table size as CSV (GB)', 2000, { min: 1, step: 100 }) + rng('cols', 'columns in the table', 40, 2, 200, 1) + rng('used', 'columns the query reads', 4, 1, 40, 1) +
    rng('days', 'days of data in the table', 365, 7, 1825, 1) + rng('qd', 'days the query filters to', 7, 1, 365, 1) + rng('ratio', 'Parquet compression vs CSV ×', 4, 1, 10, 0.5) + num('qpd', 'queries per day', 50, { min: 1, step: 5 }));
  live(host, v => {
    const used = Math.min(v.used, v.cols), qd = Math.min(v.qd, v.days), csv = v.gb, pq = v.gb / v.ratio * used / v.cols, part = pq * qd / v.days, cost = g => Math.max(g, 0.01) / 1000 * 5;
    const rows = [['CSV, full scan', csv, 'bad'], ['Parquet (reads only needed columns)', pq, 'warn'], ['Parquet + partitioned by date', part, 'good']];
    out.innerHTML = rows.map(r => bar(`${r[0]} · ${sig(r[1])} GB scanned`, r[1] / csv, usd(cost(r[1])) + ' / query', r[2])).join('') +
      kv('monthly cost, CSV', usd(cost(csv) * v.qpd * 30)) + kv('monthly cost, Parquet + partitions', usd(cost(part) * v.qpd * 30), 'hl') +
      kv('reduction', '×' + sig(csv / Math.max(part, 0.01))) +
      `<p class="cnote">Athena charges US$5 per TB scanned (10 MB minimum per query). Columnar formats skip unused columns; partitions skip unused days. Both also make queries faster.</p>`;
  });
};

/* =========================== 19 Well-Architected radar =========================== */
W.waradar = host => {
  const P = [['Operational excellence', ['Infrastructure is defined in code', 'Deploys are automated with rollback', 'Runbooks exist for common incidents']],
    ['Security', ['No long-lived credentials; MFA everywhere', 'Data encrypted at rest and in transit', 'Threat detection (GuardDuty) enabled']],
    ['Reliability', ['Runs in at least two AZs', 'Backups are tested by restoring', 'Failure has been rehearsed (game day)']],
    ['Performance efficiency', ['Instance types reviewed in the last year', 'Caching used for hot reads', 'Load tested at expected peak']],
    ['Cost optimization', ['Every resource is tagged with an owner', 'Budgets and anomaly alerts are set', 'Steady usage covered by Savings Plans']],
    ['Sustainability', ['Graviton / efficient instance types used', 'Idle resources are switched off', 'Data has lifecycle rules']]];
  const defaults = [1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0];
  let idx = 0; const ctl = P.map(([p, qs]) => `<h5>${p}</h5>` + qs.map(q => chk('q' + idx, q, !!defaults[idx++])).join('')).join('');
  const out = shell(host, ctl, '<canvas class="ccanvas" aria-label="Pillar scores radar chart"></canvas>');
  const cv = host.querySelector('canvas');
  live(host, v => {
    const sc = P.map((_, i) => [0, 1, 2].filter(j => v['q' + (i * 3 + j)]).length / 3);
    const { ctx, w, h } = canvas(cv, 280), cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) / 2 - 46, ang = i => -Math.PI / 2 + i * 2 * Math.PI / 6;
    ctx.fillStyle = tok('--surface'); ctx.fillRect(0, 0, w, h); ctx.strokeStyle = tok('--line'); ctx.lineWidth = 1;
    [1 / 3, 2 / 3, 1].forEach(r => { ctx.beginPath(); for (let i = 0; i <= 6; i++) { const a = ang(i % 6); i ? ctx.lineTo(cx + R * r * Math.cos(a), cy + R * r * Math.sin(a)) : ctx.moveTo(cx + R * r * Math.cos(a), cy + R * r * Math.sin(a)); } ctx.stroke(); });
    ctx.font = '11px ' + tok('--body'); ctx.fillStyle = tok('--muted'); ctx.textAlign = 'center';
    P.forEach((p, i) => { const a = ang(i); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); ctx.stroke(); ctx.fillText(p[0].split(' ')[0], cx + (R + 22) * Math.cos(a), cy + (R + 16) * Math.sin(a) + 4); });
    ctx.fillStyle = tok('--accent-soft'); ctx.strokeStyle = tok('--accent'); ctx.lineWidth = 2; ctx.beginPath();
    sc.forEach((s0, i) => { const r = R * Math.max(0.04, s0), a = ang(i); i ? ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.textAlign = 'start';
    const gaps = []; P.forEach(([p, qs], i) => qs.forEach((q, j) => { if (!v['q' + (i * 3 + j)]) gaps.push([p, q, i]); }));
    const prio = ['Security', 'Reliability', 'Operational excellence', 'Cost optimization', 'Performance efficiency', 'Sustainability'];
    gaps.sort((a, b) => prio.indexOf(a[0]) - prio.indexOf(b[0]));
    const total = sc.reduce((a, b) => a + b, 0) / 6, weakest = P[sc.indexOf(Math.min(...sc))][0];
    out.innerHTML = kv('overall score', Math.round(total * 100) + ' %', 'hl') + kv('weakest pillar', weakest) +
      `<h5>Fix first (security and reliability lead)</h5><div class="flowsteps">${gaps.slice(0, 4).map((g, i) => `<div class="stop"><i>${i + 1}</i><span>${esc(g[1])}</span><b>${esc(g[0].split(' ')[0])}</b></div>`).join('') || `<div class="go"><i>✓</i><span>No gaps ticked. Time for a deeper review.</span><b></b></div>`}</div>`;
  });
};
})(window.COURSE);
