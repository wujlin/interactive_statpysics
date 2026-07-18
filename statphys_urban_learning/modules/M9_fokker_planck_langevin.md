# M9 连续随机动力学：一条轨迹与一团概率

把一枚胶体球放进水中，再用光阱把它束缚在位置 $\mu$ 附近。摄像机记录的是一条不断抖动的轨迹 $X_t$：某一时刻粒子向左，下一时刻又可能向右。重复许多次实验后，我们得到的却不再是一条线，而是一团随时间变化的概率密度 $p(x,t)$。

轨迹告诉我们“这一次实验怎样运动”，概率密度告诉我们“许多次相同实验会怎样分布”。本章要建立的是二者之间的精确对应，而不是在两种描述中任选一种。

答案由一条连续主线构成：Langevin 方程规定轨迹的短时增量，Itô 生成元把轨迹平均转化为 Fokker–Planck 方程，概率流再把密度演化写成守恒律；Ornstein–Uhlenbeck（OU）过程让两种语言在解析结果与数值实验中闭合。

这个对应关系本身不要求热平衡。本章先把 $D$ 作为一般噪声强度；只有加入平衡热浴后，Einstein 关系才把它与温度和摩擦联系起来。

---

## 1. Langevin 方程：摄像机看到的一条轨迹

### 1.1 一般加性噪声先于热力学解释

在一维、加性噪声下，Itô 随机微分方程写成

$$
dX_t=a(X_t,t)dt+\sqrt{2D}\,dW_t.
$$

$a(x,t)$ 是漂移速度，$D$ 是扩散系数，$W_t$ 是标准布朗运动。条件增量的一阶矩和二阶中心矩分别为

$$
\mathbb E[dX_t\mid X_t=x]=a(x,t)dt,
\qquad
\operatorname{Var}(dX_t\mid X_t=x)=2Ddt.
$$

因此，$a$ 回答“平均往哪里走”，$D$ 回答“短时间内摊开得多快”。这一步只定义随机过程，还没有把 $D$ 解释为温度或把噪声来源限定为热浴。

### 1.2 光阱给出最小的线性回复模型

在过阻尼极限下，光阱中的胶体粒子受到回复力 $-\kappa(X_t-\mu)$。若黏滞摩擦系数为 $\gamma$，确定性漂移为

$$
a(x)=\frac{\kappa}{\gamma}(\mu-x).
$$

记 $\theta=\kappa/\gamma$，轨迹方程成为 Ornstein–Uhlenbeck（OU）过程

$$
dX_t=\theta(\mu-X_t)dt+\sqrt{2D}\,dW_t.
$$

$\theta$ 决定回复速度，$D$ 决定短时涨落。此处 $D$ 仍是一般扩散系数；只有在第 5 节确认噪声来自温度为 $T$ 的平衡热浴后，才施加 $D=k_BT/\gamma$。

---

## 2. 概率密度：许多条轨迹怎样形成一团概率？

把相同初始条件下的实验重复许多次，定义概率密度

$$
p(x,t)dx=\Pr\!\left(X_t\in[x,x+dx]\right).
$$

轨迹与分布通过平均联系起来。对任意足够光滑的观测函数 $f$，

$$
\mathbb E[f(X_t)]=\int f(x)p(x,t)dx.
$$

左边是对许多条轨迹取平均，右边是对同一时刻的概率密度积分。两者不是近似关系，而是同一个统计平均的两种写法。要得到 $p$ 的演化方程，只需计算这个平均怎样随时间变化。

---

## 3. 从 Itô 生成元到 Fokker–Planck 方程

对第 1 节的随机微分方程应用 Itô 公式：

$$
df(X_t)
=\left[a(X_t,t)f'(X_t)+Df''(X_t)\right]dt
+\sqrt{2D}\,f'(X_t)dW_t.
$$

随机积分的期望为零，因此

$$
\frac{d}{dt}\mathbb E[f(X_t)]
=\mathbb E\!\left[a(X_t,t)f'(X_t)+Df''(X_t)\right].
$$

算子 $\mathcal Lf=af'+Df''$ 称为这个 Itô 过程的生成元。用概率密度表示期望，并在边界项消失的条件下分部积分，得到弱形式

$$
\begin{aligned}
\int f\,\partial_t p\,dx
&=\int\left(af'+Df''\right)p\,dx\\
&=\int f\left[-\partial_x(ap)+D\partial_x^2p\right]dx.
\end{aligned}
$$

因为这对任意测试函数 $f$ 都成立，概率密度必须满足

$$
\boxed{
\partial_t p(x,t)
=-\partial_x\!\left[a(x,t)p(x,t)\right]
+D\,\partial_x^2p(x,t)
}.
$$

这就是 Fokker–Planck 方程，也就是生成元 $\mathcal L$ 的伴随算子 $\mathcal L^\dagger$ 对密度的作用。推导说明了为什么 Langevin 方程与 Fokker–Planck 方程必须共享同一个漂移 $a$ 和扩散系数 $D$：前者规定轨迹的局部增量，后者是这些增量对全部轨迹分布的统计后果。

把右边写成守恒形式，定义概率流

$$
J(x,t)=a(x,t)p(x,t)-D\,\partial_xp(x,t),
$$

便有

$$
\boxed{\partial_t p=-\partial_xJ}.
$$

第一项是漂移携带的概率，第二项是由高密度区指向低密度区的扩散流。对整个状态空间积分得到 $d\int p\,dx/dt=-J|_{\text{边界}}$；反射边界或无穷远零流保证概率归一化不变。

对光阱 OU 过程，$a(x)=\theta(\mu-x)$，因此

$$
\partial_t p
=\theta\,\partial_x\!\left[(x-\mu)p\right]
+D\,\partial_x^2p,
$$

对应的概率流是

$$
J(x,t)=\theta(\mu-x)p(x,t)-D\,\partial_xp(x,t).
$$

同一组参数 $\theta$、$\mu$ 与 $D$ 同时控制单条轨迹和整团概率，因此两种描述必须给出相同的均值、方差与弛豫时间。

---

## 4. OU 解析闭环：轨迹统计与概率密度给出同一答案

### 4.1 均值：概率云的中心怎样移动？

记 $m_t=\mathbb E[X_t]$。对 OU 方程取期望，噪声增量的条件期望为零，因此

$$
\frac{dm_t}{dt}=\theta(\mu-m_t).
$$

若初始均值为 $m_0$，则

$$
m_t=\mu+(m_0-\mu)e^{-\theta t}.
$$

概率云的中心以速率 $\theta$ 向光阱中心 $\mu$ 靠近。弛豫时间

$$
\tau_{\mathrm{relax}}=\frac{1}{\theta}=\frac{\gamma}{\kappa}
$$

给出了初始偏差被遗忘的时间尺度。

### 4.2 方差：回复趋势与噪声怎样形成有限宽度？

令 $Z_t=X_t-m_t$，则

$$
dZ_t=-\theta Z_tdt+\sqrt{2D}\,dW_t.
$$

Itô 公式保留 $(dW_t)^2=dt$ 带来的二阶贡献：

$$
d(Z_t^2)
=(-2\theta Z_t^2+2D)dt
+2\sqrt{2D}\,Z_t dW_t.
$$

对两边取期望，并记 $V_t=\operatorname{Var}(X_t)=\mathbb E[Z_t^2]$，得到

$$
\frac{dV_t}{dt}=-2\theta V_t+2D.
$$

若初始方差为 $V_0$，解为

$$
V_t=V_0e^{-2\theta t}
+\frac{D}{\theta}\left(1-e^{-2\theta t}\right).
$$

$-2\theta V_t$ 压缩概率云，$2D$ 持续把它摊开。稳态时两项抵消，留下

$$
V_{\mathrm{st}}=\frac{D}{\theta}.
$$

### 4.3 完整密度：从一个点扩散成稳态高斯

若粒子从确定位置 $X_0=x_0$ 出发，Fokker–Planck 方程的解是

$$
p(x,t\mid x_0)
=\frac{1}{\sqrt{2\pi V_t}}
\exp\!\left[-\frac{(x-m_t)^2}{2V_t}\right],
$$

其中

$$
m_t=\mu+(x_0-\mu)e^{-\theta t},
\qquad
V_t=\frac{D}{\theta}\left(1-e^{-2\theta t}\right).
$$

当 $t\to\infty$，初始位置的信息消失，稳态密度为

$$
\boxed{
p_{\mathrm{st}}(x)
=\sqrt{\frac{\theta}{2\pi D}}
\exp\!\left[-\frac{\theta(x-\mu)^2}{2D}\right]
}.
$$

把这个密度代回 OU 概率流，可以直接验证 $J_{\mathrm{st}}(x)=0$。轨迹语言给出的稳态均值与方差，正好是 Fokker–Planck 稳态密度的中心与宽度。

### 4.4 自相关：单条稳态轨迹怎样保存记忆？

稳态下，线性解给出

$$
\operatorname{Cov}(X_t,X_{t+\tau})
=\frac{D}{\theta}e^{-\theta|\tau|},
$$

因此

$$
\operatorname{Corr}(X_t,X_{t+\tau})=e^{-\theta|\tau|}.
$$

稳态直方图测量概率云的宽度，自相关测量一条轨迹遗忘自身的速度。二者分别对应 $D/\theta$ 与 $1/\theta$，因而可以联合识别噪声强度和回复速度。

### 4.5 数值闭环：让许多条轨迹长成解析密度

Euler–Maruyama 离散化为

$$
X_{n+1}
=X_n+\theta(\mu-X_n)\Delta t
+\sqrt{2D\Delta t}\,\eta_n,
\qquad
\eta_n\sim\mathcal N(0,1).
$$

单次模拟应呈现有记忆的随机轨迹；许多次模拟在同一时刻形成的直方图应逼近 $p(x,t)$；长时间样本的均值、方差和自相关应分别逼近 $\mu$、$D/\theta$ 和 $e^{-\theta|\tau|}$。这三个对照构成“轨迹—分布”闭环，而不只是验证代码是否运行。

<InteractiveConcept type="ou-process" />

本地复现入口：

- Notebook：`exercises/notebooks/E09_ou_process.ipynb`
- pytest：`exercises/tests/test_ou_process.py`
- Written：`exercises/written/M9_fp_langevin.md`

---

## 5. 热平衡增加了什么约束？

### 5.1 势函数把回复趋势写成力

OU 漂移来自谐势

$$
U(x)=\frac{\kappa}{2}(x-\mu)^2,
\qquad
-U'(x)=-\kappa(x-\mu).
$$

更一般地，过阻尼势场中的 Langevin 方程为

$$
dX_t=-\frac{1}{\gamma}U'(X_t)dt+\sqrt{2D}\,dW_t.
$$

相应概率流是

$$
J(x,t)=-\frac{1}{\gamma}U'(x)p(x,t)-D\,\partial_xp(x,t).
$$

势函数只规定平均力的结构；它本身并不能保证系统处于热平衡。要把 $U$ 解释为热力学能量，还需要热噪声与摩擦满足 M5 中的涨落—耗散约束。

### 5.2 Einstein 关系把噪声与摩擦绑定到同一热浴

对温度为 $T$ 的平衡热浴，Einstein 关系给出

$$
D=\frac{k_BT}{\gamma}.
$$

在一维有界区间的反射边界下，稳态条件 $\partial_xJ_{\mathrm{st}}=0$ 先说明 $J_{\mathrm{st}}$ 是常数；边界上的零流再迫使这个常数为零。对整条实线上的可归一化束缚态，若无穷远处没有概率流，同样得到 $J_{\mathrm{st}}=0$。于是

$$
0=-\frac{1}{\gamma}U'(x)p_{\mathrm{eq}}(x)
-D\,\partial_xp_{\mathrm{eq}}(x),
$$

结合 $\gamma D=k_BT$ 可得

$$
\boxed{p_{\mathrm{eq}}(x)\propto e^{-U(x)/(k_BT)}}.
$$

对谐势，这个结果给出

$$
\operatorname{Var}_{\mathrm{eq}}(X)=\frac{k_BT}{\kappa}
=\frac{D}{\theta},
$$

与 OU 闭环完全一致。平衡并不是“没有随机运动”，而是回复、摩擦和热噪声共同维持一个零净概率流的稳态分布。

### 5.3 三处出现的 $D$，何时才是同一个量？

需要区分一个数学恒等关系和一个物理约束：

- 若同一个加性噪声模型写成 $dX_t=a\,dt+\sigma dW_t$，定义 $D=\sigma^2/2$ 后，Fokker–Planck 方程中 $\partial_x^2p$ 前的系数就是同一个 $D$。这是由噪声归一化约定决定的数学对应。
- 只有当这个模型描述与线性摩擦 $\gamma$ 耦合的平衡热浴时，才进一步有 $D=k_BT/\gamma$。这是 FDT 提供的物理关系。

因此，不能脱离“同一 SDE、同一噪声约定、同一平衡热浴”笼统地说三个 $D$ 完全等价。城市或金融模型中的 $D=\sigma^2/2$ 仍然成立，但通常没有理由再写成 $k_BT/\gamma$。

---

## 6. 这条主线依赖哪些边界？

### 6.1 小跳变近似：为什么只剩漂移与扩散？

漂移—扩散方程把局部跳跃核压缩为条件增量的前两阶矩。这个近似要求单次位移主要集中在小邻域内，而且相关矩有限。若系统存在罕见大跳跃、重尾位移或发散的二阶矩，就应保留非局部主方程，或采用与机制相符的跳跃、Lévy 或分数阶模型。漂移—扩散的简洁来自只保留局部小步运动的前两阶信息。

### 6.2 Itô 与 Stratonovich：乘性噪声才需要作出选择

本章使用常数噪声幅度，因此 Itô 与 Stratonovich 给出同一个 OU 过程。只有当噪声幅度 $b(x)$ 依赖状态时，随机积分约定才会改变有效漂移。处理乘性噪声时，必须同时声明物理生成机制、随机积分约定与数值方法；完整转换公式见 [[Itô vs Stratonovich：随机积分不是微积分（建模含义）]]。

### 6.3 稳态并不普遍意味着零概率流

一维稳态只给出 $\partial_xJ_{\mathrm{st}}=0$，即 $J_{\mathrm{st}}$ 是常数。反射边界或无穷远零流使这个常数为零；一维周期环上则可以维持非零常流。

在多维系统中，

$$
\partial_t p=-\nabla\cdot\mathbf J,
\qquad
\nabla\cdot\mathbf J_{\mathrm{st}}=0
$$

只要求稳态流无散度，并不要求 $\mathbf J_{\mathrm{st}}=0$。非保守漂移可以让概率沿闭合回路持续环流，而密度保持不变。M10 正是从这个区别出发，用稳态概率流与熵产生刻画时间不可逆性。

---

## 7. 城市映射：同一套方程能说明什么，不能说明什么？

设 $X_t$ 表示某条走廊相对长期水平的拥堵偏离。绕行、信号调度与需求回落提供均值回复，天气、事故和随机到达提供未解析扰动。最小模型是

$$
dX_t=-\theta X_tdt+\sqrt{2D}\,dW_t.
$$

这个模型给出两个可解释的统计量：

- $1/\theta$ 是一次冲击被遗忘的恢复时间；
- $D/\theta$ 是长期拥堵偏离的方差。

Langevin 轨迹可以表示某一天的时间序列，Fokker–Planck 密度可以表示许多可比日期或重复情景下的拥堵偏离分布。模型因此把“单次经历”和“总体风险”放在同一参数体系内。

这个映射有三条边界：

- 城市模型中的 $D$ 是现象学噪声强度，不自动对应温度或真实能耗；
- 概率流 $J$ 是状态空间中的概率搬运，不是道路上的车辆流量；
- 一维 OU 稳态满足零概率流，不能表达方向性循环。

多个耦合变量、周期驱动或持续环流需要多维非平衡模型，不能把势函数类比直接当作热力学等价。

---

## 8. 核心答案：轨迹与密度由同一个生成元连接

Langevin 方程的 Itô 生成元 $\mathcal L$ 控制单条轨迹的局部增量，伴随算子 $\mathcal L^\dagger$ 控制概率密度的 Fokker–Planck 演化。恒等式 $\mathbb E[f(X_t)]=\int f(x)p(x,t)dx$ 保证两种语言对所有观测量给出同一统计预测。

热平衡不是这层对应关系的前提。它额外提供 Einstein 关系、Boltzmann 稳态与相应边界下的零概率流；加入不受同一 FDT 约束的驱动后，轨迹—密度对应仍然成立，但稳态分布本身已经不足以判断系统是否平衡。

---

## 9. 技术入口与复现资源

### 核心文献

- 统一见 [Seminal papers](/references/seminal_papers)：`SP-M9-Langevin1908`、`SP-M9-Ito1944`。
- Einstein 关系的历史背景见 [[Einstein_1905_Brownian]]。

### 知识库

- Concept：`kb/concepts/Langevin 方程 Langevin equation.md`
- Concept：`kb/concepts/Fokker-Planck 方程 Fokker-Planck equation.md`
- Derivation：`kb/derivations/Langevin 与 Fokker-Planck 的对应关系 形式.md`
- Method：`kb/methods/Euler–Maruyama 数值模拟.md`
- Urban mapping：`kb/urban-mapping/漂移扩散 作为连续城市量随机演化.md`

### 项目

- **P04**：[[p04_diffusion_network/README]]（网络扩散的连续极限）
- **P06**：[[p06_entropy_production/README]]（从概率流进入非平衡熵产生）

---

## 10. Checklist：真正理解“轨迹与分布是同一系统”

- [ ] 能从 $dX_t=a(X_t)dt+\sqrt{2D}dW_t$ 说清漂移与扩散各控制什么。
- [ ] 能写出 $J=ap-D\partial_xp$，并由概率守恒得到 Fokker–Planck 方程。
- [ ] 能从 OU 轨迹方程推出均值、方差与自相关的时间尺度。
- [ ] 能用 OU 稳态密度验证 $J_{\mathrm{st}}=0$，并说明这个零流结论依赖什么边界。
- [ ] 能区分 $D=\sigma^2/2$ 的数学对应与 $D=k_BT/\gamma$ 的平衡物理约束。
- [ ] 能说明多维稳态为何允许 $\nabla\cdot\mathbf J=0$ 但 $\mathbf J\neq0$。
- [ ] 能说清乘性噪声何时必须声明 Itô 或 Stratonovich 约定。
- [ ] 能运行 OU 交互、Notebook 与 pytest，使样本统计和解析结果在误差范围内一致。
- [ ] 能解释城市 OU 映射的统计意义，并避免把概率流、温度和能耗作字面类比。
