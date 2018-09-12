---
title: Kusto.WebExplorer - Azure Kusto | Microsoft Docs
description: This article describes Kusto.WebExplorer in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto.WebExplorer

Kusto.WebExplorer is a Web UX for querying Kusto.
You can think of it as being the Web counterpart to [Kusto.Explorer](./kusto-explorer.md).

There are two primary ways to use Kusto.WebExplorer with your cluster/database:

1. **Using a browser redirect**: Open a modern browser (such as Microsoft Edge)
   and navigate to `https://CLUSTER.kusto.windows.net/DATABASE`,
   where `CLUSTER` and `DATABASE` are the names of the target cluster and database,
   respectively. (Replace the DNS zone if the target cluster is not in the default
   `kusto.windows.net` zone).

   For example, to query the `Samples` database attached to the `help` cluster
   using Kusto.WebExplorer, click the following link:
   [https://help.kusto.windows.net/Samples](https://help.kusto.windows.net/Samples).

   (Temporarily, for principals that are not in the `microsoft.com` AAD tenant,
   one should add a `tenant=`*TenantId* query paramter as well, otherwise
   Kusto.WebExplorer will attempt to authenticate in the `microsoft.com` tenant
   and fail.)

2. **Using a crafted URI**: Open a modern browser (such as Edge or Chrome,
   but not Internet Explorer) and navigate to `https://aka.ms/kwe?PARAMETERS`,
   where `PARAMETERS` are encoded according to the HTTP standard and have the
   following values supported:


|Name      |Mandatory|Meaning                                   |Example                         |
|----------|---------|------------------------------------------|--------------------------------|
|`cluster` |Yes      |The cluster name or full hostname         |`cluster=help.kusto.windows.net`|
|`database`|Yes      |The (case-sensitive) name of the database |`database=Samples`              |
|`query`   |No       |The query to run initially                |`query=StormEvents%7Ccount`     |
|`q`       |No       |The encoded query (alternative to `query`)|(See below)|
|`sidebar` |No       |Whether to show the sidebase (1, default) or not (0)|`sidebar=0`|

(For how to do query encoding, please see the [deep link REST API](../api/rest/deeplink.md) page.)

For example, the following link queries Kusto.WebExplorer with no sidebar
and runs an initial query:

  [https://aka.ms/kwe?cluster=help&database=Samples&query=StormEvents%7Ccount&sidebar=0](https://aka.ms/kwe?cluster=help&database=Samples&query=StormEvents%7Ccount&sidebar=0)