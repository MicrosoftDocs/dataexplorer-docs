---
title: SQL to Kusto query translation - Azure Data Explorer | Microsoft Docs
description: This article describes SQL to Kusto query translation in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# SQL to Kusto query translation

Kusto supports subset of SQL language. See the list of [SQL known issues](../api/tds/sqlknownissues.md) for the full list of unsupported features.

Primary language to interact with Kusto is KQL (Kusto Query Language), and in order to make transition and learning experience easier, you can use Kusto service to translate SQL queries to KQL. This can be achieved by sending SQL query to Kusto services prefixing it with 'EXPLAIN' verb.

For example:

```kusto
EXPLAIN 
SELECT COUNT_BIG(*) as C FROM StormEvents 
```

|Query|
|---|
|StormEvents<br>| summarize C=count()<br>| project C|

