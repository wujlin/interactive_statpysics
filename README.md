# StatPhys × Urban Learning（统计物理 × 城市复杂动力：交互式学习）

这是一个**博士级训练**取向的学习型仓库：用统计物理的主线方法（系综、配分函数、相变、随机过程与计算）去构建可复用的城市复杂系统建模语言，并把学习过程沉淀为“可检索、可验证、可复现”的资产。

核心内容在 `statphys_urban_learning/`，其内部结构形成一个闭环：
- `statphys_urban_learning/modules/`：讲义式 Mini-Lecture（主线叙事 + 验收清单）
- `statphys_urban_learning/kb/`：知识库（概念/推导/方法/城市映射/来源）
- `statphys_urban_learning/exercises/`：习题（written + notebooks）与最小 pytest 验证
- `statphys_urban_learning/projects/`：城市场景项目（notebook 可复现 + 误差/敏感性分析）

配套前端在 `web/`：离线阅读 + 检索 + 进度（路线 A）。

> 学习主线与阅读顺序建议见：`outline.md`（主线教材以 Swendsen 为锚）。

---

## 快速开始

### 1) 运行离线前端（路线 A：阅读 + 检索 + 进度）

在仓库根目录：

```bash
cd web
npm install
npm run dev -- --port 3001
```

打开 `http://localhost:3001`，入口：
- `/modules`：模块讲义（M0–M9）
- `/kb`：知识库（悬浮提示来自各概念卡的 `## 一句话` 首行）
- `/exercises`：习题入口（written + notebooks）
- `/projects`：项目入口（README + notebooks + pytest）
- `/references`：参考文献与原始论文（SSOT）

静态导出（可选，适合 GitHub Pages）：
```bash
cd web
npm run build
```

更多前端说明见：`web/README.md`。

### 2) 运行 Python 代码与测试（本地 pytest 验证）

```bash
cd statphys_urban_learning
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

---

## 学习方式（推荐路径）

1. 从 `statphys_urban_learning/modules/index.md` 开始，按 M0→M9 推进（模块是“主题式”，并在正文/参考中注明与 Swendsen 的对应）。
2. 每个模块先读讲义正文（Introduction → 叙事主线），遇到术语再点 KB（或直接悬浮看提示）。
3. 完成该模块的 `exercises/written/` 与一个 notebook；用 `pytest` 做最小正确性验证。
4. 用模块的 `kb/urban-mapping/` 把物理结构映射到城市约束与可检验预测；进入对应 `projects/` 做可复现与误差分析。

---

## 交付标准（每个模块的最小闭环）

每个模块至少包含：
- **概念卡（Concept）**：定义 + 直觉 + 最小城市对应
- **推导卡（Derivation）**：假设列表 + 主线步骤 + 自检（维度/极限/数值）
- **代码 + pytest**：最小实现 + 可自动验证的检查
- **城市映射卡（Urban mapping）**：微观态/约束/势函数/可检验预测写清楚

项目级（`projects/`）额外要求：
- notebook 可复现（固定随机种子/清晰依赖）
- 图表/数值结论带误差或敏感性检验

仓库结构概览见：`statphys_urban_learning/STRUCTURE.md`。

---

## 引用与符号（学术规范）

- **符号体系统一**：本仓库正文优先采用 Swendsen 记号；冲突统一写入 `statphys_urban_learning/kb/sources/_notation_conventions.md`。
- **公式级引用（调试锚点）**：核心结论在卡片末尾以 `## Source anchors` 记录到“书名 + 公式编号”（例如 Swendsen Eq 19.53），用于推导卡住或代码对不上时逐步核对。
- **原始论文 SSOT**：统一维护在 `statphys_urban_learning/references/seminal_papers.md`（每条含 “Why this paper” 导读），模块里只引用条目号。

---

## 如何扩展内容（最小指令）

### 新增 KB 卡片

```bash
cd statphys_urban_learning
python scripts/new_card.py concept "概念名 Title"
python scripts/new_card.py derivation "推导标题"
python scripts/new_card.py method "方法名"
python scripts/new_card.py mapping "统计物理概念 → 城市问题"
```

### 新增交互组件（路线 A 的增益项）

交互组件注册在 `web/src/components/InteractiveConcept.tsx`，通过 Markdown 直接调用：
```md
<InteractiveConcept type="entropy-counter" />
```

---

## 目录说明（根目录）

- `statphys_urban_learning/`：课程内容与可验证代码（主仓库）
- `web/`：离线前端（Next.js + MDX + KaTeX，`output: "export"`）
- `Book/`：教材 PDF/扫描 Markdown（当前用于本地阅读与整理；如需公开仓库请先处理版权合规）
- `Computation_project/`：参考代码与计算实验素材（例如 `smac-master/`）

---

## 合规提示

本项目的目标是“学习与科研训练”。若计划公开发布，请先清理或迁移任何受版权保护的 PDF/扫描内容，并将引用改为“合法链接 + 公式级锚点”形式。
