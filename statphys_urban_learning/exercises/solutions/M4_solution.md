---
type: solution
id: M4_solution
title: M4 参考解答：巨配分函数导数（规模与涨落）与 OD（起讫矩阵）最大熵乘子结构
tags: [grand-canonical, chemical-potential, maxent, od, solution]
---

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
\sum_i \alpha_i\Big(\sum_j T_{ij}-O_i\Big)
\sum_j \gamma_j\Big(\sum_i T_{ij}-D_j\Big).
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

## (4) 无成本 prior vs 带成本 prior 的直觉

- 无成本 prior：若 \(Q_{ij}\) 是常数（或仅与 \(i,j\) 无关），则 \(T\) 的结构主要由边际 \(O_i,D_j\) 决定，等价于“在边际约束下最均匀/最少偏见”的基线。
- 带成本 prior：若 \(Q_{ij}=\exp(-\beta c_{ij})\)，当 \(\beta\) 增大时高成本（大 \(c_{ij}\)）的条目被指数抑制，通常会：
  - 降低平均成本 \(\sum_{ij} T_{ij}c_{ij}/\sum_{ij}T_{ij}\)
  - 减少长距离/跨区流占比（若成本与距离正相关）
  - 使流量更“局域化”（更集中在低成本对上）

## (5) 理想气体：\(\langle N\rangle\) 与 \(\mu\) 的关系（\(\mu=k_BT\ln(n\lambda_T^3)\)）

这一问的目标不是“背结论”，而是把 \(\mu\) 从抽象的控制参数变成一个可解释、可计算的量：在理想气体里，\(\mu\) 与密度 \(n=\langle N\rangle/V\) 之间有简单的对数关系。

### Step 1：先算单粒子正则配分函数 \(Z_1(T,V)\)

经典单粒子（无外势，只有动能）的能量为
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
