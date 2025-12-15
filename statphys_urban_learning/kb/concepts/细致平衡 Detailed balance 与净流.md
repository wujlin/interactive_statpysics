---
type: concept
title: 细致平衡 Detailed balance 与净流
tags: ['stochastic', 'M8']
prereq: ['主方程 Master equation']
source: ['stochastic processes']
status: ready
---

## 一句话
- 细致平衡表示系统在稳态下“每一对状态之间的流量彼此抵消”，没有循环净流；违反细致平衡是非平衡驱动的最小证据。

## 细致平衡（离散时间）
- 给定转移矩阵 \(P\) 与稳态 \(\pi\)，细致平衡要求：
\[
\pi_i P_{ij} = \pi_j P_{ji}\quad \forall i,j.
\]

## 净流（flux）
- 定义净流矩阵：
\[
J_{ij} = \pi_i P_{ij} - \pi_j P_{ji}.
\]
- 若细致平衡成立，则 \(J_{ij}=0\)；否则存在循环流。

## 城市连接（最小）
- 如果迁移/通勤存在方向性驱动（政策、资源梯度），就会出现净流；净流揭示“循环迁移/不可逆性”。
