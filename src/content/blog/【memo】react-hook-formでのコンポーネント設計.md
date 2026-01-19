---
title: "【memo】react-hook-formでのコンポーネント設計"
id: nf2s3g9
public: false
publishedAt: 2024-04-23
editedAt: null
description: "だめだった例 typescript import { InputHTMLAttributes } from \"react\"; import { FieldValue, FieldValues, Reg"
tags:
  - memo
  - backlog
---



だめだった例

```typescript
import { InputHTMLAttributes } from "react";
import {
  FieldValue,
  FieldValues,
  RegisterOptions,
  UseFormRegisterReturn,
} from "react-hook-form";

type InputProps = {
  type: string;
  className: string;
  placeholder: string;
  register: <T extends string>(
    name: T,
    options?: RegisterOptions<FieldValues, T> | undefined
  ) => UseFormRegisterReturn<T>;
  registerName: string;
};

export const TextInput = ({
  type,
  className,
  placeholder,
  register,
  registerName,
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type={type}
      className={`block w-full p-4 text-sm text-gray-600 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      placeholder={placeholder}
      {...register("sakeName")}
    />
  );
};

```


## 設計例

[https://zenn.dev/yuitosato/articles/292f13816993ef](https://zenn.dev/yuitosato/articles/292f13816993ef)

[https://zenn.dev/erukiti/articles/webform-2021](https://zenn.dev/erukiti/articles/webform-2021)

[https://zenn.dev/manalink_dev/articles/manalink-react-hook-form-v7?redirected=1](https://zenn.dev/manalink_dev/articles/manalink-react-hook-form-v7?redirected=1)

[https://hireroo.io/journal/tech/react-hook-form-within-mono-repo](https://hireroo.io/journal/tech/react-hook-form-within-mono-repo)