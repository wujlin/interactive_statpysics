---
type: derivation
title: MaxEnt 与正则系综等价（信息等价）
tags: ['maxent', 'canonical', 'M1', 'M3']
prereq: ['最大熵原理 Maximum entropy principle', '正则系综 Canonical ensemble', '微正则系综 Microcanonical ensemble']
source: ['Jaynes 1957', 'Gibbs ensemble']
status: ready
---

## 一句话
最大熵推导与"系统 + 热库"的正则系综推导得到同一指数分布，是因为它们编码的是同一份信息（归一化 + 平均能量）。

## 目标
- 分别完整展开两条推导路线的关键步骤。
- 然后说清楚：为什么两条看似不同的出发点，在数学上必然得到同一个分布。

> 更多细节可分别见：[[从系统与热库推出 Boltzmann 分布（正则系综）]] 与 [[Boltzmann 分布的最大熵推导]]。

---

## 路线 A：MaxEnt 直接推导

### 问题
已知一个系统有许多微观态 \(i\)，每个态的能量为 \(E_i\)。我们知道两件事情：
1. 概率的归一化：\(\sum_i p_i = 1\)
2. 平均能量有确定值：\(\sum_i p_i E_i = U\)

**除此之外我们什么都不知道。** 在这种"信息不足"的情况下，哪个概率分布最诚实（最不偏倚）？

### 原则
选择使 **Shannon/Gibbs 熵**最大的分布：
\[
S[p] = -\sum_i p_i \ln p_i.
\]
直觉：熵度量的是"不确定性总量"。在满足已知约束的前提下，最大化不确定性 = 对未知的一切不做任何额外假设。

### 第 1 步：构造拉格朗日函数
把有约束极值问题变成无约束问题。为每个约束引入一个拉格朗日乘子（\(\alpha\) 对应归一化，\(\beta\) 对应能量约束）：

\[
\mathcal{L}[p] = -\sum_i p_i \ln p_i
  \;-\; \alpha\!\left(\sum_i p_i - 1\right)
  \;-\; \beta\!\left(\sum_i p_i E_i - U\right).
\]

> **注意符号约定**：这里 \(\beta\) 前取负号，是为了最终结果中 \(\beta > 0\) 对应能量越高、概率越小（物理上合理的方向）。

### 第 2 步：对每个 \(p_i\) 求变分
将 \(\mathcal{L}\) 对 \(p_j\) 求偏导并令其为零：

\[
\frac{\partial \mathcal{L}}{\partial p_j}
= -\ln p_j - 1 - \alpha - \beta E_j = 0.
\]

> **为什么有 \(-1\)？** 因为 \(\frac{\partial}{\partial p_j}(p_j \ln p_j) = \ln p_j + 1\)（乘法法则）。

解出 \(p_j\)：

\[
\ln p_j = -(1+\alpha) - \beta E_j
\quad\Longrightarrow\quad
p_j = e^{-(1+\alpha)}\cdot e^{-\beta E_j}.
\]

### 第 3 步：用归一化确定 \(\alpha\)
把 \(e^{-(1+\alpha)}\) 当作一个待定常数，用 \(\sum_j p_j = 1\) 把它定下来：

\[
\sum_j p_j = e^{-(1+\alpha)}\sum_j e^{-\beta E_j} = 1
\quad\Longrightarrow\quad
e^{-(1+\alpha)} = \frac{1}{\displaystyle\sum_j e^{-\beta E_j}}.
\]

定义**配分函数** \(Z\)：
\[
Z(\beta) \equiv \sum_j e^{-\beta E_j}.
\]

### 第 4 步：写出最终分布
\[
\boxed{p_i = \frac{e^{-\beta E_i}}{Z(\beta)}.}
\]

到此为止，\(\beta\) 的值由约束 \(\sum_i p_i E_i = U\) 隐式决定——它是一个"把平均能量调到 \(U\)"的控制参数。**在纯 MaxEnt 视角下，\(\beta\) 还不等于 \(1/k_BT\)，这个等式需要与物理对接后才能赋予。**

---

## 路线 B：系统 + 热库推导

### 问题
一个小系统 \(S\) 浸泡在大热库 \(B\) 中。总体系隔离，总能量固定为 \(E_{\text{tot}}\)。问：系统处于微观态 \(i\)（能量 \(E_i\)）的概率是多少？

### 第 1 步：等概率假设 \(\to\) 概率正比于热库态数
总体系隔离 → 微正则等概率。当系统锁定在态 \(i\) 时，热库被迫分到 \(E_B = E_{\text{tot}} - E_i\) 的能量。与这个能量对应的总体系微观态数目**完全由热库决定**：
\[
p_i \propto \Omega_B(E_{\text{tot}} - E_i).
\]

> 为什么是"正比于"而不是"等于"？因为还需要归一化（除以所有态的总和）。

### 第 2 步：用熵改写态数
态数 \(\Omega\) 是天文数字，对它取对数得到熵更方便处理：
\[
\Omega_B(E) = \exp\!\left(\frac{S_B(E)}{k_B}\right),
\]
所以
\[
p_i \propto \exp\!\left(\frac{S_B(E_{\text{tot}} - E_i)}{k_B}\right).
\]

### 第 3 步：利用"热库远大于系统"做泰勒展开
**关键物理假设**：\(E_i \ll E_{\text{tot}}\)（小系统的能量只是总能量的微小扰动）。对热库熵在 \(E_{\text{tot}}\) 处做一阶泰勒展开：
\[
S_B(E_{\text{tot}} - E_i) \approx S_B(E_{\text{tot}}) - E_i \left.\frac{\partial S_B}{\partial E}\right|_{E_{\text{tot}}}.
\]

> **为什么只保留一阶？** 二阶项正比于 \(E_i^2 / E_{\text{tot}}\)，在热库无穷大的极限下趋近于零。（它不是零——保留二阶项会给出能量涨落的高斯近似，但核心的指数分布只需一阶。）

### 第 4 步：引入温度定义
热力学中对温度的定义是：
\[
\frac{1}{T} \equiv \left.\frac{\partial S}{\partial E}\right|_{V,N}.
\]
将这个定义用在热库上：
\[
\left.\frac{\partial S_B}{\partial E}\right|_{E_{\text{tot}}} = \frac{1}{T}.
\]
代回第 3 步的展开式：
\[
p_i \propto \exp\!\left(\frac{S_B(E_{\text{tot}})}{k_B}\right) \cdot \exp\!\left(-\frac{E_i}{k_BT}\right).
\]

第一个因子是常数（不依赖 \(i\)），所以：
\[
p_i \propto e^{-\beta E_i}, \quad \beta \equiv \frac{1}{k_BT}.
\]

### 第 5 步：归一化得到配分函数
\[
\boxed{p_i = \frac{e^{-\beta E_i}}{Z(\beta)}, \qquad Z(\beta) = \sum_j e^{-\beta E_j}.}
\]

**与路线 A 的结果在形式上完全一致。**

---

## 合流点：为什么两条路必须给出同一个答案？

两条路线看似出发点完全不同——一个是信息论（"最诚实的推断"），一个是物理（"热库提供温度"）。但仔细比较，它们**编码的信息完全一样**：

| | 路线 A（MaxEnt） | 路线 B（热库） |
|---|---|---|
| 输入信息 1 | \(\sum_i p_i = 1\)（归一化） | 归一化（自动满足） |
| 输入信息 2 | \(\sum_i p_i E_i = U\)（平均能量） | 温度 \(T\)（等价于固定 \(\beta\)） |
| 未知量 | \(\beta\) 由 \(U\) 隐式决定 | \(U\) 由 \(\beta\) 隐式决定 |

**关键等式**：这两种说法之间有一一对应关系：
\[
U(\beta) = \langle E \rangle = -\frac{\partial}{\partial \beta}\ln Z(\beta).
\]
- 给定 \(U\) → 通过这个方程解出 \(\beta\)（路线 A 的做法）
- 给定 \(\beta\)（即 \(T\)）→ 通过这个方程计算出 \(U\)（路线 B 的做法）

**两者是同一枚硬币的两面。** 无论你从哪一面出发，另一面都被唯一确定。因此得到的分布必然相同——这就是 Jaynes (1957) 所说的**"信息等价"**。

> **更深的一句话**：路线 B 中"热库很大 + 泰勒展开"这个物理操作，**效果等价于**路线 A 中"只约束一阶矩"这个信息论操作。热库的存在**恰好**提供了 \(\langle E \rangle\) 这一条信息，不多也不少。

---

## 约束集 ↔ 系综（最小对照表）

| 约束 | 对应系综 | 分布形式 |
|------|---------|---------|
| 固定能量 \(E = E_0\) | 微正则 | 等概率（\(\delta\) 函数） |
| 固定平均能量 \(\langle E \rangle = U\) | 正则 | \(p \propto e^{-\beta E}\) |
| 固定 \(\langle E \rangle\) 与 \(\langle N \rangle\) | 巨正则 | \(p \propto e^{-\beta E + \beta\mu N}\) |

---

## Source anchors
- Jaynes 1957：Abstract & Introduction（MaxEnt 视角）
- Swendsen：Canonical ensemble 推导（热库展开）
