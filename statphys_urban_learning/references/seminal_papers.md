# Seminal papers（原始文献：SSOT）

> 目的：把每个模块最值得精读的 1–2 篇“原始论文/经典工作”集中维护；模块页只引用条目 ID，避免格式漂移。
>
> 使用方式（建议）：
> 1) 先看模块 `Introduction`，明确“本章要解决的矛盾”
> 2) 再读这里的导读（Why this paper?）带着问题去看原文
> 3) 回到模块里的 KB/习题/pytest，把读到的思想变成可验证的推导与代码

---

## M1（熵 / MaxEnt / 指数族）

### SP-M1-Jaynes1957-I
- E. T. Jaynes, “Information Theory and Statistical Mechanics,” *Physical Review* **106**, 620–630 (1957).
- Why this paper?
  - 把“系综”从动力学假设（各态历经）抽离出来，改写为“信息不完备下的推断问题”；
  - 给出最大熵 ⇒ 指数族的推断框架，是本项目 M1→M3/M4→城市 MaxEnt 的统一入口。
- Reading prompt（带着问题去读）
  - 这篇论文真正“重新定义”的对象是什么：是热力学量，还是“概率分布的来源”？
  - 在 Jaynes 的视角里，\(\beta\)、\(\mu\) 这类拉格朗日乘子究竟代表“物理温度/化学势”，还是“你手里缺失信息的影子”？
- Modern lens（用今天的语言复述）
  - MaxEnt 等价于：在满足约束下，选择熵最大的分布；更一般可视为在给定先验测度下最小化 KL（最小信息增量）。
  - 指数族、log-partition function（\(\ln Z\)）与凸优化的对偶结构，统一解释了“为什么 \(\ln Z\) 的导数会给出平均与协方差”。
- Exercise（用今天的符号重做一遍）
  - 用 MaxEnt 推出 \(p(x)\propto e^{-\beta E(x)}\)，并显式写出 \(\partial_\beta \ln Z\) 与 \(\partial_\beta^2\ln Z\) 的物理含义；再用一个最小离散例子数值验证（对应：`exercises/notebooks/E01_maxent_discrete_numeric.ipynb`）。

### SP-M1-Jaynes1957-II
- E. T. Jaynes, “Information Theory and Statistical Mechanics. II,” *Physical Review* **108**, 171–190 (1957).
- Why this paper?
  - 进一步讨论约束、先验测度与可交换性等关键细节，能帮助你理解“最大熵的边界在哪里”；
  - 适合作为你把 MaxEnt 从“会推导”提升到“会批判/会用”的分水岭阅读。
- Reading prompt（带着问题去读）
  - 约束一旦变复杂（非线性/不完备），MaxEnt 的“最诚实”到底指什么？哪些地方需要你明确先验测度？
- Modern lens（用今天的语言复述）
  - 这篇更接近“MaxEnt = 推断原则”的边界讨论：你必须说清楚你在最大化的到底是哪一个熵（以及相对于什么基准）。
- Exercise（用今天的符号重做一遍）
  - 选一个非均匀先验测度（或基准分布）\(\pi_0(x)\)，证明“最大相对熵”给出 \(p(x)\propto \pi_0(x)\exp(-\sum_k\lambda_k f_k(x))\)，并讨论它在城市 OD 推断里对应什么“先验结构”。

### SP-M1-Boltzmann1877
- L. Boltzmann, “Über die Beziehung zwischen dem zweiten Hauptsatze der mechanischen Wärmetheorie und der Wahrscheinlichkeitsrechnung …” (1877).
- Why this paper?
  - 是 \(S\propto \ln \Omega\) 的历史源头：把不可逆性的解释从“力学决定论”转向“数量优势/典型性”；
  - 读它的价值不在推导细节，而在理解：第二定律在统计物理里为何是“高概率定律”。

---

## M0（热力学骨架 / 势 / Legendre）

### SP-M0-Gibbs1876-Heterogeneous
- J. W. Gibbs, “On the Equilibrium of Heterogeneous Substances,” *Transactions of the Connecticut Academy of Arts and Sciences* **3**, 108–248 (1876); **3**, 343–524 (1878).
- Why this paper?
  - 把“势函数/化学势/平衡条件”系统化：你在 M0 背下的 \(G(T,P,N)\)、\(\mu\)、相平衡判据都能在这里找到源头；
  - 训练一个博士级习惯：先写清控制变量与势，再谈“自发方向/可用功”，否则后面系综与城市模型都会混乱。

## M2（微正则 / 典型性 / 热力学极限）

### SP-M2-Khinchin1949
- A. I. Khinchin, *Mathematical Foundations of Statistical Mechanics*, Dover (1949).
- Why this book?
  - 它是“各态历经假说”的数学终结者。Khinchin 证明了我们不需要强假设（Ergodicity），只需要“相位函数的性质”加上大数定律，就能保证物理量的测量值等于相空间平均值。
  - 阅读它能让你明白：物理学家用的微正则系综其实比数学家以为的要稳固得多。

### SP-M2-Ramsey1956-NegativeTemperature
- N. F. Ramsey, “Thermodynamics and Statistical Mechanics at Negative Absolute Temperatures,” *Physical Review* **103**, 20–28 (1956).
- Why this paper?
  - 负温度最容易被误解成“比 0 K 更冷”。Ramsey 用严格的统计力学与热力学一致性解释：负温度对应 \(\partial S/\partial E<0\)，并且在热接触意义上比任何正温度都“更热”。
  - 它把“能量谱必须有上界”这一必要条件讲清楚，是你在自旋/Ising 以及城市模型里讨论“饱和/上界/反转”现象时的关键概念锚点。

## M3（正则系综）

### SP-M3-Gibbs1902
- J. W. Gibbs, *Elementary Principles in Statistical Mechanics*, Scribner (1902).
- Why this paper?
  - 统计力学的奠基之作。Gibbs 在这本书里发明了“微正则”、“正则”、“巨正则”这一整套术语。
  - 重点阅读关于 Canonical Ensemble 的定义，理解他如何通过“Mental mixing”构想出概率系综。

## M4（巨正则 / 可变 N / IPF-OD）

### SP-M4-Gibbs1902
- J. W. Gibbs, *Elementary Principles in Statistical Mechanics Developed with Especial Reference to the Rational Foundation of Thermodynamics*, Yale University Press, 1902.
- Why this paper?
  - 巨正则的思想源头：当系统与“粒子库/人口库”交换时，控制旋钮从 \(E\) 扩展到 \(\mu\)；
  - 帮你把“\(\mu\) 是拉格朗日乘子”与“\(\mu\) 是可测强度”的双重身份说清楚（城市 OD/强度建模会反复用到）。

### SP-M4-DemingStephan1940
- W. E. Deming and F. F. Stephan, “On a Least Squares Adjustment of a Sampled Frequency Table When the Expected Marginal Totals are Known,” *Annals of Mathematical Statistics* **11**, 427–444 (1940).
- Why this paper?
  - IPF/RAKING 的经典源头：在已知行列边际时如何调整联分布（OD 矩阵的最小闭环）；
  - 读它的价值在“方法边界”：何时收敛、何时会失败、以及你在城市数据里到底在拟合什么。

## M5（涨落—响应 / 相关 / 线性响应）

### SP-M5-Einstein1905-Brownian
- A. Einstein, “Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen,” *Annalen der Physik* **17**, 549–560 (1905).
- Why this paper?
  - 给出布朗运动的最小可检验预测：均方位移随时间线性增长，并把扩散系数 \(D\) 与温度/阻力（迁移率）联系起来；
  - 它是涨落—耗散思想的历史起点：微观“乱动”的强度与宏观“好推”的程度必须匹配，否则就会违背平衡。
- Reading prompt（带着问题去读）
  - 这篇论文里哪些量是“可观测”的（位移分布/均方位移）？哪些量是“间接引入”的（扩散系数、摩擦/迁移率）？
  - Einstein 关系 \(D\sim k_BT/\zeta\) 的逻辑链条到底依赖哪些平衡假设？
- Modern lens（用今天的语言复述）
  - 这篇工作在现代语言里对应：扩散方程（或 Langevin/FP）给出 \(p(x,t)\)，而平衡要求把“扩散流”与“漂移/耗散”绑定（涨落—耗散的一维原型）。
- Exercise（用今天的符号重做一遍）
  - 用“零净流 \(J=0\)”推导 Einstein 关系的最短版本，并用数值实验验证均方位移 \(\langle (x(t)-x(0))^2\rangle\propto t\)（可对照：`kb/sources/guides/Einstein_1905_Brownian.md` 与 M9 的 OU/扩散闭环）。

### SP-M5-Onsager1931
- L. Onsager, “Reciprocal Relations in Irreversible Processes. I,” *Physical Review* **37**, 405–426 (1931).
- Why this paper?
  - 建立近平衡不可逆过程的线性理论框架（互易关系/回归思想），把“响应系数”从经验量变成受约束的结构；
  - 是你理解“相关函数 → 响应”的关键祖先：后续的回归假说与 FDT/Kubo 公式都在这条谱系上。

### SP-M5-CallenWelton1951
- H. B. Callen and T. A. Welton, “Irreversibility and Generalized Noise,” *Physical Review* **83**, 34–40 (1951).
- Why this paper?
  - 把“噪声/涨落”与“耗散/响应”绑定在一起：你在 M5 学到的敏感性与不确定性不再是经验术；
  - 训练你区分：哪些关系是平衡态严格成立，哪些只是近似（线性响应的边界）。

### SP-M5-Kubo1957
- R. Kubo, “Statistical-Mechanical Theory of Irreversible Processes. I. General Theory and Simple Applications to Magnetic and Conduction Problems,” *Journal of the Physical Society of Japan* **12**, 570–586 (1957).
- Why this paper?
  - 线性响应的标准形式来源：把“外界微扰 → 平均响应”写成相关函数；
  - 是你把“二阶导数=协方差”推广到时间相关与动力学响应的桥。

## M6（相互作用 / 平均场 / Ising）

### SP-M6-Weiss1907
- P.-E. Weiss, “L'hypothèse du champ moléculaire et la propriété ferromagnétique,” *Journal de Physique Théorique et Appliquée* **6**, 661–690 (1907).
- Why this paper?
  - 平均场思想的原型：用“有效场/自洽”把相互作用多体问题压缩成单体问题；
  - 读它的意义在于理解“为什么平均场会错”：它系统性忽略了关联与涨落（M7 的入口）。

### SP-M6-Ising1925
- E. Ising, “Beitrag zur Theorie des Ferromagnetismus,” *Zeitschrift für Physik* **31**, 253–258 (1925).
- Why this paper?
  - 提供一个最小可计算的相互作用模型（后来被二维/高维推广）：序参量、相变、关联的语言都从这里长出来；
  - 你在本仓库里做的 Ising-MCMC/临界信号，都是在这条谱系上训练“从模型到可观测”的能力。

## M7（相变 / 标度 / 重整化群）

### SP-M7-Onsager1944
- L. Onsager, “Crystal Statistics. I. A two-dimensional model with an order-disorder transition,” *Physical Review* **65**, 117–149 (1944).
- Why this paper?
  - 证明相变不是“平均场幻觉”：二维 Ising 的严格解给出非平凡临界行为，是对直觉的硬约束；
  - 帮你理解“精确解的价值”：它不是为了算一个模型，而是为了校准近似与数值。

### SP-M7-Wilson1975
- K. G. Wilson, “The Renormalization Group: Critical Phenomena and the Kondo Problem,” *Reviews of Modern Physics* **47**, 773–840 (1975).
- Why this paper?
  - 给出临界普适性的机制解释：临界点处不同尺度的涨落耦合，必须用“粗粒化 + 流”来组织；
  - 读它能让你知道：哪些结论是“尺度不变”带来的，哪些依赖微观细节（城市系统做标度时尤其要谨慎）。
- Reading prompt（带着问题去读）
  - Wilson 解决的“主问题”不是算出某个 \(Z\)，而是解释：为什么会出现幂律？为什么指数是这些数？为什么不同系统会相同？
  - 找到文中把“粗粒化 = 对短尺度自由度求和”讲清楚的关键段落，并用你自己的话复述它。
- Modern lens（用今天的语言复述）
  - RG 可以看作对“有效模型”的迭代映射：参数随尺度流动，固定点给出普适行为；relevant/irrelevant 方向解释了“哪些微观差异会被洗掉”。
  - FSS/data collapse 是 RG 在有限系统上的可操作投影：用不同 \(L\) 代替不同观察尺度。
- Exercise（用今天的符号重做一遍）
  - 在 2D Ising 的有限尺寸数据上做一次 \(\chi\) 的 data collapse，并从 \(\chi_{\max}(L)\) 拟合外推出 \(\gamma/\nu\)（对应：`exercises/notebooks/E07_ising_critical_signals.ipynb` 与模块 `modules/M7b_renormalization_group.md`）。

## M8（Markov / 主方程 / 细致平衡与净流）

### SP-M8-Kolmogorov1931
- A. N. Kolmogorov, “Über die analytischen Methoden in der Wahrscheinlichkeitstheorie,” *Mathematische Annalen* **104**, 415–458 (1931).
- Why this paper?
  - Markov 连续时间过程的方程基石：前向/后向方程是主方程与 FP 的共同祖先；
  - 让你把“随机动力学”从术语变成可写的方程与可验证的预测。

### SP-M8-Gillespie1976
- D. T. Gillespie, “A General Method for Numerically Simulating the Stochastic Time Evolution of Coupled Chemical Reactions,” *Journal of Computational Physics* **22**, 403–434 (1976).
- Why this paper?
  - 给出从“主方程”到“可模拟路径”的标准桥：即使你不做化学反应，它的方法论也适用于离散状态的迁移/事件过程；
  - 读它能帮助你区分：矩阵推进（分布视角）与路径模拟（轨迹视角）分别适合回答什么问题。

## M9（Langevin / Fokker–Planck / 随机微积分）

### SP-M9-Langevin1908
- P. Langevin, “Sur la théorie du mouvement brownien,” *Comptes Rendus de l'Académie des Sciences (Paris)* **146**, 530–533 (1908).
- Why this paper?
  - 最小随机动力学范式：把不可控的快自由度压缩成“摩擦 + 噪声”，从轨迹层面建模；
  - 你在本仓库用 OU 过程做的所有数值验证，本质上都是在复刻这条思想：用最小模型校准方法。

### SP-M9-Ito1944
- K. Itô, “Stochastic Integral,” *Proceedings of the Imperial Academy* **20**, 519–524 (1944).
- Why this paper?
  - 解释为什么 SDE 不是普通微积分：离散化规则决定了漂移项的含义（Itô vs Stratonovich）；
  - 是你把 Euler–Maruyama 当作“可控的数值实验”而不是“拍脑袋算法”的理论底座。

## M10（NESS / 熵产生 / 不可逆性刻度）

### SP-M10-Schnakenberg1976
- J. Schnakenberg, “Network theory of microscopic and macroscopic behavior of master equation systems,” *Reviews of Modern Physics* **48**, 571–585 (1976).
- Why this paper?
  - 给出把“主方程系统”写成网络并定义熵产生的经典框架：用边流与对数比值量化不可逆性；
  - 非常适合作为 M10 的最小闭环：细致平衡 \(\Leftrightarrow\) 环流为零 \(\Leftrightarrow\) 熵产生为零。
- Reading prompt（带着问题去读）
  - 这篇论文里“网络表示”到底解决了什么难点？它把哪些量变成了可加的、可分解的对象？
  - 熵产生的表达式里，哪一部分对应“流”，哪一部分对应“力”（对数比值）？
- Modern lens（用今天的语言复述）
  - 对离散 Markov 跳跃过程，EPR 可写成 \(\sum J_{ij}\ln(J_{ij}^+/J_{ij}^-)\) 的形式；它是 NESS 不可逆性的可计算刻度。
- Exercise（用今天的符号重做一遍）
  - 任选一个三态环流模型，算出稳态 \(\pi\)、净流 \(J_{ij}\) 与 \(\sigma_{\mathrm{ss}}\)，并验证当你把驱动调到 0 时 \(\sigma_{\mathrm{ss}}\to 0\)（对应：[[p06_entropy_production/README]] 与 `modules/M10_nonequilibrium_steady_state_entropy_production.md`）。

### SP-M10-LebowitzSpohn1999
- J. L. Lebowitz and H. Spohn, “A Gallavotti–Cohen-type symmetry in the large deviation functional for stochastic dynamics,” *Journal of Statistical Physics* **95**, 333–365 (1999).
- Why this paper?
  - 给出 NESS 里“熵产生/不可逆性”的更深层结构：在大偏差层面出现的对称性把第二定律写成概率论陈述；
  - 适合作为 M10 的“前沿一跳”：知道它存在即可，不要求推导细节。
- Reading prompt（带着问题去读）
  - 这篇论文里“对称性”究竟是对什么对象的对称？它与“时间反演”是什么关系？
- Modern lens（用今天的语言复述）
  - 这条线索最终导向涨落定理：\(\Pr(\Delta S<0)\) 虽非零但被指数压制；是非平衡“第二定律”的概率版本。
- Exercise（用今天的符号重做一遍）
  - 在三态环流上做一个最小数值实验：统计有限时间窗内的熵产生增量分布，观察其对称性是否近似出现（只要求定性，不要求收敛到严格极限）。

## M11（FDT 违背 / Harada–Sasa / 可见耗散）

### SP-M11-HaradaSasa2005
- T. Harada and S.-i. Sasa, “Equality Connecting Energy Dissipation with a Violation of the Fluctuation-Response Relation,” *Physical Review Letters* **95**, 130602 (2005). DOI: [10.1103/PhysRevLett.95.130602](https://doi.org/10.1103/PhysRevLett.95.130602).
- Why this paper?
  - 证明一类非平衡 Langevin 系统中，速度关联与线性响应的 FDT 违背积分等于稳态能量耗散率；
  - 它把“FDT 不成立”从定性诊断变成可由实验观测量估计的功率。
- Reading prompt（带着问题去读）
  - 等式使用的是位置还是速度关联？摩擦系数和平均漂移项分别出现在哪里？
  - 论文中的“整个系统”指模型中纳入的哪些自由度，实验只观测部分自由度时会漏掉什么？
- Exercise（用今天的符号重做一遍）
  - 对谐振阱中的加性 OU 活性力，分别从速度形式与位置形式推导 Harada–Sasa 等式，并用量纲检查找出位置谱所需的 $\gamma\omega^2$ 权重。

### SP-M11-HaradaSasa2006
- T. Harada and S.-i. Sasa, “Energy Dissipation and Violation of the Fluctuation-Response Relation in Non-equilibrium Langevin Systems,” *Physical Review E* **73**, 026131 (2006). Preprint: [arXiv:cond-mat/0510723](https://arxiv.org/abs/cond-mat/0510723).
- Why this paper?
  - 系统展开 2005 年等式的适用条件，并讨论多自由度、时变驱动与多个热浴；
  - 说明耗散可以按模型自由度分解，因此“探针可见耗散”与“隐藏通道耗散”必须分开报告。

### SP-M11-WuLibchaber2000
- X.-L. Wu and A. Libchaber, “Particle Diffusion in a Quasi-Two-Dimensional Bacterial Bath,” *Physical Review Letters* **84**, 3017–3020 (2000). DOI: [10.1103/PhysRevLett.84.3017](https://doi.org/10.1103/PhysRevLett.84.3017).
- Why this paper?
  - 用细菌悬浮液中的示踪粒子展示非热活动如何改变扩散统计，是“热噪声之外还有持续驱动”的经典实验入口；
  - 它适合建立活性浴直觉，但不能单凭扩散增强就完成 FDT 或总耗散测量，响应仍需独立测量。

### SP-M11-FodorEtAl2016
- É. Fodor, C. Nardini, M. E. Cates, J. Tailleur, P. Visco, and F. van Wijland, “How Far from Equilibrium Is Active Matter?” *Physical Review Letters* **117**, 038103 (2016). DOI: [10.1103/PhysRevLett.117.038103](https://doi.org/10.1103/PhysRevLett.117.038103).
- Why this paper?
  - 展示持续有色噪声的有效模型在时间反演和熵产生定义上具有细致边界；
  - 提醒读者：给活性噪声写出相关函数，并不等于已经定义了隐藏推进机制的完整热力学。
