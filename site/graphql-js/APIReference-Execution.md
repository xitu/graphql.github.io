---
title: graphql/execution
layout: ../_core/GraphQLJSLayout
category: API 参考
permalink: /graphql-js/execution/
sublinks: execute
next: /graphql-js/language/
---

`graphql/execution` 模块负责完成一个 GraphQL 请求的执行阶段。你可以直接从 `graphql/execution` 模块导入，也可以从 `graphql` 这个根模块导入。举例来说就是这样：

```js
import { execute } from 'graphql'; // ES6
var { execute } = require('graphql'); // CommonJS
```

## 概览

<ul class="apiIndex">
  <li>
    <a href="#execute">
      <pre>function execute</pre>
      对给定的 schema 执行一个 GraphQL 请求。
    </a>
  </li>
</ul>

## 执行

### execute

```js
export function execute(
  schema: GraphQLSchema,
  documentAST: Document,
  rootValue?: mixed,
  contextValue?: mixed,
  variableValues?: ?{[key: string]: mixed},
  operationName?: ?string
): Promise<ExecutionResult>

type ExecutionResult = {
  data: ?Object;
  errors?: Array<GraphQLError>;
}
```

上面的代码实现了 GraphQL 规范中“处理请求”的部分。

它会返回一个最终一定会被 resolve 而不会被 reject 的 Promise。

如果这个函数的参数造成了一个非法的执行上下文，那么马上就会有一个 GraphQLError 被抛出，这个错误将会解释非法输入的具体信息。

`ExecutionResult` 代表执行的结果。`data` 是执行查询语句的结果，`errors` 在没有错误发生时为空，在有错误发生时为一个非空的数组。
