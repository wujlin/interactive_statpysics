---
type: derivation
title: 从正则分布到自由能 F=-kT ln Z
tags: ['canonical', 'free-energy', 'M3']
prereq: ['正则系综 Canonical ensemble', '热力学势 Thermodynamic potentials']
source: ['standard statmech']
status: ready
---

## 目标
- 解释为什么在正则系综里 \(F=-k_BT\ln Z\)，并给出最短推导。

## 起点
- 正则分布：\(p(x)=e^{-\beta E(x)}/Z\)，\(Z=\sum_x e^{-\beta E(x)}\)
- 信息论形式的熵：\(S=-k_B\sum_x p(x)\ln p(x)\)

## 推导（最短路线）
1) 计算熵：
\[
\ln p(x)= -\beta E(x)-\ln Z
\]
\[
S=-k_B\sum_x p(x)\ln p(x)
= -k_B\sum_x p(x)(-\beta E(x)-\ln Z)
= k_B\beta\langle E\rangle + k_B\ln Z.
\]
2) 由 \(F \equiv \langle E\rangle - TS\)：
\[
F = \langle E\rangle - T\big(k_B\beta\langle E\rangle + k_B\ln Z\big)
= \langle E\rangle - (\langle E\rangle + k_BT\ln Z)
= -k_BT\ln Z.
\]

## 结果
\[
\boxed{F(T,V,N)=-k_BT\ln Z(\beta;V,N).}
\]

## 检查
- \(Z\) 无量纲 ⇒ \(\ln Z\) 无量纲 ⇒ \(k_BT\ln Z\) 有能量单位
- 与热力学：\(dF=-S\,dT-P\,dV+\mu\,dN\) 一致（进一步导数即可验证）

## Source anchors
- Swendsen Eq 19.49：\(F(T,V,N)=-k_B T\ln Z\)
