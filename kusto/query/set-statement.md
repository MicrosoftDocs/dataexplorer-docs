---
title:  Set statement
description: Learn how to use the set statement to set a request property for the duration of the query.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# Set statement

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `set` statement is used to set a [request property](../api/rest/request-properties.md) for the duration of the query.

Request properties control how a query executes and returns results. They can be boolean flags, which are `false` by default, or have an integer value. A query may contain zero, one, or more set statements. Set statements affect only the tabular expression statements that trail them in the program order. Any two statements must be separated by a semicolon.
  
Request properties aren't formally a part of the Kusto Query Language and may be modified without being considered as a breaking language change.

> [!NOTE]
> * To set request properties using [T-SQL](t-sql.md), see [Set request properties](t-sql.md#set-request-properties).
> * To set request properties using the [Kusto client libraries](../api/client-libraries.md), see [Kusto Data ClientRequestProperties class](../api/netfx/about-kusto-data.md).

## Syntax

`set` *OptionName* [`=` *OptionValue*]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *OptionName* | `string` |  :heavy_check_mark: | The name of the request property.|
| *OptionValue* | |  :heavy_check_mark: | The value of the request property.|

## Example

```kusto
set querytrace;
Events | take 100
```
