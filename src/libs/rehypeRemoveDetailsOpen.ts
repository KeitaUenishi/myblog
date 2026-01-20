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

export default function rehypeRemoveDetailsOpen() {
  return (tree: unknown) => {
    walk(tree);
  };
}

function walk(node: unknown) {
  if (!node || typeof node !== "object") return;

  if (isHastElement(node) && node.tagName === "details") {
    if (hasCalloutClass(node.properties)) {
      if (node.properties && "open" in node.properties) {
        delete node.properties.open;
      }
    }
  }

  const children = (node as HastElement | HastUnknown).children;
  if (Array.isArray(children)) {
    for (const child of children) {
      walk(child);
    }
  }
}

function hasCalloutClass(properties?: Record<string, unknown>): boolean {
  if (!properties) return false;
  const className = properties.className;
  if (Array.isArray(className)) {
    return className.includes("callout");
  }
  if (typeof className === "string") {
    return className.split(" ").includes("callout");
  }
  return false;
}

function isHastElement(node: unknown): node is HastElement {
  if (!node || typeof node !== "object") return false;
  const n = node as Record<string, unknown>;
  return n.type === "element" && typeof n.tagName === "string";
}

