---
title: Merge policy management - Azure Data Explorer | Microsoft Docs
description: This article describes Merge policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019
---
# Merge policy management

## show policy

```kusto
.show table [table_name] policy merge

.show table * policy merge

.show database [database_name] policy merge

.show database * policy merge
```

Displays the current merge policy for the database or table.
Shows all policies of the given entity type (database or table) if the given name is '*'.

### Output

|Policy Name | Entity Name | Policy | Child entities | Entity Type
|---|---|---|---|---
|ExtentsMergePolicy | Database / Table name | a JSON-formatted string that represents the policy | A list of tables (for a database)|Database &#124; Table

## alter policy

### Examples

#### 1. Setting all properties of the policy explicitly, at table level:

```kusto
.alter table [table_name] policy merge 
@'{'
    '"ExtentSizeTargetInMb": 1024,'
    '"OriginalSizeInMbUpperBoundForRebuild": 2048,'
    '"RowCountUpperBoundForRebuild": 750000, '
    '"RowCountUpperBoundForMerge": 0, '
    '"MaxExtentsToMerge": 100, '
    '"LoopPeriod": "01:00:00", '
    '"MaxRangeInHours": 8, '
    '"AllowRebuild": true,'
    '"AllowMerge": true '
'}'
```

#### 2. Setting all properties of the policy explicitly, at database level:

```kusto
.alter database [database_name] policy merge 
@'{'
    '"ExtentSizeTargetInMb": 1024,'
    '"OriginalSizeInMbUpperBoundForRebuild": 2048,'
    '"RowCountUpperBoundForRebuild": 750000,'
    '"RowCountUpperBoundForMerge": 0,'
    '"MaxExtentsToMerge": 100,'
    '"LoopPeriod": "01:00:00",'
    '"MaxRangeInHours": 8,'
    '"AllowRebuild": true,'
    '"AllowMerge": true'
'}'
```

#### 3. Setting the *default* merge policy at database level:

```kusto
.alter database [database_name] policy merge '{}'
```

#### 4. Altering a single property of the policy at database level, keeping all other properties as-is:

```kusto
.alter-merge database [database_name] policy merge
@'{'
    '"ExtentSizeTargetInMb": 1024'
'}'
```

#### 5. Altering a single property of the policy at table level, keeping all other properties as-is:

```kusto
.alter-merge table [table_name] policy merge
@'{'
    '"RowCountUpperBoundForRebuild": 750000'
'}'
```

All of the above returns the updated extents merge policy for the entity (database or table specified as a qualified name) as their output.

## delete policy of merge

```kusto
.delete table [table_name] policy merge

.delete database [database_name] policy merge

```

The command deletes the current merge policy for the given entity.