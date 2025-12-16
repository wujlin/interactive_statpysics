---
type: solution
id: M4_solution
title: M4 巨正则与 OD 乘子形式（参考解答）
tags: [grand-canonical, chemical-potential, maxent, od, solution]
---

## (1) 巨正则分布与巨配分函数

巨正则把“能量 \(E\)”与“粒子数/规模 \(N\)”同时作为随机量。对微观态 \(x\) 与规模 \(N\)，分布写成
\[
p(x,N)\propto \exp\big(-\beta(E(x,N)-\mu N)\big)
=\exp\big(-\beta E(x,N)+\beta\mu\,N\big).
\]

归一化因子（巨配分函数）对所有 \(N\) 与对应的微观态求和：
\[
\mathcal{Z}(\beta,\mu)=\sum_{N}\sum_{x\in\mathcal{X}_N}\exp\big(-\beta(E(x,N)-\mu N)\big).
\]
因此
\[
p(x,N)=\frac{1}{\mathcal{Z}(\beta,\mu)}\exp\big(-\beta(E(x,N)-\mu N)\big).
\]

## (2) \(\langle N\rangle\) 与 \(\mathrm{Var}(N)\) 从 \(\ln\mathcal{Z}\) 得到

令 \(y=\beta\mu\)。把 \(\mathcal{Z}\) 写成
\[
\mathcal{Z}(\beta,y)=\sum_{N}\sum_{x} \exp\big(-\beta E(x,N)+yN\big).
\]

一阶导：
\[
\frac{\partial \mathcal{Z}}{\partial y}
=\sum_{N}\sum_x N\,\exp\big(-\beta E(x,N)+yN\big).
\]

因此
\[
\frac{\partial \ln\mathcal{Z}}{\partial y}
=\frac{1}{\mathcal{Z}}\frac{\partial\mathcal{Z}}{\partial y}
=\sum_{N}\sum_x N\,\frac{\exp(-\beta E(x,N)+yN)}{\mathcal{Z}}
=\langle N\rangle.
\]

二阶导：
\[
\frac{\partial^2 \ln\mathcal{Z}}{\partial y^2}
=\frac{\partial}{\partial y}\langle N\rangle
=\langle N^2\rangle-\langle N\rangle^2
=\mathrm{Var}(N)\ge 0.
\]

> 这和 M3 完全同构：\(\ln\mathcal{Z}\) 是“生成函数”，一阶导给均值，二阶导给涨落。

## (3) OD：边际约束 + 最小 KL \(\Rightarrow\) \(T_{ij}=a_i b_j Q_{ij}\)

考虑离散非负矩阵 \(T_{ij}\)（可理解为流量/概率质量），约束：
\[
\sum_j T_{ij}=O_i,\qquad \sum_i T_{ij}=D_j.
\]
给定 prior \(Q_{ij}>0\)，最小化
\[
KL(T\|Q)=\sum_{ij} T_{ij}\ln\frac{T_{ij}}{Q_{ij}}
\]
在上述线性约束下的最优解属于指数族。

构造拉格朗日函数（只写骨架）：
\[
\mathcal{L}
=\sum_{ij} T_{ij}\ln\frac{T_{ij}}{Q_{ij}}
\sum_i \alpha_i\Big(\sum_j T_{ij}-O_i\Big)
\sum_j \gamma_j\Big(\sum_i T_{ij}-D_j\Big).
\]

对每个 \(T_{ij}\) 求偏导并令 0（注意 \(\partial(T\ln T)/\partial T=\ln T+1\)）：
\[
\ln\frac{T_{ij}}{Q_{ij}}+1+\alpha_i+\gamma_j=0
\;\Rightarrow\;
T_{ij}=Q_{ij}\exp(-1-\alpha_i-\gamma_j).
\]

把只依赖 \(i\) 或 \(j\) 的项吸收进系数：
\[
a_i=\exp(-\alpha_i),\qquad b_j=\exp(-\gamma_j)\times e^{-1},
\]
得到乘子形式
\[
\boxed{\;T_{ij}=a_i b_j Q_{ij}\;}
\]
其中 \(a_i,b_j\) 由边际约束唯一确定（这就是 IPF/RAS 的出发点）。

## (4) 无成本 prior vs 带成本 prior 的直觉

- 无成本 prior：若 \(Q_{ij}\) 是常数（或仅与 \(i,j\) 无关），则 \(T\) 的结构主要由边际 \(O_i,D_j\) 决定，等价于“在边际约束下最均匀/最少偏见”的基线。
- 带成本 prior：若 \(Q_{ij}=\exp(-\beta c_{ij})\)，当 \(\beta\) 增大时高成本（大 \(c_{ij}\)）的条目被指数抑制，通常会：
  - 降低平均成本 \(\sum_{ij} T_{ij}c_{ij}/\sum_{ij}T_{ij}\)
  - 减少长距离/跨区流占比（若成本与距离正相关）
  - 使流量更“局域化”（更集中在低成本对上）
