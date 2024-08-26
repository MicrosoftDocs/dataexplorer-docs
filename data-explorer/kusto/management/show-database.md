---
title: .show database command
description: Learn how to use the `.show database` command to show the properties of the specified database.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 08/26/2024
---
# .show database command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns a table showing the properties of the context database.

:::moniker range="azure-data-explorer"
To return a table in which every record corresponds to a database in the cluster that the user has access to, see [`.show databases`](show-databases.md).
::: moniker-end

:::moniker range="microsoft-fabric"
To return a table in which every record corresponds to a database in the eventhouse that the user has access to, see [`.show databases`](show-databases.md).
::: moniker-end

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `database` [`details` | `identity` | `policies` | `datastats`]

The default call without any options specified is equal to 'identity' option.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

This command returns a table with the following columns for each option:

### Output for `identity` option

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName  | `string` |The database name. Database names are case-sensitive.|
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)|
|Version  | `string` |Database version number. This number is updated for each change operation in the database (such as adding data and changing the schema). |
|IsCurrent  |`bool` |True if the database is the one that the current connection points to.|
|DatabaseAccessMode  | `string` |The database access mode. For example, if the database access mode is `ReadOnly`, then all requests to modify the database fail. |
|PrettyName | `string` |The database pretty name.|
|CurrentUserIsUnrestrictedViewer |`bool` | Specifies if the current user is an unrestricted viewer on the database.|
|DatabaseId | `guid` |The database unique ID.|
|InTransitionTo| `string` |Describes the database in a transition state. For instance, access mode change, detaching database, changing the database physical location, storage keys change, or database pretty name change.|
|SuspensionState|`string` |When the database was suspended and the reason.|

### Output for `details` option

[!INCLUDE [database-details-option](../includes/database-details-option.md)]

### Output for `policies` option

[!INCLUDE [database-policies-option](../includes/database-policies-option.md)]

### Output for `datastats` option

[!INCLUDE [database-datastats-option](../includes/database-datastats-option.md)]

## Examples

### Show database identity

The following example shows the current database identity related properties.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrzsgvV0hJLElMSixOLVbITEnNK8ksqQQA60I4JxgAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
.show database identity
```

**Output**

|DatabaseName| PersistentStorage| Version| IsCurrent| DatabaseAccessMode| PrettyName|CurrentUserIsUnrestrictedViewer| DatabaseId| InTransitionTo|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|SampleLogs|https://storagelocation01/abcdefg1234567| v252.0| true| ReadWrite|	|false|a1b2c3-1234-d4e5f7-8901234abc||

### Show database policies

The following example shows the current database policies.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAA9MrzsgvV0hJLElMSixOVSjIz8lMzkwtBgBc16a1FwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
.show database policies
```

|DatabaseName|PersistentStorage|Version|IsCurrent|DatabaseAccessMode|PrettyName|DatabaseId|AuthorizedPrincipals|RetentionPolicy|MergePolicy|CachingPolicy|ShardingPolicy|StreamingIngestionPolicy|IngestionBatchingPolicy|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|SampleLogs|https://storagelocation01/abcdefg1234567| v252.0|true|ReadWrite||a1b2c3-1234-d4e5f7-8901234ab|[{ "Role": "Admin", "PrincipalName": "1234abcd-ef56-789-0123456e" "PrincipalType": "AadUser"}, { "Role": "Admin", "PrincipalName": "fghi1234-5678-9j12-3456", "PrincipalType": "AadUser"}, { "Role": "User", "PrincipalName": "kl1234-1234-56m7-89012", "PrincipalType": "AadApplication"}, { "Role": "User", "PrincipalName": "fghi1234-5678-9j12-3456" "PrincipalType": "AadApplication" }, { "Role": "Ingestor", "PrincipalName": "fghi1234-5678-9j12-3456", "PrincipalType": "AadApplication" }, { "Role": "Viewer", "PrincipalName": "#everyone#", "PrincipalType": "AadUser" }, {"Role": "Viewer", "PrincipalName": "#everyone#", "PrincipalType": "MsaUser" }, { "Role": "Admin" "PrincipalName":"nop1234-1234-56qr-7890", "PrincipalType": "AadUser"}, { "Role": "User", "PrincipalName": "nop1234-1234-56qr-7890", "PrincipalType": "AadUser" }, { "Role": "Viewer", "PrincipalName": "nop1234-1234-56qr-7890","PrincipalType": "AadApplication"}, {"Role": "Ingestor", "PrincipalName": "nop1234-1234-56qr-7890", "PrincipalType": "AadApplication"}] |null| { "RowCountUpperBoundForMerge": 16000000, "OriginalSizeMBUpperBoundForMerge": 30000, "MaxExtentsToMerge": 100, "MaxRangeInHours": 24, "AllowRebuild": true, "AllowMerge": true, "Lookback": { "Kind": 0,"CustomPeriod": null }, "Origin": 2 }|null|{"MaxRowCount": 750000, "MaxExtentSizeInMb": 1024, "MaxOriginalSizeInMb": 2048, "UseShardEngine": true, "ShardEngineMaxRowCount": 1048576, "ShardEngineMaxExtentSizeInMb": 8192, "ShardEngineMaxOriginalSizeInMb": 3072}|null|null|
