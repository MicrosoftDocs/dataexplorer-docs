---
title: RowOrder policy - Azure Data Explorer | Microsoft Docs
description: This article describes RowOrder policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2020
---
# RowOrder policy

This article describes control commands used for creating and altering [row order policy](../concepts/roworderpolicy.md).

## Show RowOrder policy

```
.show table <table_name> policy roworder

.show table * policy roworder
```

## Delete RowOrder policy

```
.delete table <table_name> policy roworder
```

## Alter RowOrder policy

```
.alter table <table_name> policy roworder (<row_order_policy>)

.alter tables (<table_name> [, ...]) policy roworder (<row_order_policy>)

.alter-merge table <table_name> policy roworder (<row_order_policy>)
```

**Examples**

The following example sets the row order policy to be on the `TenantId` column (ascending) as
a primary key, and on the `Timestamp` column (ascending) as the secondary key; it then queries the policy:

```
.alter table events policy roworder (TenantId asc, Timestamp desc)

.alter tables (events1, events2, events3) policy roworder (TenantId asc, Timestamp desc)

.show table events policy roworder 
```

|TableName|RowOrderPolicy| 
|---|---|
|events|(TenantId asc, Timestamp desc)| 