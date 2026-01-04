---
type: concept
title: 负温度 Negative temperature
tags: ['statmech', 'M2', 'spin']
prereq: ['微正则系综 Microcanonical ensemble', '熵 Entropy', '正则系综 Canonical ensemble']
source: ['Swendsen 2012', 'Ramsey 1956']
status: ready
---

## 一句话
负温度（\(T<0\)）不是“比 \(0\,\mathrm K\) 更冷”，而是**在能量谱有上界的平衡系统中**出现的一种状态：熵 \(S(E)\) 在高能端随能量增加反而下降，因此 \(\left(\partial S/\partial E\right)_{V,N}<0\)。

## 定义/公式（微正则视角）
微正则系综中温度定义为
\[
\frac{1}{T}=\left(\frac{\partial S}{\partial E}\right)_{V,N},\qquad S(E,V,N)=k_B\ln\Omega(E,V,N).
\]
因此
- \(\partial S/\partial E>0 \Rightarrow T>0\)
- \(\partial S/\partial E<0 \Rightarrow T<0\)（负温度）

## 必要条件：为什么要“能量有上界”
负温度能出现的关键是：系统的可达能量**不能无限增大**（能量谱有上界）。

从正则系综也能看出这一点：若
\[
p_i\propto e^{-\beta E_i},\qquad \beta=\frac{1}{k_B T},
\]
当 \(T<0\) 时 \(\beta<0\)，权重 \(e^{-\beta E}=e^{+|\beta|E}\) 会偏向高能态。若能量无上界，分布无法归一化；只有在能量有上界时，“偏向高能”的分布才可能仍然是合法概率分布。

## 物理图像：两能级/自旋系统与“人口反转”
最经典的例子是受磁场约束的自旋-1/2（或任意有限能级）系统：每个自由度只有有限个能量水平，总能量因此有上界。

随着能量从最低端升高：
1) 起初翻转少量自旋，会快速增加可实现方式（\(\Omega\) 增大），熵上升；  
2) 当“高/低能级占据接近一半”时，组合数最大，熵达到最大；  
3) 再继续升能（接近能量上界），实现方式反而变少（\(\Omega\) 下降），于是 \(S(E)\) 开始下降，对应 \(T<0\)。  

这类高能级占据更多的状态常被称为**人口反转**（population inversion）。注意：很多激光介质是开放的非平衡系统，“负温度”更像有效描述；而这里的负温度讨论指的是（近似）热平衡态的统计力学定义。

## “冷还是热”：负温度比任何正温度都热
判断“谁更热”的操作性标准是：热接触后能量自发从哪边流向哪边。负温度系统倾向于占据高能态；当它与任何正温度系统接触时，能量会自发从负温度流向正温度（它“更愿意”放出能量），因此：

> **负温度比任何正温度都热**（常称 “hotter than infinity”）。

温度轴的顺序可记为：
\[
0^+\ \to\ +\infty\ \to\ -\infty\ \to\ 0^-.
\]

## 最小例子（可算）：\(N\) 个独立两能级
令每个自由度有能量 \(\pm\varepsilon\)。设有 \(n\) 个处于 \(+\varepsilon\)（高能）态，则
\[
E(n)=(2n-N)\varepsilon,\qquad \Omega(n)=\binom{N}{n},\qquad S(n)=k_B\ln\binom{N}{n}.
\]
用 Stirling 近似可得
\[
\frac{1}{T}=\left(\frac{\partial S}{\partial E}\right)_{N}
=\frac{k_B}{2\varepsilon}\ln\frac{N-n}{n}.
\]
于是
- 若 \(n<N/2\)（能量低于中点），\(\ln\frac{N-n}{n}>0\Rightarrow T>0\)；
- 若 \(n>N/2\)（人口反转，高能占据更多），\(\ln\frac{N-n}{n}<0\Rightarrow T<0\)。

## 常见误区
- **误区 1**：负温度是“比 0 K 还冷”。  
  纠正：负温度在热接触意义上更热。
- **误区 2**：任何系统都能有负温度。  
  纠正：需要能量上界；且需要（近似）达到热平衡。
- **误区 3**：看到人口反转就等价于负温度。  
  纠正：开放驱动系统常是非平衡稳态，“有效温度”只在特定近似下才有意义。

## 与其他概念的连接
- 见：[[微正则系综 Microcanonical ensemble]]（温度的偏导定义）
- 见：[[正则系综 Canonical ensemble]]（\(\beta<0\) 的可归一化条件）
- 见：[[能量涨落的高斯近似与 1/√N 标度（微正则推导）]]（典型性/曲率）

## References
- 原始文献导读与统一书目信息见：[Seminal papers](/references/seminal_papers)（条目：`SP-M2-Ramsey1956-NegativeTemperature`）。
