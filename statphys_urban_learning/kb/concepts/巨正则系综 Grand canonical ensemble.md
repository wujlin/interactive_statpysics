---
type: concept
title: 巨正则系综 Grand canonical ensemble
tags: ['statmech', 'M4']
prereq: ['正则系综 Canonical ensemble', '化学势 Chemical potential']
source: ['Gibbs ensemble']
status: ready
---

## 一句话
巨正则系综描述与热库和粒子库接触的平衡系统：自然变量为 $(T,V,\mu)$，状态权重 $p(x,N)\propto \exp[-\beta(E(x,N)-\mu N)]$，归一化常数为巨配分函数 \(\mathcal{Z}\)；并且 \(\ln\mathcal{Z}\) 的导数生成平均规模与涨落。

## 符号最小表（避免 \(Z\)/\(\mathcal{Z}\)/\(\Omega\) 打架）
- 微观态：\(x\)（给定 \(N\) 时系统内部自由度的完整描述）
- 系统能量：\(E(x,N)\)
- 逆温：\(\beta\equiv 1/(k_BT)\)
- 多重度/态数（microcanonical）：\(\Omega(E,V,N)\)（只用于“计数/相空间体积”）
- 固定 \(N\) 的正则配分函数：
  \[
  Z_N(T,V)\equiv \sum_x e^{-\beta E(x,N)}.
  \]
- 巨配分函数（grand partition function）：
  \[
  \mathcal{Z}(T,V,\mu)\equiv \sum_{N}\sum_x e^{-\beta(E(x,N)-\mu N)}.
  \]
- 巨势函数（grand potential，本仓库记作 \(J\)）：
  \[
  J(T,V,\mu)\equiv -k_BT\ln\mathcal{Z}(T,V,\mu).
  \]
  > 很多教材把 grand potential 也写作 \(\Omega\)。本仓库用 \(\Omega\) 表示多重度，因此用 \(J\) 避免符号冲突。

## 分布（最小形式）
\[
p(x,N) = \frac{1}{\mathcal{Z}(\beta,\mu)} \exp\big[-\beta(E(x,N)-\mu N)\big].
\]
> 直觉：\(T\) 控制能量涨落；\(\mu\) 控制粒子数/规模涨落。符号总表见：[[符号约定与映射（本仓库统一：Swendsen 体系）]]。

## 从复合系统推导权重：为什么是 \(e^{-\beta(E-\mu N)}\)
这一步只用到“总系统微正则 + 熵的一阶展开”。核心逻辑是：**小系统的概率由大库的多重度决定**。

### 1) 设定：系统 A + 库 B，总体孤立（微正则）
- 小系统（A）：允许与外界交换能量与粒子数；微观态写作 \((x,N)\)。
- 大库（B）：很大，能量与粒子数可供给/吸收。
- 复合系统 \(A+B\) 孤立：
  \[
  E_{\text{tot}}=\text{const},\qquad N_{\text{tot}}=\text{const}.
  \]
微正则假设：复合系统在满足约束的总微观态上等概率。

### 2) 边缘化：\(p(x,N)\propto \Omega_B(E_{\text{tot}}-E(x,N),\,N_{\text{tot}}-N)\)
当 A 处于 \((x,N)\) 时，库的能量与粒子数被迫为
\[
E_B=E_{\text{tot}}-E(x,N),\qquad N_B=N_{\text{tot}}-N.
\]
因此 A 处于 \((x,N)\) 的相对权重正比于库在该宏观状态下的多重度：
\[
p(x,N)\propto \Omega_B(E_B,N_B)=\Omega_B\big(E_{\text{tot}}-E(x,N),\,N_{\text{tot}}-N\big).
\]

### 3) 用熵写 \(\Omega\)，并对大库做一阶展开
令 \(S_B\equiv k_B\ln\Omega_B\)。库很大，因此可在平衡点附近对 \(S_B\) 做一阶展开：
\[
S_B(E_{\text{tot}}-E,\;N_{\text{tot}}-N)
\approx
S_B(E_{\text{tot}},N_{\text{tot}})
-\left(\frac{\partial S_B}{\partial E_B}\right)E
-\left(\frac{\partial S_B}{\partial N_B}\right)N,
\]
其中为简洁把 \(E(x,N)\) 记为 \(E\)。

### 4) 用热力学定义引入 \(T\) 与 \(\mu\)
热力学里
\[
\left(\frac{\partial S}{\partial E}\right)_{V,N}=\frac{1}{T},
\qquad
\left(\frac{\partial S}{\partial N}\right)_{E,V}=-\frac{\mu}{T}.
\]
因此
\[
\ln\Omega_B
\approx \text{const}-\beta E+\beta\mu N,\qquad \beta\equiv \frac{1}{k_BT}.
\]
回到 (2)，得到
\[
p(x,N)\propto e^{-\beta(E(x,N)-\mu N)}.
\]
把比例式归一化，就得到上面的巨正则分布与巨配分函数 \(\mathcal{Z}\)。

## 巨配分函数（grand partition function）
\[
\mathcal{Z}(\beta,\mu) = \sum_{N} e^{\beta\mu N} Z_N(\beta),
\]
其中 \(Z_N\) 是固定 N 的正则配分函数。

## 最重要的导数规则
- 一阶导给平均规模：
  \[
  \frac{\partial\ln\mathcal{Z}}{\partial\mu}=\beta\langle N\rangle
  \quad\Rightarrow\quad
  \boxed{\ \langle N\rangle=\frac{1}{\beta}\left(\frac{\partial\ln\mathcal{Z}}{\partial\mu}\right)_{T,V}\ }.
  \]
- 二阶导给涨落（并体现“涨落—响应”）：
  \[
  \boxed{\ \mathrm{Var}(N)=\frac{1}{\beta^2}\left(\frac{\partial^2\ln\mathcal{Z}}{\partial\mu^2}\right)_{T,V}\ }.
  \]
完整分步推导见：[[平均粒子数与涨落从 ln 𝒵 的导数得到]]。

## 巨势函数 \(J=-k_BT\ln\mathcal{Z}\)：为什么它是“自然势”
定义
\[
J(T,V,\mu)\equiv -k_BT\ln\mathcal{Z}(T,V,\mu).
\]
它的自然变量是 \((T,V,\mu)\)，并且
\[
N=-\left(\frac{\partial J}{\partial \mu}\right)_{T,V}.
\]
这就是“外界给定 \(\mu\) \(\Rightarrow\) 系统平均规模由势函数偏导读出”的最短闭环。

## 城市连接（最小）
- 当“总事件数/出行强度/人口规模”不是固定的，而是与外部环境交换时，巨正则是最自然的平衡态基线。

## Source anchors
- Swendsen Eq 20.9：\(P(E,N)=(1/\mathcal{Z})\,\Omega\,e^{-\beta E+\beta\mu N}\)
- Swendsen Eq 20.12：\(\mathcal{Z}(T,V,\mu)=\sum_N Z(T,V,N)e^{\beta\mu N}\)
