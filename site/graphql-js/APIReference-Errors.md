---
title: graphql/error
layout: ../_core/GraphQLJSLayout
category: API Reference
permalink: /graphql-js/error/
sublinks: formatError,GraphQLError,locatedError,syntaxError
next: /graphql-js/execution/
---

`graphql/error` 模块负责创建和格式化 GraphQL 的错误信息。你可以直接从 `graphql/error` 模块导入，也可以从 `graphql` 这个根模块导入。举例来说就是这样：

```js
import { GraphQLError } from 'graphql'; // ES6
var { GraphQLError } = require('graphql'); // CommonJS
```

## 概述

<ul class="apiIndex">
  <li>
    <a href="#graphqlerror">
      <pre>class GraphQLError</pre>
      GraphQLError 表示 GraphQL 产生的错误信息。
    </a>
  </li>
  <li>
    <a href="#syntaxerror">
      <pre>function syntaxError</pre>
      产生一个表示语法错误的 GraphQLError。
    </a>
  </li>
  <li>
    <a href="#locatedError">
      <pre>function locatedError</pre>
      产生一个新的负责错误定位的 GraphQLError。
    </a>
  </li>
  <li>
    <a href="#formaterror">
      <pre>function formatError</pre>
      根据响应格式的规则描述来格式化一条错误信息。
    </a>
  </li>
</ul>

## 错误信息

### GraphQLError

```js
class GraphQLError extends Error {
 constructor(
   message: string,
   nodes?: Array<any>,
   stack?: ?string,
   source?: Source,
   positions?: Array<number>
 )
}
```

GraphQLError 表示 GraphQL 产生的错误信息。它包含一些用于调试的信息，比如查询语句中错误发生的位置。最常见的错误信息就是下面的的 `locatedError`。

### syntaxError

```js
function syntaxError(
  source: Source,
  position: number,
  description: string
): GraphQLError;
```

产生一个表示语法错误的 GraphQLError，它包含原始语句中语法错误具体定位的描述性信息。

### locatedError

```js
function locatedError(error: ?Error, nodes: Array<any>): GraphQLError {
```

当尝试执行 GraphQL 操作时抛出的任意一个错误，都会产生一个新的负责原始错误文档定位的 GraphQLError 。

### formatError

```js
function formatError(error: GraphQLError): GraphQLFormattedError

type GraphQLFormattedError = {
  message: string,
  locations: ?Array<GraphQLErrorLocation>
};

type GraphQLErrorLocation = {
  line: number,
  column: number
};
```

给定一个 GraphQLError，根据 GraphQL 规范中的响应格式和错误分类的规则描述来格式化错误信息。
