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

## 参考解答（骨架）
(1) 拉格朗日函数：
\[
\mathcal{L}= -\sum_x p(x)\ln p(x) + \lambda\Big(\sum_x p(x)-1\Big)+\beta\Big(\sum_x p(x)E(x)-\bar E\Big)
\]

对每个 x 求偏导并令为 0：
\[
\frac{\partial\mathcal{L}}{\partial p(x)} = -(\ln p(x)+1)+\lambda+\beta E(x)=0
\]
得到
\[
p(x)=\exp(\lambda-1)\,e^{-\beta E(x)}.
\]
用归一化得到
\[
p(x)=\frac{1}{Z}e^{-\beta E(x)},\quad Z=\sum_x e^{-\beta E(x)}.
\]

(2) 在物理中 \(\beta=1/(k_BT)\)。\(Z\) 是正则配分函数，\(F=-k_BT\ln Z\)。
