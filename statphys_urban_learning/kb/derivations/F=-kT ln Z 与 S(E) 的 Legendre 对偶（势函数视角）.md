---
type: derivation
title: F=-kT ln Z 与 S(E) 的 Legendre 对偶（势函数视角）
tags: ['canonical', 'microcanonical', 'free-energy', 'partition-function', 'legendre', 'saddle-point', 'M0', 'M2', 'M3']
prereq:
  [
    '热力学势 Thermodynamic potentials',
    'Legendre 变换 从 U 到 F 到 G',
    '多重度 multiplicity Ω',
    '熵 Entropy',
    '配分函数 Partition function',
    '热力学极限 Thermodynamic limit',
  ]
source: ['Swendsen 2012', 'standard statmech']
status: ready
---

## 目标
- 解释两件常被一句话压缩的内容：
  1) 为什么 \(F\) 是一个“势函数”（thermodynamic potential）：它既是生成函数，也是给定控制条件下的平衡判据；
  2) 为什么在热力学极限下，正则的 \(F(T)=-k_BT\ln Z\) 与微正则的 \(S(E)=k_B\ln\Omega(E)\) 通过 Legendre 对偶联系起来。

---

## 1) “势函数”到底是什么意思（两句话够用）
以 Helmholtz 自由能 \(F(T,V,N)\) 为例（定义与微分关系见：[[热力学势 Thermodynamic potentials]]、[[Legendre 变换 从 U 到 F 到 G]]）：

### (a) 生成函数：一阶导数吐出宏观量
\[
dF=-S\,dT-P\,dV+\mu\,dN
\]
因此
\[
S=-\left(\frac{\partial F}{\partial T}\right)_{V,N},\qquad
P=-\left(\frac{\partial F}{\partial V}\right)_{T,N},\qquad
\mu=\left(\frac{\partial F}{\partial N}\right)_{T,V}.
\]
这就是“势”的第一层含义：**对势函数求偏导会生成响应量**（像力学里势能的梯度生成力）。

### (b) 平衡判据：在给定控制条件下取极值（通常最小）
当实验装置把 \((T,V,N)\) 固定住时，自发过程会让 \(F\) 降低，平衡态对应 \(F\) 的最小值。
这就是“势”的第二层含义：**把约束条件写进自变量里，让平衡问题变成极值问题**。

---

## 2) 从统计物理看：为什么 \(F=-k_BT\ln Z\)
在正则系综中
\[
p_i=\frac{e^{-\beta E_i}}{Z(\beta)},\qquad Z(\beta)=\sum_i e^{-\beta E_i},\qquad \beta=\frac{1}{k_BT}.
\]
并且（Swendsen Eq 19.49）
\[
\boxed{F(T,V,N)=-k_BT\ln Z(\beta;V,N).}
\]
这个结论的最短推导见：[[从正则分布到自由能 F=-kT ln Z]]。

---

## 3) 关键补桥：\(\ln Z\) 其实是在做“指数加权计数”
把正则的配分函数按能量壳分组（Swendsen Eq 19.18 的结构）：
\[
Z(\beta)=\int dE\,\Omega(E,V,N)\,e^{-\beta E}.
\]
其中 \(\Omega(E,V,N)\) 是微正则的“态数/相空间体积”（见：[[多重度 multiplicity Ω]]）。

用微正则熵 \(S(E)=k_B\ln\Omega(E)\) 改写被积函数：
\[
Z(\beta)=\int dE\;\exp\!\left(\frac{S(E)}{k_B}-\beta E\right).
\]
这一步告诉你：正则系综不是抛弃了“计数”，而是把“硬计数”换成了“指数加权计数”。

---

## 4) 热力学极限：鞍点 \(\Rightarrow\) Legendre 对偶
对宏观系统，\(S(E)\sim O(N)\)。因此上式的积分由最大项主导（Laplace/鞍点思想）：
\[
\ln Z(\beta)\approx \max_E\left[\frac{S(E)}{k_B}-\beta E\right].
\]
主导能量 \(E^\*\) 满足
\[
\frac{d}{dE}\left(\frac{S(E)}{k_B}-\beta E\right)=0
\quad\Longrightarrow\quad
\beta=\frac{1}{k_B}\left(\frac{\partial S}{\partial E}\right)_{V,N}.
\]
这一步把正则参数 \(\beta\) 与微正则温度定义对齐（见：[[微正则与正则的系综等价性（能量尖峰化与鞍点）]]）。

把 \(F=-k_BT\ln Z\) 代入上面的极值形式（注意 \(T=1/(k_B\beta)\)）：
\[
F(T)\approx -k_BT\max_E\left[\frac{S(E)}{k_B}-\beta E\right]
=\min_E\left[E-TS(E)\right].
\]
并且在极小点上
\[
F(T)=E^\*(T)-T\,S(E^\*(T)).
\]

> 这就是“\(F\) 与 \(S(E)\) 通过 Legendre 变换对应”的统计物理版本：  
> **正则自由能是微正则熵的 Legendre（更准确说是凸共轭）变换。**

---

## 5) 你现在应该能把一句话讲清楚
微正则的主角是 \(\Omega(E)\)（硬约束计数）与 \(S(E)=k_B\ln\Omega(E)\)；  
正则的主角是 \(Z(\beta)\)（指数加权计数）与 \(F(T)=-k_BT\ln Z\)。  
在热力学极限下，指数加权由鞍点主导，\(\ln Z\) 与 \(S(E)\) 通过 Legendre 对偶相连，于是 \(F(T)\) 成为“给定 \(T\)”时的势函数与极值判据。

## Source anchors
- Swendsen Eq 19.18：\(Z=\int dE\,\Omega(E,V,N)\,e^{-\beta E}\)
- Swendsen Eq 19.49：\(F=-k_BT\ln Z\)
