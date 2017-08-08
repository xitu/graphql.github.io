---
title: graphql/types
layout: ../_core/GraphQLJSLayout
category: API 参考
permalink: /graphql-js/type/
sublinks: getNamedType,getNullableType,GraphQLBoolean,GraphQLEnumType,GraphQLFloat,GraphQLID,GraphQLInputObjectType,GraphQLInt,GraphQLInterfaceType,GraphQLList,GraphQLNonNull,GraphQLObjectType,GraphQLScalarType,GraphQLSchema,GraphQLString,GraphQLUnionType,isAbstractType,isCompositeType,isInputType,isLeafType,isOutputType
next: /graphql-js/utilities/
---

`graphql/type` 模块的职责为定义 GraphQL 的类型和 schema。你可以从 `graphql/type` 模块或是根模块 `graphql` 引入。例如：

```js
import { GraphQLSchema } from 'graphql'; // ES6
var { GraphQLSchema } = require('graphql'); // CommonJS
```

## 概览

**Schema**

<ul class="apiIndex">
  <li>
    <a href="#graphqlschema">
      <pre>class GraphQLSchema</pre>
      描述一个 GraphQL 服务器的功能。
    </a>
  </li>
</ul>

**定义（Definitions）**

<ul class="apiIndex">
  <li>
    <a href="#graphqlscalartype">
      <pre>class GraphQLScalarType</pre>
      GraphQL 中表示标量的类型。
    </a>
  </li>
  <li>
    <a href="#graphqlobjecttype">
      <pre>class GraphQLObjectType</pre>
      GraphQL 中包含字段的对象类型。
    </a>
  </li>
  <li>
    <a href="#graphqlinterfacetype">
      <pre>class GraphQLInterfaceType</pre>
      GraphQL 中的接口类型，定义了实现该接口需要持有的字段。
    </a>
  </li>
  <li>
    <a href="#graphqluniontype">
      <pre>class GraphQLUnionType</pre>
      GraphQL 中的联合类型，定义一系列有效类型的合集。
    </a>
  </li>
  <li>
    <a href="#graphqlenumtype">
      <pre>class GraphQLEnumType</pre>
      GraphQL 中的枚举类型，定义一系列有效值的合集。
    </a>
  </li>
  <li>
    <a href="#graphqlinputobjecttype">
      <pre>class GraphQLInputObjectType</pre>
      GraphQL 中的输入对象类型，表示一系列结构化的输入参数。
    </a>
  </li>
  <li>
    <a href="#graphqllist">
      <pre>class GraphQLList</pre>
      类型包装器，表示被包装类型的列表。
    </a>
  </li>
  <li>
    <a href="#graphqlnonnull">
      <pre>class GraphQLNonNull</pre>
      类型包装器，表示被包装类型取值非空的版本。
    </a>
  </li>
</ul>

**谓词函数（Predicates）**

<ul class="apiIndex">
  <li>
    <a href="#isinputtype">
      <pre>function isInputType</pre>
      判断某类型是否可以作为字段查询参数和指令的输入类型。
    </a>
  </li>
  <li>
    <a href="#isoutputtype">
      <pre>function isOutputType</pre>
      判断某类型是否可以作为字段查询结果值的类型。
  </li>
  <li>
    <a href="#isleaftype">
      <pre>function isLeafType</pre>
      判断某类型是否可以作为响应结果叶节点值的类型。
    </a>
  </li>
  <li>
    <a href="#iscompositetype">
      <pre>function isCompositeType</pre>
      判断某类型是否可以作为一个选择集的父级上下文。
    </a>
  </li>
  <li>
    <a href="#isabstracttype">
      <pre>function isAbstractType</pre>
      判断某类型是否为对象类型的组合。
    </a>
  </li>
</ul>

**去包装修饰器（Un-modifiers）**

<ul class="apiIndex">
  <li>
    <a href="#getnullabletype">
      <pre>function getNullableType</pre>
      去掉非空包装，返回原先的类型。
    </a>
  </li>
  <li>
    <a href="#getnamedtype">
      <pre>function getNamedType</pre>
      去掉非空和列表包装，返回原先的类型。
    </a>
  </li>
</ul>

**标量（Scalar）类型**

<ul class="apiIndex">
  <li>
    <a href="#graphqlint">
      <pre>var GraphQLInt</pre>
      表示整数的标量类型。
    </a>
  </li>
  <li>
    <a href="#graphqlfloat">
      <pre>var GraphQLFloat</pre>
      表示浮点数的标量类型。
    </a>
  </li>
  <li>
    <a href="#graphqlstring">
      <pre>var GraphQLString</pre>
      表示字符串的标量类型。
    </a>
  </li>
  <li>
    <a href="#graphqlboolean">
      <pre>var GraphQLBoolean</pre>
      表示布尔值的标量类型。
    </a>
  </li>
  <li>
    <a href="#graphqlid">
      <pre>var GraphQLID</pre>
      表示 ID 的标量类型。
    </a>
  </li>
</ul>

## Schema

### GraphQLSchema

```js
class GraphQLSchema {
  constructor(config: GraphQLSchemaConfig)
}

type GraphQLSchemaConfig = {
  query: GraphQLObjectType;
  mutation?: ?GraphQLObjectType;
}
```

使用指定的 query 及 mutation（可选）的根类型来创建 Schema。生成的 Schema 可用于之后的验证器和执行器。

#### 示例

```js
var MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType
  mutation: MyAppMutationRootType
});
```

## 定义（Definitions）

### GraphQLScalarType

```js
class GraphQLScalarType<InternalType> {
  constructor(config: GraphQLScalarTypeConfig<InternalType>)
}

type GraphQLScalarTypeConfig<InternalType> = {
  name: string;
  description?: ?string;
  serialize: (value: mixed) => ?InternalType;
  parseValue?: (value: mixed) => ?InternalType;
  parseLiteral?: (valueAST: Value) => ?InternalType;
}
```

所有请求的叶节点值和输入值都必须是标量（或枚举）类型。构建标量类型 `GraphQLScalarType` 时，需要指定 `name` 以及一系列用于确保值的有效性的序列化函数。

#### 示例

```js
var OddType = new GraphQLScalarType({
  name: 'Odd',
  serialize: oddValue,
  parseValue: oddValue,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return oddValue(parseInt(ast.value, 10));
    }
    return null;
  }
});

function oddValue(value) {
  return value % 2 === 1 ? value : null;
}
```

### GraphQLObjectType

```js
class GraphQLObjectType {
  constructor(config: GraphQLObjectTypeConfig)
}

type GraphQLObjectTypeConfig = {
  name: string;
  interfaces?: GraphQLInterfacesThunk | Array<GraphQLInterfaceType>;
  fields: GraphQLFieldConfigMapThunk | GraphQLFieldConfigMap;
  isTypeOf?: (value: any, info?: GraphQLResolveInfo) => boolean;
  description?: ?string
}

type GraphQLInterfacesThunk = () => Array<GraphQLInterfaceType>;

type GraphQLFieldConfigMapThunk = () => GraphQLFieldConfigMap;

type GraphQLFieldResolveFn = (
  source?: any,
  args?: {[argName: string]: any},
  context?: any,
  info?: GraphQLResolveInfo
) => any

type GraphQLResolveInfo = {
  fieldName: string,
  fieldNodes: Array<Field>,
  returnType: GraphQLOutputType,
  parentType: GraphQLCompositeType,
  schema: GraphQLSchema,
  fragments: { [fragmentName: string]: FragmentDefinition },
  rootValue: any,
  operation: OperationDefinition,
  variableValues: { [variableName: string]: any },
}

type GraphQLFieldConfig = {
  type: GraphQLOutputType;
  args?: GraphQLFieldConfigArgumentMap;
  resolve?: GraphQLFieldResolveFn;
  deprecationReason?: string;
  description?: ?string;
}

type GraphQLFieldConfigArgumentMap = {
  [argName: string]: GraphQLArgumentConfig;
};

type GraphQLArgumentConfig = {
  type: GraphQLInputType;
  defaultValue?: any;
  description?: ?string;
}

type GraphQLFieldConfigMap = {
  [fieldName: string]: GraphQLFieldConfig;
};
```

几乎所有你要去定义的 GraphQL 类型都会是 Object 类型。Object 类型有自己的名字 `name`，但最重要的是它描述了它有哪些字段。

当两个类型需要相互指代，或是某类型的某一字段类型为其自身，你可以使用函数表达式（也可称为闭包或是 thunk）来实现字段类型的延后求值。

#### 示例

```js
var AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    street: { type: GraphQLString },
    number: { type: GraphQLInt },
    formatted: {
      type: GraphQLString,
      resolve(obj) {
        return obj.number + ' ' + obj.street
      }
    }
  }
});

var PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    name: { type: GraphQLString },
    bestFriend: { type: PersonType },
  })
});
```

### GraphQLInterfaceType

```js
class GraphQLInterfaceType {
  constructor(config: GraphQLInterfaceTypeConfig)
}

type GraphQLInterfaceTypeConfig = {
  name: string,
  fields: GraphQLFieldConfigMapThunk | GraphQLFieldConfigMap,
  resolveType?: (value: any, info?: GraphQLResolveInfo) => ?GraphQLObjectType,
  description?: ?string
};
```

当一个字段可能返回多种不同类型时，可使用接口类型 `GraphQLInterfaceType`，来描述所有可能类型必须有的共同字段，也可指定 `resolveType` 函数来决定该字段实际被解析时为何种类型。

#### 示例

```js
var EntityType = new GraphQLInterfaceType({
  name: 'Entity',
  fields: {
    name: { type: GraphQLString }
  }
});
```

### GraphQLUnionType

```js
class GraphQLUnionType {
  constructor(config: GraphQLUnionTypeConfig)
}

type GraphQLUnionTypeConfig = {
  name: string,
  types: GraphQLObjectsThunk | Array<GraphQLObjectType>,
  resolveType?: (value: any, info?: GraphQLResolveInfo) => ?GraphQLObjectType;
  description?: ?string;
};

type GraphQLObjectsThunk = () => Array<GraphQLObjectType>;
```

当一个字段可以返回多种不同类型时，可使用联合类型 `GraphQLUnionType` 描述所有可能类型，也可指定 `resolveType` 函数来决定该字段实际被解析时为何种类型。

### 示例

```js
var PetType = new GraphQLUnionType({
  name: 'Pet',
  types: [ DogType, CatType ],
  resolveType(value) {
    if (value instanceof Dog) {
      return DogType;
    }
    if (value instanceof Cat) {
      return CatType;
    }
  }
});
```

### GraphQLEnumType

```js
class GraphQLEnumType {
  constructor(config: GraphQLEnumTypeConfig)
}

type GraphQLEnumTypeConfig = {
  name: string;
  values: GraphQLEnumValueConfigMap;
  description?: ?string;
}

type GraphQLEnumValueConfigMap = {
  [valueName: string]: GraphQLEnumValueConfig;
};

type GraphQLEnumValueConfig = {
  value?: any;
  deprecationReason?: string;
  description?: ?string;
}

type GraphQLEnumValueDefinition = {
  name: string;
  value?: any;
  deprecationReason?: string;
  description?: ?string;
}
```

一些请求的叶节点值和输入值为枚举类型 `GraphQLEnumType`。GraphQL 会将枚举值序列化为字符串，但在内部使用时，枚举值可以用任何类型来表示，一般用整型来表示。

备注：如果在定义时没有指定 `value`，在内部使用时会用枚举类型的 `name` 作为其值。

#### 示例

```js
var RGBType = new GraphQLEnumType({
  name: 'RGB',
  values: {
    RED: { value: 0 },
    GREEN: { value: 1 },
    BLUE: { value: 2 }
  }
});
```

### GraphQLInputObjectType

```js
class GraphQLInputObjectType {
  constructor(config: GraphQLInputObjectTypeConfig)
}

type GraphQLInputObjectConfig = {
  name: string;
  fields: GraphQLInputObjectConfigFieldMapThunk | GraphQLInputObjectConfigFieldMap;
  description?: ?string;
}

type GraphQLInputObjectConfigFieldMapThunk = () => GraphQLInputObjectConfigFieldMap;

type GraphQLInputObjectFieldConfig = {
  type: GraphQLInputType;
  defaultValue?: any;
  description?: ?string;
}

type GraphQLInputObjectConfigFieldMap = {
  [fieldName: string]: GraphQLInputObjectFieldConfig;
};

type GraphQLInputObjectField = {
  name: string;
  type: GraphQLInputType;
  defaultValue?: any;
  description?: ?string;
}

type GraphQLInputObjectFieldMap = {
  [fieldName: string]: GraphQLInputObjectField;
};
```

一个输入对象类型定义了一组可以作为某字段查询参数的字段。

使用 `NonNull` 确保查询一定会有返回值。

#### 示例

```js
var GeoPoint = new GraphQLInputObjectType({
  name: 'GeoPoint',
  fields: {
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
    alt: { type: GraphQLFloat, defaultValue: 0 },
  }
});
```

### GraphQLList

```js
class GraphQLList {
  constructor(type: GraphQLType)
}
```

列表类型是一种类型标记，用来包装另一个类型。在定义一个对象类型的字段时，经常出现。

#### 示例

```js
var PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    parents: { type: new GraphQLList(Person) },
    children: { type: new GraphQLList(Person) },
  })
});
```

### GraphQLNonNull

```js
class GraphQLNonNull {
  constructor(type: GraphQLType)
}
```

非空（non-null）类型是一种类型标记，用来包装另一个类型。强制其取值不能为 null，在某次请求时如果出现 null 值便会抛出错误。用于标记你确信肯定非空的字段时很有用，例如通常来说，数据库里某条数据的 id 字段都不会为空。

#### 示例

```js
var RowType = new GraphQLObjectType({
  name: 'Row',
  fields: () => ({
    id: { type: new GraphQLNonNull(String) },
  })
});
```

## 谓词函数（Predicates）

### isInputType

```js
function isInputType(type: ?GraphQLType): boolean
```

判断某类型是否可以作为字段查询参数和指令的输入类型。

### isOutputType

```js
function isOutputType(type: ?GraphQLType): boolean
```

判断某类型是否可以作为字段查询结果值的类型。

### isLeafType

```js
function isLeafType(type: ?GraphQLType): boolean
```

判断某类型是否可以作为响应结果叶节点值的类型。

### isCompositeType

```js
function isCompositeType(type: ?GraphQLType): boolean
```

判断某类型是否可以作为一个选择集的父级上下文。

### isAbstractType

```js
function isAbstractType(type: ?GraphQLType): boolean
```

判断某类型是否为对象类型的组合。

## 去包装修饰器（Un-modifiers）

### getNullableType

```js
function getNullableType(type: ?GraphQLType): ?GraphQLNullableType
```

若该类型是非空类型的包装结果，该函数会去掉包装，返回原先的类型。

### getNamedType

```js
function getNamedType(type: ?GraphQLType): ?GraphQLNamedType
```

若该类型是非空类型或列表类型的包装结果，该函数会去掉包装，返回原先的类型。

## Scalars

### GraphQLInt

```js
var GraphQLInt: GraphQLScalarType;
```

一个代表整型数的 `GraphQLScalarType`。

### GraphQLFloat

```js
var GraphQLFloat: GraphQLScalarType;
```

一个代表浮点数的 `GraphQLScalarType`。

### GraphQLString

```js
var GraphQLString: GraphQLScalarType;
```

一个代表字符串的 `GraphQLScalarType`。

### GraphQLBoolean

```js
var GraphQLBoolean: GraphQLScalarType;
```

一个代表布尔值的 `GraphQLScalarType`。

### GraphQLID

```js
var GraphQLID: GraphQLScalarType;
```

一个代表 ID 值的 `GraphQLScalarType`。
