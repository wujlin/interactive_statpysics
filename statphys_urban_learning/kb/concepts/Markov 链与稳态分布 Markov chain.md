---
type: concept
title: Markov 链与稳态分布 Markov chain
tags: ['stochastic', 'M8']
prereq: []
source: ['stochastic processes']
status: ready
---

## 一句话
Markov 链是满足 Markov 性的离散时间随机过程：给定当前状态 X_t 时，下一步状态的条件分布与更早历史无关；稳态分布 π 为满足 π=πP 的不变分布，在遍历条件下也是长期极限分布。

## 定义（离散时间）
- 状态 \(X_t\in\{1,\dots,n\}\)
- 转移矩阵 \(P\)：\(P_{ij}=\Pr(X_{t+1}=j\mid X_t=i)\)
  - 行随机：\(\sum_j P_{ij}=1\)

## 稳态分布
- \(\pi\) 是概率向量，满足：
\[
\pi = \pi P.
\]
- 直觉：长期平均“待在各状态的比例”。

## 最小性质（够用）
- 若链遍历且非周期，\(\pi\) 唯一且从任意初始分布收敛到 \(\pi\)。

## 城市连接（最小）
- 区域迁移：状态=区域；\(P_{ij}\)=从 i 迁到 j 的概率；\(\pi\)=长期人口占比/驻留概率。
