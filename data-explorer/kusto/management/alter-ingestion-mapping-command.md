---
title: ".alter ingestion mapping - Azure Data Explorer"
description: "This article describes .alter ingestion mapping in Azure Data Explorer."
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/29/2022
---
# .alter ingestion mapping

Alters an existing ingestion mapping that is associated with a specific table/database and a specific format (full mapping replace).

**Syntax**

`.alter` `table` *TableName* `ingestion` *MappingKind* `mapping` *MappingName* *ArrayOfMappingObjects*

`.alter` `database` *DatabaseName* `ingestion` *MappingKind* `mapping` *MappingName* *ArrayOfMappingObjects*

> [!NOTE]
> * This mapping can be referenced by its name by ingestion commands, instead of specifying the complete mapping as part of the command.
> * Valid values for _MappingKind_ are: `CSV`, `JSON`, `avro`, `parquet`, and `orc`.

## Arguments

* *TableName* - Specify the name of the table.
* *DatabaseName* - Specify the name of the database.
* *MappingKind* - Specify the type of mapping.
* *MappingName* - Specify the name of the mapping.
* *ArrayOfMappingObjects* - An array with one or more mapping objects defined.

**Example** 
 
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
    { "column" : "rownumber", "datatype" : "int", "Properties":{"Path":"$.rownumber"}},
    { "column" : "rowguid", "Properties":{"Path":"$.rowguid"}}
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

**Sample output**

| Name     | Kind | Mapping                                                                                                                                                                          |
|----------|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
| mapping2 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
