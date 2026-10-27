/* Phase 0: Cloud from Zero. Every text field is bilingual: { en, ms }. */
(function (C) {
const P = [];
const Z = m => P.push(m);

/* ===================== 0.1 ===================== */
Z({
  id: "z1", phase: 0, title: { en: "What Is the Cloud?", ms: "Apa Itu Cloud?" }, hours: 1,
  services: ["Servers", "Data centres", "Pay-as-you-go"],
  summary: {
    en: "The cloud is simply other people's computers that you rent over the internet. Instead of buying and looking after your own machines, you use Amazon's and pay only for what you use, like an electricity bill.",
    ms: "Cloud sebenarnya hanyalah komputer milik orang lain yang anda sewa melalui internet. Daripada membeli dan menjaga mesin sendiri, anda guna mesin Amazon dan bayar ikut penggunaan sahaja, sama seperti bil elektrik."
  },
  simple: {
    analogy: {
      en: "Think of electricity. You don't build a power station at home. You plug into the wall and pay a monthly bill for what you used. The cloud does the same for computers: plug in through the internet, use as much as you need, pay for what you used.",
      ms: "Fikirkan tentang elektrik. Anda tidak bina stesen janakuasa di rumah. Anda cucuk palam ke soket dan bayar bil bulanan ikut penggunaan. Cloud buat perkara yang sama untuk komputer: sambung melalui internet, guna seberapa banyak yang perlu, bayar ikut apa yang digunakan."
    },
    why: {
      en: "Almost every app on your phone (banking, Grab, Netflix, Shopee) runs on a cloud. Knowing how it works opens up some of the most in-demand jobs in tech.",
      ms: "Hampir setiap aplikasi di telefon anda (perbankan, Grab, Netflix, Shopee) berjalan di cloud. Memahami cara ia berfungsi membuka peluang kepada antara kerjaya teknologi yang paling diperlukan."
    }
  },
  outcomes: [
    { en: "Explain what a server and a data centre are.", ms: "Terangkan apa itu server dan pusat data." },
    { en: "Describe the cloud in one sentence to a friend.", ms: "Huraikan cloud dalam satu ayat kepada kawan." },
    { en: "List three reasons companies move to the cloud.", ms: "Senaraikan tiga sebab syarikat berpindah ke cloud." },
    { en: "Tell the difference between IaaS, PaaS and SaaS.", ms: "Bezakan antara IaaS, PaaS dan SaaS." }
  ],
  concepts: [
    [{ en: "Server", ms: "Server (pelayan)" }, { en: "A computer whose job is to answer requests from other computers. It usually has no screen or keyboard and sits in a rack with hundreds of others.", ms: "Komputer yang tugasnya menjawab permintaan daripada komputer lain. Biasanya tiada skrin atau papan kekunci, dan disusun dalam rak bersama ratusan yang lain." }],
    [{ en: "Data centre", ms: "Pusat data" }, { en: "A secure building full of servers, with backup power, cooling and fast internet. AWS runs hundreds of them around the world.", ms: "Bangunan selamat yang penuh dengan server, lengkap dengan bekalan elektrik simpanan, penyejuk dan internet laju. AWS mengendalikan ratusan pusat data di seluruh dunia." }],
    [{ en: "Cloud computing", ms: "Pengkomputeran cloud" }, { en: "Renting computing power, storage and databases over the internet, ready in minutes, instead of buying hardware that takes weeks to arrive.", ms: "Menyewa kuasa pengkomputeran, storan dan pangkalan data melalui internet, siap dalam beberapa minit, berbanding membeli perkakasan yang mengambil masa berminggu-minggu." }],
    [{ en: "Pay-as-you-go", ms: "Bayar ikut guna" }, { en: "You're billed per second, hour or gigabyte. Switch something off and the charges stop. Forget to switch it off and they continue.", ms: "Anda dicaj setiap saat, jam atau gigabait. Matikan sesuatu dan caj berhenti. Terlupa matikan, caj berterusan." }],
    [{ en: "IaaS, PaaS, SaaS", ms: "IaaS, PaaS, SaaS" }, { en: "Like pizza. IaaS: you rent the kitchen and cook yourself (EC2). PaaS: you bring toppings, they bake (Lambda, Elastic Beanstalk). SaaS: pizza delivered ready to eat (Gmail, Canva).", ms: "Seperti piza. IaaS: anda sewa dapur dan masak sendiri (EC2). PaaS: anda bawa bahan, mereka bakar (Lambda, Elastic Beanstalk). SaaS: piza siap dihantar (Gmail, Canva)." }],
    [{ en: "Why companies move", ms: "Kenapa syarikat berpindah" }, { en: "Speed (minutes, not months), scale (handle 11.11 sale traffic), no upfront cost, and reach (launch in another country without building anything).", ms: "Kelajuan (minit, bukan bulan), skala (tampung trafik jualan 11.11), tiada kos permulaan, dan capaian (lancar di negara lain tanpa membina apa-apa)." }]
  ],
  diagram: {
    title: { en: "What happens when you open an app", ms: "Apa berlaku apabila anda buka aplikasi" },
    groups: [{ x: 360, y: 40, w: 410, h: 330, l: "AWS DATA CENTRE", k: "region" }],
    nodes: [
      { id: "phone", x: 80, y: 200, l: { en: "Your phone", ms: "Telefon anda" }, s: { en: "opens an app", ms: "buka aplikasi" }, k: "user" },
      { id: "net", x: 240, y: 200, l: "Internet", s: { en: "cables & Wi-Fi", ms: "kabel & Wi-Fi" }, k: "net" },
      { id: "s1", x: 470, y: 120, l: "Server", s: { en: "runs the app", ms: "jalankan aplikasi" }, k: "compute" },
      { id: "s2", x: 470, y: 290, l: { en: "Extra server", ms: "Server tambahan" }, s: { en: "added on busy days", ms: "ditambah waktu sibuk" }, k: "compute" },
      { id: "db", x: 670, y: 200, l: { en: "Storage", ms: "Storan" }, s: { en: "your data", ms: "data anda" }, k: "data" }
    ],
    steps: [
      { p: [["phone", "net"]], t: { en: "You tap an app. Your phone sends a small message (a **request**) out over Wi-Fi or mobile data.", ms: "Anda tekan sebuah aplikasi. Telefon anda menghantar mesej kecil (**permintaan**) melalui Wi-Fi atau data mudah alih." } },
      { p: [["net", "s1"]], t: { en: "The internet carries the request to a **data centre**, possibly in another country, in a fraction of a second.", ms: "Internet membawa permintaan itu ke **pusat data**, mungkin di negara lain, dalam sekelip mata." } },
      { p: [["s1", "db"]], t: { en: "A **server** runs the app's code and reads your data (balance, orders, photos) from storage.", ms: "Sebuah **server** menjalankan kod aplikasi dan membaca data anda (baki, pesanan, gambar) daripada storan." } },
      { p: [["s1", "net", "phone"]], t: { en: "The answer travels back and your screen updates. All of this usually takes less than half a second.", ms: "Jawapan dihantar balik dan skrin anda dikemas kini. Semua ini biasanya berlaku dalam masa kurang setengah saat." } },
      { p: [["s1", "s2"]], t: { en: "On a big sale day, millions of people tap at once. In the cloud, more servers can be switched on in minutes, then switched off afterwards so you stop paying.", ms: "Pada hari jualan besar, berjuta orang menekan serentak. Di cloud, lebih banyak server boleh dihidupkan dalam beberapa minit, kemudian dimatikan supaya anda berhenti membayar." } }
    ]
  },
  consoleLab: {
    title: { en: "Explore the cloud without an account", ms: "Terokai cloud tanpa akaun" },
    time: { en: "~30 min · free · no account needed", ms: "~30 min · percuma · tiada akaun diperlukan" },
    goal: { en: "Get a feel for how big the cloud is and what it costs, using only your web browser.", ms: "Rasai betapa besarnya cloud dan berapa kosnya, hanya menggunakan pelayar web anda." },
    steps: [
      { t: { en: "Open the AWS global infrastructure page (link in **Go deeper**). Find the Region nearest to you. How many Availability Zones does it have?", ms: "Buka halaman infrastruktur global AWS (pautan di **Teroka lebih lanjut**). Cari Region yang paling dekat dengan anda. Berapa banyak Availability Zone yang ada?" } },
      { t: { en: "Open the **AWS Pricing Calculator** (calculator.aws). Click **Create estimate**, search for **EC2**, and price one small server (for example `t4g.small`) running 24 hours a day in Asia Pacific (Singapore).", ms: "Buka **AWS Pricing Calculator** (calculator.aws). Klik **Create estimate**, cari **EC2**, dan kira harga satu server kecil (contohnya `t4g.small`) yang berjalan 24 jam sehari di Asia Pacific (Singapore)." } },
      { t: { en: "Now change it to run only 8 hours a day on weekdays. How much do you save? That is pay-as-you-go in action.", ms: "Sekarang ubah supaya ia berjalan hanya 8 jam sehari pada hari bekerja. Berapa banyak anda jimat? Itulah konsep bayar ikut guna." } },
      { t: { en: "Write down three apps you use daily. For each one, guess what would happen to a company running its own servers if traffic suddenly jumped 10 times.", ms: "Tulis tiga aplikasi yang anda guna setiap hari. Bagi setiap satu, teka apa yang akan berlaku kepada syarikat yang menggunakan server sendiri jika trafik tiba-tiba meningkat 10 kali ganda." } }
    ],
    cleanup: { t: { en: "Nothing to clean up. You didn't create anything.", ms: "Tiada apa perlu dibersihkan. Anda tidak mencipta apa-apa." } }
  },
  cost: [
    { en: "There is no upfront cost, but there is also no automatic \"off\" switch. Things you leave running keep billing.", ms: "Tiada kos permulaan, tetapi tiada juga suis \"tutup\" automatik. Apa yang anda biarkan berjalan akan terus dicaj." },
    { en: "New AWS accounts get free credits to learn with. You'll set a spending alert in lesson 0.3 before doing anything else.", ms: "Akaun AWS baharu mendapat kredit percuma untuk belajar. Anda akan tetapkan amaran perbelanjaan dalam pelajaran 0.3 sebelum membuat apa-apa." }
  ],
  security: [
    { en: "AWS guards the buildings, hardware and network. **You** are responsible for who can log in to your account and what you put in it.", ms: "AWS menjaga bangunan, perkakasan dan rangkaian. **Anda** bertanggungjawab atas siapa yang boleh log masuk ke akaun anda dan apa yang anda simpan di dalamnya." },
    { en: "\"In the cloud\" doesn't mean \"public\". Your data is private unless you make it public.", ms: "\"Di cloud\" tidak bermaksud \"awam\". Data anda kekal peribadi melainkan anda jadikan ia awam." }
  ],
  quiz: [
    { q: { en: "What is a server?", ms: "Apakah itu server?" },
      o: [{ en: "A website", ms: "Sebuah laman web" }, { en: "A computer that answers requests from other computers", ms: "Komputer yang menjawab permintaan daripada komputer lain" }, { en: "A type of Wi-Fi router", ms: "Sejenis penghala Wi-Fi" }, { en: "An app store", ms: "Kedai aplikasi" }], a: 1,
      why: { en: "Servers serve: they wait for requests and send back answers. Your laptop could be one; data centres hold thousands.", ms: "Server melayan: ia menunggu permintaan dan menghantar jawapan. Komputer riba anda pun boleh jadi server; pusat data menempatkan beribu-ribu." } },
    { q: { en: "An online shop expects 10× normal traffic for one weekend. What's the main cloud advantage?", ms: "Sebuah kedai dalam talian menjangka trafik 10 kali ganda untuk satu hujung minggu. Apakah kelebihan utama cloud?" },
      o: [{ en: "It's always free", ms: "Ia sentiasa percuma" }, { en: "Add servers for the weekend only, then remove them and stop paying", ms: "Tambah server untuk hujung minggu itu sahaja, kemudian buang dan berhenti membayar" }, { en: "It makes the website prettier", ms: "Ia menjadikan laman web lebih cantik" }, { en: "No internet is needed", ms: "Tidak perlukan internet" }], a: 1,
      why: { en: "Elastic capacity is the big win: no need to buy hardware for a peak that lasts two days.", ms: "Kapasiti anjal ialah kelebihan utama: tidak perlu beli perkakasan untuk puncak trafik yang hanya dua hari." } },
    { q: { en: "Gmail is an example of…", ms: "Gmail ialah contoh…" },
      o: ["IaaS", "PaaS", "SaaS", { en: "A data centre", ms: "Pusat data" }], a: 2,
      why: { en: "Software as a Service: a finished product you just use. In this course you'll mostly work with IaaS and PaaS building blocks.", ms: "Software as a Service: produk siap yang anda terus guna. Dalam kursus ini anda kebanyakannya akan bekerja dengan blok binaan IaaS dan PaaS." } }
  ],
  docs: [[{ en: "AWS global infrastructure map", ms: "Peta infrastruktur global AWS" }, "https://aws.amazon.com/about-aws/global-infrastructure/"], [{ en: "AWS Pricing Calculator", ms: "Kalkulator harga AWS" }, "https://calculator.aws/"], [{ en: "What is cloud computing?", ms: "Apa itu pengkomputeran cloud?" }, "https://aws.amazon.com/what-is-cloud-computing/"]],
  certs: { CLF: 2 }
});

/* ===================== 0.2 ===================== */
Z({
  id: "z2", phase: 0, title: { en: "How the Internet Works", ms: "Bagaimana Internet Berfungsi" }, hours: 2,
  services: ["IP address", "DNS", "HTTPS", "Ports"],
  summary: {
    en: "Before building in the cloud you need the basics of how computers find and talk to each other. It's like the postal system: addresses, a phonebook and sealed envelopes.",
    ms: "Sebelum membina di cloud, anda perlu tahu asas bagaimana komputer mencari dan berhubung antara satu sama lain. Ia seperti sistem pos: alamat, buku telefon dan sampul surat bermeterai."
  },
  simple: {
    analogy: {
      en: "The internet is a postal service for computers. Every computer has an **address** (IP address). Because numbers are hard to remember, **DNS** acts as the phonebook that turns `google.com` into that address. **HTTPS** is a sealed envelope: only the receiver can open it.",
      ms: "Internet ialah perkhidmatan pos untuk komputer. Setiap komputer ada **alamat** (alamat IP). Oleh sebab nombor sukar diingat, **DNS** bertindak sebagai buku telefon yang menukar `google.com` kepada alamat itu. **HTTPS** pula sampul surat bermeterai: hanya penerima boleh membukanya."
    },
    why: {
      en: "Nearly every AWS service (networks, load balancers, DNS, firewalls) is built on these ideas. Learn them once and the rest of the course makes sense.",
      ms: "Hampir setiap perkhidmatan AWS (rangkaian, pengimbang beban, DNS, tembok api) dibina atas idea ini. Fahami sekali, dan selebihnya kursus akan lebih mudah difahami."
    }
  },
  outcomes: [
    { en: "Explain client, server, IP address and DNS with an everyday analogy.", ms: "Terangkan klien, server, alamat IP dan DNS dengan analogi harian." },
    { en: "Describe what happens after you type a web address and press Enter.", ms: "Huraikan apa berlaku selepas anda taip alamat web dan tekan Enter." },
    { en: "Know why the padlock (HTTPS) matters.", ms: "Tahu kenapa ikon mangga (HTTPS) penting." },
    { en: "Read common status codes like 200, 404 and 500.", ms: "Baca kod status biasa seperti 200, 404 dan 500." }
  ],
  concepts: [
    [{ en: "Client & server", ms: "Klien & server" }, { en: "The client asks (your browser or app); the server answers. One server can answer millions of clients.", ms: "Klien bertanya (pelayar atau aplikasi anda); server menjawab. Satu server boleh menjawab berjuta klien." }],
    [{ en: "IP address", ms: "Alamat IP" }, { en: "A number that identifies a computer on a network, like `203.0.113.10`. Think of it as a house address.", ms: "Nombor yang mengenal pasti komputer dalam rangkaian, seperti `203.0.113.10`. Anggap ia sebagai alamat rumah." }],
    [{ en: "DNS", ms: "DNS" }, { en: "The internet's phonebook. It turns names like `example.com` into IP addresses. AWS's DNS service is called Route 53.", ms: "Buku telefon internet. Ia menukar nama seperti `example.com` kepada alamat IP. Perkhidmatan DNS AWS dipanggil Route 53." }],
    [{ en: "HTTP & HTTPS", ms: "HTTP & HTTPS" }, { en: "The language browsers and servers speak. The S in HTTPS means the conversation is encrypted, which is the padlock in your address bar.", ms: "Bahasa yang digunakan pelayar dan server. Huruf S dalam HTTPS bermaksud perbualan itu disulitkan, iaitu ikon mangga di bar alamat anda." }],
    [{ en: "Port", ms: "Port" }, { en: "If the IP address is a building, the port is the unit number. Websites use 443 (HTTPS) and 80 (HTTP).", ms: "Jika alamat IP ialah bangunan, port ialah nombor unit. Laman web guna 443 (HTTPS) dan 80 (HTTP)." }],
    [{ en: "Status codes", ms: "Kod status" }, { en: "The server's short reply: `200` OK, `301` moved, `403` not allowed, `404` not found, `500` the server broke.", ms: "Jawapan ringkas server: `200` OK, `301` telah berpindah, `403` tidak dibenarkan, `404` tidak dijumpai, `500` server rosak." }]
  ],
  diagram: {
    title: { en: "You type example.com and press Enter", ms: "Anda taip example.com dan tekan Enter" },
    nodes: [
      { id: "br", x: 80, y: 200, l: { en: "Your browser", ms: "Pelayar anda" }, s: "client", k: "user" },
      { id: "rt", x: 280, y: 320, l: { en: "Wi-Fi & ISP", ms: "Wi-Fi & ISP" }, s: { en: "your provider", ms: "penyedia anda" }, k: "net" },
      { id: "res", x: 280, y: 80, l: { en: "DNS resolver", ms: "Penyelesai DNS" }, s: { en: "the phonebook", ms: "buku telefon" }, k: "net" },
      { id: "ns", x: 520, y: 80, l: { en: "Name server", ms: "Pelayan nama" }, s: "e.g. Route 53", k: "net" },
      { id: "web", x: 640, y: 290, l: { en: "Web server", ms: "Pelayan web" }, s: "203.0.113.10:443", k: "compute" }
    ],
    steps: [
      { p: [["br", "res"]], t: { en: "Your browser doesn't know where `example.com` lives, so it asks a **DNS resolver** (usually run by your internet provider).", ms: "Pelayar anda tidak tahu di mana `example.com` berada, jadi ia bertanya kepada **penyelesai DNS** (biasanya dikendalikan oleh penyedia internet anda)." } },
      { p: [["res", "ns"]], t: { en: "The resolver asks the domain's **name server**, which holds the official records for that name.", ms: "Penyelesai bertanya kepada **pelayan nama** domain itu, yang menyimpan rekod rasmi bagi nama tersebut." } },
      { p: [["ns", "res", "br"]], t: { en: "The answer comes back: an IP address such as `203.0.113.10`. It's remembered for a while, so the next visit is faster.", ms: "Jawapan dihantar balik: alamat IP seperti `203.0.113.10`. Ia diingati buat sementara waktu, jadi lawatan seterusnya lebih pantas." } },
      { p: [["br", "rt", "web"]], t: { en: "The browser connects to that address on port 443 and sets up an encrypted **HTTPS** connection. That's the padlock.", ms: "Pelayar menyambung ke alamat itu pada port 443 dan membina sambungan **HTTPS** yang disulitkan. Itulah ikon mangga." } },
      { p: [["web", "rt", "br"]], t: { en: "The server replies `200 OK` with the page, and the browser draws it on your screen.", ms: "Server membalas `200 OK` beserta halaman itu, dan pelayar memaparkannya di skrin anda." } }
    ]
  },
  consoleLab: {
    title: { en: "Watch your browser talk to servers", ms: "Lihat pelayar anda berbual dengan server" },
    time: { en: "~30 min · free · Chrome, Edge or Firefox", ms: "~30 min · percuma · Chrome, Edge atau Firefox" },
    goal: { en: "See requests, status codes and certificates with tools already built into your browser.", ms: "Lihat permintaan, kod status dan sijil menggunakan alat yang sudah ada dalam pelayar anda." },
    steps: [
      { t: { en: "Open any news website. Press **F12** (on Mac: **Cmd + Option + I**) to open Developer Tools, then click the **Network** tab and refresh the page.", ms: "Buka mana-mana laman berita. Tekan **F12** (Mac: **Cmd + Option + I**) untuk membuka Developer Tools, kemudian klik tab **Network** dan muat semula halaman." } },
      { t: { en: "Count the requests. One page often makes 50–200 of them: images, scripts, fonts. Click one and find its **Status** (200?) and **Remote Address** (its IP and port).", ms: "Kira jumlah permintaan. Satu halaman selalunya membuat 50–200 permintaan: gambar, skrip, fon. Klik satu dan cari **Status** (200?) dan **Remote Address** (IP dan port)." } },
      { t: { en: "Type a page that doesn't exist, such as `example.com/nothing-here`. Which status code do you get?", ms: "Taip halaman yang tidak wujud, contohnya `example.com/nothing-here`. Apakah kod status yang anda dapat?" } },
      { t: { en: "Click the padlock (or settings icon) next to the address, then **Connection is secure → Certificate is valid**. Who issued it, and when does it expire?", ms: "Klik ikon mangga (atau ikon tetapan) di sebelah alamat, kemudian **Connection is secure → Certificate is valid**. Siapa yang mengeluarkannya, dan bila ia tamat tempoh?" } }
    ],
    cleanup: { t: { en: "Close Developer Tools. Nothing to delete.", ms: "Tutup Developer Tools. Tiada apa perlu dipadam." } }
  },
  lab: {
    title: "Ask DNS and servers from the command line", time: "~15 min · free · Windows, Mac or Linux",
    goal: "Open **Terminal** (Mac/Linux) or **PowerShell** (Windows) and type these one at a time. Lines starting with `#` are comments that explain the next command.",
    steps: [
      { t: "Ask DNS for the IP address of a name.", c: String.raw`# who is example.com? (works on Windows, Mac and Linux)
nslookup example.com` },
      { t: "Ask a server for just the response headers. Look for the status code on the first line. (Windows: use `curl.exe` in PowerShell.)", c: String.raw`curl -I https://example.com` },
      { t: "Try a page that doesn't exist and compare the status code.", c: String.raw`curl -I https://example.com/nothing-here` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    { en: "Sending data **out** of the cloud to the internet costs money per gigabyte. Receiving data is free. Remember this when you design apps that serve large files.", ms: "Menghantar data **keluar** dari cloud ke internet dikenakan caj setiap gigabait. Menerima data adalah percuma. Ingat ini apabila mereka aplikasi yang menghantar fail besar." },
    { en: "Domain names cost a small yearly fee (Route 53 or any registrar).", ms: "Nama domain dikenakan yuran tahunan yang kecil (Route 53 atau mana-mana pendaftar)." }
  ],
  security: [
    { en: "Always use HTTPS. Plain HTTP can be read by anyone on the same network, such as public café Wi-Fi.", ms: "Sentiasa gunakan HTTPS. HTTP biasa boleh dibaca oleh sesiapa dalam rangkaian yang sama, seperti Wi-Fi awam di kafe." },
    { en: "Only open the ports you need. Every open port is a door someone can knock on.", ms: "Buka hanya port yang diperlukan. Setiap port yang terbuka ialah pintu yang boleh diketuk orang." }
  ],
  quiz: [
    { q: { en: "What does DNS do?", ms: "Apakah fungsi DNS?" },
      o: [{ en: "Encrypts your traffic", ms: "Menyulitkan trafik anda" }, { en: "Turns names like example.com into IP addresses", ms: "Menukar nama seperti example.com kepada alamat IP" }, { en: "Stores your photos", ms: "Menyimpan gambar anda" }, { en: "Speeds up your Wi-Fi", ms: "Melajukan Wi-Fi anda" }], a: 1,
      why: { en: "DNS is the phonebook. Without it, you'd have to remember numbers for every website.", ms: "DNS ialah buku telefon. Tanpanya, anda perlu ingat nombor untuk setiap laman web." } },
    { q: { en: "A page shows error 404. What does it mean?", ms: "Satu halaman menunjukkan ralat 404. Apa maksudnya?" },
      o: [{ en: "The server crashed", ms: "Server rosak" }, { en: "The page wasn't found", ms: "Halaman tidak dijumpai" }, { en: "You're not logged in", ms: "Anda belum log masuk" }, { en: "Success", ms: "Berjaya" }], a: 1,
      why: { en: "4xx codes mean the request had a problem (404: no such page). 5xx codes mean the server had a problem.", ms: "Kod 4xx bermaksud ada masalah pada permintaan (404: halaman tiada). Kod 5xx bermaksud server yang bermasalah." } },
    { q: { en: "Why is HTTPS important on café Wi-Fi?", ms: "Kenapa HTTPS penting semasa guna Wi-Fi kafe?" },
      o: [{ en: "It's faster", ms: "Ia lebih laju" }, { en: "It encrypts the conversation so others on the network can't read it", ms: "Ia menyulitkan perbualan supaya orang lain dalam rangkaian tidak dapat membacanya" }, { en: "It blocks ads", ms: "Ia menyekat iklan" }, { en: "It hides your IP address", ms: "Ia menyembunyikan alamat IP anda" }], a: 1,
      why: { en: "HTTPS uses TLS encryption. People on the same network can see that you visited a site, but not your passwords or content.", ms: "HTTPS menggunakan penyulitan TLS. Orang dalam rangkaian yang sama boleh nampak anda melawat sesebuah laman, tetapi bukan kata laluan atau kandungan anda." } }
  ],
  docs: [[{ en: "What is DNS?", ms: "Apa itu DNS?" }, "https://aws.amazon.com/route53/what-is-dns/"], [{ en: "MDN: How the web works", ms: "MDN: Cara web berfungsi" }, "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works"]],
  certs: { CLF: 1 }
});

/* ===================== 0.3 ===================== */
Z({
  id: "z3", phase: 0, title: { en: "Your AWS Account, Safely", ms: "Akaun AWS Anda, Dengan Selamat" }, hours: 2,
  services: ["AWS Console", "MFA", "Budgets", "Regions"],
  summary: {
    en: "Create your AWS account and make it safe in the first 30 minutes: a second lock on the master login, a spending alert, and the right Region.",
    ms: "Cipta akaun AWS anda dan jadikan ia selamat dalam 30 minit pertama: kunci kedua pada log masuk utama, amaran perbelanjaan, dan Region yang betul."
  },
  simple: {
    analogy: {
      en: "Your AWS account is a house. The **root user** is the master key that opens every door, so you lock it in a safe and add a second lock (**MFA**: a code from your phone). A **budget alert** is like the SMS your bank sends when you spend too much.",
      ms: "Akaun AWS anda ialah sebuah rumah. **Root user** ialah kunci induk yang boleh membuka semua pintu, jadi anda simpan dalam peti besi dan tambah kunci kedua (**MFA**: kod dari telefon anda). **Amaran bajet** pula seperti SMS daripada bank apabila anda berbelanja terlalu banyak."
    },
    why: {
      en: "A stolen password or a forgotten server is how most beginners get an unexpected bill. These steps prevent both.",
      ms: "Kata laluan yang dicuri atau server yang terlupa dimatikan ialah punca kebanyakan pemula menerima bil yang tidak dijangka. Langkah ini mengelakkan kedua-duanya."
    }
  },
  outcomes: [
    { en: "Create an AWS account and sign in to the Console.", ms: "Cipta akaun AWS dan log masuk ke Console." },
    { en: "Protect the root user with MFA.", ms: "Lindungi root user dengan MFA." },
    { en: "Set a monthly budget alert.", ms: "Tetapkan amaran bajet bulanan." },
    { en: "Choose a Region and find any service with the search bar.", ms: "Pilih Region dan cari mana-mana perkhidmatan dengan bar carian." }
  ],
  concepts: [
    [{ en: "AWS account", ms: "Akaun AWS" }, { en: "Your space in AWS with its own resources and its own bill. Companies often have many accounts.", ms: "Ruang anda dalam AWS dengan sumber dan bil tersendiri. Syarikat selalunya mempunyai banyak akaun." }],
    [{ en: "AWS Management Console", ms: "AWS Management Console" }, { en: "The website (console.aws.amazon.com) where you click to create and manage everything.", ms: "Laman web (console.aws.amazon.com) tempat anda klik untuk mencipta dan mengurus segalanya." }],
    [{ en: "Root user", ms: "Root user" }, { en: "The email you signed up with. It can do absolutely anything, including closing the account. Use it rarely.", ms: "E-mel yang anda gunakan semasa mendaftar. Ia boleh melakukan apa sahaja, termasuk menutup akaun. Jarang-jarang gunakannya." }],
    [{ en: "MFA", ms: "MFA" }, { en: "Multi-factor authentication: password **plus** a code from an app (Google Authenticator, Microsoft Authenticator) or a passkey.", ms: "Pengesahan pelbagai faktor: kata laluan **ditambah** kod daripada aplikasi (Google Authenticator, Microsoft Authenticator) atau passkey." }],
    [{ en: "Region", ms: "Region" }, { en: "Where in the world your resources are created. Pick one near you, such as Asia Pacific (Singapore) or Asia Pacific (Malaysia).", ms: "Lokasi di dunia tempat sumber anda dicipta. Pilih yang berdekatan, seperti Asia Pacific (Singapore) atau Asia Pacific (Malaysia)." }],
    [{ en: "Budget & Free Tier", ms: "Bajet & Free Tier" }, { en: "New accounts get free credits. A budget emails you before spending gets out of hand. It warns you but doesn't stop anything.", ms: "Akaun baharu mendapat kredit percuma. Bajet akan menghantar e-mel sebelum perbelanjaan melampau. Ia memberi amaran tetapi tidak menghentikan apa-apa." }]
  ],
  diagram: {
    title: { en: "Signing in safely and staying in control", ms: "Log masuk dengan selamat dan kekal terkawal" },
    nodes: [
      { id: "you", x: 80, y: 200, l: { en: "You", ms: "Anda" }, s: { en: "email + password", ms: "e-mel + kata laluan" }, k: "user" },
      { id: "mfa", x: 250, y: 80, l: { en: "Authenticator app", ms: "Aplikasi pengesah" }, s: { en: "6-digit code", ms: "kod 6 digit" }, k: "sec" },
      { id: "login", x: 250, y: 200, l: { en: "Sign-in page", ms: "Halaman log masuk" }, s: "MFA check", k: "sec" },
      { id: "con", x: 440, y: 200, l: "AWS Console", s: { en: "your account", ms: "akaun anda" }, k: "ops" },
      { id: "reg", x: 650, y: 90, l: "Region", s: "Asia Pacific", k: "net" },
      { id: "svc", x: 650, y: 210, l: { en: "Services", ms: "Perkhidmatan" }, s: "S3, EC2, Lambda…", k: "compute" },
      { id: "bud", x: 440, y: 330, l: { en: "Budget", ms: "Bajet" }, s: "US$20 / month", k: "ops" },
      { id: "mail", x: 650, y: 330, l: { en: "Your email", ms: "E-mel anda" }, s: { en: "alert at 80%", ms: "amaran pada 80%" }, k: "user" }
    ],
    steps: [
      { p: [["you", "login"], ["mfa", "login"]], t: { en: "You sign in with your password **and** a fresh code from your phone. A stolen password alone is useless.", ms: "Anda log masuk dengan kata laluan **dan** kod baharu dari telefon anda. Kata laluan yang dicuri sahaja tidak berguna." } },
      { p: [["login", "con"]], t: { en: "You land in the AWS Console, your control panel for everything.", ms: "Anda masuk ke AWS Console, panel kawalan untuk segalanya." } },
      { p: [["con", "reg"]], t: { en: "Top-right corner: choose your **Region**. What you create appears in that Region only, so if something seems to be missing, check the Region first.", ms: "Penjuru kanan atas: pilih **Region** anda. Apa yang anda cipta hanya muncul di Region itu, jadi jika sesuatu kelihatan hilang, semak Region dahulu." } },
      { p: [["con", "svc"]], t: { en: "Use the search bar at the top to open any of 200+ services.", ms: "Gunakan bar carian di bahagian atas untuk membuka mana-mana daripada 200+ perkhidmatan." } },
      { p: [["con", "bud", "mail"]], t: { en: "A **budget** watches your spending and emails you at 80% of the limit, so there are no surprise bills.", ms: "**Bajet** memantau perbelanjaan anda dan menghantar e-mel apabila mencecah 80% had, jadi tiada bil mengejut." } }
    ]
  },
  consoleLab: {
    title: { en: "Create and lock down your account", ms: "Cipta dan kunci akaun anda" },
    time: { en: "~45 min · free · needs a debit/credit card", ms: "~45 min · percuma · perlukan kad debit/kredit" },
    goal: { en: "Finish with an account that has MFA, a budget alert and your Region selected. Have your phone ready.", ms: "Akhiri dengan akaun yang mempunyai MFA, amaran bajet dan Region yang dipilih. Sediakan telefon anda." },
    steps: [
      { t: { en: "Go to **aws.amazon.com** → **Create an AWS Account**. Use an email you check often. AWS verifies your card with a small temporary charge and verifies your phone number.", ms: "Pergi ke **aws.amazon.com** → **Create an AWS Account**. Gunakan e-mel yang kerap anda semak. AWS mengesahkan kad anda dengan caj sementara yang kecil dan mengesahkan nombor telefon anda." } },
      { t: { en: "Sign in as root. Click your account name (top right) → **Security credentials** → **Assign MFA device**. Choose **Authenticator app** or **Passkey**, then scan the QR code with your phone.", ms: "Log masuk sebagai root. Klik nama akaun anda (kanan atas) → **Security credentials** → **Assign MFA device**. Pilih **Authenticator app** atau **Passkey**, kemudian imbas kod QR dengan telefon anda." } },
      { t: { en: "In the search bar type **Budgets** → **Create budget** → **Use a template** → **Monthly cost budget**. Set US$20 and your email, then **Create budget**.", ms: "Dalam bar carian taip **Budgets** → **Create budget** → **Use a template** → **Monthly cost budget**. Tetapkan US$20 dan e-mel anda, kemudian **Create budget**." } },
      { t: { en: "Top right, open the Region menu and choose **Asia Pacific (Singapore)** or the Region nearest you. Use the same Region for every lab.", ms: "Di kanan atas, buka menu Region dan pilih **Asia Pacific (Singapore)** atau Region yang paling dekat. Gunakan Region yang sama untuk setiap makmal." } },
      { t: { en: "Search **IAM Identity Center** → **Enable**. Create a user for yourself with the **AdministratorAccess** permission set, and from now on sign in with that user, not root. (Module 01 explains why in detail.)", ms: "Cari **IAM Identity Center** → **Enable**. Cipta pengguna untuk diri anda dengan permission set **AdministratorAccess**, dan mulai sekarang log masuk dengan pengguna itu, bukan root. (Modul 01 menerangkan sebabnya dengan terperinci.)" } },
      { t: { en: "Open **Billing and Cost Management → Free Tier** and note how many credits you have and when they expire.", ms: "Buka **Billing and Cost Management → Free Tier** dan catat berapa banyak kredit yang anda ada dan bila ia tamat." } }
    ],
    cleanup: { t: { en: "Keep everything. This safe setup is the base for the whole course.", ms: "Simpan semuanya. Persediaan selamat ini ialah asas untuk keseluruhan kursus." } }
  },
  cost: [
    { en: "A budget **alerts** but doesn't **stop** spending. You still need to delete what you create after each lab.", ms: "Bajet **memberi amaran** tetapi tidak **menghentikan** perbelanjaan. Anda masih perlu memadam apa yang anda cipta selepas setiap makmal." },
    { en: "Check **Billing → Bills** weekly while learning. It takes a minute and catches mistakes early.", ms: "Semak **Billing → Bills** setiap minggu semasa belajar. Ia hanya ambil seminit dan dapat mengesan kesilapan awal." }
  ],
  security: [
    { en: "Root has MFA and is used almost never. Daily work happens as an Identity Center user.", ms: "Root mempunyai MFA dan hampir tidak pernah digunakan. Kerja harian dibuat sebagai pengguna Identity Center." },
    { en: "Never share your password or create \"access keys\" for root. If AWS emails you about suspicious activity, act on it immediately.", ms: "Jangan sesekali kongsi kata laluan atau cipta \"access keys\" untuk root. Jika AWS menghantar e-mel tentang aktiviti mencurigakan, ambil tindakan segera." }
  ],
  quiz: [
    { q: { en: "Why add MFA to the root user?", ms: "Kenapa perlu tambah MFA pada root user?" },
      o: [{ en: "It makes the console faster", ms: "Ia menjadikan console lebih laju" }, { en: "A stolen password alone can't be used to sign in", ms: "Kata laluan yang dicuri sahaja tidak boleh digunakan untuk log masuk" }, { en: "It's needed for the Free Tier", ms: "Ia diperlukan untuk Free Tier" }, { en: "It lowers your bill", ms: "Ia mengurangkan bil anda" }], a: 1,
      why: { en: "MFA needs something you know (password) and something you have (phone). Attackers rarely have both.", ms: "MFA memerlukan sesuatu yang anda tahu (kata laluan) dan sesuatu yang anda miliki (telefon). Penyerang jarang ada kedua-duanya." } },
    { q: { en: "You created a server yesterday but today you can't see it in the console. What should you check first?", ms: "Anda cipta server semalam tetapi hari ini anda tidak nampak di console. Apa yang perlu disemak dahulu?" },
      o: [{ en: "Whether AWS deleted it", ms: "Sama ada AWS telah memadamnya" }, { en: "The Region selector in the top right", ms: "Pemilih Region di kanan atas" }, { en: "Your internet speed", ms: "Kelajuan internet anda" }, { en: "The Free Tier page", ms: "Halaman Free Tier" }], a: 1,
      why: { en: "Most resources belong to one Region. Switching Regions is the number one cause of \"it disappeared\".", ms: "Kebanyakan sumber milik satu Region. Bertukar Region ialah punca utama \"ia hilang\"." } },
    { q: { en: "What does an AWS Budget do when you reach the limit?", ms: "Apakah yang dilakukan AWS Budget apabila anda mencapai had?" },
      o: [{ en: "Deletes your resources", ms: "Memadam sumber anda" }, { en: "Sends you an alert (it doesn't stop anything by default)", ms: "Menghantar amaran (ia tidak menghentikan apa-apa secara lalai)" }, { en: "Closes your account", ms: "Menutup akaun anda" }, { en: "Moves you to the Free Tier", ms: "Memindahkan anda ke Free Tier" }], a: 1,
      why: { en: "Budgets warn you. Cleaning up after labs is still your job.", ms: "Bajet memberi amaran. Membersihkan selepas makmal masih tanggungjawab anda." } }
  ],
  docs: [[{ en: "Create an AWS account", ms: "Cipta akaun AWS" }, "https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html"], [{ en: "Free Tier", ms: "Free Tier" }, "https://aws.amazon.com/free/"]],
  certs: { CLF: 2 }
});

/* ===================== 0.4 ===================== */
Z({
  id: "z4", phase: 0, title: { en: "Your First Website on AWS", ms: "Laman Web Pertama Anda di AWS" }, hours: 2,
  services: ["S3", "Static website hosting"],
  summary: {
    en: "Put a real web page on the internet in under an hour, by clicking only. You'll use Amazon S3, the storage service that half the internet quietly depends on.",
    ms: "Letakkan halaman web sebenar di internet dalam masa kurang sejam, hanya dengan klik. Anda akan menggunakan Amazon S3, perkhidmatan storan yang menjadi tulang belakang sebahagian besar internet."
  },
  simple: {
    analogy: {
      en: "S3 is an endless online warehouse. A **bucket** is your labelled storage room in it, and every file you put inside is an **object**. Turning on website hosting is like putting your room's window on the street so passers-by can read the poster inside.",
      ms: "S3 ialah gudang dalam talian yang tiada hujung. **Bucket** ialah bilik simpanan berlabel milik anda di dalamnya, dan setiap fail yang anda simpan ialah **objek**. Menghidupkan hos laman web seperti membuka tingkap bilik anda ke jalan supaya orang lalu-lalang boleh membaca poster di dalamnya."
    },
    why: {
      en: "It's the quickest way to see the cloud working for you, and S3 shows up in almost every architecture you'll build later.",
      ms: "Ini cara paling cepat untuk melihat cloud berfungsi untuk anda, dan S3 muncul dalam hampir setiap seni bina yang akan anda bina kemudian."
    }
  },
  outcomes: [
    { en: "Create an S3 bucket and upload files.", ms: "Cipta bucket S3 dan muat naik fail." },
    { en: "Host a static website and open it from your phone.", ms: "Hos laman web statik dan bukanya dari telefon anda." },
    { en: "Explain static vs dynamic websites.", ms: "Terangkan beza laman web statik dan dinamik." },
    { en: "Know why public buckets are risky and how real sites avoid them.", ms: "Tahu kenapa bucket awam berisiko dan bagaimana laman sebenar mengelakkannya." }
  ],
  concepts: [
    [{ en: "Static website", ms: "Laman web statik" }, { en: "The same files for every visitor (HTML, pictures, CSS), like a printed brochure. Portfolios, landing pages and docs are often static.", ms: "Fail yang sama untuk setiap pelawat (HTML, gambar, CSS), seperti risalah bercetak. Portfolio, halaman pendaratan dan dokumentasi selalunya statik." }],
    [{ en: "Dynamic website", ms: "Laman web dinamik" }, { en: "Pages built per visitor (your cart, your feed). Needs servers or functions and a database. You'll build these from module 04.", ms: "Halaman dibina untuk setiap pelawat (troli anda, suapan anda). Memerlukan server atau fungsi dan pangkalan data. Anda akan membinanya bermula modul 04." }],
    [{ en: "Bucket", ms: "Bucket" }, { en: "A container for files in S3. Its name must be unique across all of AWS worldwide.", ms: "Bekas untuk fail dalam S3. Namanya mesti unik di seluruh AWS di dunia." }],
    [{ en: "Object", ms: "Objek" }, { en: "A file plus its information (size, type, date). Found by its key, like `images/logo.png`.", ms: "Fail berserta maklumatnya (saiz, jenis, tarikh). Dicari menggunakan kunci, seperti `images/logo.png`." }],
    [{ en: "HTML", ms: "HTML" }, { en: "The text language web pages are written in. `<h1>` is a big heading, `<p>` is a paragraph.", ms: "Bahasa teks untuk menulis halaman web. `<h1>` ialah tajuk besar, `<p>` ialah perenggan." }],
    [{ en: "Block Public Access", ms: "Block Public Access" }, { en: "A safety switch that's on by default. You'll turn it off for this one demo bucket only, then learn the proper way in module 11.", ms: "Suis keselamatan yang dihidupkan secara lalai. Anda akan mematikannya untuk bucket demo ini sahaja, kemudian belajar cara yang betul dalam modul 11." }]
  ],
  diagram: {
    title: { en: "From your laptop to the world", ms: "Dari komputer riba anda ke seluruh dunia" },
    nodes: [
      { id: "lap", x: 80, y: 100, l: { en: "Your laptop", ms: "Komputer riba anda" }, s: "index.html", k: "user" },
      { id: "s3", x: 390, y: 200, l: "S3 bucket", s: "my-first-site-…", k: "data" },
      { id: "vis", x: 80, y: 310, l: { en: "Visitor's phone", ms: "Telefon pelawat" }, s: { en: "anywhere", ms: "di mana-mana" }, k: "user" },
      { id: "cf", x: 660, y: 200, l: "CloudFront", s: { en: "module 11: HTTPS", ms: "modul 11: HTTPS" }, k: "edge" }
    ],
    steps: [
      { p: [["lap", "s3"]], t: { en: "You upload `index.html` into your bucket from the browser. It's now stored across several data centres.", ms: "Anda muat naik `index.html` ke dalam bucket anda melalui pelayar. Kini ia disimpan di beberapa pusat data." } },
      { p: [["vis", "s3"]], t: { en: "With website hosting on, the bucket gets a web address. Anyone who opens it receives your page.", ms: "Dengan hos laman web dihidupkan, bucket mendapat alamat web. Sesiapa yang membukanya akan menerima halaman anda." } },
      { p: [["vis", "cf", "s3"]], t: { en: "The professional version (module 11): CloudFront sits in front, adds HTTPS and speed, and the bucket goes back to private.", ms: "Versi profesional (modul 11): CloudFront diletakkan di hadapan, menambah HTTPS dan kelajuan, dan bucket kembali menjadi peribadi." } }
    ]
  },
  consoleLab: {
    title: { en: "Publish a page by clicking", ms: "Terbitkan halaman dengan klik" },
    time: { en: "~40 min · a few cents at most", ms: "~40 min · paling banyak beberapa sen" },
    goal: { en: "Your page live on the internet, opened on your phone, and then deleted.", ms: "Halaman anda di internet, dibuka di telefon anda, dan kemudian dipadam." },
    steps: [
      { t: { en: "On your computer, create a file named `index.html` with Notepad (Windows) or TextEdit in plain-text mode (Mac), paste this, change the name, and save.", ms: "Di komputer anda, cipta fail bernama `index.html` menggunakan Notepad (Windows) atau TextEdit dalam mod teks biasa (Mac), tampal ini, tukar nama, dan simpan." },
        c: String.raw`<!doctype html>
<html>
  <head><meta charset="utf-8"><title>My first cloud page</title></head>
  <body style="font-family:sans-serif;max-width:600px;margin:40px auto">
    <h1>Hello from the cloud!</h1>
    <p>This page is hosted on Amazon S3 by YOUR NAME.</p>
  </body>
</html>`, lang: "html" },
      { t: { en: "Console → search **S3** → **Create bucket**. Name it `my-first-site-` plus something unique (like your name and today's date). Keep your usual Region.", ms: "Console → cari **S3** → **Create bucket**. Namakan `my-first-site-` ditambah sesuatu yang unik (seperti nama anda dan tarikh hari ini). Kekalkan Region biasa anda." } },
      { t: { en: "On the same page, under **Block Public Access settings**, untick **Block all public access** and tick the warning acknowledgement. Only do this for demo content! Then **Create bucket**.", ms: "Di halaman yang sama, di bawah **Block Public Access settings**, nyahtanda **Block all public access** dan tandakan pengakuan amaran. Lakukan ini hanya untuk kandungan demo! Kemudian **Create bucket**." } },
      { t: { en: "Open the bucket → **Upload** → add `index.html` → **Upload**.", ms: "Buka bucket → **Upload** → tambah `index.html` → **Upload**." } },
      { t: { en: "**Properties** tab → scroll to **Static website hosting** → **Edit** → **Enable**, index document `index.html` → **Save**.", ms: "Tab **Properties** → tatal ke **Static website hosting** → **Edit** → **Enable**, index document `index.html` → **Save**." } },
      { t: { en: "**Permissions** tab → **Bucket policy** → **Edit**, paste this and replace `YOUR-BUCKET-NAME`. It allows anyone to **read** (not change) files.", ms: "Tab **Permissions** → **Bucket policy** → **Edit**, tampal ini dan gantikan `YOUR-BUCKET-NAME`. Ia membenarkan sesiapa **membaca** (bukan mengubah) fail." },
        c: String.raw`{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadForDemo",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
  }]
}`, lang: "json" },
      { t: { en: "Back on **Properties**, copy the **Bucket website endpoint** link at the bottom. Open it on your phone. You're live! 🎉", ms: "Kembali ke **Properties**, salin pautan **Bucket website endpoint** di bahagian bawah. Buka di telefon anda. Laman anda sudah di internet! 🎉" } }
    ],
    cleanup: { t: { en: "Select the bucket → **Empty** → type the confirmation → then **Delete** the bucket. Public buckets shouldn't be left lying around.", ms: "Pilih bucket → **Empty** → taip pengesahan → kemudian **Delete** bucket. Bucket awam tidak patut dibiarkan begitu sahaja." } }
  },
  lab: {
    title: "The same website from CloudShell", time: "~15 min · a few cents",
    goal: "Do lesson 0.5 first if commands are new to you. Open **CloudShell** (the `>_` icon at the top of the console) and run these.",
    steps: [
      { t: "Create the bucket and page. `$RANDOM` adds a random number so the name is unique.", c: String.raw`BUCKET=my-first-site-$RANDOM
aws s3 mb s3://$BUCKET
echo '<h1>Hello from the cloud!</h1>' > index.html
aws s3 cp index.html s3://$BUCKET/` },
      { t: "Allow public reading for this demo bucket only, then turn on website hosting.", c: String.raw`aws s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false
aws s3api put-bucket-policy --bucket $BUCKET --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}"
aws s3 website s3://$BUCKET --index-document index.html
# older Regions (like Singapore) use a dash, newer ones a dot. Try the first; if it fails, the second.
echo "http://$BUCKET.s3-website-$AWS_REGION.amazonaws.com"
echo "http://$BUCKET.s3-website.$AWS_REGION.amazonaws.com"` }
    ],
    cleanup: { t: "Delete the bucket and everything in it.", c: String.raw`aws s3 rb s3://$BUCKET --force` }
  },
  cost: [
    { en: "A tiny site costs a few cents a month or less. Charges are per GB stored, per request and per GB sent out.", ms: "Laman kecil berharga beberapa sen sebulan atau kurang. Caj dikira setiap GB disimpan, setiap permintaan dan setiap GB dihantar keluar." },
    { en: "If a public file goes viral, transfer costs grow with it. That's another reason to use CloudFront (module 11).", ms: "Jika fail awam menjadi tular, kos pemindahan turut meningkat. Itu satu lagi sebab untuk menggunakan CloudFront (modul 11)." }
  ],
  security: [
    { en: "Never put private files in a public bucket. Many real data leaks happened exactly this way.", ms: "Jangan sesekali letak fail peribadi dalam bucket awam. Banyak kebocoran data sebenar berlaku dengan cara ini." },
    { en: "The bucket website endpoint is HTTP only. Real sites use CloudFront for HTTPS and keep the bucket private.", ms: "Endpoint laman web bucket hanya HTTP. Laman sebenar menggunakan CloudFront untuk HTTPS dan mengekalkan bucket sebagai peribadi." }
  ],
  quiz: [
    { q: { en: "Which website could be hosted on S3 alone?", ms: "Laman web manakah boleh dihos di S3 sahaja?" },
      o: [{ en: "A personal portfolio page", ms: "Halaman portfolio peribadi" }, { en: "Online banking", ms: "Perbankan dalam talian" }, { en: "A shopping cart with logins", ms: "Troli beli-belah dengan log masuk" }, { en: "A chat app", ms: "Aplikasi sembang" }], a: 0,
      why: { en: "S3 serves files as they are. Anything that changes per user needs code running somewhere (servers, Lambda) and a database.", ms: "S3 menghidangkan fail seadanya. Apa-apa yang berubah ikut pengguna memerlukan kod yang berjalan (server, Lambda) dan pangkalan data." } },
    { q: { en: "Why was Block Public Access on by default?", ms: "Kenapa Block Public Access dihidupkan secara lalai?" },
      o: [{ en: "To save money", ms: "Untuk jimat wang" }, { en: "To stop people accidentally exposing private files", ms: "Untuk mengelakkan orang terdedahkan fail peribadi secara tidak sengaja" }, { en: "Because S3 can't host websites", ms: "Kerana S3 tidak boleh hos laman web" }, { en: "To make uploads faster", ms: "Untuk mempercepatkan muat naik" }], a: 1,
      why: { en: "Accidentally public buckets were a common cause of data leaks, so AWS made private the default.", ms: "Bucket yang terdedah secara tidak sengaja ialah punca biasa kebocoran data, jadi AWS menjadikan peribadi sebagai tetapan lalai." } },
    { q: { en: "Two people both try to create a bucket called `photos`. What happens?", ms: "Dua orang cuba mencipta bucket bernama `photos`. Apa yang berlaku?" },
      o: [{ en: "Both succeed", ms: "Kedua-duanya berjaya" }, { en: "Only one can have it; bucket names are unique across all of AWS", ms: "Hanya seorang boleh memilikinya; nama bucket unik di seluruh AWS" }, { en: "They share it", ms: "Mereka berkongsi" }, { en: "AWS renames both", ms: "AWS menamakan semula kedua-duanya" }], a: 1,
      why: { en: "Bucket names are global, which is why you add something unique like your name or account number.", ms: "Nama bucket adalah global, sebab itu anda tambah sesuatu yang unik seperti nama atau nombor akaun anda." } }
  ],
  docs: [[{ en: "Hosting a static website on S3", ms: "Hos laman web statik di S3" }, "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"], [{ en: "MDN: HTML basics", ms: "MDN: Asas HTML" }, "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content"]],
  certs: { CLF: 1 }
});

/* ===================== 0.5 ===================== */
Z({
  id: "z5", phase: 0, title: { en: "The Command Line & CloudShell", ms: "Baris Arahan & CloudShell" }, hours: 3,
  services: ["CloudShell", "AWS CLI", "JSON"],
  summary: {
    en: "Professionals mostly control AWS by typing commands, not clicking. CloudShell gives you a ready-made terminal inside your browser, so there's nothing to install. This lesson gets you comfortable with it.",
    ms: "Profesional kebanyakannya mengawal AWS dengan menaip arahan, bukan klik. CloudShell memberi anda terminal siap sedia dalam pelayar, jadi tiada apa perlu dipasang. Pelajaran ini akan membiasakan anda dengannya."
  },
  simple: {
    analogy: {
      en: "The Console is ordering food by pointing at pictures on the menu. The command line is telling the waiter exactly what you want in one sentence. It's faster, and you can write the sentence down and reuse it (that's a **script**).",
      ms: "Console seperti memesan makanan dengan menunjuk gambar di menu. Baris arahan pula seperti memberitahu pelayan dengan tepat apa yang anda mahu dalam satu ayat. Ia lebih pantas, dan anda boleh tulis ayat itu untuk diguna semula (itulah **skrip**)."
    },
    why: {
      en: "From module 01 on, the main labs use commands. Clicking is fine for learning, but commands can be repeated, shared and automated.",
      ms: "Mulai modul 01, makmal utama menggunakan arahan. Klik sesuai untuk belajar, tetapi arahan boleh diulang, dikongsi dan diautomasikan."
    }
  },
  outcomes: [
    { en: "Open CloudShell and run AWS CLI commands.", ms: "Buka CloudShell dan jalankan arahan AWS CLI." },
    { en: "Read a command: program, sub-command, options and values.", ms: "Baca sesuatu arahan: program, sub-arahan, pilihan dan nilai." },
    { en: "Use variables and copy-paste lab commands safely.", ms: "Guna pemboleh ubah dan salin-tampal arahan makmal dengan selamat." },
    { en: "Read JSON output and turn it into a table.", ms: "Baca output JSON dan tukarkannya kepada jadual." }
  ],
  concepts: [
    [{ en: "Terminal", ms: "Terminal" }, { en: "A text window where you type commands and see results. Also called the command line or shell.", ms: "Tetingkap teks tempat anda menaip arahan dan melihat hasil. Juga dipanggil baris arahan atau shell." }],
    [{ en: "CloudShell", ms: "CloudShell" }, { en: "A free terminal in the AWS Console (the `>_` icon). It's already signed in as you and has the AWS CLI installed.", ms: "Terminal percuma dalam AWS Console (ikon `>_`). Ia sudah log masuk sebagai anda dan AWS CLI sudah dipasang." }],
    [{ en: "AWS CLI", ms: "AWS CLI" }, { en: "The `aws` program. Every command reads like a sentence: `aws <service> <action> --option value`, for example `aws s3 ls`.", ms: "Program `aws`. Setiap arahan dibaca seperti ayat: `aws <perkhidmatan> <tindakan> --pilihan nilai`, contohnya `aws s3 ls`." }],
    [{ en: "Variable", ms: "Pemboleh ubah" }, { en: "A name that stores a value: `BUCKET=my-bucket`, then use it as `$BUCKET`. Labs use these so you only type IDs once.", ms: "Nama yang menyimpan nilai: `BUCKET=my-bucket`, kemudian gunakan sebagai `$BUCKET`. Makmal menggunakannya supaya anda taip ID sekali sahaja." }],
    [{ en: "JSON", ms: "JSON" }, { en: "The text format AWS answers in: `{\"Name\": \"value\"}`. Curly braces hold named fields; square brackets hold lists.", ms: "Format teks yang digunakan AWS untuk menjawab: `{\"Name\": \"value\"}`. Kurungan kerinting menyimpan medan bernama; kurungan siku menyimpan senarai." }],
    [{ en: "Line continuation", ms: "Sambungan baris" }, { en: "A `\\` at the end of a line means \"this command continues on the next line\". Copy the whole block, not just one line.", ms: "Simbol `\\` di hujung baris bermaksud \"arahan ini bersambung di baris seterusnya\". Salin keseluruhan blok, bukan satu baris sahaja." }]
  ],
  diagram: {
    title: { en: "What happens when you type a command", ms: "Apa berlaku apabila anda menaip arahan" },
    nodes: [
      { id: "you", x: 80, y: 200, l: { en: "You type", ms: "Anda taip" }, s: "aws s3 ls", k: "user" },
      { id: "sh", x: 240, y: 200, l: "CloudShell", s: { en: "browser terminal", ms: "terminal pelayar" }, k: "ops" },
      { id: "cli", x: 400, y: 200, l: "AWS CLI", s: { en: "signs the request", ms: "tandatangan permintaan" }, k: "ops" },
      { id: "api", x: 560, y: 200, l: "AWS API", s: { en: "checks permissions", ms: "semak kebenaran" }, k: "sec" },
      { id: "s3", x: 700, y: 100, l: "S3", k: "data" },
      { id: "ec2", x: 700, y: 300, l: "EC2", k: "compute" }
    ],
    steps: [
      { p: [["you", "sh", "cli"]], t: { en: "You type a command in CloudShell. The `aws` program reads it: service `s3`, action `ls` (list).", ms: "Anda menaip arahan dalam CloudShell. Program `aws` membacanya: perkhidmatan `s3`, tindakan `ls` (senarai)." } },
      { p: [["cli", "api"]], t: { en: "The CLI turns it into a signed web request. The **same API** the Console uses behind its buttons.", ms: "CLI menukarnya kepada permintaan web yang ditandatangani. Ia **API yang sama** yang digunakan Console di sebalik butangnya." } },
      { p: [["api", "s3"]], t: { en: "AWS checks you're allowed (IAM), then asks the service.", ms: "AWS menyemak sama ada anda dibenarkan (IAM), kemudian bertanya kepada perkhidmatan itu." } },
      { p: [["s3", "api", "cli", "sh"]], t: { en: "The answer comes back as JSON text, which you can filter or turn into a neat table.", ms: "Jawapan dihantar balik sebagai teks JSON, yang boleh anda tapis atau jadikan jadual yang kemas." } }
    ]
  },
  consoleLab: {
    title: { en: "Open CloudShell and get comfortable", ms: "Buka CloudShell dan biasakan diri" },
    time: { en: "~15 min · free", ms: "~15 min · percuma" },
    goal: { en: "Find CloudShell and learn the copy-paste habits that make every later lab easier.", ms: "Cari CloudShell dan belajar tabiat salin-tampal yang memudahkan setiap makmal selepas ini." },
    steps: [
      { t: { en: "Sign in to the Console with your Identity Center user. Click the `>_` icon in the top bar. A terminal opens at the bottom of the page (the first start takes about a minute).", ms: "Log masuk ke Console dengan pengguna Identity Center anda. Klik ikon `>_` di bar atas. Terminal akan terbuka di bahagian bawah halaman (permulaan pertama mengambil masa kira-kira seminit)." } },
      { t: { en: "Use the **Copy** button on any code block in this course, then paste in CloudShell with **Ctrl+Shift+V** (Windows) or **Cmd+V** (Mac), and press **Enter**.", ms: "Gunakan butang **Copy** pada mana-mana blok kod dalam kursus ini, kemudian tampal dalam CloudShell dengan **Ctrl+Shift+V** (Windows) atau **Cmd+V** (Mac), dan tekan **Enter**." } },
      { t: { en: "If a command shows `<something>` in angle brackets, replace the whole thing, brackets included, with your own value before pressing Enter.", ms: "Jika arahan menunjukkan `<sesuatu>` dalam kurungan sudut, gantikan keseluruhannya, termasuk kurungan, dengan nilai anda sendiri sebelum menekan Enter." } },
      { t: { en: "If you get stuck in a running command, press **Ctrl+C** to stop it. If you see an error, read the last line: it usually says exactly what's wrong.", ms: "Jika anda tersekat dalam arahan yang sedang berjalan, tekan **Ctrl+C** untuk menghentikannya. Jika ada ralat, baca baris terakhir: ia biasanya menyatakan dengan tepat apa yang salah." } },
      { t: { en: "Switch to the **Command line** tab above and run your first commands.", ms: "Tukar ke tab **Baris arahan** di atas dan jalankan arahan pertama anda." } }
    ],
    cleanup: { t: { en: "Nothing to delete.", ms: "Tiada apa perlu dipadam." } }
  },
  lab: {
    title: "Your first AWS CLI commands", time: "~30 min · free",
    goal: "Type or paste each block into CloudShell and look at the result before moving on. Read the `#` comments: they explain each line.",
    steps: [
      { t: "Who am I? This shows your account number and user. If it works, you're connected.", c: String.raw`# aws <service> <action>
aws sts get-caller-identity` },
      { t: "Save values in variables so you don't retype them. `echo` prints a value.", c: String.raw`ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "My account is $ACCOUNT_ID and my Region is $AWS_REGION"` },
      { t: "List, create and use a bucket. `mb` = make bucket, `cp` = copy, `ls` = list.", c: String.raw`aws s3 ls                                   # list your buckets
aws s3 mb s3://cli-practice-$ACCOUNT_ID     # make a bucket
echo "hello cloud" > note.txt               # create a small file
aws s3 cp note.txt s3://cli-practice-$ACCOUNT_ID/
aws s3 ls s3://cli-practice-$ACCOUNT_ID/` },
      { t: "Ask a question and choose the output format. `--query` picks fields from the JSON; `--output table` makes it readable.", c: String.raw`aws ec2 describe-regions --output json | head -20
aws ec2 describe-regions --query 'Regions[].RegionName' --output table` },
      { t: "Get help for any command. Press `q` to leave the help page.", c: String.raw`aws s3 help
aws s3 cp help` }
    ],
    cleanup: { t: "Delete the practice bucket. `--force` empties it first.", c: String.raw`aws s3 rb s3://cli-practice-$ACCOUNT_ID --force` }
  },
  cost: [
    { en: "CloudShell itself is free. You pay only for what your commands create, so clean-up commands matter.", ms: "CloudShell sendiri percuma. Anda hanya bayar untuk apa yang dicipta oleh arahan anda, jadi arahan pembersihan amat penting." },
    { en: "A command can create expensive things just as easily as a click. Read before pressing Enter.", ms: "Arahan boleh mencipta perkara mahal semudah satu klik. Baca sebelum menekan Enter." }
  ],
  security: [
    { en: "CloudShell uses your sign-in, so there are no keys to store. Never paste access keys into chats, documents or Git.", ms: "CloudShell menggunakan log masuk anda, jadi tiada kunci perlu disimpan. Jangan sesekali tampal access key ke dalam sembang, dokumen atau Git." },
    { en: "Don't run commands you don't understand from random websites. Read them first, line by line.", ms: "Jangan jalankan arahan yang anda tidak faham dari laman web rawak. Baca dahulu, baris demi baris." }
  ],
  quiz: [
    { q: { en: "In `aws s3 cp note.txt s3://my-bucket/`, what is `s3`?", ms: "Dalam `aws s3 cp note.txt s3://my-bucket/`, apakah `s3`?" },
      o: [{ en: "The service", ms: "Perkhidmatan" }, { en: "The file name", ms: "Nama fail" }, { en: "The Region", ms: "Region" }, { en: "Your password", ms: "Kata laluan anda" }], a: 0,
      why: { en: "AWS CLI commands follow `aws <service> <action> <arguments>`. Here the service is S3 and the action is `cp` (copy).", ms: "Arahan AWS CLI mengikut corak `aws <perkhidmatan> <tindakan> <argumen>`. Di sini perkhidmatannya S3 dan tindakannya `cp` (salin)." } },
    { q: { en: "A lab command contains `<instance-id>`. What do you do?", ms: "Arahan makmal mengandungi `<instance-id>`. Apa yang anda lakukan?" },
      o: [{ en: "Type it exactly as shown", ms: "Taip sebiji seperti yang ditunjukkan" }, { en: "Replace it, brackets included, with your real instance ID", ms: "Gantikan, termasuk kurungan, dengan ID instance sebenar anda" }, { en: "Delete the line", ms: "Padam baris itu" }, { en: "Add more brackets", ms: "Tambah lagi kurungan" }], a: 1,
      why: { en: "Angle brackets mark placeholders. Your real value replaces the whole thing.", ms: "Kurungan sudut menandakan pemegang tempat. Nilai sebenar anda menggantikan keseluruhannya." } },
    { q: { en: "Why use commands instead of clicking?", ms: "Kenapa guna arahan berbanding klik?" },
      o: [{ en: "Commands are free and clicks cost money", ms: "Arahan percuma dan klik dikenakan bayaran" }, { en: "Commands can be saved, repeated, shared and automated", ms: "Arahan boleh disimpan, diulang, dikongsi dan diautomasikan" }, { en: "The Console will be removed soon", ms: "Console akan dibuang tidak lama lagi" }, { en: "Commands don't need permissions", ms: "Arahan tidak memerlukan kebenaran" }], a: 1,
      why: { en: "Repeatability is the big win. It leads to scripts and then infrastructure as code (module 07).", ms: "Kebolehulangan ialah kelebihan utama. Ia membawa kepada skrip dan seterusnya infrastructure as code (modul 07)." } }
  ],
  docs: [[{ en: "AWS CloudShell", ms: "AWS CloudShell" }, "https://docs.aws.amazon.com/cloudshell/latest/userguide/welcome.html"], [{ en: "AWS CLI user guide", ms: "Panduan pengguna AWS CLI" }, "https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html"]],
  certs: { CLF: 1 }
});

C.phase0 = P;
})(window.COURSE);
