---
title: Databases - Azure Kusto | Microsoft Docs
description: This article describes Databases in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Databases

## .show database

This command returns a table showing the properties of the context database.

**Syntax**

`.show` `database` [`details` | `identity` | `policies` | `datastats`]

The default call without any options specified is equal to 'identity' option.

**Output for 'identity' option**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |Indicates whether the database version number that the client has is the most recent one. (This field is for internal use and will generally return "True".) 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|CurrentUserIsUnrestrictedViewer |Boolean | Specifies if the current user is an unrestricted viewer on the database.
|DatabaseId |Guid |The database's unique id.

**Output for 'details' option**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |Indicates whether the database version number that the client has is the most recent one. (This field is for internal use and will generally return "True".) 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|AuthorizedPrincipals |String | The database's collection of authorized principals (serialized in JSON format).
|RetentionPolicy |String | The database's Retention policy (serialized in JSON format).
|MergePolicy |String | The database's Extents Merge policy (serialized in JSON format).
|CachingPolicy |String | The database's Caching policy (serialized in JSON format).
|ShardingPolicy |String | The database's Sharding policy (serialized in JSON format).
|StreaminIngestionPolicy |String | The database's Streaming Ingestion policy (serialized in JSON format).
|IngestionBatchingPolicy |String | The database's Ingestion Batching policy (serialized in JSON format).
|TotalSize |Real | The database's extents total size.
|DatabaseId |Guid |The database's unique id.

**Output for 'policies' option**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |Indicates whether the database version number that the client has is the most recent one. (This field is for internal use and will generally return "True".) 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|DatabaseId |Guid |The database's unique id.
|AuthorizedPrincipals |String | The database's collection of authorized principals (serialized in JSON format).
|RetentionPolicy |String | The database's Retention policy (serialized in JSON format).
|MergePolicy |String | The database's Extents Merge policy (serialized in JSON format).
|CachingPolicy |String | The database's Caching policy (serialized in JSON format).
|ShardingPolicy |String | The database's Sharding policy (serialized in JSON format).
|StreaminIngestionPolicy |String | The database's Streaming Ingestion policy (serialized in JSON format).
|IngestionBatchingPolicy |String | The database's Ingestion Batching policy (serialized in JSON format).

**Output for 'datastats' option**

|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |Indicates whether the database version number that the client has is the most recent one. (This field is for internal use and will generally return "True".) 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|DatabaseId |Guid |The database's unique id.
|OriginalSize |Real | The database's extents total original size.
|ExtentSize |Real | The database's extents total size (data + indices).
|CompressedSize |Real | The database's extents total data compressed size.
|IndexSize |Real | The database's extents total index size.
|RowCount |Long | The database's extents total row count.
|HotOriginalSize |Real | The database's hot extents total original size.
|HotExtentSize |Real | The database's hot extents total size (data + indices).
|HotCompressedSize |Real | The database's hot extents total data compressed size.
|HotIndexSize |Real | The database's hot extents total index size.
|HotRowCount |Long | The database's hot extents total row count.

## .show cluster databases

This command returns a table showing all the databases that are currently
attached to the cluster and for which the user invoking the command has
access to. If specific database names are used, only those databases would
be included.

**Syntax**

`.show` `cluster` `databases` [`details` | `identity` | `policies` | `datastats`]

`.show` `cluster` `databases` `(`database1`,` database2`,` ... databaseN`)`

**Output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |Indicates whether the database version number that the client has is the most recent one. (This field is for internal use and will generally return "True".) 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|CurrentUserIsUnrestrictedViewer |Boolean | Specifies if the current user is an unrestricted viewer on the database.
|DatabaseId |Guid |The database's unique id.


## .create database

This command creates a new empty database on the Kusto engine service.
Normally, one creates **persistent databases**, which are stored in durable and
reliable storage. For ad-hoc testing purposes only, Kusto also supports
**volatile databases**, which are not stored in persistent storage and will be
automatically removed on every cluster reconfiguration event (such as a cluster
node being recycled). 

> Note: to create persistent databses in prodcution Kusto engine services, use the [create database command](CM-database.md) provided by cluster management service.

**Syntax**

`.create` `database` *DatabaseName* `persist` `(`*MetadataContainer*`,` *DataContainer* [`,` ...]`)` [`ifnotexists`]
`.create` `database` *DatabaseName* `volatile` [`ifnotexists`]

The first form creates a persistent database with the given name.
*MetadataContainer* (which must be a `string` literal) and *DataContainer*
(also a `string` literal, with support for multiple values) indicate a persistent
storage containers that hold the database's metadata and data, respectively.
For on-premises deployments, the container can be a filesystem path accessible
to all nodes in the cluster. For cloud (Azure) deployments, the container
is an Azure Blob Storage blob container URI, suffixed with a semicolon
and the storage account key.

The second form creates a volatile database with the given name. As mentioned,
this form should only be used for ad-hoc tests.

If the optional flag `ifnotexists` is used, then attempting to create a database
when there's already an existing database with the same name becomes a void
operation that succeeds. Otherwise a failure is returned in such cases. 

Requires [DatabaseCreator permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Examples**

Create a volatile (ephemeral/temporary) database named TestDB;
TestDB will not survive admin node restarts:
 
```kusto
.create database TestDB volatile 
``` 

Create a database with persistent storage located on blob container. The first part of the URI is a pointer to an Azure blob container which will be created for you if it does not exist, while the second (after ';') is the key:

```kusto
.create database TestDB 
    persist (h"https://myaccount.blob.core.windows.net/testdb1md;storage-key-here==",
    h"https://myaccount.blob.core.windows.net/testdb1data;storage-key-here==")  
```
 
Create a database with persistent storage located on local disk. Don't use a local disk if this service is located on Azure:

```kusto
.create database TestDB persist (@"D:\Kusto\TestDB\MD",@"D:\Kusto\TestDB\DATA")
``` 

Create a database with persistent storage located on network disk:

```kusto
.create database TestDB persist (@"\\bi-storage\Kusto\Databases\TestDB\MD",@"\\bi-storage\Kusto\Databases\TestDB\DATA")
```

**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |Name of the created database 
|PersistentPath |String |Persistent path of the created database 
|Created |Boolean |Creation result: true if creation was successful, false if creation failed  
|StoresMetadata |Boolean |true if path will used to store database's metadata, false otherwise 
|StoresData |Boolean |true if path will used to store database's data, false otherwise 
 
**Example output** 

|Database Name |Persistent Path |Created |StoresMetadata |StoresData 
|---|---|---|---|---
|TestDB |D:\Kusto\TestDB\MD |True |True |False 
|TestDB |D:\Kusto\TestDB\DATA |True |False |True 


## .attach database

`.attach` `database` [`metadata`] *DatabaseName* `from` (*BlobContainerUrl*`;`*StorageAccountKey* | *NetworkPath* | *LocalPath*) 

Attaches a database from persistent storage. The command is usually used after database was detached using `.detach database`, or by attaching as a read-only to an existing database managed by another Kusto service instance. 

Requires [ClusterAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).
 
** Examples ** 

|||
|---|---|
|`.attach database TestDB from @"D:\Kusto\TestDB"` |Attaches database from local disk path and loads its contents into the memory 
|`.attach database TestDB from @"\\share\Kusto\Databases\TestDB"` |Attaches database from network share and loads its contents into the memory 
|`.attach database TestDB from @"https://myaccount.blob.core.windows.net/testdb1;SecretKey"` |Attaches database from blob container and loads its contents into the memory 
|`.attach database metadata TestDB from @"https://myaccount.blob.core.windows.net/testdb1;SecretKey"` |Attaches database from blob container, but doesn't load its contents into the memory. Once the database data is accessed, or .rebalance extents command is called - data will be loaded into the memory. 
 
**Return output** 

|Output parameter |Type |Description 
|---|---|---
|Step |String |Database attachment step. Right now the only step returned is 'Metadata deserialization', even when the whole database is being loaded into memory - this happens asynchronously  
|Duration |String |Specifies the period of time the step was executing on the server 
 
**Example output**
 
|Step |Duration 
|---|---
|Metadata deserialization |00:00:00.0320816 


## .detach database

`.detach` `database` *DatabaseName*

Removes database from Kusto service. If the database has persistent storage, it can be re-attached using `.attach database` command  


Requires [ClusterAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).
 
**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|Table |String |Name of the table that was detached as the result of the database detach 
|NumberOfRemovedExtents |String |Amount of extents that were associated with the table and were detached as well 

## .alter database prettyname

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

Alters a database's pretty (friendly) name.

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).
 
**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database.
|PrettyName |String |The pretty name of the database.

## .drop database prettyname

`.drop` `database` *DatabaseName* `prettyname`

Drops a database's pretty (friendly) name.

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).
 
**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database.
|PrettyName |String |The pretty name of the database (null after drop operation).

## .alter database persist metadata

`.alter` `database` *DatabaseName* `persist` `metadata` (*BlobContainerUrl*`;`*StorageAccountKey* | *NetworkPath* | *LocalPath*) 

Alters the database metadata container, and writes the database metadata from memory to the specified container (The pointer to the persistent storage where the database metadata is stored)

**Examples**
```kusto
.alter database TestDB  persist metadata h@"https://myaccount.blob.core.windows.net/testdb1;SecretKey"
.alter database TestDB  persist metadata h@"D:\Kusto\TestDB" 
```

**Return output**

Output parameter |Type |Description 
---|---|---
Moniker |Guid |A unique identifier for the extent container 
Url |String |Indicates the persistent storage URI which the container is linked to 
State |String |Indicates the state of the container: `{ReadWrite, ReadOnly, SoftDelete}` 
CreatedOn |DateTime |Indicates the UTC time of when the container was created 
MaxDateTime |DateTime |Indicates the Max of the container's extents' DateTime property 
IsRecyclable |Boolean |Indicates whether or not the container can be periodically recycled by the Data Management service 
StoresDatabaseMetadata |Boolean |Indicates whether or not the container stores the database's metadata (there is exactly one container per database which has this set to 'true')
HardDeletePeriod |TimeSpan |Indicates the time span after which the extent container would get hard deleted from storage. 

**Example output**

|Moniker |Url |State |Created On |Max Date Time |Is Recyclable |Stores Database Metadata 
|---|---|---|---|---|---|---
|6b31341b-5f60-f1c03d8b76f3 |https://myaccount.blob.core.windows.net/testdb1 | ReadWrite |2015-05-07 11:29:01.7902736 |2015-05-13 08:55:31.9366788 |false |true 

## .set access

`.set` `access` *DatabaseName* `to` (`readonly` | `readwrite`) 

Set the mode in which the database is attached to the cluster.

**NOTE:** A database which is set to have `ReadOnly` access can't be updated - neither the data in it nor its metadata.
For example: no ingestions can be done into tables in it, no policies can be altered, and no data will be soft-deleted or hard-deleted (i.e. retention policies will not be in effect, until it has its state set back to `ReadWrite`).
 
**Example** 

```kusto
.set access TestDB to readwrite 
```
 
**Return output**

|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |Name of the database to set the access mode 
|AccessMode |String |The result access mode. 
 
**Example output**

|DatabaseName |AccessMode
|---|--- 
|TestDB |ReadWrite 

## .show databases schema

`.show` `database` *DatabaseName* `schema` [`details`] [`if_later_than` *"Version"*] 

`.show` `database` *DatabaseName* `schema` [`if_later_than` *"Version"*]  `as` `json`
 
`.show` `databases` `(` *DatabaseName1*`,` ...`)` `schema` [`details` | `as` `json`]
 
`.show` `databases` `(` *DatabaseName1* if_later_than *"Version"*`,` ...`)` `schema` [`details` | `as` `json`]

Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object.
When used with a version, the database is only returned if it is of a later version than the version provided.
Note the version should only be provided in the "vMM.mm" format. MM represents the major version and mm represent the minor version.
 
**Example** 
 
 The database 'TestDB' has 1 table called 'Events'.

```kusto
.show database TestDB schema 
```
**Example output**

|DatabaseName|TableName|ColumnName|ColumnType|IsDefaultTable|IsDefaultColumn|PrettyName|Version
|---|---|---|---|---|---|---|--- 
|TestDB||||False|False||v.1.1		
|TestDB|Events|||True|False||		
|TestDB|Events|	Name|System.String|True|False||		
|TestDB|Events|	StartTime|	System.DateTime|True|False||	
|TestDB|Events|	EndTime|	System.DateTime|True|False||		
|TestDB|Events|	City|	System.String|True|	False||		
|TestDB|Events|	SessionId|	System.Int32|True|	True|| 


**Example** 
 
```kusto
.show database TestDB schema if_later_than "v1.0" 
```
**Example output**

|DatabaseName|TableName|ColumnName|ColumnType|IsDefaultTable|IsDefaultColumn|PrettyName|Version
|---|---|---|---|---|---|---|--- 
|TestDB||||False|False||v.1.1		
|TestDB|Events|||True|False||		
|TestDB|Events|	Name|System.String|True|False||		
|TestDB|Events|	StartTime|	System.DateTime|True|False||	
|TestDB|Events|	EndTime|	System.DateTime|True|False||		
|TestDB|Events|	City|	System.String|True|	False||		
|TestDB|Events|	SessionId|	System.Int32|True|	True||  


Since we provided a version lower than the current database version, the 'TestDB' schema was returned. 
Had we run the command with an equal (or higher) version, we would have gotten an empty result.

**Example** 
 
```kusto
.show database TestDB schema as json
```
**Example output**

|DatabaseSchema
|---
|"{""Databases"":{""TestDB"":{""Name"":""TestDB"",""Tables"":{""Events"":{""Name"":""Events"",""DefaultColumn"":null,""OrderedColumns"":[{""Name"":""Name"",""Type"":""System.String""},{""Name"":""StartTime"",""Type"":""System.DateTime""},{""Name"":""EndTime"",""Type"":""System.DateTime""},{""Name"":""City"",""Type"":""System.String""},{""Name"":""SessionId"",""Type"":""System.Int32""}]}},""PrettyName"":null,""MajorVersion"":1,""MinorVersion"":1,""Functions"":{}}}}"


## .show database schema as csl script

`.show` `database` [*DatabaseName*] `schema` [`if_later_than` *"Version"*]  `as` `csl` `script`

Generates a csl script with all the required commands to create a copy of the given (or current) database schema.
The script, returned as a string, will contain:
1. Commands to create the database and set its pretty name, if any. The generated command will create a volatile database.
2. Command to create all the tables in the database
3. Commands to alter to database/tables/columns policies to match the original policies