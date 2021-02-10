---
title: 'Quickstart: Create an Azure Data Explorer cluster & DB'
description: 'In this quickstart, you learn how to create an Azure Data Explorer cluster and database, and ingest (load) data.'
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: quickstart
ms.date: 07/22/2019
ms.localizationpriority: high 
adobe-target: true

#Customer intent: As a database administrator, I want to create an Azure Data Explorer cluster and database so that I can understand whether Azure Data Explorer is suitable for my analytics projects.
---


# Quickstart: Create an Azure Data Explorer cluster and database

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
> * [Go](create-cluster-database-go.md)
> * [ARM template](create-cluster-database-resource-manager.md)


Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this quickstart, you create a cluster and a database.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a cluster

Create an Azure Data Explorer cluster with a defined set of compute and storage resources in an Azure resource group.

1. Select the **+ Create a resource** button in the upper-left corner of the portal.

1. Search for *Azure Data Explorer*.

   ![Search resources](media/create-cluster-database-portal/search-resources.png)

1. Under **Azure Data Explorer**, at the bottom of the screen, select **Create**.

1. Fill out the basic cluster details with the following information.

   ![Create cluster form](media/create-cluster-database-portal/create-cluster-form2.png)

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | Your resource group | Use an existing resource group or create a new resource group. |
    | Cluster name | A unique cluster name | Choose a unique name that identifies your cluster. The domain name *[region].kusto.windows.net* is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters.
    | Region | *West US* or *West US 2* | Select *West US* or *West US 2* (if using availability zones) for this quickstart. For a production system, select the region that best meets your needs.
    | Availability zones | *1*, *2*, and/or *3* | Place the cluster instances in various availability zones in the same region (optional). [Azure Availability Zones](/azure/availability-zones/az-overview) are unique physical locations within the same Azure region. They protect an Azure Data Explorer cluster and data from partial region failure. The cluster nodes are created, by default, in the same data center. By selecting several availability zones you can eliminate a single point of failure and ensure high availability. Deployment to availability zones is possible only during cluster creation and can't be modified at a later date.
    | Compute specifications | *D13_v2* | Select the lowest price specification for this quickstart. For a production system, select the specification that best meets your needs.
    | | | |

1. Select **Review + create** to review your cluster details, and **Create** to provision the cluster. Provisioning typically takes about 10 minutes.

1. When the deployment is complete, select **Go to resource**.

    ![Go to resource](media/create-cluster-database-portal/notification-resource.png)

> [!NOTE]
> If the deployment fails with the error "SubscriptionNotRegistered", retry the operation. 
> 
> Deployment fails when the Kusto resource provider isn't registered on the subscription described in [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types). When the deployment fails, the Kusto resource provider registers itself on the subscription, and the retry can then succeed.

## Create a database

You're now ready for the second step in the process: database creation.

1. On the **Overview** tab, select **Create database**.

    ![Step 2: create a database](media/create-cluster-database-portal/database-creation.png)

1. Fill out the form with the following information.

    ![Create database form](media/create-cluster-database-portal/create-database.png)

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Database name | *TestDatabase* | The database name must be unique within the cluster.
    | Retention period | *3650* | The time span (in days) for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested.
    | Cache period | *31* | The time span (in days) for which to keep frequently queried data available in SSD storage or RAM, rather than in longer-term storage.
    | | | |

1. Select **Create** to create the database. Creation typically takes less than a minute. When the process is complete, you're back on the cluster **Overview** tab.

## Run basic commands in the database

Now that you have a cluster and database, you can run queries and commands. You don't have any data in the database yet, but you can still see how the tools work.

1. Under your cluster, select **Query**. Paste the command `.show databases` into the query window, then select **Run**.

    ![Show databases command](media/create-cluster-database-portal/show-databases.png)

    The result set shows **TestDatabase**, the only database in the cluster.

1. Paste the command `.show tables` into the query window and select **Run**.

    This command returns an empty result set because you don't have any tables yet. You add a table in the next article in this series.

## Stop and restart the cluster

You can stop and restart a cluster depending on business needs.

1. To stop the cluster, at the top of the **Overview** tab, select **Stop**.

    :::image type="content" source="media/create-cluster-database-portal/stop-button.png" alt-text="The stop button":::

    > [!NOTE]
    > When the cluster is stopped, data is not available for queries, and you can't ingest new data.

1. To restart the cluster, at the top of the **Overview** tab, select **Start**.

    When the cluster is restarted, it takes about 10 minutes for it to become available (like when it was originally provisioned). It takes additional time for data to load into the hot cache.  

## Clean up resources

If you plan to follow other quickstarts and tutorials, keep the resources you created. Otherwise, clean up your resource group, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group that contains your Data Explorer cluster.  

1. Select **Delete resource group** to delete the entire resource group. If using an existing resource group, you can choose to only delete the Data Explorer cluster.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md)


