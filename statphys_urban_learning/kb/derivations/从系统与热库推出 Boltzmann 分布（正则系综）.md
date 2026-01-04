---
type: derivation
title: 从系统与热库推出 Boltzmann 分布（正则系综）
tags: ['canonical', 'microcanonical', 'boltzmann', 'partition-function', 'M3']
prereq: ['微正则系综 Microcanonical ensemble', '熵 Entropy', '配分函数 Partition function']
source: ['Swendsen 2012', 'Gibbs ensemble', 'Jaynes 1957 (contrast)']
status: ready
---

## 目标
- 用经典的“系统 \(S\) + 热库 \(B\)”推导，从微正则等概率原理得到 Boltzmann 分布（正则系综）。
- 给出一个并列对照：同一分布也可由“最大熵 + 平均能量约束”推出（信息论视角）。

## 你真正需要记住的三件事
1) **等概率原理**：隔离总体系（\(S+B\)）在给定总能量壳层内等概率。  
2) **态数相乘**：独立子系统的可达态数相乘（或熵相加）。  
3) **热库熵展开 + 温度定义**：\(S_B(E_{\text{tot}}-E_i)\) 一阶展开，\(\partial_E S = 1/T\)。

## 先澄清一个常见误解（两层意思）
- **微正则“单系统版本”**：能量被固定在 \(E\)（能壳/能量窗）上，因此分布是“能壳上的等概率”，不会出现 \(e^{-\beta E}\) 这种“按能量加权”的形式（因为能量根本不允许变化）。  
- **从微正则出发导出正则**：把系统放进更大的孤立体系（系统 + 热库）并对热库自由度做边缘化，才会得到 \(p_i\propto \Omega_B(E_{\text{tot}}-E_i)\approx e^{-\beta E_i}\)；指数权重与配分函数 \(Z\) 是这样“长出来”的。

---

## 推导 A：系统接触热库（微正则 \(\Rightarrow\) 正则）

### 0) 设定
- 小系统 \(S\) 有离散微观态 \(i\)，每个态能量为 \(E_i\)。
- 大热库 \(B\) 只与 \(S\) 交换能量（不交换粒子）。
- 总体系 \(S+B\) 隔离，总能量固定：
  \[
  E_{\text{tot}}=E_S+E_B.
  \]
- 微正则等概率：在给定 \(E_{\text{tot}}\) 的壳层内，总体系所有可达微观态等概率。

### 1) 概率与热库态数成正比
当系统处于态 \(i\) 时，热库能量被迫为
\[
E_B=E_{\text{tot}}-E_i.
\]
在这个条件下，总体系可达微观态的数量与热库在能量 \(E_B\) 下的态数成正比：
\[
p_i \propto \Omega_B(E_{\text{tot}}-E_i).
\]

### 2) 用熵改写态数
对热库定义熵：
\[
S_B(E)\equiv k_B \ln \Omega_B(E)
\quad\Longleftrightarrow\quad
\Omega_B(E)=\exp\!\big(S_B(E)/k_B\big).
\]
因此
\[
p_i \propto \exp\!\Big(\frac{S_B(E_{\text{tot}}-E_i)}{k_B}\Big).
\]

### 3) 热库很大：对熵做一阶泰勒展开
由于热库巨大，系统能量尺度 \(E_i\) 相比 \(E_{\text{tot}}\) 是微扰。对 \(S_B\) 在 \(E_{\text{tot}}\) 附近展开：
\[
S_B(E_{\text{tot}}-E_i)
\approx
S_B(E_{\text{tot}})-E_i\left.\frac{\partial S_B}{\partial E_B}\right|_{E_{\text{tot}}}.
\]
（二阶项控制能量涨落大小；见：[[能量涨落的高斯近似与 1/√N 标度（微正则推导）]]；从正则系综也可得到同一结果：[[平均能量与 ln Z 的导数关系]]。）

### 4) 用温度定义引入 \(\beta\)
热力学定义：
\[
\left.\frac{\partial S}{\partial E}\right|_{V,N,\dots}=\frac{1}{T}.
\]
所以
\[
\left.\frac{\partial S_B}{\partial E_B}\right|_{E_{\text{tot}}}=\frac{1}{T}.
\]
代回得到
\[
p_i \propto \exp\!\Big(\frac{S_B(E_{\text{tot}})}{k_B}\Big)\exp\!\Big(-\frac{E_i}{k_B T}\Big)
\propto e^{-\beta E_i},
\quad
\beta\equiv \frac{1}{k_B T}.
\]

### 5) 归一化：配分函数 \(Z\)
用 \(\sum_i p_i=1\) 归一化：
\[
p_i=\frac{e^{-\beta E_i}}{\sum_j e^{-\beta E_j}}
=\frac{e^{-\beta E_i}}{Z(\beta)},
\qquad
Z(\beta)\equiv\sum_j e^{-\beta E_j}.
\]

### 6) 能级—简并（态数）形式
如果只关心能量 \(E\)，把能量相同的微观态合并。设系统在能量 \(E\) 的简并度（态数）为 \(g(E)\)（连续情形用态密度/多重度 \(\Omega(E)\)）：
\[
P(E)=\frac{g(E)e^{-\beta E}}{Z},\qquad
Z=\sum_E g(E)e^{-\beta E}.
\]

---

## 推导 A'：由正则分布推出 \(F=-k_BT\ln Z\)（桥接公式）

这一步的作用是把“归一化常数 \(Z\)”升级为“热力学势函数 \(F\)”：一旦你能计算 \(Z\)，热力学量就能通过导数系统性生成。

### 1) 起点：正则分布与能量平均
\[
p_i=\frac{e^{-\beta E_i}}{Z},\qquad Z=\sum_i e^{-\beta E_i},\qquad \beta=\frac{1}{k_BT}.
\]
定义内能（平均能量）：
\[
U\equiv \langle E\rangle = \sum_i p_i E_i.
\]

### 2) 计算熵并代回 \(F\equiv U-TS\)
Gibbs 熵：
\[
S\equiv -k_B\sum_i p_i\ln p_i.
\]
由 \(\ln p_i=-\beta E_i-\ln Z\)，得到
\[
S=-k_B\sum_i p_i(-\beta E_i-\ln Z)
=k_B\beta \sum_i p_iE_i + k_B\ln Z
=k_B\beta U + k_B\ln Z.
\]
因此
\[
F\equiv U-TS
=U-T(k_B\beta U+k_B\ln Z)
=-k_BT\ln Z.
\]

---

## 推导 B（对照）：最大熵 \(\Rightarrow\) Boltzmann
这条路线把正则分布视作“在信息不足下的最诚实推断”。只假设两条约束：
- 归一化：\(\sum_i p_i=1\)
- 平均能量：\(\sum_i p_i E_i=U\)

最大化 Gibbs/Shannon 熵
\[
S=-k_B\sum_i p_i\ln p_i
\]
即可得到同一形式：
\[
p_i=\frac{e^{-\beta E_i}}{Z}.
\]
完整推导骨架见：[[Boltzmann 分布的最大熵推导]]；两条路线“为什么等价”见：[[MaxEnt 与正则系综等价（信息等价）]]。

---

## 下一步（把分布变成可计算量）
- \(\langle E\rangle=-\partial_\beta \ln Z\)，\(\mathrm{Var}(E)=\partial_\beta^2\ln Z\)：[[平均能量与 ln Z 的导数关系]]
- 自由能：\(F=-k_B T\ln Z\)（本页推导 A'）；也可单独阅读：[[从正则分布到自由能 F=-kT ln Z]]

## 检查
- 可积性/收敛：\(Z\) 必须有限（否则分布不可归一化）。
- 极限：
  - \(T\to\infty\)（\(\beta\to 0\)）时分布趋于“更均匀”；
  - \(T\to 0\)（\(\beta\to\infty\)）时分布集中到最低能态。
- 条件：热库足够大（使一阶展开足够精确）；二阶项不忽略时会给出能量涨落。

## Source anchors
- Swendsen Eq 19.15：\(\partial_{E_T}\ln\Omega_R(E_T)=\beta=\frac{1}{k_BT}\)
- Swendsen Eq 19.16：\(\ln P(E)=\ln\Omega(E)-\beta E-\ln Z\)
- Swendsen Eq 19.17：\(P(E)=\frac{1}{Z}\Omega(E)\,e^{-\beta E}\)
- Swendsen Eq 19.18：\(Z=\int dE\,\Omega(E,V,N)\,e^{-\beta E}\)
- Swendsen Eq 19.23：相空间正则分布 \(P(p,q)\propto e^{-\beta H(p,q)}\)
- Swendsen Eq 19.49：\(F(T,V,N)=-k_B T\ln Z\)
- Jaynes 1957（条目：`SP-M1-Jaynes1957-I`）：最大熵作为推断规则的视角（对照路线）
