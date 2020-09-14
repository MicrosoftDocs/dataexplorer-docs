---
title: Alter materialized view - Azure Data Explorer
description: This article describes how to Alter materialized views in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---
# .alter materialized-view

Altering the materialized view requires [Database Admin](../access-control/role-based-authorization.md) permissions, or an admin of the materialized view. For more information, see[security roles management](../security-roles.md).

> [!WARNING]
> Be extra cautious when altering a materialized view. Incorrect use may lead to data loss.

### Syntax

`.alter` `materialized-view`  
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]  
*ViewName* `on table` *SourceTableName*  
`{`  
    &nbsp;&nbsp;&nbsp;&nbsp;*Query*  
`}`

### Arguments

|Argument|Type|Description
|----------------|-------|---|
|ViewName|String|Materialized view name.|
|SourceTableName|String|Name of source table on which the view is defined.|
|Query|String|The materialized view query.|

### Properties

The `dimensionTables` is the only supported property in materialized-view alter command. This property should be used in case query references dimension tables. For more information, see the [.create materialized-view](materialized-view-create.md) command.

### Applicable use cases

* Altering the materialized view can be used for changing the query of the materialized view, while still preserving the existing data in the view.
* Adding aggregations to the view - for example, add `avg` aggregation to `T | summarize count(), min(Value) by Id`, by altering view query to `T | summarize count(), min(Value), avg(Value) by Id`.
* Changing operators other than the summarize operator - for example, filtering out some records by altering  `T | summarize arg_max(Timestamp, *) by User` to `T | where User != 'someone' | summarize arg_max(Timestamp, *) by User`. 
* Altering with no change to the query, because of a change in source table - for example, assume a view of `T | summarize arg_max(Timestamp, *) by Id`, which isn't set to `autoUpdateSchema` (see [.create materialized-view](materialized-view-create,md) command). If a column is added or removed from the source table of the view, the view will be automatically disabled. Executing the alter command, with the exact same query, will change the materialized view's schema to align with new table schema. The view still must be explicitly enabled following the change, using the [enable materialized view](materialized-view-enable-disable.md) command.

### Alter materialized view limitations

* **Supported changes:**
    * Changing column type isn't supported.
    * Renaming columns isn't supported (altering a view of `T | summarize count() by Id` to `T | summarize Count=count() by Id` will drop column `count_` and create a new column `Count`, which will initially contain nulls only).
    * Changes to the materialized view group by expressions aren't supported.

* **Impact on existing data:**
    * Altering the materialized view has no impact on existing data.
    * New columns will receive nulls for all existing records (until records ingested post the alter command modify the null values).
        * For example: if a view of `T | summarize count() by bin(Timestamp, 1d)` is altered to `T | summarize count(), sum(Value) by bin(Timestamp, 1d)`, then for a particular `Timestamp=T` for which records have already been processed before altering the view, the `sum` column will contain partial data (including only records processed after the alter execution).
    * Adding filters to the query (example #2 above) doesn't change records that have already been materialized. The filter will only apply to newly ingested records.
        * For example, per example #2 above, `User == 'someone'` will still be part of the view, until dropped by retention policy or other.
