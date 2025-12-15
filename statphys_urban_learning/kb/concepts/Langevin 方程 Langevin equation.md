---
type: concept
title: Langevin 方程 Langevin equation
tags: ['stochastic', 'M9']
prereq: []
source: ['SDE basics']
status: ready
---

## 一句话
- Langevin 方程用随机微分方程描述连续变量的演化：**漂移（趋势）+ 噪声（扩散）**。

## 最小形式
\[
dX_t = a(X_t,t)\,dt + b(X_t,t)\,dW_t,
\]
其中 \(W_t\) 是 Wiener 过程（布朗运动）。

## 直觉
- 漂移 \(a\)：系统性趋势（被“力/梯度/政策”推动）
- 扩散 \(b\)：随机扰动强度（不可观测因素/噪声）

## 最小例子：OU 过程
\[
dX = \theta(\mu - X)\,dt + \sigma\,dW
\]
有解析稳态：均值 \(\mu\)，方差 \(\sigma^2/(2\theta)\)。
