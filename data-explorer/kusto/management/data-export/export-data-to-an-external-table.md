---
title: Export data to an external table - Azure Data Explorer | Microsoft Docs
description: This article describes Export data to an external table in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/21/2019

---
# Export data to an external table

Another way to export data is by defining an [external table](../externaltables.md) and export data to it. Doing so removes the need to embed the table's properties in the export command; instead, these are specified once when [creating the external table](../externaltables.md#create-or-alter-external-table), export command references the external table by name. 

Requires [Database admin permission](../access-control/role-based-authorization.md).

**Syntax:**

`.export` [`async`] `to` `table` *ExternalTableName* <br>
[`with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <| *Query*

It is not possible to override the external table properties through this command (for example, it is not possible to have an external table whose data format is CSV and export data to it in Parquet format). 
Each type of external table may support different properties in the export command (noted in the External Table Type column below). 

If the external table is partitioned by DateTime, the query putput schema must include a Timestamp column which matches the *TimestampColumnName* defined in the external table partitioning definition.

|External Table Type|Property|Type|Description                                                                               
|--------------------|----------------|-------|---|
|`Blob`|`sizeLimit`|`long`|The size limit at which to switch to the next blob (before compression). The default value is 100MB, max 1GB.|

**Output:**

|Output parameter |Type |Description
|---|---|---
|ExternalTableName  |String |The name of the external table.
|Path|String|Output path.
|NumRecords|String| Number of records exported to path.

**Examples:**

```kusto
.export to table ExternalBlob <| T
```

|ExternalTableName|Path|NumRecords|
|---|---|---|
|ExternalBlob|http://storage1.blob.core.windows.net/externaltable1cont1/1_58017c550b384c0db0fea61a8661333e.csv|10|

If the command is executed asynchrously (by using the `async` keyword), once completed, the output is available using the [show operation details](../operations.md#show-operation-details) command.