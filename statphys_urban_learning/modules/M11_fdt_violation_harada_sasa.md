# M11 等号断裂之后：从 FDT 违背读出可见耗散

一个胶体粒子在水中持续抖动，并不意味着它在持续消耗外部能量。水分子一面随机撞击粒子，一面通过黏滞阻力带走运动能量；在平衡态下，这两种作用来自同一个热浴，因而被涨落—耗散定理（FDT）精确绑定。

向水中加入游动细菌后，胶体粒子的轨迹会变得更剧烈。但“抖得更大”本身还不能识别非平衡：升高水温也会增强涨落。真正区分两种机制的是响应——如果涨落增加了，而粒子对同一个微弱外力的响应没有按照同一温度同步改变，那么平衡 FDT 的等号就断裂了。

真正的测量问题是：涨落中有多少部分不能由热浴温度与黏滞响应解释，这部分差值又能否转化为具有功率单位的耗散率？

Harada–Sasa 等式给出肯定答案，但答案有明确边界：它首先测量被观测自由度向平衡热浴传递的耗散，而不是自动恢复所有隐藏自由度的总产熵。

## 1. 平衡基线：同一个热浴同时决定涨落与响应

考虑一个被光阱束缚的胶体粒子。位置记为 $x(t)$，光阱刚度为 $\kappa$，水的黏滞阻力系数为 $\gamma$。在过阻尼近似下，平衡动力学为

$$
\gamma \dot x(t)=-\kappa x(t)+\xi_T(t)+h(t),
$$

其中 $h(t)$ 是实验者施加的微弱探测力，热噪声满足

$$
\langle \xi_T(t)\xi_T(t')\rangle
=2\gamma k_BT\,\delta(t-t').
$$

这条噪声关联不是任意参数化。温度 $T$、摩擦 $\gamma$ 与热噪声强度属于同一个热浴模型；改变其中一个而不改变另外两个，通常就不再描述原来的平衡系统。

记稳态位置涨落为

$$
\delta x(t)=x(t)-\langle x\rangle,
$$

并定义连接关联谱

$$
\tilde C_{\delta x\delta x}(\omega)
=\int_{-\infty}^{\infty}dt\,e^{i\omega t}
\langle\delta x(t)\delta x(0)\rangle.
$$

实验上需要分别测量两个量：

- **位置涨落谱** $\tilde C_{\delta x\delta x}(\omega)$：不施加探测力，记录稳态轨迹并估计连接位置自相关的傅里叶变换；
- **位置响应** $\chi_x(\omega)$：施加足够弱的周期力，测量平均位置在同一频率上的振幅与相位。

本章采用 $\tilde f(\omega)=\int dt\,e^{i\omega t}f(t)$。线性响应为

$$
\chi_x(\omega)=\frac{1}{\kappa-i\gamma\omega},
\qquad
\chi_x''(\omega)=\frac{\gamma\omega}{\kappa^2+\gamma^2\omega^2}.
$$

平衡 FDT 把独立测得的涨落与响应联系起来：

$$
\tilde C_{\delta x\delta x}^{\mathrm{eq}}(\omega)
=\frac{2k_BT}{\omega}\chi_x''(\omega)
=\frac{2\gamma k_BT}{\kappa^2+\gamma^2\omega^2}.
$$

这条等式提供的不是“涨落越大，响应一定越大”的模糊趋势，而是一条逐频率、可被实验否证的定量基线。

## 2. 最小非平衡模型：在热噪声之外加入持续驱动

细菌撞击、分子马达或外部随机驱动都可能向探针注入额外机械力。最小有效模型是在原方程中加入一个均值为零、具有相关时间的活性力 $\xi_A(t)$：

$$
\gamma \dot x(t)
=-\kappa x(t)+\xi_T(t)+\xi_A(t)+h(t),
$$

$$
\langle \xi_A(t)\xi_A(t')\rangle
=\frac{A}{2\tau_A}e^{-|t-t'|/\tau_A}.
$$

$A$ 控制活性力谱的总尺度，$\tau_A$ 是持续时间。相应的两侧功率谱为

$$
\tilde C_{\xi_A\xi_A}(\omega)
=\frac{A}{1+\omega^2\tau_A^2}.
$$

这里的“活性噪声”是外部驱动的有效描述。它没有被假设为温度 $T$ 的热噪声，因此不需要与 $\gamma$ 满足 Einstein 关系；但这个简化也意味着模型没有描述细菌内部如何消耗化学能，不能仅凭 $A$ 和 $\tau_A$ 重建完整代谢账本。

## 3. 等号为什么断裂：响应不变，关联谱增加

加性活性力改变了轨迹统计，却没有改变当前线性模型的确定性传播算子。因此位置响应仍然是

$$
\chi_x(\omega)=\frac{1}{\kappa-i\gamma\omega}.
$$

这不是所有活性浴的普遍结论。如果活性介质同时改变有效黏度、记忆核或粒子间耦合，响应也会改变；这里“不变”来自加性外力这一具体建模选择。

位置涨落谱则接收两个独立噪声源的贡献：

$$
\tilde C_{\delta x\delta x}(\omega)
=|\chi_x(\omega)|^2
\left[
2\gamma k_BT+
\frac{A}{1+\omega^2\tau_A^2}
\right].
$$

将平衡响应预测从总涨落谱中减去，得到位置形式的 FDT 违背谱

$$
\Delta_x(\omega)
\equiv
\tilde C_{\delta x\delta x}(\omega)
-\frac{2k_BT}{\omega}\chi_x''(\omega)
=\frac{A}
{(\kappa^2+\gamma^2\omega^2)(1+\omega^2\tau_A^2)}.
$$

在这个单自由度、线性、加性 OU 活性力模型中，$\Delta_x(\omega)\ge 0$，而且它恰好等于被光阱和摩擦滤波后的活性力谱。一般耦合系统、延迟系统或部分观测下，频率分辨项不必逐频非负；第二定律约束的是定义正确的总耗散，而不是任意画法下的每一个谱点。

## 4. 从谱差到功率：不能漏掉 $\gamma\omega^2$

$\Delta_x(\omega)$ 仍然不是耗散功率。它的位置谱量纲为“位置平方乘时间”；直接对频率积分只会得到位置方差量级。要把位置涨落转化为黏滞耗散，必须先转成速度，再乘摩擦系数。

令 $v=\dot x$。速度关联谱和速度响应分别满足

$$
\tilde C_{\delta v\delta v}(\omega)
=\omega^2\tilde C_{\delta x\delta x}(\omega),
\qquad
\operatorname{Re}\tilde R_v(\omega)
=\frac{\gamma\omega^2}{\kappa^2+\gamma^2\omega^2}.
$$

以下把 $\dot Q_{\mathrm{probe}}>0$ 定义为**探针向热浴传递热量**。零平均漂移的过阻尼稳态下，Harada–Sasa 等式写成

$$
\dot Q_{\mathrm{probe}}
=\gamma\int_{-\infty}^{\infty}\frac{d\omega}{2\pi}
\left[
\tilde C_{\delta v\delta v}(\omega)
-2k_BT\operatorname{Re}\tilde R_v(\omega)
\right].
$$

使用位置谱时，同一等式为

$$
\boxed{
\dot Q_{\mathrm{probe}}
=\gamma\int_{-\infty}^{\infty}\frac{d\omega}{2\pi}
\,\omega^2\Delta_x(\omega)
}.
$$

量纲检查直接说明了权重的必要性：

$$
[\gamma]\,[\omega^2]\,[\Delta_x]\,[d\omega]
=\frac{\text{力}\cdot\text{时间}}{\text{位置}}
\frac{1}{\text{时间}^2}
(\text{位置}^2\cdot\text{时间})
\frac{1}{\text{时间}}
=\frac{\text{能量}}{\text{时间}}.
$$

因此，FDT 的“误差”只有经过与动力学和浴耦合一致的权重后，才成为热流或耗散功率。

## 5. 能量账本：解析积分给出探针可见耗散

将本模型的 $\Delta_x(\omega)$ 代入 Harada–Sasa 等式，可以完成解析积分：

$$
\dot Q_{\mathrm{probe}}
=\gamma A\int_{-\infty}^{\infty}\frac{d\omega}{2\pi}
\frac{\omega^2}
{(\kappa^2+\gamma^2\omega^2)(1+\omega^2\tau_A^2)}
=\boxed{
\frac{A}{2\tau_A(\gamma+\kappa\tau_A)}
}.
$$

这个结果描述的能量链是

$$
\text{未建模的活性能源}
\longrightarrow
\xi_A
\longrightarrow
\text{探针运动}
\longrightarrow
\text{水浴中的黏滞热}.
$$

它给出三个直接检查：$A=0$ 时额外耗散为零；增大 $\kappa$ 会抑制探针运动和可见耗散；当 $\tau_A\to 0$ 且保持 $A$ 不变时，过阻尼模型出现高频发散，提示必须恢复惯性、介质记忆或实验带宽，而不能把有效模型无限外推到短时间尺度。

### 交互：把“多出来的涨落”变成频率分辨的功率

<InteractiveConcept type="active-fdt-spectrum" />

上图先比较总位置谱与平衡响应预测，再显示 $\gamma\omega^2\Delta_x(\omega)$。活性持续时间决定耗散集中在哪个频段；探针耗散谱的峰值位于

$$
\omega_{\mathrm{peak}}=\sqrt{\frac{\kappa}{\gamma\tau_A}}.
$$

这说明 Harada–Sasa 不只给出一个总数，还能定位哪些时间尺度正在承担可见耗散。

## 6. 这个等式测到了什么，又漏掉了什么？

**它测到的是探针自由度向已知平衡热浴的稳态热流。** 如果探针平均漂移不为零，完整公式还包含 $\gamma\langle v\rangle^2$；本章的谐振阱稳态满足 $\langle v\rangle=0$，所以该项消失。

**它不自动等于活性系统的全部能量消耗。** 细菌可以把大量化学能耗散在鞭毛马达、内部代谢和未撞击探针的流体运动中。只观测一个胶体粒子时，这些通道是隐藏的；$\dot Q_{\mathrm{probe}}$ 是投影到该探针及其热浴耦合上的可见耗散。

**把热流写成 $T\dot S$ 还需要热力学条件。** 对温度为 $T$ 的单一平衡热浴，探针排入浴中的热流对应环境熵流 $\dot Q_{\mathrm{probe}}/T$。要把它提升为完整系统总熵产生率，还必须纳入所有驱动、热浴和隐藏自由度，并明确它们的时间反演与局部细致平衡结构。

**老化系统属于另一类问题。** 玻璃老化时关联和响应分别依赖两个时间，时间平移不变性与稳态频谱都可能失效。此时可以研究两时间 FDT 比或有效温度，但不能未经修改地套用本章的稳态谱积分。

## 7. 从有限数据估计耗散

真实实验只覆盖有限时间与频率范围。一个可复核的测量流程是：

1. 用被动标定或独立实验确定 $T$、$\kappa$ 与 $\gamma$；
2. 在无探测力时记录稳态轨迹，估计 $\tilde C_{\delta x\delta x}(\omega)$；
3. 施加足够弱的多频扰动，独立估计 $\chi_x(\omega)$；
4. 只在涨落谱与响应都可信的共同频段构造 $\Delta_x(\omega)$；
5. 积分 $\gamma\omega^2\Delta_x$，并报告有限带宽、采样混叠和参数标定造成的不确定性。

过阻尼轨迹在无限带宽下不可微，因此不要分别估计两个各自发散的大数值项再相减。实验上应使用同一带宽与离散化处理关联和响应，并检验积分对截止频率是否稳定。

## 8. 城市系统可以借用什么？

城市动力学可以借用“自发波动与受控响应应当分开测量”这一实验设计。例如，同一条走廊的日常流量方差很大，并不自动说明它对定价或信号控制更敏感；需要把自然波动与小扰动下的平均响应分别估计，才能识别模型遗漏的驱动、非平稳性或行为反馈。

但城市系统通常没有由微观热浴定义的 $T$、$\gamma$ 和热流。因此，涨落—响应不匹配可以作为模型诊断量，却不能仅凭形式相似就乘上一个“有效温度”并报告瓦特或物理熵产生率。这里可以迁移的是测量逻辑，不是 Harada–Sasa 的热力学单位。

## 9. 核心答案：FDT 的差值是一份可校准的局部能量账本

平衡 FDT 用热浴温度和线性响应逐频预测连接涨落谱；活性驱动使观测涨落偏离这条基线。Harada–Sasa 等式并不把任意“谱差”直接称为能量，而是用 $\gamma\omega^2$ 将位置谱差换算为探针向热浴传递的功率。

在本章的线性加性模型中，谱差逐频非负，解析积分精确给出 $\dot Q_{\mathrm{probe}}$。更一般的系统不保证每个频率点都非负，有限带宽和部分观测也会限制可恢复的耗散。

因此，Harada–Sasa 的实验意义不是用一条探针轨迹恢复整个活性系统，而是把一个可见耗散通道变成可校准、可分频的能量测量。增加独立探针或扩展观测自由度，才能逐步扩大这份账本覆盖的范围。

---

## 10. 资源与前置关系

### 模块关系

- [M5](M5_fluctuation_response_correlation.md) 建立平衡态“涨落如何预测响应”的基线；
- [M9](M9_fokker_planck_langevin.md) 给出本章使用的光阱 OU 动力学与轨迹—分布对应；
- [M10](M10_nonequilibrium_steady_state_entropy_production.md) 从概率流与时间反演定义不可逆性；
- M11 回答当完整概率流不可见时，怎样从涨落与响应的差值测量一个可见自由度的耗散。

### 复现入口

- 解析谱与模拟：`exercises/src/active_fdt.py`
- 可复现实验：`exercises/notebooks/E11_active_fdt_harada_sasa.ipynb`
- 自动测试：`exercises/tests/test_active_fdt.py`

既有交互与 Python 接口为兼容代码仍使用参数名 `k`；它对应正文中的光阱刚度 $\kappa$。

测试对应三条物理事实：纯热模型逐频满足 FDT；活性谱差等于滤波后的活性力谱；带权谱积分与闭式耗散率一致。

### 核心文献

- [Seminal papers](/references/seminal_papers)：`SP-M11-HaradaSasa2005`、`SP-M11-HaradaSasa2006`、`SP-M11-WuLibchaber2000`。

## 11. Checklist

- [ ] 能说明为什么“涨落变大”本身不能区分升温与活性驱动；
- [ ] 能分别写出位置关联谱、位置响应和 FDT 违背谱；
- [ ] 能用量纲说明 Harada–Sasa 的位置谱形式为什么需要 $\gamma\omega^2$；
- [ ] 能推导 $\dot Q_{\mathrm{probe}}=A/[2\tau_A(\gamma+\kappa\tau_A)]$；
- [ ] 能区分探针可见耗散、环境熵流与完整系统总熵产生；
- [ ] 能说明为什么城市中的涨落—响应不匹配通常只是诊断量，而不是物理功率。
