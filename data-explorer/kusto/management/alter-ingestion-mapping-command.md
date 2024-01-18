---
title:  .alter ingestion mapping command
description: Learn how to use the `.alter ingestion mapping` command to alter a table or database's existing ingestion mapping 
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/26/2023
---
# .alter ingestion mapping command

Alters an existing ingestion mapping that is associated with a specific table/database and a specific format (full mapping replace).

> [!NOTE]
> New columns introduced in an ingestion mapping, which aren't present in the source table, will be added to the table during the initial data ingestion for that column. This behavior is only supported for queued ingestion and is contingent on specifying a valid data type for the column.

## Permissions

The command to alter database ingestion mapping requires at least [Database Ingestor](access-control/role-based-access-control.md) permissions, and the command to alter table ingestion mapping requires at least [Table Ingestor](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` `table` *TableName* `ingestion` *MappingKind* `mapping` *MappingName* *ArrayOfMappingObjects*

`.alter` `database` *DatabaseName* `ingestion` *MappingKind* `mapping` *MappingName* *ArrayOfMappingObjects*

> [!NOTE]
> This mapping can be referenced by its name by ingestion commands, instead of specifying the complete mapping as part of the command.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | string |  :heavy_check_mark: | The name of the table.|
| *DatabaseName* | string |  :heavy_check_mark: | The name of the database.|
| *MappingKind* | string |  :heavy_check_mark: | The type of mapping. Valid values are `CSV`, `JSON`, `avro`, `parquet`, and `orc`.|
| *MappingName* | string |  :heavy_check_mark: | The name of the mapping.|
| *ArrayOfMappingObjects* | string |  :heavy_check_mark: | A serialized array with one or more mapping objects defined.|

## Examples
 
````kusto
.alter table MyTable ingestion csv mapping "Mapping1"
```
[
    {"column" : "rownumber", "DataType" : "int", "Properties" : {"Ordinal":"0"} },
    { "column" : "rowguid", "DataType":"string", "Properties":{"Ordinal":"1"} }
]
```

.alter table MyTable ingestion json mapping "Mapping1"
```
[
    { "column" : "rownumber", "DataType" : "int", "Properties":{"Path":"$.rownumber"}},
    { "column" : "rowguid", "DataType":"string", "Properties":{"Path":"$.rowguid"}}
]
```

.alter database MyDatabase ingestion csv mapping "Mapping2"
```
[
    { "column" : "rownumber", "DataType":"int", "Properties":{"Ordinal":"0"}},
    { "column" : "rowguid", "DataType":"string", "Properties":{"Ordinal":"1"} }
]
```
````

**Output**

| Name     | Kind | Mapping                                                                                                                                                                          |
|----------|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
| mapping2 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
