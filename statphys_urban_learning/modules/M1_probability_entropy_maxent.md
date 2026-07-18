# M1 熵与最大熵：有限信息允许怎样的概率分布

设一枚骰子的平均点数已知，但每一面的概率未知。满足这个均值的分布有无穷多个；任选一个，都会加入数据没有提供的结构。最大熵原理的任务，就是只使用已经给出的约束，而不额外指定分布偏好。

答案由两种熵连接起来：Boltzmann 熵把宏观态的微观实现数写成热力学量，Shannon–Gibbs 熵衡量一个概率分布仍保留多少不确定性。最大熵原理在给定约束下最大化后者，并由此产生指数族分布。

## 1. 计数决定宏观态的统计权重

考虑 $N$ 个可区分小球，每个球位于左盒或右盒。一个微观态记录每个球在哪个盒子；宏观态只记录左盒球数 $n$。给定 $n$ 的微观实现数为

$$
\Omega(n)=\binom{N}{n}.
$$

若 $2^N$ 个微观态等概率，则宏观态概率是

$$
P(n)=\frac{\Omega(n)}{2^N}.
$$

$n=N/2$ 附近的宏观态最常见，不是因为存在一股把球推向中间的力，而是因为那里对应的微观态最多。Boltzmann 熵正是对这种多重度取对数：

$$
S_B(n)=k_B\ln\Omega(n).
$$

对数把独立系统的多重度乘法变成熵的加法，也使指数增长的态数落到宏观可加的尺度上。

### Interactive：熵与计数

下面的两盒模型用随机移动产生一条具体轨迹。观察宏观态为什么大部分时间停留在 $n\approx N/2$，也留意它仍会偶尔远离中心。

<InteractiveConcept type="entropy-counter" />

这个实验展示的是**平衡附近的统计占比**，不是“熵在每一步都严格增加”。有限系统可以从高多重度宏观态涨落到低多重度宏观态，只是大幅反向涨落的概率随 $N$ 快速减小。关于时间箭头还需要指定动力学、初始条件和粗粒化；MaxEnt 本身不提供这些条件。

相关概念见：[[微观态与宏观态 Microstate vs macrostate]]、[[多重度 multiplicity Ω]]、[[Stirling 近似 Stirling approximation]]。

## 2. Shannon–Gibbs 熵包含 Boltzmann 公式

当微观态 $i$ 具有一般概率 $p_i$ 时，概率分布的熵定义为

$$
S_G[p]=-k_B\sum_i p_i\ln p_i.
$$

若某个宏观约束下有 $\Omega$ 个可及微观态，并且它们等概率，则 $p_i=1/\Omega$，从而

$$
S_G
=-k_B\sum_{i=1}^{\Omega}\frac{1}{\Omega}\ln\frac{1}{\Omega}
=k_B\ln\Omega
=S_B.
$$

因此，$S_B=k_B\ln\Omega$ 是均匀分布下的特殊情形；$S_G[p]$ 则适用于微观态权重不均匀的情形。二者的桥梁是“约束集合内等概率”，而不是时间不可逆性。

在信息论语境中常把 $k_B$ 省略，写成无量纲 Shannon 熵 $H[p]=-\sum_i p_i\ln p_i$。本课程在物理公式中保留 $k_B$。

## 3. 最大熵原理把约束翻译成分布

设状态空间为 $i=1,\ldots,M$，已知概率归一化以及 $K$ 个期望约束：

$$
\sum_i p_i=1,
\qquad
\sum_i p_i f_k(i)=F_k,\qquad k=1,\ldots,K.
$$

最大熵原理选择满足这些约束且 $S_G[p]$ 最大的分布。它的含义很具体：不在约束已经表达的信息之外，再人为指定额外偏好。若可行集合非空且最优解位于给定支持集的内点，熵的严格凹性保证解唯一；落在边界上的解需要把零概率状态单独处理，或视为乘子发散的极限。

为了求解，最大化无量纲熵并引入拉格朗日乘子：

$$
\mathcal L
=-\sum_i p_i\ln p_i
-\alpha\left(\sum_i p_i-1\right)
-\sum_{k=1}^{K}\lambda_k
\left(\sum_i p_i f_k(i)-F_k\right).
$$

对每个 $p_i$ 求驻值：

$$
\frac{\partial\mathcal L}{\partial p_i}
=-(\ln p_i+1)-\alpha-\sum_k\lambda_k f_k(i)=0.
$$

因此

$$
p_i=\exp\left[-1-\alpha-\sum_k\lambda_k f_k(i)\right].
$$

用归一化条件消去 $\alpha$，得到指数族通式

$$
\boxed{
p_i=\frac{1}{Z(\boldsymbol\lambda)}
\exp\left[-\sum_k\lambda_k f_k(i)\right]
},
$$

其中

$$
Z(\boldsymbol\lambda)
=\sum_i\exp\left[-\sum_k\lambda_k f_k(i)\right].
$$

$Z$ 不只是归一化常数。对乘子求导可取回约束量：

$$
-\frac{\partial\ln Z}{\partial\lambda_k}
=\langle f_k\rangle
=F_k,
$$

二阶导数则给出协方差：

$$
\frac{\partial^2\ln Z}
{\partial\lambda_k\partial\lambda_\ell}
=\operatorname{Cov}(f_k,f_\ell).
$$

这也是配分函数、涨落和响应关系共同的数学骨架。若约束是平均能量 $\langle E\rangle=U$，相应乘子记作 $\beta$，便得到 $p_i\propto e^{-\beta E_i}$。同一个 Boltzmann 形式还可以由“系统接触热库”的物理机制推出，但两条路线回答的是不同问题。

更完整的通用推导见：[[最大熵推出指数族分布（通用模板）]]、[[Boltzmann 分布的最大熵推导]]、[[MaxEnt 与正则系综等价（信息等价）]]。

## 4. 分布形式取决于约束与支持集

“最大熵分布是什么”没有脱离状态空间的唯一答案。两个常见连续例子是：

| 支持集与约束 | 最大熵分布 |
|---|---|
| $x\ge 0$，给定 $\mathbb E[X]=\bar x$ | 指数分布 |
| $x\in\mathbb R$，给定均值与方差 | 高斯分布 |

若 $x\in\mathbb R$ 却只固定均值，通常不存在可归一化的最大熵解。连续情形还要明确参考测度；微分熵会随坐标变换而改变，因此更稳妥的对象是相对于给定参考测度的相对熵。相关推导见：[[已知均值的最大熵解（指数）]]、[[已知均值与方差的最大熵解（高斯）]]。

由此可见，指数分布、高斯分布和 Boltzmann 分布并不是互相竞争的“默认答案”；它们分别编码了不同的支持集与约束信息。

## 5. 城市例子：只有 OD 边际时能推断到哪里

设 $T_{ij}$ 是从出发地 $i$ 到目的地 $j$ 的出行量，只知道行和与列和：

$$
\sum_j T_{ij}=O_i,
\qquad
\sum_i T_{ij}=D_j,
\qquad
\sum_i O_i=\sum_j D_j=T.
$$

若没有距离、成本或结构零等额外信息，并采用均匀参考测度，最大熵解是独立耦合

$$
\boxed{T_{ij}=\frac{O_iD_j}{T}}.
$$

它表达的是严格的信息边界：只有边际账本时，没有依据加入额外的空间偏好。

若已有一个基准矩阵 $q_{ij}$，最大化相对熵并保持相同边际，会得到

$$
T_{ij}=a_i b_j q_{ij},
$$

其中 $a_i,b_j$ 由边际约束确定。取 $q_{ij}=e^{-\gamma c_{ij}}$，才得到带出行成本的双约束重力模型。IPF/raking 是求这些乘子的数值方法，而不是无约束地证明“城市流量天然服从重力定律”。更细的映射见：[[最大熵（MaxEnt）→ OD 矩阵推断]]。

## 6. 最大熵没有解释时间不可逆性

MaxEnt 回答的是一个静态推断问题：**在当前信息下应分配怎样的概率？** 它没有规定系统如何随时间移动，也不能单独推出单条轨迹的熵单调增加。

宏观不可逆性还需要至少三部分：特殊的低熵初态、保持相应平衡测度的微观动力学，以及宏观粗粒化下的典型性。转移率、概率流和路径时间反演提供的是动力学语言。把静态推断与时间箭头分开，反而使两者各自的逻辑更清楚。

## 核心答案：约束决定指数族

Boltzmann 熵说明宏观态的统计权重来自微观计数；Shannon–Gibbs 熵把这一思想推广到一般概率分布。在常规可行内点条件下，线性期望约束的最大熵变分产生唯一的指数族解，而 $\ln Z$ 的导数返回约束量与协方差。这个结论规定了有限信息下能推断什么，但没有替代动力学。

## 自检与练习

1. 为什么均匀分布下的 Shannon–Gibbs 熵等于 $k_B\ln\Omega$？
2. 从 $\mathcal L$ 对 $p_i$ 的驻值条件推导指数族通式。
3. 为什么“只知道均值”还不足以判断最大熵分布，必须同时说明支持集？
4. 只有 OD 行、列边际时，为什么解是 $O_iD_j/T$？成本项需要通过什么额外信息进入？
5. 为什么 MaxEnt 不能单独证明真实轨迹的熵随时间单调增加？

### 参考与学习资源

- Jaynes 1957：导读见 [Seminal papers](/references/seminal_papers)（`SP-M1-Jaynes1957-I`，进阶读 `SP-M1-Jaynes1957-II`）。
- Boltzmann 1877：导读见 [Seminal papers](/references/seminal_papers)（`SP-M1-Boltzmann1877`）。
- [ ] **Reading Guide**：[[Swendsen_Ch5_Probability]]。
- [ ] **Reading Guide**：[[Jaynes_1957_MaxEnt]]。
- [ ] **Written**：`exercises/written/E01_maxent_to_boltzmann.md`。
- [ ] **Notebook**：`exercises/notebooks/E01_maxent_discrete_numeric.ipynb`。

### 验收标准

- [ ] 能在归一化与线性期望约束下完整推导指数族，而不是只背结论。
- [ ] 能区分 Boltzmann 熵、Shannon–Gibbs 熵和动力学熵产生。
- [ ] 能根据支持集与约束判断指数分布、高斯分布或其他指数族是否成立。
