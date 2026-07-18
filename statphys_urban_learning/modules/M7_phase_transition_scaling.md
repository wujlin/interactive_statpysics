# M7 相变与标度：有限系统里没有真正发散，怎样识别临界点？

二维 Ising 模拟只包含有限个格点。无论把温度网格扫得多细，配分函数都不会真正非解析，易感性也只会出现有限而圆滑的峰。可是随着线性尺寸 $L$ 增大，峰会长高并向特定温度移动，磁化分布也会以系统性的方式改变。有限系统没有真正的奇点，却保留了临界点怎样被系统尺寸截断的痕迹。

读出这些痕迹需要先固定三个量。对 $N=L^d$ 个 Ising 自旋 $s_i=\pm1$，定义

$$
M:=\sum_{i=1}^{N}s_i,
\qquad
m:=\frac{M}{N}.
$$

$M$ 是总磁化，$m$ 是每自旋磁化。本章始终把每自旋易感性定义为

$$
\boxed{
\chi:=\frac{\partial\langle m\rangle}{\partial h}
=\frac{\beta}{N}\operatorname{Var}(M)
=\beta N\operatorname{Var}(m)
}.
$$

最后一个等号尤其重要：若模拟保存的是每自旋磁化序列 $m(t)$，计算 $\chi$ 时必须乘以 $N$。

---

## 1. 相关长度怎样从两点关联中出现？

定义局部偏差

$$
\delta s_i:=s_i-\langle s_i\rangle
$$

以及连通两点关联函数

$$
C(\mathbf r)
:=\left\langle\delta s_{\mathbf 0}\,\delta s_{\mathbf r}\right\rangle
=\langle s_{\mathbf 0}s_{\mathbf r}\rangle
-\langle s_{\mathbf 0}\rangle\langle s_{\mathbf r}\rangle.
$$

这里假定系统平移不变；在各向同性情形下可进一步写成 $C(r)$。连通关联排除了平均有序本身，只保留两个位置是否协同偏离各自均值。在低温有序相，这一定义应在选定纯相内理解，例如先取热力学极限，再令选择方向的微小外场趋于零；有限零场的对称混合分布需要另行处理。

在连续相变附近，关联函数具有标度形式

$$
\boxed{
C(r;t)
\sim
\frac{1}{r^{d-2+\eta}}
f_\pm\left(\frac{r}{\xi}\right)
},
$$

其中

$$
t:=\frac{T-T_c}{T_c},
\qquad
\xi(t)\sim\xi_{0,\pm}|t|^{-\nu}.
$$

$f_+$ 与 $f_-$ 分别对应临界点两侧；当 $r\gg\xi$ 时，它们使关联快速衰减。$\xi_{0,\pm}$ 是依赖微观单位的非普适振幅，$\nu$ 和 $\eta$ 是临界指数。

在 $T=T_c$ 时，$\xi$ 发散，有限的指数截断消失：

$$
C(r;0)\sim r^{-(d-2+\eta)}.
$$

这并不表示任意两点都保持同样强的相关，更不表示整个系统成为刚性的一块。临界关联仍随距离趋于零，只是由指数衰减变成更慢的代数衰减，因此没有单一的有限特征长度。

<InteractiveConcept type="cluster-chain-reaction" />

交互图中跨尺度团簇增多，是相关长度增长的可见结果；一次局部翻转造成多大团簇还取决于更新动力学，不能把动画本身当作静态关联函数的定义。

---

## 2. 为什么易感性由 $\xi^{2-\eta}$ 控制？

从总磁化开始：

$$
\operatorname{Var}(M)
=\left\langle
\left(\sum_i\delta s_i\right)
\left(\sum_j\delta s_j\right)
\right\rangle
=\sum_{i,j}
\langle\delta s_i\delta s_j\rangle.
$$

平移不变性使每个起点 $i$ 都给出相同的位移求和，因此

$$
\operatorname{Var}(M)
=N\sum_{\mathbf r}C(\mathbf r).
$$

代入本章的易感性定义：

$$
\boxed{
\chi
=\beta\sum_{\mathbf r}C(\mathbf r)
\approx
\beta\int d^dr\,C(r)
}.
$$

把临界标度形式代入，并暂时忽略晶格尺度下限与非奇异背景：

$$
\begin{aligned}
\chi_{\mathrm{sing}}
&\sim
\int_0^\infty
r^{d-1}
r^{-(d-2+\eta)}
f_\pm(r/\xi)\,dr\\
&\sim
\int_0^{O(\xi)}r^{1-\eta}\,dr\\
&\sim\xi^{2-\eta}.
\end{aligned}
$$

因此

$$
\boxed{
\chi_{\mathrm{sing}}\sim\xi^{2-\eta}
\sim|t|^{-\nu(2-\eta)}
}.
$$

与 $\chi\sim|t|^{-\gamma}$ 比较，得到 Fisher 标度关系

$$
\boxed{
\gamma=\nu(2-\eta)
}.
$$

维度 $d$ 已经通过关联函数前因子抵消，不能把结果写成 $\chi\sim\xi^d$。只有在把相关体积内部的 $C(r)$ 粗略当作常数时才会得到 $\xi^d$；临界点恰恰不能忽略 $C(r)$ 的反常幂律。

这条推导回答了易感性峰为何随系统变大而增强：$\chi$ 汇总了所有点对的连通关联，相关长度越大，积分中能够共同贡献的尺度范围越宽。

---

## 3. 相关长度发散与有序不是同一句话

无限系统中，零场自发磁化定义为

$$
m_{\mathrm{sp}}
=\lim_{h\to0^+}\lim_{N\to\infty}\langle m\rangle_{N,h}.
$$

对 $T<T_c$，

$$
m_{\mathrm{sp}}\sim(-t)^{\beta_{\mathrm{mag}}},
$$

其中 $\beta_{\mathrm{mag}}$ 是磁化临界指数；下标用于避免与逆温度 $\beta=1/(k_BT)$ 混淆。对 $T\ge T_c$，$m_{\mathrm{sp}}=0$。

相关长度从临界点两侧增长，并只在 $T_c$ 发散。恰在连续相变点，$\xi=\infty$ 而 $m_{\mathrm{sp}}=0$。进入低温有序相后，$m_{\mathrm{sp}}\neq0$，但在选定纯相内定义的**连通**相关长度可以重新变为有限值。

因此，不能从“$\xi$ 很大”直接推出“$m\neq0$”，也不能把临界点写成所有自旋已经选定同一方向。

有限零场系统还多一层区别。对称性保证

$$
P_L(m)=P_L(-m),
\qquad
\langle m\rangle_L=0.
$$

低温时 $P_L(m)$ 可以在 $\pm m_0$ 附近形成双峰，$\langle|m|\rangle$ 因而非零。长轨迹在两峰之间翻转，仍会使 $\langle m\rangle$ 归零。

在这种对称混合分布中，用 $\beta N\operatorname{Var}(m)$ 得到的是真正的有限系统零场响应，但它也包含两相之间的权重转移。若目标是估计单个纯相内部的涨落，常改用

$$
\chi_{\mathrm{phase}}
\approx
\beta N\left(
\langle m^2\rangle-\langle|m|\rangle^2
\right),
$$

并明确这与有限系统严格的零场导数不是同一个量。临界标度分析必须从头到尾保持同一约定。

---

## 4. 系统尺寸怎样截断临界发散？

有限盒子的线性尺寸为 $L$，相关长度无法在数据中表现得远大于 $L$。当无限系统的 $\xi(t)$ 增长到 $O(L)$ 时，系统不再分辨“继续靠近临界点”与“盒子已经不够大”。因此：

- 易感性发散被截成有限峰；
- 峰值位置 $T_{\mathrm{peak}}(L)$ 偏离 $T_c$；
- 磁化分布与无量纲累积量随 $L$ 系统性变化。

在临界点，把上一节中的积分上限从 $\xi$ 换成 $L$，立即得到

$$
\chi(T_c,L)\sim L^{2-\eta}=L^{\gamma/\nu}.
$$

这正是无限系统发散在有限尺寸中的投影。

### 4.1 Binder 累积量提供一个无量纲定位量

定义

$$
U_L
:=
1-\frac{\langle m^4\rangle}
{3\langle m^2\rangle^2}.
$$

高温下，若 $m$ 近似零均值高斯分布，则 $U_L\to0$；低温下，若分布集中在窄的 $\pm m_0$ 双峰，则 $U_L\to2/3$。因为 $U_L$ 无量纲，不同 $L$ 的曲线在临界附近趋向共同的标度值。

真实有限数据中的交点通常不会精确重合。无关标度场、边界条件、长宽比和采样误差都会造成交点漂移。Binder 交点因此是对 $T_c$ 的有限尺寸估计，不是无需外推的精确答案。

---

## 5. 有限尺寸标度怎样从有限峰恢复临界指数？

若 $\xi$ 是临界区唯一发散的长度，奇异部分只能依赖 $L/\xi$。对易感性，常用的领先标度形式为

$$
\chi(t,L)
=A_\chi L^{\gamma/\nu}
\mathcal F_\chi
\left(a_t\,tL^{1/\nu}\right),
$$

其中 $a_t$ 和 $A_\chi$ 是非普适度量因子。更接近实际拟合的形式还要包含领先修正：

$$
\boxed{
\chi(t,L)
=A_\chi L^{\gamma/\nu}
\left[
\mathcal F_\chi(x)
+L^{-\omega}\mathcal G_\chi(x)
+\cdots
\right],
\qquad
x=a_t\,tL^{1/\nu}
}.
$$

$\omega>0$ 描述最领先的无关标度场。忽略修正只在系统足够大、临界窗口足够窄且统计误差允许时合理。

这个公式给出两项直接预测：

$$
\chi_{\max}(L)\sim L^{\gamma/\nu}
\left(1+cL^{-\omega}+\cdots\right),
$$

$$
|T_{\mathrm{peak}}(L)-T_c|
\sim L^{-1/\nu}
$$

，其中振幅和更高阶修正依赖模型与观测定义。

### 5.1 数据折叠是模型检验，不是视觉证明

若暂时忽略修正项，用候选参数重画坐标

$$
x=tL^{1/\nu},
\qquad
y=\chi L^{-\gamma/\nu},
$$

不同 $L$ 的数据应落在同一标度函数附近。

<InteractiveConcept type="finite-size-scaling" />

可靠的数据折叠至少要同时处理四件事：

1. 用 Binder 交点、峰值漂移或联合拟合约束 $T_c$；
2. 报告 $\nu$、$\gamma/\nu$ 与 $T_c$ 的不确定性和相关性；
3. 改变最小尺寸 $L_{\min}$ 与拟合窗口，检查结果是否稳定；
4. 比较含与不含 $L^{-\omega}$ 修正的模型，并检查残差是否呈系统结构。

仅凭“曲线看起来靠拢”不能证明指数唯一，更不能单独证明两个系统属于同一普适类。可调参数过多、温度窗口过窄或误差条过大时，错误指数也可能产生貌似良好的折叠。

不同微观系统即使属于同一普适类，原始曲线也不必落在数值完全相同的主曲线上。对称性、维度、边界条件和几何相同后，仍需允许横纵轴的非普适度量因子；修正标度也会影响小尺寸数据。普适的是临界指数和适当归一化后的标度结构，不是未经校准的每个振幅。

---

## 6. 城市数据中的“临界信号”必须排除什么？

相关长度和有限尺寸标度可以转化为城市系统中的可检验问题：局部交通状态、价格偏差或行为选择之间的连通相关是否随控制参数扩大？不同空间窗口的峰值和分布能否满足一致的尺度关系？

但相关增强不是临界性的专属证据。至少还要排除：

- **共同驱动**：天气、政策或宏观周期同时影响多个区域；
- **空间异质性**：土地利用和基础设施造成稳定背景梯度；
- **非平稳性**：趋势、制度切换和季节变化让样本不来自同一分布；
- **网络长程边**：物理距离并非真正控制相互作用范围；
- **观测聚合**：改变网格大小本身就可能制造或抹去关联。

因此，方差增大、恢复变慢或相关范围增长只能构成早期预警的候选信号，不能保证系统正在接近某个连续相变。去趋势也不是充分修正：共同驱动可能是非线性的、滞后的或未观测的。更稳妥的做法是先写出零假设和外部驱动模型，再检验连接关联、尺寸漂移、标度窗口与替代机制能否被同一组参数同时解释。

城市映射的价值不在于把“全城拥堵”直接称作 Ising 临界点，而在于把模糊的阈值叙述转化为一组可证伪问题：**相关怎样随距离衰减？峰值怎样随观察尺寸移动？候选指数对尺度窗口是否稳定？**

---

## 7. 核心答案：有限尺寸保留了临界发散的标度痕迹

有限系统中的临界性不是靠寻找一个真正的发散来识别，而是靠检查发散被 $L$ 截断后留下的系统性标度。连通关联

$$
C(r;t)\sim r^{-(d-2+\eta)}f_\pm(r/\xi)
$$

通过空间积分给出

$$
\chi\sim\xi^{2-\eta},
$$

再通过 $\xi\sim|t|^{-\nu}$ 导出 $\gamma=\nu(2-\eta)$ 与 $\chi(T_c,L)\sim L^{\gamma/\nu}$。相关长度在临界点发散并不等于非零磁化，有限系统的双峰也不等于严格自发对称性破缺。

数据折叠只有在度量因子、修正标度和不确定性都被检查后，才是支持临界标度的证据。

---

## 学习与验收

### 推荐学习顺序

1. 先完成第 1–4 节，手推 $\chi=\beta\sum_{\mathbf r}C(\mathbf r)$ 与 $\chi\sim\xi^{2-\eta}$。
2. 再运行网页 [/exercises/notebooks/E07_ising_critical_signals](/exercises/notebooks/E07_ising_critical_signals) 或本地 `exercises/notebooks/E07_ising_critical_signals.ipynb`。
3. 最后用第 5 节的检查项审计自己的数据折叠，而不只判断图像是否“好看”。

### 必读与练习

- [ ] **概念**：[[相关长度 Correlation length]]
- [ ] **概念**：[[相变 Phase transition]]
- [ ] **方法**：[[定位临界点 峰值或 Binder cumulant]]
- [ ] **Reading Guide**：[[Swendsen_Ch27_RG]]
- [ ] **Context**：[[Wilson：重整化群与临界普适性（为什么平均场会错）]]
- [ ] **Written**：`exercises/written/M7_phase_transition.md`
- [ ] **Notebook**：[/exercises/notebooks/E07_ising_critical_signals](/exercises/notebooks/E07_ising_critical_signals)

### 自检问题

1. 为什么每自旋易感性既等于 $(\beta/N)\operatorname{Var}(M)$，又等于 $\beta N\operatorname{Var}(m)$？
2. 从 $C(r)\sim r^{-(d-2+\eta)}f(r/\xi)$ 积分时，为什么得到 $\xi^{2-\eta}$ 而不是 $\xi^d$？
3. 为什么在 $T_c$ 可以同时有 $\xi=\infty$ 与 $m_{\mathrm{sp}}=0$？
4. 有限系统中的 $\langle m\rangle$、$\langle|m|\rangle$、Binder 累积量和 $\chi$ 分别回答什么问题？
5. 一次看似成功的数据折叠还需要哪些稳健性检查？

### 验收标准

- [ ] 全程一致使用 $s_i$、$M$、$m$ 和 $\chi=(\beta/N)\operatorname{Var}(M)$。
- [ ] 能从连通关联函数推导 $\chi\sim\xi^{2-\eta}$。
- [ ] 能区分相关长度发散、有限系统双峰与热力学极限中的自发对称性破缺。
- [ ] 能把数据折叠表述为带不确定性和修正项的标度检验，而不是普适性的单独证明。

### 参考文献

- 本模块原始文献导读见 [Seminal papers](/references/seminal_papers)（条目：SP-M7-Onsager1944、SP-M7-Wilson1975）。
