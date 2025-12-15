---
type: method
title: Ising 的 Metropolis 模拟
tags: ['ising', 'mcmc', 'M6']
prereq: ['Metropolis-Hastings（最小 MCMC）', '相互作用系统 Interacting systems']
source: ['standard Ising simulation']
status: ready
---

## 什么时候用？
- 你要从 Ising 模型的正则分布 \(p(s)\propto e^{-\beta E(s)}\) 采样，但状态空间 \(2^N\) 巨大无法枚举。

## 输入/输出
- 输入：
  - 格点尺寸 \(L\)，耦合 \(J\)，外场 \(h\)，\(\beta\)
  - sweeps（扫一遍 L×L 次更新）、burn-in、thin
- 输出：
  - 能量/磁化的时间序列
  - 温度扫描下的 \(\langle m\rangle,\langle e\rangle\) 等统计量

## 单自旋翻转 Metropolis（伪代码）
对每次更新：
1) 随机选一个格点 i，当前自旋 \(s_i\)
2) 计算翻转能量差：
\[
\Delta E = 2 s_i\,(J\sum_{j\in nbr(i)} s_j + h)
\]
3) 接受概率：
\[
a=\min(1, e^{-\beta\Delta E})
\]
4) 以概率 a 翻转自旋，否则保持不变

一个 sweep = 重复以上步骤 \(L^2\) 次。

## 正确性/直觉
- 提议是“对称”的（翻转再翻转等价） ⇒ 接受率简化；
- 满足细致平衡 ⇒ 以 Boltzmann 分布为平稳分布。

## 注意事项（最小）
- 临界附近自相关时间变大（critical slowing down）；
- 有限尺寸下 \(\langle m\rangle\) 可能符号翻转，常用 \(\langle |m|\rangle\)。

## 代码实现
- `exercises/src/ising.py` 给出最小实现 + pytest。
