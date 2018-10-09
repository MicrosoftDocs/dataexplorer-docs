---
title: Querying Kusto using Azure Notebooks - Azure Data Explorer | Microsoft Docs
description: This article describes Querying Kusto using Azure Notebooks in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Querying Kusto using Azure Notebooks

[Azure Notebooks](https://notebooks.azure.com/) is a cloud service in Azure that makes creating and sharing
[Jupyter Notebooks](https://jupyter.org/), making it easy to combine documentation, code, and the results of running the code.

For more Kusto-python documentation please look at our [python](https://kusto.azurewebsites.net/docs/api/python/kusto-python-client-library.html) page, [GitHub repository](https://github.com/Azure/azure-kusto-python#minimum-requirements), and [samples](https://github.com/Azure/azure-kusto-python#samples).
It is now possible to query Kusto from an Azure Notebooks notebook by using the Kusto client for Python.
Here's how:

1. Open [Azure Notebooks](https://notebooks.azure.com/) in your browser and sign-in to your
   AAD (@microsoft.com) account.

2. Create a library.

3. In that library, create a notebook. The notebook should be using a language from the [supported languages](https://github.com/Azure/azure-kusto-python#minimum-requirements).


4. Add a new cell below the first one, and run it:

    ```python
    from azure.kusto.data.request import KustoClient
    kc = KustoClient("https://help.kusto.windows.net")
    kc.execute("Samples", ".show version")
    ```

5. This will prompt you to open a new browser windows on [https://aka.ms/devicelogin](https://aka.ms/devicelogin),
   and then sign-in. Do so, enter the authorization code, and sign-in your AAD (@microsoft.com) account. Return
   to your notebook (the Kusto client `kc` can now authenticate to Kusto using your identity.)
   *Note: Some users have reported issues authenticating using Edge; until such issues get resolved,
   please use a different browser.*

6. Enter your Kusto query and execute it. For example:

    ```python
    query= ".show tables | project DatabaseName, TableName"
    response = kc.execute("Samples", query)
    for row in response.primary_results[0]:
    print(", ".join(row))
    ```