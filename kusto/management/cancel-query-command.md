---
title: .cancel query command
description: Learn how to use management commands to manage your queries.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/30/2023
---
# .cancel query command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
The `.cancel` `query` command starts a best-effort attempt to cancel a specific running query. Cluster admins can cancel any running query. Database admins can cancel any running query that was invoked on a database to which they have admin access. All principals can cancel running queries that they started.
::: moniker-end
:::moniker range="microsoft-fabric"
The `.cancel` `query` command starts a best-effort attempt to cancel a specific running query. Admins can cancel any running query. Users with database admin rights can cancel any running query that was invoked on a database to which they have admin access. All users can cancel running queries that they started.
::: moniker-end

## Syntax

`.cancel` `query` *ClientActivityId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ClientActivityId* | `string` |  :heavy_check_mark: | The value of the running query's `ClientActivityId` property. Find the *ClientActivityId* of a query by running the [.show queries command](show-queries-command.md).|
| *ReasonPhrase* | `string` |  :heavy_check_mark: | Describes the reason for canceling the running query and is included in the query results if it's successfully canceled. |

## Example

This example cancels a specific query using *ClientActivityId*.

```kusto
.cancel query "KE.RunQuery;8f70e9ab-958f-4955-99df-d2a288b32b2c"
```

## Related content

* [.show queries](show-queries-command.md)
