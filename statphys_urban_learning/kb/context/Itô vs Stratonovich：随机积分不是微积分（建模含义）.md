---
type: context
title: Itô vs Stratonovich：随机积分不是微积分（建模含义）
tags: ["context", "history", "sde", "ito", "stratonovich", "M9"]
prereq: ["Langevin 方程 Langevin equation", "Euler–Maruyama 数值模拟", "Fokker-Planck 方程 Fokker-Planck equation"]
source: ["Itô 1944", "Stratonovich 1966"]
status: ready
---

## 一句话
- 你之所以需要“随机积分”，是因为带噪声的动力学里普通链式法则会给出错误答案；而当噪声是**乘性噪声**（$b$ 依赖于状态）时，“在一小步里用哪个时刻的状态去评估 $b(X)$”会改变极限方程——这就是 Itô vs Stratonovich：不是记号，而是建模假设，必须显式声明。

## 1）为什么要关心“随机积分”？
核心场景非常朴素：你有一个随机过程 $X_t$（粒子位置、价格、拥堵偏离……），你想知道某个非线性变换 $f(X_t)$ 如何随时间变化。

> **记号约定（先把“对象”钉死）**  
> - $X_t$：一个**随机过程**，表示“时刻 $t$ 系统处在什么状态”。对固定的 $t$，$X_t$ 是一个随机变量；对固定的一条样本路径，它是一条随时间起伏的曲线。  
> - $f$：一个**确定的函数**（通常假设至少二阶可导），例如 $f(x)=x^2$、$f(x)=\ln x$。  
> - $f(X_t)$：把随机变量 $X_t$ 代入函数 $f$ 得到的新随机变量；我们关心它的变化率/增量（例如要写出 $df(X_t)$）。  

在普通微积分里，你会写链式法则
$$
df(X_t)=f'(X_t)\,dX_t.
$$
但当 $X_t$ 满足 SDE
$$
dX_t=a(X_t,t)\,dt+b(X_t,t)\,dW_t,
$$
直接代回去会漏掉一项。根源是一句尺度事实：
$$
dW_t\sim \sqrt{dt}\quad\Rightarrow\quad (dW_t)^2\sim dt.
$$
噪声的“平方”居然和 $dt$ 同阶，这会让二阶项在极限里留下贡献。

### Itô 引理从哪来？——Taylor 展开 + 噪声的特殊尺度
这句话不该只当作“记忆结论”，你应该知道它从哪里长出来。核心问题其实很朴素：

> 我们想算的是 $f(X_{t+\Delta t})-f(X_t)$，而最自然的策略就是对 $f$ 做 Taylor 展开。

在 Itô 的定义里，我们先把 SDE 写成一小步的增量形式（在 $X_t$ 处评估系数）：
$$
\Delta X \equiv X_{t+\Delta t}-X_t \approx a(X_t,t)\,\Delta t + b(X_t,t)\,\Delta W,
\qquad
\Delta W \sim \mathcal N(0,\Delta t).
$$

对 $f(X_t+\Delta X)$ 在 $X_t$ 处做二阶 Taylor 展开：
$$
f(X_{t+\Delta t})
=
f(X_t+\Delta X)
\approx
f(X_t)+f'(X_t)\,\Delta X+\frac12 f''(X_t)\,(\Delta X)^2.
$$

关键就在 $(\Delta X)^2$ 的量级。把 $\Delta X=a\,\Delta t+b\,\Delta W$ 代入并展开：
$$
(\Delta X)^2
=(a\,\Delta t)^2+2ab\,\Delta t\,\Delta W+b^2(\Delta W)^2.
$$
现在逐项看量级（只保留到 $\Delta t$ 这一级）：

- $(a\,\Delta t)^2 \sim (\Delta t)^2$：可以扔掉；
- $\Delta t\,\Delta W \sim (\Delta t)^{3/2}$：可以扔掉；
- 但 $(\Delta W)^2 \sim \Delta t$：**不能扔掉**。

于是二阶项里会留下一个“同阶贡献”：
$$
\frac12 f''(X_t)\,(\Delta X)^2
\supset
\frac12 f''(X_t)\,b(X_t,t)^2\,(\Delta W)^2
\sim
\frac12 f''(X_t)\,b(X_t,t)^2\,\Delta t.
$$

把这条“二阶项同阶”的事实压缩成 Itô 记号，就是 Itô 引理里那一项：
$$
df(X_t)=f'(X_t)\,dX_t+\frac12 f''(X_t)\,b(X_t,t)^2\,dt.
$$
（如果 $f$ 还显式依赖时间 $t$，会再多一项 $\partial_t f\,dt$；这里为了聚焦“噪声导致的额外项”，先省略。）

因此正确的随机链式法则（Itô 引理）是
$$
df(X_t)=f'(X_t)\,dX_t+\frac12 f''(X_t)\,b(X_t,t)^2\,dt.
$$

你可以把这句话读成一句“操作提示”：
**只要你要对带噪过程做微积分（求 $f(X_t)$、求稳态、求响应），你就必须用随机微积分，而不是把 $dW$ 当普通小量。**

## 2）为什么要关心 Itô vs Stratonovich？
简短回答：**同一个“看起来一样”的方程，如果不声明解释约定，会对应不同的物理模型，给出不同的预测。**

关键点是：差别只在**乘性噪声**里出现（$b$ 依赖于 $X$）。如果 $b$ 是常数（加性噪声），两者等价（因为 $b'(x)=0$，见下面的转换公式）。

### 一个最小反例：$dX = X\,dW$ vs $dX = X\circ dW$
考虑最简单的乘性噪声 SDE：
$$
dX_t = X_t\,dW_t \qquad (\text{Itô}),
$$
以及它在 Stratonovich 约定下的写法：
$$
dX_t = X_t\circ dW_t \qquad (\text{Stratonovich}).
$$
它们“长得很像”，但不是同一个模型。为了看到差别，我们不去死记转换公式，而是做一次最小推导。

我们的目标是求出 $X_t$ 的显式形式。一个自然策略是：对 $\ln X_t$ 做微分——因为 $X_t$ 乘在噪声前面时，$\ln$ 往往能把“乘性”变成“加性”，从而更容易积分。

#### Itô 版本（逐步推到 $d\ln X_t$）
1) **先回顾 Itô 引理长什么样**  
对任意足够光滑的 $f(X_t)$，Itô 引理告诉你
$$
df(X_t)=f'(X_t)\,dX_t+\frac12 f''(X_t)\,(dX_t)^2.
$$
这里的关键规则是：因为 $dW_t\sim\sqrt{dt}$，所以 $(dW_t)^2=dt$（在只保留到 $dt$ 这个量级时）。

2) **计算 $(dX_t)^2$（这是二阶项为什么留下来的根源）**  
由 $dX_t=X_t\,dW_t$ 得
$$
(dX_t)^2 = X_t^2\,(dW_t)^2 = X_t^2\,dt.
$$

3) **把 $f(x)=\ln x$ 代入 Itô 引理**  
对 $f(x)=\ln x$，有 $f'(x)=1/x$、$f''(x)=-1/x^2$。因此
$$
d\ln X_t
= \frac{1}{X_t}dX_t+\frac12\left(-\frac{1}{X_t^2}\right)(dX_t)^2.
$$
代入 $dX_t=X_t\,dW_t$ 与 $(dX_t)^2=X_t^2\,dt$，就得到
$$
d\ln X_t = dW_t-\frac12\,dt.
$$

4) **积分并取指数**  
从 $0$ 到 $t$ 积分：
$$
\ln X_t-\ln X_0 = W_t-\frac{t}{2},
$$
因此
$$
X_t = X_0\exp\!\left(W_t-\frac{t}{2}\right).
$$
由于 $W_t\sim\mathcal N(0,t)$，所以 $\mathbb E[e^{W_t}]=e^{t/2}$，从而
$$
\mathbb E[X_t]=X_0\cdot e^{-t/2}\cdot \mathbb E[e^{W_t}] = X_0.
$$

#### Stratonovich 版本（普通链式法则成立）
Stratonovich 的要点是：它对应“平滑噪声极限”，因此**普通链式法则成立**。于是
$$
d\ln X_t = \frac{1}{X_t}\circ dX_t = \circ dW_t,
$$
积分得到
$$
\ln X_t = \ln X_0 + W_t
\quad\Rightarrow\quad
X_t=X_0 e^{W_t},
$$
因此
$$
\mathbb E[X_t]=X_0\,\mathbb E[e^{W_t}]=X_0 e^{t/2}.
$$

#### 小结（同形方程，不同预测）
| 约定 | 显式解 | $\mathbb E[X_t]$ |
|---|---|---|
| Itô | $X_0 e^{W_t-t/2}$ | $X_0$（常数） |
| Stratonovich | $X_0 e^{W_t}$ | $X_0 e^{t/2}$（指数增长） |

同一个“符号级相似”的写法，会导向截然不同的长期预测。这就是为什么你必须在论文和代码里显式声明 Itô/Stratonovich：否则你甚至无法回答“这条 SDE 到底是哪一个模型？”。

## 3）差别从哪里来：你在小步里用哪个时刻的 $b(X)$？
对确定性微分方程，$\int f(x)\,dx$ 的定义唯一；但对含噪声的 SDE，在一个小步里 $\Delta W\sim\sqrt{\Delta t}$，所以 $(\Delta W)^2\sim \Delta t$，二阶项会留下来。结果是：

- 你在每个小步里用**左端点**还是**中点**去评估 $b(X)$，会改变连续极限；
- 这不是“算法细节”，而是在定义随机积分本身。

## 4）两种约定、数值方法与一条转换公式（1D）
- **Itô（左端点）**：Euler–Maruyama 对应的约定
  $$
  X_{t+\Delta t}=X_t+a(X_t)\,\Delta t+b(X_t)\,\Delta W.
  $$
- **Stratonovich（中点）**：更接近“平滑噪声极限”的约定  
  实际数值实现通常用 **Heun（预测-校正）**：先用 Euler 预测，再用预测值构造“中点”校正。

同一条过程的两种写法之间有一条关键换算（1D）：
$$
a_{\text{Itô}}(x)=a_{\text{Strat}}(x)+\frac12\,b(x)b'(x).
$$
所以乘性噪声会生成额外漂移项，这个项经常被叫做**噪声诱导漂移**。它不是数学装饰：它会改变稳态分布与长期统计量。

## 5）何时用哪个？（够你做研究不踩坑）
| 场景 | 推荐约定 | 理由 |
|---|---|---|
| 噪声是“外生、与当前状态独立的冲击”（测量误差、外部扰动） | **Itô** | 增量与当前状态独立；Euler–Maruyama 直接对应 |
| 噪声来自“快变量的有效描述”取白噪声极限（colored noise $\to$ white noise） | **Stratonovich** | 更接近“平滑噪声极限”的自然约定 |
| 复现别人的工作 | **与原文一致** | 两者不可混用；否则会出现“方程同形、结果不同”的隐性偏差 |

**黄金法则**：无论选哪个，都要在论文与代码里显式声明（解释约定 + 数值方法必须成套出现）。

## 6）连接到本项目（为什么这张卡放在 M9）
- 本仓库 OU 过程的闭环验证采用加性噪声（$b=\text{常数}$），因此第一遍学习不需要卡在 Itô/Stratonovich 上；
- 但一旦你把噪声做成状态相关（乘性噪声），你必须同步更新：SDE 解释、FP 形式、以及数值方法，否则“方程看起来一样但结果不同”的隐性 bug 会出现。

## 自检问题
1. 如果噪声是加性的（$b(x)=\text{常数}$），Itô 和 Stratonovich 有区别吗？用 $a_{\text{Itô}}-a_{\text{Strat}}=\tfrac12 b b'$ 回答。
2. 对上面的例子，分别在 Itô 与 Stratonovich 约定下推导 $X_t$ 的显式解，并计算 $\mathbb E[X_t]$。
3. 你现在的城市连续模型里，噪声更像“外生冲击”（偏 Itô）还是“快变量被消去的有效噪声”（更偏 Stratonovich）？你为什么这么判断？
