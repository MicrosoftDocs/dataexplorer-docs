---
title:  Send T-SQL queries over RESTful web API
description: This article describes how to use T-SQL queries with the RESTful web API for Azure Data Explorer.
ms.topic: reference
ms.date: 02/21/2023
---

# Send T-SQL queries via the REST API

This article describes how to use a [subset of the T-SQL language](/azure/data-explorer/t-sql) to send T-SQL queries via the REST API.

## Request structure

To send T-SQL queries to the API, create a `POST` request with the following components.

* Request URL: The URL should be formatted as `https://<cluster_uri>/v1/rest/query`, where `<cluster_uri>` is the URI of your cluster containing the table you want to query.

* Headers: Set the following [headers](request.md#request-headers). Replace `<cluster_uri>` and `<bearer_token>` with your specific cluster URI and bearer token values.

    ```makefile
    Accept:application/json
    Content-Type:application/json; charset=utf-8
    Host:<cluster_uri>
    Authorization: Bearer <bearer_token>
    ```

* Body: Set the `csl` property to the text of your T-SQL query, and the [client request property](../netfx/request-properties.md) `query_language` to `sql`.

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
