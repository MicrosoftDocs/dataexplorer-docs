---
title:  Kusto.Language overview
description: This article describes the Kusto.Language client library in Azure Data Explorer.
ms.topic: reference
ms.date: 06/13/2023
---

# Kusto.Language overview

The [Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) library provides a .NET implementation of a parser for the [Kusto Query Language (KQL)](../../query/index.md). The library allows you to parse queries, perform semantic analysis, check for errors, and optimize your queries.

## Get started with Kusto.Language

To get started using the Kusto.Language library:

1. Install [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/).

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Parse queries and commands

Parse queries and management commands to generate a structured syntax tree, which can be traversed and analyzed with methods like `GetDescendants`, `GetAncestors`, `GetChild`, `Parent`, `WalkNodes`, `GetTokenAt`, and `GetNodeAt`. For more information, see [Parse queries and commands](kusto-language-parse-queries.md).

## Semantic analysis

Perform semantic analysis in order to identify which piece of query syntax refers to which column, variable, function, or table and checks for errors. This process allows for precise understanding and manipulation of the query structure. To perform semantic analysis, you need to first [define schemas](kusto-language-define-schemas.md) for the entities referenced by the query. For more information, see [Parse a query with semantic analysis](kusto-language-parse-queries.md#parse-a-query-with-semantic-analysis).

## Error handling

Identify syntactic and semantic errors in your queries. For queries that are parsed without semantic analysis, only syntax errors are found. This feature helps with early detection and resolution of issues, ensuring that queries are error-free and produce the expected results. For more information, see [Check a parsed query for errors](kusto-language-parse-queries.md#check-a-parsed-query-for-errors).

## Query optimization

Explore and understand the parse tree in order to optimize your queries. For example, analyze the column and table references within a query to understand the compute cost associated with each operation.

## Related content

* [Define schemas for semantic analysis](kusto-language-define-schemas.md)
* [Parse queries and commands](kusto-language-parse-queries.md)
* See the [source code](https://github.com/microsoft/Kusto-Query-Language)
