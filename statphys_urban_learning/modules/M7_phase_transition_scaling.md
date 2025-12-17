# M7 相变与标度（阈值与韧性）

## Introduction
平均场在 M6 里给了相变的最小直觉，但它也制造了统计物理史上最著名的危机之一：它往往能“预测相变存在”，却在临界指数上系统性偏离实验与精确解——得到一套“漂亮但错误”的数。矛盾因此变成双重的：为什么微观细节不同的系统会出现相同的幂律（普适性）？又为什么忽略涨落会在临界点处灾难性失效？

概念飞跃是把临界现象理解为尺度问题。临界附近相关长度 \(\xi\) 增大（见：[[相关长度 Correlation length]]），涨落在不同尺度上耦合，单一尺度的近似（如平均场）不再自洽；标度假设与重整化群用“逐层粗粒化”的方式组织近似，解释了普适性与临界指数的来源（见 Context：[[Wilson：重整化群与临界普适性（为什么平均场会错）]]）。本章的训练重点不在复现 RG 全套形式主义，而在建立可操作的“临界信号”工具箱：有限尺寸下的峰值、Binder cumulant、相关长度的增长，以及如何区分真实的临界趋势与有限样本/有限格点造成的假信号。

城市镜像是“阈值与韧性”的诊断问题：拥堵崩塌、连通性断裂、集聚—分散切换常表现为阈值行为，相变语言提供了一套测量与预警的最小工具。边界同样必须写清：城市系统往往非平衡且异质，标度关系更多是诊断与类比，而不是万能解释；任何幂律拟合都应伴随误差分析与替代理论的对照。

## 目标
- 把“阈值/突变”变成可观测、可计算的信号：
  - 序参量变化
  - 热容/易感性峰值
  - 相关长度与有限尺寸效应

## 主线（只做这一条）
- 在 Ising 上做一次“有限尺寸下的临界信号”：用峰值或 Binder cumulant 抓住临界附近行为。

## 先修
- M6（Ising 模拟）

## Context（历史/方法论卡片）
- [[Wilson：重整化群与临界普适性（为什么平均场会错）]]

## References
- 本模块原始文献导读与统一书目信息见 [Seminal papers](/references/seminal_papers)（条目：`SP-M7-Onsager1944`，`SP-M7-Wilson1975`）。

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] 相变的最小定义与信号（序参量/峰值）
- [ ] 相关长度与标度的直觉
- [ ] 有限尺寸效应：为什么“发散”变“峰值”

### 知识库（kb/）— 必做
- [x] Concept：
  - [x] `kb/concepts/相变 Phase transition.md`
  - [x] `kb/concepts/相关长度 Correlation length.md`
- [x] Derivation：
  - [x] `kb/derivations/有限尺寸效应 Finite-size effects.md`
- [x] Method：
  - [x] `kb/methods/定位临界点 峰值或 Binder cumulant.md`
- [x] Urban-mapping：
  - [x] `kb/urban-mapping/城市阈值与韧性 的相变式信号.md`

### 习题与实验（exercises/）— 必做
- [x] Written：
  - [x] `exercises/written/M7_phase_transition.md`
- [x] Notebook：
  - [x] `exercises/notebooks/E07_ising_critical_signals.ipynb`

## 完成标准（过关条件）
- [ ] 能用至少一个指标（峰值或 Binder）指出“临界附近”的温度区间
- [ ] 能用有限尺寸语言解释：为什么模拟结果不会真的发散

## 城市问题主线（只保留最相关）
- 城市韧性/拥堵崩塌/连通性断裂常表现为阈值行为；相变工具提供“如何测量与预警”的最小语言。
