---
type: exercise
id: M0_written
title: M0：势函数的微分与自然变量（dU、dF、dG）
difficulty: 1
tags: [thermo, potentials, legendre]
---

## 题目

1) 给定状态函数 \(U(S,V,N)\)，写出全微分 \(dU\)，并给出 \(T,P,\mu\) 的偏导定义（写清“保持哪些变量不变”）。

2) 从
\[
F=U-TS,\qquad G=F+PV
\]
出发，推导 \(dF,dG\)，并标出它们各自的自然变量。

---

## 提示（先做 15–25 分钟再看）

- 把 \(U(S,V,N)\) 当作一个普通多元函数：\(dU=(\partial_S U)\,dS+(\partial_V U)\,dV+(\partial_N U)\,dN\)。
- 物理约定：\(dU=T\,dS-P\,dV+\mu\,dN\)（注意 \(P\) 前面有负号）。
- 计算 \(dF\) 时不要跳步：先写 \(dF=dU-T\,dS-S\,dT\) 再代入 \(dU\)。

---

## 自检（Self-Check）

- [ ] 你得到的 \(dF\) 是否形如 \(dF=-S\,dT-P\,dV+\mu\,dN\)？这对应 \(F\) 的自然变量是 \((T,V,N)\)。
- [ ] 你得到的 \(dG\) 是否形如 \(dG=-S\,dT+V\,dP+\mu\,dN\)？这对应 \(G\) 的自然变量是 \((T,P,N)\)。
- [ ] 你的符号是否与直觉一致：体积增大时做功项应该让系统能量降低（因此是 \(-P\,dV\)）？

---

## 参考解答

👉 [查看参考解答](../solutions/M0_solution.md)（建议自己推导完成后再核对）
