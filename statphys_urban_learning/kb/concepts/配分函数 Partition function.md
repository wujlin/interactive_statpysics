---
type: concept
title: 配分函数 Partition function
tags: ['statmech', 'M3']
prereq: ['正则系综 Canonical ensemble', '热力学势 Thermodynamic potentials']
source: ['Gibbs / standard statmech']
status: ready
---

## 一句话
- 配分函数 \(Z\) 是指数族分布的归一化常数；它的对数 \(\ln Z\) 是“势/生成函数”，编码了系统的全部热力学信息。

## 定义（正则）
\[
Z(\beta) = \sum_x e^{-\beta E(x)}.
\]

## 为什么 ln Z 更重要
- 自由能：\(F=-k_B T\ln Z\)
- 均值/涨落来自导数：
\[
\langle E\rangle = -\partial_\beta \ln Z,\quad \mathrm{Var}(E)=\partial_\beta^2 \ln Z.
\]

## 直觉
- \(Z\) 是对所有状态的“加权计数”
- \(\ln Z\) 类似矩母函数/累积量生成函数：导数给出累积量（均值、方差…）

## 城市连接（最小）
- logit/softmax 的归一化项就是 \(Z\)；其 log-sum-exp 就是 \(\ln Z\)，在比较政策/参数时非常好用。
