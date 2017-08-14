---
title: Execution
layout: ../_core/DocsLayout
category: Learn
permalink: /learn/execution/
next: /learn/introspection/
---

在验证环节之后，GraphQL 服务端在处理数据之后，会根据 GraphQL 查询的请求内容生成对应结构的结果，一般情况下会以JSON形式返回。

GraphQL 不能脱离类型系统处理查询，让我们用一个类型系统的例子来说明一个查询的执行过程，在这一系列的文章中我们重复使用了这些类型，下文是其中的一部分

```
type Query {
  human(id: ID!): Human
}

type Human {
  name: String
  appearsIn: [Episode]
  starships: [Starship]
}

enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Starship {
  name: String
}
```

现在让我们用一个例子来描述当一个查询请求被执行的全过程

```
# { "graphiql": true }
{
  human(id: 1002) {
    name
    appearsIn
    starships {
      name
    }
  }
}
```

您可以将 GraphQL 查询中的每个字段视为返回下一个类型的上一个类型的函数或方法。事实上，这正是 GraphQL 的工作原理。每个类型的每个字段都由称为解析器的函数支持，该函数由 GraphQL 服务器开发人员提供。当一个字段被执行时，相应的解析器被调用以产生下一个值。

如果字段产生标量值，例如字符串或数字，则执行完成。但是，如果一个字段产生一个实体对象，则该查询将继续执行对应字段的解析器函数，直到生成标量值。 GraphQL 查询始终以标量值结尾。



## 根字段&解析器函数

每一个 GraphQL 服务端应用的顶层，必有一个类型代表着所有 GraphQL API的入口，我们将他称之为根类型或者查询类型。

在这个例子中查询类型提供了一个字段 `human`,并且接受一个参数 `id`。解析器函数请求了数据库并通过构造函数染回了 `Human` 对象

```
Query: {
  human(obj, args, context) {
    return context.db.loadHumanByID(args.id).then(
      userData => new Human(userData)
    )
  }
}
```

这个例子使用了 JavaScript 语言，但 GraphQL 服务端应用可以被[多种语言实现](https://github.com/whisperfairy/graphql-china.github.io/blob/zh-cn/code).无论哪种语言，解析器函数都接受3个参数

- `obj` 上一级对象，如果字段属于根节点查询类型通常不会被使用。
- `args` 可以提供在 GraphQL 查询中传入的参数
- `context` 会被提供了所有解析器，并且持有重要的上下文信息比如当前登入的用户或者数据库访问对象

## 异步解析器函数

让我们分析下下文中的解析器函数

```
human(obj, args, context) {
  return context.db.loadHumanByID(args.id).then(
    userData => new Human(userData)
  )
}
```

`context` 提供了一个数据库访问对象用来通过查询中传递的参数 `id` 来查询数据，因为从数据库拉去数据的过程是一个异步操作，该方法返回了一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象，在 JavaScript 语言中 Promise 对象用来返回异步操作，但这个概念在各种语言中都有提及，比如 Futures ，Tasks 或者 Defferred 。当数据库返回查询结果，我们就能通过构造函数返回一个新的 `Human` 对象。

这里要注意的是，只有解析器函数能感知到 Promise ，GraphQL 查询只关注 `human` 字段是否返回，在执行期间如果异步操作没有完成，则 GraphQL 会一直等待下去，因此在这个环节需要关注异步处理上的优化。

## 标准解析器

现在 `Human` 对象已经生成了，但 GraphQL 还是会继续递归执行下去。

```
Human: {
  name(obj, args, context) {
    return obj.name
  }
}
```

GraphQL 服务端应用的业务取决于类型系统的结构。在 `human` 对象返回值之前，GraphQL 会根据预设好的类型系统与对应的解析器函数决定如何以及返回什么样的Human字段。

在这个例子中，对 name 字段的处理非常的清晰， name 字段对应的解析器函数调用了在上层回调函数生成的 `new Human` 对象在这个案例中，我们设计Human对象会拥有一个 `name` 属性可以让我们从 obj 对象中直接读取。

事实上在返回的字段可以直接从对象中获得的时候，大部分 GraphQL 库可以让我们省略定义的步骤，当然这是当我们请求的字段可以直接从上层返回对象中取得并返回的情况。

## 标量强制

当 `name` 字段被处理后，`appearsIn` 和 `starships` 字段可以被同步执行， `appearsIn` 字段

```
Human: {
  appearsIn(obj) {
    return obj.appearsIn // returns [ 4, 5, 6 ]
  }
}
```

请注意，我们的类型系统声明 `appearsIn` 字段将返回具有已知值的枚举值，但是此函数返回数字！实际上，如果我们查看结果，我们将看到正在返回适当的枚举值。这是怎么回事？

这是标量强制的一个例子。类型系统知道预期的内容，并将将解析器函数返回的值转换为维护 API 合同的内容。在这种情况下，可能在我们的服务器上定义了一个枚举类型，但解析器在内部使用 4,5 和 6 的整数类型，但在 GraphQL 类型系统中将它们表示为枚举值，如果类型不匹配将返回null，并提示错误。

## 列表解析器

我们已经看到一个字段返回上面的`appearsIn`字段的事物列表时会发生什么。它返回了枚举值的列表，因为这是系统期望的类型，列表中的每个项目被强制为适当的枚举值。让我们看下`startships`被解析的时候会发生什么？

```
Human: {
  starships(obj, args, context) {
    return obj.starshipIDs.map(
      id => context.db.loadStarshipByID(id).then(
        shipData => new Starship(shipData)
      )
    )
  }
}
```

解析器函数在这个字段中返回了一个 Promise 对象，它返回一个 Promises 列表。 `Human` 对象具有他们正在驾驶的 `Starships` 的 ids 列表，但是我们需要通过这些 id 来获得真正的 Starship 对象。

GraphQL 将在同步执行这些 Promise ，当返回一个对象列表，它将继续同步加载每个这些对象的 `name` 字段。

## 产生结果

当每个字段被解析时，结果值被放置到键值映射中，字段名称（或别名）作为键，并且解析器的值作为值，这继续从查询的底部叶字段返回直到根据“查询”类型的原始字段。总而言之，这些结构反映了原始查询，然后可以将其发送（通常为 JSON）到请求的客户端。

让我们最后一眼看看原来的查询，看看这些解析函数如何产生一个结果：
```
# { "graphiql": true }
{
  human(id: 1002) {
    name
    appearsIn
    starships {
      name
    }
  }
}
```
