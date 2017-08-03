---
title: GraphQL 最佳实践
sidebarTitle: 介绍
layout: ../_core/DocsLayout
category: 最佳实践
permalink: /learn/best-practices/
next: /learn/thinking-in-graphs/
---

GraphQL 规范特意忽略了一些面向 API 的重要问题，例如处理网络、授权和分页。这并不意味着在使用 GraphQL 时没有针对这些问题的解决方案，只是因为它们**并非** GraphQL 定义中的一部分，可代以工程上通行的做法来实现。

本章节中的文章并非不可改动的真理，在某些情况下使用其他方式可能会更加合适。其中的一些文章介绍了 Facebook 在设计和部署 GraphQL 服务的过程中的一些开发理念，而另外一些则是为解决诸如提供 HTTP 服务和执行授权等常见问题提出了更多的策略建议。

以下内容是对 GraphQL 服务的一些常见的最佳实践和主观立场的简要说明，而本章节中的文章将对这些主题进行更深入的讨论。


### HTTP

GraphQL 通常通过单入口来提供 HTTP 服务的完整功能，这一实现方式与暴露一组 URL 且每个 URL 只暴露一个资源的 REST API 不同。虽然 GraphQL 也可以暴露多个资源 URL 来使用，但这可能导致您在使用 GraphiQL 等工具时遇到困难。

了解更多：[提供 HTTP 服务](/learn/serving-over-http/)。


### JSON（使用 GZIP 压缩）

GraphQL 服务通常返回 JSON 格式的数据，但 GraphQL 规范 [并未要求这一点](http://facebook.github.io/graphql/#sec-Serialization-Format)。对于期望更好的网络性能的 API 层来说，使用 JSON 似乎是一个奇怪的选择，但由于它主要是文本，因而在 GZIP 压缩后表现非常好。

推荐任何在生产环境下的 GraphQL 服务都启用 GZIP，并推荐在客户端请求头中加入：

```
Accept-Encoding: gzip
```

客户端和 API 开发人员也非常熟悉 JSON，易于阅读和调试。事实上，GraphQL 语法部分地受到 JSON 语法的启发。


### 版本控制

虽然没有什么可以阻止 GraphQL 服务像任何其他 REST API 一样进行版本控制，但 GraphQL 强烈认为可以通过 GraphQL schema 的持续演进来避免版本控制。

为什么大多数 API 有版本？当某个 API 入口能够返回的数据被限制，则**任何更改**都可以被视为一个破坏性变更，而破坏性变更需要发布一个新的版本。如果向 API 添加新功能需要新版本，那么在经常发布版本并拥有许多增量版本与保证 API 的可理解性和可维护性之间就需要权衡。

相比之下，GraphQL 只返回显式请求的数据，因此可以通过增加新类型和基于这些新类型的新字段添加新功能，而不会造成破坏性变更。这样可以衍生出始终避免破坏性变更并提供无版本 API 的通用做法。


### 可以为空的性质

大多数能够识别 “null” 的类型系统都提供普通类型和该类型**可以为空**的版本，默认情况下，类型不包括 “null”，除非明确声明。但在 GraphQL 类型系统中，默认情况下每个字段都**可以为空**。这是因为在由数据库和其他服务支持的联网服务中可能会出现许多问题，比如数据库可能会宕机，异步操作可能会失败，异常可能会被抛出。除了系统故障之外，授权通常可以是细粒度的，请求中的各个字段可以具有不同的授权规则。

通过默认设置每个字段**可以为空**，以上任何原因都可能导致该字段返回 “null”，而不是导致请求完全失败。作为替代，GraphQL 提供 [non-null](/learn/schema/#lists-and-non-null) 这一变体类型来保证当客户端发出请求时，该字段永远不会返回 “null”。相反，如果发生错误，则上一个父级字段将为 “null”。

在设计 GraphQL schema 时，请务必考虑所有可能导致错误的情况下，“null” 是否可以作为获取失败的字段合理的返回值。通常它是，但偶尔，它不是。在这种情况下，请使用非空类型进行保证。


### 分页

GraphQL 类型系统允许某些字段返回 [值的列表](/learn/schema/#lists-and-non-null)，但是为长列表分页的功能则交给 API 设计者自行实现。为 API 设计分页功能有很多种各有利弊的方案。

通常当字段返回长列表时，可以接收参数 “first” 和 “after” 来指定列表的特定区域，其中 “after” 是列表中每个值的唯一标识符。

最终在具有功能丰富的分页的 API 设计中，衍生出一种称为 “Connections” 的最佳实践模式。GraphQL 的一些客户端工具（如 [Relay](https://facebook.github.io/relay/)）采用了 Connections 模式，当 GraphQL API 使用此模式时，可以自动为客户端分页提供支持。

了解更多：[分页](/learn/pagination/)。


### 服务器端的批处理与缓存

GraphQL 的设计方式便于您在服务器上编写整洁的代码，每种类型的每个字段都有一个专用且目标唯一的函数来解析该值。然而当考虑不完善时，一个过于简单的 GraphQL 服务可能会像 “聊天” 一样反复从您的数据库加载数据。

这通常可以通过批处理技术来解决，这一技术能够收集短时间内来自后端的多个数据请求，然后通过诸如 Facebook 的 [DataLoader](https://github.com/facebook/dataloader) 等工具，将其打包成单个请求再发送到底层数据库或微服务。
