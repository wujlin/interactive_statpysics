# Reading Guide: Swendsen Chapter 5 (Probability)

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Probability, Bayes Theorem, Independence

## TL;DR (30秒概览)
这一章是概率论基础。如果你已经很熟悉概率论（如条件概率、独立性），可以快速浏览。
核心点：Swendsen 特别强调“**信息缺失**”的概念——概率是对我们“不知道什么”的度量，这与 Jaynes 的主观概率视角一脉相承。

## Key Equations (公式锚点)

- **Eq 5.8**: 条件概率定义
  \[ P(y|x) = \frac{P(x,y)}{P(x)} \]
  - *含义*: 在已知 $x$ 的世界里，$y$ 发生的概率。

- **Eq 5.10**: 贝叶斯定理 (Bayes Theorem)
  \[ P(x|y) = \frac{P(y|x)P(x)}{P(y)} \]
  - *含义*: 推断的核心。$P(x)$ 是先验（Prior），$P(y|x)$ 是似然（Likelihood），$P(x|y)$ 是后验（Posterior）。

- **Eq 5.12**: 独立性
  \[ P(x, y) = P(x)P(y) \iff P(x|y) = P(x) \]
  - *含义*: 教授的重点锚点。独立意味着“知道 $y$ 对猜测 $x$ 毫无帮助”。

## Signposts (阅读路标)

- **Section 5.1-5.3**: **Basic Probability**
  - 正常的概率定义。注意他对 "Normalization" (归一化) 的强调。

- **Section 5.6**: **Information and Uncertainty**
  - 这是统计物理独特的视角。他讨论了如何量化“不知道”。

## Critical Thinking (带着问题读)
1. 为什么“概率”在统计物理中既可以是客观的频率（扔硬币），又可以是主观的信息（我有多少把握）？Jaynes 会怎么看？
2. 如果粒子之间有相互作用（$E = -J s_i s_j$），$P(s_i, s_j)$ 还能写成 $P(s_i)P(s_j)$ 吗？

## Urban Mapping
- **条件概率**: $P(\text{Destination}|\text{Origin})$ —— OD 矩阵的核心。
- **独立性检验**: 检验两个区域的房价波动是否无关（以此划分房地产板块）。
