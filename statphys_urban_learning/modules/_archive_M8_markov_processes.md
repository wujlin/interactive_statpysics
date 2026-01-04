# M8 马尔可夫过程与主方程（时间的演化）

> **核心目标**：不管是 M2 的孤立系统还是 M3 的正则系综，我们得到的都是**静态**（Static）的概率分布。物理学和城市科学的灵魂在于**演化**（Dynamics）。M8 要回答：如果不平衡，系统随时间 \(t\) 如何演化？核心方程是 **Master Equation（主方程）**。

## 推荐学习顺序
1. 通读本文，把重点放在理解“概率流”的概念上。
2. 学习 Gillespie 算法（Part 3），这是模拟任何随机跳跃过程（包括排队、传染病）的标准范式。
3. 思考：详细平衡（Detailed Balance）和“稳态（Steady State）”有什么区别？

---

## Introduction（科学史/核心矛盾）

热力学势 \(F\) 告诉我们系统“最终”想去哪里（Free energy minimum），但它没告诉我们“怎么去”以及“要去多久”。
Boltzmann (1872) 的 H 定理试图从动力学推导热力学，但他遇到了巨大的阻力（可逆性悖论）。
Kolmogorov 和 Gillespie 等人发展了一套基于**概率转移**的语言：既然微观细节不可知，不如直接描述系统在状态间跳跃的**速率（Rate）**。
这套语言的核心是 **Markov 性质**：未来只取决于现在，与过去无关。
这对于城市建模极其重要：我们不需要知道一个移民过去 10 年的历史，只要知道他现在的状态和当下的转移概率，就能模拟全城人口的流动演化。

## References（Seminal papers，SSOT）
- **Kolmogorov 1931**: Master Equation foundation. (SP-M8-Kolmogorov1931)
- **Gillespie 1976**: Stochastic Simulation Algorithm. (SP-M8-Gillespie1976)

---

## Part 1：主方程——会计学的胜利

**主方程（Master Equation）** 听起来很霸气，其实它只是一个简单的“会计恒等式”：
\[ \frac{dP_i(t)}{dt} = \sum_{j \neq i} (\text{Gain}_{j \to i} - \text{Loss}_{i \to j}) \]
\[ \frac{dP_i}{dt} = \sum_{j} [W_{ji} P_j(t) - W_{ij} P_i(t)] \]
- \(P_i(t)\)：时刻 \(t\) 系统处于状态 \(i\) 的概率。
- \(W_{ij}\)：从 \(i\) 跳到 \(j\) 的转移速率（probability per unit time）。

这就是所谓的 **Gain - Loss** 过程。
它比 Schrödinger 方程或 Newton 方程好懂得多：就是**流入减流出**。

> 👉 **深入理解**：
> - [[主方程 Master equation]]：推导与写法的规范。

---

## Part 2：细致平衡——静止的流

系统最终会演化到一个不随时间变化的分布 \(\frac{dP_i}{dt}=0\)，称为**稳态（Steady State）**。
有两种方式达到稳态：
1. **环流平衡**：\(A \to B \to C \to A\) 的流量相等，这叫非平衡稳态（NES）。
2. **细致平衡（Detailed Balance）**：任意两点 \(i, j\) 之间的净流量为零。
   \[ W_{ji} P_j^{eq} = W_{ij} P_i^{eq} \]
   这意味着连微观层面的“净流”都没有了。

热力学平衡态必须满足**细致平衡**。这也是设计 MCMC 算法（M3）的核心约束：为了采样特定的 \(P^{eq}\)，我们必须构造满足该方程的转移规则 \(W\)。

> 👉 [[细致平衡与稳态]]：两者的关键区别。

---

## Part 3：Gillespie 算法——从方程到电影

有了主方程，怎么解？
- 解析解：很难（除非只有几个状态）。
- 矩阵指数：状态多时太慢。
- **Gillespie 模拟**：这是神技。
  1. 计算所有可能的跳跃总速率 \(R_{total} = \sum W\)。
  2. 抽一个随机数决定**下一次跳跃发生在多久以后**：\(\Delta t \sim \text{Exp}(R_{total})\)。
  3. 抽第二个随机数决定**具体发生哪个跳跃**（按 \(W\) 比例）。
  4. 更新时间与状态，重复。

它没有时间离散化误差，生成的轨迹是**精确**符合主方程的。

> 👉 [[Gillespie 算法]]：步骤详解。

---

## Part 4：城市映射——人口迁移与传染病

几乎所有动态城市模型都是主方程的变体：
- **人口迁移**：状态 \(i\) 是城市人口向量。转移 \(W_{ij}\) 是某人从 A 城搬到 B 城的概率。
- **SIR 传染病模型**：\(S \to I\) 是一次化学反应（State jump）。Gillespie 模拟可以直接生成随机的疫情爆发曲线。
- **房地产交易**：买家（Buyer）和卖家（Seller）匹配成交，这是一个随机过程。

| 统计物理 | 城市动力学 |
| :--- | :--- |
| **状态 $i$** | 城市里的人口/财富分布 |
| **转移速率 $W_{ij}$** | 迁移率 / 感染率 / 交易率 |
| **Master Equation** | 种群动力学方程 |
| **Detailed Balance** | 理想的双向对等流动（无人口黑洞） |

> 👉 [[主方程在城市人口流动中的应用]]

---

## Projects (实战演练)
- **P03**: [[p03_markov_migration/README]] (区际迁移 Markov)
  - *对应概念*: 稳态分布、细致平衡破缺。
- **P04**: [[p04_diffusion_network/README]] (网络扩散)
  - *对应概念*: 随机游走、扩散方程。

---

## Part 5：动手时刻 (Checklist)

### 必读
- [ ] **Reading Guide**: [[Swendsen_Ch18_Dynamics]] (Chapter 18: 18.1-18.2)
  > 点击查看主方程与细致平衡条件。
- [ ] **Seminal Paper**: Gillespie 1976（只需要看他如何推导 $\Delta t$ 的分布）。

### 习题
- [ ] **Written**: `exercises/written/M8_markov_basics.md`
  - 证明：如果 $W_{ij}$ 满足细致平衡条件 $W_{ji}e^{-\beta E_j} = W_{ij}e^{-\beta E_i}$，那么 $P_i \propto e^{-\beta E_i}$ 是主方程的稳态解。这是 MCMC 的理论基础。
- [ ] **Notebook**: `exercises/notebooks/E08_gillespie_sir.ipynb`
  - 写一个简单的 SIR 传染病模拟：不要用微分方程，用 Gillespie 算法。看看在人数很少时，随机涨落如何让疫情意外熄灭（Extinction）。

### 验收标准
- [ ] 能写出主方程的 Gain-Loss 形式。
- [ ] 理解为什么 $\Delta t$ 服从指数分布（无记忆性）。
- [ ] 知道 MCMC 为什么要用 Metropolis 准则（为了构造细致平衡）。
