# Module 讲义模板（Scrollytelling）

> 目的：把 `modules/M*.md` 从“考试大纲”升级为可阅读的 **Mini-Lecture**。  
> 原则：**正文讲故事**（降低认知负荷），KB/公式锚点作为**脚注式加深**，Checklist **后置**用于验收。

---

## 结构（推荐）

```markdown
# Mx 标题：一句话抓主线

## Introduction（科学史/核心矛盾）
用“矛盾/范式转变/边界”开场：为什么学？解决什么？这章的适用范围在哪里？

## References（Seminal papers，SSOT）
- 统一见：`references/seminal_papers.md`（条目：`SP-Mx-...`）

> **核心目标**：用 1–2 句写清“学完你能做什么”（可检验、可操作）。

## 推荐学习顺序（15–30 分钟）
1) 先通读本页正文（不要一上来就点 KB）
2) 跑 1 个最小 notebook / pytest，拿到可验证结果
3) 卡住再回看 KB（概念/推导/方法），最后再回原书核对锚点

---

## Part 1：直觉与问题设置
先用一个具体情境/反例，把“要解决的问题”讲清楚（不要先丢定义）。

> **关键概念：XXX**
> 用通俗比喻 + 1 条公式（可选）
> 若想看更严谨的定义与误区清单，可读：[[对应 KB 卡片标题]]

---

## Part 2：核心推导（只保留主线）
把推导写成“≤6 步主线”，不追求穷举细节，但要写清假设/变量。

完整推导可见：[[某个 derivation 卡片]]。  
公式锚点要写进句子里，例如：“正如 Swendsen 在 Eq 12.10 中定义的……”

---

## Part 3：最小可验证实验（代码/数值）
告诉学生先跑哪个 notebook/pytest，跑完应该看到什么数值/图像。

Notebook：`exercises/notebooks/...`  
pytest：`exercises/tests/...`

---

## Part 4：城市映射（把符号翻译成可测量的量）
用表格或 3–5 行文字把 “E,T,μ,势函数/通量” 映射到城市量。

更完整的映射与可检验预测见：[[urban-mapping 卡片]]

---

## Part 5：动手时刻（Checklist）
把清单藏到最后：用于复习/打卡/验收，不承担“讲课”功能。

### 必读（指到具体页/公式编号，避免“去看一章”）
- [ ] Swendsen：Chapter X，Eq a.b–c.d（你要核对的 1–2 个锚点）

### 必做（KB / Exercises / Projects）
- [ ] Concept：`kb/concepts/...`
- [ ] Derivation：`kb/derivations/...`
- [ ] Method：`kb/methods/...`
- [ ] Urban-mapping：`kb/urban-mapping/...`
- [ ] Exercises：`exercises/...`（含 pytest）
- [ ] Projects：`projects/...`（含 notebook + 误差分析）

### 验收标准（2–3 条可判定标准）
- [ ] ……
```

---

## 写作约定（KISS）
- **Pain-driven**：每个新概念都要回答“旧概念哪里不够用”，段落之间用明确的逻辑衔接词把痛点串起来。
- **正文优先讲清“为什么/是什么/怎么用/边界”**，KB 卡片当脚注，不要让学生不停跳转。
- **锚点要写进句子里**：不要只列 `Eq x.y`，而要写“正如 Eq x.y 所示，我们因此……”
- **每个 Part 一句话能总结**：读者滚动到任意位置都不迷路。
- **公式只保留主线**：细节推导放 derivation 卡片；代码细节放 method/pytest。
