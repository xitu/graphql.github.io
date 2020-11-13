---
title: 分页
layout: docs
category: 最佳实践
permalink: /learn/pagination/
next: /learn/global-object-identification/
---

> 不同的分页模型可以实现不同的客户端功能

在 GraphQL 中一个常见的用例是遍历对象集合之间的关系。在 GraphQL 中有许多不同的方式来展示这些关系，为客户端开发人员提供了一组不同的功能。

## 复数

暴露对象之间连接的最简单方法是返回一个复数类型的字段。例如，如果我们想得到一个 R2-D2 的朋友列表，我们可以直接请求所有的朋友：

```graphql
# { "graphiql": true }
{
  hero {
    name
    friends {
      name
    }
  }
}
```

## 切片

但是，尽管如此，我们也意识到客户端可能需要其他行为。客户可能希望能够指定他们想要获取的朋友数量；也许他们只要前两个。所以我们想要暴露一些类似的东西：


```graphql
{
  hero {
    name
    friends(first:2) {
      name
    }
  }
}
```

但即使我们仅仅获得前两个结果，我们可能仍然想要在列表中分页：一旦客户端获取前两个朋友，他们可能会发送第二个请求来请求接下来的两个朋友。我们如何启用这个行为？

## 分页和边

我们有很多种方法来实现分页：

 - 我们可以像这样 `friends(first:2 offset:2)` 来请求列表中接下来的两个结果。
 - 我们可以像这样 `friends(first:2 after:$friendId)`, 来请求我们上一次获取到的最后一个朋友之后的两个结果。
 - 我们可以像这样 `friends(first:2 after:$friendCursor)`, 从最后一项中获取一个游标并使用它来分页。

一般来说，我们发现**基于游标的分页**是最强大的分页。特别当游标是不透明的时，则可以使用基于游标的分页（通过为游标设置偏移或 ID）来实现基于偏移或基于 ID 的分页，并且如果分页模型在将来发生变化，则使用游标可以提供额外的灵活性。需要提醒的是，游标是不透明的，并且它们的格式不应该被依赖，我们建议用 base64 编码它们。

这导致我们遇到一个问题：我们如何从对象中获取游标？我们不希望游标放置在 `User` 类型上；它是连接的属性，而不是对象的属性。所以我们可能想要引入一个新的间接层；我们的 `friends` 字段应该给我们一个边（edge）的列表，边同时具有游标和底层节点：

```graphql
{
  hero {
    name
    friends(first:2) {
      edges {
        node {
          name
        }
        cursor
      }
    }
  }
}
```

如果存在针对于边而不是针对于某一个对象的信息，则边这个概念也被证明是有用的。例如，如果我们想要在 API 中暴露“友谊时间”，将其放置在边里是很自然的。

## 列表的结尾、计数以及连接

现在我们有能力使用游标对连接进行分页，但是我们如何知道何时到达连接的结尾？我们必须继续查询，直到我们收到一个空列表，但是我们真的希望连接能够告诉我们什么时候到达结尾，这样我们不需要额外的请求。同样的，如果我们想知道关于连接本身的附加信息怎么办；例如，R2-D2 有多少个朋友？

为了解决这两个问题，我们的 `friends` 字段可以返回一个连接对象。连接对象将拥有一个存放边的字段以及其他信息（如总计数和有关下一页是否存在的信息）。所以我们的最终查询可能看起来像这样：


```graphql
{
  hero {
    name
    friends(first:2) {
      totalCount
      edges {
        node {
          name
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
```

请注意，我们也可能在这个 `PageInfo` 对象中包含 `endCursor` 和 `startCursor`。这样，如果我们不需要边所包含的任何附加信息，我们就不需要查询边，因为我们从 `pageInfo` 获取了分页所需的游标。这导致连接的潜在可用性改进；相比于仅暴露 `edges` 列表，我们还可以暴露一个仅包含节点的专用列表，以避免使用间接层。

## 完整的连接模型

显然，这比我们原来只有复数的设计更复杂！但是通过采用这种设计，我们已经为客户解锁了许多功能：

 - 为列表分页的能力。
 - 请求有关连接本身的信息的能力，如 `totalCount` 或 `pageInfo`。
 - 请求有关边本身的信息的能力，如 `cursor` 或 `friendshipTime`。
 - 改变我们后端如何实现分页的能力，因为用户仅使用不透明的游标。

要查看此操作，在示例 schema 中有一个附加字段，称为 `friendsConnection`，它暴露了所有这些概念。你可以在示例查询中查看它。尝试将 `after` 参数从 `friendsConnection` 移除以查看分页如何受到影响。另外，尝试用连接上的 `friends` 辅助字段替换 `edges` 字段，当适用于客户端时，这样可以直接访问朋友列表而无需额外的边这一层。

```graphql
# { "graphiql": true }
{
  hero {
    name
    friendsConnection(first:2 after:"Y3Vyc29yMQ==") {
      totalCount
      edges {
        node {
          name
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
```

## 连接规范

为了确保该模式的一致实现，Relay 项目具有正式的[规范](https://facebook.github.io/relay/graphql/connections.htm)，你可以遵循该规范来构建使用基于游标的连接模式的 GraphQL API。