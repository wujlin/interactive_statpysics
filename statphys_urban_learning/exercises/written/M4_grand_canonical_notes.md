---
type: exercise
id: M4_written
title: M4：同一最小 KL/最大熵引擎（巨正则规模与 OD 乘子）
difficulty: 3
tags: [grand-canonical, chemical-potential, maxent, od]
---

# M4 习题：同一最小 KL/最大熵引擎（巨正则规模与 OD 乘子）

> 本章只做一件事：用同一个推断引擎解释两类现象——  
> 1) **巨正则**：\(\mu\) 如何控制规模 \(N\)，以及为什么 \(\partial \ln\mathcal{Z}\) 会吐出 \(\langle N\rangle\)、\(\mathrm{Var}(N)\)；  
> 2) **OD**：为什么“边际约束 + 最小 KL”必然得到乘子形式 \(T_{ij}=a_i b_j Q_{ij}\)。

> 这两件事表面上在讲不同语言（“配分函数导数” vs “最小 KL 优化”），但本质上是一条链：  
> **最小 KL（或最大熵）\(\Rightarrow\) 指数族 \(\Rightarrow\) normalizer（配分函数）\(\Rightarrow\) \(\ln Z\) 的导数生成均值与协方差**。

> 记号约定：本仓库统一把**巨配分函数**写作 \(\mathcal{Z}\)（不要与固定 \(N\) 的正则配分函数 \(Z_N\) 混淆）；完整符号表见：[[符号约定与映射（本仓库统一：Swendsen 体系）]]。

> 术语提示：  
> - KL：Kullback–Leibler 散度（相对熵）。  
> - OD（Origin–Destination，起点→终点）：矩阵 \(T_{ij}\) 表示从区域 \(i\) 到 \(j\) 的流量。  
> - 乘子形式：在边际约束下最小化 \(KL(T\|Q)\) 的解必然写成 \(T_{ij}=a_i b_j Q_{ij}\)，其中 \(a_i,b_j\) 来自拉格朗日乘子（也是 IPF/RAKING 的起点）。

## 题目

### (0) 通用引擎题：最小 KL（或最大熵）\(\Rightarrow\) 指数族 + \(\ln Z\) 生成均值与协方差

在一个有限状态空间 \(\mathcal{Z}\) 上，给定 prior \(q(z)>0\)（可理解为“你愿意默认相信的基线”）。我们想在满足约束的前提下，找一个“尽量不自作主张”的分布 \(p(z)\)。

考虑问题：
\[
\min_{p}\; KL(p\|q)
\quad\text{s.t.}\quad
\sum_{z\in\mathcal{Z}} p(z)=1,\;\;
\mathbb{E}_p[f_k(z)]=F_k\ (k=1,\dots,K).
\]
其中
\[
KL(p\|q)=\sum_{z\in\mathcal{Z}} p(z)\ln\frac{p(z)}{q(z)}.
\]

请你**完整推导**（不允许跳步）并给出三个结论：

1. 最优解是指数族
   \[
   p_\lambda(z)=\frac{1}{Z(\lambda)}\,q(z)\exp\!\Big(\sum_{k=1}^K \lambda_k f_k(z)\Big),
   \qquad
   Z(\lambda)=\sum_{z} q(z)\exp\!\Big(\sum_{k} \lambda_k f_k(z)\Big).
   \]
2. \(\ln Z(\lambda)\) 的一阶导生成约束的期望（写清楚对谁求导、保持什么不变）：
   \[
   \frac{\partial}{\partial \lambda_k}\ln Z(\lambda)=\mathbb{E}_{p_\lambda}[f_k(z)].
   \]
3. \(\ln Z(\lambda)\) 的二阶导生成协方差：
   \[
   \frac{\partial^2}{\partial \lambda_k\partial \lambda_\ell}\ln Z(\lambda)
   =\mathrm{Cov}_{p_\lambda}(f_k,f_\ell).
   \]

> 一句话解释：当 \(q\) 取均匀分布时，上面就等价于“最大熵（MaxEnt）”。

---

### (1) 应用 A：巨正则分布（把模板套进去）

对一个可变粒子数/规模的系统，写出巨正则分布：

- 写出 \(p(x,N)\) 的比例形式（包含 \(E(x,N)\)、\(\mu N\)、\(\beta\)）
- 写出巨配分函数 \(\mathcal{Z}(\beta,\mu)\) 的定义（求和对哪些变量）

### (2) 应用 A 继续：\(\ln\mathcal{Z}\) 的导数 \(\Rightarrow\) 平均规模与涨落

令 \(y=\beta\mu\)。请推导并写清楚“对哪个变量求导（保持什么不变）”（提示：这就是 (0) 的结论在 \(f=N\) 上的特例）：

- \(\langle N\rangle = \partial_y \ln\mathcal{Z}\)
- \(\mathrm{Var}(N) = \partial_y^2 \ln\mathcal{Z}\)

### (3) 应用 B：OD（边际约束 + 最小 KL）\(\Rightarrow\) 乘子形式 \(T_{ij}=a_i b_j Q_{ij}\)

在 OD（Origin–Destination，起点→终点）推断中，令 \(T_{ij}\ge 0\) 满足边际：
\(\sum_j T_{ij}=O_i\)，\(\sum_i T_{ij}=D_j\)。  
假设我们最小化
\[
KL(T\|Q)=\sum_{ij}T_{ij}\ln\frac{T_{ij}}{Q_{ij}},
\]
其中 \(Q_{ij}>0\) 是 prior（可取 \(Q_{ij}=\exp(-\beta c_{ij})\)）。

请你写出拉格朗日函数并推到一阶条件，得到：
\[
\boxed{\;T_{ij}=a_i b_j Q_{ij}\;}
\]
要求：
1. 明确写出对 \(T_{ij}\) 求导时用到的恒等式 \(\partial(T\ln T)/\partial T=\ln T+1\)。  
2. 解释清楚：为什么乘子（因此 \(a_i\)）只能依赖 \(i\)，另一个乘子（因此 \(b_j\)）只能依赖 \(j\)（这一步就是“边际约束 \(\Rightarrow\) 结构被迫分离”）。

### (4) 应用 B 继续：\(\beta\) 的意义（无成本 prior vs 带成本 prior）

1. 当 \(Q_{ij}\) 为常数（无成本 prior）时，推导出一个显式基线解：
   \[
   T_{ij}=\frac{O_i D_j}{\sum_i O_i}\quad (\text{提示：}\sum_i O_i=\sum_j D_j).
   \]
   并用一句话解释它的含义（为什么它是“最少偏见”的基线）。
2. 当 \(Q_{ij}=\exp(-\beta c_{ij})\)（带成本 prior）时，把目标写成“熵项 + \(\beta\)×成本项”的权衡，并回答：\(\beta\) 增大通常会让哪些统计量朝哪个方向变化？至少写两条（例如平均成本、长距离流占比、跨区比例、集中度、矩阵熵等）。

### (5) 加深题（巨正则的“可计算落点”）：理想气体 \(\langle N\rangle\)、密度 \(n\) 与化学势 \(\mu\)

考虑经典理想气体（无相互作用、单原子）在巨正则系综 \((T,V,\mu)\) 下的平衡。设密度
\[
n\equiv \frac{\langle N\rangle}{V}.
\]
请推导并得到：
\[
\boxed{\ \mu = k_B T\ln(n\lambda_T^3)\ }.
\]
其中热德布罗意波长（thermal de Broglie wavelength）
\[
\lambda_T \equiv \frac{h}{\sqrt{2\pi m k_B T}}.
\]

你需要写清楚每一步“从哪里来”，建议按以下链条组织：
1. 先算单粒子正则配分函数 \(Z_1(T,V)\)（相空间积分，给出 \(Z_1=V/\lambda_T^3\)）。
2. 用“无相互作用 + 不可分辨粒子”得到 \(Z_N=Z_1^N/N!\)。
3. 把 \(Z_N\) 塞进巨配分函数 \(\mathcal{Z}=\sum_N e^{\beta\mu N}Z_N\)，并把它化简成指数形式。
4. 用 \(\langle N\rangle=(1/\beta)\,(\partial_\mu \ln\mathcal{Z})_{T,V}\) 得到 \(n\) 与 \(\mu\) 的关系。

---

## 提示（先做 30–45 分钟再看）

- (0) 拉格朗日乘子法：对每个 \(p(z)\) 求偏导并令 0，最后用归一化把常数吸收到 \(Z(\lambda)\) 里。
- (1) 写成一句话：\(\text{概率}\propto \exp(-\beta(E-\mu N))\)。
- (2) 先写出 \(\mathcal{Z}=\sum_{N}\sum_x \exp(-\beta E(x,N)+yN)\)，然后对 \(y\) 求导；注意 \(\partial_y \ln\mathcal{Z}=(1/\mathcal{Z})\partial_y \mathcal{Z}\)。
- (3) 边际约束只涉及“整行/整列”，所以乘子只能分别依赖 \(i\) 或 \(j\)，这会强迫指数项分离成“只含 \(i\)”与“只含 \(j\)”两部分，从而得到 \(a_i b_j\)。
- (4) 用 \(-\ln Q_{ij}=\beta c_{ij}\) 把 \(KL(T\|Q)\) 改写成“熵项 + \(\beta\)×成本项”的形式。
- (5) 先得到 \(Z_1=V/\lambda_T^3\)，再用 \(\mathcal{Z}=\sum_N (e^{\beta\mu}Z_1)^N/N!\) 识别为指数函数；最后用 \(\langle N\rangle=(1/\beta)\partial_\mu\ln\mathcal{Z}\)。

---

## 自检（Self-Check）

- [ ] (0) 你是否写出了指数族形式，并且能明确指出 \(Z(\lambda)\) 的角色是“归一化常数（配分函数）”？
- [ ] (0) 你是否能从 \(\partial_{\lambda_k}\ln Z\) 得到 \(\mathbb{E}[f_k]\)，并从 Hessian 得到协方差？
- [ ] (1) 你的指数里是否是 \(-\beta E + \beta\mu N\)（或等价写法）？\(\beta\mu\) 应该和 \(N\) 成对出现。
- [ ] (2) 你能从 \(\partial_y^2\ln\mathcal{Z}\) 得到一个方差（非负）吗？
- [ ] (3) 你能用一句话解释：为什么 \(a_i\) 只能依赖 \(i\)，\(b_j\) 只能依赖 \(j\)？
- [ ] (4) 你是否把目标写成了“熵项 + \(\beta\)×成本项”，并能说清 \(\beta\) 增大时的方向性变化？
- [ ] (5) 你是否得到 \(n=\exp(\beta\mu)/\lambda_T^3\)，从而 \(\mu=k_BT\ln(n\lambda_T^3)\)？

---

## 参考解答

👉 [查看参考解答](../solutions/M4_solution.md)（建议自己推导完成后再核对）

## Source anchors
- Swendsen Eq 20.9：\(P(E,N)=(1/\mathcal{Z})\,\Omega\,e^{-\beta E+\beta\mu N}\)
- Swendsen Eq 20.12：\(\mathcal{Z}(T,V,\mu)=\sum_N Z(T,V,N)e^{\beta\mu N}\)
