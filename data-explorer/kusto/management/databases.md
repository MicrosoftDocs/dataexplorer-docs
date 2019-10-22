---
title: Databases management - Azure Data Explorer | Microsoft Docs
description: This article describes Databases management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/11/2019
---
# Databases management

## .show databases

This command returns a table in which every record corresponds to a database in the cluster
that the user has access to.

** Syntax

`.show` `database`

**Output schema**

|Column name       |Column type|Description                                                                  |
|------------------|-----------|-----------------------------------------------------------------------------|
|DatabaseName      |`string`   |The name of the database as attached to the cluster.                         |
|PersistentStorage |`string`   |The persistent storage "root" of the database. (For internal use only.)      |
|Version           |`string`   |The version of the database. (For internal use only.)                        |
|IsCurrent         |`bool`     |Whether this database is the database context of the request.                |
|DatabaseAccessMode|`string`   |One of `ReadWrite`, `ReadOnly`, `ReadOnlyFollowing`, or `ReadWriteEphemeral`.|
|PrettyName        |`string`   |The pretty name, if any, of the database.                                    |
|ReservedSlot1     |`bool`     |Reserved. (For internal use only.)                                           |
|DatabaseId        |`guid`     |A globally-unique identifier for the database. (For internal use only.)      |

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
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. 
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
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|AuthorizedPrincipals |String | The database's collection of authorized principals (serialized in JSON format).
|RetentionPolicy |String | The database's Retention policy (serialized in JSON format).
|MergePolicy |String | The database's Extents Merge policy (serialized in JSON format).
|CachingPolicy |String | The database's Caching policy (serialized in JSON format).
|ShardingPolicy |String | The database's Sharding policy (serialized in JSON format).
|StreamingIngestionPolicy |String | The database's Streaming Ingestion policy (serialized in JSON format).
|IngestionBatchingPolicy |String | The database's Ingestion Batching policy (serialized in JSON format).
|TotalSize |Real | The database's extents total size.
|DatabaseId |Guid |The database's unique id.

**Output for 'policies' option**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|DatabaseId |Guid |The database's unique id.
|AuthorizedPrincipals |String | The database's collection of authorized principals (serialized in JSON format).
|RetentionPolicy |String | The database's Retention policy (serialized in JSON format).
|MergePolicy |String | The database's Extents Merge policy (serialized in JSON format).
|CachingPolicy |String | The database's Caching policy (serialized in JSON format).
|ShardingPolicy |String | The database's Sharding policy (serialized in JSON format).
|StreamingIngestionPolicy |String | The database's Streaming Ingestion policy (serialized in JSON format).
|IngestionBatchingPolicy |String | The database's Ingestion Batching policy (serialized in JSON format).

**Output for 'datastats' option**

|Output parameter |Type |Description 
|---|---|---
|DatabaseName  |String |The name of the database. Note that like all entity names in Kusto, database names are case-sensitive. 
|PersistentStorage  |String |Indicates the persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) 
|Version  |String |The version number of the database. This number is updated for each change operation in the database (such as adding data and changing the schema). 
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. 
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
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. 
|DatabaseAccessMode  |String |Indicates how the cluster is attached to the database. (For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way.) 
|PrettyName |String |The database's pretty name.
|CurrentUserIsUnrestrictedViewer |Boolean | Specifies if the current user is an unrestricted viewer on the database.
|DatabaseId |Guid |The database's unique id.



## .alter database prettyname

`.alter` `database` *DatabaseName* `prettyname` `'`*DatabasePrettyName*`'`

Alters a database's pretty (friendly) name.

Requires [DatabaseAdmin permission](../management/access-control/role-based-authorization.md).
 
**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database.
|PrettyName |String |The pretty name of the database.

## .drop database prettyname

`.drop` `database` *DatabaseName* `prettyname`

Drops a database's pretty (friendly) name.

Requires [DatabaseAdmin permission](../management/access-control/role-based-authorization.md).
 
**Return output**
 
|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database.
|PrettyName |String |The pretty name of the database (null after drop operation).



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

```json
"{""Databases"":{""TestDB"":{""Name"":""TestDB"",""Tables"":{""Events"":{""Name"":""Events"",""DefaultColumn"":null,""OrderedColumns"":[{""Name"":""Name"",""Type"":""System.String""},{""Name"":""StartTime"",""Type"":""System.DateTime""},{""Name"":""EndTime"",""Type"":""System.DateTime""},{""Name"":""City"",""Type"":""System.String""},{""Name"":""SessionId"",""Type"":""System.Int32""}]}},""PrettyName"":null,""MajorVersion"":1,""MinorVersion"":1,""Functions"":{}}}}"
```

