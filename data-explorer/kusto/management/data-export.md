---
title: Data export - Azure Data Explorer | Microsoft Docs
description: This article describes Data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Data export

Kusto supports a number of methods to export the results of queries:

* **Client-side export**: Tools that provide the ability
  to query Kusto may offer the means to save that data to local files. For example:
  * [Kusto.Explorer](../tools/kusto-explorer.md)
  
  **Service-side export (push)**: Kusto provides an `.export` control
  command which can be used to instruct the Kusto service to "push"
  query results to external storage (such as Azure Blob Storage and
  Azure SQL Database). See below for the details.
* **Service-side import (pull)**: Kusto also supports the ability to execute
  a query (locally or on another database or cluster), and ingest the query results.
  See [data ingestion](data-ingestion/index.md) for a detailed
  description of the `.set`, `.append`, `.set-or-append`, and `.set-or-replace`
  commands.
* **Data movement tools**: External scheduler tools may also be used
  to export data out of Kusto.

## Recommendations for secret management when using data export commands

Ideally, exporting data to a remote target (such as Azure Blob Storage
and Azure SQL Database) would be done by implicitly using the credentials
of the security principal executing the data export command. This is not
possible in some scenarios (for example, Azure Blob Storage doesn't
support the notion of a security principal, only its own tokens.) Therefore,
Kusto supports introducing the necessary credentials inline as part of the
data export control command. Here are a few recommendations to ensure that
this is done in a secure manner:

Use [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals)
(such as `h@"..."`) when sending secrets to Kusto.
Kusto will then scrub these secrets so that they do not appear in any
trace it emits internally.

Additionally, passwords and similar secrets should be stored securely
and "pulled" by the application only when needed.


## Exporting data to Azure Blob Storage 

`.export` [`async`] [`compressed`] `to` 
      (`csv` | `tsv` | `json` | `parquet`) `(`*path_prefix* [`,` ...] `)`
      [`with` `(`*property_name* `=` *value*`,`...`)`]
    `<|` *Query*

This command executes the specified query, and exports its results to Azure Blob
Storage, in the specified file format. The command supports the following
tuning properties:

|Property        |Type    |Description                                                                                                  |
|----------------|--------|-------------------------------------------------------------------------------------------------------------|
|`async`         |`bool`|Indicates that the command runs in asynchronous mode. (Cannot be specified in a `with` clause.) If the command is executed asynchronouly, its results are persisted by default and can be retrieved when export is complete using the [show operation details](../management/operations.md#show-operation-details) command.               |
|`compressed`    |`bool`  |If set, the output blobs are compressed as `.gz` files.                                                      |
|`sizeLimit`     |`long`  |The size limit at which to switch to the next blob (before compression). The default value is 100MB, max 1GB.|
|`includeHeaders`|`string`|For CSV or TSV output, controls the generation of column headers; `none`: Do not generate a header line (default). `firstFile`: Emit a header line into the first file only, does not work well with distributed mode. `all`: Emit a header line for all files.|
|`fileExtension` |`string`|Indicates the file format: `csv` (the default), `tsv`, `json` or `parquet (preview)`. (Compression might add `gz`.)              |
|`namePrefix`    |`string`|Indicates a prefix to add to each generated blob name. A random prefix will be used if left unspecified.     |
|`encoding`      |`string`|Indicates how to encode the text: `UTF8NoBOM` (default) or `UTF8BOM`.                                        |
|`distributed`   |`bool`  |Indicates that the export writes from all nodes in parallel if possible. (Defaults to `true`.)               |
|`persistDetails`|`bool`  |Indicates that the command should persist its results (see `async` flag). Defaults to `true` in async runs, but can be turned off if the caller does not require the results). Defaults to `false` in synchronous executions, but can be turned on in those as well. |

One or more path prefixes should be provided with the command. These are valid URIs for Azure Blob Storage blob containers (or virtual folders under blob containers) which must include the credentials. Credentials can be either an account key, an account SAS key, or a service SAS key to the specific container. The SAS key should include (at least) the following permissions: SharedAccessBlobPermissions.List | SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.Read. See [Azure Storage Blob connection strings](https://kusto.azurewebsites.net/docs/concepts/persistent-storage-connection-strings.html#azure-storage-blob).

Kusto will "spread out" across multiple path prefixes if more than one is provided,
so as not to reduce the concurrent operations against a single blob container.
For example:

```
h@"https://ACCOUNT_NAME.blob.core.windows.net/CONTAINER_NAME;BASE64_ENCODED_ACCOUNT_KEY=="
h@"https://ACCOUNT_NAME.blob.core.windows.net/CONTAINER_NAME?SAS_TOKEN"
h@"https://ACCOUNT_NAME.blob.core.windows.net/CONTAINER_NAME/virtual_directory;BASE64_ENCODED_ACCOUNT_KEY=="
h@"https://ACCOUNT_NAME.blob.core.windows.net/CONTAINER_NAME/virtual_directory?SAS_TOKEN"
```
 
Note: It is highly recommended to export data to Azure Blob Storage that is co-located
with the exporting Kusto cluster in the same region.
 
**Examples** 

In this example, Kusto runs the query and then exports the first recordset produced by the query to one or more compressed CSV files.
Column name labels are added as the first row in the first file. 

```kusto 
.export 
  async compressed 
  to csv ( 
    h@"https://storage1.blob.core.windows.net/containerName;secretKey", 
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey" 
  ) with ( 
    sizeLimit=100000, 
    namePrefix=export,
    includeHeaders=FirstFile,
encoding =UTF8NoBOM	
  ) 
  <| myLogs | where id == "moshe" | limit 10000 
```
In this example, Kusto runs the query and then exports the first recordset produced by the query to one or more compressed TSV files.
Column name labels are added as the first row in the first file. 

```kusto 
.export 
  async compressed 
  to tsv ( 
    h@"https://storage1.blob.core.windows.net/containerName;secretKey", 
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey" 
  ) with ( 
    sizeLimit=100000, 
    namePrefix=export,
    includeHeaders=FirstFile,
encoding =UTF8BOM			
  ) 
  <| myLogs | where id == "moshe" | limit 10000 
```
In this example, Kusto runs the query and then exports the first recordset produced by the query to one or more compressed JSON files. 

```kusto 
.export
  async compressed
  to json (
    h@"https://storage1.blob.core.windows.net/containerName;secretKey",
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey"
  ) with (
    sizeLimit=100000,
    namePrefix=export
  )
  <| myLogs | where id == "moshe" | limit 10000
```

**Results**

The command returns the paths of all blobs exported and their respective record count. If command is executed asynchronously, results can be retrieved using the [show operation details](../management/operations.md#show-operation-details) command, providing it with the operation id returned by the async command.

```
.show operation f008dc1e-2710-47d8-8d34-0d562f5f8615 details 
```

|Path|NumRecords|
|---|---|
|http://storage1.blob.core.windows.net/containerName/export_1_d08afcae2f044c1092b279412dcb571b.csv|10|
|http://storage1.blob.core.windows.net/containerName/export_2_454c0f1359e24795b6529da8a0101330.csv|15|



## Exporting data to a SQL Database

It is possible to run a query and have its results sent
to a table in a SQL database, such as a SQL database hosted by
the Azure SQL Database service.

**Syntax**

`.export` [`async`] `to` `sql` *SqlTableName* *SqlConnectionString* [`with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]
 `<|` *Query*

Where:

* *SqlTableName* is the name of the table in the SQL database to INSERT the data
  into. To protect against injection attacks, this name is restricted, as described
  below.
* *SqlConnectionString* is a `string` literal that follows the `ADO.NET`
  connection string format and describes the SQL endpoint and database
  to connect to. For security reasons, the connection string is restricted,
  as described below.
* *PropertyName*, *PropertyValue* are pairs of a name (identifier) and a value
  (string literal), as described below.

Properties:

|Name               |Values           |Description|
|-------------------|-----------------|-----------|
|`firetriggers`     |`true` or `false`|If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information see [BULK INSERT](https://msdn.microsoft.com/en-us/library/ms188365.aspx) and [System.Data.SqlClient.SqlBulkCopy](https://msdn.microsoft.com/en-us/library/system.data.sqlclient.sqlbulkcopy(v=vs.110).aspx))|
|`createifnotexists`|`true` or `false`|If `true`, the target SQL table will be created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column which is the primary key. The default is `false`.|
|`primarykey`       |                 |If `createifnotexists` is `true`, indicates the name of the column in the result that will be used as the SQL table's primary key if it is created by this command.|

**Limitations and restrictions**

There are a number of limitations and restrictions when exporting data to a SQL database:

1. Kusto is a cloud service, so that connection string must point to a
   database that is accessible from the cloud. (In particular, one cannot
   export to an on-premises database since it is not accessible from the public
   cloud.)

2. Kusto supports Active Directory Integrated authentication when the calling
   principal is an Azure Active Directory principal (`aaduser=` or `aadapp=`).
   Alternatively, Kusto also supports providing the credentials for the SQL
   database as part of the connection string. Other methods of authentication
   are not supported. In particular, the identity being presented to the SQL
   database always emanates from the command caller; it is never the Kusto service
   identity itself.

3. If the target table in the SQL database exists, it must match the query result
   schema. Note that in some cases (such as Azure SQL Database) this means
   that the table has one column marked as an identity column.

4. Exporting large volumes of data may take a long time. It is recommended that
   the target SQL table be set for minimal logging during bulk import.
   See [SQL Server Database Engine > ... > Database Features > Bulk Import and Export of Data](https://msdn.microsoft.com/en-us/library/ms190422.aspx).

5. Data export is performed using SQL bulk copy and provides no transactional guarantees on the target
   SQL database. See [Transaction and Bulk Copy Operations](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/sql/transaction-and-bulk-copy-operations)
   for more details.

6. The SQL table name is restricted to a name consisting of letters, digits,
   as well as spaces, underscores (`_`), dots (`.`) and hyphens (`-`).

7. The SQL connection string is restricted as follows: `Persist Security Info`
   is explicitly set to `false`, `Encrypt` is set to `true`, and `Trust Server Certificate`
   is set to `false`.

**Azure DB AAD Integrated Authentication Documentation**

* [Use Azure Active Directory Authentication for authentication with SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-aad-authentication)
* [Azure AD authentication extensions for Azure SQL DB and SQL DW tools] (https://azure.microsoft.com/en-us/blog/azure-ad-authentication-extensions-for-azure-sql-db-and-sql-dw-tools/)

**Examples** 

In this example, Kusto runs the query and then exports the first recordset produced by the query to the `MySqlTable` table in the `MyDatabase` database in server `myserver`.

```kusto 
.export async to sql MySqlTable
    h@"Server=tcp:myserver.database.windows.net,1433;Database=MyDatabase;Authentication=Active Directory Integrated;Connection Timeout=30;"
    <| print Id="d3b68d12-cbd3-428b-807f-2c740f561989", Name="YSO4", DateOfBirth=datetime(2017-10-15)
```

In this example, Kusto runs the query and then exports the first recordset produced by the query to the `MySqlTable` table in the `MyDatabase` database in server `myserver`.
If the target table does not exist in the target database, it is created.

```kusto 
.export async to sql ['dbo.MySqlTable']
    h@"Server=tcp:myserver.database.windows.net,1433;Database=MyDatabase;Authentication=Active Directory Integrated;Connection Timeout=30;"
    with (createifnotexists="true", primarykey="Id")
    <| print Message = "Hello World!", Timestamp = now(), Id=12345678
```

