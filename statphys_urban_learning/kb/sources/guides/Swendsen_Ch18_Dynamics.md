# Reading Guide: Swendsen Chapter 18 (Dynamics)

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Time Evolution, Monte Carlo Dynamics, Master Equation

## TL;DR (30秒概览)
这一章填补了从分布（Part I）到模拟（Part II）的缺口。
核心矛盾：如果有分布 $p \propto e^{-\beta E}$，我们怎么构造一个动力学过程，让它收敛到这个分布？这既是 MCMC 的原理，也是非平衡过程的基础。
重点理解 **Detailed Balance**。

> 记号提醒：Swendsen 原文常用大写 $P_i$ 表示“处在状态 $i$ 的概率”。为了避免与本仓库离散时间 Markov 链的转移矩阵 $P_{ij}$ 混淆，这份导读统一用小写 $p_i$ 表示分布。

## Key Equations (公式锚点)

- **Eq 18.2**: 主方程 (Master Equation)
  \[ \frac{dp_j}{dt} = \sum_i (W_{ij} p_i - W_{ji} p_j) \]
  - *含义*: 概率流的守恒方程。

- **Eq 18.5**: 细致平衡 (Detailed Balance)
  \[ W_{ij} p_i^{eq} = W_{ji} p_j^{eq} \]
  - *含义*: 保证稳态解是 $p^{eq}$ 的充分条件。Metropolis 算法就是构造满足此式子的 $W$。

## Signposts (阅读路标)

- **Section 18.2**: **Detailed Balance**
  - 务必搞清它和“Steady State”的区别。可以有稳态如果不满足细致平衡（会有环流）。

- **Section 18.3**: **Metropolis Algorithm**
  - 这是 M3 中 MCMC 代码的理论源头。看他如何证明 Metropolis acceptance rule 满足细致平衡。

## Urban Mapping
- **人口流动平衡**: 如果城市 A 和 B 之间的人口流动满足细致平衡，那么两城人口比例将固定为 $N_A/N_B = e^{-\beta(U_A - U_B)}$。
