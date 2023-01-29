---
title: "Quickstart: Create an Azure Data Explorer cluster and database"
description: In this quickstart, you learn how to create an Azure Data Explorer cluster and database, and ingest data.
ms.reviewer: mblythe
ms.topic: quickstart
ms.date: 01/16/2023
ms.custom: mode-portal
adobe-target: true

# Customer intent: As a database administrator, I want to create an Azure Data Explorer cluster and database so that I can understand whether Azure Data Explorer is suitable for my analytics projects.
---

# Quickstart: Create an Azure Data Explorer cluster and database

> [!div class="op_single_selector"]
>
> * [Web UI free cluster](start-for-free-web-ui.md)
> - [Portal](create-cluster-database-portal.md)
> - [CLI](create-cluster-database-cli.md)
> - [PowerShell](create-cluster-database-powershell.md)
> - [C#](create-cluster-database-csharp.md)
> - [Python](create-cluster-database-python.md)
> - [Go](create-cluster-database-go.md)
> - [ARM template](create-cluster-database-resource-manager.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest data into a database so that you can run queries against it. In this quickstart, you create a cluster and a database.

For more information on cluster subscription limits, see [Azure Data Explorer limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-data-explorer-limits).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).

## Create a cluster

Create an Azure Data Explorer cluster with a defined set of compute and storage resources in an Azure resource group.

1. Select the **+ Create a resource** button in the upper-left corner of the portal.

    :::image type="content" source="media/create-cluster-database-portal/create-resource.png" alt-text="Screenshot of the Create a resource button.":::

1. Search for *Azure Data Explorer*.

    :::image type="content" source="media/create-cluster-database-portal/search-resources.png" alt-text="Search Azure Data Explorer":::

1. Under **Azure Data Explorer**, select **Create**.

    :::image type="content" source="media/create-cluster-database-portal/create-click.png" alt-text="Screenshot of the Create a cluster window":::

1. Fill out the basic cluster details with the following information.

    :::image type="content" source="media/create-cluster-database-portal/create-cluster-form.png" alt-text="Screenshot of the Azure portal create Azure Data Explorer cluster form.":::

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | Your resource group | Use an existing resource group or create a new resource group. |
    | Cluster name | A unique cluster name | Choose a unique name that identifies your cluster. The domain name *[region].kusto.windows.net* is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters.
    | Region | *West US* or *West US 2* | Select *West US* or *West US 2* (if using availability zones) for this quickstart. For a production system, select the region that best meets your needs.
    | Workload | *Dev/Test* | Select *Dev/Test* for this quickstart. For a production system, select the specification that best meets your needs.
    | Compute specifications | *Dev(No SLA)_Standard_E2a_v4* | Select *Dev(No SLA)_Standard_E2a_v4* for this quickstart. For a production system, select the specification that best meets your needs.
    | Availability zones | On | Turning on this feature will distribute the cluster storage and compute resources across multiple physical zones within a region for added protection and availability. By default, this feature is turned on if zones are supported in the region. If less than 3 zones are available for the compute instances, the portal will display the number of supported zones. Note that deployment to availability zones is possible only when creating the cluster, and can't be modified later. Read more about [Azure Availability Zones](/azure/availability-zones/az-overview).|

1. Select **Review + create** to review your cluster details, and on the next screen select **Create** to provision the cluster. Provisioning typically takes about 10 minutes.

1. When the deployment is complete, select **Go to resource**.

    :::image type="content" source="media/create-cluster-database-portal/notification-resource.png" alt-text="Screenshot of the Go to resource button.":::

> [!NOTE]
> If the deployment fails with the error "SubscriptionNotRegistered", retry the operation.
>
> Deployment fails when the Kusto resource provider isn't registered on the subscription described in [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types). When the deployment fails, the Kusto resource provider registers itself on the subscription, and the retry can then succeed.

## Create a database

You're now ready for the second step in the process: database creation.

1. On the **Overview** tab, select **Create database**.

    :::image type="content" source="media/create-cluster-database-portal/database-creation.png" alt-text="Screenshot of the Create a database window.":::

1. Fill out the form with the following information.

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Admin | *Default selected* | The admin field is disabled. New admins can be added after database creation. |
    | Database name | *TestDatabase* | The name of database to create. The name must be unique within the cluster. |
    | Retention period | *365* | The number of days that data is guaranteed to be kept available for querying. The period is measured from the time data is ingested. |
    | Cache period | *31* | The number of days to keep frequently queried data available in SSD storage or RAM to optimize querying. |

    :::image type="content" source="media/create-cluster-database-portal/create-test-database.png" alt-text="Create database form.":::

1. Select **Create** to create the database. Creation typically takes less than a minute. When the process is complete, you're back on the cluster **Overview** tab.

## Run basic commands in the database

After you created the cluster and database, you can run queries and commands. The database doesn't have data yet, but you can still see how the tools work.

1. Under your cluster, select **Query**. Paste the command `.show databases` into the query window, then select **Run**.

    :::image type="content" source="media/create-cluster-database-portal/show-databases.png" alt-text="Show databases command.":::

    The result set shows **TestDatabase**, the only database in the cluster.

1. Paste the command `.show tables` into the query window and select **Run**.

    This command returns an empty result set because you don't have any tables yet. You add a table in the next article in this series.

## Stop and restart the cluster

You can stop and restart a cluster depending on business needs. Stopping the cluster significantly reduces cost as it releases the compute resources, which are the bulk of the overall cluster cost, without deleting the database.

1. To stop the cluster, at the top of the **Overview** tab, select **Stop**.

    :::image type="content" source="media/create-cluster-database-portal/stop-button.png" alt-text="Screenshot of the Azure portal and cluster stop button.":::

    > [!NOTE]
    > When the cluster is stopped, data is not available for queries, and you can't ingest new data.

1. To restart the cluster, at the top of the **Overview** tab, select **Start**.

    When the cluster is restarted, it takes about 10 minutes for it to become available (like when it was originally provisioned). It takes more time for data to load into the hot cache.

## Clean up resources

If you plan to follow other quickstarts and tutorials, keep the resources you created. Otherwise, clean up your resource group, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group that contains your Data Explorer cluster.

1. Select **Delete resource group** to delete the entire resource group. If using an existing resource group, you can choose to only delete the Data Explorer cluster.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingest data into Azure Data Explorer](ingest-data-overview.md)
