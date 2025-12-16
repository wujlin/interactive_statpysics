# Reading Guide: Swendsen Chapter 16 (Ising Model)

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Interactions, Ising Model, Mean Field Theory

## TL;DR (30秒概览)
这一章带你进入“相互作用”的世界。直到这里，前面的所有粒子几乎都是独立的。
核心矛盾：当能量 $E$ 包含 $s_i s_j$ 项时，配分函数 $Z$ 无法分解。Swendsen 在这里介绍了 Ising 模型，并以此为例讲解了**平均场近似 (Mean Field Approximation)**。

## Key Equations (公式锚点)

- **Eq 16.1**: Ising Hamiltonian
  \[ H = -J \sum_{\langle i,j \rangle} s_i s_j - H_{ext} \sum_i s_i \]
  - *含义*: 第一项是邻居相互作用，第二项是外场。

- **Eq 16.16-16.18**: Bragg-Williams (平均场) 自由能
  \[ F_{MF} = -\frac{1}{2} N q J m^2 - N k_B T \ln 2 \cosh(\beta (qJm + H)) \]
  - *含义*: 非常经典的平均场结果。注意那一项 $m^2$，它是导致相变的非线性来源。

## Signposts (阅读路标)

- **Section 16.1-16.2**: **The Ising Model**
  - 定义清楚什么是 Lattice，什么是 Interaction range。

- **Section 16.4**: **Mean Field Approximation**
  - Swendsen 用稍显直观的方式引入了平均场。要理解为什么它叫“平均”场——它把周围邻居的涨落抹平了。

## Critical Thinking (带着问题读)
1. 平均场在哪里会失效？（提示：看维度。在 1D 它错得离谱，在高维它越来越准）。
2. 自洽方程 $m = \tanh(\beta J_{eff} m)$ 为什么会有多解？这对应物理上的什么现象？（自发磁化）。

## Urban Mapping
- **Schelling Model**: 把它看作一种动态的 Ising 模型。
- **外部性**: $J$ 就是外部性强度。$J>0$ 是集聚效应，$J<0$ 是拥挤效应。
