---
type: concept
title: 多重度 multiplicity Ω
tags: ['statmech', 'M1', 'M2']
prereq: ['微观态与宏观态 Microstate vs macrostate']
source: ['Any statmech textbook']
status: ready
---

## 一句话
多重度 $\Omega(E,V,N)$ 是满足给定宏观约束的微观态数（或相空间体积），其对数给出 Boltzmann 熵 $S = k_B \ln \Omega$。

## 典型形式
- 离散计数（组合学）：\(\Omega = \#\{\text{microstates consistent with macro constraints}\}\)
- 连续相空间（需要体积/测度）：\(\Omega \sim \int \mathrm{d}\Gamma\ \delta(H(\Gamma)-E)\)

## 为什么要取对数
- 乘法结构：独立子系统的多重度相乘 \(\Omega_{12}=\Omega_1\Omega_2\)
- 取对数后可加：\(S_{12}=S_1+S_2\)

## 与最大熵的关系（最小）
- “最概然宏观态”就是让 \(\Omega\) 最大的宏观态；
- 最大熵原则可以看作在不知道精确计数时的“信息论替代”。

## 最小例子
- N 次抛硬币：宏观态用正面次数 k 表示，
\[
\Omega(k)=\binom{N}{k}.
\]
