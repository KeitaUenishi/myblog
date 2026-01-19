---
title: "GraphQLの基礎まとめ"
id: 5rgwzp2
public: true
publishedAt: 2023-02-23
editedAt: null
description: "完全な個人用メモです。 GraphQLの「Graph」とは グラフ理論のこと ノード（頂点）の集合とエッジ（辺）の集合で構成されるグラフに関する学問。 https://dev.classmethod."
tags:
  - GraphQL
  - Web
---


完全な個人用メモです。

## GraphQLの「Graph」とは

グラフ理論のこと

ノード（頂点）の集合とエッジ（辺）の集合で構成されるグラフに関する学問。

[https://dev.classmethod.jp/articles/graph-theory/](https://dev.classmethod.jp/articles/graph-theory/)


## GraphQLとは？

API用のクエリ言語。

TypeSystemを使用してクエリを実行するためのサーバー側のランタイム（実装）。

### クエリ（QL）とは

「質問」や「問い合わせ」を意味する。

DBMSに対してデータの検索などの処理を行うように求める命令文のことを指す。

### GraphQL スキーマとは

> GraphQL APIサーバーがどんなクエリを受け付けてくれるかを示すもの。
GraphQL Schema Langage（DSL）で記述する。
スキーマは型情報だけを定義したものであり、サーバーの実装ロジックは考慮しない。

[https://maku.blog/p/5s5jvfz/](https://maku.blog/p/5s5jvfz/)

> GraphQL APIの仕様を表現するもの。
GraphQL APIを構築するにあたり、FW、言語に依存せずにSDLで表現できます。

[https://qiita.com/NagaokaKenichi/items/d341dc092012e05d6606](https://qiita.com/NagaokaKenichi/items/d341dc092012e05d6606)

**そもそも「スキーマ」とは**

> **スキーマ**とは、図式、図解、概要、あらまし、などの意味を持つ英単語。物事や計画の概略や仕組み、構造、形式などを示したものを意味することが多い。

データベースに「どのような種類のデータをどのような構造で格納するかを定義したもの」をスキーマという。

スキーマ言語

> [**SGML**](https://e-words.jp/w/SGML.html)や[**XML**](https://e-words.jp/w/XML.html)などの汎用的な[**マークアップ言語**](https://e-words.jp/w/%E3%83%9E%E3%83%BC%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97%E8%A8%80%E8%AA%9E.html)で、使用する[**タグ**](https://e-words.jp/w/%E3%82%BF%E3%82%B0.html)
の宣言や属性の[**書式**](https://e-words.jp/w/%E6%9B%B8%E5%BC%8F.html)などを記述し、ある特定の用途や[**データ構造**](https://e-words.jp/w/%E3%83%87%E3%83%BC%E3%82%BF%E6%A7%8B%E9%80%A0.html)のための具体的なマークアップ言語を定義するための言語（[**メタ言語**](https://e-words.jp/w/%E3%83%A1%E3%82%BF%E8%A8%80%E8%AA%9E.html)）を[**スキーマ言語**](https://e-words.jp/w/%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%9E%E8%A8%80%E8%AA%9E.html)という。

[https://e-words.jp/w/スキーマ.html](https://e-words.jp/w/スキーマ.html)

ざっくりいうと「何かの構造」についてす表すときに扱われる、抽象的な概念。

データベースをはじめ、いろんな技術にスキーマの概念は存在するが、それぞれ意味合いは全く異なっている。

GraphQLでのスキーマとは、クライアントがアクセスを行うAPIの仕様を表現するもの。

フロントエンドとバックエンド間の**通信を定義したインターフェース**。

RESTのように、APIのデータをエンドポイントの集合で捉えるのではなく、「**型の集合**」として捉える。

この「型の集合」をスキーマと呼ぶ。

> チームで開発する際は、フロントエンドとバックエンドの両方にスキーマによる型定義の情報を把握しておく必要があります。スキーマを定義することで、クライアントサイドとサーバーサイドの両方で、GraphQLのリクエストを型チェック（バリデーション）を行うため、例えば、バックエンドで定義した型と異なるクエリをフロントエンドで実行した場合、正常にデータを取得できずエラーが返ってきます。

[https://www.multispots.net/graphql-schema/](https://www.multispots.net/graphql-schema/)


### リゾルバ（resolver）とは

> **Resolvers**は GraphQL の operation（query や mutation や subscription）が、実際にどのような処理を行なってデータを返すのかという指示書です。**Resolver**は schema で定義した型の値を返さなければいけません。もしくはその型の値の promise を返さなければいけません。

[https://apollographql-jp.com/tutorial/resolvers/#what-is-a-resolver](https://apollographql-jp.com/tutorial/resolvers/#what-is-a-resolver)

スキーマはあくまで定義のみで、実際のデータ操作は行わない。

実際のデータ操作を行い、返すデータを実装するのがリゾルバー。

リゾルバーの実態は特定のフィールドのデータを返す関数（メソッド）。サーバーサイドの開発者側が提供する必要がある。


## REST APIとの違い

### REST API

データを取得する際に、複数のエンドポイント （http://○○○○/users, http://○○○○/posts などのようなURI） を利用する。

必要なデータがあれば各エンドポイントに問い合わせ、データを取得しクライアント側で使用する。

- アンダーフェッチ
必要なデータを取得する際に、1つのエンドポイントから取得できない場合、複数のエンドポイントに問い合わせて取得したデータを合わせなければならない状態。
- オーバーフェッチ
Userデータからemailのみを使用したい場合、画面に描画する必要がないデータも一緒に取得してしまうこと。

### GraphQL

「1つのエンドポイントのみ」を持ち、クエリーを設定（問い合わせ、更新、どのデータが欲しいかの指定）することでサーバーからデータを取得することができる。

![](_images/Untitled%2038.png)

引用

[https://zenn.dev/yoshii0110/articles/2233e32d276551#クライアントからのレスポンス形式の指定](https://zenn.dev/yoshii0110/articles/2233e32d276551#クライアントからのレスポンス形式の指定)


## GraphQLでのクエリ言語

### Query

データ取得用

RESTでのGET、SQLでのSelectにあたる

### Mutation

データ更新用

RESTではPOST, PATCH, DELETE

SQLではCreate, Update, Delete

に該当する

Mutationは「突然変異」という意味。

おそらくGraphQLでのみ使用されている言葉。

### Subscription

イベント監視用

ChatアプリなどのようなリアルタイムのRead Operationに利用する。

これらの3つを「オペレーション型」と呼んでいる。

[https://zenn.dev/offers/articles/20220609-graphql-onboarding#クエリ言語](https://zenn.dev/offers/articles/20220609-graphql-onboarding#クエリ言語)
