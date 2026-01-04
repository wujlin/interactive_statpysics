# M3 正则系综与配分函数 Z

> **核心目标**：告别痛苦的组合数计算。掌握**配分函数**（Partition Function, Z）这一超级工具。只要算出了 \(Z\)，所有热力学量（\(F, S, U, P\)）都只是它的导数。这是统计物理中最常用的系综。

## 推荐学习顺序
1. 通读本文 Part 1–4，理解为什么 \(Z\) 被称为“生成函数”。
2. 做 `exercises/written/M3_lnZ_derivatives.md`，亲手证明 \(\langle E \rangle = -\partial_\beta \ln Z\)。
3. 对照 Swendsen Chapter 19（`ch19.md`），跟着走完“复合系统推导 \(\Rightarrow Z \Rightarrow F\)”。

## 背景最小包（First Principles）
- 现实系统几乎总与环境交换能量，能量“可波动”比“精确固定”更真实。
- “软约束 + 最大熵”自然导出指数权重，这就是 Boltzmann 形式的来源。
- 一旦写出 \(Z\)，热力学量就变成**可导的函数**而不是难算的几何计数。

## 逻辑桥接（M2 → M3）
- M2 的微正则把能量固定在壳上；M3 把硬约束改成“与热库交换”的软约束。
- 这一步不是换符号，而是把“计数问题”转成“生成函数问题”。

---

## Introduction

在 M2（微正则系综）中，我们从孤立系统出发：当系统能量被严格固定在 \(E\)（或一个极窄能壳）时，满足该能量约束的微观态等概率出现，熵由
\[
S(E)=k_B\ln \Omega(E)
\]
定义，其中 \(\Omega(E)\) 是能量约束下可实现微观态的“体积/数目”（见：[[多重度 multiplicity Ω]]）。这个框架在概念上非常干净，却立刻带来一个现实且普遍的瓶颈：对绝大多数真实系统而言，\(\Omega(E)\) 对应的是高维相空间里一个极薄能壳的测度，**既难以解析计算，也不利于数值处理**；更关键的是，实验中的系统几乎不可能与外界完全隔离，能量通常只是在某个平均值附近涨落，“能量严格等于 \(E\)”本身就带有强烈理想化色彩。

Gibbs（1902）的概念飞跃在于：与其执着于“把系统用硬墙隔离并强行固定能量”，不如把系统视为与一个巨大**热库**（Heat bath / reservoir）弱耦合。热库的作用不是把系统钉死在某个 \(E\)，而是通过温度 \(T\)（等价地，通过 \(\beta=1/(k_BT)\)）对能量涨落施加统计意义上的约束。于是，原先的硬约束 \(E=\text{const}\) 被替换为软约束（给定 \(T\) 或 \(\beta\)），微观态的“平权”也随之转变为“按能量指数加权”：
\[
p_i=\frac{e^{-\beta E_i}}{Z(\beta)},\qquad
Z(\beta)=\sum_i e^{-\beta E_i}.
\]
这里的配分函数 \(Z\) 成为新的核心计算对象：它把原本困难的“在能量壳上计数/积分”问题，转化为在全空间上进行更可控的指数加权求和（或积分）。同时，热力学也获得了一个与之相连的可计算势函数：自由能
\[
F(T)=-k_BT\ln Z,
\]
它与微正则的 \(S(E)\) 通过 Legendre 变换对应，从而让统计物理真正具备了系统性处理复杂系统的计算能力。

这种“从硬约束到软约束”的转变，在城市系统中有非常自然的镜像。建模出行选择时，我们几乎不可能硬性规定“全城总通勤成本必须精确等于某个 \(C\)”（类似微正则）；相反，经验上更稳定、也更可观测的是人们对时间/金钱成本的**敏感度参数** \(\beta\)。在这一设定下，不同出行方案的选择概率同样呈指数加权形式：
\[
P(\text{choice})\propto e^{-\beta\cdot \text{Cost}},
\]
这正是离散选择理论中的 Logit 结构。对应地，\(Z=\sum e^{-\beta\cdot \text{Cost}}\) 将所有备选方案“汇总”到一个系统级量上，而 \(\ln Z\)（常见的 logsum 形式）可以自然解释为总体福利/可达性（Accessibility）等聚合指标的数学载体（见：[[Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能]]）。

从更抽象的角度看，MaxEnt 与正则系综并不是两条互不相干的推导路径：当我们只掌握两类信息——（i）概率归一化；（ii）平均能量（或平均成本）——最大熵原理给出的“最无偏”分布必然属于指数族；而“系统 + 热库”的物理推导得到的恰是同一个指数形式。二者之所以完全一致，不是巧合，而是因为它们本质上**编码的是同一组约束信息，只是表述语言不同**（见：[[MaxEnt 与正则系综等价（信息等价）]]）。

## References
- **Gibbs 1902**: *Elementary Principles in Statistical Mechanics*. 导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M3-Gibbs1902`）。

---

## Part 1：从“孤家寡人”到“与邻为伴”

M2 里的系统是**孤立**的（Energy fixed），这叫微正则。但现实中大部分系统都与环境交换能量（Temperature fixed）。
当我们把一个小系统与一个巨大的**热库**（Reservoir）耦合时，小系统处于某个微观态 \(i\) 的概率不再相等，而是取决于它的能量 \(E_i\)：

\[ p_i = \frac{1}{Z} e^{-\beta E_i} \]

这里的 \(\beta = 1/k_B T\) 是热库“强加”给系统的温度参数。能量越低的状态，概率越大；温度越高（\(\beta\) 越小），高能态的机会就越多。

推导细节见 [[正则系综 Canonical ensemble]]；为什么微正则与正则在大系统极限下给出相同的宏观预测，可先从 [[热力学极限 Thermodynamic limit]] 的集中性结论理解。

---

## Part 2：配分函数 Z：归一化常数与生成函数

\[ Z = \sum_i e^{-\beta E_i} \]

乍一看 \(Z\) 只是个归一化常数（为了让 \(\sum p_i = 1\)）。但它其实是**生成函数（Generating Function）**。
这就好比你有一个多项式 \(f(x) = \sum a_n x^n\)，它的系数 \(a_n\) 藏着信息。对 \(Z\) 而言：
- 取对数：\(F = -k_B T \ln Z\)（直接得到自由能！）
- 求一阶导：\(\langle E \rangle = -\frac{\partial \ln Z}{\partial \beta}\)（得到内能）
- 求对体积导数：\(P = k_B T \frac{\partial \ln Z}{\partial V}\)（得到压强）

**记住：Z 知道一切。** 你不需要去分别对 \(E\) 或 \(P\) 积分，你只需要把 \(Z(\beta, V, N)\) 算出来，然后求导就行了。

更关键的一点是：\(F\) 不是“另起炉灶的新量”，而是一个真正的**势函数**。一方面，\(F(T,V,N)\) 以 \((T,V,N)\) 为自然变量，通过偏导直接生成 \(S,P,\mu\)；另一方面，在固定 \((T,V,N)\) 的实验条件下，自发过程让 \(F\) 降低、平衡态对应 \(F\) 的最小值（这就是势函数的极值判据）。这些基本关系与 Legendre 变换的热力学版本见：[[热力学势 Thermodynamic potentials]]、[[Legendre 变换 从 U 到 F 到 G]]。

如果你还想把 “\(F=-k_BT\ln Z\)” 和微正则的 “\(S(E)=k_B\ln\Omega(E)\)” 接到同一条线上：配分函数可以看作对 \(\Omega(E)\) 的指数加权计数 \(Z(\beta)=\int dE\,\Omega(E)\,e^{-\beta E}\)。在热力学极限下，这个积分由鞍点主导，等价于对 \(E-TS(E)\) 做极小化，从而得到 \(F(T)\approx \min_E[E-TS(E)]\)。详见：[[F=-kT ln Z 与 S(E) 的 Legendre 对偶（势函数视角）]]。

Swendsen Chapter 19（例如 Eq 19.53–19.60）给出了从 \(\ln Z\) 导出 \(U\) 与涨落/热容的标准路径，可用来逐步对照符号与负号。

---

## Part 3：涨落与响应——硬币的两面

正则系综里的能量不是常数，它在涨落。
你可能会问：“**既然能量在变，凭什么用热力学内能 \(U\)（一个定值）来代表它？**”

答案在于**大数定律**。相对涨落 \(\frac{\sigma_E}{\langle E \rangle} \sim \frac{1}{\sqrt{N}}\)。对于 \(10^{23}\) 个粒子，涨落极小，可以忽略。
但这个涨落本身极为重要，它与系统的**热容**（Heat Capacity）直接相关：
\[ \text{Var}(E) = k_B T^2 C_V \]
这就是著名的**涨落-耗散定理**的雏形：**宏观上对温度变化的“响应能力”（热容），本质上源于微观上能量的“自发涨落”。**

更系统的表述与通用模板见：[[涨落-响应 Fluctuation-response]]。

### Interactive：两能级系统（Schottky anomaly）
调节温度与简并度 \(g_1\)，观察 \(Z\)、\(U\) 与 \(C_V\) 如何由同一个 \(Z\) 生成；热容曲线会出现典型的单峰（Schottky anomaly）。

<InteractiveConcept type="two-level-schottky" />

推导（不跳步）见：[[两能级系统的配分函数与 Schottky anomaly（热容单峰）]]。

---

## Part 4：城市映射——离散选择 (Logit)

在城市模型中，正则系综对应着最经典的 **Logit 模型（Multinomial Logit, MNL）**。
- **微观态**：个体的选择（如：选哪条路，买哪个房）。
- **能量 \(E\)**：广义成本（时间、票价、舒适度）。
- **温度 \(\beta\)**：选择的敏感度（或不理性程度）。
- **配分函数 \(Z\)**：分母上的 \(\sum e^{-\beta C_i}\)。

在交通与城市经济里，logit 的 logsum / inclusive value 通常写成 \(\frac{1}{\beta}\ln Z\)（与效用/成本处于同一量纲；在标准 i.i.d. Gumbel 误差假设下，它与 \(\mathbb E[\max U]\) 仅差一个与选项无关的常数）。因此它不是“把效用直接相加”的总价值，而是一个**对所有选项做指数加权后的聚合势**：新增更优选项、或降低成本，会让 \(Z\) 变大，从而提升 logsum（等价地让自由能 \(F=-(1/\beta)\ln Z\) 下降）。

跨学科对照与“势/自由能”解释见：[[Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能]]。

### Interactive：Logit/配分函数直觉
调节 \(\beta\)（成本敏感度）观察概率如何从“均匀”向“极化”收缩；同时看 \(Z\) 与 log-sum-exp 如何随之变化。

<InteractiveConcept type="logit-partition" />

## 通往下一章（M4）
- 如果系统规模 \(N\) 也在波动（开放系统），就需要把“粒子数约束”也变成软约束。
- M4 将引入化学势 \(\mu\) 与巨配分函数 \(\mathcal{Z}\)，完成对“规模可变”系统的统一描述。

---

## Part 5：动手时刻 (Checklist)

### 必读
- [ ] **Reading Guide**: [[Swendsen_Ch19_Canonical]]（Chapter 19）
  > 以本仓库扫描版 `\\tag {19.xx}` 为准；重点看 \(Z\) 与 \(F\) 的桥接。
- [ ] **Seminal Paper**: Gibbs 1902 的前言（可选）。

### 习题
- [ ] **Written**: `exercises/written/M3_lnZ_derivatives.md`
  - 核心任务：证明 \(\langle E \rangle = -\partial_\beta \ln Z\) 和 \(\text{Var}(E) = \partial^2 \ln Z\)。
- [ ] **Interactive**: 两能级系统的 \(Z\) 与 \(C_V(T)\)（本页上方交互图）
- [ ] **Notebook（可选，用于复现）**: `exercises/notebooks/E03_canonical_analytic.ipynb`
  - 同一模型的解析推导与作图代码（可在本地 Jupyter 复现）。

### 验收标准
- [ ] 给你一个能级谱 \(E_n = n\epsilon\)，能立刻写出 \(Z\) 的几何级数求和形式。
- [ ] 看到 \(F = -kT \ln Z\)，能反应出这是从微观通向宏观的桥梁。
- [ ] 理解为什么城市交通里的 Logit 公式分母就是配分函数。
