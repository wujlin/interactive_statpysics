import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "StatPhys × Urban Learning",
  description: "统计物理 × 城市复杂动力：交互式学习（路线 A）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/">
              StatPhys × Urban <span className="badge">MVP</span>
            </Link>
            <nav className="nav" aria-label="主导航">
              <Link href="/modules">Modules</Link>
              <Link href="/checklist">Checklist</Link>
              <Link href="/kb">KB</Link>
              <Link href="/exercises">Exercises</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/references">References</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="footer-inner">
            <span className="muted">路线 A：阅读 + 检索 + 进度（本地 pytest 验证）</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
