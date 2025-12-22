---
type: derivation
title: 平均能量与 ln Z 的导数关系
tags: ['canonical', 'M3']
prereq: ['正则系综 Canonical ensemble', '配分函数 Partition function']
source: ['standard statmech']
status: ready
---

## 目标
- 证明正则系综中：\(\langle E\rangle = -\partial_\beta \ln Z\)，以及能量涨落来自二阶导。

## 起点
- \(Z(\beta)=\sum_x e^{-\beta E(x)}\)
- \(p(x)=e^{-\beta E(x)}/Z\)

## 推导（均值）
\[
\partial_\beta \ln Z = \frac{1}{Z}\partial_\beta Z
= \frac{1}{Z}\sum_x (-E(x))e^{-\beta E(x)}
= -\sum_x E(x)\frac{e^{-\beta E(x)}}{Z}
= -\langle E\rangle.
\]
所以：
\[
\boxed{\langle E\rangle = -\partial_\beta \ln Z.}
\]

## 推导（涨落）
再对 \(\beta\) 求导：
\[
\partial_\beta^2 \ln Z = -\partial_\beta \langle E\rangle.
\]
直接计算可得：
\[
\boxed{\partial_\beta^2 \ln Z = \langle E^2\rangle - \langle E\rangle^2 = \mathrm{Var}(E).}
\]

## 热容与能量涨落（把二阶导变成可观测量）
定义定容热容：
\[
C_V \equiv \left(\frac{\partial \langle E\rangle}{\partial T}\right)_{V,N}.
\]
利用 \(\beta=1/(k_B T)\)，有
\[
\frac{\partial}{\partial T}=\frac{\partial \beta}{\partial T}\frac{\partial}{\partial \beta}
=-\frac{1}{k_B T^2}\frac{\partial}{\partial \beta}.
\]
因此
\[
C_V
=-\frac{1}{k_B T^2}\left(\frac{\partial \langle E\rangle}{\partial \beta}\right)_{V,N}
=\frac{\mathrm{Var}(E)}{k_B T^2}.
\]
等价地：
\[
\boxed{\mathrm{Var}(E)=k_B T^2 C_V.}
\]

## 检查
- 维度：\(\beta\) 的单位是 1/能量 ⇒ \(\partial_\beta\ln Z\) 的单位是能量
- 高温极限 \(\beta\to 0\)：分布趋于均匀

## Source anchors
- Swendsen Eq 19.53：\(\partial_\beta \ln Z = -\langle E\rangle\)
- Swendsen Eq 19.59：\(\partial_\beta \langle E\rangle = -\langle E^2\rangle + \langle E\rangle^2\)
- Swendsen Eq 19.60：热容与涨落（\(C_V\) 与 \(\mathrm{Var}(E)\)）
