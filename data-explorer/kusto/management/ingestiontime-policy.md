---
title: Kusto IngestionTime policy management - Azure Data Explorer
description: This article describes IngestionTime policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# ingestiontime policy command

IngestionTime policy is an optional policy set on tables (it is enabled by default).
it provides the approximate time of ingestion of the records into a table.

Ingestion time value can be accessed at query time using `ingestion_time()` function.

```kusto
T | extend ingestionTime = ingestion_time()
```

To enable/disable the policy:
```kusto
.alter table table_name policy ingestiontime true
```

To enable/disable the policy of multiple tables:
```kusto
.alter tables (table_name [, ...]) policy ingestiontime true
```

To view the policy:
```kusto
.show table table_name policy ingestiontime  

.show table * policy ingestiontime  
```

To delete the policy (equal to disabling):
```kusto
.delete table table_name policy ingestiontime  
```