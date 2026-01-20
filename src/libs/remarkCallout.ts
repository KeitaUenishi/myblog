import { visit } from "unist-util-visit";

import type { Root, Blockquote, Text, Paragraph } from "mdast";

export default function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      if (node.children.length === 0) return;

      const firstChild = node.children[0];
      if (firstChild.type !== "paragraph") return;

      const firstTextNode = firstChild.children[0];
      if (firstTextNode?.type !== "text") return;

      // [!type][+-] の形式をマッチング
      const match = firstTextNode.value.match(/^\[!(\w+)\]([+-]?)[ \t]*/);
      if (!match) return;

      const type = match[1].toLowerCase();
      const matchLength = match[0].length;

      // 接頭辞を削除
      firstTextNode.value = firstTextNode.value.slice(matchLength);

      // 最初の段落の全要素をタイトルとして収集
      const titleChildren = [...firstChild.children];

      // 先頭のテキストノードが空になった場合は削除
      if (
        titleChildren[0]?.type === "text" &&
        (titleChildren[0] as Text).value === ""
      ) {
        titleChildren.shift();
      }

      // タイトルが空の場合はタイプ名をデフォルトのタイトルにする
      if (titleChildren.length === 0) {
        titleChildren.push({
          type: "text",
          value: type.charAt(0).toUpperCase() + type.slice(1),
        });
      }

      // 元の最初の段落を削除（または中身を空にする）
      node.children.shift();

      // blockquote を details に変換
      node.data = node.data || {};
      node.data.hName = "details";
      node.data.hProperties = {
        className: ["callout", `callout-${type}`],
      };

      // summary 要素を作成
      const summary: Paragraph = {
        type: "paragraph",
        data: {
          hName: "summary",
          hProperties: {
            className: ["callout-title"],
          },
        },
        children: titleChildren,
      };

      // details の先頭に summary を追加
      node.children.unshift(summary);
    });
  };
}
