# M6 相互作用与平均场（外部性）

## 目标
- 从“独立个体”走向“相互作用系统”：
  - 分布不再可因子分解
  - 出现集体行为与多稳态
- 用 Ising 作为最小模板练：相互作用项、序参量、MCMC 模拟。

## 主线（只做这一条）
- 写出一个最小相互作用能量 `E(x)`（例如 Ising）→ 用 MCMC 采样 → 观察序参量随温度/噪声变化。

## 先修
- M3（MCMC）
- M5（涨落/相关）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 相互作用系统与因子分解何时失效
- [ ] 序参量与自由能地形（多峰/多稳态直觉）
- [ ] 平均场近似（自洽方程的来源）

### 知识库（kb/）— 必做
- [ ] Concept：
  - [ ] `kb/concepts/相互作用系统 Interacting systems.md`
  - [ ] `kb/concepts/序参量 Order parameter.md`
- [ ] Derivation：
  - [ ] `kb/derivations/Ising 平均场自洽方程.md`
- [ ] Method：
  - [ ] `kb/methods/Ising 的 Metropolis 模拟.md`
- [ ] Urban-mapping：
  - [ ] `kb/urban-mapping/城市外部性 拥堵同伴效应 与相互作用项.md`

### 习题与实验（exercises/）— 必做
- [ ] Written：
  - [ ] `exercises/written/M6_mean_field.md`
- [ ] Notebook：
  - [ ] `exercises/notebooks/E06_ising_mcmc.ipynb`
- [ ] Test（自动检查）：
  - [ ] `exercises/tests/test_ising_simulation.py`

## 完成标准（过关条件）
- [ ] 低温（高 β）下磁化 |m| 明显偏离 0；高温下 |m| 接近 0（有限尺寸下允许波动）
- [ ] 能解释“外部性/同伴效应”对应统计物理里的相互作用项

## 城市问题主线（只保留最相关）
- 拥堵、同伴效应、聚集偏好本质上是相互作用；一旦有相互作用，就可能出现阈值、多稳态与路径依赖。
