# M5 涨落怎样预测响应：动态 FDT 与静态协方差

把一颗胶体粒子放进温度为 $T$ 的水中，可以做两种看似无关的实验。第一种实验完全不碰它，只追踪位置 $x(t)$ 如何随机游走；第二种实验施加一个很小的力，测量粒子产生多大的平均漂移。前者测的是**自发涨落**，后者测的是**线性响应**。

平衡统计物理给出的关键结论不是“涨落和响应是同一个量”，而是：**当随机碰撞与黏滞阻力来自同一个平衡热浴时，二者不能独立变化。** Einstein 关系最直接地展示了这种约束，Onsager 回归与 Kubo 线性响应则把它扩展到时间相关结构。

“由涨落预测响应”还有另一种数学来源：在平衡指数族中，平均量对参数的**静态导数**等于协方差。本章沿两条并列路线展开，并始终区分它们的物理依据：

| 关系 | 回答的问题 | 核心对象 | 成立依据 |
|---|---|---|---|
| 动态涨落—响应关系 | 系统随时间怎样扩散、漂移或回归？ | 扩散系数、迁移率、时间相关函数、响应函数 | 平衡热浴、时间反演结构与线性响应 |
| 静态响应—协方差恒等式 | 平衡分布中的参数改变时，系综均值怎样改变？ | 配分函数、方差、协方差、参数导数 | 指数族的归一化与可微性 |

这两条关系在平衡统计物理中彼此呼应，但不能不加条件地视为同一个公式。

---

## 1. 胶体粒子的两种实验

### 1.1 不推它：用扩散系数度量自发涨落

先让胶体粒子在一维、均匀流体中自由运动。在过阻尼描述中，或更一般地在惯性弛豫时间之后的长时间扩散区，没有外力时粒子的平均位移为零，而均方位移线性增长：

$$
\left\langle [x(t)-x(0)]^2\right\rangle=2Dt.
$$

扩散系数 $D$ 量化了粒子自发涨落的强度。$D$ 越大，同样时间内位置分布扩展得越快。若保留粒子惯性，极短时间内运动先呈弹道标度，均方位移正比于 $t^2$；上式并不描述这一短时区间。

### 1.2 轻推它：用迁移率度量线性响应

现在施加一个很小的恒力 $F$。在线性响应区，粒子的平均漂移速度 $v$ 与外力成正比：

$$
v=bF,
\qquad
b:=\lim_{F\to 0}\frac{v}{F}.
$$

迁移率 $b$ 量化了粒子对微弱外力的响应强度。在低雷诺数的 Stokes 区，黏滞阻力为

$$
F_{\mathrm{drag}}=-\gamma v,
$$

其中 $\gamma$ 是黏滞摩擦系数。稳态漂移满足 $F+F_{\mathrm{drag}}=0$，因此

$$
v=\frac{F}{\gamma},
\qquad
b=\frac{1}{\gamma}.
$$

对于半径为 $r$ 的球形粒子，Stokes 阻力给出 $\gamma=6\pi\eta r$，其中 $\eta$ 是流体黏度。本章到 M11 均用 $\gamma$ 表示同一个摩擦系数。

### 1.3 平衡条件把两次实验锁在一起

Einstein 关系指出：

$$
\boxed{D=k_BT\,b=\frac{k_BT}{\gamma}}.
$$

它把没有外力时测得的扩散系数 $D$ 与微弱外力下测得的迁移率 $b$ 联系起来。两次实验之所以能互相预测，不是因为扩散与漂移在定义上相同，而是因为热噪声与黏滞阻力都来自温度为 $T$ 的同一个平衡热浴。

这个关系可以直接从“平衡态没有净概率流”推出。若粒子处在外势 $U(x)$ 中，粒子数密度 $n(x)$ 的通量包含扩散与漂移两部分：

$$
J=J_{\mathrm{diff}}+J_{\mathrm{drift}}
=-D\,\partial_x n+n\,bF,
\qquad
F=-\partial_xU.
$$

热平衡分布满足

$$
n(x)\propto e^{-\beta U(x)},
\qquad
\beta=\frac{1}{k_BT},
$$

所以

$$
\partial_xn=-\beta n\,\partial_xU=\beta nF.
$$

平衡态要求 $J=0$。代入上式可得

$$
0=-D(\beta nF)+nbF,
$$

从而

$$
D=\frac{b}{\beta}=k_BT\,b.
$$

这段推导揭示了 Einstein 关系的物理核心：扩散试图摊平密度，外势中的漂移试图重新聚集粒子；Boltzmann 分布能够保持不变，要求两种通量精确抵消。$D$ 与 $b$ 的比例因此不是材料参数的偶然巧合，而是平衡条件留下的可测约束。

---

## 2. 不只看“抖多大”，还要看“怎样恢复”

Einstein 关系连接了涨落与响应的强度，但没有告诉我们扰动消失后系统怎样随时间恢复。为此需要考察自发涨落的时间相关结构。

设 $A(t)$ 是一个可观测量，例如光阱中胶体粒子相对阱中心的位置。定义偏差与平衡自相关函数：

$$
\delta A(t):=A(t)-\langle A\rangle,
$$

$$
C_{AA}(t):=\left\langle \delta A(t)\,\delta A(0)\right\rangle.
$$

$C_{AA}(t)$ 记录系统对初始涨落的“记忆”：衰减越慢，系统忘记初始状态所需的时间越长。相关函数的数学定义与常见性质见 [[相关函数 Correlation function]]。

Onsager 回归假说把这种自发记忆与受迫回归联系起来。对于接近平衡、由单一线性模式主导，并由 $A$ 的共轭场制备出微小初始偏离的系统，有

$$
\frac{\delta\langle A(t)\rangle}{\delta\langle A(0)\rangle}
=\frac{C_{AA}(t)}{C_{AA}(0)}.
$$

左边来自一次“拉开再松手”的响应实验，右边来自完全不施加扰动时的自发涨落。二者具有相同的时间形状，因此平衡轨迹中的相关时间能够预测小扰动后的弛豫时间。

更一般地，若外场 $h(t)$ 通过能量项 $-h(t)B$ 耦合到系统，线性响应写成

$$
\delta\langle A(t)\rangle
=\int_{-\infty}^{t}R_{AB}(t-s)h(s)\,ds+O(h^2),
$$

其中 $R_{AB}(t)$ 是响应函数。Kubo 理论在平衡态下把 $R_{AB}(t)$ 与相应的时间相关函数联系起来；具体形式取决于扰动如何耦合、可观测量的时间反演性质以及相关函数的记号约定。

因此，Einstein 关系与 Onsager–Kubo 关系承担不同职责：前者把扩散与迁移率的幅度锁定，后者把自发涨落的时间结构与受迫响应的时间结构锁定。它们共同构成动态涨落—耗散关系的核心图景，详见 [[涨落-响应 Fluctuation-response]]。

---

## 3. 静态问题：为什么参数导数会变成协方差？

现在把时间暂时拿掉，改问一个静态问题：如果平衡分布中的外部参数 $\lambda$ 略微改变，某个系综平均 $\langle A\rangle$ 会怎样变化？答案来自指数族本身的归一化结构，而不是粒子的扩散或弛豫动力学。

固定如下耦合约定：参数 $\lambda$ 通过 $-\lambda B(x)$ 进入能量，且可观测量 $A(x)$ 不显含 $\lambda$：

$$
E_\lambda(x)=E_0(x)-\lambda B(x),
$$

$$
p_\lambda(x)=\frac{1}{Z(\lambda)}
\exp[-\beta E_\lambda(x)].
$$

$\lambda$ 越大，分布越偏好 $B$ 较大的状态。对归一化分布求导可得

$$
\partial_\lambda p_\lambda(x)
=\beta p_\lambda(x)\left[B(x)-\langle B\rangle\right].
$$

于是

$$
\begin{aligned}
\frac{\partial\langle A\rangle}{\partial\lambda}
&=\sum_x A(x)\,\partial_\lambda p_\lambda(x)\\
&=\beta\left(\langle AB\rangle-\langle A\rangle\langle B\rangle\right).
\end{aligned}
$$

因此得到静态响应—协方差恒等式：

$$
\boxed{
\frac{\partial\langle A\rangle}{\partial\lambda}
=\beta\,\mathrm{Cov}(A,B)
}.
$$

这条等式说明，参数 $\lambda$ 改变了状态的统计权重，而协方差测量了 $A$ 与被重新加权的量 $B$ 是否共同变化。若 $A$ 与 $B$ 经常同时偏大，增强对 $B$ 的偏好就会提高 $\langle A\rangle$；若二者负相关，响应方向相反。

### 3.1 两个常用特例

若 $A=B$，交叉响应退化为自响应：

$$
\boxed{
\frac{\partial\langle B\rangle}{\partial\lambda}
=\beta\,\mathrm{Var}(B)
}.
$$

同一结果也可以写成

$$
\partial_\lambda\ln Z=\beta\langle B\rangle,
\qquad
\partial_\lambda^2\ln Z=\beta^2\mathrm{Var}(B).
$$

多个共轭参数的二阶导组成协方差矩阵，方差只是对角元，详见 [[协方差与二阶导（通用）]]。若改用 $E_\lambda=E_0+\lambda B$，响应右边会多一个负号；符号来自参数进入能量的方式。

热容是另一个自响应例子。正则系综满足

$$
\frac{\partial\langle E\rangle}{\partial\beta}
=-\mathrm{Var}(E),
\qquad
\frac{d\beta}{dT}
=-\frac{1}{k_BT^2},
$$

所以

$$
\boxed{
C_V
=\left(\frac{\partial\langle E\rangle}{\partial T}\right)_V
=\frac{\mathrm{Var}(E)}{k_BT^2}
}.
$$

这里假定微观能量 $E(x)$ 不显含温度。这些公式都是静态系综恒等式，不包含扩散、弛豫或时间相关函数。

---

## 4. 这些关系在哪里停下？

涨落能够预测响应，但“能够”来自明确条件，而不是任何时间序列都自动满足的普遍类比。

### 4.1 平衡态不等于任意稳态

动态 FDT 要求系统与平衡热浴相容，通常还要求详细平衡或相应的时间反演结构。稳态只表示概率分布不随时间改变；非平衡稳态仍可存在持续概率流、外部驱动与能量耗散，因此一般不会满足同一条平衡 FDT。

这一区别也给出了一个实验判据：若独立测得的涨落与响应无法由同一个温度联系起来，偏差就在揭示非平衡驱动。要把偏差进一步换算成耗散，还必须指定动力学、热浴耦合和实际观测到的自由度。

### 4.2 线性响应是局部斜率，不是任意有限变化

响应函数与静态导数描述的是扰动趋于零时的局部变化。对有限参数增量 $\Delta\lambda$，静态恒等式只给出一阶近似：

$$
\Delta\langle A\rangle
=\beta\,\mathrm{Cov}_\lambda(A,B)\,\Delta\lambda
+O(\Delta\lambda^2).
$$

强扰动可能改变协方差、激活新的状态或产生迟滞，此时必须计算非线性响应，或沿参数路径积分不断变化的局部导数。

### 4.3 静态协方差恒等式有自己的精确性

只要分布确实具有上述指数族形式、状态空间支持不随参数改变、相关导数存在，且 $A$ 不显含 $\lambda$，
$\partial_\lambda\langle A\rangle=\beta\mathrm{Cov}(A,B)$ 作为**参数导数恒等式**是精确的。若 $A=A_\lambda$ 本身依赖参数，还需加入直接项 $\langle\partial_\lambda A_\lambda\rangle$。

这个数学恒等式甚至可以用于不具有真实热浴的概率模型，但此时 $\beta$、能量和协方差只具有模型中的统计含义。只有当模型变量与物理热浴、能量和共轭力对应时，它才获得热力学解释。静态恒等式本身也不包含弛豫时间，不能替代动态 FDT。

### 4.4 从有限数据估计涨落还需要误差条

理论等式精确，不代表有限样本估计没有误差。特别是 MCMC 与时间序列样本通常彼此相关；忽略自相关会高估独立信息量，并让由方差或协方差推得的响应显得过于精确。相应的数值处理放在本章末尾。

---

## 5. 城市映射：指数族中的敏感性，而非真实热力学等价

城市问题也经常询问局部响应，例如“过江费用增加时，平均过江流量会怎样变化”。若城市状态模型被明确写成最大熵或其他指数族形式，静态响应—协方差恒等式可以直接给出模型内的敏感度。

设状态 $s$ 对应小时流量 $Q(s)$，收费参数 $c$ 通过成本项 $cQ(s)$ 进入分布：

$$
p_c(s)=\frac{1}{Z(c)}\exp[-\beta cQ(s)].
$$

这里采用的是 $+cQ$ 的成本约定，所以响应带负号：

$$
\boxed{
\frac{\partial\langle Q\rangle}{\partial c}
=-\beta\,\mathrm{Var}(Q)
}.
$$

若关心的是拥堵指标 $G(s)$ 而不是流量本身，则一般形式为

$$
\frac{\partial\langle G\rangle}{\partial c}
=-\beta\,\mathrm{Cov}(G,Q).
$$

假设基准模型给出

$$
\langle Q\rangle=10000\ \text{人次/小时},
\qquad
\mathrm{Var}(Q)=1000^2,
$$

则小幅加费 $\Delta c$ 的一阶预测为

$$
\Delta\langle Q\rangle
\approx-\beta\,\mathrm{Var}(Q)\,\Delta c.
$$

这提供了一种“无需重新扰动模型的局部敏感性分析”：只要基准样本来自所设定的指数族，就能用现态协方差估计参数导数。它也适合用来核对仿真或自动微分结果，详见 [[参数扰动与城市系统响应敏感性]]。

但这个映射是**概率结构的对应**，不是城市与热浴之间的真实热力学等价：

- $\beta$ 是模型的敏感度或尺度参数，不自动等于 $1/(k_BT)$；
- 流量方差是城市状态的统计波动，不自动等于热涨落；
- 上式给出所设模型中的局部响应，不自动识别现实政策的因果效应；
- 方差较大意味着该指数族模型的局部敏感度较大，但仅凭这一点不能断言城市处于物理临界点；
- 有限幅度加费仍需检查非线性、行为适应、分布外推和参数重估。

城市映射真正可迁移的洞见是：**当参数通过一个统计量重新加权状态时，目标量对该参数的局部敏感度由二者的协方差控制。** 这是一条模型内的可检验关系，而不是把城市直接称为热力学系统的理由。

---

## 6. 核心答案：两条路线共享什么？

本章的核心答案可以表述得很精确：平衡动力学中，自发涨落与线性响应受到同一热浴的共同约束；平衡指数族中，参数重加权又使静态响应成为协方差。二者都允许我们从未受扰动的数据预测局部响应，但物理依据与适用范围不同。

共同原则是：未受扰动数据之所以能预测局部响应，不是因为“波动大就一定更敏感”，而是因为概率权重或平衡动力学给出了可推导的约束。离开这些条件，涨落仍然可以测量，却不再自动携带响应或耗散的含义。

---

## 学习与验收

### 推荐学习顺序

1. 先完成第 1–4 节，能够区分动态 FDT 与静态协方差恒等式。
2. 再阅读城市映射，并明确哪些结论来自指数族结构、哪些不能解释为真实热力学。
3. 打开网页 [`/exercises/notebooks/E05_sensitivity_od`](/exercises/notebooks/E05_sensitivity_od) 验证“协方差给出局部敏感度”；需要复现实验细节时再运行本地 `exercises/notebooks/E05_sensitivity_od.ipynb`。
4. 最后用自相关时间、有效样本量与 blocking 检查数值误差。

### 参考文献

- **Einstein 1905**：Brownian Motion。导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M5-Einstein1905-Brownian`）。
- **Kubo 1957**：Linear Response Theory。导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M5-Kubo1957`）。

### 数值误差：相关样本不等于独立样本

用 MCMC 或时间序列估计 $\langle A\rangle$、$\mathrm{Var}(A)$ 与 $\mathrm{Cov}(A,B)$ 时，样本通常相关。若采用

$$
\tau_{\mathrm{int}}=1+2\sum_{k\ge 1}\rho_A(k)
$$

定义积分自相关时间，则常用近似为

$$
ESS\approx\frac{N}{\tau_{\mathrm{int}}},
\qquad
\mathrm{SE}(\bar A)\approx
\sqrt{\frac{\mathrm{Var}(A)}{ESS}}.
$$

不同文献对 $\tau_{\mathrm{int}}$ 的因子 $2$ 约定可能不同，使用公式前必须先核对定义。分块平均与可复现做法见 [[MCMC 误差估计 自相关时间与 Blocking]]。

### 必读与练习

- [ ] **Reading Guide**：[[Einstein_1905_Brownian]]（Abstract 与 Introduction）
  - 重点理解 $D=k_BT/\gamma$ 如何把扩散与阻力联系起来。
- [ ] **Written**：`exercises/written/M5_fluctuation_response.md`
  - 证明：对于 $p(x)\propto e^{-\lambda x}$，有 $\partial_\lambda\langle x\rangle=-\mathrm{Var}(x)$。
- [ ] **Interactive (Web)**：[`/exercises/notebooks/E05_sensitivity_od`](/exercises/notebooks/E05_sensitivity_od)
  - 比较数值微分得到的敏感度与基准样本估计的协方差；两者不一致时，优先检查符号约定、有限差分步长、采样误差与代码实现。

### 自检问题

1. Einstein 关系 $D=k_BTb$ 如何从平衡态无净通量 $J=0$ 推出？
2. Onsager 回归关系与静态公式 $\partial_\lambda\langle A\rangle=\beta\mathrm{Cov}(A,B)$ 分别回答什么问题？
3. 为什么热容公式中出现 $\mathrm{Var}(E)$，而交叉响应通常出现 $\mathrm{Cov}(A,B)$？
4. 为什么一个概率分布已经达到稳态，仍然不能保证满足平衡 FDT？
5. 城市指数族中的 $\beta$、方差和响应为什么不能自动解释为温度、热涨落和真实政策因果效应？
6. 当加费幅度不再很小时，为什么不能只使用基准点的一次协方差估计？

### 验收标准

- [ ] 能用胶体粒子的两次实验解释 Einstein 关系，并说明平衡热浴在其中的作用。
- [ ] 能区分动态涨落—响应关系与静态响应—协方差恒等式，不再把二者笼统写成同一个公式。
- [ ] 遇到指数族分布时，能先确认参数耦合的正负号，再判断响应对应方差还是协方差。
- [ ] 能说明平衡、稳态、线性响应与有限扰动之间的边界。
- [ ] 能把城市映射表述为指数族的结构对应，而非真实热力学等价。
- [ ] 能用积分自相关时间与有效样本量为协方差估计提供可信误差条。
