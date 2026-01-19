---
title: "dotenvでenvファイルを読み込みたい時の備忘録"
id: t3o7m1y
public: true
publishedAt: 2023-06-06
editedAt: null
description: "https://www.npmjs.com/package/dotenv?activeTab=readme dotenvを使用してnode上で環境変数を読もうとした際、めちゃくちゃシンプルな凡ミスにす"
tags:
  - node
  - JavaScript
---


[https://www.npmjs.com/package/dotenv?activeTab=readme](https://www.npmjs.com/package/dotenv?activeTab=readme)

dotenvを使用してnode上で環境変数を読もうとした際、めちゃくちゃシンプルな凡ミスにすごく時間を使ってしまったので、メモ。

dotenvでは、

`require('dotenv').config()`

によって読み込みに行ってくれるファイルは、.envのみ。

ハマっていた時のファイル

![](_images/Untitled%2090.png)

.envファイルを追加することで、環境変数を読んでくれるようになった。

![](_images/Untitled%2091.png)

シンプルながら.env.localと.envを同じに見ていたことによる凡ミス……

戒めのために書き記しておく…。

参考

[https://www.twilio.com/ja/blog/working-with-environment-variables-in-node-js-html-jp](https://www.twilio.com/ja/blog/working-with-environment-variables-in-node-js-html-jp)

[https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)