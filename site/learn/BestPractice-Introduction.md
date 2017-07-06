---
title: GraphQL 最佳实践
sidebarTitle: 介绍
layout: ../_core/DocsLayout
category: Best Practices
permalink: /learn/best-practices/
next: /learn/thinking-in-graphs/
---

GraphQL 规范特意忽略了一些面向 API 的重要问题，例如处理网络、授权和分页。这并不意味着在使用 GraphQL 时没有针对这些问题的解决方案，只是因为它们并非 GraphQL 的描述中的一部分，可代以通行的做法来实现。

本章节中的文章并非不可改动的真理，在某些情况下使用其他方式可能会更加合适。其中的一些文章介绍了 Facebook 在设计和部署 GraphQL 服务的过程中的一些开发理念，而另外一些则是为解决诸如提供 HTTP 服务和执行授权等常见问题提出了更多的策略建议。

以下内容是对 GraphQL 服务的一些常见的最佳实践和主观立场的简要说明，而本章节中的文章将对这些主题进行更深入的讨论。


### HTTP

GraphQL 通常通过单入口来提供 HTTP 服务的完整功能，这一实现方式与暴露一组 URL 且每个 URL 只暴露一个资源的 REST API 不同。虽然 GraphQL 也可以搭配一组资源 URL 使用，但这可能导致您在使用 GraphiQL 等工具时更加困难。

了解更多：[提供 HTTP 服务](/learn/serving-over-http/)。


### JSON (使用 GZIP 压缩)

GraphQL 服务通常返回 JSON 格式的数据，但 GraphQL 规范[并未指定这一点](http://facebook.github.io/graphql/#sec-Serialization-Format)。对于期望更好的网络性能的 API 层来说，使用 JSON 似乎是一个奇怪的选择，但由于它主要是文本，因而在 GZIP 压缩后表现非常好。

推荐任何在生产环境下的 GraphQL 服务都启用 GZIP，并推荐在客户端请求头中加入：

```
Accept-Encoding: gzip
```

客户端和 API 开发人员也非常熟悉 JSON，易于阅读和调试。事实上，GraphQL 语法部分地受到 JSON 语法的启发。


### 版本控制

While there's nothing that prevents a GraphQL service from being versioned just like any other REST API, GraphQL takes a strong opinion on avoiding versioning by providing the tools for the continuous evolution of a GraphQL schema.

Why do most APIs version? When there's limited control over the data that's returned from an API endpoint, *any change* can be considered a breaking change, and breaking changes require a new version. If adding new features to an API requires a new version, then a tradeoff emerges between releasing often and having many incremental versions versus the understandability and maintainability of the API.

In contrast, GraphQL only returns the data that's explicitly requested, so new capabilities can be added via new types and new fields on those types without creating a breaking change. This has lead to a common practice of always avoiding breaking changes and serving a versionless API.


### 为空性

Most type systems which recognise "null" provide both the common type, and the *nullable* version of that type, where by default types do not include "null" unless explicitly declared. However in a GraphQL type system, every field is *nullable* by default. This is because there are many things which can go awry in a networked service backed by databases and other services. A database could go down, an asynchronous action could fail, an exception could be thrown. Beyond simply system failures, authorization can often be granular, where individual fields within a request can have different authorization rules.

By defaulting every field to *nullable*, any of these reasons may result in just that field returned "null" rather than having a complete failure for the request. Instead, GraphQL provides [non-null](/learn/schema/#lists-and-non-null) variants of types which make a guarantee to clients that if requested, the field will never return "null". Instead, if an error occurs, the previous parent field will be "null" instead.

When designing a GraphQL schema, it's important to keep in mind all the problems that could go wrong and if "null" is an appropriate value for a failed field. Typically it is, but occasionally, it's not. In those cases, use non-null types to make that guarantee.


### 分页

The GraphQL type system allows for some fields to return [lists of values](/learn/schema/#lists-and-non-null) however leaves the pagination of longer lists of values up to the API designer. There are a wide range of possible API designs for pagination, each of which has pros and cons.

Typically fields that could return long lists accept arguments "first" and "after" to allow for specifying a specific region of a list, where "after" is a unique identifier of each of the values in the list.

Ultimately designing APIs with feature-rich pagination led to a best practice pattern called "Connections". Some client tools for GraphQL, such as [Relay](https://facebook.github.io/relay/), know about the Connections pattern and can automatically provide automatic support for client-side pagination when a GraphQL API employs this pattern.

Read more about this in the article on [Pagination](/learn/pagination/).


### 服务器端的批处理与缓存

GraphQL is designed in a way that allows you to write clean code on the server, where every field on every type has a focused single-purpose function for resolving that value. However without additional consideration, a naive GraphQL service could be very "chatty" or repeatedly load data from your databases.

This is commonly solved by a batching technique, where multiple requests for data from a backend are collected over a short period of time and then dispatched in a single request to an underlying database or microservice by using a tool like Facebook's [DataLoader](https://github.com/facebook/dataloader).
