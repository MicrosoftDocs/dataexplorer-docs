---
title: .drop ingestion mapping - Azure Data Explorer | Microsoft Docs
description: This article describes .drop ingestion mapping in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/04/2020
---
# .drop ingestion mapping

Drops the ingestion mapping from the database.
 
`.drop` `table` *TableName* `ingestion` *MappingKind*  `mapping` *MappingName* 

**Example** 

```kusto
.drop table MyTable ingestion csv mapping "Mapping1" 

.drop table MyTable ingestion json mapping "Mapping1" 
```
