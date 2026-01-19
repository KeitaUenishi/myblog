---
title: "formの挙動で詰まった件"
id: t34jr30
public: true
publishedAt: 2024-04-13
editedAt: null
description: "ものすごーく初歩的なミス（理解不足）で時間を消費してしまったので、戒めを込めてメモします。 起こったこと Next.jsで作成したアプリケーションで、ライブラリ等を使用せずに検索フォームを作成していた"
tags:
  - プログラミング
---




ものすごーく初歩的なミス（理解不足）で時間を消費してしまったので、戒めを込めてメモします。

# 起こったこと

Next.jsで作成したアプリケーションで、ライブラリ等を使用せずに検索フォームを作成していた。

具体的には以下のような、`<form> `を実装して、Enterを押下すると検索処理が走るような実装を行なっていた。

```typescript
    const handleSearch = () => {
	    console.log("searchForm", searchForm);
	    router.push({ pathname: "/posts/search", query: { q: searchForm } });
    }
    return (
      <div className={styles.content}>
        <h3>検索</h3>
        <form　onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="キーワードを入力"
            aria-label="キーワードを入力"
            onChange={(e) => setSearchForm(e.target.value)}
          />
        </form>
      </div>
    )
```

検索結果をクエリパラメータをもとにSSRで取得するページに遷移するためにrouter.pushを実装。

この実装で何が困ったかというと、router.push で遷移した先が表示されると、1, 2秒後に勝手にリダイレクトが走り元のページに戻って（ま遷移して）しまうという挙動になった。

# 原因

すごく初歩的なミスで、 <form> の動作を全然理解できていなかったせい。

<form> の送信時には、デフォルトで <form action=”〇〇”>で**指定しているURLへリダイレクト**がかかる。

> [`action`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/form#action) 属性は、どこにデータを送信するかを定義します。値は妥当な相対/絶対 [URL](https://developer.mozilla.org/ja/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL) でなければなりません。この属性が与えられなかった場合は、フォームが含まれているページの URL にデータが送信されます。

[https://developer.mozilla.org/ja/docs/Learn/Forms/Sending_and_retrieving_form_data#action_属性](https://developer.mozilla.org/ja/docs/Learn/Forms/Sending_and_retrieving_form_data#action_属性)

実行順序としては、以下のような形になっていた模様（自分では調べてはいない）

> 
> 1. submitボタン押下
> 2. onclick判定
> 3. requiredなどinputタグに記載された処理
> 4. onsubmit判定
> 5. formタグのaction実行
> 6. action先の実行

[https://qiita.com/kara_age/items/945ca8c65c34b49f1730#判定処理順](https://qiita.com/kara_age/items/945ca8c65c34b49f1730#判定処理順)

おそらくonSubmitでrouter.pushが動く関数を設定していたものの、その後フォームが送信されているURLへのデータの送信が発生し、action実行元へまた戻ってしまうような挙動となってしまっていたみたい。

# 解決方法

`<form action=””>` によるリダイレクトを発生させないためには、`e.preventDefault()` によってformのデフォルトの動きを止めてやる必要がある。

> `**preventDefault()**` は [`Event`](https://developer.mozilla.org/ja/docs/Web/API/Event) インターフェイスのメソッドで、[ユーザーエージェント](https://developer.mozilla.org/ja/docs/Glossary/User_agent)に、このイベントが明示的に処理されない場合に、その既定のアクションを通常どおりに行うべきではないことを伝えます。

[https://developer.mozilla.org/ja/docs/Web/API/Event/preventDefault](https://developer.mozilla.org/ja/docs/Web/API/Event/preventDefault)

# なぜこうなったのか

react-hook-formを愛用していたということが大きかもしれない。

普段からonSubmitに実行する関数をセットしている上に、preventDefaultを実行しなくても挙動をキャンセルしてくれていたことで、formの基本的な挙動がすっかり頭から抜け落ちてしまっていた模様…………。

```typescript
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor=''>First Name</label>
      <input type='text' {...register('firstName')} />
      <label htmlFor=''>Gender Selection</label>
      <select {...register('gender')}>
        <option value='female'>female</option>
        <option value='male'>male</option>
        <option value='other'>other</option>
      </select>
      <input type='submit' />
    </form>
```

便利なライブラリに頼るのもいいですが、基本はしっかり頭に入れた上で使用することが大切ですね……。

# 参考

記事内以外のその他参考記事

[https://craftime.net/posts/nextjs-router-submit-form-error](https://craftime.net/posts/nextjs-router-submit-form-error)
