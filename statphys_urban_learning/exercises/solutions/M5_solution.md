---
type: solution
id: M5_solution
title: M5 涨落—响应（参考解答）
tags: [fluctuation-response, exponential-family, sensitivity, solution]
---

## (1) 指数族：\(\partial_\theta \mathbb{E}[f]=\mathrm{Cov}(f,f)\)

给定
\[
p_\theta(x)=\frac{1}{Z(\theta)}e^{\theta^\top f(x)},\qquad
Z(\theta)=\sum_x e^{\theta^\top f(x)}.
\]

先求 \(\ln Z\) 的一阶导：
\[
\frac{\partial\ln Z}{\partial\theta}
=\frac{1}{Z}\frac{\partial Z}{\partial\theta}
=\frac{1}{Z}\sum_x f(x)e^{\theta^\top f(x)}
=\sum_x f(x)p_\theta(x)
=\mathbb{E}_\theta[f(x)].
\]

再求二阶导（对向量情形是 Hessian）：
\[
\frac{\partial^2\ln Z}{\partial\theta\,\partial\theta^\top}
=\frac{\partial}{\partial\theta}\mathbb{E}_\theta[f(x)].
\]

另一方面，二阶导也可以写成协方差矩阵：
\[
\frac{\partial^2\ln Z}{\partial\theta\,\partial\theta^\top}
=\mathbb{E}_\theta\!\big[f(x)f(x)^\top\big]-\mathbb{E}_\theta[f(x)]\,\mathbb{E}_\theta[f(x)]^\top
=\mathrm{Cov}_\theta(f,f).
\]

因此得到
\[
\boxed{\;\frac{\partial}{\partial\theta}\mathbb{E}_\theta[f(x)]
=\mathrm{Cov}_\theta(f,f)\;}
\]
一维情况下就是 \(\partial_\theta \mathbb{E}[f]=\mathrm{Var}(f)\ge 0\)。

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
