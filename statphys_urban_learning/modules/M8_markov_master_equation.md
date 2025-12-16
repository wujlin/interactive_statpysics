# M8 随机过程与主方程（离散动力学）

## Introduction（科学史/核心矛盾）
到目前为止，我们大多在问“平衡分布是什么”，但城市流动的本体问题是“它如何变化”，以及“为什么会有环流与不可逆”。核心矛盾在于：微观机制复杂得无法逐一追踪，但我们又确实观察到稳定的宏观时间尺度与统计规律。Markov 过程给出一个务实的折中：把不可观测细节粗粒化为转移率/转移概率，并写出分布随时间演化的主方程。这样你不仅能求稳态 \(\pi\)，还可以用细致平衡与净流 \(J\) 区分平衡与非平衡：只要存在不可消除的循环流，你就知道系统受到持续驱动。M8 的范式转变是从“势函数极值”走向“概率守恒 + 通量”的语言。边界同样必须写清：Markov 性往往依赖时间尺度分离；粗粒化会生成非 Markov 记忆效应，模型好不好最终要靠可检验的预测与误差分析，而不是靠优雅的方程。

## 目标
- 从“静态分布”走向“时间演化”：
  - Markov 链/转移率
  - Master equation（主方程）
  - 稳态、细致平衡与净流（非平衡的最小证据）

## 主线（只做这一条）
- 把“区际迁移/状态转移”写成 Markov 模型 → 求稳态分布 π → 计算净流 J 并检验细致平衡。

## 先修
- M5（相关/涨落作为直觉背景即可）

## References（Seminal papers，SSOT）
- 本模块原始文献导读与统一书目信息见：`references/seminal_papers.md`（条目：`SP-M8-Kolmogorov1931`，`SP-M8-Gillespie1976`）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] Markov 链与稳态分布
- [ ] Master equation（连续/离散时间，至少掌握一种写法）
- [ ] Detailed balance（细致平衡）与 steady-state flux（净流）

### 知识库（kb/）— 必做
- [x] Concept：
  - [x] `kb/concepts/Markov 链与稳态分布 Markov chain.md`
  - [x] `kb/concepts/主方程 Master equation.md`
  - [x] `kb/concepts/细致平衡 Detailed balance 与净流.md`
- [x] Derivation：
  - [x] `kb/derivations/从转移率写出主方程.md`
- [x] Method：
  - [x] `kb/methods/主方程数值推进（矩阵法）.md`
- [x] Urban-mapping：
  - [x] `kb/urban-mapping/区际迁移与状态转移 的 Markov 动力系统.md`

### Projects (实战演练)
- **P03**: [[p03_markov_migration/README]] (区际迁移 Markov)
  - *对应概念*: 稳态分布、细致平衡破缺。
- **P04**: [[p04_diffusion_network/README]] (网络扩散)
  - *对应概念*: 随机游走、扩散方程。

### 习题与项目（exercises/ & projects/）— 必做
- [x] Written：
  - [x] `exercises/written/M8_markov_master.md`
- [x] Notebook：
  - [x] `exercises/notebooks/E08_markov_migration.ipynb`
- [x] Project（更完整的版本）：
  - [x] `projects/p02_markov_migration/`（Notebook）
- [x] Test（自动检查）：
  - [x] `exercises/tests/test_markov_tools.py`
  - [x] `projects/p02_markov_migration/tests/test_markov_project.py`

## 完成标准（过关条件）
- [ ] 能求稳态 π，并验证 πP≈π
- [ ] 能计算净流 J，并判断是否满足细致平衡（以及如何量化违反程度）

## 城市问题主线（只保留最相关）
- 人口流动/通勤迁移的第一性 toy：状态=区域，转移=迁移概率/率；稳态告诉你长期分布，净流告诉你不可逆驱动与循环流。
