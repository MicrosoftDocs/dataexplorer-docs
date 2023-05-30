---
title:  Kusto.Language client library
description: This article describes the Kusto.Language client library in Azure Data Explorer.
ms.topic: reference
ms.date: 05/30/2023
---

# Kusto.Language client library

The Kusto.Language Library is a .NET implementation of a parser for the [Kusto Query Language (KQL)](../../query/index.md). This library provides developers with tools to parse, analyze, and manipulate KQL queries. Whether you need to validate query syntax, extract structured information, or automate data analysis tasks, the Kusto.Language Library is a valuable resource.

## Overview

The following sections provide an explanation of common features and use cases for the Kusto.Language library, including:

| Feature | Description |
|--|--|
| Query parsing | Parse queries and validate them against a specific schema to make sure that your queries adhere to the expected syntax and structure. For an example, see [Parse a query](#parse-a-query). |
| Semantic analysis | Analyze the parse tree of a query in order to determine which piece of syntax refers to which exact column, variable, function or table. You can even modify the parse tree to optimize or correct a query based on your needs. For an example, see [Perform semantic analysis](#perform-semantic-analysis). |
| Error handling | Check for errors detected during parsing or semantic analysis. For an example, see [Check for errors](#check-for-errors). |

> [!NOTE]
> In order to have the parser understand the existence of any particular database tables or functions, it must be told about them first. For more information, see [Declare schemas](#declare-schemas).

## Get started

To use Kusto.Language:

1. Get the package [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) from Nuget.

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Set up your environment

In order for the parser to understand the existence and schema of a database, table, or function, the parser must be told about these entities. There are two ways to set up the database schema: by declaring the schemas manually or by using database schemas from the server.

You tell the parser about the tables and functions by adding `DatabaseSymbol` instances to the `GlobalState` instance you use with the `ParseAndAnalyze` method.
You can declare tables by constructing `TableSymbol` instances.
You can declare functions by constructing `FunctionSymbol` instances. Functions can be declared with our without parameters.
Once you have all the tables and function symbols you can create a `DatabaseSymbol`.

## Examples

### Parse a query

The following example parses a query using the `KustoCode.Parse` method. The method produces a `KustoCode` instance that contains the parsed syntax tree. You can then navigate the tree using various API methods.

```csharp
var query = "T | project a = a + b | where a > 10.0";
var code = KustoCode.Parse(query);
```

### Perform semantic analysis

To perform semantic analysis, use the `KustoCode.ParseAndAnalyze` method and provide a `GlobalState` instance that contains the definition of database tables and functions. 

```csharp
var globals = GlobalState.Default.WithDatabase(
    new DatabaseSymbol("db",
        new TableSymbol("T", "(a: real, b: real)")));

var query = "T | project a = a + b | where a > 10.0";
var code = KustoCode.ParseAndAnalyze(query, globals);
```

### Check for errors

Check for errors detected during parsing or semantic analysis using the `GetDiagnostics` method. The method returns a list of syntactic and semantic errors found in the query.

```csharp
var diagnostics = code.GetDiagnostics();
if (diagnostics.Count > 0) { ... }
```

## See also

* The source code is available on GitHub at [Kusto Query Language](https://github.com/microsoft/Kusto-Query-Language)
