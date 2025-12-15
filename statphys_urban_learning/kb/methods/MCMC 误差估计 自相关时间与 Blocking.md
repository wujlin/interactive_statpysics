---
type: method
title: MCMC 误差估计 自相关时间与 Blocking
tags: ['mcmc', 'diagnostics', 'M3', 'M5']
prereq: ['Metropolis-Hastings（最小 MCMC）']
source: ['Krauth / standard MCMC diagnostics']
status: ready
---

## 什么时候用？
- 你用 MCMC 得到一个时间序列样本 \(x_t\)，想报告均值时的误差/置信程度；
- 或者想比较两个参数设置的“采样效率”。

## 输入/输出
- 输入：一条（或多条）链的观测序列 \(A_t = A(x_t)\)
- 输出：
  - 自相关时间 \(\tau_{\mathrm{int}}\)
  - 有效样本量 \(ESS \approx N/\tau_{\mathrm{int}}\)
  - 估计标准误：\(\mathrm{SE}(\bar A)\approx \sqrt{\mathrm{Var}(A)/ESS}\)

## 核心步骤（最小可实施）
1) 计算自相关函数（归一化）：
\[
\rho(\ell)=\frac{\mathrm{Cov}(A_t, A_{t+\ell})}{\mathrm{Var}(A)}.
\]
2) 估计积分自相关时间（截断到首次为负或某个窗口）：
\[
\tau_{\mathrm{int}} = 1 + 2\sum_{\ell=1}^{L} \rho(\ell).
\]
3) 有效样本量：
\[
ESS = \frac{N}{\tau_{\mathrm{int}}}.
\]
4) 报告均值与误差条：
\[
\bar A \pm 2\,\mathrm{SE}(\bar A)
\]

## Blocking（可选但常用）
- 将序列按块平均，逐步加大块大小，直到块均值近似独立；
- 用块均值的方差估计标准误（比直接用 \(\mathrm{Var}/N\) 更稳健）。

## 最小经验法则
- ESS 至少要到几百，统计量才比较稳（视任务而定）。
- 如果 \(\tau_{\mathrm{int}}\) 很大：说明混合差，需要改提议/调参/换算法，而不是盲目跑更久。

## 代码实现
- 本仓库在 `exercises/src/mcmc_diagnostics.py` 给出最小实现，并有 pytest 自动检查。
