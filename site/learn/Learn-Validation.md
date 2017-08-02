---
title: 验证
layout: ../_core/DocsLayout
category: 学习
permalink: /learn/validation/
next: /learn/execution/
---

通过使用类型系统，你可以预判一个查询是否有效。这让服务器和客户端可以在无效查询创建时就有效地通知开发者，而不用依赖运行时检查。

对于我们的《星球大战》的案例，[starWarsValidation-test.js](https://github.com/graphql/graphql-js/blob/master/src/__tests__/starWarsValidation-test.js)这个文件包含一些查询，演示了各种无效查询，它也是一个测试文件，用于检测参考实现的验证器。

```graphql
# { "graphiql": true }
{
  hero {
    ...NameAndAppearances
    friends {
      ...NameAndAppearances
      friends {
        ...NameAndAppearances
      }
    }
  }
}

fragment NameAndAppearances on Character {
  name
  appearsIn
}
```

上面这个查询是有效的。我们来看看一些无效查询……

片段不能引用其自身或者创造回环，因为这会导致结果无边界。下面是一个相同的查询，但是没有显式的三层嵌套：

```graphql
# { "graphiql": true }
{
  hero {
    ...NameAndAppearancesAndFriends
  }
}

fragment NameAndAppearancesAndFriends on Character {
  name
  appearsIn
  friends {
    ...NameAndAppearancesAndFriends
  }
}
```

查询字段的时候，我们只能查询给定类型上的字段。因此由于 `hero` 返回 `Character`类型，我们只能查询 `Character` 上的字段。因为这个类型上没有 `favoriteSpaceship` 字段，所以这个查询是无效的：

```graphql
# { "graphiql": true }
# INVALID: favoriteSpaceship does not exist on Character
{
  hero {
    favoriteSpaceship
  }
}
```

当我们查询一个字段时，如果其返回值不是标量或者枚举型，那我们就需要指明想要从这个字段中获取的数据。`hero` 返回 `Character`类型，我们也请求了像是 `name` 和`appearsIn` 的字段；但如果将其省略，这个查询就变无效的了：

```graphql
# { "graphiql": true }
# INVALID: hero is not a scalar, so fields are needed
{
  hero
}
```

类似的，如果一个字段是标量，进一步查询它上面的字段也没有意义，这样做也会导致查询无效：

```graphql
# { "graphiql": true }
# INVALID: name is a scalar, so fields are not permitted
{
  hero {
    name {
      firstCharacterOfName
    }
  }
}
```

我们之前提到过，只有目标类型上的字段才可查询；当我们查询 `hero` 时，它会返回 `Character`，因此只有 `Character` 上的字段是可查询的。但如果我们要查的是 R2-D2 的 primary function 呢？

```graphql
# { "graphiql": true }
# INVALID: primaryFunction does not exist on Character
{
  hero {
    name
    primaryFunction
  }
}
```

这个查询是无效的，因为 `primaryFunction` 并不是 `Character` 的字段。我们需要某种方法来表示我们希望获取 `primaryFunction`，如果对应的 `Character` 是 `Droid`，并在其他情况下忽略此字段。我们可以使用之前引入的片段来解决这个问题。先在 `Droid` 上定义一个片段，然后在查询中引入它，这样我们就能在定义了 `primaryFunction` 的地方查询它。

```graphql
# { "graphiql": true }
{
  hero {
    name
    ...DroidFields
  }
}

fragment DroidFields on Droid {
  primaryFunction
}
```

这个查询是有效的，但是有点琐碎；具名片段在我们需要多次使用的时候更有价值，如果只使用一次，那么我们应该使用内联片段而不是具名片段；这同样能表示我们想要查询的类型，而不用单独命名一个片段：

```graphql
# { "graphiql": true }
{
  hero {
    name
    ... on Droid {
      primaryFunction
    }
  }
}
```

这只是验正系统的冰山一角；事实上需要一大套验正规则才能保证 GraphQL 查询的语义意义。规范中的“验证”章节有关于本话题更详细的内容，GraphQL.js 的 [validation](https://github.com/graphql/graphql-js/blob/master/src/validation) 目录包含了规范兼容的 GraphQL 验证器实现代码。
