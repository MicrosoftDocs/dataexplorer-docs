---
title: "Quickstart: Create an Azure Data Explorer cluster and database"
description: In this quickstart, you learn how to create an Azure Data Explorer cluster and database.
ms.reviewer: mblythe
ms.topic: quickstart
ms.date: 07/02/2023
ms.custom: mode-portal
adobe-target: true

# Customer intent: As a database administrator, I want to create an Azure Data Explorer cluster and database so that I can understand whether Azure Data Explorer is suitable for my analytics projects.
---

# Quickstart: Create an Azure Data Explorer cluster and database

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. To use Azure Data Explorer, you first create a cluster and then create one or more databases in that cluster. This article covers how to create a free cluster and database or create a full cluster and a database. To decide which is right for you, check the [feature comparison](start-for-free.md#feature-comparison).

In this article, the full cluster is created in the Azure portal. You can also create a full cluster and database using C#, Python, Go, the Azure CLI, PowerShell, or an Azure Resource Manager (ARM) template. For more information, see [Create a cluster and database](create-cluster-database.md).

For information on cluster subscription limits, see [Azure Data Explorer limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-data-explorer-limits).

## Prerequisites

The prerequisites vary whether creating a free or full cluster. Select the relevant tab.

### [Free cluster](#tab/free)

A Microsoft account or a Microsoft Entra user identity to create a free cluster. You don't need an Azure subscription or credit card.

### [Full cluster](#tab/full)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).

---

## Create a cluster

Select the relevant tab to learn how to create a free or full cluster.

### [Free cluster](#tab/free)

[!INCLUDE [create-free-cluster](includes/create-free-cluster.md)]

### [Full cluster](#tab/full)

Create an Azure Data Explorer cluster with a defined set of compute and storage resources in an Azure resource group.

1. Select the **+ Create a resource** button in the upper-left corner of the portal.

    :::image type="content" source="media/create-cluster-and-database/create-resource.png" alt-text="Screenshot of the Create a resource button." lightbox="media/create-cluster-and-database/create-resource.png":::

1. Search for *Azure Data Explorer*.

    :::image type="content" source="media/create-cluster-and-database/search-resources.png" alt-text="Search Azure Data Explorer" lightbox="media/create-cluster-and-database/search-resources.png":::

1. Under **Azure Data Explorer**, select **Create**.

    :::image type="content" source="media/create-cluster-and-database/create-click.png" alt-text="Screenshot of the Create a cluster window" lightbox="media/create-cluster-and-database/create-click.png":::

1. Fill out the basic cluster details with the following information.

    :::image type="content" source="media/create-cluster-and-database/create-cluster-form.png" alt-text="Screenshot of the Azure portal create Azure Data Explorer cluster form." lightbox="media/create-cluster-and-database/create-cluster-form.png":::

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | Your resource group | Use an existing resource group or create a new resource group. |
    | Cluster name | A unique cluster name | Choose a unique name that identifies your cluster. The domain name *[region].kusto.windows.net* is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters.
    | Region | *West US* or *West US 2* | Select *West US* or *West US 2* (if using availability zones) for this quickstart. For a production system, select the region that best meets your needs.
    | Workload | *Dev/Test* | Select *Dev/Test* for this quickstart. For a production system, select the specification that best meets your needs.
    | Compute specifications | *Dev(No SLA)_Standard_E2a_v4* | Select *Dev(No SLA)_Standard_E2a_v4* for this quickstart. For a production system, select the specification that best meets your needs.
    | Availability zones | On | Turning on this feature distributes the cluster storage and compute resources across multiple physical zones within a region for added protection and availability. By default, this feature is turned on if zones are supported in the region. If fewer than 3 zones are available for the compute instances, the portal displays the number of supported zones. Deployment to availability zones is possible only when creating the cluster, and can't be modified later. Read more about [Azure Availability Zones](/azure/availability-zones/az-overview).|

1. Select **Review + create** to review your cluster details, and on the next screen select **Create** to provision the cluster. Provisioning typically takes about 10 minutes.

1. When the deployment is complete, select **Go to resource**.

    :::image type="content" source="media/create-cluster-and-database/notification-resource.png" alt-text="Screenshot of the Go to resource button." lightbox="media/create-cluster-and-database/notification-resource.png":::

> [!NOTE]
> If the deployment fails with the error "SubscriptionNotRegistered", retry the operation.
>
> Deployment fails when the Kusto resource provider isn't registered on the subscription described in [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types). When the deployment fails, the Kusto resource provider registers itself on the subscription, and the retry can then succeed.

---

## Create a database

Select the relevant tab to learn how to create a database within your cluster.

### [Free cluster](#tab/free)

To create a database in your free cluster:

1. Open the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

1. From the left menu, select **My cluster**.

1. Under **Actions**, find the **Create database** panel. Then, select **Create**.

    :::image type="content" source="media/create-cluster-and-database/create-free-cluster.png" alt-text="Screenshot of panel with option to create free cluster." lightbox="media/create-cluster-and-database/create-free-cluster.png":::

1. Enter a name for the database. Select **Next: Create Database**.

    :::image type="content" source="media/create-cluster-and-database/create-free-database.png" alt-text="Screenshot of area to add name for free cluster database." lightbox="media/create-cluster-and-database/create-free-database.png":::

### [Full cluster](#tab/full)

To create a database in your full cluster:

1. Go to your cluster in the [Azure portal](https://portal.azure.com/).

1. On the **Overview** tab, select **Create database**.

    :::image type="content" source="media/create-cluster-and-database/database-creation.png" alt-text="Screenshot of the Create a database window." lightbox="media/create-cluster-and-database/database-creation.png":::

1. Fill out the form with the following information.

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Admin | *Default selected* | The admin field is disabled. New admins can be added after database creation. |
    | Database name | *TestDatabase* | The name of database to create. The name must be unique within the cluster. |
    | Retention period | *365* | The number of days that data is guaranteed to be kept available for querying. The period is measured from the time data is ingested. |
    | Cache period | *31* | The number of days to keep frequently queried data available in SSD storage or RAM to optimize querying. |

    :::image type="content" source="media/create-cluster-and-database/create-test-database.png" alt-text="Create database form." lightbox="media/create-cluster-and-database/create-test-database.png":::

1. Select **Create** to create the database. Creation typically takes less than a minute. When the process is complete, you're back on the cluster **Overview** tab.

---

## Run commands in the database

After you created the cluster and database, you can run queries and commands. The database doesn't have data yet, but you can still see how the tools work.

### [Free cluster](#tab/free)

1. Under **Actions**, find the **Query data** panel. Then, select **Query**. Paste the command `.show databases` into the query window, then select **Run**. The result set shows **TestDatabase**, the only database in the cluster.

    :::image type="content" source="media/create-cluster-and-database/query-free-cluster.png" alt-text="Screenshot of quick action to query data." lightbox="media/create-cluster-and-database/query-free-cluster.png":::

1. Paste the command `.show tables` into the query window and select **Run**. This command returns an empty result set because you don't have any tables yet. You'll add a table in the next article in this series.

### [Full cluster](#tab/full)

1. Under your cluster, select **Query**. Paste the command `.show databases` into the query window, then select **Run**.

    :::image type="content" source="media/create-cluster-and-database/show-databases.png" alt-text="Show databases command." lightbox="media/create-cluster-and-database/show-databases.png":::

    The result set shows **TestDatabase**, the only database in the cluster.

1. Paste the command `.show tables` into the query window and select **Run**.

    This command returns an empty result set because you don't have any tables yet. You add a table in the next article in this series.

---

## Stop and restart the cluster

### [Free cluster](#tab/free)

You can't stop and restart a free cluster.

### [Full cluster](#tab/full)

You can stop and restart a cluster depending on business needs. Stopping the cluster significantly reduces cost as it releases the compute resources, which are the bulk of the overall cluster cost, without deleting the database.

1. To stop the cluster, at the top of the **Overview** tab, select **Stop**.

    :::image type="content" source="media/create-cluster-and-database/stop-button.png" alt-text="Screenshot of the Azure portal and cluster stop button." lightbox="media/create-cluster-and-database/stop-button.png":::

    > [!NOTE]
    > When the cluster is stopped, data is not available for queries, and you can't ingest new data.

1. To restart the cluster, at the top of the **Overview** tab, select **Start**.

    When the cluster is restarted, it takes about 10 minutes for it to become available (like when it was originally provisioned). It takes more time for data to load into the hot cache.

---

## Clean up resources

### [Free cluster](#tab/free)

To delete a database in a free cluster:

1. Open the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

1. From the left menu, select **My cluster**.

1. Under **Databases**, select the trash icon next to the database you'd like to delete.

### [Full cluster](#tab/full)

If you plan to follow other quickstarts and tutorials, keep the resources you created. Otherwise, clean up your resource group, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group that contains your Data Explorer cluster.

1. Select **Delete resource group** to delete the entire resource group. If using an existing resource group, you can choose to only delete the Data Explorer cluster.

---

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Ingest data into Azure Data Explorer](ingest-sample-data.md)
