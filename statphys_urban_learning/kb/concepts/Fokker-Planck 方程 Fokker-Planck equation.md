---
type: concept
title: Fokker-Planck 方程 Fokker-Planck equation
tags: ['stochastic', 'M9']
prereq: ['Langevin 方程 Langevin equation']
source: ['SDE/FP basics']
status: ready
---

## 一句话
Fokker–Planck 方程（Kolmogorov 正向方程）用**分布**的语言描述连续 Markov 过程：它回答“概率密度 $p(x,t)$ 如何随时间演化”，是 M8 主方程在连续极限下的对应物，也是 [[Langevin 方程 Langevin equation]] 的“分布视角”。

## 形式对应（1D，Itô）
如果 SDE 为
$$
\mathrm{d}X_t = a(X_t,t) \mathrm{d}t + b(X_t,t) \mathrm{d}W_t.
$$
则密度 $p(x,t)$ 满足
$$
\boxed{
\frac{\partial p}{\partial t}
= -\frac{\partial}{\partial x}\big(a(x,t)p(x,t)\big)
+ \frac{1}{2}\frac{\partial^2}{\partial x^2}\big(b(x,t)^2 p(x,t)\big).
}
$$

## 它在说什么（“流入−流出”的连续版）
Fokker–Planck 可以写成连续性方程（概率守恒）：
$$
\partial_t p + \partial_x J = 0,
$$
把上一节的 FP 方程右侧“凑成一个 $\partial_x(\cdot)$”，就得到
$$
\partial_t p
=-\partial_x(ap)+\frac12\partial_x^2(b^2p)
=-\partial_x\!\left(ap-\frac12\partial_x(b^2p)\right).
$$
因此定义概率流 $J$ 为括号里的内容：
$$
J(x,t)=a(x,t)p(x,t)-\frac12 \partial_x\!\big(b(x,t)^2 p(x,t)\big).
$$
所以它的结构非常接近 M8 的主方程：**分布变化来自概率流的散度**。

## 稳态与“平衡/非平衡”的分界
稳态只要求 $\partial_t p=0$，因此 $\partial_x J=0\Rightarrow J=\text{常数}$。
- 若在无边界/可归一化设定下取 $J=0$，对应“无净流”的平衡型稳态；
- 若存在 $J\neq 0$（多维里更典型的是环流），则是“分布不变但流不停”的非平衡稳态（连续版的 NESS），与 M10 的熵产生叙事相连。

## 城市连接（最小）
- 若把连续城市量（密度/需求强度/拥堵）视作随机演化变量，FP 方程可用来预测分布随时间的变化。
