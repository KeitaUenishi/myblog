import { visit } from "unist-util-visit";

import type { Root, Code, Html } from "mdast";

export default function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index === undefined) return;

      const htmlNode: Html = {
        type: "html",
        value: `<pre class="mermaid">${node.value}</pre>`,
      };

      parent.children[index] = htmlNode as unknown as Code;
    });
  };
}
