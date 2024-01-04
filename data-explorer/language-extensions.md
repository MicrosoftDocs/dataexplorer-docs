---
title: Manage language extensions in your Azure Data Explorer cluster.
description: Use language extension to integrate other languages within your Azure Data Explorer KQL queries.
ms.reviewer: orhasban
ms.topic: how-to
ms.date: 03/16/2023
---

# Manage language extensions in your Azure Data Explorer cluster

The language extensions feature allows you to use language extension plugins to integrate other languages into your Azure Data Explorer KQL queries. When you run a user-defined-function (UDF) using a relevant script, the script gets tabular data as its input and is expected to produce tabular output. The plugin's runtime is hosted in a [sandbox](kusto/concepts/sandboxes.md), an isolated and secure environment, running on the cluster's nodes. In this article, you manage the language extensions plugin in your Azure Data Explorer cluster within the Azure portal.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Review the [limitations](#limitations).

## Enable language extensions on your cluster

Do the following steps to enable a language extension on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. Select **Settings**.
1. Under **Configurations**, locate the language extension you want to use, and then select **On**.

    :::image type="content" source="media/language-extensions/configuration-enable-extension-trim.png" alt-text="Screenshot of Azure Data Explorer cluster configuration page, showing the enable language extension options.":::

1. For Python, in the pane that opens, select a Python image from the list, and then select **OK**.

    :::image type="content" source="media/language-extensions/select-python-image.png" alt-text="Screenshot of Azure Data Explorer cluster configuration page, showing the Python language extension image selection.":::

1. Select **Save**.

> [!NOTE]
> Enabling the language extension can take up to 30 minutes. The process doesn't impact on cluster availability.

## Change the Python language extensions image on your cluster

Do the following steps to edit the **image** of your **Python** language extension on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. Select **Settings**.
1. Under **Configurations**, locate the Python language extension, and then select **Edit**.
1. In the pane that opens, select a Python image from the list, and then select **OK**.

    :::image type="content" source="media/language-extensions/edit-python-image.png" alt-text="Screenshot of Azure Data Explorer cluster configuration page, showing the Python language extension edit button and image selection.":::

1. Select **Save**.

> [!NOTE]
> Updating the image process can take up to 30 minutes. The process doesn't impact on cluster availability.

## Disable language extensions on your cluster

> [!NOTE]
> Disabling the image process can take up to 30 minutes. The process doesn't impact on cluster availability.

Do the following steps to disable language extensions on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **Off** to disable a language extension.
1. Select **Save**.

    :::image type="content" source="media/language-extensions/configuration-disable-extension-trim.png" alt-text="Screenshot of Azure Data Explorer portal cluster configuration to disable language extensions.":::

## Limitations

* The language extensions runtime sandbox allocates disk space even if no query runs in the scope of the relevant language. For more detailed limitations, see [sandboxes](kusto/concepts/sandboxes.md).
* For [VM SKUs that don't support nested virtualization](kusto/concepts/sandboxes-in-non-modern-skus.md#virtual-machine-sizes), see [limitations](kusto/concepts/sandboxes-in-non-modern-skus.md).

## Related content

* Learn how to [run Python integrated KQL queries](kusto/query/python-plugin.md)
* Learn how to [run R integrated KQL queries](kusto/query/r-plugin.md)
