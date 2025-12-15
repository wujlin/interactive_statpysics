---
type: concept
title: Shannon 熵与最大熵原则
tags: ['information', 'inference', 'M1']
prereq: []
source: ['Shannon / Jaynes']
status: ready
---

## 一句话
- Shannon 熵度量分布的不确定性；最大熵原则说：在满足已知约束的所有分布里，选熵最大的那一个。

## Shannon 熵（离散）
\[
H(p) = -\sum_{i} p_i \ln p_i.
\]
- 性质（只记最重要的）：
  - \(H\ge 0\)，且在均匀分布时最大
  - 独立变量熵可加（或至少满足链式法则）

## 最大熵原则（约束推断）
- 给定约束（通常是期望）：
\[
\sum_i p_i f_k(i) = c_k,\quad \sum_i p_i = 1
\]
- 选择使 \(H(p)\) 最大的 \(p\)。

## 结果（指数族）
- 线性约束下必得到指数族（拉格朗日乘子）：
\[
p_i \propto \exp\!\Big(-\sum_k \lambda_k f_k(i)\Big).
\]

## 最小例子
- 只给定平均能量：\(f(i)=E_i\) ⇒ \(p_i \propto e^{-\beta E_i}\)（Boltzmann）。
