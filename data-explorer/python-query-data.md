---
title: 'Query data using the Azure Data Explorer Python library'
description: 'In this article, you learn how to query data from Azure Data Explorer using Python.'
ms.reviewer: mblythe
ms.topic: how-to
ms.date: 08/05/2019

# Customer intent: As a Python developer, I want to query data so I can include it in my apps.
---

# Query data using the Azure Data Explorer Python library

In this article, you query data using the Azure Data Explorer. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data.

Azure Data Explorer provides a [data client library for Python](https://github.com/Azure/azure-kusto-python/tree/master/azure-kusto-data). This library enables you to query data from your code. Connect to a table on the [help cluster](https://dataexplorer.azure.com/clusters/help/databases/Samples) that we have set up to aid learning. You can query a table on that cluster and return the results.

## Prerequisites

* [Python 3.4+](https://www.python.org/downloads/)
* A Microsoft account or a Microsoft Entra user identity to access the [help cluster](https://dataexplorer.azure.com/clusters/help/databases/Samples)

## Install the data library

Install *azure-kusto-data*.

```
pip install azure-kusto-data
```

## Add import statements and constants

Import classes from the library, as well as *pandas*, a data analysis library.

```python
from azure.kusto.data import KustoClient, KustoConnectionStringBuilder
from azure.kusto.data.exceptions import KustoServiceError
from azure.kusto.data.helpers import dataframe_from_result_table
import pandas as pd
```

To authenticate an application, Azure Data Explorer uses your Microsoft Entra tenant ID. To find your tenant ID, use the following URL, substituting your domain for *YourDomain*.

```
https://login.microsoftonline.com/<YourDomain>/.well-known/openid-configuration/
```

For example, if your domain is *contoso.com*, the URL is: [https://login.microsoftonline.com/contoso.com/.well-known/openid-configuration/](https://login.microsoftonline.com/contoso.com/.well-known/openid-configuration/). Click this URL to see the results; the first line is as follows.

```
"authorization_endpoint":"https://login.microsoftonline.com/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize"
```

The tenant ID in this case is `6babcaad-604b-40ac-a9d7-9fd97c0b779f`. Set the value for AAD_TENANT_ID before running this code.

```python
AAD_TENANT_ID = "<TenantId>"
KUSTO_CLUSTER = "https://help.kusto.windows.net/"
KUSTO_DATABASE = "Samples"
```

Now construct the connection string. This example uses device authentication to access the cluster. You can also use [Microsoft Entra application certificate](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py#L24), [Microsoft Entra application key](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py#L20), and [Microsoft Entra user and password](https://github.com/Azure/azure-kusto-python/blob/master/azure-kusto-data/tests/sample.py#L34).

```python
KCSB = KustoConnectionStringBuilder.with_aad_device_authentication(
    KUSTO_CLUSTER)
KCSB.authority_id = AAD_TENANT_ID
```

## Connect to Azure Data Explorer and execute a query

Execute a query against the cluster and store the output in a data frame. When this code runs, it returns a message like the following: *To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code F3W4VWZDM to authenticate*. Follow the steps to sign-in, then return to run the next code block.

```python
KUSTO_CLIENT = KustoClient(KCSB)
KUSTO_QUERY = "StormEvents | sort by StartTime desc | take 10"

RESPONSE = KUSTO_CLIENT.execute(KUSTO_DATABASE, KUSTO_QUERY)
```

## Explore data in DataFrame

After you enter a sign in, the query returns results, and they are stored in a data frame. You can work with the results like you do any other data frame.

```python
df = dataframe_from_result_table(RESPONSE.primary_results[0])
df
```

You should see the top ten results from the StormEvents table.

## Next step

> [!div class="nextstepaction"]
> [Ingest data using Python](python-ingest-data.md)
