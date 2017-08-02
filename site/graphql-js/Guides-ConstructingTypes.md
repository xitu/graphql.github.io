---
title: Constructing Types
layout: ../_core/GraphQLJSLayout
category: Advanced Guides
permalink: /graphql-js/constructing-types/
next: /graphql-js/express-graphql/
---

对多数应用来说，你可以在开始运行的时候使用 GraphQL Schema Languange 声明固有的 Schema。但有些情况下，使用程序构建 Schema 也很有用。你可使用 `GraphQLSchema` 构造函数来做这件事。

使用 `GraphQLSchema` 构造函数创建 Schema 时，你在定义 `Query` 和 `Mutation` 类型时不用单纯的 Schema Language，而是像对象一样创建它们。

例如，假设我们要实现个简单的 API，根据 id 在一些硬编码数据中查询某个用户数据。我们可以用 `buildSchema` 这么写：

```javascript
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type User {
    id: String
    name: String
  }

  type Query {
    user(id: String): User
  }
`);

// 从 id 映射到 User 对象
var fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

var root = {
  user: function ({id}) {
    return fakeDatabase[id];
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

也可以在不使用 GraphQL Schema Language 的情况下实现相同的 API:

```javascript
var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');

// Maps id to User object
var fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

// 定义 User 类型
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});

// 定义 Query 类型
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      // `args` 描述了 `user` 查询接受的参数
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function (_, {id}) {
        return fakeDatabase[id];
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
```

当我们使用这种方式构建 API 时，根解析器是构建在 `Query` 和 `Mutation` 类型， 而不是 `root` 对象上的。

这种方法在你想要通过一些手段（例如数据库 Schema）自动创建 GraphQL Schema 时很有用。如此一来你就可以拥有一些类似于创建和更改数据库记录的通用模板。还有，在实现类似集合类型（union types）这种没法轻易映射为 ES6 Class 或者纯 Schema Language 实现的功能时，此方法也很有用。
