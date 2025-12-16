# Reading Guide: Risken (The Fokker-Planck Equation) Intro

> **Type**: Reading Guide
> **Source**: (External Textbook)
> **Topics**: SDE, Langevin Equation, Fokker-Planck Equation

## TL;DR (30秒概览)
Swendsen 书里对随机动力学讲得比较少，而 Risken 的这本书是该领域的圣经。
我们只读 **Chapter 1 (Introduction)**。
核心矛盾：如何描述一个被随机力踢来踢去的粒子？
- 方法 A (Langevin): 描述**轨迹** $x(t)$。
- 方法 B (FP): 描述**概率密度** $P(x,t)$。
Risken 展示了这两者是等价的。

## Key Equations (公式锚点)

- **Eq 1.X**: Langevin Equation
  \[ \dot{v} = -\gamma v + \Gamma(t) \]
  - *含义*: 牛顿定律 + 随机力。

- **Eq 1.X**: Fokker-Planck Equation
  \[ \frac{\partial P}{\partial t} = -\frac{\partial}{\partial v}(D^{(1)} P) + \frac{\partial^2}{\partial v^2}(D^{(2)} P) \]
  - *含义*: 经典的“漂移-扩散”方程。

## Signposts (阅读路标)

- **Section 1.2**: **Brownian Motion**
  - 看他如何定义白噪声 $\langle \Gamma(t)\Gamma(t') \rangle = 2\gamma k_B T \delta(t-t')$。

- **Kramers-Moyal Expansion**:
  - 稍微浏览一下（不用深究），理解 FP 方程原来是从 Master Equation 泰勒展开得来的。

## Urban Mapping
- **房价演化**: 把房价看作是受到“供需漂移”和“政策/情绪噪声”驱动的随机变量。
