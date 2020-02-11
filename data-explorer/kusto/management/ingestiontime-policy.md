---
title: IngestionTime policy - Azure Data Explorer | Microsoft Docs
description: This article describes IngestionTime policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2020
---
# IngestionTime policy

IngestionTime policy is an optional policy set on tables (it is enabled by default).
it provides the approximate time of ingestion of the records into a table.

Ingestion time value can be accessed at query time using `ingestion_time()` function.

```
T | extend ingestionTime = ingestion_time()
```

To enable/disable the policy:

```
.alter table table_name policy ingestiontime true
```

To enable/disable the policy of multiple tables:

```
.alter tables (table_name [, ...]) policy ingestiontime true
```

To view the policy:

```
.show table table_name policy ingestiontime  

.show table * policy ingestiontime  
```

To delete the policy (equal to disabling):

```
.delete table table_name policy ingestiontime  
```