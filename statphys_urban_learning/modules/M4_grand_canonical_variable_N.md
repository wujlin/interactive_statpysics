# M4 巨正则系综与可变规模（N 可变）

## 目标
- 学会处理“规模/粒子数可变”的系统：
  - 巨正则分布
  - Ξ 与 ln Ξ 的导数给出 ⟨N⟩ 与 Var(N)
- 并把最大熵 OD（MaxEnt + IPF）跑成一个可复用项目（城市主线落地）。

## 主线（只做这一条）
- `p(x,N) ∝ exp[-β(E(x,N) − μN)]`
- `Ξ = Σ_N e^{βμN} Z_N`
- `⟨N⟩, Var(N)` 来自 `ln Ξ` 的导数

## 先修
- M3（Z / ln Z）
- M1（最大熵）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 巨正则分布与化学势 μ
- [ ] Ξ 与 ln Ξ 的导数规则（⟨N⟩、Var(N)）
- [ ] 最大熵在“边际约束（行/列和）”下的矩阵形式（OD）

### 知识库（kb/）— 必做
- [ ] Concept：
  - [ ] `kb/concepts/巨正则系综 Grand canonical ensemble.md`
  - [ ] `kb/concepts/化学势 Chemical potential.md`
- [ ] Derivation：
  - [ ] `kb/derivations/平均粒子数与涨落从 ln Xi 的导数得到.md`
- [ ] Method：
  - [ ] `kb/methods/IPF 迭代比例拟合（Iterative Proportional Fitting）.md`
- [ ] Urban-mapping：
  - [ ] `kb/urban-mapping/化学势 μ 作为城市总强度规模控制量.md`

### 习题与项目（exercises/ & projects/）— 必做
- [ ] Written：
  - [ ] `exercises/written/M4_grand_canonical_notes.md`
- [ ] Project：
  - [ ] `projects/p01_maxent_od/`（Notebook + pytest）
    - [ ] `projects/p01_maxent_od/notebooks/P01_maxent_od.ipynb`
    - [ ] `projects/p01_maxent_od/tests/test_ipf.py`

## 完成标准（过关条件）
- [ ] 能写清：μ 控制的是“平均规模/数量”，并能从 ln Ξ 导出 ⟨N⟩、Var(N)
- [ ] 能跑通 MaxEnt+IPF 的 OD 推断，并明确对比：
  - [ ] 无成本 prior vs 带成本 prior（平均成本、分布结构差异）

## 城市问题主线（只保留最相关）
- “开放系统 + 规模可变”是人口流动/出行强度的默认状态；μ（或等价乘子）就是总强度/规模的控制旋钮；OD 最大熵是平衡态基线。
