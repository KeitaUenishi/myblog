---
title: "ReactのTanstack Tableで発生する無限ループ問題"
id: t6zipzg
public: true
publishedAt: 2023-03-03
editedAt: null
description: "業務でTanstack Tableを使用している中で、無限ループに引っかかったため備忘録として記事にしておこうと思います。 Tanstack Tableとは テーブルの作成を容易に実装できるヘッドレス"
tags:
  - React
  - JavaScript
  - Bug
---



業務でTanstack Tableを使用している中で、無限ループに引っかかったため備忘録として記事にしておこうと思います。

## Tanstack Tableとは

テーブルの作成を容易に実装できるヘッドレスUIライブラリです。

ヘッドレスUIとは

> **UI要素やインタラクションのロジック、状態、処理、APIを提供し、マークアップやスタイルを提供しないライブラリやユーティリティ**
を指す言葉です。

引用: [https://blog.microcms.io/radix-ui-headless-ui/](https://blog.microcms.io/radix-ui-headless-ui/)

※ Headless UIというUIコンポーネントもあるが、こちらとは意味合いが異なります。

詳細については公式Docにて。

[https://tanstack.com/table/v8/docs/guide/introduction](https://tanstack.com/table/v8/docs/guide/introduction)

## 現象

本題です。

現象としては、Tableに表示されるデータが0件の場合のみ、原因不明の無限ループが発生する。

無限ループといえば、useEffectの依存配列に指定したstateを更新しているのではないだろうか、と調べたがそれらしき箇所は見当たらず。

## 原因と対処法

結論から言うと、下記のようにuseReactTableフックを利用してインスタンスを生成する際に、dataがnullやundifindであれば「空配列」を渡してしまっていることが原因でした。

```javascript
const table = useReactTable({
  data: data || [],
  columns,
  getCoreRowModel: getCoreRowModel(),
});
```

TanStack Tableではdataに[] を渡すと再レンダリングのたびに新しく配列を作成するらしく、その結果無限ループが発生してしまっていたよう。

[https://github.com/TanStack/table/issues/4240](https://github.com/TanStack/table/issues/4240)

回答の引用と翻訳

> Because with data = [] data will never be undefined inside Table it will always be an empty array.
The infinite render is caused because you are creating a new empty array on every render and [] !== [].
You can fix it by having a constant empty array:

> なぜなら、data = [] の場合、Table の内部で data が undefined になることはなく、常に空の配列になるからです。
無限レンダリングは、レンダリングのたびに新しい空の配列を作成しているためで、[] !== []となります。
常に空の配列を持つようにすれば解決します。

日本語では記事がなかったので、あんまり遭遇しない事例なのか……？

もし同じような現象に悩まされている方がいましたら、参考になればと思います！