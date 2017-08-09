---
title: GraphQL 客户端
layout: ../_core/GraphQLJSLayout
category: GraphQL.js 教程
permalink: /graphql-js/graphql-clients/
next: /graphql-js/basic-types/
---

由于 GraphQL API 拥有比 REST API 更多的下层结构，它也有更强大的客户端。譬如 [Relay](https://facebook.github.io/relay/)，它能自动操作批处理、缓存等等。但你并不需要一个复杂的客户端才能调用 GraphQL 服务器，在有了 `express-graphql` 的情况下，你可以向 GraphQL 服务器上的入口端点发送一个 HTTP POST 请求，其中将 GraphQL 查询作为 JSON 载荷的 `query` 字段，就能调用 GraphQL 服务器。

假设我们运行了 [Express GraphQL 服务器](/graphql-js/running-an-express-graphql-server/) 的示例代码，GraphQL 服务运行于 http://localhost:4000/graphql ，我们想要发送 GraphQL 查询 `{ hello }`。我们可以在命令行中使用 `curl` 来发送这一请求，将下面代码粘贴到终端中去：

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ hello }"}' \
http://localhost:4000/graphql
```

你会见到输出的 JSON：

```bash
{"data":{"hello":"Hello world!"}}
```

通过浏览器发送 GraphQL 也很简单。打开 http://localhost:4000 ，开启开发者控制台，粘贴：

```javascript
var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open("POST", "/graphql");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "application/json");
xhr.onload = function () {
  console.log('data returned:', xhr.response);
}
xhr.send(JSON.stringify({query: "{ hello }"}));
```

你会在控制台中见到返回的数据：

```
data returned: Object { hello: "Hello world!" }
```

案例中的查询是硬编码的字符串。一旦你的应用变得复杂，你添加了像 [传递参数](/graphql-js/passing-arguments/) 中描述的那种接收参数的 GraphQL 入口端点，就会想在客户端代码中使用参数构建 GraphQL 查询。你可以在查询中包含一个以`$`开头的关键字，并传递额外的 `variables` 字段给载荷来完成这个。

假设你运行了 [传递参数](/graphql-js/passing-arguments/) 的案例服务器，它有如下 schema：

```graphql
type Query {
  rollDice(numDice: Int!, numSides: Int): [Int]
}
```

你可以使用下列 JavaScript 代码来接入：

```javascript
var dice = 3;
var sides = 6;
var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open("POST", "/graphql");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "application/json");
xhr.onload = function () {
  console.log('data returned:', xhr.response);
}
var query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`;
xhr.send(JSON.stringify({
  query: query,
  variables: { dice: dice, sides: sides },
}));
```

这种语法的变量有助于自动避免转义 bug，也更容易监控服务器。

通常情况下，配置诸如 Relay 的客户端会花更多的时间，但是当你的应用发展壮大之时还是值得为了更多的特性而配置客户端。一开始你可以用 HTTP 请求作为传输层，之后切换到更复杂的客户端以满足你应用增长的复杂性需求。

本文中你学会了如何编写只返回一条字符串的 API 的 GraphQL 客户端和服务器。如果你不想止步于此，你可以学习使用如何使用其他 [基本类型](/graphql-js/basic-types/)。
