# M8 随机过程与主方程（离散动力学）

## 目标
- 从“静态分布”走向“时间演化”：
  - Markov 链/转移率
  - Master equation（主方程）
  - 稳态、细致平衡与净流（非平衡的最小证据）

## 主线（只做这一条）
- 把“区际迁移/状态转移”写成 Markov 模型 → 求稳态分布 π → 计算净流 J 并检验细致平衡。

## 先修
- M5（相关/涨落作为直觉背景即可）

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
