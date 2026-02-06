---
type: method
title: Euler–Maruyama 数值模拟
tags: ['sde', 'numerics', 'M9']
prereq: ['Langevin 方程 Langevin equation']
source: ['SDE numerics basics']
status: ready
---

## 什么时候用？
- 你要数值模拟 SDE（Langevin 方程）的**样本轨迹**：既为了“看见”随机过程长什么样，也为了做闭环验收（均值/方差/自相关对齐理论）。
- 你不需要先解出整个分布 $p(x,t)$；相反，你更关心“反复模拟很多次以后统计量对不对”。

## 输入/输出
- 输入：
  - SDE：\(dX = a(X,t) \mathrm{d}t + b(X,t) \mathrm{d}W\)
  - 时间步长 \(\Delta t\)，总步数 \(N\)，随机种子
- 输出：
  - 离散轨迹 \(X_0,X_1,\dots,X_N\)

## 核心更新公式（Itô）
- Wiener 增量：\(\Delta W \sim \mathcal{N}(0, \Delta t)\)
- 更新：
\[
X_{t+\Delta t} = X_t + a(X_t,t) \Delta t + b(X_t,t) \Delta W.
\]

## 这一步“在干什么”（最小直觉）
这条更新式对应一个非常具体的近似：在一小步 \(\Delta t\) 内，

- 漂移项 \(a(X_t,t) \Delta t\) 是“把确定性部分做一次欧拉步”；
- 随机项 \(b(X_t,t) \Delta W\) 用来表达“这一步的随机冲击”，其中 \(\Delta W\) 的方差是 \(\Delta t\)。

关键尺度关系是：\(\Delta W \sim \sqrt{\Delta t}\)。因此随机项的典型大小是 \(O(\sqrt{\Delta t})\)，而漂移项是 \(O(\Delta t)\)。这也解释了为什么你需要足够小的步长：否则噪声项会被数值误差污染。

## 注意事项
- **口径提醒（Itô）**：Euler–Maruyama 默认在步长左端点评估 \(a,b\)，对应 Itô 解释；若你用 Stratonovich，需要用匹配的数值法（例如 Heun 预测-校正），否则“方程同形、结果不同”的隐性偏差会出现（见：[[Itô vs Stratonovich：随机积分不是微积分（建模含义）]]）。
- **验收优先**：优先对齐你真正关心的统计量（均值/方差/自相关），而不是只盯着“轨迹看起来像不像”。  
- **稳定性**：对强非线性或多维耦合系统，\(\Delta t\) 过大会导致数值不稳定；你需要做步长收敛检查。

## 最小可运行例子
- OU 过程（有解析稳态）：见 `exercises/notebooks/E09_ou_process.ipynb`
