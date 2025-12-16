# Reading Guide: Swendsen Chapter 12 (Thermodynamics)

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Thermodynamic Potentials, Legendre Transform, Maxwell Relations

## TL;DR (30秒概览)
这一章是热力学与统计力学的接口。Swendsen 在这里系统地引入了**热力学势**的概念。
核心矛盾：如何通过 Legendre 变换改变控制变量？（从 $U[S,V]$ 到 $F[T,V]$ 到 $G[T,P]$）。
这章不需要你背诵所有 Maxwell 关系，但必须掌握 $dF = -S dT - P dV + \mu dN$ 这种“读出偏导数”的能力。

## Key Equations (公式锚点)

- **Eq 12.10**: Helmholtz 自由能定义
  \[ F = U - TS \]
  - *含义*: 把 $S$ 换成 $T$ 作为自然变量。

- **Eq 12.11**: 内能微分形式
  \[ dU = T dS - P dV + \mu dN \]
  - *含义*: 这是起点，必须背下来。

- **Eq 12.12**: 自由能微分形式
  \[ dF = -S dT - P dV + \mu dN \]
  - *含义*: 注意 $S$ 前面的负号，意味着 $S = -(\partial F/\partial T)_{V,N}$。

## Signposts (阅读路标)

- **Section 12.1-12.2**: **Energy and Entropy**
  - 复习基本的热力学第一、第二定律。

- **Section 12.3**: **Thermodynamic Potentials**
  - 这是重头戏。看懂 Table 12.1（虽然书里可能没有直接画表，但他在文中列举了 $H, F, G$）。

- **Section 12.5**: **Maxwell Relations**
  - 不要死记硬背。试着推导其中一个（比如 $(\partial T/\partial V)_S = -(\partial P/\partial S)_V$），它是 $d^2 U$ 混合偏导相等的结果。

## Critical Thinking (带着问题读)
1. 为什么 Legendre 变换里总是减去 $TS$ 或 $PV$？这代表了什么物理图像？（提示：截距）。
2. 在很多教材里 $G$ 叫 Gibbs Free Energy，但在 Swendsen 里有时候只叫 Gibbs Potential，有区别吗？

## Urban Mapping
- **Legendre 变换**: 对应城市规划中的“影子价格”（Shadow Price）。通过引入价格（$T, P, \mu$）来替代硬约束（$S, V, N$）。
