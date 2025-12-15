---
type: concept
title: 最大熵原理 Maximum entropy principle
tags: ['statmech', 'inference', 'M1']
prereq: ['Shannon 熵与最大熵原则']
source: ['Jaynes-style reasoning']
status: ready
---

## 一句话
- 在只知道一组约束信息时，选择 **熵最大的分布**，等价于“不额外引入你并不知道的结构”（最少偏见/最不武断）。

## 标准问题形式
- 变量 \(x\)（离散或连续），要找分布 \(p(x)\)
- 已知约束（通常是期望）：
\[
\mathbb{E}_p[f_k(x)] = c_k,\quad k=1,\dots,m
\]
以及归一化 \(\sum_x p(x)=1\)。

## 结论（指数族）
- 最大熵解必然是指数族：
\[
p(x) = \frac{1}{Z(\lambda)}\exp\!\Big(-\sum_{k=1}^m \lambda_k f_k(x)\Big).
\]
其中 \(\lambda_k\) 是拉格朗日乘子，\(Z\) 是归一化因子。

## 为什么不是“拍脑袋”
- 如果你只接受“约束是真的”，那么任何额外的结构（例如偏好某些状态）都是你私自添加的信息；
- 最大熵选择的是在这些约束下“最均匀、最不偏”的分布。

## 城市里的最小落地
- 只知道行/列边际（出发量/到达量）时，用最大熵得到 OD 矩阵是最自然的基线推断。
