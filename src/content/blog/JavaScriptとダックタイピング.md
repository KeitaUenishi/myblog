---
title: "JavaScriptとダックタイピング"
id: ndbmu9x
public: false
publishedAt: 2025-06-25
editedAt: null
description: "気になったことを調べる記事 ダックタイピング もうひとつ、同じくWikiの概要より > プロトタイプベースはプログラマに、オブジェクトをどう振る舞わせるかということのみに集中させて、オブジェクトが実際"
tags:
  - 下書き
---


気になったことを調べる記事

# ダックタイピング

もうひとつ、同じくWikiの概要より

> プロトタイプベースはプログラマに、オブジェクトをどう振る舞わせるかということのみに集中させて、オブジェクトが実際に振る舞えるかどうかの疑問を後回しにできる環境を提供する[[3]](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%83%88%E3%82%BF%E3%82%A4%E3%83%97%E3%83%99%E3%83%BC%E3%82%B9#cite_note-3)。振る舞いとは[メソッド](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89_(%E8%A8%88%E7%AE%97%E6%A9%9F%E7%A7%91%E5%AD%A6))である。疑問の後回しとは[動的型付け](https://ja.wikipedia.org/wiki/%E5%8B%95%E7%9A%84%E5%9E%8B%E4%BB%98%E3%81%91)の[ダックタイピング](https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%83%E3%82%AF%E3%82%BF%E3%82%A4%E3%83%94%E3%83%B3%E3%82%B0)を意味している。プロトタイプベースは[静的型付け](https://ja.wikipedia.org/wiki/%E9%9D%99%E7%9A%84%E5%9E%8B%E4%BB%98%E3%81%91)の実装を排除してる訳ではないが、その特性と利点を最大限に活かすための[動的型付け](https://ja.wikipedia.org/wiki/%E5%8B%95%E7%9A%84%E5%9E%8B%E4%BB%98%E3%81%91)が好まれている。

[https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%83%88%E3%82%BF%E3%82%A4%E3%83%97%E3%83%99%E3%83%BC%E3%82%B9](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%83%88%E3%82%BF%E3%82%A4%E3%83%97%E3%83%99%E3%83%BC%E3%82%B9)

ここで出てきたダックタイピングという言葉は別の動的プログラミング言語であるRubyの解説にもたびたび出てくる。

ダックタイピングについての有名な引用

> "If it walks like a duck and quacks like a duck, it must be a duck"
> （もしもそれがアヒルのように歩き、アヒルのように鳴くのなら、それはアヒルに違いない）

ダックタイピングとは、オブジェクトの型

[https://qiita.com/shimgo/items/9d9fbab1e3a7c4343f7b](https://qiita.com/shimgo/items/9d9fbab1e3a7c4343f7b)