---
title: bag-unpack plugin (Azure Kusto)
description: This article describes bag-unpack plugin in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# bag-unpack plugin

Unpacks dynamic column into several columns according to the first level of the dynamic column schema.

    T | evaluate bag-unpack(col1)

**Syntax**

`T` `|` `evaluate` `bag-unpack(` *column* `,` [ *column-prefix* ] `)`

**Arguments**

* *column*: Name of the column that will be unpacked. 
* *column-prefix*: (optional) the prefix name that will be used for producing new columns


**Note**

The plugin transposes JSON (dynamic) objects into a table with dynamic column names taken from property bag keys.
As the output schema of the `bag-unpack` plugin is based on the data and therefore query may produce different
schema for any two runs. This also means that query that is referencing unpacked columns may become 'broken' at 
any time. Due to this reason - it is not advised to use this plugin for automation jobs.

**Returns**

The `bag-unpack` returns a tabular expression where the original dynamic column is replaced with the first-level properties of the unpacked data.

**Example**

```kusto
datatable(d:dynamic)
[
    dynamic({"Name": "John", "Age":20}),
    dynamic({"Name": "Dave", "Age":40}),
    dynamic({"Name": "Smitha", "Age":30}),
]
| evaluate bag-unpack(d)
```

|Name|Age|
|---|---|
|John|20|
|Dave|40|
|Smitha|30|