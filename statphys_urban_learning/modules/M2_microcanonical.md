# M2 微正则系综：硬约束怎样产生宏观确定性

一个孤立气体的微观位置和动量不断变化，但能量、压强等宏观量在大多数时间里极其稳定。微正则系综把这种现象转化为一个测度问题：固定总能量、体积和粒子数后，概率怎样分布在可及微观态上？

微正则系综提供最简单的基线：在给定能量壳上采用均匀测度。它先把“可及态”定义清楚，再由态数的对数得到熵、温度和典型性。

## 1. 微正则分布位于能量壳上

考虑经典 Hamiltonian 系统 $H(\Gamma)$，其中 $\Gamma=(\mathbf q,\mathbf p)$ 表示相空间点。固定 $(E,V,N)$ 时，真实测量总有有限能量分辨率 $\delta E$，因此微正则集合是

$$
\mathcal A_{E,\delta E}
=\{\Gamma:E\le H(\Gamma)<E+\delta E\}.
$$

微正则假设是在这个集合上采用均匀测度：同一能量壳内，等体积的相空间区域具有相同概率。对于离散能级，这等价于给能量窗口中的每个微观态相同概率。

## 2. 三个容易混淆的“态数”必须分开

连续相空间中，“能量恰好等于 $E$ 的点数”没有直接意义。常用的三个对象是：

### 累积相空间体积

$$
\Phi(E,V,N)
=\frac{1}{N!h^{3N}}
\int d\Gamma\,\Theta\!\left(E-H(\Gamma)\right).
$$

$\Phi(E)$ 统计能量不超过 $E$ 的相空间体积；$N!$ 处理相同粒子的不可分辨性，$h^{3N}$ 使体积无量纲。

### 态密度

$$
\omega(E,V,N)
=\frac{\partial\Phi}{\partial E}
=\frac{1}{N!h^{3N}}
\int d\Gamma\,\delta\!\left(E-H(\Gamma)\right).
$$

$\omega(E)$ 是每单位能量的态数密度，带有能量倒数的量纲。

### 有限能量壳中的态数

当 $\delta E$ 足够窄时，能量壳的无量纲态数为

$$
\Omega_{\delta E}(E)
\simeq \omega(E)\,\delta E.
$$

因此，$\Phi(E)$、$\omega(E)$ 与 $\Omega_{\delta E}(E)$ 不是同一个量，不能统一记成一个 $\Omega$ 后交替使用。

## 3. 本章采用能量壳熵

微正则分布定义在能量壳上，因此本章采用 Boltzmann 壳熵

$$
\boxed{
S_B(E,V,N)=k_B\ln\Omega_{\delta E}(E,V,N)
\simeq k_B\ln[\omega(E,V,N)\delta E]
}.
$$

另一个常见约定是累积体积熵

$$
S_{\Phi}(E,V,N)=k_B\ln\Phi(E,V,N).
$$

对普通的短程、可加大系统，两种定义通常只相差次广延项，给出相同的热力学极限；在有限系统或有界能谱中，它们可能给出不同结论。本课程讨论能量壳、态密度和负温度时始终使用 $S_B$，不在同一推导中切换到 $S_{\Phi}$。

## 4. 宏观确定性来自测度集中，而非自动遍历

设强度型宏观量为 $m$，其对应态数在大系统中具有

$$
\Omega(m)\asymp \exp\left[\frac{N s(m)}{k_B}\right].
$$

若 $s(m)$ 在稳定点 $m^*$ 附近有唯一光滑最大值，则

$$
s(m)
\simeq s(m^*)-\frac{a}{2}(m-m^*)^2,
\qquad a>0.
$$

因此

$$
P(m)\propto
\exp\left[-\frac{Na}{2k_B}(m-m^*)^2\right],
$$

分布宽度按 $N^{-1/2}$ 缩小。对由弱相关局域变量组成的广延量 $M=Nm$，这对应

$$
\frac{\sqrt{\operatorname{Var}(M)}}{\langle M\rangle}
\sim N^{-1/2}.
$$

这个标度通常要求可加性、有限相关长度、远离临界点且稳定最大值唯一。在临界点、相共存、长程相互作用或玻璃态约束下，分布可以更宽、多峰或长时间不混合。

典型性说明“在系综测度下，绝大多数微观态给出相近宏观值”。各态历经性则比较长时间平均与系综平均，属于动力学命题；前者不能自动证明后者。

微正则测度是否适合具体系统，仍取决于制备方式、守恒量和考察时间尺度。相关讨论见：[[热力学极限 Thermodynamic limit]]、[[微正则系综 Microcanonical ensemble]]。

## 5. 温度为什么是熵对能量的斜率

在本章的壳熵约定下，强度量由熵的偏导定义：

$$
\frac{1}{T}
=\left(\frac{\partial S_B}{\partial E}\right)_{V,N},
\qquad
\frac{P}{T}
=\left(\frac{\partial S_B}{\partial V}\right)_{E,N},
\qquad
-\frac{\mu}{T}
=\left(\frac{\partial S_B}{\partial N}\right)_{E,V}.
$$

这些式子不是给宏观量贴标签。它们的物理意义来自接触平衡：允许两个系统交换某个广延量时，相应强度量最终相等。

让两个弱耦合系统 $A$、$B$ 只交换能量，总能量 $E_{\mathrm{tot}}$ 固定。系统 $A$ 获得能量 $E_A$ 的概率正比于两侧能量壳态数的乘积：

$$
P(E_A)
\propto
\omega_A(E_A)\,
\omega_B(E_{\mathrm{tot}}-E_A).
$$

取对数后，最概然能量分配最大化总熵

$$
S_{\mathrm{tot}}(E_A)
=S_A(E_A)+S_B(E_{\mathrm{tot}}-E_A).
$$

极值条件为

$$
\frac{dS_{\mathrm{tot}}}{dE_A}
=\left(\frac{\partial S_A}{\partial E_A}\right)
-\left(\frac{\partial S_B}{\partial E_B}\right)=0.
$$

定义 $1/T=\partial S/\partial E$ 后，平衡条件就是 $T_A=T_B$。允许交换体积或粒子时，同样的总熵极大化分别给出 $P_A=P_B$ 与 $\mu_A=\mu_B$。**温度、压强和化学势之所以是平衡控制量，是因为它们在接触平衡时相等。**

更一般的推导见：[[T,P,μ 作为熵的偏导定义]]。

## 6. 理想气体：先算体积，再回到能量壳

对经典理想气体

$$
H=\sum_{i=1}^{N}\frac{\mathbf p_i^2}{2m},
$$

位置积分给出 $V^N$；动量约束 $H\le E$ 在 $3N$ 维动量空间中是半径 $\sqrt{2mE}$ 的球。因此

$$
\Phi(E,V,N)\propto V^N E^{3N/2}.
$$

对 $E$ 求导得到态密度

$$
\omega(E,V,N)
=\frac{\partial\Phi}{\partial E}
\propto V^N E^{3N/2-1}.
$$

采用本章固定的壳熵约定，忽略与 $E,V$ 无关的项：

$$
S_B
=k_B\left[N\ln V+\left(\frac{3N}{2}-1\right)\ln E+\text{const}\right].
$$

于是

$$
\frac{1}{T}
=k_B\left(\frac{3N}{2}-1\right)\frac{1}{E},
$$

$$
\frac{P}{T}=k_B\frac{N}{V}.
$$

第二式给出

$$
PV=Nk_BT.
$$

第一式在有限 $N$ 下含有壳熵约定带来的 $-1$ 修正；热力学极限中

$$
E\simeq\frac{3}{2}Nk_BT.
$$

若采用 $S_{\Phi}=k_B\ln\Phi$，有限 $N$ 时便直接得到 $E=3Nk_BT/2$。两种约定在 $N\to\infty$ 时一致，但有限尺寸公式不能混写。完整推导见：[[理想气体的微正则态数（相空间体积 Ω）]]。

## 7. 负温度只可能出现在受限能谱中

在壳熵约定下，若高能端的态密度随能量增加而下降，则

$$
\frac{\partial S_B}{\partial E}<0,
$$

相应地 $T<0$。这种情形要求可访问能量有上界，例如具有有限局域态空间的反转自旋系统。负温度不是“低于绝对零度”；与任意正温系统接触时，负温系统会向正温系统放出能量，因此在热交换意义上比正温系统更热。

这一结论依赖本章声明的壳熵约定。若采用单调不减的累积体积熵 $S_{\Phi}$，则不会得到负斜率。有限、有界系统中的熵定义存在持续讨论，因此具体实验必须同时说明制备、温标和熵约定。详见：[[负温度 Negative temperature]]。

## 8. 城市例子：固定总人口下的零结构基线

把 $N$ 名可区分居民分配到两个区域，固定总人口 $N$。若除区域基准权重 $q$ 外没有其他信息，每个人的分配独立，则区域 $A$ 的人数 $n$ 服从

$$
P(n)=\binom{N}{n}q^n(1-q)^{N-n}.
$$

其中 $q=1/2$ 对应两个区域完全对称、所有居民分配等概率的微正则式基线；$q\ne1/2$ 则已经加入了一个非均匀参考权重。其均值与方差为

$$
\langle n\rangle=Nq,
\qquad
\operatorname{Var}(n)=Nq(1-q).
$$

因此人口份额 $n/N$ 的标准差按 $N^{-1/2}$ 缩小。这个模型给出的是**给定总人口与参考权重时的组合学零模型**；它没有说明居民如何迁移，也没有证明真实城市会自然演化到该分布。就业、住房、网络依赖和政策约束一旦进入，微观态权重与动力学都要重新定义。

## 9. 微正则与正则何时等价

把能量硬约束替换为热库给定的温度，就得到正则描述。对短程、可加系统，若熵密度适当凹且热力学极限存在，正则分布通常集中在与微正则相同的能量密度上，两种系综给出一致的宏观预测。

有限系统、长程相互作用、非凹熵区间和相共存附近可能出现系综不等价。因而“换系综只是计算方便”是一条有条件的结论，而不是恒等式。

## 核心答案：宏观确定性来自测度集中

微正则系综把概率限制在固定能量壳上。区分 $\Phi(E)$、$\omega(E)$ 与 $\Omega_{\delta E}(E)$ 后，熵约定、温度定义和负温度的边界才不会互相冲突。宏观稳定性来自大系统测度在少数典型宏观态附近集中，但这种静态集中既不保证各态历经，也会在强相关和非可加条件下失效。

## 自检与练习

1. 分别说明 $\Phi(E)$、$\omega(E)$ 和 $\Omega_{\delta E}(E)$ 的定义、量纲与关系。
2. 从两个弱耦合系统的总熵极大化推导 $T_A=T_B$。
3. 为什么壳熵与体积熵对有限理想气体给出不同的 $E(T)$ 修正，却在热力学极限一致？
4. $N^{-1/2}$ 相对涨落标度依赖哪些条件？在哪些情形下不应直接使用？
5. 为什么两区人口的二项分布只是零模型，而不是城市迁移动力学？

### 参考与学习资源

- Khinchin 1949，*Mathematical Foundations*：导读见 [Seminal papers](/references/seminal_papers)（`SP-M2-Khinchin1949`）。
- Ramsey 1956，*Negative Absolute Temperature*：导读见 [Seminal papers](/references/seminal_papers)（`SP-M2-Ramsey1956-NegativeTemperature`）。
- [ ] **Written**：`exercises/written/M2_microcanonical_basics.md`。
- [ ] **Concept**：[[微正则系综 Microcanonical ensemble]]、[[多重度 multiplicity Ω]]、[[熵 Entropy]]。

### 验收标准

- [ ] 能写出能量壳微正则测度，并保持态数符号与熵约定一致。
- [ ] 能从相空间计数推导理想气体的 $PV=Nk_BT$。
- [ ] 能区分典型性、各态历经性与系综等价三种不同命题。
