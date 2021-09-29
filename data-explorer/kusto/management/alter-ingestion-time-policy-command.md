---
title: .alter ingestion time policy command- Azure Data Explorer
description: This article describes the .alter ingestion time policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .alter ingestion time policy

Change a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tablesto create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column. 

## Syntax

`.alter` `table` *TableName* `policy` `ingestiontime` 

### Examples

To enable/disable the policy:

```kusto
.alter table table_name policy ingestiontime true
```

To enable/disable the policy of multiple tables:

```kusto
.alter tables (table_name [, ...]) policy ingestiontime true
```