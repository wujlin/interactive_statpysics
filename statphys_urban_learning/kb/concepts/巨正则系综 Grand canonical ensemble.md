---
type: concept
title: 巨正则系综 Grand canonical ensemble
tags: ['statmech', 'M4']
prereq: ['正则系综 Canonical ensemble', '化学势 Chemical potential']
source: ['Gibbs ensemble']
status: ready
---

## 一句话
- 巨正则系综描述“系统与热浴 + 粒子库接触”：温度 \(T\) 与化学势 \(\mu\) 固定，粒子数 \(N\) 与能量都可涨落。

## 分布（最小形式）
\[
p(x,N) = \frac{1}{\mathcal{Z}(\beta,\mu)} \exp\big[-\beta(E(x,N)-\mu N)\big].
\]
> 备注：很多书把巨正则配分函数写作 \(\Xi\)。本仓库按 Swendsen 记号优先写 \(\mathcal{Z}\)。

## 巨配分函数（grand partition function）
\[
\mathcal{Z}(\beta,\mu) = \sum_{N} e^{\beta\mu N} Z_N(\beta),
\]
其中 \(Z_N\) 是固定 N 的正则配分函数。

## 最重要的导数规则
- \(\langle N\rangle\) 与 \(\mathrm{Var}(N)\) 由 \(\ln\mathcal{Z}\) 的导数得到（见推导卡）。

## 城市连接（最小）
- 当“总事件数/出行强度/人口规模”不是固定的，而是与外部环境交换时，巨正则是最自然的平衡态基线。

## Source anchors
- Swendsen Eq 20.9：\(P(E,N)=(1/\mathcal{Z})\,\Omega\,e^{-\beta E+\beta\mu N}\)
- Swendsen Eq 20.12：\(\mathcal{Z}(T,V,\mu)=\sum_N Z(T,V,N)e^{\beta\mu N}\)
