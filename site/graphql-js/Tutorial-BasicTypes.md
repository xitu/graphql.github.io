---
title: 基本类型
layout: ../_core/GraphQLJSLayout
category: GraphQL.js 教程
permalink: /graphql-js/basic-types/
next: /graphql-js/passing-arguments/
---

大多数情况下，你所需要做的只是使用 GraphQL schema language 指定你的 API 需要的类型，然后作为参数传给 `buildSchema` 函数。

GraphQL schema language 支持的标量类型有 `String`、`Int`、`Float`、`Boolean` 和 `ID`，因此你可以在传给 `buildSchema` 的 schema 中直接使用这些类型。

默认情况下，每个类型都是可以为空的 —— 意味着所有的标量类型都可以返回 `null`。使用感叹号可以标记一个类型不可为空，如 `String!` 表示非空字符串。

如果是列表类型，使用方括号将对应类型包起来，如 `[Int]` 就表示一个整数列表。

这些类型都直接映射 JavaScript，所以你可以直接返回原本包含这些类型的原生 JavaScript 对象。下面是一个展示如何使用这些基本类型的示例：

```javascript
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// 使用 GraphQL schema language 构建一个 schema
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

// root 将会提供每个 API 入口端点的解析函数
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
```

如果你使用 `node server.js` 运行这个代码，浏览 http://localhost:4000/graphql 你就能尝试这些 API 了。

这些案例展示了如何调用 API 以返回不同类型。如果要向 API 发送不同类型的数据，你还需要学习 [如何向 GraphQL API 传参](/graphql-js/passing-arguments/)。
