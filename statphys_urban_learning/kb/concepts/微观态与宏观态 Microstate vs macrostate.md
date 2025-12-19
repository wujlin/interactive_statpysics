---
type: concept
title: 微观态与宏观态 Microstate vs macrostate
tags: ['statmech', 'M1']
prereq: []
source: ['Any statmech textbook']
status: ready
---

## 一句话
微观态是系统全部自由度的一次具体取值（如所有粒子的位置与动量/所有自旋），宏观态是由少量宏观量（$E,V,N,\dots$）给出的约束集合并对应一族微观态及其多重度 $\Omega$。

## 定义
- 微观态（microstate）：例如对粒子系统给出所有 \((\mathbf{r}_i,\mathbf{p}_i)\)；对格点模型给出所有自旋配置。
- 宏观态（macrostate）：给出 \(E,V,N\) 或给出温度/压强/密度等宏观量。

## 关键连接：多重度 Ω
- 对给定宏观态（例如固定 \(E,V,N\)），可实现的微观态数目（或相空间体积）就是多重度：
\[
\Omega(E,V,N).
\]
- 宏观熵用它定义：\(S = k\ln\Omega\)。

## 物理图像（直觉）
- 宏观态越“常见”，意味着它对应的微观态越多（Ω 越大），系统随机演化更容易落在那里。

## 最小例子
- 两盒分球：宏观态用“左盒球数”描述；同一个左盒球数对应很多具体摆放方式（微观态）。
