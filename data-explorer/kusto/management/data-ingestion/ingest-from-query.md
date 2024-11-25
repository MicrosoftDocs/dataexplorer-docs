---
title:  Kusto query ingestion (set, append, replace)
description: Learn how to use the .set, .append, .set-or-append, and .set-or-replace commands to ingest data from a query.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/24/2024
---
# Ingest from query (.set, .append, .set-or-append, .set-or-replace)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

These commands execute a query or a management command and ingest the results of the query into a table. The difference between these commands is how they treat existing or nonexistent tables and data.

|Command          |If table exists                     |If table doesn't exist                    |
|-----------------|------------------------------------|------------------------------------------|
|`.set`           |The command fails. |The table is created and data is ingested.|
|`.append`        |Data is appended to the table.      |The command fails.|
|`.set-or-append` |Data is appended to the table.      |The table is created and data is ingested.|
|`.set-or-replace`|Data replaces the data in the table.|The table is created and data is ingested.|

To cancel an ingest from query command, see [`cancel operation`](../cancel-operation-command.md).

::: moniker range="azure-data-explorer"
> [!NOTE]
> Ingest from query is a [direct ingestion](/azure/data-explorer/ingest-data-overview#direct-ingestion-with-management-commands). As such, it does not include automatic retries. Automatic retries are available when ingesting through the data management service. Use the [ingestion overview](/azure/data-explorer/ingest-data-overview) document to decide which is the most suitable ingestion option for your scenario.
::: moniker-end
::: moniker range="microsoft-fabric"
> [!NOTE]
> Ingest from query is a [direct ingestion](/azure/data-explorer/ingest-data-overview#direct-ingestion-with-management-commands). As such, it does not include automatic retries. Automatic retries are available when ingesting through the data management service.
::: moniker-end

## Permissions

To perform different actions on a table, you need specific permissions:

* To add rows to an existing table using the `.append` command, you need a minimum of Table Ingestor permissions.
* To create a new table using the various `.set` commands, you need a minimum of Database User permissions.
* To replace rows in an existing table using the `.set-or-replace` command, you need a minimum of Table Admin permissions.

For more information on permissions, see [Kusto role-based access control](../../access-control/role-based-access-control.md).

## Syntax

(`.set` | `.append` | `.set-or-append` | `.set-or-replace`) [`async`] *tableName* [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`] `<|` *queryOrCommand*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *async* | `string` | | If specified, the command returns immediately and continues ingestion in the background. Use the returned `OperationId` with the `.show operations` command to retrieve the ingestion completion status and results. |
| *tableName* | `string` |  :heavy_check_mark: | The name of the table to ingest data into. The *tableName* is always related to the database in context. |
| *propertyName*, *propertyValue* | `string` | | One or more [supported ingestion properties](#supported-ingestion-properties) used to control the ingestion process. |
| *queryOrCommand* | `string` |  :heavy_check_mark: | The text of a query or a management command whose results are used as data to ingest. Only `.show` management commands are supported.|

## Performance tips

* Set the `distributed` property to `true` if the amount of data produced by the query is large, exceeds one gigabyte (GB), and doesn't require serialization. Then, multiple nodes can produce output in parallel. Don't use this flag when query results are small, since it might needlessly generate many small data shards.
* Data ingestion is a resource-intensive operation that might affect concurrent activities on the database, including running queries. Avoid running too many ingestion commands at the same time.
* Limit the data for ingestion to less than one GB per ingestion operation. If necessary, use multiple ingestion commands.

## Supported ingestion properties

|Property|Type|Description|
|--|--|--|
|`distributed` | `bool` | If `true`, the command ingests from all nodes executing the query in parallel. Default is `false`. See [performance tips](#performance-tips).|
|`creationTime` | `string` | The `datetime` value, formatted as an ISO8601 `string`, to use at the creation time of the ingested data extents. If unspecified, `now()` is used. When specified, make sure the `Lookback` property in the target table's effective [Extents merge policy](../merge-policy.md) is aligned with the specified value.|
|`extend_schema` | `bool` | If `true`, the command might extend the schema of the table. Default is `false`. This option applies only to `.append`, `.set-or-append`, and `set-or-replace` commands. This option requires at least [Table Admin](../../access-control/role-based-access-control.md) permissions.|
|`recreate_schema` | `bool` | If `true`, the command might recreate the schema of the table. Default is `false`. This option applies only to the `.set-or-replace` command. This option takes precedence over the `extend_schema` property if both are set. This option requires at least [Table Admin](../../access-control/role-based-access-control.md) permissions.|
|`folder` | `string` | The folder to assign to the table. If the table already exists, this property overwrites the table's folder.|
|`ingestIfNotExists` | `string` | If specified, ingestion fails if the table already has data tagged with an `ingest-by:` tag with the same value. For more information, see [ingest-by: tags](../extent-tags.md).|
|`policy_ingestiontime` | `bool` | If `true`, the [Ingestion Time Policy](../show-table-ingestion-time-policy-command.md) is enabled on the table. The default is `true`.|
|`tags` | `string` | A JSON `string` that represents a list of [tags](../extent-tags.md) to associate with the created extent. |
|`docstring` | `string` | A description used to document the table.|
|`persistDetails` |A Boolean value that, if specified, indicates that the command should persist the detailed results for retrieval by the [.show operation details](../show-operations.md) command. Defaults to `false`. |`with (persistDetails=true)`|

## Schema considerations

* `.set-or-replace` preserves the schema unless one of `extend_schema` or `recreate_schema` ingestion properties is set to `true`.
* `.set-or-append` and `.append` commands preserve the schema unless the  `extend_schema` ingestion property is set to `true`.
* Matching the result set schema to that of the target table is based on the column types. There's no matching of column names. Make sure that the query result schema columns are in the same order as the table, otherwise data is ingested into the wrong columns.

> [!CAUTION]
> If the schema is modified, it happens in a separate transaction before the actual data ingestion. This means the schema might be modified even when there is a failure to ingest the data.

## Character limitation

The command fails if the query generates an entity name with the `$` character. The [entity names](../../query/schema-entities/entity-names.md) must comply with the naming rules, so the `$` character must be removed for the ingest command to succeed.

For example, in the following query, the `search` operator generates a column `$table`. To store the query results, use [project-rename](../../query/project-rename-operator.md) to rename the column.

```kusto
.set Texas <| search State has 'Texas' | project-rename tableName=$table
```

## Returns

Returns information on the extents created because of the `.set` or `.append` command.

## Examples

### Create and update table from query source

The following query creates the :::no-loc text="\`RecentErrors\`"::: table with the same schema as :::no-loc text="\`LogsTable\`":::. It updates :::no-loc text="\`RecentErrors\`"::: with all error logs from :::no-loc text="\`LogsTable\`"::: over the last hour.

```kusto
.set RecentErrors <|
   LogsTable
   | where Level == "Error" and Timestamp > now() - time(1h)
```

### Create and update table from query source using the *distributed* flag

The following example creates a new table called `OldExtents` in the database, asynchronously. The dataset is expected to be bigger than one GB (more than ~one million rows) so the *distributed* flag is used. It updates `OldExtents` with `ExtentId` entries from the `MyExtents` table that were created more than 30 days ago.

```kusto
.set async OldExtents with(distributed=true) <|
   MyExtents 
   | where CreatedOn < now() - time(30d)
   | project ExtentId
```

### Append data to table

The following example filters `ExtentId` entries in the `MyExtents` table that were created more than 30 days ago and appends the entries to the `OldExtents` table with associated tags.

```kusto
.append OldExtents with(tags='["TagA","TagB"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId
```

### Create or append a table with possibly existing tagged data

The following example either appends to or creates the `OldExtents` table asynchronously. It filters `ExtentId` entries in the `MyExtents` table that were created more than 30 days ago and specifies the tags to append to the new extents with `ingest-by:myTag`. The `ingestIfNotExists` parameter ensures that the ingestion only occurs if the data doesn't already exist in the table with the specified tag.

```kusto
.set-or-append async OldExtents with(tags='["ingest-by:myTag"]', ingestIfNotExists='["myTag"]') <|
   MyExtents
   | where CreatedOn < now() - time(30d)
   | project ExtentId
```

### Create table or replace data with associated data

The following query replaces the data in the `OldExtents` table, or creates the table if it doesn't already exist, with `ExtentId` entries in the `MyExtents` table that were created more than 30 days ago. Tag the new extent with `ingest-by:myTag` if the data doesn't already exist in the table with the specified tag.

```kusto
.set-or-replace async OldExtents with(tags='["ingest-by:myTag"]', ingestIfNotExists='["myTag"]') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId
```

### Append data with associated data

The following example appends data to the `OldExtents` table asynchronously, using `ExtentId` entries from the `MyExtents` table that were created more than 30 days ago. It sets a specific creation time for the new extents.

```kusto
.append async OldExtents with(creationTime='2017-02-13T11:09:36.7992775Z') <| 
   MyExtents 
   | where CreatedOn < now() - time(30d) 
   | project ExtentId     
```

**Sample output**

The following is a sample of the type of output you may see from your queries.

|ExtentId |OriginalSize |ExtentSize |CompressedSize |IndexSize |RowCount |
|--|--|--|--|--|--|
|23a05ed6-376d-4119-b1fc-6493bcb05563 |1291 |5882 |1568 |4314 |10 |

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [Inline ingestion](ingest-inline.md)
* [Ingest from storage](ingest-from-storage.md)