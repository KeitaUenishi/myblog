---
title: "Next.jsでpageExtensionsを設定するとmiddlewareが動かなくなる問題"
id: t3p01te
public: true
publishedAt: 2023-11-20
editedAt: null
description: "以下のverで開発中に遭遇した事象です。ドキュメントに記載されているので、新しいverでもおそらくそのままかも？ - next v12.3.4 結論 middlewareもpageExtensions"
tags:
  - JavaScript
---


以下のverで開発中に遭遇した事象です。ドキュメントに記載されているので、新しいverでもおそらくそのままかも？

- next v12.3.4

## 結論

middlewareもpageExtensionsの対象になる。ドキュメントに思い切り書いていた…。

## 背景

pageExtensionsとは、next.config.jsで設定できるプロパティのことで、以下のような形で設定できる。

```javascript
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  pageExtensions: ["page.tsx", "api.ts"],
};

module.exports = nextConfig
```

この場合は、pagesディレクトリ下のファイルはindex.page.tsxだったりindex.api.tsxだったりといったファイルしかNext.jsのルーティングとして読み込まれないようになる。

[https://nextjs.org/docs/pages/api-reference/next-config-js/pageExtensions](https://nextjs.org/docs/pages/api-reference/next-config-js/pageExtensions)

なぜこんなことをしたのかというと、pages下のディレクトリにテストコードとかをまとめて置いておきたいなー、と考えたため。

[https://zenn.dev/takepepe/articles/testing-gssp-and-api-routes](https://zenn.dev/takepepe/articles/testing-gssp-and-api-routes)

しかしこのpageExtentsionsを追加してから、middleware.tsに記載している処理が動かなくなってしまった。

middlewareについての詳しいことはこちら

[https://nextjs.org/docs/pages/building-your-application/routing/middleware](https://nextjs.org/docs/pages/building-your-application/routing/middleware)

> ミドルウェアを使うと、リクエストが完了する前にコードを実行することができる。そして、送られてきたリクエストに基づいて、レスポンスを書き換えたり、リダイレクトしたり、リクエストやレスポンスのヘッダーを変更したり、直接レスポンスしたりすることで、レスポンスを変更することができる。

結論にも書いた通り、pageExtensionsを追加した場合は、middlewareも対象になるよう。この場合はmiddleware.page.tsか、middleware.api.tsにすれば解決。だが、なんかちょっと気持ち悪い感はある（個人の感想）

もともと、middlewareのドキュメントには注意書きが記載されていたようだが、削除された模様。

[https://github.com/vercel/next.js/pull/40039](https://github.com/vercel/next.js/pull/40039)

どうやらpageExtensionsは頻繁に使用されるようなものではないものらしい。

一つ勉強になったとともに、まずはドキュメントに目を通そう、を改めて実感した。