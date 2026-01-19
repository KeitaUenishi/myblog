---
title: "Next-Imageについて整理する"
id: nf2s3dx
public: false
publishedAt: 2024-04-23
editedAt: null
description: "なんかいろんなエラーに遭遇したので、まとめたい typescript warn-once.js:16 Image with src \"/dummyImage.png\" was detected as"
tags:
  - memo
  - backlog
---


なんかいろんなエラーに遭遇したので、まとめたい

```typescript
warn-once.js:16 Image with src "/dummyImage.png" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.
Read more: https://nextjs.org/docs/api-reference/next/image#priority
warn-once.js:16 Image with src "/dummyImage.png" has "fill" prop and "sizes" prop of "100vw", but image is not rendered at full viewport width. Please adjust "sizes" to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes

warn-once.js:16 Image with src "/dummyImage.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance.

Image with src "/dummyImage.png" has "fill" prop and "sizes" prop of "100vw", but image is not rendered at full viewport width. Please adjust "sizes" to improve page performance.


```

[原文](https://www.deepl.com/ja/translator#en/ja/warn-once.js%3A16%20Image%20with%20src%20%22%5C%2FdummyImage.png%22%20was%20detected%20as%20the%20Largest%20Contentful%20Paint%20(LCP).%20Please%20add%20the%20%22priority%22%20property%20if%20this%20image%20is%20above%20the%20fold.%0ARead%20more%3A%20https%3A%5C%2F%5C%2Fnextjs.org%5C%2Fdocs%5C%2Fapi-reference%5C%2Fnext%5C%2Fimage%23priority%0Awarn-once.js%3A16%20Image%20with%20src%20%22%5C%2FdummyImage.png%22%20has%20%22fill%22%20prop%20and%20%22sizes%22%20prop%20of%20%22100vw%22%2C%20but%20image%20is%20not%20rendered%20at%20full%20viewport%20width.%20Please%20adjust%20%22sizes%22%20to%20improve%20page%20performance.%20Read%20more%3A%20https%3A%5C%2F%5C%2Fnextjs.org%5C%2Fdocs%5C%2Fapi-reference%5C%2Fnext%5C%2Fimage%23sizes%0A%0Awarn-once.js%3A16%20Image%20with%20src%20%22%5C%2FdummyImage.png%22%20has%20%22fill%22%20but%20is%20missing%20%22sizes%22%20prop.%20Please%20add%20it%20to%20improve%20page%20performance.%0A%0AImage%20with%20src%20%22%5C%2FdummyImage.png%22%20has%20%22fill%22%20prop%20and%20%22sizes%22%20prop%20of%20%22100vw%22%2C%20but%20image%20is%20not%20rendered%20at%20full%20viewport%20width.%20Please%20adjust%20%22sizes%22%20to%20improve%20page%20performance.%0A%0A)

![](_images/Untitled%2040.png)

## 公式Doc

[https://nextjs.org/learn-pages-router/seo/web-performance/lcp](https://nextjs.org/learn-pages-router/seo/web-performance/lcp)

[https://nextjs.org/docs/pages/api-reference/components/image#priority](https://nextjs.org/docs/pages/api-reference/components/image#priority)

# 参考

[https://zenn.dev/pe_be_o/articles/maeta-187-articles_47620f22f6c459](https://zenn.dev/pe_be_o/articles/maeta-187-articles_47620f22f6c459)

[https://dev.classmethod.jp/articles/next-js-image-component/](https://dev.classmethod.jp/articles/next-js-image-component/)

[https://speakerdeck.com/sutetotanuki/core-web-vitals-wogai-shan-suru-next-dot-js-noji-neng-qun](https://speakerdeck.com/sutetotanuki/core-web-vitals-wogai-shan-suru-next-dot-js-noji-neng-qun)
