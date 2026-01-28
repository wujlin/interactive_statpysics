---
type: method
title: 数据塌缩 Data collapse
tags: ['scaling', 'criticality', 'M7', 'M7b', 'diagnostics']
prereq: ['标度假设 Scaling hypothesis', '有限尺寸效应 Finite-size effects']
source: ['standard FSS practice']
status: ready
---

## 什么时候用？
- 你有同一模型/系统在不同尺寸 \(L\) 下测到的曲线 \(A(T,L)\)（例如 \(\chi(T,L)\)），想检验它们是否满足同一套标度形式；
- 或者想用有限数据外推临界指数（\(\nu,\gamma,\beta_{\mathrm{mag}},\dots\)）与 \(T_c\)。

## 输入/输出
- 输入：\(\{(T_k, A_k)\}\) 在多个 \(L\) 下的观测；一个候选的 \((T_c,\nu,\dots)\)。
- 输出：
  - 折叠后的曲线是否重合（定性检验）；
  - 通过最小化“散度”得到的指数/临界点估计（可选，定量）。

## 核心步骤（最小可实施）
1. 选一个标度形式（例如 \(\chi(T,L)=L^{\gamma/\nu}\hat\chi(tL^{1/\nu})\)）。
2. 计算无量纲横轴 \(x=tL^{1/\nu}\)，纵轴 \(y=A\,L^{-y_A}\)。
3. 在同一张图上画出不同 \(L\) 的 \(y(x)\)。若参数选得对，它们会“塌缩”到同一条主曲线附近。
4. （可选）调节 \(T_c\) 与指数，使塌缩效果最好，并报告不确定性来源（有限尺寸、采样噪声、网格稀疏、自相关）。

## 正确性/直觉
- data collapse 的本质是在检验：**除了 \(L\) 与 \(\xi\) 外，没有别的长度在支配临界附近行为**。
- 它不是“画图技巧”，而是把“尺度不变性”投影成一个可操作的数值判别。

## 最小可运行例子
- 见：`exercises/notebooks/E07_ising_critical_signals.ipynb`（\(\chi\) 的最小塌缩 + \(\chi_{\max}(L)\) 外推 \(\gamma/\nu\)）。

