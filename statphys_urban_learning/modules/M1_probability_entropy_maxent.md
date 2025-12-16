# M1 概率·计数·熵·最大熵（MaxEnt）

## 目标
- 建立统一入口：**给定约束 → 通过最大熵得到分布（指数族）**。

## 主线（只做这一条）
- “线性约束 + 最大熵” ⇒ `p(x) ∝ exp( -∑ λ_k f_k(x) )`（拉格朗日乘子/指数族）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 概率与计数：组合数、最概然、Stirling 近似
- [ ] 熵：Boltzmann 熵（计数）与 Shannon 熵（不确定性）
- [ ] 最大熵：线性约束 → 指数族；乘子的物理含义；如何数值求解乘子

### 知识库（kb/）— 必做
- [x] Concept：
  - [x] `kb/concepts/微观态与宏观态 Microstate vs macrostate.md`
  - [x] `kb/concepts/多重度 multiplicity Ω.md`
  - [x] `kb/concepts/Stirling 近似 Stirling approximation.md`
  - [x] `kb/concepts/熵 Entropy.md`
  - [x] `kb/concepts/Shannon 熵与最大熵原则.md`
  - [x] `kb/concepts/最大熵原理 Maximum entropy principle.md`
- [x] Derivation：
  - [x] `kb/derivations/Boltzmann 分布的最大熵推导.md`
  - [x] `kb/derivations/最大熵推出指数族分布（通用模板）.md`
- [x] Method：
  - [x] `kb/methods/拉格朗日乘子法（最大熵）.md`
- [x] Urban-mapping：
  - [x] `kb/urban-mapping/最大熵（MaxEnt）→ OD 矩阵推断.md`

### 习题与实验（exercises/）— 必做
- [x] Written：
  - [x] `exercises/written/E01_maxent_to_boltzmann.md`
  - [x] `exercises/written/E01_why_maxent_not_arbitrary.md`
- [x] Notebook：
  - [x] `exercises/notebooks/E01_maxent_discrete_numeric.ipynb`
- [x] Test（自动检查）：
  - [x] `exercises/tests/test_e01_maxent_discrete_numeric.py`

## 完成标准（过关条件）
- [ ] 看到“线性约束”，能立刻写出最大熵解的指数族形式
- [ ] 能用数值方法求拉格朗日乘子，并验证：归一化 + 约束误差在阈值内

## 城市问题主线（只保留最相关）
- “已知边际/均值成本/总量约束” → 用最大熵得到**最少偏见**的流动/选择分布（后续的 OD、logit、重力模型都可以看成它的具体化）。
