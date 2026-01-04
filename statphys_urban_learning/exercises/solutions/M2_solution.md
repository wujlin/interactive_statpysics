---
type: solution
id: M2_solution
title: M2 微正则（参考解答）
tags: [microcanonical, multiplicity, thermo-limit, solution]
---

## 1) 示例：\(N\) 个可区分球分到两盒

设有 \(N\) 个可区分球，每个球独立地放入左/右盒。宏观态用“左盒球数” \(n\) 表示。

- 给定 \(n\)，选择哪些球在左盒的方式数：
\[
\Omega(n)=\binom{N}{n}.
\]
- Boltzmann 熵（形式上）：
\[
S(n)=k_B\ln\Omega(n)=k_B\ln\binom{N}{n}.
\]

最概然宏观态等价于最大化 \(\Omega(n)\) 或 \(\ln\Omega(n)\)。由于 \(\binom{N}{n}\) 在 \(n=N/2\) 处达到最大（\(N\) 偶数时），因此最概然是
\[
n^\*=\frac{N}{2}.
\]

## 2) 为什么热力学极限下“最概然 \(\approx\) 平均”

在上述模型中，每个球进左盒的概率为 \(1/2\)，因此 \(n\sim\text{Binomial}(N,1/2)\)，有
\[
\mathbb{E}[n]=\frac{N}{2},\qquad \mathrm{Var}(n)=\frac{N}{4},\qquad \sigma_n=\frac{\sqrt{N}}{2}.
\]

关键是相对涨落：
\[
\frac{\sigma_n}{\mathbb{E}[n]}\sim \frac{\sqrt{N}}{N}=\frac{1}{\sqrt{N}}\to 0\quad(N\to\infty).
\]
因此当系统很大时，概率质量高度集中在 \(n^\*\) 附近，“典型值/最概然值”和“平均值”在相对误差意义下趋于一致。

> 这也是微正则系综里“可观测量的典型值代表宏观量”的基础直觉：大系统下相对涨落消失。

想把这个结论从“精确二项分布”换成“统计物理常用的 \(\ln\Omega\) 近峰二阶展开”语言，可看：[[二项系数的熵函数近似与高斯集中（Stirling→H(x)）]]。

## 3) 理想气体：从相空间体积 \(\Omega(E,V,N)\) 推出 \(PV=Nk_BT\)

微正则里“计数”的连续版本是相空间体积。采用体积型定义（cumulative）：
\[
\Omega(E,V,N)=\frac{1}{N!\,h^{3N}}\int d^{3N}r\,d^{3N}p\;\Theta\!\bigl(E-H(\mathbf p,\mathbf r)\bigr),
\]
其中理想气体
\[
H(\mathbf p,\mathbf r)=\sum_{i=1}^{N}\frac{\mathbf p_i^2}{2m}.
\]

### (1) 位置积分给出 \(V^N\)
由于 \(H\) 不依赖 \(\mathbf r\)，并且 \(\Theta(\cdots)\) 只约束动量，因此
\[
\int_{V^N} d^{3N}r = V^N.
\]

### (2) 动量积分给出 \(E^{3N/2}\) 的标度
把所有动量看成一个 \(3N\) 维向量 \(\mathbf P\)，约束
\[
\sum_{i=1}^{N}\frac{\mathbf p_i^2}{2m}\le E
\quad\Longleftrightarrow\quad
|\mathbf P|\le \sqrt{2mE}
\]
因此动量积分等价于半径 \(\sqrt{2mE}\) 的 \(3N\) 维球体体积，得到
\[
\Omega(E,V,N)\propto V^N E^{3N/2}.
\]
（显式常数与 \(\Gamma(3N/2+1)\)、\(h^{3N}\)、\(N!\) 有关；不影响下面对 \(E,V\) 的偏导结论。）

### (3) 熵与偏导：推出 \(E=\frac{3}{2}Nk_BT\) 与 \(PV=Nk_BT\)
令 \(S=k_B\ln\Omega\)，则
\[
S(E,V,N)=k_B\left[N\ln V+\frac{3N}{2}\ln E+\text{const}\right].
\]
温度定义
\[
\frac{1}{T}=\left(\frac{\partial S}{\partial E}\right)_{V,N}
=k_B\frac{3N}{2}\frac{1}{E}
\quad\Longrightarrow\quad
E=\frac{3}{2}Nk_BT.
\]
压强由
\[
\frac{P}{T}=\left(\frac{\partial S}{\partial V}\right)_{E,N}
=k_B\frac{N}{V}
\quad\Longrightarrow\quad
PV=Nk_BT.
\]

### (4) 简答：\(h^{3N}\)、\(N!\)、以及 \(\Omega\) vs \(\omega\)
- \(h^{3N}\)：把相空间体积换成无量纲“格子数/态数”（半经典量子化尺度）。
- \(N!\)：不可分辨粒子的 Gibbs 修正，避免把“交换标签”误当成新态。
- 体积型 \(\Omega(E)\) 与壳层型 \(\omega(E)=d\Omega/dE\)：对理想气体幂次相差 1（\(\Omega\propto E^{3N/2}\), \(\omega\propto E^{3N/2-1}\)），但在热力学极限下对数偏导给出的 \(T,P\) 不变。

更完整的推导与符号说明见：[[理想气体的微正则态数（相空间体积 Ω）]]。
