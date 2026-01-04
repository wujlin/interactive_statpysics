---
type: derivation
title: 能量涨落的高斯近似与 1/√N 标度（微正则推导）
tags: ['microcanonical', 'fluctuation', 'gaussian', 'heat-capacity', 'thermodynamic-limit', 'M2']
prereq: ['微正则系综 Microcanonical ensemble', '熵 Entropy', '热力学极限 Thermodynamic limit']
source: ['standard statmech', 'Khinchin 1949 (typicality)', 'Swendsen 2012 (fluctuations)']
status: ready
---

## 目标
- 说明“相对涨落 \(\sim 1/\sqrt{N}\)”从哪里来：熵在极大点附近二阶展开 \(\Rightarrow\) 高斯近似 \(\Rightarrow\) 方差与热容相关 \(\Rightarrow\) 用广延性得到标度。
- 把“典型性/测度集中”落到一个可计算的例子：能量在平衡点附近的分布极尖锐。

## 0) 微正则测度（等概率）提醒
- 这张卡里说的“微正则”等概率，本质是：在满足硬约束的集合里**均匀抽样**。  
  离散态：每个可及态同概率；连续相空间：在能量窗 \([E_{\text{tot}},E_{\text{tot}}+\Delta E]\) 内密度为常数、窗外为 0（见：[[微正则系综 Microcanonical ensemble]]）。

## 定义：什么叫“相对涨落”
对宏观量 \(A\)：
\[
\sigma_A \equiv \sqrt{\langle (A-\langle A\rangle)^2\rangle},
\qquad
\text{相对涨落}\equiv \frac{\sigma_A}{\langle A\rangle}.
\]
备注：有时也会用“相对方差” \(\sigma_A^2/\langle A\rangle^2\)，它的标度会比相对涨落多一个平方根（\(\sim 1/N\) vs \(\sim 1/\sqrt{N}\)）。

---

## 设定：两系统接触、总体系微正则
- 总体系 \(A+B\) **孤立**，总能量固定为 \(E_{\text{tot}}\)。
- 子系统弱耦合，可交换能量；体积与粒子数各自固定（只讨论能量分配）。
- 记多重度：\(\Omega_A(E_A)\)、\(\Omega_B(E_B)\)。

（连续体系需要一个很窄的能量窗 \([E_{\text{tot}},E_{\text{tot}}+\Delta E]\) 来定义“态数”；这个 \(\Delta E\) 在下面的比值/归一化中会消掉，且在热力学极限下结果对 \(\Delta E\) 不敏感。）

---

## 推导

### 1) 为什么 \(P(E_A)\propto \Omega_A(E_A)\Omega_B(E_{\text{tot}}-E_A)\)
当子系统能量取值为 \(E_A\) 时，另一侧必为 \(E_B=E_{\text{tot}}-E_A\)。满足这一能量分配的总微观态数正比于
\[
\Omega_A(E_A)\,\Omega_B(E_{\text{tot}}-E_A).
\]
微正则等概率（等先验）告诉我们：概率 \(\propto\) “满足条件的微观态数”。更严格地写成“计数/体积之比”：
\[
P(E_A)=\frac{\Omega_A(E_A)\Omega_B(E_{\text{tot}}-E_A)}{\Omega_{\text{tot}}(E_{\text{tot}})},
\quad
\Omega_{\text{tot}}(E_{\text{tot}})\equiv \sum_{E_A}\Omega_A(E_A)\Omega_B(E_{\text{tot}}-E_A)
\]
（连续情形把求和换成积分）。因此忽略与 \(E_A\) 无关的归一化常数就得到比例式。

### 2) 把 \(\Omega\) 换成熵：概率由总熵控制
用 Boltzmann 熵 \(S(E)=k_B\ln\Omega(E)\)：
\[
P(E_A)\propto \exp\!\Big(\frac{S_A(E_A)+S_B(E_{\text{tot}}-E_A)}{k_B}\Big)
=\exp\!\Big(\frac{S_{\text{tot}}(E_A)}{k_B}\Big),
\]
其中 \(S_{\text{tot}}(E_A)\equiv S_A(E_A)+S_B(E_{\text{tot}}-E_A)\)。

### 3) 一阶条件：极大点给出 \(T_A=T_B\)
最大概率对应 \(S_{\text{tot}}\) 的极大点 \(E_A^\*\)。对 \(E_A\) 求导：
\[
\frac{dS_{\text{tot}}}{dE_A}
=\left(\frac{\partial S_A}{\partial E_A}\right)_{V_A,N_A}
-\left(\frac{\partial S_B}{\partial E_B}\right)_{V_B,N_B}.
\]
在 \(E_A^\*\) 处令其为 0：
\[
\left(\frac{\partial S_A}{\partial E_A}\right)_{V_A,N_A}
=
\left(\frac{\partial S_B}{\partial E_B}\right)_{V_B,N_B}.
\]
用微正则的温度定义 \(\frac{1}{T}\equiv\left(\frac{\partial S}{\partial E}\right)_{V,N}\)，得到 \(T_A=T_B\)。

### 4) 二阶展开：极大点附近是高斯
在 \(E_A^\*\) 附近对 \(S_{\text{tot}}\) 做二阶展开（一次项为 0）：
\[
S_{\text{tot}}(E_A)\approx S_{\text{tot}}(E_A^\*)+\frac{1}{2}S_{\text{tot}}''(E_A^\*)(E_A-E_A^\*)^2.
\]
由于 \(E_A^\*\) 是极大点，\(S_{\text{tot}}''(E_A^\*)<0\)。代入概率：
\[
P(E_A)\propto \exp\!\Big(\frac{1}{2k_B}S_{\text{tot}}''(E_A^\*)(E_A-E_A^\*)^2\Big)
\approx \exp\!\Big(-\frac{(E_A-E_A^\*)^2}{2\sigma_{E_A}^2}\Big),
\]
其中
\[
\boxed{\sigma_{E_A}^2=\frac{k_B}{-S_{\text{tot}}''(E_A^\*)}.}
\]

### 5) 把曲率 \(S''\) 写成热容 \(C\)
对任一系统 \(X\in\{A,B\}\)（固定 \(V,N\)）：
\[
\frac{\partial S_X}{\partial E_X}=\frac{1}{T}.
\]
再对 \(E_X\) 求导：
\[
\frac{\partial^2 S_X}{\partial E_X^2}
=\frac{d}{dE_X}\Big(\frac{1}{T}\Big)
=-\frac{1}{T^2}\frac{dT}{dE_X}.
\]
定义热容（定 \(V,N\)）：
\[
C_X\equiv\left(\frac{\partial E_X}{\partial T}\right)_{V,N}
\quad\Rightarrow\quad
\frac{dT}{dE_X}=\frac{1}{C_X}.
\]
于是
\[
\boxed{\frac{\partial^2 S_X}{\partial E_X^2}=-\frac{1}{T^2 C_X}.}
\]

### 6) 得到一般方差公式与“大热库近似”
因为 \(S_{\text{tot}}''=S_A''+S_B''\)，在平衡温度 \(T\) 下：
\[
S_{\text{tot}}''(E_A^\*)=-\frac{1}{T^2}\Big(\frac{1}{C_A}+\frac{1}{C_B}\Big).
\]
代入 \(\sigma_{E_A}^2\)：
\[
\boxed{
\sigma_{E_A}^2
=k_B T^2\,\frac{C_A C_B}{C_A+C_B}.
}
\]
若 \(B\) 是大热库（\(C_B\gg C_A\)）：
\[
\boxed{\sigma_{E_A}^2 \approx k_B T^2 C_A.}
\]
这与正则系综的结论一致（见：[[平均能量与 ln Z 的导数关系]]）。

---

## 标度：为什么相对涨落 \(\sim 1/\sqrt{N}\)
对常规短程相互作用系统（远离临界点），能量与热容都是广延量：
\[
\langle E_A\rangle \propto N_A,\qquad C_A\propto N_A.
\]
由 \(\sigma_{E_A}^2\approx k_B T^2 C_A\) 得
\[
\sigma_{E_A}\propto \sqrt{N_A}
\quad\Rightarrow\quad
\boxed{\frac{\sigma_{E_A}}{\langle E_A\rangle}\propto \frac{1}{\sqrt{N_A}}.}
\]
相对方差则为 \(\sigma_{E_A}^2/\langle E_A\rangle^2\propto 1/N_A\)。

## 直觉（可选）
把能量看作很多自由度贡献的和：\(E_A=\sum_{i=1}^{N_A}\varepsilon_i\)。若相关性不强，则均值与方差都随 \(N_A\) 线性增长，从而相对涨落随 \(1/\sqrt{N_A}\) 衰减（大数定律/中心极限定理的影子）。

## 检查与边界
- 需要 \(S_{\text{tot}}''(E_A^\*)<0\)（稳定平衡）。等价地，对常规体系需要正热容（临界点附近会出现异常涨落/相关性增强）。
- “大热库近似”仅用于把一般公式化简到 \(\sigma^2\approx k_B T^2 C_A\)；即便 \(C_B\) 不无限大，上面的 \(C_A C_B/(C_A+C_B)\) 仍成立。

## Source anchors
- Swendsen Eq 19.60：\(\mathrm{Var}(E)=k_B T^2 C_V\)（正则系综表述）
- 本仓库对应链路：[[热力学极限 Thermodynamic limit]]、[[平均能量与 ln Z 的导数关系]]

## 对齐：Boltzmann 分布与配分函数 \(Z\)（同一条链的另一截面）
上面的链路是“**总体系微正则 \(\Rightarrow\) 子系统能量分配的高斯近似 \(\Rightarrow\) 方差与标度**”。如果此处把 \(B\) 取成**巨大热库**，并把 \(S_B(E_{\text{tot}}-E_A)\) 只保留一阶展开，就会得到正则系综的指数权重：
\[
P(E_A)\propto \Omega_A(E_A)\exp\!\Big(\frac{S_B(E_{\text{tot}}-E_A)}{k_B}\Big)
\approx \Omega_A(E_A)\,e^{-\beta E_A}.
\]
进一步把 \(A\) 的“能量为 \(E_A\)”细化到“具体微观态 \(i\) 的能量为 \(E_i\)”，就得到
\[
p_i \propto e^{-\beta E_i},\qquad p_i=\frac{e^{-\beta E_i}}{Z(\beta)},\quad Z(\beta)=\sum_i e^{-\beta E_i}.
\]
完整推导见：[[从系统与热库推出 Boltzmann 分布（正则系综）]]；由 \(Z\) 导出均值/涨落见：[[平均能量与 ln Z 的导数关系]]。
