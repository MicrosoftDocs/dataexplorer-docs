---
title: .attach database - Azure Data Explorer | Microsoft Docs
description: This article describes .attach database in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .attach database

Attaches a database from persistent storage.
This command is usually used after a database was detached using [`.detach database`](detach-database.md), or for attaching as "read-only" to an existing database managed by another Kusto service instance.

Requires [ClusterAdmin permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.attach` `database` [`metadata`] *DatabaseName* `from` (*BlobContainerUrl*`;`*StorageAccountKey* | *NetworkPath* | *LocalPath*) 
 
** Examples ** 

|||
|---|---|
|`.attach database TestDB from @"https://myaccount.blob.core.windows.net/testdb1;SecretKey"` |Attaches a database from a blob container and loads its contents into memory 
|`.attach database metadata TestDB from @"https://myaccount.blob.core.windows.net/testdb1;SecretKey"` |Attaches a database from a blob container, but doesn't load its contents into memory. When the database data is accessed, or .rebalance extents command is called, data is loaded into memory.



**Return output** 

|Output parameter |Type |Description 
|---|---|---
|Step |String |Database attachment step. The only step returned is 'Metadata deserialization', even when the whole database is loaded into memory. This happens asynchronously. 
|Duration |String |Specifies the period of time the step was executing on the server.
 
**Example output**
 
|Step |Duration 
|---|---
|Metadata deserialization |00:00:00.0320816 