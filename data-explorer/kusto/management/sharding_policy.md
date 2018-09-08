---
title: Sharding policy control commands - Azure Kusto | Microsoft Docs
description: This article describes Sharding policy control commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Sharding policy control commands

## show policy of sharding

```kusto
.show table [table_name] policy sharding 

.show table * policy sharding 

.show database [database_name] policy sharding
```

Displays the current sharding policy for the database or table.
Shows all policies of the given entity type (database or table) if the given name is '*'.

**Output**

|Policy Name | Entity Name | Policy | Child entities | Entity Type
|---|---|---|---|---
|ExtentsShardingPolicy | Database / Table name | Json format string that represents the policy | A list of tables (for a database)|Database &#124; Table


## alter policy of sharding

Examples:

1. Setting all properties of the policy explicitly, at table level:
```kusto
.alter table [table_name] policy sharding 
@'{ "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048}'
```

2. Setting all properties of the policy explicitly, at database level:
```kusto
.alter database [database_name] policy sharding 
@'{ "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048}'
```

3. Setting the *default* sharding policy at database level:
```kusto
.alter database [database_name] policy sharding @'{}'
```

4. Altering a single property of the policy at database level, keeping all other properties as-is:
```kusto
.alter-merge database [database_name] policy sharding 
@'{ "MaxExtentSizeInMb": 1024}'
```

5. Altering a single property of the policy at table level, keeping all other properties as-is:
```kusto
.alter-merge table [table_name] policy sharding 
@'{ "MaxRowCount": 750000}'
```

All of the above returns the updated extents sharding policy for the element (database or table specified as a qualified name) as their output.

## delete policy of sharding

```kusto
.delete table [table_name] policy sharding 

.delete database [database_name] policy sharding 

```

The command deletes the current sharding policy for the given entity.