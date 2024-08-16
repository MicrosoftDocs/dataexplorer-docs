---
title:  sql_request plugin
description: Learn how to use the sql_request plugin to send an SQL query to an SQL server network endpoint. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# sql_request plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `sql_request` plugin sends a SQL query to an Azure SQL Server network endpoint and returns the results.
If more than one rowset is returned by SQL, only the first one is used.
The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

`evaluate` `sql_request` `(` *ConnectionString* `,` *SqlQuery* [`,` *SqlParameters* [`,` *Options*]] `)` [`:` *OutputSchema*]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required| Description |
|---|---|---|---|
| *ConnectionString* | `string` |  :heavy_check_mark: | The connection string that points at the SQL Server network endpoint. See [valid methods of authentication](#authentication-and-authorization) and how to specify the [network endpoint](#specify-the-network-endpoint). |
| *SqlQuery* | `string` |  :heavy_check_mark: | The query that is to be executed against the SQL endpoint. The query must return one or more row sets, but only the first one is made available for the rest of the Kusto query. |
| *SqlParameters* | `dynamic` | | A property bag of key-value pairs to pass as parameters along with the query. |
|*Options* | `dynamic` | | A property bag of key-value pairs to pass more advanced settings along with the query. Currently, only `token` can be set, to pass a caller-provided Microsoft Entra access token that is forwarded to the SQL endpoint for authentication.|
| *OutputSchema* | `string` | | The names and types for the expected columns of the `sql_request` plugin output. Use the following syntax: `(` *ColumnName* `:` *ColumnType* [`,` ...] `)`.|

> [!NOTE]
>
> * Specifying the *OutputSchema* is highly recommended, as it allows the plugin to be used in scenarios that might otherwise not work without it, such as a cross-cluster query. The *OutputSchema* can also enable multiple query optimizations.
> * An error is raised if the run-time schema of the first row set returned by the SQL network endpoint doesn't match the *OutputSchema* schema.

## Authentication and authorization

The sql_request plugin supports the following three methods of authentication to the
SQL Server endpoint.

|Authentication method|Syntax|How|Description|
|--|--|--|
|Microsoft Entra integrated|`Authentication="Active Directory Integrated"`|Add to the *ConnectionString* parameter.|This is the preferred authentication method. The user or application authenticates via Microsoft Entra ID to your cluster, and the same token is used to access the SQL Server network endpoint.<br/>The principal must have the appropriate permissions on the SQL resource to perform the requested action. For example, to read from the database the principal needs table SELECT permissions, and to write to an existing table the principal needs UPDATE and INSERT permissions. To write to a new table, CREATE permissions are also required.|
|Username and password|`User ID=...; Password=...;`|Add to the *ConnectionString* parameter.|When possible, avoid this method as it may be less secure.|
|Microsoft Entra access token|`dynamic({'token': h"eyJ0..."})`|Add in the *Options* parameter.|The access token is passed as `token` property in the *Options* argument of the plugin.|

> [!NOTE]
> Connection strings and queries that include confidential information or information that should be guarded should be obfuscated to be omitted from any Kusto tracing. For more information, see [obfuscated string literals](scalar-data-types/string.md#obfuscated-string-literals).

## Examples

<a name='send-a-sql-query-using-azure-ad-integrated-authentication'></a>

### Send a SQL query using Microsoft Entra integrated authentication

The following example sends a SQL query to an Azure SQL DB database. It
retrieves all records from `[dbo].[Table]`, and then processes the results on the
 Kusto side. Authentication reuses the calling user's Microsoft Entra token.

> [!NOTE]
> This example should not be taken as a recommendation to filter or project data in this manner. SQL queries should be constructed to return the smallest dataset possible.

```kusto
evaluate sql_request(
  'Server=tcp:contoso.database.windows.net,1433;'
    'Authentication="Active Directory Integrated";'
    'Initial Catalog=Fabrikam;',
  'select * from [dbo].[Table]') : (Id:long, Name:string)
| where Id > 0
| project Name
```

### Send a SQL query using Username/Password authentication

The following example is identical to the previous one, except that SQL
authentication is done by username/password. For confidentiality,
we use obfuscated strings here.

```kusto
evaluate sql_request(
  'Server=tcp:contoso.database.windows.net,1433;'
    'Initial Catalog=Fabrikam;'
    h'User ID=USERNAME;'
    h'Password=PASSWORD;',
  'select * from [dbo].[Table]') : (Id:long, Name:string)
| where Id > 0
| project Name
```

<a name='send-a-sql-query-using-an-azure-ad-access-token'></a>

### Send a SQL query using a Microsoft Entra access token

The following example sends a SQL query to an Azure SQL database
retrieving all records from `[dbo].[Table]`, while appending another `datetime` column,
and then processes the results on the Kusto side.
It specifies a SQL parameter (`@param0`) to be used in the SQL query.

```kusto
evaluate sql_request(
  'Server=tcp:contoso.database.windows.net,1433;'
    'Authentication="Active Directory Integrated";'
    'Initial Catalog=Fabrikam;',
  'select *, @param0 as dt from [dbo].[Table]',
  dynamic({'param0': datetime(2020-01-01 16:47:26.7423305)})) : (Id:long, Name:string, dt: datetime)
| where Id > 0
| project Name
```

### Send a SQL query without a query-defined output schema

The following example sends a SQL query to an Azure SQL database without an output schema. This is not recommended unless the schema is unknown, as it may impact the performance of the query

```kusto
evaluate sql_request(
  'Server=tcp:contoso.database.windows.net,1433;'
    'Initial Catalog=Fabrikam;'
    h'User ID=USERNAME;'
    h'Password=PASSWORD;',
  'select * from [dbo].[Table]')
| where Id > 0
| project Name
```

## Encryption and server validation

The following connection properties are forced when connecting to a SQL Server network
endpoint, for security reasons.

* `Encrypt` is set to `true` unconditionally.
* `TrustServerCertificate` is set to `false` unconditionally.

As a result, the SQL Server must be configured with a valid SSL/TLS server certificate.

## Specify the network endpoint

Specifying the SQL network endpoint as part of the connection string is mandatory.
The appropriate syntax is:

`Server` `=` `tcp:` *FQDN* [`,` *Port*]

Where:

* *FQDN* is the fully qualified domain name of the endpoint.
* *Port* is the TCP port of the endpoint. By default, `1433` is assumed.

> [!NOTE]
> Other forms of specifying the network endpoint are not supported.
> One cannot omit, for example, the prefix `tcp:` even though it is possible to
> do so when using the SQL client libraries programmatically.
