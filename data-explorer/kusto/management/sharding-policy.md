---
title: Sharding policy management - Azure Data Explorer | Microsoft Docs
description: This article describes Sharding policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019
---
# Sharding policy management

## show policy

```kusto
.show table [table_name] policy sharding

.show table * policy sharding

.show database [database_name] policy sharding
```

`Show` policy displays the sharding policy for the database or table. It shows all policies of the given entity type (database or table) if the given name is '*'.

### Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|ExtentsShardingPolicy | database / table name | json format string that represents the policy | list of tables (for a database)|database / table

## alter policy

### Examples

The following examples return the updated extents sharding policy for the entity, with database or table specified as a qualified name, as their output.

#### Setting all properties of the policy explicitly at table level

```kusto
.alter table [table_name] policy sharding 
@'{ "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048}'
```

#### Setting all properties of the policy explicitly at database level

```kusto
.alter database [database_name] policy sharding
@'{ "MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048}'
```

#### Setting the *default* sharding policy at database level

```kusto
.alter database [database_name] policy sharding @'{}'
```

#### Altering a single property of the policy at database level 

Keep all other properties as-is.

```kusto
.alter-merge database [database_name] policy sharding
@'{ "MaxExtentSizeInMb": 1024}'
```

#### Altering a single property of the policy at table level

Keep all other properties as-is

```kusto
.alter-merge table [table_name] policy sharding
@'{ "MaxRowCount": 750000}'
```

## delete policy

```kusto
.delete table [table_name] policy sharding

.delete database [database_name] policy sharding
```

The command deletes the current sharding policy for the given entity.