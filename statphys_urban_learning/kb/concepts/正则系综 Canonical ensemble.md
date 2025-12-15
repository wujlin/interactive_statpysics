---
type: concept
title: 正则系综 Canonical ensemble
tags: ['statmech', 'M3']
prereq: ['最大熵原理 Maximum entropy principle']
source: ['Gibbs ensemble']
status: ready
---

## 一句话
- 正则系综描述“系统与热浴接触”：温度 \(T\) 固定（或 \(\beta\) 固定），能量可涨落。

## 定义（Boltzmann 分布）
- 对离散能级 \(E_i\)：
\[
p_i = \frac{e^{-\beta E_i}}{Z(\beta)},\quad Z(\beta)=\sum_i e^{-\beta E_i}.
\]
- 其中 \(\beta = 1/(k_B T)\)。

## 直觉
- 热浴把“能量约束”从硬约束（微正则）变成软约束（平均能量受控）
- 代价更高的状态以指数方式被抑制

## 与热力学势的连接
- Helmholtz 自由能：
\[
F(T,V,N) = -k_B T \ln Z.
\]
- 一旦知道 \(Z\)，系统的热力学量可由导数得到。
