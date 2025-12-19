---
type: concept
title: 涨落-响应 Fluctuation-response
tags: ['statmech', 'M5']
prereq: ['配分函数 Partition function']
source: ['Kubo / general statmech']
status: ready
---

## 一句话
在平衡系综（指数族）中，观测量的协方差等于相应平均值对外参的导数（如 $\partial\langle E\rangle/\partial\beta=-\mathrm{Var}(E)$），从而把热涨落与线性响应（敏感性）联系起来。

## 最小公式（正则）
- 能量涨落与热容：
\[
\mathrm{Var}(E)=\partial_\beta^2\ln Z,\qquad
C_V = \frac{\mathrm{Var}(E)}{k_B T^2}.
\]

## 更一般（指数族模板）
- 若 \(p(x)\propto \exp(-\lambda^\top f(x))\)，则
  - 一阶导给均值：\(\partial_{\lambda_k}\ln Z = -\mathbb{E}[f_k]\)
  - 二阶导给协方差：\(\partial_{\lambda_k}\partial_{\lambda_\ell}\ln Z = \mathrm{Cov}(f_k,f_\ell)\)

## 直觉
- “波动大”意味着系统对外界扰动更敏感（容易被推着走）。
- 临界点附近涨落变大 ⇒ 响应变大（易感性峰值）。

## 城市连接（最小）
- 把参数当作“政策/成本权重”，涨落-响应关系告诉你：哪些指标会对政策产生放大响应（敏感性分析）。
