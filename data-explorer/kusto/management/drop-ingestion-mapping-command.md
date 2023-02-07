---
title: .drop ingestion mapping - Azure Data Explorer
description: This article describes .drop ingestion mapping in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/04/2020
---
# .drop ingestion mapping

Drops the ingestion mapping from the database/table.

## Permissions

The command to drop a database ingestion mapping requires at least [Database Ingestor](access-control/role-based-access-control.md) permissions, and the command to drop a table ingestion mapping requires at least [Table Ingestor](access-control/role-based-access-control.md) permissions.

## Syntax

`.drop` `table` *TableName* `ingestion` *MappingKind*  `mapping` *MappingName* 

`.drop` `database` *DatabaseName* `ingestion` *MappingKind*  `mapping` *MappingName* 

## Example

```kusto
.drop table MyTable ingestion csv mapping "Mapping1" 

.drop table MyTable ingestion json mapping "Mapping1" 

.drop database MyDatabase ingestion csv mapping "Mapping2" 
```
