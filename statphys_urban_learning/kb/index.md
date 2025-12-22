---
type: overview
title: KB 使用说明与主线索引
tags: ['kb', 'overview']
status: ready
---

> 这份 KB 不是“把所有东西塞进来”。它的定位是：给 Modules（讲义主线）提供一个可检索、可复用、可校对的“定义/推导/方法”底座。

## 先从哪里开始？
1) 先读 Modules（讲义）：`/modules`  
2) 卡住了再回 KB：看概念卡的 `## 一句话`，需要细节再往下看  
3) 最后用 exercises/pytest 把推导与代码闭环：`/exercises`

## 统计物理主线（最少 8 个锚点）
- 势与控制变量：[[热力学势 Thermodynamic potentials]]、[[自然变量 Natural variables]]、[[Legendre 变换 从 U 到 F 到 G]]
- 计数与熵：[[多重度 multiplicity Ω]]、[[熵 Entropy]]、[[热力学极限 Thermodynamic limit]]
- 从约束到分布：[[最大熵原理 Maximum entropy principle]]、[[最大熵推出指数族分布（通用模板）]]、[[已知均值与方差的最大熵解（高斯）]]、[[从系统与热库推出 Boltzmann 分布（正则系综）]]
- 从分布到可计算量：[[配分函数 Partition function]]、[[平均能量与 ln Z 的导数关系]]、[[平均粒子数与涨落从 ln 𝒵 的导数得到]]
- 不确定性与敏感性：[[涨落-响应 Fluctuation-response]]、[[协方差与二阶导（通用）]]
- 动力学语言：[[Markov 链与稳态分布 Markov chain]]、[[主方程 Master equation]]、[[Fokker-Planck 方程 Fokker-Planck equation]]、[[Langevin 方程 Langevin equation]]

## 城市建模主线（从“约束”开始）
- 建模接口（先读这一张）：[[约束与控制变量 在城市复杂动力建模中的作用]]
- OD/MaxEnt：[[最大熵（MaxEnt）→ OD 矩阵推断]]、项目：[[p01_maxent_od/README]]
- Logit/Boltzmann：[[Logit Softmax 与 Boltzmann 分布的同构]]、项目：[[p02_logit_choice/README]]
- 开放系统与规模：[[化学势 Chemical potential]]、[[化学势 μ 作为城市总强度规模控制量]]

## 符号与引用（先统一再推导）
- 符号统一与“公式级引用”规范：[[符号约定与映射（本仓库统一：Swendsen 体系）]]

> 建议：KB 不追求“面面俱到”，追求“每张卡能被复用且可校对”。如果你读到一张卡觉得在堆砌，请标注“它要回答的具体问题是什么”，我会按同一模板重写。
