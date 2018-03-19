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
  first one is made available for the rest of the Azure Log Analytics query.

**Examples**

The following example sends a SQL query to an Azure SQL DB database
retrieving all records from `[dbo].[Table]`, and then processes the results
on the Azure Log Analytics side.

Note: This example should not be taken as a recommendation to filter/project
data in this manner; usually it's preferable that SQL queries will be constructed
to return the smallest data set possible, as currently the Azure Log Analytics optimizer
does not attempt to optimize queries between Azure Log Analytics and SQL.

<!-- csl -->
```
evaluate sql_request(
  'Server=tcp:zivckusto2.database.windows.net,1433;'
    'Initial Catalog=zivckusto2;'
    h'Use rID=USERNAME;'
    h'Password=PASSWORD;',
  'select * from [dbo].[Table]')
| where Id > 0
| project Name
```

<div class='warning'>Connection strings and queries that include confidential
information or information that should be otherwise guarded should be
obfuscated so that they'll be ommitted from any Azure Log Analytics tracing.
Please see [obfuscated string literals](../concepts/concepts_datatypes_string.md#obfuscated-string-literals) for more details.
</div>

**Encryption and server validation**

The following connection properties are forced when connection to a SQL Server network
endpoint, for security reasons:

* `Encrypt` is set to `true` unconditionally.
* `TrustServerCertificate` is set to `false` unconditionally.

As a result, the SQL Server must be configured with a valid SSL/TLS server
certificate.

