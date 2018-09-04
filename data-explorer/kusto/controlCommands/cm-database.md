---
title: Cluster Management -  Kusto Databases - Azure Kusto | Microsoft Docs
description: This article describes Cluster Management -  Kusto Databases in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cluster Management: Kusto Databases

## create database

```kusto
.create database [DatabaseName] [ifNotExists] in service [ServiceName] [with(    
    [DataRetentionPolicy='<JSON-serialization of the data retention policy for the database>',]
    [Administrators='<A comma-separated list of AAD objects to be defined as database administrators>',]
    [Users='<A comma-separated list of AAD objects to be defined as database users>',]
    [ExtentsMergePolicy='<JSON-serialization of the extents merge policy for the database>',]
    [CachingPolicyHotSpan='<Time span to be used as the hot data & hot index properties of the caching policy for the database>',]
    [PrettyName='<A pretty-name for the database>',]
    [NumberOfStorageAccounts='<The amount of storage accounts which the data storage containers will spread over>',]
    [AddRandomPrefixToStorageAccountNames='<true|false>',]
    [StorageAccountBaseName='<A base name for the storage accounts to be used>',]
)]
```

Runs on [https://manage-kusto.kusto.windows.net](https://manage-kusto.kusto.windows.net).  
Requires [TargetClusterOperator permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).  

Creates a new database for an existing Engine service, according to the provided parameters:
* ServiceName: the name of the Engine service.
* DatabaseName: the name of the database.
* [optional] ifNotExists: if specified, then attempting to create a database when there's already an existing database with the same name becomes a void operation that succeeds. Otherwise a failure is returned in such cases.
* [optional] [DataRetentionPolicy](https://kusdoc2.azurewebsites.net/docs/concepts/retentionpolicy.html): a JSON representation of the data retention policy to be set on the database. 
* [optional] [Administrators](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html): an array of AAD objects to be defined as database administrators. 
* [optional] [Users](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html): an array of AAD objects to be defined as database users. 

Advanced Usage:
* [optional] [ExtentsMergePolicy](https://kusdoc2.azurewebsites.net/docs/concepts/mergepolicy.html): a JSON representation of the extents merge policy to be set on the database. 
* [optional] [CachingPolicyHotSpan](https://kusdoc2.azurewebsites.net/docs/concepts/cachepolicy.html): a time span to be used as the hot data & hot index properties of the caching policy for the database. 
* [optional] [PrettyName](../query/schema-entities/overview.md): a pretty name for the database.
* [optional] NumberOfStorageAccounts: the number of storage accounts used to store data.
* [optional] AddRandomPrefixToStorageAccountNames: a boolean indicating whether or not to prefix storage account names by a 3 lowercase alphanumeric string (this is done to optimize storage partitions in azure, see more [here] (https://azure.microsoft.com/en-us/documentation/articles/storage-performance-checklist)). If not specified, defaults to 'false'.
* [optional] StorageAccountBaseName: the base name for the storage accounts to be used. If not specified, the service's default storage accounts will be used.
 * *NOTE*: The result base name mentioned above is concatenated to the cluster name, and then a suffix indicating the number of the storage account is added. In case the resulting name exceeds 24 characters, it is trimmed from the beginning until a maximum of 24 characters is received.
 * *Example*: In case the cluster name is `MyKustoCluster` (or URL is https://MyKustoCluster.kusto.windows.net), the base name is 'data' with 3 storage accounts, and AddRandomPrefixToStorageAccountNames is true, potential storage account names will be: ij5`mykustocluster`data`01`, r2u`mykustocluster`data`02` & nfg`mykustocluster`data`03`.

**Notes**
* By default a database will use a collection of storage accounts that is defined at the cluster level.
   * To change the default database storage accounts, use [set service](https://kusto.azurewebsites.net/internaldocs/controlCommands/CM-services.html#set-service-configuration-property) command with the property "NumberOfDatabaseStorageAccounts".
* If a policy is not specified, a default is used. policies can be changed later on by running a control command against the engine.
* When specifying a Data Retention Policy or an Extents Merge Policy, one can provide only a subset of the properties, and the rest will be set with default values.

**Examples**

* *Common case -* creating a new database:
  - named 'MyDatabase'
  - in the 'kustolab' cluster (URL is https://kustolab.kusto.windows.net)
  - with 7 days soft retention
  - with aadgroup 'MyDatabaseAdmins' as administrators
  - with aadgroup 'MyDatabaseUsers' as users

```kusto
.create database MyDatabase in service kustolab with (
    DataRetentionPolicy='{"SoftDeletePeriod": "7.00:00:00"}', 
    Administrators='aadgroup=MyDatabaseAdmins',
    Users='aadgroup=MyDatabaseUsers'
)
```

* *Advanced usage -* creating a new database:
  - named 'MyDatabase' 
  - in the 'Storm' cluster (URL is https://storm.kusto.windows.net)
  - with 3 storage accounts to use for persisting data
  - with a 'mydatabase' base name for storage accounts
  - with a soft delete period of '9' days
  - with setting database *administrators* to the following AAD group IDs: '1cc879b9-00d1-4d67-bb77-b1cc1693a2e5' & '7b9cebf7-195f-41df-b306-192560c6228c'
  - with setting database *users* to the following AAD group IDs: '1b6d96f5-b328-4e09-bb77-6c4721f921dd' & 'd5aaf51a-3d26-4589-868d-20a9d96618cd'
  - and setting the database's pretty name to 'MyPrettyDatabase'

```kusto
.create database MyDatabase in service Storm with(
    NumberOfStorageAccounts='3',
    StorageAccountBaseName='mydatabase',
    DataRetentionPolicy=@'{"SoftDeletePeriod": "9.00:00:00"}',
    Users='aadgroup=1cc879b9-00d1-4d67-bb77-b1cc1693a2e5,aadgroup=7b9cebf7-195f-41df-b306-192560c6228c',
    Administrators='aadgroup=1b6d96f5-b328-4e09-bb77-6c4721f921dd,aadgroup=d5aaf51a-3d26-4589-868d-20a9d96618cd',
    PrettyName='MyPrettyDatabase'
)
```
    
**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

.show operations 3827def6-0773-4f2a-859e-c02cf395deaf

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |DatabaseCreate | |2015-01-06 08:47:01 |2015-01-06 08:47:01 |0001-01-01 00:00:00 |Completed

## delete database

```kusto
// First phase
.delete database [DatabaseName] in service [ServiceName] [with(
    [DeleteStorageContainers='<true|false>',]
)]

// Second phase
.delete database [DatabaseName] in service [ServiceName] [with(
    [DeleteStorageContainers='<true|false>',]
    [VerificationToken='<A token that is received after first executing the command>',]
)]
```

Runs on [https://manage-kusto.kusto.windows.net](https://manage-kusto.kusto.windows.net).  
Requires [TargetClusterOperator permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).  

A two phase command which deletes the specified database for an existing Engine service, according to the provided parameters:
* ServiceName: Name of the Engine service.
* DatabaseName: Name of the database to be deleted.
 * *NOTE*: In case your cluster name is 'MyKustoCluster' (or URL is https://MyKustoCluster.kusto.windows.net), the service name is 'MyKustoCluster'.
* [optional] DeleteStorageContainers: whether to physically delete the database's storage containers or not. 
 * *Warning*: deletion of storage containers is a non-reversible process - data will be lost forever. However in case storage containers are not deleted, you will be charged for data stored in the containers. 
 * If not specified - defaults to false.
* [optional] VerificationToken: A token that can be used to commit the action.
 * If not specified - will trigger the command's first phase in which information about the database is returned and a token, that should be passed back to the command to perform the command's second phase which commits the action.

**Return output**
 
 The command's first phase returns the following output:

|Output parameter |Type |Description 
|---|---|---
|VerificationToken |String |A token that can be used to commit the action 
|NumQueries |Int |The number of queries done lately on that database 
|ExtentsSize |Double |The size of extents created lately on that database

**Examples**

* *Logical delete case:* Deleting a database without its storage containers:
  - named 'MyDatabase'
  - in the 'Storm' cluster (URL is https://storm.kusto.windows.net)

```kusto
.delete database MyDatabase in service Storm
```
**Return output**

|VerificationToken |NumQueries |ExtentsSize 
|--|--|--
|e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b |0 |0

To commit the action use the verification token returned and run the following command:

```kusto
.delete database MyDatabase in service Storm with (
    VerificationToken='e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b'
)
```

**Return output**

|OperationId |RootActivityId |OperationInfo
|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |067b5186-b47f-4c25-9259-3920659e7fcb | .show operations c9651d74-3b80-4183-90bb-bbe9e42eadc4

.show operations c9651d74-3b80-4183-90bb-bbe9e42eadc4

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status |RootActivityId |ShouldRetry |Database 
|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |DatabaseDelete | |2015-01-06 08:47:01 |2015-01-06 08:47:01 |0001-01-01 00:00:00 |Completed | |067b5186-b47f-4c25-9259-3920659e7fcb |False |CM

* *Physical delete case:* Deleting a database including its storage containers:
  - named 'MyDatabase' 
  - in the 'Storm' cluster (URL is https://storm.kusto.windows.net)

```kusto
.delete database MyDatabase in service Storm with(
    DeleteStorageContainers='true'
)
```    
**Return output**

|VerificationToken |NumQueries |ExtentsSize 
|--|--|--
|f276d1c07b20540497231a5d4ed59f3195103cb51c5d4148042c7c9e3bfcd75b |0 |0

The first phase of the command returns information about the database and a token.
To commit the action use the verification token returned and run the following command:

```kusto
.delete database MyDatabase in service Storm with(
    DeleteStorageContainers='true',
    VerificationToken='f276d1c07b20540497231a5d4ed59f3195103cb51c5d4148042c7c9e3bfcd75b'
)
``` 

**Return output**

|OperationId |RootActivityId |OperationInfo
|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |067b5186-b47f-4c25-9259-3920659e7fcb | .show operations c9651d74-3b80-4183-90bb-bbe9e42eadc4

.show operations c9651d74-3b80-4183-90bb-bbe9e42eadc4

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status |RootActivityId |ShouldRetry |Database 
|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |DatabaseDelete | |2015-01-06 08:47:01 |2015-01-06 08:47:01 |0001-01-01 00:00:00 |Completed | |067b5186-b47f-4c25-9259-3920659e7fcb |False |CM


## move database

```kusto
// First phase
.move database [DatabaseName] from service [SourceServiceName] to service [TargetServiceName] [with(
    [TargetDatabaseName='<Target database name to use>',] 
)]

// Second phase
.move database [DatabaseName] from service [SourceServiceName] to service [TargetServiceName] [with(
    [VerificationToken='<A token that is received after first executing the command>',]
    [TargetDatabaseName='<Target database name to use>',] 
)]
```

Runs on [https://manage-kusto.kusto.windows.net](https://manage-kusto.kusto.windows.net).  
Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

A two phase command which moves the specified database from one Engine service to another Engine service.
* SourceServiceName: Name of the source Engine service.
* TargetServiceName: Name of the target Engine service.
* DatabaseName: Name of the database to be moved.
* [optional] VerificationToken: A token that can be used to commit the action.
 * If not specified - will trigger the command's first phase in which information about the database is returned and a token, that should be passed back to the command to perform the command's second phase which commits the action.
* [optional] TargetDatabaseName: Target database name to use when attaching the database to the target service.
 * If not specified - defaults to DatabaseName.

**NOTE**
* After moving the database, data ingestion to the old database will fail. The first phase of the command returns The timestamp of the latest created extent in the database to make it easy to verify that there is no active ingestion to the old database.
* Renaming a database can be done by using the same service name as the source and the target.

**Return output**
 
 The command's first phase returns the following output:

|Output parameter |Type |Description 
|---|---|---
|LatestExtentTimestamp |DateTime | The timestamp of the latest created extent in the database 
|VerificationToken |String |A token that can be used to commit the action 

**Examples**

```kusto
.move database MyDatabase from service Storm to service CoolService
```
**Return output**

|LatestExtentTimestamp |VerificationToken 
|--|--
|2016-10-30 09:17:47.7486866 |MIICwQYJKoZIhvcNAQcDoIICsjCCAq4CAQAxggHAMIIBvAIBADCBozCBizELMAkGA1UE== 

To commit the action use the verification token returned and run the following command:

```kusto
.move database MyDatabase from service Storm to service CoolService with (
    VerificationToken='MIICwQYJKoZIhvcNAQcDoIICsjCCAq4CAQAxggHAMIIBvAIBADCBozCBizELMAkGA1UE=='
)
```

**Return output**

|OperationId |RootActivityId |OperationInfo
|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |067b5186-b47f-4c25-9259-3920659e7fcb | .show operations c9651d74-3b80-4183-90bb-bbe9e42eadc4

.show operations c9651d74-3b80-4183-90bb-bbe9e42eadc4

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status |RootActivityId |ShouldRetry |Database 
|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |DatabaseMove | |2015-01-06 08:47:01 |2015-01-06 08:47:01 |0001-01-01 00:00:00 |Completed | |067b5186-b47f-4c25-9259-3920659e7fcb |False |CM

## rename database

Renaming a database can be done by using the [move database](#move-database) command,
in the following way:
* The *SourceServiceName* and *TargetServiceName* must be the same.
* *DatabaseName* is set to the current database name, and *TargetDatabaseName*
  is set to the desired new name.
 