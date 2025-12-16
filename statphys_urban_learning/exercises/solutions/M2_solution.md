---
type: solution
id: M2_solution
title: M2 微正则（参考解答）
tags: [microcanonical, multiplicity, thermo-limit, solution]
---

## 1) 示例：\(N\) 个可区分球分到两盒

设有 \(N\) 个可区分球，每个球独立地放入左/右盒。宏观态用“左盒球数” \(n\) 表示。

- 给定 \(n\)，选择哪些球在左盒的方式数：
\[
\Omega(n)=\binom{N}{n}.
\]
- Boltzmann 熵（形式上）：
\[
S(n)=k_B\ln\Omega(n)=k_B\ln\binom{N}{n}.
\]

最概然宏观态等价于最大化 \(\Omega(n)\) 或 \(\ln\Omega(n)\)。由于 \(\binom{N}{n}\) 在 \(n=N/2\) 处达到最大（\(N\) 偶数时），因此最概然是
\[
n^\*=\frac{N}{2}.
\]

## 2) 为什么热力学极限下“最概然 \(\approx\) 平均”

在上述模型中，每个球进左盒的概率为 \(1/2\)，因此 \(n\sim\text{Binomial}(N,1/2)\)，有
\[
\mathbb{E}[n]=\frac{N}{2},\qquad \mathrm{Var}(n)=\frac{N}{4},\qquad \sigma_n=\frac{\sqrt{N}}{2}.
\]

关键是相对涨落：
\[
\frac{\sigma_n}{\mathbb{E}[n]}\sim \frac{\sqrt{N}}{N}=\frac{1}{\sqrt{N}}\to 0\quad(N\to\infty).
\]
因此当系统很大时，概率质量高度集中在 \(n^\*\) 附近，“典型值/最概然值”和“平均值”在相对误差意义下趋于一致。

> 这也是微正则系综里“可观测量的典型值代表宏观量”的基础直觉：大系统下相对涨落消失。
