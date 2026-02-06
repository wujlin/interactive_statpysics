---
type: concept
title: Langevin 方程 Langevin equation
tags: ['stochastic', 'M9']
prereq: []
source: ['SDE basics']
status: ready
---

## 一句话
Langevin 方程用**单条轨迹**的语言描述“趋势 + 噪声”的连续时间演化：你在写模拟/动画时通常直接生成一条条 $X_t$；而它的“分布语言”对应物是 [[Fokker-Planck 方程 Fokker-Planck equation]]。

## 最小形式（1D，Itô）
$$
\mathrm{d}X_t = a(X_t,t) \mathrm{d}t + b(X_t,t) \mathrm{d}W_t.
$$
其中 $W_t$ 是 Wiener 过程（布朗运动）。

## 每个符号在说什么
- $X_t$：系统状态（随时间变化的随机变量/随机过程）
- $a(X_t,t)$：漂移（drift）——“平均往哪走”的趋势项
- $b(X_t,t)$：噪声幅度——“抖得多厉害”（扩散强度通常与 $b^2$ 同阶）
- $dW_t$：白噪声的积分增量（尺度 $dW_t\sim\sqrt{dt}$）

## 为什么它是 M9 的核心对象
- **轨迹视角**：你可以直接用数值方法（如 [[Euler–Maruyama 数值模拟]]）生成样本路径并做验收（均值/方差/自相关）。
- **分布视角**：你可以把它翻译成概率密度 $p(x,t)$ 的演化方程（Fokker–Planck），从而研究稳态、概率流与弛豫时间尺度。

## 最小例子：OU 过程
$$
dX = \theta(\mu - X)\;\mathrm{d}t + \sigma\;\mathrm{d}W.
$$
它的稳态是高斯分布：均值 $\mu$，方差 $\sigma^2/(2\theta)$。

## 边界提醒（别踩坑）
- 本页默认 **Itô** 口径。若噪声是乘性的（$b$ 依赖于 $X$），Itô 与 Stratonovich 的解释会给出不同的漂移/稳态：见 [[Itô vs Stratonovich：随机积分不是微积分（建模含义）]]。
