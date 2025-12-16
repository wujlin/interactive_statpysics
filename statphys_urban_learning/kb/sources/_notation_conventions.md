---
type: source
title: 符号约定与映射（本仓库统一：Swendsen 体系）
tags: ["sources", "notation", "conventions"]
status: ready
---

## 目的（为什么要写这张卡）
- 统一符号体系，避免不同教材/论文的符号冲突（例如 `F` vs `A`、`\Omega` 的多重含义、`Ξ` vs `\mathcal{Z}`）。
- 为“公式级引用”提供可复用规范：推导卡卡住或代码不对时，能用 **Eq 编号** 快速回到原书核对。

## 本仓库统一采用的符号（优先级：Swendsen）
- 玻尔兹曼常数：`k_B`（不默认取 1；若取 1 会显式注明）
- 逆温：`\beta \equiv 1/(k_B T)`
- 微观态能量/哈密顿量：`E(x)` / `H(p,q)`（视语境）
- 多重度/态密度（microcanonical）：`\Omega(E,V,N)`
- 正则配分函数（canonical）：`Z(\beta;V,N)`
- 巨正则配分函数（grand canonical，Swendsen 记号）：`\mathcal{Z}(\beta,\mu;V)`  
  - 备注：很多书用 `\Xi` 表示；本仓库正文优先写 `\mathcal{Z}`，必要时括注 `(\Xi)`。
- 自由能（Helmholtz）：`F(T,V,N) \equiv -k_B T \ln Z`
- 化学势：`\mu`
- Swendsen 的巨正则势：`U[T,\mu] \equiv U - TS - \mu N`  
  - 避免冲突：很多教材把“巨势/Grand potential”写成 `\Omega_G = -k_B T \ln \Xi`，但 `\Omega` 在本仓库被保留给“多重度/态密度”，因此我们不在正文中用 `\Omega` 表示巨势。

## 常见符号冲突对照表（遇到就按此映射）
| 概念 | 本仓库（Swendsen 体系） | 其他常见写法 | 备注 |
|---|---|---|---|
| Helmholtz 自由能 | `F` | `A` | 统计物理/化学文献常见 `A` |
| 多重度/态密度 | `\Omega` | `W`、`g(E)` | `\Omega` 与“巨势”同符号是最常见冲突源 |
| 巨正则配分函数 | `\mathcal{Z}` | `\Xi` | Swendsen 用 `\mathcal{Z}`，很多书用 `\Xi` |
| 逆温 | `\beta=1/(k_B T)` | `1/T` | 若把 `k_B=1`，必须显式声明 |
| 化学势共轭量 | `\beta\mu` | `\alpha=-\beta\mu` | 信息论/最大熵推导中常用 `\alpha` |

## “公式级引用”规范（调试锚点）
- 对核心推导卡（例如 MaxEnt、`Z`/`\ln Z`、巨正则）在文末加入 `## Source anchors`：
  - 每条写到 **书名 + 公式编号**（优先 Swendsen），例如：`Swendsen Eq 19.53`。
  - 若同一结论在多本书出现，可以追加：`Sethna Eq ...`、`Krauth Eq ...`（但符号仍按本仓库约定统一）。

## 如何在本仓库定位 Swendsen 公式
- MinerU 扫描的章节 Markdown 在：`Book/An Introduction to Statistical Mechanics and Thermodynamics/md/`
- 公式编号在文本里以 `\\tag {19.53}` 的形式出现：
  - 直接检索：`rg "\\\\tag \\{19\\.53\\}" Book/An\\ Introduction\\ to\\ Statistical\\ Mechanics\\ and\\ Thermodynamics/md -n`
  - 或使用脚本：`python statphys_urban_learning/scripts/swendsen_eq_lookup.py 19.53`
