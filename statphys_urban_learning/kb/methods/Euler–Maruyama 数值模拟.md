---
type: method
title: Euler–Maruyama 数值模拟
tags: ['sde', 'numerics', 'M9']
prereq: ['Langevin 方程 Langevin equation']
source: ['SDE numerics basics']
status: ready
---

## 什么时候用？
- 你要数值模拟 SDE（Langevin 方程），但没有解析解或想做实验验证。

## 输入/输出
- 输入：
  - SDE：\(dX = a(X,t)\,dt + b(X,t)\,dW\)
  - 时间步长 dt，总步数 N，随机种子
- 输出：
  - 离散轨迹 \(X_0,X_1,\dots,X_N\)

## 核心更新公式（Itô）
- Wiener 增量：\(\Delta W \sim \mathcal{N}(0, dt)\)
- 更新：
\[
X_{t+dt} = X_t + a(X_t,t)\,dt + b(X_t,t)\,\Delta W.
\]

## 正确性/直觉（最低限）
- dt 越小越接近连续过程；
- 误差随 dt 缩小但计算量增加（trade-off）。

## 注意事项
- 需要检查稳态统计量（均值/方差/自相关）是否与理论一致（若有理论可对照）
- 对强非线性/多维系统，dt 过大会不稳定

## 最小可运行例子
- OU 过程（有解析稳态）：见 `exercises/notebooks/E09_ou_process.ipynb`
