// Generates notebooks/*.ipynb from the AI module data (ai-a.js, ai-b.js), so the site and notebooks never drift.
// Usage: node tools/make_notebooks.js
const fs = require('fs');
const path = require('path');

global.window = { COURSE: {} };
require('../ai-a.js');
require('../ai-b.js');
const mods = window.COURSE.aiModules;
const REPO = 'Adib2024/aws-architect-path';
const OUT = path.join(__dirname, '..', 'notebooks');

// Per-step handling: how a lab step becomes a notebook cell.
const SPECIAL = {
  a10: { 2: { writefile: 'train_ddp.py' }, 3: { aws: true } },
  a12: { 3: { shell: true }, 4: { aws: true } }
};
const PIP = { a06: 'torchvision', a07: 'tiktoken', a10: 'sagemaker', a11: 'transformers peft', a12: 'transformers' };

const md = s => s.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => `$$${t.trim()}$$`).replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => `$${t.trim()}$`);
const lines = s => s.split('\n').map((l, i, a) => (i < a.length - 1 ? l + '\n' : l));
let n = 0;
const cell = (type, src) => type === 'code'
  ? { cell_type: 'code', execution_count: null, id: `c${(n++).toString(16).padStart(6, '0')}`, metadata: {}, outputs: [], source: lines(src) }
  : { cell_type: 'markdown', id: `c${(n++).toString(16).padStart(6, '0')}`, metadata: {}, source: lines(src) };

fs.mkdirSync(OUT, { recursive: true });
mods.forEach((m, idx) => {
  n = 0;
  const num = 'A' + String(idx + 1).padStart(2, '0');
  const cells = [];
  cells.push(cell('markdown',
    `# ${num} · ${m.title}\n\n` +
    `[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/${REPO}/blob/main/notebooks/${m.notebook})\n\n` +
    `${md(m.summary)}\n\n` +
    `Part of the **AI Engineer Path** (https://adib2024.github.io/aws-architect-path/#${m.id}). ` +
    `In Colab, use **Runtime → Change runtime type → T4 GPU** for anything that trains.\n\n` +
    `**You will:**\n${m.outcomes.map(o => '- ' + md(o)).join('\n')}`));
  cells.push(cell('markdown', '## The math\n\n' + m.math.map(f =>
    `### ${f.name}\n\n${md(f.tex)}\n\n${md(f.explain)}\n\n` +
    (f.worked ? '**Worked example**\n\n' + f.worked.map((w, i) => `${i + 1}. ${md(w[0])}${w[1] ? ` (${md(w[1])})` : ''}`).join('\n') : '')
  ).join('\n\n')));
  if (PIP[m.id]) cells.push(cell('code', `%pip install -q ${PIP[m.id]}`));
  cells.push(cell('markdown', `## Lab: ${m.lab.title}\n\n${md(m.lab.goal)}`));
  m.lab.steps.forEach((s, i) => {
    const sp = (SPECIAL[m.id] || {})[i] || {};
    let note = `### Step ${i + 1}\n\n${md(s.t)}`;
    if (sp.aws) note += '\n\n> ⚠️ This step runs against your AWS account and may incur charges. Skip it if you are only using Colab.';
    if (sp.shell) { cells.push(cell('markdown', note + '\n\n> Run this in a terminal on a GPU instance (e.g., EC2 g5.xlarge), not in Colab.\n\n```bash\n' + s.c + '\n```')); return; }
    cells.push(cell('markdown', note));
    if (s.c) cells.push(cell('code', (sp.writefile ? `%%writefile ${sp.writefile}\n` : '') + s.c));
  });
  cells.push(cell('markdown', `### Clean up\n\n${md(m.lab.cleanup.t)}`));
  cells.push(cell('markdown', '## Check yourself\n\n' + m.quiz.map((q, i) =>
    `**${i + 1}. ${md(q.q)}**\n\n${q.o.map((o, j) => `${'ABCD'[j]}. ${md(o)}`).join('  \n')}\n\n<details><summary>Answer</summary>\n\n**${'ABCD'[q.a]}.** ${md(q.why)}\n\n</details>`).join('\n\n')));
  const nb = { nbformat: 4, nbformat_minor: 5,
    metadata: { accelerator: 'GPU', colab: { provenance: [] }, kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' }, language_info: { name: 'python' } },
    cells };
  fs.writeFileSync(path.join(OUT, m.notebook), JSON.stringify(nb, null, 1) + '\n');
  console.log('wrote', m.notebook, cells.length, 'cells');
});
