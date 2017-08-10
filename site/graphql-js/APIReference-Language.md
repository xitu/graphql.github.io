---
title: graphql/language
layout: ../_core/GraphQLJSLayout
category: API 参考
permalink: /graphql-js/language/
sublinks: BREAK,getLocation,Kind,lex,parse,parseValue,printSource,visit
next: /graphql-js/type/
---

`graphql/language` 模块负责对 GraphQL 查询语言进行解析和操作。你既可以从 `graphql/language` 模块引入，也可以从根模块 `graphql` 引入。示例如下：

```js
import { Source } from 'graphql'; // ES6
var { Source } = require('graphql'); // CommonJS
```

## 概述

**Source**

<ul class="apiIndex">
  <li>
    <a href="#source">
      <pre>class Source</pre>
      表示传递给 GraphQL 服务的输入字符串。
    </a>
  </li>
  <li>
    <a href="#getlocation">
      <pre>function getLocation</pre>
      将字符偏移量转化为 Source 中的行和列。
    </a>
  </li>
</ul>

**词法分析器**

<ul class="apiIndex">
  <li>
    <a href="#lex">
      <pre>function lex</pre>
      根据 GraphQL 语法对 GraphQL 的 Source 类进行词法分析。
    </a>
  </li>
</ul>

**解析器**

<ul class="apiIndex">
  <li>
    <a href="#parse">
      <pre>function parse</pre>
      根据 GraphQL 语法对 GraphQL 的 Source 类进行解析。
    </a>
  </li>
  <li>
    <a href="#parseValue">
      <pre>function parseValue</pre>
      根据 GraphQL 语法对值进行解析。
    </a>
  </li>
  <li>
    <a href="#kind">
      <pre>var Kind</pre>
      表示已解析的抽象语法树（Abstract Syntax Tree, AST）中节点的各种类型。
    </a>
  </li>
</ul>

**Visitor**

<ul class="apiIndex">
  <li>
    <a href="#visit">
      <pre>function visit</pre>
      一个通用的 visitor，用于遍历一个已解析的 GraphQL AST。
    </a>
  </li>
  <li>
    <a href="#break">
      <pre>var BREAK</pre>
      用于允许中断 visitor 的 token。
    </a>
  </li>
</ul>

**Printer**

<ul class="apiIndex">
  <li>
    <a href="#print">
      <pre>function print</pre>
      以一个标准的格式打印出一个 AST。
    </a>
  </li>
</ul>

## Source

### Source

```js
export class Source {
  constructor(body: string, name?: string)
}
```

对 GraphQL 源输入的表示。name 参数是可选的，但对于将 GraphQL 文档存储在源文件里的客户端来说，这个参数是非常有用的；举个例子，如果 GraphQL 的输入是在一个名为 Foo.graphql 的文件里，那么将 name 设置为 "Foo.graphql" 在之后就会很有用了。

### getLocation

```js
function getLocation(source: Source, position: number): SourceLocation

type SourceLocation = {
  line: number;
  column: number;
}
```

接收一个 Source 对象和一个 UTF-8 编码的字符偏移量作为参数，返回一个 SourceLocation 对象，包含相关的行列位置信息。

## 词法分析器

### lex

```js
function lex(source: Source): Lexer;

type Lexer = (resetPosition?: number) => Token;

export type Token = {
  kind: number;
  start: number;
  end: number;
  value: ?string;
};
```

给定一个 Source 对象，为这个对象返回一个词法分析器。词法分析器每次被调用的时候会表现得像一个生成器，返回 Source 里的下一个 token。假设对某个 source 进行词法分析，最后返回的 token 就将是某种类型的文件结尾符，而在这之后，词法分析器不管何时被调用都会重复返回文件结尾符的 token。

词法分析器函数的参数是可选的，而且可被用于在 Source 里将词法分析器回退或者前进到某个新位置。

## 解析器

### parse

```js
export function parse(
  source: Source | string,
  options?: ParseOptions
): Document
```

给定一个 GraphQL 源，将其解析并放入文档里。

如果遇到语法错误则抛出 GraphQLError。

### parseValue

```js
export function parseValue(
  source: Source | string,
  options?: ParseOptions
): Value
```

给定一个包含 GraphQL 值的字符串，将这个值解析为 AST。

如果遇到语法错误则抛出 GraphQLError。

这在某些工具中会很有用，比如直接在 GraphQL 值上进行操作，并且与 GraphQL 文档完全分离开来。

### Kind

这是一个枚举类型，用于描述不同类型的 AST 节点。

## Visitor

### visit

```js
function visit(root, visitor, keyMap)
```

`visit()` 将使用深度优先遍历一个 AST，在遍历当中对每个节点调用 visitor 的 `enter` 函数，并在访问完当前节点及其子节点后调用 `leave` 函数。

通过从 `enter` 和 `leave` 函数里返回不同的值，visitor 的行为可以进行更改，包括跳过 AST 的一个子树（返回 `false`）、编辑这个 AST（返回一个值或者返回 `null` 来删除这个节点）、或者返回 `BREAK` 停止整个遍历。

当使用 `visit()` 编辑一个 AST 的时候，原始的 AST 不会被修改，`visit` 函数会返回一个经过修改的新版本 AST。

```js
var editedAST = visit(ast, {
  enter(node, key, parent, path, ancestors) {
    // @return
    //   undefined: 无操作
    //   false: 跳过访问该节点
    //   visitor.BREAK: 停止访问
    //   null: 删除该节点
    //   any value: 使用返回的这个值替代原本的节点
  },
  leave(node, key, parent, path, ancestors) {
    // @return
    //   undefined: 无操作
    //   false: 无操作
    //   visitor.BREAK: 停止访问
    //   null: 删除该节点
    //   any value: 使用返回的这个值替代原本的节点
  }
});
```

Visitor 可以通过提供和节点类型同名的函数来替代 `enter()` 和 `leave()` 函数，或者通过名称的关键字来使用 visitor 中的 `enter` 或 `leave`，这就造成 visitor 的 API 有四种形式：

1) 当进入特定类型的节点时，触发同名的 visitor。

```js
visit(ast, {
  Kind(node) {
    // enter the "Kind" node
  }
})
```

2) 在进入或离开特定类型的节点时，触发同名的 visitor。

```js
visit(ast, {
  Kind: {
    enter(node) {
      // enter the "Kind" node
    }
    leave(node) {
      // leave the "Kind" node
    }
  }
})
```

3) 在进入或离开任意节点时，触发通用的 visitor。

```js
visit(ast, {
  enter(node) {
    // enter any node
  },
  leave(node) {
    // leave any node
  }
})
```

4) 为进入或离开特定类型的节点创建平行的 visitor。

```js
visit(ast, {
  enter: {
    Kind(node) {
      // enter the "Kind" node
    }
  },
  leave: {
    Kind(node) {
      // leave the "Kind" node
    }
  }
})
```

### BREAK

`BREAK` 标记在 `visitor` 的文档中有描述。

## Printer

### print

```js
function print(ast): string
```

使用一组合理的格式化规则，将一个 AST 转化成一个字符串。
