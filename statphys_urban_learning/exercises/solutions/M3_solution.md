---
type: solution
id: M3_solution
title: M3 ln Z 导数关系（参考解答）
tags: [canonical, partition-function, fluctuation, solution]
---

## 约定

正则系综（离散状态）：
\[
Z(\beta)=\sum_x e^{-\beta E(x)},\qquad
p_\beta(x)=\frac{e^{-\beta E(x)}}{Z(\beta)}.
\]

## 问题 1：\(\langle E\rangle\) 与 \(\partial_\beta\ln Z\)

对 \(\beta\) 求导：
\[
\frac{\partial Z}{\partial\beta}=\sum_x \frac{\partial}{\partial\beta}\Big(e^{-\beta E(x)}\Big)
=\sum_x \big(-E(x)\big)e^{-\beta E(x)}.
\]

因此
\[
\frac{\partial \ln Z}{\partial\beta}=\frac{1}{Z}\frac{\partial Z}{\partial\beta}
\;=\;\frac{1}{Z}\sum_x \big(-E(x)\big)e^{-\beta E(x)}
=-\sum_x E(x)\frac{e^{-\beta E(x)}}{Z}
=-\langle E\rangle.
\]

即
\[
\boxed{\;\langle E\rangle=-\frac{\partial\ln Z}{\partial\beta}\;}
\]

## 问题 2：能量涨落与二阶导

继续求导：
\[
\frac{\partial^2\ln Z}{\partial\beta^2}
=-\frac{\partial\langle E\rangle}{\partial\beta}.
\]

另一方面直接对 \(\partial_\beta\ln Z\) 的表达式求导也可得到：
\[
\frac{\partial^2\ln Z}{\partial\beta^2}
=\frac{1}{Z}\frac{\partial^2 Z}{\partial\beta^2}-\left(\frac{1}{Z}\frac{\partial Z}{\partial\beta}\right)^2.
\]
其中
\[
\frac{\partial^2 Z}{\partial\beta^2}
=\sum_x \frac{\partial}{\partial\beta}\Big(-E(x)e^{-\beta E(x)}\Big)
=\sum_x E(x)^2 e^{-\beta E(x)}.
\]

代回：
\[
\frac{\partial^2\ln Z}{\partial\beta^2}
=\frac{1}{Z}\sum_x E(x)^2 e^{-\beta E(x)}
\;-\;\left(\frac{1}{Z}\sum_x E(x)e^{-\beta E(x)}\right)^2
=\langle E^2\rangle-\langle E\rangle^2
=\mathrm{Var}(E).
\]

即
\[
\boxed{\;\mathrm{Var}(E)=\frac{\partial^2\ln Z}{\partial\beta^2}\;}
\]
并且因此
\[
\frac{\partial\langle E\rangle}{\partial\beta}=-\mathrm{Var}(E)\le 0,
\]
这与直觉一致：\(\beta\) 增大（降温）时，平均能量通常下降。

## 物理提示（连接到响应）

把 \(\beta=1/(k_BT)\) 带入，热容
\[
C_V=\frac{\partial\langle E\rangle}{\partial T}
=\frac{\partial\langle E\rangle}{\partial\beta}\frac{d\beta}{dT}
=\big(-\mathrm{Var}(E)\big)\cdot\left(-\frac{1}{k_BT^2}\right)
=\frac{\mathrm{Var}(E)}{k_BT^2}\ge 0.
\]
这就是“涨落（二阶矩）=响应（导数）”的一条最典型例子。
