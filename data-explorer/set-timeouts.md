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

:::image type="content" source="media/set-timeouts/set-timeouts-web-ui.png" alt-text="Screenshot of the settings in the Azure Data Explorer web UI that control timeout length.":::
