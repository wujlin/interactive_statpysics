---
type: exercise
id: M9_written
title: M9 Langevin 与 Fokker–Planck：漂移/扩散与密度演化
difficulty: 2
tags: [langevin, fokker-planck, stochastic]
---

# M9 Langevin/FP — Written

## 题目

### (1) 最小 Langevin 形式与物理含义

写出最小 Langevin（Itô 形式）：
\[
dx = a(x)\,dt + b(x)\,dW_t,
\]
并解释漂移 \(a(x)\) 与扩散强度 \(b(x)\) 的含义（写 6–12 句话）。

### (2) 对应的 Fokker–Planck 方程（形式 + 对象）

写出对应的 Fokker–Planck 方程的标准形式（无需推导细节），并说明它描述的对象是什么（例如：随机变量的概率密度如何随时间演化）。

---

## 提示（先做 15–25 分钟再看）

- (2) 你需要记住的最小模板：
  \[
  \partial_t p(x,t) = -\partial_x\big(a(x)p\big)+\frac{1}{2}\partial_x^2\big(b(x)^2 p\big).
  \]
- 自检可以用常数系数：若 \(a=0\)、\(b=\sigma\) 常数，方程退化为扩散方程。

---

## 自检（Self-Check）

- [ ] 你的 FP 方程里，扩散项是否有 \(1/2\) 并且是 \(b^2\) 而不是 \(b\)？
- [ ] 当 \(b\to 0\) 时，你的 FP 是否退化为确定性输运方程（只剩漂移）？

---

## 参考解答

👉 [查看参考解答](../solutions/M9_solution.md)（建议自己推导完成后再核对）
