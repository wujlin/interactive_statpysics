---
type: concept
title: 标度假设 Scaling hypothesis
tags: ['criticality', 'scaling', 'M7', 'M7b']
prereq: ['相关长度 Correlation length', '有限尺寸效应 Finite-size effects']
source: ['standard scaling theory / RG motivation']
status: ready
---

## 一句话
标度假设说：临界点附近物理量的奇异部分只依赖于**无量纲的长度比值**（典型是 \(L/\xi\)），因此可写成“幂次 \(\times\) 缩放函数”的形式，并导出幂律与 data collapse。

## 最常用的一条（有限尺寸标度，FSS）
当系统尺寸为 \(L\) 时，对某物理量 \(A\)（例如 \(\chi\)）：
\[
A(T,L)\sim L^{y_A}\,\hat A\!\left(tL^{1/\nu}\right),
\qquad t=\frac{T-T_c}{T_c}.
\]
其中 \(y_A\) 是对应的标度维数（例如 \(\chi\) 的 \(y_\chi=\gamma/\nu\)）。

## 物理图像（直觉）
- 远离临界点：\(\xi\) 有限，系统只“看见”局部；有限尺寸效应弱。
- 临界附近：\(\xi\to\infty\)，系统无尺度；你只能用长度比值组织答案，于是出现幂律与缩放函数。

## 与其他概念的连接
- “凭什么成立”的机制解释：[[Wilson：重整化群与临界普适性（为什么平均场会错）]]
- “怎么检验”的操作版本：[[数据塌缩 Data collapse]]

