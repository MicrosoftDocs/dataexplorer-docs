---
title: mysql_request plugin - Azure Data Explorer
description: This article describes mysql_request plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/01/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# mysql_request plugin (Preview)

::: zone pivot="azuredataexplorer"

The `mysql_request` plugin sends a SQL query to a MySQL Server network endpoint and returns the first rowset in the results. The query may return more then one rowset, but only the first rowset is made available for the rest of the Kusto query.

> [!IMPORTANT]
> The `mysql_request` plugin is disabled by default.
> To enable the plugin, run the [`.enable plugin mysql_request` command](../management/enable-plugin.md). To see which plugins are enabled, use [`.show plugin` management commands](../management/show-plugins.md).

## Syntax

`evaluate` `mysql_request` `(` *ConnectionString* `,` *SqlQuery* [`,` *SqlParameters*] `)` [`:` *OutputSchema*]

## Arguments

| Name | Type | Description | Required/Optional |
|---|---|---|---|
| *ConnectionString* | `string` literal | Indicates the connection string that points at the MySQL Server network endpoint. See [authentication](#username-and-password-authentication) and how to specify the [network endpoint](#specify-the-network-endpoint). | Required |
| *SqlQuery* | `string` literal | Indicates the query that is to be executed against the SQL endpoint. Must return one or more rowsets, but only the first one is made available for the rest of the Kusto query. | Required|
| *SqlParameters* | Constant value of type `dynamic` | Holds key-value pairs to pass as parameters along with the query. | Optional |
| *OutputSchema* | An optional definition of the schema (column names and their types) for the `mysql_request` plugin output.<br />- **Syntax**: `(` *ColumnName* `:` *ColumnType* [`,` ...] `)`<br />- There is a performance benefit to providing an explicit schema as part of the query. If the schema is known, it can be used optimize the query execution without having to first run the actual query to explore the schema. If the run-time schema doesn't match the schema specified by *OutputSchema*, the query will raise an error indicating the mismatch. | Optional |

## Set callout policy

The plugin makes callouts to the MySql database. Make sure that the cluster's [callout policy](../management/calloutpolicy.md) enables calls of type `mysql` to the target *MySqlDbUri*.

The following example shows how to define the callout policy for MySQL databases. We recommend restricting the callout policy to specific endpoints (`my_endpoint1`, `my_endpoint2`).

```kusto
[
  {
    "CalloutType": "mysql",
    "CalloutUriRegex": "my_endpoint1\\.mysql\\.database\\.azure\\.com",
    "CanCall": true
  },
  {
    "CalloutType": "mysql",
    "CalloutUriRegex": "my_endpoint2\\.mysql\\.database\\.azure\\.com",
    "CanCall": true
  }
]
```

The following example shows an `.alter callout policy` command for `mysql` *CalloutType*:

```kusto
.alter cluster policy callout @'[{"CalloutType": "mysql", "CalloutUriRegex": "\\.mysql\\.database\\.azure\\.com", "CanCall": true}]'
```

## Username and password authentication

The `mysql_request` plugin only supports username and password authentication to the MySQL server endpoint and doesn't integrate with Azure Active Directory authentication. 

The username and password are provided as part of the connections string using the following parameters:

`User ID=...; Password=...;`
    
> [!WARNING]
> Confidential or guarded information should be obfuscated from connection strings and queries so that they are omitted from any Kusto tracing. 
> For more information, see [obfuscated string literals](scalar-data-types/string.md#obfuscated-string-literals).

## Encryption and server validation

For security, `SslMode` is unconditionally set to `Required` when connecting to a MySQL server network endpoint. As a result, the server must be configured with a valid SSL/TLS server certificate.

## Specify the network endpoint

Specify the MySQL network endpoint as part of the connection string.

**Syntax**:

`Server` `=` *FQDN* [`Port` `=` *Port*]

Where:

* *FQDN* is the fully qualified domain name of the endpoint.
* *Port* is the TCP port of the endpoint. By default, `3306` is assumed.

## Examples


### SQL query to Azure MySQL DB

The following example sends a SQL query to an Azure MySQL database. It retrieves all records from `[dbo].[Table]`, and then processes the results.

> [!NOTE]
> This example shouldn't be taken as a recommendation to filter or project data in this manner. SQL queries should be constructed to return the smallest data set possible, since the Kusto optimizer doesn't currently attempt to optimize queries between Kusto and SQL.

```kusto
evaluate mysql_request(
    'Server=contoso.mysql.database.azure.com; Port = 3306;'
    'Database=Fabrikam;'
    h'UID=USERNAME;'
    h'Pwd=PASSWORD;',
  'select * from [dbo].[Table]')
| where Id > 0
| project Name
```

### Authentication with username and password

The following example is identical to the previous one, but authentication is by username and password. For confidentiality, use obfuscated strings.

```kusto
evaluate mysql_request(
   'Server=contoso.mysql.database.azure.com; Port = 3306;'
    'Database=Fabrikam;'
    h'UID=USERNAME;'
    h'Pwd=PASSWORD;',
  'select * from [dbo].[Table]')
| where Id > 0
| project Name
```

### SQL query to an Azure MySQL database with modifications

The following example sends a SQL query to an Azure MySQL database
retrieving all records from `[dbo].[Table]`, while appending another `datetime` column,
and then processes the results on the Kusto side.
It specifies a SQL parameter (`@param0`) to be used in the SQL query.

```kusto
evaluate mysql_request(
  'Server=contoso.mysql.database.azure.com; Port = 3306;'
    'Database=Fabrikam;'
    h'UID=USERNAME;'
    h'Pwd=PASSWORD;',
  'select *, @param0 as dt from [dbo].[Table]',
  dynamic({'param0': datetime(2020-01-01 16:47:26.7423305)}))
| where Id > 0
| project Name
```

## SQL query with a query-defined output scehma

The following example sends a SQL query to an Azure MySQL database
retrieving all records from `[dbo].[Table]`, while selecting only specific columns.
It uses an explicit schema definition that allow various optimizations to be evaluated before the 
actual query against the server is run.

```kusto
evaluate mysql_request(
  'Server=contoso.mysql.database.azure.com; Port = 3306;'
     'Database=Fabrikam;'
    h'UID=USERNAME;'
    h'Pwd=PASSWORD;',
  'select Id, Name') : (Id:long, Name:string)
| where Id > 0
| project Name

::: zone-end

::: zone pivot="azuremonitor"

This capability isn't supported in Azure Monitor.

::: zone-end
