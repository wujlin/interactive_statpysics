---
type: concept
title: 热力学势 Thermodynamic potentials
tags: ['thermodynamics', 'M0']
prereq: ['第一定律与第二定律 First and second law']
source: ['Any thermo textbook']
status: ready
---

## 一句话
热力学势是由基本关系 U(S,V,N) 通过 Legendre 变换得到的生成函数（如 F,G），其自然变量与实验约束匹配，并以极小原则给出平衡判据与响应关系。

## 最核心的三个势（够用）
### 内能 \(U(S,V,N)\)
- 自然变量：\((S,V,N)\)
\[
dU = T\,dS - P\,dV + \mu\,dN.
\]

### Helmholtz 自由能 \(F(T,V,N)=U-TS\)
- 自然变量：\((T,V,N)\)
\[
dF = -S\,dT - P\,dV + \mu\,dN.
\]
- 在统计物理里：\(F=-kT\ln Z\)。

### Gibbs 自由能 \(G(T,P,N)=F+PV\)
- 自然变量：\((T,P,N)\)
\[
dG = -S\,dT + V\,dP + \mu\,dN.
\]

## “自然变量”的用法
- 固定哪些量，就选哪个势；然后“对剩下的变量求偏导”得到响应量：
  - \(S = -(\partial F/\partial T)_{V,N}\)
  - \(P = -(\partial F/\partial V)_{T,N}\)
  - \(\mu = (\partial F/\partial N)_{T,V}\)

## 最小例子（连接到城市）
- 当你把一个系统写成“代价/势”的形式时，真正可用的是其对数归一化项（如 \(\ln Z\) 或 log-sum-exp），它在数学上就是势函数/生成函数。

## Source anchors
- Swendsen Eq 12.10：\(F \equiv U-TS\)
- Swendsen Eq 12.11：\(dU = T\,dS - P\,dV + \mu\,dN\)
- Swendsen Eq 12.12：\(dF = -S\,dT - P\,dV + \mu\,dN\)
