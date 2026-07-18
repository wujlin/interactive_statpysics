---
type: solution
id: M5_solution
title: M5 涨落—响应（参考解答）
tags: [fluctuation-response, exponential-family, sensitivity, solution]
---

## (1) 指数族：导数 \(\leftrightarrow\) 协方差（以及 \(\theta=-\lambda\) 的符号转换）

给定
\[
p_\theta(x)=\frac{1}{Z(\theta)}e^{\theta^\top f(x)},\qquad
Z(\theta)=\sum_x e^{\theta^\top f(x)}.
\]

先从 \(\ln Z\) 的一阶导开始（这一步是“生成均值”的入口）：
\[
\frac{\partial\ln Z}{\partial\theta}
=\frac{1}{Z}\frac{\partial Z}{\partial\theta}
=\frac{1}{Z}\sum_x f(x)e^{\theta^\top f(x)}
=\sum_x f(x)p_\theta(x)
=\mathbb{E}_\theta[f(x)].
\]

为了得到二阶导（协方差），先把 \(\partial_\theta p_\theta(x)\) 写清楚：
\[
p_\theta(x)=\frac{e^{\theta^\top f(x)}}{Z(\theta)}
\quad\Rightarrow\quad
\partial_\theta p_\theta(x)=p_\theta(x)\Big(f(x)-\mathbb{E}_\theta[f(x)]\Big).
\]

对期望求导（允许把导数搬进求和），得到：
\[
\frac{\partial}{\partial\theta}\mathbb{E}_\theta[f(x)]
=\sum_x f(x)\,\partial_\theta p_\theta(x)
=\sum_x f(x)\,p_\theta(x)\Big(f(x)-\mathbb{E}_\theta[f(x)]\Big)^\top.
\]
整理成矩阵形式就是协方差：
\[
\frac{\partial^2\ln Z}{\partial\theta\,\partial\theta^\top}
=\frac{\partial}{\partial\theta}\mathbb{E}_\theta[f(x)]
=\mathbb{E}_\theta\!\big[f(x)f(x)^\top\big]-\mathbb{E}_\theta[f(x)]\,\mathbb{E}_\theta[f(x)]^\top
=\mathrm{Cov}_\theta(f,f).
\]

因此得到
\[
\boxed{\;\frac{\partial}{\partial\theta}\mathbb{E}_\theta[f(x)]
=\mathrm{Cov}_\theta(f,f)\;}
\]
一维情况下就是 \(\partial_\theta \mathbb{E}[f]=\mathrm{Var}(f)\ge 0\)。

接下来把它转换成题目要求的“物理记号”：令 \(\theta=-\lambda\)，则
\[
p_\lambda(x)=\frac{1}{Z(\lambda)}\exp\big(-\lambda^\top f(x)\big),
\qquad
Z(\lambda)=\sum_x \exp\big(-\lambda^\top f(x)\big).
\]
这时一阶导变为（可以直接对上式求导，也可以用链式法则 \(\partial_\lambda=-\partial_\theta\)）：
\[
\frac{\partial\ln Z}{\partial\lambda}
=\frac{1}{Z}\sum_x \big(-f(x)\big)e^{-\lambda^\top f(x)}
=-\sum_x f(x)p_\lambda(x)
=-\mathbb{E}_\lambda[f(x)].
\]
二阶导号不变（两个负号相消）：
\[
\frac{\partial^2\ln Z}{\partial\lambda\,\partial\lambda^\top}
=\mathrm{Cov}_\lambda(f,f).
\]
由 \(\mathbb{E}_\lambda[f]=-\partial_\lambda \ln Z\) 再对 \(\lambda\) 求导，得到：
\[
\boxed{\;\frac{\partial}{\partial\lambda}\mathbb{E}_\lambda[f(x)]
=-\mathrm{Cov}_\lambda(f,f)\;}
\]
一维情况下就是 \(\partial_\lambda \mathbb{E}[f]=-\mathrm{Var}(f)\le 0\)。

## (2) 城市映射：\(\beta\) 控制“集中程度”

若
\[
p(i)\propto e^{-\beta c_i},
\]
那么：

- \(\beta\to 0\)：\(e^{-\beta c_i}\approx 1-\beta c_i\)，各选项权重趋于接近，分布更均匀（更“噪声主导”）。
- \(\beta\to\infty\)：除了最小成本项，其他项被指数抑制，分布高度集中在低成本/高效用选项（更“理性/确定性”）。

在城市选择/流动中，这对应：

- \(\beta\) 小：行为异质性更强、探索更多、对成本差异不敏感；
- \(\beta\) 大：对成本差异更敏感、选择更集中，系统对参数扰动的响应也更强（可与 (1) 的“导数=协方差”直觉连接）。

## (3) FDT 何时失效或“不好用”？

**核心提醒**：\(\partial_\lambda \langle A\rangle=\beta\,\mathrm{Cov}(A,B)\) 是平衡态、指数族分布下的**线性响应**结论。失效边界主要有四类：

1. **扰动过大（线性近似崩溃）**

   FDT 本质是一阶泰勒展开，只对“微小旋钮”成立。若扰动跨过相变或触发结构性重排（路线/居住/工作整体迁移），一阶导数不再代表真实响应，需要高阶项或重新求解新分布。

2. **系统不在平衡态（分布前提被破坏）**

   公式右边的协方差假定 \(p\propto e^{-\beta E}\)。持续外驱动、非平衡稳态（有净流）、老化系统都不满足此分布。此时需用 Kubo 的时间相关版本或非平衡理论，静态协方差不够。

3. **模型不是指数族（\(\ln Z\) 不可导）**

   推导依赖 \(p(x)\propto e^{-\beta E_\lambda(x)}\) 的指数结构，才能把“共轭量”从指数里拉出来。若是规则驱动的 ABM 或非参数模型，\(\ln Z\) 不存在或不可导，只能做参数扰动实验（sweep）。

4. **临界点附近（公式成立但难以估计）**

   严格来说 FDT 仍成立，但 \(\mathrm{Var}\to\infty\)、相关长度与自相关时间发散，导致协方差估计极慢收敛。结论“对”，但实践上“算不准”，需要标度理论或更长采样。

**一行总结**：

前两类是**公式前提被破坏**（真的不适用）；后两类是**公式仍对但不可操作**（估不准或无法从 \(\ln Z\) 推出）。

| 失效条件 | 破坏了什么 | 后果 |
|---|---|---|
| 扰动太大 | 线性近似 | 一阶导不够，需要高阶或重求分布 |
| 非平衡态 | 平衡 Boltzmann 分布 | 需 Kubo/非平衡理论 |
| 非指数族 | \(\ln Z\) 可微性 | 无法由协方差给出响应 |
| 临界点附近 | 协方差可估性 | 公式对，但难以数值估计 |
