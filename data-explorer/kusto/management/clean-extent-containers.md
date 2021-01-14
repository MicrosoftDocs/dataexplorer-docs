---
title: Clean Extent Containers - Azure Data Explorer | Microsoft Docs
description: This article describes Clean Extent Containers commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 01/14/2021
---
# Clean Extent Containers command

### .clean databases extentcontainers

The command allows deleting unused storage artifacts from the underlying storage accounts of the cluster that are left from the maintenance and background operations on shards /extents. The command runs in the background. The command can be called on a list of databases or on all the databases in the cluster. A separate operation is initialized per database and can be monitored later.

> [!WARNING]
> Once this command is run, the recoverability if define in the [retention policy](../management/retentionpolicy.md) will be reset to the time when the command started.
> meaning there will not be a way to change the applicable database state to an earlier point in time. 
> Thus it is strongly advised to run this command only based on Azure Advisor recommendation.

**Syntax**

`.clean` `databases` `extentcontainers`

`.clean` `databases`  `(`*DatabaseName1*`,`...`,`*DatabaseNameN*`)`  `extentcontainers`


**Example**

```kusto
.clean databases extentcontainers

.clean databases (DB1, Db2) extentcontainers
```

**Output** 

| Output parameter                     | Type    | Description                                                                                                        |
|--------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| OperationId                          | Guid    | The operation id.                                                                                                  |
| LastUpdatedOn                        | DateTime| The datetime of the last operation's update.                                                                       |
| Database                             | String  | The name of the database on which the operation was activated.                                                     |
| DatabaseMajorVersion                 | Integer | The major version of the database based on which the cleanup is performed.                                         |
| DatabaseManorVersion                 | Integer | The minor version of the database based on which the cleanup is performed.                                         |
| Database                             | Guid    | The id of the database on which the operation was activated.                                                       |
| State                                | String  | The state of the operation.                                                                                        |



### .show database extentcontainers clean operations

The command allows monitoring of the clean operations on the database level

**Syntax**

`.show` `database` *DatabaseName1* `extentcontainers` `clean` `operations` 
`.show` `database` *DatabaseName1* `extentcontainers` `clean` `operations` *operation_id*


**Example**

```kusto
.show database DB1 extentcontainers clean operations 

.show database DB1 extentcontainers clean operations 674d33e4-1a61-4bfb-a8d9-1378a90a56db
```

**Output** 

| Output parameter                     | Type    | Description                                                                                                        |
|--------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| OperationId                          | Guid    | The operation id.                                                                                                  |
| LastUpdatedOn                        | DateTime| The datetime of the last operation's update.                                                                       |
| Database                             | String  | The name of the database on which the operation was activated.                                                     |
| DatabaseVersion                      | String  | The version of the database based on which the cleanup is performed.                                               |
| State                                | String  | The state of the operation.                                                                                        |

