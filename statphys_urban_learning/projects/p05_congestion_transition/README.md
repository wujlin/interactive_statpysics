# P05: 拥堵相变 Toy Model

## 问题
交通系统中最令人着迷也最令人头疼的现象是**突变**：车流密度 $\rho$ 稍微增加一点点，速度 $v$ 突然从 $60$ 掉到 $10$。
这种非线性的突变行为无法用线性外推预测，是城市韧性 (Resilience) 的核心。

## 统计物理对应
- **自由流 (Free Flow)** $\leftrightarrow$ **气体相 / 无序相**
- **拥堵流 (Congested Flow)** $\leftrightarrow$ **液体相 / 晶体 / 有序相（紧密排列）**
- **临界密度 $\rho_c$** $\leftrightarrow$ **相变点 $T_c$**
- **基本图 (Fundamental Diagram)** $\leftrightarrow$ **物态方程 (Equation of State)**

## 你将产出
1. **Nagel-Schreckenberg (NaSch) 模型**: 写一个最简单的 1D 细胞自动机 (CA)。
2. **基本图**: 跑模拟，画出 流量 $J$ vs 密度 $\rho$ 的图 (Fundamental Diagram)。
3. **PhD 升级 (有限尺寸标度 FSS)**: 
   - 测量序参量涨落（Susceptibility $\chi$）。
   - 通过数据塌缩 (Data Collapse) $\chi L^{-\gamma/\nu}$ 确定临界指数 $\nu, \gamma$，验证拥堵属于哪个普适类 (Universality Class)。

## 建议顺序
M7 (相变与临界) 之后。
