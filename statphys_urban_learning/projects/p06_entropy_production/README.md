# P06: 非平衡稳态与熵产生 (NES)

## 问题
大多数城市并不是死寂的（平衡态），而是充满了恒定的流动（通勤流、物流、资金流）。
这种状态叫 **非平衡稳态 (Non-Equlibrium Steady State, NESS)**。
如何量化一个系统“离平衡有多远”？或者说，维持这个城市的运转需要消耗多少能量（产生多少熵）？

## 统计物理对应
- **细致平衡破缺 (Broken detailed balance)**: $W_{ij} P_i \neq W_{ji} P_j$。
- **熵产生率 (Entropy Production Rate, EPR)**: $\sigma = \sum_{ij} (W_{ij}P_i - W_{ji}P_j) \ln \frac{W_{ij}P_i}{W_{ji}P_j} > 0$。
- **环流 (Cycle flux)**: 净流不再为零，形成闭环。

## 你将产出
1. **环流模型**: 构建一个简单的三节点或更复杂网络模型，手动引入不对称转移率（例如 a->b->c->a 顺时针流）。
2. **PhD 升级 (NES Theory)**:
   - **Entropy Production Rate (EPR)**: 严格数值积分计算 $\sigma = \sum J_{ij} \ln(w_{ij}/w_{ji})$。
   - **TUR 验证**: 验证 Thermodynamic Uncertainty Relation ($\text{Var}(J)/J^2 \ge 2/\sigma$)。证明想要维持高精度的城市流（准时），必须消耗高熵（高能耗/拥堵及容错冗余）。
3. **城市指标**: 尝试定义“城市不可逆性指标”。

## 建议顺序
M8/M9 (非平衡统计) 之后。这是进阶项目。
