---
title: 执行
layout: ../_core/DocsLayout
category: 学习
permalink: /learn/execution/
next: /learn/introspection/
---

一个 GraphQL 查询在被验证后，GraphQL 服务器会将之执行，并返回与请求的结构相对应的结果，该结果通常会是 JSON 的格式。

GraphQL 不能脱离类型系统处理查询，让我们用一个类型系统的例子来说明一个查询的执行过程，在这一系列的文章中我们重复使用了这些类型，下文是其中的一部分：

```graphql
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

现在让我们用一个例子来描述当一个查询请求被执行的全过程。

```graphql
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

您可以将 GraphQL 查询中的每个字段视为返回子类型的父类型函数或方法。事实上，这正是 GraphQL 的工作原理。每个类型的每个字段都由一个 *resolver* 函数支持，该函数由 GraphQL 服务器开发人员提供。当一个字段被执行时，相应的 *resolver* 被调用以产生下一个值。

如果字段产生标量值，例如字符串或数字，则执行完成。如果一个字段产生一个对象，则该查询将继续执行该对象对应字段的解析器，直到生成标量值。GraphQL 查询始终以标量值结束。

## 根字段 & 解析器

每一个 GraphQL 服务端应用的顶层，必有一个类型代表着所有进入 GraphQL API 可能的入口点，我们将它称之为 *Root* 类型或 *Query* 类型。

在这个例子中查询类型提供了一个字段 `human`，并且接受一个参数 `id`。这个字段的解析器可能请求了数据库之后通过构造函数返回一个 `Human` 对象。

```js
Query: {
  human(obj, args, context) {
    return context.db.loadHumanByID(args.id).then(
      userData => new Human(userData)
    )
  }
}
```

这个例子使用了 JavaScript 语言，但 GraphQL 服务端应用可以被 [多种语言实现](/code/)。解析器函数接收 3 个参数：

- `obj` 上一级对象，如果字段属于根节点查询类型通常不会被使用。
- `args` 可以提供在 GraphQL 查询中传入的参数。
- `context` 会被提供给所有解析器，并且持有重要的上下文信息比如当前登入的用户或者数据库访问对象。

## 异步解析器

让我们来分析一下在这个解析器函数中发生了什么。

```js
human(obj, args, context) {
  return context.db.loadHumanByID(args.id).then(
    userData => new Human(userData)
  )
}
```

`context` 提供了一个数据库访问对象，用来通过查询中传递的参数 `id` 来查询数据，因为从数据库拉取数据的过程是一个异步操作，该方法返回了一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象，在 JavaScript 语言中 Promise 对象用来处理异步操作，但在许多语言中存在相同的概念，通常称作 *Futures*、*Tasks* 或者 *Defferred*。当数据库返回查询结果，我们就能构造并返回一个新的 `Human` 对象。

这里要注意的是，只有解析器能感知到 Promise 的进度，GraphQL 查询只关注一个包含着 `name` 属性的 `human` 字段是否返回，在执行期间如果异步操作没有完成，则 GraphQL 会一直等待下去，因此在这个环节需要关注异步处理上的优化。

## 不重要的解析器

现在 `Human` 对象已经生成了，但 GraphQL 还是会继续递归执行下去。

```js
Human: {
  name(obj, args, context) {
    return obj.name
  }
}
```

GraphQL 服务端应用的业务取决于类型系统的结构。在 `human` 对象返回值之前，由于类型系统确定了 `human` 字段将返回一个 `Human` 对象，GraphQL 会根据类型系统预设好的 `Human` 类型决定如何解析字段。

在这个例子中，对 name 字段的处理非常的清晰，name 字段对应的解析器被调用的时候，解析器回调函数的 obj 参数是由上层回调函数生成的 `new Human` 对象。在这个案例中，我们希望 Human 对象会拥有一个 `name` 属性可以让我们直接读取。

事实上，许多 GraphQL 库可以让你省略这些简单的解析器，假定一个字段没有提供解析器时，那么应​​该从上层返回对象中读取和返回和这个字段同名的属性。

## 标量强制

当 `name` 字段被处理后，`appearsIn` 和 `starships` 字段可以被同步执行， `appearsIn` 字段也可以有一个简单的解析器，但是让我们仔细看看。

```js
Human: {
  appearsIn(obj) {
    return obj.appearsIn // returns [ 4, 5, 6 ]
  }
}
```

请注意，我们的类型系统声明 `appearsIn` 字段将返回具有已知值的枚举值，但是此函数返回数字！实际上，如果我们查看结果，我们将看到正在返回适当的枚举值。这是怎么回事？

这是一个强制标量的例子。因为类型系统已经被设定，所以解析器函数的返回值必须符合与类型系统对应的 API 规则的约束。在这个案例中，我们可能在服务器上定义了一个枚举类型，它在内部使用像是 4、5 和 6 这样的数字，但在 GraphQL 类型系统中将它们表示为枚举值。

## 列表解析器

我们已经看到一个字段返回上面的 `appearsIn` 字段的事物列表时会发生什么。它返回了枚举值的**列表**，因为这是系统期望的类型，列表中的每个项目被强制为适当的枚举值。让我们看下 `startships` 被解析的时候会发生什么？

```js
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

解析器在这个字段中不仅仅是返回了一个 Promise 对象，它返回一个 Promises **列表**。`Human` 对象具有他们正在驾驶的 `Starships` 的 ids 列表，但是我们需要通过这些 id 来获得真正的 Starship 对象。

GraphQL 将并发执行这些 Promise，当执行结束返回一个对象列表后，它将继续并发加载列表中每个对象的 `name` 字段。

## 产生结果

当每个字段被解析时，结果被放置到键值映射中，字段名称（或别名）作为键值映射的键，解析器的值作为键值映射的值，这个过程从查询字段的底部叶子节点开始返回，直到根 Query 类型的起始节点。最后合并成为能够镜像到原始查询结构的结果，然后可以将其发送（通常为 JSON 格式）到请求的客户端。

让我们最后一眼看看原来的查询，看看这些解析函数如何产生一个结果：

```graphql
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
