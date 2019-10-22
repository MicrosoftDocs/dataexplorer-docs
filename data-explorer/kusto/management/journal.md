---
title: Journal management - Azure Data Explorer | Microsoft Docs
description: This article describes Journal management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019

---
# Journal management

 `Journal` contains information about metadata operations performed on the Kusto database.

The metadata operations could be a result of control command executed by user or internal control commands executed by the system (like drop extents by retention).

**Notes:**

- Metadata operations which encompass *adding* new extents (like `.ingest`, `.append`, `.move` and others) will not have matching events shown in the `Journal`.
- The data in the columns of the result-set, as well as the format in which it is presented, are *not* contractual, and thus taking a dependency on them is *not* recommended.

|Event        |EventTimestamp     |Database  |EntityName|UpdatedEntityName|EntityVersion|EntityContainerName|
|-------------|-------------------|----------|----------|-----------------|-------------|-------------------|
|CREATE-TABLE |2017-01-05 14:25:07|InternalDb|MyTable1  |MyTable1         |v7.0         |InternalDb         |
|RENAME-TABLE |2017-01-13 10:30:01|InternalDb|MyTable1  |MyTable2         |v8.0         |InternalDb         |  

|OriginalEntityState|UpdatedEntityState                                              |ChangeCommand                                                                                                          |Principal            |
|-------------------|----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------|
|.           		|Name: MyTable1, Attributes: Name='[MyTable1].[col1]', Type='I32'|.create table MyTable1 (col1:int)                                                                                      |imike@fabrikam.com
|.          		|The db properties (too long to be displayed here)               |.create database TestDB persist (@"https://imfbkm.blob.core.windows.net/md", @"https://imfbkm.blob.core.windows.net/data")|AAD app id=76263cdb-abcd-545644e9c404
|Name: MyTable1, Attributes: Name='[MyTable1].[col1]', Type='I32'|Name: MyTable2, Attributes: Name='[MyTable1].[col1]', Type='I32'|.rename table MyTable1 to MyTable2|rdmik@fabrikam.com


Event - the metadata event name.

EventTimestamp - the event timestamp.

Database - metadata of this database was changed following the event.

EntityName - the entity name, the operation was executed on, before the change.

UpdatedEntityName - the new entity name after the change.

EntityVersion - the new metadata version (db/cluster) following the change.

EntityContainerName - the entity container name (i.e.: entity=column, container=table).

OriginalEntityState - the state of the entity (entity properties) before the change.

UpdatedEntityState - the new state after the change.

ChangeCommand - the executed control command which triggered the metadata change.

Principal - the principal (user/app) which executed the control command.
					
## .show journal

The `.show journal` command returns a list of metadata changes, on databases/cluster the user has admin access.

**Permissions**

Everyone (cluster access) can execute the command. 

Results returned will include: 
1. All journal entries of the user executing the command. 
2. All journal entries of databases which the user executing the command has admin access to. 
3. All cluster journal entries if the user executing the command is a cluster admin. 

## .show database *DatabaseName* journal 

The `.show` `database` *DatabaseName* `journal` command returns journal for the specific database metadata changes.

**Permissions**

Everyone (cluster access) can execute the command. Results returned will include: 
1. All journal entries of database *DatabaseName* if  the user executing the command is a database admin in *DatabaseName*. 
2. Otherwise, all the journal entries of database *DatabaseName* and of the user executing the command. 

