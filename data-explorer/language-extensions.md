---
title: Manage language extensions in your Azure Data Explorer cluster.
description: Use language extension to integrate other languages within your Azure Data Explorer KQL queries.
ms.reviewer: orhasban
ms.topic: how-to
ms.date: 09/17/2024
---

# Manage language extensions in your Azure Data Explorer cluster

The language extensions feature allows you to use language extension plugins to integrate other languages into your Azure Data Explorer KQL queries. The plugin's runtime is hosted in a [sandbox](/kusto/concepts/sandboxes?view=azure-data-explorer&preserve-view=true), an isolated and secure environment, running on the cluster's nodes. In this article, you manage the language extensions plugin in your Azure Data Explorer cluster within the Azure portal.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Review the [limitations](#limitations). Note that language extensions can only be enabled on SKUs that support [nested virtualization](/kusto/concepts/sandboxes?view=azure-data-explorer&preserve-view=true#vm-sizes-supporting-nested-virtualization).
* Cluster AllDatabasesAdmin permissions. [Manage Azure Data Explorer cluster permissions](manage-cluster-permissions.md).

## Enable language extensions on your cluster

Do the following steps to enable a language extension on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. Select **Settings**.
1. Under **Configurations**, locate the language extension you want to use, and then select **On**.

    :::image type="content" source="media/language-extensions/configuration-enable-extension-trim.png" alt-text="Screenshot of Azure Data Explorer cluster configuration page, showing the enable language extension options.":::

1. For Python, select the desired image fom the list. The image can be [managed](/kusto/query/python-package-reference?view=azure-data-explorer&preserve-view=true) or a [custom image](#create-a-custom-image).
1. Select **Save**.

> [!NOTE]
> Enabling the language extension can take up to 60 minutes. The process doesn't impact cluster availability.

## Change the Python language extensions image on your cluster

Do the following steps to edit the **image** of your **Python** language extension on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. Select **Settings**.
1. Under **Configurations**, select the desired Python image from the list.
1. Select **Save**.

> [!NOTE]
> Updating the image process can take up to 60 minutes. The process doesn't impact cluster availability.

## Create a custom image

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. Select **Settings**.
1. Under **Configurations**, select **+ Add Custom Image (Preview)**
1. In the pane that opens, provide the following information:
    * **Custom image name**: The name of the custom image.
    * **Start from**: Choose either **Python engine** or **Existing image**.
        * **Python engine**: 
            1. Enter a valid Python version number.
            1. Add a requirements file.
        * **Existing image**: 
            1. Select an existing image from the dropdown. 
            1. Add a requirements file.
1. Select **Ok**.

    :::image type="content" source="media/language-extensions/create-custom-image.png" alt-text="Screenshot of Azure Data Explorer cluster configuration page, showing the custom image creation pane.":::

> [!NOTE]
> While the cluster is updating the new image, further changes to the cluster can't be made.

After the image is created you can edit or delete it.

### Requirements file

Supported requirements files are in the format of `pip requirements.txt` and can include any Python package. Each line contains the name of a package, optionally followed by the package number. For example:

```plaintext
annotated-types==0.6.0
anytree
arrow==1.3.0
attrs==23.2.0
```

## Disable language extensions on your cluster

> [!NOTE]
> Disabling the image process can take up to 30 minutes. The process doesn't impact cluster availability.

Do the following steps to disable language extensions on your cluster:

1. In the Azure portal, go to your Azure Data Explorer cluster.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **Off** to disable a language extension.
1. Select **Save**.

    :::image type="content" source="media/language-extensions/configuration-disable-extension-trim.png" alt-text="Screenshot of Azure Data Explorer portal cluster configuration to disable language extensions.":::

## Limitations

* The language extensions runtime sandbox allocates disk space even if no query runs in the scope of the relevant language. For more detailed limitations, see [sandboxes](/kusto/concepts/sandboxes?view=azure-data-explorer&preserve-view=true).

## Related content

* Learn how to [run Python integrated KQL queries](/kusto/query/python-plugin?view=azure-data-explorer&preserve-view=true)
* Learn how to [run R integrated KQL queries](/kusto/query/r-plugin?view=azure-data-explorer&preserve-view=true)
