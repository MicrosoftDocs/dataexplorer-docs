---
title: Querying Kusto using Azure Notebooks - Azure Data Explorer | Microsoft Docs
description: This article describes Querying Kusto using Azure Notebooks in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 04/30/2019

---
# Querying Kusto using Azure Notebooks

[Azure Notebooks](https://notebooks.azure.com/) is a cloud service in Azure that makes creating and sharing
[Jupyter Notebooks](https://jupyter.org/), making it easy to combine documentation, code, and the results of running the code.

## KQL magic

KQL magic is a custom "magic" for the Jupyter Python 3 kernel. It adds the ability
to execute Kusto query language queries natively
(without the explicit use of a Kusto Python client).
KQL magic works on Azure Notebooks, a Jupyter Notebook front end,
Jupyter Lab, and Visual Studio Code Jupyter extension.
It supports Kusto, Application Insights, and Log Analytics as data sources to run queries against.

Azure Notebooks includes KQL magic as part of the image.
To load the extension into your notebook just run:

```
%load_ext Kqlmagic
```

In other environments, or to make sure that the latest version of KQL magic is
installed, use:

```
!pip install Kqlmagic --no-cache-dir --upgrade
```

Additional information about getting started with KQL magic:

* [Getting Started with KQL magic for Kusto](https://mybinder.org/v2/gh/Microsoft/jupyter-KQLmagic/master?filepath=notebooks%2FQuickStart.ipynb)
* [Getting Started with KQL magic for Application Insights](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartAI.ipynb)
* [Getting Started with KQL magic for Log Analytics](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FQuickStartLA.ipynb)
* [More information on Jupyter magics](https://ipython.readthedocs.io/en/stable/interactive/magics.html)

A few sample notebooks:

* [Parametrize your KQL magic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb)
* [Choose colors palette for your KQL magic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)

For more information regarding how to analyze data with KQL magic see: [Analyze data using Jupyter Notebook and KQL magic]
(https://docs.microsoft.com/azure/data-explorer/kqlmagic)

## Python

As an alternative to KQL magic, or for kernels for which it is not supported,
one can also use the Kusto Python client in Azure Notebooks or similar Jupyter
environments to query Kusto.

Here's how:

1. Open [Azure Notebooks](https://notebooks.azure.com/) in your browser and sign-in.

2. Select **My Projects** tab in header. Click **+ New Projects** to open the **Create New Project** window.

3. In the **Create New Project** window, fill out the form with **Project Name** and **Project ID** and click **Create**

4. In that project, create a notebook. The notebook should be using a language from the [supported languages](https://github.com/Azure/azure-kusto-python#minimum-requirements).
To create a notebook, Click on the drop-down near ** + ** and select **Notebook** to open the **Create New Notebook** window.

5. In the **Create New Notebook** window, fill out **Notebook Name** and **Select Language**. Click **New**. The Notebook is added to the **<project_name>** window.

6. Select your notebook to open it and add information.

7. Add a new cell below the first one, and run it:

    ```python
	from azure.kusto.data.request import KustoClient, KustoConnectionStringBuilder
	kcsb = KustoConnectionStringBuilder.with_aad_device_authentication("https://help.kusto.windows.net")
	kc = KustoClient(kcsb)
	kc.execute("Samples", ".show version")
    ```

8. This will prompt you to open a new browser windows on [https://aka.ms/devicelogin](https://aka.ms/devicelogin),
   and then sign-in. Do so, enter the authorization code, and sign-in your AAD (@microsoft.com) account. Return
   to your notebook (the Kusto client `kc` can now authenticate to Kusto using your identity.)
   *Note: Some users have reported issues authenticating using Edge; until such issues get resolved,
   please use a different browser.*

9. Enter your Kusto query and execute it. For example:

    ```python
    query= ".show tables | project DatabaseName, TableName"
    response = kc.execute("Samples", query)
    for row in response.primary_results[0]:
    print(", ".join(row))
    ```

For more information see:

* [Kusto-python client](https://kusto.azurewebsites.net/docs/api/python/kusto-python-client-library.html)
* [Kusto-python GitHub repo](ttps://github.com/Azure/azure-kusto-python)