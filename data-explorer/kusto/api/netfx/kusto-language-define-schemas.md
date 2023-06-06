---
title:  Define schemas for semantic analysis with Kusto.Language
description: This article describes how to define schemas for semantic analysis with the Kusto.Language library.
ms.topic: reference
ms.date: 06/06/2023
---

# Define schemas for semantic analysis with Kusto.Language

[Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) provides semantic analysis capabilities. Semantic analysis is a process that helps determine the specific entities referred to in a query and checks for any semantic errors. It allows you to identify the exact columns, variables, functions, or tables associated with different parts of the query syntax.

In order to perform semantic analysis, you'll need to first define schemas for the entities referenced in your queries. This article explains how to define schemas for use with Kusto.Language.

## Get started

1. Install [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/).

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Declare schemas

## Use schemas from the server
