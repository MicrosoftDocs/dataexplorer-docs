---
title: KQL over TDS - Azure Data Explorer | Microsoft Docs
description: This article describes KQL over TDS in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/09/2019
---
# KQL over TDS

Kusto allows to utilize TDS endpoint for executing queries authored in the native [KQL](../../query/index.md) query language. This functionality offers smoother migiration towards Kusto. For example, it is possible to create SSIS job to query Kusto with KQL query.

## Executing Kusto stored functions

Kusto allows to execute [stored functions](../../query/schema-entities/stored-functions.md) similarly to calling SQL stored procedures.

For example, the stored function MyFunction:

|Name |Parameters|Body|Folder|DocString
|---|---|---|---|---
|MyFunction |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Demo function with parameter||

can be called like this:

```csharp
  using (var connection = new SqlConnection(csb.ToString()))
  {
    await connection.OpenAsync();
    using (var command = new SqlCommand("kusto.MyFunction", connection))
    {
      command.CommandType = CommandType.StoredProcedure;
      var parameter = new SqlParameter("mylimit", SqlDbType.Int);
      command.Parameters.Add(parameter);
      parameter.Value = 3;
      using (var reader = await command.ExecuteReaderAsync())
      {
        // Read the response.
      }
    }
  }
```

Please notice that stored functions should be called with explicit schema named `kusto`, to distinguish between Kusto stored functions and emulated
SQL system stored procedures.

Kusto stored functions can be also called from T-SQL, just like SQL tabular functions:

```sql
SELECT * FROM kusto.MyFunction(10)
```

It is recommend to create optimized KQL queries and to encapsulate them in stored functions, making the T-SQL query code minimal.

## Executing KQL query

Similarly to SQL server `sp_executesql`, Kusto introduced stored procedure `sp_execute_kql` for executing [KQL](../../query/index.md) queries, including parameterized queries.

The 1st parameter of `sp_execute_kql` is the KQL query. Additional parameters can be introduced and they will act like [query parameters](../../query/queryparametersstatement.md).

For example:

```csharp
  using (var connection = new SqlConnection(csb.ToString()))
  {
    await connection.OpenAsync();
    using (var command = new SqlCommand("sp_execute_kql", connection))
    {
      command.CommandType = CommandType.StoredProcedure;
      var query = new SqlParameter("@kql_query", SqlDbType.NVarChar);
      command.Parameters.Add(query);
      var parameter = new SqlParameter("mylimit", SqlDbType.Int);
      command.Parameters.Add(parameter);
      query.Value = "StormEvents | limit myLimit";
      parameter.Value = 3;
      using (var reader = await command.ExecuteReaderAsync())
      {
        // Read the response.
      }
    }
  }
```

Please notice that there is no need to declare parameters when calling via TDS, as parameter types are set via protocol.