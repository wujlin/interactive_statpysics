---
type: concept
title: 相关函数 Correlation function
tags: ['statmech', 'M5']
prereq: []
source: ['general']
status: ready
---

## 一句话
- 相关函数度量“两个位置/时间/节点上的变量是否一起波动”，是连接微观结构与宏观行为的桥。

## 最小定义
- 时间相关（平稳过程）：
\[
C(\tau)=\langle (X_t-\langle X\rangle)(X_{t+\tau}-\langle X\rangle)\rangle.
\]
- 空间相关（格点/网络）：
\[
C(r)=\langle s_i s_{i+r}\rangle - \langle s\rangle^2.
\]

## 为什么重要
- 相关衰减尺度定义“相关长度/相关时间”
- MCMC 里：相关时间决定有效样本量（ESS）

## 城市连接（最小）
- 出行/流动/拥堵往往呈现时空相关：相关长度变大常意味着“集体效应增强”，也是临界/阈值的信号之一。
