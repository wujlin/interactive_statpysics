# Reading Guide: Swendsen Chapter 10 (Canonical Ensemble)

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Canonical Distribution, Partition Function $Z$, Free Energy Connection

## TL;DR (30秒概览)
这是所有统计力学的核心章节。
核心矛盾：从微正则（$E$ 固定）推导到正则（$E$ 涨落）。Swendsen 依然使用“Composite System”方法（小系统 + 大热浴）。
一定要看懂 $Z$ 是如何作为所有热力学量的生成函数的。

## Key Equations (公式锚点)

- **Eq 10.15**: 正则分布
  \[ P_j = \frac{1}{Z} e^{-\beta E_j} \]
  - *含义*: 最著名的 Boltzmann 分布。

- **Eq 10.16**: 配分函数
  \[ Z = \sum_j e^{-\beta E_j} \]
  - *含义*: 状态之和 (Sum over states)。

- **Eq 10.39**: 桥接公式
  \[ F = -k_B T \ln Z \]
  - *含义*: 将统计量 $Z$ 映射为热力学势 $F$。一旦你有了 $F(T,V,N)$，剩下的就是对它求导（见 M0）。

## Signposts (阅读路标)

- **Section 10.1-10.2**: **Derivation**
  - 如果你觉得推导繁琐，可以接受结论。但要明白假设是什么：热浴很大，且我们对热浴一无所知（除了均值能量/温度）。

- **Section 10.5**: **Energy Fluctuations**
  - 必看。$\langle (E - \langle E \rangle)^2 \rangle = k_B T^2 C_V$。这是 M5 的伏笔。

## Critical Thinking (带着问题读)
1. 为什么求和是对 microstates $j$ 求和，而不是对 energy levels $E$ 求和？（如果有简并度 $\Omega(E)$，则是 $\sum_E \Omega(E) e^{-\beta E}$）。
2. $\beta = 1/k_B T$ 这个定义是哪里冒出来的？（是从熵最大化条件导出的）。

## Urban Mapping
- **Log Sum Exp**: 人工智能/离散选择模型（Logit）里的分母，其实就是配分函数。它代表了“选项的总价值”。
