---
title: .show databases command
description: Learn how to use the `.show databases` command to show records of databases that the user has access to.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 08/26/2024
---
# .show databases command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
Returns a table in which every record corresponds to a database in the cluster that the user has access to.
::: moniker-end
:::moniker range="microsoft-fabric"
Returns a table in which every record corresponds to a database in the eventhouse that the user has access to.
::: moniker-end

For a table that shows the properties of the context database, see [`.show database`](show-database.md).

## Permissions

You must have at least [AllDatabasesMonitor](security-roles.md) permissions to run this command.

## Syntax

`.show` `databases` [`details` | `identity` | `policies` | `datastats`]

`.show` `databases` `(`*DatabaseName* [`,` ... ]`)`

:::moniker range="azure-data-explorer"
`.show` `cluster` `databases` [`details` | `identity` | `policies` | `datastats`]

`.show` `cluster` `databases` `(`*DatabaseName* [`,` ... ]`)`

The `databases` and `cluster databases` commands are equivalent.

::: moniker-end

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

This command returns a table with the following columns for each option:

### Output for `databases` option

|Column name       |Column type|Description                                                                  |
|------------------|-----------|-----------------------------------------------------------------------------|
|DatabaseName      |`string`   |The name of the database.                    |
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)|
|Version  | `string` |Database version number.|
|IsCurrent  |`bool` |True if the database is the one that the current connection points to.|
|DatabaseAccessMode  | `string` |How the database is attached. For example, if the database is attached in ReadOnly mode, all requests to modify the database in any way fail. Options include `ReadWrite`, `ReadOnly`, `ReadOnlyFollowing`, or `ReadWriteEphemeral`. |
|PrettyName        |`string`   |The pretty name of the database, if any.                        |
|DatabaseId | `guid` |The database unique ID.|
|InTransitionTo| `string` |Describes the database in a transition state. For instance, access mode change, detaching database, changing the database physical location, storage keys change, or database pretty name change. |
|SuspensionState|`string` |When the database was suspended and the reason.|

### Output for `details` option

[!INCLUDE [database-details-option](../includes/database-details-option.md)]

### Output for `identity` option

|Output parameter |Type |Description|
|---|---|---|
|DatabaseName  | `string` |Database name. Database names are case-sensitive.|
|PersistentStorage  | `string` |The persistent storage URI in which the database is stored. (This field is empty for ephemeral databases.)|
|Version  | `string` |Database version number. This number is updated for each change operation in the database (such as adding data and changing the schema).|
|IsCurrent  |`bool` |True if the database is the one that the current connection points to.|
|DatabaseAccessMode  | `string` |How the database is attached. For example, if the database is attached in ReadOnly mode, all requests to modify the database in any way fail. Options include `ReadWrite`, `ReadOnly`, `ReadOnlyFollowing`, or `ReadWriteEphemeral`. |
|PrettyName | `string` |The database pretty name.|
|CurrentUserIsUnrestrictedViewer |`bool` | Specifies if the current user is an unrestricted viewer on the database.|
|DatabaseId | `guid` |The database unique ID.|
|InTransitionTo| `string` |Describes the database in a transition state. For instance, access mode change, detaching database, changing the database physical location, storage keys change, or database pretty name change.|

### Output for `policies` option

[!INCLUDE [database-policies-option](../includes/database-policies-option.md)]

### Output for `datastats` option

[!INCLUDE [database-datastats-option](../includes/database-datastats-option.md)]

## Examples

:::moniker range="azure-data-explorer"
The following example shows databases that the user can access in the cluster.
::: moniker-end
:::moniker range="microsoft-fabric"
The following example shows databases that the user can access in the eventhouse.
::: moniker-end

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrzsgvV0hJLElMSixOLQYAFIgBkw8AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
.show databases
```

**Output**

:::moniker range="azure-data-explorer"

|DatabaseName|PersistentStorage  |Version  |IsCurrent  | DatabaseAccessMode | PrettyName |DatabaseId |InTransitionTo|SuspensionState|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|SecurityLogs |https://storagelocation01/abcdefg1234567 |v25.0 |false |ReadWrite  | | a1b2c3-1234-d4e5f7-8901234abc |||
|Samples |https://storagelocation/bcdefg2345678 |v3381.0 |true |ReadWrite  | | z9y8x7-1234-l5m6n7-8901234abc | ||
|SampleMetrics |https://storagelocation/cdefgh3456789 |v70179.0 |false |ReadWrite  | | w1v2u3-1234-d7e6f5-8901234abc | ||
|SampleLogs |https://storagelocation01/efghi4567890 |v252.0 |false |ReadWrite  | | s1r2q3-1234-t4e5f7-8901234abc | ||

::: moniker-end

:::moniker range="microsoft-fabric"
|DatabaseName |PersistentStorage |Version |IsCurrent |DatabaseAccessMode |PrettyName |DatabaseId |InTransitionTo |SuspensionState|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|h1i2j3-1234-k4l5m7-8901234abc |https://storagelocation/abcdefg1234567 |v29.0 |true |ReadWrite |city-temp-data-1 | a1b2c3-1234-d4e5f7-8901234abc | ||
|s1r2q3-1234-t4e5f7-8901234abc |https://storagelocation01/bcdefg2345678 |v21.0 |false |ReadWrite |city-data-2  |X1y2z3-1234-d4e5f7-8901234abc | ||

::: moniker-end

### Show databases identities

:::moniker range="microsoft-fabric"
The following example shows the identities of the databases connected to the current eventhouse.
::: moniker-end
:::moniker range="azure-data-explorer"
The following example shows the identities of the databases connected to the current cluster.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WLMQ6DMBAE%2B7xiy6SBF6TiASn8gsM%2B8ElgI%2B8hxO9xm3I0MwNzvZDEZRYqYUmLm994jePw5zDV4pU1yNY7xqy7QIjIrVOzw3GZZ7xDv37zcjKKawrerKzEF95O%2FTyh1rRUcAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
.show databases identity
```

**Output**
:::moniker range="azure-data-explorer"
|DatabaseName| PersistentStorage| Version| IsCurrent| DatabaseAccessMode| PrettyName|CurrentUserIsUnrestrictedViewer| DatabaseId| InTransitionTo|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|Trender|https://storagelocation01/abcdefg1234567|v45.0|false|ReadWrite||false|a1b2c3-1234-d4e5f7-8901234abc||
|SampleMetrics|https://storagelocation/cdefgh3456789|v70179.0|false|ReadWrite||false|w1v2u3-1234-d7e6f5-8901234abc||
SecurityLogs|https://storagelocation/bcdefg2345678|v25.0|false|ReadWrite||false|a1b2c3-1234-d4e5f7-8901234abc||
|SampleLogs|https://storagelocation01/abcdefg1234567| v252.0| true| ReadWrite||false|a1b2c3-1234-d4e5f7-8901234abc||
|Samples|https://storagelocation/bcdefg2345678|v3381.2|true|ReadWrite||false|z9y8x7-1234-l5m6n7-8901234abc||
|FindMyPartner|https://storagelocation01/zabcdef0123456|v37.0|false|ReadWrite||false| z1b2c3-1234-d4e5f7-8901234abc||
|SampleIoTData|https://storagelocation01/yzabcd0123456|v145.0|false|ReadWrite||false|y1b2c3-1234-d4e5f7-8901234abc||
|ContosoSales|https://storagelocation01/xabcdef0123456|v241.7|false|ReadWrite||false|x1b2c3-1234-d4e5f7-8901234abc||
::: moniker-end

:::moniker range="microsoft-fabric"

|DatabaseName| PersistentStorage| Version| IsCurrent| DatabaseAccessMode| PrettyName|CurrentUserIsUnrestrictedViewer| DatabaseId| InTransitionTo|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|h1i2j3-1234-k4l5m7-8901234abc |ttps://storagelocation/abcdefg1234567 |v33.0 |true |ReadWrite |city-temp-data-1 |false |a1b2c3-1234-d4e5f7-8901234abc ||
|s1r2q3-1234-t4e5f7-8901234abc |https://storagelocation01/bcdefg2345678 |v25.0 |false |ReadWrite |city-temp-data-2 |false |a1b2c3-1234-d4e5f7-8901234abc ||

::: moniker-end

### Show databases datastats

:::moniker range="microsoft-fabric"
The following example shows the datastats of the databases connected to the current eventhouse.
::: moniker-end
:::moniker range="azure-data-explorer"
The following example shows the datastats of the databases connected to the current cluster.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WLMQ6AIBAEe19xpTb4AisfYMELTkQhQTDsGr8vsbPbycwahPLIptRV4fEtUIluHM3PyVwyC4rV1Dq44E8VhTikRjVelCcySG%2Fba1n3G07pN8sa8wGZhPX2wwtxZ2YScAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
.show databases datastats
```

**Output**

:::moniker range="azure-data-explorer"
|DatabaseName|PersistentStorage| Version|IsCurrent|DatabaseAccessMode|PrettyName|DatabaseId |OriginalSize| ExtentSize| CompressedSize| IndexSize| RowCount| HotOriginalSize| HotExtentSize| HotCompressedSize| HotIndexSize| HotRowCount| TotalExtents| HotExtents|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|Trender| https://storagelocation01/abcdefg1234567| v45.0| false| ReadWrite| | a1b2c3-1234-d4e5f7-8901234abc3| 3,110,418,064| 336,847,996| 289,726,808| 47,121,188| 31,104,180| 3,110,418,064| 336,847,996| 289,726,808| 47,121,188| 31,104,180| 33| 33|
|SampleMetrics| https://storagelocation/cdefgh3456789| v70179.0| false| ReadWrite| | w1v2u3-1234-d7e6f5-8901234abc| 475,587,055,800| 27,214,500,605| 22,987,534,959| 4,226,965,646| 1,124,828,461| 475,587,055,800| 27,214,500,605| 22,987,534,959| 4,226,965,646| 1,124,828,461| 182| 182|
|SecurityLogs| https://storagelocation/bcdefg2345678| v25.0| false| ReadWrite| | a1b2c3-1234-d4e5f7-8901234abc| 6,541,515| 7,718,171| 5,774,797| 1,943,374| 40,323| 6,541,515| 7,718,171| 5,774,797| 1,943,374| 40,323| 8| 8|
|SampleLogs| https://storagelocation01/abcdefg123456721461682248| v252.0 |false|ReadWrite | | a1b2c3-1234-d4e5f7-8901234abc| 334,521,429,815|25,464,984,656|21,461,682,248| 4,003,302,408| 885,206,395| 334,521,429,815| 25,464,984,656| 21,461,682,248| 4,003,302,408| 885,206,395| 104|104|
|Samples| https://storagelocation/bcdefg2345678| v3381.2| true| ReadWrite| | z9y8x7-1234-l5m6n7-8901234abc| 579,596,574,125| 122,154,458,750| 98,946,037,133| 23,208,421,617| 2,236,670,722| 579,596,574,125| 122,154,458,750| 98,946,037,133| 23,208,421,617| 2,236,670,722| 173| 173|
|FindMyPartner| https://storagelocation01/zabcdef0123456| v37.0| false| ReadWrite| | z1b2c3-1234-d4e5f7-8901234abc| 34,259| 53,075| 40,698| 12,377| 38| 34,259| 53,075| 40,698| 12,377| 38| 1| 1|
|SampleIoTData| https://storagelocation01/yzabcd0123456| v145.0| false| ReadWrite| | y1b2c3-1234-d4e5f7-8901234abc| 163,026,882| 45,743,179| 33,419,597| 12,323,582| 1,202,160| 163,026,882| 45,743,179| 33,419,597| 12,323,582| 1,202,160| 3| 3|
|ContosoSales| https://storagelocation01/xabcdef0123456| v241.7| false| ReadWrite| | x1b2c3-1234-d4e5f7-8901234abc| 18,506,982,546| 4,256,663,908| 3,602,512,666| 654,151,242| 12,092,847| 18,506,982,546| 4,256,663,908| 3,602,512,666| 654,151,242| 12,092,847| 10| 10|

::: moniker-end

:::moniker range="microsoft-fabric"

|DatabaseName|PersistentStorage| Version|IsCurrent|DatabaseAccessMode|PrettyName|DatabaseId |OriginalSize| ExtentSize| CompressedSize| IndexSize| RowCount| HotOriginalSize| HotExtentSize| HotCompressedSize| HotIndexSize| HotRowCount| TotalExtents| HotExtents|
|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
|h1i2j3-1234-k4l5m7-8901234abc |https://storagelocation/abcdefg1234567 |v33.0 |true |ReadWrite |city-temp-data-1 |a1b2c3-1234-d4e5f7-8901234abc |0 |0 |0 |0 |0 |0 |0 |0 |0 |0 |0 |0|
|s1r2q3-1234-t4e5f7-8901234abc|https://storagelocation01/bcdefg2345678 |v25.0 |false |ReadWrite |city-temp-data-2 |a1b2c3-1234-d4e5f7-8901234abc |239,026,900 |18,422,618 |15,104,815 |3,317,803 |618,794 |239,026,900 |18,422,618 |15,104,815 |3,317,803 |618,794 |1 |1|

::: moniker-end
