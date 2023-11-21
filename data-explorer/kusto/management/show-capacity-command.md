---
title: .show capacity command
description: Learn how to use the `.show capacity` command to display the capacity policy.
ms.topic: reference
ms.date: 11/21/2023
---
# .show capacity command

Displays an estimated capactity for a specified cluster resource or for all resources in the cluster. For more information, see [Capacity policy](capacitypolicy.md).

## Permissions

You must have at least [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `capacity` *Operation* [`with(``scope` `=` `cluster` | `workloadgroup``)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Paramters

|Name|Type|Required|Description|
|--|--|--|--|
|*Operation*|string||The name of a specific operation for which to return a capacity estimation, as based on the [capacity policy](../management/capacitypolicy.md). See [Supported operations](#supported-operations).|

### Supported operations

The following list outlines the opertaions for which you can get a capacity estimation:

|Operation|Syntax
|--|--|--|
|[Data export](../management/data-export/index.md)|`data-export`|
|[Extents merge](../management/mergepolicy.md)|`extents-merge`|
|[Extents partition](../management/partitioningpolicy.md)|`extents-partition`|
|[Ingestions](../../ingest-data-overview.md)|`ingestions`|
|[Materialized view](../management/materialized-views/materialized-view-overview.md)|`materialized-view`|
|[Stored query results](../management/stored-query-results.md)|`stored-query-results`|

For more information on each of the calculations, see [Capacity policy](../management/capacitypolicy.md).

## Returns

Returns the results of a calculation for an estimated cluster capacity for each resource.

The capacity can be based on the [workload group](workload-groups.md) specified in the command or the cluster's total capacity. If unspecified, the default scope is `cluster`.

|Output parameter |Type |Description|
|---|---|---|
|Resource |String |The name of the resource|
|Total |Int64 |The total amount of resources, of type 'Resource', that are available. For example, the number of concurrent ingestions|
|Consumed |Int64 |The amount of resources of type 'Resource' consumed right now|
|Remaining |Int64 |The amount of remaining resources of type 'Resource'|
|Origin |Int64 |The origin of the limit on concurrent requests ([capacity policy](capacitypolicy.md) or [request rate limit policy](request-rate-limit-policy.md))|

## Example

```kusto
.show capacity ingestions
```

**Example output**

|Resource |Total |Consumed |Remaining|Origin|
|---|---|---|---|---|
|ingestions |576 |1 |575|CapacityPolicy/Ingestion|
