/* Interface strings and bilingual overview content. Loaded after course-a/b.js so it can override their English-only fields. */
(function (C) {
const s = (en, ms) => ({ en, ms });

C.ui = {
  en: {
    navOverview: "Overview & roadmap", glossary: "Glossary", progress: "Your progress", phase: "Phase", module: "Module", lesson: "Lesson",
    hours: "hours", byEnd: "By the end you can", plain: "In plain words", analogy: "Real-life analogy", why: "Why it matters",
    concepts: "Key concepts", flow: "See it flow", flowHint: "press play or tap the numbers", play: "▶ Play", stop: "■ Stop", step: "STEP",
    swipe: "Swipe the diagram sideways to see all of it →", lab: "Hands-on lab", tabConsole: "Click-through (no code)", tabCli: "Command line",
    cleanup: "Clean up.", costTag: "Cost watch", costH: "What drives the bill", secTag: "Security checklist", secH: "What a reviewer will ask",
    check: "Check yourself", question: "QUESTION", correct: "Correct.", wrong: "Not quite.", deeper: "Go deeper", markDone: "Mark as complete",
    done: "✓ Completed", back: "Back", overview: "Overview", next: "Next", prev: "Previous", finale: "Finale", capstone: "Capstone project",
    learnMore: "Learn more in", close: "Close", searchTerms: "Search terms…", glossaryTitle: "Glossary",
    glossaryLede: "Every underlined word in the course links here. Tap one anywhere to see its meaning without leaving the page.",
    noTerms: "No terms match that search.", compareChip: "decision guide", correctOf: "correct", questions: "questions",
    techNote: "", tapHint: "Tip: tap any underlined word for a plain explanation.",
    menu: "Modules", self: "self-paced · 16 weeks", foot: "Independent study guide, not affiliated with Amazon Web Services. Progress is saved in this browser only. Prices are indicative; always check the AWS pricing pages.",
    eyebrow: "Cloud architecture course · from zero to architect",
    h1a: "Learn the cloud ", h1b: "from zero", h1c: ", then build like an architect.",
    startZero: "New to tech? Start at lesson 0.1", startPro: "Already technical? Jump to module 01", cont: "Continue where you left off",
    fModules: "lessons & modules", fHours: "study + labs", fQs: "practice questions", fDias: "animated diagrams",
    endUp: "Where you will end up", endUpLede: "Press play. Every lesson has a diagram like this one that shows how requests, data and events move between services.",
    howTitle: "How each lesson works", roadmap: "The roadmap", complete: "complete", schedule: "Suggested schedule",
    certTitle: "Certification map", certChip: "● core · ○ supporting", prereqTitle: "Prerequisites", prereqEye: "Before you start",
    sandboxEye: "Sandbox rules", sandboxTitle: "Keep your practice account safe and cheap", groupEye: "Sharing this course", groupTitle: "Learn together as a study group",
    newTitle: "Brand new to tech? Read this first", sharePrompt: "Share this page"
  },
  ms: {
    navOverview: "Gambaran & peta laluan", glossary: "Glosari", progress: "Kemajuan anda", phase: "Fasa", module: "Modul", lesson: "Pelajaran",
    hours: "jam", byEnd: "Selepas ini anda boleh", plain: "Dalam bahasa mudah", analogy: "Analogi kehidupan", why: "Kenapa ia penting",
    concepts: "Konsep utama", flow: "Lihat alirannya", flowHint: "tekan main atau tekan nombor", play: "▶ Main", stop: "■ Henti", step: "LANGKAH",
    swipe: "Leret rajah ke tepi untuk melihat semuanya →", lab: "Makmal amali", tabConsole: "Klik sahaja (tanpa kod)", tabCli: "Baris arahan",
    cleanup: "Bersihkan.", costTag: "Pantau kos", costH: "Apa yang menentukan bil", secTag: "Senarai semak keselamatan", secH: "Apa yang akan ditanya penyemak",
    check: "Uji diri", question: "SOALAN", correct: "Betul.", wrong: "Belum tepat.", deeper: "Teroka lebih lanjut", markDone: "Tanda selesai",
    done: "✓ Selesai", back: "Kembali", overview: "Gambaran", next: "Seterusnya", prev: "Sebelumnya", finale: "Penutup", capstone: "Projek capstone",
    learnMore: "Ketahui lebih lanjut dalam", close: "Tutup", searchTerms: "Cari istilah…", glossaryTitle: "Glosari",
    glossaryLede: "Setiap perkataan bergaris dalam kursus ini dipautkan ke sini. Tekan mana-mana untuk melihat maksudnya tanpa meninggalkan halaman.",
    noTerms: "Tiada istilah yang sepadan.", compareChip: "panduan keputusan", correctOf: "betul", questions: "soalan",
    techNote: "Bahagian teknikal modul ini (konsep, rajah, makmal baris arahan, soalan) kekal dalam Bahasa Inggeris, bahasa yang digunakan dalam dokumentasi AWS dan alam pekerjaan. Kotak \"Dalam bahasa mudah\", makmal klik dan glosari tersedia dalam Bahasa Melayu.",
    tapHint: "Tip: tekan mana-mana perkataan bergaris untuk penerangan mudah.",
    menu: "Modul", self: "kendiri · 16 minggu", foot: "Panduan pembelajaran bebas, tidak bergabung dengan Amazon Web Services. Kemajuan disimpan dalam pelayar ini sahaja. Harga adalah anggaran; sentiasa semak halaman harga AWS.",
    eyebrow: "Kursus seni bina cloud · dari kosong hingga arkitek",
    h1a: "Belajar cloud ", h1b: "dari kosong", h1c: ", kemudian bina seperti arkitek.",
    startZero: "Baru dalam teknologi? Mula di pelajaran 0.1", startPro: "Sudah ada asas teknikal? Terus ke modul 01", cont: "Sambung dari tempat terakhir",
    fModules: "pelajaran & modul", fHours: "belajar + makmal", fQs: "soalan latihan", fDias: "rajah animasi",
    endUp: "Ke mana anda akan sampai", endUpLede: "Tekan main. Setiap pelajaran ada rajah seperti ini yang menunjukkan bagaimana permintaan, data dan acara bergerak antara perkhidmatan.",
    howTitle: "Cara setiap pelajaran berfungsi", roadmap: "Peta laluan", complete: "selesai", schedule: "Jadual dicadangkan",
    certTitle: "Peta pensijilan", certChip: "● teras · ○ sokongan", prereqTitle: "Prasyarat", prereqEye: "Sebelum bermula",
    sandboxEye: "Peraturan sandbox", sandboxTitle: "Pastikan akaun latihan anda selamat dan murah", groupEye: "Berkongsi kursus ini", groupTitle: "Belajar bersama sebagai kumpulan",
    newTitle: "Benar-benar baharu dalam teknologi? Baca ini dahulu", sharePrompt: "Kongsi halaman ini"
  }
};

C.howItWorks = [
  [s("In plain words", "Dalam bahasa mudah"), s("An everyday analogy and why it matters, before any jargon.", "Analogi harian dan kenapa ia penting, sebelum sebarang jargon.")],
  [s("See it flow", "Lihat alirannya"), s("An animated diagram you can play or step through.", "Rajah animasi yang boleh dimainkan atau diikuti langkah demi langkah.")],
  [s("Two kinds of lab", "Dua jenis makmal"), s("Click-through in the AWS website, or real commands once you're ready.", "Klik di laman AWS, atau arahan sebenar apabila anda bersedia.")],
  [s("Cost & security", "Kos & keselamatan"), s("The bill traps and safety checks every design needs.", "Perangkap bil dan semakan keselamatan yang diperlukan setiap reka bentuk.")],
  [s("Check yourself", "Uji diri"), s("Short questions with explanations for every answer.", "Soalan ringkas dengan penerangan bagi setiap jawapan.")]
];

C.newcomer = [
  s("Do **Phase 0** in order. It assumes you know nothing about servers, networks or the command line.", "Ikuti **Fasa 0** mengikut urutan. Ia menganggap anda tidak tahu apa-apa tentang server, rangkaian atau baris arahan."),
  s("In every module, read the **In plain words** box first. If that's all you understand on day one, that's fine.", "Dalam setiap modul, baca kotak **Dalam bahasa mudah** dahulu. Jika itu sahaja yang anda faham pada hari pertama, tidak mengapa."),
  s("Start with the **Click-through (no code)** lab. Try the **Command line** tab when you feel ready.", "Mulakan dengan makmal **Klik sahaja (tanpa kod)**. Cuba tab **Baris arahan** apabila anda rasa bersedia."),
  s("Tap any **underlined word** to see what it means. The full list is in the **Glossary**.", "Tekan mana-mana **perkataan bergaris** untuk melihat maksudnya. Senarai penuh ada dalam **Glosari**."),
  s("Always do the **Clean up** step at the end of a lab, so you don't pay for things you're not using.", "Sentiasa lakukan langkah **Bersihkan** di akhir makmal, supaya anda tidak membayar untuk perkara yang tidak digunakan.")
];

C.intro = s(
  "A complete path from \"what is a server?\" to designing production systems on AWS. Five beginner lessons build the basics, then 19 modules take you to architect level. Each one starts with a plain-language explanation and ends with a hands-on lab.",
  "Laluan lengkap dari \"apa itu server?\" hingga mereka bentuk sistem produksi di AWS. Lima pelajaran asas membina asas anda, kemudian 19 modul membawa anda ke tahap arkitek. Setiap satu bermula dengan penerangan dalam bahasa mudah dan berakhir dengan makmal amali."
);

C.phases = [
  { n: 0, short: s("Cloud from Zero", "Cloud dari Kosong"), title: s("Cloud from Zero", "Cloud dari Kosong"), weeks: s("weeks 0–1 · no experience needed", "minggu 0–1 · tiada pengalaman diperlukan"), blurb: s("What the cloud is, how the internet works, your first account, website and commands.", "Apa itu cloud, cara internet berfungsi, akaun pertama, laman web dan arahan pertama anda.") },
  { n: 1, short: s("Foundations", "Asas"), title: s("Foundations", "Asas"), weeks: s("weeks 2–7", "minggu 2–7"), blurb: s("The building blocks every AWS design uses: identity, networks, servers, storage and databases.", "Blok binaan yang digunakan setiap reka bentuk AWS: identiti, rangkaian, server, storan dan pangkalan data.") },
  { n: 2, short: s("Build", "Bina"), title: s("Build modern apps", "Bina aplikasi moden"), weeks: s("weeks 8–11", "minggu 8–11"), blurb: s("Infrastructure as code, serverless, events, containers, the edge and delivery pipelines.", "Infrastructure as code, serverless, acara, container, edge dan pipeline penghantaran.") },
  { n: 3, short: s("Operate", "Kendali"), title: s("Run it in production", "Jalankan dalam produksi"), weeks: s("weeks 12–14", "minggu 12–14"), blurb: s("See what's happening, keep it secure, survive failure and keep the bill sane.", "Lihat apa yang berlaku, pastikan selamat, bertahan daripada kegagalan dan kawal bil.") },
  { n: 4, short: s("Scale", "Skala"), title: s("Architect at scale", "Arkitek berskala besar"), weeks: s("weeks 15–17", "minggu 15–17"), blurb: s("Many accounts, hybrid networks, data and AI, and the review practice that ties it together.", "Banyak akaun, rangkaian hibrid, data dan AI, serta amalan semakan yang menyatukan semuanya.") }
];

C.schedule = {
  cols: [s("Weeks", "Minggu"), s("Lessons", "Pelajaran"), s("Milestone", "Pencapaian")],
  rows: [
    ["0–1", "0.1 – 0.5 Cloud from Zero", s("Your own safe AWS account, a live web page and your first commands", "Akaun AWS selamat anda sendiri, halaman web di internet dan arahan pertama anda")],
    ["2–3", "01 Global infrastructure, 02 IAM", s("Locked-down practice account with SSO, budget and audit trail", "Akaun latihan terkunci dengan SSO, bajet dan jejak audit")],
    ["4–5", "03 VPC, 04 Compute", s("Two-AZ network with an auto-scaling web tier", "Rangkaian dua AZ dengan lapisan web yang berskala automatik")],
    ["6–7", "05 Storage, 06 Databases", s("Tiered S3 storage and a DynamoDB data model", "Storan S3 berperingkat dan model data DynamoDB")],
    ["8–9", "07 IaC, 08 Serverless, 09 Events", s("Everything from now on is built from code", "Mulai sekarang semuanya dibina daripada kod")],
    ["10–11", "10 Containers, 11 Edge, 12 CI/CD", s("Containerised API behind CloudFront, shipped by a pipeline. Good time for the Associate exam.", "API dalam container di belakang CloudFront, dihantar oleh pipeline. Masa sesuai untuk peperiksaan Associate.")],
    ["12–14", "13 Observability, 14 Security, 15 Resilience, 16 Cost", s("Alarms, encryption, a failure drill and a cost report", "Alarm, penyulitan, latihan kegagalan dan laporan kos")],
    ["15–17", "17 Multi-account, 18 Data & AI, 19 Well-Architected, Capstone", s("Capstone demo and review", "Demo capstone dan semakan")]
  ]
};

C.certs = [
  { code: "CLF", name: "Cloud Practitioner" },
  { code: "SAA", name: "Solutions Architect – Associate" },
  { code: "SAP", name: "Solutions Architect – Professional" },
  { code: "DOP", name: "DevOps Engineer – Professional" },
  { code: "SCS", name: "Security – Specialty" },
  { code: "ANS", name: "Advanced Networking – Specialty" }
];
C.certNote = s(
  "Certificates are a bonus, not the goal. A sensible order: **CLF** (Cloud Practitioner) after Phase 0 and modules 01–05 if you're new to tech, **SAA** after week 11, then **SAP** after the capstone and some real projects. The rest are optional specialisations.",
  "Sijil ialah bonus, bukan matlamat. Susunan yang munasabah: **CLF** (Cloud Practitioner) selepas Fasa 0 dan modul 01–05 jika anda baharu dalam teknologi, **SAA** selepas minggu 11, kemudian **SAP** selepas capstone dan beberapa projek sebenar. Selebihnya pengkhususan pilihan."
);
C.prereqs = [
  s("**For Phase 0:** a computer, a web browser and curiosity. No coding or IT background needed.", "**Untuk Fasa 0:** komputer, pelayar web dan rasa ingin tahu. Tiada latar belakang pengaturcaraan atau IT diperlukan."),
  s("**For your AWS account (lesson 0.3):** an email address, a phone and a debit or credit card for verification.", "**Untuk akaun AWS anda (pelajaran 0.3):** alamat e-mel, telefon dan kad debit atau kredit untuk pengesahan."),
  s("**From module 01:** the command-line labs use CloudShell in your browser. Installing tools on your own computer (AWS CLI, Node.js, Terraform, Docker) is optional until module 07.", "**Mulai modul 01:** makmal baris arahan menggunakan CloudShell dalam pelayar anda. Memasang alat di komputer sendiri (AWS CLI, Node.js, Terraform, Docker) adalah pilihan sehingga modul 07."),
  s("Labs default to Singapore (`ap-southeast-1`). Use the Region closest to you, such as Malaysia (`ap-southeast-5`).", "Makmal menggunakan Singapura (`ap-southeast-1`) secara lalai. Gunakan Region yang paling dekat dengan anda, seperti Malaysia (`ap-southeast-5`).")
];
C.sandbox = [
  s("Use a **separate practice account** that holds nothing important.", "Gunakan **akaun latihan berasingan** yang tidak menyimpan apa-apa yang penting."),
  s("Set a **budget alert** before anything else (lesson 0.3).", "Tetapkan **amaran bajet** sebelum melakukan apa-apa (pelajaran 0.3)."),
  s("Always finish the **Clean up** step. NAT gateways, load balancers, Kubernetes clusters and databases charge every hour, even when idle.", "Sentiasa selesaikan langkah **Bersihkan**. NAT gateway, load balancer, kluster Kubernetes dan pangkalan data dicaj setiap jam, walaupun tidak digunakan."),
  s("Tag what you create `project=aws-path` so stragglers are easy to find.", "Tag apa yang anda cipta `project=aws-path` supaya mudah dicari kemudian."),
  s("Never share passwords or access keys, not even with classmates.", "Jangan sesekali berkongsi kata laluan atau access key, walaupun dengan rakan sekelas.")
];
C.group = [
  s("Share this page's link. Each person's progress and answers are saved in their own browser, so nobody overwrites anyone else.", "Kongsi pautan halaman ini. Kemajuan dan jawapan setiap orang disimpan dalam pelayar masing-masing, jadi tiada siapa menimpa kerja orang lain."),
  s("Meet once a week for an hour: replay the lesson's diagram together, compare lab results, then discuss the questions.", "Berjumpa seminggu sekali selama sejam: main semula rajah pelajaran bersama-sama, bandingkan hasil makmal, kemudian bincangkan soalan."),
  s("Pair a beginner with someone more technical. The beginner explains the analogy, the other explains the commands.", "Pasangkan pemula dengan seseorang yang lebih teknikal. Pemula menerangkan analogi, yang lain menerangkan arahan."),
  s("Use the language switch (EN / BM) so everyone can read in the language they're most comfortable with.", "Gunakan suis bahasa (EN / BM) supaya semua orang boleh membaca dalam bahasa yang paling selesa.")
];

/* ---------- AI Engineer Path ---------- */
Object.assign(C.ui.en, {
  trackCloud: "Cloud", trackAI: "AI", aiNav: "AI overview & roadmap", aiCapstone: "AI capstone",
  mathTitle: "The math, worked with numbers", mathChip: "formulas + worked examples", worked: "Worked example",
  liveTitle: "Try it live", liveChip: "interactive calculator", nbOpen: "Open in Colab", nbView: "View notebook on GitHub",
  computeTag: "Compute & memory", computeH: "What it costs to run", pitfallTag: "Pitfalls & debugging", pitfallH: "What goes wrong in practice",
  aiEyebrow: "AI engineering track · from tensors to your own GPT",
  aiH1a: "Understand AI ", aiH1b: "down to the math", aiH1c: ", then build it in PyTorch.",
  aiStart: "Start at A01", aiFModules: "modules", aiFHours: "math + code", aiFCalcs: "live calculators", aiFNbs: "PyTorch notebooks",
  aiEndUp: "Where you will end up", aiEndUpLede: "A GPT you wrote yourself, trained on Malay text on AWS, fine-tuned, quantised and served. Press play.",
  aiHowTitle: "How each AI module works", aiPrereqTitle: "What you need", aiHwTitle: "Hardware & budget", aiLinkTitle: "How this connects to the cloud track",
  mathNote: "Formulas render with MathJax. If they show as raw LaTeX, your network blocked the math library; the content is still readable.",
  tryAI: "New: AI Engineer Path", tryAIText: "Go beyond \"what is AI\": tensors, backprop, attention and your own GPT, with the math worked in numbers and runnable PyTorch.", tryAIBtn: "Open the AI track →",
  phaseAI: "AI"
});
Object.assign(C.ui.ms, {
  trackCloud: "Cloud", trackAI: "AI", aiNav: "Gambaran & peta laluan AI", aiCapstone: "Capstone AI",
  mathTitle: "Matematik, dengan contoh nombor", mathChip: "formula + contoh kiraan", worked: "Contoh kiraan",
  liveTitle: "Cuba secara langsung", liveChip: "kalkulator interaktif", nbOpen: "Buka dalam Colab", nbView: "Lihat notebook di GitHub",
  computeTag: "Pengkomputeran & memori", computeH: "Kos untuk menjalankannya", pitfallTag: "Perangkap & nyahpepijat", pitfallH: "Apa yang biasa silap",
  aiEyebrow: "Laluan kejuruteraan AI · dari tensor hingga GPT anda sendiri",
  aiH1a: "Fahami AI ", aiH1b: "hingga ke matematiknya", aiH1c: ", kemudian bina dalam PyTorch.",
  aiStart: "Mula di A01", aiFModules: "modul", aiFHours: "matematik + kod", aiFCalcs: "kalkulator langsung", aiFNbs: "notebook PyTorch",
  aiEndUp: "Ke mana anda akan sampai", aiEndUpLede: "GPT yang anda tulis sendiri, dilatih dengan teks Bahasa Melayu di AWS, ditala halus, dikuantisasi dan dihidangkan. Tekan main.",
  aiHowTitle: "Cara setiap modul AI berfungsi", aiPrereqTitle: "Apa yang anda perlukan", aiHwTitle: "Perkakasan & bajet", aiLinkTitle: "Kaitan dengan laluan cloud",
  mathNote: "Formula dipaparkan dengan MathJax. Jika ia kelihatan sebagai LaTeX mentah, rangkaian anda menyekat pustaka matematik; kandungan masih boleh dibaca.",
  tryAI: "Baharu: Laluan Jurutera AI", tryAIText: "Lebih daripada \"apa itu AI\": tensor, backprop, attention dan GPT anda sendiri, dengan matematik dikira menggunakan nombor dan PyTorch yang boleh dijalankan.", tryAIBtn: "Buka laluan AI →",
  phaseAI: "AI",
  techNoteAI: "Bahagian teknikal modul AI (matematik, kod, kalkulator, soalan) kekal dalam Bahasa Inggeris, bahasa kertas kajian dan dokumentasi. Kotak \"Dalam bahasa mudah\" dan glosari tersedia dalam Bahasa Melayu."
});
C.ui.en.techNoteAI = "";

C.aiPhases = [
  { n: "A1", title: s("Learning machinery", "Jentera pembelajaran"), weeks: s("weeks 1–4", "minggu 1–4"), blurb: s("Tensors, losses, optimisers and backprop: the maths every model shares.", "Tensor, fungsi kerugian, pengoptimum dan backprop: matematik yang dikongsi setiap model.") },
  { n: "A2", title: s("Deep networks", "Rangkaian mendalam"), weeks: s("weeks 5–6", "minggu 5–6"), blurb: s("Why depth is hard and how init, normalisation and residuals fix it; CNNs and RNNs.", "Kenapa kedalaman sukar dan bagaimana pengawalan, normalisasi dan residual mengatasinya; CNN dan RNN.") },
  { n: "A3", title: s("Transformers from scratch", "Transformer dari kosong"), weeks: s("weeks 7–9", "minggu 7–9"), blurb: s("Tokens, attention and a complete GPT you write and train yourself.", "Token, attention dan GPT lengkap yang anda tulis dan latih sendiri.") },
  { n: "A4", title: s("LLMs in production", "LLM dalam produksi"), weeks: s("weeks 10–12", "minggu 10–12"), blurb: s("Training at scale, fine-tuning with LoRA and DPO, quantisation and serving on AWS.", "Latihan berskala, penalaan halus dengan LoRA dan DPO, kuantisasi dan menghidangkan model di AWS.") }
];
C.aiIntro = s(
  "Twelve modules that take you from tensors to a GPT you write, train, fine-tune and serve yourself. Every module derives the key formulas, works them through with real numbers, lets you change those numbers in a live calculator, and ends with a runnable PyTorch notebook.",
  "Dua belas modul yang membawa anda dari tensor hingga GPT yang anda tulis, latih, tala halus dan hidangkan sendiri. Setiap modul menerbitkan formula utama, mengiranya dengan nombor sebenar, membolehkan anda mengubah nombor itu dalam kalkulator langsung, dan berakhir dengan notebook PyTorch yang boleh dijalankan."
);
C.aiHow = [
  [s("The math", "Matematik"), s("Each formula derived, then worked line by line with real numbers.", "Setiap formula diterbitkan, kemudian dikira baris demi baris dengan nombor sebenar.")],
  [s("Try it live", "Cuba secara langsung"), s("Change inputs in a calculator and watch results recompute.", "Ubah input dalam kalkulator dan lihat hasil dikira semula.")],
  [s("See it flow", "Lihat alirannya"), s("Animated forward pass, backward pass and architecture.", "Animasi laluan ke hadapan, laluan ke belakang dan seni bina.")],
  [s("PyTorch notebook", "Notebook PyTorch"), s("Runnable code that reproduces every number, one click to Colab.", "Kod boleh dijalankan yang menghasilkan semula setiap nombor, satu klik ke Colab.")],
  [s("Check yourself", "Uji diri"), s("Numeric questions with worked explanations.", "Soalan berangka dengan penerangan kiraan.")]
];
C.aiPrereqs = [
  s("**Math:** linear algebra (matrix products, transposes), multivariable calculus (partial derivatives, chain rule) and basic probability. The modules use them; they don't re-teach them.", "**Matematik:** algebra linear (pendaraban matriks, transpos), kalkulus multivariat (terbitan separa, petua rantai) dan kebarangkalian asas. Modul menggunakannya tetapi tidak mengajarnya semula."),
  s("**Python:** functions, classes, list comprehensions. NumPy experience helps.", "**Python:** fungsi, kelas, list comprehension. Pengalaman NumPy membantu."),
  s("**A Google account** for free Colab GPUs (A01–A09), or `pip install torch` locally.", "**Akaun Google** untuk GPU Colab percuma (A01–A09), atau `pip install torch` di komputer sendiri."),
  s("**An AWS account** for A10–A12 and the capstone (cloud lessons 0.3, 01, 02 and 16 cover setting it up safely).", "**Akaun AWS** untuk A10–A12 dan capstone (pelajaran cloud 0.3, 01, 02 dan 16 menerangkan cara menyediakannya dengan selamat).")
];
C.aiHardware = [
  s("A01–A09 run on Colab's free T4 GPU or a laptop CPU (slower). No cloud bill.", "A01–A09 berjalan pada GPU T4 percuma Colab atau CPU komputer riba (lebih perlahan). Tiada bil cloud."),
  s("A10–A12 use AWS GPUs: a g5.xlarge (1× A10G, 24 GB) costs roughly US$1 per hour on demand; ml.g5.12xlarge (4× A10G) roughly US$7. Check current prices for your Region.", "A10–A12 menggunakan GPU AWS: g5.xlarge (1× A10G, 24 GB) berharga kira-kira US$1 sejam atas permintaan; ml.g5.12xlarge (4× A10G) kira-kira US$7. Semak harga semasa untuk Region anda."),
  s("New accounts usually have a GPU quota of 0. Request a G-instance quota increase in **Service Quotas** a few days before A10.", "Akaun baharu biasanya mempunyai kuota GPU 0. Mohon peningkatan kuota instance G dalam **Service Quotas** beberapa hari sebelum A10."),
  s("Budget for the whole track including the capstone: under US$50 if you stop instances promptly.", "Bajet untuk keseluruhan laluan termasuk capstone: bawah US$50 jika anda menghentikan instance dengan segera.")
];
C.aiLinks = [
  s("Before A10, do cloud modules **02 IAM**, **05 Storage** and **16 Cost**: SageMaker jobs need a role, data lives in S3, and GPUs are the easiest way to overspend.", "Sebelum A10, selesaikan modul cloud **02 IAM**, **05 Storage** dan **16 Cost**: kerja SageMaker memerlukan role, data disimpan dalam S3, dan GPU ialah cara paling mudah untuk terlebih belanja."),
  s("Module **18 Data & AI** covers Bedrock and RAG from the architecture side; A12 covers what happens inside the model you call.", "Modul **18 Data & AI** merangkumi Bedrock dan RAG dari sudut seni bina; A12 menerangkan apa yang berlaku di dalam model yang anda panggil."),
  s("**AWS Certified Machine Learning Engineer – Associate** overlaps with A10–A12 (SageMaker training, deployment, monitoring).", "**AWS Certified Machine Learning Engineer – Associate** bertindih dengan A10–A12 (latihan, penghantaran dan pemantauan SageMaker).")
];
C.aiSchedule = {
  cols: [s("Weeks", "Minggu"), s("Modules", "Modul"), s("You can now…", "Kini anda boleh…")],
  rows: [
    ["1–2", "A01 Tensors, A02 Softmax & CE", s("Predict shapes and FLOPs; derive and implement the classification loss", "Meramal bentuk dan FLOPs; menerbitkan dan melaksanakan fungsi kerugian klasifikasi")],
    ["3–4", "A03 Optimizers, A04 Backprop", s("Write Adam and an autograd engine from scratch", "Menulis Adam dan enjin autograd dari kosong")],
    ["5–6", "A05 Deep nets, A06 CNN & RNN", s("Make 50-layer networks trainable; train a CNN", "Menjadikan rangkaian 50 lapisan boleh dilatih; melatih CNN")],
    ["7–9", "A07 Tokens, A08 Attention, A09 GPT", s("Write and train a GPT; count its parameters and FLOPs", "Menulis dan melatih GPT; mengira parameter dan FLOPs-nya")],
    ["10–12", "A10 Scale, A11 Fine-tuning, A12 Serving", s("Plan a training run, LoRA-tune a model and serve it on AWS", "Merancang larian latihan, menala model dengan LoRA dan menghidangkannya di AWS")],
    ["13–15", "AI Capstone", s("BahasaGPT-mini: your own Malay language model, end to end", "BahasaGPT-mini: model bahasa Melayu anda sendiri, dari awal hingga akhir")]
  ]
};

Object.assign(C.ui.en, { modulesHead: "Modules", trackAIlong: "AI Engineer", duration: "Duration", topics: "Topics", stepThrough: "Step through", nextStep: "Next step", showAll: "Show all", again: "Start again",
  speed: "Animation speed", nodeHint: "Tip: select any box in the diagram to see what it connects to and which steps use it.", connected: "connects to", inSteps: "used in steps", onPage: "On this page",
  self: "Self-paced learning portal", menu: "Modules" });
Object.assign(C.ui.ms, { modulesHead: "Modul", trackAIlong: "Jurutera AI", duration: "Tempoh", topics: "Topik", stepThrough: "Ikut langkah", nextStep: "Langkah seterusnya", showAll: "Tunjuk semua", again: "Mula semula",
  speed: "Kelajuan animasi", nodeHint: "Tip: pilih mana-mana kotak dalam rajah untuk melihat sambungannya dan langkah yang menggunakannya.", connected: "bersambung ke", inSteps: "digunakan dalam langkah", onPage: "Dalam halaman ini",
  self: "Portal pembelajaran kendiri", menu: "Modul" });
})(window.COURSE);
