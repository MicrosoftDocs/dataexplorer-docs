---
title: Use a Jupyter Notebook to analyze data in Azure Data Explorer
description: This topic shows you how to analyze data in Azure Data Explorer using a Jupyter Notebook and the kqlmagic extension.
ms.reviewer: maraheja
ms.topic: how-to
ms.date: 05/08/2023

# Customer intent: I want to analyze data using Jupyter Notebooks and kqlmagic.
---

# Use a Jupyter Notebook and kqlmagic extension to analyze data in Azure Data Explorer

[Jupyter Notebook](https://jupyter.org/) is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text. It's useful for a wide range of tasks, such as data cleaning and transformation, numerical simulation, statistical modeling, data visualization, and machine learning.

[Kqlmagic](https://github.com/microsoft/jupyter-Kqlmagic) extends the capabilities of the Python kernel in Jupyter Notebook so you can run [Kusto Query Language (KQL)](kusto/query/index.md) queries natively. You can combine Python and KQL to query and visualize data using the rich Plot.ly library integrated with the [render](kusto/query/renderoperator.md) operator. The kqlmagic extension is compatible with Jupyter Lab, Visual Studio Code Jupyter extension, and Azure Data Studio, and supported data sources include Azure Data Explorer, Azure Monitor logs, and Application Insights.

In this article, you'll learn how to use kqlmagic in a Jupyter Notebook to connect to and query data stored in [Azure Data Explorer](https://dataexplorer.azure.com/home).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Jupyter Notebook installed on your local machine. Otherwise, use [Azure Data Studio](/sql/azure-data-studio/notebooks/notebooks-kqlmagic).

## Install kqlmagic

1. To install kqlmagic, run the following command:

    ```python
    !pip install Kqlmagic --no-cache-dir  --upgrade
    ```

1. To load the kqlmagic extension, run the following command:

    ```python
    %reload_ext Kqlmagic
    ```

    > [!NOTE]
    >
    > * Change the kernel version to Python 3.6 by clicking on **Kernel** > **Change Kernel** > **Python 3.6**.
    > * If the results are absent or not as expected, try reloading the kqlmagic extension.

## Authentication

There are many methods to authenticate to an Azure Data Explorer cluster and database using kqlmagic. Select the tab for your preferred method.

> [!TIP]
> To simplify the process of getting credentials, you can add various flags after the connection string. For more information, see [Advanced authentication options](#advanced-authentication-options).

### [Code](#tab/code)

The Azure AD code method prompts MSAL interactive login, meaning it opens a pop-up window in which to provide a designated code for authentication.

```python
%kql azure_data-Explorer://code;cluster='<cluster-name>';database='<database-name>'
```

### [Application key](#tab/application)

THe Azure AD application method allows for a non-interactive sign-in using an Azure AD application ID and key.

```python
%kql azure_data-Explorer://tenant='<tenant-id>';clientid='<aad-appid>';clientsecret='<aad-appkey>';cluster='<cluster-name>';database='<database-name>'
```

### [Username and password](#tab/userpass)

The Azure AD username and password method only works on corporate network. If a username is provided without a password, the user will be prompted to provide the password.

```python
%kql azure_data-Explorer://username='<username>';password='<password>';cluster='<cluster-name>';database='<database-name>'
```

### [Certificate](#tab/certificate)

The Azure AD certificate should be stored in a file accessible from the notebook. This file can be referenced in the connection string.

```python
%kql azure_data-Explorer://tenant='<tenant-id>';certificate='<certificate>';certificate_thumbprint='<thumbprint>';cluster='<cluster-name>';database='<database-name>'
```

### [Anonymous](#tab/anonymous)

Anonymous authentication is equivalent to no authentication, which is only supported for local clusters.

```python
%kql azureDataExplorer://anonymous;cluster='<cluster-name>';database='<database-name>'
```

---

> [!NOTE]
> To parameterize the connection string, use unquoted values since they are interpreted as a Python expression.

### Example

The following command uses the Azure AD code method to authenticate to the `Samples` database hosted on the `help` cluster. For non-Microsoft Azure AD users, replace the tenant name `Microsoft.com` with your Azure AD Tenant.

```python
%kql AzureDataExplorer://tenant="Microsoft.com";code;cluster='help';database='Samples'
```

## Advanced authentication options

To simplify the process of getting credentials, you can add various flags after the connection string. Refer to the following table for a description of these flags.

|Option|Description|Example|
|--|--|--|
|`-try_vscode_login`|Attempts to get a token from Visual Studio Code Azure Account login before authenticating with the specified connection string.||
|`-try_msi`|Attempts to get a token from the MSI local endpoint before authenticating with the specified connection string. Expects a dictionary with the optional MSI parameters: `resource`, `client_id`/`object_id`/`mis_res_id`, `cloud_environment`, `timeout`.|`-try_msi={"client_id":"00000000-0000-0000-0000-000000000000"}`|
|`-try_token`|Attempts to authenticate with a specified token before using the specified connection string. Expects a dictionary with Azure AD v1 or v2 token properties.|`-try_token={"tokenType":"bearer","accessToken":"<your-token-string>"`|
|`-try_azcli_login`|Attempts to get a token from Azure CLI before authenticating with the specified connection string.||
|`-try_azcli_login_subscription`|Attempts to get a token from Azure CLI using the subscription as a parameter to get the right token before authenticating with the specified connection string.|`-try_azcli_login_subscription='49998620-4d47-4ab8-88d1-d92ea58902e9'`|

## Query and visualize

Query data using the [render operator](kusto/query/renderoperator.md) and visualize data using the ploy.ly library. This query and visualization supplies an integrated experience that uses native KQL. Kqlmagic supports most charts except `timepivot`, `pivotchart`, and `ladderchart`. Render is supported with all attributes except `kind`, `ysplit`, and `accumulate`.

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

## Next steps

Run the help command to explore the following sample notebooks that contain all the supported features:

* [Get started with kqlmagic for Azure Data Explorer](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FQuickStart.ipynb) 
* [Get started with kqlmagic for Application Insights](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FQuickStartAI.ipynb) 
* [Get started with kqlmagic for Azure Monitor logs](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FQuickStartLA.ipynb) 
* [Parametrize your kqlmagic query with Python](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FParametrizeYourQuery.ipynb) 
* [Choose colors palette for your kqlmagic query chart result](https://mybinder.org/v2/gh/Microsoft/jupyter-kqlmagic/master?filepath=notebooks%2FColorYourCharts.ipynb)
