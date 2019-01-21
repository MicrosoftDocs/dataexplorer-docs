---
title: IngestionTime policy - Azure Data Explorer | Microsoft Docs
description: This article describes IngestionTime policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# IngestionTime policy

IngestionTime policy is an optional policy set on tables (off by default). Once enabled, it provides the approximate time of ingestion of the records into a table.

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