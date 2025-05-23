---
title:  Syntax conventions for reference documentation
description: Learn about the syntax conventions for the Kusto Query Language and management command documentation.
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---
# Syntax conventions for reference documentation

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

This article outlines the syntax conventions followed in the [Kusto Query Language (KQL)](index.md) and [management commands](../management/index.md) reference documentation.

A good place to start learning Kusto Query Language is to understand the overall query structure. The first thing you notice when looking at a Kusto query is the use of the pipe symbol (` | `). The structure of a Kusto query starts with getting your data from a data source and then passing the data across a *pipeline*, and each step provides some level of processing and then passes the data to the next step. At the end of the pipeline, you get your final result. In effect, this is our pipeline:

`Get Data | Filter | Summarize | Sort | Select`

This concept of passing data down the pipeline makes for an intuitive structure, as it's easy to create a mental picture of your data at each step.

To illustrate this, let's take a look at the following query, which looks at Microsoft Entra sign-in logs. As you read through each line, you can see the keywords that indicate what's happening to the data. We've included the relevant stage in the pipeline as a comment in each line.

> [!NOTE]
> You can add comments to any line in a query by preceding them with a double slash (` // `).

```kusto
SigninLogs                              // Get data
| evaluate bag_unpack(LocationDetails)  // Ignore this line for now; we'll come back to it at the end.
| where RiskLevelDuringSignIn == 'none' // Filter
   and TimeGenerated >= ago(7d)         // Filter
| summarize Count = count() by city     // Summarize
| sort by Count desc                    // Sort
| take 5                                // Select
```

Because the output of every step serves as the input for the following step, the order of the steps can determine the query's results and affect its performance. It's crucial that you order the steps according to what you want to get out of the query.

> [!TIP]
>
> * A good rule of thumb is to filter your data early, so you are only passing relevant data down the pipeline. This greatly increases performance and ensures that you aren't accidentally including irrelevant data in summarization steps.
> * This article points out some other best practices to keep in mind. For a more complete list, see [query best practices](best-practices.md).

## Syntax conventions

|Convention |Description |
|--|--|
|`Block`|String literals to be entered exactly as shown.|
|*Italic*|Parameters to be provided a value upon use of the function or command.|
|[ ] |Denotes that the enclosed item is optional.|
|( ) |Denotes that at least one of the enclosed items is required.|
|\| (pipe) |Used within square or round brackets to denote that you may specify one of the items separated by the pipe character. In this form, the pipe is equivalent to the logical OR operator. When in a block (`|`), the pipe is part of the KQL query syntax.|
|[`,` ...]|Indicates that the preceding parameter can be repeated multiple times, separated by commas.|
|`;`|Query statement terminator.|

## Examples

### Scalar function

This example shows the syntax and an example usage of the [hash function](hash-function.md), followed by an explanation of how each syntax component translates into the example usage.

#### Syntax

`hash(`*source* [`,` *mod*]`)`

#### Example usage

```kusto
hash("World")
```

* The name of the function, `hash`, and the opening parenthesis are entered exactly as shown.
* "World" is passed as an argument for the required *source* parameter.
* No argument is passed for the *mod* parameter, which is optional as indicated by the square brackets.
* The closing parenthesis is entered exactly as shown.

### Tabular operator

This example shows the syntax and an example usage of the [sort operator](sort-operator.md), followed by an explanation of how each syntax component translates into the example usage.

#### Syntax

*T* `| sort by` *column* [`asc` | `desc`] [`nulls first` | `nulls last`] [`,` ...]

#### Example usage

```kusto
StormEvents
| sort by State asc, StartTime desc
```

* The StormEvents table is passed as an argument for the required *T* parameter.
* `| sort by` is entered exactly as shown. In this case, the pipe character is part of the [tabular expression statement](tabular-expression-statements.md) syntax, as represented by the block text. To learn more, see [What is a query statement](index.md#what-is-a-query-statement).
* The State column is passed as an argument for the required *column* parameter with the optional `asc` flag.
* After a comma, another set of arguments is passed: the StartTime column with the optional `desc` flag. The [`,` ...] syntax indicates that more argument sets may be passed but aren't required.

## Working with optional parameters

To provide an argument for an optional parameter that comes after another optional parameter, you must provide an argument for the prior parameter. This requirement is because arguments must follow the order specified in the syntax. If you don't have a specific value to pass for the parameter, use an empty value of the same type.

### Example of sequential optional parameters

Consider the syntax for the [http_request plugin](http-request-plugin.md):

`evaluate` `http_request` `(` *Uri* [`,` *RequestHeaders* [`,` *Options*]] `)`

*RequestHeaders* and *Options* are optional parameters of type [dynamic](scalar-data-types/dynamic.md). To provide an argument for the *Options* parameter, you must also provide an argument for the *RequestHeaders* parameter. The following example shows how to provide an empty value for the first optional parameter, *RequestHeaders*, in order to be able to specify a value for the second optional parameter, *Options*.

```kusto
evaluate http_request ( "https://contoso.com/", dynamic({}), dynamic({ EmployeeName: Nicole }) )
```

## Related content

* [KQL overview](index.md)
* [KQL quick reference](kql-quick-reference.md)
