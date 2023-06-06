---
title:  Kusto.Language overview
description: This article describes the Kusto.Language client library in Azure Data Explorer.
ms.topic: reference
ms.date: 06/06/2023
---

# Kusto.Language overview

The [Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) library provides a .NET implementation of a parser for the [Kusto Query Language (KQL)](../../query/index.md). Kusto.Language allows you to parse queries, perform semantic analysis, check for errors, and optimize your queries.

## Query parsing

Parse queries and management commands to access a structured syntax tree. Traverse and analyze the syntax tree with methods like `GetDescendants`, `GetAncestors`, `GetChild`, `Parent`, `WalkNodes`, `GetTokenAt`, and `GetNodeAt`. For instance, you can find all references to a particular name within a query by using `GetDescendants` to search for `NameReference` nodes that match that specific name.

## Semantic analysis

Perform semantic analysis in order to identify which piece of query syntax refers to which column, variable, function or table and checks for errors. This process allows for precise understanding and manipulation of the query structure. To perform semantic analysis, you need to first [Define schemas for semantic analysis](kusto-language-define-schemas.md) referenced by the query.

## Error handling

Identify syntactic and semantic errors in your queries. For queries that are parsed without semantic analysis, only syntax errors will be found. This feature assists in early detection and resolution of issues, ensuring that queries are error-free and produce the expected results.

## Query optimization

Explore and understand the parse tree in order to optimize your queries. For example, analyze the column and table references within a query to understand the compute cost associated with each operation. With this information, you can optimize your queries to improve efficiency and reduce unnecessary computational overhead.

## Next steps

* [Define schemas for semantic analysis](kusto-language-define-schemas.md)
* [Parse queries and commands](kusto-language-parse-queries.md)
* See the [source code](https://github.com/microsoft/Kusto-Query-Language)
