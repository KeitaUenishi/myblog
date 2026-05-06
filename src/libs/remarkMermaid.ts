import { Buffer } from "node:buffer";

import { visit } from "unist-util-visit";

import type { Root, Code, Html } from "mdast";

/**
 * Embeds Mermaid source as base64 in `data-mermaid-b64` so `<` / `>` (e.g. `<<abstract>>`, `<|--`)
 * never pass through the HTML parser as tags. `BlogPost.astro` decodes into `textContent` before Mermaid runs.
 */
export default function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index === undefined) return;

      const b64 = Buffer.from(node.value, "utf8").toString("base64");
      const htmlNode: Html = {
        type: "html",
        value: `<pre class="mermaid" data-mermaid-b64="${b64}"></pre>`,
      };

      parent.children[index] = htmlNode as unknown as Code;
    });
  };
}
