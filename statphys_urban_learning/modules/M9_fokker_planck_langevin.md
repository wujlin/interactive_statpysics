# M9 Fokker–Planck 与 Langevin（连续随机动力学）

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

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] Langevin：drift + noise 的最小形式
- [ ] Fokker–Planck：概率密度的演化方程
- [ ] Langevin ↔ FP 的对应关系（形式层面即可）
- [ ] Euler–Maruyama 数值模拟与稳态检验

### 知识库（kb/）— 必做
- [ ] Concept：
  - [ ] `kb/concepts/Langevin 方程 Langevin equation.md`
  - [ ] `kb/concepts/Fokker-Planck 方程 Fokker-Planck equation.md`
- [ ] Derivation：
  - [ ] `kb/derivations/Langevin 与 Fokker-Planck 的对应关系 形式.md`
- [ ] Method：
  - [ ] `kb/methods/Euler–Maruyama 数值模拟.md`
- [ ] Urban-mapping：
  - [ ] `kb/urban-mapping/漂移扩散 作为连续城市量随机演化.md`

### 习题与实验（exercises/）— 必做
- [ ] Written：
  - [ ] `exercises/written/M9_fp_langevin.md`
- [ ] Notebook：
  - [ ] `exercises/notebooks/E09_ou_process.ipynb`
- [ ] Test（自动检查）：
  - [ ] `exercises/tests/test_ou_process.py`

## 完成标准（过关条件）
- [ ] OU 模拟的样本均值/方差与理论稳态一致（在误差阈值内）
- [ ] 能说清 drift 与 diffusion 分别对应“趋势项”和“波动项”

## 城市问题主线（只保留最相关）
- 连续宏观量（密度、需求强度、拥堵水平）可用漂移-扩散建模：漂移=系统性趋势（政策/吸引力），扩散=随机扰动（噪声/不可观测因素）。
