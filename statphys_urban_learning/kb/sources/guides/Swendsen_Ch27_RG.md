# Reading Guide: Swendsen Chapter 27 (Renormalization Group)

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Phase Transitions, Criticality, RG, Scaling

## TL;DR (30秒概览)
这是本书最难也最精彩的部分之一。
核心矛盾：为什么平均场在 $T_c$ 附近是错的？为什么不同的系统会有相同的临界指数（普适性）？
Swendsen 用**实空间重整化群 (Real-space RG)** ——具体来说是“Decimation”方法（对格子做抽取），演示了 RG 的操作流程。这比动量空间 RG（Wilson 原始版本）直观得多。

## Key Equations (公式锚点)

- **Eq 27.5**: 粗粒化变换 (K')
  \[ K' = \frac{1}{2} \ln \cosh(2K) \]
  - *含义*: 这是 1D Ising 模型的 RG 流动方程。$K = \beta J$。它展示了随着观察尺度变大，有效耦合 $K$ 是如何变小的（最终流向 0，即高温不动点）。

- **Scaling Relations**:
  - Swendsen 讨论了 $\nu, \alpha, \beta$ 等指数如何从 RG 的线性化特征值 $\lambda$ 中算出来。

## Signposts (阅读路标)

- **Section 27.2**: **Renormalization Group for 1D Ising**
  - 必读。虽然 1D 没有相变，但它让你看清了 RG 的数学操作：Trace out 一半变量 -> 重新标度 -> 寻找不动点。

- **Section 27.4**: **Universality**
  - 理解为什么微观细节（是正方格子还是三角格子）会被 RG 流刷掉，只剩下相关变量。

## Critical Thinking (带着问题读)
1. 什么是“不动点 (Fixed Point)”？它对应物理上的什么状态？（临界点或 $T=0, T=\infty$）。
2. 为什么说 RG 解释了普适性？（所有在大吸引域内的系统都流向同一个不动点）。

## Urban Mapping
- **分形城市**: 城市在不同尺度上（街区、片区、全城）表现出的自相似性，暗示了背后存在某种 RG 机制。
