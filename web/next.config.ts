import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined): string | undefined {
  const v = (value ?? "").trim();
  if (!v) return undefined;
  if (v === "/") return undefined;
  return v.startsWith("/") ? v : `/${v}`;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // 路线 A：纯静态导出优先（便于 GitHub Pages / 离线分享）
  // 但 `next dev` + `output: "export"` 在动态路由上会有严格的 params 检查，开发期先用默认输出更稳定。
  ...(isDev ? {} : { output: "export" }),
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
