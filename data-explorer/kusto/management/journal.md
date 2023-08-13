---
title:  Journal management
description: This article describes Journal management in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/25/2023
---
# Journal management

`Journal` contains information about metadata operations done on your database.

The metadata operations can result from a management command that a user executed, or internal management commands that the system executed, such as drop extents by retention.

> [!NOTE]
> * Metadata operations that encompass *adding* new extents, such as `.ingest`, `.append`, `.move` and others, will not have matching events shown in the `Journal`.
> * The data in the columns of the result-set, as well as the format in which it's presented, isn't contractual. 
  Taking a dependency on them isn't recommended.

|Event        |EventTimestamp     |Database  |EntityName|UpdatedEntityName|EntityVersion|EntityContainerName|
|-------------|-------------------|----------|----------|-----------------|-------------|-------------------|
|CREATE-TABLE |2017-01-05 14:25:07|InternalDb|MyTable1  |MyTable1         |v7.0         |InternalDb         |
|RENAME-TABLE |2017-01-13 10:30:01|InternalDb|MyTable1  |MyTable2         |v8.0         |InternalDb         |  

|OriginalEntityState|UpdatedEntityState                                              |ChangeCommand                                                                                                          |Principal            |
|-------------------|----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------|
|.               |Name: MyTable1, Attributes: Name='[MyTable1].[col1]', Type='I32'|.create table MyTable1 (col1:int)                                                                                      |imike@fabrikam.com
|.              |The database properties (too long to be displayed here)         |.create database TestDB persist (@"https://imfbkm.blob.core.windows.net/md", @"https://imfbkm.blob.core.windows.net/data")|Azure AD app id=76263cdb-abcd-545644e9c404
|Name: MyTable1, Attributes: Name='[MyTable1].[col1]', Type='I32'|Name: MyTable2, Attributes: Name='[MyTable1].[col1]', Type='I32'|.rename table MyTable1 to MyTable2|rdmik@fabrikam.com

|Item                 |Description                                                              |                                
|---------------------|-------------------------------------------------------------------------|
|Event                |The metadata event name                                                  |
|EventTimestamp       |The event timestamp                                                      |                        
|Database             |Metadata of this database was changed following the event                |
|EntityName           |The entity name that the operation was executed on, before the change    |
|UpdatedEntityName    |The new entity name after the change                                     |
|EntityVersion        |The new metadata version (db/cluster) following the change               |
|EntityContainerName  |The entity container name (entity=column, container=table)               |
|OriginalEntityState  |The state of the entity (entity properties) before the change            |
|UpdatedEntityState   |The new state after the change                                           |
|ChangeCommand        |The executed management command that triggered the metadata change          |
|Principal            |The principal (user/app) that executed the management command               |
  
## .show journal

The `.show journal` command returns a list of metadata changes on databases or the cluster that the user has admin access to.

**Permissions**

Everyone (cluster access) can execute the command. 

Results returned will include: 
- All journal entries of the user executing the command. 
- All journal entries of databases that the user executing the command has admin access to. 
- All cluster journal entries if the user executing the command is a cluster admin. 

## .show database *DatabaseName* journal 

The `.show` `database` *DatabaseName* `journal` command returns journal for the specific database metadata changes.

**Permissions**

Everyone (cluster access) can execute the command. 
Results returned include: 
- All journal entries of database *DatabaseName* if the user executing the command is a database admin in *DatabaseName*. 
- Otherwise, all the journal entries of database `DatabaseName` and of the user executing the command. 
