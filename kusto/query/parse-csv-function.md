---
title:  parse_csv()
description: Learn how to use the parse_csv() function to split a given string representing a single record of comma-separated values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# parse_csv()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Splits a given string representing a single record of comma-separated values and returns a string array with these values.

## Syntax

`parse_csv(`*csv_text*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *csv_text* | `string` |  :heavy_check_mark: | A single record of comma-separated values. |

> [!NOTE]
>
> * Embedded line feeds, commas, and quotes may be escaped using the double quotation mark ('"').
> * This function doesn't support multiple records per row (only the first record is taken).

## Returns

A string array that contains the split values.

## Examples

### Filter by count of values in record

Count the conference sessions with more than three participants.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3POz0tLLUrNS04NTi0uzszPK+aqUSjPAAopJBYVJVbG56TmpZdkaBQkFhWnxicXl4FYJZnJmQWJeSXFmpoKdgrGQB0pmcUlmXnJJQpaAB0oOCtRAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
ConferenceSessions
| where array_length(parse_csv(participants)) > 3
| distinct *
```

**Output**

|sessionid|...|participants|
|--|--|--|
|CON-PRT157|...|Guy Reginiano, Guy Yehudy, Pankaj Suri, Saeed Copty|
|BRK3099|...|Yoni Leibowitz, Eric Fleischman, Robert Pack, Avner Aharoni|

### Use escaping quotes

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAxXFMQqAMAwF0KuUv1Qhi46CozdwFCSWIIVSa5N6fpU3vFJjNldFW7K5cFXZgz6dZyYc9AGFQFg0cIn5dHe7THRywBotCQBCilmGLf+N8P0LWIqWMVMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=parse_csv('aa,"b,b,b",cc,"Escaping quotes: ""Title""","line1\nline2"')
```

**Output**

|result|
|---|
|[<br>  "aa",<br>  "b,b,b",<br>  "cc",<br>  "Escaping quotes: \"Title\"",<br>  "line1\nline2"<br>]|

### CSV with multiple records

Only the first record is taken since this function doesn't support multiple records. 

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKYnPBRKZ8UWpyflFKbYFiUXFqfHJxWUa6hARQ51EnSSd5Jg8CNdIp0KnUqdKXRMAyO6RzEMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result_multi_record=parse_csv('record1,a,b,c\nrecord2,x,y,z')
```

**Output**

|result_multi_record|
|---|
|[<br>  "record1",<br>  "a",<br>  "b",<br>  "c"<br>]|
