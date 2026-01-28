下面是一份“Partner 文献确认备忘录”，把你现在最关键的主线（**learned cost / preference → shortest path（或 K-shortest / diversified-K）→ 生成**）梳理清楚，并把需要你/partner去精读确认的点列成可执行清单。重点围绕你这条路线是否成立：**用“走廊/区域级生成”做 coarse plan，再用 deterministic（learned cost + shortest path/K-shortest）细化**。

---

## 0. 主线先定：我们到底在验证哪条路线？

你现在要验证的不是“能不能生成路径”，而是：

1. **能不能把生成目标从 segment 序列上移到 corridor/region/plan**（coarse），
2. 再用 **learned cost + shortest path / K-shortest** 把 coarse plan 细化成可走的 network path（fine），
3. 同时保证 **多样性（多条候选）** 与 **可控性（condition on corridor_type）**。

在这条主线下，GTG（AAAI 2025）之所以关键，是它几乎就是“**learned cost + shortest path**”范式的一个代表：**先学 cost/偏好，再用图搜索生成轨迹**。因此必须把它的训练细节彻底确认清楚。

---

## 1) GTG（AAAI 2025）训练细节：cost learning 与 preference learning 到底是什么？

### 1.1 Cost learning：不是 IRL，也不是纯对比学习；是“监督回归 + 排序约束”

GTG 的 travel cost prediction 是一个监督学习模块，loss 明确写成：
**L = L_mse + L_rank**。其中 MSE 用于预测 travel cost，rank loss 用于让“成本排序”更合理（引用 Burges 2005 的 pairwise ranking 思路）。([arXiv][1])

对你提出的备选项逐一对齐：

* Contrastive？——**不是**（它没有做典型的正负样本对比表征学习框架）。([arXiv][1])
* Max-margin / structured SVM？——**不直接是**（rank loss 有点像 pairwise margin-ish 的排序，但不是你常说的 structured max-margin 那套推导）。([arXiv][1])
* MaxEnt IRL？——**不在 cost learning 这一步**（MaxEnt 的推导出现在 preference learning 的附录部分）。([arXiv][1])

**Partner需要确认的细节（建议精读 eq.31/32 附近 + 实现/超参）：**

* L_rank 到底用的是什么 pair（同 OD 的不同 path？还是不同 OD？）以及 label y_ij 的构造方式。([arXiv][1])
* cost 监督信号是什么粒度（edge/segment 累加成 path cost？还是直接 path-level label）。([arXiv][1])
* cost model 训练好后，在 preference learning 时是否冻结/联合训练（会影响你们是否可复用 cost encoder 做条件化）。([arXiv][1])

---

### 1.2 Preference learning：核心是“MaxEnt IRL 思路 + shortest-path 近似采样”的偏好更新

GTG 的 “Preference Learning” 在主文里给的是一个非常工程化的 **preference update algorithm**：

1. 初始化参数
2. 在当前偏好参数下，**对每条真实轨迹的 OD 求 shortest path**
3. 计算 shortest path 的偏好和、真实轨迹的偏好和
4. 构造 loss（文中 eq.33），更新参数，重复迭代 ([arXiv][1])

在附录里他们把这个过程和 **Maximum Entropy IRL** 对齐：把 preference 看成 reward（或负 cost），目标是最大化 demonstration 的对数似然；梯度近似为 **demo 与“采样轨迹”的 reward 差**，并用“**shortest path 轨迹**”作为 Monte Carlo sample 的近似。([arXiv][1])

所以回答你/partner的问题：

* preference learning 更像 **MaxEnt IRL 的一种近似实现**，但采样被简化成“在当前参数下求一条 shortest path”。([arXiv][1])
* 这和 AIRL 那种“learn discriminator + policy rollout”的 preference learning 不同，它是“**规划器内环**（shortest path）+ 参数外环更新”。([arXiv][1])

**Partner需要确认的关键点（非常影响你们能否做 corridor_type conditioned）：**

* eq.(33)/(39) 的 loss 具体形式：是简单差值、hinge、还是 log-sum-exp 风格？（决定它更像 max-margin 还是 maxent）。([arXiv][1])
* “preference value” 是线性组合特征还是神经网络输出？输入特征是否包含可用于 corridor_type 的上下文。([arXiv][1])
* shortest path 求解用的是 one-to-one 还是 one-to-all；是否做 path constraints（simple path/loopless）——这影响可扩展性与生成质量。([arXiv][1])

---

### 1.3 能否扩展到 conditioned on corridor_type？

从算法形式上看，“条件化”最自然的做法是：把 corridor_type 当作上下文变量，进入 preference/reward 模型（例如 reward = f(edge_features, corridor_type)），或进入 cost 的参数化（hypernetwork / conditional embedding）。这并不违背 GTG 的“外环更新 + 内环 shortest path”结构。

更重要的是：**路选领域已经有“context-dependent reward”的 deep IRL**。例如 Zhao & Liang 的 work 明确提出了“context-dependent rewards”的 deep IRL route choice 框架，并且采用 adversarial IRL 来避免昂贵的 value iteration。

这给你一个很明确的对照：

* GTG：MaxEnt IRL spirit，但 sample≈shortest-path；更工程、易扩展
* Zhao&Liang：更标准的 deep IRL（AIRL-ish），天然支持 context conditioning（他们就做了 context-dependent reward）

---

## 2) “K-shortest paths + learned cost”与多样性生成：有没有现成套路？计算开销多大？

### 2.1 计算开销：Yen 的复杂度与工程痛点

交通/路网里最常被引用的结论之一：Yen(1971) 的 KSP 需要反复做最短路搜索，因此在大图上开销很大。Chen 等（Transportation Research Part E, 2020）在综述/算法论文里非常直白地给出：

* Yen 原始算法对每条已确定路径，需要 **O(|N|)** 次 one-to-all shortest path 来算 deviation paths；
* 若 Dijkstra 用 Fibonacci heap，一次 one-to-all 的 worst-case 是 **O(|A| + |N|log|N|)**；
* 因此 Yen 的 worst-case complexity 是
  **O(k |N| (|A| + |N| log |N|))**，并指出这是 road network 上找 k shortest simple paths 的 best worst-case bound。

他们还提到改进版 Yen（用 one-to-one Dijkstra）工程上更快，但 **worst-case 复杂度不变**。

> 对你们来说，这意味着：如果你想用 K-shortest 做多样性生成，必须提前评估 OD 数量、k 的大小、以及是否需要 loopless/simple path 限制，否则计算会炸。

---

### 2.2 另一个重要基线：Eppstein 的 k-shortest（允许环）非常快，但问题设定不同

Eppstein 的经典结果：在允许 cycles 的 k shortest paths 设定下，可以做到 **O(m + n log n + k)**（pair-wise），并且能做到常数时间/条输出（在其隐式结构上）。

这对你们的启发是：

* 如果你们的生成允许重复边/点（多数轨迹生成不允许），Eppstein 很香。
* 但真实出行路径通常要“合理”（loopless / near-simple），所以你们更多会落回 Yen / deviation-based family。

---

### 2.3 “用 K-shortest 当替代路线生成”为什么常常不够？（关键负面证据）

Abraham et al.（关于替代路线的经典论文）明确指出：
用 k-shortest path algorithms（他们举 Eppstein 1994）做 alternative routes 的自然想法在 road network 上**不实用**，因为“合理的替代路线可能根本不在前几千条最短路里”。

这句话的意义很大：

> 你想用 “k-shortest + learned cost” 来做多样性生成，必须考虑 **diversification / admissibility**，否则得到的路径会“要么太像、要么太不合理”。

---

### 2.4 有“neural cost + K-shortest 做多样性”的现成范式吗？——PathRank 给了一个很直接的可复用套路

PathRank（2019）虽然不是“直接学 edge cost 然后 K-shortest 输出轨迹”，但它的“候选路径生成”模块几乎就是你们要的 blueprint：

**Diversified top-k shortest paths：**

* 先放入最短路 P1
* 依次枚举“下一条最短路” Pi
* 若 Pi 与当前集合内每条路径的相似度都 < 阈值 δ，则加入
* 直到满 k 或无更多路径 

更贴近你问的“多样性生成 via learned cost”的点在于：
PathRank 还提出 **multi-cost + diversified top-k**：对不同 cost（距离/时间/油耗等）分别跑 diversified top-k，然后取并集作为最终候选集。

你可以把它直接迁移到“learned cost”场景：

* 把“距离/时间/油耗”换成你训练出来的多个 cost heads，或同一 cost 的不同 temperature/perturbation
* 然后 union → 多样性候选集
* 再用 downstream（比如 corridor_type 条件、偏好模型）做 rerank/selection

这就是你在问的“multi-path generation via learned cost”的一个**工程可落地**版本。

---

### 2.5 如果你想要“更像导航产品”的替代路线：学术界有专门的 Alternative Route Computation 路线

* Abraham et al. 的论文本身就在定义“什么叫合理 alternative route”：不仅要不太长（stretch），还要 **局部最优（local optimality）** 等性质，并提供可计算的检验与算法框架。
* Zhai et al. (AISTATS 2024) 明确把 “alternative route computation”当成问题背景，并指出像 “uniformly bounded stretch” 这类约束在传统算法里很贵，提出用 deep learning 做替代路线计算。

这条线的意义是：它比“纯 k-shortest”更贴近你要的“走廊级别/用户可接受的多路线候选”。

---

## 3) “multi-path generation via learned cost”的另一条路：cost perturbation（Perturb-and-MAP / Gumbel trick）

如果你希望多样性不是靠 k-shortest 枚举，而是“采样式”的：

* Perturb-and-MAP 的核心思想：对能量/代价函数加随机扰动（常见是 Gumbel），然后做 MAP（这里就是 shortest path）来得到一个样本；重复即可得到多样样本。([TTIC Home][2])
* 这类思路在“结构化预测”里也有系统化总结，比如 “perturbed structured predictors”。([arXiv][3])

对你们的落地意义：

* 把路径能量定义成 **sum learned edge cost**
* 每次对 edge cost 加噪声（或对 cost head 加噪声）
* 跑一次 shortest path → 一条样本路径
* 多次采样 → 一组多样路径
* 如果你还要“走廊约束”，可以在图层面（屏蔽边）或 cost 层面（对走廊外边加大 penalty）实现条件化。

这套通常比 K-shortest 更容易做“软多样性”，且更适合你提到的“用不同 cost perturbation 生成多条路径”。

---

## 4) Deep IRL / Reward Learning 在 trajectory / route choice 的最新工作：和 GTG 有何异同？

你问的“Deep IRL用于 route choice 的最新工作”，我这次检索到的代表性（2020–2025）包括：

### 4.1 Link-based route choice 的 deep IRL（context-dependent reward）

Zhao & Liang 提出 deep IRL route choice 框架，强调：

* 用 IRL 适合 route choice（像动态 DCM），
* 他们做的是 **link-based、context-dependent reward**，
* 并且通过 **adversarial IRL** 来避免 value iteration，
* 在 taxi GPS 数据上验证泛化（包括未见过 destination）。

这和你想做的“conditioned on corridor_type”在形式上高度一致（context 进 reward）。

### 4.2 “把 Dijkstra/最短路内嵌进 deep IRL”的路线（非常像 GTG 的结构）

Liu et al. (2020, TR-E) 明确提出：在 food delivery route planning 的 deep IRL 里，用 **Dijkstra** 来确定当前 policy 并在每次迭代计算梯度，从而更好学习偏好。

这类 work 是 GTG “shortest path in the loop” 的强对照组：

* 都是 reward/cost learning + 图搜索
* 都强调效率与可扩展

### 4.3 Maximum-Entropy Deep IRL 的变体（含个体协变量）

例如 2024 TITS 的 MEDIRL-IC（pedestrian route choice）：明确走 Maximum-Entropy Deep IRL，并引入 individual covariates。

---

### 4.4 GTG vs 这些 deep IRL 的关键异同（给你后续选型）

**相同点：**

* 都把“轨迹偏好”建模为 reward/cost，并从示例轨迹反推。([arXiv][1])

**不同点：**

* GTG：MaxEnt IRL 推导，但采样近似为“每个 OD 一条 shortest path”，更像**确定性规划 + 外环更新**，工程上轻。([arXiv][1])
* AIRL 类（如 Zhao&Liang）：通常需要策略/判别器训练与 rollout（但他们强调“无需 value iteration”）。更像标准 imitation/IRL pipeline，条件化更天然。

---

## 5) Partner 需要“确认/精读/复现对齐”的清单（按优先级）

### P0（必须本周内确认，否则路线判断会漂）

1. **GTG cost learning**

   * L_rank 具体怎么构造 pair 与标签？
   * cost 监督信号来源/粒度？
   * cost 是否在 preference learning 时冻结？([arXiv][1])

2. **GTG preference learning**

   * eq.(33)/(39) 的 loss 具体形式（差值/hinge/log-likelihood）
   * shortest path 求解细节（one-to-one? loopless?）
   * “preference value” 的输入特征：是否能加入 corridor_type 做条件化？([arXiv][1])

### P1（决定我们做多样性生成用 K-shortest 还是别的）

3. **K-shortest 的计算预算评估**

   * 在你们目标图规模下，用 Yen 的复杂度 O(k|N|(|A|+|N|log|N|)) 做一个数量级估算。
   * 如果要 loopless/simple，是否需要 deviation-based（Yen-family）或更快实现（re-optimization）。

4. **“learned cost + K-shortest 做多样性”的可落地方案**

   * 直接复用 PathRank 的 diversified top-k + 相似度阈值 δ；
   * 并用 multi-cost union 的方式做多样性（你们可以把 multi-cost 替换成 multi-head learned cost 或 cost perturbation）。

### P2（为 corridor-level generation 做铺垫：替代路线质量与用户合理性）

5. **Alternative route computation 的质量标准**

   * 读 Abraham et al. 对“reasonable alternatives”的约束（stretch + local optimality 等），确认哪些约束你们需要，哪些可以软化成 loss/penalty。
   * 读 Zhai et al. 看看 deep learning 是怎么在 alternative route computation 场景里发挥作用的。

### P3（条件化与 preference learning 的“更强对照组”）

6. **Deep IRL route choice（context-dependent reward）的对照复现价值**

   * Zhao & Liang（context-dependent reward + adversarial IRL）是否能直接改成 conditioned on corridor_type？（形式上可行）
   * Liu et al. (2020) 这种“Dijkstra in deep IRL loop”能否作为你们实现的工程模板？

---

## 6) 一句话建议：你们下一步怎么选“多样性生成”的默认基线？

如果你们想要**最快落地且可控**：

* 默认基线：**diversified top-k shortest paths（PathRank 的 δ 过滤）+ multi-run union**

  * 多样性可控（δ、k、multi-run 次数）
  * 计算可控（k 小、多跑几次）

如果你们想要更“采样式”的多样性（更像 diffusion 的多样输出）：

* **Perturb-and-MAP（对 learned cost 加噪声 + shortest path）**

  * 每次一条 shortest path，天然并行
  * 多样性由噪声尺度/温度控制([TTIC Home][2])

同时，别忽略 Abraham et al. 对“k-shortest 不实用”的提醒：如果你们的目标是“看起来合理的替代路线/走廊”，要把“合理性约束”显式纳入候选生成或过滤。

---

如果你愿意，我可以把上面 P0–P3 清单进一步拆成“**精读定位表**”（每篇论文要看哪些章节/公式/实验设置、要抄哪些超参、要复现实验哪一小块），方便你直接分派给 partner。

[1]: https://arxiv.org/html/2502.01107v1 "GTG: Generalizable Trajectory Generation Model for Urban Mobility"
[2]: https://home.ttic.edu/~gpapan/research/perturb_and_map/?utm_source=chatgpt.com "Perturb-and-MAP Random Fields - George Papandreou"
[3]: https://arxiv.org/pdf/2111.02458?utm_source=chatgpt.com "Sampling and learning in discrete energy-based models"


下面按“我们要不要继续走 **segment-level** 这条主线，还是改成 **corridor/region-level coarse plan → deterministic细化**”来梳理最新文献需求，并把你提到的 Q1–Q3（以及 partner 需要确认的点）落到**可操作的检索与核对清单**上。

---

## 一句话总览（先把主线结论钉住）

1. **Cardiff 的 segment 明确是“路段/road segment（原生路网边）”，不是 raster edge。**它把“road segment 序列”先编码到 **固定长度 latent（32 tokens）**，在 latent 上做扩散，再通过“解压 + 自回归解码（beam search）”还原为变长 segment 序列。([arXiv][1])
2. **GTG 的核心是：learned cost（含 hidden cost）→ learned preference 权重 → 一条 shortest path（确定性）**。它的 cost learning 主要是 **MSE + Rank loss**；preference learning 是一种**用“真实轨迹 vs 当前 shortest path”做对比更新**的无监督学习，并明确说“类似 MaxEnt IRL”。([arXiv][2])
3. **要让 GTG 类方法“多样性生成（multi-path）”，必须引入随机性或多解机制**：最直接是 **K-shortest / diverse near-shortest**，或 **cost perturbation（噪声扰动）+ repeated shortest path**，或 **先生成 via-node/waypoint/corridor 再拼 shortest path**。相关算法与路线多样性文献是成熟的。
4. **序列长度上：GTG 和 Diff-RNTraj 在公开统计里都偏“几十步”量级**；Cardiff 没给 segment 序列平均长度分布，但它用 latent=32 解决扩散阶段长度问题，解码仍随真实长度线性增长。([arXiv][2])
5. **OSM/路网粒度：Cardiff、Diff-RNTraj 都明确用 OpenStreetMap 路网（边/路段 + 节点/路口），并基于 map-matching 得到路段序列。**([arXiv][3])

---

## Q1：GTG 类方法如何处理 diversity（从“1条 shortest path”变成“多条”）

你说得非常准确：**原版 GTG 是 deterministic**（一个 cost field → 一条 shortest path）。
要多样性生成，改造基本有 4 条路线，从“工程可落地”到“研究型扩展”排列：

### 路线 A：直接做 Top-K shortest paths（最省改造）

**做法**：保持 learned cost / preference 不变，把推理从 shortest path 改成 **K shortest loopless paths**（如 Yen 1971）。

**开销直觉**：Yen 需要反复调用最短路子程序（常用 Dijkstra），经典复杂度常写成

* 近似：(O(k , n , (m + n \log n)))（实现/图结构不同略有差异）。

**问题**：纯 k-shortest 往往“很像”（同质化严重），在路网替代路线里是老问题。Zhai 2024 的替代路线综述里也明确提到 k-shortest 在 road network 上容易产出高度相似的路线。

> 适用场景：你们先需要一个“能跑起来的 multi-path baseline”，不追求强多样性指标。

---

### 路线 B：做“多样性约束”的 near-shortest / limited-overlap（更像你们要的“走廊多样性”）

如果目标是“**多条路要像不同 corridor**”，建议直接检索 **diverse near-shortest paths / limited overlap alternative routing**。

代表性文献与方向：

* **Most Diverse Near-Shortest Paths (SIGSPATIAL 2021)**：把“接近最短”与“路径多样性”作为核心目标之一。
* **Alternative routing: k-shortest paths with limited overlap (2015)**：显式控制 overlap（重叠度），更贴近“走廊级别差异”。
* **Deep Learning-Based Alternative Route Computation (PMLR 2024)**：从“替代路线生成”角度系统回顾了 k-shortest、penalty method、via-node 等路线，并提出深度模型预测 via-node 来生成多条高质量替代路线（这非常像“先粗后细”的 corridor/waypoint 思路）。

> 适用场景：你们想要“多条路线真不同”，而不是 beam search 出来的 minor variations。

---

### 路线 C：cost perturbation（把 deterministic shortest path 变成可采样分布）

**核心想法**：不改 planner（仍 shortest path），改“成本场”——每次采样一个 slightly different cost，然后跑 shortest path。
最常见的两类扰动：

1. **加性噪声（Gaussian / Laplace）**：
   (\tilde c_e = c_e + \sigma \epsilon_e)。
   工程上最容易，但“采样分布”未必有明确概率解释。

2. **Gumbel perturbation（Perturb-and-MAP / Gumbel-Max 思路）**：
   在离散结构上，Gumbel-Max trick 的核心是：对每个候选结构的能量加 Gumbel 噪声后取 argmax，可以得到 Gibbs 分布样本。A* Sampling 论文对这种“Gumbel-Max 在结构空间采样”的理论脉络讲得很清楚。
   如果你把“路径能量”设为 (-\sum_e c_e)，那么“加噪再最短路”可以视为一种结构化采样近似。

此外，**Perturbed optimizers 可微化**（如果你们想端到端学到能产生多样性的 cost），Berthet et al. 2020 给了把离散优化器（含 shortest path）做成“随机扰动后取期望”的通用框架。

> 适用场景：你们希望“多样性来自用户偏好/随机性”，而不是算法硬凑；也方便做“同 OD 多条 plausible routes”。

---

### 路线 D：引入“coarse corridor / via-node / waypoint”作为显式多样性因子（最贴合你们 corridor 设想）

这条路线最像你最初的目标：“不是生成 segment 序列，而是生成 corridor 类型/region sequence，再 deterministic 细化”。

对应到路网里，一个最典型的实现是 **via-node / waypoint**：

* 先生成一个中间节点（或一串中间节点/区域），再拼接 shortest paths。
  Zhai 2024 的方法就是 **学习预测 via-node**，然后用 via-path（经由该点的最短路）来形成替代路线集合。

> 适用场景：你们要把“多样性”定义在走廊/区域层面，而不是边级别。

---

## Partner 要确认：GTG 的训练细节到底是什么（你列的点我逐条对齐）

### 1) cost learning 用什么 loss？

GTG 文中写得很明确：**prediction loss = MSE loss + Rank loss（pairwise ranking，用 BCE）**。
所以它不是经典 contrastive / max-margin / MaxEnt IRL 那类“整条轨迹的 reward 学习”，而是先把“路段 travel cost（time/speed）”当监督信号学出来，再做 preference learning。

**Partner需要做的核对**：

* Rank loss 的采样方式：pair 如何构造（同时间片？同城市？跨城市？）——论文里给了公式，但实现细节要看代码。

### 2) preference learning 的具体算法是什么？

GTG 的 preference learning 在文中描述为：

* 用 observable + hidden cost 组成 preference，并有 learnable weights。
* 训练时：随机初始化参数 → 对每条 OD 跑 shortest path 得到 (\hat p) → 与真实轨迹 p 做对比，loss 用“两者 preference sum 的差异”来驱动更新。
* 文中还明确说：**给每条 road segment 分配 cost 类似 MaxEnt IRL**，并说理论推导在代码仓库。([arXiv][2])

这更像：**MaxEnt IRL 的 feature expectation difference** 的一个“单样本（shortest path）近似”，或者说“expert path vs model path”的对比学习。

**Partner需要做的核对**：

* (33) 的 loss 具体形式（有没有 hinge / exp / normalization）以及梯度怎么实现；论文说“理论在代码”，所以必须看代码/附录推导。([arXiv][2])
* 训练时 shortest path 用什么算法（Dijkstra/A*）以及是否有额外约束（最大长度、避免回环、时间片等）。

### 3) 能否扩展到 conditioned on corridor_type？

论文本身没做 corridor_type，但从建模上是可扩展的：把 corridor_type 作为 preference 网络/权重的条件输入即可（类似“context-dependent reward”）。一个非常直接的对照是 **route choice 的 deep IRL/AIRL 工作**，它把 reward 和 policy 都做成 context-dependent，并通过 AIRL 学习路段级 reward。

**Partner需要做的核对**：

* GTG 的 hidden cost 网络输入目前是什么（只用 semantic latent？能否加 corridor embedding？）。

---

## Q2：其他方法的序列长度与粒度（Cardiff 32 latent ↔ 物理长度？Diff-RNTraj 的 graph 粒度？）

### 2.1 Cardiff：latent token=32 是“扩散输入长度”，不是 segment 序列长度

Cardiff 在实现细节里给了：**segment-level input length = 32**（用于 latent diffusion / denoiser）。([arXiv][3])

关键是：它先把 **变长 segment 序列** 编码成 **固定长度 latent**，扩散发生在 latent 上；随后再通过“解压 + 自回归解码（beam search）”恢复成完整变长 segment 序列。([arXiv][3])

**所以：32 对应的“物理 segment 长度”在论文里并没有直接给。**（32 是 latent slot 数，不是 32 个 road segments。）

> 你真正需要的“压缩比” =（原始 segment 序列平均长度 L）/ 32。论文没有给 L 的统计分布，只给了数据集规模（轨迹数、路段数等）。([arXiv][3])

**Partner建议做的实证统计**（最重要、最能决定你们要不要走 segment 路线）：

* 在 Cardiff 的数据预处理输出里统计：segment 序列长度分布（mean/median/p95/max），然后算 L/32。
* 同时统计“每步 segment 的平均物理长度（m）”与“每条轨迹的总长度（km）”。

---

### 2.2 Diff-RNTraj：粒度是“road segment + moving ratio”（比纯 segment id 更细）

Diff-RNTraj 定义 road network：节点是路口、边是 road segments，且每条 segment 有长度（米）。([arXiv][4])
它的 RNTraj 表示每个轨迹点为 (\langle \text{road segment}, \text{moving ratio}\rangle)，即在 segment 上的连续位置比例。([arXiv][4])

**序列长度（公开统计）**：在它的实验数据里，mean trajectory length 大约：

* Porto：41.50
* Chengdu：29.81 ([arXiv][4])

这说明至少在它公开的设置下，序列长度并非 100+ 的超长序列。

---

### 2.3 给你一个“量纲感”：GTG 的 segment-hop 规模大概也是几十内

GTG 的数据集统计里给了 **average hops**（路段步数）与 **average travel distance**。([arXiv][2])
用表里的数字粗算“每 hop 的平均距离”：

* 北京：4.10 km / 24 hops ≈ 171 m/hop
* 西安：2.38 km / 13.4 hops ≈ 178 m/hop
* 成都：2.14 km / 14.4 hops ≈ 149 m/hop ([arXiv][2])

这给了你一个非常实用的直觉：在 GTG 这种 segment 表示里，**一个 segment/hop 的量级大致是 150–180m（沿轨迹的平均步长）**。这不是“全网平均 segment 长度”，但对估算“序列长度 ↔ 物理尺度”很有帮助。

---

## Q3：Map-matching 后的 OSM 图是什么样的？Cardiff/GTG 用原生 OSM 边还是 raster edge？平均 segment 长度？

### 3.1 Cardiff：明确用 OpenStreetMap，且是原生路网节点/边

Cardiff 数据预处理写得很清楚：

* road network 信息来自 **OpenStreetMap**，包含 nodes 与 edges（路口点与路段边），并使用 road type、road length、directionality 等属性。([arXiv][3])
* 其 road network 表示为 (G=(V,E))，但 **V 表示 road segments（路段）**，E 表示 road segments 的转移关系（相邻可达）。([arXiv][1])
* 它还用邻接矩阵做 **spatial validity loss** 来鼓励相邻 segment 必须在路网里连通。([arXiv][3])

这套描述完全对应“原生路网图/OSM 边”，而不是 rasterized edge。

### 3.2 Diff-RNTraj：明确用 OSMnx 下载 OSM 路网 + map-matching

Diff-RNTraj 的数据流程明确写：

* 用 **OSMnx 从 OpenStreetMap 下载路网**；
* 对 GPS 轨迹做清洗后，**用 map-matching 算法把 GPS 点投到路网**，得到 road-segment 序列（ground truth）。([arXiv][4])

### 3.3 GTG：文中是“road segment graph”，是否来自 OSM 需要 partner 看代码/数据说明确认

从你给我的已读部分，GTG 明确是在 **road segment 层**做建模（有 segment length/type/direction 等特征、图邻接、以及 cost/time/speed）。
但“是否直接使用 OSM”在我当前抓到的段落里没有 Cardiff/Diff-RNTraj 那样一句话写死（因此我不建议在组内结论里直接写“GTG=OSM”，除非你们在代码或数据说明里确认）。

**Partner要确认的点**：

* GTG 的 road segments 来源（OSM？高德/百度？Didi 内置路网？）
* segment 的切分规则（OSM way 被切成 edge 还是保留整条 way？有没有 simplify / merge / split？）

### 3.4 平均 segment 长度：Cardiff/GTG 论文一般不直接给，需要你们自己算

* Cardiff：论文没给“平均 segment length（米）”统计，只给了路段数量等。([arXiv][3])
* GTG：你可以像上面那样用“平均距离/平均 hops”估一个“沿轨迹平均步长”，约 150–180m。([arXiv][2])
* 如果你想找“明确报告平均 link length”的文献作为量纲参考：route choice 的 deep IRL/AIRL 工作里提到他们选取的上海路网 **平均 link length = 199.9m**。

---

## Partner 需要确认的文献问题清单（按优先级给到“可交付物”）

下面每条我都写成“你让 partner 回来给什么结论/数字”，避免泛泛阅读。

### P0（必须给出确定结论，否则我们无法决策 segment 路线）

1. **Cardiff 的 segment 序列长度分布**：mean/median/p95/max（按数据集分别给）。
   → 输出：L 的分布 + 压缩比 L/32（平均与 p95）。
   （论文只明确 latent=32 与编码/解码机制，没给 L 分布。）([arXiv][3])

2. **GTG 的 preference learning：Equation (33) 的真实实现**
   → 输出：loss 形式、负样本如何构造、是否加正则、学习率/迭代策略、是否对每条轨迹都跑一次 shortest path。([arXiv][2])

3. **GTG 路网来源与 segment 切分规则**（OSM? 还是别的 map provider）
   → 输出：路网来源 + segment 的定义（edge between intersections? split rule? average segment length）。

### P1（决定我们怎么做 diversity / corridor-level）

4. **“learned cost + K-shortest”是否有成熟范式**
   → 输出：至少 2–3 篇“learned cost（或 learned reward）+ alternative route generation”的相关工作（不一定是 trajectory generation，也可以是 route recommendation / alternative routing）。
   可从替代路线领域切入：Zhai 2024（via-node）、Häcker 2021（diverse near-shortest）、Chondrogiannis 2015（limited overlap）。

5. **Yen / Eppstein 等 K-shortest 的工程开销结论**（在你们图规模上是否可用）
   → 输出：你们的图规模（|V|,|E|）下，k=10/50 的平均耗时估计，外加“是否需要 loopless”。
   算法依据：Yen 1971；Eppstein k-shortest 复杂度与实现差异。

6. **IRL/Reward Learning 在 route choice 上最新一档方法能否借鉴到 GTG**
   → 输出：对照表：GTG preference learning vs AIRL route choice（是否需要 value iteration、是否能做 context-dependent/corridor-conditioned reward）。
   参考：Zhao & Liang 的 context-dependent AIRL route choice。

### P2（补全 diffusion 处理离散/连通性的证据链）

7. **GDP（ICLR 2024）到底在哪个空间扩散？**
   → 输出：它是 categorical（token/one-hot）扩散，且通过图结构转移矩阵把连通性编码进去——这对你们回答“离散序列扩散怎么做”很关键。

8. **Cardiff 的 validity loss + beam search 是否真的显著提升连通性**
   → 输出：论文/消融里有没有报告 topology validity 指标，或者代码里如何实现 beam search 约束。([arXiv][3])

---

## 你们当前三问（Q1–Q3）的“直接可用结论”

### Q1（diversity）：GTG 本体不做多样性，但改造路径很明确

* 轻改造：Yen K-shortest（能给 K 条，但可能相似）。
* 中改造：limited overlap / diverse near-shortest（更贴 corridor diversity）。
* 强改造：cost perturbation + repeated shortest path（把 deterministic planner 变成可采样生成器）。
* corridor 方向：via-node/waypoint 先生成再拼 shortest path（Zhai 2024 就是“学习 via-node → via-path”）。

### Q2（序列长度）：公开统计显示“几十步”更常见；Cardiff 用 latent=32 兜底扩散阶段

* GTG：平均 hops 13–24；平均距离 2–4 km；可粗估沿轨迹每 hop 约 150–180m。([arXiv][2])
* Diff-RNTraj：mean length 约 30–40（但每步是 segment+ratio）。([arXiv][4])
* Cardiff：扩散的 latent 长度固定 32，但真实 segment 序列长度 L 需要你们统计。([arXiv][3])

### Q3（OSM 图形态）：Cardiff/Diff-RNTraj 明确是原生 OSM 路网（节点/边），不是 raster

* Cardiff：OSM nodes+edges+属性；segment 定义为 road segments（并在 loss 里用邻接矩阵约束连通）。([arXiv][3])
* Diff-RNTraj：OSMnx 下载 OSM 路网 + map-matching 投到路网。([arXiv][4])
* 平均 segment length：论文通常不报，需要你们自己基于 OSM edge length 统计；可参考一篇 route choice IRL 工作里报告的平均 link length 约 200m 作为量纲。([arXiv][2])

---

如果你愿意，我可以把上面的 Partner 清单进一步整理成一个“**一页任务卡**”（每条含：要看论文哪一节/哪张表、要从代码里抓哪些变量、要输出什么数字），方便直接发给对方分工执行。

[1]: https://arxiv.org/pdf/2507.13366 "Leveraging the Spatial Hierarchy: Coarse-to-fine Trajectory Generation via Cascaded Hybrid Diffusion"
[2]: https://arxiv.org/html/2502.01107v1 "GTG: Generalizable Trajectory Generation Model for Urban Mobility"
[3]: https://arxiv.org/html/2507.13366v1 "Leveraging the Spatial Hierarchy: Coarse-to-fine Trajectory Generation via Cascaded Hybrid Diffusion"
[4]: https://arxiv.org/html/2402.07369v1 "Diff-RNTraj: A Structure-aware Diffusion Model for Road Network-constrained Trajectory Generation"
