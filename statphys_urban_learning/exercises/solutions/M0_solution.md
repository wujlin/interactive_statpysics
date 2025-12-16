---
type: solution
id: M0_solution
title: M0 热力学骨架（参考解答）
tags: [thermo, potentials, legendre, solution]
---

## 1) 从 \(U(S,V,N)\) 写出 \(dU\) 与 \(T,P,\mu\)

把 \(U\) 视作多元函数：
\[
dU=\left(\frac{\partial U}{\partial S}\right)_{V,N} dS+\left(\frac{\partial U}{\partial V}\right)_{S,N} dV+\left(\frac{\partial U}{\partial N}\right)_{S,V} dN.
\]

热力学定义（符号约定）是
\[
dU=T\,dS-P\,dV+\mu\,dN,
\]
因此得到
\[
T=\left(\frac{\partial U}{\partial S}\right)_{V,N},\qquad
P=-\left(\frac{\partial U}{\partial V}\right)_{S,N},\qquad
\mu=\left(\frac{\partial U}{\partial N}\right)_{S,V}.
\]

## 2) 推 \(dF\) 与 \(dG\)，并标自然变量

定义
\[
F=U-TS.
\]
全微分：
\[
dF=dU-T\,dS-S\,dT.
\]
代入 \(dU=T\,dS-P\,dV+\mu\,dN\)：
\[
dF=(T\,dS-P\,dV+\mu\,dN)-T\,dS-S\,dT
=-S\,dT-P\,dV+\mu\,dN.
\]
因此 \(F\) 的自然变量是 \((T,V,N)\)。

再定义
\[
G=F+PV.
\]
全微分：
\[
dG=dF+P\,dV+V\,dP.
\]
代入 \(dF=-S\,dT-P\,dV+\mu\,dN\)：
\[
dG=(-S\,dT-P\,dV+\mu\,dN)+P\,dV+V\,dP
=-S\,dT+V\,dP+\mu\,dN.
\]
因此 \(G\) 的自然变量是 \((T,P,N)\)。

## 快速检查

- 维度：每一项都是能量量纲。
- 符号：体积增大（\(dV>0\)）时做功项让内部能降低（\(-P\,dV\)）。
