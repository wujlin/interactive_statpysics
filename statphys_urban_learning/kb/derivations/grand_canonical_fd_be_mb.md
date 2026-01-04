---
type: derivation
title: 从巨配分函数到 Fermi–Dirac / Bose–Einstein / Maxwell–Boltzmann（占据数法）
tags: ['grand-canonical', 'quantum', 'occupation-number', 'fermi-dirac', 'bose-einstein', 'maxwell-boltzmann', 'M4']
prereq: ['巨正则系综 Grand canonical ensemble', '化学势 Chemical potential', '配分函数 Partition function']
source: ['Swendsen 2012 (Ch27: fermions/bosons)', 'standard statmech']
status: ready
---

## 一句话
对无相互作用量子气体，用单粒子能级的**占据数** \(\{n_r\}\) 表示多体微观态，可把巨配分函数写成能级乘积 \(\mathcal{Z}=\prod_r \sum_{n_r}e^{-\beta(\varepsilon_r-\mu)n_r}\)；占据数允许集合 \(\{0,1\}\)（费米）或 \(\{0,1,2,\dots\}\)（玻色）分别导出 Fermi–Dirac 与 Bose–Einstein，占据数很小时两者统一回到 Maxwell–Boltzmann。

## 0) 起点：M4 的基本定义（巨正则）
巨正则系综（自然变量 \((T,V,\mu)\)）给每个“微观态 \((x,N)\)”的权重
\[
p(x,N)\propto \exp[-\beta(E(x,N)-\mu N)],\qquad \beta\equiv \frac{1}{k_BT}.
\]
归一化常数（巨配分函数，记作 \(\mathcal{Z}\)）是
\[
\mathcal{Z}(T,V,\mu)=\sum_{N=0}^{\infty}\ \sum_{x\in\Omega_N}\exp[-\beta(E(x,N)-\mu N)].
\]
这就是 M4 Part 2 的“双重求和”：先对 \(N\) 求和，再对该 \(N\) 下的所有微观态求和。

> 接下来只做一件事：把“状态 \(x\)”改写成更贴近物理本质的描述，使 \(\mathcal{Z}\) 可算、可分解。

---

## 0.5) 为什么占据数 \(\{n_r\}\) 是合法的？（全同粒子）
如果粒子可区分，你必须追踪“谁在能级 1、谁在能级 2”：交换粒子标签会产生新的微观态。  
但对**全同粒子**（量子气体的基本设定），交换粒子标签不改变物理状态；可观测量不依赖“粒子 ID”。因此，“谁在哪里”的描述天然包含冗余信息；**唯一不冗余的微观态描述**是：每个单粒子能级（或模式）\(r\) 上有多少粒子。

这就是占据数表示：用 \(n_r\) 表示能级 \(r\) 上的粒子数。

## 0.6) 为什么要这么做？（读者收益：把变维数问题变成固定“盒子”）
在巨正则里 \(N\) 在涨落。若沿用“粒子视角”，微观态空间维数 \(6N\) 会随 \(N\) 变化，把它塞进 \(\sum_N\sum_x\) 的统计求和里往往不可控。  
占据数表示的好处是：能级/模式集合 \(\{r\}\) 是固定的 —— 无论 \(N\) 多大，你只是在问“一排固定的盒子各装几个”。对无相互作用系统，这会进一步带来**解耦**：每个能级独立决定自己装 \(0,1\) 或 \(0,1,2,\dots\) 个粒子。

## 1) 关键换元：用占据数 \(\{n_r\}\) 标记微观态
对无相互作用的理想量子气体，多体微观态最自然的标记不是“粒子 1 在哪里、粒子 2 在哪里…”，而是：

1. 先选一组单粒子本征态（能级）\(\{r\}\)，其能量为 \(\varepsilon_r\)；
2. 用 \(n_r\) 表示第 \(r\) 个单粒子态上有多少粒子。

于是一个多体微观态可写成
\[
x\quad \Longleftrightarrow\quad \{n_r\}_{r}.
\]

并且总粒子数与总能量变为
\[
N=\sum_r n_r,\qquad
E=\sum_r n_r\,\varepsilon_r.
\]

**这一步用到的“无相互作用”含义是：**多体能量是单粒子能量的线性和；若存在相互作用，\(E\) 通常会出现 \(n_r n_s\) 等耦合项，从而后面的“乘积分解”不再成立。

---

## 2) 先把指数写成能级求和：为乘积分解做铺垫
把上面的 \(E\) 与 \(N\) 代入巨正则指数：
\[
E-\mu N
=\sum_r n_r\varepsilon_r-\mu\sum_r n_r
=\sum_r n_r(\varepsilon_r-\mu).
\]
因此单个占据构型 \(\{n_r\}\) 的权重是
\[
\exp[-\beta(E-\mu N)]
=\exp\!\left[-\beta\sum_r n_r(\varepsilon_r-\mu)\right].
\]
利用指数函数的基本性质 \(e^{\sum_r a_r}=\prod_r e^{a_r}\)，得到
\[
\exp\!\left[-\beta\sum_r n_r(\varepsilon_r-\mu)\right]
=\prod_r \exp[-\beta\,n_r(\varepsilon_r-\mu)].
\]

> 这就是关键衔接点：“能量可加（求和）” \(\Rightarrow\) “指数权重可分解（乘积）”。

---

## 3) 真正的乘积分解：把对所有 \(\{n_r\}\) 的求和拆开
把“对微观态求和”改写为“对所有占据数求和”：
\[
\mathcal{Z}
=\sum_{\{n_r\}} \prod_r \exp[-\beta\,n_r(\varepsilon_r-\mu)].
\]

这里的 \(\{n_r\}\) 是一组独立的求和变量（每个能级都有自己的占据数）。因此多重求和可拆成各能级求和的乘积（这是离散版的“Fubini/乘积测度”直觉）：
\[
\sum_{\{n_r\}}\prod_r f_r(n_r)=\prod_r \sum_{n_r} f_r(n_r).
\]
令 \(f_r(n_r)=\exp[-\beta\,n_r(\varepsilon_r-\mu)]\)，得到
\[
\boxed{
\mathcal{Z}
=\prod_r \mathcal{Z}_r,\qquad
\mathcal{Z}_r \equiv \sum_{n_r\in\mathcal{A}} \exp[-\beta\,n_r(\varepsilon_r-\mu)].
}
\]
其中 \(\mathcal{A}\) 是允许的占据数集合：
- **费米子**（Fermi）：\(\mathcal{A}=\{0,1\}\)（泡利不相容，单粒子态最多 1 个；见：[[Fermi–Dirac 分布 Fermi-Dirac distribution]]）
- **玻色子**（Bose）：\(\mathcal{A}=\{0,1,2,\dots\}\)（见：[[Bose–Einstein 分布 Bose-Einstein distribution]]）

> 这就是“无相互作用系统里 \(\mathcal{Z}\) 可分解为能级乘积”的严格版本。

---

## 4) 先算单能级的 \(\mathcal{Z}_r\)（费米 vs 玻色只差在允许的 \(n_r\)）
引入活度（fugacity；见：[[活度 Fugacity]]）
\[
z\equiv e^{\beta\mu},
\qquad
e^{-\beta(\varepsilon_r-\mu)}=z\,e^{-\beta\varepsilon_r}.
\]

### 4.1 费米子：\(\mathcal{A}=\{0,1\}\)
\[
\mathcal{Z}_r^{(F)}=\sum_{n_r=0}^{1} e^{-\beta n_r(\varepsilon_r-\mu)}
=1+e^{-\beta(\varepsilon_r-\mu)}
=\boxed{1+z e^{-\beta\varepsilon_r}}.
\]

### 4.2 玻色子：\(\mathcal{A}=\{0,1,2,\dots\}\)
\[
\mathcal{Z}_r^{(B)}=\sum_{n_r=0}^{\infty} e^{-\beta n_r(\varepsilon_r-\mu)}
=\sum_{n=0}^{\infty} \left(e^{-\beta(\varepsilon_r-\mu)}\right)^n.
\]
这是几何级数。若 \(|e^{-\beta(\varepsilon_r-\mu)}|<1\)（对实参数就是 \(e^{-\beta(\varepsilon_r-\mu)}<1\)），则
\[
\mathcal{Z}_r^{(B)}
=\frac{1}{1-e^{-\beta(\varepsilon_r-\mu)}}
=\boxed{\frac{1}{1-z e^{-\beta\varepsilon_r}}}.
\]

**收敛条件的物理含义：**需要对所有能级 \(r\) 都有 \(z e^{-\beta\varepsilon_r}<1\)，等价于
\[
\mu<\min_r \varepsilon_r \equiv \varepsilon_0,
\]
这是玻色凝聚讨论里反复出现的限制（化学势不能超过最低能级）。

---

## 5) 从 \(\mathcal{Z}_r\) 推出平均占据数 \(\langle n_r\rangle\)
由于无相互作用时 \(\mathcal{Z}\) 对能级分解，单个能级的边缘分布是独立的：
\[
P_r(n_r)=\frac{e^{-\beta n_r(\varepsilon_r-\mu)}}{\mathcal{Z}_r}.
\]
因此平均占据数就是一个一维加权平均：
\[
\langle n_r\rangle
=\sum_{n_r\in\mathcal{A}} n_r\,P_r(n_r)
=\frac{\sum_{n_r\in\mathcal{A}} n_r\,e^{-\beta n_r(\varepsilon_r-\mu)}}{\sum_{n_r\in\mathcal{A}} e^{-\beta n_r(\varepsilon_r-\mu)}}.
\]

### 5.1 费米–狄拉克（Fermi–Dirac）
费米子只需算 \(n_r=0,1\) 两项。

分母：
\[
\sum_{n=0}^1 e^{-\beta n(\varepsilon_r-\mu)}=1+e^{-\beta(\varepsilon_r-\mu)}.
\]
分子：
\[
\sum_{n=0}^1 n\,e^{-\beta n(\varepsilon_r-\mu)}=0\cdot 1+1\cdot e^{-\beta(\varepsilon_r-\mu)}=e^{-\beta(\varepsilon_r-\mu)}.
\]
因此
\[
\langle n_r\rangle_F
=\frac{e^{-\beta(\varepsilon_r-\mu)}}{1+e^{-\beta(\varepsilon_r-\mu)}}
=\boxed{\frac{1}{e^{\beta(\varepsilon_r-\mu)}+1}}.
\]

### 5.2 玻色–爱因斯坦（Bose–Einstein）
令
\[
q\equiv e^{-\beta(\varepsilon_r-\mu)}.
\]
分母（几何级数）：
\[
\sum_{n=0}^{\infty} q^n=\frac{1}{1-q}.
\]
分子可由对几何级数求导得到：
\[
\sum_{n=0}^{\infty} n q^n
=q\frac{d}{dq}\left(\sum_{n=0}^{\infty} q^n\right)
=q\frac{d}{dq}\left(\frac{1}{1-q}\right)
=\frac{q}{(1-q)^2}.
\]
因此
\[
\langle n_r\rangle_B
=\frac{\frac{q}{(1-q)^2}}{\frac{1}{1-q}}
=\frac{q}{1-q}
=\boxed{\frac{1}{e^{\beta(\varepsilon_r-\mu)}-1}}.
\]

### 5.3 统一写法
把两条放在一起：
\[
\boxed{
\langle n_r\rangle = \frac{1}{e^{\beta(\varepsilon_r-\mu)}\pm 1}
}
\]
上号（\(+\)）对应费米子，下号（\(-\)）对应玻色子。

---

## 6) 经典极限：为什么会回到 Maxwell–Boltzmann
“经典极限”的操作性表述是：每个单粒子态的平均占据数都很小，
\[
\langle n_r\rangle \ll 1.
\]
对上面的 FD/BE 形式，这等价于
\[
e^{\beta(\varepsilon_r-\mu)}\gg 1
\quad\Longleftrightarrow\quad
z e^{-\beta\varepsilon_r}\ll 1.
\]
于是
- 费米：\(\frac{1}{e^{\beta(\varepsilon-\mu)}+1}\approx e^{-\beta(\varepsilon-\mu)}\)
- 玻色：\(\frac{1}{e^{\beta(\varepsilon-\mu)}-1}\approx e^{-\beta(\varepsilon-\mu)}\)

两者统一到 [[Maxwell–Boltzmann 分布 Maxwell-Boltzmann distribution]] 的指数形式：
\[
\boxed{
\langle n_r\rangle \approx e^{-\beta(\varepsilon_r-\mu)} = z e^{-\beta\varepsilon_r}.
}
\]

---

## 7) Maxwell–Boltzmann 密度公式（把“单态占据”变成“空间密度”）
若你想从“单粒子态占据”走到更常用的“空间密度 \(n(\mathbf x)\)”，可在经典极限下把单粒子能量写成
\[
\varepsilon(\mathbf p,\mathbf x)=\frac{\mathbf p^2}{2m}+U(\mathbf x).
\]
此时局域相空间分布（每个相空间元的平均占据）具有 Maxwell–Boltzmann 形状：
\[
f(\mathbf p,\mathbf x)\propto z\,\exp\!\left[-\beta\left(\frac{\mathbf p^2}{2m}+U(\mathbf x)\right)\right].
\]
把比例常数写成相空间量子体积 \(h^3\) 的形式（使密度有正确量纲），可取
\[
f(\mathbf p,\mathbf x)=\frac{z}{h^3}\exp\!\left[-\beta\left(\frac{\mathbf p^2}{2m}+U(\mathbf x)\right)\right].
\]

空间粒子数密度是对动量积分：
\[
n(\mathbf x)=\int d^3p\; f(\mathbf p,\mathbf x)
=\int \frac{d^3p}{h^3}\;z\,e^{-\beta\left(\frac{\mathbf p^2}{2m}+U(\mathbf x)\right)}.
\]
把 \(U(\mathbf x)\) 提出来：
\[
n(\mathbf x)=z\,e^{-\beta U(\mathbf x)}\int \frac{d^3p}{h^3}\;e^{-\beta\frac{\mathbf p^2}{2m}}.
\]
动量高斯积分为
\[
\int d^3p\;e^{-\beta\frac{\mathbf p^2}{2m}}
=(2\pi m/\beta)^{3/2}=(2\pi m k_B T)^{3/2}.
\]
定义热德布罗意波长（thermal de Broglie wavelength）
\[
\lambda_T\equiv \frac{h}{\sqrt{2\pi m k_B T}},
\quad\Rightarrow\quad
\frac{1}{\lambda_T^3}=\frac{(2\pi m k_BT)^{3/2}}{h^3}.
\]
于是得到常用的 Maxwell–Boltzmann 密度公式：
\[
\boxed{
n(\mathbf x)=\frac{z}{\lambda_T^3}\,e^{-\beta U(\mathbf x)}
=\frac{1}{\lambda_T^3}\,e^{\beta(\mu-U(\mathbf x))}.
}
\]
特别地，若 \(U(\mathbf x)\equiv 0\)（均匀系统），则
\[
n=\frac{1}{\lambda_T^3}e^{\beta\mu}
\quad\Longleftrightarrow\quad
\mu=k_BT\ln(n\lambda_T^3),
\]
这正是 M4 习题里常见的理想气体化学势关系（忽略内部简并度等常数因子）。

---

## 8) 串联小结（把“分布族谱”钉在一条线上）
1. **巨正则定义**：\(p(x,N)\propto e^{-\beta(E-\mu N)}\)，归一化是 \(\mathcal{Z}\)。  
2. **无相互作用 \(\Rightarrow\) 占据数表示**：\(E=\sum_r n_r\varepsilon_r,\;N=\sum_r n_r\)。  
3. **可加 \(\Rightarrow\) 可分解**：\(e^{-\beta\sum_r n_r(\varepsilon_r-\mu)}=\prod_r e^{-\beta n_r(\varepsilon_r-\mu)}\Rightarrow \mathcal{Z}=\prod_r \sum_{n_r}e^{-\beta(\varepsilon_r-\mu)n_r}\)。  
4. **统计只在允许的 \(n_r\) 上不同**：\(\{0,1\}\Rightarrow\) Fermi–Dirac；\(\{0,1,2,\dots\}\Rightarrow\) Bose–Einstein。  
5. **占据数小 \(\Rightarrow\) 经典极限**：两者都回到 Maxwell–Boltzmann 的 \(e^{-\beta(\varepsilon-\mu)}\)。  

---

## Source anchors
- Swendsen Eq 27.31 / 27.42：\(\mathcal{Z}=\prod_{\alpha}\sum_{n_{\alpha}}\exp[-\beta(\epsilon_{\alpha}-\mu)n_{\alpha}]\)
- Swendsen Eq 27.48–27.50：玻色子单能级求和与 \(\langle n_{\alpha}\rangle=(e^{\beta(\epsilon_{\alpha}-\mu)}-1)^{-1}\)
- Swendsen Eq 27.51–27.53：费米子单能级求和与 \(\langle n_{\alpha}\rangle=(e^{\beta(\epsilon_{\alpha}-\mu)}+1)^{-1}\)
- Swendsen Eq 27.54：统一写法 \(\langle n_{\alpha}\rangle=(e^{\beta(\epsilon_{\alpha}-\mu)}\pm 1)^{-1}\)
- Swendsen Eq 27.38–27.39：Maxwell–Boltzmann 统计下的 \(\mathcal{Z}\) 与 \(\ln\mathcal{Z}\)（经典极限的一种表达）
