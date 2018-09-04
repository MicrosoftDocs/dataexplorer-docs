---
title: Metadata queries - Azure Kusto | Microsoft Docs
description: This article describes Metadata queries in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Metadata queries

Metadata queries extract information regarding the service and its databases and tables. These queries are primarily for the management of the service and databases, rather than for researching data. 

All metadata query commands start with the `.show` keyword. 

|||
|---|---
|**Databases**|
|`.show databases`| Enumerate the databases currently attached to the cluster. 
|`.show tables` |Enumerate the tables for all databases currently attached to the cluster. 
|`.show table`| Enumerate the rows of a particular table and its data statistics. 
|`.show schema`| Enumerate all databases currently attached to the cluster, together with their tables and their columns. 
| **Data**|
|`.show database extents`| Get a list of extents (data shards) in the database. 
|`.show extentcontainers`| Get a list of extent containers for a selected database. 


Metadata query commands produce a data table that can serve as a (temporary) source for follow-up queries. For example, one can apply the data query count operator to pretty much any metadata query command, which counts the number of records in the resulting record set, use the filter operator to filter out unwanted records, etc.

For many of these commands, [access permissions](https://kusdoc2.azurewebsites.net/docs/controlCommands/permissions.html) are required according to the [authorization model](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).