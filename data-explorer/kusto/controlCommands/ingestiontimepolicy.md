---
title: IngestionTime policy - Azure Kusto | Microsoft Docs
description: This article describes IngestionTime policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# IngestionTime policy

IngestionTime policy is an optional policy set on tables. It adds an additional column (which is hidden by default) that provides the approximate
time of ingestion into Kusto. To expose that column, we introduce a new function:

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