---
type: exercise
id: M4_written
title: M4 巨正则：ln Xi 的导数与 OD 乘子形式
difficulty: 3
tags: [grand-canonical, chemical-potential, maxent, od]
---

# M4 巨正则系综 — Written

> 目标：把“\(\mu\) 控制规模（可变 \(N\)）”与“边际约束 MaxEnt/最小 KL \(\to\) 乘子形式”用手推写清楚。

## 题目

### (1) 巨正则分布（写对形式）

对一个可变粒子数/规模的系统，写出巨正则分布：

- 写出 \(p(x,N)\) 的比例形式（包含 \(E(x,N)\)、\(\mu N\)、\(\beta\)）
- 写出巨配分函数 \(\Xi(\beta,\mu)\) 的定义（求和对哪些变量）

### (2) 从 \(\ln\Xi\) 得到 \(\langle N\rangle\) 与 \(\mathrm{Var}(N)\)

令 \(y=\beta\mu\)。请推导并写清楚“对哪个变量求导（保持什么不变）”：

- \(\langle N\rangle = \partial_y \ln\Xi\)
- \(\mathrm{Var}(N) = \partial_y^2 \ln\Xi\)

### (3) 为什么“边际约束 + 最大熵/最小 KL”给出 OD 的乘子形式？（概念题）

在 OD 推断中，令 \(T_{ij}\ge 0\) 满足边际：
\(\sum_j T_{ij}=O_i\)，\(\sum_i T_{ij}=D_j\)。  
假设我们最小化 \(KL(T\|Q)\)，其中 \(Q_{ij}\) 是 prior（可取 \(Q_{ij}=\exp(-\beta c_{ij})\)）。

- 为什么解必然可以写成：\(T_{ij}=a_i b_j Q_{ij}\)？
- 不要求完整严谨证明，但要给出**清晰的推理链**（提示：拉格朗日乘子、指数族、行/列乘子吸收到 \(a_i,b_j\) 里）

### (4) 对比题：无成本 prior vs 带成本 prior

- 当 \(Q_{ij}\) 为常数（无成本 prior）时，你认为 \(T\) 的结构主要由什么决定？
- 当 \(Q_{ij}=\exp(-\beta c_{ij})\)（带成本 prior）时，\(\beta\) 增大通常会让哪些统计量发生怎样的变化？请至少写出两个：  
  例如平均成本、流量集中度、跨区比例、长距离流占比等。

---

## 提示（先做 30–45 分钟再看）

- (1) 写成一句话：\(\text{概率}\propto \exp(-\beta(E-\mu N))\)。
- (2) 先写出 \(\Xi=\sum_{N}\sum_x \exp(-\beta E(x,N)+yN)\)，然后对 \(y\) 求导；注意 \(\partial_y \ln\Xi=(1/\Xi)\partial_y \Xi\)。
- (3) 关键直觉：在约束下最小化 KL（或最大化熵）给出“指数族”；边际约束对应“只依赖 \(i\) 或 \(j\)”的乘子，因此变成 \(a_i b_j\) 的形式。

---

## 自检（Self-Check）

- [ ] (1) 你的指数里是否是 \(-\beta E + \beta\mu N\)（或等价写法）？\(\beta\mu\) 应该和 \(N\) 成对出现。
- [ ] (2) 你能从 \(\partial_y^2\ln\Xi\) 得到一个方差（非负）吗？符号是否对？
- [ ] (3) 你能用一句话解释：为什么 \(a_i\) 只能依赖 \(i\)，\(b_j\) 只能依赖 \(j\)？

---

## 参考解答

👉 [查看参考解答](../solutions/M4_solution.md)（建议自己推导完成后再核对）
