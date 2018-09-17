---
title: sql_request plugin - Azure Kusto | Microsoft Docs
description: This article describes sql_request plugin in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# sql_request plugin

  `evaluate` `sql_request` `(` *ConnectionString* `,` *SqlQuery* `)`

The `sql_request` plugin sends a SQL query to a SQL Server network endpoint
and returns the first rowset in the results.

**Arguments**

* *ConnectionString*: A `string` literal indicating the connection string that 
  points at the SQL Server network endpoint. See remarks below for valid
  methods of authentication.
* *SqlQuery*: A `string` literal indicating the query that is to be executed
  against the SQL endpoint. Must return one or more rowsets, but only the
  first one is made available for the rest of the Kusto query.

**Examples**

The following example sends a SQL query to an Azure SQL DB database
retrieving all records from `[dbo].[Table]`, and then processes the results
on the Kusto side. Authentication reuses the calling user's AAD token.

Note: This example should not be taken as a recommendation to filter/project
data in this manner; usually it's preferable that SQL queries will be constructed
to return the smallest data set possible, as currently the Kusto optimizer
does not attempt to optimize queries between Kusto and SQL.

```kusto
evaluate sql_request(
  'Server=tcp:zivckusto2.database.windows.net,1433;'
    'Authentication="Active Directory Integrated";'
    'Initial Catalog=zivckusto2;',
  'select * from [dbo].[Table]')
| where Id > 0
| project Name
```

The following example is identical to the previous one, except that SQL
authentication is done by username/password. Note that for confidentiality,
we use obfuscated strings here.

```kusto
evaluate sql_request(
  'Server=tcp:zivckusto2.database.windows.net,1433;'
    'Initial Catalog=zivckusto2;'
    h'User ID=USERNAME;'
    h'Password=PASSWORD;',
  'select * from [dbo].[Table]')
| where Id > 0
| project Name
```

**Authentication**

The sql_request plugin supports two methods of authentication to the
SQL Server endpoint:

1. **AAD integrated authentication** (`Authentication="Active Directory Integrated"`):
   This is the preferred method, in which the user or application authenticates
   via AAD to Kusto, and the same token is then used to access the SQL Server network
   endpoint.

2. **Username/Password authentication** (`User ID=...; Password=...;`):
   Support for this method is provided for cases in which AAD integrated authentication
   cannot be performed, and one should avoid it as much as possible, as secret
   information is sent through Kusto.

> [!WARNING]
> Connection strings and queries that include confidential
> information or information that should be otherwise guarded should be
> obfuscated so that they'll be ommitted from any Kusto tracing.
> Please see [obfuscated string literals](scalar-data-types/string.md#obfuscated-string-literals) for more details.

**Encryption and server validation**

The following connection properties are forced when connection to a SQL Server network
endpoint, for security reasons:

* `Encrypt` is set to `true` unconditionally.
* `TrustServerCertificate` is set to `false` unconditionally.

As a result, the SQL Server must be configured with a valid SSL/TLS server
certificate.

**Restrictions**

Kusto service controls allowed sql-request plugin destinations by [Callout policy](../concepts/calloutpolicy.md)