---
type: derivation
title: Legendre 变换 从 U 到 F 到 G
tags: ['thermodynamics', 'M0']
prereq: ['热力学势 Thermodynamic potentials']
source: ['Thermo basics']
status: ready
---

## 目标
- 通过 Legendre 变换把势的自然变量从 \((S,V,N)\) 换成 \((T,V,N)\) 或 \((T,P,N)\)。

## 已知
- 内能表示：
\[
dU = T\,dS - P\,dV + \mu\,dN.
\]

## 推导步骤（骨架）
1) 定义 Helmholtz 自由能：
\[
F \equiv U - TS.
\]
2) 对两边求微分：
\[
dF = dU - T\,dS - S\,dT.
\]
3) 代入 \(dU\)：
\[
dF = (T\,dS - P\,dV + \mu\,dN) - T\,dS - S\,dT
= -S\,dT - P\,dV + \mu\,dN.
\]
⇒ \(F\) 的自然变量是 \((T,V,N)\)。

4) 定义 Gibbs 自由能：
\[
G \equiv F + PV = U - TS + PV.
\]
5) 求微分并代入 \(dF\)：
\[
dG = dF + P\,dV + V\,dP
= (-S\,dT - P\,dV + \mu\,dN) + P\,dV + V\,dP
= -S\,dT + V\,dP + \mu\,dN.
\]
⇒ \(G\) 的自然变量是 \((T,P,N)\)。

## 结果（你应该记住）
- \(dF = -S\,dT - P\,dV + \mu\,dN\)
- \(dG = -S\,dT + V\,dP + \mu\,dN\)

## 检查
- 维度：每一项都是能量
- 自然变量：写成 \(d(\text{势}) = \sum (\text{共轭量})\,d(\text{自然变量})\)

## Source anchors
- Swendsen Eq 12.10：\(F \equiv U-TS\)
- Swendsen Eq 12.11：\(dU = T\,dS - P\,dV + \mu\,dN\)
- Swendsen Eq 12.12：\(dF = -S\,dT - P\,dV + \mu\,dN\)
