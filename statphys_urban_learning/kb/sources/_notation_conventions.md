---
type: source
title: 符号约定与映射（本仓库统一：Swendsen 体系）
tags: ["sources", "notation", "conventions"]
status: ready
---

## 目的（为什么要写这张卡）
- 统一符号体系，避免不同教材/论文的符号冲突（例如 \(F\) vs \(A\)、\(\Omega\) 的多重含义、\(\Xi\) vs \(\mathcal{Z}\)）。
- 为“公式级引用”提供可复用规范：推导卡卡住或代码不对时，能用 **Eq 编号** 快速回到原书核对。

## 本仓库统一采用的符号（优先级：Swendsen）
- 玻尔兹曼常数：\(k_B\)（不默认取 1；若取 1 会显式注明）
- 逆温：\(\beta \equiv 1/(k_B T)\)
- 微观态能量/哈密顿量：\(E(x)\) / \(H(p,q)\)（视语境）
- 多重度/态密度（microcanonical）：\(\Omega(E,V,N)\)
- 正则配分函数（canonical）：\(Z(\beta;V,N)\)
- 巨正则配分函数（grand canonical，Swendsen 记号）：\(\mathcal{Z}(\beta,\mu;V)\)  
  - 备注：很多书用 \(\Xi\) 表示；本仓库正文优先写 \(\mathcal{Z}\)，必要时括注 \((\Xi)\)。
- 自由能（Helmholtz）：\(F(T,V,N) \equiv -k_B T \ln Z\)
- 化学势：\(\mu\)
- 迁移率 / mobility：避免用 \(\mu\)（与化学势冲突），统一记为 \(b\) 或用摩擦系数 \(\zeta\)（Einstein 关系：\(D = k_B T/\zeta = b\,k_B T\)）
- Swendsen 的巨正则势：\(U[T,\mu] \equiv U - TS - \mu N\)  
  - 避免冲突：很多教材把“巨势/Grand potential”写成 \(\Omega_G = -k_B T \ln \Xi\)，但本仓库用 \(\Omega\) 表示“多重度/态密度”，因此正文中不再用 \(\Omega\) 表示巨势。

## 常见符号冲突对照表（遇到就按此映射）
| 概念 | 本仓库（Swendsen 体系） | 其他常见写法 | 备注 |
|---|---|---|---|
| Helmholtz 自由能 | \(F\) | \(A\) | 统计物理/化学文献常见 \(A\) |
| 多重度/态密度 | \(\Omega\) | \(W\)、\(g(E)\) | \(\Omega\) 与“巨势”同符号是最常见冲突源 |
| 巨正则配分函数 | \(\mathcal{Z}\) | \(\Xi\) | Swendsen 用 \(\mathcal{Z}\)，很多书用 \(\Xi\) |
| 逆温 | \(\beta=1/(k_B T)\) | \(1/T\) | 若把 \(k_B=1\)，必须显式声明 |
| 化学势共轭量 | \(\beta\mu\) | \(\alpha=-\beta\mu\) | 信息论/最大熵推导中常用 \(\alpha\) |

## 城市映射中的符号约定（E/β/μ）
- 在城市 mobility/离散选择语境，本仓库默认把 \(E(x)\) 解释为“广义成本/负效用”（越小越偏好）；若使用效用 \(U(x)\)，请显式写 \(U=-E\) 或说明符号翻转。
- 常用权重写作：\(p(x)\propto \exp(-\beta E(x))\)；开放系统/规模可变时：\(p(x,N)\propto \exp[-\beta(E(x,N)-\mu N)]\)。
- 在上述约定下，增大 \(\beta\) 表示对成本更敏感（更“理性”）；增大 \(\mu\)（其余不变）将提高较大 \(N\) 的权重，从而增大 \(\langle N\rangle\)。

## “公式级引用”规范（调试锚点）
- 对核心推导卡（例如 MaxEnt、\(Z\)/\(\ln Z\)、巨正则）在文末加入 `## Source anchors`：
  - 每条写到 **书名 + 公式编号**（优先 Swendsen），例如：`Swendsen Eq 19.53`。
  - 若同一结论在多本书出现，可以追加：`Sethna Eq ...`、`Krauth Eq ...`（但符号仍按本仓库约定统一）。

## 如何在本仓库定位 Swendsen 公式
- MinerU 扫描的章节 Markdown 在：`Book/An Introduction to Statistical Mechanics and Thermodynamics/md/`
- 公式编号在文本里以 `\\tag {19.53}` 的形式出现：
  - 直接检索：`rg "\\\\tag \\{19\\.53\\}" Book/An\\ Introduction\\ to\\ Statistical\\ Mechanics\\ and\\ Thermodynamics/md -n`
  - 或使用脚本：`python statphys_urban_learning/scripts/swendsen_eq_lookup.py 19.53`
