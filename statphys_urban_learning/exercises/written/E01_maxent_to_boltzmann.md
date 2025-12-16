---
type: exercise
id: E01
title: 从最大熵推导 Boltzmann 分布
difficulty: 2
tags: [maxent, boltzmann, canonical]
prereq: [熵 Entropy]
---

## 题目
设系统的微观状态为 \(x\in\mathcal{X}\)，我们希望在如下信息已知的情况下，选择一个概率分布 \(p(x)\)：

1) 归一化：\(\sum_x p(x)=1\)  
2) 平均能量约束：\(\sum_x p(x)E(x)=\bar E\)

在这些约束下，最大化信息熵
\[
H(p)=-\sum_x p(x)\ln p(x).
\]

(1) 写出拉格朗日函数并求极值，推导最优分布 \(p^*(x)\)。  
(2) 说明 \(\beta\) 与温度的关系，并写出配分函数 \(Z\)。  

---

## 提示（尝试 20-30 分钟后再看）

1. **拉格朗日函数构造**：
   - 归一化约束 $\sum p(x)=1$ 对应的乘子通常记为 $\lambda$ 或 $\alpha$。
   - 能量约束 $\sum p(x)E(x)=\bar E$ 对应的乘子通常记为 $\beta$。
   - 你的 $\mathcal{L}$ 应该包含三部分：熵 + $\lambda \times$ 约束1 + $\beta \times$ 约束2。

2. **求导技巧**：
   - $\frac{\partial}{\partial p(x)} (p(x) \ln p(x)) = \ln p(x) + 1$。
   - 对 $p(x)$ 求导时，其他 $p(y)$ ($y \neq x$) 都是常数。

3. **归一化恢复**：
   - 求导得到 $p(x) \propto \exp(\dots)$ 后，利用 $\sum p(x)=1$ 来确定比例系数（即归一化因子 $Z$）。

---

## 自检（Self-Check）

- [ ] 你的结果中 $p(x)$ 是否是 $E(x)$ 的指数函数？
- [ ] 如果 $\beta \to 0$（高温极限），你的分布 $p(x)$ 会变成什么样？（应该趋于均匀分布）
- [ ] 如果 $\beta \to \infty$（低温极限），分布会集中在哪里？（应该集中在 $E(x)$ 最小的状态）
- [ ] 你能解释为什么最大熵原理导出的分布形式与正则系综（Canonical Ensemble）完全一致吗？

---

## 完整解答

👉 [查看参考解答](../solutions/E01_solution.md) （建议自己推导完成后再核对）

## Source anchors
- Swendsen Eq 19.23：正则系综的 Boltzmann 权重（相空间形式）
- Swendsen Eq 19.18：\(Z=\int dE\,\Omega(E,V,N)e^{-\beta E}\)（能量表象）
