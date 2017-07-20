---
title: Schema和类型
layout: ../_core/DocsLayout
category: 学习
permalink: /learn/schema/
next: /learn/validation/
sublinks: Type System / 类型系统,Type Language / 类型语言,Object Types and Fields / 对象类型和字段,Arguments / 参数,The Query and Mutation Types / 查询和变更类型,Scalar Types / 标量类型,Enumeration Types / 枚举类型,Lists and Non-Null / 列表和非空,Interfaces / 接口,Union Types / 联合类型,Input Types / 输入类型
---

在本页，你将学到关于GraphQL类型系统中所有你需要了解的知识，以及类型系统如何描述可以查询的数据。因为GraphQL可以运行在任何后端框架或者编程语言之上，我们将摒除实现上的细节而仅仅专注于其概念。

### Type system/类型系统

如果你之前见到过GraphQL查询，你就知道GraphQL查询语言基本上就是关于选择对象上的字段。因此，例如下列查询中：

```graphql
# { "graphiql": true }
{
  hero {
    name
    appearsIn
  }
}
```

1. 我们以一个特殊的对象"root"开始
2. 选择其上的`hero`字段
3. 对于`hero`返回的对象，我们选择`name`和`appearsIn`字段

因为一个GraphQL查询的结构几乎匹配其结果，因此即便不知到服务器的情况，你也能预测查询会返回什么结果。但是一个关于我们所需要的数据的确切描述依然很有意义，我们能选择什么字段？服务器会返回哪种对象？这些对象下有那些字段可用？这便是schema的来历。

每一个GraphQL服务都会定义一套类型，用以描述你可能从那个服务查询到的数据。每当查询到来，服务器就会根据schema验证并执行查询。

### Type language/类型语言

GraphQL服务可以用任何语言编写，因为我们并不依赖与任何特定语言的句法句式（譬如JavaScript）来与GraphQL schema沟通，我们定义了自己的简单语言，称之为“GraphQL schema语言”——他和GraphQL的查询语言很相似，让我们能够和GraphQL schema之间可以无语言差异地沟通。

### Object types and fields/对象类型和字段

一个GraphQL schema的中最基本组件是对象类型，它就表示你可以从服务上获取到什么类型对象，这个对象有什么字段。使用GraphQL schema语言，我们可以这让表示它：

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

虽然这语言可读性相当好，但我们还是检阅一下，以便我们可以有些共通的词汇：

- `Character`是一个_GraphQL对象类型_，表示其是一个拥有一些字段的类型。你的schema中的大多数类型都会是对象类型。
- `name`和`appearsIn`是`Character`类型上的_字段_。这意味着出现在一个GraphQL查询中的字段，唯独`name`和`appearsIn`可以操作`Character`类型。
- `String`是内置的_标量_类型之一——标量类型是解析到单个标量对象的类型，无法在查询中对它进行次级选择。后面我们将细述标量类型。
- `String!`表示这个字段是_非空的_，GraphQL服务保证当你查询这个字段后总会给你返回一个值。在类型语言里面，我们用一个感叹号来表示这个特性。
- `[Episode]!`表示一个`Episode`_数组_。因为它也是_非空的_，所以当你查询`appearsIn`字段的时候，你也总能得到一个数组（零个或者多个元素）。

现在你知道一个GraphQL对象类型看上去是怎样，也知道如何阅读基础的GraphQL类型语言了。

### Arguments/参数

GraphQL对象类型上的每一个字段都可能有另个或者多个参数，例如下面的`length`字段：

```graphql
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

所有参数都是具名的，不像JavaScript或者Python之类的语言，函数接受一个有序参数列表，而在GraphQL中，所有参数必须具名传递。本例中，`length`字段定义了一个参数，`unit`。

参数可能是必选或者可选的，当一个参数是可选的，我们可以定义一个_默认值_——如果`unit`参数没有传递，那么它将会被默认设置`METER`为。

### The Query and Mutation types/查询和变更类型

你的schema中大部分的类型都是普通对象类型，但是一个schema内有两个特殊类型：

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

每一个GraphQL服务都有一个`query`类型，可能有也可能没有一个`mutation`类型。这两个类型和常规对象类型无差，但是他们之所以特殊，是因为他们定义了每一个GraphQL查询的_入口_。因此如果你看到一个像这样的查询：

```graphql
# { "graphiql": true }
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```

那表示这个GraphQL服务需要一个`Query`类型，且其上有`hero`和`droid`字段：

```graphql
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

变更也是类似的工作方式 —— 你在`Mutation`类型上定义一些字段，然后这些字段将在根mutation字段可用，接着你就能在你的查询中调用。

有比记住的是，除了作为schema的入口，`Query`和`Mutation`类型与其他GraphQL对象类型别无二致，他们字段也是一样的工作方式。

### Scalar types/标量类型

一个对象类型有自己的名字和字段，而某些时候，这些字段必然会解析到具体数据。这就是标量类型的来源：他们表示对应GraphQL查询的叶子节点。

下列查询中，`name`和`appearsIn`将解析到标量类型：

```graphql
# { "graphiql": true }
{
  hero {
    name
    appearsIn
  }
}
```

我们知道这些字段没有任何次级字段 —— 因为让他们是查询的叶子节点。

GraphQL自带一组默认标量类型：

- `Int`：有符号32位整数。
- `Float`：有符号上精度浮点值。
- `String`：UTF‐8字符序列。
- `Boolean`：`true`或者`false`。
- `ID`：ID标量类型表示一个唯一标识符，通常作为键以重获取缓存中的对象。ID类型使用和String一样的方式序列化；然而将其定义为ID意味着并不需要人类可读型。

大部分的GraphQL服务实现中，都有自定义标量类型的方式。例如，我们可以定义一个`Date`类型：

```graphql
scalar Date
```

然后就取决于我们的实现来定义如何将其序列化、反序列化和验证。例如，你可以指定`Date`类型应该总是被序列化成整型时间戳，而客户端应该知道去要求任何date字段都是这个格式。

### Enumeration types/枚举类型

也称作_枚举/enum_，枚举类型是一种特殊的标量，它限制在一个特殊的可选值集合内。这让你能够：

1. 验证任何参数是这个类型可选值的的某一个
2. 与类型系统沟通，一个字段总是一个有限值集合的其中一个值。

下面是一个用GraphQL schema语言表示的enum定义：

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

这表示无论我们在schema的哪处使用了`Episode`，都可以肯定它返回的是`NEWHOPE`、`EMPIRE`和`JEDI`之一。

注意，各种语言实现的GraphQL服务会有其独特的枚举处理方式。对于将枚举作为一等公民的语言，它的实现就可以利用这个特性；而对于像JavaScript这样没有枚举支持的语言，这些枚举值可能就被内部映射成整数值。当然，这些细节都不会泄漏到客户端，客户端会根据字符串名称来操作枚举值。

### Lists and Non-Null/列表和非空

对象类型，标量以及枚举是GraphQL中你唯一可以定义的类型种类。但是当你在schema的其他部分使用这些类型时，或者在你的查询变量声明处使用时，你可以给它们应用额外的_类型修改器_来影响这些值的验证。我们先来看一个例子：

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

此处我们使用了一个`String`类型，并通过在类型名后面添加一个感叹号`!`将其标注为_非空_。这表示我们的服务器对于这个字段，总是会返回一个非空值，如果它结果得到了一个空值，那么事实上将会触发一个GraphQL执行错误，以让客户端知道发生了错误。

非空类型修改器也可以用于定义字段上的参数，如果这个参数上传递了一个空值（不管通过GraphQL string还是变量），那么会导致服务器返回一个验证错误。

```graphql
# { "graphiql": true, "variables": { "id": null } }
query DroidById($id: ID!) {
  droid(id: $id) {
    name
  }
}
```

列表的运作方式也类似：我们也可以使用一个类型修改器来标记一个类型为`List`，表示这个字段会返回这个类型的数组。在GraphQL schema语言中，我们通过将类型包在方括号（`[` 和 `]`）中的方式来标记列表。列表对于参数也是一样的运作方式，验证的步骤会要求对应值为数组。

非空和列表修饰符可以组合使用。例如你可以要求一个非空字符串的数组：

```graphql
myField: [String!]
```

这表示_数组本身_可以为空，但是其不能有任何空值成员。用JSON举例如下：

```js
myField: null // 有效
myField: [] // 有效
myField: ['a', 'b'] // 有效
myField: ['a', null, 'b'] // 错误
```

然后，我们来定义一个不可为空的字符串数组：

```graphql
myField: [String]!
```

这表示数组本身不能为空，但是其可以包含空值成员:

```js
myField: null // 错误
myField: [] // 有效
myField: ['a', 'b'] // 有效
myField: ['a', null, 'b'] // 有效
```

你可以根据需求嵌套任意层非空和列表修改器。

### Interfaces/接口

跟许多类型系统一样，GraphQL支持接口。一个_接口_是一个抽象类型，它包含某些字段，而对象类型必须包含这些字段，才能算实现了这个接口。

例如，你可以用一个`Character`接口用以表示《星球大战》三部曲中的任何角色：

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

这意味着任何_实现_`Character`的类型都要具有这些字段，并有对应参数和返回类型。

例如，这里有一些可能实现了`Character`的类型：

```graphql
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

可见这两个类型都具备`Character`接口的所有字段，但也引入了其他的字段`totalCredits`、`starships` 和 `primaryFunction`，这都属于特定的类型的角色。

当你要返回一个对象或者一组对象，特别是一组不同的类型时，接口就显得特别有用。

注意下面例子的查询会产生错误：

```graphql
# { "graphiql": true, "variables": { "ep": "JEDI" } }
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    primaryFunction
  }
}
```

`hero`字段返回`Character`类型，取决于`episode`参数，他可能是`Human`或者`Droid`类型。上面的查询中，你只能查询`Character`接口中存在的字段，而其中并不包含`primaryFunction`。

如果要查询一个只存在于特定对象类型上的字段，你需要使用内联片段：

```graphql
# { "graphiql": true, "variables": { "ep": "JEDI" } }
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
  }
}
```

你可以在查询指南的[内联片段](/learn/queries/#inline-fragments)章节了解更多相关信息。

### Union types/联合类型

联合类型十分接近接口，但是它并不指定类型之间的任何共同字段。

```graphql
union SearchResult = Human | Droid | Starship
```

在我们的schema中，任何返回一个`SearchResult`类型的地方，都可能得到一个`Human`、`Droid`或者`Starship`。注意，联合类型的成员需要是具体对象类型；你不能使用接口或者其他联合类型来创造一个联合类型。

这时候，如果你需要查询一个返回`SearchResult`联合类型的字段，那么你得使用条件片段才能查询任意字段。

```graphql
# { "graphiql": true}
{
  search(text: "an") {
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```

### Input types/输入类型

目前为止，我们只讨论过传递例如枚举和字符串等标量值作为参数给字段，但是你也能很容易地传递复杂对象。这在mutation/变更中特别有用，因为有时候你需要传递一整个对象作为新建对象。在GraphQL schema语言中，输入对象看上去和常规对象一模一样，除了关键字是`input`而不是`type`：

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
}
```

你可以像这样在mutation/变更中使用输入对象类型：

```graphql
# { "graphiql": true, "variables": { "ep": "JEDI", "review": { "stars": 5, "commentary": "This is a great movie!" } } }
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

输入对象类型上的字段他们自己可以指代输入对象类型，但是你不能在你的schema混淆输入和输出类型。输入对象类型的字段当然也不能拥有参数。
