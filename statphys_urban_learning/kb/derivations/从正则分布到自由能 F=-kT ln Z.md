---
type: derivation
title: 从正则分布到自由能 F=-kT ln Z
tags: ['canonical', 'free-energy', 'M3']
prereq: ['正则系综 Canonical ensemble', '热力学势 Thermodynamic potentials']
source: ['standard statmech']
status: ready
---

## 目标
- 从正则分布出发，推导桥接公式 \(F=-k_BT\ln Z\)，并解释它为什么是“统计 \(\Rightarrow\) 热力学势”的关键一步。
- 上游（微正则 \(\Rightarrow\) 正则）推导见：[[从系统与热库推出 Boltzmann 分布（正则系综）]]。

## 起点（定义与约定）
正则分布（离散微观态 \(i\)）：
\[
p_i=\frac{e^{-\beta E_i}}{Z},\qquad Z(\beta)=\sum_i e^{-\beta E_i},\qquad \beta\equiv\frac{1}{k_BT}.
\]
Gibbs 熵（信息论形式）：
\[
S\equiv -k_B\sum_i p_i\ln p_i.
\]
自由能的热力学定义（定温势）：
\[
F\equiv U-TS,\qquad U\equiv \langle E\rangle=\sum_i p_iE_i.
\]

## 推导（不跳步）
1) 先把 \(\ln p_i\) 写开：
\[
\ln p_i=\ln\left(\frac{e^{-\beta E_i}}{Z}\right)=-\beta E_i-\ln Z.
\]
2) 代回熵的定义：
\[
\begin{aligned}
S
&= -k_B\sum_i p_i\ln p_i \\
&= -k_B\sum_i p_i(-\beta E_i-\ln Z) \\
&= k_B\beta\sum_i p_iE_i + k_B(\ln Z)\sum_i p_i.
\end{aligned}
\]
3) 用归一化 \(\sum_i p_i=1\) 与内能定义 \(\sum_i p_iE_i=U\) 化简：
\[
S=k_B\beta U + k_B\ln Z.
\]
4) 代回 \(F\equiv U-TS\)，并用 \(\beta=1/(k_BT)\)：
\[
\begin{aligned}
F
&= U-T(k_B\beta U+k_B\ln Z) \\
&= U-(U+k_BT\ln Z) \\
&= -k_BT\ln Z.
\end{aligned}
\]

## 结果（桥接公式）
\[
\boxed{F(T,V,N)=-k_BT\ln Z(T,V,N).}
\]

## 直觉（你该把它当成什么）
- \(Z\) 是“指数加权的总权重”；取 \(\ln Z\) 把乘法结构变成可加结构。
- 这条桥接把“归一化常数”升级为“热力学势”：一旦能算 \(Z\)，就能系统性得到 \(F,S,U,P,\mu\)（通过求导）。

## 检查
- \(Z\) 无量纲 ⇒ \(\ln Z\) 无量纲 ⇒ \(k_BT\ln Z\) 有能量单位
- 与热力学：\(dF=-S\,dT-P\,dV+\mu\,dN\) 一致（进一步导数即可验证）

## Source anchors
- Swendsen Eq 19.49：\(F(T,V,N)=-k_B T\ln Z\)

## 对照（微正则熵视角）
- 也可以从 \(Z(\beta)=\int dE\,\Omega(E)e^{-\beta E}\) 出发，在热力学极限下用鞍点近似得到 \(F(T)\approx \min_E[E-TS(E)]\)，从而把 \(F\) 明确为微正则熵 \(S(E)\) 的 Legendre 对偶：[[F=-kT ln Z 与 S(E) 的 Legendre 对偶（势函数视角）]]。
