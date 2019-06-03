---
title: project-away operator - Azure Data Explorer | Microsoft Docs
description: This article describes project-away operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/30/2019
---
# project-away operator

Select what columns in the input to exclude from the output

```kusto
T | project-away price, quantity
```

The order of the columns in the result is determined by their original order in the table. Only the columns that were specified as arguments are dropped. The other columns are included in the result.  (See also `project`.)

**Syntax**

*T* `| project-away` *ColumnName* [`,` ...]

**Arguments**

* *T*: The input table
* *ColumnName:* The name of a column to remove from the output. 

**Returns**

A table with columns that were not named as arguments. Contains same number of rows as the input table.

**Tips**

* Use [`project-rename`](projectrenameoperator.md) instead of `project-away` if you also want to rename some of the columns.

* You can `project-away` any columns that are present in the original table or that were computed as part of the query.


**Examples**

The input table `T` has three columns of type `int`: `A`, `B`, and `C`.

```kusto
T | project-away C    // Removes column C from the output
```

This query returns the table with columns `A`, and `B`. 

Consider the example for [`parse`](parseoperator.md). 
The column `eventText` of table `Traces` contains
strings of the form `Event: NotifySliceRelease (resourceName={0}, totalSlices= {1}, sliceNumber={2}, lockTime={3}, releaseTime={4}, previousLockTime={5})`.
The operation below will extend the table with 6 columns: `resourceName` , `totalSlices`, `sliceNumber`, `lockTime `, `releaseTime`, `previouLockTime`, 
 `Month` and `Day`, excluding the original `eventText` column.

```kusto
Traces  
| parse eventText with * "resourceName=" resourceName ", totalSlices=" totalSlices:long * "sliceNumber=" sliceNumber:long * "lockTime=" lockTime ", releaseTime=" releaseTime:date "," * "previousLockTime=" previousLockTime:date ")" *  
| project-away eventText
```