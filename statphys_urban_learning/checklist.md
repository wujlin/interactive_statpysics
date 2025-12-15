# Checklist（严格对齐版）

> 说明：本文件把 M0–M9 的“必须项”列成可勾选清单（文件路径为准）。  
> 你可以把它当作仓库的硬标准：所有 `[ ]` 变成 `[x]` 才算完全对齐。

---

## M0 热力学骨架（Thermodynamics）
- [x] Module：`modules/M0_thermodynamics.md`
- [x] Concept：
  - [x] `kb/concepts/状态函数与过程量 State vs process quantities.md`
  - [x] `kb/concepts/第一定律与第二定律 First and second law.md`
  - [x] `kb/concepts/热力学势 Thermodynamic potentials.md`
  - [x] `kb/concepts/化学势 Chemical potential.md`
- [x] Derivation：
  - [x] `kb/derivations/Legendre 变换 从 U 到 F 到 G.md`
- [x] Method：
  - [x] `kb/methods/热力学公式自检 Checklist.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/约束与控制变量 在城市复杂动力建模中的作用.md`
- [x] Written：
  - [x] `exercises/written/M0_thermo_basics.md`

---

## M1 概率·计数·熵·最大熵（MaxEnt）
- [x] Module：`modules/M1_probability_entropy_maxent.md`
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
- [x] Urban mapping：
  - [x] `kb/urban-mapping/最大熵（MaxEnt）→ OD 矩阵推断.md`
- [x] Exercises：
  - [x] Written：`exercises/written/E01_maxent_to_boltzmann.md`
  - [x] Written：`exercises/written/E01_why_maxent_not_arbitrary.md`
  - [x] Notebook：`exercises/notebooks/E01_maxent_discrete_numeric.ipynb`
  - [x] Code：`exercises/src/e01_maxent_discrete.py`
  - [x] Test：`exercises/tests/test_e01_maxent_discrete_numeric.py`

---

## M2 微正则系综（Microcanonical）
- [x] Module：`modules/M2_microcanonical.md`
- [x] Concept：
  - [x] `kb/concepts/微正则系综 Microcanonical ensemble.md`
  - [x] `kb/concepts/热力学极限 Thermodynamic limit.md`
- [x] Derivation：
  - [x] `kb/derivations/T,P,μ 作为熵的偏导定义.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/微正则（闭系统）→ 城市资源约束基线.md`
- [x] Written：
  - [x] `exercises/written/M2_microcanonical_basics.md`

---

## M3 正则系综与配分函数（Canonical & Z）
- [x] Module：`modules/M3_canonical_partition_function.md`
- [x] Concept：
  - [x] `kb/concepts/正则系综 Canonical ensemble.md`
  - [x] `kb/concepts/配分函数 Partition function.md`
- [x] Derivation：
  - [x] `kb/derivations/从正则分布到自由能 F=-kT ln Z.md`
  - [x] `kb/derivations/平均能量与 ln Z 的导数关系.md`
- [x] Method：
  - [x] `kb/methods/Metropolis-Hastings（最小 MCMC）.md`
  - [x] `kb/methods/MCMC 误差估计 自相关时间与 Blocking.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能.md`
- [x] Exercises：
  - [x] Notebook：`exercises/notebooks/E02_metropolis_harmonic.ipynb`
  - [x] Test：`exercises/tests/test_e02_metropolis_harmonic.py`
  - [x] Test：`exercises/tests/test_mcmc_diagnostics.py`
  - [x] Written：`exercises/written/M3_lnZ_derivatives.md`
  - [x] Code：`exercises/src/mcmc_diagnostics.py`

---

## M4 巨正则系综与可变规模（Grand canonical）
- [x] Module：`modules/M4_grand_canonical_variable_N.md`
- [x] Concept：
  - [x] `kb/concepts/巨正则系综 Grand canonical ensemble.md`
  - [x] `kb/concepts/化学势 Chemical potential.md`
- [x] Derivation：
  - [x] `kb/derivations/平均粒子数与涨落从 ln Xi 的导数得到.md`
- [x] Method：
  - [x] `kb/methods/IPF 迭代比例拟合（Iterative Proportional Fitting）.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/化学势 μ 作为城市总强度规模控制量.md`
- [x] Written：
  - [x] `exercises/written/M4_grand_canonical_notes.md`
- [x] Project：
  - [x] `projects/p01_maxent_od/README.md`
  - [x] `projects/p01_maxent_od/notebooks/P01_maxent_od.ipynb`
  - [x] `projects/p01_maxent_od/tests/test_ipf.py`

---

## M5 涨落—响应—相关（Fluctuation/Response/Correlation）
- [x] Module：`modules/M5_fluctuation_response_correlation.md`
- [x] Concept：
  - [x] `kb/concepts/涨落-响应 Fluctuation-response.md`
  - [x] `kb/concepts/相关函数 Correlation function.md`
- [x] Derivation：
  - [x] `kb/derivations/协方差与二阶导（通用）.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/参数扰动与城市系统响应敏感性.md`
- [x] Exercises：
  - [x] Notebook：`exercises/notebooks/E05_sensitivity_od.ipynb`
  - [x] Written：`exercises/written/M5_fluctuation_response.md`

---

## M6 相互作用与平均场（Interactions & Mean-field）
- [x] Module：`modules/M6_interactions_mean_field.md`
- [x] Concept：
  - [x] `kb/concepts/相互作用系统 Interacting systems.md`
  - [x] `kb/concepts/序参量 Order parameter.md`
- [x] Derivation：
  - [x] `kb/derivations/Ising 平均场自洽方程.md`
- [x] Method：
  - [x] `kb/methods/Ising 的 Metropolis 模拟.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/城市外部性 拥堵同伴效应 与相互作用项.md`
- [x] Exercises：
  - [x] Notebook：`exercises/notebooks/E06_ising_mcmc.ipynb`
  - [x] Test：`exercises/tests/test_ising_simulation.py`
  - [x] Code：`exercises/src/ising.py`
  - [x] Written：`exercises/written/M6_mean_field.md`

---

## M7 相变与标度（Phase transition & Scaling）
- [x] Module：`modules/M7_phase_transition_scaling.md`
- [x] Concept：
  - [x] `kb/concepts/相变 Phase transition.md`
  - [x] `kb/concepts/相关长度 Correlation length.md`
- [x] Derivation：
  - [x] `kb/derivations/有限尺寸效应 Finite-size effects.md`
- [x] Method：
  - [x] `kb/methods/定位临界点 峰值或 Binder cumulant.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/城市阈值与韧性 的相变式信号.md`
- [x] Exercises：
  - [x] Notebook：`exercises/notebooks/E07_ising_critical_signals.ipynb`
  - [x] Written：`exercises/written/M7_phase_transition.md`

---

## M8 随机过程与主方程（Markov & Master equation）
- [x] Module：`modules/M8_markov_master_equation.md`
- [x] Concept：
  - [x] `kb/concepts/Markov 链与稳态分布 Markov chain.md`
  - [x] `kb/concepts/主方程 Master equation.md`
  - [x] `kb/concepts/细致平衡 Detailed balance 与净流.md`
- [x] Derivation：
  - [x] `kb/derivations/从转移率写出主方程.md`
- [x] Method：
  - [x] `kb/methods/主方程数值推进（矩阵法）.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/区际迁移与状态转移 的 Markov 动力系统.md`
- [x] Exercises/Project：
  - [x] Notebook：`exercises/notebooks/E08_markov_migration.ipynb`
  - [x] Test：`exercises/tests/test_markov_tools.py`
  - [x] Code：`exercises/src/markov.py`
  - [x] Project：`projects/p02_markov_migration/notebooks/P02_markov_migration.ipynb`
  - [x] Test：`projects/p02_markov_migration/tests/test_markov_project.py`

---

## M9 Fokker–Planck 与 Langevin（Continuous stochastic dynamics）
- [x] Module：`modules/M9_fokker_planck_langevin.md`
- [x] Concept：
  - [x] `kb/concepts/Langevin 方程 Langevin equation.md`
  - [x] `kb/concepts/Fokker-Planck 方程 Fokker-Planck equation.md`
- [x] Derivation：
  - [x] `kb/derivations/Langevin 与 Fokker-Planck 的对应关系 形式.md`
- [x] Method：
  - [x] `kb/methods/Euler–Maruyama 数值模拟.md`
- [x] Urban mapping：
  - [x] `kb/urban-mapping/漂移扩散 作为连续城市量随机演化.md`
- [x] Exercises：
  - [x] Notebook：`exercises/notebooks/E09_ou_process.ipynb`
  - [x] Test：`exercises/tests/test_ou_process.py`
  - [x] Code：`exercises/src/ou.py`
  - [x] Written：`exercises/written/M9_fp_langevin.md`
