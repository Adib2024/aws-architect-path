/* Glossary: tap-to-explain terms. a = text variants that get auto-linked (case-sensitive; ci:true adds a capitalised/lowercase variant). */
(function (C) {
const G = [];
const g = (t, a, en, ms, see, ci) => G.push({ t, a, en, ms, see, ci });

/* basics */
g("Cloud", ["cloud computing", "the cloud"], "Renting computers, storage and services over the internet, paying only for what you use.", "Menyewa komputer, storan dan perkhidmatan melalui internet, dan membayar ikut penggunaan sahaja.", "z1", true);
g("Server", ["server", "servers"], "A computer whose job is to answer requests from other computers, usually kept in a data centre.", "Komputer yang tugasnya menjawab permintaan daripada komputer lain, biasanya disimpan di pusat data.", "z1", true);
g("Data centre", ["data centre", "data centres", "data center"], "A secure building full of servers with backup power, cooling and fast network links.", "Bangunan selamat yang penuh dengan server, lengkap dengan elektrik simpanan, penyejuk dan rangkaian laju.", "z1", true);
g("Pay-as-you-go", ["pay-as-you-go"], "Pricing where you're charged only for what you use, by the second, hour, request or gigabyte.", "Harga di mana anda dicaj hanya untuk apa yang digunakan, mengikut saat, jam, permintaan atau gigabait.", "z1", true);
g("IP address", ["IP address", "IP addresses"], "A number that identifies a device on a network, like a house address. Example: `203.0.113.10`.", "Nombor yang mengenal pasti peranti dalam rangkaian, seperti alamat rumah. Contoh: `203.0.113.10`.", "z2");
g("DNS", ["DNS"], "The internet's phonebook: it turns names like `example.com` into IP addresses.", "Buku telefon internet: menukar nama seperti `example.com` kepada alamat IP.", "z2");
g("Domain name", ["domain name", "domain"], "A human-friendly website name, like `example.com`, that you rent yearly from a registrar.", "Nama laman web yang mudah diingat, seperti `example.com`, yang disewa setiap tahun daripada pendaftar.", "z2", true);
g("HTTPS", ["HTTPS"], "Encrypted web traffic. The padlock in your browser. Nobody in between can read it.", "Trafik web yang disulitkan. Ikon mangga dalam pelayar anda. Orang di tengah tidak dapat membacanya.", "z2");
g("TLS", ["TLS"], "The encryption technology behind HTTPS. Certificates prove a site is who it claims to be.", "Teknologi penyulitan di sebalik HTTPS. Sijil membuktikan sesebuah laman adalah seperti yang didakwa.", "z2");
g("Port", ["port"], "A numbered door on a computer. Web traffic uses 443 (HTTPS) and 80 (HTTP).", "Pintu bernombor pada komputer. Trafik web guna 443 (HTTPS) dan 80 (HTTP).", "z2", true);
g("Client", ["client"], "The side that asks: your browser, phone app or another program.", "Pihak yang bertanya: pelayar, aplikasi telefon atau program lain.", "z2", true);
g("API", ["API", "APIs"], "A defined way for programs to talk to each other. Every AWS action is an API call.", "Cara yang ditetapkan untuk program berhubung antara satu sama lain. Setiap tindakan AWS ialah panggilan API.", "z5");
g("Status code", ["status code", "status codes"], "A server's 3-digit reply: 200 OK, 404 not found, 500 server error.", "Jawapan 3 digit daripada server: 200 OK, 404 tidak dijumpai, 500 ralat server.", "z2", true);
g("JSON", ["JSON"], "A text format for data using `{ }` for named fields and `[ ]` for lists. AWS speaks JSON.", "Format teks untuk data menggunakan `{ }` untuk medan bernama dan `[ ]` untuk senarai. AWS menggunakan JSON.", "z5");
g("YAML", ["YAML"], "A text format like JSON but using indentation. Common for templates and pipelines.", "Format teks seperti JSON tetapi menggunakan inden. Biasa untuk templat dan pipeline.", "m07");
g("Terminal", ["terminal", "command line", "shell"], "A text window where you type commands instead of clicking.", "Tetingkap teks tempat anda menaip arahan dan bukannya klik.", "z5", true);
g("AWS CLI", ["AWS CLI", "CLI"], "The `aws` command-line program for controlling AWS by typing.", "Program baris arahan `aws` untuk mengawal AWS dengan menaip.", "z5");
g("CloudShell", ["CloudShell"], "A free terminal inside the AWS Console, already signed in, with the AWS CLI installed.", "Terminal percuma dalam AWS Console, sudah log masuk, dengan AWS CLI terpasang.", "z5");
g("Console", ["AWS Console", "Console", "console"], "The AWS website where you manage everything by clicking.", "Laman web AWS tempat anda mengurus segalanya dengan klik.", "z3");
g("Latency", ["latency"], "Delay: how long a request takes to travel and get an answer. Lower is better.", "Kelewatan: berapa lama permintaan mengambil masa untuk sampai dan mendapat jawapan. Lebih rendah lebih baik.", "m01", true);
g("Scalability", ["scale", "scaling", "scalability"], "Handling more users by adding resources, ideally automatically.", "Menampung lebih ramai pengguna dengan menambah sumber, sebaik-baiknya secara automatik.", "m04", true);
g("High availability", ["high availability", "highly available"], "Designed to keep working when parts fail, usually by running in several AZs.", "Direka untuk terus berfungsi apabila sebahagian rosak, biasanya dengan berjalan di beberapa AZ.", "m15", true);

/* account & identity */
g("Region", ["Region", "Regions"], "A geographic area (e.g. Singapore) where AWS has a cluster of data centres. You choose where your resources live.", "Kawasan geografi (contohnya Singapura) di mana AWS mempunyai kelompok pusat data. Anda pilih lokasi sumber anda.", "m01");
g("Availability Zone", ["Availability Zone", "Availability Zones", "AZ", "AZs"], "One or more separate data centres inside a Region, with independent power and network.", "Satu atau lebih pusat data berasingan dalam sesebuah Region, dengan bekalan elektrik dan rangkaian tersendiri.", "m01");
g("Edge location", ["edge location", "edge locations"], "Small AWS sites near users, used by CloudFront and Route 53 for speed.", "Tapak kecil AWS berhampiran pengguna, digunakan oleh CloudFront dan Route 53 untuk kelajuan.", "m01", true);
g("AWS account", ["AWS account", "account"], "Your own space in AWS with its own resources, permissions and bill.", "Ruang anda sendiri dalam AWS dengan sumber, kebenaran dan bil tersendiri.", "z3");
g("Root user", ["root user", "root"], "The account's original login. It can do anything, so protect it with MFA and rarely use it.", "Log masuk asal akaun. Ia boleh melakukan apa sahaja, jadi lindungi dengan MFA dan jarang gunakannya.", "z3", true);
g("MFA", ["MFA"], "Multi-factor authentication: a password plus a code from your phone or a passkey.", "Pengesahan pelbagai faktor: kata laluan ditambah kod dari telefon atau passkey.", "z3");
g("Free Tier", ["Free Tier"], "Free credits and limited free usage AWS gives new accounts for learning.", "Kredit percuma dan penggunaan percuma terhad yang diberi AWS kepada akaun baharu untuk belajar.", "z3");
g("Budget", ["budget", "Budgets"], "A spending limit that emails you when costs approach it. It warns; it doesn't stop resources.", "Had perbelanjaan yang menghantar e-mel apabila kos menghampirinya. Ia memberi amaran; ia tidak menghentikan sumber.", "z3", true);
g("IAM", ["IAM"], "Identity and Access Management: who can do what in your AWS account.", "Identity and Access Management: siapa boleh buat apa dalam akaun AWS anda.", "m02");
g("IAM Identity Center", ["IAM Identity Center", "Identity Center"], "Single sign-on for people: one login for many AWS accounts, with temporary credentials.", "Log masuk tunggal untuk manusia: satu log masuk untuk banyak akaun AWS, dengan kelayakan sementara.", "m01");
g("Role", ["role", "roles"], "A set of permissions that a person, program or AWS service can temporarily take on. No password.", "Set kebenaran yang boleh diambil sementara oleh orang, program atau perkhidmatan AWS. Tiada kata laluan.", "m02", true);
g("Policy", ["policy", "policies"], "A JSON document that lists which actions are allowed or denied on which resources.", "Dokumen JSON yang menyenaraikan tindakan yang dibenarkan atau ditolak ke atas sumber tertentu.", "m02", true);
g("Least privilege", ["least privilege", "least-privilege"], "Giving only the exact permissions needed, nothing more.", "Memberi hanya kebenaran yang benar-benar diperlukan, tidak lebih.", "m02", true);
g("Access key", ["access key", "access keys"], "A long-lived secret for programmatic access. Risky if leaked; prefer roles and SSO.", "Rahsia jangka panjang untuk akses program. Berisiko jika bocor; gunakan role dan SSO.", "m02", true);
g("STS", ["STS"], "Security Token Service: hands out temporary credentials when someone assumes a role.", "Security Token Service: memberi kelayakan sementara apabila seseorang mengambil role.", "m02");
g("SCP", ["SCP", "SCPs"], "Service control policy: an organisation-wide rule that limits what accounts can do, even admins.", "Service control policy: peraturan seluruh organisasi yang mengehadkan apa yang boleh dilakukan akaun, termasuk pentadbir.", "m17");
g("Organizations", ["AWS Organizations", "Organizations"], "Groups many AWS accounts under one bill and one set of rules.", "Mengumpulkan banyak akaun AWS di bawah satu bil dan satu set peraturan.", "m17");

/* network */
g("VPC", ["VPC", "VPCs"], "Virtual Private Cloud: your own private network inside AWS.", "Virtual Private Cloud: rangkaian peribadi anda dalam AWS.", "m03");
g("Subnet", ["subnet", "subnets"], "A slice of a VPC in one AZ. Public subnets can reach the internet directly; private ones can't.", "Bahagian VPC dalam satu AZ. Subnet awam boleh terus mencapai internet; subnet peribadi tidak.", "m03", true);
g("CIDR", ["CIDR"], "A way of writing a range of IP addresses, e.g. `10.0.0.0/16` (about 65,000 addresses).", "Cara menulis julat alamat IP, contohnya `10.0.0.0/16` (kira-kira 65,000 alamat).", "m03");
g("Route table", ["route table", "route tables"], "Signposts for a subnet: where to send traffic for each destination.", "Papan tanda untuk subnet: ke mana trafik dihantar bagi setiap destinasi.", "m03", true);
g("Internet Gateway", ["Internet Gateway", "internet gateway"], "The VPC's main gate to the internet.", "Pintu utama VPC ke internet.", "m03");
g("NAT Gateway", ["NAT Gateway", "NAT gateway", "NAT gateways", "NAT"], "Lets private servers reach out to the internet (for updates) without letting the internet in. Billed hourly.", "Membolehkan server peribadi keluar ke internet (untuk kemas kini) tanpa membenarkan internet masuk. Dicaj setiap jam.", "m03");
g("Security group", ["security group", "security groups"], "A firewall around a resource listing which traffic is allowed in. Replies are allowed automatically.", "Tembok api di sekeliling sumber yang menyenaraikan trafik yang dibenarkan masuk. Balasan dibenarkan secara automatik.", "m03", true);
g("NACL", ["NACL", "NACLs", "Network ACLs"], "A subnet-level allow/deny list. Unlike security groups, it doesn't remember connections.", "Senarai benar/tolak di peringkat subnet. Tidak seperti security group, ia tidak mengingati sambungan.", "m03");
g("Firewall", ["firewall"], "A filter that decides which network traffic may pass.", "Penapis yang menentukan trafik rangkaian mana yang boleh melalui.", "m03", true);
g("VPC endpoint", ["VPC endpoint", "VPC endpoints", "gateway endpoint", "interface endpoint"], "A private doorway from your VPC to an AWS service, so traffic never touches the internet.", "Laluan peribadi dari VPC anda ke perkhidmatan AWS, supaya trafik tidak melalui internet.", "m03");
g("Transit Gateway", ["Transit Gateway"], "A central router connecting many VPCs and on-premises networks.", "Penghala pusat yang menghubungkan banyak VPC dan rangkaian on-premises.", "m17");
g("VPN", ["VPN"], "An encrypted tunnel over the internet, e.g. from an office to AWS.", "Terowong disulitkan melalui internet, contohnya dari pejabat ke AWS.", "m17");
g("Direct Connect", ["Direct Connect"], "A dedicated private cable from your data centre to AWS.", "Kabel persendirian khusus dari pusat data anda ke AWS.", "m17");
g("On-premises", ["on-premises", "on-prem"], "Your own data centre or server room, outside the cloud.", "Pusat data atau bilik server anda sendiri, di luar cloud.", "m17", true);

/* compute */
g("EC2", ["EC2"], "Elastic Compute Cloud: virtual servers you rent by the second.", "Elastic Compute Cloud: server maya yang disewa mengikut saat.", "m04");
g("Instance", ["instance", "instances"], "One virtual server running in EC2.", "Satu server maya yang berjalan dalam EC2.", "m04", true);
g("AMI", ["AMI", "AMIs"], "Amazon Machine Image: a saved template of a server's disk used to launch instances.", "Amazon Machine Image: templat cakera server yang disimpan untuk melancarkan instance.", "m04");
g("Load balancer", ["load balancer", "load balancers", "ALB", "NLB"], "Spreads incoming traffic across several servers and skips unhealthy ones.", "Mengagihkan trafik masuk ke beberapa server dan melangkau yang tidak sihat.", "m04", true);
g("Auto Scaling", ["Auto Scaling", "Auto Scaling group", "ASG"], "Automatically adds or removes servers to match demand and replaces broken ones.", "Menambah atau membuang server secara automatik mengikut permintaan dan menggantikan yang rosak.", "m04");
g("Spot", ["Spot"], "Spare AWS capacity at a big discount that can be taken back with 2 minutes' notice.", "Kapasiti lebihan AWS pada diskaun besar yang boleh diambil semula dengan notis 2 minit.", "m04");
g("Graviton", ["Graviton"], "AWS's own Arm processors, usually cheaper for the same performance.", "Pemproses Arm milik AWS, biasanya lebih murah untuk prestasi yang sama.", "m04");
g("Container", ["container", "containers"], "An app packaged with everything it needs so it runs the same anywhere.", "Aplikasi yang dibungkus bersama segala keperluannya supaya ia berjalan sama di mana-mana.", "m10", true);
g("Docker image", ["image", "Docker image", "container image"], "The packaged, read-only blueprint a container is started from.", "Pelan baca-sahaja yang dibungkus, digunakan untuk memulakan container.", "m10");
g("ECS", ["ECS"], "Elastic Container Service: runs and manages containers for you.", "Elastic Container Service: menjalankan dan mengurus container untuk anda.", "m10");
g("EKS", ["EKS"], "Elastic Kubernetes Service: managed Kubernetes on AWS.", "Elastic Kubernetes Service: Kubernetes terurus di AWS.", "m10");
g("Kubernetes", ["Kubernetes"], "Popular open-source system for running containers across many machines.", "Sistem sumber terbuka popular untuk menjalankan container merentas banyak mesin.", "m10");
g("Fargate", ["Fargate"], "Runs containers without you managing any servers.", "Menjalankan container tanpa anda perlu mengurus sebarang server.", "m10");
g("ECR", ["ECR"], "Elastic Container Registry: private storage for container images.", "Elastic Container Registry: storan peribadi untuk imej container.", "m10");
g("Lambda", ["Lambda"], "Runs your code only when triggered, charging per run. No servers to manage.", "Menjalankan kod anda hanya apabila dicetuskan, dicaj setiap kali berjalan. Tiada server untuk diurus.", "m08");
g("Serverless", ["serverless"], "Building with services where AWS runs all the servers and you pay per use.", "Membina dengan perkhidmatan di mana AWS menjalankan semua server dan anda bayar ikut penggunaan.", "m08", true);
g("API Gateway", ["API Gateway"], "The front door for APIs: receives web requests, checks them, and forwards them to your code.", "Pintu hadapan untuk API: menerima permintaan web, menyemaknya, dan menghantarnya ke kod anda.", "m08");
g("Step Functions", ["Step Functions"], "A workflow service that runs steps in order with retries, waits and error handling.", "Perkhidmatan aliran kerja yang menjalankan langkah mengikut urutan dengan cubaan semula, penantian dan pengendalian ralat.", "m08");
g("Cold start", ["cold start", "cold starts"], "The extra delay when a Lambda function runs for the first time in a while.", "Kelewatan tambahan apabila fungsi Lambda dijalankan buat kali pertama selepas beberapa ketika.", "m08", true);

/* storage & data */
g("S3", ["S3", "Amazon S3"], "Simple Storage Service: unlimited storage for files (objects) in buckets.", "Simple Storage Service: storan tanpa had untuk fail (objek) dalam bucket.", "m05");
g("Bucket", ["bucket", "buckets"], "A named container for files in S3. Names are unique worldwide.", "Bekas bernama untuk fail dalam S3. Nama unik di seluruh dunia.", "z4", true);
g("Object", ["object", "objects"], "A file stored in S3, plus its information. Found by its key (path).", "Fail yang disimpan dalam S3, bersama maklumatnya. Dicari melalui kunci (laluan).", "z4", true);
g("Storage class", ["storage class", "storage classes", "Glacier"], "S3 price tiers: hot data costs more to store but less to read; archives are the opposite.", "Peringkat harga S3: data aktif lebih mahal untuk disimpan tetapi murah untuk dibaca; arkib sebaliknya.", "m05", true);
g("Lifecycle rule", ["lifecycle rule", "lifecycle rules"], "Automatically moves or deletes S3 files as they age.", "Memindahkan atau memadam fail S3 secara automatik apabila ia semakin lama.", "m05", true);
g("Versioning", ["versioning"], "S3 keeps every old version of a file so mistakes can be undone.", "S3 menyimpan setiap versi lama fail supaya kesilapan boleh dibatalkan.", "m05", true);
g("Presigned URL", ["presigned URL", "presigned URLs"], "A temporary link that lets someone download or upload one file without logging in.", "Pautan sementara yang membolehkan seseorang memuat turun atau naik satu fail tanpa log masuk.", "m05", true);
g("EBS", ["EBS"], "Elastic Block Store: a hard disk for one EC2 instance in one AZ.", "Elastic Block Store: cakera keras untuk satu instance EC2 dalam satu AZ.", "m05");
g("EFS", ["EFS"], "Elastic File System: a shared network drive many servers can use at once.", "Elastic File System: pemacu rangkaian dikongsi yang boleh digunakan banyak server serentak.", "m05");
g("Snapshot", ["snapshot", "snapshots"], "A point-in-time backup copy of a disk or database.", "Salinan sandaran disk atau pangkalan data pada satu masa tertentu.", "m05", true);
g("Database", ["database", "databases"], "Organised storage for data that apps read and write constantly.", "Storan tersusun untuk data yang dibaca dan ditulis aplikasi secara berterusan.", "m06", true);
g("RDS", ["RDS"], "Relational Database Service: managed MySQL, PostgreSQL and others.", "Relational Database Service: MySQL, PostgreSQL dan lain-lain yang terurus.", "m06");
g("Aurora", ["Aurora"], "AWS's high-performance MySQL/PostgreSQL-compatible database.", "Pangkalan data berprestasi tinggi AWS yang serasi dengan MySQL/PostgreSQL.", "m06");
g("DynamoDB", ["DynamoDB"], "A serverless key-value database with consistent speed at any scale.", "Pangkalan data kunci-nilai tanpa server dengan kelajuan konsisten pada sebarang skala.", "m06");
g("Cache", ["cache", "caching", "ElastiCache"], "A fast in-memory copy of frequently used data, so you don't ask the database every time.", "Salinan pantas dalam memori bagi data yang kerap digunakan, supaya anda tidak bertanya kepada pangkalan data setiap kali.", "m06", true);
g("SQL", ["SQL"], "The standard language for asking questions of tables of data.", "Bahasa standard untuk bertanya soalan kepada jadual data.", "m18");
g("Multi-AZ", ["Multi-AZ"], "Running a copy in a second Availability Zone so a failure doesn't stop you.", "Menjalankan salinan di Availability Zone kedua supaya kegagalan tidak menghentikan anda.", "m06");
g("Data lake", ["data lake"], "All of a company's data stored in S3 in open formats, ready to analyse.", "Semua data syarikat disimpan dalam S3 dalam format terbuka, sedia untuk dianalisis.", "m18", true);
g("Athena", ["Athena"], "Run SQL directly on files in S3, paying per data scanned.", "Jalankan SQL terus pada fail dalam S3, bayar ikut data yang diimbas.", "m18");
g("Bedrock", ["Bedrock"], "AWS's service for using generative AI models through one API.", "Perkhidmatan AWS untuk menggunakan model AI generatif melalui satu API.", "m18");
g("RAG", ["RAG"], "Retrieval-augmented generation: the AI first looks up your documents, then answers from them.", "Retrieval-augmented generation: AI mencari dokumen anda dahulu, kemudian menjawab berdasarkannya.", "m18");

/* integration */
g("Queue", ["queue", "queues", "SQS"], "A waiting line for messages: producers add work, workers take it when ready.", "Barisan gilir untuk mesej: pengeluar menambah kerja, pekerja mengambilnya apabila bersedia.", "m09", true);
g("SNS", ["SNS"], "Simple Notification Service: sends one message to many subscribers at once.", "Simple Notification Service: menghantar satu mesej kepada banyak pelanggan serentak.", "m09");
g("EventBridge", ["EventBridge"], "An event router: reads events and sends each one to the right targets by rules.", "Penghala acara: membaca acara dan menghantar setiap satu ke sasaran yang betul mengikut peraturan.", "m09");
g("Dead-letter queue", ["dead-letter queue", "DLQ"], "Where messages go after failing several times, so they can be inspected and retried.", "Tempat mesej pergi selepas gagal beberapa kali, supaya boleh diperiksa dan dicuba semula.", "m09", true);
g("Idempotent", ["idempotent", "idempotency"], "Safe to repeat: doing it twice has the same effect as once (no double charge).", "Selamat diulang: melakukannya dua kali memberi kesan yang sama seperti sekali (tiada caj berganda).", "m09", true);
g("Event", ["event", "events"], "A record that something happened, like \"order placed\".", "Rekod bahawa sesuatu telah berlaku, seperti \"pesanan dibuat\".", "m09", true);

/* delivery & ops */
g("Infrastructure as code", ["infrastructure as code", "IaC"], "Describing cloud resources in text files so tools can build them the same way every time.", "Menerangkan sumber cloud dalam fail teks supaya alat boleh membinanya dengan cara yang sama setiap kali.", "m07", true);
g("CloudFormation", ["CloudFormation"], "AWS's built-in infrastructure-as-code service. Templates create stacks of resources.", "Perkhidmatan infrastructure as code terbina AWS. Templat mencipta stack sumber.", "m07");
g("CDK", ["CDK", "AWS CDK"], "Write infrastructure in a programming language; it becomes CloudFormation.", "Tulis infrastruktur dalam bahasa pengaturcaraan; ia ditukar menjadi CloudFormation.", "m07");
g("Terraform", ["Terraform"], "Popular multi-cloud infrastructure-as-code tool by HashiCorp.", "Alat infrastructure as code berbilang cloud yang popular oleh HashiCorp.", "m07");
g("Stack", ["stack", "stacks"], "A group of resources created and deleted together from one template.", "Kumpulan sumber yang dicipta dan dipadam bersama daripada satu templat.", "m07", true);
g("Drift", ["drift"], "When real resources no longer match the code because someone changed them by hand.", "Apabila sumber sebenar tidak lagi sepadan dengan kod kerana seseorang mengubahnya secara manual.", "m07", true);
g("CI/CD", ["CI/CD", "pipeline", "pipelines"], "Automatically testing and deploying every code change.", "Menguji dan menghantar setiap perubahan kod secara automatik.", "m12");
g("OIDC", ["OIDC"], "A standard that lets tools like GitHub prove who they are to AWS without stored passwords.", "Standard yang membolehkan alat seperti GitHub membuktikan identitinya kepada AWS tanpa kata laluan yang disimpan.", "m12");
g("Canary", ["canary"], "Releasing a new version to a small share of users first.", "Melepaskan versi baharu kepada sebahagian kecil pengguna dahulu.", "m12", true);
g("Blue/green", ["blue/green"], "Running old and new versions side by side, then switching traffic at once.", "Menjalankan versi lama dan baharu serentak, kemudian menukar trafik sekali gus.", "m12", true);
g("Rollback", ["rollback", "roll back", "rolls back"], "Going back to the previous working version.", "Kembali kepada versi sebelumnya yang berfungsi.", "m12", true);
g("CloudWatch", ["CloudWatch"], "AWS's monitoring service: metrics, logs, dashboards and alarms.", "Perkhidmatan pemantauan AWS: metrik, log, papan pemuka dan alarm.", "m13");
g("Metric", ["metric", "metrics"], "A number measured over time, like CPU % or requests per second.", "Nombor yang diukur dari semasa ke semasa, seperti % CPU atau permintaan sesaat.", "m13", true);
g("Log", ["log", "logs"], "Text lines an app writes about what it's doing, used for troubleshooting.", "Baris teks yang ditulis aplikasi tentang apa yang dilakukannya, digunakan untuk menyelesaikan masalah.", "m13", true);
g("Alarm", ["alarm", "alarms"], "Watches a metric and notifies someone or acts when it crosses a threshold.", "Memantau metrik dan memaklumkan seseorang atau bertindak apabila ia melepasi ambang.", "m13", true);
g("Trace", ["trace", "traces", "tracing", "X-Ray"], "The path of one request through all the services it touched, with timings.", "Laluan satu permintaan melalui semua perkhidmatan yang disentuhnya, berserta masa.", "m13", true);
g("CloudTrail", ["CloudTrail"], "Records every action taken in your account: who, what, when, from where.", "Merekod setiap tindakan dalam akaun anda: siapa, apa, bila, dari mana.", "m13");
g("SLO", ["SLO", "SLOs"], "Service level objective: a reliability target, e.g. 99.9% of requests under 300 ms.", "Objektif tahap perkhidmatan: sasaran kebolehpercayaan, contohnya 99.9% permintaan di bawah 300 ms.", "m13");

/* security & resilience */
g("Encryption", ["encryption", "encrypted", "encrypt"], "Scrambling data so only someone with the key can read it.", "Mengacak data supaya hanya pemegang kunci boleh membacanya.", "m14", true);
g("KMS", ["KMS"], "Key Management Service: creates and guards encryption keys and logs every use.", "Key Management Service: mencipta dan menjaga kunci penyulitan serta merekod setiap penggunaan.", "m14");
g("Secrets Manager", ["Secrets Manager"], "Stores passwords and API keys safely and can rotate them automatically.", "Menyimpan kata laluan dan kunci API dengan selamat dan boleh menukarnya secara automatik.", "m14");
g("WAF", ["WAF"], "Web Application Firewall: blocks malicious web requests like SQL injection and bots.", "Web Application Firewall: menyekat permintaan web berniat jahat seperti suntikan SQL dan bot.", "m14");
g("DDoS", ["DDoS"], "An attack that floods a site with traffic to knock it offline. AWS Shield helps absorb it.", "Serangan yang membanjiri laman dengan trafik untuk menjatuhkannya. AWS Shield membantu menyerapnya.", "m14");
g("GuardDuty", ["GuardDuty"], "Watches your account's activity and network logs for signs of attack.", "Memantau aktiviti akaun dan log rangkaian anda untuk tanda-tanda serangan.", "m14");
g("Backup", ["backup", "backups"], "A saved copy you can restore from after a mistake, failure or attack.", "Salinan tersimpan yang boleh dipulihkan selepas kesilapan, kegagalan atau serangan.", "m15", true);
g("RTO", ["RTO"], "Recovery time objective: the longest you can afford to be down.", "Recovery time objective: tempoh paling lama sistem boleh terhenti.", "m15");
g("RPO", ["RPO"], "Recovery point objective: the most data (in time) you can afford to lose.", "Recovery point objective: jumlah data maksimum (dalam masa) yang boleh hilang.", "m15");
g("Disaster recovery", ["disaster recovery", "DR"], "Plans and setups to restore service after a major failure, like losing a Region.", "Rancangan dan persediaan untuk memulihkan perkhidmatan selepas kegagalan besar, seperti kehilangan Region.", "m15", true);
g("Savings Plans", ["Savings Plans", "Savings Plan"], "A 1- or 3-year spending commitment in exchange for a big discount.", "Komitmen perbelanjaan 1 atau 3 tahun sebagai pertukaran untuk diskaun besar.", "m16");
g("Tag", ["tag", "tags"], "A label (key = value) on a resource, used to track owners and costs.", "Label (kunci = nilai) pada sumber, digunakan untuk menjejak pemilik dan kos.", "m16", true);
g("Route 53", ["Route 53"], "AWS's DNS service: domain names, routing and health checks.", "Perkhidmatan DNS AWS: nama domain, penghalaan dan semakan kesihatan.", "m11");
g("CloudFront", ["CloudFront"], "AWS's CDN: caches content at edge locations near users and adds HTTPS.", "CDN AWS: menyimpan kandungan di edge location berhampiran pengguna dan menambah HTTPS.", "m11");
g("CDN", ["CDN"], "Content delivery network: copies of your content stored close to users worldwide.", "Rangkaian penghantaran kandungan: salinan kandungan disimpan berhampiran pengguna di seluruh dunia.", "m11");
g("Well-Architected", ["Well-Architected"], "AWS's framework of best practices in six pillars, used for design reviews.", "Rangka kerja amalan terbaik AWS dalam enam tonggak, digunakan untuk semakan reka bentuk.", "m19");
g("ADR", ["ADR", "ADRs"], "Architecture decision record: a short note on a design decision and why it was made.", "Rekod keputusan seni bina: nota ringkas tentang keputusan reka bentuk dan sebabnya.", "m19");

/* AI track */
g("Tensor", ["tensor", "tensors"], "An n-dimensional array of numbers with a shape and a data type. Everything in deep learning is a tensor.", "Tatasusunan nombor n-dimensi dengan bentuk dan jenis data. Segala-galanya dalam pembelajaran mendalam ialah tensor.", "a01", true);
g("PyTorch", ["PyTorch"], "The most widely used deep-learning library: tensors, autograd, neural-network layers and GPU support.", "Pustaka pembelajaran mendalam paling banyak digunakan: tensor, autograd, lapisan rangkaian neural dan sokongan GPU.", "a01");
g("GPU", ["GPU", "GPUs"], "A processor with thousands of cores built for parallel arithmetic. Deep learning runs on GPUs.", "Pemproses dengan beribu-ribu teras untuk aritmetik selari. Pembelajaran mendalam berjalan pada GPU.", "a01");
g("CUDA", ["CUDA"], "NVIDIA's platform for running code on GPUs. In PyTorch, `.to('cuda')` moves tensors to the GPU.", "Platform NVIDIA untuk menjalankan kod pada GPU. Dalam PyTorch, `.to('cuda')` memindahkan tensor ke GPU.", "a01");
g("FLOPs", ["FLOPs", "FLOP"], "Floating-point operations. A multiply-add counts as 2. Used to measure how much compute a model needs.", "Operasi titik terapung. Satu darab-tambah dikira 2. Digunakan untuk mengukur jumlah pengkomputeran yang diperlukan model.", "a01");
g("Broadcasting", ["broadcasting"], "Automatically stretching size-1 dimensions so tensors of different shapes can be combined.", "Meregangkan dimensi bersaiz 1 secara automatik supaya tensor berlainan bentuk boleh digabungkan.", "a01", true);
g("Logits", ["logits", "logit"], "Raw, unnormalised scores a model outputs before softmax.", "Skor mentah tanpa normalisasi yang dikeluarkan model sebelum softmax.", "a02", true);
g("Softmax", ["softmax"], "Turns a vector of scores into probabilities that are positive and sum to 1.", "Menukar vektor skor kepada kebarangkalian yang positif dan berjumlah 1.", "a02", true);
g("Cross-entropy", ["cross-entropy"], "The standard classification loss: minus the log of the probability given to the correct answer.", "Fungsi kerugian klasifikasi standard: negatif log kebarangkalian yang diberikan kepada jawapan betul.", "a02", true);
g("Loss function", ["loss function"], "A single number measuring how wrong the model is. Training tries to make it smaller.", "Satu nombor yang mengukur sejauh mana model salah. Latihan cuba mengecilkannya.", "a02", true);
g("Perplexity", ["perplexity"], "e raised to the loss. Roughly how many equally likely choices the model is guessing between.", "e dipangkatkan dengan nilai kerugian. Lebih kurang berapa banyak pilihan sama rata yang sedang diteka model.", "a02", true);
g("Gradient", ["gradient", "gradients"], "The vector of partial derivatives: which direction, and how strongly, each weight should change to reduce the loss.", "Vektor terbitan separa: ke arah mana, dan sekuat mana, setiap pemberat patut berubah untuk mengurangkan kerugian.", "a03", true);
g("Gradient descent", ["gradient descent", "SGD"], "Repeatedly nudging weights opposite to the gradient to lower the loss.", "Menolak pemberat berulang kali bertentangan arah kecerunan untuk mengurangkan kerugian.", "a03", true);
g("Learning rate", ["learning rate"], "The step size of each update. Too high diverges, too low is slow.", "Saiz langkah setiap kemas kini. Terlalu tinggi menyimpang, terlalu rendah perlahan.", "a03", true);
g("Adam", ["Adam", "AdamW"], "An optimiser that adapts the step size for every weight using running averages of gradients and squared gradients.", "Pengoptimum yang menyesuaikan saiz langkah setiap pemberat menggunakan purata bergerak kecerunan dan kuasa dua kecerunan.", "a03");
g("Batch", ["batch", "mini-batch"], "A group of examples processed together in one step.", "Sekumpulan contoh yang diproses bersama dalam satu langkah.", "a03", true);
g("Epoch", ["epoch", "epochs"], "One full pass over the training dataset.", "Satu laluan penuh ke atas set data latihan.", "a06", true);
g("Backpropagation", ["backpropagation", "backprop"], "Computing all gradients by applying the chain rule backwards through the network.", "Mengira semua kecerunan dengan menggunakan petua rantai ke belakang melalui rangkaian.", "a04", true);
g("Autograd", ["autograd"], "PyTorch's automatic differentiation: it records operations and computes gradients for you.", "Pembezaan automatik PyTorch: ia merekod operasi dan mengira kecerunan untuk anda.", "a04", true);
g("Chain rule", ["chain rule"], "Derivative of a composition: multiply the derivatives of each step.", "Terbitan bagi gubahan fungsi: darabkan terbitan setiap langkah.", "a04", true);
g("Activation function", ["activation function", "ReLU", "GELU"], "The non-linear function after a layer (ReLU, GELU, SiLU). Without it, stacked layers collapse to one linear map.", "Fungsi tak linear selepas lapisan (ReLU, GELU, SiLU). Tanpanya, lapisan bertindan menjadi satu pemetaan linear.", "a05");
g("Initialisation", ["initialisation", "initialization"], "How weights are set before training. The right variance keeps signals stable through depth.", "Cara pemberat ditetapkan sebelum latihan. Varians yang betul memastikan isyarat stabil merentasi kedalaman.", "a05", true);
g("LayerNorm", ["LayerNorm", "RMSNorm", "layer normalisation"], "Rescales each token's features to zero mean and unit variance (RMSNorm: unit RMS). Stabilises deep networks.", "Menskala semula ciri setiap token kepada min sifar dan varians satu (RMSNorm: RMS satu). Menstabilkan rangkaian mendalam.", "a05");
g("Residual connection", ["residual connection", "residual connections", "residual", "skip connection"], "Adding a layer's input to its output (x + F(x)) so signals and gradients have a direct path.", "Menambah input lapisan kepada outputnya (x + F(x)) supaya isyarat dan kecerunan ada laluan terus.", "a05", true);
g("Dropout", ["dropout"], "Randomly zeroing activations during training to reduce overfitting. Turned off at inference.", "Mensifarkan pengaktifan secara rawak semasa latihan untuk mengurangkan overfitting. Dimatikan semasa inferens.", "a05", true);
g("Overfitting", ["overfitting"], "Memorising the training data so well that performance on new data gets worse.", "Menghafal data latihan terlalu baik sehingga prestasi pada data baharu menjadi lebih teruk.", "a09", true);
g("Convolution", ["convolution", "CNN", "CNNs"], "Sliding a small learned filter across an image; the basis of CNNs.", "Menggelongsorkan penapis kecil yang dipelajari merentasi imej; asas CNN.", "a06");
g("RNN", ["RNN", "RNNs", "LSTM"], "Recurrent network: processes a sequence one step at a time with a hidden state.", "Rangkaian berulang: memproses jujukan satu langkah demi satu langkah dengan keadaan tersembunyi.", "a06");
g("Token", ["token", "tokens"], "A piece of text (word, sub-word or byte) that the model treats as one unit.", "Cebisan teks (perkataan, sub-perkataan atau bait) yang dianggap sebagai satu unit oleh model.", "a07", true);
g("Tokenizer", ["tokenizer", "tokenisation", "tokenization", "BPE"], "Splits text into tokens and maps them to integer IDs. BPE is the most common algorithm.", "Memecahkan teks kepada token dan memetakannya kepada ID integer. BPE ialah algoritma paling biasa.", "a07", true);
g("Embedding", ["embedding", "embeddings"], "A learned vector for each token (a row of the embedding matrix).", "Vektor yang dipelajari bagi setiap token (satu baris dalam matriks embedding).", "a07", true);
g("Positional encoding", ["positional encoding", "position encoding", "RoPE"], "Information added so the model knows token order: sinusoids, learned tables or rotations (RoPE).", "Maklumat yang ditambah supaya model tahu susunan token: sinusoid, jadual dipelajari atau putaran (RoPE).", "a07", true);
g("Attention", ["attention", "self-attention"], "Each token computes weights over other tokens and takes a weighted average of their values.", "Setiap token mengira pemberat ke atas token lain dan mengambil purata berpemberat nilai mereka.", "a08", true);
g("Query, key, value", ["query", "queries"], "Three projections of each token used by attention: what it looks for, what it offers for matching, and what it passes on.", "Tiga unjuran setiap token yang digunakan attention: apa yang dicari, apa yang ditawarkan untuk dipadankan, dan apa yang dihantar.", "a08", true);
g("Causal mask", ["causal mask", "causal"], "Blocks attention to future tokens so a model can be trained to predict the next one.", "Menyekat attention kepada token akan datang supaya model boleh dilatih meramal token seterusnya.", "a08", true);
g("Multi-head attention", ["multi-head attention", "multi-head", "heads"], "Several attention operations in parallel on smaller slices of the vector, then combined.", "Beberapa operasi attention secara selari pada bahagian vektor yang lebih kecil, kemudian digabungkan.", "a08", true);
g("FlashAttention", ["FlashAttention"], "An exact, memory-efficient attention kernel that never stores the full T×T matrix.", "Kernel attention yang tepat dan cekap memori, tidak pernah menyimpan matriks T×T penuh.", "a08");
g("Transformer", ["Transformer", "Transformers", "transformer", "transformers"], "The architecture of modern LLMs: stacked blocks of attention and MLP with residuals and normalisation.", "Seni bina LLM moden: blok attention dan MLP bertindan dengan residual dan normalisasi.", "a09");
g("GPT", ["GPT"], "Generative Pre-trained Transformer: a decoder-only transformer trained to predict the next token.", "Generative Pre-trained Transformer: transformer penyahkod sahaja yang dilatih meramal token seterusnya.", "a09");
g("LLM", ["LLM", "LLMs", "large language model"], "Large language model: a transformer with billions of parameters trained on huge amounts of text.", "Model bahasa besar: transformer dengan berbilion parameter yang dilatih pada teks dalam jumlah sangat besar.", "a09");
g("Parameter", ["parameter", "parameters", "weights"], "A learned number in the model. Model size is usually quoted in parameters (e.g., 7B).", "Nombor yang dipelajari dalam model. Saiz model biasanya dinyatakan dalam parameter (contohnya 7B).", "a09", true);
g("Temperature", ["temperature"], "Divides logits before sampling: lower is more deterministic, higher more random.", "Membahagi logit sebelum persampelan: lebih rendah lebih deterministik, lebih tinggi lebih rawak.", "a12", true);
g("Mixed precision", ["mixed precision", "bf16", "bfloat16", "fp16"], "Doing most maths in 16-bit formats while keeping critical values in 32-bit. Faster and lighter.", "Melakukan kebanyakan pengiraan dalam format 16-bit sambil mengekalkan nilai penting dalam 32-bit. Lebih pantas dan ringan.", "a10", true);
g("Data parallelism", ["data parallel", "DDP", "FSDP", "ZeRO"], "Training copies (or shards) of the model on many GPUs, each on different data, then combining gradients.", "Melatih salinan (atau serpihan) model pada banyak GPU, setiap satu dengan data berbeza, kemudian menggabungkan kecerunan.", "a10");
g("Scaling laws", ["scaling laws", "Chinchilla"], "Empirical rules for how loss improves with model size and data; Chinchilla suggests ~20 tokens per parameter.", "Peraturan empirik tentang bagaimana kerugian bertambah baik dengan saiz model dan data; Chinchilla mencadangkan ~20 token setiap parameter.", "a10");
g("Fine-tuning", ["fine-tuning", "fine-tune", "SFT"], "Continuing to train a pre-trained model on a smaller, task-specific dataset.", "Meneruskan latihan model pra-latih pada set data yang lebih kecil dan khusus untuk tugas.", "a11", true);
g("LoRA", ["LoRA", "QLoRA"], "Low-rank adaptation: train two small matrices per layer instead of the full weights.", "Penyesuaian pangkat rendah: latih dua matriks kecil setiap lapisan dan bukannya pemberat penuh.", "a11");
g("DPO", ["DPO"], "Direct preference optimisation: align a model using pairs of preferred and rejected answers.", "Pengoptimuman keutamaan langsung: menyelaraskan model menggunakan pasangan jawapan yang dipilih dan ditolak.", "a11");
g("Inference", ["inference"], "Running a trained model to get predictions or generate text.", "Menjalankan model yang telah dilatih untuk mendapatkan ramalan atau menjana teks.", "a12", true);
g("KV cache", ["KV cache", "KV-cache"], "Stored keys and values of previous tokens so each new token doesn't recompute them.", "Key dan value token terdahulu yang disimpan supaya setiap token baharu tidak perlu mengiranya semula.", "a12");
g("Quantisation", ["quantisation", "quantization", "int8", "int4"], "Storing weights in fewer bits (8 or 4) with a scale factor, so models are smaller and faster.", "Menyimpan pemberat dalam bit yang lebih sedikit (8 atau 4) dengan faktor skala, supaya model lebih kecil dan pantas.", "a12", true);
g("vLLM", ["vLLM"], "A high-throughput open-source LLM server using PagedAttention and continuous batching.", "Pelayan LLM sumber terbuka berdaya pemprosesan tinggi menggunakan PagedAttention dan pengelompokan berterusan.", "a12");
g("SageMaker", ["SageMaker", "Amazon SageMaker"], "AWS's managed service for training and deploying ML models.", "Perkhidmatan terurus AWS untuk melatih dan menghantar model ML.", "a10");
g("Trainium & Inferentia", ["Inferentia", "Inferentia2", "Trainium"], "AWS-designed chips for training (Trainium) and inference (Inferentia).", "Cip rekaan AWS untuk latihan (Trainium) dan inferens (Inferentia).", "a12");

/* Scope: AI-track terms link only on AI pages; these cloud terms are ambiguous in ML text and link only on cloud pages. */
const CLOUD_ONLY = ["Log", "Object", "Event", "Stack", "Scalability", "Cache", "Instance", "Docker image", "Policy", "Role", "Tag", "Domain name",
  "Port", "Client", "Budget", "Snapshot", "Drift", "Canary", "Rollback", "Root user", "Console", "AWS account", "Queue", "Firewall", "Metric", "Alarm", "Trace", "Backup", "Container", "Terminal"];
G.forEach(e => { e.scope = /^a\d/.test(e.see || "") ? "ai" : (CLOUD_ONLY.includes(e.t) ? "cloud" : "both"); });

C.glossary = G;
})(window.COURSE);
