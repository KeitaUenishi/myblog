---
title: "JavaScriptとwindowオブジェクト"
id: tzbe6q0
public: true
publishedAt: 2025-08-09
editedAt: null
description: "JavaScript（というかウェブアプリケーション）を触っていると必ずと言っていいほどお目にかかる window オブジェクトについて、これがなんなのかを深ぼっている記事です。基本的に全体通してまと"
tags:
  - JavaScript
  - ブラウザ
---


JavaScript（というかウェブアプリケーション）を触っていると必ずと言っていいほどお目にかかる `window` オブジェクトについて、これがなんなのかを深ぼっている記事です。基本的に全体通してまとめられてはおらず、考察と理解を積み重ねる形で進められていきます。メモのような記事です。情報の正確性については各引用元をご参照ください。

# windowオブジェクトについて

「JavaScriptとプロトタイプ汚染」について個人的に調べていたところ、ChatGPT先生からの回答で

> DOM ノードや window などは内部的に “ハードコードされた” プロトタイプを持ち、Object.prototype 直下にはぶら下がっていません。また外部から __proto__ で差し替えることも禁止されています。

という回答があった。

windowオブジェクトって実際のところなんなのだろう、ということを少しだけ探ってみようと思う。

> `**Window**` インターフェイスは、 [DOM](https://developer.mozilla.org/ja/docs/Glossary/DOM) 文書を収めるウィンドウを表します。 `document` プロパティは、そのウィンドウに読み込まれた [DOM の document オブジェクト](https://developer.mozilla.org/ja/docs/Web/API/Document) を指します。

[https://developer.mozilla.org/ja/docs/Web/API/Window](https://developer.mozilla.org/ja/docs/Web/API/Window)

ちなみに、windowは省略可能である。

普段よく目にすることがある `alert()` なんかもwindowオブジェクトのプロパティであり、実際に書くなら `window.alert()` となる。

実際にオブジェクトの中身を見てみても、すごい数のプロパティが並んでいる。

が、実際はプロトタイプベースであることに変わりはなく、prototypeを持っている。

そして `__proto__` が示す先はまた `window` オブジェクトである。

![](_images/image%2022.png)

中略

![](_images/image%2023.png)


前述の通り、windowオブジェクトは自身である `window` というオブジェクト（を参照するプロパティ）を持っているらしい。これだけだとちょっと訳わからないが以下の説明の通り、延々と参照を行うことが可能である。

> `window` オブジェクトの `window` プロパティは、その `window` オブジェクト自身を指します。故に、以下の表現は同じ `window` オブジェクトを返します。

```javascript
window.window
window.window.window
window.window.window.window
  ...
```

[https://developer.mozilla.org/ja/docs/Web/API/Window/window](https://developer.mozilla.org/ja/docs/Web/API/Window/window)

実際に14回くらいチェーンを掘ってみても、以下のようにwindowの参照は可能である。

![](_images/image%2024.png)

オブジェクトの中身を10階層くらい掘り下げてみると、prototypeにnullが入っていることが確認できた。

つまり、windowプロパティに参照情報があるだけであって、windowオブジェクト自身は他のJavaScriptオブジェクトと特に違いはなさそう。

![](_images/image%2025.png)

ここで気になっているのはあくまで “ハードコードされた” プロトタイプという文言であるため、windowオブジェクトそのものについては深掘りせず、どのような構造を持っているのかを探ってみたい。

MDNを見てみると、以下のようにwindowは「不変のエキゾチックオブジェクト」といったような記述がある。

> 引数 obj が拡張不可能であるか、またはプロトタイプが不変のエキゾチックオブジェクト、例えば Object.prototype や window 等の場合。ただし、新しいプロトタイプが obj の元のプロトタイプと同じ値である場合は、エラーは発生しません。

[https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf#%E4%BE%8B%E5%A4%96](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf#%E4%BE%8B%E5%A4%96)

実際に書き換えを試してみると、書いてある通りTypeErrorとなった。

![](_images/image%2026.png)

エキゾチックオブジェクト (exotic object) についてはECMAScriptの説明を引用したい。

> object that does not have the default behaviour for one or more of the essential internal methods

> オブジェクトで、必須内部メソッドの1つ以上についてデフォルトの振る舞いを持たないもの。

通常のオブジェクトとは以下のような特徴を持っている。

以下はECMAScriptからの引用。

- 表4に列挙されている内部メソッドについては、オブジェクトは10.1で定義されているものを使用する。
- オブジェクトが[[Call]]内部メソッドを持つ場合、10.2.1で定義されたものか10.3.1で定義されたものを使用します。
- オブジェクトが[[Construct]]内部メソッドを持つ場合、10.2.2で定義されたものか10.3.2で定義されたものを使用します。

引用元

[https://tc39.es/ecma262/#sec-object-internal-methods-and-internal-slots](https://tc39.es/ecma262/#sec-object-internal-methods-and-internal-slots)

ECMAScriptでは、上記の特徴を（ひとつ以上）持たないものを「エキゾチックオブジェクト」として定義している。

> この仕様では、オブジェクトの内部メソッドによって、さまざまな種類のエキゾチック・オブジェクトを認識します。特定の種類のエキゾチック・オブジェクト（配列エキゾチック・オブジェクトや束縛関数エキゾチック・オブジェクトなど）と動作が等価であっても、その種類のために指定された内部メソッドと同じコレクションを持たないオブジェクトは、その種類のエキゾチック・オブジェクトとして認識されません。

ここまで読んで、 `window` オブジェクトはJavaScriptの仕様においては通常とは異なるものである（ECMAScriptの仕様上においてエキゾチックオブジェクトに分類されるもの）という理解を得られた。

## window, self, frames

また、HTML Standardでは `window` `self` `frames` といった3つのオブジェクトは、常に `window` をreturnする、という記載がある。

```javascript
window.window
window.frames
window.self
```

> These attributes all return window.

[https://html.spec.whatwg.org/dev/nav-history-apis.html#the-window-object](https://html.spec.whatwg.org/dev/nav-history-apis.html#the-window-object)

つまり、こういったこともできてしまう。

```javascript
window.window.self.window.frames.self.frames.window.window.self.self.self.frames.frames.frames
```

![](_images/image%2027.png)

window, self, framesの仕様についてはChatGPT (o3) に補足してもらった。

仕様

> HTML Standard では window, self, frames 各プロパティの **getter** を「**現在のグローバルオブジェクト ([[GlobalThisValue]]) をそのまま返す**」だけに定義しています。したがって 1 回呼んでも 100 回呼んでも同じオブジェクトが返り、チェーンは無限に続けられます。

実装

> 各ブラウザーはこの getter を WindowProxy 経由で実装しており、返すのは参照だけ。新しいオブジェクトが生成されるわけではないので、a === a.window === a.window.window が常に true になります。

window, self, framesはそれぞれgetterで `[[GlobalThis]]` を返すとある。getterの存在を確かめるために、 `PropertyDescriptor` を使用してgetter関数を確認してみた。

`**getOwnPropertyDescriptor**`** **の定義については以下の通り。

> `**Object.getOwnPropertyDescriptor()**` 静的メソッドは、与えられたオブジェクトの特定のプロパティ (すなわち、あるオブジェクトの直接の表現であり、オブジェクトのプロトタイプチェーン内のものではない) の構成を記述したオブジェクトを返します。返されるオブジェクトは変更可能ですが、変更しても元のプロパティの構成には影響を与えません。

[https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

![](_images/image%2028.png)

### 補足 Descripterとは？

本題とは逸れるが、先ほど使用した `**getOwnPropertyDescriptor**`** **の指す `Descriptor` が何者なのか、という点について少しだけ掘り下げる。

Descriptorとは、日本語で表すと「記述子」や「特徴を表すもの」という意味になる。

コンピュータの分野では、データや情報を特定するためのラベルや識別子として用いられる。

JavaScriptにおいて何を表しているかについて、まずはECMAScriptの記載を参照してみた。

> The Property Descriptor type is used to explain the manipulation and reification of Object property attributes. A Property Descriptor is a [Record](https://tc39.es/ecma262/#sec-list-and-record-specification-type) with zero or more fields, where each field's name is an attribute name and its value is a corresponding attribute value as specified in [6.1.7.1](https://tc39.es/ecma262/#sec-property-attributes). The schema name used within this specification to tag literal descriptions of Property Descriptor records is “PropertyDescriptor”.

> Property Descriptor values may be further classified as data Property Descriptors and accessor Property Descriptors based upon the existence or use of certain fields. A data Property Descriptor is one that includes any fields named either [[Value]] or [[Writable]]. An accessor Property Descriptor is one that includes any fields named either [[Get]] or [[Set]]. Any Property Descriptor may have fields named [[Enumerable]] and [[Configurable]]. A Property Descriptor value may not be both a data Property Descriptor and an accessor Property Descriptor; however, it may be neither (in which case it is a generic Property Descriptor). A fully populated Property Descriptor is one that is either an accessor Property Descriptor or a data Property Descriptor and that has all of the corresponding fields defined in [Table 3](https://tc39.es/ecma262/#table-object-property-attributes).

そのまま日本語訳

> Property Descriptor タイプは、Object のプロパティ属性の操作と再定義を説明するために使用されます。PropertyDescriptorは、0個以上のフィールドを持つRecordであり、各フィールドの名前は属性名であり、その値は6.1.7.1で規定される対応する属性値である。プロパティ記述子レコードのリテラル記述にタグ付けするために、この仕様内で使用されるスキーマ名は "PropertyDescriptor "である。

> roperty記述子の値は、特定のフィールドの存在または使用に基づいて、データProperty記述子とアクセッサProperty記述子にさらに分類することができる。データ・プロパティ記述子は、[[Value]]または[[Writable]]のいずれかの名前のフィールドを含むものである。アクセッサ・プロパティ記述子は、[[Get]]または[[Set]]のいずれかの名前のフィールドを含むものである。どのProperty Descriptorも、[[Enumerable]]と[[Configurable]]という名前のフィールドを持つことができる。プロパティ記述子の値は、データ・プロパティ記述子とアクセッサ・プロパティ記述子の両方であってはならない。完全に入力されたプロパティ記述子は、アクセッサ・プロパティ記述子またはデータ・プロパティ記述子のいずれかであり、表 3 で定義されている対応するフィールドをすべて持つものである。

[https://tc39.es/ecma262/#sec-property-descriptor-specification-type](https://tc39.es/ecma262/#sec-property-descriptor-specification-type)

Descriptorに何が含まれているのかは、引用にある6.1.7.1 ** Property Attributes**で規定されている通り。

![](_images/image%2029.png)

図で表してみると、こんな感じ。getやsetも、Descriptorの中に含まれている属性（attribute）である。

![](_images/image%2030.png)

普段何気なく使用しているような以下の構文でも、 `obj.test1` とアクセスした際にはvalueの値はgetを経由して取得される。setterも然り。

![](_images/image%2031.png)

このプロパティのDescriptorは `Object.defineProperty` を用いることで設定できる。data propertyとaccessor propertyは共存して記載することはできない（MDNより、以下のようにエラーが表示される）

```javascript
// （訳注: データとアクセサーの）両方を混在させることはできません。
Object.defineProperty(o, "conflict", {
  value: 0x9f91102,
  get() {
    return 0xdeadbeef;
  },
});

// 出力
Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
    at Object.defineProperty (<anonymous>)
    at <anonymous>:2:8

```

[https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%81%AE%E4%BD%9C%E6%88%90](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%81%AE%E4%BD%9C%E6%88%90)

もう少し踏み込んだ詳細については別記事として記載する。

definePropertyの使い所について参考

> この仕組みを利用して、Observable (監視可能) なオブジェクトを作ることができます。

[https://qiita.com/saka_pon/items/42f30cf4983822240398](https://qiita.com/saka_pon/items/42f30cf4983822240398)

> `Object.defineProperty()`を活用すると、**変更を監視するオブジェクト**を作ることもできる

[https://uga-box.hatenablog.com/entry/2025/03/10/000000](https://uga-box.hatenablog.com/entry/2025/03/10/000000)

こちらで確認してみたところ、 `get` 関数内（これがgetter）にはwindowオブジェクトが参照情報として指定されていることが確認できる。また、 `set` はundefinedであるため、windowオブジェクトそのものはread-only関数ということがわかる。

改めて、JavaScriptにおいて、getterといわれる存在が何を表しているかのおさらいしたい。ChatGPT (o3) 先生に聞きながら考察していく。

### 解答
---
## **1. 仕様上「getter」と呼ばれるものは何か ?**

1. **Web IDL で宣言された “attribute”**

```javascript
[Exposed=Window]
interface Window {
  readonly attribute WindowProxy window;
  readonly attribute WindowProxy self;
  readonly attribute WindowProxy frames;
};
```

- この *attribute* が JavaScript 側に現れるとき **「アクセサ・プロパティ (getter／setter)」** になります。
- Web IDL では *read-only* 属性なので **setter はなく、getter だけ** が自動生成されます。
- Web IDL 本体に「IDL 属性は JS のアクセサ・プロパティとして公開する」と明記されています。
2. **HTML Standard の “getter steps”**
    - IDL で作られた getter には *アルゴリズム* が紐づきます。
    - window / self / frames の場合、そのアルゴリズムはわずか 1 行：
> return this’s relevant realm.[[GlobalEnv]].[[GlobalThisValue]];
    - つまり **現在の Realm が持つ [[GlobalThisValue]]（ブラウザでは WindowProxy）をそのまま返す**、というだけの動作です。

WebIDL (Interface Definition Langage) という言葉が出てきたが、これについては深ぼるうちに長くなったので記事を分けることにする。

端的にいうとWebIDLとは、HTMLやDOM、FetchなどのWeb仕様がブラウザやその他のJavaScript実行環境へWebAPIを正確かつ一貫して公開するために、使うインターフェース定義言語である。インターフェース定義とはつまり型定義書と言い換えることもできる。

---

## 単語整理をしてみる

ここまで、JavaScriptの仕様であるECMAScriptや、HTML Standard、WebIDLなど様々な単語が一挙に出てきたが、何がどこまでを示す概念なのかという点がわからなくなってきたので整理していきたい。

### ECMAScriptとHTML Standard

まず、2つの定義を明確にすると以下の通りである。

ECMAScript

- JavaScriptの標準仕様である
- 構文・組み込みオブジェクト・実行モデル（Realm／Environment Record など）を定義
    - Realm は ECMAScript で定義されているホスト環境の概念（引用：[https://qiita.com/ZawaP/items/cff743fc724e72ee3b8c](https://qiita.com/ZawaP/items/cff743fc724e72ee3b8c)）
- ブラウザ固有の window のような API は「**ホスト環境が提供する**」ものとして仕様外に置く

HTML Standard

- *ブラウザというホスト環境* の仕様
- **Window と WindowProxy をどう作り、どう振る舞わせるか**を定義し、window/self/frames の getter が何を返すかまで規定する

※仕様書としては「HTML - Living Standard」というタイトルが正しいが、WHATWGの仕様一覧では公式にHTML Standardという記載がされている（引用：[https://spec.whatwg.org/?utm_source=chatgpt.com](https://spec.whatwg.org/?utm_source=chatgpt.com)）ため、ここではHTML Standardという記載をしている。

ここまでの整理として、windowオブジェクトはECMAScriptの仕様に含まれるものではない。あくまでブラウザのオブジェクトとして定義されているものである。そのため、windowオブジェクトの仕様はHTML Standardの管轄であり、HTML Standardによって仕様が明記されている。

> **7.2.2 The **[`**Window**`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)** object**

[https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-window-object](https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-window-object)

Realmという言葉の定義については、ECMAScriptを参照して確認する。

> Before it is evaluated, all ECMAScript code must be associated with a realm. Conceptually, a [realm](https://tc39.es/ecma262/#realm) consists of a set of intrinsic objects, an ECMAScript global environment, all of the ECMAScript code that is loaded within the scope of that global environment, and other associated state and resources.

> 評価される前に、すべての ECMAScript コードはレルムに関連付けられなければならない。概念的には、realm は組込みオブジェクトのセット、ECMAScript グローバル環境、そのグローバル環境の範囲内でロードされるすべての ECMAScript コード、およびその他の関連する状態とリソースで構成されます。

[https://tc39.es/ecma262/#sec-code-realms](https://tc39.es/ecma262/#sec-code-realms)

上記によると、すべてのECMAScript(JavaScript)コードは必ずRealmに関連づけられなければいけない、とある。

構造で表すと以下のようなイメージ？

- Realm
    - 組み込みオブジェクト群
    - ECMAScriptグローバル環境
        - グローバル環境内でロードされるすべてのECMAScriptコード（ここがコーディングで触るJavaScriptの部分？）
    - その他の関連するリソースと状態

なんというか、ECMAScriptの記載そのものが抽象的だなぁと感じていたら、思っていたことをそのまま説明してくれている記事があった。

> 少し漠然としていると感じるかもしれませんが、ECMAScript の仕様はこのように、抽象化された概念を定めていることが多く、具体的な実装は JavaScript エンジンとホスト環境に任せていることが多いです。

[https://qiita.com/ZawaP/items/cff743fc724e72ee3b8c#ecmascript-%E3%82%92%E5%B0%91%E3%81%97%E8%AA%AD%E3%82%93%E3%81%A7%E3%81%BF%E3%82%88%E3%81%86](https://qiita.com/ZawaP/items/cff743fc724e72ee3b8c#ecmascript-%E3%82%92%E5%B0%91%E3%81%97%E8%AA%AD%E3%82%93%E3%81%A7%E3%81%BF%E3%82%88%E3%81%86)

JavaScriptエンジンやホスト環境については、以下の通り。

- JavaScriptエンジン（ChromeでいうとV8とか）
- ホスト環境（Chrome, Firefoxなど）

そしてrealmが持つ内部スロットは以下の通り。

![](_images/image%2032.png)

[https://tc39.es/ecma262/#realm-record](https://tc39.es/ecma262/#realm-record)

ECMAScriptは、グローバル実行の仕掛けを次のように定めている。

-  各実行ホスト環境（Realm）には [[GlobalEnv]]（グローバル環境）があり、そこに **[[GlobalThisValue]]** が格納される。

ECMAScriptの `**19.1 Value Properties of the Global Object > 19.1.1 globalThis**`** **項には以下のようにGlobalEnvがrealmが持つ内部スロットであることが記載されている。

> The initial value of the "globalThis" property of the [global object](https://tc39.es/ecma262/#sec-global-object) in a [Realm Record](https://tc39.es/ecma262/#realm-record) realm is realm.[[GlobalEnv]].[[GlobalThisValue]].

> Realm Record realmのグローバルオブジェクトの "globalThis "プロパティの初期値は、realm.[[GlobalEnv]].[[GlobalThisValue]]です。

[https://tc39.es/ecma262/#sec-globalthis](https://tc39.es/ecma262/#sec-globalthis)

この `[[GlobalEnv]]` という内部スロットはすべてのオブジェクトが持つものなのか。

ChatGPT (o3) に尋ねたところ、以下のような解答が返ってきた。

- **[[GlobalEnv]] は “Realm Record（レルム記録）” がもつ内部スロットです。**たとえば globalThis の初期値は **realm.[[GlobalEnv]].[[GlobalThisValue]]** と仕様に書かれており、[[GlobalEnv]] が **「realm の中にある」**ことが明示されています。
- **すべての JavaScript オブジェクトが [[GlobalEnv]] を持っているわけではありません。**そもそも [[GlobalEnv]] は “Realm Record” に属するスロットで、**通常のオブジェクト（ordinary object）** や多くの組み込みオブジェクトの内部スロットとは別物です。実行時アルゴリズムでも「calleeRealm.[[GlobalEnv]] を取り出す」といった形で **レルムにぶら下がっている**ことが示されています。

ここまで書き連ねてきて見えてきたこととして、初めの

> window, self, framesはそれぞれgetterで `[[GlobalThis]]` を返すとある。

に立ち返ってみたい。

### GlobalThis

GlobalThisを実際にブラウザで実行してみる。

![](_images/image%2033.png)

Chromeで実行したが、これはまさしく `window` そのものなのである。

「グローバルで定義する変数」と「グローバルオブジェクト」は何が違うのだろう、というと、以下を見てみるとわかりやすい。

![](_images/image%2034.png)

この `window` オブジェクトの内部には、グローバルで定義した `foo` がプロパティとして定義されている。

![](_images/image%2035.png)

そしてこちらもtrueとなる

![](_images/image%2036.png)

以下にもこの挙動はしっかり説明されている。

[https://qiita.com/uhyo/items/f3b6feef9444e86bef94#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88](https://qiita.com/uhyo/items/f3b6feef9444e86bef94#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88)

現代のDOMが実装されている（ブラウザという）環境において `globalThis` は `window` であることは自明になっているが、本来的には globalとして存在している環境はJavaScriptからは知覚せず、抽象化されている。なので実行環境によって `globalThis` は異なる。サーバーサイド実行環境であるnode.jsはもちろんブラウザは無関係であり、上記の記事で説明されているように `window` といったオブジェクトは存在していない。そのためnode.jsで指し示される `globalThis` は、 `window` ではない。

先ほどのソースのように、 “ブラウザ上において” `window`はグローバルオブジェクトである。そして `this` はグローバルを指し示す環境上においては、グローバルオブジェクトである `window` を指し示す。つまり、 globalを指し示す状態で `this` を呼んだら、これは `globalThis` と同じである。

![](_images/image%2037.png)

文字に表すとわけわからんとは思いつつ……Chromeの開発者環境（console）においては、起こした理屈を元にすると、こういうことが証明できる。

![](_images/image%2038.png)

ここまで追いかけてきた結果、 `window` とはつまりJavaScript（ECMAScript）で定義された仕様外の仕組みであり、HTML Living Standardに準拠する実行環境のブラウザにて定義されるグローバルなオブジェクトであるという理解を得られた。ブラウザ環境以外（node.jsなどの実行環境）　においては `window` オブジェクトは存在せず、 `globalThis` はまたrealmの内部スロットである `[[globalEnv]]` に関連づけられた `globalThisValue` が取得される。

余談

node.js上で `globalThis` にあたるオブジェクトを確認してみると、結果は以下のようになる。

（common.jsが何ぞやについてはここでは触れない）

```javascript
// test.js (CommonJS)
console.log("global === globalThis ->", global === globalThis); // true
console.log("keys:", Object.keys(global).slice(0, 10));
```

出力結果

```javascript
global === globalThis -> true
keys: [
  'global',          'clearImmediate',
  'setImmediate',    'clearInterval',
  'clearTimeout',    'setInterval',
  'setTimeout',      'queueMicrotask',
  'structuredClone', 'atob',
  'btoa',            'performance',
  'fetch',           'crypto'
]
```

windowオブジェクトに関しての記事なので深入りはしないが、node.jsにおいては `global` がグローバルオブジェクト（globalThis）を表す。このように、globalThisが指し示すオブジェクトは実行環境で定義されたグローバルオブジェクトによって異なるということになる。

## WindowProxy

最後にもう一つ、ちらっと登場した `WindowProxy` という言葉についても概要を少しだけ理解しておきたい。

まずは`windowProxy` について詳しく解説された記事より、冒頭部分を引用する。

> HTML規格で定義されている[`WindowProxy`](https://html.spec.whatwg.org/multipage/window-object.html#the-windowproxy-exotic-object)は、端的に言えば「`Window`オブジェクトを指し示すもの」であり、その名前の通り`Window`オブジェクトへのプロクシです。これは`Window`に対してのみ定義されている特別なプロクシであり、他のDOMオブジェクトはこのようなプロクシを持ちません。これは`Window`がナビゲーション(ページ遷移)をサポートする唯一のグローバルオブジェクトであるため[1](https://qiita.com/yuki3/items/4ee2d6fff0865f806ded#fn-workerproxy)です。

[https://qiita.com/yuki3/items/4ee2d6fff0865f806ded#windowproxy%E3%81%A8%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E3%82%82%E3%81%AE%E3%81%8B](https://qiita.com/yuki3/items/4ee2d6fff0865f806ded#windowproxy%E3%81%A8%E3%81%AF%E3%81%A9%E3%81%AE%E3%82%88%E3%81%86%E3%81%AA%E3%82%82%E3%81%AE%E3%81%8B)

ここでひとつ気になるのは、JavaScriptの言語仕様として存在している `Proxy` との関連である。

ECMAScriptでは `Proxy` の言語仕様は下記に明記されているが、 `WindowProxy` という文言はひとつも出てこない。

![](_images/image%2039.png)

[https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)

これまで掘り下げてきたように、JavaScript（ECMAScript）の仕様と、ブラウザ（HTML Standard）の仕様は明確に分けられる。HTML Standardにおいては、以下の引用の通り 「**7.4 The **[`**WindowProxy**`](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#windowproxy)** exotic object」 **という項が存在しているため、JavaScriptにおけるProxyとは異なった概念であり、管轄範囲も異なるものであるということが読み取れる。

> A `WindowProxy` is an exotic object that wraps a [`Window`](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#window) ordinary object, indirecting most operations through to the wrapped object. Each [browsing context](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#browsing-context) has an associated [`WindowProxy`](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#windowproxy) object. When the [browsing context](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#browsing-context) is [navigated](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#navigate), the [`Window`](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#window) object wrapped by the [browsing context](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#browsing-context)'s associated [`WindowProxy`](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#windowproxy) object is changed.

> WindowProxyは通常のWindowオブジェクトをラップするエキゾチックなオブジェクトで、ほとんどの操作をラップされたオブジェクトに間接的に通します。各ブラウジングコンテキストは関連するWindowProxyオブジェクトを持っています。ブラウズコンテキストがナビゲートされると、ブラウズコンテキストの関連WindowProxyオブジェクトによってラップされたWindowオブジェクトが変更されます。

> *Although *[`WindowProxy`](https://momdo.github.io/html/window-object.html#windowproxy)* is named as a "proxy", it does not do polymorphic dispatch on its target's internal methods as a real proxy would, due to a desire to reuse machinery between *[`WindowProxy`](https://momdo.github.io/html/window-object.html#windowproxy)* and *[`Location`](https://momdo.github.io/html/history.html#location)* objects. As long as the *[`Window`](https://momdo.github.io/html/window-object.html#window)* object remains an ordinary object this is unobservable and can be implemented either way.*

> WindowProxyは "プロキシ "と命名されていますが、WindowProxyとLocationオブジェクトの間で機械を再利用したいため、本当のプロキシが行うようなターゲットの内部メソッドの多相ディスパッチは行いません。Windowオブジェクトが普通のオブジェクトのままである限り、これは観察不可能であり、どちらの方法でも実装できます。

**7.4 The **[`**WindowProxy**`](https://wicg.github.io/controls-list/html-output/multipage/browsers.html#windowproxy)** exotic object**

[https://wicg.github.io/controls-list/html-output/multipage/browsers.html](https://wicg.github.io/controls-list/html-output/multipage/browsers.html)

ほとんど自分の理解のための書き起こしに近いが、冒頭に引用した記事を元に、特徴を2点まとめてみる。

### 特徴1. クロスオリジンアクセスのサポート

WindowProxyは、異なるオリジンに属するウィンドウを差し示す際にも参照だけは維持することができる。

本来であればSOP（Same Origin Policy / 同一オリジンポリシー）によって、異なるオリジン（クロスオリジン）のDOMオブジェクトは操作できないが、

- WindowProxy本体（例: otherWindow.postMessage(...) や otherWindow.name）
- WIndowProxyから到達できるLacationオブジェクト（例: otherWindow.location.href = …）

上記の2つだけに限り、例外的に ”制限付きで” クロスオリジンへのアクセスが認められている。

クロスオリジンアクセスが可能かどうかについては、実際に以下のソースにて検証してみた。

ブラウザ（Chrome）で `localhost:8080` を開き、以下のソースをconsoleで実行してみる。

```javascript
// 親側でメッセージ受信を表示
window.addEventListener("message", e => {
  console.log("[parent] got:", e.data, "from origin:", e.origin);
});

// クロスオリジン(= data:)の iframe を追加。中では postMessage に反応して echo します。
const f = document.createElement("iframe");
f.style = "width:420px;height:120px;border:1px solid #888;";
f.src = "data:text/html;charset=utf-8," + encodeURIComponent(`
  <!doctype html><meta charset="utf-8">
  <h3>cross-origin: data:</h3>
  <script>
    // 親へ準備完了通知
    parent.postMessage("ready", "*");
    // 親からのメッセージに応答
    window.onmessage = (e) => parent.postMessage("echo:" + e.data, "*");
  <\/script>
`);
document.body.appendChild(f);

// クロスオリジンな WindowProxy を取得
const w = f.contentWindow;
console.log("w === w.window ?", w === w.window); // true（同じ WindowProxy）
```

以下の通り、最終行のconsole.logの出力は `true` となった。

iframe内のスキームは data: (opacity origin) のため、 `http://localhost` からは明確に別オリジンである。

![](_images/image%2040.png)

↑で定義している各オブジェクトの中身は以下の通り。

![](_images/image%2041.png)

contentDocument、contentWindowは `HTMLIFrameElement` に含まれるプロパティ。

それぞれの概要は以下の通り。

> iframe とその iframe の親文書が[同一オリジン](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)であった場合、[`Document`](https://developer.mozilla.org/ja/docs/Web/API/Document)（すなわち、インラインフレーム内の閲覧コンテキスト内にあるアクティブな文書）を返します。そうでなければ `null` を返します。

[https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement/contentDocument](https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement/contentDocument)

> `**contentWindow**` プロパティは、[HTMLIFrameElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement) が所属する [Window](https://developer.mozilla.org/ja/docs/Web/API/Window) オブジェクトを返します。この `Window` オブジェクトを使用して、iframe の文書や内部 DOM にアクセスすることができます。この属性は読み取り専用ですが、グローバルの `Window` オブジェクトのように操作することができます。

[https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement/contentWindow](https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement/contentWindow)

上記の引用から、 `contentDocument` は「親文書が同一オリジン」ではないためにnullを返却したことがわかる。

もうひとつ、クロスオリジンアクセスが不可であることの例を試してみる。

localhost:8080からiframe内の `location.href` や `document` にアクセスしようとしても、これはエラーとなる。

![](_images/image%2042.png)

前述の通り、「制限付きのアクセス」がなんなのかについてだが、これは以下を確認することでわかる。 `w` はクロスオリジンである iframeのwindowオブジェクトだが、明らかに参照できるプロパティが通常のwindowオブジェクトよりも少ない。

![](_images/image%2043.png)

`w` は親オブジェクトにおいては HTMLIFrameElementであり、この内容はMDNの `HTMLIFrameElement.contentWindow`の項を確認するとなんとなく把握できる。

> [WindowProxy](https://developer.mozilla.org/ja/docs/Glossary/WindowProxy) で、中にある閲覧コンテキストのウィンドウプロキシーを返します。

[https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLIFrameElement)

以上までの検証を前提として、この「WindowProxy」項冒頭で引用した解説を再度読むと

> プロパティアクセス一般は`[[GetOwnProperty]]`で定義されますが、クロスオリジンの場合には[`CrossOriginGetOwnPropertyHelper`](https://html.spec.whatwg.org/multipage/browsers.html#crossorigingetownpropertyhelper-(-o,-p-))に処理が委ねられ、特別なプロパティのみアクセスが許可されます。

とある。原本のHTML Standard - **7.2.3.5 [[GetOwnProperty]] ( P ) **にも

> 1. Let value be the [active ](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-wp)[`WindowProxy`](https://html.spec.whatwg.org/multipage/document-sequences.html#nav-wp) of the [named object](https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-window-nameditem-filter) of W with the name P.

> 2. Return [PropertyDescriptor](https://tc39.es/ecma262/#sec-property-descriptor-specification-type) { [[Value]]: value, [[Enumerable]]: false, [[Writable]]: false, [[Configurable]]: true }.

とあり、 `[[Writable]]: false` （読み取り専用）のオブジェクトをreturnするとある。

これ以上は仕様書をしっかり読みに行かないと明確な理解まで落とし込めない気がするが、大まかな輪郭は把握することができた（かと思う）。

### 特徴2. “現在の=最新の”ウィンドウへのProxy

早速引用から入る。

> `WindowProxy`はそもそも何をするプロクシなのかというと「現在のウィンドウ」へのプロクシです。ナビゲーション(ページ遷移)が発生すると、ナビゲーション前の古いウィンドウと、ナビゲーション後の新しいウィンドウができます。`WindowProxy`は常に最新のウィンドウへとプロクシします。`WindowProxy`は`[[Window]]`という内部スロット(internal slot)を持ち、ここに`Window`オブジェクトへのリファレンスを持ちます。

[https://qiita.com/yuki3/items/4ee2d6fff0865f806ded#%E7%89%B9%E5%BE%B42-%E7%8F%BE%E5%9C%A8%E3%81%AE%E6%9C%80%E6%96%B0%E3%81%AE%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E3%81%B8%E3%81%AE%E3%83%97%E3%83%AD%E3%82%AF%E3%82%B7](https://qiita.com/yuki3/items/4ee2d6fff0865f806ded#%E7%89%B9%E5%BE%B42-%E7%8F%BE%E5%9C%A8%E3%81%AE%E6%9C%80%E6%96%B0%E3%81%AE%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E3%81%B8%E3%81%AE%E3%83%97%E3%83%AD%E3%82%AF%E3%82%B7)

続いて解説されているソースについても、読むだけでは理解に至れなかったため実際にソースを実行してみる（各所にconsole.logを仕込んで視覚的に把握できるようにする）。

```javascript
<!DOCTYPE html>
<h1>foo.example</h1>
<iframe id="child" src="child_1.html"></iframe>
<script>
  var w_child_1, w_child_2;

  onload = () => {
    let child_frame = document.getElementById("child");

    // |w_child_1| is a child window before a navigation.
    w_child_1 = child_frame.contentWindow;
    console.log(w_child_1);

    // Let the child window navigate to another page.
    w_child_1.location = "child_2.html";

    // |w_child_2| is another child window after the navigation.
    child_frame.onload = () => {
      w_child_2 = child_frame.contentWindow;
      console.log(w_child_2);

      console.log(w_child_1 === w_child_2);
      console.log(w_child_1.location.pathname);
    };
  }; // onload
</script>

```

結果は以下の通り。

![](_images/image%2044.png)

![](_images/image%2045.png)

引用先で解説されているように、iframe内のウィンドウはpathnameが `child_1` → `child_2` に遷移している。しかし、以下のように2つのwindowオブジェクトは同じであることがわかる。

```javascript
console.log(w_child_1 === w_child_2);
```

これは、展開されているwindowオブジェクトを指し示しているわけではなく、どちらもWindowProxyを指している（つまり示す先が変わっていない）ということを表している。

利点についての詳細は引用先に記載されているが、開発者観点としては、非表示となったナビゲーション前のwindow（上記の場合では `child_1` のwindow）にアクセスし続けることがなくなる。つまりわざわざナビゲーション前の `child_1` の状態を持った変数があるかどうかなどを気にしなくてよくなり、今開いているウィンドウへ関心を集中することができる。

再度、参照している記事の内容を引用する。

> `WindowProxy`の最後の特徴は、ナビゲーション前後でオブジェクトが入れ替わらないことです。`Window`オブジェクトは新しいページ用に新しいオブジェクトが作成されますが、`WindowProxy`それ自体は同じオブジェクトが使い続けられます。

WindowProxyはページを跨っても変化しない。しかしWindowオブジェクトはページ単位で新たに作成される。（ここでは開発者視点のみにこだわるが）WindowProxy側が現在展開されているWindowオブジェクトを参照してくれる（この参照操作が隠蔽されている）ことによって、ナビゲーションの前後関係をWeb開発時に気にする必要がなくなる。

これまでwindowオブジェクトと思っていたものは実際には WindowProxyであり、ナビゲーションやクロスオリジンアクセスなどを中間でいい感じにしてくれていた。ということのようだ。

### windowProxyについての参考記事集

[https://please-sleep.cou929.nu/20110310.html](https://please-sleep.cou929.nu/20110310.html)

[https://stackoverflow.com/questions/16092835/windowproxy-and-window-objects](https://stackoverflow.com/questions/16092835/windowproxy-and-window-objects)


# まとめのようなもの

windowオブジェクトって実際のところなんやねん、というところからグローバルオブジェクトやECMAScript、HTML Living Standardまで掘り下げたが、ブラウザ側（HTML Living Standard）で定義されているオブジェクトであり、ブラウザにおけるグローバルオブジェクト（実態はWindowProxyが指し示しているオブジェクト）である、ということが理解として得られた。JavaScriptの仕様を定義しているECMAScriptではwindowという存在は明記されていない。

window, self, framesといったオブジェクトのgetterは `[[GlobalThisValue]]`を示しており、ブラウザ上において（ほとんどの場合）これは `window` を指す。つまり `window.window` や `window.self.frames.window` ということができてしまうのはgetterがglobalオブジェクトを取得するようになっているため。

RealmとはひとつのJavaScript実行環境を包むコンテナであり、内部スロット `[[GlobalEnv]]` がグローバル環境情報を保持している。この `[[GlobalEnv]]` にぶら下がる `[[GlobalThisValue]]` という値がglobalThisから見た際の初期値であり、HTML Living Standardに準拠したブラウザという環境上においては `window` オブジェクト（実際にはWindowProxy）となる。

1つの事柄からどんどん掘り下げていくと例の如くまとまっていない記事になってしまった。正確な表現かというと怪しい実感しかないが、関係図を把握する資料として、（主に自分に対して）何かしらの参考になればと思う。

# 参考

[https://iorishimizu.hatenablog.com/entry/course/javascript/03/06](https://iorishimizu.hatenablog.com/entry/course/javascript/03/06)

[https://qiita.com/ZawaP/items/cff743fc724e72ee3b8c](https://qiita.com/ZawaP/items/cff743fc724e72ee3b8c)

[https://blog.takemaro.com/posts/2023/12/09-js-global](https://blog.takemaro.com/posts/2023/12/09-js-global)

[https://qiita.com/nuko-suke/items/80775e90cd6bfd1e4546](https://qiita.com/nuko-suke/items/80775e90cd6bfd1e4546)


余談メモ：モジュール内で定義されるグローバル変数について

[https://qiita.com/uhyo/items/f3b6feef9444e86bef94#%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%A8%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88](https://qiita.com/uhyo/items/f3b6feef9444e86bef94#%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%A8%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88)

```javascript
<script type="module">
  'use strict';
  var foo = 123;
  console.log(globalThis.foo); // undefined
</script>
```

> なんと、script要素に`type="module"`属性を付けたら結果が変わりました。ブラウザ上でのJavaScriptを知っている方は、`type="module"`というのが`import`文を使うときに必要なものであることはお分かりだと思いますが、ECMAScript的にはこれは内部のコードを*Script*ではなく*Module*として評価するようにする効果があります。実はECMAScriptではプログラムは*Script*と*Module*の2種類に分類されており、`export`文や`import`文は*Module*の中でしか使えない構文です。普通の`script`要素で読みこまれるような従来のJavaScriptは*Script*です。

[https://blog.takemaro.com/posts/2023/12/06-js-global](https://blog.takemaro.com/posts/2023/12/06-js-global)

> 噛み砕いて言うと、ECMAScriptの仕様ではWebブラウザのすべての機能を定義しているわけではなく、汎用的なプログラミング言語としてのECMAScript (JavaScript) を定義した上で、個々の応用先ごとに必要となる機能は別の仕様によって拡張するという形になっている。“host”とはブラウザであり、JavaScriptのうちWebに関連する機能を定義する仕様（後出のHTML仕様など）のことである。
