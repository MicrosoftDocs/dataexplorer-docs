---
title: Run KQL queries with SQL Server emulation - Azure Data Explorer
description: This article describes using the Kusto Query Language (KQL) or T-SQL over TDS in Azure Data Explorer.
ms.reviewer: yosefd
ms.topic: reference
ms.date: 03/08/2023
---
# Run KQL queries with SQL Server emulation

Azure Data Explorer provides Tabular Data Stream (TDS) endpoints that allow you to query data in a way similar to how you would query data in SQL Server. In this article, you'll learn how to run [Kusto Query Language (KQL)](kusto/query/index.md) queries from an SQL compatible client.

For more information, see the [overview on SQL Server emulation](sql-server-emulation-overview.md) in Azure Data Explorer.

## Run KQL queries

The SQL stored procedure `sp_execute_kql` can be used to run [KQL](/kusto/query/index.md) queries, including parameterized queries. The procedure is similar to the `sp_executesql` stored procedure.

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

## Next steps

* [Connect with ODBC](connect-odbc.md)
* [Connect with JDBC](connect-jdbc.md)
* [Connect from common apps](connect-common-apps.md)
* [Run stored functions](sql-stored-functions.md)
