---
title: 全局对象识别
layout: docs
category: 最佳实践
permalink: /learn/global-object-identification/
next: /learn/caching/
---

> 一致的对象访问实现了简单的缓存和对象查找

为了提供给 GraphQL 客户端选项以优雅地处理缓存和数据重新获取，GraphQL 服务端需要以标准化的方式公开对象标识符。

为此客户端需要通过以 ID 请求对象的标准机制进行查询。然后在响应中，schema 将需要提供一种提供这些 ID 的标准方式。

因为除了 ID 之外，对对象知之甚少，所以我们称它们为对象“节点”。这是一个查询节点的示例：

```graphql
{
  node(id: "4") {
    id
    ... on User {
      name
    }
  }
```

- GraphQL schema 的格式允许通过根查询对象上的 `node` 字段获取任何对象。返回的对象符合 “Node” [接口](/learn/schema/#interfaces)。
- 可以安全地从响应中提取出 `id` 字段，并可以通过缓存和重新获取将其存储以供重用。
- 客户端可以使用接口片段来提取特定于类型的、符合节点接口的其他信息。在本示例中为 “User”。

Node 接口如下：

```graphql
# 具有全局唯一 ID 的对象
interface Node {
  # 对象的 ID
  id: ID!
}
```

User 通过以下方式符合接口：

```graphql
type User implements Node {
  id: ID!
  # 全名
  name: String!
}
```

# 规范

下面的所有内容以更加正式的要求描述了围绕对象标识的规范，以确保在服务端实现之间的一致性。
这些规范是基于服务端如何与 [Relay][relay] API 客户端兼容来写的，但是对任何客户端都有用。

# 保留类型

与此规范兼容的 GraphQL 服务端必须保留某些类型和类型名称，以支持一致的对象标识模型。特别地，此规范为以下类型创建了准则：

 - 一个名为 `Node` 的接口。
 - 根查询类型上的 `node` 字段。

# Node 接口

服务端必须提供一个名为 `Node` 的接口。该接口必须有且仅有一个名为 `id` 的字段，该字段返回非空的 `ID`。

这个 `id` 应当是该对象的全局唯一标识符，并且只要给出这个 `id`，服务端就应该能够重新获取该对象。

## 内省

正确实现上述接口的服务端将接受如下的内省查询，并返回提供的响应：

```graphql
{
  __type(name: "Node") {
    name
    kind
    fields {
      name
      type {
        kind
        ofType {
          name
          kind
        }
      }
    }
  }
}
```

返回

```json
{
  "__type": {
    "name": "Node",
    "kind": "INTERFACE",
    "fields": [
      {
        "name": "id",
        "type": {
          "kind": "NON_NULL",
          "ofType": {
            "name": "ID",
            "kind": "SCALAR"
          }
        }
      }
    ]
  }
}
```

# Node 根字段

服务端必须提供一个名为 `node`，且返回 `Node` 接口的根字段。该根字段必须有且仅有一个参数，即名为 `id` 的非空ID。

如果一个查询返回的对象实现了 `Node`，那么当服务端在 `Node` 的 `id` 字段中返回的值作为 `id` 参数传递给 `node` 的根字段时，该根字段应该重新获取相同的对象。

服务端必须尽最大努力来获取此数据，但并非总能成功。例如，服务端可能会返回一个带有有效 `id` 的 `User`，但是当发出使用 `node` 根字段重新获取该用户的请求时，该用户的数据库可能不可用，或者该用户可能已删除了他的
帐户。在这种情况下，查询该字段的结果应为 `null`。

## 内省

正确实现上述需求的服务端将接受如下的内省查询，并返回包含所提供响应的响应：

```graphql
{
  __schema {
    queryType {
      fields {
        name
        type {
          name
          kind
        }
        args {
          name
          type {
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
}
```

返回

```json
{
  "__schema": {
    "queryType": {
      "fields": [
        // 该数组可能还有其他条目
        {
          "name": "node",
          "type": {
            "name": "Node",
            "kind": "INTERFACE"
          },
          "args": [
            {
              "name": "id",
              "type": {
                "kind": "NON_NULL",
                "ofType": {
                  "name": "ID",
                  "kind": "SCALAR"
                }
              }
            }
          ]
        }
      ]
    }
  }
}
```

# 字段稳定性

如果一个查询中出现两个对象，并且都使用相同的ID来实现 `Node`，则这两个对象必须相等。

出于此定义的目的，对象相等性定义如下：
 
 - 如果在两个对象上都查询了一个字段，则在第一个对象上查询该字段的结果必须等于在第二个对象上查询该字段的结果。
   - 如果该字段返回一个标量，则相等性定义为该标量的相等性。
   - 如果该字段返回一个枚举，则相等性定义为两个字段都返回相同的枚举值。
   - 如果该字段返回一个对象，则按照上述方法递归定义相等性。

例如：

```graphql
{
  fourNode: node(id: "4") {
    id
    ... on User {
      name
      userWithIdOneGreater {
        id
        name
      }
    }
  }
  fiveNode: node(id: "5") {
    id
    ... on User {
      name
      userWithIdOneLess {
        id
        name
      }
    }
  }
}
```

可能会返回：

```json
{
  "fourNode": {
    "id": "4",
    "name": "Mark Zuckerberg",
    "userWithIdOneGreater": {
      "id": "5",
      "name": "Chris Hughes"
    }
  },
  "fiveNode": {
    "id": "5",
    "name": "Chris Hughes",
    "userWithIdOneLess": {
      "id": "4",
      "name": "Mark Zuckerberg",
    }
  }
}
```

由于 `fourNode.id` 与 `fiveNode.userWithIdOneLess.id` 相同，我们可以通过上述条件保证 `fourNode.name` 必须与 `fiveNode.userWithIdOneLess.name` 相同，并且确实如此。

# 复数识别根字段

想象一下一个名为 `username` 的根字段，该根字段使用用户的用户名为参数并返回对应的用户：

```graphql
{
  username(username: "zuck") {
    id
  }
}
```

可能会返回：

```json
{
  "username": {
    "id": "4",
  }
}
```

显然，我们可以将响应中的对象（ID 为 4 的用户）与请求链接起来，以用户名 “zuck” 识别对象。现在想象一下一个名为 `usernames` 的根字段，它包含一个用户名列表并返回一个对象列表：

```graphql
{
  usernames(usernames: ["zuck", "moskov"]) {
    id
  }
}
```

可能会返回：

```json
{
  "usernames": [
    {
      "id": "4",
    },
    {
      "id": "6"
    }
  ]
}
```

为了使客户端能够将用户名链接到响应，它需要知道响应中的数组将与作为参数传递的数组大小相同，并且响应中的顺序将与参数中的顺序匹配。我们称这些为**复数识别根字段**，其要求如下所述。

## 字段

符合此规范的服务端可能会公开接受输入参数列表的根字段，并返回响应列表。为了使符合规范的客户端使用这些字段，这些字段必须是**复数识别根字段**，并且必须满足以下要求。

注意：符合规范的服务端也可能会公开不是**复数识别根字段**的根字段。符合规范的客户端将无法在其查询中将这些字段用作根字段。

**复数识别根字段**必须有且仅有一个参数。该参数的类型必须是非空的非空值列表。在我们的 `usernames` 示例中，该字段将使用名为 `usernames` 的单一参数，其类型（使用我们的类型系统速记）将为 `[String!]!`。

**复数识别根字段**的返回类型必须是列表，或者包含一个列表的非空包装器。该列表必须包装 `Node` 接口，一个实现 `Node` 接口的对象或是包含这些类型的非空包装器。

每当使用**复数识别根字段**时，响应中列表的长度必须与参数中列表的长度相同。响应中的每个项目都必须与输入中的项目相对应。
更正式地来说，如果传递给根字段一个输入列表 `Lin` 使得输出值为 `Lout`，那么对于任意置换 `P`，传递根字段 `P(Lin)` 必须使得输出值为 `P(Lout)`。

因此，建议服务端不要将为响应类型添加非空包装器，因为如果无法为输入中的给定条目获取对象，它仍然必须在输出中为该输入条目提供一个值；对这种情况来说 `null` 是一个有用的值。

[relay]: https://facebook.github.io/relay/