---
type: solution
id: M6_solution
title: M6 Ising 平均场（参考解答）
tags: [ising, interaction, mean-field, solution]
---

# M6 Ising 平均场（参考解答）

## (1) Ising 能量与集体行为

常见 Ising Hamiltonian：
\[
E(\{s_i\})=-J\sum_{\langle i,j\rangle}s_is_j-h\sum_i s_i,\qquad s_i\in\{\pm 1\}.
\]

- 当 $J>0$（铁磁耦合）时，相邻自旋同号会降低能量，系统倾向于局部对齐。
- **与独立粒子的对比**：如果 $J=0$，每个自旋只受外场 $h$ 或热涨落影响，彼此无关。无论温度怎么变，它们都是独立的随机变量，不会突然"商量好"一起朝上。
- **涌现**：只有当 $J \neq 0$，局部偏好才能跨越空间传播。在低温下，这种耦合导致系统从无序状态（高熵）突然跌入有序状态（低能），这就是"涌现"的集体相变。

## (2) 平均场近似：推导自洽方程

1.  **有效哈密顿量**：
    将 $\sum s_j$ 替换为 $z m$，单粒子感受到的能量为：
    \[ H_{eff}(s_i) = - s_i (J z m + h) \]
    这相当于一个处于有效外场 $B_{eff} = Jzm + h$ 中的独立粒子。

2.  **平均自旋**：
    根据 Boltzmann 分布，自旋 $s_i$ 取 $\pm 1$ 的概率比为 $e^{\beta B_{eff}} : e^{-\beta B_{eff}}$。
    \[ \langle s_i \rangle = \frac{(+1)e^{\beta B_{eff}} + (-1)e^{-\beta B_{eff}}}{e^{\beta B_{eff}} + e^{-\beta B_{eff}}} = \tanh(\beta B_{eff}) \]

3.  **自洽方程**：
    令 $\langle s_i \rangle = m$，即得：
    \[ m = \tanh(\beta(J z m + h)) \]

## (3) 相变临界点分析

设 $h=0$，方程为 $m = \tanh(\beta J z m)$。

**a) 图像法**
- 画出 $y=m$（斜率 1 的直线）和 $y=\tanh(Cm)$（原点斜率为 $C=\beta J z$ 的 S 形曲线）。
- **高温 ($C < 1$)**：直线陡峭，S 形曲线平缓。原点 $m=0$ 是唯一交点。
- **低温 ($C > 1$)**：S 形曲线在原点更陡，先在直线之上，后因饱和弯曲向下穿过直线。除 $m=0$ 外，会出现两个非零交点 $\pm m_0$。
- **分叉图**：画出的草图应类似"叉子"形状，在 $T_c$ 处从 0 分叉出两条分支。

**b) 代数法**
利用 $\tanh(x) \approx x - x^3/3$：
\[ m \approx (\beta J z) m - \frac{1}{3}(\beta J z)^3 m^3 \]
移项整理：
\[ m \left[ (1 - \beta J z) + \frac{1}{3}(\beta J z)^3 m^2 \right] = 0 \]

此方程有非零解 $m \neq 0$ 的条件是方括号内为 0：
\[ \frac{1}{3}(\beta J z)^3 m^2 = \beta J z - 1 \]
由于左边 $m^2 > 0$ 且 $\beta, J, z > 0$，这意味着必须有 $\beta J z - 1 > 0$，即 $\beta J z > 1$。

**临界条件**：
\[ \beta_c J z = 1 \implies k_B T_c = z J \]
这就是平均场预测的居里温度。

**注意**：真实的 $T_c$ 通常低于即便场预测（例如二维 $k_B T_c \approx 2.269 J$，而平均场 $z=4$ 预测 $4J$）。因为平均场忽略了局部涨落，高估了系统维持有序的能力。
