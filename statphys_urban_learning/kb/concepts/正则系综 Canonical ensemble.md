---
type: concept
title: 正则系综 Canonical ensemble
tags: ['statmech', 'M3']
prereq: ['最大熵原理 Maximum entropy principle']
source: ['Gibbs ensemble']
status: ready
---

## 一句话
正则系综描述与恒温热库接触的平衡系统：$T,V,N$ 固定，微观态 $i$ 的概率 $p_i=\exp(-\beta E_i)/Z$，其中 $Z$ 为配分函数、$\beta=1/(k_B T)$。

## 定义（Boltzmann 分布）
- 对离散能级 \(E_i\)：
\[
p_i = \frac{e^{-\beta E_i}}{Z(\beta)},\quad Z(\beta)=\sum_i e^{-\beta E_i}.
\]
- 其中 \(\beta = 1/(k_B T)\)。

## 直觉
- 热浴把“能量约束”从硬约束（微正则）变成软约束（平均能量受控）
- 代价更高的状态以指数方式被抑制
- 推导路线：
  - 物理推导（系统与热库）：[[从系统与热库推出 Boltzmann 分布（正则系综）]]
  - 推断推导（最大熵）：[[Boltzmann 分布的最大熵推导]]
  - 两条路线合流原因：[[MaxEnt 与正则系综等价（信息等价）]]

## 常见误区（最小）
- \(e^{-\beta E}\) 不是“微正则单系统”直接推出来的：微正则能量固定在能壳上，分布是等概率。
- 指数权重来自“总系统微正则 + 边缘化”：当总体系（系统 + 热库）在固定 \(E_{\text{tot}}\) 下等概率时，子系统处于态 \(i\) 的概率满足 \(p_i\propto \Omega_B(E_{\text{tot}}-E_i)\approx e^{-\beta E_i}\)，归一化常数就是 \(Z\)（见：[[从系统与热库推出 Boltzmann 分布（正则系综）]]）。

## 与微正则的关系（系综等价性）
- 按能量壳分组，正则能量分布满足 \(P_\beta(E)\propto \Omega(E)e^{-\beta E}\)（见 Swendsen Eq 19.17）。
- 在热力学极限下，这个分布会尖峰化（相对涨落 \(\sim 1/\sqrt{N}\)），从而微正则（定能）与正则（定温）对宏观量给出同样预测；两种常用解释（涨落/鞍点）见：[[微正则与正则的系综等价性（能量尖峰化与鞍点）]]。

## 与热力学势的连接
- Helmholtz 自由能：
\[
F(T,V,N) = -k_B T \ln Z.
\]
- 一旦知道 \(Z\)，系统的热力学量可由导数得到。

## Source anchors
- Swendsen Eq 19.23：相空间正则分布 \(P(p,q) \propto e^{-\beta H(p,q)}\)
- Swendsen Eq 19.24：相空间配分函数 \(\tilde Z\)
- Swendsen Eq 19.49：\(F(T,V,N)=-k_B T\ln Z\)
