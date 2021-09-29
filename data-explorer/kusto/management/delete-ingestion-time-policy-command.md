---
title: .delete ingestion time policy command- Azure Data Explorer
description: This article describes the .delete ingestion time policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .delete ingestion time policy

Delete a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tables to create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column. 

## Syntax

`.delete` `table` *TableName* `policy` `ingestiontime` 

### Example

```kusto
.delete table table_name policy ingestiontime 
```