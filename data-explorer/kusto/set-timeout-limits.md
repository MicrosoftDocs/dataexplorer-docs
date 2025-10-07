---
title: Set Timeout Limits
description: Learn how to set the query timeout length and the Admin command timeout, in various tools, such as Kusto.Explorer and the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 09/25/2025
monikerRange: "azure-data-explorer"
ms.custom: sfi-ropc-nochange
---
# Set timeout limits

> [!INCLUDE [applies](includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](includes/applies-to-version/azure-data-explorer.md)]

Customize timeouts for queries and [management commands](management/index.md). This article shows how to set custom timeouts in the [Azure Data Explorer web UI](/azure/data-explorer/web-query-data), [Kusto.Explorer](tools/kusto-explorer.md), [Kusto.Cli](tools/kusto-cli.md), [Power BI](/azure/data-explorer/power-bi-data-connector), and an [SDK](#sdks). Each tool has a default timeout, but adjust it based on query complexity and expected runtime.

> [!NOTE]
> Server side policies, such as the [request limits policy](management/request-limits-policy.md), can override the timeout specified by the client.

## Azure Data Explorer web UI

Configure custom query and admin command timeouts in the Azure Data Explorer web UI.

### Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](/azure/data-explorer/create-cluster-and-database).

### Set the timeout length

1. Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) with your Microsoft account or Microsoft Entra user identity credentials.

1. In the top menu, select the **Settings** icon.

1. From Settings, select the **Connection** tab.

1. Under **Query timeout (in minutes)**, move the slider to set the query timeout length.

1. Under **Admin command timeout (in minutes)**, move the slider to set the admin command timeout length.

    :::image type="content" source="media/set-timeouts/web-ui-set-timeouts.png" alt-text="Screenshot of the settings in the Azure Data Explorer web UI that control timeout length.":::

1. Close the settings window to save your changes.

## Kusto.Explorer

Set custom query and admin command timeouts in Kusto.Explorer.

### Prerequisites

* Install [Kusto.Explorer](tools/kusto-explorer.md#install-kustoexplorer).
* An Azure Data Explorer cluster and database. [Create a cluster and database](/azure/data-explorer/create-cluster-and-database).

### Set timeout length

1. Open Kusto.Explorer.

1. In the top menu, select the **Tools** tab.

1. In the **Tools** tab, select **Options**.

    :::image type="content" source="media/set-timeouts/kusto-explorer-options-widget.png" alt-text="Screenshot of the Options dialog in Kusto.Explorer.":::

1. In the **Options** dialog, select **Connections**.

1. For **Query Server Timeout**, enter the timeout length (maximum 1 hour).

1. For **Admin Command Server Timeout**, enter the timeout length (maximum 1 hour).

    :::image type="content" source="media/set-timeouts/kusto-explorer-set-timeouts.png" alt-text="Screenshot of settings for query and admin command timeouts in Kusto.Explorer.":::

1. Select **OK** to save.

## Kusto.Cli

Configure a custom server timeout in Kusto.Cli.

### Prerequisites

* Install [Kusto.Cli](tools/kusto-cli.md) by downloading the [Microsoft.Azure.Kusto.Tools](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/) package.

### Set timeout length

Run this command to set the *servertimeout* [client request property](api/netfx/client-request-properties.md) to a valid [timespan](query/scalar-data-types/timespan.md) value (up to 1 hour). Replace *`<ConnectionString>`* and *`<timespan>`* with your connection string and timespan value.

```dotnet
Kusto.Cli.exe <ConnectionString> -execute:"#crp servertimeout=<timespan>" -execute:"…"
```

Or run this command to set the *norequesttimeout* [client request property](api/netfx/client-request-properties.md), which sets the timeout to the maximum of 1 hour. Replace *`<ConnectionString>`* with your connection string.

```dotnet
Kusto.Cli.exe <ConnectionString> -execute:"#crp norequesttimeout=true" -execute:"…"
```

Once set, the client request property applies to all future values until the app is restarted or another value gets set. To retrieve the current value, use:

```dotnet
Kusto.Cli.exe <ConnectionString> -execute:"#crp servertimeout"
```

## Power BI

Set a custom server timeout in Power BI Desktop.

### Prerequisites

* [Power BI Desktop](https://powerbi.microsoft.com/get-started/)

### Set timeout length

1. [Connect to your Azure Data Explorer cluster from Power BI Desktop](/azure/data-explorer/power-bi-data-connector).

1. On the ribbon, select **Transform Data**.

   :::image type="content" source="media/set-timeouts/power-bi-transform-data.png" alt-text="Screenshot of the transform data option in Power BI Desktop.":::

1. In the query menu, select **Advanced Editor**.

   :::image type="content" source="media/set-timeouts/power-bi-advanced-editor.png" alt-text="Screenshot of the Power BI advanced query editor option in Power BI Desktop.":::

1. In the pop-up window, set the timeout option in the fourth parameter of the `AzureDataExplorer.Contents` method. The following example shows how to set a timeout length of 59 minutes.

    ```Power Query M
    let 
        Source = AzureDataExplorer.Contents(<cluster>, <database>, <table>, [Timeout=#duration(0,0,59,0)])
    in
        Source
    ```

1. Select **Done** to apply the changes.

## SDKs

Set SDK timeouts in [Customize query behavior with client request properties](api/get-started/app-basic-query.md#customize-query-behavior-with-client-request-properties).

## Related content

* [Query limits](concepts/query-limits.md)
