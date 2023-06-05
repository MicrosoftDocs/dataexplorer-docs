---
title:  Kusto.Language overview
description: This article describes the Kusto.Language client library in Azure Data Explorer.
ms.topic: reference
ms.date: 06/05/2023
---

# Kusto.Language overview

The Kusto.Language library provides a .NET implementation of a parser for the [Kusto Query Language (KQL)](../../query/index.md). Use Kusto.Language to parse queries, perform semantic analysis, check for errors, and optimize your queries.

## Get started

To use Kusto.Language:

1. Install [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/).

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Overview of Kusto.Language

The following sections explain the primary use cases for Kusto.Language.

### Query parsing

Parse queries and management commands to access a structured syntax tree. Traverse and analyze the syntax tree with methods like `GetDescendants`, `GetAncestors`, `GetChild`, `Parent`, `WalkNodes`, `GetTokenAt`, and `GetNodeAt`. For instance, you can find all references to a particular name within a query by using `GetDescendants` to search for `NameReference` nodes that match that specific name.

### Semantic analysis

To perform semantic analysis on a query, [define schemas for database entities](kusto-language-define-schemas.md) referenced by the query. Then, perform semantic analysis to determine which piece of syntax refers to which exact column, variable, function or table and checks for errors. Semantic analysis allows for precise understanding and manipulation of the query structure, including the ability to optimize or correct it according to specific needs.

### Error handling

Use the `GetDiagnostics` method to return all the syntactic and semantic errors found in the query. If a query hasn't undergone semantic analysis, only syntax errors found during parsing are found. This feature assists in early detection and resolution of issues, ensuring that queries are error-free and produce the expected results.

### Query optimization

Explore and understand the parse tree to optimize your queries. For example, analyze the column and table references within a query to understand the compute cost associated with each operation. With this information, you can optimize your queries to improve efficiency and reduce unnecessary computational overhead.

## Next steps

* [Define schemas for database entities](kusto-language-define-schemas.md)
* [Parse queries and commands](kusto-language-parse-queries.md)
* See the [source code](https://github.com/microsoft/Kusto-Query-Language)
