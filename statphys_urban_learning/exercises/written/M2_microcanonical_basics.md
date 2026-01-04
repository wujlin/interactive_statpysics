---
type: exercise
id: M2_written
title: M2 微正则：计数、最概然与热力学极限
difficulty: 2
tags: [microcanonical, multiplicity, thermo-limit]
---

## 题目

1) 用一个简单计数模型（例如“两盒分球/硬币正反面”）写出多重度 \(\Omega\) 与 \(S=k_B\ln\Omega\)，并找出最概然宏观态。

2) 解释为什么在热力学极限下“最概然 \(\approx\) 平均”：哪一个量随系统规模变大而相对变小？（提示：\(\sigma/\text{mean}\)）

3) 连续体系的“计数”：3D 经典理想气体的相空间体积  
   采用体积型（cumulative）定义
   \[
   \Omega(E,V,N)=\frac{1}{N!\,h^{3N}}\int d^{3N}r\,d^{3N}p\;\Theta\!\bigl(E-H(\mathbf p,\mathbf r)\bigr),
   \]
   其中理想气体 \(H=\sum_{i=1}^N \mathbf p_i^2/(2m)\)。
   1. 说明为什么位置积分给出 \(V^N\)。  
   2. 说明为什么动量积分等价于 \(3N\) 维球体体积，并推出 \(\Omega(E,V,N)\propto V^N E^{3N/2}\)。  
   3. 令 \(S=k_B\ln\Omega\)，用偏导推出 \(E=\frac{3}{2}Nk_BT\) 与 \(PV=Nk_BT\)。  
   4. 简答：\(h^{3N}\) 与 \(N!\) 分别在做什么？体积型 \(\Omega(E)\) 与壳层型 \(\omega(E)=d\Omega/dE\) 的能量幂次为何相差 1？

---

## 提示（先做 20–30 分钟再看）

- 先把宏观态用一个参数描述清楚（例如左盒有 \(n\) 个球，右盒有 \(N-n\) 个）。
- 先写出 \(\Omega(n)\) 的显式形式，再考虑 \(\ln\Omega(n)\) 的最大值位置（Stirling 近似常用于大 \(N\)）。
- “最概然 \(\approx\) 平均”的关键不是“刚好相等”，而是分布在峰附近越来越尖：相对宽度 \(\sim 1/\sqrt{N}\)。
- 理想气体题如果卡在“为什么会冒出 \(E^{3N/2}\)”：把 \((\mathbf p_1,\ldots,\mathbf p_N)\) 当作一个 \(3N\) 维向量，能量约束对应半径为 \(\sqrt{2mE}\) 的高维球体。
- 体积型 \(\Omega\) vs 壳层型 \(\omega\)：记住 \(\omega(E)=\frac{d\Omega}{dE}\)，所以幂次会差 1；热力学极限下对数的偏导不受这点差异影响。

---

## 自检（Self-Check）

- [ ] 你能解释为什么最大化 \(\Omega\) 等价于最大化 \(\ln\Omega\) 吗？
- [ ] 你能指出涨落尺度（标准差）大致是 \(\sqrt{N}\)，而均值尺度是 \(N\)，因此相对涨落 \(\sim 1/\sqrt{N}\) 吗？
- [ ] 你能从 \(\Omega(E,V,N)\propto V^N E^{3N/2}\) 推出 \(PV=Nk_BT\) 吗？

---

## 参考解答

👉 [查看参考解答](../solutions/M2_solution.md)（建议自己推导完成后再核对）
