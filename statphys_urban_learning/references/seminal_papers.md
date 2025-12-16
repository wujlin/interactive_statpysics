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

### SP-M1-Jaynes1957-II
- E. T. Jaynes, “Information Theory and Statistical Mechanics. II,” *Physical Review* **108**, 171–190 (1957).
- Why this paper?
  - 进一步讨论约束、先验测度与可交换性等关键细节，能帮助你理解“最大熵的边界在哪里”；
  - 适合作为你把 MaxEnt 从“会推导”提升到“会批判/会用”的分水岭阅读。

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
