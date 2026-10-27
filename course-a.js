window.COURSE = window.COURSE || {};
(function (C) {
C.intro = "A 19-module path for engineers who already know Linux, networking and code, and now want to design production systems on AWS. Every module pairs the mental model with an animated flow, a real lab and the cost and security questions a design review will ask.";
C.phases = [
  { n: 1, short: "Foundations", title: "Foundations", weeks: "weeks 1–6", blurb: "The primitives every AWS design is made of: identity, networks, compute, storage and databases." },
  { n: 2, short: "Build", title: "Build modern apps", weeks: "weeks 7–10", blurb: "Infrastructure as code, serverless, events, containers, the edge and delivery pipelines." },
  { n: 3, short: "Operate", title: "Run it in production", weeks: "weeks 11–13", blurb: "See what is happening, keep it secure, survive failure and keep the bill sane." },
  { n: 4, short: "Scale", title: "Architect at scale", weeks: "weeks 14–16", blurb: "Many accounts, hybrid networks, data and AI platforms, and the review practice that ties it together." }
];
C.schedule = {
  cols: ["Weeks", "Modules", "Milestone"],
  rows: [
    ["1–2", "01 Global infrastructure, 02 IAM", "Locked-down sandbox account with SSO, budget and CloudTrail"],
    ["3–4", "03 VPC, 04 Compute", "Two-AZ VPC with an auto-scaling web tier behind an ALB"],
    ["5–6", "05 Storage, 06 Databases", "S3 lifecycle + a DynamoDB access-pattern model"],
    ["7–8", "07 IaC, 08 Serverless, 09 Events", "Everything from now on is deployed from code"],
    ["9–10", "10 Containers, 11 Edge, 12 CI/CD", "Containerised API behind CloudFront, shipped by a pipeline. Good time to sit the Associate exam."],
    ["11–13", "13 Observability, 14 Security, 15 Resilience, 16 Cost", "Alarms, encryption, a game day and a cost report"],
    ["14–16", "17 Multi-account, 18 Data & AI, 19 Well-Architected, Capstone", "Capstone demo + Well-Architected review"]
  ]
};
C.certs = [
  { code: "SAA", name: "Solutions Architect – Associate" },
  { code: "SAP", name: "Solutions Architect – Professional" },
  { code: "DOP", name: "DevOps Engineer – Professional" },
  { code: "SCS", name: "Security – Specialty" },
  { code: "ANS", name: "Advanced Networking – Specialty" }
];
C.certNote = "Certs are a side effect here, not the goal. A sensible order for a job-ready architect: sit **SAA** after week 10, then aim for **SAP** after the capstone and a few months of real projects. DOP, SCS and ANS are optional specialisations.";
C.prereqs = [
  "Comfortable in a Linux shell, with Git, and with one language (examples use Python, TypeScript and Bash).",
  "Networking basics: CIDR, TCP vs UDP, DNS, TLS, HTTP status codes.",
  "Install AWS CLI v2, Node.js 20+ (for CDK), Terraform 1.10+, Docker and the SAM CLI.",
  "Labs default to `ap-southeast-1` (Singapore). Swap in the Region closest to you, such as `ap-southeast-5` (Malaysia)."
];
C.sandbox = [
  "Use a **dedicated sandbox account**, never one that holds anything real.",
  "Create an AWS Budget with an 80% alert in the first 10 minutes (module 01 lab).",
  "Every lab ends with a **Clean up** step. NAT gateways, load balancers, EKS clusters and databases bill by the hour even when idle.",
  "Tag everything `project=aws-path` so you can find stragglers with the Tag Editor.",
  "Never commit access keys. Use `aws configure sso` and short-lived credentials from day one."
];
C.group = [
  "Share this page link. Each person's progress and quiz answers are stored in their own browser, so nobody overwrites anyone else.",
  "Meet weekly for 60 minutes: 10 minutes replaying the module's flow diagram, 30 minutes reviewing each other's lab output, 20 minutes arguing about the scenario questions.",
  "Rotate a 'design reviewer' role. That person asks the Cost watch and Security checklist questions about someone else's lab.",
  "For the capstone, pair up and review each other's ADRs using the rubric."
];
C.modules = [];
const M = m => C.modules.push(m);

/* ===================== 01 ===================== */
M({
  id: "m01", phase: 1, title: "Global Infrastructure & Account Setup", hours: 4,
  services: ["Regions & AZs", "Organizations", "IAM Identity Center", "Budgets", "CloudTrail"],
  summary: "AWS is a set of isolated Regions, each made of several Availability Zones, fronted by hundreds of edge locations. Your first architectural decisions are where workloads live and how the account itself is secured.",
  outcomes: [
    "Choose a Region using latency, data residency, service availability and price.",
    "Explain why an AZ name like `ap-southeast-1a` is not the same physical place in two accounts.",
    "Separate what AWS secures from what you secure under the shared responsibility model.",
    "Lock down a new account: root MFA, SSO users, budget alert and audit trail."
  ],
  concepts: [
    ["Region", "A geographic area with 3+ AZs and its own control plane. Regions are isolated: data does not leave one unless you move it."],
    ["Availability Zone", "One or more data centres with independent power, cooling and network, linked to the other AZs by low-latency fibre. Use the **AZ ID** (`apse1-az1`) to align AZs across accounts."],
    ["Edge locations", "Points of presence for CloudFront, Route 53, WAF and Global Accelerator. Local Zones and Wavelength push compute closer still."],
    ["Shared responsibility", "AWS secures the cloud (hardware, hypervisor, managed-service internals). You secure what you put in it: IAM, network rules, data, OS patches on EC2."],
    ["Account = boundary", "An AWS account is the hard boundary for security, quotas and billing. Mature setups use many accounts per team and environment (module 17)."],
    ["Root vs SSO users", "Root can do anything and can't be restricted by IAM policy. Humans sign in through IAM Identity Center and get temporary credentials."]
  ],
  diagram: {
    title: "A request meets the global network",
    groups: [
      { x: 20, y: 64, w: 530, h: 316, l: "REGION · ap-southeast-1 (Singapore)", k: "region" },
      { x: 38, y: 96, w: 156, h: 180, l: "AZ a", k: "az" },
      { x: 206, y: 96, w: 156, h: 180, l: "AZ b", k: "az" },
      { x: 374, y: 96, w: 156, h: 180, l: "AZ c", k: "az" }
    ],
    nodes: [
      { id: "user", x: 680, y: 60, l: "User", s: "Kuala Lumpur", k: "user" },
      { id: "edge", x: 680, y: 190, l: "Edge location", s: "CloudFront PoP", k: "edge" },
      { id: "dcA", x: 116, y: 190, l: "Data centre(s)", s: "apse1-az1", k: "compute" },
      { id: "dcB", x: 284, y: 190, l: "Data centre(s)", s: "apse1-az2", k: "compute" },
      { id: "dcC", x: 452, y: 190, l: "Data centre(s)", s: "apse1-az3", k: "compute" },
      { id: "s3", x: 284, y: 330, l: "Regional service", s: "S3, DynamoDB, SQS", k: "data" },
      { id: "r2", x: 680, y: 330, l: "Region eu-west-1", s: "Ireland", k: "net" }
    ],
    steps: [
      { p: [["user", "edge"]], t: "The request first reaches the nearest edge location. There are hundreds of these, far more than Regions, so TLS and caching happen close to the user." },
      { p: [["edge", "dcA"]], t: "On a cache miss the request rides the AWS private backbone to the origin Region instead of the public internet." },
      { p: [["dcA", "dcB"], ["dcA", "dcC"]], t: "AZs are kilometres apart but linked by redundant low-latency fibre, so **synchronous** replication between them (RDS Multi-AZ, EFS) is practical." },
      { p: [["dcA", "s3"], ["dcB", "s3"], ["dcC", "s3"]], t: "**Regional** services such as S3 and DynamoDB already spread data across AZs. **Zonal** resources (an EC2 instance, an EBS volume, a subnet) live in exactly one AZ, and that is where you design for failure." },
      { p: [["dcC", "r2"]], async: true, t: "Cross-Region replication is **asynchronous and opt-in**. Use it for disaster recovery or latency, and check data-residency rules first." }
    ]
  },
  lab: {
    title: "Secure a brand-new account", time: "~45 min · free",
    goal: "Turn a fresh account into a safe sandbox: no root usage, SSO sign-in, a budget alarm and a way to see who did what.",
    steps: [
      { t: "In the console as root: add a passkey or hardware MFA, delete any root access keys, then enable **IAM Identity Center** and create an admin user with the `AdministratorAccess` permission set. Sign out of root for good." },
      { t: "Configure the CLI with SSO (short-lived credentials, nothing stored long-term) and confirm who you are.", c: String.raw`aws configure sso            # profile name: sandbox, region: ap-southeast-1
aws sso login --profile sandbox
export AWS_PROFILE=sandbox
aws sts get-caller-identity
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)` },
      { t: "Create a monthly budget that emails you at 80% of US$20.", c: String.raw`aws budgets create-budget --account-id $ACCOUNT_ID \
  --budget '{"BudgetName":"sandbox-20usd","BudgetLimit":{"Amount":"20","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
  --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":80,"ThresholdType":"PERCENTAGE"},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"you@example.com"}]}]'` },
      { t: "See the AZ name → AZ ID mapping for your account. Compare with a classmate's account: the names may map to different IDs.", c: String.raw`aws ec2 describe-availability-zones --region ap-southeast-1 \
  --query 'AvailabilityZones[].[ZoneName,ZoneId,State]' --output table` },
      { t: "CloudTrail keeps 90 days of management events by default. Look up what you just did, then list the Regions enabled for your account.", c: String.raw`aws cloudtrail lookup-events --max-results 5 \
  --query 'Events[].[EventTime,EventName,Username]' --output table
aws account list-regions --region-opt-status-contains ENABLED ENABLED_BY_DEFAULT \
  --query 'Regions[].RegionName' --output text` }
    ],
    cleanup: { t: "Nothing to delete. Keep the budget and SSO setup for the whole course." }
  },
  cost: [
    "New accounts get a credit-based Free Tier (introduced mid-2025). Check remaining credits and expiry under **Billing → Free Tier**.",
    "Data transfer **in** is free. Data **out** to the internet, and traffic **between AZs and Regions**, is billed per GB. That is often the line item nobody designed for.",
    "Prices vary by Region. Singapore usually costs more than `us-east-1`, so price your design in the Region you will actually deploy to."
  ],
  security: [
    "Root has MFA, no access keys, and is used only for the few root-only tasks.",
    "Humans authenticate through IAM Identity Center. No IAM users with long-lived keys.",
    "Alternate security and billing contacts are set, so AWS can reach a team and not one inbox."
  ],
  quiz: [
    { q: "Account A runs a database in `ap-southeast-1a`. Account B places its app in `ap-southeast-1a` to be in the same AZ, but cross-AZ data charges appear. Why?",
      o: ["Traffic between accounts always crosses AZs", "AZ names are mapped per account; align on AZ IDs like `apse1-az1` instead", "The VPCs are peered, which forces cross-AZ routing", "Singapore has only one real AZ"], a: 1,
      why: "AWS shuffles AZ names per account to spread load. The AZ ID is the stable physical identifier across accounts." },
    { q: "On Amazon RDS, which task is **yours** under the shared responsibility model?",
      o: ["Patching the host operating system", "Replacing failed disks", "Configuring security groups and choosing to enable encryption", "Patching the hypervisor"], a: 2,
      why: "With managed services AWS runs the OS and infrastructure. You still own network access, IAM, encryption choices and data." },
    { q: "A regulator requires that customer data never leaves Malaysia. What is the strongest first control?",
      o: ["Deploy to `ap-southeast-5` and use an Organizations SCP that denies actions in all other Regions", "Deploy to Singapore because it's nearby", "Encrypt all data with KMS", "Put a CloudFront distribution in front"], a: 0,
      why: "Region choice sets where data lives, and an SCP region-deny guardrail stops someone creating resources elsewhere by accident." }
  ],
  docs: [["Global infrastructure", "https://aws.amazon.com/about-aws/global-infrastructure/"], ["Shared responsibility model", "https://aws.amazon.com/compliance/shared-responsibility-model/"], ["IAM Identity Center", "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html"]],
  certs: { SAA: 2, SAP: 1, SCS: 1 }
});

/* ===================== 02 ===================== */
M({
  id: "m02", phase: 1, title: "IAM & Identity", hours: 8,
  services: ["IAM", "STS", "Organizations SCPs", "Access Analyzer"],
  summary: "Every AWS API call is an authorization decision. Architects need to predict that decision from the policies involved, and design identities so that workloads never hold long-lived secrets.",
  outcomes: [
    "Walk through the policy evaluation logic, including SCPs, boundaries and resource policies.",
    "Design cross-account access with roles instead of shared users.",
    "Write least-privilege policies with conditions and tags (ABAC).",
    "Use Access Analyzer and the policy simulator to prove a policy does what you think."
  ],
  concepts: [
    ["Identity vs resource policies", "Identity policies attach to a user or role (what can I do). Resource policies attach to S3 buckets, KMS keys, SQS queues and so on (who can touch me)."],
    ["Roles & STS", "A role has no password or keys. Principals **assume** it and get temporary credentials from STS. EC2, Lambda and ECS get roles automatically."],
    ["Evaluation order", "Default is implicit deny. An explicit **Deny** anywhere wins. Otherwise every applicable guardrail must allow, and some identity or resource policy must grant."],
    ["SCPs & RCPs", "Organization guardrails. They never grant access; they set the maximum that identities (SCP) or resources (RCP) in an account can be allowed."],
    ["Permissions boundary", "A ceiling on what a role can be granted. It lets developers create roles without being able to escalate their own privileges."],
    ["ABAC", "Attribute-based access control: allow when `aws:PrincipalTag/team` equals `aws:ResourceTag/team`, so one policy scales across many teams."]
  ],
  diagram: {
    title: "How AWS decides: allow or deny",
    nodes: [
      { id: "pr", x: 90, y: 90, l: "Workload", s: "Lambda / EC2 / user", k: "user" },
      { id: "sts", x: 250, y: 90, l: "STS AssumeRole", s: "temp credentials", k: "sec" },
      { id: "req", x: 410, y: 90, l: "API request", s: "s3:GetObject", k: "ops" },
      { id: "dn", x: 570, y: 90, l: "Explicit Deny?", s: "any policy", k: "sec" },
      { id: "deny", x: 700, y: 200, l: "DENY", s: "final", k: "deny" },
      { id: "scp", x: 570, y: 310, l: "SCP / RCP allow?", s: "org guardrails", k: "sec" },
      { id: "rbp", x: 410, y: 310, l: "Resource policy", s: "bucket policy", k: "sec" },
      { id: "pb", x: 250, y: 310, l: "Boundary + session", s: "ceilings", k: "sec" },
      { id: "id", x: 90, y: 310, l: "Identity policy", s: "role permissions", k: "sec" },
      { id: "allow", x: 90, y: 200, l: "ALLOW", s: "final", k: "allow" }
    ],
    steps: [
      { p: [["pr", "sts", "req"]], t: "The workload assumes a role. STS returns credentials that expire (15 min to 12 h), and every API call is signed with them." },
      { p: [["req", "dn"]], t: "AWS gathers **every** policy that applies to this request: identity, resource, SCP, RCP, boundary, session policy." },
      { p: [["dn", "deny"]], t: "If any of them contains a matching explicit `Deny`, evaluation stops here. Nothing can override it." },
      { p: [["dn", "scp"]], t: "No deny found. Organization guardrails (SCPs for principals, RCPs for resources) must allow the action, or the result is an implicit deny." },
      { p: [["scp", "rbp", "pb", "id", "allow"]], t: "Then a grant is needed. In the same account, an allow in the identity **or** resource policy is enough, as long as boundaries and session policies also allow it. **Cross-account** needs both sides to allow." }
    ]
  },
  lab: {
    title: "Build and prove a least-privilege role", time: "~60 min · free",
    goal: "Create a role that can only read one prefix of one bucket, assume it, and prove the boundaries with the policy simulator.",
    steps: [
      { t: "Create a trust policy that lets principals in your own account assume the role, then create the role.", c: String.raw`cat > trust.json <<EOF
{"Version":"2012-10-17","Statement":[{"Effect":"Allow",
 "Principal":{"AWS":"arn:aws:iam::$ACCOUNT_ID:root"},
 "Action":"sts:AssumeRole"}]}
EOF
aws iam create-role --role-name reports-reader --assume-role-policy-document file://trust.json` },
      { t: "Attach an inline policy that only allows reading `reports/` in one bucket, over TLS.", c: String.raw`BUCKET=lab-$ACCOUNT_ID-iam
aws s3 mb s3://$BUCKET --region ap-southeast-1
cat > perm.json <<EOF
{"Version":"2012-10-17","Statement":[
 {"Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::$BUCKET/reports/*",
  "Condition":{"Bool":{"aws:SecureTransport":"true"}}},
 {"Effect":"Allow","Action":"s3:ListBucket","Resource":"arn:aws:s3:::$BUCKET",
  "Condition":{"StringLike":{"s3:prefix":["reports/*"]}}}]}
EOF
aws iam put-role-policy --role-name reports-reader --policy-name read-reports --policy-document file://perm.json` },
      { t: "Assume the role and look at the temporary credentials. Note the expiry.", c: String.raw`aws sts assume-role --role-arn arn:aws:iam::$ACCOUNT_ID:role/reports-reader \
  --role-session-name lab --query 'Credentials.[AccessKeyId,Expiration]' --output text` },
      { t: "Prove it: simulate allowed and denied actions without touching real data.", c: String.raw`aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::$ACCOUNT_ID:role/reports-reader \
  --action-names s3:GetObject s3:DeleteObject \
  --resource-arns arn:aws:s3:::$BUCKET/reports/q1.csv \
  --context-entries ContextKeyName=aws:SecureTransport,ContextKeyValues=true,ContextKeyType=boolean \
  --query 'EvaluationResults[].[EvalActionName,EvalDecision]' --output table` },
      { t: "Turn on IAM Access Analyzer to flag anything shared outside the account (public buckets, cross-account trusts).", c: String.raw`aws accessanalyzer create-analyzer --analyzer-name account-analyzer --type ACCOUNT
aws accessanalyzer list-findings --analyzer-arn \
  $(aws accessanalyzer list-analyzers --query 'analyzers[0].arn' --output text)` }
    ],
    cleanup: { t: "Delete the inline policy, role, bucket and analyzer.", c: String.raw`aws iam delete-role-policy --role-name reports-reader --policy-name read-reports
aws iam delete-role --role-name reports-reader
aws s3 rb s3://$BUCKET --force
aws accessanalyzer delete-analyzer --analyzer-name account-analyzer` }
  },
  cost: [
    "IAM, STS and IAM Identity Center are free.",
    "Access Analyzer external-access findings are free. **Unused-access** analysis is billed per IAM role or user analysed per month.",
    "The hidden cost is people time: broad `*` policies are cheap to write and expensive in every incident review."
  ],
  security: [
    "Workloads use roles (instance profiles, task roles, execution roles), never access keys in env vars or code.",
    "Policies name specific actions and ARNs, with conditions such as `aws:SourceArn`, `aws:PrincipalOrgID` or `aws:SecureTransport`.",
    "Developers who create roles must attach a permissions boundary, enforced by an SCP or IAM condition."
  ],
  quiz: [
    { q: "A developer's identity policy allows `s3:*` on all buckets. An SCP on their OU denies `s3:DeleteBucket`. Can they delete a bucket?",
      o: ["Yes, identity policies take precedence in their own account", "Yes, if they are an administrator", "No, the explicit deny in the SCP wins", "Only if the bucket policy allows it"], a: 2,
      why: "An explicit deny anywhere in the chain ends evaluation, and SCPs apply to everyone in the account except the management account." },
    { q: "A Lambda function in Account A must read objects from a bucket in Account B. What is the minimal correct setup?",
      o: ["Bucket policy in B allows A's Lambda role, and that role's identity policy allows `s3:GetObject`", "Only a bucket policy in B", "Only an identity policy in A", "Make the bucket public with a long random name"], a: 0,
      why: "Cross-account access needs both sides: the resource owner grants the principal, and the principal's own account grants the action." },
    { q: "An app on EC2 needs DynamoDB access. What do you do?",
      o: ["Create an IAM user and put the keys in `/etc/environment`", "Attach an instance profile role with a scoped policy", "Store keys in Secrets Manager and fetch them at boot", "Use the root account's keys for simplicity"], a: 1,
      why: "The instance profile delivers rotating temporary credentials through IMDS. The SDK picks them up automatically, so there is no secret to leak." }
  ],
  docs: [["Policy evaluation logic", "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"], ["Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"]],
  certs: { SAA: 2, SAP: 2, DOP: 1, SCS: 2, ANS: 1 }
});

/* ===================== 03 ===================== */
M({
  id: "m03", phase: 1, title: "VPC Networking", hours: 10,
  services: ["VPC", "Subnets", "IGW / NAT", "Security groups", "VPC endpoints", "Flow Logs"],
  summary: "The VPC is your private network in a Region. Nearly every production incident and surprise bill involves a route table, a security group or a NAT gateway, so this is the module to over-invest in.",
  outcomes: [
    "Plan non-overlapping CIDRs for multiple VPCs and on-prem networks.",
    "Build the standard three-tier, two-AZ layout and explain every route.",
    "Pick between security groups and NACLs and chain SGs by reference.",
    "Cut NAT costs and exposure with gateway and interface endpoints."
  ],
  concepts: [
    ["CIDR planning", "A VPC gets a /16 to /28 block (IPv6 optional). Plan for peering and on-prem now. Overlapping ranges can't be routed together later."],
    ["Public vs private subnet", "A subnet is 'public' only because its route table sends `0.0.0.0/0` to an Internet Gateway. Each subnet lives in one AZ."],
    ["NAT Gateway", "Lets private subnets start outbound connections. It is zonal, so use one per AZ for resilience. Billed per hour **and** per GB processed."],
    ["Security groups", "Stateful, allow-only, attached to ENIs. Reference another SG as the source (`from alb-sg`) rather than IP ranges."],
    ["Network ACLs", "Stateless, ordered allow/deny rules per subnet. Return traffic needs explicit ephemeral-port rules. Use them sparingly, for coarse blocks."],
    ["VPC endpoints", "**Gateway** endpoints (S3, DynamoDB) are free route-table entries. **Interface** endpoints (PrivateLink) put an ENI for a service inside your subnet."]
  ],
  diagram: {
    title: "Three-tier VPC across two AZs",
    groups: [
      { x: 20, y: 64, w: 740, h: 326, l: "VPC 10.0.0.0/16", k: "vpc" },
      { x: 34, y: 140, w: 350, h: 240, l: "AZ a · public / app / db subnets", k: "az" },
      { x: 396, y: 140, w: 350, h: 240, l: "AZ b · public / app / db subnets", k: "az" }
    ],
    nodes: [
      { id: "inet", x: 390, y: 28, l: "Internet", k: "user" },
      { id: "igw", x: 390, y: 100, l: "Internet Gateway", s: "attached to VPC", k: "net" },
      { id: "albA", x: 120, y: 190, l: "ALB node", s: "public subnet", k: "net" },
      { id: "natA", x: 290, y: 190, l: "NAT Gateway", s: "public subnet", k: "net" },
      { id: "albB", x: 482, y: 190, l: "ALB node", s: "public subnet", k: "net" },
      { id: "natB", x: 652, y: 190, l: "NAT Gateway", s: "public subnet", k: "net" },
      { id: "appA", x: 205, y: 268, l: "App instance", s: "private subnet", k: "compute" },
      { id: "appB", x: 567, y: 268, l: "App instance", s: "private subnet", k: "compute" },
      { id: "dbA", x: 205, y: 344, l: "RDS primary", s: "db subnet", k: "data" },
      { id: "dbB", x: 567, y: 344, l: "RDS standby", s: "db subnet", k: "data" }
    ],
    steps: [
      { p: [["inet", "igw", "albA"], ["inet", "igw", "albB"]], t: "HTTPS from the internet enters through the Internet Gateway and lands on ALB nodes in the **public** subnets of both AZs." },
      { p: [["albA", "appA"], ["albB", "appB"]], t: "The ALB forwards to targets in **private** subnets. The app SG allows port 8080 only from the ALB's security group, never from `0.0.0.0/0`." },
      { p: [["appA", "dbA"], ["dbA", "dbB"]], t: "The app reaches the database in isolated subnets with no internet route at all. RDS Multi-AZ replicates synchronously to the standby in AZ b." },
      { p: [["appA", "natA", "igw", "inet"], ["appB", "natB", "igw", "inet"]], t: "Outbound-only traffic (OS patches, third-party APIs) leaves through the NAT Gateway **in the same AZ**, so losing one AZ doesn't cut egress for the other." }
    ]
  },
  lab: {
    title: "Build a production-shaped VPC with Terraform", time: "~90 min · ~US$0.10/h while running",
    goal: "Create the three-tier layout above, add an S3 gateway endpoint, chain security groups, and read the routes you built.",
    steps: [
      { t: "Create `main.tf`. The community VPC module saves 300 lines. Read its outputs afterwards so you know what it built.", lang: "hcl", c: String.raw`provider "aws" {
  region = "ap-southeast-1"
  default_tags { tags = { project = "aws-path" } }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name             = "lab-vpc"
  cidr             = "10.0.0.0/16"
  azs              = ["ap-southeast-1a", "ap-southeast-1b"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets  = ["10.0.11.0/24", "10.0.12.0/24"]
  database_subnets = ["10.0.21.0/24", "10.0.22.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true   # lab only: production uses one per AZ

  enable_flow_log                      = true
  create_flow_log_cloudwatch_log_group = true
  create_flow_log_cloudwatch_iam_role  = true
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.ap-southeast-1.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = module.vpc.private_route_table_ids
}

resource "aws_security_group" "alb" {
  name   = "alb-sg"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "app" {
  name   = "app-sg"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]   # chained by reference
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "vpc_id" { value = module.vpc.vpc_id }` },
      { t: "Apply it.", c: String.raw`terraform init && terraform plan -out tf.plan && terraform apply tf.plan
VPC_ID=$(terraform output -raw vpc_id)` },
      { t: "Read the routing you just built. Find the `0.0.0.0/0 → igw-…` route (public), the `0.0.0.0/0 → nat-…` route (private) and the `pl-…` prefix-list route to S3.", c: String.raw`aws ec2 describe-route-tables --filters Name=vpc-id,Values=$VPC_ID \
  --query 'RouteTables[].[RouteTableId,Routes[].[DestinationCidrBlock||DestinationPrefixListId,GatewayId||NatGatewayId]]' \
  --output json` },
      { t: "Stretch: in the console open **VPC → Reachability Analyzer** and test whether the internet gateway can reach port 8080 on an ENI in a private subnet. The answer should be no, and the tool tells you which hop blocks it." }
    ],
    cleanup: { t: "The NAT gateway costs money every hour. Destroy as soon as you are done.", c: String.raw`terraform destroy` }
  },
  cost: [
    "NAT Gateway: roughly US$0.045–0.06 per hour **plus** the same again per GB processed, depending on Region. Heavy S3 or ECR traffic through NAT is a classic surprise bill.",
    "Every public IPv4 address costs about US$0.005/hour (since Feb 2024), including on load balancers and NAT gateways. Consider IPv6 for egress.",
    "Cross-AZ traffic is about US$0.01/GB in each direction. Chatty microservices spread across AZs add up."
  ],
  security: [
    "No security group allows SSH or RDP from `0.0.0.0/0`. Use SSM Session Manager instead.",
    "Databases sit in subnets with no route to an internet or NAT gateway.",
    "VPC Flow Logs are on, and VPC Block Public Access is considered for accounts that should never be internet-facing."
  ],
  quiz: [
    { q: "Instances in a private subnet can't download OS patches. A NAT Gateway exists in a public subnet. What is most likely missing?",
      o: ["An Elastic IP on each instance", "A `0.0.0.0/0` route to the NAT Gateway in the private subnet's route table", "An inbound rule for port 443 in the instance's security group", "A VPC peering connection"], a: 1,
      why: "The NAT only helps if the private route table points default traffic at it. Return traffic is allowed automatically because security groups are stateful." },
    { q: "You allowed inbound 443 in a subnet's NACL, but clients time out. Security groups look fine. Why?",
      o: ["NACLs are stateless: you also need an outbound rule for ephemeral ports 1024–65535", "NACLs only apply to IPv6", "NACL rules take up to 24 hours to apply", "HTTPS requires a NAT gateway"], a: 0,
      why: "Unlike security groups, NACLs don't track connections. Responses are a separate flow that must be allowed explicitly." },
    { q: "Private workloads move 20 TB/month to and from S3 and the NAT bill is huge. Cheapest fix?",
      o: ["Move the instances to public subnets", "Add an S3 gateway endpoint to the private route tables", "Use a bigger NAT Gateway", "Replace NAT with a NAT instance"], a: 1,
      why: "Gateway endpoints for S3 and DynamoDB are free, keep traffic on the AWS network, and can be locked down with endpoint policies." }
  ],
  docs: [["VPC user guide", "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html"], ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"], ["Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"]],
  certs: { SAA: 2, SAP: 2, SCS: 1, ANS: 2 }
});

/* ===================== 04 ===================== */
M({
  id: "m04", phase: 1, title: "Compute: EC2, Auto Scaling & Load Balancing", hours: 8,
  services: ["EC2", "Launch templates", "Auto Scaling", "ALB / NLB", "Systems Manager"],
  summary: "EC2 is still the foundation that containers and many managed services run on. The architect's skill is less about instances and more about fleets: self-healing groups behind load balancers that scale on real signals.",
  outcomes: [
    "Pick instance families, sizes and purchase options for a workload.",
    "Build an Auto Scaling group that heals itself and scales on target tracking.",
    "Choose between ALB, NLB and Gateway Load Balancer.",
    "Operate instances without SSH using Systems Manager."
  ],
  concepts: [
    ["Instance families", "`t` burstable, `m` general, `c` compute, `r` memory, `g/p` GPU. The `g` suffix (m8g, c7g) means Graviton/Arm, usually the best price-performance."],
    ["Launch template", "Versioned blueprint: AMI, instance type, SGs, user data, IMDSv2 setting. ASGs and Spot fleets launch from it."],
    ["Auto Scaling group", "Keeps desired capacity between min and max across AZs. Replaces unhealthy instances. Target tracking scales to hold a metric such as 50% CPU."],
    ["Load balancers", "ALB is layer 7 (paths, hosts, headers, gRPC). NLB is layer 4 (TCP/UDP, static IPs, millions of rps). GWLB inserts third-party appliances."],
    ["Purchase options", "On-Demand, Savings Plans (1–3 yr commitment), Spot (up to ~90% off, 2-minute interruption notice), Dedicated Hosts for licensing."],
    ["IMDSv2 & SSM", "Require session tokens for instance metadata to block SSRF credential theft. Use Session Manager for shell access with no open ports."]
  ],
  diagram: {
    title: "A self-healing, self-scaling web tier",
    groups: [{ x: 336, y: 40, w: 170, h: 326, l: "AUTO SCALING GROUP", k: "az" }],
    nodes: [
      { id: "users", x: 80, y: 200, l: "Users", s: "HTTPS", k: "user" },
      { id: "alb", x: 230, y: 200, l: "ALB", s: "target group", k: "net" },
      { id: "i1", x: 421, y: 100, l: "Instance", s: "AZ a", k: "compute" },
      { id: "i2", x: 421, y: 200, l: "Instance", s: "AZ b", k: "compute" },
      { id: "i3", x: 421, y: 300, l: "Instance", s: "AZ a", k: "compute" },
      { id: "cw", x: 640, y: 100, l: "CloudWatch alarm", s: "CPU > 50% target", k: "ops" },
      { id: "lt", x: 640, y: 200, l: "Launch template", s: "v7 · AL2023 · Arm", k: "ops" },
      { id: "i4", x: 640, y: 300, l: "New instance", s: "scale-out, AZ b", k: "compute" }
    ],
    steps: [
      { p: [["users", "alb", "i1"], ["users", "alb", "i2"], ["users", "alb", "i3"]], t: "The ALB spreads requests across healthy targets in several AZs. Health checks hit `/health` every few seconds." },
      { p: [["i1", "cw"], ["i2", "cw"]], t: "Instances publish metrics. Target tracking creates and manages the CloudWatch alarms for you." },
      { p: [["cw", "lt", "i4"]], t: "Average CPU stays above the target, so the ASG launches a new instance from the launch template, choosing the AZ with the fewest instances." },
      { p: [["alb", "i4"]], t: "After the health-check grace period and passing checks, the new instance joins the target group and starts taking traffic. Scale-in later drains connections first." }
    ]
  },
  compare: {
    title: "Which load balancer?",
    cols: ["", "Application (ALB)", "Network (NLB)", "Gateway (GWLB)"],
    rows: [
      ["OSI layer", "7: HTTP/1.1, HTTP/2, gRPC, WebSocket", "4: TCP, UDP, TLS", "3: IP packets via GENEVE"],
      ["Routing on", "Path, host, header, query, method", "Port and protocol", "All traffic to an appliance fleet"],
      ["Static IP", "No (use Global Accelerator)", "Yes, one per AZ, or bring your own EIP", "n/a"],
      ["Typical use", "Web apps, APIs, microservices, Lambda targets", "Extreme throughput, non-HTTP, PrivateLink services", "Firewalls, IDS/IPS from vendors"],
      ["Auth & WAF", "Cognito/OIDC auth, AWS WAF", "No WAF", "n/a"]
    ]
  },
  lab: {
    title: "Auto-scaling web tier with zero SSH", time: "~75 min · ~US$0.08/h",
    goal: "Use the VPC from module 03. You'll need `VPC_ID`, two public and two private subnet IDs, and the ALB and app security groups (temporarily allow port 80 instead of 8080/443 to keep it simple).",
    steps: [
      { t: "Write user data that prints which AZ served the request. It uses IMDSv2 tokens.", c: String.raw`cat > userdata.sh <<'EOF'
#!/bin/bash
dnf install -y nginx
TOKEN=$(curl -sX PUT http://169.254.169.254/latest/api/token -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
AZ=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "<h1>Served from $AZ</h1>" > /usr/share/nginx/html/index.html
systemctl enable --now nginx
EOF` },
      { t: "Create a launch template with the latest Amazon Linux 2023 Arm AMI, a Graviton instance type and IMDSv2 required.", c: String.raw`AMI=$(aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 \
  --query Parameter.Value --output text)
aws ec2 create-launch-template --launch-template-name web-lt --launch-template-data "{
  \"ImageId\":\"$AMI\",\"InstanceType\":\"t4g.micro\",
  \"SecurityGroupIds\":[\"$APP_SG\"],
  \"IamInstanceProfile\":{\"Name\":\"AmazonSSMRoleForInstancesQuickSetup\"},
  \"MetadataOptions\":{\"HttpTokens\":\"required\"},
  \"UserData\":\"$(base64 -w0 userdata.sh)\"}"` },
      { t: "Create the target group, ALB and listener. (The instance profile above is created by SSM Quick Setup; any role with `AmazonSSMManagedInstanceCore` works.)", c: String.raw`TG=$(aws elbv2 create-target-group --name web-tg --protocol HTTP --port 80 --vpc-id $VPC_ID \
  --health-check-path / --query 'TargetGroups[0].TargetGroupArn' --output text)
ALB=$(aws elbv2 create-load-balancer --name web-alb --subnets $PUB_A $PUB_B \
  --security-groups $ALB_SG --query 'LoadBalancers[0].LoadBalancerArn' --output text)
aws elbv2 create-listener --load-balancer-arn $ALB --protocol HTTP --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG` },
      { t: "Create the Auto Scaling group across both private subnets and attach a target-tracking policy.", c: String.raw`aws autoscaling create-auto-scaling-group --auto-scaling-group-name web-asg \
  --launch-template "LaunchTemplateName=web-lt,Version=\$Latest" \
  --min-size 2 --max-size 6 --desired-capacity 2 \
  --vpc-zone-identifier "$PRIV_A,$PRIV_B" \
  --target-group-arns $TG --health-check-type ELB --health-check-grace-period 120

aws autoscaling put-scaling-policy --auto-scaling-group-name web-asg --policy-name cpu50 \
  --policy-type TargetTrackingScaling --target-tracking-configuration \
  '{"PredefinedMetricSpecification":{"PredefinedMetricType":"ASGAverageCPUUtilization"},"TargetValue":50}'` },
      { t: "Test it. Refresh the ALB URL to see different AZs. Then open a shell with Session Manager (no SSH, no port 22), run `stress-ng`, and watch scaling activity.", c: String.raw`DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB --query 'LoadBalancers[0].DNSName' --output text)
for i in 1 2 3 4; do curl -s http://$DNS; echo; done
aws ssm start-session --target <instance-id>     # then: sudo dnf install -y stress-ng && stress-ng --cpu 2 -t 600
aws autoscaling describe-scaling-activities --auto-scaling-group-name web-asg --max-items 5 \
  --query 'Activities[].[StartTime,Description]' --output table` },
      { t: "Chaos test: terminate one instance by hand and watch the ASG replace it within a couple of minutes." }
    ],
    cleanup: { t: "Delete in dependency order.", c: String.raw`aws autoscaling delete-auto-scaling-group --auto-scaling-group-name web-asg --force-delete
aws elbv2 delete-load-balancer --load-balancer-arn $ALB
sleep 30 && aws elbv2 delete-target-group --target-group-arn $TG
aws ec2 delete-launch-template --launch-template-name web-lt` }
  },
  cost: [
    "Graviton (Arm) instances are typically 20–40% better price-performance than comparable x86.",
    "Commit to Compute Savings Plans for the steady baseline. Use Spot with several instance types and the `price-capacity-optimized` strategy for interruptible work.",
    "`t` instances in unlimited mode can quietly bill CPU credits. Use gp3 rather than gp2 volumes (cheaper with independent IOPS)."
  ],
  security: [
    "IMDSv2 is required (`HttpTokens=required`), enforced by an SCP or account default.",
    "No SSH keys or port 22. Access goes through SSM Session Manager, which logs every session.",
    "AMIs are patched and rebuilt on a schedule (EC2 Image Builder), and EBS encryption by default is on."
  ],
  quiz: [
    { q: "You need static IPs per AZ, millions of TCP connections per second, and the client source IP preserved. Which load balancer?",
      o: ["Application Load Balancer", "Network Load Balancer", "Gateway Load Balancer", "Classic Load Balancer"], a: 1,
      why: "The NLB works at layer 4, offers one static IP per AZ, scales to extreme throughput and preserves client IPs." },
    { q: "ASG instances keep getting terminated and replaced right after launch. The app takes 3 minutes to boot and the ASG uses ELB health checks. Fix?",
      o: ["Switch to EC2 health checks", "Increase the health-check grace period beyond boot time", "Increase max size", "Use a bigger instance type"], a: 1,
      why: "During the grace period the ASG ignores failing health checks. Faster boots (pre-baked AMIs) or warm pools also help." },
    { q: "A nightly batch can be interrupted and restarted. You want the biggest cost cut while keeping capacity reliable.",
      o: ["Reserved Instances", "Spot across several instance types and AZs with price-capacity-optimized allocation", "Dedicated Hosts", "On-Demand in one AZ"], a: 1,
      why: "Spot gives the deepest discount. Diversifying across types and AZs lowers the chance of interruption." }
  ],
  docs: [["Auto Scaling user guide", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html"], ["Elastic Load Balancing", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html"]],
  certs: { SAA: 2, SAP: 2, DOP: 1 }
});

/* ===================== 05 ===================== */
M({
  id: "m05", phase: 1, title: "Storage: S3, EBS & EFS", hours: 6,
  services: ["S3", "S3 lifecycle", "EBS", "EFS", "FSx"],
  summary: "Pick storage by access pattern: object, block or file. Then let lifecycle rules move data to cheaper tiers automatically. S3 is the backbone of most AWS architectures, from static sites to data lakes and backups.",
  outcomes: [
    "Map a workload to object, block or file storage.",
    "Design lifecycle rules across S3 storage classes and know their minimum durations.",
    "Protect data with versioning, Object Lock and replication.",
    "Let clients upload and download directly with presigned URLs."
  ],
  concepts: [
    ["S3 object model", "Buckets hold objects addressed by key. Strongly consistent read-after-write. Designed for 11 nines of durability across at least 3 AZs."],
    ["Storage classes", "Standard → Intelligent-Tiering → Standard-IA → Glacier Instant / Flexible / Deep Archive. Colder means cheaper storage but retrieval fees and minimum durations."],
    ["Versioning & Object Lock", "Versioning keeps every overwrite and delete. Object Lock adds WORM retention against ransomware and for compliance."],
    ["EBS", "Network block storage for one instance in **one AZ**. gp3 is the default; io2 Block Express for high-IOPS databases. Snapshots are incremental and stored regionally."],
    ["EFS & FSx", "EFS is managed NFS shared across AZs and instances. FSx offers Windows File Server, Lustre (HPC), NetApp ONTAP and OpenZFS."],
    ["Presigned URLs", "Time-limited, signed URLs that let a browser PUT or GET one object directly, so large files don't flow through your servers."]
  ],
  diagram: {
    title: "Data lifecycle across storage tiers",
    nodes: [
      { id: "app", x: 80, y: 160, l: "Application", s: "PUT / GET", k: "compute" },
      { id: "std", x: 270, y: 160, l: "S3 Standard", s: "hot · days 0–30", k: "data" },
      { id: "ia", x: 460, y: 80, l: "Standard-IA", s: "day 30", k: "data" },
      { id: "gl", x: 650, y: 80, l: "Glacier Flexible", s: "day 90", k: "data" },
      { id: "da", x: 650, y: 200, l: "Deep Archive", s: "day 365 · 7 yr", k: "data" },
      { id: "rep", x: 460, y: 240, l: "Replica bucket", s: "other Region", k: "data" },
      { id: "ec2", x: 80, y: 330, l: "EC2 instance", s: "AZ a", k: "compute" },
      { id: "ebs", x: 270, y: 330, l: "EBS gp3 volume", s: "AZ a only", k: "data" },
      { id: "snap", x: 460, y: 340, l: "EBS snapshot", s: "regional, incremental", k: "data" }
    ],
    steps: [
      { p: [["app", "std"]], t: "Objects land in S3 Standard: millisecond access, data stored across 3+ AZs. Default encryption (SSE-S3) is on automatically." },
      { p: [["std", "ia", "gl"]], t: "Lifecycle rules move ageing objects to cheaper classes: Standard-IA after 30 days, Glacier Flexible Retrieval after 90 (restores take minutes to hours)." },
      { p: [["gl", "da"]], t: "Compliance archives go to Deep Archive, the cheapest class. Retrieval takes up to 12 hours (48 h for bulk), with a 180-day minimum." },
      { p: [["std", "rep"]], async: true, t: "Cross-Region Replication copies new objects asynchronously for DR or data locality. S3 Replication Time Control adds a 15-minute SLA." },
      { p: [["ec2", "ebs", "snap"]], t: "Block storage is different. An EBS volume is tied to one AZ. Snapshots are regional and are how you move or restore it in another AZ." }
    ]
  },
  compare: {
    title: "S3 storage classes at a glance",
    cols: ["Class", "Access time", "Min. duration", "Use for"],
    rows: [
      ["Standard", "ms", "none", "Hot data, websites, active datasets"],
      ["Intelligent-Tiering", "ms (opt-in archive tiers slower)", "none", "Unknown or changing access patterns"],
      ["Standard-IA", "ms + retrieval fee", "30 days", "Backups and older data read monthly"],
      ["One Zone-IA", "ms + retrieval fee", "30 days", "Re-creatable data; only one AZ"],
      ["Glacier Instant Retrieval", "ms + higher fee", "90 days", "Archives read about once a quarter"],
      ["Glacier Flexible Retrieval", "minutes to 12 h", "90 days", "Archives with relaxed restore times"],
      ["Glacier Deep Archive", "up to 12 h (48 h bulk)", "180 days", "Compliance retention for years"]
    ]
  },
  lab: {
    title: "A versioned, tiered, presigned bucket", time: "~40 min · cents",
    goal: "Create a bucket with versioning and lifecycle tiering, share an object with a presigned URL, and prove that a delete is recoverable.",
    steps: [
      { t: "Create a bucket. Block Public Access and SSE-S3 encryption are already on by default for new buckets.", c: String.raw`BUCKET=lab-$ACCOUNT_ID-data
aws s3api create-bucket --bucket $BUCKET --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1
aws s3api put-bucket-versioning --bucket $BUCKET --versioning-configuration Status=Enabled` },
      { t: "Add lifecycle rules for `logs/`, plus the often-forgotten rules for old versions and incomplete multipart uploads.", c: String.raw`cat > lifecycle.json <<'EOF'
{"Rules":[
 {"ID":"tier-logs","Status":"Enabled","Filter":{"Prefix":"logs/"},
  "Transitions":[{"Days":30,"StorageClass":"STANDARD_IA"},{"Days":90,"StorageClass":"GLACIER"}],
  "Expiration":{"Days":365}},
 {"ID":"hygiene","Status":"Enabled","Filter":{},
  "NoncurrentVersionExpiration":{"NoncurrentDays":30},
  "AbortIncompleteMultipartUpload":{"DaysAfterInitiation":7}}]}
EOF
aws s3api put-bucket-lifecycle-configuration --bucket $BUCKET --lifecycle-configuration file://lifecycle.json` },
      { t: "Upload a file and give someone a link that expires in 5 minutes.", c: String.raw`echo "quarterly numbers" > report.txt
aws s3 cp report.txt s3://$BUCKET/reports/report.txt
aws s3 presign s3://$BUCKET/reports/report.txt --expires-in 300` },
      { t: "Delete the object, then list versions. The delete only added a **delete marker**. Remove the marker to restore the file.", c: String.raw`aws s3 rm s3://$BUCKET/reports/report.txt
aws s3api list-object-versions --bucket $BUCKET --prefix reports/ \
  --query '{versions:Versions[].VersionId,markers:DeleteMarkers[].VersionId}'
aws s3api delete-object --bucket $BUCKET --key reports/report.txt --version-id <delete-marker-id>
aws s3 ls s3://$BUCKET/reports/` }
    ],
    cleanup: { t: "Versioned buckets keep every version, so `aws s3 rb --force` leaves them behind. Use the console **Empty** button (it deletes all versions), then remove the bucket.", c: String.raw`aws s3 rb s3://$BUCKET` }
  },
  cost: [
    "Storage is cheap. **Requests** and **retrievals** aren't. Millions of tiny objects in IA or Glacier can cost more than Standard (IA bills a 128 KB minimum per object).",
    "Intelligent-Tiering charges a small monitoring fee per object, so it pays off for larger objects with unpredictable access.",
    "Unattached EBS volumes and forgotten snapshots are among the most common sources of waste."
  ],
  security: [
    "Block Public Access stays on at the account level. Share through CloudFront with OAC or presigned URLs.",
    "Bucket policies deny requests where `aws:SecureTransport` is false, and use SSE-KMS where you need key-level audit.",
    "Critical buckets have versioning plus Object Lock, or replication to another account, against deletion and ransomware."
  ],
  quiz: [
    { q: "Logs are read heavily for 7 days, almost never afterwards, and must be kept 7 years. A 12-hour restore is acceptable. Cheapest design?",
      o: ["Keep everything in Standard", "Lifecycle: Standard, then Deep Archive after 30 days, expire after 7 years", "Store on EBS snapshots", "One Zone-IA forever"], a: 1,
      why: "Deep Archive is the lowest-cost class, its 180-day minimum is irrelevant for 7-year retention, and a 12-hour restore meets the requirement." },
    { q: "Ten Linux instances in two AZs must read and write the same POSIX file system.",
      o: ["One EBS volume with Multi-Attach", "Amazon EFS", "S3 mounted with s3fs", "Instance store"], a: 1,
      why: "EFS is a regional, multi-AZ NFS file system built for concurrent access. EBS Multi-Attach is single-AZ, io1/io2 only, and needs a cluster-aware file system." },
    { q: "Users upload 2 GB videos from the browser. Your API servers are struggling. Best fix?",
      o: ["Bigger API instances", "Return a presigned S3 PUT URL (multipart for large files) so the browser uploads directly", "Put the files in DynamoDB", "Use EFS"], a: 1,
      why: "Presigned URLs take the data path off your servers entirely. Your API only signs the request." }
  ],
  docs: [["S3 storage classes", "https://aws.amazon.com/s3/storage-classes/"], ["S3 lifecycle", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"]],
  certs: { SAA: 2, SAP: 2, SCS: 1 }
});

/* ===================== 06 ===================== */
M({
  id: "m06", phase: 1, title: "Databases: RDS, Aurora, DynamoDB & Caching", hours: 8,
  services: ["RDS", "Aurora", "DynamoDB", "ElastiCache", "RDS Proxy"],
  summary: "AWS runs purpose-built databases, and an architect's job is to match each access pattern to one. Relational for flexible queries and transactions, key-value for predictable scale, and a cache in front of both.",
  outcomes: [
    "Choose a database from the access patterns, not from habit.",
    "Explain RDS Multi-AZ, read replicas and Aurora's shared-storage design.",
    "Model a DynamoDB table around its queries using partition and sort keys.",
    "Add caching and connection pooling where they actually help."
  ],
  concepts: [
    ["RDS Multi-AZ", "A synchronous standby in another AZ with automatic failover (typically 1–2 minutes). The Multi-AZ **DB cluster** option adds two readable standbys."],
    ["Aurora", "MySQL/PostgreSQL-compatible. Storage is a distributed volume with 6 copies across 3 AZs. Up to 15 low-lag readers. Serverless v2 scales in fine steps."],
    ["DynamoDB", "Serverless key-value and document store with single-digit ms latency at any scale. Design the partition key for even spread; GSIs add access patterns."],
    ["ElastiCache", "Managed Valkey, Redis OSS or Memcached. Cache-aside for read-heavy data, sessions and leaderboards. Microsecond reads."],
    ["RDS Proxy", "Pools and reuses database connections. Essential for Lambda bursts, and it shortens failover by holding client connections."],
    ["Purpose-built others", "OpenSearch (search), Neptune (graph), Timestream (time series), DocumentDB (MongoDB API), MemoryDB (durable Redis-compatible)."]
  ],
  diagram: {
    title: "Read path with cache, proxy and replicas",
    groups: [{ x: 370, y: 60, w: 400, h: 250, l: "AURORA CLUSTER · shared volume, 6 copies / 3 AZs", k: "az" }],
    nodes: [
      { id: "app", x: 80, y: 190, l: "App service", s: "ECS / Lambda", k: "compute" },
      { id: "cache", x: 250, y: 70, l: "ElastiCache", s: "Valkey", k: "data" },
      { id: "proxy", x: 250, y: 190, l: "RDS Proxy", s: "connection pool", k: "data" },
      { id: "writer", x: 460, y: 190, l: "Aurora writer", s: "AZ a", k: "data" },
      { id: "r1", x: 670, y: 120, l: "Aurora reader", s: "AZ b", k: "data" },
      { id: "r2", x: 670, y: 260, l: "Aurora reader", s: "AZ c", k: "data" },
      { id: "ddb", x: 250, y: 340, l: "DynamoDB", s: "orders table", k: "data" },
      { id: "stream", x: 460, y: 355, l: "DynamoDB Streams", s: "change feed", k: "int" },
      { id: "fn", x: 670, y: 355, l: "Lambda", s: "projections", k: "compute" }
    ],
    steps: [
      { p: [["app", "cache"]], t: "**Cache-aside**: look in the cache first. A hit returns in well under a millisecond and never touches the database." },
      { p: [["app", "proxy", "writer"]], t: "On a miss, query through RDS Proxy, which multiplexes thousands of app connections onto a small pool. Then write the result back to the cache with a TTL." },
      { p: [["writer", "r1"], ["writer", "r2"]], t: "Aurora readers share the same storage volume, so replica lag is typically under 100 ms. Point reporting queries at the **reader endpoint**." },
      { p: [["app", "ddb", "stream", "fn"]], async: true, t: "High-scale key-value access goes to DynamoDB. Streams publish every change so Lambda can update search indexes, aggregates or other services." }
    ]
  },
  compare: {
    title: "Pick a database by access pattern",
    cols: ["Need", "Reach for", "Why"],
    rows: [
      ["Joins, ad-hoc SQL, strong transactions", "Aurora or RDS (PostgreSQL / MySQL)", "Relational model, mature tooling"],
      ["Known key-based queries at huge scale", "DynamoDB", "Serverless, predictable latency, no connection limits"],
      ["Sub-ms repeated reads, sessions", "ElastiCache (Valkey)", "In-memory"],
      ["Full-text search, log analytics", "OpenSearch Service", "Inverted indexes, aggregations"],
      ["Relationships many hops deep", "Neptune", "Graph traversal"],
      ["Analytics over TBs", "Redshift or Athena on S3 (module 18)", "Columnar, MPP"]
    ]
  },
  lab: {
    title: "Model an order system in DynamoDB", time: "~60 min · cents",
    goal: "Design around access patterns: \"get a customer's orders for a month\" and \"never create the same order twice\".",
    steps: [
      { t: "Create an on-demand table with a generic `PK`/`SK` (single-table design).", c: String.raw`aws dynamodb create-table --table-name Orders \
  --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
  --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
aws dynamodb wait table-exists --table-name Orders` },
      { t: "Write orders. Use a conditional put so a retried request can't create a duplicate (idempotency).", c: String.raw`aws dynamodb put-item --table-name Orders --condition-expression "attribute_not_exists(PK)" --item \
 '{"PK":{"S":"CUST#42"},"SK":{"S":"ORDER#2026-10-01#1001"},"total":{"N":"59.90"},"status":{"S":"SHIPPED"}}'
aws dynamodb put-item --table-name Orders --condition-expression "attribute_not_exists(PK)" --item \
 '{"PK":{"S":"CUST#42"},"SK":{"S":"ORDER#2026-10-14#1002"},"total":{"N":"120.00"},"status":{"S":"PLACED"}}'
# run the first command again: you should get ConditionalCheckFailedException` },
      { t: "Query one customer's October orders with a single key-condition read, no scan.", c: String.raw`aws dynamodb query --table-name Orders \
  --key-condition-expression "PK = :c AND begins_with(SK, :m)" \
  --expression-attribute-values '{":c":{"S":"CUST#42"},":m":{"S":"ORDER#2026-10"}}' \
  --return-consumed-capacity TOTAL` },
      { t: "Optional, ~US$0.12/h while active: an Aurora PostgreSQL Serverless v2 cluster that can pause when idle (minimum 0 ACU on recent engine versions). Use the DB subnet group and an SG from module 03.", c: String.raw`aws rds create-db-cluster --db-cluster-identifier lab-aurora --engine aurora-postgresql \
  --serverless-v2-scaling-configuration MinCapacity=0,MaxCapacity=2 \
  --master-username dbadmin --manage-master-user-password \
  --db-subnet-group-name <db-subnet-group> --vpc-security-group-ids $DB_SG
aws rds create-db-instance --db-instance-identifier lab-aurora-1 \
  --db-cluster-identifier lab-aurora --engine aurora-postgresql --db-instance-class db.serverless` }
    ],
    cleanup: { t: "Delete the table, and the Aurora cluster if you created it.", c: String.raw`aws dynamodb delete-table --table-name Orders
aws rds delete-db-instance --db-instance-identifier lab-aurora-1 --skip-final-snapshot
aws rds delete-db-cluster --db-cluster-identifier lab-aurora --skip-final-snapshot` }
  },
  cost: [
    "Aurora I/O-Optimized removes per-I/O charges. It usually wins once I/O exceeds about 25% of your Aurora bill.",
    "DynamoDB on-demand suits spiky or new workloads. Provisioned capacity with auto scaling is cheaper for steady traffic.",
    "A stopped RDS instance restarts automatically after 7 days. Use snapshots or Serverless v2 auto-pause for dev databases."
  ],
  security: [
    "Databases live in private subnets, and their SG only allows the app SG.",
    "Credentials are managed by Secrets Manager with rotation (`--manage-master-user-password`), or use IAM database authentication.",
    "Encryption at rest is chosen **at creation**. An unencrypted instance can only be encrypted by restoring from an encrypted snapshot copy."
  ],
  quiz: [
    { q: "Heavy reporting queries slow down the OLTP primary on Aurora PostgreSQL. Least-effort fix?",
      o: ["Scale the writer up", "Add an Aurora reader and send reporting to the reader endpoint", "Move to DynamoDB", "Add ElastiCache in front of the reports"], a: 1,
      why: "Readers share the cluster storage and take read-only load off the writer, with low replica lag." },
    { q: "At peak, thousands of concurrent Lambda invocations exhaust PostgreSQL's connection limit.",
      o: ["Increase `max_connections` to 50,000", "Put RDS Proxy between Lambda and the database", "Use a NAT gateway", "Switch to provisioned concurrency"], a: 1,
      why: "RDS Proxy pools and reuses connections, protecting the database from connection storms." },
    { q: "A DynamoDB table throttles even though total capacity is far from its limit. The partition key is `status` (ACTIVE / INACTIVE).",
      o: ["Switch to provisioned mode", "Redesign around a high-cardinality key (for example customerId) or shard the hot key", "Add a GSI on status", "Enable Streams"], a: 1,
      why: "Two key values means two hot partitions. Throughput spreads by partition key, so cardinality matters." }
  ],
  docs: [["DynamoDB best practices", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html"], ["Aurora user guide", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html"]],
  certs: { SAA: 2, SAP: 2 }
});

/* ===================== 07 ===================== */
M({
  id: "m07", phase: 2, title: "Infrastructure as Code", hours: 8,
  services: ["CloudFormation", "AWS CDK", "Terraform", "StackSets"],
  summary: "From here on, nothing is built by clicking. Infrastructure as code gives you review, repeatability, drift detection and a blueprint you can stamp into every account and Region.",
  outcomes: [
    "Compare CloudFormation, CDK and Terraform and pick one for a team.",
    "Ship a CDK stack with safe defaults and review its change set first.",
    "Run Terraform with remote state and locking.",
    "Detect drift and promote the same code from dev to prod."
  ],
  concepts: [
    ["Declarative IaC", "You describe the end state. The engine works out create, update and delete order from the dependency graph."],
    ["CloudFormation", "AWS-native engine. Stacks, change sets, drift detection, rollback, and StackSets for many accounts and Regions."],
    ["AWS CDK", "Write TypeScript, Python, Java or Go that synthesises CloudFormation. L2/L3 constructs bring secure defaults and wire up IAM for you."],
    ["Terraform / OpenTofu", "Multi-cloud HCL with a plan/apply workflow. State lives in a backend (S3 with native lockfile). Large module ecosystem."],
    ["Environments", "One codebase, parameterised per environment, deployed to separate accounts. Promote the same artifact rather than rebuilding it."],
    ["Policy as code", "cfn-guard, Checkov, cdk-nag or OPA run in CI and block insecure templates before deployment."]
  ],
  diagram: {
    title: "From commit to two accounts",
    nodes: [
      { id: "dev", x: 80, y: 200, l: "Engineer", s: "git push", k: "user" },
      { id: "git", x: 230, y: 200, l: "Git repo", s: "pull request", k: "ops" },
      { id: "ci", x: 390, y: 200, l: "CI pipeline", s: "synth · plan · scan", k: "ops" },
      { id: "rev", x: 560, y: 90, l: "Review diff", s: "change set / plan", k: "user" },
      { id: "state", x: 560, y: 320, l: "Terraform state", s: "S3 + lockfile", k: "data" },
      { id: "dacc", x: 700, y: 180, l: "dev account", s: "deploy role", k: "net" },
      { id: "pacc", x: 700, y: 290, l: "prod account", s: "deploy role", k: "net" }
    ],
    steps: [
      { p: [["dev", "git", "ci"]], t: "A pull request triggers CI: lint, unit tests, `cdk synth` or `terraform plan`, plus policy-as-code scanners." },
      { p: [["ci", "rev"]], t: "A human reviews the **diff**: a CloudFormation change set or Terraform plan. Look for anything marked replace or destroy on stateful resources." },
      { p: [["ci", "state"]], t: "Terraform reads and locks remote state so two applies can't race. CloudFormation keeps state inside the service." },
      { p: [["rev", "dacc", "pacc"]], t: "The same artifact deploys to dev, then to prod after checks pass, each through a scoped deploy role in that account." }
    ]
  },
  compare: {
    title: "CloudFormation vs CDK vs Terraform",
    cols: ["", "CloudFormation", "AWS CDK", "Terraform / OpenTofu"],
    rows: [
      ["Language", "YAML / JSON", "TypeScript, Python, Java, C#, Go", "HCL"],
      ["State", "Managed by AWS", "Managed by AWS (via CloudFormation)", "You manage it (S3 backend)"],
      ["Abstractions", "Modules, macros", "Rich constructs with secure defaults", "Registry modules"],
      ["Multi-cloud / SaaS", "AWS (plus registry extensions)", "AWS-first", "Excellent (thousands of providers)"],
      ["Best fit", "Simple stacks, StackSets org-wide", "App teams that like code and tests", "Platform teams, multi-provider estates"]
    ]
  },
  lab: {
    title: "CDK stack with safe defaults + Terraform backend", time: "~75 min · cents",
    goal: "Ship an S3 bucket and an SQS queue with a dead-letter queue using CDK, review the diff, detect drift, then set up a Terraform backend you'll reuse.",
    steps: [
      { t: "Scaffold and bootstrap (one-time per account and Region).", c: String.raw`mkdir lab-cdk && cd lab-cdk
npx aws-cdk@2 init app --language typescript
npx cdk bootstrap aws://$ACCOUNT_ID/ap-southeast-1` },
      { t: "Replace `lib/lab-cdk-stack.ts`.", lang: "typescript", c: String.raw`import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class LabCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const uploads = new s3.Bucket(this, 'Uploads', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,   // lab only
      autoDeleteObjects: true,
    });

    const dlq = new sqs.Queue(this, 'JobsDlq', { retentionPeriod: cdk.Duration.days(14) });
    new sqs.Queue(this, 'Jobs', {
      visibilityTimeout: cdk.Duration.seconds(60),
      deadLetterQueue: { queue: dlq, maxReceiveCount: 3 },
    });

    cdk.Tags.of(this).add('project', 'aws-path');
    new cdk.CfnOutput(this, 'BucketName', { value: uploads.bucketName });
  }
}` },
      { t: "Review, then deploy. Read the IAM and security-group changes CDK prints before you say yes.", c: String.raw`npx cdk diff
npx cdk deploy` },
      { t: "Create drift on purpose: change the queue's visibility timeout in the console, then detect it.", c: String.raw`aws cloudformation detect-stack-drift --stack-name LabCdkStack
aws cloudformation describe-stack-resource-drifts --stack-name LabCdkStack \
  --stack-resource-drift-status-filters MODIFIED \
  --query 'StackResourceDrifts[].[LogicalResourceId,PropertyDifferences[0].PropertyPath]' --output table` },
      { t: "Terraform users: create a state bucket once, then point every project at it. `use_lockfile` gives native S3 locking without a DynamoDB table (Terraform 1.10+).", lang: "hcl", c: String.raw`terraform {
  backend "s3" {
    bucket       = "tfstate-<ACCOUNT_ID>"
    key          = "lab/network/terraform.tfstate"
    region       = "ap-southeast-1"
    encrypt      = true
    use_lockfile = true
  }
}` }
    ],
    cleanup: { t: "Destroy the stack (the bucket empties itself because of `autoDeleteObjects`). Keep the CDK bootstrap stack for later modules.", c: String.raw`npx cdk destroy` }
  },
  cost: [
    "CloudFormation is free for AWS resource types. You pay for what it creates.",
    "Short-lived preview environments are cheap if you destroy them automatically, for example when a PR is merged or after a TTL.",
    "Default tags (`default_tags`, `Tags.of`) make cost allocation possible later (module 16)."
  ],
  security: [
    "No secrets in templates. Use dynamic references (`{{resolve:secretsmanager:...}}`) or generated secrets.",
    "Stateful resources get `DeletionPolicy: Retain` or `RemovalPolicy.RETAIN`, and prod stacks have termination protection.",
    "Deploy roles are scoped per account. The CDK bootstrap roles trust only your CI identity."
  ],
  quiz: [
    { q: "Someone changed a security group in the console. The stack still shows `UPDATE_COMPLETE`. How do you find out?",
      o: ["CloudFormation drift detection", "Re-deploy and hope", "Check Trusted Advisor", "Delete and recreate the stack"], a: 0,
      why: "Drift detection compares live resource configuration with the template. CloudTrail tells you who made the change." },
    { q: "Two engineers ran `terraform apply` at the same time and corrupted state. Prevention?",
      o: ["Use local state files", "A remote S3 backend with locking (`use_lockfile`), and applies only from CI", "Commit `terraform.tfstate` to Git", "Use bigger instances"], a: 1,
      why: "Remote state plus a lock serialises applies. Running applies only from CI removes the 'from my laptop' variable." },
    { q: "Deploy the same baseline (CloudTrail, Config rules, roles) to 40 accounts in 3 Regions, including future accounts.",
      o: ["Run `cdk deploy` 120 times", "CloudFormation StackSets with service-managed permissions and auto-deployment to OUs", "Copy the template into each account", "AWS Backup"], a: 1,
      why: "Service-managed StackSets integrate with Organizations and deploy automatically to new accounts added to the target OUs." }
  ],
  docs: [["CDK developer guide", "https://docs.aws.amazon.com/cdk/v2/guide/home.html"], ["CloudFormation StackSets", "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html"], ["Terraform S3 backend", "https://developer.hashicorp.com/terraform/language/backend/s3"]],
  certs: { SAA: 1, SAP: 2, DOP: 2 }
});

/* ===================== 08 ===================== */
M({
  id: "m08", phase: 2, title: "Serverless: Lambda, API Gateway & Step Functions", hours: 8,
  services: ["Lambda", "API Gateway", "Step Functions", "Cognito", "SAM"],
  summary: "Serverless moves the unit of scaling from servers to requests. You trade control of the runtime for zero idle cost, built-in high availability and a new set of limits to design around.",
  outcomes: [
    "Explain Lambda's execution model: cold starts, concurrency, timeouts and retries.",
    "Build a secured HTTP API with Lambda and DynamoDB using SAM.",
    "Orchestrate long-running work with Step Functions instead of chaining functions.",
    "Make handlers idempotent and observable."
  ],
  concepts: [
    ["Execution model", "Each concurrent request gets its own execution environment. Max 15 minutes and 10 GB memory; CPU scales with memory. Init code is reused across warm invocations."],
    ["Concurrency", "Account concurrency is shared across functions (1,000 by default, can be raised). Reserved concurrency caps a function; provisioned concurrency pre-warms it."],
    ["Invocation types", "Synchronous (API), asynchronous (S3, SNS, EventBridge, with retries and destinations) and poll-based (SQS, Kinesis, DynamoDB Streams via event source mappings)."],
    ["API Gateway", "HTTP APIs are cheaper and faster with JWT authorizers. REST APIs add usage plans, API keys, request validation and WAF. Function URLs are the simplest option."],
    ["Step Functions", "State machines with retries, timeouts, parallel branches and waits. **Standard** runs up to a year with exactly-once steps; **Express** is high-volume and short."],
    ["Idempotency", "Async and stream sources may deliver twice. Use idempotency keys (Powertools idempotency, DynamoDB conditional writes)."]
  ],
  diagram: {
    title: "A serverless order API",
    nodes: [
      { id: "client", x: 80, y: 200, l: "Client", s: "SPA / mobile", k: "user" },
      { id: "cog", x: 240, y: 70, l: "Cognito", s: "user pool → JWT", k: "sec" },
      { id: "api", x: 240, y: 200, l: "API Gateway", s: "HTTP API", k: "net" },
      { id: "fn", x: 410, y: 200, l: "Lambda", s: "createOrder", k: "compute" },
      { id: "ddb", x: 580, y: 100, l: "DynamoDB", s: "Orders", k: "data" },
      { id: "sfn", x: 580, y: 300, l: "Step Functions", s: "order workflow", k: "int" },
      { id: "pay", x: 700, y: 200, l: "Payment task", s: "retry · backoff", k: "compute" },
      { id: "ship", x: 410, y: 340, l: "Fulfilment task", s: "wait for callback", k: "compute" }
    ],
    steps: [
      { p: [["client", "cog"]], t: "The user signs in to a Cognito user pool and receives a JWT." },
      { p: [["client", "api", "fn"]], t: "API Gateway validates the JWT with a built-in authorizer, applies throttling, and invokes the function synchronously." },
      { p: [["fn", "ddb"]], t: "The function writes the order with a conditional put (idempotent) and returns `201` within milliseconds. The client doesn't wait for fulfilment." },
      { p: [["fn", "sfn"]], async: true, t: "Long-running work goes to Step Functions. Starting the execution is asynchronous; the workflow owns retries, timeouts and compensation." },
      { p: [["sfn", "pay"], ["sfn", "ship"]], t: "The workflow charges the card with exponential backoff, then waits (hours or days if needed) for the warehouse to call back with a task token. Idle waiting costs nothing." }
    ]
  },
  compare: {
    title: "Where should this code run?",
    cols: ["", "Lambda", "ECS on Fargate", "EC2"],
    rows: [
      ["Max run time", "15 min", "Unlimited", "Unlimited"],
      ["Idle cost", "Zero", "Per running task", "Per running instance"],
      ["Scaling unit", "Request", "Task", "Instance"],
      ["Good for", "Event glue, spiky APIs, cron jobs", "Steady APIs, long workers, any container", "Special hardware, licensing, full OS control"],
      ["Watch out for", "Cold starts, connection storms", "Image size, task right-sizing", "Patching, fleet management"]
    ]
  },
  lab: {
    title: "Ship a serverless API with SAM", time: "~60 min · free tier",
    goal: "An HTTP API that creates orders in DynamoDB, on Arm, with least-privilege IAM generated for you.",
    steps: [
      { t: "Create `template.yaml`.", lang: "yaml", c: String.raw`AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Globals:
  Function:
    Runtime: python3.13
    Architectures: [arm64]
    MemorySize: 512
    Timeout: 10
    Tracing: Active
Resources:
  OrdersTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey: { Name: id, Type: String }
  CreateOrder:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.handler
      CodeUri: src/
      Environment:
        Variables: { TABLE: !Ref OrdersTable }
      Policies:
        - DynamoDBWritePolicy: { TableName: !Ref OrdersTable }
      Events:
        Api:
          Type: HttpApi
          Properties: { Path: /orders, Method: post }
Outputs:
  ApiUrl:
    Value: !Sub "https://${'$'}{ServerlessHttpApi}.execute-api.${'$'}{AWS::Region}.amazonaws.com"` },
      { t: "Create `src/app.py`. The idempotency key comes from the client, so a retried POST can't create a second order.", lang: "python", c: String.raw`import json, os, boto3
from botocore.exceptions import ClientError

table = boto3.resource("dynamodb").Table(os.environ["TABLE"])   # created once per environment

def handler(event, context):
    body = json.loads(event.get("body") or "{}")
    key = (event.get("headers") or {}).get("idempotency-key")
    if not key:
        return {"statusCode": 400, "body": "missing Idempotency-Key header"}
    order = {"id": key, "item": body.get("item", "unknown"), "qty": int(body.get("qty", 1))}
    try:
        table.put_item(Item=order, ConditionExpression="attribute_not_exists(id)")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return {"statusCode": 200, "body": json.dumps({"id": key, "duplicate": True})}
        raise
    return {"statusCode": 201, "body": json.dumps(order)}` },
      { t: "Build, deploy and call it twice with the same key.", c: String.raw`sam build && sam deploy --guided      # stack name: lab-orders
URL=$(aws cloudformation describe-stacks --stack-name lab-orders \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)
for i in 1 2; do
  curl -s -X POST $URL/orders -H 'Idempotency-Key: 7f3a' -d '{"item":"book","qty":2}'; echo
done
sam logs -n CreateOrder --stack-name lab-orders --tail` },
      { t: "Stretch: add a JWT authorizer (Cognito user pool) to the HttpApi, and a Step Functions state machine (`AWS::Serverless::StateMachine`) that the function starts with `StartExecution`." }
    ],
    cleanup: { t: "Remove the stack and its artifacts.", c: String.raw`sam delete --stack-name lab-orders` }
  },
  cost: [
    "You pay per request plus GB-seconds. arm64 is about 20% cheaper per GB-second than x86 and often faster.",
    "HTTP APIs cost much less per million requests than REST APIs. Choose REST only when you need its features.",
    "CloudWatch Logs ingestion can cost more than the Lambda compute itself. Set log retention and log levels deliberately."
  ],
  security: [
    "One role per function, scoped to its own resources (SAM policy templates help).",
    "Validate and size-limit input at the edge. Throttle per route and per client.",
    "Secrets come from Secrets Manager or Parameter Store via the extension or SDK, cached in memory and never put in plain environment variables."
  ],
  quiz: [
    { q: "A video transcoding job takes about 25 minutes. Where should it run?",
      o: ["Lambda with maximum memory", "A Fargate task (or AWS Batch), started by Step Functions or EventBridge", "Lambda chaining itself every 14 minutes", "API Gateway with a long timeout"], a: 1,
      why: "Lambda's hard limit is 15 minutes. Containers on Fargate or Batch have no run-time cap, and Step Functions can orchestrate them." },
    { q: "When traffic spikes, Lambda scales to 1,000 concurrent executions and overwhelms a legacy database.",
      o: ["Set reserved concurrency on the function and/or buffer writes through SQS", "Increase the function's memory", "Use provisioned concurrency", "Turn on X-Ray"], a: 0,
      why: "Reserved concurrency caps parallelism. A queue absorbs the burst and lets consumers drain at a rate the database can handle." },
    { q: "An order workflow charges a card, reserves stock, refunds on failure, and can wait up to 3 days for manual approval.",
      o: ["One Lambda function with `sleep()`", "Step Functions Standard with a callback task token for the approval step", "Step Functions Express", "Cron jobs polling a table"], a: 1,
      why: "Standard workflows run up to a year, support the callback pattern, and are designed for compensation (saga) logic." }
  ],
  docs: [["Lambda developer guide", "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"], ["Powertools for AWS Lambda", "https://docs.powertools.aws.dev/lambda/python/latest/"], ["Serverless Land patterns", "https://serverlessland.com/patterns"]],
  certs: { SAA: 2, SAP: 2, DOP: 1 }
});

/* ===================== 09 ===================== */
M({
  id: "m09", phase: 2, title: "Event-Driven Integration", hours: 6,
  services: ["SQS", "SNS", "EventBridge", "Kinesis", "Data Firehose"],
  summary: "Loose coupling is how AWS systems absorb spikes and survive partial failure. Learn which messaging service fits which job, and design consumers that tolerate duplicates and poison messages.",
  outcomes: [
    "Pick between SQS, SNS, EventBridge and Kinesis for a given integration.",
    "Configure visibility timeouts, dead-letter queues and redrive.",
    "Build fan-out with SNS to SQS and content-based routing with EventBridge.",
    "Design idempotent consumers for at-least-once delivery."
  ],
  concepts: [
    ["SQS", "A durable queue. Standard gives practically unlimited throughput with at-least-once delivery. FIFO gives ordering per message group and deduplication."],
    ["Visibility timeout & DLQ", "A received message is hidden until deleted or the timeout expires. After `maxReceiveCount` failed receives it moves to a dead-letter queue for inspection and redrive."],
    ["SNS", "Pub/sub push to many subscribers (SQS, Lambda, HTTP, email, SMS). Filter policies let each subscriber receive only what it needs."],
    ["EventBridge", "An event bus with content-based rules, schema registry, archive and replay, SaaS partner sources, Pipes (point-to-point) and Scheduler."],
    ["Kinesis Data Streams", "An ordered log, sharded by partition key, with replay within the retention window. Multiple consumers read independently."],
    ["At-least-once", "Most AWS integrations may deliver twice. Consumers must be idempotent, using a dedupe key or a conditional write."]
  ],
  diagram: {
    title: "Fan-out, buffering and routing",
    nodes: [
      { id: "ord", x: 80, y: 140, l: "Order service", s: "publishes", k: "compute" },
      { id: "sns", x: 250, y: 140, l: "SNS topic", s: "order-placed", k: "int" },
      { id: "q1", x: 440, y: 70, l: "SQS billing", s: "buffer", k: "int" },
      { id: "q2", x: 440, y: 210, l: "SQS shipping", s: "buffer", k: "int" },
      { id: "c1", x: 650, y: 70, l: "Billing worker", s: "Lambda", k: "compute" },
      { id: "c2", x: 650, y: 210, l: "Shipping worker", s: "ECS", k: "compute" },
      { id: "dlq", x: 650, y: 330, l: "Dead-letter queue", s: "after 3 tries", k: "int" },
      { id: "eb", x: 250, y: 320, l: "EventBridge bus", s: "domain events", k: "int" },
      { id: "an", x: 440, y: 340, l: "Rule: total > 100", s: "→ fraud check", k: "compute" }
    ],
    steps: [
      { p: [["ord", "sns", "q1"], ["ord", "sns", "q2"]], async: true, t: "One publish, many subscribers. SNS pushes a copy to each team's own queue, so teams evolve independently." },
      { p: [["q1", "c1"], ["q2", "c2"]], t: "Each worker polls at its own pace. A spike just makes the queue deeper; it doesn't take down the consumer." },
      { p: [["q2", "dlq"]], t: "A poison message fails 3 times (`maxReceiveCount`) and moves to the DLQ. Alarm on DLQ depth, fix the bug, then redrive." },
      { p: [["ord", "eb", "an"]], async: true, t: "Domain events also go to EventBridge, where content-based rules route them. Only orders with `total > 100` trigger the fraud check." }
    ]
  },
  compare: {
    title: "Which messaging service?",
    cols: ["", "SQS", "SNS", "EventBridge", "Kinesis Data Streams"],
    rows: [
      ["Model", "Queue (pull)", "Pub/sub (push)", "Event bus with rules", "Ordered stream (log)"],
      ["Consumers per message", "One", "Many", "Many (by rule)", "Many, independent"],
      ["Ordering", "FIFO queues only", "FIFO topics only", "No", "Per shard / partition key"],
      ["Replay", "No", "No", "Archive & replay", "Within retention (up to 365 days)"],
      ["Reach for it when", "Buffering work, decoupling producer and consumer", "Fan-out notifications", "Routing between services, SaaS events, schedules", "Clickstreams, telemetry, CDC with replay"]
    ]
  },
  lab: {
    title: "Fan-out with a dead-letter queue", time: "~50 min · free tier",
    goal: "Publish once, receive in a queue, watch a poison message land in the DLQ, then route events by content with EventBridge.",
    steps: [
      { t: "Create the topic, the DLQ and the main queue with a redrive policy. A short visibility timeout keeps the lab fast.", c: String.raw`TOPIC=$(aws sns create-topic --name orders --query TopicArn --output text)
DLQ_URL=$(aws sqs create-queue --queue-name shipping-dlq --query QueueUrl --output text)
DLQ_ARN=$(aws sqs get-queue-attributes --queue-url $DLQ_URL --attribute-names QueueArn --query Attributes.QueueArn --output text)
cat > q-attrs.json <<EOF
{"VisibilityTimeout":"5","RedrivePolicy":"{\"deadLetterTargetArn\":\"$DLQ_ARN\",\"maxReceiveCount\":\"3\"}"}
EOF
Q_URL=$(aws sqs create-queue --queue-name shipping --attributes file://q-attrs.json --query QueueUrl --output text)
Q_ARN=$(aws sqs get-queue-attributes --queue-url $Q_URL --attribute-names QueueArn --query Attributes.QueueArn --output text)` },
      { t: "Allow only this topic to send to the queue, then subscribe.", c: String.raw`cat > q-policy.json <<EOF
{"Policy":"{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"sns.amazonaws.com\"},\"Action\":\"sqs:SendMessage\",\"Resource\":\"$Q_ARN\",\"Condition\":{\"ArnEquals\":{\"aws:SourceArn\":\"$TOPIC\"}}}]}"}
EOF
aws sqs set-queue-attributes --queue-url $Q_URL --attributes file://q-policy.json
aws sns subscribe --topic-arn $TOPIC --protocol sqs --notification-endpoint $Q_ARN \
  --attributes RawMessageDelivery=true` },
      { t: "Publish, then act as a broken consumer: receive without deleting, four times. After the third receive the message moves to the DLQ.", c: String.raw`aws sns publish --topic-arn $TOPIC --message '{"orderId":"1001","total":59.9}'
for i in 1 2 3 4; do
  aws sqs receive-message --queue-url $Q_URL --wait-time-seconds 5 \
    --attribute-names ApproximateReceiveCount --query 'Messages[0].Attributes'
  sleep 6
done
aws sqs get-queue-attributes --queue-url $DLQ_URL --attribute-names ApproximateNumberOfMessages` },
      { t: "Redrive the DLQ back to the source queue once the bug is fixed.", c: String.raw`aws sqs start-message-move-task --source-arn $DLQ_ARN` },
      { t: "Content-based routing: a rule that only matches large orders. Add your queue as the target (its policy must also allow `events.amazonaws.com`), then send test events.", c: String.raw`aws events put-rule --name big-orders \
  --event-pattern '{"source":["shop.orders"],"detail":{"total":[{"numeric":[">",100]}]}}'
aws events test-event-pattern \
  --event-pattern '{"source":["shop.orders"],"detail":{"total":[{"numeric":[">",100]}]}}' \
  --event '{"id":"1","account":"'$ACCOUNT_ID'","source":"shop.orders","time":"2026-10-27T00:00:00Z","region":"ap-southeast-1","resources":[],"detail-type":"OrderPlaced","detail":{"total":250}}'` }
    ],
    cleanup: { t: "Delete everything you created.", c: String.raw`aws events delete-rule --name big-orders
aws sns delete-topic --topic-arn $TOPIC
aws sqs delete-queue --queue-url $Q_URL
aws sqs delete-queue --queue-url $DLQ_URL` }
  },
  cost: [
    "SQS and SNS each include 1 million requests per month free. Batch up to 10 messages per call and use long polling (`WaitTimeSeconds=20`) to cut empty receives.",
    "EventBridge charges per event published to custom buses. AWS service events on the default bus are free.",
    "Kinesis provisioned mode bills per shard-hour even when idle. On-demand mode suits unpredictable streams."
  ],
  security: [
    "Queues and topics use SSE (SQS-managed or KMS). Their resource policies restrict senders with `aws:SourceArn` or `aws:SourceAccount`.",
    "Producers can only publish and consumers can only receive and delete. No `sqs:*`.",
    "Events carry IDs and references, not full PII payloads that end up in every subscriber's logs."
  ],
  quiz: [
    { q: "A consumer occasionally processes the same SQS standard message twice and charges a customer twice.",
      o: ["Switch on long polling", "Make the consumer idempotent, for example a conditional write on the order ID", "Increase the DLQ max receive count", "Use SNS instead"], a: 1,
      why: "Standard queues are at-least-once. Duplicates are expected, so the consumer must tolerate them (or use FIFO deduplication where it fits)." },
    { q: "You need ordered processing per customer, and a new analytics consumer must replay the last 7 days.",
      o: ["SQS standard", "SNS with filters", "Kinesis Data Streams partitioned by customer ID, with 7+ days of retention", "EventBridge Scheduler"], a: 2,
      why: "Kinesis keeps order per partition key and lets independent consumers re-read the stream within the retention period." },
    { q: "Events from a SaaS partner must go to five different targets depending on event content, with minimal code.",
      o: ["Poll the partner API from Lambda", "EventBridge partner event source with rules per target", "SQS FIFO", "Kinesis Firehose"], a: 1,
      why: "EventBridge receives events directly from supported SaaS partners, and rules filter and route them with no glue code." }
  ],
  docs: [["Choosing messaging services", "https://docs.aws.amazon.com/decision-guides/latest/sns-or-sqs-or-eventbridge/sns-or-sqs-or-eventbridge.html"], ["SQS dead-letter queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html"]],
  certs: { SAA: 2, SAP: 2, DOP: 1 }
});
})(window.COURSE);
