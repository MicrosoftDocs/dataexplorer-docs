---
title: Set timeouts in Azure Data Explorer
description: Learn how to set the query timeout length in various Azure Data Explorer tools, such as Kusto.Explorer and the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 01/09/2023
---

## Set timeouts

In Azure Data Explorer, it's possible to customize the timeout length for your queries and [management commands](kusto/management/index.md). Adjusting the timeout can help you optimize the performance and efficiency of your queries and commands.

In this guide, you'll learn how to set a custom timeout in various tools such as the [Azure Data Explorer web UI](web-ui-overview.md), [Kusto.Explorer](kusto/tools/kusto-explorer.md), and [Kusto.Cli](/kusto/tools/kusto-cli.md). By default, certain tools have their own default timeout values, but it may be helpful to adjust these values based on the complexity and expected runtime of your queries.

## Azure Data Explorer web UI

This section will describe how to configure a custom query timeout and admin command timeout in the Azure Data Explorer web UI.

### Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Access to an Azure Data Explorer cluster and database. If needed, [create a free cluster and database](start-for-free-web-ui.md).

### Set timeout length

1. Go to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home).
1. Sign in with your Microsoft account or Azure Active Directory user identity credentials.
1. In the top menu, select the **Settings** icon.
1. From the left menu, select **Connection**.
1. Under the **Query timeout (in minutes)** setting, use the slider to choose the desired query timeout length.
1. Under the **Admin command timeout (in minutes)** setting, use the slider to choose the desired admin command timeout length.
1. The changes will be saved automatically.

:::image type="content" source="media/set-timeouts/web-ui-set-timeouts.png" alt-text="Screenshot of the settings in the Azure Data Explorer web UI that control timeout length.":::

## Kusto.Explorer

This section will describe how to configure a custom query timeout and admin command timeout in the Kusto.Explorer.

### Prerequisites

* Download and install the [Kusto.Explorer tool](tools/../kusto/tools/kusto-explorer.md#installing-kustoexplorer).
* Access to an Azure Data Explorer cluster and database. If needed, [create a free cluster and database](start-for-free-web-ui.md).

### Set timeout length

1. Open the Kusto.Explorer tool.
1. In the top menu, select the **Tools** tab.
1. On the right-hand side, select **Options**.

    :::image type="content" source="media/set-timeouts/kusto-explorer-options-widget.png" alt-text="Screenshot showing the options widget in the Kusto.Explorer tool.":::

1. In the left menu, select **Connections**.
1. In the **Query Server Timeout** setting, enter the desired timeout length.
1. Under the **Admin Command Server Timeout** setting, enter the desired timeout length.

    :::image type="content" source="media/set-timeouts/kusto-explorer-set-timeouts.png" alt-text="Screenshot showing settings that control the timeout length in Kusto.Explorer.":::

1. Select **OK** to save the changes.

## Kusto.Cli

This section will describe how to configure a custom server timeout in the Kusto.Cli.

### Prerequisites

* Install the [Kusto.Cli](kusto/tools/kusto-cli.md) by downloading the package [Microsoft.Azure.Kusto.Tools](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/).

### Set timeout length

Run the following command with the desired timeout length as a valid [timespan](kusto/query/scalar-data-types/timespan.md) value.

```dotnet
Kusto.Cli.exe <ConnectionString> #crp servertimeout=<timespan>
```
