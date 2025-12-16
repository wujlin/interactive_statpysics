---
type: concept
title: 第一定律与第二定律 First and second law
tags: ['thermodynamics', 'M0']
prereq: ['状态函数与过程量 State vs process quantities']
source: ['Thermo basics']
status: ready
---

## 一句话
第一定律以 dU=δQ−δW 表达能量守恒；第二定律引入熵 S 并给出 Clausius 不等式 dS≥δQ/T，从而刻画不可逆性与孤立系统的熵增方向。

## 第一律（能量守恒）
- 约定符号（常用物理约定）：系统吸热为正、对外做功为正：
\[
dU = \delta Q - \delta W.
\]
- 对可逆准静态体积功：\(\delta W = P\,dV\)（注意这里的 \(P\) 是体系压强/外压条件相关）。

## 第二律（熵与方向）
- 熵 \(S\) 是状态函数；可逆过程：
\[
dS = \frac{\delta Q_\mathrm{rev}}{T}.
\]
- 任意过程满足不等式（Clausius）：
\[
dS \ge \frac{\delta Q}{T}.
\]
- 孤立系统：\(\delta Q=0\Rightarrow dS\ge 0\)。

## 为什么第二律是“统计的”
- 宏观不可逆来自微观的“绝大多数微观态”对应更大多重度（Ω 更大） ⇒ \(S=k\ln\Omega\) 更大。

## 最小检查
- 单位：\(S\) 的单位是 J/K（或 \(k_B\) 乘无量纲）。
