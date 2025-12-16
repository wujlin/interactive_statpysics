import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { isValidElement } from "react";

import { MermaidDiagram } from "@/components/MermaidDiagram";

type PreProps = HTMLAttributes<HTMLPreElement> & { children?: ReactNode };

type CodeElementProps = {
  className?: string;
  children?: ReactNode;
};

function isCodeElement(node: ReactNode): node is ReactElement<CodeElementProps> {
  return isValidElement(node) && typeof node.type === "string" && node.type.toLowerCase() === "code";
}

function extractText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  return "";
}

export function MdxPre(props: PreProps) {
  const child = props.children;
  const codeChild = isCodeElement(child) ? child : Array.isArray(child) ? child.find(isCodeElement) : null;

  if (codeChild) {
    const className = String(codeChild.props.className ?? "");
    if (className.includes("language-mermaid") || className.includes("lang-mermaid")) {
      const code = extractText(codeChild.props.children);
      return <MermaidDiagram code={code} />;
    }
  }

  return <pre {...props} />;
}
