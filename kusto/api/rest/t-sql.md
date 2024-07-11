---
title:  Send T-SQL queries over RESTful web API
description: This article describes how to use T-SQL queries with the RESTful web API.
ms.topic: reference
ms.date: 02/21/2023
---

# Send T-SQL queries via the REST API

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This article describes how to use a [subset of the T-SQL language](/azure/data-explorer/t-sql) to send T-SQL queries via the REST API.

## Request structure

To send T-SQL queries to the API, create a `POST` request with the following components.

:::moniker range="azure-data-explorer"
To copy your URI, in the Azure portal, go to your cluster's overview page, and then select the URI.
   `https://<your_cluster>.kusto.windows.net/MyDatabase?
web=0&query=KustoLogs+%7c+where+Timestamp+>+ago({Period})+%7c+count&Period=1h`
    Replace &lt;your_cluster&gt; with your Azure Data Explorer cluster name.
:::moniker-end

:::moniker range="microsoft-fabric"
To copy your URI, see [Copy a KQL database URI](/fabric/real-time-intelligence/access-database-copy-uri#copy-uri).
:::moniker-end

* Request URL: The URL should be formatted as `https://<cluster_uri>/v1/rest/query`, where `<cluster_uri>` is the URI of your cluster or database containing the table you want to query.

* Headers: Set the following [headers](request.md#request-headers). Replace `<cluster_uri>` and `<bearer_token>` with your specific cluster or database URI and bearer token values.

    ```makefile
    Accept:application/json
    Content-Type:application/json; charset=utf-8
    Host:<cluster_uri>
    Authorization: Bearer <bearer_token>
    ```

* Body: Set the `csl` property to the text of your T-SQL query, and the [client request property](request-properties.md) `query_language` to `sql`.

    ```json
    {
        "csl": "<t_sql_query>",
        "properties": {
            "Options": {
                "query_language": "sql"
            }
        }
    }
    ```

## Example

The following example shows a request body with a T-SQL query in the `csl` field and the `query_language` client request property set to `sql`.

```json
{
    "db": "MyDatabase",
    "csl": "SELECT top(10) * FROM MyTable",
    "properties": {
        "Options": {
            "query_language": "sql"
        }
    }
}
```

The response is in a format similar to the following.

```json
{
    "Tables": [
        {
            "TableName": "Table_0",
            "Columns": [
                {
                    "ColumnName": "rf_id",
                    "DataType": "String",
                    "ColumnType": "string"
                },
                ...
            ],
            "Rows": [
                [
                    "b9b84d3451b4d3183d0640df455399a9",
                    ...
                ],
                ...
            ]
        }
    ]
}
```

## Related content

* Learn more about [T-SQL limitations](/azure/data-explorer/t-sql#limitations)
* See the [REST API overview](index.md)
