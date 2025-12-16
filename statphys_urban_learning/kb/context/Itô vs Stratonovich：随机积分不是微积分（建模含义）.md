---
type: context
title: Itô vs Stratonovich：随机积分不是微积分（建模含义）
tags: ["context", "history", "sde", "ito", "stratonovich", "M9"]
prereq: ["Langevin 方程 Langevin equation", "Euler–Maruyama 数值模拟", "Fokker-Planck 方程 Fokker-Planck equation"]
source: ["Itô 1944", "Stratonovich 1966"]
status: ready
---

## 一句话
- 随机微分方程的“积分”不是普通微积分：当噪声是白噪声极限时，**离散化约定**会改变漂移项的含义；Itô 与 Stratonovich 的差别不是记号，而是建模与数值方法必须显式声明的假设。

## 关键矛盾：同一个符号写法，可能对应不同物理模型
对确定性微分方程，\(\int f(x)\,dx\) 的定义唯一；但对含噪声项的 SDE，\(\Delta W\sim \mathcal N(0,dt)\) 的尺度是 \(\sqrt{dt}\)，会让“高阶小量”变得不可忽略。  
结果是：你把噪声项在每个小步里取 **左端点**、**中点**还是别的规则，会得到不同的连续极限。

## 两种约定（最小写法 + 一条转换公式）
- **Itô（左端点）**：Euler–Maruyama 对应的约定
  \[
  X_{t+dt}=X_t+a(X_t)\,dt+b(X_t)\,\Delta W.
  \]
- **Stratonovich（中点）**：更接近“平滑噪声极限”的约定
  \[
  X_{t+dt}=X_t+a(X_{t+\frac{dt}{2}})\,dt+b(X_{t+\frac{dt}{2}})\,\Delta W.
  \]

同一条过程的两种写法之间有一条关键换算（1D 情形）：
\[
a_{\text{Itô}}(x)=a_{\text{Strat}}(x)+\tfrac12 b(x)b'(x).
\]
也就是说：**乘性噪声** \(b(x)\) 会生成额外漂移项。

## 何时用哪个（经验法则，够你做研究不踩坑）
- 若你的噪声是“条件期望意义下的白噪声驱动”（增量独立），并且你用 Euler–Maruyama 直接离散模拟：用 **Itô** 更自然；
- 若你的噪声来自“快但仍连续的物理过程”取极限（colored noise \(\to\) white noise），常见的极限更接近 **Stratonovich**；
- 无论选哪个：你都必须在模型与代码里写清楚约定，否则比较不同论文/不同代码时会出现“看似同方程、实则不同模型”的隐性错误。

## 连接到本项目（为什么这张卡放在 M9）
- 本仓库的 OU 过程与 Euler–Maruyama 默认按 **Itô** 约定书写；
- 你将来把噪声做成状态相关（乘性噪声）时，必须同步更新：SDE 解释、FP 形式、以及数值方法（否则漂移项会悄悄变掉）。

## 你读完应能回答的自检问题
1. 为什么随机项会让“高阶小量”不再可忽略，从而产生 Itô/Stratonovich 差别？
2. 给定 \(a(x),b(x)\)，你能写出 Itô 与 Stratonovich 的相互转换吗？多出来的那一项在物理上意味着什么？
3. 你现在的城市连续模型里，噪声更像“测量误差/外生冲击”（Itô）还是“快变量被消去的有效噪声”（更偏 Stratonovich）？

