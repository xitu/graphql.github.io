---
title: graphql/validation
layout: ../_core/GraphQLJSLayout
category: API 参考
permalink: /graphql-js/validation/
sublinks: specifiedRules,validate
---

`graphql/validation` 模块负责完成一个 GraphQL 请求的验证阶段。你可以从 `graphql/validation` 模块导入，或者从根 `graphql` 模块导入，如下：

```js
import { validate } from 'graphql/validation'; // ES6
var { validate } = require('graphql/validation'); // CommonJS
```

## 概览

<ul class="apiIndex">
  <li>
    <a href="#validate">
      <pre>function validate</pre>
      根据给定 Schema 验证一个 AST（抽象语法树）。
    </a>
  </li>
  <li>
    <a href="#specifiedrules">
      <pre>var specifiedRules</pre>
      GraphQL 规范中描述的一系列标准验证规则。
    </a>
  </li>
</ul>

## 验证

### validate

```js
function validate(
  schema: GraphQLSchema,
  ast: Document,
  rules?: Array<any>
): Array<GraphQLError>
```

实现规范的“验证”章节。

验证过程会同步执行，如果发生错误则返回错误数组，如果文档有效没有发生错误，则返回空数组。

如果未提供特定的验证规则，则执行 GraphQL 规范的默认验证规则。

每个验证规则都是一个函数，返回一个 visitor（查看 language/visitor API）。visitor 方法应当在文档无效时返回 GraphQLErrors，或者 GraphQLError 数组。

visitor 应该支持 `visitSpreadFragments: true`，这将改变 visitor 的行为：跳过顶层定义的片段，并访问这些片段的所有展开点。

### specifiedRules

```js
var specifiedRules: Array<(context: ValidationContext): any>
```

这个集合包含了所有 GraphQL 规范定义的验证规则。
