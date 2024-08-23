---
title:  new_guid()
description: Learn how to use the new_guid() function to return a random GUID (Globally Unique Identifier).
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# new_guid()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a random GUID (Globally Unique Identifier).

## Syntax

`new_guid()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

A new value of type [`guid`](scalar-data-types/guid.md).

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgvzUyxzUstjwcxNDQBGYdeSRUAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print guid=new_guid()
```

**Output**

|guid|
|--|
|2157828f-e871-479a-9d1c-17ffde915095|
