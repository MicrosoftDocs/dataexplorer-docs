---
title: .show ingestion time policy command- Azure Data Explorer
description: This article describes the .show ingestion time policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .show ingestion time policy

Display a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tablesto create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column. 

## Syntax

`.show` `table` *TableName* `policy` `ingestiontime` 

### Examples

To show the policy:

```kusto
.show table table_name policy ingestiontime 
```
