---
title: Clean extent containers in Azure Data Explorer
description: This article describes .clean extent containers commands in Azure Data Explorer
ms.reviewer: vrozov
ms.topic: reference
ms.date: 01/17/2021
---
# Clean extent containers commands

This article describes the `.clean databases extentcontainers` and `.show database extentcontainers clean operations` commands in Azure Data Explorer.

## .clean databases extentcontainers

The `.clean databases extentcontainers` command deletes unused storage artifacts that are left from the maintenance and background operations on [data shards (extents)](extents-overview.md). The command runs in the background on the underlying storage accounts of a cluster. This command can be called on a specific list of databases or on all the databases in the cluster. A separate operation is initialized for each database, and these operations can be monitored with the [`.show database extentcontainers clean operations`](#show-database-extentcontainers-clean-operations) command.

> [!WARNING]
> Once the `.clean databases extentcontainers` command is run, the recoverability defined in the [retention policy](../management/retentionpolicy.md) is reset to the time when the command was executed by the user. You won't be able change the database state to an earlier point in time. We advise only running this command based on [Azure Advisor recommendation](../../azure-advisor.md#delete-unused-storage-artifacts).

## Permissions

This command requires [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions.

### Syntax

`.clean` `databases` `extentcontainers`
<br>

`.clean` `databases`  `(`*DatabaseName1*`,`...`,`*DatabaseNameN*`)`  `extentcontainers`

### Example

```kusto
.clean databases extentcontainers

.clean databases (DB1, DB2) extentcontainers
```

### Output

| Output parameter                     | Type    | Description                                                                                                        |
|--------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| OperationId                          | Guid    | The operation ID.                                                                                                  |
| LastUpdatedOn                        | DateTime| The datetime of the last operation's update.                                                                       |
| Database                             | String  | The name of the database on which the operation was activated.                                                     |
| DatabaseMajorVersion                 | Integer | The major version of the database based on which the cleanup is done.                                         |
| DatabaseManorVersion                 | Integer | The minor version of the database based on which the cleanup is done.                                         |
| Database                             | Guid    | The ID of the database on which the operation was activated.                                                       |
| State                                | String  | The state of the operation.                                                                                        |

## .show database extentcontainers clean operations

This command monitors the [`.clean databases extentcontainers`](#clean-databases-extentcontainers) operations on the database level.

You must have an AllDatabasesAdmin, AllDatabasesMonitor or specific database admin or monitor permission to execute this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

The cleanup action doesn’t start immediately after running the command. A delay period of at least five days is set by the system.
The initial state is 'Cleanup requested'.

### Syntax

`.show` `database` *DatabaseName1* `extentcontainers` `clean` `operations`
<br>
 
`.show` `database` *DatabaseName1* `extentcontainers` `clean` `operations` *operation_id*

### Example

```kusto
.show database DB1 extentcontainers clean operations 

.show database DB1 extentcontainers clean operations 674d33e4-1a61-4bfb-a8d9-1378a90a56db
```

### Output

| Output parameter                     | Type    | Description                                                                                                        |
|--------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| OperationId                          | Guid    | The operation ID.                                                                                                  |
| LastUpdatedOn                        | DateTime| The datetime of the last operation's update.                                                                       |
| Database                             | String  | The name of the database on which the operation was activated.                                                     |
| DatabaseVersion                      | String  | The version of the database based on which the cleanup is done.                                               |
| State                                | String  | The state of the operation.                                                                                        |
