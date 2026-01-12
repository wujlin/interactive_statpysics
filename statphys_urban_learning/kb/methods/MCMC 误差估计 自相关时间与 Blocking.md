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

## 直觉（把误差当扩散问题）
把一条 MCMC 链看成“参数空间里的随机行走”很有用：它的任务不是“走很多步”，而是“走得够远、能忘记过去”。  
用扩散来类比就是：
- **扩散强**：到处跑得快（探索强） ⇒ 样本更快“变得不那么像” ⇒ 自相关时间更小；
- **自相关强**：粘在原地（探索弱） ⇒ 走了很多步但信息高度重复 ⇒ 自相关时间更大。

因此常见现象是：自相关时间 \(\tau_{\mathrm{int}}\) 越大，你的采样器就越像“陷在泥潭里的人”——步数 \(N\) 很大，但真正有效的独立信息很少。

> 这在“随机游走型”采样器（如 Random-walk Metropolis）里最直观：探索速率可近似看成参数空间的一个有效扩散系数 \(D\)，而 \(\tau_{\mathrm{int}}\) 往往与“走得慢”同向变化（粗略地说 \(D\) 小 \(\Rightarrow\) \(\tau_{\mathrm{int}}\) 大）。

## 输入/输出
- 输入：一条（或多条）链的观测序列 \(A_t = A(x_t)\)
- 输出：
  - 自相关时间 \(\tau_{\mathrm{int}}\)
  - 有效样本量（effective sample size, ESS）\(ESS \approx N/\tau_{\mathrm{int}}\)
  - 估计标准误：\(\mathrm{SE}(\bar A)\approx \sqrt{\mathrm{Var}(A)/ESS}\)

> 两个常见记号约定（避免“差一个 2”引发误会）：
> - 本卡使用 \(\tau_{\mathrm{int}} = 1 + 2\sum_{\ell\ge 1}\rho(\ell)\)，于是 \(ESS \approx N/\tau_{\mathrm{int}}\)。
> - 也有人把 \(\tau\) 定义成 \(\tau=\tfrac12+\sum_{\ell\ge 1}\rho(\ell)\)，这时会写 \(ESS \approx N/(2\tau)\)。两者等价，只是定义不同。

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

## 一个类比（为什么 ESS 比 N 更“像信息量”）
- **独立采样**：你用 \(N\) 张试纸，分别测 \(N\) 杯不同的水 → 每张试纸都贡献新信息；
- **高自相关的 MCMC**：你用 \(N\) 张试纸，在同一杯水里反复测 \(N\) 次 → 数据量很大但高度冗余。

所以“降低 \(\tau_{\mathrm{int}}\)”的意义，不是让你少跑几步，而是让采样器在参数空间里跑得更快（更快忘记过去），从而得到更高的 \(ESS\) 和更可信的误差条。

## Blocking（可选但常用）
- 将序列按块平均，逐步加大块大小，直到块均值近似独立；
- 用块均值的方差估计标准误（比直接用 \(\mathrm{Var}/N\) 更稳健）。

## 最小经验法则
- ESS 至少要到几百，统计量才比较稳（视任务而定）。
- 如果 \(\tau_{\mathrm{int}}\) 很大：说明混合差，需要改提议/调参/换算法，而不是盲目跑更久。

## 代码实现
- 本仓库在 `exercises/src/mcmc_diagnostics.py` 给出最小实现，并有 pytest 自动检查。
