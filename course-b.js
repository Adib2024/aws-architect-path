(function (C) {
const M = m => C.modules.push(m);

/* ===================== 10 ===================== */
M({
  id: "m10", phase: 2, title: "Containers: ECS, Fargate & EKS", hours: 8,
  services: ["ECR", "ECS", "Fargate", "EKS", "Service Connect"],
  summary: "Containers are the default packaging for long-running services. On AWS the main decision is ECS (simpler, AWS-native) versus EKS (Kubernetes and its ecosystem), and Fargate versus managing your own nodes.",
  outcomes: [
    "Explain task definitions, services, task roles and execution roles.",
    "Deploy a load-balanced Fargate service with auto scaling and safe rollbacks.",
    "Choose between ECS and EKS for a team and workload.",
    "Debug a running task with ECS Exec, without SSH."
  ],
  concepts: [
    ["ECR", "Private registry with image scanning, immutable tags, lifecycle policies and pull-through cache for public registries."],
    ["Task definition", "Versioned spec for one or more containers: image, CPU/memory, ports, env, secrets, logging, and the two IAM roles."],
    ["Task role vs execution role", "The **execution role** is used by the ECS agent to pull images, fetch secrets and write logs. The **task role** is what your code uses to call AWS APIs."],
    ["Service", "Keeps N tasks running behind a load balancer, with rolling or blue/green deployments, a circuit breaker and auto scaling."],
    ["Fargate", "Serverless compute for containers: no instances to patch, billed per vCPU and GB-second. Fargate Spot gives up to 70% off for interruptible tasks."],
    ["EKS", "Managed Kubernetes control plane. EKS Auto Mode or Karpenter manages nodes; Pod Identity grants IAM per pod."]
  ],
  diagram: {
    title: "Build, ship and run a container service",
    groups: [{ x: 280, y: 200, w: 300, h: 180, l: "ECS SERVICE ON FARGATE · private subnets", k: "az" }],
    nodes: [
      { id: "ci", x: 80, y: 80, l: "CI build", s: "docker buildx", k: "ops" },
      { id: "ecr", x: 250, y: 80, l: "ECR", s: "tag = git SHA", k: "data" },
      { id: "ecs", x: 430, y: 80, l: "ECS scheduler", s: "task def rev 12", k: "compute" },
      { id: "alb", x: 100, y: 290, l: "ALB", s: "/api/*", k: "net" },
      { id: "t1", x: 360, y: 260, l: "Task", s: "AZ a · awsvpc ENI", k: "compute" },
      { id: "t2", x: 500, y: 335, l: "Task", s: "AZ b · awsvpc ENI", k: "compute" },
      { id: "sec", x: 680, y: 150, l: "Secrets Manager", s: "DB credentials", k: "sec" },
      { id: "logs", x: 680, y: 320, l: "CloudWatch Logs", s: "awslogs driver", k: "ops" }
    ],
    steps: [
      { p: [["ci", "ecr"]], t: "CI builds the image, tags it with the git SHA (never `latest` in prod) and pushes it. ECR scans it for CVEs." },
      { p: [["ecr", "ecs", "t1"], ["ecs", "t2"]], t: "A new task definition revision is registered. The scheduler starts new tasks spread across AZs, each with its own ENI in a private subnet." },
      { p: [["t1", "sec"], ["t2", "sec"]], t: "At start-up the **execution role** fetches secrets and injects them as env vars. The app itself calls AWS with the **task role**." },
      { p: [["alb", "t1"], ["alb", "t2"]], t: "Once health checks pass, the ALB routes to the new tasks' IPs and drains the old ones. The circuit breaker rolls back if new tasks keep failing." },
      { p: [["t1", "logs"], ["t2", "logs"]], t: "stdout and stderr stream to CloudWatch Logs (or to any destination through FireLens). Container Insights adds per-task metrics." }
    ]
  },
  compare: {
    title: "ECS or EKS?",
    cols: ["", "Amazon ECS", "Amazon EKS"],
    rows: [
      ["Learning curve", "Low: a handful of AWS concepts", "High: the Kubernetes API, controllers, Helm"],
      ["Control plane cost", "Free", "Per cluster per hour (higher on extended-support versions)"],
      ["Ecosystem", "AWS-integrated (ALB, IAM, Cloud Map)", "CNCF ecosystem: operators, service meshes, GitOps"],
      ["Portability", "AWS only", "Runs anywhere Kubernetes runs"],
      ["Choose when", "Small or medium team, AWS-only, wants simplicity", "Kubernetes skills exist, multi-cloud or on-prem, needs operators"]
    ]
  },
  lab: {
    title: "A load-balanced Fargate service in CDK", time: "~75 min · ~US$0.10/h",
    goal: "Deploy a containerised Node.js service behind an ALB with auto scaling, a deployment circuit breaker and ECS Exec.",
    steps: [
      { t: "Create the app in `app/`.", lang: "javascript", c: String.raw`// app/server.js
require('http').createServer((req, res) => {
  if (req.url === '/health') return res.end('ok');
  res.end('hello from task ' + process.env.HOSTNAME + '\n');
}).listen(8080);` },
      { t: "And its Dockerfile (pulled from ECR Public to avoid Docker Hub rate limits).", lang: "dockerfile", c: String.raw`FROM public.ecr.aws/docker/library/node:22-alpine
WORKDIR /app
COPY server.js .
USER node
EXPOSE 8080
CMD ["node", "server.js"]` },
      { t: "In a CDK app, add the service. The L3 pattern creates the VPC wiring, ALB, target group, roles and log group.", lang: "typescript", c: String.raw`import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as patterns from 'aws-cdk-lib/aws-ecs-patterns';

const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

const web = new patterns.ApplicationLoadBalancedFargateService(this, 'Web', {
  cluster,
  cpu: 256,
  memoryLimitMiB: 512,
  desiredCount: 2,
  taskImageOptions: { image: ecs.ContainerImage.fromAsset('./app'), containerPort: 8080 },
  circuitBreaker: { rollback: true },
  enableExecuteCommand: true,
});
web.targetGroup.configureHealthCheck({ path: '/health' });

const scaling = web.service.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 6 });
scaling.scaleOnCpuUtilization('Cpu', { targetUtilizationPercent: 60 });` },
      { t: "Deploy, hit the URL a few times, then open a shell inside a running task.", c: String.raw`npx cdk deploy
curl http://<LoadBalancerDNS>/
TASK=$(aws ecs list-tasks --cluster <cluster-name> --query 'taskArns[0]' --output text)
aws ecs execute-command --cluster <cluster-name> --task $TASK --container web --interactive --command "/bin/sh"` },
      { t: "Break a deploy on purpose: change the health-check path to `/nope` and deploy. Watch the circuit breaker roll back to the last working revision.", c: String.raw`aws ecs describe-services --cluster <cluster-name> --services <service-name> \
  --query 'services[0].deployments[].[status,rolloutState,rolloutStateReason]' --output table` },
      { t: "Kubernetes track (optional, ~US$0.10/h for the control plane alone): `eksctl create cluster --name lab --region ap-southeast-1 --enable-auto-mode`, deploy the same image with a Deployment and Service, then delete the cluster the same day." }
    ],
    cleanup: { t: "Destroy the stack. If you tried the EKS track, delete that cluster too.", c: String.raw`npx cdk destroy
eksctl delete cluster --name lab --region ap-southeast-1` }
  },
  cost: [
    "Right-size task CPU and memory using Container Insights. Over-provisioned tasks are the most common Fargate waste.",
    "Fargate Spot and Graviton (`ARM64` runtime platform) cut compute cost for suitable services.",
    "Image pulls through NAT cost per GB. Add ECR interface endpoints plus the S3 gateway endpoint, and keep images small."
  ],
  security: [
    "Images run as non-root with a read-only root file system where possible, and are scanned on push.",
    "Secrets are injected from Secrets Manager or SSM via the task definition, never baked into images.",
    "Each service has its own task role. On EKS, use Pod Identity or IRSA, never node-wide credentials."
  ],
  quiz: [
    { q: "New tasks fail at start-up with `AccessDeniedException` while fetching a secret, before your code runs.",
      o: ["The task role lacks `secretsmanager:GetSecretValue`", "The **execution role** lacks permission to read the secret (and its KMS key)", "The ALB security group is wrong", "The container port is wrong"], a: 1,
      why: "Secret injection at start-up is done by the ECS agent using the execution role. The task role is for calls your app makes at runtime." },
    { q: "A team of 4 runs 10 microservices on AWS only and has no Kubernetes experience. Platform choice?",
      o: ["Self-managed Kubernetes on EC2", "ECS on Fargate", "EKS with self-managed node groups", "Lambda for everything"], a: 1,
      why: "ECS on Fargate removes both cluster and node management, which is the lowest operational load for a small AWS-only team." },
    { q: "A bad image keeps crashing and the service flaps for an hour before anyone notices.",
      o: ["Increase desired count", "Enable the deployment circuit breaker with rollback (and alarm on it)", "Use bigger tasks", "Disable health checks"], a: 1,
      why: "The circuit breaker detects tasks that repeatedly fail to reach steady state and rolls back to the last working deployment." }
  ],
  docs: [["ECS best practices", "https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html"], ["EKS best practices", "https://docs.aws.amazon.com/eks/latest/best-practices/introduction.html"]],
  certs: { SAA: 2, SAP: 2, DOP: 2 }
});

/* ===================== 11 ===================== */
M({
  id: "m11", phase: 2, title: "DNS, CDN & the Edge", hours: 5,
  services: ["Route 53", "CloudFront", "ACM", "Global Accelerator", "WAF"],
  summary: "The edge is where you win latency, absorb attacks and route users between Regions. Route 53 decides where traffic goes; CloudFront decides what never has to reach your origin.",
  outcomes: [
    "Use Route 53 routing policies for latency, failover and gradual migration.",
    "Put CloudFront in front of S3 and an ALB with separate cache behaviours.",
    "Lock S3 origins with Origin Access Control.",
    "Choose between CloudFront and Global Accelerator."
  ],
  concepts: [
    ["Alias records", "Route 53 extension that points a name (including the zone apex) at AWS resources. Queries to AWS targets are free."],
    ["Routing policies", "Simple, weighted (canary migrations), latency-based, failover (with health checks), geolocation, geoproximity, IP-based and multivalue."],
    ["CloudFront behaviours", "Path patterns (`/static/*`, `/api/*`) map to origins, each with its own cache policy, origin request policy and functions."],
    ["Origin Access Control", "CloudFront signs requests to S3 with SigV4, so the bucket stays fully private and only that distribution can read it."],
    ["Edge compute", "CloudFront Functions (sub-ms, header and URL rewrites) and Lambda@Edge (heavier logic, network calls)."],
    ["Global Accelerator", "Two static anycast IPs that route TCP/UDP over the AWS backbone to the healthiest Regional endpoint. No caching."]
  ],
  diagram: {
    title: "One domain, cached static files, dynamic API",
    nodes: [
      { id: "user", x: 80, y: 220, l: "User", s: "app.example.com", k: "user" },
      { id: "r53", x: 240, y: 80, l: "Route 53", s: "alias → CloudFront", k: "net" },
      { id: "cf", x: 400, y: 220, l: "CloudFront edge", s: "TLS · cache", k: "edge" },
      { id: "waf", x: 400, y: 80, l: "AWS WAF", s: "web ACL", k: "sec" },
      { id: "s3", x: 640, y: 120, l: "S3 bucket", s: "/static/* via OAC", k: "data" },
      { id: "alb", x: 640, y: 320, l: "ALB origin", s: "/api/* · no cache", k: "net" },
      { id: "acm", x: 240, y: 350, l: "ACM certificate", s: "in us-east-1", k: "sec" }
    ],
    steps: [
      { p: [["user", "r53"]], t: "DNS resolves the alias record to CloudFront. The nearest edge answers based on the resolver's location." },
      { p: [["user", "cf", "waf"], ["acm", "cf"]], t: "TLS terminates at the edge using an ACM certificate (CloudFront certificates must live in `us-east-1`). WAF rules run before anything else." },
      { p: [["cf", "s3"]], t: "`/static/*` cache miss: CloudFront fetches from the private bucket via OAC. Later requests are served from the edge cache." },
      { p: [["cf", "alb"]], t: "`/api/*` uses a no-cache policy and forwards auth headers to the ALB over the AWS backbone, with persistent connections to the origin." }
    ]
  },
  lab: {
    title: "Private S3 website behind CloudFront", time: "~45 min · free tier",
    goal: "Serve a static site from a bucket that is not public, then observe cache misses, hits and invalidations.",
    steps: [
      { t: "Add this to a CDK stack.", lang: "typescript", c: String.raw`import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const site = new s3.Bucket(this, 'Site', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const cdn = new cloudfront.Distribution(this, 'Cdn', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(site),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
  },
  defaultRootObject: 'index.html',
});
new cdk.CfnOutput(this, 'SiteBucket', { value: site.bucketName });
new cdk.CfnOutput(this, 'CdnDomain', { value: cdn.distributionDomainName });
new cdk.CfnOutput(this, 'CdnId', { value: cdn.distributionId });` },
      { t: "Deploy, upload a page, and confirm the bucket itself refuses direct access.", c: String.raw`npx cdk deploy
echo '<h1>Hello from the edge</h1>' > index.html
aws s3 cp index.html s3://<SiteBucket>/
curl -s -o /dev/null -w "%{http_code}\n" https://<SiteBucket>.s3.ap-southeast-1.amazonaws.com/index.html   # 403` },
      { t: "Watch the cache: the first request is a Miss, the second a Hit.", c: String.raw`curl -sI https://<CdnDomain>/ | grep -i -E 'x-cache|age'
curl -sI https://<CdnDomain>/ | grep -i -E 'x-cache|age'` },
      { t: "Change the page and invalidate it. In real deployments, prefer versioned file names (`app.3f9c.js`) so you rarely need invalidations.", c: String.raw`aws cloudfront create-invalidation --distribution-id <CdnId> --paths "/index.html"` }
    ],
    cleanup: { t: "Destroy the stack. CloudFront takes a few minutes to disable and delete.", c: String.raw`npx cdk destroy` }
  },
  cost: [
    "CloudFront's always-free tier includes 1 TB of data out per month, and edge egress is often cheaper than egress straight from the origin.",
    "A higher cache-hit ratio means fewer origin requests and smaller ALB and compute bills. Strip tracking query strings and cookies from cache keys.",
    "Route 53 charges per hosted zone per month and per million queries. Alias queries to AWS resources are free."
  ],
  security: [
    "S3 origins use OAC. The bucket has no public access and its policy allows only the distribution's ARN.",
    "Viewers are redirected to HTTPS with a modern TLS security policy. HSTS is added through a response headers policy.",
    "WAF is attached at the edge. Shield Standard protects every distribution automatically."
  ],
  quiz: [
    { q: "Your ACM certificate in `ap-southeast-1` doesn't appear when you configure a CloudFront distribution.",
      o: ["CloudFront needs the certificate in `us-east-1`", "ACM certificates can't be used with CloudFront", "You must import it as a self-signed certificate", "The domain must use Route 53"], a: 0,
      why: "CloudFront is a global service whose certificates are managed in `us-east-1`. Regional ALBs use certificates in their own Region." },
    { q: "A multiplayer game on UDP needs two static IPs worldwide and fast Regional failover. No caching needed.",
      o: ["CloudFront", "Global Accelerator", "Route 53 latency records", "An NLB in each Region with Elastic IPs"], a: 1,
      why: "Global Accelerator provides static anycast IPs for TCP/UDP, routes over the AWS backbone, and fails over in seconds without waiting for DNS TTLs." },
    { q: "Cache hit ratio is 8% because every URL carries unique `utm_*` and `fbclid` parameters.",
      o: ["Lower the TTL", "Use a cache policy that excludes those query strings from the cache key", "Add another origin", "Turn on Origin Shield only"], a: 1,
      why: "Anything in the cache key creates a separate cache entry. Include only the parameters that change the response." }
  ],
  docs: [["CloudFront developer guide", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"], ["Route 53 routing policies", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"]],
  certs: { SAA: 2, SAP: 2, ANS: 2, SCS: 1 }
});

/* ===================== 12 ===================== */
M({
  id: "m12", phase: 2, title: "CI/CD & Deployment Strategies", hours: 6,
  services: ["GitHub Actions OIDC", "CodePipeline", "CodeDeploy", "AppConfig"],
  summary: "A good pipeline makes deploying boring. You'll federate CI into AWS without stored keys, then release changes gradually, with alarms that roll back automatically.",
  outcomes: [
    "Federate GitHub Actions into AWS with OIDC and a narrowly scoped role.",
    "Pick between rolling, blue/green, canary and feature-flag releases.",
    "Wire alarm-based automatic rollback into a deployment.",
    "Ship database changes safely with expand/contract migrations."
  ],
  concepts: [
    ["OIDC federation", "The CI provider issues a signed token per job. An IAM role trusts that provider and specific repos and branches, so there are no long-lived keys."],
    ["Build once, promote", "Build one immutable artifact (image digest, zip hash) and promote it through environments. Never rebuild for prod."],
    ["Rolling", "Replace instances or tasks in batches. Cheap, but old and new versions serve side by side and rollback is slow."],
    ["Blue/green", "Stand up the new version beside the old and switch traffic at once. Instant rollback. Available for ECS natively, and via CodeDeploy."],
    ["Canary / linear", "Shift 5–10% first, watch the alarms, then shift the rest. Lambda aliases, CodeDeploy and ECS support this."],
    ["Feature flags", "Separate deploy from release. AppConfig serves flags with validators and its own gradual rollout and rollback."]
  ],
  diagram: {
    title: "Keyless pipeline with a canary release",
    nodes: [
      { id: "pr", x: 80, y: 80, l: "Merge to main", s: "GitHub", k: "user" },
      { id: "gha", x: 250, y: 80, l: "GitHub Actions", s: "OIDC token", k: "ops" },
      { id: "role", x: 440, y: 80, l: "IAM deploy role", s: "AssumeRoleWithWebIdentity", k: "sec" },
      { id: "build", x: 250, y: 220, l: "Build & test", s: "SAST · image scan", k: "ops" },
      { id: "lb", x: 440, y: 260, l: "Traffic shifter", s: "ALB / alias weights", k: "net" },
      { id: "blue", x: 640, y: 180, l: "Blue v41", s: "90% traffic", k: "compute" },
      { id: "green", x: 640, y: 340, l: "Green v42", s: "10% canary", k: "compute" },
      { id: "alarm", x: 640, y: 70, l: "CloudWatch alarms", s: "5xx · p99 latency", k: "ops" }
    ],
    steps: [
      { p: [["pr", "gha", "role"]], t: "The workflow requests an OIDC token. STS checks the token's `sub` (repo and branch) against the role's trust policy and returns 1-hour credentials. No stored keys." },
      { p: [["gha", "build"]], t: "Build once: tests, static analysis and an image scan gate the artifact. Its digest is what gets promoted." },
      { p: [["build", "lb", "green"]], t: "Deploy v42 beside v41 and shift 10% of traffic to it." },
      { p: [["lb", "blue"], ["green", "alarm"]], t: "Most users stay on v41 while alarms watch v42's error rate and latency during the bake time." },
      { p: [["alarm", "role"]], async: true, t: "If an alarm fires, the deployment rolls back automatically. If not, traffic shifts to 100% and v41 is drained." }
    ]
  },
  compare: {
    title: "Deployment strategies",
    cols: ["Strategy", "Rollback speed", "Extra cost", "Risk exposure"],
    rows: [
      ["All at once", "Slow (redeploy)", "None", "Everyone, immediately"],
      ["Rolling", "Slow", "Little", "Grows batch by batch"],
      ["Blue/green", "Instant switch", "2× capacity while deploying", "Everyone at cut-over, but reversible"],
      ["Canary / linear", "Instant", "Small", "A small slice first"],
      ["Feature flag", "Instant (flip the flag)", "None", "Targeted users or percentage"]
    ]
  },
  lab: {
    title: "GitHub Actions to AWS without keys", time: "~45 min · free",
    goal: "Create an OIDC trust that only your repo's `main` branch can use, then deploy the module 07 CDK app from a workflow.",
    steps: [
      { t: "Register GitHub as an identity provider (once per account).", c: String.raw`aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com` },
      { t: "Create the role. The `sub` condition is the security boundary, so never use a wildcard for the whole org.", c: String.raw`cat > gha-trust.json <<EOF
{"Version":"2012-10-17","Statement":[{"Effect":"Allow",
 "Principal":{"Federated":"arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"},
 "Action":"sts:AssumeRoleWithWebIdentity",
 "Condition":{"StringEquals":{
   "token.actions.githubusercontent.com:aud":"sts.amazonaws.com",
   "token.actions.githubusercontent.com:sub":"repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main"}}}]}
EOF
aws iam create-role --role-name gha-deploy --assume-role-policy-document file://gha-trust.json
# CDK deploys by assuming its bootstrap roles, so this role only needs to assume those:
aws iam put-role-policy --role-name gha-deploy --policy-name assume-cdk --policy-document \
 '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"sts:AssumeRole","Resource":"arn:aws:iam::*:role/cdk-*"}]}'` },
      { t: "Add `.github/workflows/deploy.yml` to the repo.", lang: "yaml", c: String.raw`name: deploy
on:
  push:
    branches: [main]
permissions:
  id-token: write      # required for OIDC
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: prod   # add required reviewers on this environment in GitHub
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/gha-deploy
          aws-region: ap-southeast-1
      - run: npm ci && npm test
      - run: npx cdk deploy --require-approval never` },
      { t: "Push and watch the run. Then try it from another branch: the role assumption should fail. Stretch: a Lambda canary with alias weights.", c: String.raw`aws lambda update-alias --function-name <fn> --name live --function-version 7 \
  --routing-config '{"AdditionalVersionWeights":{"8":0.1}}'    # 10% to version 8` }
    ],
    cleanup: { t: "Keep the provider for the capstone, or remove it.", c: String.raw`aws iam delete-role-policy --role-name gha-deploy --policy-name assume-cdk
aws iam delete-role --role-name gha-deploy` }
  },
  cost: [
    "GitHub-hosted runners are billed by GitHub. CodeBuild bills per build minute. Both are usually small next to the environments they deploy.",
    "Blue/green doubles capacity during the switch. Keep bake times sensible and scale the old fleet down promptly.",
    "Ephemeral preview environments should destroy themselves on merge or after a TTL."
  ],
  security: [
    "OIDC trust is pinned to a repo plus a branch or GitHub environment, and each environment has its own deploy role.",
    "Production needs an approval gate (GitHub environment reviewers or a pipeline manual approval).",
    "Dependencies and images are scanned. Artifacts are referenced by digest, and optionally signed (AWS Signer, Notation)."
  ],
  quiz: [
    { q: "Your GitHub workflow uses an IAM user's access key stored as a repository secret. Better approach?",
      o: ["Rotate the key monthly", "Use OIDC federation into an IAM role scoped to the repo and branch", "Store the key in Secrets Manager", "Use the root account"], a: 1,
      why: "OIDC removes long-lived secrets entirely. Each job gets short-lived credentials only if the token claims match the trust policy." },
    { q: "Release to 5% of traffic for 10 minutes, then everyone, rolling back automatically on errors.",
      o: ["All-at-once deployment", "Canary deployment with CloudWatch alarm-based rollback", "Rolling update with batch size 1", "Manual DNS change"], a: 1,
      why: "Canary configurations (such as Canary10Percent10Minutes in CodeDeploy, or Lambda alias weights) plus alarms give exactly this behaviour." },
    { q: "Blue/green deploy, but v2 renames a database column that v1 still reads.",
      o: ["Rename the column during the switch", "Expand/contract: add the new column, dual-write, migrate, switch, and drop the old column in a later release", "Use a separate database per colour", "Skip blue/green for this release"], a: 1,
      why: "Both versions share the database during the switch, so every schema change must be backward compatible for at least one release." }
  ],
  docs: [["Configure OIDC for GitHub Actions", "https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services"], ["Deployment strategies whitepaper", "https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/deployment-strategies.html"]],
  certs: { SAA: 1, SAP: 1, DOP: 2 }
});

/* ===================== 13 ===================== */
M({
  id: "m13", phase: 3, title: "Observability", hours: 5,
  services: ["CloudWatch", "Logs Insights", "X-Ray / OpenTelemetry", "CloudTrail"],
  summary: "You can't operate what you can't see. Instrument the three signals (metrics, logs, traces), alert on symptoms users feel, and keep an audit trail of every API call.",
  outcomes: [
    "Define SLOs and alert on user-facing symptoms, not on every cause.",
    "Emit structured logs and custom metrics cheaply with EMF.",
    "Trace one request across services with OpenTelemetry and X-Ray.",
    "Answer 'who changed what, when' with CloudTrail."
  ],
  concepts: [
    ["Golden signals", "Latency, traffic, errors, saturation. Alert on these as users experience them (p99 latency, 5xx rate) and use dashboards for causes."],
    ["CloudWatch metrics & alarms", "Namespaces and dimensions. Alarms use M-of-N datapoints, composite alarms and anomaly detection."],
    ["Logs & Logs Insights", "Log groups with retention you set. Query with Logs Insights. Metric filters and Embedded Metric Format (EMF) turn logs into metrics."],
    ["Tracing", "OpenTelemetry (the ADOT collector) or the X-Ray SDK propagate a trace ID. CloudWatch Application Signals builds service maps and SLOs on top."],
    ["CloudTrail", "A record of API calls. Management events are on by default (90 days). Create an org trail to S3 for retention; data events cost extra."],
    ["SLOs", "Target and error budget, such as 99.9% of requests under 300 ms over 28 days. Burn-rate alarms page before the budget is gone."]
  ],
  diagram: {
    title: "From signal to page to root cause",
    nodes: [
      { id: "svc", x: 80, y: 200, l: "Service", s: "ECS / Lambda", k: "compute" },
      { id: "otel", x: 240, y: 200, l: "ADOT collector", s: "OpenTelemetry", k: "ops" },
      { id: "met", x: 430, y: 80, l: "CloudWatch Metrics", s: "EMF · custom", k: "ops" },
      { id: "logs", x: 430, y: 200, l: "CloudWatch Logs", s: "JSON logs", k: "ops" },
      { id: "trc", x: 430, y: 320, l: "X-Ray traces", s: "service map", k: "ops" },
      { id: "alarm", x: 640, y: 80, l: "SLO burn alarm", s: "p99 > 300 ms", k: "ops" },
      { id: "sns", x: 640, y: 200, l: "SNS → on-call", s: "Slack / pager", k: "int" },
      { id: "dash", x: 640, y: 320, l: "Investigate", s: "Logs Insights", k: "user" }
    ],
    steps: [
      { p: [["svc", "otel"]], t: "Code is instrumented once with OpenTelemetry. The collector (sidecar or Lambda layer) handles batching and export." },
      { p: [["otel", "met"], ["otel", "logs"], ["otel", "trc"]], t: "The three signals fan out: metrics for alerting, structured logs for detail, traces for the path a request took." },
      { p: [["met", "alarm", "sns"]], t: "Alarm on the **symptom** (p99 latency burning the error budget), with M-of-N datapoints so a single spike doesn't page anyone at 3 a.m." },
      { p: [["sns", "dash"], ["trc", "dash"], ["logs", "dash"]], t: "On-call jumps from the alarm to the trace and from the trace ID to its logs. Root cause in minutes, not hours." }
    ]
  },
  lab: {
    title: "Alarms, structured logs and an audit query", time: "~45 min · cents",
    goal: "Add an SLO-style alarm, query logs like a database, emit a business metric from Lambda, and find who deleted something.",
    steps: [
      { t: "Create an alarm on ALB target 5xx errors (from module 04 or 10). It fires on 3 of 5 one-minute periods and stays quiet when there is no data.", c: String.raw`TOPIC=$(aws sns create-topic --name oncall --query TopicArn --output text)
aws sns subscribe --topic-arn $TOPIC --protocol email --notification-endpoint you@example.com
aws cloudwatch put-metric-alarm --alarm-name web-5xx \
  --namespace AWS/ApplicationELB --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=LoadBalancer,Value=app/web-alb/<id> \
  --statistic Sum --period 60 --evaluation-periods 5 --datapoints-to-alarm 3 \
  --threshold 10 --comparison-operator GreaterThanThreshold \
  --treat-missing-data notBreaching --alarm-actions $TOPIC` },
      { t: "Run a Logs Insights query over the last hour (any log group with traffic).", c: String.raw`QID=$(aws logs start-query --log-group-name /aws/lambda/<fn> \
  --start-time $(date -d '-1 hour' +%s) --end-time $(date +%s) \
  --query-string 'fields @timestamp, @message
| filter @message like /ERROR/
| stats count(*) as errors by bin(5m)
| sort errors desc' --query queryId --output text)
sleep 5 && aws logs get-query-results --query-id $QID` },
      { t: "Emit a business metric from Lambda with Powertools. It writes EMF to the logs, and CloudWatch extracts the metric with no extra API calls.", lang: "python", c: String.raw`from aws_lambda_powertools import Logger, Metrics, Tracer
from aws_lambda_powertools.metrics import MetricUnit

logger, tracer = Logger(), Tracer()
metrics = Metrics(namespace="Shop")          # set POWERTOOLS_SERVICE_NAME=orders

@logger.inject_lambda_context
@tracer.capture_lambda_handler
@metrics.log_metrics
def handler(event, context):
    metrics.add_metric(name="OrderPlaced", unit=MetricUnit.Count, value=1)
    logger.info("order placed", extra={"order_id": event.get("id")})
    return {"ok": True}` },
      { t: "Audit: find who deleted a bucket or role recently.", c: String.raw`aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket --max-results 5 \
  --query 'Events[].[EventTime,Username,Resources[0].ResourceName]' --output table` },
      { t: "Set retention on every log group. Without it, logs are kept (and billed) forever.", c: String.raw`for g in $(aws logs describe-log-groups --query 'logGroups[?!retentionInDays].logGroupName' --output text); do
  aws logs put-retention-policy --log-group-name "$g" --retention-in-days 30
done` }
    ],
    cleanup: { t: "Delete the alarm and topic.", c: String.raw`aws cloudwatch delete-alarms --alarm-names web-5xx
aws sns delete-topic --topic-arn $TOPIC` }
  },
  cost: [
    "Log **ingestion** (about US$0.50/GB in many Regions) is usually the biggest observability cost. Log less at INFO, sample debug logs, and consider the Infrequent Access log class.",
    "Each custom metric (unique name + dimension combination) is billed monthly, so high-cardinality dimensions like user ID explode the bill.",
    "CloudTrail's first copy of management events is free. Data events (S3 object-level, Lambda invoke) are billed per event."
  ],
  security: [
    "An organization trail delivers to a separate log-archive account with log file validation and Object Lock.",
    "Logs never contain secrets, tokens or full card numbers. Use CloudWatch Logs data protection policies to mask PII.",
    "Access to logs is least-privilege too, because logs often hold sensitive data."
  ],
  quiz: [
    { q: "A production S3 bucket disappeared yesterday. Which service tells you who deleted it?",
      o: ["CloudWatch Metrics", "CloudTrail", "X-Ray", "AWS Config rules"], a: 1,
      why: "CloudTrail records the `DeleteBucket` API call with the principal, source IP and time. (AWS Config records the configuration history.)" },
    { q: "An alarm pages on-call several times a night because of single one-minute spikes.",
      o: ["Delete the alarm", "Require M-of-N datapoints (for example 3 of 5) or use a composite or burn-rate alarm", "Increase the period to 1 day", "Send alerts by email only"], a: 1,
      why: "M-of-N filters transient noise while still catching sustained problems. Burn-rate alarms tie paging to the SLO." },
    { q: "A request is slow and passes through 6 services. How do you find the slow hop?",
      o: ["grep every service's logs", "Distributed tracing (OpenTelemetry / X-Ray) with a propagated trace ID", "Increase instance sizes", "CloudTrail"], a: 1,
      why: "Traces show the time spent in each segment and subsegment, including downstream AWS calls." }
  ],
  docs: [["CloudWatch user guide", "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html"], ["AWS Distro for OpenTelemetry", "https://aws-otel.github.io/docs/introduction"]],
  certs: { SAA: 1, SAP: 2, DOP: 2, SCS: 1 }
});

/* ===================== 14 ===================== */
M({
  id: "m14", phase: 3, title: "Security & Data Protection", hours: 8,
  services: ["KMS", "Secrets Manager", "WAF / Shield", "GuardDuty", "Security Hub", "Macie"],
  summary: "Security is designed in layers: the edge, the network, identity, the data, and detection that assumes something will slip through. This module covers each layer and the managed services behind it.",
  outcomes: [
    "Use KMS customer-managed keys, key policies and envelope encryption.",
    "Store and rotate secrets properly.",
    "Protect web apps with WAF managed rules and rate limiting.",
    "Turn on organisation-wide threat detection and posture management."
  ],
  concepts: [
    ["KMS", "Managed keys in HSMs. Data is encrypted with data keys that are themselves encrypted by a KMS key (envelope encryption). Key policies decide who can use a key."],
    ["Secrets Manager vs Parameter Store", "Secrets Manager adds managed rotation, cross-Region replication and per-secret cost. Parameter Store SecureString is cheaper for config without rotation."],
    ["WAF & Shield", "WAF filters layer 7 (managed rule groups, rate limits, bot control). Shield Standard is automatic layer 3/4 protection; Shield Advanced adds a response team and cost protection."],
    ["Threat detection", "GuardDuty analyses CloudTrail, VPC Flow, DNS, EKS and runtime signals. Inspector scans for CVEs. Macie finds sensitive data in S3. Detective helps investigate."],
    ["Posture", "Security Hub aggregates findings and checks against standards such as AWS Foundational Security Best Practices and CIS. AWS Config records resource history."],
    ["Incident response", "Prepare runbooks, isolate (quarantine SG, revoke sessions), snapshot evidence, then eradicate and recover. Practise it before you need it."]
  ],
  diagram: {
    title: "Defence in depth for one request",
    nodes: [
      { id: "req", x: 80, y: 180, l: "Request", s: "from internet", k: "user" },
      { id: "shield", x: 230, y: 180, l: "Shield", s: "L3/L4 DDoS", k: "sec" },
      { id: "waf", x: 380, y: 180, l: "WAF", s: "SQLi · bots · rate", k: "sec" },
      { id: "app", x: 530, y: 180, l: "App", s: "task role", k: "compute" },
      { id: "sm", x: 530, y: 320, l: "Secrets Manager", s: "rotated creds", k: "sec" },
      { id: "db", x: 690, y: 180, l: "Encrypted DB", s: "Aurora", k: "data" },
      { id: "kms", x: 690, y: 60, l: "KMS key", s: "customer managed", k: "sec" },
      { id: "gd", x: 160, y: 330, l: "GuardDuty", s: "threat detection", k: "sec" },
      { id: "hub", x: 340, y: 330, l: "Security Hub", s: "findings + scores", k: "sec" }
    ],
    steps: [
      { p: [["req", "shield", "waf"]], t: "At the edge, Shield absorbs volumetric attacks and WAF blocks injection, known bad bots and IPs that exceed the rate limit." },
      { p: [["waf", "app", "sm"]], t: "The app has no credentials baked in. It fetches database credentials from Secrets Manager, which rotates them on schedule." },
      { p: [["app", "db", "kms"]], t: "Data at rest is encrypted with a customer-managed KMS key. Each use of the key is authorised by the key policy and logged in CloudTrail." },
      { p: [["gd", "hub"]], async: true, t: "Detection assumes prevention can fail. GuardDuty spots anomalies such as credential exfiltration or crypto mining, and Security Hub aggregates findings across accounts." }
    ]
  },
  compare: {
    title: "Which detection service?",
    cols: ["Service", "Looks at", "Finds"],
    rows: [
      ["GuardDuty", "CloudTrail, VPC Flow Logs, DNS, EKS audit logs, runtime", "Compromised credentials, crypto mining, malicious IPs"],
      ["Inspector", "EC2, ECR images, Lambda", "Software CVEs, network exposure"],
      ["Macie", "S3 objects", "PII, credentials, financial data"],
      ["Security Hub", "Findings from all of the above plus config checks", "Posture score against standards"],
      ["Detective", "Behaviour graphs", "Context during investigations"]
    ]
  },
  lab: {
    title: "Keys, secrets, WAF and a threat finding", time: "~60 min · ~US$1",
    goal: "Encrypt with your own key, store a secret under it, add WAF to a load balancer, and generate sample GuardDuty findings.",
    steps: [
      { t: "Create a customer-managed key with rotation, then encrypt and decrypt.", c: String.raw`KEY=$(aws kms create-key --description "lab app key" --query KeyMetadata.KeyId --output text)
aws kms create-alias --alias-name alias/lab-app --target-key-id $KEY
aws kms enable-key-rotation --key-id $KEY
echo "top secret" > secret.txt
aws kms encrypt --key-id alias/lab-app --plaintext fileb://secret.txt \
  --query CiphertextBlob --output text | base64 -d > secret.enc
aws kms decrypt --ciphertext-blob fileb://secret.enc --query Plaintext --output text | base64 -d` },
      { t: "Store a secret encrypted with that key.", c: String.raw`aws secretsmanager create-secret --name lab/db --kms-key-id alias/lab-app \
  --secret-string '{"username":"app","password":"change-me"}'
aws secretsmanager get-secret-value --secret-id lab/db --query SecretString --output text` },
      { t: "Create a web ACL with the AWS common rule set and a per-IP rate limit.", lang: "json", c: String.raw`[
  {"Name":"common","Priority":0,"OverrideAction":{"None":{}},
   "Statement":{"ManagedRuleGroupStatement":{"VendorName":"AWS","Name":"AWSManagedRulesCommonRuleSet"}},
   "VisibilityConfig":{"SampledRequestsEnabled":true,"CloudWatchMetricsEnabled":true,"MetricName":"common"}},
  {"Name":"rate-limit","Priority":1,"Action":{"Block":{}},
   "Statement":{"RateBasedStatement":{"Limit":500,"AggregateKeyType":"IP"}},
   "VisibilityConfig":{"SampledRequestsEnabled":true,"CloudWatchMetricsEnabled":true,"MetricName":"rate"}}
]` },
      { t: "Save that as `waf-rules.json`, create the ACL and attach it to your ALB.", c: String.raw`ACL=$(aws wafv2 create-web-acl --name lab-acl --scope REGIONAL --default-action Allow={} \
  --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=labAcl \
  --rules file://waf-rules.json --query Summary.ARN --output text)
aws wafv2 associate-web-acl --web-acl-arn $ACL --resource-arn $ALB
curl -s "http://$DNS/?q=<script>alert(1)</script>" -o /dev/null -w "%{http_code}\n"   # 403` },
      { t: "Enable GuardDuty and generate sample findings, then view them in Security Hub (enable it with the Foundational Security Best Practices standard).", c: String.raw`DET=$(aws guardduty create-detector --enable --query DetectorId --output text)
aws guardduty create-sample-findings --detector-id $DET
aws securityhub enable-security-hub --enable-default-standards` }
    ],
    cleanup: { t: "KMS keys can only be scheduled for deletion (7–30 days). GuardDuty and Security Hub start with a free trial; disable them in a sandbox if you won't keep them.", c: String.raw`aws wafv2 disassociate-web-acl --resource-arn $ALB
aws secretsmanager delete-secret --secret-id lab/db --force-delete-without-recovery
aws kms schedule-key-deletion --key-id $KEY --pending-window-in-days 7
aws guardduty delete-detector --detector-id $DET
aws securityhub disable-security-hub` }
  },
  cost: [
    "KMS: about US$1 per customer-managed key per month plus a small per-request fee. S3 Bucket Keys cut KMS request costs for SSE-KMS by up to 99%.",
    "Secrets Manager charges per secret per month plus API calls. Cache secrets in memory instead of fetching them on every request.",
    "Shield Advanced is a significant monthly subscription per organisation. It's worth it for high-profile public targets, not for most sandboxes."
  ],
  security: [
    "Key policies follow least privilege and separate key administrators from key users.",
    "GuardDuty, Security Hub and IAM Access Analyzer run in every account and Region, managed from a delegated security account.",
    "There is a tested incident-response runbook, including how to revoke a role's active sessions."
  ],
  quiz: [
    { q: "Auditors require that you can disable an encryption key instantly and see every use of it.",
      o: ["SSE-S3", "A customer-managed KMS key (key policy control plus CloudTrail logging of every use)", "Client-side encryption with a hard-coded key", "An AWS-managed key"], a: 1,
      why: "Only customer-managed keys give you control over the key policy and the ability to disable the key. Every cryptographic use appears in CloudTrail." },
    { q: "Database credentials must rotate every 30 days automatically, with no downtime.",
      o: ["Parameter Store SecureString", "Secrets Manager managed rotation", "Environment variables updated by hand", "A KMS key rotation"], a: 1,
      why: "Secrets Manager provides managed rotation for RDS, Aurora and others (alternating-users strategy for zero downtime)." },
    { q: "Find S3 objects across 200 buckets that contain credit card numbers.",
      o: ["GuardDuty", "Amazon Macie", "Inspector", "CloudTrail"], a: 1,
      why: "Macie uses managed data identifiers to discover sensitive data such as card numbers and credentials in S3." }
  ],
  docs: [["AWS Security Reference Architecture", "https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html"], ["KMS concepts", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html"]],
  certs: { SAA: 2, SAP: 2, DOP: 1, SCS: 2 }
});

/* ===================== 15 ===================== */
M({
  id: "m15", phase: 3, title: "Resilience & Disaster Recovery", hours: 6,
  services: ["Multi-AZ", "AWS Backup", "Route 53 failover", "Aurora Global", "Fault Injection Service"],
  summary: "Everything fails eventually. Architects design for AZ failure by default, pick a disaster-recovery strategy for Region failure based on agreed RTO and RPO, and prove it works with chaos experiments.",
  outcomes: [
    "Translate business RTO/RPO into a DR strategy and cost.",
    "Design statically stable systems that survive the loss of an AZ.",
    "Set up policy-based backups with immutable copies in another account.",
    "Run a fault injection experiment with a stop condition."
  ],
  concepts: [
    ["RTO & RPO", "Recovery Time Objective: how long you can be down. Recovery Point Objective: how much data you can lose. Both are business decisions with a price tag."],
    ["DR strategies", "Backup & restore → pilot light → warm standby → multi-site active/active. Each step costs more and recovers faster."],
    ["Static stability", "Pre-provision enough capacity that losing an AZ needs no new launches during the event (for example 3 AZs at 50% each)."],
    ["Data plane vs control plane", "Recover using data-plane actions (health-check failover, routing) rather than control-plane APIs that may be impaired during an event."],
    ["AWS Backup", "Central backup plans across services, cross-Region and cross-account copies, and Vault Lock for immutable retention."],
    ["Chaos engineering", "AWS FIS injects faults (terminate instances, throttle APIs, disrupt an AZ) with guardrail stop conditions."]
  ],
  diagram: {
    title: "Warm standby across two Regions",
    groups: [
      { x: 20, y: 90, w: 350, h: 296, l: "PRIMARY · ap-southeast-1", k: "region" },
      { x: 410, y: 90, w: 350, h: 296, l: "DR · ap-northeast-1", k: "region" }
    ],
    nodes: [
      { id: "r53", x: 390, y: 40, l: "Route 53", s: "failover + health checks", k: "net" },
      { id: "appP", x: 195, y: 170, l: "App fleet", s: "active · 100%", k: "compute" },
      { id: "dbP", x: 195, y: 320, l: "Aurora primary", s: "writer", k: "data" },
      { id: "appD", x: 585, y: 170, l: "App fleet", s: "warm · scaled down", k: "compute" },
      { id: "dbD", x: 585, y: 320, l: "Aurora secondary", s: "Global Database", k: "data" }
    ],
    steps: [
      { p: [["r53", "appP"]], t: "A health-checked failover record sends all traffic to the primary Region while it is healthy." },
      { p: [["appP", "dbP"], ["dbP", "dbD"]], async: true, t: "Aurora Global Database replicates at the storage layer to the DR Region, typically with under a second of lag. That is your RPO." },
      { p: [["r53", "appD"]], t: "The primary fails its health checks. Route 53 starts answering with the DR endpoint (keep TTLs short, around 60 s)." },
      { p: [["appD", "dbD"]], t: "Promote the secondary cluster and scale the warm fleet up from its minimum. RTO is minutes. Rehearse this, and the failback, regularly." }
    ]
  },
  compare: {
    title: "Disaster recovery strategies",
    cols: ["Strategy", "Typical RPO", "Typical RTO", "Relative cost", "What runs in DR"],
    rows: [
      ["Backup & restore", "Hours", "Hours to a day", "$", "Only backups"],
      ["Pilot light", "Minutes", "Tens of minutes", "$$", "Replicated data; compute off"],
      ["Warm standby", "Seconds", "Minutes", "$$$", "Scaled-down full stack"],
      ["Multi-site active/active", "Near zero", "Near zero", "$$$$", "Full stack serving traffic"]
    ]
  },
  lab: {
    title: "Backups you can trust and a game day", time: "~60 min · cents",
    goal: "Back up anything tagged `backup=daily`, then kill instances on purpose and prove the service stays up.",
    steps: [
      { t: "Create a vault and a daily plan with 35-day retention.", c: String.raw`aws backup create-backup-vault --backup-vault-name lab-vault
PLAN=$(aws backup create-backup-plan --backup-plan '{
  "BackupPlanName":"daily-35d",
  "Rules":[{"RuleName":"daily","TargetBackupVaultName":"lab-vault",
            "ScheduleExpression":"cron(0 18 * * ? *)","StartWindowMinutes":60,
            "Lifecycle":{"DeleteAfterDays":35}}]}' --query BackupPlanId --output text)` },
      { t: "Select resources by tag. The default service role appears after you open AWS Backup in the console once (or create your own).", c: String.raw`aws backup create-backup-selection --backup-plan-id $PLAN --backup-selection '{
  "SelectionName":"tagged-daily",
  "IamRoleArn":"arn:aws:iam::'$ACCOUNT_ID':role/service-role/AWSBackupDefaultServiceRole",
  "ListOfTags":[{"ConditionType":"STRINGEQUALS","ConditionKey":"backup","ConditionValue":"daily"}]}'` },
      { t: "Add a Route 53 health check against your app's `/health` endpoint, the building block of DNS failover.", c: String.raw`aws route53 create-health-check --caller-reference lab-$(date +%s) \
  --health-check-config Type=HTTP,FullyQualifiedDomainName=$DNS,ResourcePath=/health,RequestInterval=30,FailureThreshold=3` },
      { t: "Game day with AWS FIS (console: **Resilience → Fault Injection Service**). Template: action `aws:ec2:terminate-instances`, target instances tagged `aws:autoscaling:groupName = web-asg`, selection mode `COUNT(1)`, stop condition = the `web-5xx` alarm from module 13. Run it while curling the ALB in a loop.", c: String.raw`while true; do curl -s -o /dev/null -w "%{http_code} " http://$DNS/; sleep 0.5; done` },
      { t: "Write down what you saw: errors during the event? time until the ASG replaced capacity? Turn the answers into your first resilience ADR." }
    ],
    cleanup: { t: "Delete the selection, plan, vault (once empty) and health check.", c: String.raw`aws backup delete-backup-selection --backup-plan-id $PLAN --selection-id <id>
aws backup delete-backup-plan --backup-plan-id $PLAN
aws backup delete-backup-vault --backup-vault-name lab-vault
aws route53 delete-health-check --health-check-id <id>` }
  },
  cost: [
    "Multi-AZ roughly doubles database cost. It is the baseline for production, not an optional extra.",
    "Warm standby runs a second, smaller stack all the time. Cross-Region replication also bills inter-Region transfer.",
    "Backups age into cold storage tiers. Snapshot data you never test-restore is cost without proven value."
  ],
  security: [
    "Backup copies go to a separate account and are protected by Vault Lock in compliance mode, so ransomware can't delete them.",
    "Restores are tested on a schedule. An untested backup is a hope, not a control.",
    "FIS experiments run with a scoped role and always with stop conditions."
  ],
  quiz: [
    { q: "The business accepts RPO 1 hour and RTO 24 hours for an internal tool and wants the lowest cost.",
      o: ["Multi-site active/active", "Warm standby", "Backup & restore with cross-Region backup copies", "Pilot light"], a: 2,
      why: "Relaxed objectives allow the cheapest strategy. Hourly backups copied to another Region meet both targets." },
    { q: "RTO 10 minutes, RPO a few seconds, moderate budget, Region-level DR.",
      o: ["Backup & restore", "Warm standby with Aurora Global Database and Route 53 failover", "Single-Region Multi-AZ only", "Nightly snapshots"], a: 1,
      why: "Storage-level replication delivers seconds of RPO, and a pre-deployed scaled-down stack can take traffic within minutes." },
    { q: "How do you design an ASG tier to survive an AZ failure without launching instances during the event?",
      o: ["Rely on the ASG to launch replacements quickly", "Run across 3 AZs with enough capacity that any 2 can carry peak load (static stability)", "Use one big instance", "Use Spot"], a: 1,
      why: "During large events, launching capacity depends on control planes and available capacity. Pre-provisioning removes that dependency." }
  ],
  docs: [["Disaster recovery whitepaper", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html"], ["Reliability pillar", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html"]],
  certs: { SAA: 2, SAP: 2, DOP: 2 }
});

/* ===================== 16 ===================== */
M({
  id: "m16", phase: 3, title: "Cost Optimization & FinOps", hours: 4,
  services: ["Cost Explorer", "Budgets", "Savings Plans", "Compute Optimizer", "Data Exports"],
  summary: "Cost is an architecture property, like latency. Learn the pricing dimensions, make cost visible per team and per unit of business value, and use commitment and rightsizing tools.",
  outcomes: [
    "Read a bill by service, usage type and tag.",
    "Choose between On-Demand, Savings Plans, Reserved Instances and Spot.",
    "Find the usual waste: idle resources, NAT data, oversized instances, old snapshots.",
    "Report unit cost, such as cost per 1,000 orders."
  ],
  concepts: [
    ["Pricing dimensions", "Compute time, storage GB-month, requests, and data transfer. Transfer is the dimension most often missing from designs."],
    ["Commitments", "Compute Savings Plans (flexible across EC2, Fargate and Lambda), EC2 Instance Savings Plans (deeper discount, one family), and RIs for databases and caches."],
    ["Spot", "Spare capacity at deep discount, with 2-minute interruption notice. Good for stateless, batch, CI and containers."],
    ["Visibility", "Cost allocation tags plus an account per team or environment. Cost Explorer, Data Exports (CUR 2.0) to S3 and Athena for detail."],
    ["Guardrails", "Budgets with alerts and actions, Cost Anomaly Detection, and SCPs that restrict expensive instance types in sandboxes."],
    ["Unit economics", "Cost per transaction, per tenant or per GB processed. A rising bill with falling unit cost is healthy growth."]
  ],
  diagram: {
    title: "Making spend visible and actionable",
    nodes: [
      { id: "a1", x: 80, y: 100, l: "Workload acct A", s: "team=checkout", k: "net" },
      { id: "a2", x: 80, y: 290, l: "Workload acct B", s: "team=search", k: "net" },
      { id: "payer", x: 260, y: 195, l: "Management acct", s: "consolidated bill", k: "ops" },
      { id: "exp", x: 450, y: 100, l: "Data Exports", s: "CUR 2.0 → S3", k: "data" },
      { id: "ath", x: 650, y: 100, l: "Athena / QuickSight", s: "cost per order", k: "ai" },
      { id: "bud", x: 450, y: 290, l: "Budgets + Anomaly", s: "per account / tag", k: "ops" },
      { id: "alert", x: 650, y: 290, l: "Team channel", s: "alert + owner", k: "user" }
    ],
    steps: [
      { p: [["a1", "payer"], ["a2", "payer"]], t: "Each team or environment has its own account, and usage rolls up to the management account's consolidated bill. Savings Plans discounts are shared across accounts." },
      { p: [["payer", "exp", "ath"]], t: "Line-item data exports land in S3 daily. Athena joins cost with business metrics to get unit cost." },
      { p: [["payer", "bud", "alert"]], async: true, t: "Budgets and anomaly detection alert the owning team, not just finance, when spend deviates from forecast." }
    ]
  },
  compare: {
    title: "Purchase options",
    cols: ["Option", "Typical discount vs On-Demand", "Commitment", "Best for"],
    rows: [
      ["On-Demand", "0%", "None", "Spiky, short-lived or unknown workloads"],
      ["Compute Savings Plans", "Up to ~66%", "$/hour for 1 or 3 years", "Steady baseline that may change instance family or move to Fargate/Lambda"],
      ["EC2 Instance Savings Plans", "Up to ~72%", "$/hour, one family in one Region", "Stable fleets"],
      ["Reserved Instances (RDS, ElastiCache, OpenSearch, Redshift)", "Up to ~69%", "1 or 3 years", "Databases and caches"],
      ["Spot", "Up to ~90%", "None (can be interrupted)", "Batch, CI, stateless containers"]
    ]
  },
  lab: {
    title: "Find where the money goes", time: "~40 min · a few cents in API calls",
    goal: "Break down this month's spend, activate a cost allocation tag, set up anomaly detection and hunt for common waste.",
    steps: [
      { t: "This month's cost by service. (On the 1st of the month, use last month's dates instead.)", c: String.raw`aws ce get-cost-and-usage \
  --time-period Start=$(date +%Y-%m-01),End=$(date +%F) \
  --granularity MONTHLY --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE \
  --query 'ResultsByTime[0].Groups[].[Keys[0],Metrics.UnblendedCost.Amount]' --output table` },
      { t: "Activate the `project` tag for cost allocation (it must have been used on at least one resource), then group by it from tomorrow.", c: String.raw`aws ce update-cost-allocation-tags-status \
  --cost-allocation-tags-status TagKey=project,Status=Active` },
      { t: "Create an anomaly monitor across services.", c: String.raw`aws ce create-anomaly-monitor --anomaly-monitor \
  '{"MonitorName":"by-service","MonitorType":"DIMENSIONAL","MonitorDimension":"SERVICE"}'` },
      { t: "Waste hunt: unattached volumes, unassociated Elastic IPs and old snapshots.", c: String.raw`aws ec2 describe-volumes --filters Name=status,Values=available \
  --query 'Volumes[].[VolumeId,Size,CreateTime]' --output table
aws ec2 describe-addresses --query 'Addresses[?AssociationId==null].[PublicIp,AllocationId]' --output table
aws ec2 describe-snapshots --owner-ids self \
  --query "Snapshots[?StartTime<='$(date -d '-90 days' +%F)'].[SnapshotId,VolumeSize,StartTime]" --output table` },
      { t: "Ask AWS what it would recommend committing to, based on the last 30 days.", c: String.raw`aws ce get-savings-plans-purchase-recommendation --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR --payment-option NO_UPFRONT --lookback-period-in-days THIRTY_DAYS \
  --query 'SavingsPlansPurchaseRecommendation.SavingsPlansPurchaseRecommendationSummary'` }
    ],
    cleanup: { t: "Keep the anomaly monitor. It's free and useful for the rest of the course." }
  },
  cost: [
    "Cost Explorer API calls cost about US$0.01 each, so cache results in scripts.",
    "Commit to Savings Plans only for the steady baseline you've observed. Commitments can't be cancelled.",
    "Architecture choices (caching, gateway endpoints, Graviton, serverless for spiky loads) usually save more than discounts do."
  ],
  security: [
    "Tag policies in Organizations enforce consistent cost tags. SCPs block very large instance types in sandbox OUs.",
    "Budget actions can apply a restrictive IAM policy or SCP automatically when a sandbox overspends.",
    "Billing access is granted through specific IAM permissions, not shared root logins."
  ],
  quiz: [
    { q: "Steady 24/7 usage spread across EC2, Fargate and Lambda, and the team may change instance families next year.",
      o: ["EC2 Instance Savings Plan", "Compute Savings Plan", "Standard Reserved Instances", "Spot"], a: 1,
      why: "Compute Savings Plans apply across instance families, Regions, Fargate and Lambda, which matches a changing estate." },
    { q: "What gives the earliest warning that spend has jumped unexpectedly?",
      o: ["The monthly invoice", "AWS Cost Anomaly Detection with alerts to the owning team", "Trusted Advisor", "CloudTrail"], a: 1,
      why: "Anomaly Detection uses machine learning on daily spend and alerts within about a day, instead of at month end." },
    { q: "The largest line item in dev accounts is `NatGateway-Bytes`. Pods pull images from ECR and read S3 constantly.",
      o: ["Buy a Savings Plan", "Add an S3 gateway endpoint and ECR interface endpoints, and cache images", "Use bigger NAT gateways", "Move dev to another Region"], a: 1,
      why: "Endpoints take S3 and ECR traffic off the NAT path. The S3 gateway endpoint is free and ECR image layers are stored in S3." }
  ],
  docs: [["Cost Optimization pillar", "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html"], ["Savings Plans", "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html"]],
  certs: { SAA: 2, SAP: 2 }
});

/* ===================== 17 ===================== */
M({
  id: "m17", phase: 4, title: "Multi-Account & Hybrid Networking", hours: 8,
  services: ["Organizations", "Control Tower", "Transit Gateway", "Site-to-Site VPN", "Direct Connect", "Route 53 Resolver"],
  summary: "Real companies run dozens to thousands of accounts connected to each other and to on-premises networks. This is where architecture becomes governance: guardrails, landing zones and network topology.",
  outcomes: [
    "Design an OU structure and the guardrails (SCPs, RCPs) attached to it.",
    "Explain what a Control Tower landing zone provides.",
    "Build hub-and-spoke networking with Transit Gateway and central inspection.",
    "Connect on-premises networks with VPN or Direct Connect, including hybrid DNS."
  ],
  concepts: [
    ["Organizations", "Accounts grouped into OUs, consolidated billing, SCPs and RCPs, tag and backup policies, and delegated administrator accounts for security services."],
    ["Control Tower", "A managed landing zone: log archive and audit accounts, preventive and detective controls, and Account Factory for vending new accounts."],
    ["Transit Gateway", "A regional router that connects many VPCs and on-prem links. Route tables segment traffic (prod can't reach dev). Supports inter-Region peering."],
    ["Peering vs PrivateLink", "VPC peering is one-to-one and not transitive. PrivateLink exposes one **service** without connecting networks, and tolerates overlapping CIDRs."],
    ["VPN & Direct Connect", "Site-to-Site VPN is IPsec over the internet and quick to set up. Direct Connect is a dedicated private circuit with consistent latency; use VPN as backup."],
    ["Hybrid DNS", "Route 53 Resolver inbound and outbound endpoints with forwarding rules, so on-prem resolves AWS private zones and the other way round."]
  ],
  diagram: {
    title: "Hub and spoke with central inspection",
    nodes: [
      { id: "onp", x: 80, y: 200, l: "On-prem DC", s: "10.100.0.0/16", k: "user" },
      { id: "tgw", x: 390, y: 200, l: "Transit Gateway", s: "segmented route tables", k: "net" },
      { id: "prod", x: 220, y: 70, l: "Prod VPC", s: "10.1.0.0/16", k: "net" },
      { id: "dev", x: 220, y: 330, l: "Dev VPC", s: "10.2.0.0/16", k: "net" },
      { id: "shared", x: 600, y: 70, l: "Shared services", s: "DNS · CI runners", k: "ops" },
      { id: "insp", x: 600, y: 330, l: "Inspection VPC", s: "Network Firewall", k: "sec" },
      { id: "egress", x: 700, y: 200, l: "Central egress", s: "NAT → internet", k: "net" }
    ],
    steps: [
      { p: [["onp", "tgw"]], t: "Direct Connect (with a Site-to-Site VPN backup) attaches to the Transit Gateway. BGP advertises routes both ways." },
      { p: [["dev", "tgw", "insp"]], t: "TGW route tables send east-west and internet-bound traffic through the inspection VPC, where Network Firewall applies central policy." },
      { p: [["insp", "egress"]], t: "Internet egress is centralised: one set of NAT gateways and one place to log and filter outbound traffic." },
      { p: [["prod", "tgw", "shared"]], t: "Every spoke can reach shared services (Resolver endpoints, CI runners). Separate route tables stop prod and dev from talking to each other." }
    ]
  },
  compare: {
    title: "Connectivity options",
    cols: ["Option", "Topology", "Transitive?", "Use when"],
    rows: [
      ["VPC peering", "1 : 1", "No", "A few VPCs; no per-GB processing charge"],
      ["Transit Gateway", "Hub and spoke", "Yes", "Tens to thousands of VPCs plus on-prem; central inspection"],
      ["PrivateLink", "Service endpoint", "n/a", "Expose one service; overlapping CIDRs; SaaS"],
      ["Cloud WAN", "Global, policy-defined", "Yes", "Multi-Region, global network managed as policy"],
      ["Site-to-Site VPN", "IPsec over internet", "Via TGW", "Fast setup, backup path, up to ~1.25 Gbps per tunnel"],
      ["Direct Connect", "Dedicated circuit", "Via DX gateway / TGW", "Consistent latency, high throughput, lower egress rate"]
    ]
  },
  lab: {
    title: "Guardrails and a two-VPC transit hub", time: "~90 min · ~US$0.15/h",
    goal: "Create an organisation with a region-deny SCP, then connect two VPCs through a Transit Gateway. Use your sandbox as the management account only for this lab; real setups use Control Tower.",
    steps: [
      { t: "Create the organisation and an OU, and enable SCPs.", c: String.raw`aws organizations create-organization --feature-set ALL
ROOT=$(aws organizations list-roots --query 'Roots[0].Id' --output text)
aws organizations enable-policy-type --root-id $ROOT --policy-type SERVICE_CONTROL_POLICY
OU=$(aws organizations create-organizational-unit --parent-id $ROOT --name Workloads \
  --query OrganizationalUnit.Id --output text)` },
      { t: "Attach a region-deny guardrail. Global services are excluded with `NotAction` so IAM, billing and CloudFront keep working.", c: String.raw`cat > region-deny.json <<'EOF'
{"Version":"2012-10-17","Statement":[{"Sid":"DenyOutsideApprovedRegions","Effect":"Deny",
 "NotAction":["iam:*","organizations:*","sts:*","support:*","budgets:*","ce:*",
              "cloudfront:*","route53:*","route53domains:*","waf:*","wafv2:*","health:*","account:*"],
 "Resource":"*",
 "Condition":{"StringNotEquals":{"aws:RequestedRegion":["ap-southeast-1","us-east-1"]}}}]}
EOF
POL=$(aws organizations create-policy --name region-deny --type SERVICE_CONTROL_POLICY \
  --description "Only approved Regions" --content file://region-deny.json --query Policy.PolicySummary.Id --output text)
aws organizations attach-policy --policy-id $POL --target-id $OU` },
      { t: "Create a Transit Gateway with default association and propagation, then attach two VPCs (`10.0.0.0/16` from module 03 and a second `10.1.0.0/16`).", c: String.raw`TGW=$(aws ec2 create-transit-gateway --description lab-tgw \
  --options DefaultRouteTableAssociation=enable,DefaultRouteTablePropagation=enable \
  --query TransitGateway.TransitGatewayId --output text)
aws ec2 wait transit-gateway-available --transit-gateway-ids $TGW 2>/dev/null || sleep 120
aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id $TGW --vpc-id $VPC_A --subnet-ids $A_SUB1 $A_SUB2
aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id $TGW --vpc-id $VPC_B --subnet-ids $B_SUB1 $B_SUB2` },
      { t: "Point each VPC's private route table at the TGW for the other range, then test with Reachability Analyzer or a ping between instances via Session Manager.", c: String.raw`aws ec2 create-route --route-table-id $RT_A --destination-cidr-block 10.1.0.0/16 --transit-gateway-id $TGW
aws ec2 create-route --route-table-id $RT_B --destination-cidr-block 10.0.0.0/16 --transit-gateway-id $TGW` }
    ],
    cleanup: { t: "Attachments bill hourly. Delete routes, attachments and the TGW, then detach and delete the SCP.", c: String.raw`aws ec2 delete-route --route-table-id $RT_A --destination-cidr-block 10.1.0.0/16
aws ec2 delete-route --route-table-id $RT_B --destination-cidr-block 10.0.0.0/16
for a in $(aws ec2 describe-transit-gateway-attachments --filters Name=transit-gateway-id,Values=$TGW \
  --query 'TransitGatewayAttachments[].TransitGatewayAttachmentId' --output text); do
  aws ec2 delete-transit-gateway-vpc-attachment --transit-gateway-attachment-id $a; done
sleep 120 && aws ec2 delete-transit-gateway --transit-gateway-id $TGW
aws organizations detach-policy --policy-id $POL --target-id $OU
aws organizations delete-policy --policy-id $POL` }
  },
  cost: [
    "Transit Gateway bills per attachment-hour **and** per GB processed. Centralised inspection means paying for both on every hop.",
    "Direct Connect has port-hour fees but a lower data-transfer-out rate than the internet. It pays off at high, steady volumes.",
    "Centralised egress shares NAT gateways across accounts, often cheaper than NAT in every VPC, but measure the extra TGW processing."
  ],
  security: [
    "SCPs stop accounts leaving the organisation, disabling CloudTrail or GuardDuty, or using unapproved Regions.",
    "Logs flow to a locked-down log-archive account. The security team works from a delegated audit account.",
    "Break-glass access exists, is alarmed, and is tested. Prod and non-prod routing domains are separated on the TGW."
  ],
  quiz: [
    { q: "Prevent any member account from leaving the organisation or stopping CloudTrail, even with full admin rights.",
      o: ["IAM policies in each account", "An SCP attached at the root or OU", "AWS Config rules", "A permissions boundary"], a: 1,
      why: "SCPs cap the maximum permissions of every principal in member accounts, including their administrators." },
    { q: "150 VPCs need any-to-any connectivity with central traffic inspection.",
      o: ["Full-mesh VPC peering", "Transit Gateway with an inspection VPC and segmented route tables", "PrivateLink for every pair", "Public internet with TLS"], a: 1,
      why: "Peering isn't transitive and a full mesh would need ~11,000 connections. TGW gives hub-and-spoke routing with central inspection." },
    { q: "On-prem needs a consistent, high-throughput private link to AWS, plus a backup path.",
      o: ["Site-to-Site VPN only", "Direct Connect primary with Site-to-Site VPN as backup", "VPC peering", "CloudFront"], a: 1,
      why: "Direct Connect gives predictable latency and bandwidth. VPN over the internet is a cheap, quick failover path." }
  ],
  docs: [["Organizing your environment with multiple accounts", "https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html"], ["Building a scalable multi-VPC network", "https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/welcome.html"]],
  certs: { SAA: 1, SAP: 2, SCS: 1, ANS: 2 }
});

/* ===================== 18 ===================== */
M({
  id: "m18", phase: 4, title: "Data & AI Platforms", hours: 6,
  services: ["S3 data lake", "Glue", "Athena", "Data Firehose", "Lake Formation", "Bedrock"],
  summary: "Most architect roles now include a data platform and some generative AI. The pattern is the same for both: land data in S3, catalogue and govern it, then let analytics and models query it without copying it everywhere.",
  outcomes: [
    "Design raw, curated and consumption zones on S3 with open table formats.",
    "Query the lake serverlessly with Athena and keep scan costs low.",
    "Build retrieval-augmented generation (RAG) with Bedrock Knowledge Bases.",
    "Apply governance: Lake Formation permissions and Bedrock Guardrails."
  ],
  concepts: [
    ["Lake zones", "Raw (immutable as landed), curated (cleaned, typed, deduplicated), consumption (aggregates for BI). All on S3, separated by prefix or bucket."],
    ["Open table formats", "Apache Iceberg adds ACID transactions, schema evolution and time travel on S3. S3 Tables offers managed Iceberg storage."],
    ["Glue & Athena", "The Glue Data Catalog holds schemas; Glue jobs transform data. Athena runs SQL directly on S3, billed per TB scanned."],
    ["Streaming ingest", "Kinesis or MSK for streams. Data Firehose batches, converts to Parquet and delivers to S3, Redshift or OpenSearch."],
    ["Bedrock", "Managed access to foundation models through one API (Converse). Knowledge Bases do RAG, Agents call tools, Guardrails filter content and PII."],
    ["Governance", "Lake Formation provides table, column and row-level permissions. Bedrock doesn't use your prompts or data to train the base models."]
  ],
  diagram: {
    title: "One lake feeding analytics and a RAG assistant",
    nodes: [
      { id: "src", x: 80, y: 100, l: "Apps & events", s: "clickstream, orders", k: "compute" },
      { id: "fh", x: 230, y: 100, l: "Data Firehose", s: "→ Parquet", k: "int" },
      { id: "raw", x: 390, y: 100, l: "S3 raw zone", s: "immutable", k: "data" },
      { id: "glue", x: 550, y: 100, l: "Glue job", s: "clean · dedupe", k: "ai" },
      { id: "cur", x: 700, y: 100, l: "S3 curated", s: "Iceberg tables", k: "data" },
      { id: "ath", x: 700, y: 230, l: "Athena SQL", s: "BI dashboards", k: "ai" },
      { id: "docs", x: 390, y: 230, l: "S3 documents", s: "policies, manuals", k: "data" },
      { id: "kb", x: 390, y: 350, l: "Knowledge Base", s: "vector index", k: "ai" },
      { id: "chat", x: 160, y: 350, l: "Support assistant", s: "Converse API", k: "user" },
      { id: "fm", x: 610, y: 350, l: "Foundation model", s: "+ Guardrails", k: "ai" }
    ],
    steps: [
      { p: [["src", "fh", "raw"]], async: true, t: "Events stream through Firehose, which batches them, converts to Parquet and writes partitioned files to the raw zone." },
      { p: [["raw", "glue", "cur"]], t: "Glue cleans, types and deduplicates into Iceberg tables in the curated zone, all registered in the Data Catalog." },
      { p: [["cur", "ath"]], t: "Analysts query with Athena. Partitions and columnar Parquet keep the TB scanned (and the bill) small." },
      { p: [["docs", "kb"]], t: "Documents are chunked, embedded and indexed by a Bedrock Knowledge Base." },
      { p: [["chat", "kb", "fm"]], t: "The assistant retrieves the relevant chunks, then the model answers grounded in them, with citations, while Guardrails filter PII and denied topics." }
    ]
  },
  lab: {
    title: "Query a lake, then ask a model about it", time: "~50 min · under US$1",
    goal: "Turn a CSV into an Iceberg table with Athena, then call a Bedrock model through the Converse API.",
    steps: [
      { t: "Upload sample data and create an Athena results location.", c: String.raw`LAKE=lab-$ACCOUNT_ID-lake
aws s3 mb s3://$LAKE
cat > sales.csv <<'EOF'
order_id,customer,amount,order_date
1001,acme,59.90,2026-10-01
1002,globex,120.00,2026-10-14
1003,acme,310.50,2026-10-20
1004,initech,42.00,2026-10-21
EOF
aws s3 cp sales.csv s3://$LAKE/raw/sales/sales.csv` },
      { t: "In the Athena console (set the results location to `s3://<LAKE>/athena/`), run:", lang: "sql", c: String.raw`CREATE DATABASE IF NOT EXISTS lab;

CREATE EXTERNAL TABLE lab.sales_raw (
  order_id string, customer string, amount double, order_date date)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
LOCATION 's3://<LAKE>/raw/sales/'
TBLPROPERTIES ('skip.header.line.count'='1');

CREATE TABLE lab.sales
WITH (table_type = 'ICEBERG', is_external = false,
      location = 's3://<LAKE>/curated/sales/', format = 'PARQUET')
AS SELECT * FROM lab.sales_raw;

SELECT customer, round(sum(amount), 2) AS revenue
FROM lab.sales GROUP BY customer ORDER BY revenue DESC;` },
      { t: "Find a model you can use. Many models are invoked through **inference profile** IDs (prefixed `apac.`, `us.`, `global.` and so on). Request model access in the Bedrock console first if needed.", c: String.raw`aws bedrock list-inference-profiles --region ap-southeast-1 \
  --query 'inferenceProfileSummaries[].inferenceProfileId' --output text` },
      { t: "Call it with the Converse API.", c: String.raw`MODEL_ID=<inference-profile-id>
aws bedrock-runtime converse --region ap-southeast-1 --model-id $MODEL_ID \
  --messages '[{"role":"user","content":[{"text":"Revenue by customer: acme 370.40, globex 120.00, initech 42.00. Write two sentences for a sales update."}]}]' \
  --inference-config maxTokens=200 \
  --query 'output.message.content[0].text' --output text` },
      { t: "Stretch: create a Knowledge Base on an S3 folder of PDFs (console: **Bedrock → Knowledge Bases**) and query it with `aws bedrock-agent-runtime retrieve-and-generate`. Check the vector store's pricing first; some have a minimum hourly cost." }
    ],
    cleanup: { t: "Drop the tables and delete the bucket. Delete any Knowledge Base and its vector store.", c: String.raw`# in Athena: DROP TABLE lab.sales; DROP TABLE lab.sales_raw; DROP DATABASE lab;
aws s3 rb s3://$LAKE --force` }
  },
  cost: [
    "Athena bills per TB scanned. Parquet plus partitioning often cuts scans by 90% or more.",
    "Bedrock on-demand bills per input and output token. Model choice matters more than anything else, so test smaller models first.",
    "Vector stores can have a minimum running cost (for example OpenSearch Serverless capacity units). Aurora pgvector or S3 Vectors can be cheaper at small scale."
  ],
  security: [
    "Lake Formation grants table, column and row-level access. Analysts never get raw `s3:GetObject` on the lake.",
    "Bedrock is reached through VPC interface endpoints, and Guardrails filter PII, harmful content and denied topics.",
    "Treat retrieved documents and user input as untrusted (prompt injection). Agents' tool permissions are least privilege."
  ],
  quiz: [
    { q: "Every Athena query scans 2 TB of CSV and costs too much. Best fix?",
      o: ["Use a bigger Athena workgroup", "Convert to Parquet (or Iceberg) and partition by date", "Move the data to EBS", "Run queries less often"], a: 1,
      why: "Columnar formats read only the needed columns, and partition pruning skips irrelevant files. Both reduce the bytes billed." },
    { q: "A support chatbot must answer from 5,000 company PDFs, cite sources, and stay current as documents change, without training a model.",
      o: ["Fine-tune a model every night", "Retrieval-augmented generation with a Bedrock Knowledge Base", "Paste all PDFs into every prompt", "Use Athena"], a: 1,
      why: "RAG retrieves the relevant chunks at query time, so answers reflect current documents and include citations." },
    { q: "Model responses must never include customer phone numbers and must refuse to discuss competitors.",
      o: ["Prompt the model nicely", "Bedrock Guardrails with PII filters and denied topics", "Macie", "WAF"], a: 1,
      why: "Guardrails apply configurable filters to both inputs and outputs, independently of the model." }
  ],
  docs: [["Athena performance tuning", "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html"], ["Bedrock user guide", "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"]],
  certs: { SAA: 1, SAP: 2 }
});

/* ===================== 19 ===================== */
M({
  id: "m19", phase: 4, title: "Well-Architected & Architecture Reviews", hours: 4,
  services: ["Well-Architected Framework", "Well-Architected Tool", "Trusted Advisor", "ADRs"],
  summary: "The Well-Architected Framework is the shared vocabulary of AWS design reviews. You'll use its six pillars to critique a workload, record trade-offs in decision records, and run reviews that lead to an improvement plan.",
  outcomes: [
    "Explain the six pillars and the main design principles of each.",
    "Run a review in the Well-Architected Tool and save a milestone.",
    "Write architecture decision records that capture trade-offs.",
    "Lead a review discussion without turning it into an audit."
  ],
  concepts: [
    ["Six pillars", "Operational excellence, security, reliability, performance efficiency, cost optimisation and sustainability."],
    ["Trade-offs", "Pillars pull against each other (multi-Region reliability against cost). Good architecture makes those trade-offs explicit and owned."],
    ["Lenses", "Extra question sets for specific workloads: Serverless, SaaS, Container Build, Generative AI, Financial Services and more."],
    ["High-risk issues", "Review answers produce HRIs and MRIs. An improvement plan prioritises them, and milestones track progress over time."],
    ["ADRs", "Short decision records: context, options, decision, consequences. They explain why the system looks the way it does."],
    ["One-way vs two-way doors", "Spend review time on decisions that are hard to reverse (data stores, account structure), and move fast on the reversible ones."]
  ],
  diagram: {
    title: "A workload under review",
    nodes: [
      { id: "w", x: 390, y: 200, l: "Your workload", s: "order platform", k: "compute" },
      { id: "ops", x: 390, y: 50, l: "Operational Excellence", s: "runbooks · IaC", k: "ops" },
      { id: "sec", x: 650, y: 110, l: "Security", s: "identity · data", k: "sec" },
      { id: "rel", x: 650, y: 290, l: "Reliability", s: "failure · recovery", k: "net" },
      { id: "perf", x: 390, y: 350, l: "Performance Efficiency", s: "right resource", k: "compute" },
      { id: "cost", x: 130, y: 290, l: "Cost Optimization", s: "unit cost", k: "data" },
      { id: "sus", x: 130, y: 110, l: "Sustainability", s: "utilisation", k: "ai" }
    ],
    steps: [
      { p: [["w", "ops"]], t: "**Operational excellence**: How do you deploy, observe and respond? Are changes small, frequent and reversible?" },
      { p: [["w", "sec"]], t: "**Security**: How do you manage identities, protect data in transit and at rest, and detect and respond to incidents?" },
      { p: [["w", "rel"]], t: "**Reliability**: How does the workload withstand component failure and recover? Are backups tested? What happens when an AZ fails?" },
      { p: [["w", "perf"]], t: "**Performance efficiency**: Are you using the right resource types and sizes, and do you review them as AWS ships new options?" },
      { p: [["w", "cost"]], t: "**Cost optimisation**: Do you know the cost per unit of business value, and who owns it?" },
      { p: [["w", "sus"]], t: "**Sustainability**: Do you maximise utilisation, use efficient hardware (Graviton) and delete what you don't need?" }
    ]
  },
  lab: {
    title: "Review your own build", time: "~60 min · free",
    goal: "Run a real Well-Architected review against what you built in modules 03–15 and produce an improvement plan.",
    steps: [
      { t: "Register the workload in the Well-Architected Tool.", c: String.raw`WID=$(aws wellarchitected create-workload --workload-name shop-api \
  --description "Order API built during the AWS Architect Path" \
  --environment PREPRODUCTION --lenses wellarchitected \
  --aws-regions ap-southeast-1 --review-owner you@example.com \
  --query WorkloadId --output text)` },
      { t: "In the console, answer the questions honestly for at least the Security and Reliability pillars. 'We haven't done this' is a valid and useful answer." },
      { t: "Save a baseline milestone so you can show progress later.", c: String.raw`aws wellarchitected create-milestone --workload-id $WID --milestone-name baseline
aws wellarchitected get-lens-review --workload-id $WID --lens-alias wellarchitected \
  --query 'LensReview.RiskCounts'` },
      { t: "Pick the top three high-risk issues and write one ADR for each, using the template in the capstone. Check Trusted Advisor too: the core checks are free for every account." }
    ],
    cleanup: { t: "Keep the workload and add a new milestone after the capstone." }
  },
  cost: [
    "The Well-Architected Tool is free. Trusted Advisor's full check set comes with Business support or higher.",
    "The cost pillar's first question is ownership. Every account and major resource needs an owner.",
    "Sustainability and cost usually point the same way: higher utilisation and less idle capacity."
  ],
  security: [
    "Review high-risk security issues first. They tend to be the cheapest to fix and the most expensive to ignore.",
    "Keep review answers and ADRs in the repo, next to the code they describe.",
    "Run a review at least yearly and after any major architectural change."
  ],
  quiz: [
    { q: "'Automatically recover from failure' is a design principle of which pillar?",
      o: ["Cost optimisation", "Reliability", "Performance efficiency", "Sustainability"], a: 1,
      why: "Reliability's principles include automatic recovery, testing recovery procedures, scaling horizontally and managing change through automation." },
    { q: "Product wants to run a tier-1 payment service in a single AZ to save 30%. As architect, you…",
      o: ["Refuse outright", "Quietly deploy Multi-AZ anyway", "Quantify the risk (expected downtime and cost per hour), record the options in an ADR, and have the accountable owner decide", "Agree to avoid conflict"], a: 2,
      why: "Architects make trade-offs explicit and owned. A documented, quantified decision beats both silent compliance and a blanket veto." },
    { q: "Which practice belongs to the sustainability pillar?",
      o: ["Over-provision for peak at all times", "Right-size, use Graviton and managed services, and delete idle resources", "Replicate all data to every Region", "Keep logs forever"], a: 1,
      why: "Sustainability focuses on maximising utilisation and minimising the resources needed per unit of work." }
  ],
  docs: [["Well-Architected Framework", "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"], ["AWS Architecture Center", "https://aws.amazon.com/architecture/"]],
  certs: { SAA: 2, SAP: 2, DOP: 1 }
});

/* ===================== CAPSTONE ===================== */
C.capstone = {
  title: "Capstone: ShopLite Order Platform",
  hours: 20,
  summary: "Design, build, operate and defend a small but production-shaped order platform. This is your portfolio piece: a public repo, a diagram, decision records and a 10-minute walkthrough you can give in an interview.",
  diagram: {
    title: "ShopLite target architecture",
    groups: [{ x: 290, y: 140, w: 290, h: 110, l: "VPC · private subnets × 2 AZ", k: "vpc" }],
    nodes: [
      { id: "user", x: 70, y: 200, l: "Customer", s: "browser", k: "user" },
      { id: "cog", x: 70, y: 340, l: "Cognito", s: "sign-in · JWT", k: "sec" },
      { id: "cf", x: 210, y: 70, l: "CloudFront + WAF", s: "one domain", k: "edge" },
      { id: "web", x: 420, y: 50, l: "S3 web assets", s: "SPA via OAC", k: "data" },
      { id: "alb", x: 210, y: 270, l: "ALB", s: "/api/*", k: "net" },
      { id: "api", x: 360, y: 200, l: "API service", s: "ECS Fargate", k: "compute" },
      { id: "db", x: 510, y: 200, l: "Aurora", s: "Serverless v2", k: "data" },
      { id: "q", x: 400, y: 340, l: "SQS orders", s: "+ DLQ", k: "int" },
      { id: "fn", x: 580, y: 340, l: "Invoice worker", s: "Lambda", k: "compute" },
      { id: "inv", x: 700, y: 230, l: "S3 invoices", s: "lifecycle → IA", k: "data" },
      { id: "obs", x: 700, y: 90, l: "CloudWatch", s: "SLO alarms", k: "ops" }
    ],
    steps: [
      { p: [["user", "cog"]], t: "The customer signs in with Cognito and receives a JWT." },
      { p: [["user", "cf", "web"]], t: "The single-page app loads from S3 through CloudFront and is cached at the edge. WAF screens every request." },
      { p: [["user", "cf", "alb", "api"]], t: "API calls on `/api/*` go through the same distribution to the ALB and on to Fargate tasks across two AZs. The service validates the JWT." },
      { p: [["api", "db"]], t: "The order is written transactionally to Aurora with an idempotency key, and the API responds `201` immediately." },
      { p: [["api", "q", "fn", "inv"]], async: true, t: "An `OrderPlaced` message is queued. A Lambda worker renders the PDF invoice into S3. Failures go to the DLQ, which has an alarm." },
      { p: [["api", "obs"], ["fn", "obs"]], t: "Both services emit metrics, logs and traces. SLO burn-rate alarms page the on-call channel." }
    ]
  },
  functional: [
    "Customers sign up, sign in, browse a product list and place orders.",
    "Placing the same order twice (retry, double-click) never creates two orders.",
    "Each order produces a PDF invoice the customer can download through a presigned URL.",
    "Admins can list the day's orders and revenue."
  ],
  nfr: [
    "**Availability**: survives the loss of one AZ with no manual action. Target 99.9% monthly.",
    "**Latency**: p99 under 300 ms for `GET /products` and under 500 ms for `POST /orders` at 50 requests per second.",
    "**Security**: no long-lived credentials anywhere, encryption at rest and in transit, WAF managed rules, least-privilege roles.",
    "**Delivery**: 100% IaC, deployed by a keyless pipeline with automatic rollback.",
    "**Recovery**: RPO 5 min and RTO 1 h within the Region. Documented warm-standby plan for Region loss.",
    "**Cost**: dev environment under US$60/month, with a budget alert and a cost-per-1,000-orders figure."
  ],
  milestones: {
    cols: ["Week", "Milestone", "Evidence"],
    rows: [
      ["14", "Design: context diagram, data model, 3 ADRs (compute, database, async)", "`docs/architecture.md`, `docs/adr/`"],
      ["15", "Build: IaC for network, data, API, worker and edge; pipeline green to dev", "Repo + pipeline run link"],
      ["15", "Operate: dashboards, SLO alarms, DLQ alarm, structured logs with trace IDs", "Screenshots + alarm config in code"],
      ["16", "Prove: load test, FIS game day (kill tasks, fail the writer), restore test", "Game-day report with timings"],
      ["16", "Defend: Well-Architected review milestone, cost report, 10-minute walkthrough", "WA Tool milestone, recorded demo"]
    ]
  },
  deliverables: [
    "A public Git repository: IaC, application code, pipeline and README with a one-command deploy.",
    "An architecture diagram and at least three ADRs covering the trade-offs you made.",
    "A runbook: deploy, roll back, rotate a secret, restore the database, fail over.",
    "A game-day report: what you broke, what users saw, time to recover, what you changed.",
    "A cost report: monthly estimate, actual spend, cost per 1,000 orders, and the top three savings ideas.",
    "A Well-Architected Tool milestone showing high-risk issues before and after."
  ],
  adr: String.raw`# ADR 0001: Run the order API on ECS Fargate

Status: Accepted · Date: 2026-11-10 · Deciders: <you>

## Context
The order API serves steady traffic (~50 rps at peak) with occasional
bursts. It holds a connection pool to Aurora. The team is small and has no
Kubernetes experience. Requests finish in < 1 s.

## Options considered
1. Lambda + API Gateway: zero idle cost; needs RDS Proxy; cold starts.
2. ECS on Fargate behind an ALB: steady cost; simple ops; long-lived pools.
3. EKS: most flexible; highest operational load for this team.

## Decision
Option 2. ECS on Fargate, 2 tasks minimum across 2 AZs, target tracking
at 60% CPU, deployment circuit breaker with rollback.

## Consequences
+ No nodes to patch; connection pooling works naturally.
+ Same container runs locally and in CI.
- ~US$X/month baseline even at zero traffic (accepted for prod).
- Revisit if traffic becomes very spiky or the team adopts Kubernetes.`,
  rubric: {
    cols: ["Area", "Meets the bar", "Exceeds"],
    rows: [
      ["Design", "Diagram matches what's deployed; 3 ADRs with real options", "Quantified trade-offs (cost, RTO) in every ADR"],
      ["Security", "No static keys, encryption on, least-privilege roles, WAF", "Access Analyzer clean; SCP guardrails; secret rotation tested"],
      ["Reliability", "Multi-AZ; survives task and AZ loss in game day", "Region DR rehearsed with measured RTO/RPO"],
      ["Operations", "SLO alarms, dashboards, runbook", "Burn-rate alerts; traces linked to logs; on-call drill"],
      ["Delivery", "IaC only, OIDC pipeline, automatic rollback", "Canary releases, policy-as-code gates, preview environments"],
      ["Cost", "Budget, tagging, cost per 1,000 orders", "Measured savings from one optimisation"]
    ]
  },
  tip: "Interviewers care less about which services you picked than about why. Open your walkthrough with the requirements and one trade-off you'd make differently at 100× the traffic."
};
})(window.COURSE);
