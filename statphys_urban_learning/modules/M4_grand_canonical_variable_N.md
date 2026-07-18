# M4 巨正则系综：粒子数也能涨落时怎样记账

把两个容器连通，如果系统 $A$ 的内部化学势高于系统 $B$，粒子会从 $A$ 流向 $B$；但把一个系统接到粒子库后，提高粒子库设定的化学势，又会使系统平均粒子数增加。两句话看似方向相反，其实分别谈论**系统内部的边际自由能**与**外部库施加的控制参数**。

分清化学势的这两种角色，才能同时判断粒子交换方向，并计算开放系统的平均粒子数及其涨落。

## 1. 内部化学势给出粒子交换的方向

对固定 $(T,V)$ 的系统，内部化学势定义为

$$
\mu_{\mathrm{sys}}(T,V,N)
=\left(\frac{\partial F}{\partial N}\right)_{T,V}.
$$

它表示在当前状态附近向系统增加一个粒子所需的边际自由能。对粒子数很小的有限系统，导数应替换为相邻 $N$ 之间的自由能差。

考虑两个可交换粒子的子系统 $A$、$B$，总粒子数固定，$N_B=N_{\mathrm{tot}}-N_A$。总自由能为

$$
F_{\mathrm{tot}}(N_A)
=F_A(N_A)+F_B(N_{\mathrm{tot}}-N_A).
$$

改变 $N_A$ 时

$$
dF_{\mathrm{tot}}
=(\mu_A-\mu_B)\,dN_A.
$$

若 $\mu_A>\mu_B$，取 $dN_A<0$ 会降低总自由能，所以粒子从 $A$ 流向 $B$。平衡条件是

$$
\boxed{\mu_A=\mu_B}.
$$

这条判据只给出热力学驱动力的方向，不给出迁移速率；速率还需要势垒、输运系数和具体动力学。

## 2. 外部粒子库把 $\mu$ 变成控制参数

现在让一个小系统同时接触热库和粒子库。复合系统的总能量与总粒子数固定，但小系统的 $(E,N)$ 都可以涨落。小系统处于微观配置 $x$、能量 $E(x,N)$、粒子数 $N$ 的概率正比于库剩余状态的态数：

$$
P(x,N)
\propto
\omega_R(E_{\mathrm{tot}}-E,\,N_{\mathrm{tot}}-N).
$$

把库熵在平衡点附近展开，并利用

$$
\left(\frac{\partial S_R}{\partial E_R}\right)=\frac{1}{T},
\qquad
\left(\frac{\partial S_R}{\partial N_R}\right)=-\frac{\mu_R}{T},
$$

得到

$$
S_R(E_{\mathrm{tot}}-E,N_{\mathrm{tot}}-N)
\simeq
\text{const}-\frac{E-\mu_R N}{T}.
$$

于是开放系统的权重为

$$
P(x,N)
\propto
e^{-\beta[E(x,N)-\mu_R N]},
\qquad
\beta=\frac{1}{k_BT}.
$$

这里的 $\mu_R$ 是由巨大粒子库给定的**外部控制参数**。它与系统内部的 $\mu_{\mathrm{sys}}(N)$ 不是两个不同物理量，而是同一共轭量在库与系统两侧的取值；平衡时二者相等。

## 3. 巨配分函数汇总所有粒子数分支

固定 $N$ 时，正则配分函数为

$$
Z_N(T,V)=\sum_x e^{-\beta E(x,N)}.
$$

允许 $N$ 从 $0$ 到无穷变化后，归一化常数变成巨配分函数

$$
\boxed{
\mathcal Z(T,V,\mu_R)
=\sum_{N=0}^{\infty}\sum_x
e^{-\beta[E(x,N)-\mu_R N]}
},
$$

或等价地

$$
\boxed{
\mathcal Z
=\sum_{N=0}^{\infty}
e^{\beta\mu_R N}Z_N(T,V)
}.
$$

标准文献通常把巨势记作 $\Omega$。本课程改记为 $\mathcal J$，以免与 M2 的能量壳态数 $\Omega_{\delta E}$ 混淆：

$$
\boxed{
\mathcal J(T,V,\mu_R)
=-k_BT\ln\mathcal Z
}.
$$

在热力学极限的鞍点近似下，它等于

$$
\mathcal J(T,V,\mu_R)
\simeq
\min_N\left[F(T,V,N)-\mu_RN\right].
$$

对有限系统，$-k_BT\ln\mathcal Z$ 保留了所有 $N$ 分支的涨落，不能简单等同于在某一个 $N$ 上代入 $F-\mu_RN$。其微分关系为

$$
d\mathcal J
=-S\,dT-P\,dV-N\,d\mu_R.
$$

在给定 $(T,V,\mu_R)$ 时，平衡状态最小化 $F(N)-\mu_RN$。驻值条件为

$$
\frac{\partial}{\partial N}[F(N)-\mu_RN]
=\mu_{\mathrm{sys}}(N)-\mu_R=0,
$$

正好恢复 $\mu_{\mathrm{sys}}=\mu_R$。

## 4. 一阶导数给平均粒子数，二阶导数给涨落

令无量纲控制参数为

$$
\alpha\equiv\beta\mu_R.
$$

对 $\alpha$ 求导：

$$
\frac{\partial\ln\mathcal Z}{\partial\alpha}
=\langle N\rangle.
$$

再求一次导数：

$$
\frac{\partial^2\ln\mathcal Z}{\partial\alpha^2}
=\langle N^2\rangle-\langle N\rangle^2
=\operatorname{Var}(N).
$$

换回 $\mu_R$，在固定 $(T,V)$ 时有

$$
\boxed{
\langle N\rangle
=\frac{1}{\beta}
\frac{\partial\ln\mathcal Z}{\partial\mu_R}
},
$$

$$
\boxed{
\operatorname{Var}(N)
=\frac{1}{\beta}
\frac{\partial\langle N\rangle}{\partial\mu_R}
=\frac{1}{\beta^2}
\frac{\partial^2\ln\mathcal Z}{\partial\mu_R^2}
}.
$$

所以，在稳定的巨正则平衡态中，提高外部库化学势会增加平均粒子数：

$$
\frac{\partial\langle N\rangle}{\partial\mu_R}
=\beta\operatorname{Var}(N)\ge 0
$$

（这里默认 $T>0$）。这不与“粒子从内部化学势较高的一侧流出”冲突：前者改变外部控制参数，后者比较两个系统在当前状态下的内部边际自由能。

完整导数推导见：[[平均粒子数与涨落从 ln 𝒵 的导数得到]]。

### 一个可解例子：经典稀薄气体

若固定 $N$ 的配分函数可写成

$$
Z_N=\frac{z_1^N}{N!},
$$

其中 $z_1$ 是单粒子配分函数，则

$$
\mathcal Z
=\sum_{N=0}^{\infty}
\frac{(e^{\beta\mu_R}z_1)^N}{N!}
=\exp(e^{\beta\mu_R}z_1).
$$

令 $\lambda=e^{\beta\mu_R}z_1$，可得

$$
P(N)=e^{-\lambda}\frac{\lambda^N}{N!},
\qquad
\langle N\rangle=\operatorname{Var}(N)=\lambda.
$$

这就是理想稀薄气体的 Poisson 粒子数涨落；相互作用会改变这个等均值—方差关系。

### Interactive：调节外部 $\mu_R$

调节 $\alpha=\beta\mu_R$，观察 $P(N)$ 怎样移动和展宽，以及 $\ln\mathcal Z$ 的一阶、二阶导数如何返回均值与方差。

<InteractiveConcept type="grand-canonical-poisson" />

### 进阶：量子占据数

无相互作用量子气体可以把 $\mathcal Z$ 因子化为单粒子能级的乘积，并由允许占据数的差异得到 Fermi–Dirac、Bose–Einstein 与 Maxwell–Boltzmann 分布。推导见：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]。

## 5. 城市例子：固定一种交换对象

为了避免在“人口、OD 流量、企业数、事件数”之间来回切换，这里只把 $N$ 定义为**给定城市边界内的常住人口数**。外部人口池扮演粒子库，微观配置 $x$ 记录这 $N$ 名居民的空间或住房配置。设模型成本为 $C(x,N)$，则巨正则零模型可写成

$$
P(x,N)
\propto
e^{-\beta[C(x,N)-\mu_RN]}.
$$

在这套固定符号中：

- $\mu_{\mathrm{city}}(N)=\partial F_{\mathrm{city}}/\partial N$ 是城市在当前规模下增加一名居民的内部边际自由成本；
- $\mu_R$ 是外部人口池给定的参与价值或保留水平，以与 $C$ 相同的单位表示；
- 平衡平均规模由 $\mu_{\mathrm{city}}=\mu_R$ 决定；
- 提高 $\mu_R$ 会在模型中偏置更大的 $N$，而两个城市直接交换固定总人口时，人口从内部 $\mu$ 较高的一侧流向较低的一侧。

因此不宜把 $\mu$ 简单翻译成没有符号约定的“吸引力”。若能量写成成本，内部 $\mu$ 较高表示新增居民的边际成本较高；若改用效用记号，指数与参数符号也要相应改变。

这个映射仍只是平衡零模型。真实迁移可能受非平稳政策、异质偏好、网络约束和不可逆过程驱动；时间序列中的人口方差也不必等于平衡系综的 $\operatorname{Var}(N)$。

只有在状态空间、参考测度、外部控制量和近似稳态时间窗都明确时，涨落—响应式才具有可检验含义。城市侧的建模边界见：[[化学势 μ 作为城市总强度规模控制量]]。

## 6. 适用边界

巨正则系综要求 $\mathcal Z$ 可归一化，并默认热库、粒子库足够大且耦合较弱。以下情形需要额外处理：

- 系统与库强耦合，导致系统能量无法独立定义；
- 粒子数并非近似守恒的交换量，或根本不存在可定义的外部库；
- 相变附近 $P(N)$ 多峰，单一平均值不能代表典型状态；
- 非平衡稳态存在持续概率流，此时相同的稳态分布并不等于巨正则平衡。

例如平衡黑体辐射中光子数不受外部约束，因此光子化学势为零；若实验人为近似守恒激发数，结论可以改变。

## 核心答案：化学势的两种角色必须分开

内部化学势是系统自由能对粒子数的边际导数，决定两个系统之间的粒子交换方向。外部粒子库化学势则是控制参数，决定不同 $N$ 分支的统计权重。

巨配分函数把这些分支统一求和，$\ln\mathcal Z$ 的一阶与二阶导数分别给出平均粒子数和粒子数涨落。分清“比较内部 $\mu$”与“改变外部 $\mu_R$”，就能消除开放系统中最常见的方向混淆。

## 自检与练习

1. 若 $\mu_A>\mu_B$，证明粒子从 $A$ 流向 $B$ 会降低总自由能。
2. 从库熵展开推导 $e^{-\beta(E-\mu_RN)}$。
3. 从 $\mathcal Z$ 推导 $\langle N\rangle$、$\operatorname{Var}(N)$ 与 $\partial\langle N\rangle/\partial\mu_R$ 的关系。
4. 为什么提高外部 $\mu_R$ 会增加 $\langle N\rangle$，却不与“高内部 $\mu$ 一侧流出粒子”冲突？
5. 在城市映射中，为什么必须先固定 $N$ 究竟表示人口、企业还是事件数？

### 参考与学习资源

- Gibbs 1902，*Elementary Principles in Statistical Mechanics*：导读见 [Seminal papers](/references/seminal_papers)（`SP-M4-Gibbs1902`）。
- [ ] **Reading Guide**：[[Swendsen_Ch20_GrandCanonical]]。
- [ ] **Written**：`exercises/written/M4_grand_canonical_notes.md`。
- [ ] **进阶推导**：[[从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）]]。

### 验收标准

- [ ] 能区分系统内部化学势与外部粒子库化学势，并正确判断粒子流向。
- [ ] 能写出 $\mathcal Z$ 与 $\mathcal J$，并用导数得到 $\langle N\rangle$ 和 $\operatorname{Var}(N)$。
- [ ] 能说明巨正则城市映射是一种有边界条件的零模型，而不是把“吸引力”当作物理事实。
