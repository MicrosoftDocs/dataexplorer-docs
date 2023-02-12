---
title: Send T-SQL queries over RESTful web API - Azure Data Explorer
description: This article describes how to use T-SQL queries with the RESTful web API for Azure Data Explorer.
ms.topic: reference
ms.date: 02/05/2023
---

# Send T-SQL queries over the REST API

Azure Data Explorer supports a [subset of the T-SQL language](../tds/sqlknownissues.md). For users who are more comfortable with SQL or have applications that are compatible with SQL, using T-SQL can be a useful way to interact with the data stored in Azure Data Explorer. In this article, we'll provide steps and examples for how to send T-SQL queries over the REST API.

## Send a T-SQL query

To send T-SQL queries to the API, create a `POST` request with the following components.

* Request URL: The URL should be in the format `https://<cluster_uri>/v1/rest/query`, where `<cluster_uri>` is the URI of your cluster that contains the table you want to query.

* Headers: Set the following mandatory headers and any [optional headers](request.md#request-headers) that you want to set. Replace `<cluster_uri>` and `<bearer_token>` with your cluster URI and bearer token values.

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

When you send a request like this, the output should look something like the following.

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
