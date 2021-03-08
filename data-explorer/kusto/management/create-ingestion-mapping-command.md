---
title: .create ingestion mapping - Azure Data Explorer
description: This article describes .create ingestion mapping in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/04/2020
---
# .create ingestion mapping

Creates an ingestion mapping that is associated with a specific table and a specific format.

**Syntax**

`.create` `table` *TableName* `ingestion` *MappingKind* `mapping` *MappingName* *MappingFormattedAsJson*

> [!NOTE]
> * Once created, the mapping can be referenced by its name in ingestion commands, instead of specifying the complete mapping as part of the command.
> * Valid values for _MappingKind_ are: `CSV`, `JSON`, `avro`, `parquet`, and `orc`
> * If a mapping by the same name already exists for the table:
>    * `.create` will fail
>    * `.create-or-alter` will alter the existing mapping
 
**Example** 
 
```kusto
.create table MyTable ingestion csv mapping "Mapping1"
'['
'   { "column" : "rownumber", "DataType":"int", "Properties":{"Ordinal":"0"}},'
'   { "column" : "rowguid", "DataType":"string", "Properties":{"Ordinal":"1"}}'
']'

.create-or-alter table MyTable ingestion json mapping "Mapping1"
'['
'    { "column" : "rownumber", "datatype" : "int", "Properties":{"Path":"$.rownumber"}},'
'    { "column" : "rowguid", "Properties":{"Path":"$.rowguid"}}'
']'
```

**Example output**

| Name     | Kind | Mapping                                                                                                                                                                          |
|----------|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |

## Next steps
For more information about ingestion mapping, see [Data mappings](mappings.md).
