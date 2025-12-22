# M3 正则系综与配分函数 Z

> **核心目标**：告别痛苦的组合数计算。掌握**配分函数（Partition Function, Z）**这一超级工具。只要算出了 \(Z\)，所有热力学量（\(F, S, U, P\)）都只是它的导数。这是统计物理中最常用的系综。

## 推荐学习顺序
1. 通读本文 Part 1–4，理解为什么 \(Z\) 被称为“生成函数”。
2. 做 `exercises/written/M3_lnZ_derivatives.md`，亲手证明 \(\langle E \rangle = -\partial_\beta \ln Z\)。
3. 对照 Swendsen Chapter 10，看懂简单的两能级系统例子。

## 背景最小包（First Principles）
- 现实系统几乎总与环境交换能量，能量“可波动”比“精确固定”更真实。
- “软约束 + 最大熵”自然导出指数权重，这就是 Boltzmann 形式的来源。
- 一旦写出 \(Z\)，热力学量就变成**可导的函数**而不是难算的几何计数。

## 逻辑桥接（M2 → M3）
- M2 的微正则把能量固定在壳上；M3 把硬约束改成“与热库交换”的软约束。
- 这一步不是换符号，而是把“计数问题”转成“生成函数问题”。

---

## Introduction

在 M2（微正则系综）里，我们虽然建立了统计物理的逻辑基石（\(S=k\ln\Omega\)），但也留下了一个巨大的**计算困境**：对于绝大多数真实系统，计算“能量严格等于 \(E\)”的微观态体积 \(\Omega(E)\) 在数学上极其痛苦，且不符合实验现实（由于与环境的热交换，能量往往是波动的）。

Gibbs (1902) 的概念飞跃在于引入了**正则系综（Canonical Ensemble）**：与其纠结通过硬墙隔离出来的恒定能量，不如把系统想象成浸泡在一个巨大的热库（Heat Bath）中。通过 Legendre 变换或“小系统推导”，硬约束 \(E\) 变成了软约束（温度 \(T\)），微观态的概率由“平权”变成了“按能量加权” (\(e^{-\beta E}\))。这不仅模拟了真实环境，更把艰难的几何截面计算变成了优雅的指数积分（配分函数 \(Z\)），让统计物理真正拥有了计算复杂系统的能力。

城市镜像中的对应同样深刻：在建模出行选择时，我们很少能硬性规定“全城总通勤时间必须精确等于 \(C\)”（微正则）；相反，我们更容易观察到的是“对时间的敏感度/价格参数 \(\beta\)”（正则）。在这个框架下，\(e^{-\beta \cdot \text{Cost}}\) 成为描述个体选择与随机性的通用法则（Logit 模型），而配分函数 \(Z\) 则直接对应系统的总福利或可达性（Accessibility）。

MaxEnt 与 canonical 的合流点在这里最清晰：它们编码的是同一份信息，只是语言不同（见：[[MaxEnt 与正则系综等价（信息等价）]]）。

## References
- **Gibbs 1902**: *Elementary Principles in Statistical Mechanics*. 导读见 [Seminal papers](/references/seminal_papers)（条目：`SP-M3-Gibbs1902`）。

---

## Part 1：从“孤家寡人”到“与邻为伴”

M2 里的系统是**孤立**的（Energy fixed），这叫微正则。但现实中大部分系统都与环境交换能量（Temperature fixed）。
当我们把一个小系统与一个巨大的**热库（Reservoir）**耦合时，小系统处于某个微观态 \(i\) 的概率不再相等，而是取决于它的能量 \(E_i\)：

\[ p_i = \frac{1}{Z} e^{-\beta E_i} \]

这里的 \(\beta = 1/k_B T\) 是热库“强加”给系统的温度参数。能量越低的状态，概率越大；温度越高（\(\beta\) 越小），高能态的机会就越多。

推导细节见 [[正则系综 Canonical ensemble]]；为什么微正则与正则在大系统极限下给出相同的宏观预测，可先从 [[热力学极限 Thermodynamic limit]] 的集中性结论理解。

---

## Part 2：配分函数 Z：归一化常数与生成函数

\[ Z = \sum_i e^{-\beta E_i} \]

乍一看 \(Z\) 只是个归一化常数（为了让 \(\sum p_i = 1\)）。但它其实是**生成函数（Generating Function）**。
这就好比你有一个多项式 \(f(x) = \sum a_n x^n\)，它的系数 \(a_n\) 藏着信息。对 \(Z\) 而言：
- 取对数：\(F = -k_B T \ln Z\)（直接得到自由能！）
- 求一阶导：\(\langle E \rangle = -\frac{\partial \ln Z}{\partial \beta}\)（得到内能）
- 求对体积导数：\(P = k_B T \frac{\partial \ln Z}{\partial V}\)（得到压强）

**记住：Z 知道一切。** 你不需要去分别对 \(E\) 或 \(P\) 积分，你只需要把 \(Z(\beta, V, N)\) 算出来，然后求导就行了。

Swendsen Chapter 10（Eq 10.1–10.9）给出了从 \(Z\) 导出 \(U\) 与 \(P\) 的标准路径，可用来逐步对照符号与负号。

---

## Part 3：涨落与响应——硬币的两面

正则系综里的能量不是常数，它在涨落。
你可能会问：“**既然能量在变，凭什么用热力学内能 \(U\)（一个定值）来代表它？**”

答案在于**大数定律**。相对涨落 \(\frac{\sigma_E}{\langle E \rangle} \sim \frac{1}{\sqrt{N}}\)。对于 \(10^{23}\) 个粒子，涨落极小，可以忽略。
但这个涨落本身极为重要，它与系统的**热容（Heat Capacity）**直接相关：
\[ \text{Var}(E) = k_B T^2 C_V \]
这就是著名的**涨落-耗散定理**的雏形：**宏观上对温度变化的“响应能力”（热容），本质上源于微观上能量的“自发涨落”。**

更系统的表述与通用模板见：[[涨落-响应 Fluctuation-response]]。

---

## Part 4：城市映射——离散选择 (Logit)

在城市模型中，正则系综对应着最经典的 **Logit 模型（Multinomial Logit, MNL）**。
- **微观态**：个体的选择（如：选哪条路，买哪个房）。
- **能量 \(E\)**：广义成本（时间、票价、舒适度）。
- **温度 \(\beta\)**：选择的敏感度（或不理性程度）。
- **配分函数 \(Z\)**：分母上的 \(\sum e^{-\beta C_i}\)。

在交通教材里，\(\ln Z\) 被称为 **Inclusive Value (期望最大效用)**，它衡量了“这一组选项整体有多好”。如果政府新修了一条路（增加一个低 \(E\) 状态），\(Z\) 增大，\(\ln Z\) 增大，代表居民福利提升。这与物理中 \(F\)降低（福利提升）是完全等价的。

跨学科对照与“势/自由能”解释见：[[Logit Softmax 与 Boltzmann 以及 log-sum-exp 自由能]]。

### Interactive：Logit/配分函数直觉
调节 \(\beta\)（成本敏感度）观察概率如何从“均匀”向“极化”收缩；同时看 \(Z\) 与 log-sum-exp 如何随之变化。

<InteractiveConcept type="logit-partition" />

## 通往下一章（M4）
- 如果系统规模 \(N\) 也在波动（开放系统），就需要把“粒子数约束”也变成软约束。
- M4 将引入化学势 \(\mu\) 与巨配分函数 \(\Xi\)，完成对“规模可变”系统的统一描述。

---

## Part 5：动手时刻 (Checklist)

### 必读
- [ ] **Reading Guide**: [[Swendsen_Ch10_Canonical]] (Chapter 10: 10.1-10.5)
  > 点击查看正则系综公式锚点。重点看 $Z$ 与 $F$ 的桥接。
- [ ] **Seminal Paper**: Gibbs 1902 的前言（可选）。

### 习题
- [ ] **Written**: `exercises/written/M3_lnZ_derivatives.md`
  - 核心任务：证明 \(\langle E \rangle = -\partial_\beta \ln Z\) 和 \(\text{Var}(E) = \partial^2 \ln Z\)。
- [ ] **Notebook**: `exercises/notebooks/E03_canonical_analytic.ipynb` (如有)
  - 计算两能级系统的 \(Z\) 和 \(C_V(T)\) 曲线（Schottky anomaly）。

### 验收标准
- [ ] 给你一个能级谱 \(E_n = n\epsilon\)，能立刻写出 \(Z\) 的几何级数求和形式。
- [ ] 看到 \(F = -kT \ln Z\)，能反应出这是从微观通向宏观的桥梁。
- [ ] 理解为什么城市交通里的 Logit 公式分母就是配分函数。
