---
title: "JavaScript アロー関数とthis"
id: ndh4k2o
public: false
publishedAt: 2025-07-26
editedAt: null
description: "this という闇に包まれた存在について整理する。 javascript const q = document.querySelector; q(\"body\"); // Uncaught TypeEr"
tags:

---


`this` という闇に包まれた存在について整理する。

```javascript
const q = document.querySelector;
q("body"); // Uncaught TypeError: Illegal invocation
```

> このように、関数内での`this`がどうなっているかは、その関数をどのように呼び出したかによって決まります。`foo.bar()`というメソッド呼び出しの記法を用いて呼んだ場合は、関数`bar`内での`this`の値は`foo`です。つまり、`foo.bar()`というメソッド呼び出しの記法は、ただ単に「`foo.bar`に入っている関数を呼び出す」という意味なのではなく、「`this`を`foo`として、`foo.bar`を呼び出す」とおいう意味のプログラムだったのです。

[https://qiita.com/uhyo/items/a41cf51399de6f3fbd60#%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E5%8E%9F%E5%9B%A0](https://qiita.com/uhyo/items/a41cf51399de6f3fbd60#%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E5%8E%9F%E5%9B%A0)

上記のコードで `q` 関数を実行した際、 `q` 関数内のthisはdocumentではなくグローバルオブジェクトを指すようになってしまう。


> これは元のプログラムを[η変換](https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%A0%E3%83%80%E8%A8%88%E7%AE%97#%CE%B7-%E5%A4%89%E6%8F%9B)しただけのように見えますが、`document.querySelector`を呼び出すときはあくまでメソッド呼び出しの記法を使われているのがポイントです。これなら`querySelector`を呼び出すときの`this`がちゃんと`document`になっているため、エラーにはなりません。

[https://qiita.com/uhyo/items/a41cf51399de6f3fbd60#%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E5%AF%BE%E5%87%A6%E6%B3%95](https://qiita.com/uhyo/items/a41cf51399de6f3fbd60#%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E5%AF%BE%E5%87%A6%E6%B3%95)