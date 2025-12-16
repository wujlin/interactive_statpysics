# StatPhys × Urban Learning（前端，路线 A）

这个前端是一个 **离线优先** 的阅读/检索/进度站点：
- 学习路线：仓库内 `statphys_urban_learning/modules/`（本地扫描）
- 知识库：仓库内 `statphys_urban_learning/kb/`（本地扫描）
- 公式渲染：KaTeX（`rehype-katex`）
- 双链：把 Obsidian 风格 `[[...]]` 转成站内链接

## 本地运行

在 `web/` 下：

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 页面入口
- `/modules`：学习路线（M0–M9 checklist）
- `/kb`：知识库（Concept/Derivation/Method/Urban-mapping/Sources）
- `/checklist`：严格对齐版硬标准
- `/exercises`：习题入口（written + notebooks）
- `/projects`：项目入口（README + notebooks + pytest）
- Mermaid：支持 Markdown 内 ` ```mermaid ` 代码块（用于学习路径图谱等）

## 静态导出（可选，用于 GitHub Pages）

本项目使用 `output: "export"`，构建后生成静态站点目录 `web/out/`：

```bash
npm run build
```

### GitHub Pages basePath

如果部署到 `https://<user>.github.io/<repo>/`，需要设置 basePath：

```bash
NEXT_PUBLIC_BASE_PATH=/Stat_dynamics npm run build
```

然后把 `web/out/` 作为 Pages 的发布目录即可。
