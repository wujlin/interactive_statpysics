import { findKbSlugByTitle } from "@/lib/kb";

function encodeSlug(slug: string[]): string {
  return slug.map((s) => encodeURIComponent(s)).join("/");
}

function encodePathSegments(pathname: string): string {
  return pathname
    .split("/")
    .filter((s) => s.length > 0)
    .map((s) => encodeURIComponent(s))
    .join("/");
}

function transformOutsideFences(markdown: string, transformLine: (line: string) => string): string {
  const lines = markdown.split("\n");
  let inFence = false;
  let fence = "";
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimStart();
    const isFenceStart = !inFence && (trimmed.startsWith("```") || trimmed.startsWith("~~~"));
    const isFenceEnd = inFence && fence && trimmed.startsWith(fence);

    if (isFenceStart) {
      inFence = true;
      fence = trimmed.startsWith("```") ? "```" : "~~~";
      out.push(line);
      continue;
    }
    if (isFenceEnd) {
      inFence = false;
      fence = "";
      out.push(line);
      continue;
    }

    out.push(inFence ? line : transformLine(line));
  }
  return out.join("\n");
}

function normalizeLatexDelimiters(markdown: string): string {
  return transformOutsideFences(markdown, (line) =>
    line
      .replaceAll("\\(", "$")
      .replaceAll("\\)", "$")
      .replaceAll("\\[", "$$")
      .replaceAll("\\]", "$$"),
  );
}

function rewriteObsidianWikiLinks(markdown: string): string {
  return transformOutsideFences(markdown, (line) =>
    line.replace(/\[\[([^[\]]+)\]\]/g, (m, inner: string) => {
      const raw = String(inner).trim();
      const [targetPart, aliasPart] = raw.split("|", 2).map((s) => s.trim());
      const target = targetPart;
      const text = aliasPart || targetPart;

      const slug = findKbSlugByTitle(target);
      if (!slug) return text;

      const href = "/kb/" + encodeSlug(slug);
      return `[${text}](${href})`;
    }),
  );
}

function rewriteMarkdownLinks(markdown: string): string {
  return transformOutsideFences(markdown, (line) => {
    let out = line;

    // exercises: ../solutions/<slug>.md -> /exercises/solutions/<slug>
    out = out.replace(/\]\(\s*\.\.\/solutions\/([^)\s]+?)\.md\s*\)/g, (_m, slug: string) => {
      const href = "/exercises/solutions/" + encodeURIComponent(String(slug));
      return `](${href})`;
    });

    // modules/index.md: (M0_xxx.md) or (./M0_xxx.md) -> /modules/M0_xxx
    out = out.replace(/\]\(\s*(?:\.\/)?(M\d+_[^)\s]+?)\.md\s*\)/gi, (_m, slug: string) => {
      const href = "/modules/" + encodeURIComponent(String(slug));
      return `](${href})`;
    });

    return out;
  });
}

function rewriteInlineRepoPaths(markdown: string): string {
  // 把仓库内常见的 `kb/...`, `modules/...`, `exercises/...`, `projects/...` 路径变成可点击站内链接（仍保持代码样式）
  return transformOutsideFences(markdown, (line) => {
    let out = line;

    out = out.replace(/`(kb\/[^`]+?\.md)`/g, (_m, p1: string) => {
      const rel = String(p1).replace(/^kb\//, "").replace(/\.md$/i, "");
      const href = "/kb/" + encodePathSegments(rel);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(/`(modules\/[^`]+?\.md)`/g, (_m, p1: string) => {
      const slug = String(p1).replace(/^modules\//, "").replace(/\.md$/i, "");
      const href = "/modules/" + encodeURIComponent(slug);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(/`(exercises\/written\/[^`]+?\.md)`/g, (_m, p1: string) => {
      const slug = String(p1).replace(/^exercises\/written\//, "").replace(/\.md$/i, "");
      const href = "/exercises/written/" + encodeURIComponent(slug);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(/`(exercises\/notebooks\/[^`]+?\.ipynb)`/g, (_m, p1: string) => {
      const slug = String(p1).replace(/^exercises\/notebooks\//, "").replace(/\.ipynb$/i, "");
      const href = "/exercises/notebooks/" + encodeURIComponent(slug);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(/`(exercises\/solutions\/[^`]+?\.md)`/g, (_m, p1: string) => {
      const slug = String(p1).replace(/^exercises\/solutions\//, "").replace(/\.md$/i, "");
      const href = "/exercises/solutions/" + encodeURIComponent(slug);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(/`(projects\/([^`/]+?)\/)`/g, (_m, p1: string, project: string) => {
      const href = "/projects/" + encodeURIComponent(project);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(/`(projects\/([^`/]+?)\/README\.md)`/g, (_m, p1: string, project: string) => {
      const href = "/projects/" + encodeURIComponent(project);
      return `[\`${p1}\`](${href})`;
    });

    out = out.replace(
      /`(projects\/([^`/]+?)\/notebooks\/[^`]+?\.ipynb)`/g,
      (_m, p1: string, project: string) => {
        const slug = String(p1).replace(new RegExp(`^projects/${project}/notebooks/`), "").replace(/\.ipynb$/i, "");
        const href = `/projects/${encodeURIComponent(project)}/notebooks/${encodeURIComponent(slug)}`;
        return `[\`${p1}\`](${href})`;
      },
    );

    return out;
  });
}

export function preprocessKbMarkdown(markdown: string): string {
  // 顺序：先把路径/双链变成标准链接，再处理数学分隔符。
  return normalizeLatexDelimiters(rewriteObsidianWikiLinks(rewriteInlineRepoPaths(rewriteMarkdownLinks(markdown))));
}

export function preprocessModuleMarkdown(markdown: string): string {
  // module/checklist/exercises/projects 主要是 checklist + 路径引用：先做路径链接化，再处理 wiki links 与数学分隔符。
  return normalizeLatexDelimiters(rewriteObsidianWikiLinks(rewriteInlineRepoPaths(rewriteMarkdownLinks(markdown))));
}
