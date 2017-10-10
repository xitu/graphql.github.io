---
title: 变更和输入类型
layout: ../_core/GraphQLJSLayout
category: GraphQL.js 教程
permalink: /graphql-js/mutations-and-input-types/
next: /graphql-js/authentication-and-express-middleware/
---

假设你有一个 API 入口端点用于修改数据，像是向数据库中插入数据或修改已有数据，在 GraphQL 中，你应该将这个入口端点做为 `Mutation` 而不是 `Query`。这十分简单，只需要将这个入口端点做成 `Mutation` 类型顶层的一部份即可。

假设我们有一个“今日消息”服务器，每个人都可以在上面更新“今日消息”，或者阅读当前的“今日消息”。这个服务器的 GraphQL schema 很简单：

```graphql
type Mutation {
  setMessage(message: String): String
}

type Query {
  getMessage: String
}
```

将一个变更（mutation）映射到数据库的 create 或者 update 操作会很方便，如 `setMessage`，其会返回数据库所存的数据。这样一来，你修改了服务端的数据，客户端就能获知这个修改。

不论是变更还是查询，根级解析器都能够处理，因此实现 schema 的 root 可以如下：

```javascript
var fakeDatabase = {};
var root = {
  setMessage: function ({message}) {
    fakeDatabase.message = message;
    return message;
  },
  getMessage: function () {
    return fakeDatabase.message;
  }
};
```

实现变更不需要更多的东西。但是更多情况下，你会发现有多个不同的变更接受相同的输入参数。常见的案例是在数据库中创建对象和更新对象的接口通常会接受一样的参数。你可以使用“输入类型”来简化 schema，使用 `input` 关键字而不是 `type` 关键字即可。

例如，我们每天有多条而不是一条消息，在数据库中以 `id` 字段为索引，每条消息都有一个 `content` 和 `author` 字符串。我们需要一个变更 API，用于创建新消息和更新旧消息。我们可以使用这个 schema：

```graphql
input MessageInput {
  content: String
  author: String
}

type Message {
  id: ID!
  content: String
  author: String
}

type Query {
  getMessage(id: ID!): Message
}

type Mutation {
  createMessage(input: MessageInput): Message
  updateMessage(id: ID!, input: MessageInput): Message
}
```

此处的变更返回一个 `Message` 类型，因此客户端通过变更的请求就能获取到新修改的 `Message` 的信息。

输入类型的字段不能是其他对象类型，只能是基础标量类型、列表类型或者其他输入类型。

一个有用的惯例是在 schema 的末尾使用 `Input` 命名输入类型，因为对于单一概念对象，通常你想要输入和输出类型之间只有略微不同。

下面的可运行代码实现了上述 schema，数据保存在内存中：

```javascript
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// 使用 GraphQL schema language 构建 schema
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// 如果 Message 拥有复杂字段，我们把它们放在这个对象里面。
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// 映射 username 到 content
var fakeDatabase = {};

var root = {
  getMessage: function ({id}) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: function ({input}) {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: function ({id, input}) {
    if (!fakeDatabase[id]) {
      throw new Error('no message exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});

```

你必须在你的 GraphQL 查询前面使用关键字 `mutation` 才能调用变更，并将数据作为 JSON 对象以传入输入类型。如果用上面定义的服务器，你可以使用以下操作创建一条消息并返回这条消息的 `id`：

```graphql
mutation {
  createMessage(input: {
    author: "andy",
    content: "hope is a good thing",
  }) {
    id
  }
}
```

你也可以像查询一样使用变量来简化变更的客户端逻辑。如下调用服务端变更的 JavaScript 代码：

```javascript
var author = 'andy';
var content = 'hope is a good thing';
var xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open("POST", "/graphql");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Accept", "application/json");
xhr.onload = function () {
  console.log('data returned:', xhr.response);
}
var query = `mutation CreateMessage($input: MessageInput) {
  createMessage(input: $input) {
    id
  }
}`;
xhr.send(JSON.stringify({
  query: query,
  variables: {
    input: {
      author: author,
      content: content,
    }
  }
}));
```

一个十分特殊的变更类型是“改变用户”，譬如注册新用户。除了使用 GraphQL 变更来实现这个功能之外，在学完 [GraphQL 认证和 Express 中间件](/graphql-js/authentication-and-express-middleware/) 之后你还能使用现有库来实现。
