---
title: CSL over TDS - Azure Data Explorer | Microsoft Docs
description: This article describes CSL over TDS in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# CSL over TDS

Kusto allows to utilize TDS endpoint for executing queries authored in the native [CSL](../../query/index.md) query language. This functionality offers smoother migiration towards Kusto. For example, it is possible to create SSIS job to query Kusto with CSL query.

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

## Executing CSL query

Similarly to SQL server `sp_executesql`, Kusto introduced stored procedure `sp_execute_csl` for executing [CSL](../../query/index.md) queries, including parameterized queries.

The 1st parameter of `sp_execute_csl` is the CSL query. Additional parameters can be introduced and they will act like [query parameters](../../query/queryparametersstatement.md).

For example:

```csharp
  using (var connection = new SqlConnection(csb.ToString()))
  {
    await connection.OpenAsync();
    using (var command = new SqlCommand("sp_execute_csl", connection))
    {
      command.CommandType = CommandType.StoredProcedure;
      var query = new SqlParameter("@csl_query", SqlDbType.NVarChar);
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