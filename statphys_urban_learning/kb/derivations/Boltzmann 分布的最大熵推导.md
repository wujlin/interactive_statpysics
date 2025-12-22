---
type: derivation
title: Boltzmann 分布的最大熵推导
tags: [maxent, canonical]
prereq: [熵 Entropy]
source: [Swendsen, Sethna]
status: ready
---

## 目标
在“归一化 + 平均能量约束”下，最大化熵，得到 Boltzmann 分布。

> 对照：物理推导（系统与热库）见 [[从系统与热库推出 Boltzmann 分布（正则系综）]]；两条路线等价原因见 [[MaxEnt 与正则系综等价（信息等价）]]。

## 假设/约束
- \(\sum_x p(x)=1\)
- \(\sum_x p(x)E(x)=\bar E\)

## 推导步骤（骨架）
1. 写拉格朗日函数：\(\mathcal{L}= -\sum p\ln p + \lambda(\sum p-1)+\beta(\sum pE-\bar E)\)
2. 对每个 x 令 \(\partial \mathcal{L}/\partial p(x)=0\) 得 \(\ln p(x)=\lambda-1-\beta E(x)\)
3. 归一化得到 \(p(x)=e^{-\beta E(x)}/Z\)，其中 \(Z=\sum_x e^{-\beta E(x)}\)

> ⚠️ **常见卡点**：
> - 很多人在第 2 步求导时，忘记 \(\frac{\partial}{\partial p}(\sum \lambda p) = \lambda\)。
> - 在得到 \(p(x) \propto e^{-\beta E}\) 后，必须利用 \(\sum p=1\) 来把前面的比例系数确定为 \(1/Z\)。这一步不能跳过。

## 结果
- \(p(x)=\frac{1}{Z}e^{-\beta E(x)}\)
- \(\beta=1/(k_BT)\)（物理诠释）

## 检查
- 维度：\(\beta E\) 无量纲
- 极限：\(T\to\infty\Rightarrow p\) 趋于均匀；\(T\to 0\Rightarrow p\) 集中到基态

## Source anchors
- Swendsen Eq 19.23：正则系综的 Boltzmann 权重（相空间形式）
- Swendsen Eq 19.18：\(Z=\int dE\,\Omega(E,V,N)e^{-\beta E}\)（能量表象）
