/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var Site = require('../_core/Site');
var Marked = require('../_core/Marked');

export default ({ page, site }) =>
  <Site section="code" title="Code" page={page}>

    <section>
      <div className="documentationContent">
        <div className="inner-content">
          <h1>Code</h1>
          <Marked>{`

GraphQL 已有多种编程语言支持。下表包含一些流行的服务端框架、客户端库、服务和其他有用的内容。

## 服务端库

除了 GraphQL [JavaScript 参考实现](#javascript)，还有其他服务端库：

- [C# / .NET](#c-net)
- [Clojure](#clojure)
- [Elixir](#elixir)
- [Erlang](#erlang)
- [Go](#go)
- [Groovy](#groovy)
- [Java](#java)
- [JavaScript](#javascript)
- [Kotlin](#kotlin)
- [Perl](#perl)
- [PHP](#php)
- [Python](#python)
- [Ruby](#ruby)
- [Rust](#rust)
- [Scala](#scala)
- [Swift](#swift)

### C# / .NET

#### [graphql-dotnet](https://github.com/graphql-dotnet/graphql-dotnet)：.NET 的 GraphQL 实现

\`\`\`csharp
using System;
using GraphQL;
using GraphQL.Types;

public class Program
{
  public static void Main(string[] args)
  {
    var schema = Schema.For(@"
      type Query {
        hello: String
      }
    ");
    var json = schema.Execute(_ =>
    {
      _.Query = "{ hello }";
      _.Root = new { Hello = "Hello World!" };
    });
    Console.WriteLine(json);
  }
}                   
\`\`\`

  - [graphql-net](https://github.com/ckimes89/graphql-net)：转换 GraphQL 到 IQueryable
  - [Entity GraphQL](https://github.com/lukemurray/EntityGraphQL)：针对 .NET Core 的 GraphQL 库。编译为 IQueryable 以轻松地从现有的数据模型（例如从 Entity Framework 数据模型）中暴露出 schema
  - [DotNetGraphQLQueryGen](https://github.com/lukemurray/DotNetGraphQLQueryGen)：从 GraphQL schema 生成类，以在 dotnet 中进行类型安全的查询的 .NET Core 库
  - [Hot Chocolate](https://github.com/ChilliCream/hotchocolate)：针对 .NET core 和 .NET classic 的 GraphQL 服务器

### Clojure

#### [alumbra](https://github.com/alumbra/alumbra)

一套 Clojure 的 GraphQL 可复用组件，满足 [alumbra.spec](https://github.com/alumbra/alumbra.spec) 规范要求的数据结构。

\`\`\`clojure
(require '[alumbra.core :as alumbra]
         '[claro.data :as data])

(def schema
  "type Person { name: String!, friends: [Person!]! }
   type QueryRoot { person(id: ID!): Person, me: Person! }
   schema { query: QueryRoot }")

(defrecord Person [id]
  data/Resolvable
  (resolve! [_ _]
    {:name    (str "Person #" id)
     :friends (map ->Person  (range (inc id) (+ id 3)))}))

(def QueryRoot
  {:person (map->Person {})
   :me     (map->Person {:id 0})})

(def app
  (alumbra/handler
    {:schema schema
     :query  QueryRoot}))

(defonce my-graphql-server
  (aleph.http/start-server #'app {:port 3000}))
\`\`\`

\`\`\`bash
$ curl -XPOST "http://0:3000" -H'Content-Type: application/json' -d'{
  "query": "{ me { name, friends { name } } }"
}'
{"data":{"me":{"name":"Person #0","friends":[{"name":"Person #1"},{"name":"Person #2"}]}}}
\`\`\`

#### [graphql-clj](https://github.com/tendant/graphql-clj)

一个提供 GraphQL 实现的 Clojure 库。

可以执行一个 \`hello world\` GraphQL 查询的 \`graphql-clj\` 代码如下：

\`\`\`clojure

(def schema "type QueryRoot {
    hello: String
  }")

(defn resolver-fn [type-name field-name]
  (get-in {"QueryRoot" {"hello" (fn [context parent & rest]
                              "Hello world!")}}
          [type-name field-name]))

(require '[graphql-clj.executor :as executor])

(executor/execute nil schema resolver-fn "{ hello }")
\`\`\`

#### [lacinia](https://github.com/walmartlabs/lacinia)

一套 GraphQL 规范的完整实现，致力于维护对规范的外部兼容。

### Elixir

  - [absinthe](https://github.com/absinthe-graphql/absinthe)：Elixir 的 GraphQL 实现。
  - [graphql-elixir](https://github.com/graphql-elixir/graphql)：一个 Facebook GraphQL 的 Elixir 实现。

### Erlang

  - [graphql-erlang](https://github.com/shopgun/graphql-erlang)：Erlang 的 GraphQL 实现。

### Go

  - [graphql-go](https://github.com/graphql-go/graphql)：一个 Go/Golang 的 GraphQL 实现。
  - [graph-gophers/graphql-go](https://github.com/graph-gophers/graphql-go)：一个活跃的 Golang GraphQL 实现。
  - [99designs/gqlgen](https://github.com/99designs/gqlgen)：生成基于 graphql 的服务器的库。
  - [graphql-relay-go](https://github.com/graphql-go/relay)：一个用于帮助构建 graphql-go 服务器的 Go/Golang 库，支持 react-relay 。
  - [machinebox/graphql](https://github.com/machinebox/graphql)：用于 GraphQL 的一个优雅的底层 HTTP 客户端。
  - [samsarahq/thunder](https://github.com/samsarahq/thunder)：可轻松进行 schema 构建、实时查询和批处理的 GraphQL 实现。
  - [appointy/jaal](https://github.com/appointy/jaal)：在 Go 中开发符合规范的 GraphQL 服务器。

### Groovy

#### [gorm-graphql](https://github.com/grails/gorm-graphql/)

**核心库** —— GORM GraphQL 库提供了基于你的 GORM 实体来生成 GraphQL schema 的功能。除了能够将域类映射到 GraphQL schema 之外，核心库还提供了通过 schema 的执行来查询、更新和删除数据的“数据访问者”的默认实现。

**Grails 插件** —— 作为对核心库的补充，GORM GraphQL Grails 插件能够：

- 提供一个通过 HTTP 来接收和响应 GraphQL 请求的控制器。
- 在启动时使用 spring bean 配置生成 schema，以便于扩展。
- 包含一个在开发环境下默认启用的 [GraphiQL](https://github.com/graphql/graphiql) 浏览器。这一浏览器可以在 /graphql/browser 下访问。
- 使用 Grails 提供的数据绑定覆盖默认的数据绑定
- 提供一个 [特质](https://grails.github.io/gorm-graphql/latest/api/org/grails/gorm/graphql/plugin/testing/GraphQLSpec.html) 以使你更容易对 GraphQL 入口端点进行集成测试

更多信息请查看 [文档](https://grails.github.io/gorm-graphql/latest/guide/index.html)。

#### [GQL](https://grooviter.github.io/gql/)

GQL 是一个在 Groovy 中使用 GraphQL 的库。
  
### Java

#### [graphql-java](https://github.com/graphql-java/graphql-java)

一个用于构建 GraphQL API 的 Java 库。

可以执行一个 \`hello world\` GraphQL 查询的 \`graphql-java\` 代码如下：

\`\`\`java
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import graphql.schema.StaticDataFetcher;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;

import static graphql.schema.idl.RuntimeWiring.newRuntimeWiring;

public class HelloWorld {

    public static void main(String[] args) {
        String schema = "type Query{hello: String} schema{query: Query}";

        SchemaParser schemaParser = new SchemaParser();
        TypeDefinitionRegistry typeDefinitionRegistry = schemaParser.parse(schema);

        RuntimeWiring runtimeWiring = new RuntimeWiring()
                .type("Query", builder -> builder.dataFetcher("hello", new StaticDataFetcher("world")))
                .build();

        SchemaGenerator schemaGenerator = new SchemaGenerator();
        GraphQLSchema graphQLSchema = schemaGenerator.makeExecutableSchema(typeDefinitionRegistry, runtimeWiring);

        GraphQL build = GraphQL.newGraphQL(graphQLSchema).build();
        ExecutionResult executionResult = build.execute("{hello}");

        System.out.println(executionResult.getData().toString());
        // Prints: {hello=world}
    }
}
\`\`\`

查看 [graphql-java 文档](https://github.com/graphql-java/graphql-java) 以了解更多信息。

### JavaScript

#### [GraphQL.js](/graphql-js/) ([github](https://github.com/graphql/graphql-js/)) ([npm](https://www.npmjs.com/package/graphql))

GraphQL 规范的参考实现，设计用于在 Node.js 环境中运行。

如果要在命令行中运行一个 \`GraphQL.js\` 的 \`hello world\` 脚本：

\`\`\`bash
npm install graphql
\`\`\`

然后使用 \`node hello.js\` 以运行 \`hello.js\` 中的代码：

\`\`\`js
var { graphql, buildSchema } = require('graphql');

var schema = buildSchema(\`
  type Query {
    hello: String
  }
\`);

var root = { hello: () => 'Hello world!' };

graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});
\`\`\`

#### [express-graphql](/graphql-js/running-an-express-graphql-server/) ([github](https://github.com/graphql/express-graphql)) ([npm](https://www.npmjs.com/package/express-graphql))

基于 Express webserver 服务器的一个 GraphQL API 服务端参考实现，你可以用它结合常规 Express webserver 来运行 GraphQL，也可以作为独立 GraphQL 服务器。

如果要运行 \`express-graphql\` 的 hello world 服务器：

\`\`\`bash
npm install express express-graphql graphql
\`\`\`

然后使用 \`node server.js\` 以运行 \`server.js\` 中的代码：

\`\`\`js
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(\`
  type Query {
    hello: String
  }
\`);

var root = { hello: () => 'Hello world!' };

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
\`\`\`

#### [apollo-server](https://www.apollographql.com/docs/apollo-server/) ([github](https://github.com/apollographql/apollo-server)) ([npm](https://www.npmjs.com/package/apollo-server-express))

来自于 Apollo 的一套 GraphQL server 包，可用于多种 Node.js HTTP 框架（Express，Connect，Hapi，Koa 等）。

如果要运行 \`apollo-server-express\` 的 hello world 服务器：

\`\`\`bash
npm install apollo-server-express express
\`\`\`

然后使用 \`node server.js\` 以运行 \`server.js\` 中的代码：

\`\`\`js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = gql\`
  type Query {
    hello: String
  }
\`;
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);
\`\`\`

Apollo Server 也支持所有的 Node.js HTTP 服务器框架：Express、Connect、HAPI、Koa 和 NestJs。

### Kotlin

  - [graphql-kotlin](https://github.com/ExpediaGroup/graphql-kotlin/)：一组用于在 Kotlin 中运行 GraphQL 服务器的库。

### Perl

  - [graphql-perl](https://github.com/graphql-perl/graphql-perl)：GraphQL 参考实现的 Perl 移植版本
    - [MetaCPAN documentation](https://metacpan.org/pod/GraphQL)
    - [Mojolicious-Plugin-GraphQL](https://github.com/graphql-perl/Mojolicious-Plugin-GraphQL)：将你的 GraphQL 服务连接到 Mojolicious 应用
    - [GraphQL-Plugin-Convert-DBIC](https://github.com/graphql-perl/GraphQL-Plugin-Convert-DBIC)：自动将你的 DBIx::Class schema 连接到 GraphQL
    - [GraphQL-Plugin-Convert-OpenAPI](https://github.com/graphql-perl/GraphQL-Plugin-Convert-OpenAPI)：自动将任何 OpenAPI 服务（本地或远程的 Mojolicious）连接到GraphQL

### PHP

  - [graphql-php](https://github.com/webonyx/graphql-php)：GraphQL 参考实现的 PHP 移植版本。
  - [graphql-relay-php](https://github.com/ivome/graphql-relay-php)：一个用于辅助构建 graphql-php 服务器的库，支持 react-relay。
  - [Railt](https://github.com/railt/railt)：一个 PHP GraphQL 框架。
  - [Lighthouse](https://github.com/nuwave/lighthouse)：一个用于 Laravel 的 GraphQL 服务器
  - [GraphQLBundle](https://github.com/overblog/GraphQLBundle)：一个用于 Symfony 的 GraphQL 服务器
  - [WPGraphQL](https://github.com/wp-graphql/wp-graphql)：一个免费的开源 WordPress 插件，可为任何 WordPress 网站提供可扩展的 GraphQL schema 和 API

#### [API Platform](https://api-platform.com) ([github](https://github.com/api-platform/api-platform))

API Platform 是一个基于 Symfony 构建的功能齐全、灵活且可扩展的 API 框架。
以下的类足以创建与 Relay 兼容的 GraphQL 服务器和支持现代 REST 格式（JSON-LD、JSONAPI...）的超媒体 API：

\`\`\`php
<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * Greet someone!
 *
 * @ApiResource
 * @ORM\Entity
 */
class Greeting
{
    /**
     * @ORM\Id
     * @ORM\Column(type="guid")
     */
    public $id;

    /**
     * @var string Your nice message
     *
     * @ORM\Column
     */
    public $hello;
}
\`\`\`

API Platform 的其他功能还包括数据验证、身份验证、授权、弃用、缓存和 GraphiQL 集成。

#### [GraphQLite](https://graphqlite.thecodingmachine.io) ([github](https://github.com/thecodingmachine/graphqlite))

GraphQLite 是一个为 GraphQL schema 定义提供基于注释的语法的库。
它与框架无关，可用于 Symfony 和 Laravel。

以下的代码声明了一个 “product” 查询和一个 “Product” 类型：

\`\`\`php
class ProductController
{
    /**
     * @Query()
     */
    public function product(string $id): Product
    {
        // Some code that looks for a product and returns it.
    }
}

/**
 * @Type()
 */
class Product
{
    /**
     * @Field()
     */
    public function getName(): string
    {
        return $this->name;
    }
    // ...
}
\`\`\`

GraphQLite 的其他功能包括验证、安全性、错误处理、通过数据加载器模式加载……

#### [Siler](https://siler.leocavalcante.com/graphql/) ([github](https://github.com/leocavalcante/siler))

Siler 是一个具有高级抽象功能，可与 GraphQL 搭配使用的 PHP 库。

如果要运行 Siler 的 hello world 脚本：

\`\`\`graphql
type Query {
  hello: String
}
\`\`\`

\`\`\`php
<?php
declare(strict_types=1);
require_once '/path/to/vendor/autoload.php';

use Siler\Diactoros;
use Siler\Graphql;
use Siler\Http;

$typeDefs = file_get_contents(__DIR__.'/schema.graphql');
$resolvers = [
    'Query' => [
        'hello' => 'world',
    ],
];
$schema = Graphql\schema($typeDefs, $resolvers);

echo "Server running at http://127.0.0.1:8080";
Http\server(Graphql\psr7($schema), function (\Throwable $err) {
    var_dump($err);
    return Diactoros\json([
        'error'   => true,
        'message' => $err->getMessage(),
    ]);
})()->run();
\`\`\`

它还根据 Apollo 的工作原理提供了构建 WebSocket 订阅服务器的功能。

### Swift

  - [Graphiti](https://github.com/GraphQLSwift/Graphiti)：一个 Swift 库，可快速、安全且轻松地构建 GraphQL schema/类型。

### Python

#### [Graphene](http://graphene-python.org/) ([github](https://github.com/graphql-python/graphene))

一个用于构建 GraphQL API 的 Python 库。

如果要运行一个 Graphene hello world 脚本：

\`\`\`bash
pip install graphene
\`\`\`

然后使用 \`python hello.py\` 以运行 \`hello.py\` 中的代码：

\`\`\`python
import graphene

class Query(graphene.ObjectType):
  hello = graphene.String(name=graphene.String(default_value="World"))

  def resolve_hello(self, info, name):
    return 'Hello ' + name

schema = graphene.Schema(query=Query)
result = schema.execute('{ hello }')
print(result.data['hello']) # "Hello World"
\`\`\`

其也有对 [Relay](https://facebook.github.io/relay/)、Django、SQLAlchemy 和 Google App Engine 的良好绑定。

### Ruby

#### [graphql-ruby](https://github.com/rmosolgo/graphql-ruby)

一个用于构建 GraphQL API 的 Ruby 库。

如果要使用 \`graphql-ruby\` 运行一个 hello world 脚本：

\`\`\`bash
gem install graphql
\`\`\`

然后使用 \`ruby hello.rb\` 运行 \`hello.rb\` 中的代码：

\`\`\`ruby
require 'graphql'

class QueryType < GraphQL::Schema::Object
  graphql_name 'Query'
  field :hello do
    type types.String
    resolve -> (obj, args, ctx) { 'Hello world!' }
  end
end

class Schema < GraphQL::Schema
  query QueryType
end

puts Schema.execute('{ hello }').to_json
\`\`\`

其也有对于 Relay 和 Rails 的良好绑定。

#### [Agoo](https://github.com/ohler55/agoo)

一个支持 GraphQL 的高性能 Web 服务器。Agoo 致力于为 GraphQL 提供一个简单易用的 API。

\`\`\`ruby
require 'agoo'

class Query
  def hello
    'hello'
  end
end

class Schema
  attr_reader :query

  def initialize
    @query = Query.new()
  end
end

Agoo::Server.init(6464, 'root', thread_count: 1, graphql: '/graphql')
Agoo::Server.start()
Agoo::GraphQL.schema(Schema.new) {
  Agoo::GraphQL.load(%^type Query { hello: String }^)
}
sleep

# To run this GraphQL example type the following then go to a browser and enter
# a URL of localhost:6464/graphql?query={hello}
#
# ruby hello.rb
\`\`\`

### Rust

 - [graphql-rust/juniper](https://github.com/graphql-rust/juniper)：用于 Rust 的 GraphQL 服务端库

### Scala

#### [Sangria](http://sangria-graphql.org/) ([github](https://github.com/sangria-graphql/sangria))：支持 [Relay](https://facebook.github.io/relay/) 的一个 Scala GraphQL 库。

使用的 \`sangria\` 的一个 GraphQL schema 以及 hello world 查询：

\`\`\`scala
import sangria.schema._
import sangria.execution._
import sangria.macros._

val QueryType = ObjectType("Query", fields[Unit, Unit](
  Field("hello", StringType, resolve = _ ⇒ "Hello world!")
))

val schema = Schema(QueryType)

val query = graphql"{ hello }"

Executor.execute(schema, query) map println
\`\`\`

## GraphQL 客户端

- [C# / .NET](#c-net-1)
- [Clojurescript](#clojurescript-1)
- [Elm](#elm)
- [Flutter](#flutter)
- [Go](#go-1)
- [Java / Android](#java-android)
- [JavaScript](#javascript-1)
- [Julia](#julia)
- [Swift / Objective-C iOS](#swift-objective-c-ios)
- [Python](#python-1)
- [R](#r)

### C# / .NET

  - [GraphQL.Client](https://github.com/graphql-dotnet/graphql-client)：一个用于 .NET 的 GraphQL 客户端。
  - [graphql-net-client](https://github.com/bkniffler/graphql-net-client)：基于 .Net 的 GraphQL 客户端基本样例。
  - [SAHB.GraphQLClient](https://github.com/sahb1239/SAHB.GraphQLClient)：GraphQL 客户端，支持从 C# 的类生成查询。

### Clojurescript

  - [re-graph](https://github.com/oliyh/re-graph/)：一个在 Clojurescript 中实现的 GraphQL 客户端，支持 websockets。

### Elm

  - [dillonkearns/elm-graphql](https://github.com/dillonkearns/elm-graphql)：一个库和命令行代码生成器，用于为 GraphQL 入口端点创建类型安全的 Elm 代码。

### Flutter

  - [graphql](https://github.com/zino-app/graphql-flutter#readme)：一个 Flutter 中的 GraphQL 客户端实现。

### Go

  - [graphql](https://github.com/shurcooL/graphql#readme)：一个使用 Go 编写的 GraphQL 客户端实现。

### Java / Android

  - [Apollo Android](https://github.com/apollographql/apollo-android)：一个用于 Android 的 GraphQL 客户端，强类型、带缓存功能，使用 Java 编写。
  - [Nodes](https://github.com/americanexpress/nodes)：一个 GraphQL JVM 客户端，用于从标准模型定义构建查询。

### JavaScript

  - [Relay](https://facebook.github.io/relay/) ([github](https://github.com/facebook/relay)) ([npm](https://www.npmjs.com/package/react-relay))：Facebook 的框架，用于构建与 GraphQL 后端交流的 React 应用。
  - [Apollo Client](http://apollographql.com/client/) ([github](https://github.com/apollographql/apollo-client))：一个强大的 JavaScript GraphQL 客户端，设计用于与 React、React Native、Angular 2 或者原生 JavaScript 一同工作。
  - [graphql-request](https://github.com/prisma/graphql-request)：一个简单灵活的 JavaScript GraphQL 客户端，可以运行于所有的 JavaScript 环境（浏览器，Node.js 和 React Native）—— 基本上是 \`fetch\` 的轻度封装。
  - [Lokka](https://github.com/kadirahq/lokka)：一个简单的 JavaScript GraphQL 客户端，可以运行于所有的 JavaScript 环境 —— 浏览器，Node.js 和 React Native。
  - [nanogql](https://github.com/yoshuawuyts/nanogql)：一个使用模板字符串的小型 GraphQL 客户端库。
  - [gq-loader](https://github.com/Houfeng/gq-loader)：一个简单的 JavaScript GraphQL 客户端，通过 webpack 加载器让 *.gql 文件作为模块使用。
  - [AWS Amplify](https://aws.github.io/aws-amplify)：使用云服务进行应用开发的 JavaScript 库，支持 GraphQL 后端和用于处理 GraphQL 数据的 React 组件。
  - [Grafoo](https://github.com/grafoojs/grafoo)：一个通用的 GraphQL 客户端，具有仅 1.6kb 的多框架的视图层集成。
  - [urql](https://formidable.com/open-source/urql/) ([github](https://github.com/FormidableLabs/urql))：一个用于 React 的高度可定制且用途广泛的 GraphQL 客户端。
  - [graphqurl](https://github.com/hasura/graphqurl) ([npm](https://www.npmjs.com/package/graphqurl))：带有自动完成功能、订阅和 GraphiQL 的 curl。也是一个简单通用的 javascript GraphQL 客户端。

### Julia

  - [Diana.jl](https://github.com/codeneomatrix/Diana.jl)：一个 Julia GraphQL 服务端实现.

### Swift / Objective-C iOS

  - [Apollo iOS](https://www.apollographql.com/docs/ios/) ([github](https://github.com/apollographql/apollo-ios))：一个用于 iOS 的 GraphQL 客户端，返回查询特定的 Swift 类型，与 Xcode 集成后可以分屏显示你的 Swift 源代码和 GraphQL，并能在行内展示验证错误。
  - [GraphQL iOS](https://github.com/funcompany/graphql-ios)：一个用于 iOS 的  Objective-C GraphQL 客户端。
  - [Graphaello](https://github.com/nerdsupremacist/Graphaello)：一个使用 GraphQL 和 Apollo 在 SwiftUI 中编写声明式、类型安全和数据驱动的应用程序的工具

### Python

  - [GQL](https://github.com/graphql-python/gql)：一个 Python 中的 GraphQL 客户端。
  - [python-graphql-client](https://github.com/prisma/python-graphql-client)：适用于 Python 2.7+ 的简单 GraphQL 客户端。
  - [sgqlc](https://github.com/profusion/sgqlc)：一个简单的 Python GraphQL 客户端。支持为 GraphQL schema 中定义的类型生成代码。

### R

  - [ghql](https://github.com/ropensci/ghql)：通用的 GraphQL R 客户端。
   
## 工具

  - [graphiql](https://github.com/graphql/graphiql) ([npm](https://www.npmjs.com/package/graphiql))：一个交互式的运行于浏览器中的 GraphQL IDE.
  - [libgraphqlparser](https://github.com/graphql/libgraphqlparser)：一个 C++ 版 GraphQL 查询语言分析器，提供 C 和 C++ API。
  - [Graphql Language Service](https://github.com/graphql/graphql-language-service)：一个用于构建 IDE 的 GraphQL 语言服务（诊断、自动完成等）的接口。
  - [quicktype](https://quicktype.io) ([github](https://github.com/quicktype/quicktype))：在 TypeScript、Swift、golang、C#、C++ 等语言中为 GraphQL 查询生成类型。
  - [GraphQL Code Generator](https://graphql-code-generator.com)：GraphQL 代码生成器具有对自定义插件和模板（如 Typescript 前端和后端、React Hooks、解析器签名等）的灵活支持。
  - [GraphQL Inspector](https://github.com/kamilkisiela/graphql-inspector)：比较 schema，验证文档，查找重大更改，查找相似类型，schema 覆盖率等等。
  - [GraphQL Config](https://github.com/kamilkisiela/graphql-config)：为你所有的 GraphQL 工具应用同一份配置（支持大多数工具、编辑器和 IDE）。
  - [GraphQL CLI](https://github.com/urigo/graphql-cli)：用于常见 GraphQL 开发工作流程的命令行工具。
  - [GraphQL Scalars](https://github.com/Urigo/graphql-scalars)：自定义 GraphQL 标量类型的库，用于创建精确的、类型安全的 GraphQL schema。
  - [GraphQL Toolkit](https://github.com/ardatan/graphql-toolkit)：一组用于快速开发 GraphQL 工具的实用程序（schema 和文档加载，schema 合并等）。
  - [SOFA](https://github.com/Urigo/sofa)：从你的 GraphQL API 生成 REST API。

## 服务

  - [Apollo Graph Manage](http://engine.apollographql.com)：一个用于监视 GraphQL 后端的性能和使用的云服务。
  - [GraphCMS](https://graphcms.com/)：一个 BaaS（后端即服务），它为你配置了一个作为内容编辑工具来处理存储数据的 GraphQL 后端。
  - [Prisma](https://www.prisma.io) ([github](https://github.com/prisma))：一个 BaaS（后端即服务），它为你的应用程序提供了一个 GraphQL 后端，且具有用于管理数据库和存储数据的强大的 web ui。
  - [Tipe](https://tipe.io) ([github](https://github.com/tipeio))：一个 SaaS（软件即服务）内容管理系统，允许你使用强大的编辑工具创建你的内容，并通过 GraphQL 或 REST API 从任何地方访问它。
  - [AWS AppSync](https://aws.amazon.com/appsync/)：完全托管的 GraphQL 服务，包含实时订阅、离线编程和同步、企业级安全特性以及细粒度的授权控制。
  - [Elide](https://elide.io)：一个 Java 库，可以在任何关系数据库上将 JPA 注释的数据模型公开为 GraphQL 服务。
  - [Hasura](https://hasura.io) ([github](https://github.com/hasura))：Hasura 连接到你的数据库和微服务，并立即为你提供可用于生产的 GraphQL API。
  - [FaunaDB](https://docs.fauna.com/fauna/current/graphql)：通过导入 gql schema 创建即时 GraphQL 后端。数据库将为你创建关系和索引，因此你无需编写任何数据库代码即可在几秒钟内查询。Serverless 定价可免费开始使用。

## 更多内容

  - [awesome-graphql](https://github.com/chentsulin/awesome-graphql)：一个神奇的社区，维护一系列库、资源等。

          `}</Marked>

        </div>
      </div>
    </section>

  </Site>
