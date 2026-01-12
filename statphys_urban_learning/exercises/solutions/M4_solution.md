---
type: solution
id: M4_solution
title: M4 参考解答：同一最小 KL/最大熵引擎（巨正则与 OD）
tags: [grand-canonical, chemical-potential, maxent, od, solution]
---

## (0) 通用引擎：最小 KL \(\Rightarrow\) 指数族；\(\ln Z\) 的导数 \(\Rightarrow\) 均值与协方差

在有限状态空间 \(\mathcal{Z}\) 上，给定 prior \(q(z)>0\)，考虑
\[
\min_{p}\; KL(p\|q)
\quad\text{s.t.}\quad
\sum_{z} p(z)=1,\;\;
\mathbb{E}_p[f_k(z)]=F_k\ (k=1,\dots,K),
\]
其中
\[
KL(p\|q)=\sum_{z\in\mathcal{Z}} p(z)\ln\frac{p(z)}{q(z)}.
\]

构造拉格朗日函数（\(\alpha\) 处理归一化，\(\lambda_k\) 处理矩约束）：
\[
\mathcal{L}(p,\alpha,\lambda)
=\sum_{z} p(z)\ln\frac{p(z)}{q(z)}
-\alpha\left(\sum_z p(z)-1\right)
-\sum_{k=1}^K \lambda_k\left(\sum_z p(z)f_k(z)-F_k\right).
\]

对每个 \(p(z)\) 求偏导并令 0。用到的唯一恒等式是
\(\frac{\partial}{\partial p}\big[p\ln(p/q)\big]=\ln(p/q)+1\)。因此
\[
0=\frac{\partial\mathcal{L}}{\partial p(z)}
=\ln\frac{p(z)}{q(z)}+1-\alpha-\sum_{k}\lambda_k f_k(z).
\]
整理得
\[
\ln\frac{p(z)}{q(z)}=\alpha-1+\sum_k \lambda_k f_k(z)
\quad\Rightarrow\quad
p(z)=q(z)\,e^{\alpha-1}\exp\!\Big(\sum_k \lambda_k f_k(z)\Big).
\]

用归一化 \(\sum_z p(z)=1\) 吸收常数 \(e^{\alpha-1}\)。令
\[
Z(\lambda)\equiv \sum_z q(z)\exp\!\Big(\sum_k \lambda_k f_k(z)\Big),
\]
则
\[
1=e^{\alpha-1}Z(\lambda)\quad\Rightarrow\quad e^{\alpha-1}=\frac{1}{Z(\lambda)}.
\]
于是最优解写成指数族：
\[
\boxed{
p_\lambda(z)=\frac{1}{Z(\lambda)}\,q(z)\exp\!\Big(\sum_k \lambda_k f_k(z)\Big)
}.
\]

接下来推导 \(\ln Z\) 的导数规则。一阶导：
\[
\frac{\partial Z}{\partial \lambda_k}
=\sum_z q(z)\,f_k(z)\exp\!\Big(\sum_j \lambda_j f_j(z)\Big)
\quad\Rightarrow\quad
\frac{\partial}{\partial \lambda_k}\ln Z
=\frac{1}{Z}\frac{\partial Z}{\partial \lambda_k}
=\sum_z f_k(z)\,p_\lambda(z)
=\mathbb{E}_{p_\lambda}[f_k(z)].
\]

二阶导可以从“对期望再求导”得到。先写出
\[
\partial_{\lambda_\ell}\ln p_\lambda(z)
= f_\ell(z)-\partial_{\lambda_\ell}\ln Z
= f_\ell(z)-\mathbb{E}_{p_\lambda}[f_\ell(z)],
\]
因此
\[
\partial_{\lambda_\ell}p_\lambda(z)
=p_\lambda(z)\Big(f_\ell(z)-\mathbb{E}_{p_\lambda}[f_\ell]\Big).
\]
于是
\[
\frac{\partial^2}{\partial \lambda_k\partial \lambda_\ell}\ln Z
=\frac{\partial}{\partial \lambda_\ell}\mathbb{E}_{p_\lambda}[f_k]
=\sum_z f_k(z)\,\partial_{\lambda_\ell}p_\lambda(z)
=\mathbb{E}[f_k f_\ell]-\mathbb{E}[f_k]\mathbb{E}[f_\ell]
=\mathrm{Cov}_{p_\lambda}(f_k,f_\ell).
\]

> 当 \(q\) 取均匀分布时，最小化 \(KL(p\|q)\) 与最大化熵是等价的（只差一个常数）。

## (1) 巨正则分布与巨配分函数

巨正则把“能量 \(E\)”与“粒子数/规模 \(N\)”同时作为随机量。对微观态 \(x\) 与规模 \(N\)，分布写成
\[
p(x,N)\propto \exp\big(-\beta(E(x,N)-\mu N)\big)
=\exp\big(-\beta E(x,N)+\beta\mu\,N\big).
\]

归一化因子（巨配分函数）对所有 \(N\) 与对应的微观态求和：
\[
\mathcal{Z}(\beta,\mu)=\sum_{N}\sum_{x\in\mathcal{X}_N}\exp\big(-\beta(E(x,N)-\mu N)\big).
\]
因此
\[
p(x,N)=\frac{1}{\mathcal{Z}(\beta,\mu)}\exp\big(-\beta(E(x,N)-\mu N)\big).
\]

## (2) \(\langle N\rangle\) 与 \(\mathrm{Var}(N)\) 从 \(\ln\mathcal{Z}\) 得到

令 \(y=\beta\mu\)。把 \(\mathcal{Z}\) 写成
\[
\mathcal{Z}(\beta,y)=\sum_{N}\sum_{x} \exp\big(-\beta E(x,N)+yN\big).
\]

一阶导：
\[
\frac{\partial \mathcal{Z}}{\partial y}
=\sum_{N}\sum_x N\,\exp\big(-\beta E(x,N)+yN\big).
\]

因此
\[
\frac{\partial \ln\mathcal{Z}}{\partial y}
=\frac{1}{\mathcal{Z}}\frac{\partial\mathcal{Z}}{\partial y}
=\sum_{N}\sum_x N\,\frac{\exp(-\beta E(x,N)+yN)}{\mathcal{Z}}
=\langle N\rangle.
\]

二阶导：
\[
\frac{\partial^2 \ln\mathcal{Z}}{\partial y^2}
=\frac{\partial}{\partial y}\langle N\rangle
=\langle N^2\rangle-\langle N\rangle^2
=\mathrm{Var}(N)\ge 0.
\]

> 这和 M3 完全同构：\(\ln\mathcal{Z}\) 是“生成函数”，一阶导给均值，二阶导给涨落。

## (3) OD：边际约束 + 最小 KL \(\Rightarrow\) \(T_{ij}=a_i b_j Q_{ij}\)

考虑 OD（Origin–Destination，起点→终点）离散非负矩阵 \(T_{ij}\)（可理解为流量/概率质量），约束：
\[
\sum_j T_{ij}=O_i,\qquad \sum_i T_{ij}=D_j.
\]
给定 prior \(Q_{ij}>0\)，最小化
\[
KL(T\|Q)=\sum_{ij} T_{ij}\ln\frac{T_{ij}}{Q_{ij}}
\]
在上述线性约束下的最优解属于指数族。

构造拉格朗日函数（只写骨架）：
\[
\mathcal{L}
=\sum_{ij} T_{ij}\ln\frac{T_{ij}}{Q_{ij}}
+\sum_i \alpha_i\Big(\sum_j T_{ij}-O_i\Big)
+\sum_j \gamma_j\Big(\sum_i T_{ij}-D_j\Big).
\]

对每个 \(T_{ij}\) 求偏导并令 0（注意 \(\partial(T\ln T)/\partial T=\ln T+1\)）：
\[
\ln\frac{T_{ij}}{Q_{ij}}+1+\alpha_i+\gamma_j=0
\;\Rightarrow\;
T_{ij}=Q_{ij}\exp(-1-\alpha_i-\gamma_j).
\]

把只依赖 \(i\) 或 \(j\) 的项吸收进系数：
\[
a_i=\exp(-\alpha_i),\qquad b_j=\exp(-\gamma_j)\times e^{-1},
\]
得到乘子形式
\[
\boxed{\;T_{ij}=a_i b_j Q_{ij}\;}
\]
其中 \(a_i,b_j\) 由边际约束唯一确定（这就是 IPF/RAS 的出发点）。

## (4) \(\beta\) 的意义：无成本 prior vs 带成本 prior

### (4.1) \(Q_{ij}\) 为常数：显式基线 \(T_{ij}=\frac{O_i D_j}{N_{\text{tot}}}\)

当 \(Q_{ij}\) 是常数时，(3) 给出 \(T_{ij}=a_i b_j Q_{ij}\)，吸收常数后等价于
\[
T_{ij}=a_i b_j.
\]
记总量 \(N_{\text{tot}}=\sum_i O_i=\sum_j D_j\)。由行和约束：
\[
O_i=\sum_j T_{ij}=\sum_j a_i b_j=a_i\sum_j b_j.
\]
令 \(B\equiv \sum_j b_j\)，则 \(a_i=O_i/B\)。同理列和约束给出：
\[
D_j=\sum_i T_{ij}=\sum_i a_i b_j=b_j\sum_i a_i.
\]
令 \(A\equiv \sum_i a_i\)，则 \(b_j=D_j/A\)。再由
\[
A=\sum_i a_i=\sum_i \frac{O_i}{B}=\frac{N_{\text{tot}}}{B}
\quad\Rightarrow\quad
B=\frac{N_{\text{tot}}}{A},
\]
消去 \(A,B\) 得到
\[
\boxed{
T_{ij}=\frac{O_i D_j}{N_{\text{tot}}}
}.
\]
直觉：当 prior 不提供任何“谁更偏好谁”的结构时，最小 KL（最少偏见）只能把信息压缩到边际上，因此得到一个只由 \(O_i,D_j\) 决定的独立基线（秩 1）。

### (4.2) \(Q_{ij}=\exp(-\beta c_{ij})\)：熵项 + \(\beta\)×成本项

从
\[
KL(T\|Q)=\sum_{ij}T_{ij}\ln\frac{T_{ij}}{Q_{ij}}
\]
展开：
\[
KL(T\|Q)=\sum_{ij}T_{ij}\ln T_{ij}-\sum_{ij}T_{ij}\ln Q_{ij}.
\]
若 \(Q_{ij}=\exp(-\beta c_{ij})\)，则 \(\ln Q_{ij}=-\beta c_{ij}\)，因此
\[
KL(T\|Q)=\sum_{ij}T_{ij}\ln T_{ij}
\;+\;\beta\sum_{ij}T_{ij}c_{ij}.
\]
（若把 \(T\) 视作“总量固定的概率质量”，还会差一个与常数有关的项，但不影响最优解的结构与方向性。）

这把 (4) 题变成非常直观的权衡：
- \(\sum_{ij}T_{ij}\ln T_{ij}\)：倾向于“更分散/更均匀”（熵更大）；
- \(\sum_{ij}T_{ij}c_{ij}\)：倾向于“更低成本/更短距离”；
- \(\beta\) 控制两者谁更重要：\(\beta\) 越大，越“成本敏感”（更像降温），流量更集中到低 \(c_{ij}\) 的 OD 对上。

因此当 \(\beta\) 增大时，通常会看到：
- 平均成本下降；
- 长距离/跨区流占比下降（若成本随距离上升）；
- 集中度上升、矩阵熵下降（更多流量压到少数低成本对上）。

## (5) 理想气体：\(\langle N\rangle\) 与 \(\mu\) 的关系（\(\mu=k_BT\ln(n\lambda_T^3)\)）

这一问的目标不是“背结论”，而是把 \(\mu\) 从抽象的控制参数变成一个可解释、可计算的量：在理想气体里，\(\mu\) 与密度 \(n=\langle N\rangle/V\) 之间有简单的对数关系。

### Step 1：先算单粒子正则配分函数 \(Z_1(T,V)\)

这一步很多人会卡在一个“突然出现的写法”上：为什么单粒子能量要写成 \(\varepsilon(\mathbf p,\mathbf x)\)？

原因很简单：在经典统计里，单粒子的**微观态**就是相空间点 \((\mathbf x,\mathbf p)\)。正则系综的权重是 \(e^{-\beta \varepsilon}\)，因此我们必须把能量写成“给定一个相空间点时它的能量是多少”的函数。

对最常见的非相对论粒子，单粒子能量（哈密顿量）由**动能 + 外势能**组成：
\[
\varepsilon(\mathbf p,\mathbf x)=\frac{\mathbf p^2}{2m}+U(\mathbf x).
\]
这里 \(U(\mathbf x)\) 表示外势/势能（空间非均匀性），**不是**热力学里“内能 \(U\)”的那个 \(U\)。

本题讨论均匀理想气体（无外势），因此取 \(U(\mathbf x)\equiv 0\)，得到
\[
\varepsilon(\mathbf p)=\frac{\mathbf p^2}{2m}.
\]
单粒子正则配分函数定义为相空间积分（除以 \(h^3\) 让其无量纲）：
\[
Z_1(T,V)=\frac{1}{h^3}\int_V d^3r\int_{\mathbb R^3} d^3p\;e^{-\beta \mathbf p^2/(2m)}.
\]
位置积分给出体积 \(V\)：
\[
Z_1(T,V)=\frac{V}{h^3}\int d^3p\;e^{-\beta \mathbf p^2/(2m)}.
\]
动量积分是三维高斯：
\[
\int d^3p\;e^{-\beta \mathbf p^2/(2m)}=\left(\frac{2\pi m}{\beta}\right)^{3/2}=(2\pi m k_BT)^{3/2}.
\]
因此
\[
Z_1(T,V)=\frac{V}{h^3}(2\pi m k_BT)^{3/2}.
\]
定义热德布罗意波长
\[
\lambda_T \equiv \frac{h}{\sqrt{2\pi m k_BT}},
\]
则上式可写为更紧凑的形式：
\[
\boxed{\;Z_1(T,V)=\frac{V}{\lambda_T^3}\;}
\]
（这一步的意义是：\(\lambda_T^3\) 充当“每个量子态对应的有效相空间体积”，从而把积分变成“可数态的数量级”。）

### Step 2：无相互作用 + 不可分辨 \(\Rightarrow Z_N=Z_1^N/N!\)

对无相互作用气体，\(N\) 个粒子的哈密顿量是动能之和，因此玻尔兹曼权重在粒子间因子化，导致正则配分函数的相空间积分因子化为 \(Z_1^N\)。另一方面，粒子不可分辨会带来 \(N!\) 的过度计数修正（Gibbs 悖论的来源），因此
\[
\boxed{\;Z_N(T,V)=\frac{Z_1(T,V)^N}{N!}=\frac{1}{N!}\left(\frac{V}{\lambda_T^3}\right)^N\;}
\]
（单原子气体情形；若有内部自由度，可在 \(Z_1\) 里额外乘上内部配分函数 \(q_{\mathrm{int}}(T)\)。）

### Step 3：把 \(Z_N\) 塞进巨配分函数 \(\mathcal{Z}\)

巨配分函数定义为
\[
\mathcal{Z}(T,V,\mu)=\sum_{N=0}^{\infty} e^{\beta\mu N} Z_N(T,V).
\]
代入上面的 \(Z_N\)：
\[
\mathcal{Z}
=\sum_{N=0}^{\infty} e^{\beta\mu N}\frac{1}{N!}\left(\frac{V}{\lambda_T^3}\right)^N
=\sum_{N=0}^{\infty}\frac{1}{N!}\left(e^{\beta\mu}\frac{V}{\lambda_T^3}\right)^N.
\]
注意到这是指数函数的泰勒展开 \(\sum_{N\ge 0} a^N/N!=e^a\)，因此
\[
\boxed{\;\mathcal{Z}(T,V,\mu)=\exp\!\left(e^{\beta\mu}\frac{V}{\lambda_T^3}\right)\;}
\]
从而
\[
\ln\mathcal{Z}=e^{\beta\mu}\frac{V}{\lambda_T^3}.
\]

### Step 4：用 \(\ln\mathcal{Z}\) 的导数读出 \(\langle N\rangle\)，再解出 \(\mu\)

巨正则里
\[
\langle N\rangle=\frac{1}{\beta}\left(\frac{\partial \ln\mathcal{Z}}{\partial \mu}\right)_{T,V}.
\]
对上式求导（注意 \(\partial_\mu e^{\beta\mu}=\beta e^{\beta\mu}\)）：
\[
\frac{\partial \ln\mathcal{Z}}{\partial \mu}
=\frac{\partial}{\partial\mu}\left(e^{\beta\mu}\frac{V}{\lambda_T^3}\right)
=\beta e^{\beta\mu}\frac{V}{\lambda_T^3}.
\]
代回去得到
\[
\boxed{\;\langle N\rangle=e^{\beta\mu}\frac{V}{\lambda_T^3}\;}
\]
因此密度
\[
n\equiv\frac{\langle N\rangle}{V}=\frac{e^{\beta\mu}}{\lambda_T^3}.
\]
两边取对数并用 \(\beta=1/(k_BT)\)：
\[
\boxed{\;\mu = k_B T\ln(n\lambda_T^3)\;}
\]
这就是所求关系。
