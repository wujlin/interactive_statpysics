---
type: concept
title: Fokker-Planck 方程 Fokker-Planck equation
tags: ['stochastic', 'M9']
prereq: ['Langevin 方程 Langevin equation']
source: ['SDE/FP basics']
status: ready
---

## 一句话
Fokker–Planck 方程（Kolmogorov 正向方程）给出连续 Markov 过程的概率密度 p(x,t) 的演化；对 Itô 形式的 SDE dX=a(X,t)dt+b(X,t)dW_t，有 ∂_t p=−∂_x(a p)+1/2 ∂_x^2(b^2 p)。

## 对应关系（形式）
- 对 Langevin：\(dX = a(X)\,dt + b(X)\,dW\)，其密度满足：
\[
\frac{\partial p}{\partial t}
= -\frac{\partial}{\partial x}\big(a(x)p\big)
+ \frac{1}{2}\frac{\partial^2}{\partial x^2}\big(b(x)^2 p\big).
\]
- 第一项：漂移（对流）；第二项：扩散。

## 城市连接（最小）
- 若把连续城市量（密度/需求强度/拥堵）视作随机演化变量，FP 方程可用来预测分布随时间的变化。
