---
title: Kusto Query Language over TDS - Azure Data Explorer
description: This article describes using the Kusto Query Language (KQL) over TDS in Azure Data Explorer.
ms.reviewer: yosefd
ms.topic: reference
ms.date: 11/11/2021
---
# Executing queries over TDS

In this topic, you'll learn how to use Tabular Data Stream (TDS) endpoints to execute stored functions and queries authored using the [Kusto Query Language (KQL)](../../query/index.md).

## Executing stored functions

You can create and execute [stored functions](../../query/schema-entities/stored-functions.md) in a similar way to SQL stored procedures.

For example, if you have a stored function as described in the table, you can execute it using the following code:

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
> To distinguish between stored functions and emulated SQL system stored procedures, make sure you execute stored functions with an explicit reference to the `kusto` schema. In the example, the stored function is executed using `kusto.Myfunction`.

You can also call stored functions from Transact-SQL (T-SQL) in a similar way to SQL stored procedures. Creating optimized Kusto Query Language queries and encapsulating them in stored functions, helps you to minimizes your T-SQL code.

For example, you can call *MyFunction* using the following code:

```sql
SELECT * FROM kusto.MyFunction(10)
```

## Executing queries

The SQL stored procedure `sp_execute_kql` can be used to execute [Kusto QueryLanguage](../../query/index.md) queries, including parameterized queries. The procedure is similar to the `sp_executesql` stored procedure.

The first parameter of `sp_execute_kql` is the Kusto QueryLanguage query. Additional parameters are treated as [query parameters](../../query/queryparametersstatement.md).

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
