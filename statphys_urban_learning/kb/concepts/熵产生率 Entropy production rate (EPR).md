---
type: concept
title: 熵产生率 Entropy production rate (EPR)
tags: ['nonequilibrium', 'stochastic', 'M10']
prereq: ['非平衡稳态 NESS', '细致平衡 Detailed balance 与净流']
source: ['standard formula for Markov jump processes']
status: ready
---

## 一句话
熵产生率（EPR）是量化离散 Markov 动力学不可逆性的指标：在稳态下它为 0 当且仅当系统满足细致平衡；若存在环流（NESS），则 EPR \(>0\)。

## 离散 Markov（连续时间跳跃过程）的常用表达
给定转移率 \(W_{ij}\)（\(i\neq j\)），分布 \(p_i(t)\)，定义净流
\[
J_{ij}(t)=p_i(t)W_{ij}-p_j(t)W_{ji}.
\]
则一条常用的熵产生率公式是
\[
\sigma(t)=\frac{1}{2}\sum_{i\neq j} J_{ij}(t)\,\ln\frac{p_i(t)W_{ij}}{p_j(t)W_{ji}}\ge 0.
\]
稳态下令 \(p=\pi\) 得 \(\sigma_{\mathrm{ss}}\)。

## 常见误区
- **误区：**“稳态就意味着熵产生为 0。”  
  纠正：稳态只要求节点层面守恒（总流入=总流出），并不排除边上的环流；NESS 的 \(\sigma_{\mathrm{ss}}>0\)。

## 与其他概念的连接
- NESS 的最小定义：[[非平衡稳态 NESS]]
- 计算环流/判别平衡：[[细致平衡 Detailed balance 与净流]]

