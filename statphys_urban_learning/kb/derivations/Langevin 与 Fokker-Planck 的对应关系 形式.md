---
type: derivation
title: Langevin 与 Fokker-Planck 的对应关系 形式
tags: ['langevin', 'fokker-planck', 'M9']
prereq: ['Langevin 方程 Langevin equation', 'Fokker-Planck 方程 Fokker-Planck equation']
source: ['SDE/FP basics']
status: ready
---

## 目标
- 记住一条“形式对应”：给定 Langevin 的 drift 与 diffusion，就能写出对应的 Fokker–Planck 方程。

## 从 SDE 到 FP（形式）
- 设 1D SDE：
\[
dX_t = a(X_t,t)\,dt + b(X_t,t)\,dW_t.
\]
- 对应密度 \(p(x,t)\) 满足（Itô 版本）：
\[
\boxed{
\frac{\partial p}{\partial t}
= -\frac{\partial}{\partial x}\big(a(x,t)p\big)
+ \frac{1}{2}\frac{\partial^2}{\partial x^2}\big(b(x,t)^2 p\big).
}
\]

## OU 过程核对
- OU：\(a(x)=\theta(\mu-x)\), \(b(x)=\sigma\)
- FP：
\[
\partial_t p = -\partial_x(\theta(\mu-x)p)+\frac{\sigma^2}{2}\partial_x^2 p.
\]
其稳态是高斯，方差 \(\sigma^2/(2\theta)\)（见 E09）。

## 你不需要在这里推严格证明
- 本项目只要求能写对对应关系，并用一个可验证例子（OU）闭环。
