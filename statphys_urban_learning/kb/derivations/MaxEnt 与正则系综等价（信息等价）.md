---
type: derivation
title: MaxEnt 与正则系综等价（信息等价）
tags: ['maxent', 'canonical', 'M1', 'M3']
prereq: ['最大熵原理 Maximum entropy principle', '正则系综 Canonical ensemble', '微正则系综 Microcanonical ensemble']
source: ['Jaynes 1957', 'Gibbs ensemble']
status: ready
---

## 一句话
最大熵推导与“系统 + 热库”的正则系综推导得到同一指数分布，是因为它们编码的是同一份信息（归一化 + 平均能量）。

## 目标
- 说明：MaxEnt 与 canonical 的分布形式完全一致，并给出信息等价的原因。

> 细节推导可分别见：[[从系统与热库推出 Boltzmann 分布（正则系综）]] 与 [[Boltzmann 分布的最大熵推导]]。

## 路线 A：MaxEnt 直接推导
- 最大化熵：
\[
S[p]=-\sum_i p_i\ln p_i
\]
- 约束：
\[
\sum_i p_i=1,\qquad \sum_i p_i E_i=U
\]
变分得到
\[
p_i=\frac{e^{-\beta E_i}}{Z},\qquad Z=\sum_i e^{-\beta E_i}.
\]

## 路线 B：系统 + 热库推导
- 总系统（S + B）隔离，总能量 \(E_{\text{tot}}\) 固定。  
- 系统处于态 \(i\)（能量 \(E_i\)）时：
\[
p_i\propto \Omega_B(E_{\text{tot}}-E_i)=\exp\!\left(\frac{1}{k_B}S_B(E_{\text{tot}}-E_i)\right).
\]
- 热库很大，展开：
\[
S_B(E_{\text{tot}}-E_i)\approx S_B(E_{\text{tot}})-\left.\frac{\partial S_B}{\partial E}\right|_{E_{\text{tot}}}E_i.
\]
- 代回得到
\[
p_i\propto e^{-\beta E_i},\quad
\beta\equiv \frac{1}{k_B}\left.\frac{\partial S_B}{\partial E}\right|_{E_{\text{tot}}}=\frac{1}{k_B T}.
\]
- 归一化后同样得到 \(p_i=e^{-\beta E_i}/Z\)。

## 合流点：同一份信息
- MaxEnt：已知的是**归一化 + 平均能量**。  
- Canonical：已知的是**温度 \(T\)**（等价于固定 \(\beta\)），而
\[
U(\beta)=\langle E\rangle=-\frac{\partial}{\partial \beta}\ln Z.
\]
- 两条路得到同一指数形式，是因为**信息等价**，只是语言不同。

## 约束集 ↔ 系综（最小对照）
- 固定能量 \(E=E_0\) ⇒ 微正则  
- 固定平均能量 \(\langle E\rangle\) ⇒ 正则  
- 固定 \(\langle E\rangle\) 与 \(\langle N\rangle\) ⇒ 巨正则

## Source anchors
- Jaynes 1957：Abstract & Introduction（MaxEnt 视角）
- Swendsen：Canonical ensemble 推导（热库展开）
