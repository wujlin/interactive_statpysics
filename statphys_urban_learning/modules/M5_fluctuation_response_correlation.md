# M5 涨落—响应—相关（不确定性与敏感性）

> **核心目标**：从 M5 开始，我们不仅仅关心“平均值”，我们更关心“误差条”和“敏感度”。统计物理最深刻的结论之一是：**系统的自发涨落（Fluctuation）与它对外界扰动的响应（Response）是同一回事。** 掌握这一点，你就在某种意义上打通了平衡态与非平衡态的桥梁。

## 推荐学习顺序
1. 通读本文，先抓住一句话：在平衡指数族里，**敏感度由协方差决定**（Part 3）。
2. 再用两个锚点把直觉钉牢：Onsager 回归（Part 1）与 Einstein 关系（Part 2）。
3. 做一次数值验收：打开网页 [`/exercises/notebooks/E05_sensitivity_od`](/exercises/notebooks/E05_sensitivity_od)（内嵌动画）验证“无需重跑的敏感性分析”；需要复现实验细节时再运行本地 `exercises/notebooks/E05_sensitivity_od.ipynb`，并用自相关时间与有效样本量（ESS）给出可信的误差条。

---

## Introduction

前面几章训练的是“从势函数读出平均值”：给定 \(Z\) 或 \(\ln Z\)，你能算出 \(\langle E\rangle\)、\(\langle N\rangle\) 等宏观量。但科研里真正会逼你犯错的，往往不是“平均值算错了”，而是两个更锋利的问题：
1) 这个结论有多稳？（有没有误差条）  
2) 你轻轻改一下参数/政策，结论会不会翻盘？（敏感度/弹性）

M5 的概念飞跃是把这两件事合并成一条可计算的主线：在平衡系综（指数族）里，\(\ln Z\) 不是“分母的对数”，而是**累积量生成函数**；一阶导给均值，二阶导给协方差（见：[[涨落-响应 Fluctuation-response]]、[[协方差与二阶导（通用）]]）。因此很多“扰动实验”可以被替换成“观察涨落”：你不必真的去推系统一下，先在平衡态里量到它怎么抖，就能估计它会怎么响应——更精确地说，响应是 \(\mathrm{Cov}(\cdot,\cdot)\) 乘上一个与参数约定有关的系数（例如 \(\beta\)），见 Part 3。

这句话也必须带着边界条件：它通常依赖**平衡/近似平衡**与**线性响应**；超出范围就必须写出动力学与非平衡理论（后续 M8/M9）。同时它也带着数值底线：如果你用 MCMC 采样，样本会相关，误差不会按 \(1/\sqrt{N}\) 下降；你必须报告自相关时间与有效样本量（effective sample size, ESS），并用 blocking（分块平均）等方法给出可信误差条（见：[[MCMC 误差估计 自相关时间与 Blocking]]）。

## References
- **Einstein 1905**: Brownian Motion. 导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M5-Einstein1905-Brownian`）。
- **Kubo 1957**: Linear Response Theory. 导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M5-Kubo1957`）。

## 路标：三种“涨落”叙事别混

你会在文献里反复看到“fluctuation …”这类词，但它们在问的问题并不相同。本章把它们拆成三条清晰的叙事线（并分别落在对应的 Part）：

- **扩散–涨落**（Diffusion–Fluctuation，涌现）：宏观扩散律如何从微观随机游走的统计规律里长出来？锚点是均方位移定义 \(D\)：\(\langle (x(t)-x(0))^2\rangle=2Dt\)（见 Part 2 开头）。
- **涨落–耗散**（Fluctuation–Dissipation，平衡与代价）：系统明明在“被热噪声推着抖”，为什么不会无限加速？答案是平衡要求“扩散流”和“漂移流”精确抵消，从而把噪声强度与摩擦/迁移率绑在一起：\(D=k_BT\,b=k_BT/\zeta\)（见 Part 2 的平衡推导）。
- **涨落–响应**（Fluctuation–Response，敏感度与信息）：外参轻微改变时，平均量会变多少？是否必须真的去“扰动实验”才能知道？在平衡指数族里不必：\(\partial_\lambda\langle A\rangle=\beta\,\mathrm{Cov}(A,B)\)（见 Part 3）。

---

## Part 1：Onsager 的回归假说——自发与受迫

想象一个弹簧摆。
1. **受迫情形**：你用手把它拉离平衡位置 \(x_0\)，松手后，它会以某种规律（指数衰减或振荡）回到平衡。
2. **自发情形**：你完全不碰它，但由于空气分子的热撞击，它也会在平衡位置附近微小抖动（涨落）。

Onsager (1931) 提出了一个惊人的假设：**宏观偏离的衰减规律，与微观自发涨落的衰减规律是一模一样的。**
这意味着：我们不需要真的去“踢”系统一脚来通过实验测量它的恢复系数；我们只需要安安静静地观察它在平衡态的抖动（自相关函数），就能预测它受扰动后的行为。

> 👉 **深入理解**：
> - [[相关函数 Correlation function]]：数学定义。

---

## Part 2：Einstein 关系——扩散就是耗散

Part 1 讲的是“时间结构”：系统自发涨落的回归速率，可以用来预测它被轻微扰动后的回到平衡的速率。接下来一个更直接的问题是：**涨落的幅度**和**响应的强度**能否用同一个数联系起来？Einstein 关系给出最干净的答案。

### 2.1 扩散–涨落：用 \(D\) 把“乱抖”量化

先定义扩散系数 \(D\)（它只回答“系统自己有多乱抖”）：
- **扩散系数** \(D\)：无外力时，粒子位置满足（1D 记号）
  \[
  \langle (x(t)-x(0))^2\rangle = 2Dt.
  \]
  它量化“系统自己乱抖”的强度。

### 2.2 涨落–耗散：用 \(b\) 把“你推它一下有多听话”量化

接着定义迁移率 \(b\)（它只回答“外力一来，平均漂移有多强”）：
- **迁移率** \(b\)（mobility）：给一个很小的恒力 \(F\) 时，粒子会产生平均漂移速度 \(v\)，在线性响应区定义
  \[
  v=bF,\qquad b:=\lim_{F\to 0}\frac{v}{F}.
  \]
  它量化“系统被你推一下有多听话”。

那 \(b\) 为什么会突然出现？因为它就是“响应”最小的一种写法：**外力 \(\to\) 平均漂移速度**。在低雷诺数（Stokes）区，阻力线性近似为
\[
F_{\mathrm{drag}}=-\zeta v,
\]
\(\zeta\) 称为摩擦/阻力系数（注意：这里是 \(\zeta\)（zeta），不是相关长度 \(\xi\)（xi）；例如球形粒子在黏度 \(\eta\) 的流体里有 \(\zeta=6\pi\eta r\)）。稳态下外力与阻力平衡 \(F+F_{\mathrm{drag}}=0\)，因此
\[
v=\frac{F}{\zeta}\quad\Rightarrow\quad b=\frac{1}{\zeta}.
\]
这就解释了你看到的 “\(b\) 大 / \(\zeta\) 小”：阻力越小，单位外力造成的漂移越大，响应越强。

Einstein (1905) 的结论是：
\[
\boxed{\ D = k_B T\, b = \frac{k_B T}{\zeta}\ }.
\]
它是涨落—耗散定理（Fluctuation–Dissipation Theorem，简称 FDT）最早、也最直观的实例：**同一个参数**同时决定“自发抖动的幅度”（\(D\)）与“受迫运动的强度”（\(b\)）。

一个不跳步的推导（Einstein 的平衡论证）是：在外势 \(U(x)\) 下，粒子数密度 \(n(x)\) 的通量可写成“扩散 + 漂移”
\[
J = J_{\mathrm{diff}} + J_{\mathrm{drift}}
= -D\,\partial_x n \;+\; n\,b\,F,
\qquad F=-\partial_x U.
\]
热平衡时没有净通量 \(J=0\)，同时平衡分布满足 \(n(x)\propto e^{-\beta U(x)}\)（\(\beta=1/(k_BT)\)），因此
\[
\partial_x n = -\beta n\,\partial_x U = \beta n F.
\]
代回 \(J=0\)：
\[
0=-D(\beta n F)+n b F \quad\Rightarrow\quad D=\frac{b}{\beta}=k_BT\,b.
\]

**为什么要关心这一段**？因为它把“涨落=响应”从一句哲学断言，变成一个可检验、可复用的计算策略：你可以通过观测系统在平衡态下的随机扩散（无需施加外力），来推断它对外界微小驱动的线性响应强度。Part 3 会把这种结构推广到一般指数族：响应 \(\leftrightarrow\) 协方差（再乘上 \(\beta\)）。

---

## Part 3：涨落-耗散定理 (FDT)——通用的二阶导

Part 2 的 Einstein 关系把一个具体的“涨落强度”（扩散系数 \(D\)）和一个具体的“响应强度”（迁移率 \(b\)）绑在了一起。现在我们要把这件事推广成一个你能在任何模型里复用的模板：**当你把一个外部旋钮 \(\lambda\) 轻轻拧一下，某个宏观量 \(\langle A\rangle\) 会变多少**？在平衡态的指数族分布下，这个导数不需要重复做扰动实验，它可以从同一分布下的协方差直接读出。

### 3.0 先钉层次：涨落不是“微观量”，而是宏观可观测量的随机性

在平衡统计里，**微观态 \(x\)** 是随机的；因此任何写成 \(A(x)\) 的量（包括总能量 \(E(x)\)）都是随机变量。我们口头说的“宏观量”通常指的是它的**均值**，例如内能
\[
U := \langle E\rangle.
\]
而“涨落”指的是**同一个量**在不同微观态下围绕均值的随机波动：
\[
\delta A := A-\langle A\rangle,\qquad
\mathrm{Var}(A)=\langle (\delta A)^2\rangle.
\]

所以你会看到“能量”同时扮演两种角色：\(E(x)\) 是随机变量，\(\langle E\rangle\) 是宏观内能。FDT 要回答的正是它们之间的关系：**平均怎么变（响应）由随机怎么抖（涨落/关联）决定**。

### 3.1 为什么热容里会出现 \(\mathrm{Var}(E)\)？

热容问的是一个非常具体的“响应”问题：温度 \(T\) 轻微改变时，平均能量 \(\langle E\rangle\) 会变多少。关键在于：在正则系综里，\(T\) 不是直接出现在能量里，而是通过
\[
p(x)=\frac{1}{Z(\beta)}e^{-\beta E(x)},\qquad \beta=\frac{1}{k_BT}
\]
重新加权所有微观态：\(T\) 变了，等价于 \(\beta\) 变了，于是每个微观态的权重 \(e^{-\beta E(x)}\) 都被整体“偏置”。

从这里开始，一切都只是“对数配分函数的导数”：

1) 一阶导给平均能量（共轭关系）  
\[
\partial_\beta Z
=\sum_x (-E(x))e^{-\beta E(x)}
\quad\Rightarrow\quad
\partial_\beta \ln Z
=\frac{1}{Z}\partial_\beta Z
=-\langle E\rangle.
\]

2) 二阶导给能量涨落（累积量/连通关联）  
\[
\partial_\beta^2\ln Z
=-\partial_\beta\langle E\rangle
=\langle E^2\rangle-\langle E\rangle^2
=\mathrm{Var}(E).
\]

3) 把 \(\beta\) 的导数换回 \(T\) 的导数，就得到热容  
定容热容定义为
\[
C_V=\left(\frac{\partial\langle E\rangle}{\partial T}\right)_V.
\]
而
\[
\frac{d\beta}{dT}=-\frac{1}{k_B T^2},
\qquad
\frac{\partial\langle E\rangle}{\partial T}
=\frac{\partial\langle E\rangle}{\partial\beta}\frac{d\beta}{dT}
=\big(-\mathrm{Var}(E)\big)\left(-\frac{1}{k_BT^2}\right).
\]
因此
\[
\boxed{\ C_V=\frac{\mathrm{Var}(E)}{k_B T^2}\ }.
\]

这就是“热容里为什么会出现 \(\mathrm{Var}(E)\)”的完整答案：你问的是**平均能量对温度的敏感度**，而温度恰好是“给能量重新加权”的旋钮，所以响应就由同一分布下的能量涨落强度决定。

### 3.2 方差还是协方差？先看旋钮偏好的到底是谁

热容是一个“对角例子”：你拧的旋钮（\(\beta\)）偏好的量就是能量 \(E\)，你问的量也正好是 \(\langle E\rangle\)，所以右边自然退化成方差。更一般地，如果旋钮偏好的是 \(B(x)\)，你关心的是 \(A(x)\)，那么响应就是协方差——这就是 FDT 的通用版。

为了不在正负号上栽跟头，第一步永远是写清楚：旋钮 \(\lambda\) 到底是怎么进入能量（或成本）函数的。我们在本节固定如下约定：\(\lambda\) 通过一项 \(-\lambda B(x)\) 进入能量（\(\lambda\) 越大越偏好 \(B\) 大的状态）：
\[
E_\lambda(x)=E_0(x)-\lambda B(x),
\qquad
p_\lambda(x)=\frac{1}{Z(\lambda)}\exp[-\beta E_\lambda(x)].
\]
在这个约定下（这是最常用、也最不易写错号的写法），一条通用恒等式是：
\[
\boxed{\ \frac{\partial \langle A\rangle}{\partial \lambda}
=\beta\,\mathrm{Cov}(A,B)\ }.
\]
它把“响应”（左边）与“涨落/关联”（右边的协方差）绑在一起；\(\beta\) 出现只是因为我们用 \(e^{-\beta E}\) 作为权重。

这也解释了一个常见误解：你可能经常听到“二阶导给方差”，但更精确的说法是：
- **二阶导给的是协方差矩阵**；
- **方差只是协方差矩阵的对角线**（当你对同一个共轭旋钮求两次导，或做对角元时才出现）。

把这句话写成可操作的判别规则就是：
- 你问“\(\langle A\rangle\) 对偏好 \(B\) 的旋钮 \(\lambda\) 的响应”时：右边是 \(\mathrm{Cov}(A,B)\)；
- 只有当 \(A=B\)（共轭响应）时，\(\mathrm{Cov}(B,B)=\mathrm{Var}(B)\) 才退化成方差。

两行推导（把“不是背公式”落到纸面上）：
\[
\partial_\lambda \ln Z
=\frac{1}{Z}\partial_\lambda Z
=\frac{1}{Z}\sum_x (\beta B(x))\,e^{-\beta E_\lambda(x)}
=\beta\langle B\rangle.
\]
\[
\partial_\lambda \langle A\rangle
=\sum_x A(x)\,\partial_\lambda p_\lambda(x)
=\sum_x A(x)\,p_\lambda(x)\,\beta\big(B(x)-\langle B\rangle\big)
=\beta\big(\langle AB\rangle-\langle A\rangle\langle B\rangle\big).
\]

把 \(A=B\) 代回去，就得到“共轭量对共轭旋钮的响应”：
\[
\boxed{\ \frac{\partial \langle B\rangle}{\partial \lambda}
=\beta\,\mathrm{Var}(B)\ }.
\]
再和上一行 \(\partial_\lambda \ln Z=\beta\langle B\rangle\) 合起来，可得到：
\[
\boxed{\ \partial_\lambda^2 \ln Z
=\beta^2\,\mathrm{Var}(B)\ }.
\]
这就是你在热容、磁化率、可压缩率等经典例子里反复看到“方差”的根源：它们都在问**同一个量对它自己的场（共轭旋钮）的响应**。

> 记号提醒：如果你把参数写进能量的方式是 \(E_\lambda=E_0+\lambda B\)，那么上式右边会多一个负号。为了避免“背公式背错号”，最稳妥的做法是：永远先写出 \(E_\lambda(x)\) 的具体形式，再做一次两行推导核对符号。

三个最常见的“快速验算”例子（帮助你秒判断是方差还是协方差）：
- **热容**（方差）：见上面的 3.1。温度（或 \(\beta\)）直接耦合能量，因此
  \[
  \boxed{\ C_V = \frac{1}{k_B T^2}\mathrm{Var}(E)\ }.
  \]
- **磁化率**（方差）：若外场 \(h\) 通过 \(E_h(x)=E_0(x)-h M(x)\) 耦合到磁化 \(M\)，则
  \[
  \chi := \frac{\partial\langle M\rangle}{\partial h}=\beta\,\mathrm{Var}(M).
  \]
- **交叉响应**（协方差）：同样在 \(E_h=E_0-hM\) 下，如果你问的是“平均能量对外场的响应”，就会出现协方差：
  \[
  \frac{\partial\langle E\rangle}{\partial h}=\beta\,\mathrm{Cov}(E,M).
  \]

把这三行放在一起，你应该形成一个条件反射：
- **方差**是“自响应”（同一个量对它自己的共轭旋钮）；**协方差**是“交叉响应”（你问的量和旋钮偏好的量不同）。
- 观测到的涨落越大（方差/协方差越大），系统对外参的线性响应通常越强；反之则越“刚性”。

> 👉 **核心推导**：
> - [[协方差与二阶导（通用）]]：必会的手推过程。

---

## Part 4：城市映射——敏感性与弹性

我们在城市规划中经常问：“如果过江过路费增加 10 元，交通拥堵会缓解多少？”
- **传统做法**：跑一个复杂的仿真（基于个体的仿真，agent-based simulation），修改参数，重跑一遍，看差值。
- **FDT 视角**：如果你的城市模型是最大熵（指数族）的，你其实不需要重跑。你只需要看**当前状态下**，过江流量的方差（或协方差）是多少。
  - 如果现在流量波动很大（方差大），说明系统处于“临界/敏感”状态，加一点费就会有大反应。
  - 如果流量死板（方差小），说明这是刚性需求，加费也没用。

这就是“无需扰动的敏感性分析”（Sensitivity Analysis without Perturbation）：在模型已经写成指数族之后，**响应可以从现态协方差读出来**。

> 👉 [[参数扰动与城市系统响应敏感性]]：FDT 在城市模型中的直接应用。

---

## Part 5：动手时刻 (Checklist)

### 必读
- [ ] **Reading Guide**: [[Einstein_1905_Brownian]] (Abs & Intro)
  > 点击查看 $D=k_B T/\zeta$ 的原始推导逻辑。

### 习题
- [ ] **Written**: `exercises/written/M5_fluctuation_response.md`
  - 证明：对于 \(p(x) \propto e^{-\lambda x}\)，有 \(\frac{\partial \langle x \rangle}{\partial \lambda} = - \mathrm{Var}(x)\)。
- [ ] **Interactive (Web)**: [`/exercises/notebooks/E05_sensitivity_od`](/exercises/notebooks/E05_sensitivity_od)
  - 验证：数值微分的敏感度是否等于采样估计的协方差（这是检验 BUG 的绝佳手段）；需要复现实验细节时再运行本地 `exercises/notebooks/E05_sensitivity_od.ipynb`。

### 验收标准
- [ ] 能写出 Einstein 关系 \(D \sim b\)（或 \(D \sim 1/\zeta\)），并解释其物理含义。
- [ ] 遇到指数族分布，能立刻反应出“响应 = \(\beta\,\mathrm{Cov}(A,B)\)”与“二阶导 = 协方差矩阵（对角=方差）”。
- [ ] 理解为什么 MCMC 的误差不仅仅取决于样本数 \(N\)，还取决于自相关时间 \(\tau\)。
