---
title: Cluster follower commands - Azure Data Explorer | Microsoft Docs
description: This article describes Cluster follower commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/11/2019
---
# Cluster follower commands

Control commands for managing the follower cluster configuration are listed below. These commands run synchronously, but are applied on the next periodic schema refresh. Therefore, there may be a few minutes delay until the new configuration is applied.



The follower commands include [database level commands](#database-level-commands) and [table level commands](#table-level-commands).

## Database level commands

### .show follower database

Shows a database (or databases) followed from other leader cluster, which have one or more database-level overrides configured.


**Syntax**

`.show` `follower` `database` *DatabaseName*

`.show` `follower` `databases` `(`*DatabaseName1*`,`...`,`*DatabaseNameN*`)`

**Output** 

| Output parameter                     | Type    | Description                                                                                                        |
|--------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| DatabaseName                         | String  | The name of the database being followed.                                                                           |
| LeaderClusterMetadataPath            | String  | The path to the leader cluster's metadata container.                                                               |
| CachingPolicyOverride                | String  | An override caching policy for the database, serialized as JSON or null.                                         |
| AuthorizedPrincipalsOverride         | String  | An override collection of authorized principals for the database, serialized as JSON or null.                    |
| AuthorizedPrincipalsModificationKind | String  | The modification kind to apply using AuthorizedPrincipalsOverride (`none`, `union` or `replace`).                  |
| CachingPoliciesModificationKind      | String  | The modification kind to apply using database or table-level caching policy overrides (`none`, `union` or `replace`). |
| IsAutoPrefetchEnabled                | Boolean | Whether new data is pre-fetched upon each schema refresh.        |
| TableMetadataOverrides               | String  | A JSON serialization of table-level property overrides (if they are defined).                                      |

### .alter follower database policy caching

Alters a follower database caching policy, to override the one set on the source database in the leader cluster. 
It requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md).



**Notes**

* The default `modification kind` for caching policies is `union`. To change the `modification kind` use the [.alter follower database caching-policies-modification-kind](#alter-follower-database-caching-policies-modification-kind) command.
* Viewing the policy or effective policies after the change can be done using the `.show` commands:
    * [.show database policy retention](../management/retention-policy.md#show-retention-policy)
    * [.show database details](../management/databases.md#show-databases)
    * [.show table details](../management/tables.md#show-table-details)
* Viewing the override settings on the follower database after the change is made can be done using [.show follower database](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName* `policy` `caching` `hot` `=` *HotDataSpan*



**Example**



```kusto
.alter follower database MyDb policy caching hot = 7d
```

### .delete follower database policy caching

Deletes a follower database override caching policy. This causes the policy set on the source database in the leader cluster the effective one.
It requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md). 

**Notes**

* Viewing the policy or effective policies after the change can be done using the `.show` commands:
    * [.show database policy retention](../management/retention-policy.md#show-retention-policy)
    * [.show database details](../management/databases.md#show-databases)
    * [.show table details](../management/tables.md#show-table-details)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**

`.delete` `follower` `database` *DatabaseName* `policy` `caching`

**Example**

```kusto
.delete follower database MyDB policy caching
```

### .add follower database principals

Adds authorized principal(s) to the follower database collection of override authorized principals. 
It requires [DatabaseAdmin permission](../management/access-control/role-based-authorization.md).



**Notes**

* The default `modification kind` for such authorized principals is `none`. To change the `modification kind` use  [alter follower database principals-modification-kind](#alter-follower-database-principals-modification-kind).
* Viewing the effective collection of principals after the change can be done using the `.show` commands:
    * [.show database principals](../management/security-roles.md#managing-database-security-roles)
    * [.show database details](../management/databases.md#show-databases)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**

`.add` `follower` `database` *DatabaseName* (`admins` | `users` | `viewers` | `unrestrictedviewers` | `monitors`) Role `(`*principal1*`,`...`,`*principalN*`)` [`'`*notes*`'`]




**Example**

```kusto
.add follower database MyDB viewers ('aadgroup=mygroup@microsoft.com') 'My Group'
```

```kusto

```

### .drop follower database principals

Drops authorized principal(s) from the follower database collection of override authorized principals.
It requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md).

**Notes**

* Viewing the effective collection of principals after the change can be done using the `.show` commands:
    * [.show database principals](../management/security-roles.md#managing-database-security-roles)
    * [.show database details](../management/databases.md#show-databases)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**

`.drop` `follower` `database` *DatabaseName*
(`admins` | `users` | `viewers` | `unrestrictedviewers` | `monitors`) `(`*principal1*`,`...`,`*principalN*`)`

**Example**

```kusto
.drop follower database MyDB viewers ('aadgroup=mygroup@microsoft.com')
```

### .alter follower database principals-modification-kind

Alters the follower database authorized principals modification kind. 
It requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md).

**Notes**

* Viewing the effective collection of principals after the change can be done using the `.show` commands:
    * [.show database principals](../management/security-roles.md#managing-database-security-roles)
    * [.show database details](../management/databases.md#show-databases)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName*
`principals-modification-kind` = (`none` | `union` | `replace`)



**Example**

```kusto
.alter follower database MyDB principals-modification-kind = union
```

### .alter follower database caching-policies-modification-kind

Alters the follower database and table caching policies modification kind. 
It requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md).

**Notes**

* Viewing the effective collection of database/table-level caching policies after the change can be done using the standard `.show` commands:
    * [.show tables details](../management/tables.md#show-table-details)
    * [.show database details](../management/databases.md#show-databases)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName* `caching-policies-modification-kind` = (`none` | `union` | `replace`)



**Example**

```kusto
.alter follower database MyDB caching-policies-modification-kind = union
```



## Table level commands

### .alter follower table policy caching

Alters a table-level caching policy on the follower database, to override the policy set on the source database in the leader cluster.
It requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md). 



**Notes**

* Viewing the policy or effective policies after the change can be done using the `.show` commands:
    * [.show database policy retention](../management/retention-policy.md#show-retention-policy)
    * [.show database details](../management/databases.md#show-databases)
    * [.show table details](../management/tables.md#show-table-details)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**





`.alter` `follower` `database` *DatabaseName* table *TableName* `policy` `caching` `hot` `=` *HotDataSpan*

`.alter` `follower` `database` *DatabaseName* tables `(`*TableName1*`,`...`,`*TableNameN*`)` `policy` `caching` `hot` `=` *HotDataSpan*

**Example**



```kusto
.alter follower database MyDb tables (Table1, Table2) policy caching hot = 7d
```

### .delete follower table policy caching

Deletes an override table-level caching policy on the follower database, making the policy set on the source database in the leader cluster the effective one. 
Requires [DatabaseAdmin permissions](../management/access-control/role-based-authorization.md). 

**Notes**

* Viewing the policy or effective policies after the change can be done using the `.show` commands:
    * [.show database policy retention](../management/retention-policy.md#show-retention-policy)
    * [.show database details](../management/databases.md#show-databases)
    * [.show table details](../management/tables.md#show-table-details)
* Viewing the override settings on the follower database after the change can be done using [.show follower database](#show-follower-database)

**Syntax**

`.delete` `follower` `database` *DatabaseName* `table` *TableName* `policy` `caching`

`.delete` `follower` `database` *DatabaseName* `tables` `(`*TableName1*`,`...`,`*TableNameN*`)` `policy` `caching`

**Example**

```kusto
.delete follower database MyDB tables (Table1, Table2) policy caching
```

## Sample configuration

The following are sample steps to configure a follower database.

In this example:

* Our follower cluster, `MyFollowerCluster` will be following database `MyDatabase` from the leader cluster, `MyLeaderCluster`.
    * `MyDatabase` has `N` tables: `MyTable1`, `MyTable2`, `MyTable3`, ... `MyTableN` (`N` > 3).
    * On `MyLeaderCluster`:
    
    | `MyTable1` caching policy | `MyTable2` caching policy | `MyTable3`...`MyTableN` caching policy   | `MyDatabase` Authorized principals                                                    |
    |---------------------------|---------------------------|------------------------------------------|---------------------------------------------------------------------------------------|
    | hot data span = `7d`      | hot data span = `30d`     | hot data span = `365d`                   | *Viewers* = `aadgroup=scubadivers@contoso.com`; *Admins* = `aaduser=jack@contoso.com` |
     
    * On `MyFollowerCluster` we want:
    
    | `MyTable1` caching policy | `MyTable2` caching policy | `MyTable3`...`MyTableN` caching policy   | `MyDatabase` Authorized principals                                                    |
    |---------------------------|---------------------------|------------------------------------------|---------------------------------------------------------------------------------------|
    | hot data span = `1d`      | hot data span = `3d`      | hot data span = `0d` (nothing is cached) | *Admins* = `aaduser=jack@contoso.com`, *Viewers* = `aaduser=jill@contoso.com`         |

> [!IMPORTANT] 
> Both `MyFollowerCluster` and `MyLeaderCluster` must be in the same region.
> If you aren't certain in which region your cluster resides, the [support bot](https://aka.ms/kustosupport)
> provides you with a *Cluster Information* option that will provide you with that information.

### Steps to execute

> [!NOTE]
> The principal running the control commands is expected to be a `DatabaseAdmin` on database `MyDatabase`.

#### Setting up the follower cluster



1. See the current configuration according to which `MyDatabase` is being followed on `MyFollowerCluster`:

```kusto
.show follower database MyDatabase
| evaluate narrow() // just for presentation purposes
```

| Column                              | Value                                                    |
|-------------------------------------|----------------------------------------------------------|
|DatabaseName                         | MyDatabase                                               |
|LeaderClusterMetadataPath            | https://storageaccountname.blob.core.windows.net/cluster |
|CachingPolicyOverride                | null                                                     |
|AuthorizedPrincipalsOverride         | []                                                       |
|AuthorizedPrincipalsModificationKind | None                                                     |
|IsAutoPrefetchEnabled                | False                                                    |
|TableMetadataOverrides               |                                                          |
|CachingPoliciesModificationKind      | Union                                                    |                                                                                                                      |

#### Override authorized principals

Replace the collection of authorized principals for `MyDatabase` on `MyFollowerCluster` with a collection that includes only one AAD user as the database admin, and one AAD user as a database viewer:

```kusto
.add follower database MyDatabase admins ('aaduser=jack@contoso.com')

.add follower database MyDatabase viewers ('aaduser=jill@contoso.com')

.alter follower database MyDatabase principals-modification-kind = replace
```

Only those two specific principals are authorized to access `MyDatabase` on `MyFollowerCluster`

```kusto
.show database MyDatabase principals
```

| Role                       | PrincipalType | PrincipalDisplayName                        | PrincipalObjectId                    | PrincipalFQN                                                                      | Notes |
|----------------------------|---------------|---------------------------------------------|--------------------------------------|-----------------------------------------------------------------------------------|-------|
| Database MyDatabase Admin  | AAD User      | Jack Kusto    (upn: jack@contoso.com)       | 12345678-abcd-efef-1234-350bf486087b | aaduser=87654321-abcd-efef-1234-350bf486087b;55555555-4444-3333-2222-2d7cd011db47 |       |
| Database MyDatabase Viewer | AAD User      | Jill Kusto    (upn: jack@contoso.com)       | abcdefab-abcd-efef-1234-350bf486087b | aaduser=54321789-abcd-efef-1234-350bf486087b;55555555-4444-3333-2222-2d7cd011db47 |       |

```kusto
.show follower database MyDatabase
| mv-expand parse_json(AuthorizedPrincipalsOverride)
| project AuthorizedPrincipalsOverride.Principal.FullyQualifiedName
```

| AuthorizedPrincipalsOverride_Principal_FullyQualifiedName                         |
|-----------------------------------------------------------------------------------|
| aaduser=87654321-abcd-efef-1234-350bf486087b;55555555-4444-3333-2222-2d7cd011db47 |
| aaduser=54321789-abcd-efef-1234-350bf486087b;55555555-4444-3333-2222-2d7cd011db47 |

#### Override Caching policies

Replace the collection of database and table-level caching policies for `MyDatabase` on `MyFollowerCluster` by setting all tables to *not* have their data cached, excluding two specific tables - `MyTable1`, `MyTable2` - that will have their data cached for periods of `1d` and `3d`, respectively:

```kusto
.alter follower database MyDatabase policy caching hot = 0d

.alter follower database MyDatabase table MyTable1 policy caching hot = 1d

.alter follower database MyDatabase table MyTable2 policy caching hot = 3d

.alter follower database MyDatabase caching-policies-modification-kind = replace
```

Only those two specific tables have data cached, and the rest of the tables have a hot data period of `0d`:

```kusto
.show tables details
| summarize TableNames = make_list(TableName) by CachingPolicy
```
| CachingPolicy                                                                | TableNames                  |
|------------------------------------------------------------------------------|-----------------------------|
| {"DataHotSpan":{"Value":"1.00:00:00"},"IndexHotSpan":{"Value":"1.00:00:00"}} | ["MyTable1"]                |
| {"DataHotSpan":{"Value":"3.00:00:00"},"IndexHotSpan":{"Value":"3.00:00:00"}} | ["MyTable2"]                |
| {"DataHotSpan":{"Value":"0.00:00:00"},"IndexHotSpan":{"Value":"0.00:00:00"}} | ["MyTable3",...,"MyTableN"] |

```kusto
.show follower database MyDatabase
| mv-expand parse_json(TableMetadataOverrides)
| project TableMetadataOverrides
```

| TableMetadataOverrides                                                                                              |
|---------------------------------------------------------------------------------------------------------------------|
| {"MyTable1":{"CachingPolicyOverride":{"DataHotSpan":{"Value":"1.00:00:00"},"IndexHotSpan":{"Value":"1.00:00:00"}}}} |
| {"MyTable2":{"CachingPolicyOverride":{"DataHotSpan":{"Value":"3.00:00:00"},"IndexHotSpan":{"Value":"3.00:00:00"}}}} |

#### Summary

See the current configuration where `MyDatabase` is being followed on `MyFollowerCluster`:

```kusto
.show follower database MyDatabase
| evaluate narrow() // just for presentation purposes
```

| Column                              | Value                                                                                                                                                                           |
|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|DatabaseName                         | MyDatabase                                                                                                                                                                      |
|LeaderClusterMetadataPath            | https://storageaccountname.blob.core.windows.net/cluster                                                                                                                        |
|CachingPolicyOverride                | {"DataHotSpan":{"Value":"00:00:00"},"IndexHotSpan":{"Value":"00:00:00"}}                                                                                                        |
|AuthorizedPrincipalsOverride         | [{"Principal":{"FullyQualifiedName":"aaduser=87654321-abcd-efef-1234-350bf486087b",...},{"Principal":{"FullyQualifiedName":"aaduser=54321789-abcd-efef-1234-350bf486087b",...}] |
|AuthorizedPrincipalsModificationKind | Replace                                                                                                                                                                         |
|IsAutoPrefetchEnabled                | False                                                                                                                                                                           |
|TableMetadataOverrides               | {"MyTargetTable":{"CachingPolicyOverride":{"DataHotSpan":{"Value":"3.00:00:00"}...},"MySourceTable":{"CachingPolicyOverride":{"DataHotSpan":{"Value":"1.00:00:00"},...}}}       |
|CachingPoliciesModificationKind      | Replace                                                                                                                                                                         |