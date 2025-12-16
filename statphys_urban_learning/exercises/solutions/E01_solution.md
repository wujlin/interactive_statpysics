---
type: solution
id: E01_solution
title: E01 从最大熵推导 Boltzmann 分布（参考解答）
tags: [maxent, boltzmann, solution]
---

## 参考解答

(1) **构建拉格朗日函数**

我们有目标函数（熵）和两个约束：
- 目标：$H(p) = -\sum_x p(x)\ln p(x)$
- 归一化约束：$\sum_x p(x) - 1 = 0$ （引入乘子 $\lambda'$ 或 $\lambda-1$）
- 能量约束：$\sum_x p(x)E(x) - \bar E = 0$ （引入乘子 $\beta\ge 0$）

写出拉格朗日函数：
$$
\mathcal{L}= -\sum_x p(x)\ln p(x) + \lambda\left(\sum_x p(x)-1\right) - \beta\left(\sum_x p(x)E(x)-\bar E\right)
$$
（这样写的好处是：最终会直接得到物理上常用的 $e^{-\beta E}$ 形式，并与 $\beta=\frac{1}{k_BT}>0$ 对齐。）

(2) **变分求极值**

对任意微观态 $x$ 的概率 $p(x)$ 求偏导，并令其为 0：
$$
\frac{\partial\mathcal{L}}{\partial p(x)} = -(\ln p(x) + 1) + \lambda - \beta E(x) = 0
$$

整理得到：
$$
\ln p(x) = \lambda - 1 - \beta E(x)
$$
即：
$$
p(x) = \exp(\lambda - 1)\, \exp(-\beta E(x))
$$

(3) **利用归一化定系数**

记 $C = \exp(\lambda - 1)$ 为常数。由 $\sum_x p(x) = 1$：
$$
\sum_x C \cdot \exp(-\beta E(x)) = 1 \implies C = \frac{1}{\sum_x \exp(-\beta E(x))}
$$

定义配分函数 $Z(\beta) = \sum_x \exp(-\beta E(x))$，则：
$$
p(x) = \frac{1}{Z(\beta)} e^{-\beta E(x)}.
$$

(4) **物理意义**

- $\beta$ 是控制平均能量的参数。在统计力学中，$\beta = \frac{1}{k_B T}$。
- $Z = \sum_x e^{-\beta E(x)}$ 是正则配分函数，它包含了系统热力学性质的信息。
