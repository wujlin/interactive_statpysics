---
type: urban_mapping
title: 区际迁移与状态转移 的 Markov 动力系统
tags: ['urban', 'markov', 'M8']
prereq: ['Markov 链与稳态分布 Markov chain', '细致平衡 Detailed balance 与净流']
source: ['mapping']
status: ready
---

## 目的
- 用最小 Markov 语言刻画“区际迁移/人口流动”的时间演化，并提取两个核心产物：
  - 稳态分布（长期格局）
  - 净流（不可逆驱动/循环迁移）

## 最小模型
- 状态：区域 \(i=1,\dots,n\)
- 迁移矩阵：\(P_{ij}=\Pr(\text{从 }i\text{ 到 }j)\)
- 分布：\(p(t)\)（行向量）随时间：
\[
p(t+1)=p(t)P.
\]

## 长期格局（稳态）
- \(\pi=\pi P\) 给出长期“人口占比/驻留概率”。

## 不可逆性（净流）
- 计算：
\[
J_{ij}=\pi_i P_{ij}-\pi_j P_{ji}.
\]
- 若 \(J\neq 0\)：存在循环迁移或方向性驱动（政策/经济梯度/吸引力差异）。

## 经验落地提示
- 如果你只有“OD 流量”而没有明确时间步：
  - 可以先归一化得到 \(P\)（按行归一化）
  - 再研究稳态与净流（作为一个“动力学解释”层）
