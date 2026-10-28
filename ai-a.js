/* AI Engineer Path, part 1: A01–A06. Technical text in English; "simple" boxes bilingual. Math uses \( \) and \[ \] (MathJax). */
(function (C) {
const A = [];
const M = m => A.push(Object.assign({ track: "ai" }, m));
const R = String.raw;
const s = (en, ms) => ({ en, ms });

/* ===================== A01 ===================== */
M({
  id: "a01", phase: "A1", title: "Tensors & the Compute Model", hours: 6, notebook: "a01_tensors.ipynb",
  services: ["PyTorch tensors", "shapes & strides", "broadcasting", "FLOPs", "GPU"],
  summary: "Every model is arithmetic on tensors. Before neurons, learn to read shapes, count FLOPs and bytes, and predict whether an operation is limited by compute or by memory. That habit separates people who use models from people who can design them.",
  simple: {
    analogy: s("A tensor is a spreadsheet that can have any number of dimensions. A batch of 64 colour images is a 4-D spreadsheet: image × channel × row × column. The GPU is a factory with thousands of workers who each multiply-and-add at the same time.",
      "Tensor ialah hamparan yang boleh mempunyai sebarang bilangan dimensi. Satu kelompok 64 imej berwarna ialah hamparan 4-D: imej × saluran × baris × lajur. GPU pula kilang dengan beribu-ribu pekerja yang masing-masing mendarab-dan-menambah pada masa yang sama."),
    plain: s("Deep learning is mostly matrix multiplication. Knowing a tensor's shape, data type and memory layout lets you predict cost and spot bugs before training.",
      "Pembelajaran mendalam kebanyakannya ialah pendaraban matriks. Mengetahui bentuk, jenis data dan susunan memori tensor membolehkan anda meramal kos dan mengesan pepijat sebelum latihan."),
    why: s("Every later module, up to GPT, is described in these units: shapes, FLOPs and bytes.",
      "Setiap modul seterusnya, hingga GPT, diterangkan dalam unit ini: bentuk, FLOPs dan bait.")
  },
  outcomes: [
    "Read and predict tensor shapes through reshape, transpose, broadcasting and matmul.",
    R`Count the FLOPs of a matrix multiply: \(2mkn\).`,
    "Compute memory from shape and dtype, and explain arithmetic intensity.",
    "Benchmark a matmul on CPU vs GPU and compare with the hardware's peak."
  ],
  concepts: [
    ["Tensor", R`An n-dimensional array with a shape, a dtype (float32, bfloat16, int8…) and a device. A batch of images is \((B, C, H, W)\).`],
    ["Strides & views", "A tensor is a pointer plus strides. `view`, `transpose` and slicing change strides without copying; `.contiguous()` copies when needed."],
    ["Broadcasting", R`Shapes are aligned from the right; size-1 dimensions stretch. \((64, 10) + (10,)\) adds a bias row to every example.`],
    ["FLOPs", R`Floating-point operations. A multiply-add is 2 FLOPs, so \(A_{m\times k}B_{k\times n}\) costs \(2mkn\).`],
    ["Memory-bound vs compute-bound", "If an op does few FLOPs per byte moved (elementwise ops, small batches), memory bandwidth limits it. Big matmuls are compute-bound."],
    ["Devices", "`.to('cuda')` moves data to the GPU. CUDA calls are asynchronous: synchronise before timing anything."]
  ],
  math: [
    { name: "Matrix multiply cost", tex: R`\[ C_{ij} = \sum_{p=1}^{k} A_{ip}B_{pj}, \qquad \text{FLOPs} = 2\,m\,k\,n \]`,
      explain: R`Each of the \(mn\) outputs needs \(k\) multiplies and \(k\) adds.`,
      worked: [[R`\(X \in \mathbb{R}^{64\times 784},\; W \in \mathbb{R}^{784 \times 10}\)`, "a batch of 64 flattened MNIST images times a linear layer"],
        [R`\(\text{MACs} = 64 \cdot 784 \cdot 10 = 501{,}760\)`, "multiply-accumulates"],
        [R`\(\text{FLOPs} = 2 \cdot 501{,}760 \approx 1.0\times 10^{6}\)`, "about one megaFLOP: trivial for any GPU"]] },
    { name: "Memory and arithmetic intensity", tex: R`\[ \text{bytes} = \text{numel} \times \text{bytes per element}, \qquad I = \frac{\text{FLOPs}}{\text{bytes moved}} \]`,
      explain: R`A GPU with peak \(P\) FLOP/s and bandwidth \(B\) bytes/s is compute-bound only when \(I > P/B\).`,
      worked: [[R`\(n=4096\): \(A, B, C\) in fp16 \(= 3 \cdot 4096^2 \cdot 2 \text{ B} \approx 100.7\text{ MB}\)`, "square matmul"],
        [R`\(\text{FLOPs} = 2 \cdot 4096^3 \approx 1.37\times10^{11}\)`, ""],
        [R`\(I \approx 1.37\times10^{11} / 1.0\times10^{8} \approx 1365\) FLOP/byte`, R`far above an A100's \(312\text{T}/2.0\text{T} \approx 156\): compute-bound`],
        [R`Elementwise \(y = x + 1\) in fp32: 1 FLOP per 8 bytes (4 read, 4 written) \(\Rightarrow I = 0.125\)`, "memory-bound, which is why kernels get fused"]] }
  ],
  calc: { type: "matmul", title: "Matmul cost calculator", intro: "Change the shapes and hardware. See FLOPs, memory, arithmetic intensity and the best-case time." },
  diagram: {
    title: "From pixels to logits on a GPU",
    nodes: [
      { id: "img", x: 80, y: 90, l: "Image", s: "28×28 pixels", k: "user" },
      { id: "t", x: 250, y: 90, l: "Tensor", s: "(1, 28, 28) fp32", k: "data" },
      { id: "b", x: 430, y: 90, l: "Batch", s: "(64, 1, 28, 28)", k: "data" },
      { id: "f", x: 640, y: 90, l: "view / flatten", s: "(64, 784)", k: "ops" },
      { id: "w", x: 640, y: 290, l: "Weights W", s: "(784, 10)", k: "compute" },
      { id: "g", x: 430, y: 290, l: "GPU matmul", s: "X @ W + b", k: "compute" },
      { id: "o", x: 220, y: 290, l: "Logits", s: "(64, 10)", k: "data" }
    ],
    steps: [
      { p: [["img", "t"]], t: "Pixels become a float32 tensor: 784 numbers × 4 bytes = 3,136 bytes per image." },
      { p: [["t", "b"]], t: "Stack 64 images into `(64, 1, 28, 28)`. The batch dimension is what the GPU parallelises over." },
      { p: [["b", "f"]], t: "`x.view(64, -1)` reshapes to `(64, 784)` without copying: same memory, new strides." },
      { p: [["f", "g"], ["w", "g"]], t: R`One matmul: \(64\cdot784\cdot10 = 501{,}760\) multiply-adds, about 1 MFLOP.` },
      { p: [["g", "o"]], t: "Logits `(64, 10)`: one unnormalised score per class per image. Broadcasting adds the bias `(10,)` to every row." }
    ]
  },
  lab: {
    title: "Shapes, broadcasting and a real FLOP/s benchmark", time: "~45 min · Colab free GPU",
    goal: "Open the notebook in Colab (Runtime → Change runtime type → T4 GPU) or run locally with `pip install torch`.",
    steps: [
      { t: "Shapes, dtypes, strides and views.", lang: "python", c: R`import torch, time
x = torch.arange(12, dtype=torch.float32).reshape(3, 4)
print(x.shape, x.dtype, x.stride())        # torch.Size([3, 4]) torch.float32 (4, 1)
y = x.T                                     # a view: strides swap, no copy
print(y.stride(), y.is_contiguous())        # (1, 4) False
print(x.element_size() * x.nelement(), "bytes")   # 48` },
      { t: "Broadcasting: align from the right, stretch size-1 dims.", lang: "python", c: R`b = torch.tensor([1., 0., -1., 2.])         # (4,)
print((x + b).shape)                        # (3, 4)
col = torch.tensor([[10.], [20.], [30.]])   # (3, 1)
print((x + col).shape)                      # (3, 4)
# einsum states the contraction explicitly
W = torch.randn(4, 5)
print(torch.allclose(x @ W, torch.einsum('ik,kj->ij', x, W)))` },
      { t: "Measure achieved FLOP/s for a square matmul and compare with the GPU's peak (T4: ~65 TFLOP/s fp16, ~8 TFLOP/s fp32).", lang: "python", c: R`device = 'cuda' if torch.cuda.is_available() else 'cpu'
def bench(n, dtype=torch.float32, iters=10):
    A = torch.randn(n, n, device=device, dtype=dtype)
    B = torch.randn(n, n, device=device, dtype=dtype)
    for _ in range(3): A @ B                       # warm-up
    if device == 'cuda': torch.cuda.synchronize()
    t = time.perf_counter()
    for _ in range(iters): A @ B
    if device == 'cuda': torch.cuda.synchronize()   # CUDA is async: wait before stopping the clock
    dt = (time.perf_counter() - t) / iters
    return 2 * n**3 / dt / 1e12
for n in [256, 1024, 4096]:
    print(n, f"{bench(n):.2f} TFLOP/s fp32")
if device == 'cuda':
    print(4096, f"{bench(4096, torch.float16):.2f} TFLOP/s fp16")` },
      { t: "Memory-bound vs compute-bound: an elementwise add moves lots of bytes for few FLOPs. Compare its GB/s with the GPU's bandwidth (T4: 320 GB/s).", lang: "python", c: R`n = 50_000_000
a = torch.randn(n, device=device)
for _ in range(3): a + 1
if device == 'cuda': torch.cuda.synchronize()
t = time.perf_counter()
for _ in range(10): b = a + 1
if device == 'cuda': torch.cuda.synchronize()
dt = (time.perf_counter() - t) / 10
print(f"{2 * n * 4 / dt / 1e9:.0f} GB/s moved, {n / dt / 1e12:.4f} TFLOP/s")` }
    ],
    cleanup: { t: "Nothing to clean up. In Colab, **Runtime → Disconnect and delete runtime** frees the GPU." }
  },
  cost: [
    R`FLOPs scale as \(mkn\): doubling the hidden width of a layer quadruples its matmul cost.`,
    "fp16/bf16 halves memory and usually more than doubles matmul throughput on tensor cores.",
    "Small batches make GPUs memory-bound. Batching is the first lever for throughput."
  ],
  security: [
    "Timing CUDA without `torch.cuda.synchronize()` measures the kernel launch, not the work.",
    "Silent broadcasting bugs: `(64,) - (64, 1)` gives `(64, 64)`. Assert shapes in your code.",
    "`view` fails on non-contiguous tensors; `reshape` may silently copy."
  ],
  quiz: [
    { q: R`What does \((32, 1, 128) + (8, 1)\) broadcast to?`, o: [R`\((32, 8, 128)\)`, R`\((32, 1, 128)\)`, "An error", R`\((32, 8, 1)\)`], a: 0,
      why: R`Align from the right: \(128\) vs \(1\) → 128; \(1\) vs \(8\) → 8; \(32\) vs nothing → 32.` },
    { q: R`How many FLOPs is \(A_{1024\times 4096} \cdot B_{4096\times 1024}\)?`, o: [R`\(\approx 4.3\times10^{9}\)`, R`\(\approx 8.6\times10^{9}\)`, R`\(\approx 1.7\times10^{10}\)`, R`\(\approx 4.2\times10^{6}\)`], a: 1,
      why: R`\(2 \cdot 1024 \cdot 4096 \cdot 1024 = 8{,}589{,}934{,}592 \approx 8.6\) GFLOPs.` },
    { q: "LayerNorm, GELU and residual adds take 30% of step time despite few FLOPs. Why?", o: ["They use fp64", "They are memory-bandwidth bound (low arithmetic intensity)", "Autograd is disabled for them", "They run on the CPU"], a: 1,
      why: "Elementwise ops read and write every byte for ~1 FLOP. Kernel fusion (`torch.compile`, fused kernels) cuts the memory traffic." }
  ],
  docs: [["PyTorch tensor tutorial", "https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html"], ["Broadcasting semantics", "https://pytorch.org/docs/stable/notes/broadcasting.html"], ["Making deep learning go brrrr", "https://horace.io/brrr_intro.html"]]
});

/* ===================== A02 ===================== */
M({
  id: "a02", phase: "A1", title: "Linear Models, Softmax & Cross-Entropy", hours: 6, notebook: "a02_softmax_ce.ipynb",
  services: ["logistic regression", "softmax", "cross-entropy", "log-sum-exp", "MLE"],
  summary: "Every classifier, including the final layer of GPT, ends in softmax and cross-entropy. Derive them from maximum likelihood, compute their gradient by hand (it's beautifully simple), and implement them in a numerically stable way.",
  simple: {
    analogy: s("Logits are raw scores from judges. Softmax converts them into percentages that add up to 100%. Cross-entropy is the penalty: tiny if you gave the right answer a high percentage, huge if you were confident and wrong.",
      "Logit ialah markah mentah daripada hakim. Softmax menukarnya kepada peratusan yang berjumlah 100%. Cross-entropy pula denda: kecil jika jawapan betul diberi peratusan tinggi, besar jika anda yakin tetapi salah."),
    plain: s("A model outputs a score per class; softmax turns scores into probabilities; the loss is minus the log of the probability given to the correct class. Training pushes that probability up.",
      "Model mengeluarkan skor bagi setiap kelas; softmax menukar skor kepada kebarangkalian; kerugian ialah negatif log kebarangkalian kelas yang betul. Latihan menolak kebarangkalian itu ke atas."),
    why: s("Language models are classifiers over a vocabulary of ~50,000 tokens. This loss is literally what GPT minimises.",
      "Model bahasa ialah pengelas ke atas perbendaharaan ~50,000 token. Kerugian inilah yang diminimumkan oleh GPT.")
  },
  outcomes: [
    "Derive cross-entropy from maximum likelihood.",
    R`Prove that \(\partial L/\partial z = p - y\) for softmax + cross-entropy.`,
    "Implement a stable softmax using the log-sum-exp trick.",
    "Train a softmax classifier with manual gradient descent."
  ],
  concepts: [
    ["Logits", R`Unnormalised scores \(z = Wx + b\). Only differences between logits matter to softmax.`],
    ["Softmax", R`\(p_i = e^{z_i} / \sum_j e^{z_j}\). Invariant to adding a constant, which is what makes it numerically stable.`],
    ["Cross-entropy", R`\(L = -\sum_i y_i \log p_i = -\log p_{\text{true}}\) for one-hot labels. Equal to the negative log-likelihood.`],
    ["Maximum likelihood", "Minimising average cross-entropy = maximising the probability the model assigns to the training data."],
    ["Sigmoid / logistic", R`Two-class special case: \(\sigma(z) = 1/(1+e^{-z})\), loss \(-[y\log\sigma + (1-y)\log(1-\sigma)]\).`],
    ["Perplexity", R`\(e^{L}\) for language models: the effective number of equally likely choices. Loss 4.17 on 65 characters ≈ uniform guessing.`]
  ],
  math: [
    { name: "Softmax and cross-entropy", tex: R`\[ p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}, \qquad L = -\log p_y \]`,
      explain: "Worked with three classes, true class = 0.",
      worked: [[R`\(z = (2.0,\ 1.0,\ 0.1)\)`, "logits"],
        [R`\(e^{z} = (7.389,\ 2.718,\ 1.105),\ \sum = 11.212\)`, ""],
        [R`\(p = (0.659,\ 0.242,\ 0.099)\)`, "sums to 1"],
        [R`\(L = -\ln 0.659 = 0.417\)`, "the loss for this example"]] },
    { name: "The gradient is p − y", tex: R`\[ \frac{\partial L}{\partial z_k} = p_k - y_k \]`,
      explain: R`From \(L = -z_y + \log\sum_j e^{z_j}\): the derivative of the first term is \(-\mathbb{1}[k=y]\), of the second is \(e^{z_k}/\sum_j e^{z_j} = p_k\).`,
      worked: [[R`\(y = (1, 0, 0)\)`, "one-hot label"],
        [R`\(\nabla_z L = (0.659-1,\ 0.242,\ 0.099) = (-0.341,\ 0.242,\ 0.099)\)`, "gradient descent raises z₀ and lowers the others"],
        [R`\(\nabla_W L = (p - y)\,x^{\top}\)`, "chain rule through z = Wx + b"]] },
    { name: "Log-sum-exp stability", tex: R`\[ \log\sum_j e^{z_j} = m + \log\sum_j e^{z_j - m}, \quad m = \max_j z_j \]`,
      explain: R`\(e^{1000}\) overflows float32 (max ≈ \(3.4\times10^{38}\), so anything above \(z \approx 88.7\) is inf). Subtracting the max makes the largest exponent \(e^0 = 1\).`,
      worked: [[R`\(z = (1000, 1001, 1002) \Rightarrow z - m = (-2, -1, 0)\)`, ""],
        [R`\(p = (0.090,\ 0.245,\ 0.665)\)`, "same as softmax(0, 1, 2)"]] },
    { name: "Binary case (one neuron)", tex: R`\[ \sigma(z) = \frac{1}{1+e^{-z}}, \quad \frac{\partial L}{\partial z} = \sigma(z) - y \]`,
      explain: R`\(x = (1, 2),\ w = (0.8, -0.2),\ b = 0.1,\ y = 1\).`,
      worked: [[R`\(z = 0.8 - 0.4 + 0.1 = 0.5,\ \ \sigma = 0.6225\)`, ""],
        [R`\(L = -\ln 0.6225 = 0.474\)`, ""],
        [R`\(\partial L/\partial w = (\sigma - y)\,x = -0.3775 \cdot (1, 2) = (-0.378,\ -0.755)\)`, ""]] }
  ],
  calc: { type: "softmax", title: "Softmax & cross-entropy explorer", intro: "Drag the logits and temperature. Watch the probabilities, the loss and the gradient p − y update live." },
  diagram: {
    title: "Forward to the loss, and the gradient back",
    nodes: [
      { id: "x", x: 80, y: 200, l: "Input x", s: "features (d,)", k: "data" },
      { id: "lin", x: 240, y: 200, l: "z = Wx + b", s: "logits (K,)", k: "compute" },
      { id: "sm", x: 420, y: 200, l: "softmax", s: "p = e^z / Σ e^z", k: "ops" },
      { id: "ce", x: 620, y: 200, l: "Cross-entropy", s: "L = −log p_y", k: "sec" },
      { id: "y", x: 620, y: 70, l: "Label y", s: "one-hot (K,)", k: "user" },
      { id: "g", x: 420, y: 340, l: "∂L/∂z", s: "= p − y", k: "int" },
      { id: "gw", x: 240, y: 340, l: "∂L/∂W", s: "= (p − y) xᵀ", k: "int" }
    ],
    steps: [
      { p: [["x", "lin"]], t: "An affine map produces logits: one unnormalised score per class." },
      { p: [["lin", "sm", "ce"]], t: R`Softmax makes probabilities; the loss is \(-\log\) of the true class's probability.` },
      { p: [["y", "ce"]], t: "The one-hot label selects which probability is penalised." },
      { p: [["ce", "g"]], async: true, t: R`Backward: softmax and cross-entropy combine into the gradient \(p - y\). No exponentials in the backward pass.` },
      { p: [["g", "gw"]], async: true, t: R`Chain rule through the linear layer: \(\nabla_W L = (p-y)x^\top\), \(\nabla_b L = p - y\).` }
    ]
  },
  lab: {
    title: "Softmax, cross-entropy and gradients from scratch", time: "~45 min · CPU is fine",
    goal: "Reproduce every number in the worked examples, then train a 3-class classifier with your own update rule.",
    steps: [
      { t: "Reproduce the worked example, then check against PyTorch's fused version.", lang: "python", c: R`import torch, torch.nn.functional as F
z = torch.tensor([2.0, 1.0, 0.1])
p = torch.exp(z) / torch.exp(z).sum()
print(p)                                   # tensor([0.6590, 0.2424, 0.0986])
print(-torch.log(p[0]))                    # tensor(0.4170)
print(F.cross_entropy(z.unsqueeze(0), torch.tensor([0])))   # same` },
      { t: R`Verify the gradient \(p - y\) with autograd.`, lang: "python", c: R`z = torch.tensor([[2.0, 1.0, 0.1]], requires_grad=True)
F.cross_entropy(z, torch.tensor([0])).backward()
print(z.grad)                              # tensor([[-0.3410,  0.2424,  0.0986]])` },
      { t: "See the overflow and fix it with log-sum-exp.", lang: "python", c: R`big = torch.tensor([1000., 1001., 1002.])
print(torch.exp(big) / torch.exp(big).sum())   # tensor([nan, nan, nan])
def stable_softmax(z):
    z = z - z.max()
    e = z.exp()
    return e / e.sum()
print(stable_softmax(big))                     # tensor([0.0900, 0.2447, 0.6652])
print(torch.logsumexp(big, 0))                 # 1002.4076` },
      { t: "Train softmax regression on three Gaussian blobs with a hand-written gradient step.", lang: "python", c: R`torch.manual_seed(0)
N = 300
centers = torch.tensor([[0., 0.], [3., 3.], [0., 4.]])
y = torch.randint(0, 3, (N,))
X = centers[y] + torch.randn(N, 2)
W = torch.zeros(2, 3, requires_grad=True)
b = torch.zeros(3, requires_grad=True)
for step in range(301):
    logits = X @ W + b
    loss = F.cross_entropy(logits, y)
    loss.backward()
    with torch.no_grad():
        W -= 0.1 * W.grad
        b -= 0.1 * b.grad
        W.grad.zero_(); b.grad.zero_()
    if step % 100 == 0:
        acc = (logits.argmax(1) == y).float().mean().item()
        print(f"step {step:3d}  loss {loss.item():.3f}  acc {acc:.2%}")
# step 0 loss is ln(3) = 1.099: uniform predictions, a sanity check you should always do` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    R`The softmax over a 50k-token vocabulary is a \((B\cdot T) \times d \times V\) matmul. In small GPTs the LM head can be the single largest layer.`,
    "Use the fused `F.cross_entropy(logits, target)`: it applies log-softmax internally and is more stable and faster than softmax followed by log.",
    "Large-vocabulary logits in fp32 dominate activation memory. Chunked or fused cross-entropy kernels avoid materialising them."
  ],
  security: [
    "Don't apply softmax before `F.cross_entropy`. It expects raw logits and applies log-softmax itself, so double softmax silently hurts training.",
    R`Check the initial loss: for \(K\) classes it should be about \(\ln K\). Much higher means a bad init or a bug.`,
    "Class imbalance: accuracy can look great while minority classes fail. Track per-class metrics or use weighted loss."
  ],
  quiz: [
    { q: R`Logits \((3, 3, 3)\). What is the cross-entropy loss for any true class?`, o: [R`\(0\)`, R`\(\ln 3 \approx 1.099\)`, R`\(3\)`, R`\(1/3\)`], a: 1,
      why: R`Equal logits give \(p = 1/3\) each, so \(L = -\ln(1/3) = \ln 3\).` },
    { q: R`You add 100 to every logit. What happens to softmax?`, o: ["Probabilities shift towards the largest logit", "Nothing: softmax is shift-invariant", "It overflows and returns NaN in PyTorch", "All probabilities become equal"], a: 1,
      why: R`\(e^{z_i + c}/\sum e^{z_j + c} = e^{z_i}/\sum e^{z_j}\). PyTorch's softmax subtracts the max internally, so no overflow.` },
    { q: R`With \(p = (0.7, 0.2, 0.1)\) and true class 2, what is \(\partial L/\partial z\)?`, o: [R`\((0.7, 0.2, -0.9)\)`, R`\((-0.3, 0.2, 0.1)\)`, R`\((0.7, 0.2, 0.1)\)`, R`\((0, 0, -0.9)\)`], a: 0,
      why: R`\(p - y = (0.7, 0.2, 0.1) - (0, 0, 1) = (0.7, 0.2, -0.9)\).` }
  ],
  docs: [["Deep Learning Book, ch. 6.2", "https://www.deeplearningbook.org/contents/mlp.html"], ["CS231n: linear classification", "https://cs231n.github.io/linear-classify/"]]
});

/* ===================== A03 ===================== */
M({
  id: "a03", phase: "A1", title: "Optimization: SGD, Momentum & Adam", hours: 6, notebook: "a03_optimizers.ipynb",
  services: ["gradient descent", "momentum", "Adam / AdamW", "LR schedules", "weight decay"],
  summary: "Training is iterative numerical optimisation. Learn exactly what each optimiser does to every parameter, why the learning rate has a hard stability limit, and why every LLM trains with AdamW plus warmup and cosine decay.",
  simple: {
    analogy: s("You're walking down a foggy valley, only able to feel the slope under your feet. The **learning rate** is your step size: too big and you overshoot to the other side; too small and you never arrive. **Momentum** is a heavy ball that keeps rolling. **Adam** gives every direction its own step size.",
      "Anda berjalan menuruni lembah berkabus, hanya dapat merasa kecerunan di bawah kaki. **Kadar pembelajaran** ialah saiz langkah: terlalu besar anda terlajak ke seberang; terlalu kecil anda tidak sampai-sampai. **Momentum** ialah bola berat yang terus bergolek. **Adam** memberi setiap arah saiz langkahnya sendiri."),
    plain: s("Optimisers use the gradient to update weights a little at a time. The learning rate is the most important number in training.",
      "Pengoptimum menggunakan kecerunan untuk mengemas kini pemberat sedikit demi sedikit. Kadar pembelajaran ialah nombor paling penting dalam latihan."),
    why: s("Most failed training runs are optimiser problems: wrong learning rate, no warmup, or exploding updates.",
      "Kebanyakan latihan yang gagal berpunca daripada pengoptimum: kadar pembelajaran salah, tiada warmup, atau kemas kini yang meletup.")
  },
  outcomes: [
    R`Derive the stability limit \(\eta < 2/\lambda_{\max}\) for gradient descent on a quadratic.`,
    "Write SGD, momentum and Adam updates by hand and match `torch.optim`.",
    "Explain bias correction in Adam and decoupled weight decay in AdamW.",
    "Build a warmup + cosine learning-rate schedule."
  ],
  concepts: [
    ["Gradient descent", R`\(\theta \leftarrow \theta - \eta\,\nabla_\theta L\). Mini-batch SGD estimates the gradient from a random batch: noisy but cheap.`],
    ["Condition number", R`Ratio \(\lambda_{\max}/\lambda_{\min}\) of the curvature. High condition number means a narrow valley, so plain SGD zig-zags.`],
    ["Momentum", "Accumulates a velocity that smooths zig-zags and speeds travel along consistent directions."],
    ["Adam", "Keeps per-parameter running averages of the gradient (m) and squared gradient (v); steps by m/√v, so every parameter gets an adaptive step."],
    ["AdamW", R`Weight decay applied directly to weights (\(\theta \leftarrow \theta - \eta\lambda\theta\)) instead of through the gradient. Standard for transformers.`],
    ["Schedules", "Warmup avoids early instability while Adam's v estimates are noisy; cosine decay anneals to a small final LR."]
  ],
  math: [
    { name: "Stability limit of gradient descent", tex: R`\[ f(x) = \tfrac{1}{2}\lambda x^2 \;\Rightarrow\; x_{t+1} = (1 - \eta\lambda)\,x_t \]`,
      explain: R`The iterate shrinks only if \(|1 - \eta\lambda| < 1\), i.e. \(0 < \eta < 2/\lambda\). In many dimensions the largest curvature \(\lambda_{\max}\) sets the limit.`,
      worked: [[R`\(f(x,y) = \tfrac12(x^2 + 25y^2)\Rightarrow \lambda = 1, 25\)`, "condition number 25"],
        [R`\(\eta_{\max} = 2/25 = 0.08\)`, "η = 0.081 diverges along y"],
        [R`at \(\eta = 0.07\): the x error shrinks only by \(1 - 0.07 = 0.93\) per step`, "slow along the flat direction: the core problem momentum and Adam solve"]] },
    { name: "Momentum (heavy ball)", tex: R`\[ v_{t+1} = \mu v_t + \nabla L(\theta_t), \qquad \theta_{t+1} = \theta_t - \eta\, v_{t+1} \]`,
      explain: R`With constant gradient \(g\), velocity converges to \(g/(1-\mu)\): \(\mu = 0.9\) gives a 10× larger effective step along consistent directions.`,
      worked: [[R`\(f(x)=x^2,\ x_0=3,\ \eta=0.1,\ \mu=0.9\)`, ""],
        [R`\(g_0 = 6,\ v_1 = 6,\ x_1 = 3 - 0.6 = 2.4\)`, ""],
        [R`\(g_1 = 4.8,\ v_2 = 0.9\cdot 6 + 4.8 = 10.2,\ x_2 = 2.4 - 1.02 = 1.38\)`, "plain SGD would be at 1.92"]] },
    { name: "Adam with bias correction", tex: R`\[ \begin{aligned} m_t &= \beta_1 m_{t-1} + (1-\beta_1)\,g_t \\ v_t &= \beta_2 v_{t-1} + (1-\beta_2)\,g_t^2 \\ \hat m_t &= \frac{m_t}{1-\beta_1^t},\quad \hat v_t = \frac{v_t}{1-\beta_2^t} \\ \theta_t &= \theta_{t-1} - \eta\,\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon} \end{aligned} \]`,
      explain: R`First step with \(\theta=1,\ g=0.5,\ \eta=0.1,\ \beta_1=0.9,\ \beta_2=0.999\).`,
      worked: [[R`\(m_1 = 0.1\cdot0.5 = 0.05,\quad v_1 = 0.001\cdot0.25 = 0.00025\)`, "biased towards 0"],
        [R`\(\hat m_1 = 0.05/0.1 = 0.5,\quad \hat v_1 = 0.00025/0.001 = 0.25\)`, "bias correction undoes the zero init"],
        [R`\(\theta_1 = 1 - 0.1\cdot 0.5/\sqrt{0.25} = 0.9\)`, R`the first step has size \(\eta\) whatever the gradient's scale`]] },
    { name: "Warmup + cosine schedule", tex: R`\[ \eta_t = \begin{cases} \eta_{\max}\,\dfrac{t}{T_w} & t < T_w \\[4pt] \eta_{\min} + \tfrac12(\eta_{\max}-\eta_{\min})\left(1+\cos\dfrac{\pi(t-T_w)}{T-T_w}\right) & t \ge T_w \end{cases} \]`,
      explain: R`Typical LLM values: \(\eta_{\max} = 3\times10^{-4}\) (smaller for bigger models), warmup 1–2% of steps, \(\eta_{\min} = 0.1\,\eta_{\max}\).`,
      worked: [[R`\(T_w = 100,\ T = 1000\): at \(t=50\), \(\eta = 0.5\,\eta_{\max}\)`, ""],
        [R`at \(t = 550\) (halfway through decay): \(\eta = \eta_{\min} + 0.5(\eta_{\max}-\eta_{\min}) = 0.55\,\eta_{\max}\)`, ""]] }
  ],
  calc: { type: "optimizer", title: "Optimizer race on a narrow valley", intro: R`Loss \(f(x,y) = \tfrac12(x^2 + \kappa y^2)\). Pick an optimiser, learning rate and condition number, then press Run. Try SGD with η just above 2/κ.` },
  diagram: {
    title: "One training step",
    nodes: [
      { id: "dl", x: 80, y: 200, l: "DataLoader", s: "mini-batch (x, y)", k: "data" },
      { id: "fw", x: 260, y: 90, l: "Forward", s: "ŷ = model(x)", k: "compute" },
      { id: "ls", x: 480, y: 90, l: "Loss", s: "L(ŷ, y)", k: "sec" },
      { id: "bw", x: 480, y: 310, l: "Backward", s: "loss.backward()", k: "int" },
      { id: "op", x: 260, y: 310, l: "Optimizer", s: "AdamW: m, v → step", k: "ops" },
      { id: "sc", x: 680, y: 310, l: "LR schedule", s: "warmup + cosine", k: "ops" }
    ],
    steps: [
      { p: [["dl", "fw", "ls"]], t: "Forward a mini-batch and compute the scalar loss. Autograd records the graph." },
      { p: [["ls", "bw"]], async: true, t: "`loss.backward()` fills `.grad` on every parameter: one gradient tensor per weight tensor." },
      { p: [["sc", "bw", "op"]], t: R`The scheduler sets \(\eta_t\); AdamW updates \(m, v\) and applies the step plus decoupled weight decay.` },
      { p: [["op", "fw"]], t: "`optimizer.zero_grad()` then repeat. LLM pre-training runs this loop hundreds of thousands of times." }
    ]
  },
  lab: {
    title: "Watch optimisers fail and succeed", time: "~45 min · CPU is fine",
    goal: "Find the divergence threshold by experiment, implement Adam by hand, and build the LLM learning-rate schedule.",
    steps: [
      { t: R`Race three optimisers on an ill-conditioned quadratic. Then set SGD's lr to 0.081 and watch it blow up.`, lang: "python", c: R`import torch, math
def f(p):
    x, y = p
    return 0.5 * (x**2 + 25 * y**2)          # condition number 25 -> SGD needs lr < 0.08
def run(name, lr, steps=100):
    p = torch.tensor([-4.0, 1.5], requires_grad=True)
    opt = {'sgd': lambda: torch.optim.SGD([p], lr=lr),
           'momentum': lambda: torch.optim.SGD([p], lr=lr, momentum=0.9),
           'adam': lambda: torch.optim.Adam([p], lr=lr)}[name]()
    for _ in range(steps):
        opt.zero_grad(); loss = f(p); loss.backward(); opt.step()
    return loss.item()
for name, lr in [('sgd', 0.07), ('sgd', 0.081), ('momentum', 0.02), ('adam', 0.1)]:
    print(f"{name:9s} lr={lr:<6} final loss={run(name, lr):.3e}")` },
      { t: "Implement Adam yourself and check it matches `torch.optim.Adam` to floating-point precision.", lang: "python", c: R`def adam_step(theta, g, m, v, t, lr=0.1, b1=0.9, b2=0.999, eps=1e-8):
    m = b1 * m + (1 - b1) * g
    v = b2 * v + (1 - b2) * g * g
    m_hat = m / (1 - b1 ** t)
    v_hat = v / (1 - b2 ** t)
    return theta - lr * m_hat / (v_hat.sqrt() + eps), m, v

theta = torch.tensor([-4.0, 1.5]); m = torch.zeros(2); v = torch.zeros(2)
p = theta.clone().requires_grad_(); opt = torch.optim.Adam([p], lr=0.1)
for t in range(1, 51):
    g = torch.tensor([theta[0], 25 * theta[1]])          # analytic gradient of f
    theta, m, v = adam_step(theta, g, m, v, t)
    opt.zero_grad(); f(p).backward(); opt.step()
print(theta, p.data, torch.allclose(theta, p.data, atol=1e-6))` },
      { t: "Build warmup + cosine with `LambdaLR` and print a few values.", lang: "python", c: R`model = torch.nn.Linear(10, 1)
opt = torch.optim.AdamW(model.parameters(), lr=3e-4, betas=(0.9, 0.95), weight_decay=0.1)
warmup, total, min_ratio = 100, 1000, 0.1
def lr_lambda(step):
    if step < warmup:
        return (step + 1) / warmup
    progress = (step - warmup) / (total - warmup)
    return min_ratio + (1 - min_ratio) * 0.5 * (1 + math.cos(math.pi * progress))
sched = torch.optim.lr_scheduler.LambdaLR(opt, lr_lambda)
lrs = []
for step in range(total):
    opt.step(); sched.step(); lrs.append(sched.get_last_lr()[0])
print([f"{lrs[i]:.2e}" for i in (0, 49, 99, 550, 999)])` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    R`Adam stores two extra fp32 tensors per parameter (\(m, v\)): 8 bytes/param. For a 7B model that's 56 GB of optimizer state alone.`,
    "A good LR schedule is free performance. A diverged run wastes the whole GPU budget, so checkpoint often.",
    "Memory-light optimisers (Adafactor, 8-bit Adam) trade a little stability for big memory savings."
  ],
  security: [
    "Loss suddenly NaN: usually LR too high or no warmup. Lower LR, add warmup, clip gradient norm to 1.0.",
    "Forgetting `zero_grad()` accumulates gradients across steps: training looks like a much larger, noisier LR.",
    "Don't apply weight decay to biases and LayerNorm gains; use separate parameter groups."
  ],
  quiz: [
    { q: R`Gradient descent on \(f = \tfrac12(x^2 + 100y^2)\). Largest stable learning rate?`, o: ["2", "0.2", "0.02", "0.01"], a: 2,
      why: R`\(\eta < 2/\lambda_{\max} = 2/100 = 0.02\).` },
    { q: R`At step 1, Adam's \(m_1 = 0.1 g\) without bias correction. What does bias correction do?`, o: ["Nothing at step 1", R`Divides by \(1-\beta_1^1 = 0.1\), restoring \(\hat m_1 = g\)`, "Adds weight decay", "Clips the gradient"], a: 1,
      why: R`Moments start at zero and are biased low early on. Dividing by \(1-\beta^t\) corrects that, and the correction fades as \(t\) grows.` },
    { q: "Why is AdamW preferred over Adam with L2 regularisation for transformers?", o: ["It uses less memory", "Decay is decoupled from the adaptive scaling, so every weight decays at the same relative rate", "It doesn't need a learning rate", "It's faster per step"], a: 1,
      why: R`With L2 in the gradient, the decay term gets divided by \(\sqrt{v}\), so weights with large gradients are barely regularised. AdamW applies decay directly.` }
  ],
  docs: [["Adam paper (Kingma & Ba)", "https://arxiv.org/abs/1412.6980"], ["AdamW paper (Loshchilov & Hutter)", "https://arxiv.org/abs/1711.05101"], ["Why momentum really works", "https://distill.pub/2017/momentum/"]]
});

/* ===================== A04 ===================== */
M({
  id: "a04", phase: "A1", title: "Backpropagation & Autograd", hours: 8, notebook: "a04_backprop.ipynb",
  services: ["chain rule", "computational graph", "reverse-mode AD", "Jacobians", "gradient checking"],
  summary: "Backprop is the chain rule applied in reverse over a graph, reusing intermediate results so all gradients cost about as much as one extra forward pass. You'll compute it by hand with numbers, then build a tiny autograd engine and derive matrix gradients for an MLP.",
  simple: {
    analogy: s("A factory produced a faulty product. Backprop walks backwards along the assembly line asking each station: how much did you contribute to the error? Each station only needs to know its own inputs and the blame passed to it from the next station.",
      "Sebuah kilang menghasilkan produk rosak. Backprop berjalan ke belakang sepanjang barisan pemasangan dan bertanya kepada setiap stesen: berapa banyak anda menyumbang kepada ralat? Setiap stesen hanya perlu tahu input sendiri dan kesalahan yang dihantar daripada stesen seterusnya."),
    plain: s("To improve a network you need the gradient of the loss with respect to every weight. Backprop computes all of them efficiently in one backward pass using the chain rule.",
      "Untuk memperbaiki rangkaian, anda perlukan kecerunan kerugian terhadap setiap pemberat. Backprop mengira semuanya dengan cekap dalam satu laluan ke belakang menggunakan petua rantai."),
    why: s("Every deep-learning framework is an autograd engine. Understanding it is how you debug exploding gradients, memory blow-ups and custom layers.",
      "Setiap rangka kerja pembelajaran mendalam ialah enjin autograd. Memahaminya membolehkan anda menyahpepijat kecerunan meletup, memori melambak dan lapisan tersuai.")
  },
  outcomes: [
    "Run forward and backward passes by hand on a small network with real numbers.",
    "Build a scalar autograd engine (micrograd-style) with topological sort.",
    R`Derive matrix gradients: \(\nabla_W = X^\top \delta\), \(\nabla_X = \delta W^\top\).`,
    "Verify gradients with finite differences."
  ],
  concepts: [
    ["Computational graph", "Nodes are operations; edges carry tensors. Autograd records it during the forward pass."],
    ["Chain rule", R`\(\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\frac{\partial y}{\partial x}\). Gradients from multiple paths add up.`],
    ["Reverse mode", "One backward pass gives the gradient of one scalar with respect to all inputs. Ideal for millions of weights and one loss."],
    ["Local gradients", "Each op needs only its local derivative: add copies the gradient, multiply swaps inputs, ReLU gates it."],
    ["Saved activations", "Backward needs forward intermediates. That's why training memory grows with batch size × depth × width."],
    ["Gradient checking", R`Compare with \((L(\theta+\epsilon) - L(\theta-\epsilon))/2\epsilon\). Relative error below \(10^{-6}\) in float64 means correct.`]
  ],
  math: [
    { name: "Forward pass with numbers", tex: R`\[ a = w_1x + b_1,\quad h = \mathrm{ReLU}(a),\quad \hat y = w_2 h + b_2,\quad L = \tfrac12(\hat y - y)^2 \]`,
      explain: R`\(x = 2,\ y = 3,\ w_1 = 0.5,\ b_1 = 0,\ w_2 = 2.0,\ b_2 = 0.5\).`,
      worked: [[R`\(a = 0.5\cdot 2 + 0 = 1.0,\quad h = 1.0\)`, ""],
        [R`\(\hat y = 2.0 \cdot 1.0 + 0.5 = 2.5\)`, ""],
        [R`\(L = \tfrac12(2.5 - 3)^2 = 0.125\)`, ""]] },
    { name: "Backward pass with numbers", tex: R`\[ \frac{\partial L}{\partial w_1} = \underbrace{(\hat y - y)}_{\partial L/\partial \hat y}\cdot \underbrace{w_2}_{\partial \hat y/\partial h}\cdot \underbrace{\mathbb{1}[a>0]}_{\partial h/\partial a}\cdot \underbrace{x}_{\partial a/\partial w_1} \]`,
      explain: "Walk from the loss back to each parameter, multiplying local derivatives.",
      worked: [[R`\(\partial L/\partial \hat y = 2.5 - 3 = -0.5\)`, ""],
        [R`\(\partial L/\partial w_2 = -0.5\cdot h = -0.5,\quad \partial L/\partial b_2 = -0.5\)`, ""],
        [R`\(\partial L/\partial h = -0.5\cdot w_2 = -1.0 \Rightarrow \partial L/\partial a = -1.0\)`, "ReLU passes the gradient because a > 0"],
        [R`\(\partial L/\partial w_1 = -1.0\cdot x = -2.0,\quad \partial L/\partial b_1 = -1.0\)`, ""],
        [R`Step \(\eta = 0.05\): \(w_1 = 0.6,\ b_1 = 0.05,\ w_2 = 2.025,\ b_2 = 0.525\)`, ""],
        [R`New \(\hat y = 3.056\), \(L = 0.0016\)`, R`loss fell by about 80×. With \(\eta = 0.1\) it overshoots to \(L = 0.195\)`]] },
    { name: "Matrix gradients for a linear layer", tex: R`\[ Y = XW \;\Rightarrow\; \frac{\partial L}{\partial W} = X^{\top}\,\frac{\partial L}{\partial Y}, \qquad \frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y}\,W^{\top} \]`,
      explain: R`Shapes check it: \(X\) is \((B, d_{in})\), \(\delta = \partial L/\partial Y\) is \((B, d_{out})\), so \(X^\top\delta\) is \((d_{in}, d_{out})\) like \(W\). The batch dimension is summed over.`,
      worked: [[R`MSE \(L = \frac{1}{B}\sum (P - Y)^2 \Rightarrow \partial L/\partial P = \frac{2}{B}(P - Y)\)`, ""],
        [R`ReLU: \(\partial L/\partial A = \partial L/\partial H \odot \mathbb{1}[A > 0]\)`, R`elementwise, written \(\odot\)`],
        [R`Backward cost ≈ 2× forward FLOPs (two matmuls per linear layer)`, R`hence training ≈ \(3\times\) forward, the "6N" rule you'll meet in A09`]] }
  ],
  calc: { type: "backprop", title: "Live backprop on a tiny network", intro: "Change the inputs and weights. The forward values and every gradient recompute. Press Take a step to apply gradient descent." },
  diagram: {
    title: "Forward values, then gradients flowing back",
    nodes: [
      { id: "x", x: 80, y: 100, l: "x = 2", s: "input", k: "data" },
      { id: "w1", x: 80, y: 280, l: "w₁ = 0.5", s: "∂L/∂w₁ = −2.0", k: "compute" },
      { id: "a", x: 250, y: 190, l: "a = w₁x + b₁", s: "1.0", k: "ops" },
      { id: "h", x: 410, y: 190, l: "h = ReLU(a)", s: "1.0", k: "ops" },
      { id: "w2", x: 410, y: 330, l: "w₂ = 2.0", s: "∂L/∂w₂ = −0.5", k: "compute" },
      { id: "yh", x: 560, y: 190, l: "ŷ = w₂h + b₂", s: "2.5", k: "ops" },
      { id: "L", x: 700, y: 190, l: "L = ½(ŷ − y)²", s: "0.125", k: "sec" }
    ],
    steps: [
      { p: [["x", "a"], ["w1", "a"]], t: R`Forward: \(a = 0.5\cdot 2 + 0 = 1.0\). Autograd saves \(x\) and \(w_1\) for later.` },
      { p: [["a", "h", "yh"], ["w2", "yh"]], t: R`\(h = \mathrm{ReLU}(1.0) = 1.0\), \(\hat y = 2.0\cdot1.0 + 0.5 = 2.5\).` },
      { p: [["yh", "L"]], t: R`\(L = \tfrac12(2.5 - 3)^2 = 0.125\).` },
      { p: [["L", "yh"]], async: true, t: R`Backward starts with \(\partial L/\partial L = 1\), then \(\partial L/\partial \hat y = \hat y - y = -0.5\).` },
      { p: [["yh", "w2"], ["yh", "h"]], async: true, t: R`Multiply node: gradients swap inputs. \(\partial L/\partial w_2 = -0.5\cdot h = -0.5\), \(\partial L/\partial h = -0.5\cdot w_2 = -1.0\).` },
      { p: [["h", "a", "w1"]], async: true, t: R`ReLU gate is open (\(a>0\)), so \(\partial L/\partial a = -1.0\) and \(\partial L/\partial w_1 = -1.0\cdot x = -2.0\).` }
    ]
  },
  lab: {
    title: "Build an autograd engine, then backprop an MLP by hand", time: "~90 min · CPU is fine",
    goal: "By the end you'll have written the core of what `loss.backward()` does.",
    steps: [
      { t: "A scalar `Value` class that records the graph and knows each op's local derivative.", lang: "python", c: R`class Value:
    def __init__(self, data, parents=(), op=''):
        self.data, self.grad = data, 0.0
        self._parents, self._op = parents, op
        self._backward = lambda: None

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += out.grad              # add copies the gradient to both inputs
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad  # multiply swaps the inputs
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def __pow__(self, k):
        out = Value(self.data ** k, (self,), f'**{k}')
        def _backward():
            self.grad += k * self.data ** (k - 1) * out.grad
        out._backward = _backward
        return out

    def relu(self):
        out = Value(max(0.0, self.data), (self,), 'relu')
        def _backward():
            self.grad += (out.data > 0) * out.grad   # gate
        out._backward = _backward
        return out

    __radd__ = __add__
    def __rmul__(self, other): return self * other
    def __neg__(self): return self * -1
    def __sub__(self, other): return self + (-other)

    def backward(self):
        order, seen = [], set()
        def build(v):                          # topological order: parents before children
            if v not in seen:
                seen.add(v)
                for p in v._parents: build(p)
                order.append(v)
        build(self)
        self.grad = 1.0
        for v in reversed(order):
            v._backward()` },
      { t: "Reproduce the worked example: you should get exactly the numbers above.", lang: "python", c: R`x, y = Value(2.0), Value(3.0)
w1, b1, w2, b2 = Value(0.5), Value(0.0), Value(2.0), Value(0.5)
h = (w1 * x + b1).relu()
y_hat = w2 * h + b2
L = 0.5 * (y_hat - y) ** 2
L.backward()
print(L.data)                                   # 0.125
print(w1.grad, b1.grad, w2.grad, b2.grad)       # -2.0 -1.0 -0.5 -0.5` },
      { t: "Check against PyTorch autograd and a finite-difference estimate.", lang: "python", c: R`import torch
p = {k: torch.tensor(v, dtype=torch.float64, requires_grad=True) for k, v in
     dict(w1=0.5, b1=0.0, w2=2.0, b2=0.5).items()}
def loss_fn(p):
    h = torch.relu(p['w1'] * 2.0 + p['b1'])
    return 0.5 * (p['w2'] * h + p['b2'] - 3.0) ** 2
loss_fn(p).backward()
print({k: v.grad.item() for k, v in p.items()})
eps = 1e-6
with torch.no_grad():
    p['w1'] += eps; up = loss_fn(p)
    p['w1'] -= 2 * eps; down = loss_fn(p)
    p['w1'] += eps
print("finite difference dL/dw1:", ((up - down) / (2 * eps)).item())   # ~ -2.0` },
      { t: "Matrix backprop for a 2-layer MLP, by hand, then compare with autograd.", lang: "python", c: R`torch.manual_seed(0)
X, Y = torch.randn(64, 10), torch.randn(64, 1)
W1, W2 = torch.randn(10, 32) * 0.1, torch.randn(32, 1) * 0.1
# forward
A = X @ W1
H = A.clamp(min=0)
P = H @ W2
loss = ((P - Y) ** 2).mean()
# backward by hand
dP = 2 * (P - Y) / P.numel()
dW2 = H.T @ dP            # (32, 64) @ (64, 1)
dH = dP @ W2.T            # (64, 1) @ (1, 32)
dA = dH * (A > 0)         # ReLU gate
dW1 = X.T @ dA            # (10, 64) @ (64, 32)
# autograd
W1a, W2a = W1.clone().requires_grad_(), W2.clone().requires_grad_()
((X @ W1a).clamp(min=0) @ W2a - Y).pow(2).mean().backward()
print(torch.allclose(dW1, W1a.grad, atol=1e-6), torch.allclose(dW2, W2a.grad, atol=1e-6))   # True True` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    "Backward ≈ 2× the forward FLOPs, so a training step ≈ 3× a forward pass.",
    "Saved activations dominate training memory. Activation checkpointing recomputes them during backward: about 33% more compute for much less memory.",
    "`torch.no_grad()` / `inference_mode()` at evaluation skips graph building and saves memory."
  ],
  security: [
    "In-place ops (`x += 1`, `relu_`) on tensors autograd saved will raise an error or corrupt gradients.",
    "Gradients accumulate by design. Call `zero_grad()` each step unless you mean to accumulate.",
    "`.detach()` or `.item()` in the middle of the forward pass silently cuts the graph: those parameters stop learning."
  ],
  quiz: [
    { q: R`\(L = (w x)^2\) with \(w = 3,\ x = 2\). What is \(\partial L/\partial w\)?`, o: ["12", "24", "36", "6"], a: 1,
      why: R`\(\partial L/\partial w = 2(wx)\cdot x = 2\cdot6\cdot2 = 24\).` },
    { q: R`A variable feeds two branches whose upstream gradients are \(+0.3\) and \(-0.5\). Its gradient?`, o: [R`\(-0.5\)`, R`\(-0.2\)`, R`\(0.3\)`, R`\(-0.15\)`], a: 1,
      why: "Gradients from multiple uses add (multivariate chain rule): 0.3 + (−0.5) = −0.2." },
    { q: R`\(X\) is \((B, 512)\), \(W\) is \((512, 2048)\), \(\delta = \partial L/\partial Y\) is \((B, 2048)\). Which expression has \(W\)'s shape?`, o: [R`\(\delta W^\top\)`, R`\(X^\top\delta\)`, R`\(\delta^\top X\)`, R`\(W\delta^\top\)`], a: 1,
      why: R`\(X^\top\delta\) is \((512, B)(B, 2048) = (512, 2048)\). \(\delta^\top X\) gives the transpose.` }
  ],
  docs: [["micrograd (Karpathy)", "https://github.com/karpathy/micrograd"], ["CS231n backprop notes", "https://cs231n.github.io/optimization-2/"], ["PyTorch autograd mechanics", "https://pytorch.org/docs/stable/notes/autograd.html"]]
});

/* ===================== A05 ===================== */
M({
  id: "a05", phase: "A2", title: "Deep Networks: Init, Normalization & Residuals", hours: 6, notebook: "a05_deep_nets.ipynb",
  services: ["activations", "He / Xavier init", "LayerNorm / RMSNorm", "residuals", "dropout"],
  summary: "Stacking layers multiplies signals and gradients, so they explode or vanish unless you control their variance. Three tricks make deep nets trainable: variance-preserving initialisation, normalisation and residual connections. Each has a short derivation.",
  simple: {
    analogy: s("Pass a message through 50 people. If each one speaks slightly louder, it ends as a scream; slightly softer, it ends as silence. **Initialisation** sets the right volume, **normalisation** resets it at each step, and a **residual connection** is a direct phone line that lets the original message skip ahead.",
      "Sampaikan mesej melalui 50 orang. Jika setiap orang bercakap sedikit lebih kuat, ia berakhir sebagai jeritan; sedikit lebih perlahan, ia berakhir dengan senyap. **Pengawalan awal** menetapkan kelantangan yang betul, **normalisasi** menetapkannya semula pada setiap langkah, dan **sambungan residual** ialah talian terus yang membolehkan mesej asal melangkau ke hadapan."),
    plain: s("Deep networks only train if the size of the numbers stays stable from layer to layer. Good initialisation, normalisation layers and skip connections keep them stable.",
      "Rangkaian mendalam hanya boleh dilatih jika saiz nombor kekal stabil dari lapisan ke lapisan. Pengawalan yang baik, lapisan normalisasi dan sambungan langkau memastikannya stabil."),
    why: s("Every Transformer block is LayerNorm + residual. These details are why 100-layer models train at all.",
      "Setiap blok Transformer ialah LayerNorm + residual. Butiran inilah yang membolehkan model 100 lapisan dilatih.")
  },
  outcomes: [
    R`Derive He initialisation \(\mathrm{Var}(w) = 2/n_{in}\) for ReLU networks.`,
    "Compute LayerNorm and RMSNorm by hand and explain why transformers prefer them over BatchNorm.",
    "Show numerically why residual connections keep gradients alive in deep stacks.",
    "Use dropout and weight decay correctly (train vs eval mode)."
  ],
  concepts: [
    ["Activations", R`ReLU \(\max(0,x)\), GELU \(x\Phi(x)\) (used in GPT), SiLU/Swish \(x\sigma(x)\) (inside SwiGLU in Llama). The non-linearity is what makes depth useful.`],
    ["Variance propagation", R`For \(z = \sum_i w_i x_i\) with independent zero-mean terms: \(\mathrm{Var}(z) = n\,\mathrm{Var}(w)\,\mathbb{E}[x^2]\).`],
    ["Xavier / He init", R`Xavier: \(\mathrm{Var}(w) = 2/(n_{in}+n_{out})\) for tanh. He: \(2/n_{in}\) for ReLU, which zeroes half the signal.`],
    ["LayerNorm", "Normalise each token's feature vector to zero mean, unit variance, then scale and shift. It doesn't depend on batch size, so it's ideal for sequences."],
    ["Residual connections", R`\(y = x + F(x)\) makes the Jacobian \(I + \partial F/\partial x\): gradients always have an identity path.`],
    ["Pre-LN", R`\(x + F(\mathrm{LN}(x))\): normalise inside the branch. More stable than post-LN for deep transformers.`]
  ],
  math: [
    { name: "He initialisation", tex: R`\[ \mathrm{Var}(z^{(l)}) = n_{in}\,\mathrm{Var}(w)\,\mathbb{E}\!\left[(x^{(l)})^2\right] = n_{in}\,\mathrm{Var}(w)\,\tfrac12\mathrm{Var}(z^{(l-1)}) \]`,
      explain: R`ReLU keeps half the second moment of a symmetric input. Keeping variance constant across layers needs \(n_{in}\mathrm{Var}(w)\cdot\tfrac12 = 1\).`,
      worked: [[R`\(\mathrm{Var}(w) = 2/n_{in}\)`, "He (Kaiming) init"],
        [R`\(n_{in} = 512 \Rightarrow \mathrm{std}(w) = \sqrt{2/512} = 0.0625\)`, ""],
        [R`With std = 1 instead: each layer multiplies std by \(\sqrt{512/2} = 16\)`, R`\(16^{32} > 3.4\times10^{38}\): float32 overflows before layer 32`],
        [R`Xavier on ReLU: factor \(1/\sqrt2\) per layer \(\Rightarrow (0.707)^{50} \approx 3\times10^{-8}\)`, "the signal vanishes"]] },
    { name: "LayerNorm and RMSNorm", tex: R`\[ \mathrm{LN}(x) = \gamma\odot\frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta, \qquad \mathrm{RMSNorm}(x) = \gamma\odot\frac{x}{\sqrt{\tfrac1d\sum_i x_i^2 + \epsilon}} \]`,
      explain: R`Statistics are over the feature dimension of each token. RMSNorm (Llama) skips the mean, which is cheaper and works as well in practice.`,
      worked: [[R`\(x = (2, 4, 6, 8):\ \mu = 5,\ \sigma^2 = \tfrac{9+1+1+9}{4} = 5\)`, "population variance"],
        [R`\(\mathrm{LN}(x) = (x - 5)/2.236 = (-1.342,\ -0.447,\ 0.447,\ 1.342)\)`, R`with \(\gamma = 1,\ \beta = 0\)`],
        [R`\(\mathrm{RMS} = \sqrt{(4+16+36+64)/4} = \sqrt{30} = 5.477 \Rightarrow (0.365,\ 0.730,\ 1.095,\ 1.461)\)`, "RMSNorm keeps the sign pattern"]] },
    { name: "Why residuals keep gradients alive", tex: R`\[ x_{L} = x_0 + \sum_{l=0}^{L-1} F_l(x_l) \;\Rightarrow\; \frac{\partial x_L}{\partial x_0} = I + \frac{\partial}{\partial x_0}\sum_l F_l(x_l) \]`,
      explain: R`Without residuals the gradient is a product of \(L\) Jacobians, \(\prod_l J_l\): if their norms are about 0.9, after 50 layers you get \(0.9^{50} \approx 0.005\).`,
      worked: [[R`\(0.9^{50} = 0.0052,\quad 1.1^{50} = 117\)`, "vanish or explode"],
        [R`with residual: \(\|I + J\|\) stays near 1 when \(F\) starts small`, "why GPT-2 scales residual-branch init by 1/√(2L)"]] }
  ],
  calc: { type: "init", title: "Signal propagation through 50 layers", intro: "Pick an initialisation and activation, then simulate a forward pass through a deep stack. The chart shows the activation standard deviation at every layer (log scale)." },
  diagram: {
    title: "A pre-LN residual MLP block",
    nodes: [
      { id: "x", x: 80, y: 200, l: "x", s: "(B, T, d)", k: "data" },
      { id: "ln", x: 230, y: 100, l: "LayerNorm", s: "μ = 0, σ = 1 per token", k: "ops" },
      { id: "f1", x: 390, y: 100, l: "Linear d → 4d", s: "expand", k: "compute" },
      { id: "act", x: 540, y: 100, l: "GELU", s: "x·Φ(x)", k: "ops" },
      { id: "f2", x: 690, y: 100, l: "Linear 4d → d", s: "project + dropout", k: "compute" },
      { id: "add", x: 540, y: 300, l: "Add ⊕", s: "x + F(LN(x))", k: "int" },
      { id: "out", x: 700, y: 300, l: "Output", s: "(B, T, d)", k: "data" }
    ],
    steps: [
      { p: [["x", "ln", "f1"]], t: "Normalise each token's features, then expand to 4× width." },
      { p: [["f1", "act", "f2"]], t: "Non-linearity, then project back to the model width d. Dropout is active only in `model.train()`." },
      { p: [["f2", "add"], ["x", "add"]], t: "The branch output is added to the untouched input: the residual stream." },
      { p: [["add", "out"]], t: R`Backward through \(\oplus\) copies the gradient to both paths, so earlier layers always receive signal: \(\partial y/\partial x = I + \partial F/\partial x\).` }
    ]
  },
  lab: {
    title: "Make a 50-layer network trainable", time: "~60 min · CPU is fine",
    goal: "Reproduce the exploding and vanishing signals, then fix them three ways.",
    steps: [
      { t: "Push a batch through 50 random layers with different inits and record the activation std.", lang: "python", c: R`import torch, torch.nn as nn, torch.nn.functional as F
def depth_stats(init, act=torch.relu, depth=50, width=512):
    torch.manual_seed(0)
    x = torch.randn(1024, width)
    stds = []
    for _ in range(depth):
        W = torch.empty(width, width)
        if init == 'normal': nn.init.normal_(W, std=1.0)
        if init == 'xavier': nn.init.xavier_normal_(W)
        if init == 'he':     nn.init.kaiming_normal_(W, nonlinearity='relu')
        x = act(x @ W)
        stds.append(x.std().item())
    return stds
for init in ['normal', 'xavier', 'he']:
    s = depth_stats(init)
    print(f"{init:7s} layer 1 std={s[0]:.3g}   layer 50 std={s[-1]:.3g}")
# normal -> inf/nan, xavier -> ~1e-8, he -> stays O(1)` },
      { t: "LayerNorm and RMSNorm by hand vs the built-in modules.", lang: "python", c: R`x = torch.tensor([[2., 4., 6., 8.]])
mu = x.mean(-1, keepdim=True)
var = x.var(-1, unbiased=False, keepdim=True)
print((x - mu) / torch.sqrt(var + 1e-5))                    # [-1.3416, -0.4472, 0.4472, 1.3416]
print(nn.LayerNorm(4, elementwise_affine=False)(x))
rms = x.pow(2).mean(-1, keepdim=True).add(1e-6).sqrt()
print(x / rms)                                              # [0.3651, 0.7303, 1.0954, 1.4606]` },
      { t: "Gradient reaching the first layer of a 30-layer tanh stack, plain vs residual.", lang: "python", c: R`def first_layer_grad(residual, depth=30, d=64):
    torch.manual_seed(0)
    layers = nn.ModuleList([nn.Linear(d, d) for _ in range(depth)])
    h = torch.randn(32, d)
    for lin in layers:
        h = h + torch.tanh(lin(h)) if residual else torch.tanh(lin(h))
    h.pow(2).mean().backward()
    return layers[0].weight.grad.norm().item()
print("plain   ", first_layer_grad(False))
print("residual", first_layer_grad(True))` },
      { t: "A reusable pre-LN residual block, and dropout's train/eval behaviour.", lang: "python", c: R`class Block(nn.Module):
    def __init__(self, d, p=0.1):
        super().__init__()
        self.ln = nn.LayerNorm(d)
        self.mlp = nn.Sequential(nn.Linear(d, 4 * d), nn.GELU(), nn.Linear(4 * d, d), nn.Dropout(p))
    def forward(self, x):
        return x + self.mlp(self.ln(x))
blk = Block(16)
x = torch.randn(2, 16)
blk.train(); print(torch.equal(blk(x), blk(x)))   # False: dropout is random
blk.eval();  print(torch.equal(blk(x), blk(x)))   # True: dropout off at inference` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    "Normalisation layers are cheap in FLOPs but memory-bound. Fused LayerNorm/RMSNorm kernels matter at scale.",
    "The MLP's 4× expansion holds two-thirds of a transformer block's parameters (8d² of 12d²).",
    "Good init and normalisation let you use a higher learning rate, which means fewer steps to the same loss."
  ],
  security: [
    "Forgetting `model.eval()` at inference leaves dropout on: noisy, worse predictions.",
    "BatchNorm with batch size 1–2 or variable-length sequences behaves badly. Use LayerNorm or RMSNorm for sequence models.",
    "NaNs appearing after many steps often trace back to a normalisation epsilon that's too small in fp16."
  ],
  quiz: [
    { q: R`Layer with \(n_{in} = 1024\), ReLU activation. He-init standard deviation?`, o: [R`\(1/32 \approx 0.031\)`, R`\(\sqrt{2/1024} \approx 0.044\)`, R`\(2/1024\)`, R`\(1\)`], a: 1,
      why: R`\(\mathrm{std} = \sqrt{2/n_{in}} = \sqrt{2/1024} = 0.0442\).` },
    { q: "Why do transformers use LayerNorm rather than BatchNorm?", o: ["It's faster on GPUs", "It normalises per token, independent of batch size and sequence padding", "It has no parameters", "BatchNorm doesn't support backprop"], a: 1,
      why: "LayerNorm statistics are computed over features within each token, so they're identical in training and inference and unaffected by batch composition." },
    { q: R`In \(y = x + F(x)\), what is \(\partial y/\partial x\)?`, o: [R`\(\partial F/\partial x\)`, R`\(I + \partial F/\partial x\)`, R`\(I\)`, R`\(x\,\partial F/\partial x\)`], a: 1,
      why: "The identity term guarantees a direct gradient path to earlier layers." }
  ],
  docs: [["He et al., Delving deep into rectifiers", "https://arxiv.org/abs/1502.01852"], ["Layer Normalization", "https://arxiv.org/abs/1607.06450"], ["ResNet paper", "https://arxiv.org/abs/1512.03385"]]
});

/* ===================== A06 ===================== */
M({
  id: "a06", phase: "A2", title: "CNNs & Sequence Models", hours: 6, notebook: "a06_cnn_rnn.ipynb",
  services: ["convolution", "pooling", "receptive field", "RNN / LSTM", "vanishing gradients"],
  summary: "Before transformers, two architectures ruled: CNNs for images and RNNs for sequences. You'll compute convolution shapes, parameters and FLOPs, train a CNN, and see exactly why RNNs struggle with long sequences, which is the problem attention solves.",
  simple: {
    analogy: s("A CNN looks at an image through a small magnifying glass that slides across it, learning to spot edges, then shapes, then objects. An RNN reads a sentence one word at a time, keeping notes in a small notebook; by the end of a long sentence, the early notes have faded.",
      "CNN melihat imej melalui kanta pembesar kecil yang digelongsorkan merentasinya, belajar mengesan tepi, kemudian bentuk, kemudian objek. RNN membaca ayat satu perkataan demi satu perkataan sambil mencatat dalam buku nota kecil; pada akhir ayat yang panjang, catatan awal sudah pudar."),
    plain: s("CNNs reuse the same small filter across an image, which saves parameters. RNNs process tokens sequentially, which makes them slow to train and forgetful over long distances.",
      "CNN menggunakan semula penapis kecil yang sama merentasi imej, menjimatkan parameter. RNN memproses token secara berurutan, menjadikannya perlahan untuk dilatih dan mudah lupa pada jarak yang jauh."),
    why: s("Understanding what attention replaced is the best way to understand why it works.",
      "Memahami apa yang digantikan oleh attention ialah cara terbaik untuk memahami kenapa ia berkesan.")
  },
  outcomes: [
    "Compute conv output size, parameter count and FLOPs from the hyperparameters.",
    "Train a small CNN to about 90% on Fashion-MNIST.",
    "Explain the receptive field and why depth grows it.",
    "Measure vanishing gradients in an RNN and explain how LSTMs and attention mitigate them."
  ],
  concepts: [
    ["Convolution", R`A \(K\times K\times C_{in}\) filter slides over the input; \(C_{out}\) filters give \(C_{out}\) feature maps. Weights are shared across positions.`],
    ["Padding & stride", "Padding preserves borders; stride > 1 downsamples. Together they set the output size."],
    ["Pooling", "Max or average over small windows: cheap downsampling and some translation invariance."],
    ["Receptive field", R`The input region one output sees. Stacking two 3×3 convs sees 5×5 with fewer params than one 5×5 (\(18C^2\) vs \(25C^2\)).`],
    ["RNN", R`\(h_t = \tanh(W_h h_{t-1} + W_x x_t + b)\). Same weights each step; must process tokens one by one.`],
    ["LSTM / GRU", "Gated additive memory cell gives a near-identity gradient path through time, like a residual connection along time."]
  ],
  math: [
    { name: "Convolution output size", tex: R`\[ H_{out} = \left\lfloor \frac{H_{in} + 2P - K}{S} \right\rfloor + 1 \]`,
      explain: R`ResNet's first layer: \(224\times224\times3\) input, \(K=7,\ S=2,\ P=3,\ C_{out}=64\).`,
      worked: [[R`\(H_{out} = \lfloor (224 + 6 - 7)/2 \rfloor + 1 = 111 + 1 = 112\)`, ""],
        [R`params \(= K^2 C_{in} C_{out} = 7\cdot7\cdot3\cdot64 = 9{,}408\)`, "no bias (BatchNorm follows)"],
        [R`MACs \(= H_{out}W_{out}\,K^2C_{in}C_{out} = 112\cdot112\cdot147\cdot64 \approx 118\text{M}\)`, R`\(\approx 0.24\) GFLOPs for one layer`]] },
    { name: "Why RNN gradients vanish", tex: R`\[ \frac{\partial h_T}{\partial h_t} = \prod_{k=t+1}^{T} \mathrm{diag}\!\left(1 - h_k^2\right) W_h \]`,
      explain: R`A product of \(T - t\) Jacobians. If their norm is below 1, the gradient decays exponentially with distance; above 1, it explodes.`,
      worked: [[R`\(\|J\| \approx 0.9,\ T - t = 50 \Rightarrow 0.9^{50} \approx 0.005\)`, "almost no learning signal from 50 tokens back"],
        [R`attention: any token reaches any other in one step, path length \(O(1)\)`, "the core reason transformers won (A08)"]] }
  ],
  calc: { type: "conv", title: "Conv layer calculator", intro: "Set the input and layer hyperparameters to get output shape, parameters, FLOPs and activation memory." },
  diagram: {
    title: "A small CNN for 28×28 images",
    nodes: [
      { id: "in", x: 80, y: 110, l: "Image", s: "1 × 28 × 28", k: "data" },
      { id: "c1", x: 230, y: 110, l: "Conv 3×3 + ReLU", s: "32 × 28 × 28", k: "compute" },
      { id: "p1", x: 380, y: 110, l: "MaxPool 2×2", s: "32 × 14 × 14", k: "ops" },
      { id: "c2", x: 530, y: 110, l: "Conv 3×3 + ReLU", s: "64 × 14 × 14", k: "compute" },
      { id: "p2", x: 680, y: 110, l: "MaxPool 2×2", s: "64 × 7 × 7", k: "ops" },
      { id: "fl", x: 680, y: 300, l: "Flatten", s: "3,136", k: "ops" },
      { id: "fc", x: 480, y: 300, l: "Linear + ReLU", s: "3136 → 128", k: "compute" },
      { id: "out", x: 280, y: 300, l: "Logits", s: "128 → 10", k: "data" }
    ],
    steps: [
      { p: [["in", "c1"]], t: R`32 filters of \(3\times3\times1\): only \(32\cdot9 + 32 = 320\) parameters, shared across all 784 positions.` },
      { p: [["c1", "p1", "c2"]], t: R`Pool halves the resolution; the next conv sees an \(8\times8\) patch of the original (receptive field: 3 → 4 → 8).` },
      { p: [["c2", "p2", "fl"]], t: R`\(64\cdot7\cdot7 = 3{,}136\) features after two pools.` },
      { p: [["fl", "fc", "out"]], t: R`The dense layer holds most of the parameters: \(3136\cdot128 \approx 401\)K. Convolutions are parameter-cheap but FLOP-heavy.` }
    ]
  },
  lab: {
    title: "Train a CNN and watch an RNN forget", time: "~60 min · Colab GPU recommended",
    goal: "Confirm the conv formulas in code, train to ~90% test accuracy, then measure gradient decay through time.",
    steps: [
      { t: "Check the worked example: ResNet's first conv.", lang: "python", c: R`import torch, torch.nn as nn, torch.nn.functional as F
conv = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
x = torch.randn(1, 3, 224, 224)
print(conv(x).shape)                                  # torch.Size([1, 64, 112, 112])
print(sum(p.numel() for p in conv.parameters()))      # 9408` },
      { t: "Train the CNN from the diagram on Fashion-MNIST for two epochs.", lang: "python", c: R`from torchvision import datasets, transforms
device = 'cuda' if torch.cuda.is_available() else 'cpu'
tf = transforms.ToTensor()
train = datasets.FashionMNIST('data', train=True, download=True, transform=tf)
test = datasets.FashionMNIST('data', train=False, download=True, transform=tf)
train_dl = torch.utils.data.DataLoader(train, batch_size=128, shuffle=True)
test_dl = torch.utils.data.DataLoader(test, batch_size=512)
model = nn.Sequential(
    nn.Conv2d(1, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),     # 32x14x14
    nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),    # 64x7x7
    nn.Flatten(), nn.Linear(64 * 7 * 7, 128), nn.ReLU(), nn.Linear(128, 10)).to(device)
print(sum(p.numel() for p in model.parameters()), "parameters")
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
for epoch in range(2):
    model.train()
    for xb, yb in train_dl:
        xb, yb = xb.to(device), yb.to(device)
        loss = F.cross_entropy(model(xb), yb)
        opt.zero_grad(); loss.backward(); opt.step()
    model.eval(); correct = 0
    with torch.no_grad():
        for xb, yb in test_dl:
            correct += (model(xb.to(device)).argmax(1).cpu() == yb).sum().item()
    print(f"epoch {epoch}  last loss {loss.item():.3f}  test acc {correct / len(test):.2%}")` },
      { t: "Measure how much gradient reaches each input step of a 100-step RNN, then compare an LSTM.", lang: "python", c: R`torch.manual_seed(0)
for cell in [nn.RNN, nn.LSTM]:
    rnn = cell(input_size=8, hidden_size=32, batch_first=True)
    x = torch.randn(1, 100, 8, requires_grad=True)
    out, _ = rnn(x)
    out[0, -1].sum().backward()          # loss depends on the last output only
    g = x.grad[0].norm(dim=1)
    print(f"{cell.__name__:5s} grad at t=99: {g[99]:.2e}   t=50: {g[50]:.2e}   t=0: {g[0]:.2e}")` }
    ],
    cleanup: { t: "In Colab, disconnect the runtime when finished." }
  },
  cost: [
    "CNN FLOPs scale with spatial resolution squared: halving the input side cuts compute by 4×.",
    "RNN training can't be parallelised across time steps. Attention computes every position at once, so it fits GPUs far better.",
    "Use `channels_last` memory format and mixed precision for faster convolutions on tensor cores."
  ],
  security: [
    "Normalise inputs (mean and std) the same way at train and inference time.",
    "Exploding RNN gradients: clip the gradient norm. Vanishing ones: use LSTM/GRU or attention.",
    "Data augmentation applies only to the training set, never to validation or test."
  ],
  quiz: [
    { q: R`Input \(32\times32\), \(K = 5\), \(S = 1\), \(P = 0\). Output size?`, o: ["32", "28", "27", "30"], a: 1,
      why: R`\((32 - 5)/1 + 1 = 28\).` },
    { q: R`Parameters of Conv2d(64, 128, kernel_size=3) with bias?`, o: ["73,728", "73,856", "1,152", "8,192"], a: 1,
      why: R`\(3\cdot3\cdot64\cdot128 + 128 = 73{,}728 + 128 = 73{,}856\).` },
    { q: "Main reason RNNs were replaced by transformers for language?", o: ["RNNs can't handle text", "Sequential computation (no parallelism over time) and long gradient paths", "RNNs have too many parameters", "RNNs need labelled data"], a: 1,
      why: R`Attention connects any two positions in one step and computes all positions in parallel.` }
  ],
  docs: [["CS231n: convolutional networks", "https://cs231n.github.io/convolutional-networks/"], ["Understanding LSTMs (Olah)", "https://colah.github.io/posts/2015-08-Understanding-LSTMs/"]]
});

C.aiModules = (C.aiModules || []).concat(A);
})(window.COURSE);
