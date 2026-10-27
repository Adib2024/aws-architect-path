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
})(window.COURSE);
