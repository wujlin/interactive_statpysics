---
type: derivation
title: 平均粒子数与涨落从 ln Xi 的导数得到
tags: ['grand-canonical', 'M4']
prereq: ['巨正则系综 Grand canonical ensemble']
source: ['standard statmech']
status: ready
---

## 目标
- 推出巨正则系综里：
  - \(\langle N\rangle\) 是 \(\ln\Xi\) 对 \(\beta\mu\) 的一阶导
  - \(\mathrm{Var}(N)\) 是二阶导

## 起点
\[
\Xi(\beta,\mu)=\sum_{N}\sum_x \exp[-\beta(E(x,N)-\mu N)].
\]
记 \(y\equiv \beta\mu\)。

## 一阶导（均值）
\[
\partial_y \Xi
= \sum_{N,x} N\, \exp[-\beta(E-\mu N)]
\]
两边除以 \(\Xi\)：
\[
\partial_y \ln\Xi = \frac{1}{\Xi}\partial_y \Xi
= \sum_{N,x} N \frac{\exp[-\beta(E-\mu N)]}{\Xi}
= \langle N\rangle.
\]
所以：
\[
\boxed{\langle N\rangle = \partial_{(\beta\mu)} \ln\Xi.}
\]

## 二阶导（涨落）
再求导：
\[
\partial_y^2 \ln\Xi = \partial_y \langle N\rangle.
\]
直接计算得到：
\[
\boxed{\partial_y^2 \ln\Xi = \langle N^2\rangle - \langle N\rangle^2 = \mathrm{Var}(N).}
\]

## 备注（常见等价写法）
- 强调对 \(\mu\) 求导时要带上 \(\beta\)：
\[
\langle N\rangle = \frac{1}{\beta}\frac{\partial}{\partial\mu}\ln\Xi.
\]

## 检查
- \(\beta\mu\) 无量纲，因此导数的结果无量纲（确实是粒子数）
