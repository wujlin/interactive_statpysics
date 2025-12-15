---
type: method
title: 定位临界点 峰值或 Binder cumulant
tags: ['phase-transition', 'simulation', 'M7']
prereq: ['相变 Phase transition', 'Ising 的 Metropolis 模拟']
source: ['finite-size scaling basics']
status: ready
---

## 什么时候用？
- 你在有限系统里做温度扫描，想找到“临界附近”的位置/区间（没有真正的发散）。

## 输入/输出
- 输入：
  - 不同温度 T（或 β）的采样数据：能量序列 \(e_t\)、磁化序列 \(m_t\)
  - （可选）不同系统尺寸 L
- 输出：
  - 临界附近温度区间（或一个估计的 \(T_c(L)\)）
  - 一个“证据图”：峰值曲线或 Binder 交点

## 方法 A：峰值法（最简单）
1) 对每个温度估计
\[
C_V \propto \mathrm{Var}(E),\qquad
\chi \propto \mathrm{Var}(M)
\]
2) 找峰值位置：\(T^\*=\arg\max C_V\) 或 \(\arg\max \chi\)
3) 若有多个 L：观察峰值随 L 变尖、位置漂移（finite-size shift）

## 方法 B：Binder cumulant（更稳健）
- 定义（用每自旋磁化 \(m\)）：
\[
U_L = 1 - \frac{\langle m^4\rangle}{3\langle m^2\rangle^2}.
\]
- 对不同 L 作 \(U_L(T)\)，曲线在 \(T_c\) 附近常出现近似交点 ⇒ 用交点估计 \(T_c\)。

## 注意事项
- 需要 burn-in 与基本的 ESS 评估，否则峰值可能是采样噪声
- 临界附近自相关显著增大，需要更多采样或更高级算法（集群算法等）

## 最小可运行例子
- 见 `exercises/notebooks/E07_ising_critical_signals.ipynb`
