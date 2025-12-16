---
type: solution
id: M6_solution
title: M6 Ising 平均场（参考解答）
tags: [ising, interaction, mean-field, solution]
---

## (1) Ising 能量与集体行为

常见 Ising Hamiltonian：
\[
E(\{s_i\})=-J\sum_{\langle i,j\rangle}s_is_j-h\sum_i s_i,\qquad s_i\in\{\pm 1\}.
\]

- 当 \(J>0\)（铁磁耦合）时，相邻自旋同号会降低能量（更“划算”），系统倾向于局部对齐。
- 但对齐会牺牲熵（可实现微观态数减少）。因此在温度较高时无序（熵占优），温度较低时有序（能量占优），从而产生集体相变的可能。
- “集体行为”来自耦合项：一个自旋的偏好取决于邻居，局部偏好可传播并在整体上形成宏观序参量 \(m\)。

## (2) 平均场近似与自洽方程（骨架）

定义磁化：
\[
m=\langle s_i\rangle.
\]

平均场近似把某个格点 \(i\) 的邻居自旋和替换为其平均：
\[
\sum_{j\in nn(i)} s_j\approx z\,m,
\]
其中 \(z\) 是配位数（每个点的邻居数）。

于是格点 \(i\) 看到的“有效场”是
\[
h_{\text{eff}}=J z m+h.
\]

在该有效场下，单自旋的条件分布满足
\[
p(s_i)\propto \exp\big(\beta s_i h_{\text{eff}}\big),
\]
因此
\[
m=\langle s_i\rangle
=\frac{(+1)e^{\beta h_{\text{eff}}}+(-1)e^{-\beta h_{\text{eff}}}}{e^{\beta h_{\text{eff}}}+e^{-\beta h_{\text{eff}}}}
=\tanh(\beta h_{\text{eff}})
=\tanh\!\big(\beta(J z m+h)\big).
\]

当 \(h=0\) 时，小 \(m\) 展开 \(\tanh(x)\approx x\) 给出临界条件：
\[
m\approx \beta J z\,m\quad\Rightarrow\quad \beta_c J z = 1.
\]
