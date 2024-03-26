---
title: Run KQL queries and stored functions with SQL Server emulation - Azure Data Explorer
description: This article describes using stored functions over TDS in Azure Data Explorer.
ms.reviewer: yosefd
ms.topic: reference
ms.date: 06/15/2023
---
# Run KQL queries and stored functions with SQL Server emulation

Azure Data Explorer provides a Tabular Data Stream (TDS) endpoint that allows you to query data in a way similar to how you would query data in SQL Server. The endpoint supports TDS versions 7.x and 8.0.

In this article, you'll learn how to run [stored functions](kusto/query/schema-entities/stored-functions.md) and [Kusto Query Language (KQL)](kusto/query/index.md) queries from an SQL compatible client.

> [!NOTE]
> The information in this article applies to running parameterized calls over the TDS protocol, also known as RPC calls.

For more information, see the [overview on SQL Server emulation](sql-server-emulation-overview.md) in Azure Data Explorer.

## Run KQL queries

The SQL stored procedure `sp_execute_kql` can be used to run [KQL](kusto/query/index.md) queries, including parameterized queries. The procedure is similar to the `sp_executesql` stored procedure. 

> [!NOTE]
> The `sp_execute_kql` procedure can only be called via an RPC call as shown in the following example and not from within a regular SQL query.

The first parameter of `sp_execute_kql` is the KQL query, and any other parameters are treated as [query parameters](kusto/query/query-parameters-statement.md). The following example shows how to use `sp_execute_kql`.

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

## Call stored functions

You can create and call [stored functions](kusto/query/schema-entities/stored-functions.md) like SQL stored procedures. For example, if you have a stored function as described in the following table, you can call it as shown in the code example.

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
> To distinguish between stored functions and emulated SQL system stored procedures, call stored functions with an explicit reference to the `kusto` schema. In the example, the stored function is called using `kusto.Myfunction`.

## Related content

* [Connect with ODBC](connect-odbc.md)
* [Connect with JDBC](connect-jdbc.md)
* [Connect from common apps](connect-common-apps.md)
