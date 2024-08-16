---
title:  Add a comment in KQL
description: Learn how to add comments in Kusto Query Language.
ms.reviewer: andresilva
ms.topic: reference
ms.date: 08/11/2024
---
# Add a comment in KQL

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 


Indicates user-provided text. Comments can be inserted on a separate line, nested at the end, or within a KQL query or command. The comment text isn't evaluated.

## Syntax

`//` *comment*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Remarks

Use the two slashes (//) to add comments. The following table lists the keyboard shortcuts that you can use to comment or uncomment text.

| Hot Key  | Description  |
| ------------ | ------------ |
| `Ctrl`+`K`+`C`  | Comment current line or selected lines.  |
| `Ctrl`+`K`+`U`  | Uncomment current line or selected lines.  |

## Example

This example returns a count of events in the New York state:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02OMQ6DMBAEe16x4gN+ASVpIhGJFBElIYuwAj7pfECTxyfGKWhHO6N1Di1t1QCbiEHWYJAR3BgswmfccEcn+ka03ohRZTn43USXOk+tf84sTqT4YJ+oaZWkqkLZ1A90t/Zawjlc/GzUo6McRF/xv8/l5Ph4cn69494XVG+MV7IAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
// Return the count of events in the New York state from the StormEvents table
StormEvents
| where State == "NEW YORK" // Filter the records where the State is "NEW YORK"
| count
```
