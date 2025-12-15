import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined): string | undefined {
  const v = (value ?? "").trim();
  if (!v) return undefined;
  if (v === "/") return undefined;
  return v.startsWith("/") ? v : `/${v}`;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  // 路线 A：纯静态导出优先（便于 GitHub Pages / 离线分享）
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
