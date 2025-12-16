---
type: concept
title: 相互作用系统 Interacting systems
tags: ['statmech', 'M6']
prereq: ['正则系综 Canonical ensemble']
source: ['Ising / lattice models']
status: ready
---

## 一句话
相互作用系统的 Hamiltonian 含耦合项使能量/概率不可分解为独立粒子之和，从而产生相关性与集体效应（如长程有序与相变）。

## 最小形式（能量函数）
- 独立：\(E(x)=\sum_i E_i(x_i)\) ⇒ \(p(x)=\prod_i p_i(x_i)\)
- 相互作用：\(E(x)=\sum_i E_i(x_i)+\sum_{(i,j)} J_{ij} x_i x_j\) ⇒ 不可因子分解

## 直觉
- “你怎么选”会影响“我怎么选”（同伴效应/拥堵外部性）就是相互作用。
- 相互作用强时，系统可能锁定到某个宏观态（聚集/分化）。

## 典型最小模型
- Ising：\(s_i\in\{\pm1\}\),
\[
E(s)=-J\sum_{\langle i,j\rangle}s_i s_j - h\sum_i s_i.
\]
