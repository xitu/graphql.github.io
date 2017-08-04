---
title: graphql
layout: ../_core/GraphQLJSLayout
category: API Reference
permalink: /graphql-js/graphql/
sublinks: graphql
next: /graphql-js/error/
---
`graphql` 模块导出了 GraphQL 的一个核心子集，其主要功能是创建 GraphQL 类型的系统和服务。

```js
import { graphql } from 'graphql'; // ES6
var { graphql } = require('graphql'); // CommonJS
```

## 概述

*入口点（Entry Point）*

<ul class="apiIndex">
  <li>
    <a href="#graphql">
      <pre>function graphql</pre>
      根据一个模式（schema）lex（译者注：这里主要指使用 GraphQL 的 lex 方法生成一个 Lexer，后面的 lex 同理）、解析、验证及执行一个 GraphQL 请求。
    </a>
  </li>
</ul>

*模式（Schema）*

<ul class="apiIndex">
  <li>
    <a href="../type/#graphqlschema">
      <pre>class GraphQLSchema</pre>
      一个 GraphQL 服务的功能配置描述
    </a>
  </li>
</ul>

*类型定义*

<ul class="apiIndex">
  <li>
    <a href="../type/#graphqlscalartype">
      <pre>class GraphQLScalarType</pre>
      GraphQL 里的标量类型。（译者注：表示最细粒度数据结构的数据类型，可以和 JavaScript 的原始类型对应）
    </a>
  </li>
  <li>
    <a href="../type/#graphqlobjecttype">
      <pre>class GraphQLObjectType</pre>
      GraphQL 里的自定义对象类型，包含一个 fields 字段。(译者注：fields 字段可以描述出一个完整的数据结构)
    </a>
  </li>
  <li>
    <a href="../type/#graphqlinterfacetype">
      <pre>class GraphQLInterfaceType</pre>
      GraphQL 里的接口类型，定义多个类型中通用的字段。
    </a>
  </li>
  <li>
    <a href="../type/#graphqluniontype">
      <pre>class GraphQLUnionType</pre>
      GraphQL 里的联合类型，定义了（某个字段能支持的所有返回类型的）一个实现列表。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlenumtype">
      <pre>class GraphQLEnumType</pre>
      GraphQL 里的枚举类型，定义了一个有效（可枚举）数据类型的列表。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlinputobjecttype">
      <pre>class GraphQLInputObjectType</pre>
      GraphQL 里的输入对象类型，表示一些结构化的输入（译者注：主要为了查询定义的数据类型）。
    </a>
  </li>
  <li>
    <a href="../type/#graphqllist">
      <pre>class GraphQLList</pre>
      这是对其他类型进行封装的类型，表示一个包含那些类型的列表。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlnonnull">
      <pre>class GraphQLNonNull</pre>
      这也是对其他类型进行封装的类型，并强制要求类型值不能为空。
    </a>
  </li>
</ul>

*标量类型*

<ul class="apiIndex">
  <li>
    <a href="../type/#graphqlint">
      <pre>var GraphQLInt</pre>
      表示整数的标量类型。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlfloat">
      <pre>var GraphQLFloat</pre>
      表示浮点数的标量类型。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlstring">
      <pre>var GraphQLString</pre>
      表示字符串的标量类型。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlboolean">
      <pre>var GraphQLBoolean</pre>
      表示布尔值的标量类型。
    </a>
  </li>
  <li>
    <a href="../type/#graphqlid">
      <pre>var GraphQLID</pre>
      表示 ID 值的标量类型。（译者注：这是一个序列化后值唯一的字符串，可以视作对应 ES 2015 新增的 Symbol）
    </a>
  </li>
</ul>

*错误信息*

<ul class="apiIndex">
  <li>
    <a href="../error/#formaterror">
      <pre>function formatError</pre>
      根据返回格式描述的规则格式化一个错误。
    </a>
  </li>
</ul>

## 入口点（Entry Point）

### graphql

```js
graphql(
  schema: GraphQLSchema,
  requestString: string,
  rootValue?: ?any,
  contextValue?: ?any,
  variableValues?: ?{[key: string]: any},
  operationName?: ?string
): Promise<GraphQLResult>
```
`graphql` 方法可以 lex、解析、验证和执行一个 GraphQL 请求。必要的参数是 `schema` 和 `requestString`，可选的参数则包括 `rootValue`（将作为根值传入执行器）、`contextValue`（将传入所有的解析函数）、`variableValues`（将传入执行器，为 `requestString` 中的任意类型变量赋值）以及 `operationName`（在 `requestString` 包含多个顶级操作的情况下，这个参数允许调用函数指定 `requestString` 运行哪个操作）。

## 模式（Schema）

详细介绍请看[类型系统 API 参考](../type#schema)。

## 类型定义

详细介绍请看[类型系统 API 参考](../type#definitions)。

## 标量类型

详细介绍请看[类型系统 API 参考](../type#scalars)。

## 错误信息

详细介绍请看[错误信息 API 参考](../error)
