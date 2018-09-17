---
title: cosmosdb_sql_request plugin - Azure Data Explorer | Microsoft Docs
description: This article describes cosmosdb_sql_request plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# cosmosdb_sql_request plugin

  `evaluate` `cosmosdb_sql_request` `(` *ConnectionString* `,` *authorization_key* `,` *database_name* `,` *collection_name* `,` *SqlQuery* `)`

The `cosmosdb_sql_request` plugin sends a SQL query to a CosmosDB SQL network endpoint
and returns the first rowset in the results.

**Arguments**

* *ConnectionString*: A `string` literal indicating the connection string that 
  points at the CosmosDB network endpoint. See remarks below for valid
  methods of authentication.
* *authorization_key*: A `string` literal specifying CosmosDB resource or master token.
* *database_name*: A `string` literal specifying CosmosDB Database name.
* *collection_name*: A `string` literal specifying CosmosDB collection name.
* *SqlQuery*: A `string` literal indicating the query that is to be executed
  against the SQL endpoint. Must return one or more rowsets, but only the
  first one is made available for the rest of the Kusto query.

**Restrictions**

Kusto service controls allowed sql_request plugin destinations by [Callout policy](../concepts/calloutpolicy.md)

**Examples**

Using SQL query to fetch all rows from Cosmos DB:

```kusto
evaluate cosmosdb_sql_request(
  'ConnectionString',
  h@'AuthKey',
  'MyDatabaseName',
  'MyCollectionName',
  'SELECT * from c')
```