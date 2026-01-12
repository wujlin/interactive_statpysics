# Reading Guide: Swendsen Chapter 31（Phase Transitions & Ising Model）

> **Type**: Reading Guide
> **Source**: [[Swendsen_2012]]
> **Topics**: Interactions, Ising Model, Mean Field Theory

> 备注：本文件名历史原因保留 `Swendsen_Ch16_Ising`，但在 Swendsen (2012) 扫描版中，Ising 与相变在 **Chapter 31**。

## 一句话：一旦不可分解，就会有“突变”

这章的角色不是“再学一个模型”，而是把你从 M3–M5 的独立世界带进真实世界：**相互作用让系统失去可分解性，于是相变才成为可能**。

Swendsen 在这里引入了著名的 **Ising 模型**，并教授了对付多体问题的第一招：**平均场近似 (Mean Field Approximation)** —— 既然算不动 $N$ 体纠缠，不如假装周围是一片均匀的海洋。

---

## Key Equations：公式背后的物理直觉

不要死记公式。你真正需要的是一条连续的链条：
**有效场 $\rightarrow$ 单自旋配分函数 $\rightarrow$ 自由能 $F(m)$ $\rightarrow$ 自洽方程与分叉**。

### 1) Ising Hamiltonian（Swendsen Eq 31.44）
Swendsen 的写法是：
$$
\mathcal{H} = -J \sum_{\langle j,k\rangle}\sigma_j\sigma_k - h\sum_{j=1}^{N}\sigma_j,\qquad \sigma_j\in\{\pm 1\}.
$$

- **物理含义**：$J$ 想要“随大流”（相互作用降低能量），$T$ 想要“做自己”（热噪声增加熵）。
- **数学难点**：因为 $\sum_{\langle j,k\rangle}\sigma_j\sigma_k$ 把自旋耦合在一起，一般 **$Z$ 不能分解成 $(Z_1)^N$**。

### 2) Bragg–Williams（平均场）自由能：为什么 Swendsen “看起来像直接给出”？
Swendsen 在 Chapter 31.5 的推导主线是“计算视角”：先写出有效场，再把问题看成 $N$ 个独立自旋。这样做非常快，但读者常会卡在两处：
1) 为什么会突然出现 $\ln\cosh$？  
2) 为什么这种“独立化”还需要一个 $\tfrac12NzJm^2$ 的修正？

下面按 Swendsen 的逻辑把缺的桥补齐。

#### 2.1 有效场（Swendsen Eq 31.49）
设每个格点有 $z$ 个最近邻（有些笔记写作 $q$）。平均场把邻居的瞬时涨落替换为均值 $m=\langle \sigma\rangle$，得到：
$$
h_{\mathrm{eff}} = J z m + h.
$$

#### 2.2 单自旋配分函数（两态的 log-sum-exp）
一个自旋在场 $h_{\mathrm{eff}}$ 下只有两种状态 $\sigma=\pm 1$，于是
$$
Z_1
= \sum_{\sigma=\pm 1} e^{\beta h_{\mathrm{eff}}\sigma}
= e^{\beta h_{\mathrm{eff}}}+e^{-\beta h_{\mathrm{eff}}}
= 2\cosh(\beta h_{\mathrm{eff}}).
$$

如果你看到这里会疑惑“为什么指数和会突然变成 $\cosh$ / $\tanh$”，记住一句话就够了：**双曲三角函数本来就是用指数定义的**（注意这里是 $\cosh,\sinh,\tanh$，不是普通的 $\cos,\sin$）。它只是把反复出现的 “$e^{x}$ 与 $e^{-x}$ 的对称结构”压缩成一个符号，方便你一眼看出极限与对称性：
$$
\cosh x \equiv \frac{e^{x}+e^{-x}}{2},\qquad
\sinh x \equiv \frac{e^{x}-e^{-x}}{2},\qquad
\tanh x \equiv \frac{\sinh x}{\cosh x}.
$$
因此
$$
e^{\beta h_{\mathrm{eff}}}+e^{-\beta h_{\mathrm{eff}}}=2\cosh(\beta h_{\mathrm{eff}}).
$$
同样地，后面平均磁化为什么会变成 $\tanh$ 也不是“新函数从天而降”，而是**归一化后的“差/和”**：
$$
\langle \sigma\rangle
=\frac{(+1)e^{\beta h_{\mathrm{eff}}}+(-1)e^{-\beta h_{\mathrm{eff}}}}{e^{\beta h_{\mathrm{eff}}}+e^{-\beta h_{\mathrm{eff}}}}
=\frac{e^{\beta h_{\mathrm{eff}}}-e^{-\beta h_{\mathrm{eff}}}}{e^{\beta h_{\mathrm{eff}}}+e^{-\beta h_{\mathrm{eff}}}}
=\tanh(\beta h_{\mathrm{eff}}).
$$
这一步的“物理含义”就是：你把“上/下”两种微观可能性**加权计数**了一次；$\ln(2\cosh)$ 就是这次计数的对数（它把能量与熵都压缩进去了）。

这里“压缩”的意思不是一句口号，而是一个可验算的恒等式：对这一个自旋，
$$
F_1(h_{\mathrm{eff}})\equiv -k_BT\ln Z_1
$$
同时又必须满足热力学定义
$$
F_1=\langle E\rangle - T S.
$$
而正则分布下两态概率为
$$
p(\sigma)=\frac{e^{\beta h_{\mathrm{eff}}\sigma}}{Z_1},\qquad \sigma\in\{\pm 1\}.
$$
因此
$$
\langle \sigma\rangle = p(+1)-p(-1)=\tanh(\beta h_{\mathrm{eff}}),\qquad
\langle E\rangle=\langle -h_{\mathrm{eff}}\sigma\rangle=-h_{\mathrm{eff}}\tanh(\beta h_{\mathrm{eff}}),
$$
并且把 $S=-k_B\sum_{\sigma}p(\sigma)\ln p(\sigma)$ 写开（这一步最好亲手算一遍，避免把“$\ln\cosh$ 里到底藏了什么”当成黑箱）：

首先把对数拆开。由
$$
p(\sigma)=\frac{e^{\beta h_{\mathrm{eff}}\sigma}}{Z_1}
$$
可得
$$
\ln p(\sigma)=\beta h_{\mathrm{eff}}\sigma-\ln Z_1.
$$

代回熵的定义：
$$
\frac{S}{k_B}
=-\sum_{\sigma}p(\sigma)\ln p(\sigma)
=-\sum_{\sigma}p(\sigma)\bigl(\beta h_{\mathrm{eff}}\sigma-\ln Z_1\bigr).
$$

把与 $\sigma$ 有关/无关的部分分开：
$$
\frac{S}{k_B}
=-\beta h_{\mathrm{eff}}\sum_{\sigma}p(\sigma)\sigma
+(\ln Z_1)\sum_{\sigma}p(\sigma)
=-\beta h_{\mathrm{eff}}\langle\sigma\rangle+\ln Z_1.
$$

最后用两条已经得到的事实：$\sum_{\sigma}p(\sigma)=1$ 以及 $\langle\sigma\rangle=\tanh(\beta h_{\mathrm{eff}})$，就得到
$$
\boxed{\frac{S}{k_B}=\ln Z_1-\beta h_{\mathrm{eff}}\tanh(\beta h_{\mathrm{eff}}).}
$$
把这三行代回 $F_1=\langle E\rangle-TS$，就恰好回到 $F_1=-k_BT\ln Z_1$。所以 $\ln Z_1=\ln\!\big(2\cosh(\beta h_{\mathrm{eff}})\big)$ 确实把“平均能量”和“熵”都封装在一个函数里：你只要知道它，平均量与混乱度都能从中读出来。

一个直观校验是看两个极限：
- **高温**（$\beta\to 0$）：$Z_1\to 2$，两态几乎等概率，$S\to k_B\ln 2$（纯“二选一”的熵）。
- **低温**（$\beta|h_{\mathrm{eff}}|\to\infty$）：$Z_1\approx e^{\beta|h_{\mathrm{eff}}|}$，系统几乎锁死在最低能态，$S\to 0$，自由能趋近最低能量。

如果你进一步把系统近似成 $N$ 个独立自旋在同一个场里，那么
$$
Z_{\mathrm{MF}}\approx (Z_1)^N
$$
从而
$$
F_{\mathrm{spin}}(m)\approx -k_BT\ln Z_{\mathrm{MF}}=-Nk_BT\ln Z_1.
$$

**从单自旋到整个系统：为什么需要两个自由能？**

到这里，我们完成了平均场的核心策略：把 $N$ 体问题**解耦**成 $N$ 个单体问题。每个单体在有效场 $h_{\mathrm{eff}}$ 下有自由能 $F_1 = -k_BT \ln Z_1$。

天真的想法是：既然 $N$ 个自旋现在"独立"了，系统总自由能不就是 $F_{\text{total}} = N \times F_1$ 吗？

**不幸的是，这是错的**。原因在于：我们把相互作用"塞进"了 $h_{\mathrm{eff}}$，但这个场本身依赖于 $m$——它不是真正的外场。如果你把 $-h_{\mathrm{eff}}\sigma$ 当作单自旋能量并对 $N$ 个格点求和，每条相互作用边会被从两个端点各算一次（双计数）。

下一节我们将看到如何修正这个问题，得到正确的平均场自由能 $F_{\mathrm{MF}}(m)$。

#### 2.3 关键修正：避免“双计数”（Swendsen Eq 31.47 附近的警告）
Swendsen 明确提醒：把相互作用塞进 $h_{\mathrm{eff}}$ 后，不能把 $-h_{\mathrm{eff}}\sigma$ 当作真实能量并对格点求和（这隐含了将有效场视为固定外场），否则会把每条边（相互作用）算两次。

一个最小例子就能看出“为什么会算两次”：

- 只看两颗自旋 $\sigma_1,\sigma_2\in\{\pm 1\}$，只有一条相互作用边。真实哈密顿量的相互作用部分是
$$
\mathcal{H}_{\text{int}}=-J\sigma_1\sigma_2.
$$
- 对每个点写“局部场”（此处先不做平均场，只做代数恒等式）：
$$
h_{\mathrm{eff},1}=J\sigma_2,\qquad h_{\mathrm{eff},2}=J\sigma_1.
$$
- 如果你天真地把能量写成“点能量求和”
$$
\mathcal{H}_{\text{naive}}
=-h_{\mathrm{eff},1}\sigma_1-h_{\mathrm{eff},2}\sigma_2,
$$
那么展开就是
$$
\mathcal{H}_{\text{naive}}
=-(J\sigma_2)\sigma_1-(J\sigma_1)\sigma_2
=-2J\sigma_1\sigma_2
=2\,\mathcal{H}_{\text{int}}.
$$
同一条边 $(1,2)$ 以 $(1\to2)$ 和 $(2\to1)$ 两种方式被算了两次，这就是“双计数”。

一般格点系统也是同理：如果你把配对和写成“对每个点把邻居都加一遍”，每条边一定会从两个端点各出现一次，因此
$$
\sum_{\langle i,j\rangle}\sigma_i\sigma_j
=\frac{1}{2}\sum_i\sum_{j\in \mathrm{nbr}(i)}\sigma_i\sigma_j.
$$

这也解释了“为什么修正项偏偏是 $\tfrac12NzJm^2$”——它不是凭空加的，而是为了让**平均能量的计数**对上原始哈密顿量：

- 原始相互作用能量是按“边”求和：
  $$
  \mathcal{H}_{\text{int}}=-J\sum_{\langle i,j\rangle}\sigma_i\sigma_j.
  $$
  在平均场里我们近似 $\langle \sigma_i\sigma_j\rangle\approx \langle\sigma_i\rangle\langle\sigma_j\rangle=m^2$，因此
  $$
  \langle \mathcal{H}_{\text{int}}\rangle \approx -J\sum_{\langle i,j\rangle} m^2
  =-J\left(\frac{Nz}{2}\right)m^2.
  $$
  这里 $\frac{Nz}{2}$ 是边的总数（每个点有 $z$ 条边，但每条边连接两个点）。

- 但如果你把相互作用“塞进有效场”并写成点能量求和，等效于让每个点带着一项 $-Jzm\,\sigma_i$。它给出的平均相互作用能量是
  $$
  \left\langle -Jzm\sum_i\sigma_i\right\rangle
  =-Jzm\cdot (Nm)
  =-NzJm^2,
  $$
  恰好比正确的 $-\tfrac12NzJm^2$ 多算了一倍。

所以要把能量“纠正回按边计数的结果”，最小就是加回
$$
+\frac{1}{2}NzJm^2,
$$
这正是 Swendsen 说的“双计数”在自由能里的具体修正。

最小的修正方式是补回一项
$$
\frac{1}{2}NzJm^2,
$$
得到常用的 Bragg–Williams/Weiss 平均场自由能（以 $m$ 为变量）：
$$
\boxed{
F_{\mathrm{MF}}(m)
=
\frac{1}{2}NzJm^2
-Nk_BT\ln\!\left[2\cosh\!\left(\beta(Jzm+h)\right)\right]
}.
$$

#### 2.4 为什么这就是“核心结果”？
因为它把 $J$ 与 $T$ 的战争浓缩进一个函数：**平衡态就是最小化 $F_{\mathrm{MF}}(m)$**。

对 $m$ 求导并令零，会直接给出自洽方程（Swendsen Eq 31.51）：
$$
\frac{\partial F_{\mathrm{MF}}}{\partial m}=0
\quad\Longleftrightarrow\quad
m=\tanh\!\left(\beta(Jzm+h)\right).
$$
这也是 Module 6 里“画两条曲线找交点”的严格来源：交点不是拍脑袋的，是**自由能极小的几何表现**。

#### 2.5 把 $\ln\cosh$ 拆回能量-熵竞争——寻找临界点的关键一步

我们已经有了平均场自由能 $F_{\mathrm{MF}}(m)$，它把 $J$ 和 $T$ 的竞争浓缩成一个函数。但现在有一个核心问题没有回答：**相变发生在什么温度？**

$\ln\cosh$ 的形式是"不透明的"——你盯着它看，并不能直接判断 $m=0$ 这个解什么时候从稳定变成不稳定。为了"看穿"相变的条件，我们需要把 $F$ 拆回它的物理本源：$F = U - TS$（能量-熵的拔河）。然后在 $m=0$ 附近展开，问一个简单的问题：**$m=0$ 什么时候从"碗底"变成"山顶"？**

Swendsen 的快路径把熵藏在 $\ln Z_1$ 里。为了让“有序 vs 混乱”的拔河更直观，你可以把 $F$ 写回 $U-TS$：

- **能量项（喜欢有序）**  
这里的 $U$ 指**内能（internal energy）**：它不是“某个微观态的能量”，而是哈密顿量在平衡分布下的平均值
$$
U \equiv \langle \mathcal{H}\rangle.
$$
从 Ising 哈密顿量
$$
\mathcal{H} = -J \sum_{\langle i,j\rangle}\sigma_i\sigma_j - h\sum_i\sigma_i
$$
出发，平均场的关键近似是把相邻点的相关性忽略掉，使得
$$
\langle \sigma_i\sigma_j\rangle \approx \langle\sigma_i\rangle\langle\sigma_j\rangle = m^2.
$$
于是相互作用项按“边”的数量计数：整张网格一共有 $Nz/2$ 条边（每个点有 $z$ 个邻居，但每条边连两个点），所以
$$
\left\langle -J \sum_{\langle i,j\rangle}\sigma_i\sigma_j\right\rangle
\approx -J\left(\frac{Nz}{2}\right)m^2.
$$
外场项则是
$$
\left\langle -h\sum_i\sigma_i\right\rangle = -h\,N\,m.
$$
合起来就得到平均场下的能量密度：
$$
\frac{U(m)}{N}\approx -\frac{1}{2}zJm^2-hm.
$$

- **熵项（喜欢混乱）**  
这里的“熵”指 **Boltzmann 熵**：我们先把宏观态选成“磁化固定为 $m$”，然后数一数在这个约束下有多少个微观构型：
$$
S_{\mathrm{B}}(m)\equiv k_B\ln\Omega(m).
$$
在平均场（Bragg–Williams）里，我们把自旋近似成“互相独立、只通过平均磁化耦合”，因此一个给定的 $m$ 只是在说“向上自旋占了多少比例”。令
$$
m\equiv \frac{1}{N}\sum_{i=1}^N\sigma_i,\qquad
N_\uparrow=\frac{1+m}{2}N,\qquad
N_\downarrow=\frac{1-m}{2}N,
$$
那么满足这个宏观态的微观构型数就是“从 $N$ 个格点里选出 $N_\uparrow$ 个放上自旋”的组合数：
$$
\Omega(m)=\binom{N}{N_\uparrow}=\frac{N!}{N_\uparrow!\,N_\downarrow!}.
$$

接下来我们用 Stirling 近似把组合数的对数变成一个“熵密度”形式。先取对数：
$$
\ln\Omega(m)=\ln N!-\ln N_\uparrow!-\ln N_\downarrow!.
$$
对大数 $n$，Stirling 公式给出
$$
\ln n! = n\ln n-n+O(\ln n).
$$
把它代入并用 $N_\uparrow+N_\downarrow=N$ 消掉线性项，就得到
$$
\ln\Omega(m)
\approx
N\ln N
-N_\uparrow\ln N_\uparrow
-N_\downarrow\ln N_\downarrow
+ O(\ln N).
$$
再把 $N_\uparrow=Np_\uparrow$、$N_\downarrow=Np_\downarrow$ 写开，其中
$$
p_\uparrow\equiv \frac{N_\uparrow}{N}=\frac{1+m}{2},\qquad
p_\downarrow\equiv \frac{N_\downarrow}{N}=\frac{1-m}{2},
$$
这里最容易卡住的一步是：**$\ln p_\uparrow$ 并不是“在对数里除以 $N$”得到的，而是来自 $\ln(Np)=\ln N+\ln p$ 的拆分**。具体地，
$$
\ln N_\uparrow=\ln(Np_\uparrow)=\ln N+\ln p_\uparrow,\qquad
\ln N_\downarrow=\ln(Np_\downarrow)=\ln N+\ln p_\downarrow.
$$
因此
$$
N_\uparrow\ln N_\uparrow = Np_\uparrow\ln N + Np_\uparrow\ln p_\uparrow,
\qquad
N_\downarrow\ln N_\downarrow = Np_\downarrow\ln N + Np_\downarrow\ln p_\downarrow.
$$
把这两式代回
$$
\ln\Omega \approx N\ln N - N_\uparrow\ln N_\uparrow - N_\downarrow\ln N_\downarrow + O(\ln N)
$$
后，你会得到
$$
\ln\Omega
\approx
N\ln N
-N(p_\uparrow+p_\downarrow)\ln N
-N\bigl(p_\uparrow\ln p_\uparrow+p_\downarrow\ln p_\downarrow\bigr)
+O(\ln N).
$$
由于 $p_\uparrow+p_\downarrow=1$，前两项正好抵消，剩下的就是
$$
\frac{S_{\mathrm{B}}(m)}{Nk_B}
=\frac{1}{N}\ln\Omega(m)
\approx
-p_\uparrow\ln p_\uparrow-p_\downarrow\ln p_\downarrow
+ O\!\left(\frac{\ln N}{N}\right),
$$
也就是常用写法
$$
\frac{S(m)}{Nk_B}
\approx
-\frac{1+m}{2}\ln\frac{1+m}{2}
-\frac{1-m}{2}\ln\frac{1-m}{2}.
$$
（上面的 $O(\ln N/N)$ 项在热力学极限下对熵密度与 $F/N$ 的导数都不产生影响，所以讲义里通常直接省略。）

同一个表达式也可以从 **Gibbs/Shannon 熵**得到：如果把每个格点当作一个独立的二元随机变量，且
$$
P(\sigma=+1)=p_\uparrow,\qquad P(\sigma=-1)=p_\downarrow,
$$
那么单自旋的熵密度就是 $-p_\uparrow\ln p_\uparrow-p_\downarrow\ln p_\downarrow$，乘上 $N$ 就回到上面的 $S(m)$。这也解释了为什么平均场“独立自旋”的直觉与“计数组合数”的路径会在这里对齐。

**关键问题：$m=0$ 什么时候变得不稳定？**

我们已经把 $F$ 拆成了能量和熵的显式形式。现在可以进攻核心问题了：当 $h=0$ 时，在 $m\approx 0$ 处展开 $F(m)$，可以把"能量-熵的拔河"写成一个 Landau 型多项式，从而把"系数什么时候变号"看得一清二楚。

先把熵密度写成更便于展开的形式。令 $p_\uparrow=(1+m)/2$、$p_\downarrow=(1-m)/2$，则
$$
\frac{S(m)}{Nk_B}
=-p_\uparrow\ln p_\uparrow-p_\downarrow\ln p_\downarrow
=\ln 2-\frac{1}{2}\Big[(1+m)\ln(1+m)+(1-m)\ln(1-m)\Big].
$$
这里用到的是 $\ln(1+x)$ 在 $x=0$ 处的泰勒（Maclaurin）展开：
$$
\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\frac{x^4}{4}+O(x^5),\qquad |x|<1.
$$
你如果担心“是不是少了阶乘”，可以直接对照泰勒系数：对 $f(x)=\ln(1+x)$，
$$
f^{(n)}(x)=(-1)^{n-1}\frac{(n-1)!}{(1+x)^n}
\quad\Rightarrow\quad
\frac{f^{(n)}(0)}{n!}=(-1)^{n-1}\frac{1}{n}.
$$
因此代入 $x=\pm m$ 就得到
$$
\ln(1\pm m)=\pm m-\frac{m^2}{2}\pm\frac{m^3}{3}-\frac{m^4}{4}+O(m^5)
$$
接下来我们不是“直接跳到结果”，而是把它代回
$$
(1+m)\ln(1+m)+(1-m)\ln(1-m)
$$
并把前几阶系数算出来。一个省力的写法是先把 $(1\pm m)\ln(1\pm m)$ 自己展开：
$$
(1+m)\ln(1+m)
=\ln(1+m)+m\ln(1+m)
=m+\frac{m^2}{2}-\frac{m^3}{6}+\frac{m^4}{12}+O(m^5),
$$
$$
(1-m)\ln(1-m)
=\ln(1-m)-m\ln(1-m)
=-m+\frac{m^2}{2}+\frac{m^3}{6}+\frac{m^4}{12}+O(m^5).
$$
你会看到奇次项（$m,m^3,\dots$）严格抵消——这也符合 $h=0$ 时 “$m\to -m$ 对称” 的直觉：熵密度只能是 $m$ 的偶函数。于是
$$
(1+m)\ln(1+m)+(1-m)\ln(1-m)
=m^2+\frac{m^4}{6}+O(m^6).
$$
代回上一行
$$
\frac{S(m)}{Nk_B}
=\ln 2-\frac{1}{2}\Big[(1+m)\ln(1+m)+(1-m)\ln(1-m)\Big],
$$
立刻得到
$$
\frac{S(m)}{Nk_B}
=\ln 2-\frac{m^2}{2}-\frac{m^4}{12}+O(m^6).
$$

把它代回 $F=U-TS$，并使用上一段的
$$
\frac{U(m)}{N}\approx -\frac{1}{2}zJm^2-hm,
$$
在 $h=0$ 时就得到自由能密度的显式展开：
$$
\frac{F(m)}{N}
\approx
\underbrace{-k_BT\ln 2}_{\text{常数：$m$ 无关}}
\;+\;
\underbrace{\frac{1}{2}(k_BT-zJ)m^2}_{\text{$m^2$ 项：决定是否自发磁化}}
\;+\;
\underbrace{\frac{k_BT}{12}m^4}_{\text{$m^4$ 项：保证稳定}}
\;+\;O(m^6).
$$

现在“临界点是什么”就变成一个一眼可见的判据：**$m^2$ 项系数变号**。也就是
$$
\frac{1}{2}(k_BT-zJ)=0
\quad\Longrightarrow\quad
T_c^{\mathrm{MF}}=\frac{zJ}{k_B}\quad\text{（Swendsen Eq 31.56）}.
$$

在 $T>T_c$ 时，$m^2$ 系数为正，$m=0$ 是唯一的自由能极小点；在 $T<T_c$ 时，$m^2$ 系数为负，$m=0$ 变成不稳定点，自发出现两个对称的极小值（自发磁化）。

**为什么"系数变号"意味着"稳定性反转"？** 这可以从两个角度理解：

1. **几何直觉**：在 $m=0$ 附近，$F(m)$ 的形状由 $m^2$ 项主导。
   - 系数 $>0$：$F \propto +m^2$，开口向上的抛物线 → $m=0$ 是"碗底" → 稳定
   - 系数 $<0$：$F \propto -m^2$，开口向下的抛物线 → $m=0$ 是"山顶" → 不稳定
   - $m^4$ 项（系数恒正）在 $|m|$ 较大时"兜住"曲线，产生两个对称极小值。

2. **二阶导数检验**：稳定性条件是
   $$
   \frac{\partial^2 F}{\partial m^2}\bigg|_{m=0} = N(k_BT - zJ).
   $$
   - 若 $> 0$（$T > T_c$）：$m=0$ 是凹向上的极小值
   - 若 $< 0$（$T < T_c$）：$m=0$ 是凹向下的极大值
   - 临界点恰好是二阶导数为零的边界。

用上面的四次展开作近临界估计，最小点满足
$$
m_*^2 \approx -\frac{\frac{1}{2}(k_BT-zJ)}{2(k_BT/12)}
=3\frac{T_c-T}{T}
\approx 3\frac{T_c-T}{T_c}\quad(T\approx T_c),
$$
这就是平均场临界指数 $m_*\propto (T_c-T)^{1/2}$ 的来源。

---

## Signposts (深入阅读各个击破)

### 建议重点读：31.5（Mean-Field Approximation）
- **先读到“会复述”**：Eq 31.49（有效场）与 Eq 31.51（自洽方程）。
- **读到“不会踩坑”**：Eq 31.47 附近关于双计数的警告（这与自由能公式里那项 $\tfrac12NzJm^2$ 是一回事）。

---

## Critical Thinking (带着问题读)

1.  **为什么 1D Ising 模型没有相变？——平均场的第一次"翻车"**

    **开场悬念**：我们刚刚用平均场推导出相变的条件 $T_c = zJ/k_B$。如果 $z=2$（一维链），平均场预测 $T_c = 2J/k_B$。但这个预测**是错的**——一维 Ising 模型在任何 $T>0$ 都没有相变。这是平均场理论的第一次重大失败，也是理解其局限性的最佳案例。

    **"没有相变"意味着什么？** 相变的标志是**长程有序**：当你问"远处那个自旋跟我是否一致"时，答案在 $T<T_c$ 时应该是"大概率是"，在 $T>T_c$ 时是"完全随机"。物理上，这用**相关长度 $\xi$** 来刻画——它告诉你"有序的岛"能延伸多远。长程有序意味着 $\xi \to \infty$；没有相变意味着 $\xi$ 永远是有限的。

    **问题**：是什么在 1D 中"杀死"了长程有序？

    **答案：畴壁（domain wall）**。破坏有序的关键激发不是"翻一个自旋"，而是在链上制造"断点"——某条相邻键上出现 $\sigma_i \neq \sigma_{i+1}$。

    - **能量代价是 $O(1)$**：一条畴壁会让那一条键的能量从 $-J$ 变成 $+J$，代价是 $2J$。更关键的是：如果你翻转一整段长度为 $L$ 的自旋，链上只会出现两条畴壁，因此代价固定为
      $$
      \Delta E = 2\times(2J)=4J,
      $$
      与 $L$ 无关。这是 1D 的"致命缺陷"：制造更大规模的无序不会更贵。
      直观图像：`... + + + | - - - - - | + + + ...`（竖线处是两条畴壁）。区间内部的相邻自旋"一起取反"，最近邻乘积不变：$(-\sigma_i)(-\sigma_{i+1})=\sigma_i\sigma_{i+1}$。只有跨越边界的那两条键会从 $+1$ 变成 $-1$。

    - **熵收益随系统变大而增长**：两条畴壁可以放在链上的位置约有 $\binom{N}{2}\sim N^2$ 种，因此
      $$
      \Delta S \sim k_B\ln(N^2) = 2k_B\ln N.
      $$
      自由能变化
      $$
      \Delta F=\Delta E-T\Delta S \approx 4J-2k_BT\ln N.
      $$
      对任意 $T>0$，当 $N\to\infty$ 时 $\Delta F\to -\infty$：**熵永远赢**。

    **物理后果**：畴壁会以有限密度 $\rho$ 出现，把链切成有限长度的"岛"。精确计算给出
      $$
      \rho = \frac{1-\tanh(\beta J)}{2} > 0 \quad (\forall\, T>0).
      $$
      这个有限的磁畴长度 $\sim 1/\rho$ **正是相关长度 $\xi$**。由于 $\rho>0$ 对任意 $T>0$ 都成立，长程有序永远无法建立。

    **为什么平均场在这里失效？** 平均场假设每个自旋通过 $m$ 与"所有人"耦合，实际上假定了系统是一个连通的整体。但 1D 链已经被畴壁切碎成了互不沟通的孤岛，根本不存在那个能"统一指挥全场"的 $m$。平均场看见了平均值，却看不见这种**空间碎片化**。这就是为什么平均场预测 1D 有相变，而实际没有。

2.  **自洽方程的本质**
    这行方程
    $$
    m=\tanh\!\left(\beta(Jzm+h)\right)
    $$
    不是“解一个超越方程”这么简单，它是在表达一个**一致性要求**：你先假设全局磁化是 $m$，于是每个自旋看到的有效场就是 $h_{\mathrm{eff}}=Jzm+h$；但在这个场里单个自旋的平均值又必须是
    $$
    \langle\sigma\rangle=\tanh(\beta h_{\mathrm{eff}}).
    $$
    平均场要求“假设的平均”必须等于“算出来的平均”，所以必须满足 $m=\langle\sigma\rangle$，这就是自洽方程。

    把它写成“固定点”语言更直观：令
    $$
    f(m)\equiv \tanh\!\left(\beta(Jzm+h)\right),
    $$
    自洽方程就是 $m=f(m)$。这正是你在模块交互图里看到的“直线 $y=m$ 与曲线 $y=f(m)$ 的交点”。

    **为什么它像反馈循环？** 因为 $m$ 同时扮演两种角色：
    - 作为“群体平均”，它决定了每个人看到的场 $h_{\mathrm{eff}}=Jzm+h$；
    - 作为“个体平均选择”，它又是每个人在这个场下的 $\langle\sigma\rangle$。

    **为什么低温会"锁死"？** 看稳定性就够了：一个固定点 $m_*$ 是否稳定，取决于微小扰动会被放大还是被压回去。对迭代 $m\leftarrow f(m)$ 来说，稳定条件是
    $$
    |f'(m_*)|<1.
    $$
    在 $h=0$ 时，$m=0$ 这个解的导数为
    $$
    f'(0)=\beta Jz.
    $$
    这个 $\beta Jz$ 就是**反馈增益**——它告诉你：如果系统偏离 $m=0$ 一点点，响应会放大还是衰减。

    - **增益 $< 1$（高温）**：$m=0$ 稳定。物理上，高温意味着 $\tanh$ 曲线平缓（单自旋对有效场的响应弱），即使有小偏向，响应也比偏向本身小，偏差被"衰减"回去。
    - **增益 $> 1$（低温）**：$m=0$ 不稳定。低温时 $\tanh$ 曲线陡峭（单自旋强烈跟随有效场），任何小偏向都会得到比自身更大的响应，偏差被"放大"，系统被推向 $m\neq 0$ 的稳定解。

    > **术语澄清：两种"涨落"**
    > 
    > 你可能会问：平均场不是"忽略涨落"吗？为什么这里又说温度能抹平偏向？
    > 
    > 关键是区分两种涨落：
    > - **空间涨落（spatial fluctuations）**：邻居之间的相关性，如 $\langle\sigma_i\sigma_j\rangle \neq m^2$，畴壁、临界涨落等。平均场**忽略**这些。
    > - **热噪声（thermal noise）**：单个自旋在给定有效场下的随机取向，由 Boltzmann 分布 $\propto e^{\beta h_{\mathrm{eff}}\sigma}$ 给出。平均场**保留**这个。
    > 
    > 高温时"响应弱"不是因为有空间涨落，而是因为 $\tanh(\beta h_{\mathrm{eff}})$ 在小 $\beta$ 时接近线性、斜率小——单自旋对场"不敏感"。

    **总结：反馈增益的物理意义**
    
    平均场把复杂的 $N$ 体相互作用压缩成一个**单参数正反馈环路**：
    $$
    \text{假设 } m \;\to\; \text{产生有效场 } Jzm \;\to\; \text{单自旋响应 } \tanh(\beta Jzm) \;\to\; \text{得到新的 } m
    $$
    增益 $\beta Jz$ 决定这个环路是**自稳定**还是**自放大**。临界点 $T_c = zJ/k_B$（即 $\beta_c Jz = 1$）正是增益等于 1 的边界——从这里开始，对称性自发破缺。

---

## Urban Mapping: 社会动力学

Ising 模型是社会物理学的 $F=ma$。

| 统计物理 | 城市/社会系统 | 平均场视角 |
| :--- | :--- | :--- |
| **相互作用 $J$** | **外部性 (Externality)** | $J>0$: 硅谷集聚效应；$J<0$: 分散机制（如避免拥堵）。 |
| **自旋 $s_i$** | **二元决策** | 买房/不买，开车/地铁，信谣/辟谣。 |
| **平均场 $m$** | **价格 / 规范** | 我们不盯着每个人，只盯着**房价**或**社会舆论**。 |

### 深度映射：Schelling Segregation
- Schelling 模型本质上是一个**动态 Ising 模型**。
- **亚稳态 (Metastability)**: 每个人都追求自己舒服（局部能量极小），结果导致全城隔离（宏观极小）。一旦陷入这种状态，就像磁铁一旦充磁，很难退磁（磁滞回线）。
- **平均场失效**: 如果每个人只关心“全市平均肤色”，隔离不会发生。必须是“只关心邻居”（Locality），微小的偏好才会被放大为宏观的隔离。这是反对简单平均场政策的最强证据。
