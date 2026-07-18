# M3 正则系综：热库怎样把计数变成配分函数

微正则系综要求系统能量固定在一个窄壳上，但实验中的小系统通常与环境交换能量。能量不再固定后，微观态也不再等概率；热库可用态数的差异决定了它们的统计权重。

中心对象是正则配分函数 $Z$。它既归一化 Boltzmann 权重，又是能量累积量的生成函数；通过 $F=-k_BT\ln Z$，它还把微观概率连接到 M0 的热力学势。

## 1. Boltzmann 权重来自一个更大的孤立系统

设小系统 $S$ 与巨大热库 $R$ 弱耦合，复合系统总能量固定：

$$
E_{\mathrm{tot}}=E_S+E_R.
$$

小系统处于微观态 $i$、能量为 $E_i$ 时，热库可用能量为 $E_{\mathrm{tot}}-E_i$。复合系统采用微正则测度，因此该微观态的概率正比于热库相应的态密度：

$$
p_i\propto\omega_R(E_{\mathrm{tot}}-E_i).
$$

用 M2 的壳熵 $S_R=k_B\ln[\omega_R\delta E]$ 写成指数，并利用热库远大于小系统，对熵作一阶展开：

$$
S_R(E_{\mathrm{tot}}-E_i)
\simeq
S_R(E_{\mathrm{tot}})
-E_i\left(\frac{\partial S_R}{\partial E_R}\right).
$$

由 $\partial S_R/\partial E_R=1/T$，得到

$$
p_i\propto e^{-E_i/(k_BT)}=e^{-\beta E_i},
\qquad
\beta\equiv\frac{1}{k_BT}.
$$

归一化后

$$
\boxed{
p_i=\frac{e^{-\beta E_i}}{Z(\beta,V,N)}
},
$$

$$
\boxed{
Z(\beta,V,N)=\sum_i e^{-\beta E_i}
}.
$$

这条推导依赖三个条件：系统与热库耦合足够弱，使系统能量 $E_i$ 可单独定义；热库足够大，使其温度近似不受交换能量影响；复合系统已达到相应的平衡统计状态。有限热库会保留熵展开的二阶项，从而产生偏离纯指数的修正。

M1 从“给定平均能量时的最大熵推断”得到同一形式；这里则从“系统接触热库”的物理机制得到它。两条路线回答不同问题，但在共同假设下汇合。

## 2. $\ln Z$ 生成的是累积量

直接对 $Z$ 求导：

$$
\frac{\partial\ln Z}{\partial\beta}
=\frac{1}{Z}\sum_i(-E_i)e^{-\beta E_i}
=-\langle E\rangle.
$$

因此内能为

$$
\boxed{
U\equiv\langle E\rangle
=-\frac{\partial\ln Z}{\partial\beta}
}.
$$

再求一次导数：

$$
\frac{\partial^2\ln Z}{\partial\beta^2}
=\langle E^2\rangle-\langle E\rangle^2
=\operatorname{Var}(E).
$$

更一般地，若能级本身不依赖 $\beta$，则

$$
\boxed{
\frac{\partial^n\ln Z}{\partial\beta^n}
=(-1)^n\kappa_n(E)
},
$$

其中 $\kappa_n(E)$ 是能量的第 $n$ 阶累积量。前两阶累积量分别是均值与方差；第三阶等于三阶中心矩，但第四阶起不再等于同阶中心矩。例如

$$
\kappa_4
=\langle(E-\langle E\rangle)^4\rangle
-3\operatorname{Var}(E)^2.
$$

因此，准确的说法是“$\ln Z$ 生成能量累积量”，而不是“所有高阶导数都给中心矩”。

## 3. $F=-k_BT\ln Z$ 把微观概率变成势函数

正则分布的 Gibbs 熵为

$$
S=-k_B\sum_i p_i\ln p_i.
$$

代入 $\ln p_i=-\beta E_i-\ln Z$：

$$
\begin{aligned}
S
&=-k_B\sum_i p_i(-\beta E_i-\ln Z)\\
&=k_B\beta U+k_B\ln Z.
\end{aligned}
$$

利用 $k_B\beta=1/T$，可得

$$
TS=U+k_BT\ln Z.
$$

所以 Helmholtz 自由能满足

$$
\boxed{
F\equiv U-TS=-k_BT\ln Z
}.
$$

$Z$ 是微观态加权求和的入口，$F$ 则是宏观热力学的接口。由

$$
dF=-S\,dT-P\,dV+\mu\,dN
$$

立即得到

$$
S=-\left(\frac{\partial F}{\partial T}\right)_{V,N},
\qquad
P=-\left(\frac{\partial F}{\partial V}\right)_{T,N},
\qquad
\mu=\left(\frac{\partial F}{\partial N}\right)_{T,V}.
$$

在固定 $(T,V,N)$ 且满足 M0 所述交换条件时，自发过程降低 $F$，平衡态使 $F$ 最小。这个极值判据来自系统与热库总熵增加，不能脱离控制条件单独使用。

详细对照见：[[从正则分布到自由能 F=-kT ln Z]]、[[热力学势 Thermodynamic potentials]]。

## 4. 正则与微正则通过 Laplace 变换连接

按能量整理微观态求和，可把配分函数写成

$$
Z(\beta)
=\int dE\,\omega(E)e^{-\beta E}.
$$

利用 $S_B(E)\simeq k_B\ln[\omega(E)\delta E]$，忽略与鞍点无关的常数：

$$
Z(\beta)
\propto
\int dE\,
\exp\left[\frac{S_B(E)}{k_B}-\beta E\right].
$$

对短程、可加的大系统，指数通常在某个能量 $E^*$ 附近尖锐集中。鞍点条件为

$$
\left.\frac{\partial S_B}{\partial E}\right|_{E^*}
=\frac{1}{T},
$$

并给出

$$
F(T)
\simeq
\min_E\left[E-TS_B(E)\right].
$$

这就是 $S(E)$ 与 $F(T)$ 的 Legendre–Fenchel 对偶。只有当熵具有适当凹性、稳定鞍点唯一且热力学极限良好时，它才可简化为普通 Legendre 变换并保证系综等价。

有限系统、长程相互作用或非凹熵区间可能出现多峰能量分布与系综不等价。详见：[[F=-kT ln Z 与 S(E) 的 Legendre 对偶（势函数视角）]]。

## 5. 能量涨落等于热容响应

正则系综中能量会涨落。由 $U=-\partial_\beta\ln Z$，且

$$
\frac{d\beta}{dT}=-\frac{1}{k_BT^2},
$$

得到

$$
C_V
=\left(\frac{\partial U}{\partial T}\right)_{V,N}
=\frac{
\operatorname{Var}(E)
}{k_BT^2}.
$$

因此

$$
\boxed{
\operatorname{Var}(E)=k_BT^2C_V
}.
$$

这条公式说明，自发能量涨落与系统对温度的响应是同一个正则分布的二阶结构。它假定 Hamiltonian 不显含温度；若粗粒化有效能量本身依赖 $T$，求导时必须加入额外项。

对普通可加系统且远离临界点，相对能量涨落通常按 $N^{-1/2}$ 缩小；临界点附近的长程相关会改变这一简单标度。

### Interactive：两能级系统

调节温度与激发态简并度 $g_1$，观察同一个 $Z$ 如何生成 $U$、$\operatorname{Var}(E)$ 与 $C_V$，以及 Schottky 热容峰怎样出现。

<InteractiveConcept type="two-level-schottky" />

完整推导见：[[两能级系统的配分函数与 Schottky anomaly（热容单峰）]]。

## 6. 谨慎迁移到离散选择模型

设个体面对成本为 $C_i$ 的离散选项，若采用 Gibbs/softmax 形式

$$
p_i=\frac{e^{-\beta C_i}}{Z},
\qquad
Z=\sum_i e^{-\beta C_i},
$$

则 $\beta$ 表示**成本敏感度**。它与物理逆温度具有相同数学位置，但除非模型明确建立热浴机制，否则不应把它称为城市系统的真实温度。

定义 soft minimum

$$
F_C(\beta)=-\frac{1}{\beta}\ln\sum_i e^{-\beta C_i}.
$$

在高敏感度极限，

$$
\lim_{\beta\to\infty}F_C(\beta)=\min_i C_i.
$$

低敏感度时，未经归一化的 $F_C$ 含有 $-(\ln n)/\beta$ 的选项数项，因此不能直接说它趋于平均成本。若改用归一化形式

$$
\widetilde F_C(\beta)
=-\frac{1}{\beta}
\ln\left(\frac{1}{n}\sum_i e^{-\beta C_i}\right),
$$

则 $\beta\to0$ 时 $\widetilde F_C\to n^{-1}\sum_i C_i$。

在标准独立同分布 Gumbel 随机效用模型中，相应 logsum 才能进一步解释为期望最大效用与福利指标；这一解释依赖误差分布、尺度和选项集合。数学同构本身不提供行为机制。详见：[[Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能]]。

### Interactive：Logit 与配分函数

调节成本敏感度 $\beta$，观察概率如何从近似均匀逐渐集中到最低成本选项，并比较原始 logsum 与 soft minimum。

<InteractiveConcept type="logit-partition" />

## 核心答案：$Z$ 把热库、涨落与自由能连在一起

热库的态数决定 Boltzmann 权重，归一化这些权重得到 $Z$。$\ln Z$ 生成能量累积量，$F=-k_BT\ln Z$ 则把同一微观信息翻译成热力学势。正则系综与微正则系综的等价需要热力学极限、凹性和稳定鞍点；配分函数方法强大，但并非无条件成立。

## 自检与练习

1. 从“系统 + 热库”的微正则设定推导 $p_i\propto e^{-\beta E_i}$，并指出一阶熵展开需要的条件。
2. 证明 $\partial_\beta^n\ln Z=(-1)^n\kappa_n(E)$，并说明第四阶累积量为何不是第四中心矩。
3. 从 Gibbs 熵推导 $F=-k_BT\ln Z$。
4. 由 $U=-\partial_\beta\ln Z$ 推导 $\operatorname{Var}(E)=k_BT^2C_V$，并说明 Hamiltonian 显含 $T$ 时哪里会改变。
5. 为什么离散选择中的 $\beta$ 是成本敏感度，而不自动是物理温度？

### 参考与学习资源

- Gibbs 1902，*Elementary Principles in Statistical Mechanics*：导读见 [Seminal papers](/references/seminal_papers)（`SP-M3-Gibbs1902`）。
- [ ] **Reading Guide**：[[Swendsen_Ch19_Canonical]]。
- [ ] **Written**：`exercises/written/M3_lnZ_derivatives.md`。
- [ ] **Notebook**：`exercises/notebooks/E03_canonical_analytic.ipynb`。

### 验收标准

- [ ] 给定能级谱后能写出 $Z$，并用 $\ln Z$ 的导数求均值、方差与高阶累积量。
- [ ] 能解释 $Z$ 与 $F$ 分别承担的微观和宏观角色。
- [ ] 能陈述正则分布、涨落—响应关系与系综等价各自的适用边界。
