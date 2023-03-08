---
title: Run KQL stored functions and queries with SQL Server emulation - Azure Data Explorer
description: This article describes using the Kusto Query Language (KQL) or T-SQL over TDS in Azure Data Explorer.
ms.reviewer: yosefd
ms.topic: reference
ms.date: 03/08/2023
---
# Run stored functions with SQL Server emulation

Azure Data Explorer provides Tabular Data Stream (TDS) endpoints that allow you to query data in a way similar to how you would query data in SQL Server. In this article, you'll learn how to run [stored functions](kusto/query/schema-entities/stored-functions.md) from an SQL compatible client.

For more information, see the [overview on SQL Server emulation](sql-server-emulation-overview.md) in Azure Data Explorer.

## Run stored functions

You can create and run [stored functions](kusto/query/schema-entities/stored-functions.md) like SQL stored procedures. For example, if you have a stored function as described in the following table, you can run it as shown in the code example.

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
> To distinguish between stored functions and emulated SQL system stored procedures, run stored functions with an explicit reference to the `kusto` schema. In the example, the stored function is called using `kusto.Myfunction`.

## Next steps

* [Connect with ODBC](connect-odbc.md)
* [Connect with JDBC](connect-jdbc.md)
* [Connect from common apps](connect-common-apps.md)
* [Query with T-SQL](t-sql.md)
* [Run KQL queries](sql-kql-queries.md)
