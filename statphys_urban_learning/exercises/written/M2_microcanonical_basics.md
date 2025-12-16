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

---

## 提示（先做 20–30 分钟再看）

- 先把宏观态用一个参数描述清楚（例如左盒有 \(n\) 个球，右盒有 \(N-n\) 个）。
- 先写出 \(\Omega(n)\) 的显式形式，再考虑 \(\ln\Omega(n)\) 的最大值位置（Stirling 近似常用于大 \(N\)）。
- “最概然 \(\approx\) 平均”的关键不是“刚好相等”，而是分布在峰附近越来越尖：相对宽度 \(\sim 1/\sqrt{N}\)。

---

## 自检（Self-Check）

- [ ] 你能解释为什么最大化 \(\Omega\) 等价于最大化 \(\ln\Omega\) 吗？
- [ ] 你能指出涨落尺度（标准差）大致是 \(\sqrt{N}\)，而均值尺度是 \(N\)，因此相对涨落 \(\sim 1/\sqrt{N}\) 吗？

---

## 参考解答

👉 [查看参考解答](../solutions/M2_solution.md)（建议自己推导完成后再核对）
