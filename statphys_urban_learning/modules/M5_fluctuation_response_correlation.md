# M5 涨落—响应—相关（不确定性与敏感性）

## 目标
- 用“二阶信息”做两件事：
  1) 涨落（方差/协方差）怎么从势函数导数来
  2) 参数扰动时，系统响应如何量化（敏感性/不确定性）

## 主线（只做这一条）
- 指数族/系综里：**协方差 = 势函数（二阶导）**；响应（导数）= 扰动后的平均变化。

## 先修
- M3（ln Z 导数）
- M4（OD 基线项目）

## Checklist

### 阅读（按主题，不绑版本章节号）
- [ ] Var/Cov 与二阶导（涨落—响应）
- [ ] 相关函数的最小定义（时间/空间/网络）
- [ ] MCMC 误差：自相关时间、有效样本量（作为“可置信”最低门槛）

### 知识库（kb/）— 必做
- [ ] Concept：
  - [ ] `kb/concepts/涨落-响应 Fluctuation-response.md`
  - [ ] `kb/concepts/相关函数 Correlation function.md`
- [ ] Derivation：
  - [ ] `kb/derivations/协方差与二阶导（通用）.md`
- [ ] Method：
  - [ ] `kb/methods/MCMC 误差估计 自相关时间与 Blocking.md`
- [ ] Urban-mapping：
  - [ ] `kb/urban-mapping/参数扰动与城市系统响应敏感性.md`

### 习题与实验（exercises/）— 必做
- [ ] Written：
  - [ ] `exercises/written/M5_fluctuation_response.md`
- [ ] Notebook：
  - [ ] `exercises/notebooks/E05_sensitivity_od.ipynb`

## 完成标准（过关条件）
- [ ] 能用“扰动实验”回答：哪个参数/哪条成本扰动，对 OD 结构影响最大
- [ ] 能给出最小不确定性报告：ESS 或等价误差估计

## 城市问题主线（只保留最相关）
- 政策/冲击评估：把“改一点点”转成“响应量”，把“看起来波动”转成可量化不确定性（置信区间/误差）。
