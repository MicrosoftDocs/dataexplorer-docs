---
title: Use a Jupyter Notebook to analyze data in Azure Data Explorer
description: This article shows you how to analyze data in Azure Data Explorer using a Jupyter Notebook and the kqlmagic extension.
ms.reviewer: maraheja
ms.topic: how-to
ms.date: 05/15/2023

# Customer intent: I want to analyze data using Jupyter Notebooks and kqlmagic.
---

# Use a Jupyter Notebook and kqlmagic extension to analyze data in Azure Data Explorer

[Jupyter Notebook](https://jupyter.org/) is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text. It's useful for a wide range of tasks, such as data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning.

[Kqlmagic](https://github.com/microsoft/jupyter-Kqlmagic) extends the capabilities of the Python kernel in Jupyter Notebook so you can run [Kusto Query Language (KQL)](kusto/query/index.md) queries natively. You can combine Python and KQL to query and visualize data using the rich Plot.ly library integrated with the [render](kusto/query/render-operator.md) operator. The kqlmagic extension is compatible with Jupyter Lab, Visual Studio Code Jupyter extension, and Azure Data Studio, and supported data sources include Azure Data Explorer, Azure Monitor logs, and Application Insights.

In this article, you'll learn how to use kqlmagic in a Jupyter Notebook to connect to and query data stored in [Azure Data Explorer](https://dataexplorer.azure.com/home).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Jupyter Notebook installed on your local machine. Otherwise, use [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-kqlmagic).
* Python 3.6. To change the Jupyter Notebook kernel version to Python 3.6, select **Kernel** > **Change Kernel** > **Python 3.6**.

## Install kqlmagic

Once you install and load the kqlmagic extension, you can write KQL queries in your notebook. If the kernel stops or the results aren't as expected, reload the kqlmagic extension.

1. To install kqlmagic, run the following command:

    ```python
    !pip install Kqlmagic --no-cache-dir  --upgrade
    ```

1. To load the kqlmagic extension, run the following command:

    ```python
    %reload_ext Kqlmagic
    ```

## Connect to a cluster

Select the tab for your preferred method to connect to your cluster.

### [Code](#tab/code)

The Microsoft Entra code method prompts MSAL interactive sign-in. You'll receive a code to enter for authentication.

```python
%kql AzureDataExplorer://code;cluster='<cluster-name>';database='<database-name>'
```

### [Application key](#tab/application)

The Microsoft Entra application method allows for a non-interactive sign-in using a Microsoft Entra application ID and key.

```python
%kql AzureDataExplorer://tenant='<tenant-id>';clientid='<aad-appid>';clientsecret='<aad-appkey>';cluster='<cluster-name>';database='<database-name>'
```

### [Username and password](#tab/userpass)

The Microsoft Entra username and password method only works on corporate network. If a username is provided without a password, the user is prompted to provide the password.

```python
%kql AzureDataExplorer://username='<username>';password='<password>';cluster='<cluster-name>';database='<database-name>'
```

### [Certificate](#tab/certificate)

The Microsoft Entra certificate should be stored in a file accessible from the notebook. This file can be referenced in the connection string.

```python
%kql AzureDataExplorer://tenant='<tenant-id>';certificate='<certificate>';certificate_thumbprint='<thumbprint>';cluster='<cluster-name>';database='<database-name>'
```

### [Anonymous](#tab/anonymous)

Anonymous authentication is equivalent to no authentication, which is only supported for local clusters.

```python
%kql azureDataExplorer://anonymous;cluster='<cluster-name>';database='<database-name>'
```

---

> [!TIP]
>
> * To parameterize the connection string, use unquoted values as they are interpreted as Python expressions.
> * To simplify the process of getting credentials, see [Connection options](#connection-options).

### Example of cluster connection

The following command uses the Microsoft Entra code method to authenticate to the `Samples` database hosted on the `help` cluster. For non-Microsoft Entra users, replace the tenant name `Microsoft.com` with your Microsoft Entra tenant.

```python
%kql AzureDataExplorer://tenant="Microsoft.com";code;cluster='help';database='Samples'
```

## Connection options

To simplify the process of getting credentials, you can add one of the following option flags after the connection string.

|Option|Description|Example syntax|
|--|--|--|
|try_azcli_login|Attempt to get authentication credentials from Azure CLI.|`-try_azcli_login`|
|try_azcli_login_subscription|Attempt to get authentication credentials from Azure CLI based on the specified subscription.|`-try_azcli_login_subscription=<subscription_id>`|
|try_vscode_login|Attempt to get authentication credentials from Visual Studio Code Azure account sign-in.|`-try_vscode_login`|
|try_msi|Attempt to get authentication credentials from the MSI local endpoint. Expects a dictionary with the optional MSI parameters: `resource`, `client_id`/`object_id`/`mis_res_id`, `cloud_environment`, `timeout`.|`-try_msi={"client_id":<id>}`|
|try_token|Authenticate with a specified token. Expects a dictionary with Azure AD v1 or v2 token properties.|`-try_token={"tokenType":"bearer","accessToken":"<token>"}`

### Example of connection option

Any of the options described in the previous table can be added after a connection string. The following example uses the Azure CLI sign-in option:

```python
%kql azureDataExplorer://code;cluster='help';database='Samples' -try_azcli_login
```

## Display connection information

To see all existing connections, run the following command:

```python
%kql --conn
```

To check the details of a specific connection, run the following command:

```python
%kql --conn <database-name>@<cluster-name>
```

## Query and visualize

Query data using the [render operator](kusto/query/render-operator.md) and visualize data using the ploy.ly library. This query and visualization supplies an integrated experience that uses native KQL. Kqlmagic supports most charts except `timepivot`, `pivotchart`, and `ladderchart`. Render is supported with all attributes except `kind`, `ysplit`, and `accumulate`.

### Query and render piechart

```python
%%kql
StormEvents
| summarize statecount=count() by State
| sort by statecount 
| take10
| render piechart title="My Pie Chart by State"
```

### Query and render timechart

```python
%%kql
StormEvents
| summarize count() by bin(StartTime,7d)
| render timechart
```

> [!NOTE]
> These charts are interactive. Select a time range to zoom into a specific time.

### Customize the chart colors

If you don't like the default color palette, customize the charts using palette options. The available palettes can be found here: [Choose colors palette for your kqlmagic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)

1. For a list of palettes:

    ```python
    %kql --palettes -popup_window
    ```

1. Select the `cool` color palette and render the query again:

    ```python
    %%kql -palette_name "cool"
    StormEvents
    | summarize statecount=count() by State
    | sort by statecount
    | take10
    | render piechart title="My Pie Chart by State"
    ```

## Parameterize a query with Python

Kqlmagic allows for simple interchange between Kusto Query Language and Python. To learn more: [Parameterize your kqlmagic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-Kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb)

### Use a Python variable in your KQL query

You can use the value of a Python variable in your query to filter the data:

```python
statefilter = ["TEXAS", "KANSAS"]
```

```python
%%kql
let _state = statefilter;
StormEvents 
| where State in (_state) 
| summarize statecount=count() by bin(StartTime,1d), State
| render timechart title = "Trend"
```

### Convert query results to Pandas DataFrame

You can access the results of a KQL query in Pandas DataFrame. Access the last executed query results by variable `_kql_raw_result_` and easily convert the results into Pandas DataFrame as follows:

```python
df = _kql_raw_result_.to_dataframe()
df.head(10)
```

### Example

In many analytics scenarios, you may want to create reusable notebooks that contain many queries and feed the results from one query into subsequent queries. The example below uses the Python variable `statefilter` to filter the data.

1. Run a query to view the top 10 states with maximum `DamageProperty`:

    ```python
    %%kql
    StormEvents
    | summarize max(DamageProperty) by State
    | order by max_DamageProperty desc
    | take10
    ```

1. Run a query to extract the top state and set it into a Python variable:

    ```python
    df = _kql_raw_result_.to_dataframe()
    statefilter =df.loc[0].State
    statefilter
    ```

1. Run a query using the `let` statement and the Python variable:

    ```python
    %%kql
    let _state = statefilter;
    StormEvents 
    | where State in (_state)
    | summarize statecount=count() by bin(StartTime,1d), State
    | render timechart title = "Trend"
    ```

1. Run the help command:

    ```python
    %kql --help "help"
    ```

> [!TIP]
> To receive information about all available configurations use `%config Kqlmagic`. To troubleshoot and capture Kusto errors, such as connection issues and incorrect queries, use `%config Kqlmagic.short_errors=False`

## Sample notebooks

* [Get started with kqlmagic for Azure Data Explorer](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FQuickStart.ipynb) 
* [Get started with kqlmagic for Application Insights](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FQuickStartAI.ipynb) 
* [Get started with kqlmagic for Azure Monitor logs](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FQuickStartLA.ipynb) 
* [Parametrize your kqlmagic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb) 
* [Choose colors palette for your kqlmagic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)

## Related content

* Learn [Kusto Query Language (KQL)](kusto/query/index.md)
