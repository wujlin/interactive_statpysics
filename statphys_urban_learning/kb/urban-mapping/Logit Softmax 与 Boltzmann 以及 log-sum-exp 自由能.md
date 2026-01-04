---
type: urban_mapping
title: Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能
tags: ['urban', 'logit', 'softmax', 'M3']
prereq: ['配分函数 Partition function']
source: ['discrete choice / statmech analogy']
status: ready
---

## 目的
- 把离散选择（logit/softmax）与统计物理的 Boltzmann 分布对齐，并理解 log-sum-exp 的“势/自由能”角色。

## 对应关系（最小）
- 选择集合：\(\mathcal{X}\)（目的地/路径/方案）
- 代价/负效用：\(c(x)\) 或 \(-u(x)\)
- 随机性尺度：\(\lambda\)（logit 的尺度） ↔ 温度 \(T\)（或 \(\beta=1/kT\)）

## 分布（完全同构）
- Logit：
\[
p(x)=\frac{\exp(u(x)/\lambda)}{\sum_{x'}\exp(u(x')/\lambda)}.
\]
- Boltzmann（令 \(E=-u\)，\(\beta=1/\lambda\)）：
\[
p(x)=\frac{\exp(-\beta E(x))}{Z},\quad Z=\sum_{x'}\exp(-\beta E(x')).
\]

## 为什么是对 microstates 求和？能否改成对“成本水平”求和？
配分函数的底层定义是对微观态求和：这里的微观态就是“一个人面对的一项具体备选方案”（目的地/路径/居住地方案等），因此自然出现
\[
Z=\sum_{x\in\mathcal{X}} e^{-\beta E(x)}.
\]

如果你把选项按“成本（或效用）区间”分桶，也可以把微观态求和按“同成本”分组压缩：设“成本约为 \(C\)”的方案数为 \(g(C)\)，则
\[
Z=\sum_C g(C)\,e^{-\beta C},
\]
连续情形下把求和换成积分即可。要点：这不是换定义，而是把微观态求和按“同成本”做了分组。

## 为什么会出现指数权重（从微正则到正则的“三行推导”）
微正则“单系统”本身是能壳上的等概率；指数权重来自把系统放进更大的孤立体系并对环境做边缘化：
1) 总体系（系统 + 环境/热库）在 \(E_{\text{tot}}\) 下微正则 \(\Rightarrow\) 等概率；  
2) 子系统取状态 \(x\) 的概率 \(P(x)\propto \Omega_{\text{bath}}(E_{\text{tot}}-c(x))\)；  
3) 热库足够大时 \(\ln\Omega_{\text{bath}}(E_{\text{tot}}-c)\approx \text{const}-\beta c\Rightarrow P(x)\propto e^{-\beta c(x)}\)。  

完整物理推导（以及配分函数 \(Z\) 的出现）见：[[从系统与热库推出 Boltzmann 分布（正则系综）]]。

## log-sum-exp = “自由能/势”
- 定义：
\[
\mathrm{LSE}(u)=\lambda\ln\sum_{x}\exp(u(x)/\lambda).
\]
- 统计物理对应：
\[
F=-kT\ln Z\quad(\text{差一个符号/变量映射}).
\]
- 作用：\(\sum_x \exp(u/\lambda)\) 本身不是“把效用相加”的总价值，而是**指数加权后的总权重**；取 \(\ln\) 后变成可加、可微的“势/生成函数”，适合做比较与求导。
- 在标准 logit（i.i.d. Gumbel 误差）下，\(\mathrm{LSE}(u)\) 与 \(\mathbb E[\max_x U_x]\) 仅差一个与选项无关的常数（因此可解释为 logsum / inclusive value）。
- 生成性质（最关键的一行）：导数吐出概率
\[
\frac{\partial\,\mathrm{LSE}(u)}{\partial u(x)} = p(x).
\]

## 城市落地
- 当政策改变 \(u(x)\) 或成本 \(c(x)\) 时，log-sum-exp 的变化是“整体可达性/效用势”的变化；
- 导数给出选择概率与敏感性（对应 lnZ 导数规则）。
