---
title: GraphQL.js 入门
sidebarTitle: 入门
layout: ../_core/GraphQLJSLayout
category: GraphQL.js 教程
permalink: /graphql-js/
next: /graphql-js/running-an-express-graphql-server/
---

## 学前准备

即使这些示例大部分在以前版本的 Node 中也能正常运行，你也应该至少在开始学习之前安装了 v6 以上版本的 Node 环境。在本篇指南中，我们不会使用任何需要转换的语言特性，但是我们会使用 ES6 的部分新特性，比如 [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/)、[classes](http://javascriptplayground.com/blog/2014/07/introduction-to-es6-classes-tutorial/) 和 [fat arrow functions](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-arrow-functions/)。所以如果你不熟悉它们，你应该先去了解一下。

创建一个新项目，在你当前目录去安装 GraphQL.js：

```bash
npm init
npm install graphql --save
```

## 编写代码

我们需要一个定义 `Query` 类型的 schema 来处理 GraphQL 查询。我们还需要一个 API 根节点，为每个 API 端点提供一个名为“resolver”的函数。对于只返回“Hello world！”的 API，我们可以将此代码放在名为 `server.js` 的文件中：

```javascript
var { graphql, buildSchema } = require('graphql');

// 使用 GraphQL schema language 构建一个 schema
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// 根节点为每个 API 入口端点提供一个 resolver 函数
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

// 运行 GraphQL query '{ hello }' ，输出响应
graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});
```

如果你像这样运行代码：

```bash
node server.js
```

你会看到打印出的 GraphQL 响应：

```javascript
{ data: { hello: 'Hello world!' } }
```

恭喜 - 你刚刚执行了一个 GraphQL 的查询！

在实际应用中，你可能不会在命令行工具里执行 GraphQL，而是会想从一个 API 服务器运行 GraphQL 查询。如何在 HTTP API 服务器运行 GraphQL，请查看 [运行 GraphQL 服务器](/graphql-js/running-an-express-graphql-server/) 章节。
