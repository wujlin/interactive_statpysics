---
type: derivation
title: Langevin 与 Fokker-Planck 的对应关系（Itô 形式）
tags: ['langevin', 'fokker-planck', 'M9']
prereq: ['Langevin 方程 Langevin equation', 'Fokker-Planck 方程 Fokker-Planck equation']
source: ['SDE/FP basics']
status: ready
---

## 为什么现在要学这个“互译规则”？
在 M9 里我们会反复在两种语言之间切换：

- **轨迹语言（Langevin / SDE）**：更接近“模拟/动画”。你写程序时通常是在生成一条条样本轨迹 $X_t$。
- **分布语言（Fokker–Planck / PDE）**：更接近“解释/验收”。你想知道的是概率密度 $p(x,t)$ 怎么演化、稳态长什么样、弛豫时间尺度如何标定。

这张卡的任务不是“背一个公式”，而是把两种语言之间的桥梁写清楚：**给定 SDE，如何得到它对应的概率密度演化方程**（反过来同理）。你一旦把这座桥走通，后续很多“闭环验证”（数值轨迹 vs 理论分布）就会变成套路而不是玄学。

---

## 结论先放出来（1D + Itô）
我们在本卡里固定口径：**一维、Itô 解释**。（如果你用 Stratonovich，漂移项需要修正：见 [[Itô vs Stratonovich：随机积分不是微积分（建模含义）]]。）

给定 Itô SDE：
$$
dX_t = a(X_t,t)\,dt + b(X_t,t)\,dW_t,
$$
其中 $a$ 是漂移（趋势项），$b$ 是噪声幅度，$W_t$ 是布朗运动。

定义概率密度 $p(x,t)$ 满足：
$$
p(x,t)\,dx=\mathbb P\big(X_t\in[x,x+dx]\big).
$$

则 $p(x,t)$ 满足 Fokker–Planck 方程：
$$
\boxed{
\frac{\partial p}{\partial t}
= -\frac{\partial}{\partial x}\big(a(x,t)p(x,t)\big)
+ \frac{1}{2}\frac{\partial^2}{\partial x^2}\big(b(x,t)^2\, p(x,t)\big).
}
$$

下面的问题就是：**这条式子为什么“必然长这样”？**

---

## 形式推导（用一个“测试函数”把轨迹推到分布）
这段推导只用到两件事：

1. 你已经知道的“期望 = 积分”（用 $p(x,t)$ 表示分布）；
2. Itô 微积分的一条核心事实：$dW_t\sim\sqrt{dt}$，因此 $(dW_t)^2$ 和 $dt$ 是同阶小量。

### Step 0：选一个你想观测的量
取任意光滑函数 $\varphi(x)$，把它看作“观测函数”（例如 $\varphi(x)=x$ 或 $\varphi(x)=x^2$）。
我们关心的是它在随机轨迹上的期望：
$$
\mathbb E[\varphi(X_t)].
$$

另一方面，如果 $X_t$ 的密度是 $p(x,t)$，那么
$$
\mathbb E[\varphi(X_t)]=\int_{-\infty}^{\infty}\varphi(x)\,p(x,t)\,dx.
$$
所以：**只要我们能写出 $\frac{d}{dt}\mathbb E[\varphi(X_t)]$ 的表达式，就能反推出 $p$ 的演化方程。**

### Step 1：Itô 的“链式法则”（噪声导致二阶项不能丢）
#### 我们要算什么？为什么要“展开”？
如果 $x(t)$ 是确定性函数，普通链式法则会告诉你
$$
\frac{d}{dt}\varphi(x(t))=\varphi'(x(t))\,\frac{dx}{dt},
$$
等价地写成微分就是
$$
d\varphi(x)=\varphi'(x)\,dx.
$$

但现在 $X_t$ 不是确定性轨迹，而是满足 SDE 的随机过程。我们在 Step 0 已经看到：为了得到 $\partial_t p$，我们需要先拿到 $\frac{d}{dt}\mathbb E[\varphi(X_t)]$；而要算这个导数，第一步就是弄清楚 **$d\varphi(X_t)$ 应该怎么写**。

如果你把普通链式法则直接套过来，会得到一个“看似合理但其实错误”的猜测：
$$
d\varphi(X_t)\stackrel{?}{=}\varphi'(X_t)\,dX_t.
$$
下面这段展开就是为了回答：**这个“？”到底错在哪里，错了多少。**

> **记号说明（$d$ vs $\Delta$）**  
> - $dX_t$ 是 Itô 记号里“形式微分”，用来表达极限意义下的一小步变化。  
> - 为了看清量级，我们先用一个有限但很小的步长 $\Delta t$ 来思考：  
>   $\Delta X \equiv X_{t+\Delta t}-X_t$，$\Delta W \equiv W_{t+\Delta t}-W_t$。  
>   先在离散步上做 Taylor 展开，最后取 $\Delta t\to 0$ 才回到 $d$ 记号。  
> 这“先离散再极限”的路线，正是 Itô 积分的定义方式。

#### 展开策略：把 $\varphi(X_{t+\Delta t})$ 在 $X_t$ 处展开
从 SDE
$$
dX_t = a(X_t,t)\,dt + b(X_t,t)\,dW_t
$$
出发，在一个小步长 $\Delta t$ 内用 Euler 近似写成
$$
\Delta X \approx a(X_t,t)\,\Delta t + b(X_t,t)\,\Delta W,
\qquad
\Delta W\sim\mathcal N(0,\Delta t).
$$

对 $\varphi$ 做二阶 Taylor 展开：
$$
\varphi(X_{t+\Delta t})
\approx
\varphi(X_t)
+\varphi'(X_t)\,\Delta X
+\frac12\,\varphi''(X_t)\,(\Delta X)^2.
$$

#### 关键发现：$(\Delta W)^2\sim \Delta t$ 让二阶项“同阶”出现
把 $\Delta X = a\,\Delta t + b\,\Delta W$ 代入平方项：
$$
(\Delta X)^2
=(a\,\Delta t)^2+2ab\,\Delta t\,\Delta W+b^2(\Delta W)^2.
$$
这里 $\Delta W$ 的尺度是 $\sqrt{\Delta t}$，所以：
- $(a\,\Delta t)^2\sim (\Delta t)^2$（可忽略）；
- $\Delta t\,\Delta W\sim (\Delta t)^{3/2}$（可忽略）；
- 但 $(\Delta W)^2\sim \Delta t$（**不可忽略**）。

因此在“保留到 $\Delta t$ 这个量级”为止，$\varphi$ 的增量是
$$
\Delta\varphi
\equiv \varphi(X_{t+\Delta t})-\varphi(X_t)
\approx
\varphi'(X_t)\big(a\,\Delta t+b\,\Delta W\big)
+\frac12\,\varphi''(X_t)\,b^2(\Delta W)^2.
$$

最后一步进入 Itô 极限：布朗运动的“二次变差”满足在量级上
$$
(\Delta W)^2 \approx \Delta t \quad (\Delta t\to 0,\ \text{以贡献到一阶小量为准}),
$$
于是得到 Itô 引理（随机版链式法则）：
$$
d\varphi(X_t)
= \varphi'(X_t)\,dX_t + \frac12\,\varphi''(X_t)\,b(X_t,t)^2\,dt.
$$

把 $dX_t$ 展开成漂移 + 噪声，得到更常用的写法：
$$
d\varphi(X_t)
= \varphi'(X_t)\,a(X_t,t)\,dt
+ \varphi'(X_t)\,b(X_t,t)\,dW_t
+ \frac12\,\varphi''(X_t)\,b(X_t,t)^2\,dt.
$$

### Step 2：对两边取期望（噪声项消失，留下漂移 + 扩散）
利用 $\mathbb E[dW_t]=0$，并把 $dt$ 提出来：
$$
\frac{d}{dt}\mathbb E[\varphi(X_t)]
= \mathbb E\!\left[a(X_t,t)\,\varphi'(X_t)\right]
+\frac12\,\mathbb E\!\left[b(X_t,t)^2\,\varphi''(X_t)\right].
$$

这一步已经给出一个非常重要的直觉：**漂移项对应一阶导数，噪声项对应二阶导数，而且噪声只通过 $b^2$ 出现**。

### Step 3：把期望写回 $p(x,t)$ 的积分形式
把期望写成积分：
$$
\mathbb E[a(X_t,t)\,\varphi'(X_t)]
= \int a(x,t)\,\varphi'(x)\,p(x,t)\,dx,
$$
$$
\mathbb E[b(X_t,t)^2\,\varphi''(X_t)]
= \int b(x,t)^2\,\varphi''(x)\,p(x,t)\,dx.
$$

所以
$$
\frac{d}{dt}\int \varphi(x)\,p(x,t)\,dx
=\int a(x,t)\,\varphi'(x)\,p(x,t)\,dx
+\frac12\int b(x,t)^2\,\varphi''(x)\,p(x,t)\,dx.
$$

### Step 4：把导数从 $\varphi$ 挪到 $p$（分部积分）
假设边界项可以忽略（例如 $p$ 在无穷远衰减足够快），做分部积分：
$$
\int a\,\varphi'\,p\,dx
= -\int \varphi\,\partial_x(ap)\,dx,
$$
$$
\int b^2\,\varphi''\,p\,dx
= \int \varphi\,\partial_x^2(b^2 p)\,dx.
$$

代回去得到
$$
\frac{d}{dt}\int \varphi\,p\,dx
= \int \varphi\left[-\partial_x(ap)+\frac12\partial_x^2(b^2p)\right]dx.
$$

因为这对任意测试函数 $\varphi$ 都成立，所以括号里的部分就是 $\partial_t p$，从而得到 Fokker–Planck：
$$
\frac{\partial p}{\partial t}
= -\partial_x(ap)+\frac12\partial_x^2(b^2p).
$$

---

## 概率流版本（更像 M8 的“流入−流出”）
把上式写成连续性方程（概率守恒）更直观：
$$
\partial_t p + \partial_x J = 0,
$$
其中概率流为
$$
J(x,t)=a(x,t)p(x,t)-\frac12\,\partial_x\!\left(b(x,t)^2 p(x,t)\right).
$$
这就是“主方程连续极限”的味道：分布变化来自概率流的散度（流入减流出）。

---

## OU 过程核对（把推导变成一个可复现闭环）
OU 过程取
$$
a(x)=\theta(\mu-x),\qquad b(x)=\sigma\ (\text{常数}).
$$
对应的 FP 方程是
$$
\partial_t p
= -\partial_x\big(\theta(\mu-x)p\big)
+\frac{\sigma^2}{2}\partial_x^2 p.
$$

### 稳态怎么求：先写出概率流 $J$，再决定 $J=0$ 还是 $J\neq 0$
把 FP 写成守恒形式（上一节已经得到）
$$
\partial_t p + \partial_x J = 0,
$$
其中（在 $b=\sigma$ 为常数时）
$$
J(x,t)=a(x)p(x,t)-\frac{\sigma^2}{2}\partial_x p(x,t)
=\theta(\mu-x)p(x,t)-\frac{\sigma^2}{2}\partial_x p(x,t).
$$

**稳态**的定义是 $\partial_t p=0$，因此
$$
\partial_x J=0\quad\Rightarrow\quad J=\text{常数}.
$$
这时有两类稳态：
- $J=\text{常数}\neq 0$：存在持续的概率流（这更像 M8 的 NESS：分布不变但流不为零）；
- $J=0$：没有净流（在一维无边界问题里，这通常就是“平衡型稳态”）。

对 OU 过程，我们考虑的状态空间是整条实数轴，且要求稳态可归一化（$p\to 0$ as $x\to\pm\infty$）。在这种设定下，如果 $J$ 是一个非零常数，概率会在无穷远“持续被运走/运来”，无法得到一个可归一化、时间不变的密度。因此这里取 $J=0$ 来求稳态。

### 从 $J=0$ 到高斯（不跳步）
令 $J=0$：
$$
\theta(\mu-x)p-\frac{\sigma^2}{2}\partial_x p=0.
$$
移项并分离变量：
$$
\partial_x p=\frac{2\theta}{\sigma^2}(\mu-x)\,p,
\qquad
\frac{\partial_x p}{p}=\frac{d(\ln p)}{dx}=\frac{2\theta}{\sigma^2}(\mu-x).
$$
两边对 $x$ 积分：
$$
\ln p(x)=\frac{2\theta}{\sigma^2}\int(\mu-x)\,dx
\;=\;\frac{2\theta}{\sigma^2}\left(\mu x-\frac{x^2}{2}\right)+C.
$$
把二次项配方：
$$
\ln p(x)= -\frac{\theta}{\sigma^2}(x-\mu)^2 + C',
$$
取指数得到稳态分布
$$
p_{\text{st}}(x)\propto \exp\!\left[-\frac{\theta}{\sigma^2}(x-\mu)^2\right].
$$

### 识别方差（把“$\sigma^2/2\theta$ 从哪来”说清楚）
标准高斯的指数写法是
$$
\exp\!\left[-\frac{(x-\mu)^2}{2\,\sigma_{\text{gauss}}^2}\right].
$$
与上式对比：
$$
\frac{1}{2\sigma_{\text{gauss}}^2}=\frac{\theta}{\sigma^2}
\quad\Rightarrow\quad
\sigma_{\text{gauss}}^2=\frac{\sigma^2}{2\theta}.
$$
因此 OU 过程稳态满足
$$
\boxed{\ \mathbb E[X]=\mu,\qquad \mathrm{Var}(X)=\frac{\sigma^2}{2\theta}\ }.
$$

直觉上：$\sigma$ 越大，噪声越强，分布越“摊开”；$\theta$ 越大，回复越强，分布越“收紧”。  
这就是 `E09`（OU 数值闭环）里用 Euler–Maruyama 轨迹去对齐的“验收标尺”。

---

## 边界提醒（避免误用）
- 本卡片只写 **Itô** 的互译；乘性噪声下换成 Stratonovich 时，漂移会出现“噪声诱导漂移”修正（见对应 Context 卡）。
- 多维情况下形式类似：漂移变向量 $\mathbf a$，扩散项对应扩散张量；核心仍是“对任意测试函数取期望 + 分部积分”。

---

## 自检题（读完应当能当场写出来）
1. 给定 $dX=-x\,dt+\sqrt{2}\,dW$，写出对应的 Fokker–Planck 方程，并指出它的稳态分布是什么形状。
2. 若 $b(x)$ 为常数（加性噪声），为什么 Itô 与 Stratonovich 不再有差别？把这句话落实到“漂移修正项”为零的形式。
3. 在 OU 过程中，$\theta$ 增大时稳态方差如何变化？用一句话解释这意味着“恢复速度 vs 典型波动幅度”的什么权衡。

---

## 自检题参考答案

### 自检题 1

**题目**：给定 $dX = -x\,dt + \sqrt{2}\,dW$，写出对应的 Fokker–Planck 方程，并指出它的稳态分布是什么形状。

**参考答案**

**Step 1：识别 $a(x)$ 和 $b(x)$**

对比通用形式 $dX = a(x)\,dt + b(x)\,dW$：

- $a(x) = -x$（漂移：线性回复力，把 $X$ 拉回 0）
- $b(x) = \sqrt{2}$（常数，加性噪声）
- 扩散系数 $D = b^2/2 = 1$

**Step 2：写出 Fokker–Planck 方程**

FP 方程的一般形式（加性噪声）：
$$
\partial_t p = -\partial_x\!\big(a\,p\big) + D\,\partial_x^2 p
$$

代入 $a(x) = -x$，$D = 1$：
$$
\boxed{\partial_t p = -\partial_x(-x\,p) + \partial_x^2 p = \partial_x(x\,p) + \partial_x^2 p}
$$

把 $\partial_x(xp)$ 再展开一步（乘积法则）：
$$
\partial_x(xp)
= (\partial_x x)\,p + x\,\partial_x p
= 1\cdot p + x\,\partial_x p
= p + x\,\partial_x p.
$$
所以等价地也可以写成：
$$
\partial_t p = p + x\,\partial_x p + \partial_x^2 p
$$

**Step 3：求稳态分布**

这里要先把“概率流 $J$”从方程里**定义**出来：它不是由“平衡”推出的，而是由**概率守恒**（连续性方程）定义出来的；“平衡”只是进一步告诉我们在某些条件下应该取 $J=0$。回顾 Fokker–Planck（加性噪声）：
$$
\partial_t p = -\partial_x\!\big(a\,p\big) + D\,\partial_x^2 p.
$$
把二阶导写成一阶导的导数：
$$
D\,\partial_x^2 p = D\,\partial_x(\partial_x p),
$$
于是
$$
\partial_t p
= -\partial_x\!\big(a\,p\big) + \partial_x\!\big(D\,\partial_x p\big)
= -\partial_x\!\Big(a\,p - D\,\partial_x p\Big).
$$
这一步告诉我们：FP 其实就是“概率守恒”的连续版
$$
\partial_t p + \partial_x J = 0,
$$
其中概率流（流入−流出）定义为
$$
J \equiv a\,p - D\,\partial_x p.
$$

现在再谈“稳态/平衡”。稳态只要求 $\partial_t p = 0$，因此
$$
\partial_x J = 0 \quad\Rightarrow\quad J=\text{常数}.
$$
如果进一步要求**平衡型稳态**（对应 M8 的“细致平衡”的连续版：没有持续环流/净流），就应当取这个常数为 0，即 $J=0$。在整条实轴上还要求 $p\to 0$ 且可归一化时，非零常数流会把概率“持续运走/运来”，也会被排除。

代入 $a(x)=-x$、$D=1$，并令 $J=0$：
$$
J = -x\,p - D\,\partial_x p = -x\,p - \partial_x p = 0
$$

解这个 ODE：
$$
\partial_x p = -x\,p
\quad \Rightarrow \quad
\frac{d(\ln p)}{dx} = -x
\quad \Rightarrow \quad
\ln p = -\frac{x^2}{2} + C
$$

$$
\boxed{p_{\text{st}}(x) \propto e^{-x^2/2} = \mathcal{N}(0, 1)}
$$

稳态分布是均值为 0、方差为 1 的标准正态分布（高斯分布）。

### 自检题 2

**题目**：若 $b(x)$ 为常数（加性噪声），为什么 Itô 与 Stratonovich 不再有差别？把这句话落实到“漂移修正项”为零的形式。

**参考答案**

核心公式：Itô 与 Stratonovich 漂移之间的转换关系是
$$
a_{\text{Itô}}(x) = a_{\text{Strat}}(x) + \frac{1}{2}b(x)\,b'(x)
$$

当 $b(x) = \text{常数}$ 时：
$$
b'(x) = 0
$$

因此修正项：
$$
\frac{1}{2}b(x)\,b'(x) = \frac{1}{2}b \cdot 0 = 0
$$

$$
\boxed{a_{\text{Itô}}(x) = a_{\text{Strat}}(x)}
$$

结论：当噪声强度不依赖于状态时，两种解释给出完全相同的漂移，因此对应同一个物理模型、同一个 FP 方程、同一个稳态分布。

物理直觉：Itô 和 Stratonovich 的差别来自"在一小步里用哪个时刻的 $b(X)$"。如果 $b$ 根本不随 $X$ 变，用左端点还是中点都一样，差别就消失了。

### 自检题 3

**题目**：在 OU 过程中，$\theta$ 增大时稳态方差如何变化？用一句话解释这意味着“恢复速度 vs 典型波动幅度”的什么权衡。

**参考答案**

OU 过程：
$$
dX = -\theta X\,dt + \sigma\,dW
$$

稳态方差：
$$
\mathrm{Var}(X) = \frac{\sigma^2}{2\theta}
$$

当 $\theta$ 增大时：
$$
\mathrm{Var}(X) = \frac{\sigma^2}{2\theta}
\quad \downarrow \quad
\text{（减小）}
$$

一句话解释：

恢复速度越快（$\theta$ 大），系统被拉回平衡的力越强，因此典型波动幅度（方差）越小。

反过来：如果系统"回来得慢"（$\theta$ 小），噪声有更长时间把系统推离平衡，导致更大的稳态涨落。

物理类比（帮助你把公式翻译成直觉）：

- 强弹簧（大 $\theta$）：被拉开后很快弹回，振幅小
- 弱弹簧（小 $\theta$）：被拉开后慢慢晃回来，在同样的噪声下晃得更远
