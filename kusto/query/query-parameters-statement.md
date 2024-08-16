---
title:  Query parameters declaration statement
description: Learn how to use the query parameters declaration statement to parameterize queries and protect against injection attacks.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# Query parameters declaration statement

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Queries sent to Kusto may include a set of name or value pairs. The pairs are called *query parameters*, together with the query text itself. The query may reference one or more values, by specifying names and type, in a *query parameters declaration statement*.

Query parameters have two main uses:

* As a protection mechanism against injection attacks.
* As a way to parameterize queries.

In particular, client applications that combine user-provided input in queries that they then send to Kusto should use the mechanism to protect against the Kusto equivalent of [SQL Injection](https://en.wikipedia.org/wiki/SQL_injection) attacks.

## Declaring query parameters

To reference query parameters, the query text, or functions it uses, must first declare which query parameter it uses. For each parameter, the declaration provides the name and scalar type. Optionally, the parameter can also have a default value. The default is used if the request doesn't provide a concrete value for the parameter. Kusto then parses the query parameter's value, according to its normal parsing rules for that type.

## Syntax

`declare` `query_parameters` `(` *Name1* `:` *Type1* [`=` *DefaultValue1*] [`,`...] `);`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Name1*| `string` | :heavy_check_mark:|The name of a query parameter used in the query.|
|*Type1*| `string` | :heavy_check_mark:|The corresponding type, such as `string` or `datetime`. The values provided by the user are encoded as strings. The appropriate parse method is applied to the query parameter to get a strongly-typed value.|
|*DefaultValue1*| `string` ||A default value for the parameter. This value must be a literal of the appropriate scalar type.|

> [!NOTE]
>
> * Like [user defined functions](functions/user-defined-functions.md), query parameters of type `dynamic` cannot have default values.
> * Let, set, and tabular statements are strung together/separated by a semicolon, otherwise they will not be considered part of the same query.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4WNuw7CMBAE+0j5hytBpKAFBBUpXEOPrHgFjvzifAEi8fEkQUBJO9qZNWicZtC1A/enpFl7CDjPvH6o0HYMs3YxnGlLq+V8UxYHiezrG4JkKosn3S8Y9GlqkfeW0QgtvkAF80Y7+hVHL3FsR14nm6OBMhVN1WOfUJFE0e7TGL7/9l+H314eyAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
declare query_parameters(maxInjured:long = 90);
StormEvents 
| where InjuriesDirect + InjuriesIndirect > maxInjured
| project EpisodeId, EventType, totalInjuries = InjuriesDirect + InjuriesIndirect
```

**Output**

| EpisodeId | EventType | totalInjuries |
|---|---|---|
| 12459 | Winter Weather | 137 |
| 10477 | Excessive Heat | 200 |
| 10391 | Heat | 187 |
| 10217 | Excessive Heat | 422 |
| 10217 | Excessive Heat | 519 |

## Specify query parameters in a client application

The names and values of query parameters are provided as `string` values
by the application making the query. No name may repeat.

The interpretation of the values is done according to the query parameters
declaration statement. Every value is parsed as if it were a literal in the
body of a query. The parsing is done according to the type specified by the query parameters
declaration statement.

### REST API

Query parameters are provided by client applications through the `properties`
slot of the request body's JSON object, in a nested property bag called
`Parameters`. For example, here's the body of a REST API call to Kusto
that calculates the age of some user, presumably by having the application
ask for the user's birthday.

``` json
{
    "ns": null,
    "db": "myDB",
    "csl": "declare query_parameters(birthday:datetime); print strcat(\"Your age is: \", tostring(now() - birthday))",
    "properties": "{\"Options\":{},\"Parameters\":{\"birthday\":\"datetime(1970-05-11)\",\"courses\":\"dynamic(['Java', 'C++'])\"}}"
}
```

### Kusto SDKs

To learn how to provide the names and values of query parameters when using Kusto
[client libraries](../api/index.md#client-libraries), see [Use query parameters to protect user input](../api/get-started/app-basic-query.md#use-query-parameters-to-protect-user-input).

### Kusto.Explorer

To set the query parameters sent when making a request to the service,
use the **Query parameters** "wrench" icon (`ALT` + `P`).
