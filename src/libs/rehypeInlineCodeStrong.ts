/**
 * Rehype plugin:
 * - For inline <code> (i.e. not inside <pre>), convert **bold** markers into <strong> nodes.
 * - This enables "code + bold" without changing the source Markdown.
 */
export default function rehypeInlineCodeStrong() {
  return (tree: unknown) => {
    walk(tree, null);
  };
}

type HastNode = HastElement | HastText | HastUnknown;

type HastText = {
  type: "text";
  value: string;
};

type HastElement = {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type HastUnknown = {
  type?: string;
  [key: string]: unknown;
};

function isHastElement(node: unknown): node is HastElement {
  if (!node || typeof node !== "object") return false;
  const n = node as Record<string, unknown>;
  return n.type === "element" && typeof n.tagName === "string";
}

function isHastText(node: unknown): node is HastText {
  if (!node || typeof node !== "object") return false;
  const n = node as Record<string, unknown>;
  return n.type === "text" && typeof n.value === "string";
}

function walk(node: unknown, parent: HastElement | null) {
  if (!node || typeof node !== "object") return;

  if (isHastElement(node) && node.tagName === "code") {
    const parentTag = parent?.tagName ?? null;
    // Skip code blocks: <pre><code>...</code></pre>
    if (parentTag !== "pre") {
      transformInlineCodeNode(node);
    }
  }

  const children = (node as HastElement | HastUnknown).children;
  if (Array.isArray(children)) {
    for (const child of children) {
      walk(child, isHastElement(node) ? node : parent);
    }
  }
}

function transformInlineCodeNode(codeNode: HastElement) {
  const children = codeNode.children ?? [];
  if (children.length === 0) return;

  // Only handle simple text-only inline code: <code>TEXT</code>
  if (!children.every(isHastText)) {
    return;
  }

  const text = children.map((c) => c.value).join("");
  if (!text.includes("**")) return;

  const parts = splitByBoldMarkers(text);
  if (!parts) return;

  codeNode.children = parts;
}

/**
 * Splits "foo **bar** baz" into HAST children:
 *   [{text:"foo "}, {strong:"bar"}, {text:" baz"}]
 *
 * Returns null if no valid **...** markers exist.
 */
function splitByBoldMarkers(input: string): HastNode[] | null {
  const re = /\*\*([^*]+?)\*\*/g;
  let lastIndex = 0;
  const out: HastNode[] = [];
  let matched = false;

  // Biome: avoid assignments in expressions

  while (true) {
    const m = re.exec(input);
    if (!m) break;
    matched = true;
    const [full, inner] = m;
    const start = m.index;
    const end = start + full.length;

    if (start > lastIndex) {
      out.push({ type: "text", value: input.slice(lastIndex, start) });
    }

    out.push({
      type: "element",
      tagName: "strong",
      properties: {},
      children: [{ type: "text", value: inner }],
    });

    lastIndex = end;
  }

  if (!matched) return null;
  if (lastIndex < input.length) {
    out.push({ type: "text", value: input.slice(lastIndex) });
  }

  return out;
}
