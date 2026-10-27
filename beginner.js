/* Beginner layer: plain-language analogies and click-through (console) labs for modules 01–19. */
(function (C) {
const B = {};
const s = (en, ms) => ({ en, ms });
const step = (en, ms, c, lang) => ({ t: { en, ms }, c, lang });

B.m01 = {
  simple: {
    analogy: s("AWS is like a chain of hypermarkets. **Regions** are cities where it has a cluster of stores. Each city has several separate branches (**Availability Zones**), so if one branch has a blackout the others keep trading. **Edge locations** are small kiosks near your home that hand out the most popular items quickly.",
      "AWS seperti rangkaian pasar raya besar. **Region** ialah bandar yang mempunyai sekumpulan kedai. Setiap bandar ada beberapa cawangan berasingan (**Availability Zone**), jadi jika satu cawangan terputus bekalan elektrik, cawangan lain terus beroperasi. **Edge location** pula kiosk kecil berhampiran rumah anda yang menyerahkan barang paling popular dengan cepat."),
    plain: s("AWS has data centres all over the world, grouped into Regions such as Singapore or Malaysia. You choose where your app lives. Each Region has at least three separate buildings, so you can survive one of them failing.",
      "AWS mempunyai pusat data di seluruh dunia, dikumpulkan dalam Region seperti Singapura atau Malaysia. Anda pilih di mana aplikasi anda berada. Setiap Region ada sekurang-kurangnya tiga bangunan berasingan, jadi aplikasi anda boleh bertahan jika salah satunya gagal."),
    why: s("Where your app lives affects how fast it feels, how much it costs, and which data laws apply.",
      "Lokasi aplikasi anda mempengaruhi kelajuan, kos, dan undang-undang data yang terpakai.")
  },
  consoleLab: {
    title: s("Secure your account by clicking", "Lindungi akaun anda dengan klik"), time: s("~30 min · free", "~30 min · percuma"),
    goal: s("If you did lesson 0.3, steps 1–3 are a quick check.", "Jika anda sudah buat pelajaran 0.3, langkah 1–3 hanya semakan ringkas."),
    steps: [
      step("Top right → Region menu → choose **Asia Pacific (Singapore)**. Note that the list also shows which Regions are not enabled yet.", "Kanan atas → menu Region → pilih **Asia Pacific (Singapore)**. Perhatikan senarai itu juga menunjukkan Region yang belum diaktifkan."),
      step("Account name → **Security credentials** → confirm the root user has an MFA device. If not, **Assign MFA device**.", "Nama akaun → **Security credentials** → pastikan root user ada peranti MFA. Jika tiada, **Assign MFA device**."),
      step("Search **Budgets** → confirm your monthly budget exists with an email alert.", "Cari **Budgets** → pastikan bajet bulanan anda wujud dengan amaran e-mel."),
      step("Search **EC2** → left menu **Settings** or the dashboard's **Zones** panel: see the AZ names and their **Zone IDs** (like `apse1-az1`).", "Cari **EC2** → menu kiri **Settings** atau panel **Zones** di papan pemuka: lihat nama AZ dan **Zone ID** (seperti `apse1-az1`)."),
      step("Search **CloudTrail** → **Event history**. Every click you just made is recorded here: who, what, when.", "Cari **CloudTrail** → **Event history**. Setiap klik yang anda buat tadi direkodkan di sini: siapa, apa, bila.")
    ],
    cleanup: { t: s("Nothing to delete.", "Tiada apa perlu dipadam.") }
  }
};

B.m02 = {
  simple: {
    analogy: s("IAM is an office building's access-card system. Every person (**user**) or machine (**role**) gets a card. A **policy** is the list of doors that card opens. If any door has a red **Deny** sign, no card can open it, not even the boss's.",
      "IAM ialah sistem kad akses bangunan pejabat. Setiap orang (**user**) atau mesin (**role**) mendapat kad. **Policy** ialah senarai pintu yang boleh dibuka oleh kad itu. Jika mana-mana pintu ada tanda merah **Deny**, tiada kad boleh membukanya, walaupun kad bos."),
    plain: s("IAM decides who can do what in your AWS account. By default nothing is allowed. You grant only the exact permissions each person or program needs, and programs borrow temporary permissions instead of storing passwords.",
      "IAM menentukan siapa boleh buat apa dalam akaun AWS anda. Secara lalai tiada apa yang dibenarkan. Anda hanya beri kebenaran tepat yang diperlukan setiap orang atau program, dan program meminjam kebenaran sementara dan bukannya menyimpan kata laluan."),
    why: s("Most cloud break-ins start with permissions that were too wide or a password or key that leaked.",
      "Kebanyakan pencerobohan cloud bermula dengan kebenaran yang terlalu luas atau kata laluan atau kunci yang bocor.")
  },
  consoleLab: {
    title: s("Create a limited role and test it", "Cipta role terhad dan uji"), time: s("~30 min · free", "~30 min · percuma"),
    goal: s("Create a role that can only read S3, then see which actions it can and cannot do.", "Cipta role yang hanya boleh membaca S3, kemudian lihat tindakan yang boleh dan tidak boleh dilakukan."),
    steps: [
      step("Search **IAM** → **Roles** → **Create role** → Trusted entity **AWS service** → Use case **EC2** → **Next**.", "Cari **IAM** → **Roles** → **Create role** → Trusted entity **AWS service** → Use case **EC2** → **Next**."),
      step("Search for and tick **AmazonS3ReadOnlyAccess** → **Next** → name it `s3-reader` → **Create role**.", "Cari dan tandakan **AmazonS3ReadOnlyAccess** → **Next** → namakan `s3-reader` → **Create role**."),
      step("Open the role → **Permissions** tab → click the policy name → **JSON**. Find the actions it allows (`s3:Get*`, `s3:List*`). Nothing allows delete.", "Buka role → tab **Permissions** → klik nama policy → **JSON**. Cari tindakan yang dibenarkan (`s3:Get*`, `s3:List*`). Tiada yang membenarkan padam."),
      step("Open the **IAM Policy Simulator** (policysim.aws.amazon.com) → choose role `s3-reader` → service S3 → actions `GetObject` and `DeleteObject` → **Run Simulation**. One is allowed, one is denied.", "Buka **IAM Policy Simulator** (policysim.aws.amazon.com) → pilih role `s3-reader` → perkhidmatan S3 → tindakan `GetObject` dan `DeleteObject` → **Run Simulation**. Satu dibenarkan, satu ditolak."),
      step("IAM left menu → **Access analyzer** → **Create analyzer** (type: account). It flags anything shared outside your account.", "Menu kiri IAM → **Access analyzer** → **Create analyzer** (jenis: account). Ia menandakan apa-apa yang dikongsi di luar akaun anda.")
    ],
    cleanup: { t: s("Delete the `s3-reader` role and the analyzer.", "Padam role `s3-reader` dan analyzer itu.") }
  }
};

B.m03 = {
  simple: {
    analogy: s("A VPC is a gated housing estate. The estate wall is the **VPC**, the streets are **subnets**, the main gate is the **Internet Gateway**, each house's lock is a **security group**, and the **NAT gateway** is an exit-only gate: residents can go out shopping, but strangers can't walk in through it.",
      "VPC ialah taman perumahan berpagar. Tembok taman ialah **VPC**, jalan-jalan ialah **subnet**, pintu pagar utama ialah **Internet Gateway**, kunci setiap rumah ialah **security group**, dan **NAT gateway** ialah pintu keluar sahaja: penduduk boleh keluar membeli-belah, tetapi orang luar tidak boleh masuk melaluinya."),
    plain: s("A VPC is your own private network inside AWS. You split it into **public** areas (things the internet must reach, like the front door of a website) and **private** areas (servers and databases that should stay hidden).",
      "VPC ialah rangkaian peribadi anda dalam AWS. Anda membahagikannya kepada kawasan **awam** (perkara yang perlu dicapai internet, seperti pintu depan laman web) dan kawasan **peribadi** (server dan pangkalan data yang perlu kekal tersembunyi)."),
    why: s("A good network keeps your database off the public internet. Many data leaks happen because this step was skipped.",
      "Rangkaian yang baik memastikan pangkalan data anda tidak terdedah ke internet. Banyak kebocoran data berlaku kerana langkah ini diabaikan.")
  },
  consoleLab: {
    title: s("Build a VPC with the wizard", "Bina VPC dengan wizard"), time: s("~30 min · ~US$0.05/h while running", "~30 min · ~US$0.05/j semasa berjalan"),
    goal: s("Create the two-AZ layout from the diagram and explore it visually.", "Cipta susun atur dua AZ seperti dalam rajah dan terokainya secara visual."),
    steps: [
      step("Search **VPC** → **Create VPC** → choose **VPC and more**. Name: `lab`. IPv4 CIDR `10.0.0.0/16`.", "Cari **VPC** → **Create VPC** → pilih **VPC and more**. Nama: `lab`. IPv4 CIDR `10.0.0.0/16`."),
      step("Availability Zones **2**, public subnets **2**, private subnets **2**. NAT gateways: **In 1 AZ**. VPC endpoints: **S3 Gateway**.", "Availability Zones **2**, subnet awam **2**, subnet peribadi **2**. NAT gateways: **In 1 AZ**. VPC endpoints: **S3 Gateway**."),
      step("Look at the **Preview** map on the right. It draws subnets, route tables and gateways for you. Then **Create VPC**.", "Lihat peta **Preview** di sebelah kanan. Ia melukis subnet, route table dan gateway untuk anda. Kemudian **Create VPC**."),
      step("Open your VPC → **Resource map** tab. Follow a public subnet → its route table → the Internet Gateway. Then a private subnet → route table → NAT gateway.", "Buka VPC anda → tab **Resource map**. Ikuti subnet awam → route table → Internet Gateway. Kemudian subnet peribadi → route table → NAT gateway."),
      step("**Security groups** → **Create security group** `web-sg`: inbound HTTPS (443) from Anywhere. Create `app-sg`: inbound port 8080 with **source = web-sg**. That's \"chaining by reference\".", "**Security groups** → **Create security group** `web-sg`: inbound HTTPS (443) dari Anywhere. Cipta `app-sg`: inbound port 8080 dengan **source = web-sg**. Itulah \"rangkaian melalui rujukan\".")
    ],
    cleanup: { t: s("The NAT gateway costs money every hour. Delete it first (**NAT gateways** → Delete), release its Elastic IP, then **Your VPCs** → select `lab` → **Delete VPC**.", "NAT gateway dikenakan caj setiap jam. Padam dahulu (**NAT gateways** → Delete), lepaskan Elastic IP, kemudian **Your VPCs** → pilih `lab` → **Delete VPC**.") }
  }
};

B.m04 = {
  simple: {
    analogy: s("EC2 is renting computers by the hour. A **load balancer** is the person at a bank's entrance pointing each customer to a free counter. **Auto Scaling** is the branch manager who opens more counters when the queue gets long and closes them when it's quiet.",
      "EC2 ialah menyewa komputer mengikut jam. **Load balancer** ialah petugas di pintu masuk bank yang menunjukkan setiap pelanggan ke kaunter yang kosong. **Auto Scaling** ialah pengurus cawangan yang membuka lebih banyak kaunter apabila barisan panjang dan menutupnya apabila lengang."),
    plain: s("EC2 gives you virtual computers called instances. Instead of one big computer, you run a few small ones behind a load balancer and let Auto Scaling add or remove them as traffic changes. If one breaks, it's replaced automatically.",
      "EC2 memberi anda komputer maya yang dipanggil instance. Daripada satu komputer besar, anda jalankan beberapa yang kecil di belakang load balancer dan biarkan Auto Scaling menambah atau membuangnya mengikut trafik. Jika satu rosak, ia diganti secara automatik."),
    why: s("This is how websites stay up on busy days without paying for peak capacity all year.",
      "Inilah cara laman web kekal berfungsi pada hari sibuk tanpa membayar kapasiti puncak sepanjang tahun.")
  },
  consoleLab: {
    title: s("Launch a web server, then make it self-healing", "Lancarkan server web, kemudian jadikan ia pulih sendiri"), time: s("~45 min · free-tier sized", "~45 min · saiz free tier"),
    goal: s("Uses the default VPC so you don't need module 03's network.", "Menggunakan VPC lalai, jadi anda tidak memerlukan rangkaian modul 03."),
    steps: [
      step("Search **EC2** → **Launch instance**. Name `web1`. Image **Amazon Linux 2023**. Type: a free-tier eligible one (`t3.micro` or `t4g.micro`). Key pair: **Proceed without a key pair**.", "Cari **EC2** → **Launch instance**. Nama `web1`. Image **Amazon Linux 2023**. Jenis: yang layak free tier (`t3.micro` atau `t4g.micro`). Key pair: **Proceed without a key pair**."),
      step("Network settings → **Edit** → tick **Allow HTTP traffic from the internet**. Untick SSH. Expand **Advanced details** → paste this into **User data**:", "Network settings → **Edit** → tandakan **Allow HTTP traffic from the internet**. Nyahtanda SSH. Kembangkan **Advanced details** → tampal ini ke dalam **User data**:",
        String.raw`#!/bin/bash
dnf install -y nginx
echo "<h1>Hello from $(hostname)</h1>" > /usr/share/nginx/html/index.html
systemctl enable --now nginx`),
      step("**Launch instance**. Wait about 2 minutes, then open `http://<Public IPv4 address>` in your browser. (Use `http://`, not `https://`.)", "**Launch instance**. Tunggu kira-kira 2 minit, kemudian buka `http://<Public IPv4 address>` dalam pelayar. (Gunakan `http://`, bukan `https://`.)"),
      step("Select the instance → **Actions → Image and templates → Create template from instance**. Then **Auto Scaling groups → Create**, use that template, choose 2 subnets, desired **2**, min **2**, max **4**.", "Pilih instance → **Actions → Image and templates → Create template from instance**. Kemudian **Auto Scaling groups → Create**, guna template itu, pilih 2 subnet, desired **2**, min **2**, max **4**."),
      step("Self-healing test: terminate one of the group's instances. Watch the **Activity** tab: the group launches a replacement within minutes.", "Ujian pulih sendiri: tamatkan salah satu instance dalam kumpulan. Lihat tab **Activity**: kumpulan itu melancarkan pengganti dalam beberapa minit.")
    ],
    cleanup: { t: s("Delete the Auto Scaling group (it terminates its instances), terminate `web1`, and delete the launch template.", "Padam Auto Scaling group (ia menamatkan instance-nya), tamatkan `web1`, dan padam launch template.") }
  }
};

B.m05 = {
  simple: {
    analogy: s("**S3** is an endless warehouse of labelled boxes: put any file in, fetch it by its label. **Lifecycle rules** move old boxes to a cheaper basement automatically. **EBS** is the hard disk plugged into one computer. **EFS** is the shared office drive everyone can open at the same time.",
      "**S3** ialah gudang tanpa had berisi kotak berlabel: simpan apa-apa fail, ambil menggunakan labelnya. **Lifecycle rule** memindahkan kotak lama ke ruang bawah tanah yang lebih murah secara automatik. **EBS** ialah cakera keras yang disambung ke satu komputer. **EFS** ialah pemacu pejabat yang dikongsi dan boleh dibuka semua orang serentak."),
    plain: s("AWS has three kinds of storage: object storage (S3) for files and backups, block storage (EBS) as a server's disk, and file storage (EFS) as a shared folder. S3 can automatically move older files to cheaper storage.",
      "AWS mempunyai tiga jenis storan: storan objek (S3) untuk fail dan sandaran, storan blok (EBS) sebagai cakera server, dan storan fail (EFS) sebagai folder yang dikongsi. S3 boleh memindahkan fail lama ke storan yang lebih murah secara automatik."),
    why: s("Picking the right storage can cut storage bills by 90% and protect you from accidental deletion.",
      "Memilih storan yang betul boleh mengurangkan bil storan sehingga 90% dan melindungi anda daripada pemadaman tidak sengaja.")
  },
  consoleLab: {
    title: s("Versioning, lifecycle and undo-delete", "Versioning, lifecycle dan batal padam"), time: s("~25 min · cents", "~25 min · beberapa sen"),
    goal: s("See how S3 protects you from your own mistakes.", "Lihat bagaimana S3 melindungi anda daripada kesilapan sendiri."),
    steps: [
      step("**S3** → **Create bucket** `lab-data-<your name>`. Keep **Block all public access** on. Set **Bucket Versioning: Enable** → Create.", "**S3** → **Create bucket** `lab-data-<nama anda>`. Kekalkan **Block all public access**. Tetapkan **Bucket Versioning: Enable** → Create."),
      step("Upload any small file into a folder `reports/`. Then upload a changed file with the **same name**.", "Muat naik mana-mana fail kecil ke dalam folder `reports/`. Kemudian muat naik fail yang diubah dengan **nama yang sama**."),
      step("Switch on **Show versions**: both versions are kept. Now delete the file, then turn **Show versions** on again. There's a **delete marker**. Delete the marker and your file is back.", "Hidupkan **Show versions**: kedua-dua versi disimpan. Sekarang padam fail itu, kemudian hidupkan semula **Show versions**. Ada **delete marker**. Padam marker itu dan fail anda kembali."),
      step("**Management** tab → **Create lifecycle rule** → prefix `logs/` → move to **Standard-IA** after 30 days and **Glacier Flexible Retrieval** after 90 → expire after 365.", "Tab **Management** → **Create lifecycle rule** → prefix `logs/` → pindah ke **Standard-IA** selepas 30 hari dan **Glacier Flexible Retrieval** selepas 90 → tamat selepas 365."),
      step("Select a file → **Actions → Share with a presigned URL** → 5 minutes. Open the link in a private window. It works, then expires.", "Pilih fail → **Actions → Share with a presigned URL** → 5 minit. Buka pautan dalam tetingkap peribadi. Ia berfungsi, kemudian tamat tempoh.")
    ],
    cleanup: { t: s("Select the bucket → **Empty** (removes every version) → **Delete**.", "Pilih bucket → **Empty** (membuang setiap versi) → **Delete**.") }
  }
};

B.m06 = {
  simple: {
    analogy: s("A **relational database** (RDS, Aurora) is a set of spreadsheets with strict columns that can be linked together, good for asking any question. **DynamoDB** is a giant, ultra-fast filing cabinet: perfect when you always look things up by the folder's exact label. A **cache** is a sticky note on your desk with answers you need all the time.",
      "**Pangkalan data hubungan** (RDS, Aurora) ialah set hamparan dengan lajur tetap yang boleh dihubungkan antara satu sama lain, sesuai untuk bertanya apa-apa soalan. **DynamoDB** ialah kabinet fail gergasi yang sangat pantas: sempurna apabila anda sentiasa mencari menggunakan label folder yang tepat. **Cache** ialah nota pelekat di meja anda dengan jawapan yang kerap diperlukan."),
    plain: s("Different data needs different databases. Use a relational database when you need flexible queries and transactions, DynamoDB when you need predictable speed at huge scale, and a cache in front of either to make repeated reads instant.",
      "Data yang berbeza memerlukan pangkalan data yang berbeza. Gunakan pangkalan data hubungan apabila memerlukan pertanyaan fleksibel dan transaksi, DynamoDB apabila memerlukan kelajuan konsisten pada skala besar, dan cache di hadapan mana-mana satu untuk menjadikan bacaan berulang serta-merta."),
    why: s("The database is the hardest part to change later, so choosing well is one of an architect's most important decisions.",
      "Pangkalan data ialah bahagian paling sukar diubah kemudian, jadi memilih dengan baik ialah antara keputusan terpenting seorang arkitek.")
  },
  consoleLab: {
    title: s("Model orders in DynamoDB", "Modelkan pesanan dalam DynamoDB"), time: s("~25 min · free tier", "~25 min · free tier"),
    goal: s("Store and look up a customer's orders without writing any code.", "Simpan dan cari pesanan pelanggan tanpa menulis sebarang kod."),
    steps: [
      step("Search **DynamoDB** → **Create table**. Name `Orders`. Partition key `PK` (String). Sort key `SK` (String). Keep the defaults → Create.", "Cari **DynamoDB** → **Create table**. Nama `Orders`. Partition key `PK` (String). Sort key `SK` (String). Kekalkan tetapan lalai → Create."),
      step("Open the table → **Explore table items** → **Create item**. PK `CUST#42`, SK `ORDER#2026-10-01#1001`. **Add new attribute** → Number `total` = 59.90.", "Buka jadual → **Explore table items** → **Create item**. PK `CUST#42`, SK `ORDER#2026-10-01#1001`. **Add new attribute** → Number `total` = 59.90."),
      step("Add two more orders for `CUST#42` with different dates, and one for `CUST#7`.", "Tambah dua lagi pesanan untuk `CUST#42` dengan tarikh berbeza, dan satu untuk `CUST#7`."),
      step("Choose **Query**, PK = `CUST#42`, sort key **begins with** `ORDER#2026-10` → **Run**. You get exactly that customer's October orders, without scanning the whole table.", "Pilih **Query**, PK = `CUST#42`, sort key **begins with** `ORDER#2026-10` → **Run**. Anda mendapat pesanan Oktober pelanggan itu sahaja, tanpa mengimbas keseluruhan jadual.")
    ],
    cleanup: { t: s("Select the table → **Delete**.", "Pilih jadual → **Delete**.") }
  }
};

B.m07 = {
  simple: {
    analogy: s("Instead of assembling furniture by hand each time, you write the instruction sheet once, like an IKEA manual. Anyone can follow it to build an identical copy, and you can compare versions to see exactly what changed.",
      "Daripada memasang perabot dengan tangan setiap kali, anda tulis helaian arahan sekali, seperti manual IKEA. Sesiapa boleh mengikutinya untuk membina salinan yang sama, dan anda boleh membandingkan versi untuk melihat dengan tepat apa yang berubah."),
    plain: s("Infrastructure as code means describing your AWS setup in text files instead of clicking. Tools such as CloudFormation, CDK and Terraform read those files and build everything the same way every time, in any account.",
      "Infrastructure as code bermaksud menerangkan persediaan AWS anda dalam fail teks dan bukannya klik. Alat seperti CloudFormation, CDK dan Terraform membaca fail tersebut dan membina segalanya dengan cara yang sama setiap kali, dalam mana-mana akaun."),
    why: s("Clicking doesn't scale and can't be reviewed. Every serious team builds infrastructure from code.",
      "Klik tidak boleh diskala dan tidak boleh disemak. Setiap pasukan yang serius membina infrastruktur daripada kod.")
  },
  consoleLab: {
    title: s("Your first CloudFormation stack from the console", "Stack CloudFormation pertama anda dari console"), time: s("~25 min · cents", "~25 min · beberapa sen"),
    goal: s("Create resources from a small text file, change the file, and see the difference.", "Cipta sumber daripada fail teks kecil, ubah fail itu, dan lihat perbezaannya."),
    steps: [
      step("Save this as `bucket.yaml` on your computer:", "Simpan ini sebagai `bucket.yaml` di komputer anda:",
        String.raw`AWSTemplateFormatVersion: '2010-09-09'
Description: My first stack
Resources:
  NotesBucket:
    Type: AWS::S3::Bucket
    Properties:
      VersioningConfiguration:
        Status: Enabled
      Tags:
        - Key: project
          Value: aws-path
Outputs:
  BucketName:
    Value: !Ref NotesBucket`, "yaml"),
      step("Search **CloudFormation** → **Create stack → With new resources** → **Upload a template file** → choose `bucket.yaml` → name the stack `first-stack` → Next → Next → **Submit**.", "Cari **CloudFormation** → **Create stack → With new resources** → **Upload a template file** → pilih `bucket.yaml` → namakan stack `first-stack` → Next → Next → **Submit**."),
      step("Watch the **Events** tab, then **Resources** and **Outputs**. The bucket name was generated for you.", "Perhatikan tab **Events**, kemudian **Resources** dan **Outputs**. Nama bucket dijana untuk anda."),
      step("Edit the file: change `Value: aws-path` to `Value: aws-path-v2`. Choose **Update → Replace existing template**, upload it, and on the last page read the **change set preview**: one resource is modified, nothing is deleted.", "Ubah fail: tukar `Value: aws-path` kepada `Value: aws-path-v2`. Pilih **Update → Replace existing template**, muat naik, dan di halaman terakhir baca **change set preview**: satu sumber diubah, tiada yang dipadam."),
      step("**Stack actions → Detect drift**. Then change the bucket's tags by hand in S3 and detect drift again. CloudFormation notices.", "**Stack actions → Detect drift**. Kemudian ubah tag bucket secara manual dalam S3 dan kesan drift sekali lagi. CloudFormation akan perasan.")
    ],
    cleanup: { t: s("Select `first-stack` → **Delete**. Everything it created is removed together.", "Pilih `first-stack` → **Delete**. Semua yang dicipta olehnya dibuang bersama.") }
  }
};

B.m08 = {
  simple: {
    analogy: s("**Lambda** is like a Grab driver instead of owning a car: you don't pay a monthly salary, you pay per trip, and if 1,000 people book at once, 1,000 drivers turn up. **API Gateway** is the front desk that takes requests and hands them to the right function. **Step Functions** is a checklist that makes sure every step of a long job happens in order.",
      "**Lambda** seperti menggunakan pemandu Grab berbanding memiliki kereta: anda tidak bayar gaji bulanan, anda bayar ikut perjalanan, dan jika 1,000 orang menempah serentak, 1,000 pemandu akan datang. **API Gateway** ialah kaunter hadapan yang menerima permintaan dan menyerahkannya kepada fungsi yang betul. **Step Functions** ialah senarai semak yang memastikan setiap langkah kerja panjang berlaku mengikut urutan."),
    plain: s("Serverless means you upload just your code. AWS runs it only when something happens (a web request, a file upload, a schedule), scales it automatically, and charges per run. When nothing happens, you pay nothing.",
      "Serverless bermaksud anda hanya memuat naik kod. AWS menjalankannya hanya apabila sesuatu berlaku (permintaan web, muat naik fail, jadual), menskalakannya secara automatik, dan mengecaj setiap kali ia dijalankan. Apabila tiada apa berlaku, anda tidak membayar apa-apa."),
    why: s("For many apps, serverless means no servers to patch and a bill close to zero while traffic is low.",
      "Bagi banyak aplikasi, serverless bermaksud tiada server untuk ditampal dan bil hampir sifar semasa trafik rendah.")
  },
  consoleLab: {
    title: s("A function with its own web address", "Fungsi dengan alamat web sendiri"), time: s("~20 min · free tier", "~20 min · free tier"),
    goal: s("Write, test and call a Lambda function in the browser.", "Tulis, uji dan panggil fungsi Lambda dalam pelayar."),
    steps: [
      step("Search **Lambda** → **Create function** → **Author from scratch**. Name `hello`, runtime **Python 3.13**, architecture **arm64** → Create.", "Cari **Lambda** → **Create function** → **Author from scratch**. Nama `hello`, runtime **Python 3.13**, seni bina **arm64** → Create."),
      step("Replace the code with this, then click **Deploy**:", "Gantikan kod dengan ini, kemudian klik **Deploy**:",
        String.raw`import json

def lambda_handler(event, context):
    params = event.get("queryStringParameters") or {}
    name = params.get("name", "cloud learner")
    return {"statusCode": 200, "body": json.dumps({"message": "Hello, " + name + "!"})}`, "python"),
      step("**Configuration → Function URL → Create function URL** → Auth type **NONE** (demo only) → Save. Open the URL, then add `?name=Adibah` to the end.", "**Configuration → Function URL → Create function URL** → Auth type **NONE** (demo sahaja) → Save. Buka URL itu, kemudian tambah `?name=Adibah` di hujungnya."),
      step("**Monitor** tab → **View CloudWatch logs**: each call left a log entry with its duration and memory used.", "Tab **Monitor** → **View CloudWatch logs**: setiap panggilan meninggalkan log dengan tempoh dan memori yang digunakan.")
    ],
    cleanup: { t: s("**Actions → Delete function**. Also delete its log group in CloudWatch if you like.", "**Actions → Delete function**. Padam juga log group dalam CloudWatch jika mahu.") }
  }
};

B.m09 = {
  simple: {
    analogy: s("**SQS** is the number-ticket queue at a bank: customers take a number and wait, and counters serve them when ready. **SNS** is a WhatsApp group announcement: one message, everyone in the group receives it. **EventBridge** is a smart mailroom that reads each letter and forwards it to the right department.",
      "**SQS** ialah sistem nombor giliran di bank: pelanggan ambil nombor dan tunggu, dan kaunter melayan apabila bersedia. **SNS** ialah pengumuman dalam kumpulan WhatsApp: satu mesej, semua ahli kumpulan menerimanya. **EventBridge** ialah bilik mel pintar yang membaca setiap surat dan menghantarnya ke jabatan yang betul."),
    plain: s("Instead of programs calling each other directly and waiting, they leave messages. A queue holds work until a worker is ready, so a sudden spike doesn't crash anything, and a failing worker doesn't lose orders.",
      "Daripada program memanggil satu sama lain secara terus dan menunggu, mereka meninggalkan mesej. Barisan gilir menyimpan kerja sehingga pekerja bersedia, jadi lonjakan mendadak tidak merosakkan apa-apa, dan pekerja yang gagal tidak menghilangkan pesanan."),
    why: s("Loosely connected systems survive spikes and partial failures much better.",
      "Sistem yang tidak terlalu bergantung antara satu sama lain lebih tahan terhadap lonjakan dan kegagalan separa.")
  },
  consoleLab: {
    title: s("Send, queue and receive messages", "Hantar, beratur dan terima mesej"), time: s("~25 min · free tier", "~25 min · free tier"),
    goal: s("Publish one message and receive it from a queue, with a safety net for failures.", "Terbitkan satu mesej dan terima dari barisan gilir, dengan jaring keselamatan untuk kegagalan."),
    steps: [
      step("Search **SQS** → **Create queue** `shipping-dlq` (Standard). Then create `shipping`, and under **Dead-letter queue** choose `shipping-dlq` with **Maximum receives 3**.", "Cari **SQS** → **Create queue** `shipping-dlq` (Standard). Kemudian cipta `shipping`, dan di bawah **Dead-letter queue** pilih `shipping-dlq` dengan **Maximum receives 3**."),
      step("Search **SNS** → **Topics → Create topic** (Standard) `orders`. Then **Create subscription** → protocol **Amazon SQS** → choose the `shipping` queue. (SNS offers to update the queue's permissions; accept.)", "Cari **SNS** → **Topics → Create topic** (Standard) `orders`. Kemudian **Create subscription** → protokol **Amazon SQS** → pilih barisan `shipping`. (SNS menawarkan untuk mengemas kini kebenaran barisan; terima.)"),
      step("In the topic, **Publish message** with body `{\"orderId\":\"1001\"}`.", "Dalam topik, **Publish message** dengan kandungan `{\"orderId\":\"1001\"}`."),
      step("Back in SQS → `shipping` → **Send and receive messages** → **Poll for messages**. Your message is there. Poll repeatedly without deleting it; after 3 receives it moves to `shipping-dlq`.", "Kembali ke SQS → `shipping` → **Send and receive messages** → **Poll for messages**. Mesej anda ada di situ. Poll berulang kali tanpa memadamnya; selepas 3 kali diterima ia berpindah ke `shipping-dlq`.")
    ],
    cleanup: { t: s("Delete the SNS topic and both queues.", "Padam topik SNS dan kedua-dua barisan gilir.") }
  }
};

B.m10 = {
  simple: {
    analogy: s("A **container** is a packed lunchbox: your app plus everything it needs, sealed so it tastes the same wherever it's opened. **ECR** is the fridge where lunchboxes are stored. **ECS** is the canteen manager who decides where each lunchbox is served. With **Fargate**, you don't even own the tables.",
      "**Container** ialah bekas bekal makanan: aplikasi anda serta segala keperluannya, dimeterai supaya rasanya sama di mana-mana ia dibuka. **ECR** ialah peti sejuk tempat bekas disimpan. **ECS** ialah pengurus kantin yang menentukan di mana setiap bekas dihidangkan. Dengan **Fargate**, anda tidak perlu memiliki meja pun."),
    plain: s("Containers package an app so it runs the same on a laptop and in the cloud. ECS runs and restarts them for you; Fargate means there are no servers to manage. EKS does the same job using Kubernetes.",
      "Container membungkus aplikasi supaya ia berjalan sama di komputer riba dan di cloud. ECS menjalankan dan memulakan semula container untuk anda; Fargate bermaksud tiada server perlu diurus. EKS melakukan kerja yang sama menggunakan Kubernetes."),
    why: s("Containers are the default way modern teams ship services, and \"works on my machine\" problems mostly disappear.",
      "Container ialah cara lalai pasukan moden menghantar perkhidmatan, dan masalah \"boleh jalan di komputer saya\" kebanyakannya hilang.")
  },
  consoleLab: {
    title: s("Run a public web container on Fargate", "Jalankan container web awam di Fargate"), time: s("~30 min · ~US$0.05/h", "~30 min · ~US$0.05/j"),
    goal: s("Run a ready-made nginx web server image without building anything.", "Jalankan imej pelayan web nginx yang siap tanpa membina apa-apa."),
    steps: [
      step("Search **ECS** → **Clusters → Create cluster** → name `lab` → infrastructure **AWS Fargate** → Create.", "Cari **ECS** → **Clusters → Create cluster** → nama `lab` → infrastruktur **AWS Fargate** → Create."),
      step("**Task definitions → Create new task definition**. Family `web`, launch type **Fargate**, 0.25 vCPU / 0.5 GB. Container name `web`, image `public.ecr.aws/docker/library/nginx:latest`, port **80** → Create.", "**Task definitions → Create new task definition**. Family `web`, launch type **Fargate**, 0.25 vCPU / 0.5 GB. Nama container `web`, imej `public.ecr.aws/docker/library/nginx:latest`, port **80** → Create."),
      step("Open cluster `lab` → **Services → Create**. Task definition `web`, desired tasks **2**. Under **Load balancing**, choose **Application Load Balancer** → create new → listener port 80 → Create.", "Buka kluster `lab` → **Services → Create**. Task definition `web`, desired tasks **2**. Di bawah **Load balancing**, pilih **Application Load Balancer** → cipta baharu → listener port 80 → Create."),
      step("When the service is stable, open **EC2 → Load balancers**, copy the **DNS name** and open it in your browser: \"Welcome to nginx!\" Stop one task by hand and watch ECS start a new one.", "Apabila servis stabil, buka **EC2 → Load balancers**, salin **DNS name** dan buka dalam pelayar: \"Welcome to nginx!\" Hentikan satu task secara manual dan lihat ECS memulakan yang baharu.")
    ],
    cleanup: { t: s("Delete the service (set desired tasks to 0 first if asked), then the load balancer and target group in EC2, then the cluster.", "Padam servis (tetapkan desired tasks kepada 0 dahulu jika diminta), kemudian load balancer dan target group dalam EC2, kemudian kluster.") }
  }
};

B.m11 = {
  simple: {
    analogy: s("**Route 53** is the phonebook that turns names into addresses. **CloudFront** is a chain of local photocopy shops: the first customer's request goes to head office, then copies are kept nearby so the next customers get them instantly.",
      "**Route 53** ialah buku telefon yang menukar nama kepada alamat. **CloudFront** ialah rangkaian kedai fotostat tempatan: permintaan pelanggan pertama dihantar ke ibu pejabat, kemudian salinan disimpan berdekatan supaya pelanggan seterusnya mendapatnya serta-merta."),
    plain: s("A CDN keeps copies of your website in hundreds of locations near users, so pages load fast everywhere and your servers do less work. It also adds HTTPS and shields you from attacks.",
      "CDN menyimpan salinan laman web anda di ratusan lokasi berhampiran pengguna, supaya halaman dimuatkan dengan pantas di mana-mana dan server anda kurang terbeban. Ia juga menambah HTTPS dan melindungi daripada serangan."),
    why: s("Speed affects how many users stay, and the edge is the cheapest place to stop bad traffic.",
      "Kelajuan mempengaruhi berapa ramai pengguna kekal, dan edge ialah tempat paling murah untuk menghalang trafik jahat.")
  },
  consoleLab: {
    title: s("Put CloudFront in front of a private bucket", "Letakkan CloudFront di hadapan bucket peribadi"), time: s("~30 min · free tier", "~30 min · free tier"),
    goal: s("The proper version of lesson 0.4: HTTPS, fast, and the bucket stays private.", "Versi yang betul bagi pelajaran 0.4: HTTPS, pantas, dan bucket kekal peribadi."),
    steps: [
      step("Create an S3 bucket with **Block all public access left on** and upload an `index.html` (reuse the one from lesson 0.4).", "Cipta bucket S3 dengan **Block all public access kekal dihidupkan** dan muat naik `index.html` (guna semula dari pelajaran 0.4)."),
      step("Search **CloudFront** → **Create distribution**. Origin: choose your bucket. **Origin access: Origin access control settings** → **Create new OAC**.", "Cari **CloudFront** → **Create distribution**. Origin: pilih bucket anda. **Origin access: Origin access control settings** → **Create new OAC**."),
      step("Viewer protocol policy **Redirect HTTP to HTTPS**. Default root object `index.html`. Create the distribution.", "Viewer protocol policy **Redirect HTTP to HTTPS**. Default root object `index.html`. Cipta distribution."),
      step("A banner says the bucket policy needs updating. Click **Copy policy**, then open the bucket → **Permissions → Bucket policy → Edit**, paste and save.", "Sepanduk memberitahu bucket policy perlu dikemas kini. Klik **Copy policy**, kemudian buka bucket → **Permissions → Bucket policy → Edit**, tampal dan simpan."),
      step("After a few minutes, open `https://<your-id>.cloudfront.net`. It works over HTTPS, while the bucket's own URL still says Access Denied.", "Selepas beberapa minit, buka `https://<id-anda>.cloudfront.net`. Ia berfungsi melalui HTTPS, manakala URL bucket sendiri masih menunjukkan Access Denied.")
    ],
    cleanup: { t: s("Disable the distribution, wait until it shows Disabled, then delete it. Then empty and delete the bucket.", "Nyahdayakan distribution, tunggu sehingga ia menunjukkan Disabled, kemudian padam. Kemudian kosongkan dan padam bucket.") }
  }
};

B.m12 = {
  simple: {
    analogy: s("A **CI/CD pipeline** is a factory conveyor belt: every change is automatically checked, packed and delivered the same way, and quality inspectors (tests) can stop the line. A **canary release** is a food taster: a few users try the new version first, and if they're fine, everyone gets it.",
      "**CI/CD pipeline** ialah tali sawat kilang: setiap perubahan disemak, dibungkus dan dihantar secara automatik dengan cara yang sama, dan pemeriksa kualiti (ujian) boleh menghentikan barisan. **Canary release** ialah perasa makanan: beberapa pengguna mencuba versi baharu dahulu, dan jika tiada masalah, semua orang mendapatnya."),
    plain: s("A pipeline takes code from your Git repository, tests it, and deploys it to AWS automatically, using temporary credentials instead of saved passwords. New versions are released gradually and rolled back automatically if errors rise.",
      "Pipeline mengambil kod dari repositori Git anda, mengujinya, dan menghantarnya ke AWS secara automatik, menggunakan kelayakan sementara dan bukannya kata laluan yang disimpan. Versi baharu dilepaskan secara berperingkat dan dibatalkan secara automatik jika ralat meningkat."),
    why: s("Teams that deploy small changes often, safely, ship faster and break less.",
      "Pasukan yang menghantar perubahan kecil dengan kerap dan selamat bergerak lebih pantas dan kurang merosakkan sistem.")
  },
  consoleLab: {
    title: s("Connect GitHub to AWS without passwords", "Sambungkan GitHub ke AWS tanpa kata laluan"), time: s("~20 min · free", "~20 min · percuma"),
    goal: s("You need a GitHub account and a repository. The workflow file is in the Command line tab.", "Anda perlukan akaun GitHub dan repositori. Fail workflow ada dalam tab Baris arahan."),
    steps: [
      step("**IAM → Identity providers → Add provider** → **OpenID Connect**. Provider URL `https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com` → Add.", "**IAM → Identity providers → Add provider** → **OpenID Connect**. Provider URL `https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com` → Add."),
      step("**Roles → Create role** → **Web identity** → choose that provider. Fill in your **GitHub organization** (your username), **repository** and **branch** `main`.", "**Roles → Create role** → **Web identity** → pilih provider itu. Isi **GitHub organization** (nama pengguna anda), **repository** dan **branch** `main`."),
      step("Attach a small permission for testing, such as **AmazonS3ReadOnlyAccess**. Name the role `gha-deploy`.", "Lampirkan kebenaran kecil untuk ujian, seperti **AmazonS3ReadOnlyAccess**. Namakan role `gha-deploy`."),
      step("Open the role → **Trust relationships**: the `sub` condition only allows your repo's `main` branch. That line is your security boundary.", "Buka role → **Trust relationships**: syarat `sub` hanya membenarkan branch `main` repo anda. Baris itulah sempadan keselamatan anda."),
      step("In GitHub, add the workflow file from the **Command line** tab, with the last two steps replaced by `aws s3 ls`. Push and check that the run lists your buckets.", "Dalam GitHub, tambah fail workflow dari tab **Baris arahan**, dengan dua langkah terakhir diganti dengan `aws s3 ls`. Push dan semak bahawa larian menyenaraikan bucket anda.")
    ],
    cleanup: { t: s("Delete the role. Keep the identity provider if you'll do the capstone.", "Padam role. Simpan identity provider jika anda akan membuat capstone.") }
  }
};

B.m13 = {
  simple: {
    analogy: s("Observability is a car dashboard. **Metrics** are the speedometer and fuel gauge, **logs** are the trip diary, **traces** are the GPS route of one journey, and **alarms** are the warning light. **CloudTrail** is the CCTV recording of who did what in your account.",
      "Observability ialah papan pemuka kereta. **Metrik** ialah meter laju dan tolok minyak, **log** ialah diari perjalanan, **trace** ialah laluan GPS satu perjalanan, dan **alarm** ialah lampu amaran. **CloudTrail** ialah rakaman CCTV tentang siapa melakukan apa dalam akaun anda."),
    plain: s("You can't fix what you can't see. CloudWatch collects numbers and logs from your apps and wakes someone up when users are affected. CloudTrail records every action taken in your account.",
      "Anda tidak boleh membaiki apa yang anda tidak nampak. CloudWatch mengumpul nombor dan log daripada aplikasi anda dan memaklumkan seseorang apabila pengguna terjejas. CloudTrail merekodkan setiap tindakan dalam akaun anda."),
    why: s("Good monitoring turns a 3-hour outage into a 10-minute one.",
      "Pemantauan yang baik menukar gangguan 3 jam kepada 10 minit.")
  },
  consoleLab: {
    title: s("An alarm, a log search and an audit trail", "Alarm, carian log dan jejak audit"), time: s("~25 min · free tier", "~25 min · free tier"),
    goal: s("Uses the `hello` Lambda function from module 08 (recreate it if you deleted it).", "Menggunakan fungsi Lambda `hello` dari modul 08 (cipta semula jika sudah dipadam)."),
    steps: [
      step("Search **CloudWatch** → **Alarms → Create alarm → Select metric** → Lambda → By Function Name → `hello` → **Errors**. Condition: greater than 0 for 1 period. Notification: create a new SNS topic with your email → Create alarm. Confirm the email AWS sends you.", "Cari **CloudWatch** → **Alarms → Create alarm → Select metric** → Lambda → By Function Name → `hello` → **Errors**. Syarat: lebih daripada 0 untuk 1 tempoh. Notifikasi: cipta topik SNS baharu dengan e-mel anda → Create alarm. Sahkan e-mel yang dihantar AWS."),
      step("**Logs → Log groups** → `/aws/lambda/hello` → **Actions → Edit retention** → 1 week. Logs kept forever are billed forever.", "**Logs → Log groups** → `/aws/lambda/hello` → **Actions → Edit retention** → 1 minggu. Log yang disimpan selama-lamanya dicaj selama-lamanya."),
      step("**Logs Insights** → choose the log group → run the default query. Change it to `filter @message like /Hello/` and run it again.", "**Logs Insights** → pilih log group → jalankan pertanyaan lalai. Tukar kepada `filter @message like /Hello/` dan jalankan semula."),
      step("Search **CloudTrail** → **Event history** → filter **Event name** = `CreateFunction20150331` (or browse). You can see exactly who created the function and when.", "Cari **CloudTrail** → **Event history** → tapis **Event name** = `CreateFunction20150331` (atau semak imbas). Anda boleh lihat dengan tepat siapa mencipta fungsi itu dan bila.")
    ],
    cleanup: { t: s("Delete the alarm and the SNS topic.", "Padam alarm dan topik SNS.") }
  }
};

B.m14 = {
  simple: {
    analogy: s("Cloud security works in layers, like a bank: a guard at the gate (**WAF** and **Shield**), locked doors (security groups), staff badges (IAM), a vault with its own key (**KMS** encryption), a key box for passwords (**Secrets Manager**), and a CCTV room watched by experts (**GuardDuty**).",
      "Keselamatan cloud berfungsi secara berlapis, seperti bank: pengawal di pintu pagar (**WAF** dan **Shield**), pintu berkunci (security group), lencana kakitangan (IAM), bilik kebal dengan kunci tersendiri (penyulitan **KMS**), peti kunci untuk kata laluan (**Secrets Manager**), dan bilik CCTV yang dipantau pakar (**GuardDuty**)."),
    plain: s("No single control is enough. You block bad traffic at the edge, keep passwords out of code, encrypt data with keys you control, and run detection services that assume an attacker might get in anyway.",
      "Tiada satu kawalan pun yang mencukupi. Anda menyekat trafik jahat di edge, menyimpan kata laluan di luar kod, menyulitkan data dengan kunci yang anda kawal, dan menjalankan perkhidmatan pengesanan yang menganggap penyerang mungkin tetap berjaya masuk."),
    why: s("Security reviews decide whether a design goes to production. Architects are expected to know these layers.",
      "Semakan keselamatan menentukan sama ada sesuatu reka bentuk boleh ke produksi. Arkitek dijangka memahami lapisan ini.")
  },
  consoleLab: {
    title: s("Keys, secrets and threat detection", "Kunci, rahsia dan pengesanan ancaman"), time: s("~30 min · about US$1", "~30 min · kira-kira US$1"),
    goal: s("Turn on the core security services and see what a threat finding looks like.", "Hidupkan perkhidmatan keselamatan teras dan lihat rupa dapatan ancaman."),
    steps: [
      step("Search **KMS** → **Create key** → Symmetric → alias `lab-app` → choose yourself as key administrator and user → Finish. Open it → **Key rotation** → enable.", "Cari **KMS** → **Create key** → Symmetric → alias `lab-app` → pilih diri anda sebagai pentadbir dan pengguna kunci → Finish. Buka → **Key rotation** → hidupkan."),
      step("Search **Secrets Manager** → **Store a new secret** → **Other type of secret** → key `password`, value anything → encryption key `lab-app` → name `lab/db` → Store.", "Cari **Secrets Manager** → **Store a new secret** → **Other type of secret** → kunci `password`, nilai apa-apa → kunci penyulitan `lab-app` → nama `lab/db` → Store."),
      step("Search **GuardDuty** → **Get started → Enable**. Then **Settings → Generate sample findings** and open **Findings**. Read one: what happened, which resource, how severe.", "Cari **GuardDuty** → **Get started → Enable**. Kemudian **Settings → Generate sample findings** dan buka **Findings**. Baca satu: apa yang berlaku, sumber mana, tahap keterukan."),
      step("Search **Security Hub** → enable it with the default standards. After a few hours it gives your account a security score and a to-do list.", "Cari **Security Hub** → hidupkan dengan standard lalai. Selepas beberapa jam ia memberi skor keselamatan akaun dan senarai tindakan.")
    ],
    cleanup: { t: s("Delete the secret, schedule the KMS key for deletion (7 days), and disable GuardDuty and Security Hub if this is only a sandbox.", "Padam rahsia, jadualkan kunci KMS untuk dipadam (7 hari), dan nyahdayakan GuardDuty dan Security Hub jika ini hanya akaun sandbox.") }
  }
};

B.m15 = {
  simple: {
    analogy: s("Resilience is having a spare tyre and a backup generator. **RPO** is how much homework you'd lose if your laptop died: everything since your last save. **RTO** is how long until you're working again on a borrowed laptop.",
      "Ketahanan bermaksud mempunyai tayar ganti dan janakuasa simpanan. **RPO** ialah berapa banyak kerja rumah yang hilang jika komputer riba anda rosak: semua sejak simpanan terakhir. **RTO** ialah berapa lama sebelum anda boleh bekerja semula menggunakan komputer riba yang dipinjam."),
    plain: s("Everything breaks eventually. You run in several Availability Zones so one failure doesn't matter, keep backups in a separate place, decide how much downtime and data loss the business can accept, and practise recovering.",
      "Segalanya akan rosak suatu hari nanti. Anda menjalankan sistem di beberapa Availability Zone supaya satu kegagalan tidak memberi kesan, menyimpan sandaran di tempat berasingan, menentukan berapa lama gangguan dan kehilangan data yang boleh diterima perniagaan, dan berlatih memulihkan sistem."),
    why: s("An untested backup is only a hope. Practising recovery is what makes it real.",
      "Sandaran yang tidak diuji hanyalah harapan. Berlatih memulihkan sistem yang menjadikannya nyata.")
  },
  consoleLab: {
    title: s("Automatic backups and a health check", "Sandaran automatik dan semakan kesihatan"), time: s("~25 min · cents", "~25 min · beberapa sen"),
    goal: s("Back up anything tagged `backup=daily` and watch a website's health from around the world.", "Sandarkan apa sahaja yang bertag `backup=daily` dan pantau kesihatan laman web dari seluruh dunia."),
    steps: [
      step("Search **AWS Backup** → **Backup plans → Create backup plan** → **Start with a template** → **Daily-35day-Retention** → name it → Create.", "Cari **AWS Backup** → **Backup plans → Create backup plan** → **Start with a template** → **Daily-35day-Retention** → namakan → Create."),
      step("**Assign resources** → role **Default role** → **Include specific resource types** or tags → tag key `backup`, value `daily` → Assign.", "**Assign resources** → role **Default role** → **Include specific resource types** atau tag → kunci tag `backup`, nilai `daily` → Assign."),
      step("Add the tag `backup` = `daily` to the DynamoDB table from module 06 (or any resource). Next day, check **Jobs** for a completed backup and try **Restore** into a new table.", "Tambah tag `backup` = `daily` pada jadual DynamoDB dari modul 06 (atau mana-mana sumber). Esoknya, semak **Jobs** untuk sandaran yang selesai dan cuba **Restore** ke jadual baharu."),
      step("Search **Route 53** → **Health checks → Create health check** → endpoint by domain name, e.g. your CloudFront domain from module 11 → path `/`. AWS checks it from several Regions every 30 seconds.", "Cari **Route 53** → **Health checks → Create health check** → endpoint melalui nama domain, contohnya domain CloudFront anda dari modul 11 → laluan `/`. AWS menyemaknya dari beberapa Region setiap 30 saat.")
    ],
    cleanup: { t: s("Delete the health check, the backup plan and any restored table. Recovery points expire on their own.", "Padam health check, backup plan dan sebarang jadual yang dipulihkan. Titik pemulihan akan tamat dengan sendirinya.") }
  }
};

B.m16 = {
  simple: {
    analogy: s("Managing cloud cost is like managing household bills. A **budget** is the alert from your bank app. **Tags** are labels on receipts, so you know who spent what. A **Savings Plan** is a yearly gym membership: cheaper per visit, but only if you'll definitely keep going.",
      "Mengurus kos cloud seperti mengurus bil isi rumah. **Bajet** ialah amaran daripada aplikasi bank anda. **Tag** ialah label pada resit, supaya anda tahu siapa berbelanja apa. **Savings Plan** ialah keahlian gim tahunan: lebih murah setiap lawatan, tetapi hanya jika anda pasti akan terus pergi."),
    plain: s("The cloud makes spending easy, so you need visibility (who spends what), alerts (when it jumps), and discipline (switch off what you don't use, commit only to what you always use).",
      "Cloud memudahkan perbelanjaan, jadi anda perlukan keterlihatan (siapa berbelanja apa), amaran (apabila ia melonjak), dan disiplin (matikan apa yang tidak digunakan, buat komitmen hanya untuk apa yang sentiasa digunakan)."),
    why: s("Many companies waste a large share of their cloud bill. Architects who can reduce it are valued.",
      "Banyak syarikat membazirkan sebahagian besar bil cloud mereka. Arkitek yang boleh mengurangkannya amat dihargai.")
  },
  consoleLab: {
    title: s("Find where your money goes", "Cari ke mana wang anda pergi"), time: s("~20 min · free", "~20 min · percuma"),
    goal: s("Read your own bill like an architect.", "Baca bil anda sendiri seperti seorang arkitek."),
    steps: [
      step("Search **Cost Explorer** → **Reports → New** (or the default view). Group by **Service**, last 3 months, daily. Which service costs the most?", "Cari **Cost Explorer** → **Reports → New** (atau paparan lalai). Kumpulkan mengikut **Service**, 3 bulan lepas, harian. Perkhidmatan mana paling mahal?"),
      step("Change **Group by** to **Usage type**. Look for names containing `NatGateway`, `DataTransfer-Out` or `EBS:VolumeUsage`: the usual surprises.", "Tukar **Group by** kepada **Usage type**. Cari nama yang mengandungi `NatGateway`, `DataTransfer-Out` atau `EBS:VolumeUsage`: punca kejutan yang biasa."),
      step("**Billing → Cost allocation tags** → activate the `project` tag. From tomorrow you can group costs by it.", "**Billing → Cost allocation tags** → aktifkan tag `project`. Mulai esok anda boleh mengumpulkan kos mengikut tag itu."),
      step("**Cost Anomaly Detection → Create monitor** → AWS services → alert to your email. It warns you within about a day if spending jumps.", "**Cost Anomaly Detection → Create monitor** → AWS services → amaran ke e-mel anda. Ia memberi amaran dalam kira-kira sehari jika perbelanjaan melonjak."),
      step("**EC2 → Volumes**: filter **State = available**. These disks aren't attached to anything but are still billed.", "**EC2 → Volumes**: tapis **State = available**. Cakera ini tidak disambungkan pada apa-apa tetapi masih dicaj.")
    ],
    cleanup: { t: s("Keep the anomaly monitor. It's free.", "Simpan anomaly monitor. Ia percuma.") }
  }
};

B.m17 = {
  simple: {
    analogy: s("A big company has many departments, each with its own office (**AWS account**) so a mess in one doesn't spread. **Organizations** is head office setting company-wide rules (**SCPs**) that no department can break. **Transit Gateway** is the central lift lobby connecting every floor, and **VPN / Direct Connect** is the private road to the old office building (on-premises).",
      "Syarikat besar mempunyai banyak jabatan, setiap satu dengan pejabat sendiri (**akaun AWS**) supaya masalah di satu jabatan tidak merebak. **Organizations** ialah ibu pejabat yang menetapkan peraturan seluruh syarikat (**SCP**) yang tidak boleh dilanggar mana-mana jabatan. **Transit Gateway** ialah lobi lif utama yang menghubungkan setiap tingkat, dan **VPN / Direct Connect** ialah jalan persendirian ke bangunan pejabat lama (on-premises)."),
    plain: s("Real companies use many AWS accounts, separated by team and environment, with central rules and a shared network hub that also connects to their own data centres.",
      "Syarikat sebenar menggunakan banyak akaun AWS, diasingkan mengikut pasukan dan persekitaran, dengan peraturan pusat dan hab rangkaian bersama yang turut menyambung ke pusat data mereka sendiri."),
    why: s("This is where you design for a whole company instead of a single app.",
      "Di sinilah anda mereka bentuk untuk seluruh syarikat, bukan hanya satu aplikasi.")
  },
  consoleLab: {
    title: s("An organisation with a guardrail", "Organisasi dengan pagar keselamatan"), time: s("~25 min · free", "~25 min · percuma"),
    goal: s("Use your sandbox as the management account for this lab only.", "Gunakan akaun sandbox anda sebagai akaun pengurusan untuk makmal ini sahaja."),
    steps: [
      step("Search **AWS Organizations** → **Create an organization**.", "Cari **AWS Organizations** → **Create an organization**."),
      step("**AWS accounts** → select **Root** → **Actions → Create new** organizational unit `Workloads`.", "**AWS accounts** → pilih **Root** → **Actions → Create new** organizational unit `Workloads`."),
      step("**Policies → Service control policies → Enable**. **Create policy** `region-deny`, paste the JSON from the **Command line** tab, save.", "**Policies → Service control policies → Enable**. **Create policy** `region-deny`, tampal JSON dari tab **Baris arahan**, simpan."),
      step("Attach `region-deny` to the `Workloads` OU. Any account you later move there can only use approved Regions, even its administrators.", "Lampirkan `region-deny` pada OU `Workloads`. Mana-mana akaun yang anda pindahkan ke situ hanya boleh menggunakan Region yang diluluskan, termasuk pentadbirnya."),
      step("Read about **AWS Control Tower** in the console. It sets all of this up for you, plus logging and audit accounts, and it's what most companies use.", "Baca tentang **AWS Control Tower** dalam console. Ia menyediakan semua ini untuk anda, termasuk akaun log dan audit, dan inilah yang digunakan kebanyakan syarikat.")
    ],
    cleanup: { t: s("Detach and delete the SCP. You can leave the organisation in place.", "Tanggalkan dan padam SCP. Anda boleh biarkan organisasi itu.") }
  }
};

B.m18 = {
  simple: {
    analogy: s("A **data lake** is a huge library storeroom where every book is shelved as it arrived. **Glue** is the librarian who catalogues and tidies them. **Athena** lets you ask questions in SQL without moving any books. **Bedrock** is an AI assistant that first reads the right books, then answers you in plain language.",
      "**Data lake** ialah stor perpustakaan yang besar di mana setiap buku disimpan seperti ia diterima. **Glue** ialah pustakawan yang mengkatalog dan menyusunnya. **Athena** membolehkan anda bertanya soalan dalam SQL tanpa memindahkan sebarang buku. **Bedrock** ialah pembantu AI yang membaca buku yang betul dahulu, kemudian menjawab anda dalam bahasa mudah."),
    plain: s("Companies collect all their data in S3, organise it, and then query it with SQL or ask an AI model about it, without copying it into many separate systems.",
      "Syarikat mengumpul semua data mereka dalam S3, menyusunnya, kemudian membuat pertanyaan menggunakan SQL atau bertanya kepada model AI tentangnya, tanpa menyalinnya ke banyak sistem berasingan."),
    why: s("Data and AI are part of most new projects, and architects are expected to design for both.",
      "Data dan AI menjadi sebahagian daripada kebanyakan projek baharu, dan arkitek dijangka mereka bentuk untuk kedua-duanya.")
  },
  consoleLab: {
    title: s("Ask questions of a file, then ask an AI", "Tanya soalan tentang fail, kemudian tanya AI"), time: s("~30 min · under US$1", "~30 min · bawah US$1"),
    goal: s("Run SQL on a CSV file in S3 and chat with a model in the Bedrock playground.", "Jalankan SQL pada fail CSV dalam S3 dan bersembang dengan model dalam Bedrock playground."),
    steps: [
      step("Create a bucket `lab-lake-<your name>` and upload the `sales.csv` from the **Command line** tab into a folder `raw/sales/`.", "Cipta bucket `lab-lake-<nama anda>` dan muat naik `sales.csv` dari tab **Baris arahan** ke dalam folder `raw/sales/`."),
      step("Search **Athena** → **Query editor** → **Settings → Manage** → query result location `s3://lab-lake-<your name>/athena/` → Save.", "Cari **Athena** → **Query editor** → **Settings → Manage** → lokasi hasil pertanyaan `s3://lab-lake-<nama anda>/athena/` → Save."),
      step("Paste the SQL from the **Command line** tab (replace `<LAKE>` with your bucket name) and run each statement. The last one shows revenue by customer.", "Tampal SQL dari tab **Baris arahan** (gantikan `<LAKE>` dengan nama bucket anda) dan jalankan setiap pernyataan. Yang terakhir menunjukkan hasil jualan mengikut pelanggan."),
      step("Search **Amazon Bedrock** → **Playgrounds → Chat** → **Select model** (request access first if asked). Paste the results and ask: \"Write a two-sentence sales update.\"", "Cari **Amazon Bedrock** → **Playgrounds → Chat** → **Select model** (mohon akses dahulu jika diminta). Tampal hasil itu dan tanya: \"Tulis kemas kini jualan dalam dua ayat.\"")
    ],
    cleanup: { t: s("In Athena run `DROP TABLE` / `DROP DATABASE` for what you created, then empty and delete the bucket.", "Dalam Athena jalankan `DROP TABLE` / `DROP DATABASE` untuk apa yang anda cipta, kemudian kosongkan dan padam bucket.") }
  }
};

B.m19 = {
  simple: {
    analogy: s("A Well-Architected review is like a car's yearly inspection (PUSPAKOM in Malaysia). The inspector checks brakes, lights and emissions against a checklist and gives you a list of things to fix. AWS's checklist has six areas called **pillars**.",
      "Semakan Well-Architected seperti pemeriksaan tahunan kereta (PUSPAKOM di Malaysia). Pemeriksa menyemak brek, lampu dan pelepasan asap berdasarkan senarai semak dan memberi senarai perkara untuk dibaiki. Senarai semak AWS mempunyai enam bidang yang dipanggil **pillar** (tonggak)."),
    plain: s("AWS publishes a framework of best practices across six areas: operations, security, reliability, performance, cost and sustainability. Architects use it to review designs, record trade-offs and plan improvements.",
      "AWS menerbitkan rangka kerja amalan terbaik merangkumi enam bidang: operasi, keselamatan, kebolehpercayaan, prestasi, kos dan kelestarian. Arkitek menggunakannya untuk menyemak reka bentuk, merekod pertukaran keputusan dan merancang penambahbaikan."),
    why: s("It's the shared language of design reviews and interviews for architect roles.",
      "Ia bahasa bersama dalam semakan reka bentuk dan temu duga untuk jawatan arkitek.")
  },
  consoleLab: {
    title: s("Review something you built", "Semak sesuatu yang anda bina"), time: s("~45 min · free", "~45 min · percuma"),
    goal: s("Get an honest risk list for your own work.", "Dapatkan senarai risiko yang jujur untuk kerja anda sendiri."),
    steps: [
      step("Search **Well-Architected Tool** → **Define workload**. Name `my-labs`, environment **Pre-production**, Region yours → Next → lens **AWS Well-Architected Framework** → Define.", "Cari **Well-Architected Tool** → **Define workload**. Nama `my-labs`, persekitaran **Pre-production**, Region anda → Next → lens **AWS Well-Architected Framework** → Define."),
      step("**Start reviewing**. Answer the **Security** pillar questions honestly. Each question has a helpful **Info** panel explaining the best practices.", "**Start reviewing**. Jawab soalan pillar **Security** dengan jujur. Setiap soalan ada panel **Info** yang menerangkan amalan terbaik."),
      step("Do the same for **Reliability**. Then open the **Improvement plan**: your risks, ordered by importance.", "Lakukan yang sama untuk **Reliability**. Kemudian buka **Improvement plan**: risiko anda, disusun mengikut kepentingan."),
      step("**Save milestone** named `baseline`. After the capstone, review again and compare.", "**Save milestone** bernama `baseline`. Selepas capstone, semak semula dan bandingkan.")
    ],
    cleanup: { t: s("Keep the workload. It's free.", "Simpan workload itu. Ia percuma.") }
  }
};

B.capstone = {
  simple: {
    analogy: s("The capstone is your driving test. You've learned the parts of the car one at a time; now you drive a full route, handle a breakdown, and explain your choices to the examiner.",
      "Capstone ialah ujian memandu anda. Anda telah mempelajari bahagian kereta satu demi satu; kini anda memandu laluan penuh, mengendalikan kerosakan, dan menerangkan pilihan anda kepada pemeriksa."),
    plain: s("You'll build a small online shop's order system end to end: website, sign-in, orders, invoices, monitoring, backups and an automated pipeline. Then you document why you built it that way.",
      "Anda akan membina sistem pesanan kedai dalam talian kecil dari awal hingga akhir: laman web, log masuk, pesanan, invois, pemantauan, sandaran dan pipeline automatik. Kemudian anda dokumenkan kenapa anda membinanya dengan cara itu."),
    why: s("It's a portfolio project you can show and explain in a job interview.",
      "Ia projek portfolio yang boleh anda tunjukkan dan terangkan semasa temu duga kerja.")
  }
};

C.beginner = B;
})(window.COURSE);
