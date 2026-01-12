---
type: concept
title: Maxwell–Boltzmann 分布 Maxwell-Boltzmann distribution
tags: ['statmech', 'classical']
prereq: ['正则系综 Canonical ensemble', '巨正则系综 Grand canonical ensemble']
source: ['Maxwell-Boltzmann statistics', 'Swendsen 2012 Ch8/Ch27']
status: ready
---

## 一句话
Maxwell–Boltzmann 分布是经典（稀薄/高温）极限下的指数型权重：对单粒子态能量 \(\varepsilon\) 给出占据数/概率权重 \(\propto \exp[-\beta(\varepsilon-\mu)]\)；它也是量子统计在 \(\langle n\rangle\ll 1\) 时对 Fermi–Dirac / Bose–Einstein 的共同近似。

## 经典极限（占据数形式）
\[
\langle n_r\rangle \approx e^{-\beta(\varepsilon_r-\mu)} = z e^{-\beta\varepsilon_r},\qquad z\equiv e^{\beta\mu}.
\]

## 密度公式（常用形态）
当我们从“单态占据 \(\langle n_r\rangle\)”转向“空间密度 \(n(\mathbf x)\)”时，需要把单粒子微观态写成相空间点 \((\mathbf x,\mathbf p)\)。对非相对论粒子，单粒子能量就是 Hamiltonian：动能由动量给出，外势能由位置给出，因此写成
\[
\varepsilon(\mathbf p,\mathbf x)=\frac{\mathbf p^2}{2m}+U(\mathbf x).
\]
这里的 \(U(\mathbf x)\) 指“外势/势能”（空间非均匀性），不是热力学里“内能 \(U\)”的那个 \(U\)。把它写进能量的好处是：Boltzmann 权重会因子化为“动量部分 \(\times\) 位置部分”，从而动量可以被单独积掉，留下你真正关心的空间密度。
在这个写法下，对动量积分会产生热德布罗意波长 \(\lambda_T\)，而位置依赖只通过 \(e^{-\beta U(\mathbf x)}\) 进入，于是得到
\[
n(\mathbf x)=\frac{1}{\lambda_T^3}\,e^{\beta(\mu-U(\mathbf x))},\qquad
\lambda_T=\frac{h}{\sqrt{2\pi m k_BT}}.
\]

## 推导入口
- 从巨配分函数到 MB 密度公式的推导链：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]
