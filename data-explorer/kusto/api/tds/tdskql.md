---
title: KQL over TDS - Azure Data Explorer | Microsoft Docs
description: This article describes KQL over TDS in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/09/2019
---
# KQL over TDS

Kusto enables TDS endpoints to execute queries authored in the native [KQL](../../query/index.md) query language. This ability enables smoother migration towards Kusto. For example, you can create SSIS jobs to query Kusto with a KQL query.

## Executing Kusto stored functions

Kusto permits [stored functions](../../query/schema-entities/stored-functions.md) to run, like calling SQL stored procedures.

For example, the stored function MyFunction:

|Name |Parameters|Body|Folder|DocString
|---|---|---|---|---|
|MyFunction |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Demo function with parameter|

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

> [!NOTE]
> Call stored functions with an explicit schema named `kusto`, to distinguish between Kusto stored functions and emulated
> SQL system stored procedures.

You can also call Kusto stored functions from T-SQL, like SQL tabular functions:

```sql
SELECT * FROM kusto.MyFunction(10)
```

Create optimized KQL queries and encapsulate them in stored functions, making the T-SQL query code minimal.

## Executing KQL query

The stored procedure `sp_execute_kql` executes [KQL](../../query/index.md) queries (including parameterized queries). This procedure is similar to SQL server `sp_executesql`.

The first parameter of `sp_execute_kql` is the KQL query. You can introduce additional parameters, and they'll act like [query parameters](../../query/queryparametersstatement.md).

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

> [!NOTE]
> There is no need to declare parameters when calling via TDS, since parameter types are set via protocol.
