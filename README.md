# AWS Architect Path

A self-paced, bilingual (English / Bahasa Melayu) learning site with two tracks:

- **☁️ Cloud:** from "what is a server?" to designing production systems on AWS.
- **🧠 AI Engineer Path:** from tensors and backprop to a GPT you write, train, fine-tune and serve yourself, with the math worked in numbers.

**Laman pembelajaran kendiri dwibahasa dengan dua laluan: Cloud (dari kosong hingga arkitek AWS) dan Jurutera AI (dari tensor hingga GPT anda sendiri, dengan matematik dikira menggunakan nombor).**

Live site: https://adib2024.github.io/aws-architect-path/

## What's inside / Kandungan

| Phase / Fasa | Lessons / Pelajaran |
|---|---|
| 0 · Cloud from Zero | What is the cloud · How the internet works · Your AWS account, safely · Your first website · The command line & CloudShell |
| 1 · Foundations | Global infrastructure · IAM · VPC · EC2 & Auto Scaling · S3/EBS/EFS · Databases |
| 2 · Build | Infrastructure as code · Serverless · Event-driven · Containers · DNS & CDN · CI/CD |
| 3 · Operate | Observability · Security · Resilience & DR · Cost optimization |
| 4 · Scale | Multi-account & hybrid · Data & AI · Well-Architected · Capstone project |

Every lesson has / Setiap pelajaran ada:

- **In plain words** with a real-life analogy / **Dalam bahasa mudah** dengan analogi kehidupan
- **Animated diagram** you can play or step through / **Rajah animasi** yang boleh dimainkan langkah demi langkah
- **Two labs**: click-through (no code) and command line / **Dua makmal**: klik sahaja dan baris arahan
- **Cost & security notes** and **practice questions** / **Nota kos & keselamatan** dan **soalan latihan**
- A **tap-to-explain glossary** of 180+ terms / **Glosari** 180+ istilah

## AI Engineer Path

University math assumed (linear algebra, calculus, probability). Every module has: derived formulas worked with real numbers, a live calculator, an animated architecture diagram, a PyTorch notebook (one click to Colab) and numeric quiz questions.

| Phase | Modules |
|---|---|
| A1 · Learning machinery | A01 Tensors & compute model · A02 Softmax & cross-entropy · A03 SGD, momentum & Adam · A04 Backprop & autograd |
| A2 · Deep networks | A05 Init, normalization & residuals · A06 CNNs & RNNs |
| A3 · Transformers from scratch | A07 Tokens, embeddings & positions · A08 Attention · A09 GPT from scratch |
| A4 · LLMs in production | A10 Training at scale on AWS · A11 SFT, LoRA & DPO · A12 Inference, quantization & serving |
| Capstone | BahasaGPT-mini: a Malay language model trained, fine-tuned and served on AWS |

Notebooks live in [`notebooks/`](notebooks/) and are generated from the course data: `node tools/make_notebooks.js`.

## Run it / Cara buka

No build step. Open `index.html` in a browser, or serve the folder:

Tiada proses build. Buka `index.html` dalam pelayar, atau jalankan:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

### Publish free with GitHub Pages / Terbitkan percuma dengan GitHub Pages

1. **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main` → folder `/ (root)` → **Save**
3. After a minute the course is live at `https://adib2024.github.io/aws-architect-path/`

## Files / Fail

| File | Contents / Kandungan |
|---|---|
| `index.html` | Page, styles and engine (diagrams, glossary, language switch) / Halaman, gaya dan enjin |
| `phase0.js` | Phase 0 lessons (bilingual) / Pelajaran Fasa 0 (dwibahasa) |
| `course-a.js`, `course-b.js` | Modules 01–19 and the capstone / Modul 01–19 dan capstone |
| `beginner.js` | Analogies and click-through labs for modules 01–19 (bilingual) / Analogi dan makmal klik |
| `ai-a.js`, `ai-b.js` | AI track modules A01–A12 and the AI capstone / Modul laluan AI |
| `ai-widgets.js` | Live calculators for the AI track / Kalkulator langsung |
| `notebooks/` | PyTorch notebooks (generated) / Notebook PyTorch |
| `tools/` | `make_notebooks.js` (notebooks), `build_artifact.py` (claude.ai version) |
| `glossary.js` | Glossary terms (bilingual) / Istilah glosari |
| `i18n.js` | Interface text and overview content (bilingual) / Teks antara muka |

To edit content, change the `.js` data files. Text fields written as `{ en: "...", ms: "..." }` are shown in the selected language.

Untuk mengubah kandungan, edit fail data `.js`. Medan teks bertulis `{ en: "...", ms: "..." }` dipaparkan mengikut bahasa yang dipilih.

## Notes / Nota

- Independent study guide, not affiliated with Amazon Web Services. Prices are indicative; check the AWS pricing pages.
- Progress is saved in each learner's own browser (`localStorage`). Nothing is sent anywhere.
- Labs create real AWS resources. Always do the **Clean up** step.

- Panduan bebas, tidak bergabung dengan Amazon Web Services. Harga adalah anggaran.
- Kemajuan disimpan dalam pelayar setiap pelajar sahaja.
- Makmal mencipta sumber AWS sebenar. Sentiasa lakukan langkah **Bersihkan**.
