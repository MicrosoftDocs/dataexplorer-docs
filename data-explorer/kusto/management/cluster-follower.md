---
title:  Follower commands
description: Learn how to use follower commands to manage your follower configuration.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# Follower commands

Management commands for managing your follower configuration. These commands run synchronously but are applied on the next periodic schema refresh, which may result in a short delay until the new configuration is applied.

The follower commands include [database level commands](#database-level-commands) and [table level commands](#tables-and-materialized-views-commands).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Database policy overrides

A leader database can override the following database-level policies in the follower cluster: [Caching policy](#caching-policy) and [Authorized principals](#authorized-principals).

### Caching policy

The default [caching policy](cachepolicy.md) for the follower cluster uses the leader cluster database and table-level caching policies.

|Option             |Description                                 |
|-------------------|----------------------------------------------|
|**None**           |The caching policies used are those policies defined in the source database in the leader cluster.   |
|**replace**        |The source database in the leader cluster database and table-level caching policies are removed (set to `null`). These policies are replaced by the database and table-level override policies, if defined.|
|**union**(default) |The source database in the leader cluster database and table-level caching policies are combined with the policies defined in the database and table-level override policies.   |

> [!NOTE]
>
> * If the collection of override database and table-level caching policies is *empty*, then everything is cached by default.
> * You can set the database-level caching policy override to `0d`, and nothing will be cached by default.

### Authorized principals

|Option             |Description                                                                                                                              |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
|**None**           |The [authorized principals](../access-control/index.md#authorization) are defined in the source database of the leader cluster.     |
|**replace**        |The override authorized principals replace the authorized principals from the source database in the leader cluster.  |
|**union**(default) |The override authorized principals are combined with the authorized principals from the source database in the leader cluster. |

> [!NOTE]
> If the collection of override authorized principals is *empty*, there will be no database-level principals.

## Table and materialized views policy overrides

By default, tables and materialized views in a database that is being followed by a follower cluster keep the source entity's caching policy.
However, table and materialized view [caching policies](cachepolicy.md) can be overridden in the follower cluster.
Use the `replace` option to override the source entity's caching policy.

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
| CachingPolicyOverride                | String  | An override caching policy for the database, serialized as JSON, or null.                                         |
| AuthorizedPrincipalsOverride         | String  | An override collection of authorized principals for the database, serialized as JSON, or null.                    |
| AuthorizedPrincipalsModificationKind | String  | The modification kind to apply using AuthorizedPrincipalsOverride (`none`, `union`, or `replace`).                  |
| CachingPoliciesModificationKind      | String  | The modification kind to apply using database or table-level caching policy overrides (`none`, `union`, or `replace`). |
| IsAutoPrefetchEnabled                | Boolean | Whether new data is pre-fetched upon each schema refresh.        |
| TableMetadataOverrides               | String  | If defined, A JSON serialization of table-level property overrides.              |

### .alter follower database policy caching

Alters a follower database caching policy, to override the one set on the source database in the leader cluster.

**Notes**

* The default `modification kind` for caching policies is `union`. To change the `modification kind`, use the [`.alter follower database caching-policies-modification-kind`](#alter-follower-database-caching-policies-modification-kind) command.
* Viewing the policy or effective policies after the change can be done using the `.show` commands:
    * [`.show database policy retention`](./show-table-retention-policy-command.md)
    * [`.show database details`](../management/show-databases.md)
    * [`.show table details`](show-tables-command.md)
* Viewing the override settings on the follower database after the change is made can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName* `policy` `caching` `hot` `=` *HotDataSpan*

**Example**

```kusto
.alter follower database MyDb policy caching hot = 7d
```

### .delete follower database policy caching

Deletes a follower database override caching policy. This deletion causes the policy set on the source database in the leader cluster the effective one.

**Notes**

* Viewing the policy or effective policies after the change can be done using the `.show` commands:
    * [`.show database policy retention`](./show-table-retention-policy-command.md)
    * [`.show database details`](../management/show-databases.md)
    * [`.show table details`](show-tables-command.md)
* Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.delete` `follower` `database` *DatabaseName* `policy` `caching`

**Example**

```kusto
.delete follower database MyDB policy caching
```

### .add follower database principals

Adds authorized principal(s) to the follower database collection of override authorized principals.
**Notes**

* The default `modification kind` for such authorized principals is `none`. To change the `modification kind` use  [alter follower database principals-modification-kind](#alter-follower-database-principals-modification-kind).
* Viewing the effective collection of principals after the change can be done using the `.show` commands:
    * [`.show database principals`](../management/manage-database-security-roles.md#show-existing-security-roles)
    * [`.show database details`](../management/show-databases.md)
* Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.add` `follower` `database` *DatabaseName* (`admins` | `users` | `viewers` | `monitors`) Role `(`*principal1*`,`...`,`*principalN*`)` [`'`*notes*`'`]

**Example**

```kusto
.add follower database MyDB viewers ('aadgroup=mygroup@microsoft.com') 'My Group'
```

### .drop follower database principals

Drops authorized principal(s) from the follower database collection of override authorized principals.

> [!NOTE]
> * Viewing the effective collection of principals after the change can be done using the `.show` commands:
>    * [`.show database principals`](../management/manage-database-security-roles.md#show-existing-security-roles)
>    * [`.show database details`](../management/show-databases.md)
> * Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.drop` `follower` `database` *DatabaseName*
(`admins` | `users` | `viewers` | `monitors`) `(`*principal1*`,`...`,`*principalN*`)`

**Example**

```kusto
.drop follower database MyDB viewers ('aadgroup=mygroup@microsoft.com')
```

### .alter follower database principals-modification-kind

Alters the follower database authorized principals modification kind.

> [!NOTE]
> * Viewing the effective collection of principals after the change can be done using the `.show` commands:
>    * [`.show database principals`](../management/manage-database-security-roles.md#show-existing-security-roles)
>    * [`.show database details`](../management/show-databases.md)
> * Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName*
`principals-modification-kind` = (`none` | `union` | `replace`)

**Example**

```kusto
.alter follower database MyDB principals-modification-kind = union
```

### .alter follower database caching-policies-modification-kind

Alters the caching policies modification kind for the follower database, table, and materialized views.

> [!NOTE]
> * Viewing the effective collection of database/table-level caching policies after the change can be done using the standard `.show` commands:
>    * [`.show tables details`](show-tables-command.md)
>    * [`.show database details`](../management/show-databases.md)
> * Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName* `caching-policies-modification-kind` = (`none` | `union` | `replace`)

**Example**

```kusto
.alter follower database MyDB caching-policies-modification-kind = union
```

### .alter follower database prefetch-extents

The follower cluster can wait for new data to be fetched from the underlying storage to the nodes' SSD (cache) before making this data queryable.

The following command alters the follower database configuration of pre-fetching new extents upon each schema refresh.

> [!WARNING]
> * This setting can degrade the freshness of data in the follower database.
> * The default configuration is `false`, and it is recommended to use the default.
> * When choosing to alter the setting to `true`, closely evaluate the impact on freshness for some time period after the configuration change.

**Syntax**

`.alter` `follower` `database` *DatabaseName* `prefetch-extents` = (`true` | `false`)

**Example**

<!-- csl -->
```
.alter follower database MyDB prefetch-extents = false
```

## Tables and materialized views commands

### Alter follower table or materialized view caching policy

Alters a table's or a materialized view's caching policy on the follower database, to override the policy set on the source database in the leader cluster.

> [!NOTE]
> * Viewing the policy or effective policies after the change can be done using the `.show` commands:
>    * [`.show database policy retention`](./show-table-retention-policy-command.md)
>    * [`.show database details`](../management/show-databases.md)
>    * [`.show table details`](show-tables-command.md)
> * Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.alter` `follower` `database` *DatabaseName* table *TableName* `policy` `caching` `hot` `=` *HotDataSpan*

`.alter` `follower` `database` *DatabaseName* tables `(`*TableName1*`,`...`,`*TableNameN*`)` `policy` `caching` `hot` `=` *HotDataSpan*

`.alter` `follower` `database` *DatabaseName* materialized-view *ViewName* `policy` `caching` `hot` `=` *HotDataSpan*

`.alter` `follower` `database` *DatabaseName* materialized-views `(`*ViewName1*`,`...`,`*ViewNameN*`)` `policy` `caching` `hot` `=` *HotDataSpan*

**Examples**

```kusto
.alter follower database MyDb tables (Table1, Table2) policy caching hot = 7d

.alter follower database MyDb materialized-views (View1, View2) policy caching hot = 7d
```

### Delete follower table or materialized view caching policy

Deletes an override for a table's or a materialized-view's caching policy on the follower database. The policy set on the source database in the leader cluster will now be the effective policy.

> [!NOTE]
> * Viewing the policy or effective policies after the change can be done using the `.show` commands:
>    * [`.show database policy retention`](./show-table-retention-policy-command.md)
>    * [`.show database details`](../management/show-databases.md)
>    * [`.show table details`](show-tables-command.md)
> * Viewing the override settings on the follower database after the change can be done using [`.show follower database`](#show-follower-database)

**Syntax**

`.delete` `follower` `database` *DatabaseName* `table` *TableName* `policy` `caching`

`.delete` `follower` `database` *DatabaseName* `tables` `(`*TableName1*`,`...`,`*TableNameN*`)` `policy` `caching`

`.delete` `follower` `database` *DatabaseName* `materialized-view` *ViewName* `policy` `caching`

`.delete` `follower` `database` *DatabaseName* `materialized-views` `(`*ViewName1*`,`...`,`*ViewNameN*`)` `policy` `caching`

**Example**

```kusto
.delete follower database MyDB tables (Table1, Table2) policy caching

.delete follower database MyDB materialized-views (View1, View2) policy caching
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

### Steps to execute

*Prerequisite:* Set up cluster `MyFollowerCluster` to follow database `MyDatabase` from cluster `MyLeaderCluster`.

> [!NOTE]
> The principal running the management commands is expected to be a `DatabaseAdmin` on database `MyDatabase`.

#### Show the current configuration

See the current configuration according to which `MyDatabase` is being followed on `MyFollowerCluster`:

```kusto
.show follower database MyDatabase
| evaluate narrow() // just for presentation purposes
```

| Column                              | Value                                                    |
|-------------------------------------|----------------------------------------------------------|
|DatabaseName                         | MyDatabase                                               |
|LeaderClusterMetadataPath            | `https://storageaccountname.blob.core.windows.net/cluster` |
|CachingPolicyOverride                | null                                                     |
|AuthorizedPrincipalsOverride         | []                                                       |
|AuthorizedPrincipalsModificationKind | None                                                     |
|IsAutoPrefetchEnabled                | False                                                    |
|TableMetadataOverrides               |                                                          |
|CachingPoliciesModificationKind      | Union                                                    |

#### Override authorized principals

Replace the collection of authorized principals for `MyDatabase` on `MyFollowerCluster` with a collection that includes only one Microsoft Entra user as the database admin, and one Microsoft Entra user as a database viewer:

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
| Database MyDatabase Admin  | Microsoft Entra user      | Jack Kusto    (upn: jack@contoso.com)       | 12345678-abcd-efef-1234-350bf486087b | aaduser=87654321-abcd-efef-1234-350bf486087b;55555555-4444-3333-2222-2d7cd011db47 |       |
| Database MyDatabase Viewer | Microsoft Entra user      | Jill Kusto    (upn: jack@contoso.com)       | abcdefab-abcd-efef-1234-350bf486087b | aaduser=54321789-abcd-efef-1234-350bf486087b;55555555-4444-3333-2222-2d7cd011db47 |       |

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
|LeaderClusterMetadataPath            | `https://storageaccountname.blob.core.windows.net/cluster`                                                                                                                        |
|CachingPolicyOverride                | {"DataHotSpan":{"Value":"00:00:00"},"IndexHotSpan":{"Value":"00:00:00"}}                                                                                                        |
|AuthorizedPrincipalsOverride         | [{"Principal":{"FullyQualifiedName":"aaduser=87654321-abcd-efef-1234-350bf486087b",...},{"Principal":{"FullyQualifiedName":"aaduser=54321789-abcd-efef-1234-350bf486087b",...}] |
|AuthorizedPrincipalsModificationKind | Replace                                                                                                                                                                         |
|IsAutoPrefetchEnabled                | False                                                                                                                                                                           |
|TableMetadataOverrides               | {"MyTargetTable":{"CachingPolicyOverride":{"DataHotSpan":{"Value":"3.00:00:00"}...},"MySourceTable":{"CachingPolicyOverride":{"DataHotSpan":{"Value":"1.00:00:00"},...}}}       |
|CachingPoliciesModificationKind      | Replace                                                                                                                                                                         |
