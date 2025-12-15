我已经按你说的 **“把 checklist.md 的必须项当硬标准”** 把仓库补齐并对齐到 **M0–M9**（不仅是 M1/M3/M4 缺口，也把你反馈里 “当前仓库未做” 的 M0/M2/M5–M9 全部补上），并且把所有新增内容都落在“概念/推导/方法/城市映射卡 + notebook + src + pytest + written”这一套结构里。

下面按你 PhD 的反馈逐条回应（对应你列出的遗漏点），并给你一个更新后的 zip。

---

## 你 PhD 提到的缺口：我这边的补齐结果

### M0：之前未做 → 已补齐

* **Module**：`modules/M0_thermodynamics.md`
* **Concept 卡**：状态函数/过程量、第一/第二定律、热力学势、化学势
* **Derivation 卡**：Legendre 变换（U→F→G）
* **Method 卡**：热力学公式自检 checklist
* **Urban mapping 卡**：约束与控制变量在城市建模中的作用
* **Written**：`exercises/written/M0_thermo_basics.md`

---

### M1：你列出的 checklist 缺口 → 已全部补齐

你 PhD 说 M1 已覆盖部分文件但仍缺四类内容，我补齐如下：

1. **Concept：Microstate/Macrostate 与 Ω**

* `kb/concepts/微观态与宏观态 Microstate vs macrostate.md`
* `kb/concepts/多重度 multiplicity Ω.md`

2. **Method：拉格朗日乘子法（写约束/解乘子/一致性检查）**

* `kb/methods/拉格朗日乘子法（最大熵）.md`（包含必做一致性检查清单）

3. **Notebook + Test：离散状态 + 线性约束的数值 MaxEnt 解（含归一化/约束检验）**

* Notebook：`exercises/notebooks/E01_maxent_discrete_numeric.ipynb`（现在从 src 导入求解器）
* Code：`exercises/src/e01_maxent_discrete.py`
* Test：`exercises/tests/test_e01_maxent_discrete_numeric.py`

4. **Written：解释“为什么最大熵不是拍脑袋”**

* 新增：`exercises/written/E01_why_maxent_not_arbitrary.md`

---

### M2：之前未做 → 已补齐

* Module：`modules/M2_microcanonical.md`
* Concepts：微正则、热力学极限
* Derivation：T/P/μ 作为熵偏导的定义
* Urban mapping：闭系统资源约束基线
* Written：`exercises/written/M2_microcanonical_basics.md`

---

### M3：你列出的 checklist 缺口 → 已全部补齐

你 PhD 说 M3 已覆盖部分，但仍缺三类内容，我补齐如下：

1. **Derivation：从正则分布到 F=-kT ln Z（并与 <E> 导数连接）**

* 新增：`kb/derivations/从正则分布到自由能 F=-kT ln Z.md`
* 并补全：`kb/derivations/平均能量与 ln Z 的导数关系.md`

2. **Written：两道手推题（<E> 公式、涨落二阶导）**

* `exercises/written/M3_lnZ_derivatives.md`（保持为两问结构）

3. **Test/报告：自相关时间/ESS 的最小实现与自动检查**

* Code：`exercises/src/mcmc_diagnostics.py`
* Test：`exercises/tests/test_mcmc_diagnostics.py`
* 同时更新了 notebook `exercises/notebooks/E02_metropolis_harmonic.ipynb`，在末尾明确输出 `tau_int / ESS / 标准误`（不再只是口头提到）

---

### M4：你列出的 checklist 缺口 → 已全部补齐

你 PhD 说 M4 已覆盖部分，但仍缺四类内容，我补齐如下：

1. **Derivation：<N> 与 Var(N) 从 lnΞ 的导数得到**

* 新增：`kb/derivations/平均粒子数与涨落从 ln Xi 的导数得到.md`

2. **Method：IPF 单独方法卡（不是只有代码）**

* 新增：`kb/methods/IPF 迭代比例拟合（Iterative Proportional Fitting）.md`

3. **Written：解释“边际约束 + 最大熵”为何给出 OD 的乘子形式**

* 重写并强化：`exercises/written/M4_grand_canonical_notes.md`（明确要求解释 `T_ij=a_i b_j Q_ij` 的推理链）

4. **Notebook：无成本 prior vs 带成本 prior 的明确对比结论/图表**

* 我把 `projects/p01_maxent_od/notebooks/P01_maxent_od.ipynb` 末尾补了一段 **β 扫描对比任务**：输出

  * 平均成本 vs β 曲线
  * KL(Tβ || Tβ=0) 作为“结构位移”最小指标
    让“对比任务”不再是可选段落，而是 checklist 明确要求的可见产物。

---

### M5–M9：之前未做 → 已全部补齐（模块/卡片/notebook/pytest 都有）

* **M5**：涨落-响应、相关函数、协方差二阶导推导、敏感性 notebook `E05_sensitivity_od.ipynb`
* **M6**：相互作用/序参量、Ising 平均场推导、Ising Metropolis 方法卡、Ising notebook + pytest（`exercises/src/ising.py` + `test_ising_simulation.py`）
* **M7**：相变/相关长度、有限尺寸效应推导、Binder/峰值定位方法卡、临界信号 notebook `E07_ising_critical_signals.ipynb`
* **M8**：Markov/主方程/细致平衡、主方程推导、数值推进方法卡、Markov 工具代码 + 测试 + 项目 P02（含项目测试）
* **M9**：Langevin/FP 概念与对应推导、Euler–Maruyama 方法卡、OU 代码 + notebook + pytest（`exercises/src/ou.py` + `test_ou_process.py`）

---

## “严格对齐”是怎么落地的

* 新增了根目录 **`checklist.md`**：把 M0–M9 的必须项都列成可勾选清单，并用**具体文件路径**做硬对齐。
* `modules/index.md` 也更新为 M0–M9 的导航入口。
* 全仓库 `pytest` 已通过（我本地跑通）。

---

## 下载更新后的仓库

[下载 statphys_urban_learning_template_v3.zip](sandbox:/mnt/data/statphys_urban_learning_template_v3.zip)

如果你接下来想继续“让 PhD 负责补内容”，现在他可以直接以 `checklist.md` 为硬标准逐项验收；我这边已经把“缺什么、在哪个文件、怎么验收（pytest/notebook 输出）”都固定住了。
