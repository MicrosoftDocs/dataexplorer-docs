---
title: bag_unpack plugin - Azure Data Explorer | Microsoft Docs
description: This article describes bag_unpack plugin in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# bag_unpack plugin

Unpacks dynamic column into several columns according to the first level of the dynamic column schema.

    T | evaluate bag_unpack(col1)

**Syntax**

`T` `|` `evaluate` `bag_unpack(` *column* `,` [ *column_prefix* ] `)`

**Arguments**

* *column*: Name of the column that will be unpacked. 
* *column_prefix*: (optional) the prefix name that will be used for producing new columns

> [!NOTE]
> The plugin transposes JSON (dynamic) objects into a table with dynamic column names taken from property bag keys.
> As the output schema of the `bag_unpack` plugin is based on the data, the same query may produce different
> output schema for any two runs. This also means that a query that references unpacked columns might 'break' as a result. 
> Therefore - it is not advised to use this plugin for automation jobs.

**Returns**

The `bag_unpack` returns a tabular expression where the original dynamic column is replaced with the first-level properties of the unpacked data.

**Example**

```kusto
datatable(d:dynamic)
[
    dynamic({"Name": "John", "Age":20}),
    dynamic({"Name": "Dave", "Age":40}),
    dynamic({"Name": "Smitha", "Age":30}),
]
| evaluate bag_unpack(d)
```

|Name|Age|
|---|---|
|John|20|
|Dave|40|
|Smitha|30|