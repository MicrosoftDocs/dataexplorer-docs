---
title: Move from a free cluster to a paid Azure Data Explorer cluster
description: Learn how to move from a free Azure Data Explorer cluster to a paid cluster by creating a new cluster, exporting and importing your data, validating the move, and deleting the free cluster.
#customer intent: As a free cluster user, I want to move my data to a paid Azure Data Explorer cluster so that I can run production workloads with the full feature set and an SLA.
ms.reviewer: smorshtein
ms.topic: how-to
ms.date: 11/01/2026
---

# Move from a free cluster to a paid Azure Data Explorer cluster

A [free cluster](start-for-free.md) is for exploring Azure Data Explorer. When you're ready for production workloads, move to a paid Azure Data Explorer cluster in your Azure subscription. A paid cluster removes the free cluster quotas and provides the full feature set, including a service level agreement.

Moving to a paid cluster is a customer-managed migration: you create the new cluster, move your schema and data, switch your clients, and then delete the free cluster.

> [!IMPORTANT]
>
> * Your free cluster isn't converted, moved, or deleted automatically.
> * The free cluster keeps working while you migrate, and stays in place until you delete it.
> * Deleting the free cluster is your responsibility. Delete it after you confirm that everything runs on the paid cluster.

## Prerequisites

* A [free Azure Data Explorer cluster](start-for-free-web-ui.md) with the data you want to move.
* An Azure subscription. [Create a free Azure account](https://azure.microsoft.com/free/).
* Contributor permissions or greater in the Azure subscription.
* An Azure Storage account to hold the exported data, and a way to grant access to it, such as a shared access signature (SAS). For more information, see [Storage connection strings](/kusto/api/connection-strings/storage-connection-strings?view=azure-data-explorer&preserve-view=true).
* Complete or stop ingestion into the free cluster before you export, so that the exported data is complete.

## Step 1: Create a paid cluster and database

1. In the Azure portal, [create an Azure Data Explorer cluster](create-cluster-and-database.md#create-a-cluster). Choose the same region as your free cluster to keep latency low. The **Dev/Test** workload is a good starting point for data that fits a free cluster. You can [scale the cluster](manage-cluster-vertical-scaling.md) later.
1. [Create a database](create-cluster-and-database.md#create-a-database) with the same name as each database in your free cluster. Using the same names keeps your queries and functions unchanged.

## Step 2: Export your schema and data, and import them into the paid cluster

### Recreate the schema

1. In the free cluster, export the schema of each database as a script:

    ```kusto
    .show database MyDatabase schema as csl script
    ```

    The result is a script with the commands that create the tables, functions, materialized views, and policies of the database.

1. In the paid cluster, run the script against the new database:

    ```kusto
    .execute database script <|
    // Paste the script from the previous step here
    ```

    For more information, see [.show database schema](/kusto/management/show-schema-database-command?view=azure-data-explorer&preserve-view=true) and [.execute database script](/kusto/management/execute-database-script?view=azure-data-explorer&preserve-view=true).

### Export the data

In the free cluster, export each table to your storage account. The following command exports a table as Parquet files:

```kusto
.export async to parquet (
    h@"https://mystorage.blob.core.windows.net/export;<SAS token>"
) with (namePrefix="MyTable")
<| MyTable
```

Repeat the command for each table. For more information, see [Export data to storage](/kusto/management/data-export/export-data-to-storage?view=azure-data-explorer&preserve-view=true).

### Import the data

Ingest the exported files into the matching tables in the paid cluster. Use one of the following options:

* **Get data from Azure Storage** in the Azure Data Explorer web UI. For more information, see [Get data from Azure Storage](get-data-storage.md).
* **LightIngest** for many files or large tables. For more information, see [Use LightIngest to ingest data](lightingest.md).
* The `.ingest into` command for a small number of files:

    ```kusto
    .ingest into table MyTable (
        h@"https://mystorage.blob.core.windows.net/export/MyTable_1.parquet;<SAS token>"
    ) with (format="parquet")
    ```

    For more information, see [Ingest from storage](/kusto/management/data-ingestion/ingest-from-storage?view=azure-data-explorer&preserve-view=true).

### Reapply settings

The schema script doesn't include everything. Recreate the following items in the paid cluster:

* **Permissions**: Add database users and admins. For more information, see [Manage database permissions](manage-database-permissions.md).
* **Data connections**: Create new Event Hubs or other data connections that point to the paid cluster. For more information, see [Create an Event Hubs data connection](create-event-hubs-connection.md).
* **Client connection strings**: Update applications, SDK clients, dashboards, and Power BI reports to use the paid cluster's query URI and data ingestion URI.

## Step 3: Validate and switch your clients

1. Compare the row count of each table in the free cluster and in the paid cluster:

    ```kusto
    MyTable | count
    ```

1. Run your usual queries, functions, and dashboards against the paid cluster and confirm that the results match.
1. Point your applications, dashboards, and ingestion to the paid cluster's URIs. Keep the free cluster only as long as you need it for validation or recovery.

## Step 4: Delete the free cluster

The free cluster isn't deleted as part of the move. After everything runs on the paid cluster, delete the free cluster so that you don't keep two copies of your data.

1. In the [Azure Data Explorer web UI](https://dataexplorer.azure.com/freecluster), select **My cluster**.
1. Select **Delete**, and then confirm.

Deleting the free cluster is permanent. The cluster and its data can't be recovered.

## Move your data to an eventhouse instead

You can also move your data to an [eventhouse](/fabric/real-time-intelligence/eventhouse) in Microsoft Fabric instead of a paid Azure Data Explorer cluster. An eventhouse uses the same Kusto engine and Kusto Query Language, with no cluster to manage.

1. [Start a Microsoft Fabric trial](/fabric/fundamentals/fabric-trial) and [create an eventhouse](/fabric/real-time-intelligence/create-eventhouse).
1. Export your tables to Azure Storage as described in [Export the data](#export-the-data).
1. In the eventhouse, use **Get data** to ingest the files from Azure Storage. For more information, see [Get data from Azure Storage](/fabric/real-time-intelligence/get-data-azure-storage).
1. Validate the data, switch your clients, and delete the free cluster as described in the previous steps.

## Related content

* [What is a free Azure Data Explorer cluster?](start-for-free.md)
* [Create a free Azure Data Explorer cluster](start-for-free-web-ui.md)
* [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-and-database.md)
* [Select a SKU for your cluster](manage-cluster-choose-sku.md)
* [Try Microsoft Fabric for free](/fabric/fundamentals/fabric-trial)
