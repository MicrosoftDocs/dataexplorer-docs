---
title: Clone a database schema - Azure Data Explorer
description: Learn how to clone a database schema in Azure Data Explorer.
ms.reviewer: zivc
ms.topic: how-to
ms.date: 09/21/2023
---

# Clone a database schema in Azure Data Explorer

This article explains how to use [management commands](kusto/management/index.md) to clone an Azure Data Explorer database schema.

## Prerequisites

* [Database Admin](kusto/access-control/role-based-access-control.md) permissions

## Clone a database schema

The following steps describe how to clone a database schema using the [Azure Data Explorer web UI](https://dataexplorer.azure.com/). Alternatively, you can use the [Kusto client libraries](kusto/api/client-libraries.md) to run the same management commands. For more information, see [Create an app to run management commands](kusto/api/get-started/app-management-commands.md).

1. From the left menu, select **Query**.
1. In the [connection pane](web-ui-query-overview.md#view-clusters-and-databases), select the database whose schema you want to clone.

    :::image type="content" source="media/clone-database-schema/select-database.png" alt-text="Screenshot of selected database in connection pane." lightbox="media/clone-database-schema/select-database.png":::
    
1. Run the following command:

    ```kusto
    .show database schema as csl script
    ```

    This command returns a script of management commands to recreate the database schema. For more information, see [.show database schema command](kusto/management/show-schema-database.md#show-database-schema-as-csl-script).

1. Copy the CSL script output. To do so, select all of the returned rows. Then, either right-click and select **Copy** or use the *Ctrl + C* keyboard shortcut.

    :::image type="content" source="media/clone-database-schema/copy-script-output.png" alt-text="Screenshot of the selected records and right-click menu." lightbox="media/clone-database-schema/copy-script-output.png":::

1. In the connection pane, select the database where you want to recreate the schema. If necessary, [create a database](create-cluster-and-database.md#create-a-database).

    :::image type="content" source="media/clone-database-schema/select-other-database.png" alt-text="Screenshot of the other selected database in connection pane." lightbox="media/clone-database-schema/select-other-database.png":::

1. In the following command, replace `<CSLScript>` with the copied script. If the database names differ, replace the database name in the script commands with the name of the new database. Select the full command text and then run it. If you don't select the full text, the command will stop at the first empty line in the script.

    ```kusto
    .execute database script <| <CSLScript>
    ```

    This command runs the commands from the script, recreating the database schema on the new database. For more information, see [.execute database script command](kusto/management/execute-database-script.md).

1. Commands in the script run sequentially, stopping if a command fails. To confirm successful completion, scroll to the final command and check that the `Result` column is `Complete`. If a failure occurs, troubleshoot and run the command again.

    > [!NOTE]
    > You can rerun the script as often as needed without clearing resources from the previous run.

## Related content

* [Cross-cluster and cross-database queries](kusto/query/cross-cluster-or-database-queries.md)
* [Ingest from query](kusto/management/data-ingestion/ingest-from-query.md)
