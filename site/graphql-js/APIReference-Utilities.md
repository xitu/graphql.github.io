---
title: graphql/utilities
layout: ../_core/GraphQLJSLayout
category: API 参考
permalink: /graphql-js/utilities/
sublinks: astFromValue,buildASTSchema,buildClientSchema,buildSchema,introspectionQuery,isValidJSValue,isValidLiteralValue,printIntrospectionSchema,printSchema,typeFromAST,TypeInfo
next: /graphql-js/validation/
---

`graphql/utilities` 模块包含用于 GraphQL 语言和类型对象的常用计算。你可以从 `graphql/utilities` 模块或是 `graphql` 根模块引入。如下：

```js
import { introspectionQuery } from 'graphql'; // ES6
var { introspectionQuery } = require('graphql'); // CommonJS
```

## 概览

**内省（Introspection）**

<ul class="apiIndex">
  <li>
    <a href="#introspectionquery">
      <pre>var introspectionQuery</pre>
      GraphQL 内省查询，包含足够的信息以重现类型系统。
    </a>
  </li>
  <li>
    <a href="#buildclientschema">
      <pre>function buildClientSchema</pre>
      通过使用 `introspectionQuery` 查询 schema 的结果，生成客户端 schema。
    </a>
  </li>
</ul>

**Schema Language**

<ul class="apiIndex">
  <li>
    <a href="#buildschema">
      <pre>function buildSchema</pre>
      基于 GraphQL schema language 构建一个 Schema 对象。
    </a>
  </li>
  <li>
    <a href="#printschema">
      <pre>function printSchema</pre>
      使用标准格式打印 schema。
    </a>
  </li>
  <li>
    <a href="#printintrospectionschema">
      <pre>function printIntrospectionSchema</pre>
      使用标准格式打印 schema 的内省特性。
    </a>
  </li>
  <li>
    <a href="#buildastschema">
      <pre>function buildASTSchema</pre>
      基于分析后的 AST Schema 构建 schema。
    </a>
  </li>
  <li>
    <a href="#typefromast">
      <pre>function typeFromAST</pre>
      在 GraphQLSchema 的 AST 中查找一个类型引用。
    </a>
  </li>
  <li>
    <a href="#astfromvalue">
      <pre>function astFromValue</pre>
      基于一个 JavaScript 值生成一个 GraphQL Input Value AST。
    </a>
  </li>
</ul>

**Visitors**

<ul class="apiIndex">
  <li>
    <a href="#typeinfo">
      <pre>class TypeInfo</pre>
      在 visitor 遍历 AST 时追踪类型和字段定义。
    </a>
  </li>
</ul>

**值验证**

<ul class="apiIndex">
  <li>
    <a href="#isvalidjsvalue">
      <pre>function isValidJSValue</pre>
      判断一个 JavaScript 值是否是有效的 GraphQL 类型的值。
    </a>
  </li>
  <li>
    <a href="#isvalidliteralvalue">
      <pre>function isValidLiteralValue</pre>
      判断一个 AST 中的字面量值是否是有效的 GraphQL 类型的值。
    </a>
  </li>
</ul>

## 内省（Introspection）

### introspectionQuery

```js
var introspectionQuery: string
```

GraphQL 内省查询，用于查询服务器的内省系统，得到足够的信息以重现服务器类型系统。

### buildClientSchema

```js
function buildClientSchema(
  introspection: IntrospectionQuery
): GraphQLSchema
```

构建客户端工具用的 GraphQLSchema。

假设客户端有运行内省查询的结果，创建并返回了一个 GraphQLSchema 实例，这个实例可以用于所有的 GraphQL.js 工具，但不能用于执行查询，因为内省并不代表有“解析器”、“分析”或者“序列化”函数，或者其他服务器内部机制。

## Schema 表示

### buildSchema

```js
function buildSchema(source: string | Source): GraphQLSchema {
```

基于 GraphQL schema language 创建一个 GraphQLSchema 对象。schema 将会使用默认解析器。关于 GraphQL schema language 的更多细节，请查看 [schema language 文档](/learn/schema/) 或者 [schema language 速查表](https://wehavefaces.net/graphql-shorthand-notation-cheatsheet-17cd715861b6#.9oztv0a7n)。

### printSchema

```js
function printSchema(schema: GraphQLSchema): string {
```

使用 Schema Language 格式打印给定的 schema。

### printIntrospectionSchema

```js
function printIntrospectionSchema(schema: GraphQLSchema): string {
```

使用 Schema Language 格式打印内建的内省 schema。

### buildASTSchema

```js
function buildASTSchema(
  ast: SchemaDocument,
  queryTypeName: string,
  mutationTypeName: ?string
): GraphQLSchema
```

这个函数需要一个 schema 文档的 ast（可通过 `graphql/language/schema` 的 `parseSchemaIntoAST` 生成）构建一个 GraphQLSchema 实例，这个实例可以用于所有的 GraphQL.js 工具，但不能用于执行查询，因为内省并不代表有“解析器”、“分析”或者“序列化”函数，或者其他服务器内部机制。

### typeFromAST

```js
function typeFromAST(
  schema: GraphQLSchema,
  inputTypeAST: Type
): ?GraphQLType
```

给定一个出现在 GraphQL AST 和 Schema 中的类型名称，返回其在 schema 中对应的 GraphQLType。

### astFromValue

```js
function astFromValue(
  value: any,
  type?: ?GraphQLType
): ?Value
```

基于一个 JavaScript 值生成一个 GraphQL Input Value AST。

可选参数，一个 GraphQL 类型，用于消除类型原生值之间的歧义。

## Visitors

### TypeInfo

```js
class TypeInfo {
  constructor(schema: GraphQLSchema)
  getType(): ?GraphQLOutputType {
  getParentType(): ?GraphQLCompositeType {
  getInputType(): ?GraphQLInputType {
  getFieldDef(): ?GraphQLFieldDefinition {
  getDirective(): ?GraphQLDirective {
  getArgument(): ?GraphQLArgument {
}
```

TypeInfo 是一个工具类，在 GraphQL 文档 AST 的递归分析中的任何位置上，调用 `enter(node)` 和 `leave(node)` 的时候，可以追踪指定 GraphQL schema 中当前字段和类型定义。

## 值验证

### isValidJSValue

```js
function isValidJSValue(value: any, type: GraphQLInputType): string[]
```

给定一个 JavaScript 值和 GraphQL 类型，判断这个值是否能被这个类型接受。这个功能在验证运行时查询参数值的时候特别有用。

### isValidLiteralValue

```js
function isValidLiteralValue(
  type: GraphQLInputType,
  valueAST: Value
): string[]
```

验证器的工具可以判断 AST 字面量值是否是一个给定输入类型的有效值。

注意，这个功能只验证字面量值，并假设变量值是正确的类型。
