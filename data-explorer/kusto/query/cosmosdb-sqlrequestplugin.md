# cosmosdb-sql-request plugin

  `evaluate` `cosmosdb-sql-request` `(` *ConnectionString* `,` *authorization-key* `,` *database-name* `,` *collection-name* `,` *SqlQuery* `)`

The `cosmosdb-sql-request` plugin sends a SQL query to a CosmosDB SQL network endpoint
and returns the first rowset in the results.

**Arguments**

* *ConnectionString*: A `string` literal indicating the connection string that 
  points at the CosmosDB network endpoint. See remarks below for valid
  methods of authentication.
* *authorization-key*: A `string` literal specifying CosmosDB resource or master token.
* *database-name*: A `string` literal specifying CosmosDB Database name.
* *collection-name*: A `string` literal specifying CosmosDB collection name.
* *SqlQuery*: A `string` literal indicating the query that is to be executed
  against the SQL endpoint. Must return one or more rowsets, but only the
  first one is made available for the rest of the Kusto query.

**Restrictions**

Kusto service controls allowed sql-request plugin destinations by [Callout policy](https://kusdoc2.azurewebsites.net/docs/concepts/concepts_calloutpolicy.html)

**Examples**

Using SQL query to fetch all rows from Cosmos DB:

```kusto
evaluate cosmosdb-sql-request(
  'ConnectionString',
  h@'AuthKey',
  'MyDatabaseName',
  'MyCollectionName',
  'SELECT * from c')
```


