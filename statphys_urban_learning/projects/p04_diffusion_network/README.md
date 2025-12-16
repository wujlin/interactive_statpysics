# P04: 网络上的扩散与随机游走

## 问题
有些时候我们不关心“去哪里”（P01/P02），而关心“怎么走”以及“走多远”。
如果一个人在路网（或社交网络）上随机游走（Random Walk），他在时间 $t$ 出现在节点 $i$ 的概率 $P_i(t)$ 是如何演化的？
这对应了城市的**可达性分析 (Accessibility)** 和 **PageRank**。

## 统计物理对应
- **随机游走 (RW)** $\leftrightarrow$ **扩散方程 / 主方程**
- **转移矩阵 $W_{ij}$** $\leftrightarrow$ **网络邻接矩阵/路权**
- **平稳分布 $\pi$** $\leftrightarrow$ **网络的度中心性 (Degree Centrality)**
- **平均首达时间 (MFPT)** $\leftrightarrow$ **城市的平均通勤/搜寻时间**

## 你将产出
1. **RW 模拟**: 在一个简单的 Grid 或真实路网上模拟粒子轨迹。
2. **PhD 升级 (Spectral Graph Theory)**:
   - **谱分析**: 计算 Graph Laplacian 的特征值谱。
   - **Fiedler Vector**: 用第二小特征向量 ($\lambda_2$) 识别城市的自然社区结构与连接瓶颈。
   - **可达性**: 证明扩散时间尺度与 $\lambda_2$ (Algebraic Connectivity) 的直接关系。
3. **Graph 扩散**: 用矩阵幂运算 $P(t) = P(0) W^t$ 可视化热图随时间扩散的过程。

## 建议顺序
M8 (Markov 过程) 之后。
