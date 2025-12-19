---
type: concept
title: 微正则系综 Microcanonical ensemble
tags: ['statmech', 'M2']
prereq: ['多重度 multiplicity Ω', '熵 Entropy']
source: ['Gibbs ensemble']
status: ready
---

## 一句话
微正则系综描述孤立系统：$E,V,N$ 固定，允许微观态在能量壳上等概率取值（$p=1/\Omega$），熵由 $S(E,V,N)=k_B \ln \Omega(E,V,N)$ 定义。

## 定义（最小形式）
- 约束：\((E,V,N)\) 固定
- 等概率：对所有可及微观态 \(\Gamma\in\mathcal{A}(E,V,N)\)，
\[
p(\Gamma)=\frac{1}{\Omega(E,V,N)}.
\]

## 熵
\[
S(E,V,N)=k_B\ln \Omega(E,V,N).
\]

## 为什么重要
- 它是其他系综（正则、巨正则）的“源头参照”：
  - 子系统与热浴耦合 ⇒ 正则
  - 子系统与粒子库耦合 ⇒ 巨正则

## 最小例子
- 两盒分球：固定总球数 N；宏观态用左盒球数 k 表示；最概然 k 对应最大 \(\Omega(k)\)。
