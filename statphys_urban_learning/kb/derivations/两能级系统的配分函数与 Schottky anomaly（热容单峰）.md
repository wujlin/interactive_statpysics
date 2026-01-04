---
type: derivation
title: 两能级系统的配分函数与 Schottky anomaly（热容单峰）
tags: ['canonical', 'partition-function', 'two-level', 'heat-capacity', 'M3']
prereq: ['正则系综 Canonical ensemble', '配分函数 Partition function', '平均能量与 ln Z 的导数关系', '协方差与二阶导（通用）']
source: ['Swendsen 2012 (canonical machinery)', 'standard statmech']
status: ready
---

## 一句话
两能级系统是把 \(Z\to \ln Z\to U\to C_V\) 这一条“正则系综生成链”练熟的最小玩具模型：它在有限能隙 \(\Delta\) 下给出一个典型的热容单峰（Schottky anomaly）。

## 0. 设定（能级 + 简并度）
考虑一个只有两个能级的系统：
- 基态：能量 \(E_0=0\)，简并度 \(g_0\ge 1\)
- 激发态：能量 \(E_1=\Delta>0\)，简并度 \(g_1\ge 1\)

在正则系综中
\[
p_j=\frac{e^{-\beta E_j}}{Z},\qquad \beta\equiv\frac{1}{k_BT}.
\]

这页所有结果都只依赖无量纲组合 \(\beta\Delta\)（以及 \(g_0,g_1\)）。

## 1. 配分函数 \(Z\)：为什么既能“对微观态求和”，也能“对能级求和”
### 1.1 底层定义：对 microstates 求和
配分函数的底层定义是对所有微观态求和：
\[
Z=\sum_{j\in\text{microstates}} e^{-\beta E_j}.
\]
在两能级系统中，microstates 可以理解为：
- 有 \(g_0\) 个微观态满足能量 \(0\)
- 有 \(g_1\) 个微观态满足能量 \(\Delta\)

因此直接得到
\[
Z=g_0\cdot e^{-\beta\cdot 0}+g_1\cdot e^{-\beta\Delta}
=\boxed{g_0+g_1 e^{-\beta\Delta}}.
\]

### 1.2 分组压缩：按能级求和
如果把所有“能量相同”的微观态合并为一个能级，并用简并度 \(g(E)\) 计数，则
\[
Z=\sum_E g(E)e^{-\beta E}.
\]
对本模型，只有两个能级，所以这只是把上一节“分组写法”显式写出来而已：
\[
Z=g(0)e^{0}+g(\Delta)e^{-\beta\Delta}=g_0+g_1 e^{-\beta\Delta}.
\]

> 结论：对能级求和不是“换了定义”，而是把对 microstates 的求和按能量做分组压缩；前提是你能给出简并度/态密度。

## 2. 概率：能级占据与“激发态概率”
能级（或能量）意义下的占据概率为
\[
P(E=0)=\frac{g_0}{Z},\qquad
P(E=\Delta)=\frac{g_1 e^{-\beta\Delta}}{Z}.
\]

把激发态占据概率记作
\[
p\equiv P(E=\Delta)=\frac{g_1 e^{-\beta\Delta}}{g_0+g_1 e^{-\beta\Delta}},
\qquad 1-p=P(E=0).
\]

## 3. 内能 \(U(T)\)：两种等价推法（都要会）
### 3.1 直接按定义求期望
\[
U\equiv \langle E\rangle = \sum_E E\,P(E)=0\cdot (1-p)+\Delta\cdot p
=\boxed{\Delta\,p}.
\]
即
\[
U(T)=\Delta\,\frac{g_1 e^{-\beta\Delta}}{g_0+g_1 e^{-\beta\Delta}}.
\]

### 3.2 用生成函数关系 \(U=-\partial_\beta\ln Z\)
正则系综的一条基本关系（见：[[平均能量与 ln Z 的导数关系]]）是
\[
U=-\frac{\partial}{\partial\beta}\ln Z.
\]
对本模型
\[
\ln Z=\ln(g_0+g_1 e^{-\beta\Delta}),
\]
所以
\[
\begin{aligned}
U
&=-\frac{1}{g_0+g_1 e^{-\beta\Delta}}\cdot \frac{\partial}{\partial\beta}(g_0+g_1 e^{-\beta\Delta})\\
&=-\frac{1}{g_0+g_1 e^{-\beta\Delta}}\cdot g_1(-\Delta)e^{-\beta\Delta}\\
&=\Delta\,\frac{g_1 e^{-\beta\Delta}}{g_0+g_1 e^{-\beta\Delta}},
\end{aligned}
\]
与 3.1 完全一致。

## 4. 热容 \(C_V(T)\)：从涨落与从导数（两条路都走一遍）
### 4.1 先算方差，再用 \(\mathrm{Var}(E)=k_BT^2 C_V\)
对两能级系统，
\[
\langle E\rangle=\Delta p,\qquad
\langle E^2\rangle=\Delta^2 p.
\]
因此能量方差
\[
\mathrm{Var}(E)=\langle E^2\rangle-\langle E\rangle^2
=\Delta^2 p-(\Delta p)^2
=\boxed{\Delta^2 p(1-p)}.
\]

由正则系综的涨落关系（Swendsen Eq 19.60；也可由 \(\partial_\beta^2\ln Z\) 推出）
\[
\mathrm{Var}(E)=k_BT^2 C_V,
\]
立刻得到
\[
\boxed{C_V(T)=\frac{\Delta^2}{k_BT^2}\,p(1-p)
=k_B(\beta\Delta)^2 p(1-p).}
\]

### 4.2 用定义 \(C_V=(\partial U/\partial T)_V\) 显式求导
从 \(U=\Delta p\) 出发，对 \(T\) 求导：
\[
C_V=\frac{\partial U}{\partial T}=\Delta\,\frac{\partial p}{\partial T}.
\]
由于 \(\beta=1/(k_BT)\)，
\[
\frac{d\beta}{dT}=-\frac{1}{k_BT^2}.
\]
链式法则：
\[
\frac{\partial p}{\partial T}=\frac{\partial p}{\partial\beta}\frac{d\beta}{dT}.
\]
先求 \(\partial_\beta p\)。写成
\[
p=\frac{g_1 e^{-\beta\Delta}}{g_0+g_1 e^{-\beta\Delta}}
=\frac{a}{g_0+a},\qquad a\equiv g_1 e^{-\beta\Delta}.
\]
则
\[
\frac{\partial p}{\partial a}=\frac{g_0}{(g_0+a)^2}=\frac{p(1-p)}{a},
\qquad
\frac{\partial a}{\partial\beta}=-\Delta a.
\]
合并得到
\[
\frac{\partial p}{\partial\beta}
=\frac{\partial p}{\partial a}\frac{\partial a}{\partial\beta}
=\frac{p(1-p)}{a}(-\Delta a)
=-\Delta p(1-p).
\]
因此
\[
\frac{\partial p}{\partial T}
=(-\Delta p(1-p))\left(-\frac{1}{k_BT^2}\right)
=\frac{\Delta}{k_BT^2}p(1-p),
\]
最终
\[
C_V=\Delta\cdot \frac{\Delta}{k_BT^2}p(1-p)=\frac{\Delta^2}{k_BT^2}p(1-p),
\]
与 4.1 完全一致。

## 5. Schottky anomaly：为什么 \(C_V(T)\) 在两端都趋于 0，中间出现单峰
### 5.1 低温极限 \(T\to 0\)（\(\beta\Delta\to\infty\)）
此时 \(e^{-\beta\Delta}\to 0\)，所以
\[
p=\frac{g_1 e^{-\beta\Delta}}{g_0+g_1 e^{-\beta\Delta}}\to 0,
\quad
U\to 0,
\quad
C_V\propto (\beta\Delta)^2 p(1-p)\to 0.
\]
物理直觉：系统几乎总在基态，吸热也难以“激发跨越能隙”。

### 5.2 高温极限 \(T\to\infty\)（\(\beta\Delta\to 0\)）
此时指数权重趋近 1，能级占据主要由简并度决定：
\[
p\to \frac{g_1}{g_0+g_1},
\qquad
U\to \Delta\,\frac{g_1}{g_0+g_1}.
\]
但热容包含一个 \((\beta\Delta)^2\) 因子，因此
\[
C_V=k_B(\beta\Delta)^2 p(1-p)\xrightarrow[\beta\Delta\to 0]{}0.
\]
物理直觉：温度已经远高于能隙尺度，继续升温几乎不会改变能级占据比例。

### 5.3 因此必有“中间一峰”
由于 \(C_V(T)\ge 0\)，且 \(T\to 0\) 与 \(T\to\infty\) 都趋于 0，中间典型地出现一个单峰：这就是 Schottky anomaly。

对最常见的 \(g_0=g_1=1\) 情形，令
\[
x\equiv \beta\Delta,
\qquad
\frac{C_V}{k_B}=x^2\frac{e^{x}}{(1+e^{x})^2}.
\]
极值条件 \(d(C_V/k_B)/dx=0\) 给出一个超越方程（无初等闭式解），其解为
\[
x^*\approx 2.40,
\qquad
T_{\text{peak}}\approx \frac{\Delta}{2.40\,k_B},
\qquad
\left(\frac{C_V}{k_B}\right)_{\text{peak}}\approx 0.44.
\]

## 6. 城市对应（最小）
把两个能级看成二元选择（binary logit）的两个备选项：
- “能量” \(E\) 对应广义成本 \(C\)
- \(p=P(E=\Delta)\) 对应“选择高成本方案”的概率
- \(Z=g_0+g_1 e^{-\beta\Delta}\) 是归一化常数；\(\ln Z\) 的变化刻画“选项集合整体质量”的变化

更完整对照见：[[Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能]]。

