---
title: Merge policy management - Azure Data Explorer | Microsoft Docs
description: This article describes Merge policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# Merge policy command

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
'{'
'  "RowCountUpperBoundForMerge": 16000000,'
'  "OriginalSizeMBUpperBoundForMerge": 0,'
'  "MaxExtentsToMerge": 100,'
'  "LoopPeriod": "01:00:00",'
'  "MaxRangeInHours": 24,'
'  "AllowRebuild": true,'
'  "AllowMerge": true,'
'  "Lookback": {'
'    "Kind": "Default"'
'  }'
'}'
```

#### 2. Setting all properties of the policy explicitly, at database level:

```kusto
.alter database [database_name] policy merge 
'{'
'  "RowCountUpperBoundForMerge": 16000000,'
'  "OriginalSizeMBUpperBoundForMerge": 0,'
'  "MaxExtentsToMerge": 100,'
'  "LoopPeriod": "01:00:00",'
'  "MaxRangeInHours": 24,'
'  "AllowRebuild": true,'
'  "AllowMerge": true,'
'  "Lookback": {'
'    "Kind": "Default"'
'  }'
'}'
```

#### 3. Setting the *default* merge policy at database level:

```kusto
.alter database [database_name] policy merge '{}'
```

#### 4. Altering a single property of the policy at database level, keeping all other properties as-is:

```kusto
.alter-merge database [database_name] policy merge
'{'
    '"MaxRangeInHours": 24'
'}'
```

#### 5. Altering a single property of the policy at table level, keeping all other properties as-is:

```kusto
.alter-merge table [table_name] policy merge
'{'
    '"MaxRangeInHours": 24'
'}'
```

All of the above returns the updated extents merge policy for the entity (database or table specified as a qualified name) as their output.

Changes to the policy could take up to 1 hour to take effect.

## delete policy of merge

```kusto
.delete table [table_name] policy merge

.delete database [database_name] policy merge

```

The command deletes the current merge policy for the given entity.
