# Reading Guide: Swendsen Chapter 20（巨正则系综）

> **Type**: Reading Guide  
> **Source**: [[Swendsen_2012]]  
> **Topics**: Grand canonical distribution, chemical potential \(\mu\), grand partition function \(\mathcal{Z}\)

## TL;DR（30 秒概览）
这章把 M3 的“定温但定粒子数 \(N\)”升级为“定温且允许 \(N\) 涨落”：通过“系统 + 热浴 + 粒子库”的复合系统推导，得到权重 \(e^{-\beta(E-\mu N)}\)，并用巨配分函数 \(\mathcal{Z}\) 把所有 \(N\) 的统计信息压缩到一个可导对象里。

对应本仓库的 SSOT 推导入口：
- \(\langle N\rangle,\mathrm{Var}(N)\) 从 \(\ln\mathcal{Z}\) 的导数得到：[[平均粒子数与涨落从 ln 𝒵 的导数得到]]

## 重要提醒：本仓库扫描版以 Chapter 20 为准
- 本仓库 MinerU 扫描版（`Book/.../md/`）里，巨正则系综在 `ch20.md`，公式编号以 `\\tag {20.xx}` 为准。
- 早期文件名 `Swendsen_Ch14_GrandCanonical` 仅作为兼容 stub 保留（见：[[Swendsen_Ch14_GrandCanonical]]）。

## Key Equations（公式锚点）
- **Eq 20.8 / 20.9**：开放系统的联合分布（能量与粒子数）
  \[
  \ln P(E,N)\approx \ln\Omega(E,V,N)-\beta E+\beta\mu N-\ln\mathcal{Z},
  \qquad
  P(E,N)=\frac{1}{\mathcal{Z}}\,\Omega\,e^{-\beta E+\beta\mu N}.
  \]
- **Eq 20.10 / 20.12**：巨配分函数（把所有 \(N\) 的正则世界拼起来）
  \[
  \mathcal{Z}=\sum_N\int dE\,\Omega\,e^{-\beta E+\beta\mu N},
  \qquad
  \mathcal{Z}(T,V,\mu)=\sum_N Z(T,V,N)\,e^{\beta\mu N}.
  \]
- **Eq 20.17**：\(\ln\mathcal{Z}\) 作为势/生成函数（grand potential 的桥接式）
  \[
  \ln\mathcal{Z}=-\beta(E-TS-\mu N).
  \]
- **（导数规则）**：平均规模与涨落（本仓库推导卡给完整步骤）
  \[
  \langle N\rangle=\partial_{(\beta\mu)}\ln\mathcal{Z},\qquad
  \mathrm{Var}(N)=\partial_{(\beta\mu)}^2\ln\mathcal{Z}.
  \]

## Signposts（阅读路标）
- **20.1 Composite system 推导 \(P(E,N)\)**：把“总系统微正则”边缘化到开放子系统。
- **20.2 从 \(\mathcal{Z}\) 生成宏观量**：把 \(\ln\mathcal{Z}\) 当成“势/生成函数”，一阶导给均值，二阶导给涨落。
- **20.3 连接到热力学势**：\(\ln\mathcal{Z}\) 与 \(PV\) 的关系（均匀系统里最常用）。

## Critical Thinking（带着问题读）
1. 为什么权重是 \(e^{-\beta(E-\mu N)}\) 而不是 \(e^{-\beta E}\)？（提示：允许交换粒子后，库的熵展开会多出 \((-\mu/T)\,dN\) 项）
2. 为什么 \(\mu\) 的“底层定义”是 \(\mu=(\partial F/\partial N)_{T,V}\)，但在巨正则里又被当作外界给定的控制参数？
3. 为什么 \(\partial_\mu\ln\mathcal{Z}\) 会“拉出一个 \(N\)”？（提示：把导数搬进求和/积分，指数里有 \(\beta\mu N\)）

## Urban Mapping（城市对应）
- **先固定交换对象**：例如只令 \(N\) 表示城市边界内的常住人口，不在同一模型中把它轮换解释为人口、OD 事件和出行次数。
- **区分两种角色**：\(\mu_{\mathrm{city}}=\partial F_{\mathrm{city}}/\partial N\) 是城市模型的内部边际自由成本，\(\mu_R\) 是外部人口池给定的控制参数；平衡条件是二者相等。它们不能在没有符号约定时笼统翻译成“吸引力”。
- **涨落给出模型内响应**：在所设巨正则零模型中，\(\partial\langle N\rangle/\partial\mu_R=\beta\mathrm{Var}(N)\)。这是一条平衡指数族恒等式，不自动证明真实城市会集聚，也不能替代迁移动力学。
