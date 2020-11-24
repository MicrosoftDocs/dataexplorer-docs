---
title: .alter ingestion mapping - Azure Data Explorer
description: This article describes .alter ingestion mapping in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/04/2020
---
# .alter ingestion mapping

Alters an existing ingestion mapping that is associated with a specific table and a specific format (full mapping replace).

**Syntax**

`.alter` `table` *TableName* `ingestion` *MappingKind* `mapping` *MappingName* *MappingFormattedAsJson*

> [!NOTE]
> * This mapping can be referenced by its name by ingestion commands, instead of specifying the complete mapping as part of the command.
> * Valid values for _MappingKind_ are: `CSV`, `JSON`, `avro`, `parquet`, and `orc`.

**Example** 
 
```kusto
.alter table MyTable ingestion csv mapping "Mapping1"
'['
'	{ "column" : "rownumber", "DataType":"int", "Properties":{"Ordinal":"0"}},'
'	{ "column" : "rowguid", "DataType":"string", "Properties":{"Ordinal":"1"} }'
']'

.alter table MyTable ingestion json mapping "Mapping1"
'['
'	{ "column" : "rownumber", "Properties":{"Path":"$.rownumber"}},'
'	{ "column" : "rowguid", "Properties":{"Path":"$.rowguid"}}'
']'
```

**Sample output**

| Name     | Kind | Mapping                                                                                                                                                                          |
|----------|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
