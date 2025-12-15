---
type: derivation
title: Ising 平均场自洽方程
tags: ['ising', 'mean-field', 'M6']
prereq: ['相互作用系统 Interacting systems', '序参量 Order parameter']
source: ['standard mean-field Ising']
status: ready
---

## 目标
- 给出 Ising 模型平均场下磁化 \(m\) 的自洽方程，并看出临界点的来源。

## 模型
\[
E(s) = -J\sum_{\langle i,j\rangle}s_i s_j - h\sum_i s_i,\quad s_i\in\{\pm1\}.
\]
设每个点的配位数为 \(z\)（2D 正方格 \(z=4\)）。

## 平均场近似
- 用平均磁化替代邻居自旋：
\[
\sum_{j\in \text{nbr}(i)} s_j \approx z\,m,\quad m=\langle s_i\rangle.
\]
- 单点的有效能量：
\[
E_i(s_i)\approx - (J z m + h)\, s_i.
\]

## 单点分布与自洽
- 单点配分：
\[
Z_1 = \sum_{s=\pm1} e^{\beta (J z m + h)s} = 2\cosh(\beta(J z m + h)).
\]
- 平均磁化：
\[
m=\langle s\rangle
= \frac{1}{Z_1}\sum_{s=\pm1} s\, e^{\beta (J z m + h)s}
= \tanh(\beta(J z m + h)).
\]

## 结果（自洽方程）
\[
\boxed{m = \tanh(\beta(J z m + h)).}
\]

## 临界点（h=0）
- 在 \(m\approx 0\) 处线性化：\(\tanh x\approx x\)
\[
m \approx \beta J z\, m.
\]
非零解出现条件：\(\beta J z > 1\)  
⇒ 平均场临界：
\[
\boxed{T_c^{\mathrm{MF}} = \frac{J z}{k_B}.}
\]

## 注意
- 平均场给出正确的“结构/直觉”，但定量临界指数在低维会偏差。
