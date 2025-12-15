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

## log-sum-exp = “自由能/势”
- 定义：
\[
\mathrm{LSE}(u)=\lambda\ln\sum_{x}\exp(u(x)/\lambda).
\]
- 统计物理对应：
\[
F=-kT\ln Z\quad(\text{差一个符号/变量映射}).
\]
- 作用：把“对所有备选的加权计数”压缩成一个标量势，用于比较参数/政策（类似 free energy）。

## 城市落地
- 当政策改变 \(u(x)\) 或成本 \(c(x)\) 时，log-sum-exp 的变化是“整体可达性/效用势”的变化；
- 导数给出选择概率与敏感性（对应 lnZ 导数规则）。
