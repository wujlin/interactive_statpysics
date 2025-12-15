# 统计物理 × 城市复杂动力：交互式学习 Project（模板）

这个仓库的目标：用**主线分明**的方式学习统计物理，并把学习过程沉淀成：
- 可检索的知识库（`kb/`）
- 可运行的习题与实验（`exercises/`）
- 可复用的城市建模项目（`projects/`）

---

## 模块与严格清单
- 模块入口：`modules/index.md`
- 严格对齐版清单：`checklist.md`

## 推荐主线（可替换）
- 主线教材：Swendsen *An Introduction to Statistical Mechanics and Thermodynamics*（2012）
- 计算并行：Krauth *Statistical Mechanics: Algorithms and Computations*（2006）
- 二刷加强：Sethna *Entropy, Order Parameters, and Complexity*（2nd ed., 2021）
- 参考字典：Pathria & Beale *Statistical Mechanics*（4th ed.）
- 非平衡进阶：Zwanzig *Nonequilibrium Statistical Mechanics*（后期）

教材合法入口见：`references/reading_list.md`

---

## 从哪里开始（最短闭环）
1. 打开 `modules/index.md`，按 M0→M9 逐个打勾推进  
2. 先跑通一个城市落地项目：`projects/p01_maxent_od/`  
3. 每个模块至少交付：卡片（kb）+ 习题（exercises）+ 一个最小城市映射（kb/urban-mapping）

---

## 目录索引
- 学习路线：`modules/`
- 知识库：`kb/`（包含 `kb/sources/` 的教材 source 卡）
- 习题：`exercises/`
- 项目：`projects/`
- 参考资料入口：`references/`

---

## 运行（可选）
安装依赖：
```bash
pip install -r requirements.txt
```

运行现有自动检查：
```bash
pytest -q
```

---

## 版权与合规
- 本仓库默认 **不存放** 受版权保护的教材 PDF。
- 若你有合法获取的 PDF，请放到 `references/pdfs/`（已在 `.gitignore` 中忽略）。
