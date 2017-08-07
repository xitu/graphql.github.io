---
title: 认证和 Express 中间件
sidebarTitle: 认证 & 中间件
layout: ../_core/GraphQLJSLayout
category: GraphQL.js 教程
permalink: /graphql-js/authentication-and-express-middleware/
next: /graphql-js/constructing-types/
---

Express 中间件可以很方便地结合 `express-graphql` 使用，这也是一个良好的认证处理模式。

你可以就像普通 Express 应用使用中间件一样把中间件和 GraphQL 解析器一起使用。然后 `request` 对象就会作为解析函数的第二参数传入。（译者注：[v0.5.0](https://github.com/graphql/graphql-js/releases/tag/v0.5.0) 之后，作为第三参数）

举个例子，假设我们想要服务器记录每个请求的 IP 地址，并编写一个返回调用者 IP 地址的 API。前者我们通过中间件完成，后者在解析器中取 `request` 对象即可。下面是实现这个功能的服务端代码：

```javascript
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    ip: String
  }
`);

function loggingMiddleware(req, res, next) {
  console.log('ip:', req.ip);
  next();
}

var root = {
  ip: function (args, request) {
    return request.ip;
  }
};

var app = express();
app.use(loggingMiddleware);
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
```

在 REST API 中，认证通常是借由 header 处理的，其中包含一个 auth token 用于识别发出请求的用户。Express 中间件会处理这些 header，并将认证数据放进 Express 的 `request` 对象。像这样处理认证的中间件模块有 [Passport](http://passportjs.org/)、 [express-jwt](https://github.com/auth0/express-jwt) 和 [express-session](https://github.com/expressjs/session)。这些模块每一个都能配合 `express-graphql` 使用。

如果你对这些认证机制都不熟悉，我们推荐使用 `express-jwt`，因为它既简单又不会牺牲任何后期的弹性。

如果你是从头读到这儿的，那么恭喜你！你现在已经知道构建一个 GraphQL API 服务器的所有知识了。
