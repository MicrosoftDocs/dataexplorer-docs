---
title: Syntax conventions for reference documentation - Azure Data Explorer
description: Learn about the syntax conventions for the Kusto Query Language and management command documentation.
ms.topic: reference
ms.date: 04/03/2023
---
# Syntax conventions for reference documentation

This article outlines the syntax conventions followed in the [Kusto Query Language (KQL)](index.md) and [management commands](../management/index.md) reference documentation.

## Syntax conventions

|Convention|Description|
|--|--|
|`Block`|String literals to be entered exactly as shown.|
|*Italic*|Parameters to be provided a value upon use of the function or command.|
|[ ] (square brackets)|Denotes that the enclosed item is optional.|
|`,` ...|Indicates that the preceding parameter can be repeated multiple times, separated by commas.|
|\| (pipe)|Indicates that you can only use one of the syntax items separated by the pipe(s).|
|`;`|Query statement terminator.|

## Examples

### Scalar function

The following example shows the syntax and an example usage for the [hash function](hashfunction.md).

#### Syntax

`hash(`*source* [`,` *mod*]`)`

#### Example usage

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/yaeltestcluster.eastus/databases/YaelTestDatabase?query=H4sIAAAAAAAAAysoyswrUchILM7QUArPL8pJUdIEANrIz6MTAAAA" target="_blank">Run the query</a>

```kusto
print hash("World")
```

Let's break down the example usage step-by-step:

1. Enter the name of the function, `hash`, and the opening parenthesis exactly as shown in the syntax.
1. Pass "World" as an argument for the required *source* parameter.
1. Don't pass an argument for the optional *mod* parameter.
1. Enter the closing parenthesis exactly as shown in the syntax.

### Tabular operator

The following example shows the syntax and an example usage for the [sort operator](sort-operator.md).

#### Syntax

*T* `| sort by` *column* [`asc` | `desc`] [`nulls first` | `nulls last`] [`,` ...]

#### Example usage

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRyC9KSS1SSKpUCC5JLElVSCxO1gExi0pCMnNTFVJSi5MBfa8LRzAAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| sort by State asc, StartTime desc
```

Let's break down the example usage step-by-step:

1. Pass the StormEvents table as an argument for the required *T* parameter.
1. Enter `| sort by` exactly as shown in the syntax. In this case, the pipe character is part of the query statement syntax as represented by the block text. To learn more, see [What is a query statement](index.md#what-is-a-query-statement).
1. Pass the State column as an argument for the required *column* parameter with the optional `asc` flag.
1. Enter a comma, followed by another set of arguments: the StartTime column with the optional `desc` flag. This extra argument set is optional, as indicated by the [`,` ...] syntax.

## Working with optional parameters

To provide an argument for an optional parameter that comes after another optional parameter, you must provide an argument for the prior parameter. This requirement is because arguments must follow the order specified in the syntax. If you don't have a specific value to pass for the parameter, use an empty value of the same type.

### Example of sequential optional parameters

Consider the syntax for the [http_request plugin](http-request-plugin.md):

`evaluate` `http_request` `(` *Uri* [`,` *RequestHeaders* [`,` *Options*]] `)`

*RequestHeaders* and *Options* are optional parameters of type [dynamic](scalar-data-types/dynamic.md). To provide an argument for the *Options* parameter, you must also provide an argument for the *RequestHeaders* parameter. The following example shows how to provide an empty value for the first optional parameter, *RequestHeaders*, in order to be able to specify a value for the second optional parameter, *Options*.

```kusto
evaluate http_request ( "https://contoso.com/", dynamic({}), dynamic({ EmployeeName: Nicole }) )
```

## See also

* [KQL overview](index.md)
* [KQL quick reference](../../kql-quick-reference.md)
