---
title: 授权
layout: ../_core/DocsLayout
category: 最佳实践
permalink: /learn/authorization/
next: /learn/pagination/
---

> 将授权逻辑委托给业务逻辑层

授权是一种业务逻辑，描述给定的用户、会话、上下文是否具有执行操作的权限或查看一条数据的权限。例如：

**“只有作者才能看到他们自己的草稿”**

应当在 [业务逻辑层](/learn/thinking-in-graphs/#业务逻辑层) 实施这种行为。在 GraphQL 层中放置授权逻辑是很吸引人的，如下所示：

```javascript
var postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    body: {
      type: GraphQLString,
      resolve: (post, args, context, { rootValue }) => {
        // 只有当用户是帖子的作者时才返回帖子正文
        if (context.user && (context.user.id === post.authorId)) {
          return post.body;
        }
        return null;
      }
    }
  }
});
```

可以看到我们通过检查帖子的 `authorId` 字段是否等于当前用户的 `id` 来定义“作者拥有一个帖子”。你能发现其中的问题吗？我们需要复制这段代码到服务中的每一个入口端点。一旦我们无法保证授权逻辑的完全同步，用户可能在使用不同的 API 时看到不同的数据。我们可以通过确定授权的 [唯一真实来源](/learn/thinking-in-graphs/#业务逻辑层) 来避免这种情况。

在学习 GraphQL 或原型设计时，在解析器内定义授权逻辑是可以接受的。然而，对于生产代码库来说，还是将授权逻辑委托给业务逻辑层。这里有一个例子：

```javascript
// 授权逻辑在 postRepository 中
var postRepository = require('postRepository');

var postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    body: {
      type: GraphQLString,
      resolve: (post, args, context, { rootValue }) => {
        return postRepository.getBody(context.user, post);
      }
    }
  }
});
```

在上面的例子中，我们看到业务逻辑层要求调用者提供一个用户对象。如果您使用 GraphQL.js，您应当在解析器的 `context` 参数或是第四个参数中的 `rootValue` 上填充 User 对象。

我们建议将完全混合 <sup>[\[1\]](#note1)</sup> 的 User 对象传递给业务逻辑层，而非传递不透明的 token 或 API 密钥。这样，我们可以在请求处理管道的不同阶段处理 [身份验证](/graphql-js/authentication-and-express-middleware/) 和授权的不同问题。

<ol>
<li><a name="note1"></a> “混合（hydrated）”一个对象是指：对一个存储在内存中且尚未包含任何域数据（“真实”数据）的对象，使用域数据（例如来自数据库、网络或文件系统的数据）进行填充。 <a href="https://stackoverflow.com/questions/6991135/what-does-it-mean-to-hydrate-an-object">*</a></li>
</ol>
