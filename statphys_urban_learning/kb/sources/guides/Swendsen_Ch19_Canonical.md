# Reading Guide: Swendsen Chapter 19（正则系综）

> **Type**: Reading Guide  
> **Source**: [[Swendsen_2012]]  
> **Topics**: Canonical distribution, partition function \(Z\), free energy \(F\)

## TL;DR（30 秒概览）
这章的主线是：从“总系统微正则等概率”（宇宙封闭）出发，把“系统 + 热库”的复合系统做边缘化，得到正则系综；随后引入配分函数 \(Z\) 并用 \(F=-k_BT\ln Z\) 把统计量桥接到热力学势。

对应本仓库的 SSOT 推导入口：
- 微正则 \(\Rightarrow\) 正则（复合系统）：[[从系统与热库推出 Boltzmann 分布（正则系综）]]
- \(F=-k_BT\ln Z\)：[[从正则分布到自由能 F=-kT ln Z]]

## 重要提醒：不要把 Chapter 10 当成正则系综
- 本仓库 MinerU 扫描版（`Book/.../md/`）里，**正则系综在 `ch19.md`**，公式编号以 `\\tag {19.xx}` 为准。
- `ch10.md` 的 Eq 10.15/10.16 讨论的是 **积分因子**（integrating factor）与微分形式，不是正则系综推导。

## Key Equations（公式锚点）
- **Eq 19.17**：能量的正则分布（带多重度 \(\Omega(E)\)）
  \[
  P(E)=\frac{1}{Z}\,\Omega(E)\,e^{-\beta E}.
  \]
- **Eq 19.18**：配分函数（\(\Omega(E)\) 的拉普拉斯变换）
  \[
  Z(T,V,N)=\int dE\,\Omega(E,V,N)\,e^{-\beta E}.
  \]
- **Eq 19.23 / 19.24**：相空间正则分布与相空间配分函数（更“微观”的版本）
  \[
  P(p,q)=\frac{1}{\tilde Z(T,V,N)}\,e^{-\beta H(p,q)}.
  \]
- **Eq 19.49**：桥接公式（统计 \(\Rightarrow\) 热力学势）
  \[
  F(T,V,N)=-k_BT\ln Z(T,V,N).
  \]
- **Eq 19.53 / 19.60**：\(\ln Z\) 生成平均与涨落（能量/热容）
  \[
  \partial_\beta \ln Z=-\langle E\rangle,\qquad
  \mathrm{Var}(E)=k_B T^2 C_V.
  \]

## Signposts（阅读路标）
- **19.3.1 Composite system 推导 \(P(E)\)**：把“总系统微正则”边缘化到子系统。
- **19.3.2 Canonical distribution in phase space**：把结论写成 \(e^{-\beta H}\) 的形式（后续做连续系统/数值模拟更常用）。
- **19.5 Fluctuations**：热容与涨落的关系，是后续相变/数值诊断的伏笔。

## Critical Thinking（带着问题读）
1. 为什么正则分布里出现的是“指数加权”而不是“硬约束计数”？（提示：热库熵一阶展开）
2. 为什么 \(Z\) 的“底层定义”是对微观态求和/积分，但也可以等价写成对能级（或能量）求和/积分？
   - 微观态形式：\(Z=\sum_{j\in\text{microstates}} e^{-\beta E_j}\)
   - 若按能级分组（简并度 \(g(E)\) 或多重度 \(\Omega(E)\)）：\(Z=\sum_E g(E)\,e^{-\beta E}\)
   - 经典连续情形常写成能量积分（Swendsen Eq 19.18）：\(Z=\int dE\,\Omega(E,V,N)\,e^{-\beta E}\)
   - 关键点：对能级求和并不是“换了定义”，而是把微观态求和按“相同能量”做了分组压缩；前提是你能给出简并度/态密度。
3. 为什么大系统里正则与微正则会给出相同的宏观预测？（提示：能量分布尖峰化，\(\sigma_E/\langle E\rangle\sim 1/\sqrt N\)）

## Urban Mapping（城市对应）
- **离散选择（Logit / MNL）**：把“微观态”理解为一个人的备选方案（路径/目的地/居住地）。若广义成本为 \(C_i\)，标准 Logit 写成
  \[
  P(i)=\frac{e^{-\beta C_i}}{\sum_j e^{-\beta C_j}},
  \]
  分母 \(\sum_j e^{-\beta C_j}\) 就是配分函数 \(Z\)。
- **“按能级求和”的城市类比**：如果你把方案按“成本区间”分桶，那么“同一成本桶里的方案数”就扮演简并度/多重度 \(g(C)\) 的角色，此时也可写成 \(Z=\sum_C g(C)e^{-\beta C}\)（连续时为积分）。
- **Logsum / 可达性（Accessibility）**：\(\ln Z\)（或 \((1/\beta)\ln Z\)，视你的尺度参数约定）就是交通与城市经济里常用的 logsum / inclusive value。直觉上：新增更优选项、或降低成本，会让 \(Z\) 变大，从而提升“可达性/福利”（物理里对应 \(F=-(1/\beta)\ln Z\) 下降）。
- **边界条件**：上述等价在 i.i.d. Gumbel 误差的标准 Logit 下最干净；相关误差/异质性（nested/mixed logit）需要相应推广，但“指数加权 + 归一化常数”的骨架仍然保留。
