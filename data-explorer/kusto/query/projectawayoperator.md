---
title: project-away operator - Azure Kusto | Microsoft Docs
description: This article describes project-away operator in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# project-away operator

Select what  columns to exclude from the input.

```kusto
T | project-away price, quantity
```

The order of the columns in the result is specified by their original order in the table. Only the columns that were specified as arguments are dropped: any others are included in the result.  (See also `project`.)

**Syntax**

*T* `| project-away` *ColumnName* [`,` ...]

**Arguments**

* *T*: The input table.
* *ColumnName:* The name of a column to remove from the output. 

**Returns**

A table that has the columns that were not named as arguments, and as many rows as the input table.

**Tips**

* Use [`project-rename`](projectrenameoperator.md) instead if you also want to rename some of the columns.

* You can project-away any columns that are present in the original table or that were computed as part of the query.


**Examples**

The input table `T` has three columns of type `int`: `A`, `B`, and `C`. 

```kusto
T | project-away C    // Removes column C from the output
```

Returns the table only with columns `A`, `B`. 

Consider the example for [`parse`](parseoperator.md). 
The column `eventText` of table `Traces` contains
strings of the form `Event: NotifySliceRelease (resourceName={0}, totalSlices= {1}, sliceNumber={2}, lockTime={3}, releaseTime={4}, previousLockTime={5})`.
The operation below will extend the table with 6 columns: `resourceName` , `totalSlices`, `sliceNumber`, `lockTime `, `releaseTime`, `previouLockTime`, 
 `Month` and `Day`, excluding the original 'evenText' column.

```kusto
Traces  
| parse eventText with * "resourceName=" resourceName ", totalSlices=" totalSlices:long * "sliceNumber=" sliceNumber:long * "lockTime=" lockTime ", releaseTime=" releaseTime:date "," * "previousLockTime=" previouLockTime:date ")" *  
| project-away eventText
```