# M0 热力学骨架

## 目标
- 把“约束（控制变量）→ 势（热力学势）→ 响应（偏导）”这套语言练熟，为后续系综与配分函数做地基。

## 主线（只做这一条）
- 由 `dU` 出发 → 通过 Legendre 变换得到 `F,G` → 看清每个势的自然变量与共轭量（T, P, μ）。

## Swendsen 对应（公式锚点）
- Chapter 12：Eq 12.10–12.12（\(F\equiv U-TS\)、\(dU\)、\(dF\)）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 状态函数 vs 过程量（U,S,V,N；Q,W）
- [ ] 第一/第二定律与可逆过程（为什么要引入熵）
- [ ] 热力学势与自然变量：U, F, G（至少这三个）
- [ ] 化学势 μ（规模/粒子数可变的共轭量）
- [ ] Legendre 变换的操作与直觉（“换控制变量”）

### 知识库（kb/）— 必做
- [x] Concept：
  - [x] `kb/concepts/状态函数与过程量 State vs process quantities.md`
  - [x] `kb/concepts/第一定律与第二定律 First and second law.md`
  - [x] `kb/concepts/热力学势 Thermodynamic potentials.md`
  - [x] `kb/concepts/化学势 Chemical potential.md`
- [x] Derivation：
  - [x] `kb/derivations/Legendre 变换 从 U 到 F 到 G.md`
- [x] Method：
  - [x] `kb/methods/热力学公式自检 Checklist.md`
- [x] Urban-mapping：
  - [x] `kb/urban-mapping/约束与控制变量 在城市复杂动力建模中的作用.md`

### 习题（exercises/）— 必做
- [x] Written：
  - [x] `exercises/written/M0_thermo_basics.md`

## 完成标准（过关条件）
- [ ] 能不看书写出：`dU = T dS − P dV + μ dN`，并说明每一项的物理含义
- [ ] 能写出 `dF`、`dG` 并说清它们各自的自然变量
- [ ] 看到“规模可变/个体数可变”，能立刻想到“需要 μ（或等价拉格朗日乘子）”

## 城市问题主线（只保留最相关）
- 把“约束/控制变量”说清楚：总出行量、预算/时间、容量上限、人口总量等；后面所有统计建模只是“在这些约束下推分布/推演化”。
