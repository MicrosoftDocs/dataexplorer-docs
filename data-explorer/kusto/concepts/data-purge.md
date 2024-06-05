---
title: Data purge - Azure Data Explorer
description: This article describes Data purge in Azure Data Explorer.
ms.reviewer: kedamari
ms.topic: reference
ms.date: 07/03/2022
---
# Data purge

[!INCLUDE [gdpr-intro-sentence](../../includes/gdpr-intro-sentence.md)]

As a data platform, Azure Data Explorer supports the ability to delete individual records, by using Kusto `.purge` and related commands. You can also [purge an entire table](#purging-an-entire-table) or purge records in a [materialized view](../management/materialized-views/materialized-view-purge.md).

> [!WARNING]
> Data deletion through the `.purge` command is designed to be used to protect personal data and should not be used in other scenarios. It is not designed to support frequent delete requests, or deletion of massive quantities of data, and may have a significant performance impact on the service.

## Purge guidelines

Carefully design your data schema and investigate relevant policies before storing personal data in Azure Data Explorer.

1. In a best-case scenario, the retention period on this data is sufficiently short and data is automatically deleted.
1. If retention period usage isn't possible, isolate all data that is subject to privacy rules in a few Azure Data Explorer tables. Optimally, use just one table and link to it from all other tables. This isolation allows you to run the data [purge process](#purge-process) on a few tables holding sensitive data, and avoid all other tables.
1. The caller should make every attempt to batch the execution of `.purge` commands to 1-2 commands per table per day. Don't issue multiple commands with unique user identity predicates. Instead, send a single command whose predicate includes all user identities that require purging.

## Purge process

The process of selectively purging data from Azure Data Explorer happens in the following steps:

1. Phase 1:
   Give an input with an Azure Data Explorer table name and a per-record predicate, indicating which records to delete. Kusto scans the table looking to identify data extents that would participate in the data purge. The extents identified are those having one or more records for which the predicate returns true.
1. Phase 2: (Soft Delete)
   Replace each data extent in the table (identified in step (1)) with a reingested version. The reingested version shouldn't have the records for which the predicate returns true. If new data isn't being ingested into the table, then by the end of this phase, queries will no longer return data for which the predicate returns true. The duration of the purge soft delete phase depends on the following parameters:

    * The number of records that must be purged
    * Record distribution across the data extents in the cluster
    * The number of nodes in the cluster
    * The spare capacity it has for purge operations
    * Several other factors

    The duration of phase 2 can vary between a few seconds to many hours.
1. Phase 3: (Hard Delete)
   Work back all storage artifacts that may have the "poison" data, and delete them from storage. This phase is done at least five days after the completion of the previous phase, but no longer than 30 days after the initial command. These timelines are set to follow data privacy requirements.

Issuing a `.purge` command triggers this process, which takes a few days to complete. If the density of records for which the predicate applies is sufficiently large, the process will effectively reingest all the data in the table. This reingestion has a significant impact on performance and COGS (cost of goods sold).

## Purge limitations and considerations

* The purge process is final and irreversible. It isn't possible to undo this process or recover data that has been purged. Commands such as [undo table drop](../management/undo-drop-table-command.md) can't recover purged data. Rollback of the data to a previous version can't go to before the latest purge command.

* Before running the purge, verify the predicate by running a query and checking that the results match the expected outcome. You can also use the two-step process that returns the expected number of records that will be purged.

* The `.purge` command is executed against the Data Management endpoint:
  `https://ingest-[YourClusterName].[region].kusto.windows.net`.
   The command requires [database admin](../access-control/role-based-access-control.md)
   permissions on the relevant databases.
* Due to the purge process performance impact, and to guarantee that
   [purge guidelines](#purge-guidelines) have been followed, the caller is expected to modify the data schema so that
   minimal tables include relevant data, and batch commands per table to reduce the significant COGS impact of the
   purge process.
* The `predicate` parameter of the [.purge](#purge-table-tablename-records-command) command is used to specify which records to purge.
`Predicate` size is limited to 1 MB. When constructing the `predicate`:

  * Use the ['in' operator](../query/in-operator.md), for example, `where [ColumnName] in ('Id1', 'Id2', .. , 'Id1000')`.
  * Note the limits of the ['in' operator](../query/in-operator.md) (list can contain up to `1,000,000` values).
  * If the query size is large, use [`externaldata` operator](../query/externaldata-operator.md), for example `where UserId in (externaldata(UserId:string) ["https://...blob.core.windows.net/path/to/file?..."])`. The file stores the list of IDs to purge.
  * The total query size, after expanding all `externaldata` blobs (total size of all blobs), can't exceed 64 MB.

## Purge performance

Only one purge request can be executed on the cluster, at any given time. All other requests are queued in `Scheduled` state.
Monitor the purge request queue size, and keep within adequate limits to match the requirements applicable for your data.

To reduce purge execution time:

* Follow the [purge guidelines](#purge-guidelines) to decrease the amount of purged data.
* Adjust the [caching policy](../management/cache-policy.md) since purge takes longer on cold data.
* Scale out the cluster

* Increase cluster purge capacity, after careful consideration, as detailed in [Extents purge rebuild capacity](../management/capacity-policy.md#extents-purge-rebuild-capacity).

## Trigger the purge process

> [!NOTE]
> Purge execution is invoked by running [purge table *TableName* records](#purge-table-tablename-records-command) command on the Data Management endpoint https://ingest-[YourClusterName].[Region].kusto.windows.net.

### Purge table *TableName* records command

Purge command may be invoked in two ways for differing usage scenarios:

* Programmatic invocation: A single step that is intended to be invoked by applications. Calling this command directly triggers purge execution sequence.

  **Syntax**

  ```kusto
  // Connect to the Data Management service
  #connect "https://ingest-[YourClusterName].[region].kusto.windows.net"

  // To purge table records
  .purge table [TableName] records in database [DatabaseName] with (noregrets='true') <| [Predicate]

   // To purge materialized view records
  .purge materialized-view [MaterializedViewName] records in database [DatabaseName] with (noregrets='true') <| [Predicate]
   ```

* Human invocation: A two-step process that requires an explicit confirmation as a separate step. First invocation of the command returns a verification token, which should be provided to run the actual purge. This sequence reduces the risk of inadvertently deleting incorrect data.

 > [!NOTE]
 > The first step in the two-step invocation requires running a query on the entire dataset, to identify records to be purged.
 > This query may time-out or fail on large tables, especially with significant amount of cold cache data. In case of failures,
 > validate the predicate yourself and after verifying correctness use the single-step purge with the `noregrets` option.

**Syntax**

> [!NOTE]
> To connect to a cluster using the Azure Data Explorer web UI, see [Add clusters](../../web-query-data.md#add-clusters).

  ```kusto
     // Connect to the Data Management service - this command only works in Kusto.Explorer
     #connect "https://ingest-[YourClusterName].[region].kusto.windows.net"

     // Step #1 - retrieve a verification token (no records will be purged until step #2 is executed)
     .purge table [TableName] records in database [DatabaseName] <| [Predicate]

     // Step #2 - input the verification token to execute purge
     .purge table [TableName] records in database [DatabaseName] with (verificationtoken=h'<verification token from step #1>') <| [Predicate]
  ```

To purge a materialized view, replace the `table` keyword with `materialized-view`, and replace *TableName* with the *MaterializedViewName*.

| Parameters  | Description  |
|---------|---------|
| `DatabaseName`   |   Name of the database      |
| `TableName` / `MaterializedViewName`    |     Name of the table / materialized view to purge.  |
| `Predicate`    |    Identifies the records to purge. See [purge predicate limitations](#purge-predicate-limitations). |
| `noregrets`    |     If set, triggers a single-step activation.    |
| `verificationtoken`     |  In the two-step activation scenario (`noregrets` isn't set), this token can be used to execute the second step and commit the action. If `verificationtoken` isn't specified, it will trigger the command's first step. Information about the purge will be returned with a token that should be passed back to the command to do step #2.   |

#### Purge predicate limitations

* The predicate must be a simple selection (for example, *where [ColumnName] == 'X'* / *where [ColumnName] in ('X', 'Y', 'Z') and [OtherColumn] == 'A'*).
* Multiple filters must be combined with an 'and', rather than separate `where` clauses (for example, `where [ColumnName] == 'X' and  OtherColumn] == 'Y'` and not `where [ColumnName] == 'X' | where [OtherColumn] == 'Y'`).
* The predicate can't reference tables other than the table being purged (*TableName*). The predicate can only include the selection statement (`where`). It can't project specific columns from the table (output schema when running '*`table` | Predicate*' must match table schema).
* System functions (such as, `ingestion_time()`, `extent_id()`) aren't supported.

#### Example: Two-step purge

To start purge in a two-step activation scenario, run step #1 of the command:

 ```kusto
    // Connect to the Data Management service
    #connect "https://ingest-[YourClusterName].[region].kusto.windows.net"

    .purge table MyTable records in database MyDatabase <| where CustomerId in ('X', 'Y')

    .purge materialized-view MyView records in database MyDatabase <| where CustomerId in ('X', 'Y')
 ```

**Output**

 | NumRecordsToPurge | EstimatedPurgeExecutionTime| VerificationToken
 |---|---|---
 | 1,596 | 00:00:02 | e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b

Then, validate the NumRecordsToPurge before running step #2.

To complete a purge in a two-step activation scenario, use the verification token returned from step #1 to run step #2:

```kusto
.purge table MyTable records in database MyDatabase
 with(verificationtoken=h'e43c7....')
<| where CustomerId in ('X', 'Y')

.purge materialized-view MyView records in database MyDatabase
 with(verificationtoken=h'e43c7....')
<| where CustomerId in ('X', 'Y')
```

**Output**

| `OperationId` | `DatabaseName` | `TableName`|`ScheduledTime` | `Duration` | `LastUpdatedOn` |`EngineOperationId` | `State` | `StateDetails` |`EngineStartTime` | `EngineDuration` | `Retries` |`ClientRequestId` | `Principal`|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Scheduled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...|

#### Example: Single-step purge

To trigger a purge in a single-step activation scenario, run the following command:

```kusto
// Connect to the Data Management service
 #connect "https://ingest-[YourClusterName].[region].kusto.windows.net"

.purge table MyTable records in database MyDatabase with (noregrets='true') <| where CustomerId in ('X', 'Y')

.purge materialized-view MyView records in database MyDatabase with (noregrets='true') <| where CustomerId in ('X', 'Y')
```

**Output**

| `OperationId` |`DatabaseName` |`TableName` |`ScheduledTime` |`Duration` |`LastUpdatedOn` |`EngineOperationId` |`State` |`StateDetails` |`EngineStartTime` |`EngineDuration` |`Retries` |`ClientRequestId` |`Principal`|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Scheduled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...|

### Cancel purge operation command

If needed, you can cancel pending purge requests.

> [!NOTE]
> This operation is intended for error recovery scenarios. It isn't guaranteed to succeed, and shouldn't be part of a normal operational flow. It can only be applied to requests that are still in the queue and have not yet been dispatched for execution.

**Syntax**

```kusto
 // Cancel of a single purge operation
 .cancel purge <OperationId>

  // Cancel of all pending purge requests in a database
 .cancel all purges in database <DatabaseName>

 // Cancel of all pending purge requests, for all databases
 .cancel all purges
```

#### Example: Cancel a single purge operation

```kusto
 .cancel purge aa894210-1c60-4657-9d21-adb2887993e1
```

**Output**

The output of this command is the same as the 'show purges *OperationId*' command output, showing the updated status of the purge operation being canceled.
If the attempt is successful, the operation state is updated to `Canceled`. Otherwise, the operation state isn't changed.

|`OperationId` |`DatabaseName` |`TableName` |`ScheduledTime` |`Duration` |`LastUpdatedOn` |`EngineOperationId` |`State` |`StateDetails` |`EngineStartTime` |`EngineDuration` |`Retries` |`ClientRequestId` |`Principal`
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Canceled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

#### Example: Cancel all pending purge operations in a database

```kusto
 .cancel all purges in database MyDatabase
```

**Output**

The output of this command is the same as the [show purges](#show-purges-command) command output, showing all operations in the database with their updated status.
Operations that were canceled successfully will have their status updated to `Canceled`. Otherwise, the operation state isn't changed.

|`OperationId` |`DatabaseName` |`TableName` |`ScheduledTime` |`Duration` |`LastUpdatedOn` |`EngineOperationId` |`State` |`StateDetails` |`EngineStartTime` |`EngineDuration` |`Retries` |`ClientRequestId` |`Principal`
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|5a34169e-8730-49f5-9694-7fde3a7a0139 |MyDatabase |MyTable |2021-03-03 05:07:29.7050198 |00:00:00.2971331 |2021-03-03 05:07:30.0021529 | |Canceled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...
|2fa7c04c-6364-4ce1-a5e5-1ab921f518f5 |MyDatabase |MyTable |2021-03-03 05:05:03.5035478 |00:00:00.1406211 |2021-03-03 05:05:03.6441689 | |InProgress | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

## Track purge operation status

> [!NOTE]
> Purge operations can be tracked with the [show purges](#show-purges-command) command, executed against the Data Management endpoint https://ingest-[YourClusterName].[region].kusto.windows.net.

Status = 'Completed' indicates successful completion of the first phase of the purge operation, that is records are soft-deleted and are no longer available for querying. Customers aren't expected to track and verify the second phase (hard-delete) completion. This phase is monitored internally by Azure Data Explorer.

### Show purges command

`Show purges` command shows purge operation status by specifying the operation ID within the requested time period.

```kusto
.show purges <OperationId>
.show purges [in database <DatabaseName>]
.show purges from '<StartDate>' [in database <DatabaseName>]
.show purges from '<StartDate>' to '<EndDate>' [in database <DatabaseName>]
```

| Properties  |Description  |Mandatory/Optional|
|---------|------------|-------|
|`OperationId `   |      The Data Management operation ID outputted after executing single phase or second phase.   |Mandatory
|`StartDate`    |   Lower time limit for filtering operations. If omitted, defaults to 24 hours before current time.      |Optional
|`EndDate`    |  Upper time limit for filtering operations. If omitted, defaults to current time.       |Optional
|`DatabaseName`    |     Database name to filter results.    |Optional

> [!NOTE]
> Status will be provided only on databases for which the client has [Database Admin](../access-control/role-based-access-control.md) permissions.

**Examples**

```kusto
.show purges
.show purges c9651d74-3b80-4183-90bb-bbe9e42eadc4
.show purges from '2018-01-30 12:00'
.show purges from '2018-01-30 12:00' to '2018-02-25 12:00'
.show purges from '2018-01-30 12:00' to '2018-02-25 12:00' in database MyDatabase
```

**Output**

|`OperationId` |`DatabaseName` |`TableName` |`ScheduledTime` |`Duration` |`LastUpdatedOn` |`EngineOperationId` |`State` |`StateDetails` |`EngineStartTime` |`EngineDuration` |`Retries` |`ClientRequestId` |`Principal`
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:33.6782130 |2019-01-20 11:42:34.6169153 |a0825d4d-6b0f-47f3-a499-54ac5681ab78 |Completed |Purge completed successfully (storage artifacts pending deletion) |2019-01-20 11:41:34.6486506 |00:00:04.4687310 |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

* `OperationId` - the DM operation ID returned when executing purge.
* `DatabaseName`** - database name (case sensitive).
* `TableName` - table name (case sensitive).
* `ScheduledTime` - time of executing purge command to the DM service.
* `Duration` - total duration of the purge operation, including the execution DM queue wait time.
* `EngineOperationId` - the operation ID of the actual purge executing in the engine.
* `State` - purge state, can be one of the following values:
  * `Scheduled` - purge operation is scheduled for execution. If job remains Scheduled, there's probably a backlog of purge operations. See [purge performance](#purge-performance) to clear this backlog. If a purge operation fails on a transient error, it will be retried by the DM and set to Scheduled again (so you may see an operation transition from Scheduled to InProgress and back to Scheduled).
  * `InProgress` - the purge operation is in-progress in the engine.
  * `Completed` - purge completed successfully.
  * `BadInput` - purge failed on bad input and won't be retried. This failure may be due to various issues such as a syntax error in the predicate, an illegal predicate for purge commands, a query that exceeds limits (for example, over 1M entities in an `externaldata` operator or over 64 MB of total expanded query size), and 404 or 403 errors for `externaldata` blobs.
  * `Failed` - purge failed and won't be retried. This failure may happen if the operation was waiting in the queue for too long (over 14 days), due to a backlog of other purge operations or a number of failures that exceed the retry limit. The latter will raise an internal monitoring alert and will be investigated by the Azure Data Explorer team.
* `StateDetails` - a description of the State.
* `EngineStartTime` - the time the command was issued to the engine. If there's a large difference between this time and ScheduledTime, there's usually a significant backlog of purge operations and the cluster isn't keeping up with the pace.
* `EngineDuration` - time of actual purge execution in the engine. If purge was retried several times, it's the sum of all the execution durations.
* `Retries` - number of times the operation was retried by the DM service due to a transient error.
* `ClientRequestId` - client activity ID of the DM purge request.
* `Principal` - identity of the purge command issuer.

## Purging an entire table

Purging a table includes dropping the table, and marking it as purged so that the hard delete process described in [Purge process](#purge-process) runs on it.
Dropping a table without purging it doesn't delete all its storage artifacts. These artifacts are deleted according to the hard retention policy initially set on the table.
The `purge table allrecords` command is quick and efficient and is preferable to the purge records process, if applicable for your scenario.

> [!NOTE]
> The command is invoked by running the [purge table *TableName* allrecords](#purge-table-tablename-allrecords-command) command on the Data Management endpoint https://ingest-[YourClusterName].[region].kusto.windows.net.

### Purge table *TableName* allrecords command

Similar to '[.purge table records ](#purge-table-tablename-records-command)' command, this command can be invoked in a programmatic (single-step) or in a manual (two-step) mode.

1. Programmatic invocation (single-step):

     **Syntax**

     ```kusto
     // Connect to the Data Management service
     #connect "https://ingest-[YourClusterName].[Region].kusto.windows.net"

     .purge table [TableName] in database [DatabaseName] allrecords with (noregrets='true')
     ```

1. Human invocation (two-steps):

     **Syntax**

     ```kusto

     // Connect to the Data Management service
     #connect "https://ingest-[YourClusterName].[Region].kusto.windows.net"

     // Step #1 - retrieve a verification token (the table will not be purged until step #2 is executed)

     .purge table [TableName] in database [DatabaseName] allrecords

     // Step #2 - input the verification token to execute purge
     .purge table [TableName] in database [DatabaseName] allrecords with (verificationtoken=h'<verification token from step #1>')
     ```

    | Parameters  |Description  |
    |---------|---------|
    | `DatabaseName`   |   Name of the database.      |
    | `TableName`    |     Name of the table.    |
    | `noregrets`    |     If set, triggers a single-step activation.    |
    | `verificationtoken`     |  In two-step activation scenario (`noregrets` isn't set), this token can be used to execute the second step and commit the action. If `verificationtoken` isn't specified, it will trigger the command's first step. In this step, a token is returned to pass back to the command and do step #2.|

#### Example: Two-step purge

1. To start purge in a two-step activation scenario, run step #1 of the command:

    ```kusto
    // Connect to the Data Management service
     #connect "https://ingest-[YourClusterName].[Region].kusto.windows.net"

    .purge table MyTable in database MyDatabase allrecords
    ```

    **Output**

    | `VerificationToken`|
    |---|
    | e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b|

1. To complete a purge in a two-step activation scenario, use the verification token returned from step #1 to run step #2:

    ```kusto
    .purge table MyTable in database MyDatabase allrecords
    with (verificationtoken=h'eyJT.....')
    ```

    The output is the same as the '.show tables' command output (returned without the purged table).

    **Output**

    |  TableName|DatabaseName|Folder|DocString
    |---|---|---|---
    |  OtherTable|MyDatabase|---|---

#### Example: Single-step purge

To trigger a purge in a single-step activation scenario, run the following command:

```kusto
// Connect to the Data Management service
#connect "https://ingest-[YourClusterName].[Region].kusto.windows.net"

.purge table MyTable in database MyDatabase allrecords with (noregrets='true')
```

The output is the same as the '.show tables' command output (returned without the purged table).

**Output**

|TableName|DatabaseName|Folder|DocString
|---|---|---|---
|OtherTable|MyDatabase|---|---

## Related content

* [Enable data purge on your Azure Data Explorer cluster](../../data-purge-portal.md)
