---
title: Query with SQL Server Emulation - Azure Data Explorer
description: This article describes using the Kusto Query Language (KQL) or T-SQL over TDS in Azure Data Explorer.
ms.reviewer: yosefd
ms.topic: reference
ms.date: 11/11/2021
---
# Query data using SQL Server emulation

Azure Data Explorer provides Tabular Data Stream (TDS) endpoints that allow you to query data in a way similar to how you would query data in SQL Server. In this article, you'll learn how to execute stored functions and [Kusto Query Language (KQL)](kusto/query/index.md) queries from an SQL compatible client.

## Executing stored functions

You can create and execute [stored functions](kusto/query/schema-entities/stored-functions.md) like SQL stored procedures. For example, if you have a stored function as described in the following table, you can execute it as shown in the code example.

|Name |Parameters|Body|Folder|DocString
|---|---|---|---|---|
|MyFunction |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|

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
> To distinguish between stored functions and emulated SQL system stored procedures, execute stored functions with an explicit reference to the `kusto` schema. In the example, the stored function is executed using `kusto.Myfunction`.

When using T-SQL, it's recommended to create optimized KQL queries and encapsulate them in stored functions, as doing so minimizes T-SQL code and may increase performance. For example, you can call `MyFunction` using the following code.

```sql
SELECT * FROM kusto.MyFunction(10)
```

## Executing queries

The SQL stored procedure `sp_execute_kql` can be used to execute [KQL](/kusto/query/index.md) queries, including parameterized queries. The procedure is similar to the `sp_executesql` stored procedure.

The first parameter of `sp_execute_kql` is the KQL query, and any other parameters are treated as [query parameters](kusto/query/queryparametersstatement.md). The following example shows how to use `sp_execute_kql`.

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
      query.Value = "StormEvents | take myLimit";
      parameter.Value = 3;
      using (var reader = await command.ExecuteReaderAsync())
      {
        // Read the response.
      }
    }
  }
```

> [!NOTE]
> When calling `sp_execute_kql` via TDS, parameter types are set by the protocol and don't need to be declared.
