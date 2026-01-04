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
若 \(\varepsilon(\mathbf p,\mathbf x)=\mathbf p^2/(2m)+U(\mathbf x)\)，则
\[
n(\mathbf x)=\frac{1}{\lambda_T^3}\,e^{\beta(\mu-U(\mathbf x))},\qquad
\lambda_T=\frac{h}{\sqrt{2\pi m k_BT}}.
\]

## 推导入口
- 从巨配分函数到 MB 密度公式的推导链：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]

