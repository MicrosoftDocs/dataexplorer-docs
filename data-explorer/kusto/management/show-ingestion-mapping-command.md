---
title: .show ingestion mappings - Azure Data Explorer
description: This article describes .show ingestion mappings in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/04/2020
---
# .show ingestion mapping

Shows the ingestion mappings (all or the one specified by name).

* `.show` `table` *TableName* `ingestion` *MappingKind*  `mappings`

* `.show` `table` *TableName* `ingestion` *MappingKind*  `mapping` *MappingName* 

Shows all ingestion mappings from all mapping types:

* `.show` `table` *TableName* `ingestion`  `mappings`

Shows all ingestion mappings on a database:

* `.show` `database` *DatabaseName* `ingestion` *MappingKind* `mappings`

**Example** 
 
```kusto
.show table MyTable ingestion csv mapping "Mapping1" 

.show table MyTable ingestion csv mappings 

.show table MyTable ingestion mappings 

.show database MyDatabase ingestion csv mappings 
```

**Sample output**

| Name     | Kind | Mapping     |
|----------|------|-------------|
| mapping1 | CSV  | `[{"Name":"rownumber","DataType":"int","CsvDataType":null,"Ordinal":0,"ConstValue":null},{"Name":"rowguid","DataType":"string","CsvDataType":null,"Ordinal":1,"ConstValue":null}]` |
