---
title:  Kusto.Language client library
description: This article describes the Kusto.Language client library in Azure Data Explorer.
ms.topic: reference
ms.date: 05/30/2023
---

# Kusto.Language client library

The Kusto.Language Library is a .NET implementation of a parser for the [Kusto Query Language (KQL)](../../query/index.md). This library provides developers with tools to parse, analyze, and manipulate KQL queries. Whether you need to validate query syntax, extract structured information, or automate data analysis tasks, the Kusto.Language Library is a valuable resource.

## Get started

To use Kusto.Language:

1. Get the package [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) from Nuget.

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Features

The following sections provide an explanation of common features and use cases for the Kusto.Language library, including:

* Query parsing
* Semantic analysis
* Error handling
* Declare schemas
* Integration and automation

### Query parsing

The Kusto.Language Library allows you to parse KQL queries and validate them against a specific schema. Ensure that your queries adhere to the expected syntax and structure, improving their accuracy and reliability. The library provides a robust parsing framework, enabling you to handle complex queries with ease.

Parse a query or control command using the `KustoCode.Parse` method. The method will produce a `KustoCode` instance that contains the parsed syntax tree. You can then navigate the tree using various API methods. For an example, see [Parse a query](#parse-a-query).

### Semantic analysis

With the Kusto.Language Library, you can analyze the generated parse tree of KQL queries. Traverse the parse tree, extract relevant information, and perform custom analysis on the queries. Additionally, the library enables you to modify the parse tree, empowering you to programmatically manipulate queries to meet your specific requirements.

Semantic analysis is the process of determining the meaning of names and checking the query for semantic errors. To perform semantic analysis, use the `KustoCode.ParseAndAnalyze` method and provide a `GlobalState` instance that contains the definition of database tables and functions. For an example, see [Perform semantic analysis](#perform-semantic-analysis).

### Error handling

Check for errors detected during parsing or semantic analysis using the `GetDiagnostics` method. The method returns a list of syntactic and semantic errors found in the query. For an example, see [Handle errors](#handle-errors).

### Declare schemas

To enable the parser to understand the existence of database tables and functions, you need to declare them using `DatabaseSymbol`, `TableSymbol`, and `FunctionSymbol`. You can add these symbols to the `GlobalState` instance. For an example, see [Declare database schema](#declare-database-schema).

### Integration and automation

Integrate KQL parsing capabilities seamlessly into your .NET applications using the Kusto.Language Library. Automate tasks such as generating reports, performing data analysis, and interacting with Kusto databases. The library simplifies your workflow and improves productivity by providing a convenient way to work with KQL queries.

## Examples

### Parse a query

```csharp
var query = "T | project a = a + b | where a > 10.0";
var code = KustoCode.Parse(query);
```

### Perform semantic analysis

```csharp
var globals = GlobalState.Default.WithDatabase(
    new DatabaseSymbol("db",
        new TableSymbol("T", "(a: real, b: real)")));

var query = "T | project a = a + b | where a > 10.0";
var code = KustoCode.ParseAndAnalyze(query, globals);
```

### Handle errors

```csharp
var diagnostics = code.GetDiagnostics();
if (diagnostics.Count > 0) { ... }
```

### Declare database schema

```csharp
var shapes = new TableSymbol("Shapes", "(id: string, width: real, height: real)");
var tallshapes = new FunctionSymbol("TallShapes", "{ Shapes | width < height; }");

var mydb = new DatabaseSymbol("mydb", shapes, tallshapes);
var globalsWithMyDb = GlobalState.Default.WithDatabase(mydb);
```

## See also

* The source code is available on GitHub at [Kusto Query Language](https://github.com/microsoft/Kusto-Query-Language)
