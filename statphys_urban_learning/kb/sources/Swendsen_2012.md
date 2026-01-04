---
type: source
title: Swendsen (2012) — An Introduction to Statistical Mechanics and Thermodynamics
tags: ["sources", "swendsen", "thermo", "statmech"]
status: ready
---

## 一句话
本项目的主线教材：用于建立“系综 → 配分函数 → 涨落/响应 → 相变”的统一骨架，并提供公式级调试锚点（Eq 编号）便于核对推导与代码。

## Citation
- R. H. Swendsen, *An Introduction to Statistical Mechanics and Thermodynamics*, Oxford University Press, 2012.

## Use in this project
- 主线教材（建议从头到尾走完，建立“系综→配分函数→涨落→相变”的骨架）。

## Official links
- OUP: https://global.oup.com/academic/product/an-introduction-to-statistical-mechanics-and-thermodynamics-9780198853237

## Module mapping (suggested)
- M0–M7：主线
- M8–M9：作为桥接（随机过程/非平衡的入门部分按需）

## Local text (MinerU scan)
- Markdown 目录：`Book/An Introduction to Statistical Mechanics and Thermodynamics/md/`
- 文件命名：`ch01.md`…`ch31.md`（对应 OUP chapter 编号；已从 MinerU 原始长文件名重命名）
- 公式编号在文本里以 `\\tag {19.53}` 的形式出现。
- 快速定位方式：
  - `rg "\\\\tag \\{19\\.53\\}" Book/An\\ Introduction\\ to\\ Statistical\\ Mechanics\\ and\\ Thermodynamics/md -n`
  - `python statphys_urban_learning/scripts/swendsen_eq_lookup.py 19.53`

## Notation conventions
- 本仓库符号统一约定见：`kb/sources/_notation_conventions.md`
- 重要提醒：Swendsen 用 \(\mathcal{Z}\) 表示“巨正则配分函数”（很多书写作 \(\Xi\)）。

## Equation anchors (debug anchors)
> 这些条目只存“定位信息”，用于你推导卡住/代码不对时快速回到原书核对。

### M0 热力学骨架（势与 Legendre）
- Eq 12.10：\(F(T,V,N)=U-TS\)
- Eq 12.11：\(dU=T\,dS-P\,dV+\mu\,dN\)
- Eq 12.12：\(dF=-S\,dT-P\,dV+\mu\,dN\)

### M1 概率与条件概率（常用调试公式）
- Eq 5.7：边缘分布（连续情形）
- Eq 5.8：条件概率 \(P(y|x)\)
- Eq 5.9：联合概率分解
- Eq 5.10：Bayes 定理（连续情形）
- Eq 5.11：独立性 \(P(x,y)=P_x(x)P_y(y)\)
- Eq 5.12：独立性 \(\Rightarrow P(x|y)=P_x(x)\)（教授建议的典型“锚点”）

### M3 正则系综与 ln Z
- Eq 19.15：\(\partial_{E_T}\ln\Omega_R(E_T)=\beta=\frac{1}{k_BT}\)
- Eq 19.16：\(\ln P(E)=\ln\Omega(E)-\beta E-\ln Z\)
- Eq 19.17：\(P(E)=\frac{1}{Z}\,\Omega(E)\,e^{-\beta E}\)
- Eq 19.18：\(Z(T,V,N)=\int dE\,\Omega(E,V,N)\,e^{-\beta E}\)
- Eq 19.23：相空间正则分布 \(P(p,q)\propto e^{-\beta H(p,q)}\)
- Eq 19.24：相空间配分函数 \(\tilde Z\)
- Eq 19.49：\(F(T,V,N)=-k_B T \ln Z\)
- Eq 19.53：\(\partial_\beta \ln Z=-\langle E\rangle\)
- Eq 19.59：\(\partial_\beta \langle E\rangle=-\langle E^2\rangle+\langle E\rangle^2\)
- Eq 19.60：热容与涨落（\(C_V\)）

### M4 巨正则系综与 ln 𝒵
- Eq 20.1：\(U[T,\mu]=U-TS-\mu N\)
- Eq 20.3：`P(E,N)` 的复合系统表达
- Eq 20.8：\(\ln P(E,N)\approx \ln\Omega(E,V,N)-\beta E+\beta\mu N-\ln\mathcal{Z}\)
- Eq 20.9：\(P(E,N)=\frac{1}{\mathcal{Z}}\,\Omega\,e^{-\beta E+\beta\mu N}\)
- Eq 20.10：\(\mathcal{Z}=\sum_N\int dE\,\Omega\,e^{-\beta E+\beta\mu N}\)
- Eq 20.12：\(\mathcal{Z}(T,V,\mu)=\sum_N Z(T,V,N)\,e^{\beta\mu N}\)
- Eq 20.17：\(\ln\mathcal{Z}=-\beta(E-TS-\mu N)=-\beta U[T,\mu]\)
- Eq 20.18：\(\ln\mathcal{Z}=\beta PV\)（可用于从 \(\mathcal{Z}\) 读出压强）

## Notes
- 你读到哪里（章/节）：
- 本书的“主线一句话”：
- 勘误与补充：
