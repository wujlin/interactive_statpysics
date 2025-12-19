---
type: concept
title: Stirling 近似 Stirling approximation
tags: ['probability', 'statmech', 'M1']
prereq: []
source: ['Asymptotics / combinatorics']
status: ready
---

## 一句话
Stirling 近似给出 $\ln n!$ 的渐近展开 $\ln n! = n\ln n - n + O(\ln n)$，使组合计数与熵密度在大 $N$ 极限下可用连续极值方法处理。

## 公式（最常用版本）
\[
\ln n! = n\ln n - n + \frac{1}{2}\ln(2\pi n) + O\!\left(\frac{1}{n}\right).
\]

## 什么时候用
- \(n\) 很大（典型：粒子数/样本数进入热力学极限）
- 你关心的是 \(\ln \Omega\) 或每粒子量（强度量）

## 典型用法（把组合数变成熵）
- 二项式：
\[
\ln \binom{N}{k} = \ln N! - \ln k! - \ln (N-k)!
\]
用 Stirling 展开后得到熵密度（例如二元熵函数）。

## 最小检查
- 只要你最后用的是“每粒子/每自由度”的量（除以 N），高阶项通常会消失。
