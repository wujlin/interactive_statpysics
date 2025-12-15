# P01：最大熵 OD 矩阵（MaxEnt + IPF）

## 问题
给定：
- 起点总出发量（row sums）\(O_i\)
- 终点总到达量（col sums）\(D_j\)

求一个非负矩阵 \(T_{ij}\)（OD 流量），使得：
- \(\sum_j T_{ij}=O_i\)
- \(\sum_i T_{ij}=D_j\)

并且在所有满足约束的矩阵里，使熵最大：
\[
\max_{T_{ij}\ge 0} \; -\sum_{i,j} T_{ij}\ln T_{ij}.
\]

## 统计物理对应
- 微观态：一次出行的 (i→j) 选择
- 宏观约束：行/列边际（守恒约束）
- 最大熵：在“只知道边际”的前提下不额外引入偏好

## 你将产出
1. 一个可复用的 IPF 实现：`src/ipf.py`
2. 一个 notebook 实验：合成数据 → 推 OD → 验证边际 → 可视化
3. （可选）加入成本矩阵 \(c_{ij}\)：得到 \(T_{ij}=a_i b_j e^{-\beta c_{ij}}\) 的“重力/阻抗”模型

## 评价标准
- 约束误差：row/col sums 的相对误差 < 1e-6（或你设定的阈值）
- 数值稳定：不爆 NaN，不出现负值
- 可读性：Notebook 能从头运行得到结果

开始：打开 `notebooks/P01_maxent_od.ipynb`
