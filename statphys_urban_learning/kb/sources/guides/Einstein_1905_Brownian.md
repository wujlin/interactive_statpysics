# Reading Guide: Einstein (1905) Brownian Motion

> **Type**: Reading Guide
> **Source**: [[SP-M5-Einstein1905-Brownian]]
> **Topics**: Fluctuation-Dissipation, Diffusion, Atom Existence

## TL;DR (30秒概览)
这是历史上最漂亮的论文之一。Einstein 不仅解释了布朗运动，更重要的是他建立了一个深刻的联系：
微观的**涨落**（扩散 $D$）与宏观的**耗散**（粘滞系数/通过 Stoke's law 关联的迁移率）必须成正比。
这就是 $D = k_B T \mu$。如果你只读一篇物理原始文献，请读这一篇。

## Key Logic (核心逻辑)

1. **Osmotic Pressure Argument**:
   - 假设悬浮颗粒像是气体分子，产生渗透压 $P = \rho RT/N_A$。
   - 渗透压驱动颗粒扩散。

2. **Stokes' Law Argument**:
   - 颗粒在液体中运动受到阻力 $f = 6\pi \eta r v$。
   - 达到动态平衡时，扩散流 = 漂移流。

3. **Conclusion**:
   \[ \langle x^2 \rangle = \frac{RT}{N_A} \frac{1}{3\pi \eta r} t \]
   - 这个公式极其重要，因为所有量都是可测的，除了 $N_A$。Perrin 后来用这个公式测出了 Avogadro 常数。

## Signposts (阅读路标)

- **Introduction**:
  - 看 Einstein 怎么谦虚地说 "It is possible that..."。

- **Section 4**:
  - 正式推导扩散方程 $\frac{\partial f}{\partial t} = D \frac{\partial^2 f}{\partial x^2}$。注意他用了 "Coarse-graining" 的泰勒展开思想，这是 Fokker-Planck 方程的雏形。

## Critical Thinking (带着问题读)
1. 为什么 Einstein 即使没看到原子，也确信原子存在？（因为没有原子就没有随机涨落）。
2. 这个逻辑怎么套用到股票市场？（价格的波动率 $\sigma$ 与市场的流动性 $\mu$ 有关吗？Kyle's Lambda）。

## Urban Mapping
- **出行分布**: 人们在城市里的随机行走（Lévy Flight）是否也可以用类似的扩散方程描述？
