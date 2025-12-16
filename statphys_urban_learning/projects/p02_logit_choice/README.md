# P02: 离散选择与 Boltzmann 分布 (Logit)

## 问题
在交通规划中，最核心的步骤之一是**目的地选择 (Destination Choice)**。
给定一个人面对 $N$ 个地点的选择集合，如果地点 $j$ 的吸引力为 $A_j$，去往 $j$ 的成本为 $C_j$，那么选择 $j$ 的概率通常建模为 **Multinomial Logit (MNL)**：
\[ P(j) = \frac{e^{V_j}}{\sum_k e^{V_k}} \]
其中效用 $V_j = \ln A_j - \beta C_j$。

## 你将产出
1. **理论验证**: 推导 MNL 公式与 M1 最大熵推导的一致性。
2. **PhD 升级**: 
   - **Nested Logit**: 解决红蓝巴士悖论 (Red Bus/Blue Bus Paradox)，引入层级结构。
   - **Consumer Surplus**: 证明 $\text{LogSum} = \frac{1}{\beta} \ln \sum e^{\beta V_j}$ 对应物理上的自由能 $F$，衡量因为“选择多样性”带来的额外收益。
3. **参数校准**: 用最大似然估计 (MLE) 从观察数据中把 $\beta$ 算出来。

## 建议顺序
先完成 M3 (正则系综)，再做本项目。
