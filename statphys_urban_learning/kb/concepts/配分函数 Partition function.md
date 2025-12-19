---
type: concept
title: 配分函数 Partition function
tags: ['statmech', 'M3']
prereq: ['正则系综 Canonical ensemble', '热力学势 Thermodynamic potentials']
source: ['Gibbs / standard statmech']
status: ready
---

## 一句话
配分函数 $Z(\beta)$ 是正则系综中 Boltzmann 权重的归一化常数 $Z=\sum_x \exp(-\beta E(x))$，同时作为生成函数使得 $\ln Z$ 的导数产生能量的累积量并给出自由能 $F=-k_B T \ln Z$。

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

## Source anchors
- Swendsen Eq 19.18：\(Z(T,V,N)=\int dE\,\Omega(E,V,N)e^{-\beta E}\)
- Swendsen Eq 19.49：\(F=-k_B T\ln Z\)
- Swendsen Eq 19.53：\(\partial_\beta \ln Z = -\langle E\rangle\)
- Swendsen Eq 19.59：\(\partial_\beta \langle E\rangle = -\langle E^2\rangle + \langle E\rangle^2\)
