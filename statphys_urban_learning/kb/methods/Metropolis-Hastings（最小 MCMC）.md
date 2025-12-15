---
type: method
title: Metropolis-Hastings（最小 MCMC）
tags: ['mcmc', 'sampling', 'M3']
prereq: ['配分函数 Partition function']
source: ['Krauth']
status: ready
---

## 什么时候用？
- 你知道目标分布 \(\pi(x)\propto e^{-\beta E(x)}\)（或更一般的 \(\pi(x)\)），但无法直接采样；
- 你想估计期望 \(\mathbb{E}_\pi[A(x)]\)。

## 输入/输出
- 输入：
  - 目标密度（只需比例）：\(\pi(x)\)
  - 提议分布：\(q(x'\mid x)\)（例如随机游走高斯）
  - 步数：\(T\)，以及 burn-in、thin（可选）
- 输出：
  - 样本链 \(x_0,x_1,\dots,x_T\)
  - 观测量估计：\(\hat{\mathbb{E}}[A]\approx \frac{1}{T}\sum_t A(x_t)\)

## 核心步骤（伪代码）
1) 初始化 \(x\)
2) 重复 t=1..T：
   - 提议：采样 \(x' \sim q(x'\mid x)\)
   - 计算接受率：
\[
a = \min\left(1,\ \frac{\pi(x')\,q(x\mid x')}{\pi(x)\,q(x'\mid x)}\right)
\]
   - 以概率 \(a\) 接受 \(x\leftarrow x'\)，否则保持 \(x\)
3) 丢弃 burn-in；必要时做 thinning；对 \(A(x)\) 求平均

## 正确性（你需要知道的最低限）
- 该接受率保证链满足细致平衡（在温和条件下）⇒ \(\pi\) 是平稳分布；
- 链混合后，时间平均近似分布平均（遍历性假设/性质）。

## 注意事项（最小）
- **自相关**：样本不是独立的 ⇒ 需要自相关时间/ESS（见诊断卡）
- **步长调参**：随机游走提议太小 ⇒ 混合慢；太大 ⇒ 接受率低（效率也低）

## 最小例子
- \(E(x)=x^2/2\) ⇒ \(\pi(x)\propto e^{-\beta x^2/2}\) 是高斯；用随机游走 MH 可采样并估计均值/方差。
