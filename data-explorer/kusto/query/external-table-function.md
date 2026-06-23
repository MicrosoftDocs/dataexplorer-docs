---
title:  external_table()
description: Learn how to use the external_table() function to reference an external table by name.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/01/2026
---
# external_table()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

References an [external table](schema-entities/external-tables.md) by name.

> [!NOTE]
>
> The `external_table` function has similar restrictions as the [table](table-function.md) function.
> Standard [query limits](../concepts/query-limits.md) apply to external table queries as well.

To accelerate queries over external delta tables, see [Query acceleration policy](../management/query-acceleration-policy.md).

## Syntax

`external_table(` *TableName* [`,` *MappingName* / *MaxAgeOverride* ] `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the external table being queried. Must reference an external table of kind `blob`, `adl`, or `sql`.|
| *MappingName* | `string` | | A name of a mapping object that maps fields in the external data shards to columns output.|
| *MaxAgeOverride* | `TimeSpan` | | When [Query Acceleration Policy](../management/query-acceleration-policy.md) is enabled, override the policy's [MaxAge](../management/alter-query-acceleration-policy-command.md) property for this query. If you use this property, the external table returns accelerated data if the last index refresh time is greater than @now - MaxAgeOverride. Minimum: 1s|


## Authentication and authorization

The authentication method to access an external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method. For more information, see [Azure Storage external table](../management/external-tables-azure-storage.md#authentication-and-authorization) or [SQL Server external table](../management/external-sql-tables.md).

## Use in update policy queries

The `external_table()` function can be used inside [update policy](../management/update-policy.md) queries under restricted conditions:

* The external table must have a [query acceleration policy](../management/query-acceleration-policy.md) **enabled**.
* The query acceleration `Hot` period must cover all data in the external table (currently >= 100 years).

::: moniker range="azure-data-explorer"
* If the external table uses impersonation authentication, the update policy must be configured with a `ManagedIdentity`.
::: moniker-end

::: moniker range="microsoft-fabric"
* In Fabric, the system automatically handles authorization through the `OwnerPrincipalDetails` property on the update policy, which captures the identity of the user who sets or alters the policy.
::: moniker-end

For more information, see [Update policy overview - Query limitations](../management/update-policy.md#query-limitations).

## Related content

* [External tables overview](schema-entities/external-tables.md)
* [Create and alter Azure Storage external tables](../management/external-tables-azure-storage.md)
* [Create and alter SQL Server external tables](../management/external-sql-tables.md).
