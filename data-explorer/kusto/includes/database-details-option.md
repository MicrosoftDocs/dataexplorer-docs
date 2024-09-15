---
ms.topic: include
ms.date: 08/26/2024
---


|Output parameter |Type |Description|
|---|---|---|
|DatabaseName  | `string` | The name of the database. Database names are case-sensitive.|
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)|
|Version  | `string` |Database version number. This number is updated for each change operation in the database (such as adding data and changing the schema).|
|IsCurrent  |`bool` |True if the database is the one that the current connection points to.|
|DatabaseAccessMode  | `string` |How the database is attached. For example, if the database is attached in ReadOnly mode, all requests to modify the database in any way, fail. Options include `ReadWrite`, `ReadOnly`, `ReadOnlyFollowing`, or `ReadWriteEphemeral`. |
|PrettyName | `string` |The database pretty name, if any.|
|AuthorizedPrincipals | `string` | The collection of authorized principals for the database, serialized in JSON format.|
|RetentionPolicy | `string` | The database Retention policy, serialized in JSON format.|
|MergePolicy | `string` | The database Extents Merge policy, serialized in JSON format.|
|CachingPolicy | `string` | The database Caching policy, serialized in JSON format.|
|ShardingPolicy | `string` | The database Sharding policy, serialized in JSON format.|
|StreamingIngestionPolicy | `string` | The database Streaming Ingestion policy, serialized in JSON format.|
|IngestionBatchingPolicy | `string` | The database Ingestion Batching policy, serialized in JSON format.|
|TotalSize|`real` |The database extents total size in bytes. |
|DatabaseId | `guid` |The database unique ID.|
|InTransitionTo| `string` |Describes the database in a transition state. For instance, access mode change, detaching database, changing the database physical location, storage keys change, or database pretty name change. |
|NumberOfTables |`int` | The number of tables in the database. |
|NumberOfExternalTables |`int` |The number of external tables. |
|NumberOfMaterializedViews |`int` | The number of materialized views. |
|EncryptionScope|`int` | The encryption scope. |
|SuspensionState|`string` |When the database was suspended and the reason. |
