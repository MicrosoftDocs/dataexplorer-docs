---
title: .show database command
description: Learn how to use the `.show database` command to show the properties of the specified database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .show database command

Returns a table showing the properties of the context database.

To return a table in which every record corresponds to a database in the cluster that the user has access to, see [`.show databases`](show-databases.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` [`details` | `identity` | `policies` | `datastats`]

The default call without any options specified is equal to 'identity' option.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Output for 'identity' option

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName  | `string` |The database name. Database names are case-sensitive.|
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)|
|Version  | `string` |Database version number. This number is updated for each change operation in the database (such as adding data and changing the schema). |
|IsCurrent  |Boolean |True if the database is the one that the current connection points to.|
|DatabaseAccessMode  | `string` |How the cluster is attached to the database. For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way. |
|PrettyName | `string` |The database pretty name.|
|CurrentUserIsUnrestrictedViewer |Boolean | Specifies if the current user is an unrestricted viewer on the database.|
|DatabaseId | `guid` |The database's unique ID.|

## Output for 'details' option

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName  | `string` |The database name. Database names are case-sensitive. |
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) |
|Version  | `string` |The database version number. This number is updated for each change operation in the database (such as adding data and changing the schema). |
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. |
|DatabaseAccessMode  | `string` |How the cluster is attached to the database. For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way. |
|PrettyName | `string` |The database's pretty name.|
|AuthorizedPrincipals | `string` | The database's collection of authorized principals (serialized in JSON format).|
|RetentionPolicy | `string` | The database's Retention policy (serialized in JSON format).|
|MergePolicy | `string` | The database's Extents Merge policy (serialized in JSON format).|
|CachingPolicy | `string` | The database's Caching policy (serialized in JSON format).|
|ShardingPolicy | `string` | The database's Sharding policy (serialized in JSON format).|
|StreamingIngestionPolicy | `string` | The database's Streaming Ingestion policy (serialized in JSON format).|
|IngestionBatchingPolicy | `string` | The database's Ingestion Batching policy (serialized in JSON format).|
|TotalSize | `real` | The database's extents total size in bytes.|
|DatabaseId | `guid` |The database's unique ID.|
|NumberOfTables |Int64 |The database's number of tables (not including external tables or materialized views).|
|NumberOfExternalTables |Int64 |The database's number of external tables.|
|NumberOfMaterializedViews |Int64 |The database's number of materialized views.|

## Output for 'policies' option

|Output parameter |Type |Description |
|---|---|---|
|DatabaseName  | `string` |The database name. Database names are case-sensitive. |
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) |
|Version  | `string` |The database version number. This number is updated for each change operation in the database (such as adding data and changing the schema). |
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. |
|DatabaseAccessMode  | `string` |How the cluster is attached to the database. For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way. |
|PrettyName | `string` |The database's pretty name.|
|DatabaseId | `guid` |The database's unique ID.|
|AuthorizedPrincipals | `string` | The database's collection of authorized principals (serialized in JSON format).|
|RetentionPolicy | `string` | The database's Retention policy (serialized in JSON format).|
|MergePolicy | `string` | The database's Extents Merge policy (serialized in JSON format).|
|CachingPolicy | `string` | The database's Caching policy (serialized in JSON format).|
|ShardingPolicy | `string` | The database's Sharding policy (serialized in JSON format).|
|StreamingIngestionPolicy | `string` | The database's Streaming Ingestion policy (serialized in JSON format).|
|IngestionBatchingPolicy | `string` | The database's Ingestion Batching policy (serialized in JSON format).|

## Output for 'datastats' option

|Output parameter |Type |Description |
|---|---|---|
|DatabaseName  | `string` |The database name. Database names are case-sensitive.
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.) |
|Version  | `string` |The database version number. This number is updated for each change operation in the database (such as adding data and changing the schema). |
|IsCurrent  |Boolean |True if the database is the one that the current connection points to. |
|DatabaseAccessMode  | `string` |How the cluster is attached to the database. For example, if the database is attached in ReadOnly mode then the cluster will fail all requests to modify the database in any way. |
|PrettyName | `string` |The database's pretty name.|
|DatabaseId | `guid` |The database's unique ID.|
|OriginalSize | `real` | The database's extents total original size`*`.|
|ExtentSize | `real` | The database's extents total size (data + indices)`*`.|
|CompressedSize | `real` | The database's extents total data compressed size`*`.|
|IndexSize | `real` | The database's extents total index size`*`.|
|RowCount | `long` | The database's extents total row count`*`.|
|HotOriginalSize | `real` | The database's hot extents total original size`*`.|
|HotExtentSize | `real` | The database's hot extents total size (data + indices)`*`.|
|HotCompressedSize | `real` | The database's hot extents total data compressed size`*`.|
|HotIndexSize | `real` | The database's hot extents total index size`*`.|
|HotRowCount | `long` | The database's hot extents total row count`*`.|

`*` *Values may be up to 15 minutes old, as they are taken from a cached summary of the database's extents.*
