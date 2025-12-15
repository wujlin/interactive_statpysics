---
type: urban_mapping
title: 最大熵（MaxEnt）→ OD 矩阵推断
tags: ['maxent', 'urban', 'OD', 'M1', 'M4']
prereq: ['最大熵原理 Maximum entropy principle']
source: ['OD maxent / IPF']
status: ready
---

## 目的
- 把“最大熵 + 线性约束”落地为：在只知道边际（出发量/到达量）时推断 OD 矩阵。

## 变量与约束
- 变量：\(T_{ij}\ge 0\)（从 i 到 j 的流量）
- 已知边际：
\[
\sum_j T_{ij} = O_i,\quad \sum_i T_{ij}=D_j.
\]
- （可选）先验/成本结构：prior \(Q_{ij}\propto \exp(-\beta c_{ij})\)

## 最大熵（或最小 KL）形式
- 经典等价表述：在边际约束下最小化
\[
\min_T KL(T\|Q) = \sum_{ij} T_{ij}\ln\frac{T_{ij}}{Q_{ij}}.
\]
当 \(Q\) 是常数时，相当于最大化熵。

## 乘子形式（结论）
- 解具有乘子分解：
\[
T_{ij}=a_i\,b_j\,Q_{ij},
\]
其中 \(a_i,b_j\) 由边际约束决定。

## 数值求解：IPF
- IPF 通过交替行/列缩放求 \(a_i,b_j\)，稳定、易实现（见方法卡与项目 P01）。

## 城市解释（最小）
- \(a_i,b_j\) 可以理解为“出发/吸引强度”的乘子；
- \(\beta\) 控制成本敏感性（越大越偏好低成本）。
