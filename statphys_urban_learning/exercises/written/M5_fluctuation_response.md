---
type: exercise
id: M5_written
title: M5 涨落—响应：导数=协方差（指数族通用结构）
difficulty: 2
tags: [fluctuation-response, exponential-family, sensitivity]
---

# M5 涨落—响应 — Written

## 题目

### (1) 指数族的“导数=协方差”结构（推导骨架）

考虑指数族
\[
p_\theta(x)=\frac{1}{Z(\theta)}\exp\big(\theta^\top f(x)\big),
\qquad Z(\theta)=\sum_x \exp\big(\theta^\top f(x)\big).
\]

证明（或写出最小推导骨架）：
\[
\frac{\partial}{\partial\theta}\,\mathbb{E}_\theta[f(x)]
=\mathrm{Cov}_\theta\!\big(f(x),f(x)\big).
\]
（一维情形就是 \(\partial_\theta \mathbb{E}[f]=\mathrm{Var}(f)\)。）

### (2) 城市映射：\(\beta\) 变化如何影响“集中程度”

把 logit/softmax 写成 Boltzmann 形式：
\[
p(i)\propto \exp\big(-\beta c_i\big),
\]
其中 \(\beta\) 可以理解为“理性度/噪声强度的倒数”。用 5–10 句话解释：\(\beta\) 变大/变小会让分布更尖/更平，以及这对城市流动/选择意味着什么。

---

## 提示（先做 20–30 分钟再看）

- (1) 先证明 \(\partial_\theta \ln Z=\mathbb{E}[f]\)，再对两边求一次导数。
- (1) 用到的唯一技巧：\(\partial_\theta p_\theta(x)=p_\theta(x)\big(f(x)-\mathbb{E}[f]\big)\)。
- (2) 自检可以看两个极限：\(\beta\to 0\) 与 \(\beta\to\infty\)。

---

## 自检（Self-Check）

- [ ] 你写出的推导是否只依赖 \(Z(\theta)\) 的一阶/二阶导？
- [ ] 一维情况下，你得到的是 \(\partial_\theta \mathbb{E}[f]=\mathrm{Var}(f)\ge 0\) 吗？
- [ ] \(\beta\to 0\) 时分布应趋于“更均匀”；\(\beta\to\infty\) 时分布应集中到最小成本项。

---

## 参考解答

👉 [查看参考解答](../solutions/M5_solution.md)（建议自己推导完成后再核对）
