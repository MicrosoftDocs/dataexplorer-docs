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

## Kqlmagic

Kqlmagic is a custom "magic" for the Jupyter Python 3 kernel. It adds the ability
to execute Kusto query language queries natively
(without the explicit use of a Kusto Python client).
Ksqlmagic works on Azure Notebooks, a Jupyter Notebook front end,
Jupyter Lab, and Visual Studio Code Jupyter extension.
It supports Kusto, Application Insights, and Log Analytics as data sources to run queries against.

Azure Notebooks includes Kqlmagic as part of the image.
To load the extension into your notebook just run:

```
%load_ext Kqlmagic
```

In other environments, or to make sure that the latest version of Kqlmagic is
installed, use:

```
3.	!pip install Kqlmagic --no-cache-dir --upgrade
```

Additional information about getting started with Kqlmagic:

* [Getting Started with Kqlmagic for Kusto](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStart.ipynb)
* [Getting Started with Kqlmagic for Application Insights](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartAI.ipynb)
* [Getting Started with Kqlmagic for Log Analytics](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartLA.ipynb)
* [More information on Jupyter magics](https://ipython.readthedocs.io/en/stable/interactive/magics.html)

And here are a few sample notebooks:

* [Parametrize your Kqlmagic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb)
* [Choose colors palette for your Kqlmagic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)

## Python

As an alternative to Kqlmagic, or for kernels for which it is not supported,
one can also use the Kusto Python client in Azure Notebooks similar Jupyter
environments to query Kusto.

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

For more information see:

* [Kusto-python client](https://kusto.azurewebsites.net/docs/api/python/kusto-python-client-library.html)
* [Kusto-python GitHub repo](ttps://github.com/Azure/azure-kusto-python)