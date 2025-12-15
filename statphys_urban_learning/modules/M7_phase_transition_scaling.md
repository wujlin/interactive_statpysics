# M7 相变与标度（阈值与韧性）

## 目标
- 把“阈值/突变”变成可观测、可计算的信号：
  - 序参量变化
  - 热容/易感性峰值
  - 相关长度与有限尺寸效应

## 主线（只做这一条）
- 在 Ising 上做一次“有限尺寸下的临界信号”：用峰值或 Binder cumulant 抓住临界附近行为。

## 先修
- M6（Ising 模拟）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 相变的最小定义与信号（序参量/峰值）
- [ ] 相关长度与标度的直觉
- [ ] 有限尺寸效应：为什么“发散”变“峰值”

### 知识库（kb/）— 必做
- [ ] Concept：
  - [ ] `kb/concepts/相变 Phase transition.md`
  - [ ] `kb/concepts/相关长度 Correlation length.md`
- [ ] Derivation：
  - [ ] `kb/derivations/有限尺寸效应 Finite-size effects.md`
- [ ] Method：
  - [ ] `kb/methods/定位临界点 峰值或 Binder cumulant.md`
- [ ] Urban-mapping：
  - [ ] `kb/urban-mapping/城市阈值与韧性 的相变式信号.md`

### 习题与实验（exercises/）— 必做
- [ ] Written：
  - [ ] `exercises/written/M7_phase_transition.md`
- [ ] Notebook：
  - [ ] `exercises/notebooks/E07_ising_critical_signals.ipynb`

## 完成标准（过关条件）
- [ ] 能用至少一个指标（峰值或 Binder）指出“临界附近”的温度区间
- [ ] 能用有限尺寸语言解释：为什么模拟结果不会真的发散

## 城市问题主线（只保留最相关）
- 城市韧性/拥堵崩塌/连通性断裂常表现为阈值行为；相变工具提供“如何测量与预警”的最小语言。
