---
title: Manage external table mappings - Azure Data Explorer
description: Learn how to manage external table mappings for Azure Blob Storage or Azure Data Lake external tables.
ms.topic: reference
ms.date: 04/09/2023
---
# Manage external table mappings

This article describes how to create a new external table mapping, alter a mapping, show the existing mappings, and drop a mapping. For more information on data mappings, see [Data Mappings](./json-mapping.md).

## .create external table mapping

Create a new external table mapping.

### Syntax

`.create` `external` `table` *ExternalTableName* `mapping` *MappingName* *MappingInJsonFormat*

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|
|*MappingInJsonFormat*|The mapping definition in JSON format.|

### Example

```kusto
.create external table MyExternalTable mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Output**

| Name | Kind | Mapping |
|--|--|--|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .alter external table mapping

Alters an existing mapping.

### Syntax

`.alter` `external` `table` *ExternalTableName* `mapping` *MappingName* *MappingInJsonFormat*

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|
|*MappingInJsonFormat*|The mapping definition in JSON format.|

### Example

```kusto
.alter external table MyExternalTable mapping "Mapping1" '[{"Column": "rownumber", "Properties": {"Path": "$.rownumber"}}, {"Column": "rowguid", "Properties": {"Path": "$.rowguid"}}]'
```

**Output**

| Name | Kind | Mapping |
|--|--|--|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .show external table mappings

Show the mappings for an external table, either the one specified by name or all mappings.

### Syntax

`.show` `external` `table` *ExternalTableName* `mapping` *MappingName*

`.show` `external` `table` *ExternalTableName* `mappings`

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|

### Example

```kusto
.show external table MyExternalTable mapping "Mapping1" 
```

**Output**

| Name | Kind | Mapping |
|--|--|--|
| mapping1 | JSON | [{"ColumnName":"rownumber","Properties":{"Path":"$.rownumber"}},{"ColumnName":"rowguid","Properties":{"Path":"$.rowguid"}}] |

## .drop external table mapping

Drops the mapping.

### Syntax

`.drop` `external` `table` *ExternalTableName* `mapping` *MappingName*

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|The name of the external table to which to assign the mapping.|
|*MappingName*|The name of the mapping.|

### Example

```kusto
.drop external table MyExternalTable mapping "Mapping1" 
```
