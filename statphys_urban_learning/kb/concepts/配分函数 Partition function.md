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

## 为什么是“对 microstates 求和”
配分函数的底层定义是对**微观态（microstates）**求和/积分：概率分配在微观态上，而能量 \(E(x)\) 是微观态的函数，因此
\[
Z=\sum_{x\in\text{microstates}} e^{-\beta E(x)}.
\]

## 也可以“对能级求和”（按简并度/态密度分组）
如果许多微观态共享同一个能量 \(E\)，你当然可以把微观态求和按“相同能量”分组压缩：
\[
Z=\sum_E g(E)\,e^{-\beta E},
\]
其中 \(g(E)\) 是能级 \(E\) 的简并度（degeneracy）。

经典连续体系里常见的写法是用多重度/态密度 \(\Omega(E)\)：
\[
Z=\int dE\,\Omega(E,V,N)\,e^{-\beta E}.
\]
关键点：对能级求和不是“换了定义”，而是把微观态求和按能量分组；前提是你能给出 \(g(E)\) 或 \(\Omega(E)\)。

## 为什么 ln Z 更重要
- 自由能：\(F=-k_B T\ln Z\)
- 均值/涨落来自导数：
\[
\langle E\rangle = -\partial_\beta \ln Z,\quad \mathrm{Var}(E)=\partial_\beta^2 \ln Z.
\]

## 直觉
- \(Z\) 是对所有状态的“加权计数”
- \(\ln Z\) 类似矩母函数/累积量生成函数：导数给出累积量（均值、方差…）
- 也可把 \(Z\) 看作对微正则态数 \(\Omega(E)\) 的“加权求和/拉普拉斯变换”，大 \(N\) 下由鞍点主导，从而解释微正则↔正则等价（见：[[微正则与正则的系综等价性（能量尖峰化与鞍点）]]）。

## 城市连接（最小）
- 在离散选择（logit/softmax）里，归一化项就是 \(Z=\sum_i e^{-\beta C_i}\)；logsum/inclusive value 通常写作 \((1/\beta)\ln Z\)（与成本同量纲），它更像“指数加权后的聚合势”，而不是把成本/效用直接相加。

## Source anchors
- Swendsen Eq 19.18：\(Z(T,V,N)=\int dE\,\Omega(E,V,N)e^{-\beta E}\)
- Swendsen Eq 19.49：\(F=-k_B T\ln Z\)
- Swendsen Eq 19.53：\(\partial_\beta \ln Z = -\langle E\rangle\)
- Swendsen Eq 19.59：\(\partial_\beta \langle E\rangle = -\langle E^2\rangle + \langle E\rangle^2\)
