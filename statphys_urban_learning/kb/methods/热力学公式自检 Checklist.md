---
type: method
title: 热力学公式自检 Checklist
tags: ['thermodynamics', 'M0']
prereq: ['热力学势 Thermodynamic potentials']
source: ['Thermo basics']
status: ready
---

## 什么时候用？
- 任何时候你写出一个 \(dU/dF/dG\) 或者写出某个偏导关系时，用它避免“变量写错/符号写错”。

## 输入/输出
- 输入：你写下的一条热力学微分关系或一个偏导公式
- 输出：是否一致（通过/不通过）+ 哪一项最可能写错

## 核心步骤（Checklist）
1) **先写清势的自然变量**
   - 例如：\(F=F(T,V,N)\) ⇒ 自然变量是 \(T,V,N\)
2) **写出标准微分形式**
   - \(dF = -S\,dT - P\,dV + \mu\,dN\)
3) **逐项对照符号与负号**
   - 看清楚：温度项是 \(-S\,dT\)，体积项是 \(-P\,dV\)
4) **做单位检查**
   - 每一项都应该是能量（J）
5) **做极限检查（可选）**
   - 高温/低温/大体积等极限是否符合直觉

## 最小例子
- 若有人写 \(P=(\partial F/\partial V)_{T,N}\)，用第2步立刻发现应为：
\[
P = -\left(\frac{\partial F}{\partial V}\right)_{T,N}.
\]
