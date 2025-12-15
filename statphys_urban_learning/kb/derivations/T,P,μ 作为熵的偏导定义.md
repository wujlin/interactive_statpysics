---
type: derivation
title: T,P,μ 作为熵的偏导定义
tags: ['thermodynamics', 'M2']
prereq: ['微正则系综 Microcanonical ensemble', '热力学势 Thermodynamic potentials']
source: ['Thermo/statmech basics']
status: ready
---

## 目标
- 从 \(S(E,V,N)\) 的微分形式读出 \(T,P,\mu\) 的偏导定义。

## 关键起点
- 在微正则框架，熵可以看作 \(S(E,V,N)\)。

## 推导
1) 把 \(S\) 当作状态函数：
\[
dS = \left(\frac{\partial S}{\partial E}\right)_{V,N} dE
    + \left(\frac{\partial S}{\partial V}\right)_{E,N} dV
    + \left(\frac{\partial S}{\partial N}\right)_{E,V} dN.
\]
2) 与热力学基本关系（等价写法）对齐：
\[
dS = \frac{1}{T}dE + \frac{P}{T}dV - \frac{\mu}{T}dN.
\]
3) 逐项比较得到定义：
\[
\frac{1}{T}=\left(\frac{\partial S}{\partial E}\right)_{V,N},\quad
\frac{P}{T}=\left(\frac{\partial S}{\partial V}\right)_{E,N},\quad
-\frac{\mu}{T}=\left(\frac{\partial S}{\partial N}\right)_{E,V}.
\]

## 结果（最常用）
- \(T\) 来自熵对能量的偏导
- \(P\) 来自熵对体积的偏导
- \(\mu\) 来自熵对粒子数的偏导（注意负号）

## 检查
- 若只改变能量 \(dV=dN=0\)，则 \(dS=(1/T)dE\)，符合“升温/吸能→熵增”的直觉。
