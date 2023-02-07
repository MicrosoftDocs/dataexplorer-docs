---
title: .create ingestion mapping - Azure Data Explorer
description: This article describes .create ingestion mapping in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/04/2020
---
# .create ingestion mapping

Creates an ingestion mapping that can be associated with a specific format and a specific table or database.

## Permissions

The command to create a database ingestion mapping requires at least [Database Ingestor](access-control/role-based-access-control.md) permissions, and the command to create a table ingestion mapping requires at least [Table Ingestor](access-control/role-based-access-control.md) permissions.

## Syntax

`.create` `table` *TableName* `ingestion` *MappingKind* `mapping` *MappingName* *MappingFormattedAsJson*

`.create` `database` *DatabaseName* `ingestion` *MappingKind* `mapping` *MappingName* *MappingFormattedAsJson*

> [!NOTE]
> * Once created, the mapping can be referenced by its name in ingestion commands, instead of specifying the complete mapping as part of the command.
> * Valid values for _MappingKind_ are: `CSV`, `JSON`, `avro`, `parquet`, and `orc`
> * If a mapping by the same name already exists for the table:
>    * `.create` will fail
>    * `.create-or-alter` will alter the existing mapping
> * If a mapping with the same name is created in both the table scope and the database scope, the mapping in the table scope will have a higher priority.
> * When ingesting into a table and referencing a mapping whose schema does not match the ingested table schema, the ingest operation will fail.
 
## Examples
 
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

.create database MyDatabase ingestion csv mapping "Mapping2"
'['
'   { "column" : "rownumber", "DataType":"int", "Properties":{"Ordinal":"0"}},'
'   { "column" : "rowguid", "DataType":"string", "Properties":{"Ordinal":"1"}}'
']'
```

**Example output**

| Name     | Kind | Mapping                                                                                                                                                                          |
|----------|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
| mapping2 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |

### Example: .create ingestion mapping with escape characters** 
 
```kusto
.create table test_table ingestion json mapping "test_mapping_name"
'['
'{"column":"timeStamp","path":"$[\'timeStamp\']","datatype":"","transform":null},{"column":"name","path":"$[\'name\']","datatype":"","transform":null},{"column":"x-opt-partition-key","path":"$[\'x-opt-partition-key\']","datatype":"","transform":null}'
']'
```

## Next steps

For detailed descriptions of various ingestion mapping formats such as CSV, JSON, Avro, Parquet, and Orc, see [Data mappings](mappings.md).
