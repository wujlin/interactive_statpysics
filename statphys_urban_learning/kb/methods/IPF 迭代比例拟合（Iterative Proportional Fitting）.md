---
type: method
title: IPF 迭代比例拟合（Iterative Proportional Fitting）
tags: ['maxent', 'matrix', 'OD', 'M4']
prereq: ['最大熵原理 Maximum entropy principle']
source: ['RAS/IPF literature']
status: ready
---

## 什么时候用？
- 你要把一个非负矩阵 \(T_{ij}\) 拟合到给定的行和/列和（边际约束）：
  - 行和：\(\sum_j T_{ij}=O_i\)
  - 列和：\(\sum_i T_{ij}=D_j\)
- 同时希望尽量“贴近一个先验/基准矩阵 prior”（例如 \(\exp(-\beta c_{ij})\)）。

## 输入/输出
- 输入：
  - prior 矩阵 \(Q_{ij}\ge 0\)
  - 目标边际 \(O_i,D_j\)
  - 收敛阈值 tol，最大迭代 max_iter
- 输出：
  - 拟合后的矩阵 \(T_{ij}\)
  - 误差诊断（行误差、列误差、迭代次数）

## 核心步骤（伪代码）
1) 初始化：\(T^{(0)} \leftarrow Q\)
2) 循环直到收敛：
   - 行缩放：\(T_{ij}\leftarrow T_{ij}\cdot \frac{O_i}{\sum_j T_{ij}}\)
   - 列缩放：\(T_{ij}\leftarrow T_{ij}\cdot \frac{D_j}{\sum_i T_{ij}}\)
3) 结束：返回 \(T\)

## 正确性/直觉（你需要知道的最低限）
- IPF 等价于在边际约束下最小化 \(KL(T\|Q)\)；
- 当 \(Q\) 为均匀（或常数）时，IPF 给出“最大熵”的 OD 解；
- 结果等价于乘子形式：\(T_{ij}=a_i\,b_j\,Q_{ij}\)。

## 注意事项
- prior 中的 0 会导致对应位置永远为 0（可用于硬约束，但也可能是坑）。
- 需要边际总量一致：\(\sum_i O_i = \sum_j D_j\)。

## 代码位置
- `projects/p01_maxent_od/src/ipf.py`：可复用实现 + pytest。
