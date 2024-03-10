---
title: Create a table in Azure Data Explorer
description: Learn how to easily create a table and manually define the schema in Azure Data Explorer with the table creation wizard.
ms.reviewer: akshays
ms.topic: how-to
ms.date: 03/07/2024
# Customer intent: As a data engineer, I want to create an empty table in Azure Data Explorer so that I can ingest data and query it.
---
# Create a table in Azure Data Explorer

Creating a table is an important step in the process of [data ingestion](ingest-data-overview.md) and [query](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) in Azure Data Explorer. The following article shows how to create a table and schema mapping quickly and easily using the Azure Data Explorer web UI.

> [!NOTE]
> To create a new table based on existing data, see [Get data from file](get-data-file.md) or [Get data from Azure storage](get-data-storage.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md). 
* Database User or Database Admin permissions. For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

> [!NOTE]
> To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).

## Create a table

1. In the navigation pane, select **Query**.

1. Select **+ Add** > **Table** or right-click on the database where you want to create the table and select **Create table**.

## Destination tab

The **Create table** window opens with the **Destination** tab selected.

1. The **Cluster** and **Database** fields are prepopulated. You may select different values from the drop-down menu.
1. In **Table name**, enter a name for your table.

    > [!TIP]
    >  Table names can be up to 1024 characters including alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Select **Next: Schema**

## Schema tab

1. Select **Add new column** and the **Edit columns** panel opens.
1. For each column, enter **Column name** and **Data type**. Create more columns by selecting **Add column**.
1. Select **Save**. The schema is displayed.
1. Select **Next: Create table**.

A new table is created in your target destination, with the schema you defined.

## Related content

* [Data ingestion overview](ingest-data-overview.md)
* [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
