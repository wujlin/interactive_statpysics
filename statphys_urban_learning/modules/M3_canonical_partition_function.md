# M3 正则系综与配分函数 Z

## 目标
- 把问题统一写成 **Z 与 ln Z**，并掌握：
  - 均值/涨落来自 ln Z 的导数
  - 不会解析时用 MCMC 采样估计

## 主线（只做这一条）
- `p(x) ∝ exp(-βE(x))` → `Z = Σ exp(-βE)` → `F = -kT ln Z` → 导数给出均值/涨落。

## 先修
- M1（最大熵/指数族）
- M2（熵与偏导定义，作为参照）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 正则分布与 Boltzmann 权重
- [ ] 配分函数 Z 与自由能 F=-kT ln Z
- [ ] ln Z 的导数规则：⟨E⟩、Var(E)

### 知识库（kb/）— 必做
- [ ] Concept：
  - [ ] `kb/concepts/正则系综 Canonical ensemble.md`
  - [ ] `kb/concepts/配分函数 Partition function.md`
- [ ] Derivation：
  - [ ] `kb/derivations/从正则分布到自由能 F=-kT ln Z.md`
  - [ ] `kb/derivations/平均能量与 ln Z 的导数关系.md`
- [ ] Method：
  - [ ] `kb/methods/Metropolis-Hastings（最小 MCMC）.md`
  - [ ] `kb/methods/MCMC 误差估计 自相关时间与 Blocking.md`
- [ ] Urban-mapping：
  - [ ] `kb/urban-mapping/Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能.md`

### 习题与实验（exercises/）— 必做
- [ ] Written：
  - [ ] `exercises/written/M3_lnZ_derivatives.md`
- [ ] Notebook：
  - [ ] `exercises/notebooks/E02_metropolis_harmonic.ipynb`
- [ ] Test（自动检查）：
  - [ ] `exercises/tests/test_e02_metropolis_harmonic.py`
  - [ ] `exercises/tests/test_mcmc_diagnostics.py`

## 完成标准（过关条件）
- [ ] 能从 ln Z 的导数写出均值/涨落的表达式，并解释其含义
- [ ] 能跑通一个最小 MCMC，并给出最小诊断：自相关时间 τ、有效样本量 ESS

## 城市问题主线（只保留最相关）
- logit/softmax 的“势函数”就是 `log-sum-exp`：它对应统计物理里的自由能（用来做模型比较、敏感性分析、政策扰动响应）。
