---
type: exercise
id: M4_written
title: M4 巨正则：巨配分函数导数（规模与涨落）与 OD（起讫矩阵）最大熵乘子结构
difficulty: 3
tags: [grand-canonical, chemical-potential, maxent, od]
---

# M4 巨正则：巨配分函数导数（规模与涨落）与 OD（起讫矩阵）最大熵乘子结构

> 目标：把“\(\mu\) 控制规模（可变 \(N\)）”与“边际约束 MaxEnt/最小 KL \(\to\) 乘子形式”用手推写清楚。

> 记号约定：本仓库统一把巨配分函数写作 \(\mathcal{Z}\)（不要与正则配分函数 \(Z\) 混淆）；完整符号表见：[[符号约定与映射（本仓库统一：Swendsen 体系）]]。

> 术语提示：OD（Origin–Destination，起点→终点）矩阵 \(T_{ij}\) 表示从区域 \(i\) 到 \(j\) 的流量；“乘子形式”指在边际约束下，最小化 \(KL(T\|Q)\) 的解必然写成 \(T_{ij}=a_i b_j Q_{ij}\)，其中 \(a_i,b_j\) 来自拉格朗日乘子并可解释为行/列缩放因子（IPF/RAKING）。

## 题目

### (1) 巨正则分布（写对形式）

对一个可变粒子数/规模的系统，写出巨正则分布：

- 写出 \(p(x,N)\) 的比例形式（包含 \(E(x,N)\)、\(\mu N\)、\(\beta\)）
- 写出巨配分函数 \(\mathcal{Z}(\beta,\mu)\) 的定义（求和对哪些变量）

### (2) 从 \(\ln\mathcal{Z}\) 得到 \(\langle N\rangle\) 与 \(\mathrm{Var}(N)\)

令 \(y=\beta\mu\)。请推导并写清楚“对哪个变量求导（保持什么不变）”：

- \(\langle N\rangle = \partial_y \ln\mathcal{Z}\)
- \(\mathrm{Var}(N) = \partial_y^2 \ln\mathcal{Z}\)

### (3) 为什么“边际约束 + 最大熵/最小 KL”给出 OD 的乘子形式？（概念题）

在 OD（Origin–Destination，起点→终点）推断中，令 \(T_{ij}\ge 0\) 满足边际：
\(\sum_j T_{ij}=O_i\)，\(\sum_i T_{ij}=D_j\)。  
假设我们最小化 \(KL(T\|Q)\)，其中 \(Q_{ij}\) 是 prior（可取 \(Q_{ij}=\exp(-\beta c_{ij})\)）。

- 为什么解必然可以写成：\(T_{ij}=a_i b_j Q_{ij}\)？
- 不要求完整严谨证明，但要给出**清晰的推理链**（提示：拉格朗日乘子、指数族、行/列乘子吸收到 \(a_i,b_j\) 里）

### (4) 对比题：无成本 prior vs 带成本 prior

- 当 \(Q_{ij}\) 为常数（无成本 prior）时，你认为 \(T\) 的结构主要由什么决定？
- 当 \(Q_{ij}=\exp(-\beta c_{ij})\)（带成本 prior）时，\(\beta\) 增大通常会让哪些统计量发生怎样的变化？请至少写出两个：  
  例如平均成本、流量集中度、跨区比例、长距离流占比等。

### (5) 理想气体：\(\langle N\rangle\)、密度 \(n\) 与化学势 \(\mu\) 的关系（推导题）

考虑经典理想气体（无相互作用、单原子）在巨正则系综 \((T,V,\mu)\) 下的平衡。设密度
\[
n\equiv \frac{\langle N\rangle}{V}.
\]
请推导并得到：
\[
\boxed{\ \mu = k_B T\ln(n\lambda_T^3)\ }.
\]
其中热德布罗意波长（thermal de Broglie wavelength）
\[
\lambda_T \equiv \frac{h}{\sqrt{2\pi m k_B T}}.
\]

你需要写清楚每一步“从哪里来”，建议按以下链条组织：
1. 先算单粒子正则配分函数 \(Z_1(T,V)\)（相空间积分，给出 \(Z_1=V/\lambda_T^3\)）。
2. 用“无相互作用 + 不可分辨粒子”得到 \(Z_N=Z_1^N/N!\)。
3. 把 \(Z_N\) 塞进巨配分函数 \(\mathcal{Z}=\sum_N e^{\beta\mu N}Z_N\)，并把它化简成指数形式。
4. 用 \(\langle N\rangle=(1/\beta)\,(\partial_\mu \ln\mathcal{Z})_{T,V}\) 得到 \(n\) 与 \(\mu\) 的关系。

---

## 提示（先做 30–45 分钟再看）

- (1) 写成一句话：\(\text{概率}\propto \exp(-\beta(E-\mu N))\)。
- (2) 先写出 \(\mathcal{Z}=\sum_{N}\sum_x \exp(-\beta E(x,N)+yN)\)，然后对 \(y\) 求导；注意 \(\partial_y \ln\mathcal{Z}=(1/\mathcal{Z})\partial_y \mathcal{Z}\)。
- (3) 关键直觉：在约束下最小化 KL（或最大化熵）给出“指数族”；边际约束对应“只依赖 \(i\) 或 \(j\)”的乘子，因此变成 \(a_i b_j\) 的形式。
- (5) 先得到 \(Z_1=V/\lambda_T^3\)，再用 \(\mathcal{Z}=\sum_N (e^{\beta\mu}Z_1)^N/N!\) 识别为指数函数；最后用 \(\langle N\rangle=(1/\beta)\partial_\mu\ln\mathcal{Z}\)。

---

## 自检（Self-Check）

- [ ] (1) 你的指数里是否是 \(-\beta E + \beta\mu N\)（或等价写法）？\(\beta\mu\) 应该和 \(N\) 成对出现。
- [ ] (2) 你能从 \(\partial_y^2\ln\mathcal{Z}\) 得到一个方差（非负）吗？符号是否对？
- [ ] (3) 你能用一句话解释：为什么 \(a_i\) 只能依赖 \(i\)，\(b_j\) 只能依赖 \(j\)？
- [ ] (5) 你是否得到 \(n=\exp(\beta\mu)/\lambda_T^3\)，从而 \(\mu=k_BT\ln(n\lambda_T^3)\)？

---

## 参考解答

👉 [查看参考解答](../solutions/M4_solution.md)（建议自己推导完成后再核对）

## Source anchors
- Swendsen Eq 20.9：\(P(E,N)=(1/\mathcal{Z})\,\Omega\,e^{-\beta E+\beta\mu N}\)
- Swendsen Eq 20.12：\(\mathcal{Z}(T,V,\mu)=\sum_N Z(T,V,N)e^{\beta\mu N}\)
