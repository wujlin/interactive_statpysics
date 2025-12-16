# M9 Fokker–Planck 与 Langevin（连续随机动力学）

## Introduction（科学史/核心矛盾）
主方程擅长离散状态，但很多宏观量（密度、需求强度、拥堵水平）更自然地是连续变量。矛盾是：你既想保留随机性，又不想在巨大状态空间里做离散枚举。扩散近似把离散跳变的累积效应压缩成“漂移 + 扩散”，得到 Langevin SDE 与对应的 Fokker–Planck 方程：前者描述单条轨迹，后者描述概率密度的演化。这里的范式转变非常硬核：随机项使得“微分”不再是普通极限，Itô/Stratonovich 的差别不是记号之争，而是建模含义（你如何理解噪声与时间尺度）。M9 的训练目标是把这些抽象话落到可验证的数值实验：用 Euler–Maruyama 模拟 OU 过程，并用理论稳态均值/方差与自相关做闭环检查。边界提醒：离散化步长决定误差结构；在非线性或乘性噪声下，数值方法与解释选择必须成套出现，否则你得到的“结果”可能只是算法偏差。

## 目标
- 把离散随机过程连续化，得到：
  - Langevin（随机微分方程，SDE）
  - Fokker–Planck（概率密度演化，PDE）
- 掌握最小数值模拟：Euler–Maruyama，并用 OU 过程做可验证的基准例子。

## 主线（只做这一条）
- 用 Euler–Maruyama 模拟 OU 过程 → 验证稳态均值/方差 + 自相关特性（闭环验证）。

## 先修
- M8（随机动力学直觉）
- M3（MCMC/自相关诊断方法可复用）

## Context（历史/方法论卡片）
- [[Itô vs Stratonovich：随机积分不是微积分（建模含义）]]

## References（Seminal papers，SSOT）
- 本模块原始文献导读与统一书目信息见：`references/seminal_papers.md`（条目：`SP-M9-Langevin1908`，`SP-M9-Ito1944`）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] Langevin：drift + noise 的最小形式
- [ ] Fokker–Planck：概率密度的演化方程
- [ ] Langevin ↔ FP 的对应关系（形式层面即可）
- [ ] Euler–Maruyama 数值模拟与稳态检验

### 知识库（kb/）— 必做
- [x] Concept：
  - [x] `kb/concepts/Langevin 方程 Langevin equation.md`
  - [x] `kb/concepts/Fokker-Planck 方程 Fokker-Planck equation.md`
- [x] Derivation：
  - [x] `kb/derivations/Langevin 与 Fokker-Planck 的对应关系 形式.md`
- [x] Method：
  - [x] `kb/methods/Euler–Maruyama 数值模拟.md`
- [x] Urban-mapping：
  - [x] `kb/urban-mapping/漂移扩散 作为连续城市量随机演化.md`

### Projects (实战演练)
- **P06**: [[p06_entropy_production/README]] (非平衡熵产生)
  - *对应概念*: NESS、熵产生率 (EPR)、环流。
- **P04**: [[p04_diffusion_network/README]] (网络扩散 - 连续极限)

### 习题与实验（exercises/）— 必做
- [x] Written：
  - [x] `exercises/written/M9_fp_langevin.md`
- [x] Notebook：
  - [x] `exercises/notebooks/E09_ou_process.ipynb`
- [x] Test（自动检查）：
  - [x] `exercises/tests/test_ou_process.py`

## 完成标准（过关条件）
- [ ] OU 模拟的样本均值/方差与理论稳态一致（在误差阈值内）
- [ ] 能说清 drift 与 diffusion 分别对应“趋势项”和“波动项”

## 城市问题主线（只保留最相关）
- 连续宏观量（密度、需求强度、拥堵水平）可用漂移-扩散建模：漂移=系统性趋势（政策/吸引力），扩散=随机扰动（噪声/不可观测因素）。
