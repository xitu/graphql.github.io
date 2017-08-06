---
title: 传递参数
layout: ../_core/GraphQLJSLayout
category: GraphQL.js 教程
permalink: /graphql-js/passing-arguments/
next: /graphql-js/object-types/
---

就像 REST API 一样，在 GraphQL API 中，通常向入口端点传入参数，在 schema language 中定义参数，并自动进行类型检查。每一个参数必须有名字和数据类型。举个例子，在 [基础类型文档](/graphql-js/basic-types/) 中，我们定义了一个名为 `rollThreeDice` 的入口端点：

```javascript
type Query {
  rollThreeDice: [Int]
}
```

我们可能想要一个更通用的函数来实现投掷 `numDice` 个的骰子，而不是硬性地设为 "3"，并且有一个参数 `numSide` 来表示骰子的面数，我们可以这样在 GraphQL schema language 实现：

```javascript
type Query {
  rollDice(numDice: Int!, numSides: Int): [Int]
}
```

 `Int!` 中的感叹号表示参数 `numDice` 不能为 null，这意味着我们可以跳过一些数据类型验证来简化服务端的代码。我们可以让 `numSides` 为 null，并假定一个骰子默认有 6 个面。

到现在为止，我们的解析器没有参数。当解析器传入一个 "args" 对象作为函数的第一个参数，rollDice 可以被这样实现：

```javascript
var root = {
  rollDice: function (args) {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  }
};
```

如果你知道参数的格式是什么样子的，那使用 [ES6 解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 会更加方便，所以 `rollDice` 也可以写成这样：

```javascript
var root = {
  rollDice: function ({numDice, numSides}) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};
```

如果你熟悉解构，在 `rollDice` 被定义的时候，就可以清楚地知道参数是什么。

`rollDice` 服务端的 API 的完整代码如下：

```javascript
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// 使用 GraphQL schema language 构造一个 schema
var schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// root 为每个端点入口 API 提供一个解析器
var root = {
  rollDice: function ({numDice, numSides}) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
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

当你调用这个 API 时，你需要按名称传入每个参数，对于上面的服务器代码，你可以通过发起这样的 GraphQL 查询，来投掷 3 个六面的骰子。

```javascript
{
  rollDice(numDice: 3, numSides: 6)
}
```

如果你使用 `node server.js` 运行这段代码，你可以浏览 http://localhost:4000/graphql 来尝试这个 API。

当你在代码中传递参数时，最好避免自己构建整个查询语句。你可以使用 `$` 语法来定义一条查询中的变量，并将变量作为单独映射来传递。

举个例子，请求上面服务器代码的部分 JavaScript 代码如下：

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

使用 `$dice` 和 `$sides` 作为 GraphQL 中的变量，我们无需在客户端对它们进行转义。

通过基础类型和参数传递，你可以定义任意你"能够"在 REST API 中定义的内容。但 GraphQL 支持更强大的查询。如果你学习了 [定义你自己的对象类型](/graphql-js/object-types/)，你可以用单个 API 调用来代替多个 API 调用。