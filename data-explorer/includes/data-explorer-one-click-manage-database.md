---
ms.topic: include
ms.date: 01/03/2022
---
1. In [Azure Data Explorer web UI](https://dataexplorer.azure.com/), select **Data** in the left pane.

1. In the **Database** tile, select **Manage** to start the wizard.

    :::image type="content" source="../media/one-click-manage-database/select-manage-database.png" alt-text="Screenshot of data page, showing selection of manage database.":::

1. Fill out the form with the following information.

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Cluster | *TestCluster* | The cluster in which to create or update the database. |
    | Database name | *TestDatabase* | The name of database to create or update. The name must be unique within the cluster. |
    | Retention period | *365* | The number of days that data is stored in long-term storage before it's deleted. The period is measured from the time data is ingested. |
    | Cache period | *31* | The number of days that frequently queried data is available in RAM or SSD storage where it can be rapidly accessed to optimize query performance. |

    :::image type="content" source="../media/one-click-manage-database/create-new-database.png" alt-text="Screenshot of manage database page, showing create database properties.":::

1. Select **Manage database** to create or update the database. The action typically takes less than a minute.
