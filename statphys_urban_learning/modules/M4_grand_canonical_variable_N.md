# M4 巨正则系综与可变规模（OD/人口）

> **核心目标**：打破“封闭系统 / 固定规模”的思维定势。现实中的城市与人群系统是开放的：能量/资源会流动，**人口与出行需求（可抽象为粒子数 \(N\)）也会流动**。巨正则系综（Grand Canonical Ensemble）专门处理 **\(N\) 可变** 的平衡系统，并引入关键控制参数 **化学势 \(\mu\)**。掌握 \(\mu\)，就掌握了“开放规模系统”的计算钥匙。

## 推荐学习顺序
1. 先抓动机：为什么城市/人口/OD 的 \(N\) 不能固定（本页 Introduction）。
2. 再抓新旋钮：\(\mu\) 作为“规模控制参数”的两层含义（Part 1）。
3. 再抓数学落点：从 \(Z_N\) 到 \(\mathcal{Z}=\sum_N e^{\beta\mu N}Z_N\)，以及 \(\ln\mathcal{Z}\) 的导数规则（Part 2–3）。
4. 最后回到应用：把 \((N,\mu)\) 翻译成 OD/人口系统里的“规模—吸引力—波动/响应”（Part 4）。

## 背景最小包（First Principles）
- 当 \(N\) 可交换时，我们需要同时控制 \(\langle E\rangle\) 与 \(\langle N\rangle\)；对应的控制旋钮是 \(T\) 与 \(\mu\)。在巨正则系综中 \(E\) 与 \(N\) 都允许波动。
- 化学势 \(\mu\) 是与 \(N\) 共轭的对偶参数：它不是“化学专用”，而是**规模控制旋钮**。
- 巨正则把系统可能处在的不同 \(N\) 分支按 \(e^{\beta\mu N}\) 加权汇总成 \(\mathcal{Z}\)，使开放系统仍可计算；并且 \(\ln\mathcal{Z}\) 的导数会直接生成平均规模与涨落（响应强度）。

## 逻辑桥接（M3 → M4）
- M3（正则）是“只开放能量通道”的模型：给定 \(T\)，\(E\) 可波动，但 \(N\) 固定。
- M4（巨正则）把“规模通道”也打开：给定 \((T,\mu)\)，\(E\) 与 \(N\) 都可波动；数学上体现为 \(Z_N \to \mathcal{Z}=\sum_N e^{\beta\mu N}Z_N\)。

---

## Introduction

M3（正则系综）把系统放在热库旁边：系统可以吸放热，因此能量 \(E\) 允许涨落；但它仍假设系统“封闭”——**粒子数 \(N\) 固定不变**。这个假设在城市/人口/OD 等问题里几乎从一开始就不成立：人会迁入迁出、事件数会增减，系统规模本身会随外界条件变化。于是我们必须回答一个新问题：**当 \(N\) 也持续涨落时，平衡应如何定义、如何计算？**

打开“规模通道”需要一个新的控制旋钮：**化学势 \(\mu\)**。它是与 \(N\) 共轭的对偶变量
\[
\mu=\left(\frac{\partial F}{\partial N}\right)_{T,V},
\]
直觉上刻画“再多一个粒子/个体”的边际代价/边际价值；当系统接触一个巨大的粒子库时，外界给定 \(\mu\)，平衡条件是 \(\mu_{\text{system}}=\mu_{\text{reservoir}}\)（完全类比热平衡要求温度相等）。

数学上，这一步把 M3 的权重 \(e^{-\beta E}\) 升级为
\[
e^{-\beta(E-\mu N)},
\qquad \beta\equiv \frac{1}{k_BT},
\]
并把每个固定 \(N\) 的正则配分函数 \(Z_N\) 汇总成一个统一对象——巨配分函数
\[
\mathcal{Z}(\beta,\mu,V)=\sum_{N=0}^{\infty} e^{\beta\mu N}\,Z_N(\beta,V).
\]
这不是“形式上的搬运”：它对应系统可能处在不同 \(N\) 分支上，而 \(\mathcal{Z}\) 把这些分支按权重加总，使得开放系统仍然可计算。接下来你会看到：\(\ln\mathcal{Z}\) 的一阶导数给平均规模 \(\langle N\rangle\)，二阶导数给规模涨落 \(\mathrm{Var}(N)\)；涨落大小本身就是响应强度（susceptibility）的可观测刻画。

城市映射里，我们把 \(N\) 理解为人口/迁移事件数/OD 总需求规模，把 \(\mu\) 理解为与规模共轭的外参（吸引力/保留效用/准入门槛等，取决于你如何定义成本/效用）。因此 M4 的价值不只是“多一个符号”，而是提供一套把“外部条件变化 \(\Rightarrow\) 平均规模变化/波动放大”写成可检验预测的标准语言。

## References
- **Gibbs 1902**: *Elementary Principles in Statistical Mechanics*. 导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M4-Gibbs1902`）。
- **Deming & Stephan 1940**: IPF/RAKING 的经典源头。导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M4-DemingStephan1940`）。

---

## 本章路线图（先看这 30 秒）
本章只做一件事：把 M3 的“固定 \(N\)”改成“\(N\) 可涨落”。
因此我们按四步走：
1. 用 \(\mu\) 把“粒子交换”写成可控的约束；
2. 写出开放系统的权重，并把归一化常数定义为巨配分函数 \(\mathcal{Z}\)；
3. 用 \(\ln\mathcal{Z}\) 的导数同时得到平均规模与涨落（响应强度）；
4. 把 \((N,\mu)\) 翻译成城市语言：规模与吸引力、波动与集聚。

## Part 1：化学势 \(\mu\)：开放系统的控制参数

在 M3（正则系综）里我们默认系统“封闭”：粒子数 \(N\) 固定。  
但一旦系统能与外界交换粒子，状态就必须写成 **\((x,N)\)**：其中 \(x\) 是“给定 \(N\) 时的微观自由度”，而 \(N\) 本身变成随机变量。

此时我们需要一个像温度 \(T\) 一样的控制量：
- \(T\) 控制能量交换（热流）；
- \(\mu\) 控制粒子交换（粒子流）。

初学者最容易卡住的是：\(\mu\) 既像“边际自由能”，又像“外界给定的控制量”。把它分成两句话就不容易混：
- **系统内部的定义（共轭量）**
  \[
  \mu=\left(\frac{\partial F}{\partial N}\right)_{T,V}
  \quad(\text{或 }\mu=\left(\frac{\partial U}{\partial N}\right)_{S,V}).
  \]
  它刻画在给定约束下，“再多一个粒子”对自由能/内能的边际影响。
- **巨正则的用法（外界给定的控制量）**
  当系统接触一个粒子库时，库给定 \(\mu\)，平衡条件是
  \[
  \mu_{\text{system}}=\mu_{\text{reservoir}}.
  \]
  直观上：在其余条件不变时，\(\mu\) 越高，系统越“愿意长大”，平均规模 \(\langle N\rangle\) 趋向更大。

如果把两处区域当作可交换粒子的子系统，则粒子会流动直到两侧 \(\mu\) 相等；这与热平衡要求 \(T_1=T_2\) 完全平行。

**关键过渡（把 \(\mu\) 落到概率权重上）**  
既然状态写成 \((x,N)\)，我们就需要给每个 \((x,N)\) 一个概率。最自然的做法是让 \(T\) 与 \(\mu\) 分别偏置能量与粒子数：权重取 \(e^{-\beta(E-\mu N)}\)。把它归一化，就会自然得到 Part 2 的巨配分函数 \(\mathcal{Z}\)。

更严格的定义、符号约定与常见误区见：[[化学势 Chemical potential]] 与 [[符号约定与映射（本仓库统一：Swendsen 体系）]]。

---

## Part 2：巨配分函数 \(\mathcal{Z}\)——双重求和

先回忆 M3：在固定 \(N\) 时，微态的指数权重为
\[
P(x\mid N)\propto e^{-\beta E(x,N)},\qquad \beta=\frac{1}{k_BT},
\]
其归一化常数就是（固定 \(N\) 的）正则配分函数
\[
Z_N(T,V)=\sum_x e^{-\beta E(x,N)}.
\]

现在 \(N\) 本身也在涨落。对开放系统（给定 \(T,V,\mu\)）最常用的权重写法是
\[
P(x,N)\propto e^{-\beta\,[E(x,N)-\mu N]}.
\]
于是 **巨配分函数**就是把这个权重归一化所需的常数：
\[
\mathcal{Z}(T,V,\mu)
=\sum_{N=0}^{\infty}\sum_x e^{-\beta\,[E(x,N)-\mu N]}
=\sum_{N=0}^{\infty} e^{\beta\mu N}\,Z_N(T,V).
\]

这一步的好处是：你不再需要“先固定 \(N\) 再算 \(Z_N\) 再人工加权”，而是让所有 \(N\) 的贡献被同一个对象 \(\mathcal{Z}\) 统一承载。

对应的热力学势（本仓库记作 \(J\)，避免与微正则的多重度 \(\Omega\) 混淆）是
\[
J(T,V,\mu)\equiv -k_BT\ln \mathcal{Z}(T,V,\mu),
\]
它的自然变量是 \((T,V,\mu)\)，对应把 “\(N\) 从硬约束变成软约束” 之后的自然势函数。

**最短推导（避免背公式）**  
对 \(\mathcal{Z}\) 对 \(\mu\) 求导：
\[
\frac{\partial \mathcal{Z}}{\partial \mu}
=\sum_{N,x}\frac{\partial}{\partial \mu}e^{-\beta(E-\mu N)}
=\sum_{N,x}(\beta N)\,e^{-\beta(E-\mu N)}.
\]
两边除以 \(\mathcal{Z}\)：
\[
\frac{\partial \ln \mathcal{Z}}{\partial \mu}
=\frac{1}{\mathcal{Z}}\frac{\partial \mathcal{Z}}{\partial \mu}
=\beta\sum_{N,x}N\,\frac{e^{-\beta(E-\mu N)}}{\mathcal{Z}}
=\beta\langle N\rangle.
\]
因此
\[
\boxed{\ \langle N\rangle=\frac{1}{\beta}\frac{\partial \ln\mathcal{Z}}{\partial \mu}\ }\quad(\text{在 }T,V\text{ 固定时}).
\]

### Interactive：调 \(\mu\) 看 \(P(N)\)
下面用一个“可解玩具模型”把 \(\mathcal{Z}\to \ln\mathcal{Z}\to \langle N\rangle\to \mathrm{Var}(N)\) 串起来：你调 \(\alpha=\beta\mu\)，就会看到粒子数分布 \(P(N)\) 如何移动、变宽，并且一阶/二阶导数如何生成均值与涨落。

<InteractiveConcept type="grand-canonical-poisson" />

### 进阶：无相互作用量子气体与占据数表示

巨正则里 \(N\) 在涨落。如果你仍然坚持“粒子视角”去追踪每个粒子的坐标/动量，那么微观态空间是 \(6N\) 维，**连维数都会随 \(N\) 改变**；把这样的对象塞进
\(\mathcal{Z}=\sum_N e^{\beta\mu N}Z_N\) 的求和里，计算上几乎不可控。

这里的观念转折来自 [[全同粒子与不可分辨性 Indistinguishability|全同粒子（indistinguishability）]]：对全同粒子系统，“粒子 A 在能级 1、粒子 B 在能级 2”与“A 在 2、B 在 1”不是两个不同的物理状态；可观测量不依赖粒子标签。于是，“谁在哪里”这类描述天然包含冗余信息；**唯一不冗余的微观态描述**是：每个单粒子能级（或模式）\(r\) 上有多少粒子 —— 记为占据数 \(n_r\)。

这一步的读者收益是“降维打击”：从“追踪每个粒子（随 \(N\) 变维数）”切换到“追踪每个能级/位置（\(r\) 的集合固定）”。当系统无相互作用时，这个切换会把一个纠缠的 \(N\) 体计数问题，拆成一排相互独立的单能级问题。

对无相互作用气体，用占据数 \(\{n_r\}\) 表示多体态时，
\[
E=\sum_r n_r\varepsilon_r,\qquad N=\sum_r n_r.
\]
代回巨正则权重 \(e^{-\beta(E-\mu N)}\)，指数对能级线性分解，从而巨配分函数因子化为
\[
\mathcal{Z}
=\sum_{\{n_r\}} \exp\!\left[-\beta \sum_r n_r(\varepsilon_r-\mu)\right]
=\prod_r \left[\sum_{n_r\in\mathcal{A}} e^{-\beta(\varepsilon_r-\mu)n_r}\right].
\]
因此 \(\ln\mathcal{Z}\) 也变成能级上的求和（每个“盒子”只管自己装几个粒子）。

这里的集合 \(\mathcal{A}\) 不是“子系统 A”，而是**占据数 \(n_r\) 的允许取值集合**：它把“一个单粒子态最多能装几个粒子”这条物理规则写进了求和范围里。我们关心 \(\mathcal{A}\) 的原因在于：对无相互作用系统而言，巨正则推导的步骤几乎完全相同；不同统计（费米/玻色/经典极限）最终只在这一处发生分岔——**对 \(n_r\) 求和时允许取哪些值**。

> 城市类比：这相当于从“追踪每辆车的轨迹（Lagrangian）”切换到“监测每条路段的流量（Eulerian）”。当我们只关心路网负载/拥堵（宏观态）时，不需要知道具体哪辆车在哪，只需要知道每条路 \(r\) 上的占据数 \(n_r\)。

占据数允许集合 \(\mathcal{A}\) 的不同选择，直接导出了三大统计分布：
- \(\mathcal{A}=\{0,1\}\)（费米子） \(\to\) [[Fermi–Dirac 分布 Fermi-Dirac distribution]]
- \(\mathcal{A}=\{0,1,2,\dots\}\)（玻色子） \(\to\) [[Bose–Einstein 分布 Bose-Einstein distribution]]
- \(\langle n_r\rangle\ll 1\)（经典极限） \(\to\) [[Maxwell–Boltzmann 分布 Maxwell-Boltzmann distribution]]

完整推导（含活度 \(z=e^{\beta\mu}\)、玻色收敛条件 \(\mu<\varepsilon_0\)、以及 MB 密度公式 \(n(\mathbf x)=(1/\lambda_T^3)e^{\beta(\mu-U(\mathbf x))}\)）见：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]。

> 记号提醒：本仓库统一用 \(\mathcal{Z}\) 表示巨配分函数；符号约定见：[[符号约定与映射（本仓库统一：Swendsen 体系）]]。

**过渡到 Part 3**  
一阶导数给平均规模；那么二阶导数自然会给“规模的波动/涨落”。这就是巨正则版的涨落—响应关系。

---

## Part 3：密度涨落——城市集聚的起源

在 M3 里我们讨论了能量涨落（热容）。在 M4 里，我们关注 **粒子数涨落**，并把它读成“响应强度”（susceptibility）。

继续对 Part 2 的关系再求导：
\[
\frac{\partial \ln\mathcal{Z}}{\partial \mu}=\beta\langle N\rangle.
\]
对 \(\mu\) 再求一次导数：
\[
\frac{\partial^2 \ln\mathcal{Z}}{\partial \mu^2}
=\beta\frac{\partial \langle N\rangle}{\partial \mu}.
\]
另一方面，直接计算可得到二阶导对应二阶中心矩（这里给出结果口径；完整推导见：[[平均粒子数与涨落从 ln 𝒵 的导数得到]]）：
\[
\frac{\partial^2 \ln\mathcal{Z}}{\partial \mu^2}=\beta^2\mathrm{Var}(N).
\]
合并得到
\[
\boxed{\ \mathrm{Var}(N)=\frac{1}{\beta}\frac{\partial \langle N\rangle}{\partial \mu}
=\frac{1}{\beta^2}\frac{\partial^2 \ln\mathcal{Z}}{\partial \mu^2}\ }.
\]

这句话的直觉翻译是：
- \(\langle N\rangle\) 是“平均规模”；
- \(\partial\langle N\rangle/\partial\mu\) 是“规模对控制量的敏感度”（响应/易变性）；
- \(\mathrm{Var}(N)\) 把这种敏感度以“涨落”的形式显性化。

在物质系统中，它对应“可压缩性/易变性”的量级：\(\mu\) 轻微变化，密度会不会明显变化？
在城市里，这意味着：如果你稍微提高一点吸引力（\(\mu\)），人口会暴增吗？
- 正常区域：涨落有限。
- 临界区域（M7）：涨落发散（集聚效应、涌现）。

**过渡到 Part 4**  
到这里我们已经得到一个可检验的结构：
\[
\text{控制量 }\mu \;\longrightarrow\; \text{平均规模 }\langle N\rangle \;\longrightarrow\; \text{波动/响应 }\mathrm{Var}(N).
\]
下面要做的只是把 \((N,\mu)\) 翻译成“城市系统里你真正关心的量”。

---

## Part 4：城市映射——开放城市与规模波动

把城市当作开放系统时，“规模 \(N\)”往往不是硬约束：它会随政策、机会、外部冲击与迁移网络而波动。巨正则语言的最小翻译建议你先固定三件事：

- **变量对应（先钉死口径）**
  - \(N\)：常住人口规模，或更一般的“迁移/出行事件数”（可变）。
  - \(\mu\)：与规模共轭的控制量——可解释为“吸引力/外部给定的机会水平/保留效用/制度门槛”等（取决于你把 \(E\) 写成成本还是效用）。
  - \(E(x,N)\)：在给定规模下的“代价/负效用/约束能”，\(x\) 表示微观配置（行业结构、空间分布、匹配状态等）。

- **平衡条件的城市版（为什么说“吸引力差被抹平”）**
  两座城市 \(A,B\) 若允许交换人口，在固定 \(T,V\) 下总自由能
  \[
  F_{\text{tot}}(N_A)=F_A(N_A)+F_B(N_{\text{tot}}-N_A)
  \]
  的极值条件给出
  \[
  \frac{dF_{\text{tot}}}{dN_A}=\mu_A-\mu_B=0
  \quad\Rightarrow\quad
  \mu_A=\mu_B.
  \]
  这就是“长期上无净迁移驱动”的极简刻画。

- **可检验预测（把 Part 3 的涨落—响应落地）**
  一旦你用数据把 \(\mu\) 操作化，那么
  \[
  \frac{\partial\langle N\rangle}{\partial \mu}\quad\text{或}\quad \mathrm{Var}(N)
  \]
  就变成“吸引力微调 \(\Rightarrow\) 规模变化/波动放大”的可检验对象；这也是你后面讨论集聚与临界（M7）时最硬核的入口。

城市侧的“约束—势—可检验预测”映射可先看：[[化学势 μ 作为城市总强度规模控制量]]，再回到 [[巨正则系综 Grand canonical ensemble]] 的定义式做符号对照。

---

## 通往下一章（M5）
- 一旦 \(N\) 可以涨落，系统的“响应强度”就与涨落大小直接相连。
- M5 会系统化地把“涨落 ↔ 响应 ↔ 协方差”写成可计算的关系。

## Part 5：动手时刻 (Checklist)

### 必读
- [ ] **Reading Guide**: [[Swendsen_Ch20_GrandCanonical]]（Chapter 20: 20.1–20.3）
  > 点击上方卡片查看本章的公式锚点与阅读路标。重点关注巨配分函数 \(\mathcal{Z}\) 的定义。

### 习题
- [ ] **Written**: `exercises/written/M4_grand_canonical_notes.md`
  - 推导理想气体的 \(\langle N \rangle\) 与 \(\mu\) 的关系：\(\mu = k_B T \ln(n \lambda^3)\)。
- [ ] **思考**：为什么光子气体的 \(\mu = 0\)？（提示：粒子数不守恒，但也无需“外部储库”）。
- [ ] **进阶推导（无相互作用量子气体）**：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]

### 验收标准
- [ ] 知道何时使用巨正则（System is OPEN）。
- [ ] 能写出 \(\mathcal{Z}\) 的定义式，并知道如何对它求导得到 \(\langle N \rangle\)。
- [ ] 能解释为什么 \(\mu\) 相等意味着粒子流动的动态平衡。
