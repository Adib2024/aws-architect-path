/* AI Engineer Path, part 2: A07–A12 and the AI capstone. */
(function (C) {
const A = [];
const M = m => A.push(Object.assign({ track: "ai" }, m));
const R = String.raw;
const s = (en, ms) => ({ en, ms });

/* ===================== A07 ===================== */
M({
  id: "a07", phase: "A3", title: "Tokens, Embeddings & Positions", hours: 5, notebook: "a07_tokens_embeddings.ipynb",
  services: ["BPE", "tiktoken", "embedding tables", "sinusoidal PE", "RoPE"],
  summary: "A language model never sees text, only integers. Learn how byte-pair encoding builds a vocabulary, why an embedding lookup is a matrix multiply, and how models know word order through sinusoidal and rotary position encodings.",
  simple: {
    analogy: s("Tokenisation is chopping text into Lego bricks: common words are one brick, rare words are built from several. The embedding table is a giant dictionary that gives every brick a list of numbers describing its meaning. Position encoding is a seat number, so the model knows who came first.",
      "Tokenisasi ialah memotong teks kepada blok Lego: perkataan biasa satu blok, perkataan jarang dibina daripada beberapa blok. Jadual embedding ialah kamus gergasi yang memberi setiap blok senarai nombor yang menerangkan maksudnya. Pengekodan kedudukan pula nombor tempat duduk, supaya model tahu siapa yang datang dahulu."),
    plain: s("Text is split into tokens, each token becomes an ID, each ID looks up a learned vector, and position information is added so word order matters.",
      "Teks dipecahkan kepada token, setiap token menjadi ID, setiap ID mencari vektor yang dipelajari, dan maklumat kedudukan ditambah supaya susunan perkataan diambil kira."),
    why: s("Tokenisation decides cost and quality: Bahasa Melayu often needs more tokens than English for the same sentence, which means higher API bills and shorter effective context.",
      "Tokenisasi menentukan kos dan kualiti: Bahasa Melayu selalunya memerlukan lebih banyak token daripada Bahasa Inggeris untuk ayat yang sama, yang bermaksud bil API lebih tinggi dan konteks berkesan lebih pendek.")
  },
  outcomes: [
    "Run the BPE merge algorithm by hand on a small corpus.",
    R`Show that an embedding lookup equals one-hot \(\times E\), and count its parameters.`,
    "Compute sinusoidal position encodings and explain RoPE as a rotation.",
    "Measure tokens-per-word for English vs Malay."
  ],
  concepts: [
    ["Byte-pair encoding", "Start from bytes or characters; repeatedly merge the most frequent adjacent pair into a new token until the vocabulary reaches the target size (50,257 for GPT-2)."],
    ["Vocabulary size trade-off", R`Bigger \(V\): shorter sequences, but a larger embedding and softmax (\(V\times d\) each). Typical: 32k–256k.`],
    ["Embedding", R`Row lookup in \(E\in\mathbb{R}^{V\times d}\). Mathematically \(\text{onehot}(i)\,E\), but implemented as indexing.`],
    ["Weight tying", R`Use \(E^\top\) as the output (LM head) matrix: saves \(Vd\) parameters and often helps.`],
    ["Sinusoidal positions", "Fixed sin/cos waves at geometric frequencies are added to embeddings (original Transformer)."],
    ["RoPE", R`Rotary embeddings rotate query/key pairs by an angle proportional to position, so \(q_m^\top k_n\) depends only on \(m - n\). Used in Llama, Qwen and Mistral.`]
  ],
  math: [
    { name: "BPE merges on a toy corpus", tex: R`\[ \text{merge}^* = \arg\max_{(a,b)} \text{count}(a\,b) \]`,
      explain: "Corpus: low ×5, lower ×2, newest ×6, widest ×3 (with an end-of-word marker </w>).",
      worked: [[R`merge 1: \((e, s)\), count 9`, "from newest (6) + widest (3)"],
        [R`merges 2–3: \((es, t)\), \((est, \text{</w>})\)`, R`the suffix "est" becomes one token`],
        [R`merges 4–5: \((l, o)\), \((lo, w)\) with count 7`, R`"low" becomes one token`],
        [R`merges 6–8: \((n,e)\), \((ne,w)\), \((new, est\text{</w>})\)`, R`"newest" is now a single token; "widest" = w·i·d·est`]] },
    { name: "Embedding = one-hot × matrix", tex: R`\[ x_i = \mathbf{e}_i^{\top} E \in \mathbb{R}^{d}, \qquad |E| = V\cdot d \]`,
      explain: "GPT-2 small: V = 50,257, d = 768.",
      worked: [[R`\(|E| = 50{,}257 \times 768 = 38{,}597{,}376\)`, "31% of GPT-2 small's 124M parameters"],
        [R`gradient: only the rows of tokens in the batch get non-zero updates`, "sparse rows, dense optimizer state"]] },
    { name: "Sinusoidal position encoding", tex: R`\[ PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d}}\right), \qquad PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d}}\right) \]`,
      explain: R`Example with \(d = 4\), position 1.`,
      worked: [[R`\(i = 0\): frequency \(1\) → \((\sin 1, \cos 1) = (0.8415,\ 0.5403)\)`, ""],
        [R`\(i = 1\): \(10000^{2/4} = 100\) → \((\sin 0.01, \cos 0.01) = (0.0100,\ 1.0000)\)`, "slow dimensions change little per position"],
        [R`\(PE_1 = (0.8415,\ 0.5403,\ 0.0100,\ 1.0000)\)`, ""]] },
    { name: "RoPE: relative position by rotation", tex: R`\[ R_m = \begin{pmatrix}\cos m\theta & -\sin m\theta\\ \sin m\theta & \cos m\theta\end{pmatrix},\quad (R_m q)^{\top}(R_n k) = q^{\top}R_{n-m}\,k \]`,
      explain: R`Each 2-D pair of dimensions \(j\) uses frequency \(\theta_j = 10000^{-2j/d}\). Since rotations compose, the attention score depends on the offset \(n - m\) only.`,
      worked: [[R`\(q = k = (1, 0),\ \theta = 0.5\): positions 3 and 5 → angle difference \(2\cdot0.5 = 1\) rad`, ""],
        [R`score \(= \cos 1 = 0.540\)`, "same for positions 10 and 12"]] }
  ],
  calc: { type: "bpe", title: "BPE tokenizer, step by step", intro: "Type a small corpus and press Merge to apply one BPE merge at a time. Watch the vocabulary grow and the token count fall." },
  diagram: {
    title: "From a sentence to the first hidden state",
    nodes: [
      { id: "txt", x: 80, y: 200, l: "Text", s: "\"Saya suka kopi\"", k: "user" },
      { id: "tok", x: 240, y: 200, l: "BPE tokenizer", s: "merges table", k: "ops" },
      { id: "ids", x: 400, y: 200, l: "Token IDs", s: "(T,) integers", k: "data" },
      { id: "emb", x: 560, y: 100, l: "Embedding E", s: "V × d lookup", k: "compute" },
      { id: "pos", x: 560, y: 300, l: "Positions", s: "sin/cos or RoPE", k: "compute" },
      { id: "x0", x: 700, y: 200, l: "x₀ = E[ids] + P", s: "(T, d)", k: "data" }
    ],
    steps: [
      { p: [["txt", "tok"]], t: "UTF-8 bytes are split by a regex, then merged using the learned BPE table." },
      { p: [["tok", "ids"]], t: "Each token maps to an integer in [0, V). Malay words are often split into more pieces than English ones." },
      { p: [["ids", "emb"]], t: R`Each ID selects one row of \(E\): a \(d\)-dimensional learned vector.` },
      { p: [["pos", "x0"], ["emb", "x0"]], t: R`Add position information (GPT-2: a learned table; Llama: RoPE applied to \(q, k\) inside attention). Now the sequence is \((T, d)\).` }
    ]
  },
  lab: {
    title: "Build BPE, then inspect a real tokenizer", time: "~45 min · CPU is fine",
    goal: "Run BPE by hand, verify the embedding identity, compute positional encodings, and count Malay vs English tokens.",
    steps: [
      { t: "BPE from scratch: the output matches the worked example.", lang: "python", c: R`from collections import Counter
corpus = "low " * 5 + "lower " * 2 + "newest " * 6 + "widest " * 3
words = Counter(corpus.split())
vocab = {tuple(w) + ('</w>',): c for w, c in words.items()}

def pair_counts(vocab):
    pairs = Counter()
    for sym, c in vocab.items():
        for a, b in zip(sym, sym[1:]):
            pairs[(a, b)] += c
    return pairs

def merge(vocab, pair):
    out = {}
    for sym, c in vocab.items():
        s, i = [], 0
        while i < len(sym):
            if i < len(sym) - 1 and (sym[i], sym[i + 1]) == pair:
                s.append(sym[i] + sym[i + 1]); i += 2
            else:
                s.append(sym[i]); i += 1
        out[tuple(s)] = c
    return out

for step in range(8):
    pairs = pair_counts(vocab)
    best = max(pairs, key=pairs.get)
    vocab = merge(vocab, best)
    print(step + 1, best, pairs[best])
print(vocab)` },
      { t: "An embedding lookup is a one-hot matmul.", lang: "python", c: R`import torch, torch.nn as nn, torch.nn.functional as F
V, d = 10, 4
emb = nn.Embedding(V, d)
ids = torch.tensor([3, 7])
print(torch.allclose(emb(ids), F.one_hot(ids, V).float() @ emb.weight))   # True` },
      { t: "Sinusoidal encodings: position 1 matches the worked example.", lang: "python", c: R`def sinusoidal(n_pos, d):
    pos = torch.arange(n_pos).unsqueeze(1)          # (n_pos, 1)
    i = torch.arange(0, d, 2)                        # even dims: 0, 2, ...
    angle = pos / (10000 ** (i / d))
    pe = torch.zeros(n_pos, d)
    pe[:, 0::2] = torch.sin(angle)
    pe[:, 1::2] = torch.cos(angle)
    return pe
print(sinusoidal(2, 4)[1])     # tensor([0.8415, 0.5403, 0.0100, 1.0000])` },
      { t: "How many GPT-2 tokens do English and Malay need? (`pip install tiktoken`)", lang: "python", c: R`import tiktoken
enc = tiktoken.get_encoding("gpt2")
for text in ["Good morning, how are you?", "Selamat pagi, apa khabar?",
             "cloud computing architecture", "seni bina pengkomputeran awan"]:
    ids = enc.encode(text)
    print(f"{len(ids):2d} tokens  {[enc.decode([i]) for i in ids]}")` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    R`Embedding and LM head together hold \(2Vd\) parameters (or \(Vd\) when tied). For small models, that's a large share.`,
    "More tokens per word means more compute per sentence and less text in the same context window. Train tokenizers on your target language.",
    "Tokenisation runs on CPU: pre-tokenise datasets once and store the integer IDs (e.g., in S3)."
  ],
  security: [
    "Mismatched tokenizer and model gives garbage. Always load them from the same checkpoint.",
    "Special tokens (BOS, EOS, PAD) must be handled consistently at training and inference.",
    "Learned position tables can't extrapolate beyond the training length; RoPE scales better with extensions such as NTK/YaRN scaling."
  ],
  quiz: [
    { q: R`Vocabulary 32,000, \(d = 4096\), untied input and output matrices. Parameters in both?`, o: ["131M", "262M", "32M", "4.1B"], a: 1,
      why: R`\(2 \cdot 32{,}000 \cdot 4096 = 262{,}144{,}000\).` },
    { q: "What does BPE merge at each step?", o: ["The longest word", "The most frequent adjacent symbol pair", "Random characters", "Words with the same meaning"], a: 1,
      why: "Greedy: count all adjacent pairs weighted by word frequency, merge the top one, repeat." },
    { q: R`With RoPE, the attention score between positions \(m\) and \(n\) depends on…`, o: [R`\(m + n\)`, R`only \(n - m\) (plus content)`, R`\(m\cdot n\)`, "Nothing positional"], a: 1,
      why: R`\(R_m^\top R_n = R_{n-m}\): relative position is built into the dot product.` }
  ],
  docs: [["Neural machine translation with subword units (BPE)", "https://arxiv.org/abs/1508.07909"], ["RoFormer (RoPE)", "https://arxiv.org/abs/2104.09864"], ["tiktoken", "https://github.com/openai/tiktoken"]]
});

/* ===================== A08 ===================== */
M({
  id: "a08", phase: "A3", title: "Attention, Line by Line", hours: 8, notebook: "a08_attention.ipynb",
  services: ["scaled dot-product", "causal mask", "multi-head", "O(T²) cost", "FlashAttention"],
  summary: "Attention lets every token look at every earlier token and take a weighted average of their information. You'll compute it by hand on a 3-token example, prove why it's scaled by √d_k, build multi-head causal self-attention in PyTorch, and count its quadratic cost.",
  simple: {
    analogy: s("Each word writes a **question** (query), wears a **name tag** (key) and holds an **answer card** (value). A word compares its question with everyone's name tag; the better the match, the more of that person's answer card it copies into its own notes.",
      "Setiap perkataan menulis **soalan** (query), memakai **tanda nama** (key) dan memegang **kad jawapan** (value). Sesuatu perkataan membandingkan soalannya dengan tanda nama semua orang; semakin sepadan, semakin banyak kad jawapan orang itu disalin ke dalam notanya sendiri."),
    plain: s("Attention computes how relevant each previous token is to the current one, turns those scores into weights with softmax, and mixes the tokens' information using those weights.",
      "Attention mengira betapa relevannya setiap token sebelumnya kepada token semasa, menukar skor itu kepada pemberat dengan softmax, dan mencampurkan maklumat token menggunakan pemberat tersebut."),
    why: s("This single operation is the heart of GPT, Claude, Llama and almost every modern AI model.",
      "Operasi tunggal inilah teras GPT, Claude, Llama dan hampir setiap model AI moden.")
  },
  outcomes: [
    "Compute causal self-attention by hand for 3 tokens.",
    R`Derive why scores are divided by \(\sqrt{d_k}\).`,
    "Implement multi-head causal self-attention and match `F.scaled_dot_product_attention`.",
    R`Count attention FLOPs and memory, \(O(T^2 d)\), and explain what FlashAttention changes.`
  ],
  concepts: [
    ["Q, K, V", R`Three linear projections of the same input: \(Q = XW_Q,\ K = XW_K,\ V = XW_V\).`],
    ["Scores", R`\(QK^\top\) is a \(T\times T\) matrix of dot products: how much each query matches each key.`],
    ["Causal mask", R`Set scores above the diagonal to \(-\infty\) so token \(t\) can't see the future. Required for next-token prediction.`],
    ["Multi-head", R`Split \(d\) into \(h\) heads of size \(d/h\). Each head learns a different relation; outputs are concatenated and projected.`],
    ["Quadratic cost", R`Scores are \(T\times T\) per head per layer. Doubling the context quadruples attention compute and memory.`],
    ["FlashAttention", "Computes attention in tiles held in fast on-chip SRAM with an online softmax, never materialising the T×T matrix in GPU memory. Exact, just IO-aware."]
  ],
  math: [
    { name: "Scaled dot-product attention", tex: R`\[ \mathrm{Attention}(Q,K,V) = \mathrm{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}} + M\right)V, \qquad M_{ij} = \begin{cases}0 & j \le i\\ -\infty & j > i\end{cases} \]`,
      explain: R`Three tokens, \(d_k = 2\): \(Q = K = \begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}\), \(V = \begin{pmatrix}1&0\\0&2\\1&1\end{pmatrix}\). Look at token 3.`,
      worked: [[R`\(q_3 K^{\top} = (1,\ 1,\ 2)\), divided by \(\sqrt2\): \((0.707,\ 0.707,\ 1.414)\)`, "token 3 can see all three (mask allows j ≤ 3)"],
        [R`softmax \(\Rightarrow (0.248,\ 0.248,\ 0.503)\)`, "weights sum to 1"],
        [R`output \(= 0.248(1,0) + 0.248(0,2) + 0.503(1,1) = (0.752,\ 1.000)\)`, ""],
        [R`token 2 sees only tokens 1–2: weights \((0.330,\ 0.670)\), output \((0.330,\ 1.340)\)`, "token 1 attends only to itself"]] },
    { name: "Why divide by √d_k", tex: R`\[ q, k \sim \mathcal{N}(0, I_{d_k}) \;\Rightarrow\; \mathrm{Var}(q^{\top}k) = \sum_{i=1}^{d_k}\mathrm{Var}(q_ik_i) = d_k \]`,
      explain: R`Unscaled dot products have standard deviation \(\sqrt{d_k}\). With \(d_k = 128\), scores of ±20 push softmax into near one-hot outputs with vanishing gradients.`,
      worked: [[R`\(d_k = 64\): std of \(q^\top k\) is 8; after dividing by \(\sqrt{64} = 8\) it's 1`, ""],
        [R`softmax(0, 8) = (0.0003, 0.9997)` + " vs softmax(0, 1) = (0.27, 0.73)", "saturated vs trainable"]] },
    { name: "Multi-head and cost", tex: R`\[ \mathrm{MHA}(X) = \mathrm{Concat}(\text{head}_1,\dots,\text{head}_h)\,W_O,\quad \text{FLOPs}_{\text{scores+AV}} \approx 4\,T^2 d \]`,
      explain: R`Projections cost \(8Td^2\) FLOPs (four \(d\times d\) matmuls); the \(QK^\top\) and \(AV\) matmuls cost \(2T^2d\) each.`,
      worked: [[R`GPT-2 small: \(d = 768,\ h = 12 \Rightarrow d_{head} = 64\)`, ""],
        [R`\(T = 1024\): projections \(8Td^2 = 4.8\) GFLOPs, scores+AV \(4T^2d = 3.2\) GFLOPs per layer`, "comparable at this length"],
        [R`\(T = 8192\), fp16: one head's score matrix \(= 8192^2\cdot2\) B \(= 134\) MB`, "per head, per layer: FlashAttention avoids storing it"]] }
  ],
  calc: { type: "attention", title: "Attention calculator", intro: "Edit Q, K and V for three tokens. Toggle the causal mask and the √d_k scaling and watch the weights and outputs change. Values start at the worked example." },
  diagram: {
    title: "Causal self-attention, one head",
    nodes: [
      { id: "x", x: 80, y: 200, l: "X", s: "(T, d)", k: "data" },
      { id: "q", x: 240, y: 80, l: "Q = X W_Q", s: "(T, d_k)", k: "compute" },
      { id: "k", x: 240, y: 200, l: "K = X W_K", s: "(T, d_k)", k: "compute" },
      { id: "v", x: 240, y: 320, l: "V = X W_V", s: "(T, d_k)", k: "compute" },
      { id: "sc", x: 420, y: 140, l: "Q Kᵀ / √d_k", s: "(T, T) scores", k: "ops" },
      { id: "mk", x: 570, y: 140, l: "Causal mask", s: "−∞ above diagonal", k: "sec" },
      { id: "sm", x: 700, y: 230, l: "softmax", s: "each row sums to 1", k: "ops" },
      { id: "o", x: 480, y: 320, l: "A · V", s: "(T, d_k) output", k: "data" }
    ],
    steps: [
      { p: [["x", "q"], ["x", "k"], ["x", "v"]], t: "Three learned projections of the same tokens: what I'm looking for (Q), what I contain (K), what I'll give (V)." },
      { p: [["q", "sc"], ["k", "sc"]], t: R`Every query dotted with every key: a \(T\times T\) score matrix, scaled by \(1/\sqrt{d_k}\).` },
      { p: [["sc", "mk", "sm"]], t: R`Mask the future with \(-\infty\), then softmax row-wise: \(e^{-\infty} = 0\), so future tokens get exactly zero weight.` },
      { p: [["sm", "o"], ["v", "o"]], t: "Each output row is a weighted average of value vectors. Multi-head attention runs h of these in parallel and concatenates." }
    ]
  },
  lab: {
    title: "Attention by hand, then multi-head in PyTorch", time: "~60 min · CPU is fine",
    goal: "Match the worked example exactly, then build the attention layer you'll reuse in GPT.",
    steps: [
      { t: "The worked example, then PyTorch's fused kernel.", lang: "python", c: R`import torch, math, torch.nn as nn, torch.nn.functional as F
Q = torch.tensor([[1., 0.], [0., 1.], [1., 1.]])
K = Q.clone()
V = torch.tensor([[1., 0.], [0., 2.], [1., 1.]])
scores = Q @ K.T / math.sqrt(Q.shape[-1])
mask = torch.tril(torch.ones(3, 3, dtype=torch.bool))
weights = scores.masked_fill(~mask, float('-inf')).softmax(dim=-1)
print(weights)        # row 3: [0.2483, 0.2483, 0.5035]
print(weights @ V)    # row 3: [0.7517, 1.0000]
print(F.scaled_dot_product_attention(Q[None], K[None], V[None], is_causal=True)[0])` },
      { t: R`Why \(\sqrt{d_k}\): measure dot-product variance with and without scaling.`, lang: "python", c: R`for d in [4, 64, 1024]:
    q, k = torch.randn(10000, d), torch.randn(10000, d)
    dots = (q * k).sum(-1)
    print(f"d={d:5d}  var raw={dots.var():8.1f}  var scaled={(dots / math.sqrt(d)).var():.2f}")` },
      { t: "Multi-head causal self-attention, the module used in GPT (A09).", lang: "python", c: R`class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, n_head):
        super().__init__()
        assert d_model % n_head == 0
        self.n_head, self.d_head = n_head, d_model // n_head
        self.qkv = nn.Linear(d_model, 3 * d_model)
        self.proj = nn.Linear(d_model, d_model)

    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv(x).split(C, dim=2)
        # (B, T, C) -> (B, n_head, T, d_head)
        q = q.view(B, T, self.n_head, self.d_head).transpose(1, 2)
        k = k.view(B, T, self.n_head, self.d_head).transpose(1, 2)
        v = v.view(B, T, self.n_head, self.d_head).transpose(1, 2)
        att = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_head)        # (B, h, T, T)
        mask = torch.tril(torch.ones(T, T, dtype=torch.bool, device=x.device))
        att = att.masked_fill(~mask, float('-inf')).softmax(dim=-1)
        y = (att @ v).transpose(1, 2).contiguous().view(B, T, C)        # re-assemble heads
        return self.proj(y)

attn = CausalSelfAttention(d_model=64, n_head=4)
x = torch.randn(2, 10, 64)
print(attn(x).shape)                                   # (2, 10, 64)
# causality test: changing a future token must not change earlier outputs
x2 = x.clone(); x2[:, -1] += 1.0
print(torch.allclose(attn(x)[:, :-1], attn(x2)[:, :-1], atol=1e-6))   # True` },
      { t: "Swap in the fused kernel (FlashAttention on supported GPUs) and check it agrees.", lang: "python", c: R`def fast_forward(self, x):
    B, T, C = x.shape
    q, k, v = self.qkv(x).split(C, dim=2)
    q, k, v = (t.view(B, T, self.n_head, self.d_head).transpose(1, 2) for t in (q, k, v))
    y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
    return self.proj(y.transpose(1, 2).contiguous().view(B, T, C))
print(torch.allclose(attn(x), fast_forward(attn, x), atol=1e-5))     # True` }
    ],
    cleanup: { t: "Nothing to clean up." }
  },
  cost: [
    R`Attention is \(O(T^2)\) in compute and, if materialised, in memory. Long contexts are expensive: 128k tokens means \(1.6\times10^{10}\) scores per head per layer.`,
    "`F.scaled_dot_product_attention` picks FlashAttention or memory-efficient kernels automatically. Use it in production code.",
    "Grouped-query attention (GQA) shares K/V across heads: same quality, much smaller KV cache at inference (A12)."
  ],
  security: [
    "Masks with `-inf` in fp16 are fine, but a fully masked row gives NaN. Watch padding masks.",
    "Getting `transpose`/`view` order wrong mixes heads silently. Test causality as in the lab.",
    "Attention weights are not explanations: high weight doesn't prove causal importance."
  ],
  quiz: [
    { q: R`Scores for one query are \((2, 0, -\infty)\). Attention weights?`, o: ["(0.5, 0.5, 0)", "(0.881, 0.119, 0)", "(1, 0, 0)", "(0.67, 0.33, 0)"], a: 1,
      why: R`\(e^2/(e^2 + e^0) = 7.389/8.389 = 0.881\); the masked entry gets \(e^{-\infty} = 0\).` },
    { q: R`\(d_{model} = 4096\) with 32 heads. Head dimension?`, o: ["32", "64", "128", "4096"], a: 2,
      why: R`\(4096/32 = 128\).` },
    { q: "Doubling the context length from 4k to 8k multiplies attention-score compute by…", o: ["2", "4", "8", "1"], a: 1,
      why: R`Score computation is \(O(T^2)\): \((8/4)^2 = 4\).` }
  ],
  docs: [["Attention Is All You Need", "https://arxiv.org/abs/1706.03762"], ["The Illustrated Transformer", "https://jalammar.github.io/illustrated-transformer/"], ["FlashAttention paper", "https://arxiv.org/abs/2205.14135"]]
});

/* ===================== A09 ===================== */
M({
  id: "a09", phase: "A3", title: "The Transformer & GPT from Scratch", hours: 10, notebook: "a09_gpt_from_scratch.ipynb",
  services: ["transformer block", "parameter count", "6N FLOPs rule", "training loop", "sampling"],
  summary: "Put it all together: embeddings, pre-LN blocks of attention and MLP with residuals, a final LayerNorm and a tied LM head. You'll count GPT-2's 124M parameters from a formula, derive the 6N FLOPs-per-token rule, then write and train a GPT that generates text.",
  simple: {
    analogy: s("GPT is a stack of identical floors. On each floor, words first talk to each other (attention), then each word thinks on its own (MLP). A shared notebook (the residual stream) carries everything up through the building. At the top, the model guesses the next word.",
      "GPT ialah timbunan tingkat yang serupa. Di setiap tingkat, perkataan berbincang antara satu sama lain dahulu (attention), kemudian setiap perkataan berfikir sendiri (MLP). Buku nota bersama (residual stream) membawa segalanya ke atas bangunan. Di tingkat atas, model meneka perkataan seterusnya."),
    plain: s("A GPT repeats the same block many times, each block refining every token's representation. It's trained only to predict the next token, and that's enough to learn grammar, facts and reasoning patterns.",
      "GPT mengulangi blok yang sama berkali-kali, setiap blok memperhalusi perwakilan setiap token. Ia dilatih hanya untuk meramal token seterusnya, dan itu sudah cukup untuk mempelajari tatabahasa, fakta dan corak penaakulan."),
    why: s("Once you've written one, every LLM paper and model card becomes readable.",
      "Sebaik sahaja anda menulis satu, setiap kertas kajian LLM dan kad model menjadi mudah dibaca.")
  },
  outcomes: [
    R`Derive the per-block parameter count \(12d^2 + 13d\) and reproduce GPT-2 small's 124,439,808.`,
    R`Explain training FLOPs \(\approx 6N\) per token and inference \(\approx 2N\).`,
    "Write a complete GPT in about 80 lines of PyTorch, train it and sample from it.",
    "Use temperature and top-k when sampling."
  ],
  concepts: [
    ["Residual stream", R`A \((T, d)\) tensor that every block reads from and adds to. Attention moves information between tokens; the MLP transforms each token.`],
    ["Pre-LN block", R`\(x \mathrel{+}= \mathrm{Attn}(\mathrm{LN}(x));\ x \mathrel{+}= \mathrm{MLP}(\mathrm{LN}(x))\). A final LN comes before the LM head.`],
    ["LM head", R`Linear \(d\to V\) producing next-token logits at every position. Usually tied to the embedding matrix.`],
    ["Next-token loss", R`Cross-entropy between logits at position \(t\) and the token at \(t+1\), averaged over all positions: \(T\) training signals per sequence.`],
    ["6N rule", R`Forward ≈ \(2N\) FLOPs per token (one multiply-add per parameter); backward ≈ \(4N\). Total ≈ \(6N\) per training token.`],
    ["Sampling", R`Temperature \(T\) divides logits (\(T<1\) sharper, \(T>1\) flatter); top-k / top-p cut the unreliable tail.`]
  ],
  math: [
    { name: "Parameters per block", tex: R`\[ \underbrace{3d^2+3d}_{W_{QKV}} + \underbrace{d^2+d}_{W_O} + \underbrace{4d^2+4d}_{\text{MLP up}} + \underbrace{4d^2+d}_{\text{MLP down}} + \underbrace{4d}_{2\times\text{LN}} = 12d^2 + 13d \]`,
      explain: R`Attention holds \(4d^2\) and the MLP \(8d^2\). Total \(N = Vd + T_{ctx}d + L(12d^2 + 13d) + 2d\) (final LN, tied head).`,
      worked: [[R`GPT-2 small: \(d = 768,\ L = 12,\ V = 50{,}257,\ T_{ctx} = 1024\)`, ""],
        [R`per block: \(12\cdot768^2 + 13\cdot768 = 7{,}087{,}872\)`, ""],
        [R`blocks: \(12 \times 7{,}087{,}872 = 85{,}054{,}464\)`, ""],
        [R`embeddings: \(50{,}257\cdot768 + 1024\cdot768 = 39{,}383{,}808\)`, ""],
        [R`total \(= 85{,}054{,}464 + 39{,}383{,}808 + 1{,}536 = 124{,}439{,}808\)`, "exactly what PyTorch reports"]] },
    { name: "Training compute: the 6N rule", tex: R`\[ C_{\text{train}} \approx 6\,N\,D, \qquad C_{\text{infer}} \approx 2\,N \text{ FLOPs per token} \]`,
      explain: R`\(N\) = non-embedding parameters, \(D\) = training tokens. Ignores the attention \(T^2\) term, which is small when \(d \gg T/6\).`,
      worked: [[R`GPT-2 small on 10B tokens: \(6 \cdot 1.24\times10^8 \cdot 10^{10} = 7.5\times10^{18}\) FLOPs`, ""],
        [R`one A10G at ~35 TFLOP/s bf16 achieved: \(7.5\times10^{18}/3.5\times10^{13} \approx 2.1\times10^5\) s`, "≈ 2.5 days"]] },
    { name: "Sanity check: the initial loss", tex: R`\[ L_0 \approx -\log\frac{1}{V} = \log V \]`,
      explain: "A correctly initialised model predicts roughly uniformly at step 0.",
      worked: [[R`character-level Shakespeare, \(V = 65\): \(\ln 65 = 4.17\)`, "if you see 6 or 10, something is wrong"],
        [R`GPT-2 vocabulary: \(\ln 50{,}257 = 10.8\)`, ""]] }
  ],
  calc: { type: "gptparams", title: "GPT size, compute & memory", intro: "Pick a preset or set the architecture. Get the exact parameter count, FLOPs per token, Chinchilla-optimal tokens and inference memory." },
  diagram: {
    title: "GPT forward pass",
    groups: [{ x: 168, y: 46, w: 460, h: 236, l: "× L TRANSFORMER BLOCKS (pre-LN)", k: "az" }],
    nodes: [
      { id: "ids", x: 80, y: 90, l: "Token IDs", s: "(B, T)", k: "data" },
      { id: "emb", x: 80, y: 240, l: "Embed + pos", s: "(B, T, d)", k: "compute" },
      { id: "ln1", x: 250, y: 100, l: "LayerNorm", k: "ops" },
      { id: "att", x: 400, y: 100, l: "Causal MHA", s: "4d² params", k: "compute" },
      { id: "a1", x: 550, y: 100, l: "⊕ residual", k: "int" },
      { id: "ln2", x: 250, y: 230, l: "LayerNorm", k: "ops" },
      { id: "mlp", x: 400, y: 230, l: "MLP 4× GELU", s: "8d² params", k: "compute" },
      { id: "a2", x: 550, y: 230, l: "⊕ residual", k: "int" },
      { id: "lnf", x: 700, y: 230, l: "Final LN", k: "ops" },
      { id: "head", x: 700, y: 350, l: "LM head", s: "d → V (tied)", k: "compute" },
      { id: "lg", x: 500, y: 350, l: "Logits", s: "next-token probs", k: "data" }
    ],
    steps: [
      { p: [["ids", "emb"]], t: R`Token and position embeddings form the residual stream \(x\in\mathbb{R}^{B\times T\times d}\).` },
      { p: [["emb", "ln1", "att", "a1"], ["emb", "a1"]], t: R`Attention sub-layer: \(x \leftarrow x + \mathrm{Attn}(\mathrm{LN}(x))\). Tokens exchange information.` },
      { p: [["a1", "ln2", "mlp", "a2"], ["a1", "a2"]], t: R`MLP sub-layer: \(x \leftarrow x + \mathrm{MLP}(\mathrm{LN}(x))\). Each token is processed independently.` },
      { p: [["a2", "lnf", "head", "lg"]], t: R`After \(L\) blocks: final LayerNorm, then the tied LM head gives logits over the vocabulary at every position.` }
    ]
  },
  lab: {
    title: "Write and train your own GPT", time: "~2 h · Colab T4 GPU (~10 min training)",
    goal: "A character-level GPT on Shakespeare (swap in any Malay text file to train a Malay model). Uses the attention module from A08.",
    steps: [
      { t: "Data: download text, build a character vocabulary and a batch sampler.", lang: "python", c: R`import torch, torch.nn as nn, torch.nn.functional as F, math, urllib.request
device = 'cuda' if torch.cuda.is_available() else 'cpu'
url = "https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt"
text = urllib.request.urlopen(url).read().decode()
chars = sorted(set(text)); vocab = len(chars)
stoi = {c: i for i, c in enumerate(chars)}; itos = {i: c for c, i in stoi.items()}
data = torch.tensor([stoi[c] for c in text])
n = int(0.9 * len(data)); train_data, val_data = data[:n], data[n:]
ctx, B = 128, 64
def get_batch(split):
    d = train_data if split == 'train' else val_data
    ix = torch.randint(len(d) - ctx - 1, (B,))
    x = torch.stack([d[i:i + ctx] for i in ix])
    y = torch.stack([d[i + 1:i + ctx + 1] for i in ix])      # targets = inputs shifted by one
    return x.to(device), y.to(device)
print(len(text), "characters,", vocab, "unique")` },
      { t: "The model: attention (from A08), MLP, block, GPT with tied weights and generation.", lang: "python", c: R`class CausalSelfAttention(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.h = h
        self.qkv, self.proj = nn.Linear(d, 3 * d), nn.Linear(d, d)
    def forward(self, x):
        B, T, C = x.shape
        q, k, v = (t.view(B, T, self.h, C // self.h).transpose(1, 2) for t in self.qkv(x).split(C, dim=2))
        y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        return self.proj(y.transpose(1, 2).contiguous().view(B, T, C))

class MLP(nn.Module):
    def __init__(self, d):
        super().__init__()
        self.fc, self.proj = nn.Linear(d, 4 * d), nn.Linear(4 * d, d)
    def forward(self, x):
        return self.proj(F.gelu(self.fc(x)))

class Block(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.ln1, self.attn = nn.LayerNorm(d), CausalSelfAttention(d, h)
        self.ln2, self.mlp = nn.LayerNorm(d), MLP(d)
    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x

class GPT(nn.Module):
    def __init__(self, vocab, ctx, d=384, h=6, L=6):
        super().__init__()
        self.ctx = ctx
        self.tok, self.pos = nn.Embedding(vocab, d), nn.Embedding(ctx, d)
        self.blocks = nn.ModuleList([Block(d, h) for _ in range(L)])
        self.ln_f = nn.LayerNorm(d)
        self.head = nn.Linear(d, vocab, bias=False)
        self.head.weight = self.tok.weight                    # weight tying
    def forward(self, idx, targets=None):
        B, T = idx.shape
        x = self.tok(idx) + self.pos(torch.arange(T, device=idx.device))
        for blk in self.blocks:
            x = blk(x)
        logits = self.head(self.ln_f(x))
        loss = None if targets is None else F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))
        return logits, loss
    @torch.no_grad()
    def generate(self, idx, n_new, temperature=1.0, top_k=None):
        for _ in range(n_new):
            logits, _ = self(idx[:, -self.ctx:])
            logits = logits[:, -1, :] / temperature
            if top_k is not None:
                v, _ = torch.topk(logits, top_k)
                logits[logits < v[:, [-1]]] = float('-inf')
            nxt = torch.multinomial(logits.softmax(-1), num_samples=1)
            idx = torch.cat([idx, nxt], dim=1)
        return idx

model = GPT(vocab, ctx).to(device)
print(sum(p.numel() for p in model.parameters()), "parameters")   # 10,721,664 for vocab=65` },
      { t: R`Check the formula: per block \(12d^2 + 13d\), and the initial loss \(\approx \ln V\).`, lang: "python", c: R`d = 384
blk = sum(p.numel() for p in model.blocks[0].parameters())
print(blk, 12 * d * d + 13 * d)                      # 1774464 1774464
x, y = get_batch('train')
print(model(x, y)[1].item(), math.log(vocab))       # ~4.2 vs 4.17` },
      { t: "Train with AdamW for 2,000 steps, evaluating validation loss along the way.", lang: "python", c: R`opt = torch.optim.AdamW(model.parameters(), lr=1e-3, betas=(0.9, 0.95), weight_decay=0.1)
@torch.no_grad()
def eval_loss(split, iters=20):
    model.eval()
    out = torch.stack([model(*get_batch(split))[1] for _ in range(iters)]).mean().item()
    model.train(); return out
for step in range(2001):
    x, y = get_batch('train')
    _, loss = model(x, y)
    opt.zero_grad(set_to_none=True)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step()
    if step % 250 == 0:
        print(f"step {step:4d}  train {loss.item():.3f}  val {eval_loss('val'):.3f}")
# expect val loss to fall from ~4.2 to roughly 1.6-1.8` },
      { t: "Generate. Try temperature 0.5 vs 1.2 and top_k=10.", lang: "python", c: R`start = torch.tensor([[stoi['\n']]], device=device)
for temp in [0.5, 1.0, 1.2]:
    out = model.generate(start, 300, temperature=temp, top_k=None)
    print(f"--- temperature {temp} ---")
    print(''.join(itos[i] for i in out[0].tolist()))
torch.save(model.state_dict(), "gpt_char.pt")` }
    ],
    cleanup: { t: "Download `gpt_char.pt` if you want to keep it (you'll quantise and serve a model in A12), then disconnect the Colab runtime." }
  },
  cost: [
    R`Budget compute with \(6ND\) before you start. This lab: \(6 \cdot 10.7\text{M} \cdot (2000\cdot64\cdot128) \approx 1.1\times10^{15}\) FLOPs, minutes on a T4.`,
    "Most parameters live in the MLPs (two-thirds of each block); most activation memory comes from attention and the large logits tensor.",
    "Weight tying saves Vd parameters for free."
  ],
  security: [
    R`Always check initial loss \(\approx \ln V\) and that a single batch can be overfit to near-zero loss. Both catch most bugs.`,
    "Off-by-one target shift (predicting the same token instead of the next) gives suspiciously low loss and a useless model.",
    "A train loss far below val loss means overfitting: add dropout, more data or stop earlier."
  ],
  quiz: [
    { q: R`A model has \(d = 2048,\ L = 24\). Approximate non-embedding parameters?`, o: ["100M", "1.2B", "300M", "12B"], a: 1,
      why: R`\(12\cdot24\cdot2048^2 = 1.21\times10^9\).` },
    { q: "Training a 1B-parameter model on 20B tokens needs roughly…", o: [R`\(1.2\times10^{20}\) FLOPs`, R`\(4\times10^{19}\) FLOPs`, R`\(2\times10^{10}\) FLOPs`, R`\(1.2\times10^{23}\) FLOPs`], a: 0,
      why: R`\(6ND = 6\cdot10^9\cdot2\times10^{10} = 1.2\times10^{20}\).` },
    { q: "Lower temperature (e.g. 0.3) when sampling makes output…", o: ["More random", "More deterministic, sharper distribution", "Longer", "Use more memory"], a: 1,
      why: R`Dividing logits by \(T<1\) magnifies differences before softmax, concentrating probability on top tokens.` }
  ],
  docs: [["nanoGPT", "https://github.com/karpathy/nanoGPT"], ["GPT-2 paper", "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf"], ["Transformer FLOPs (Kaplan et al.)", "https://arxiv.org/abs/2001.08361"]]
});

/* ===================== A10 ===================== */
M({
  id: "a10", phase: "A4", title: "Training at Scale on GPUs & AWS", hours: 8, notebook: "a10_scale.ipynb",
  services: ["mixed precision", "memory budget", "DDP / FSDP", "scaling laws", "SageMaker training"],
  summary: "Large models don't fit on one GPU, and training them takes months of GPU time. Learn the memory equation, mixed precision, gradient accumulation, the parallelism strategies, compute-optimal scaling laws, and how to launch a distributed job on SageMaker.",
  simple: {
    analogy: s("Training a huge model is like printing a 10,000-page book. One printer (GPU) is too slow and its tray (memory) is too small. So you hire many printers, split the work, and keep them coordinated so every copy of the book is identical.",
      "Melatih model besar seperti mencetak buku 10,000 muka surat. Satu pencetak (GPU) terlalu perlahan dan dulangnya (memori) terlalu kecil. Jadi anda guna banyak pencetak, bahagikan kerja, dan pastikan semuanya diselaraskan supaya setiap salinan buku sama."),
    plain: s("Big models need many GPUs working together, careful use of memory, and a plan for how much data and compute to use. Cloud platforms such as SageMaker rent those GPUs by the hour.",
      "Model besar memerlukan banyak GPU yang bekerja bersama, penggunaan memori yang teliti, dan perancangan berapa banyak data dan pengkomputeran yang digunakan. Platform cloud seperti SageMaker menyewakan GPU tersebut mengikut jam."),
    why: s("Training compute is the largest cost in AI. Small mistakes in planning waste thousands of dollars.",
      "Pengkomputeran latihan ialah kos terbesar dalam AI. Kesilapan kecil dalam perancangan membazirkan ribuan dolar.")
  },
  outcomes: [
    "Compute the training memory budget: weights, gradients, optimizer state and activations.",
    "Use bf16 autocast, gradient accumulation and gradient clipping.",
    "Choose between data, tensor, pipeline and sharded (ZeRO/FSDP) parallelism.",
    "Plan a run with Chinchilla scaling and estimate time and cost on AWS."
  ],
  concepts: [
    ["Mixed precision", "Compute in bf16 (same exponent range as fp32, no loss scaling needed); keep fp32 master weights and optimizer state."],
    ["Gradient accumulation", R`Sum gradients over \(k\) micro-batches before stepping: effective batch \(= k\times\) micro-batch, with the memory of one.`],
    ["Data parallel (DDP)", "Every GPU holds a full model copy, processes different data, then all-reduces gradients."],
    ["ZeRO / FSDP", "Shard optimizer state, gradients and weights across GPUs; gather them just in time. Memory per GPU ≈ 16N / #GPUs."],
    ["Tensor & pipeline parallel", "Split each matmul across GPUs (tensor) or split layers into stages (pipeline). Needed when one layer or one model copy doesn't fit."],
    ["Scaling laws", R`Loss falls predictably with \(N\) and \(D\). Chinchilla: compute-optimal \(D \approx 20N\).`]
  ],
  math: [
    { name: "Memory for mixed-precision AdamW", tex: R`\[ \text{bytes/param} = \underbrace{2}_{\text{bf16 weights}} + \underbrace{2}_{\text{bf16 grads}} + \underbrace{4}_{\text{fp32 master}} + \underbrace{4 + 4}_{\text{Adam } m,\,v} = 16 \]`,
      explain: "Before any activations. This is why 7B models don't fit on a single 80 GB GPU for full fine-tuning.",
      worked: [[R`7B params \(\times\) 16 B \(= 112\) GB`, "plus activations"],
        [R`FSDP / ZeRO-3 over 8 GPUs: \(112/8 = 14\) GB per GPU`, "fits on 8×A100 40 GB with room for activations"]] },
    { name: "Activation memory per layer", tex: R`\[ M_{act} \approx s\,b\,h\left(34 + \frac{5\,a\,s}{h}\right) \text{ bytes (16-bit)} \]`,
      explain: R`From Korthikanti et al. (2022): \(s\) sequence length, \(b\) batch, \(h\) hidden size, \(a\) heads. The \(5as/h\) term is the attention matrix, which FlashAttention removes.`,
      worked: [[R`GPT-2 small, \(s = 1024,\ b = 8,\ h = 768,\ a = 12\): \(34 + 80 = 114\)`, ""],
        [R`\(1024\cdot8\cdot768\cdot114 = 717\) MB per layer \(\times 12 = 8.6\) GB`, ""],
        [R`with FlashAttention (34 only): 2.6 GB`, "activation checkpointing cuts it further"]] },
    { name: "Compute-optimal training (Chinchilla)", tex: R`\[ D^* \approx 20\,N, \qquad C = 6ND, \qquad t = \frac{C}{n_{gpu}\cdot P_{peak}\cdot \text{MFU}} \]`,
      explain: R`MFU (model FLOPs utilisation) is the fraction of peak you actually achieve: 35–55% is good at scale.`,
      worked: [[R`\(N = 7\times10^9 \Rightarrow D^* = 1.4\times10^{11}\) tokens`, ""],
        [R`\(C = 6\cdot7\times10^9\cdot1.4\times10^{11} = 5.9\times10^{21}\) FLOPs`, ""],
        [R`64 A100s at 312 TFLOP/s and 40% MFU: \(5.9\times10^{21}/8.0\times10^{15} \approx 7.4\times10^{5}\) s`, "≈ 8.5 days"],
        [R`modern practice trains far beyond \(20N\) (e.g. 1–15T tokens for 7–8B models)`, "smaller models are cheaper to serve, so extra training pays off"]] }
  ],
  calc: { type: "trainmem", title: "Training memory & time planner", intro: "Set model size, precision, sharding and GPUs. See memory per GPU, Chinchilla tokens, total FLOPs and wall-clock days." },
  diagram: {
    title: "Data-parallel training with sharded state",
    nodes: [
      { id: "s3", x: 80, y: 200, l: "S3 data shards", s: "pre-tokenised", k: "data" },
      { id: "g0", x: 280, y: 60, l: "GPU 0", s: "fwd + bwd", k: "compute" },
      { id: "g1", x: 280, y: 155, l: "GPU 1", s: "fwd + bwd", k: "compute" },
      { id: "g2", x: 280, y: 250, l: "GPU 2", s: "fwd + bwd", k: "compute" },
      { id: "g3", x: 280, y: 345, l: "GPU 3", s: "fwd + bwd", k: "compute" },
      { id: "ar", x: 480, y: 200, l: "All-reduce", s: "NCCL · average grads", k: "int" },
      { id: "op", x: 670, y: 110, l: "AdamW step", s: "sharded (FSDP)", k: "ops" },
      { id: "ck", x: 670, y: 300, l: "Checkpoint", s: "→ S3 every N steps", k: "data" }
    ],
    steps: [
      { p: [["s3", "g0"], ["s3", "g1"], ["s3", "g2"], ["s3", "g3"]], t: "Each GPU (rank) reads a different slice of the dataset." },
      { p: [["g0", "ar"], ["g1", "ar"], ["g2", "ar"], ["g3", "ar"]], t: R`After backward, gradients are averaged across ranks with a ring all-reduce: each GPU sends and receives about \(2\times\) the gradient size.` },
      { p: [["ar", "op"]], t: "Every rank applies the same update, so the model copies stay identical. FSDP shards the optimizer state so each GPU stores only its slice." },
      { p: [["op", "ck"]], t: "Checkpoint to S3 regularly: spot interruptions and hardware faults are normal at scale." }
    ]
  },
  lab: {
    title: "Mixed precision, accumulation and a SageMaker job", time: "~60 min · Colab GPU + optional AWS (~US$2–6)",
    goal: "Measure memory savings locally, then package a DDP training script for SageMaker.",
    steps: [
      { t: "The memory and compute planner as code.", lang: "python", c: R`def train_memory_gb(n_params, bytes_per_param=16, shards=1):
    return n_params * bytes_per_param / shards / 1e9

def chinchilla_days(n_params, gpus, peak_tflops=312, mfu=0.4):
    tokens = 20 * n_params
    flops = 6 * n_params * tokens
    return tokens, flops, flops / (gpus * peak_tflops * 1e12 * mfu) / 86400

for n in [124e6, 1.3e9, 7e9, 70e9]:
    t, c, days = chinchilla_days(n, gpus=64)
    print(f"{n/1e9:6.2f}B  mem {train_memory_gb(n):7.1f} GB  tokens {t:.1e}  FLOPs {c:.1e}  {days:7.1f} days on 64xA100")` },
      { t: "Mixed-precision autocast (bf16 where supported, otherwise fp16 with a loss scaler), gradient accumulation, clipping, and measured peak memory.", lang: "python", c: R`import torch, torch.nn as nn, torch.nn.functional as F
device = 'cuda'
model = nn.Sequential(*[nn.Sequential(nn.Linear(2048, 8192), nn.GELU(), nn.Linear(8192, 2048)) for _ in range(6)]).to(device)
print(sum(p.numel() for p in model.parameters()) / 1e6, "M params")
opt = torch.optim.AdamW(model.parameters(), lr=3e-4, betas=(0.9, 0.95), weight_decay=0.1)

amp_dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16   # T4 -> fp16
def run(precision, accum=4, micro=16):
    use_amp = precision == 'amp'
    scaler = torch.amp.GradScaler('cuda', enabled=use_amp and amp_dtype == torch.float16)  # fp16 needs loss scaling
    torch.cuda.reset_peak_memory_stats()
    for step in range(5):
        for _ in range(accum):
            x = torch.randn(micro, 512, 2048, device=device)
            with torch.autocast(device_type='cuda', dtype=amp_dtype, enabled=use_amp):
                loss = model(x).float().pow(2).mean()
            scaler.scale(loss / accum).backward()   # scale so the sum equals the mean over the big batch
        scaler.unscale_(opt)
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        scaler.step(opt); scaler.update(); opt.zero_grad(set_to_none=True)
    return torch.cuda.max_memory_allocated() / 1e9

print("fp32 peak GB:", round(run('fp32'), 2))
print(f"{amp_dtype} autocast peak GB:", round(run('amp'), 2))` },
      { t: "A DDP training script. Save as `train_ddp.py`; run locally with `torchrun --nproc_per_node=<gpus> train_ddp.py`.", lang: "python", c: R`import os, torch, torch.nn as nn, torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

def main():
    dist.init_process_group("nccl")
    rank = int(os.environ["LOCAL_RANK"])
    torch.cuda.set_device(rank)
    model = nn.Sequential(nn.Linear(1024, 4096), nn.GELU(), nn.Linear(4096, 1024)).cuda()
    model = DDP(model, device_ids=[rank])
    opt = torch.optim.AdamW(model.parameters(), lr=3e-4)
    steps = int(os.environ.get("SM_HP_STEPS", 200))
    for step in range(steps):
        x = torch.randn(32, 1024, device="cuda")
        loss = model(x).pow(2).mean()
        opt.zero_grad(); loss.backward(); opt.step()     # DDP all-reduces grads inside backward()
        if step % 50 == 0 and dist.get_rank() == 0:
            print(f"step {step} loss {loss.item():.4f} world_size {dist.get_world_size()}")
    if dist.get_rank() == 0:
        os.makedirs(os.environ.get("SM_MODEL_DIR", "model"), exist_ok=True)
        torch.save(model.module.state_dict(), os.path.join(os.environ.get("SM_MODEL_DIR", "model"), "model.pt"))
    dist.destroy_process_group()

if __name__ == "__main__":
    main()` },
      { t: "Launch it on SageMaker with 4 GPUs (ml.g5.12xlarge = 4× A10G). Needs `pip install sagemaker` and a SageMaker execution role. Check your GPU quota for this instance type first.", lang: "python", c: R`import sagemaker
from sagemaker.pytorch import PyTorch
role = "arn:aws:iam::<ACCOUNT_ID>:role/<SageMakerExecutionRole>"
est = PyTorch(
    entry_point="train_ddp.py", source_dir=".", role=role,
    framework_version="2.3", py_version="py311",
    instance_type="ml.g5.12xlarge", instance_count=1,
    distribution={"torch_distributed": {"enabled": True}},     # launches torchrun for you
    hyperparameters={"steps": 500},
    max_run=3600,                                             # hard stop after 1 hour
)
est.fit(wait=True)
print(est.model_data)     # s3://.../model.tar.gz` }
    ],
    cleanup: { t: "SageMaker training jobs stop and release GPUs when they finish. Check **SageMaker → Training jobs** shows Completed or Stopped, and delete large checkpoints from S3 that you don't need." }
  },
  cost: [
    R`GPU-hours dominate. Estimate with \(C = 6ND\) and a realistic MFU before launching anything.`,
    "SageMaker Managed Spot Training can cut costs substantially for checkpointed jobs. Pair it with `checkpoint_s3_uri`.",
    "Idle notebooks with GPUs bill every hour. Stop SageMaker Studio apps and Colab runtimes when not in use."
  ],
  security: [
    "Loss spikes at scale: lower LR, longer warmup, gradient clipping, and skipping bad batches. Keep the last good checkpoint.",
    "Effective batch = micro-batch × accumulation × GPUs. Change one, and you may need to retune the LR.",
    "fp16 (not bf16) needs a loss scaler (`torch.amp.GradScaler`) or gradients underflow to zero."
  ],
  quiz: [
    { q: "Full fine-tuning a 13B model with mixed-precision AdamW needs roughly how much memory before activations?", o: ["26 GB", "52 GB", "208 GB", "13 GB"], a: 2,
      why: R`\(13\times10^9\cdot16\) B \(= 208\) GB, hence sharding (FSDP/ZeRO) or parameter-efficient methods (A11).` },
    { q: R`Chinchilla-optimal tokens for a 3B model?`, o: ["3B", "60B", "600B", "20B"], a: 1,
      why: R`\(D \approx 20N = 60\times10^9\).` },
    { q: "What does DDP communicate after each backward pass?", o: ["The input data", "Gradients (averaged with all-reduce)", "The optimizer state", "Nothing"], a: 1,
      why: "Each rank computes gradients on its own data; all-reduce averages them so every replica applies the same update." }
  ],
  docs: [["Chinchilla paper", "https://arxiv.org/abs/2203.15556"], ["Reducing activation recomputation (Korthikanti et al.)", "https://arxiv.org/abs/2205.05198"], ["PyTorch FSDP tutorial", "https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html"], ["SageMaker distributed training", "https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html"]]
});

/* ===================== A11 ===================== */
M({
  id: "a11", phase: "A4", title: "Fine-Tuning: SFT, LoRA & DPO", hours: 6, notebook: "a11_finetuning.ipynb",
  services: ["SFT", "LoRA / QLoRA", "PEFT", "DPO", "evaluation"],
  summary: "Pre-trained models are adapted with supervised fine-tuning on instructions, made cheap with low-rank adapters, and aligned with preference optimisation. Derive LoRA's parameter savings, implement it from scratch, and compute the DPO loss by hand.",
  simple: {
    analogy: s("Fine-tuning a big model is like adapting a chef trained in every cuisine to your restaurant's menu. Full fine-tuning retrains the whole chef. **LoRA** gives them a small notebook of adjustments and leaves their main skills untouched. **DPO** shows them pairs of dishes and says \"customers preferred this one\".",
      "Penalaan halus model besar seperti menyesuaikan chef yang mahir semua masakan dengan menu restoran anda. Penalaan penuh melatih semula seluruh kemahiran chef. **LoRA** memberinya buku nota kecil berisi penyesuaian dan mengekalkan kemahiran utamanya. **DPO** menunjukkan pasangan hidangan dan berkata \"pelanggan lebih suka yang ini\"."),
    plain: s("You rarely train from scratch. You take an existing model and teach it your task or style with a small dataset, usually training only a tiny fraction of its weights.",
      "Anda jarang melatih dari awal. Anda ambil model sedia ada dan ajar tugas atau gaya anda dengan set data kecil, biasanya melatih hanya sebahagian kecil pemberatnya."),
    why: s("This is the most common real-world LLM engineering task, and it can run on a single GPU.",
      "Ini tugas kejuruteraan LLM paling biasa di dunia sebenar, dan ia boleh dijalankan pada satu GPU sahaja.")
  },
  outcomes: [
    "Explain SFT data formatting and loss masking on prompt tokens.",
    R`Derive LoRA's trainable parameters \(r(d_{in} + d_{out})\) and its update \(\Delta W = \tfrac{\alpha}{r}BA\).`,
    "Implement a LoRA layer from scratch and merge it back for zero-overhead inference.",
    "Compute the DPO loss for a preference pair."
  ],
  concepts: [
    ["SFT", "Supervised fine-tuning on (instruction, response) pairs. Loss is usually computed only on response tokens."],
    ["LoRA", R`Freeze \(W_0\); learn a low-rank update \(BA\) with \(r \ll d\). \(B\) starts at zero so training begins exactly at the base model.`],
    ["QLoRA", "Keep the frozen base in 4-bit (NF4) and train LoRA adapters in bf16: a 7B fine-tune fits in about 10–16 GB of GPU memory."],
    ["Merging", R`After training, \(W = W_0 + \tfrac{\alpha}{r}BA\) is folded in: no extra inference cost. Or keep adapters separate to swap per customer.`],
    ["DPO", "Direct preference optimisation trains on (chosen, rejected) pairs against a frozen reference model, with no reward model or RL loop."],
    ["Evaluation", "Hold-out loss, task metrics and side-by-side human or LLM-judge comparison. Watch for regressions on general ability."]
  ],
  math: [
    { name: "LoRA update and savings", tex: R`\[ h = W_0x + \frac{\alpha}{r}\,B A x, \qquad A\in\mathbb{R}^{r\times d_{in}},\; B\in\mathbb{R}^{d_{out}\times r} \]`,
      explain: R`Trainable parameters per adapted matrix: \(r(d_{in} + d_{out})\) instead of \(d_{in}d_{out}\).`,
      worked: [[R`\(d_{in} = d_{out} = 4096,\ r = 8\): \(8\cdot(4096 + 4096) = 65{,}536\)`, ""],
        [R`full matrix: \(4096^2 = 16{,}777{,}216\)`, R`LoRA trains \(0.39\%\) of it`],
        [R`7B model, adapters on Q and V in 32 layers: \(2\cdot32\cdot65{,}536 = 4.2\)M trainable`, "≈ 0.06% of the model"],
        [R`optimizer state: \(4.2\text{M}\cdot 16\) B ≈ 67 MB instead of 112 GB`, "the real reason LoRA fits on one GPU"]] },
    { name: "Why B starts at zero", tex: R`\[ B_0 = 0 \;\Rightarrow\; h = W_0x \text{ at step 0}, \qquad \frac{\partial L}{\partial B} = \frac{\alpha}{r}\,\frac{\partial L}{\partial h}(Ax)^{\top} \neq 0 \]`,
      explain: R`The model starts exactly as the base, yet \(B\) still receives gradient because \(A\) is random. \(\alpha/r\) keeps the update scale stable when you change \(r\).`,
      worked: [[R`\(\alpha = 16,\ r = 8 \Rightarrow\) scale 2`, "common default"]] },
    { name: "DPO loss", tex: R`\[ \mathcal{L}_{DPO} = -\log\sigma\!\Big(\beta\big[(\log\pi_\theta(y_w|x) - \log\pi_{ref}(y_w|x)) - (\log\pi_\theta(y_l|x) - \log\pi_{ref}(y_l|x))\big]\Big) \]`,
      explain: R`\(y_w\) chosen, \(y_l\) rejected; log-probs are summed over response tokens; \(\beta\) controls how far the policy may drift from the reference.`,
      worked: [[R`\(\log\pi_\theta(y_w) = -12,\ \log\pi_{ref}(y_w) = -14\)`, "policy already likes the chosen answer more (+2)"],
        [R`\(\log\pi_\theta(y_l) = -15,\ \log\pi_{ref}(y_l) = -13\)`, "and the rejected one less (−2)"],
        [R`margin \(= \beta(2 - (-2)) = 0.1\cdot4 = 0.4\)`, ""],
        [R`\(\mathcal{L} = -\log\sigma(0.4) = -\log 0.599 = 0.513\)`, R`below \(\log 2 = 0.693\), the loss at zero margin`]] }
  ],
  calc: { type: "lora", title: "LoRA parameter & memory calculator", intro: "Pick the base model shape, rank and which matrices to adapt. Compare trainable parameters and training memory with full fine-tuning." },
  diagram: {
    title: "A LoRA-adapted linear layer",
    nodes: [
      { id: "x", x: 80, y: 200, l: "x", s: "(…, d_in)", k: "data" },
      { id: "w0", x: 330, y: 90, l: "W₀ (frozen)", s: "d_out × d_in", k: "compute" },
      { id: "a", x: 260, y: 310, l: "A (trainable)", s: "r × d_in, random", k: "ai" },
      { id: "b", x: 450, y: 310, l: "B (trainable)", s: "d_out × r, zeros", k: "ai" },
      { id: "sum", x: 560, y: 200, l: "h = W₀x + (α/r)BAx", k: "ops" },
      { id: "out", x: 710, y: 200, l: "Output", s: "(…, d_out)", k: "data" }
    ],
    steps: [
      { p: [["x", "w0", "sum"]], t: R`The frozen path: the original weight matrix, which receives no gradients and has no optimizer state.` },
      { p: [["x", "a", "b", "sum"]], t: R`The adapter path: project down to rank \(r\), then back up. Only \(A\) and \(B\) are trained.` },
      { p: [["sum", "out"]], t: R`At deployment, merge \(W_0 + \frac{\alpha}{r}BA\) into one matrix, or keep many adapters and switch them per request.` }
    ]
  },
  lab: {
    title: "LoRA from scratch, then PEFT on a real model", time: "~60 min · Colab T4",
    goal: "Write LoRA yourself, verify zero-init and merging, then apply the Hugging Face PEFT library.",
    steps: [
      { t: "A LoRA wrapper around `nn.Linear`.", lang: "python", c: R`import torch, torch.nn as nn, torch.nn.functional as F
class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r=8, alpha=16):
        super().__init__()
        self.base = base
        for p in self.base.parameters():
            p.requires_grad_(False)                     # freeze W0 (and bias)
        self.A = nn.Parameter(torch.randn(r, base.in_features) / r)
        self.B = nn.Parameter(torch.zeros(base.out_features, r))
        self.scale = alpha / r
    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale
    @torch.no_grad()
    def merged(self):
        lin = nn.Linear(self.base.in_features, self.base.out_features, bias=self.base.bias is not None)
        lin.weight.copy_(self.base.weight + self.scale * self.B @ self.A)
        if self.base.bias is not None: lin.bias.copy_(self.base.bias)
        return lin

base = nn.Linear(4096, 4096)
lora = LoRALinear(base, r=8, alpha=16)
trainable = sum(p.numel() for p in lora.parameters() if p.requires_grad)
print(trainable, f"{trainable / base.weight.numel():.2%}")        # 65536 0.39%
x = torch.randn(3, 4096)
print(torch.allclose(lora(x), base(x)))                         # True: B = 0 at init` },
      { t: "Train the adapter to imitate a target layer, then merge and check equivalence.", lang: "python", c: R`torch.manual_seed(0)
target = nn.Linear(256, 256)
lora = LoRALinear(nn.Linear(256, 256), r=4, alpha=8)
opt = torch.optim.AdamW([lora.A, lora.B], lr=1e-2)
for step in range(500):
    x = torch.randn(64, 256)
    loss = F.mse_loss(lora(x), target(x).detach())
    opt.zero_grad(); loss.backward(); opt.step()
print("loss", loss.item())                     # a rank-4 update can only partly match a full-rank change
merged = lora.merged()
x = torch.randn(5, 256)
print(torch.allclose(lora(x), merged(x), atol=1e-5))   # True: zero inference overhead after merging` },
      { t: "The DPO loss, checked against the worked example.", lang: "python", c: R`def dpo_loss(pi_w, pi_l, ref_w, ref_l, beta=0.1):
    # each argument: summed log-prob of the response tokens
    logits = beta * ((pi_w - ref_w) - (pi_l - ref_l))
    return -F.logsigmoid(logits).mean()
print(dpo_loss(torch.tensor(-12.), torch.tensor(-15.), torch.tensor(-14.), torch.tensor(-13.)))   # 0.5130` },
      { t: "PEFT on GPT-2 (`pip install transformers peft`). The same few lines apply to Llama, Qwen or Mistral.", lang: "python", c: R`from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model
model = AutoModelForCausalLM.from_pretrained("gpt2")
cfg = LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05, target_modules=["c_attn"],
                 fan_in_fan_out=True, task_type="CAUSAL_LM")   # GPT-2 stores c_attn transposed
model = get_peft_model(model, cfg)
model.print_trainable_parameters()      # ~0.24% of 124M` }
    ],
    cleanup: { t: "Disconnect the runtime. Adapter weights are only a few MB, so save them if you want to reuse them." }
  },
  cost: [
    "LoRA/QLoRA lets a single 24 GB GPU (ml.g5.xlarge, g6.xlarge) fine-tune 7–8B models. Full fine-tuning needs a multi-GPU node.",
    "Data quality beats quantity: a few thousand clean, diverse examples often outperform 100k noisy ones.",
    "Serve many LoRA adapters on one base model (multi-LoRA serving) instead of one endpoint per customer."
  ],
  security: [
    "Mask the loss on prompt tokens in SFT, or the model learns to generate the questions.",
    "Catastrophic forgetting: track a general benchmark, not just your task metric.",
    "Fine-tuning can remove safety behaviour. Evaluate harmful-request refusals before deploying, and never fine-tune on data you're not licensed to use."
  ],
  quiz: [
    { q: R`LoRA rank 16 on a \(4096\times11008\) MLP matrix. Trainable parameters?`, o: ["241,664", "45M", "65,536", "1.2M"], a: 0,
      why: R`\(16\cdot(4096 + 11008) = 16\cdot15{,}104 = 241{,}664\).` },
    { q: R`Why is \(B\) initialised to zero?`, o: ["To save memory", "So the adapted model starts identical to the base model", "To prevent overfitting", "Because A is zero too"], a: 1,
      why: R`\(BA = 0\) at step 0, while \(B\) still gets non-zero gradient because \(A\) is random.` },
    { q: "In DPO, a margin of 0 gives a loss of…", o: ["0", R`\(\log 2 \approx 0.693\)`, "1", R`\(\infty\)`], a: 1,
      why: R`\(-\log\sigma(0) = -\log 0.5 = \log 2\).` }
  ],
  docs: [["LoRA paper", "https://arxiv.org/abs/2106.09685"], ["QLoRA paper", "https://arxiv.org/abs/2305.14314"], ["DPO paper", "https://arxiv.org/abs/2305.18290"], ["Hugging Face PEFT", "https://huggingface.co/docs/peft"]]
});

/* ===================== A12 ===================== */
M({
  id: "a12", phase: "A4", title: "Inference, Quantization & Serving on AWS", hours: 7, notebook: "a12_inference.ipynb",
  services: ["KV cache", "prefill vs decode", "sampling", "int8 / int4", "vLLM", "SageMaker / Bedrock"],
  summary: "Generating text is a different workload from training: a compute-bound prefill, then a memory-bound decode loop. Learn the KV-cache equation, why decode speed ≈ bandwidth / model size, how quantisation works numerically, and how to serve models on AWS GPUs, Inferentia or Bedrock.",
  simple: {
    analogy: s("Answering a question has two phases. First the model reads your whole prompt at once (prefill), like skimming a page. Then it writes one word at a time (decode), and each word means re-reading the entire 'brain' from memory. The **KV cache** is a sticky-note pad so it doesn't re-read your prompt for every word.",
      "Menjawab soalan ada dua fasa. Mula-mula model membaca keseluruhan prompt sekaligus (prefill), seperti membaca sepintas lalu. Kemudian ia menulis satu perkataan pada satu masa (decode), dan setiap perkataan bermaksud membaca semula seluruh 'otak' dari memori. **KV cache** ialah pad nota pelekat supaya ia tidak membaca semula prompt anda untuk setiap perkataan."),
    plain: s("Serving an LLM is limited mostly by GPU memory size and speed. Caching, smaller number formats (quantisation) and batching many users together make it fast and affordable.",
      "Menghidangkan LLM kebanyakannya dihadkan oleh saiz dan kelajuan memori GPU. Cache, format nombor yang lebih kecil (kuantisasi) dan menggabungkan ramai pengguna menjadikannya pantas dan mampu milik."),
    why: s("Inference runs forever, training runs once. Over a product's lifetime, serving usually costs far more.",
      "Inferens berjalan selama-lamanya, latihan sekali sahaja. Sepanjang hayat produk, kos menghidangkan model biasanya jauh lebih tinggi.")
  },
  outcomes: [
    R`Compute KV-cache size \(2\,L\,n_{kv}\,d_{head}\,T\,b\) bytes and the effect of GQA.`,
    "Explain prefill (compute-bound) vs decode (memory-bound) and estimate tokens per second.",
    "Quantise weights to int8 by hand and reason about int4 trade-offs.",
    "Implement temperature and top-p sampling, and serve a model with vLLM, SageMaker or Bedrock."
  ],
  concepts: [
    ["KV cache", R`Store each layer's keys and values for past tokens, so generating token \(t\) costs \(O(t)\) attention instead of recomputing \(O(t^2)\).`],
    ["Prefill vs decode", "Prefill processes the prompt in parallel (big matmuls, compute-bound). Decode produces one token per step, reading all weights each step (memory-bound)."],
    ["Continuous batching", "Servers like vLLM add and remove requests from the running batch every step; PagedAttention stores KV cache in pages to avoid fragmentation."],
    ["Quantisation", "Store weights in int8/int4 with a scale (per channel or per group). Fewer bytes means faster decode and smaller GPUs, at a small quality cost."],
    ["Speculative decoding", "A small draft model proposes several tokens; the big model verifies them in one pass. Same output distribution, fewer big-model steps."],
    ["AWS options", "EC2 g5/g6/p4/p5 GPUs, Inferentia2 (inf2) for low-cost inference, SageMaker real-time endpoints, Bedrock for managed models or Custom Model Import."]
  ],
  math: [
    { name: "KV-cache size", tex: R`\[ M_{KV} = 2 \cdot L \cdot n_{kv} \cdot d_{head} \cdot T \cdot b \cdot \text{bytes} \]`,
      explain: R`Factor 2 for K and V. Llama-2-7B-like shape: \(L = 32,\ n_{kv} = 32,\ d_{head} = 128\), fp16.`,
      worked: [[R`\(T = 4096,\ b = 1\): \(2\cdot32\cdot32\cdot128\cdot4096\cdot2 = 2{,}147{,}483{,}648\) B`, "= 2 GiB for one sequence"],
        [R`batch of 16: 32 GiB, more than the 14 GB of weights`, "KV cache, not weights, limits batch size"],
        [R`GQA with \(n_{kv} = 8\): 0.5 GiB per sequence`, "4× more concurrent users"]] },
    { name: "Decode speed bound", tex: R`\[ \text{tokens/s per sequence} \lesssim \frac{\text{memory bandwidth}}{\text{bytes of weights}} \]`,
      explain: "Each decode step reads every weight once. Batching shares that read across many sequences.",
      worked: [[R`7B fp16 = 14 GB on an A10G (600 GB/s): \(600/14 \approx 43\) tokens/s upper bound`, ""],
        [R`int4 (3.5 GB): \(\approx 170\) tokens/s upper bound`, "why quantisation speeds up decode"],
        [R`prefill of 1,000 tokens: \(2N\cdot1000 = 1.4\times10^{13}\) FLOPs`, "≈ 0.1–0.4 s on the same GPU"]] },
    { name: "Symmetric int8 quantisation", tex: R`\[ s = \frac{\max_i |w_i|}{127}, \qquad q_i = \mathrm{round}\!\left(\frac{w_i}{s}\right), \qquad \hat w_i = s\,q_i \]`,
      explain: R`\(w = (0.12,\ -0.50,\ 0.31,\ 0.02)\).`,
      worked: [[R`\(s = 0.50/127 = 0.003937\)`, ""],
        [R`\(q = \mathrm{round}(30.5,\ -127,\ 78.7,\ 5.1) = (30,\ -127,\ 79,\ 5)\)`, "4 bytes instead of 16"],
        [R`\(\hat w = (0.1181,\ -0.5000,\ 0.3110,\ 0.0197)\)`, R`max error \(\le s/2 = 0.002\)`],
        [R`one outlier weight inflates \(s\) for everyone`, "why int4 uses small groups (e.g., 128 weights per scale) and methods such as AWQ/GPTQ"]] },
    { name: "Temperature and top-p", tex: R`\[ p_i = \frac{e^{z_i/T}}{\sum_j e^{z_j/T}}, \qquad \text{top-}p:\ \text{smallest set } S \text{ with } \textstyle\sum_{i\in S}p_i \ge p \]`,
      explain: R`Logits \(z = (2.0,\ 1.0,\ 0.1)\).`,
      worked: [[R`\(T = 1\): \((0.659,\ 0.242,\ 0.099)\)`, ""],
        [R`\(T = 0.5\): \((0.864,\ 0.117,\ 0.019)\)`, "sharper"],
        [R`top-p 0.9 at \(T = 1\): keep \(\{0, 1\}\) (0.901), renormalise to \((0.731,\ 0.269)\)`, ""]] }
  ],
  calc: { type: "kvcache", title: "Serving memory & speed planner", intro: "Pick a model shape, precision, context and batch. See weights + KV cache against your GPU's memory, and the decode-speed upper bound." },
  diagram: {
    title: "Serving one request",
    nodes: [
      { id: "u", x: 80, y: 200, l: "Client", s: "prompt", k: "user" },
      { id: "ep", x: 240, y: 200, l: "Endpoint", s: "vLLM on g5 / SageMaker", k: "net" },
      { id: "pf", x: 420, y: 90, l: "Prefill", s: "whole prompt, compute-bound", k: "compute" },
      { id: "kv", x: 620, y: 200, l: "KV cache", s: "2·L·h·d·T bytes", k: "data" },
      { id: "dc", x: 420, y: 310, l: "Decode step", s: "1 token, memory-bound", k: "compute" },
      { id: "sp", x: 640, y: 340, l: "Sampler", s: "temperature · top-p", k: "ops" }
    ],
    steps: [
      { p: [["u", "ep", "pf"]], t: "The prompt arrives and all its tokens run through the model in one parallel forward pass." },
      { p: [["pf", "kv"]], t: "Every layer's keys and values for the prompt are written to the KV cache." },
      { p: [["kv", "dc", "sp"]], t: "Decode: one new token per step. It attends to the cached keys and values and reads all weights from memory once." },
      { p: [["sp", "kv"], ["dc", "ep", "u"]], t: "The sampled token is appended to the cache and streamed back. Repeat until EOS or max tokens. Continuous batching interleaves many users." }
    ]
  },
  lab: {
    title: "Sampling, int8, KV cache speed-up, and serving", time: "~60 min · Colab T4 + optional AWS GPU",
    goal: "Reproduce the worked numbers, measure the KV-cache speed-up, then serve an open model with an OpenAI-compatible API.",
    steps: [
      { t: "Temperature and top-p sampling.", lang: "python", c: R`import torch, time
def probs(logits, temperature=1.0):
    return (logits / temperature).softmax(-1)
def top_p_filter(p, top_p=0.9):
    sorted_p, idx = p.sort(descending=True)
    keep = sorted_p.cumsum(-1) - sorted_p < top_p        # keep tokens until the mass reaches top_p
    out = torch.zeros_like(p)
    out[idx[keep]] = sorted_p[keep]
    return out / out.sum()
z = torch.tensor([2.0, 1.0, 0.1])
print(probs(z, 1.0), probs(z, 0.5))         # [0.659 0.242 0.099] [0.864 0.117 0.019]
print(top_p_filter(probs(z), 0.9))          # [0.731 0.269 0.000]
print(torch.multinomial(top_p_filter(probs(z), 0.9), 10, replacement=True))` },
      { t: "Symmetric int8 quantisation, then per-row quantisation of a real weight matrix.", lang: "python", c: R`w = torch.tensor([0.12, -0.5, 0.31, 0.02])
s = w.abs().max() / 127
q = torch.round(w / s).to(torch.int8)
print(q, q.float() * s)                     # [30, -127, 79, 5] -> [0.1181, -0.5, 0.3110, 0.0197]

W = torch.randn(4096, 4096) * 0.02
scales = W.abs().amax(dim=1, keepdim=True) / 127      # one scale per output row
Wq = torch.round(W / scales).to(torch.int8)
err = (Wq.float() * scales - W).abs().mean() / W.abs().mean()
print(f"bytes: {W.numel()*2/1e6:.0f} MB fp16 -> {W.numel()/1e6:.0f} MB int8, mean rel. error {err:.3%}")` },
      { t: "KV cache in action with GPT-2 (`pip install transformers`).", lang: "python", c: R`from transformers import AutoModelForCausalLM, AutoTokenizer
device = 'cuda' if torch.cuda.is_available() else 'cpu'
tok = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2").to(device).eval()
ids = tok("The cloud is", return_tensors="pt").input_ids.to(device)
for use_cache in [False, True]:
    t = time.perf_counter()
    out = model.generate(ids, max_new_tokens=300, do_sample=False, use_cache=use_cache,
                         pad_token_id=tok.eos_token_id)
    print(f"use_cache={use_cache}: {time.perf_counter() - t:.2f}s")
L, h, d = model.config.n_layer, model.config.n_head, model.config.n_embd // model.config.n_head
print("KV bytes for 1024 tokens fp16:", 2 * L * h * d * 1024 * 2)    # 37,748,736` },
      { t: "Serve an open model on an AWS GPU instance (e.g., g5.xlarge with a Deep Learning AMI). vLLM exposes an OpenAI-compatible API.", lang: "bash", c: R`pip install vllm
vllm serve Qwen/Qwen2.5-1.5B-Instruct --max-model-len 4096 --gpu-memory-utilization 0.9 &
# wait for "Application startup complete", then:
curl -s localhost:8000/v1/chat/completions -H 'Content-Type: application/json' -d '{
  "model": "Qwen/Qwen2.5-1.5B-Instruct",
  "messages": [{"role": "user", "content": "Terangkan KV cache dalam dua ayat."}],
  "max_tokens": 120, "temperature": 0.7}'` },
      { t: "Managed alternative: call a Bedrock model with the Converse API (no servers), using the CLI from module 18 or boto3.", lang: "python", c: R`import boto3
brt = boto3.client("bedrock-runtime", region_name="ap-southeast-1")
resp = brt.converse(
    modelId="<inference-profile-id>",              # from: aws bedrock list-inference-profiles
    messages=[{"role": "user", "content": [{"text": "Explain the KV cache in two sentences."}]}],
    inferenceConfig={"maxTokens": 150, "temperature": 0.5},
)
print(resp["output"]["message"]["content"][0]["text"])
print(resp["usage"])                                # input/output tokens: what you're billed for` }
    ],
    cleanup: { t: "Stop or terminate the GPU instance as soon as you're done: a g5.xlarge bills about US$1/hour. Delete any SageMaker endpoint (endpoints bill continuously)." }
  },
  cost: [
    R`Cost per token \(\approx\) instance price / (tokens per second × 3600). Batching and quantisation raise tokens per second, which lowers cost per token.`,
    "SageMaker real-time endpoints bill every hour they exist, even with zero traffic. Use serverless or asynchronous inference, or scale to zero, for spiky workloads.",
    "Compare self-hosting with Bedrock's per-token pricing: managed is usually cheaper at low or unpredictable volume."
  ],
  security: [
    "Prompt injection: treat user input and retrieved documents as untrusted. Never give the model tools or credentials beyond the task's needs.",
    "Set `max_tokens` and request timeouts. Unbounded generation is a cost and denial-of-service risk.",
    "Log prompts and outputs carefully: they may contain personal data. Apply retention limits and redaction."
  ],
  quiz: [
    { q: R`KV cache for \(L = 40,\ n_{kv} = 8,\ d_{head} = 128,\ T = 8192\), fp16, batch 1?`, o: ["1.34 GB", "0.67 GB", "5.4 GB", "168 MB"], a: 0,
      why: R`\(2\cdot40\cdot8\cdot128\cdot8192\cdot2 = 1{,}342{,}177{,}280\) B ≈ 1.34 GB.` },
    { q: "Why is single-sequence decoding memory-bound?", o: ["Attention is O(T²)", "Each step does ~2 FLOPs per weight but must read every weight from memory", "The tokenizer is slow", "Sampling is expensive"], a: 1,
      why: "Arithmetic intensity is about 1 FLOP per byte at batch 1, far below the GPU's compute/bandwidth ratio. Batching raises it." },
    { q: R`int8 symmetric quantisation with max \(|w| = 2.54\). Scale \(s\)?`, o: ["0.01", "0.02", "2.54", "127"], a: 1,
      why: R`\(s = 2.54/127 = 0.02\).` }
  ],
  docs: [["vLLM / PagedAttention paper", "https://arxiv.org/abs/2309.06180"], ["LLM.int8() paper", "https://arxiv.org/abs/2208.07339"], ["SageMaker large model inference", "https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference.html"], ["Bedrock Custom Model Import", "https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-import-model.html"]]
});

C.aiModules = (C.aiModules || []).concat(A);

/* ===================== AI capstone ===================== */
C.aiCapstone = {
  title: "AI Capstone: BahasaGPT-mini",
  hours: 24,
  summary: "Train your own small Malay language model end to end: build a tokenizer, pre-train a GPT on Malay text with SageMaker, measure it properly, fine-tune it to follow simple instructions with LoRA, quantise it, and serve it behind an endpoint. Then write up every number.",
  simple: {
    analogy: s("This is your final-year project. You build a small brain for Bahasa Melayu from nothing, teach it, test it, and put it online for others to try.",
      "Ini projek tahun akhir anda. Anda membina otak kecil untuk Bahasa Melayu dari kosong, mengajarnya, mengujinya, dan meletakkannya dalam talian untuk dicuba orang lain."),
    plain: s("You'll apply every AI module: data, tokenisation, the GPT architecture, training at scale, fine-tuning, quantisation and serving on AWS.",
      "Anda akan mengaplikasikan setiap modul AI: data, tokenisasi, seni bina GPT, latihan berskala, penalaan halus, kuantisasi dan menghidangkan model di AWS."),
    why: s("A trained-from-scratch model with honest metrics is a far stronger portfolio piece than another chatbot wrapper.",
      "Model yang dilatih dari kosong dengan metrik yang jujur ialah projek portfolio yang jauh lebih kukuh daripada sekadar pembalut chatbot.")
  },
  diagram: {
    title: "BahasaGPT-mini pipeline",
    nodes: [
      { id: "src", x: 80, y: 90, l: "Malay corpus", s: "Wikipedia ms → S3", k: "data" },
      { id: "tk", x: 250, y: 90, l: "Train BPE", s: "vocab 16k", k: "ops" },
      { id: "tr", x: 430, y: 90, l: "SageMaker training", s: "ml.g5 · bf16 · DDP", k: "compute" },
      { id: "ck", x: 640, y: 90, l: "Checkpoints", s: "S3", k: "data" },
      { id: "ev", x: 640, y: 230, l: "Evaluate", s: "val loss · perplexity", k: "ops" },
      { id: "ft", x: 430, y: 230, l: "LoRA SFT", s: "instruction pairs", k: "ai" },
      { id: "q", x: 250, y: 230, l: "Quantise", s: "int8 weights", k: "ops" },
      { id: "ep", x: 250, y: 350, l: "Endpoint", s: "g5 / inf2 / SageMaker", k: "net" },
      { id: "app", x: 80, y: 350, l: "Demo app", s: "chat UI", k: "user" }
    ],
    steps: [
      { p: [["src", "tk"]], t: "Clean and deduplicate Malay text, then train a BPE tokenizer on it (compare tokens/word with GPT-2's tokenizer)." },
      { p: [["tk", "tr", "ck"]], t: R`Pre-train a ~25–50M-parameter GPT; budget it with \(6ND\) first. Checkpoint to S3.` },
      { p: [["ck", "ev"]], t: "Evaluate validation loss and perplexity on held-out text, plus qualitative samples at several temperatures." },
      { p: [["ev", "ft", "q"]], t: "LoRA-fine-tune on a few hundred instruction pairs, merge, then int8-quantise and measure the quality drop." },
      { p: [["q", "ep", "app"]], t: "Serve behind an endpoint with sensible limits (max tokens, timeouts) and a tiny chat demo." }
    ]
  },
  functional: [
    "A BPE tokenizer trained on Malay text, with a tokens-per-word comparison against GPT-2's tokenizer.",
    "A GPT you wrote (from A09), pre-trained on Malay text, generating fluent-looking Malay.",
    "A LoRA-fine-tuned variant that answers short instructions in Malay.",
    "An int8 model served behind an HTTP endpoint with streaming or a simple chat page."
  ],
  nfr: [
    "**Reproducible:** one command or notebook per stage; seeds and configs committed.",
    R`**Measured:** report parameters, tokens seen, FLOPs (\(6ND\)), GPU-hours, cost, and validation perplexity.`,
    "**Budget:** total AWS spend under US$50, enforced with a budget alert and `max_run` limits.",
    "**Responsible:** dataset licence noted; a short model card listing limitations and failure cases."
  ],
  milestones: {
    cols: ["Week", "Milestone", "Evidence"],
    rows: [
      ["1", "Data: download Malay Wikipedia (`wikimedia/wikipedia`, config `20231101.ms`), clean, dedupe, split, upload to S3", "Dataset stats: documents, characters, tokens"],
      ["1", "Tokenizer: train BPE (Hugging Face `tokenizers`), compare tokens/word with GPT-2", "Table + chart"],
      ["2", "Pre-train: GPT from A09 at ~25–50M params on SageMaker with bf16 and checkpoints", "Loss curves, FLOPs and cost"],
      ["2", "Evaluate: val perplexity, samples at T = 0.5/1.0, failure analysis", "Eval notebook"],
      ["3", "Fine-tune: LoRA SFT on 300–1,000 Malay instruction pairs; compare before/after", "Side-by-side examples"],
      ["3", "Serve: int8 quantise, deploy, load-test tokens/s and latency", "Benchmark table and demo link"]
    ]
  },
  deliverables: [
    "Public repo with data, tokenizer, training, evaluation, fine-tuning and serving code.",
    "A model card: architecture, parameters, data, training compute, metrics, limitations.",
    "A cost report: GPU-hours by stage, total spend, cost per 1,000 generated tokens.",
    "A 10-minute walkthrough explaining one design decision with the numbers behind it."
  ],
  adr: String.raw`# Model card: BahasaGPT-mini

## Architecture
GPT (pre-LN), d=512, L=8, heads=8, ctx=512, vocab=16,000 (BPE, Malay)
Parameters: <N> (embeddings tied). Formula check: 12·L·d² + V·d + ctx·d ≈ <value>

## Training
Data: Malay Wikipedia (CC BY-SA), <D> tokens after cleaning
Compute: 6·N·D = <C> FLOPs, <hours> GPU-hours on ml.g5.<size>, cost US$<x>
Optimiser: AdamW (β=0.9/0.95, wd=0.1), lr 6e-4, warmup 2%, cosine to 10%

## Results
Val loss <x> (perplexity <e^x>) · int8 val loss <y> (Δ <y-x>)
Decode: <tok/s> tokens/s at batch 1 on <GPU>

## Limitations
Small model: frequent factual errors, repetition at low temperature,
weak on code-switching (Malay–English), no safety tuning. Research demo only.`,
  rubric: {
    cols: ["Area", "Meets the bar", "Exceeds"],
    rows: [
      ["Understanding", "Parameter count and FLOPs computed by formula and matched in code", "Ablation (e.g., width vs depth at fixed compute) with a plotted result"],
      ["Data & tokenizer", "Clean split, dedupe, BPE trained and compared", "Measured effect of vocab size on perplexity and tokens/word"],
      ["Training", "Stable loss curve, checkpoints, bf16, budget respected", "Distributed (DDP/FSDP) run with MFU reported"],
      ["Fine-tuning", "LoRA SFT with before/after examples", "DPO on preference pairs, evaluated"],
      ["Serving", "Quantised model served with limits", "Measured latency/throughput vs batch size; cost per 1k tokens"],
      ["Communication", "Model card + cost report", "Clear walkthrough tying every decision to a number"]
    ]
  },
  tip: "Interviewers will ask 'how many parameters, how many tokens, how many FLOPs, how much did it cost?'. If you can answer all four from memory with the formulas behind them, you're ahead of most candidates."
};
})(window.COURSE);
