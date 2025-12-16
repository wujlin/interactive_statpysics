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

## 检查
- 维度：\(\beta\) 的单位是 1/能量 ⇒ \(\partial_\beta\ln Z\) 的单位是能量
- 高温极限 \(\beta\to 0\)：分布趋于均匀

## Source anchors
- Swendsen Eq 19.53：\(\partial_\beta \ln Z = -\langle E\rangle\)
- Swendsen Eq 19.59：\(\partial_\beta \langle E\rangle = -\langle E^2\rangle + \langle E\rangle^2\)
