---
title: Clone a database schema - Azure Data Explorer
description: Learn how to clone a database schema in Azure Data Explorer.
ms.reviewer: zivc
ms.topic: how-to
ms.date: 08/27/2023
---

# Clone a database schema in Azure Data Explorer

This article explains how to use [management commands](kusto/management/index.md) to clone an Azure Data Explorer database schema.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Database Admin](kusto/access-control/role-based-access-control.md) permissions.

## Clone a database schema

1. In the [connection pane](web-ui-query-overview.md#view-clusters-and-databases), select the database whose schema you want to clone.
2. Run the following command:

    ```kusto
    .show database <DatabaseName> schema as csl script
    ```

    This command returns a script of management commands to recreate the database schema. For more information, see [.show database schema command](kusto/management/show-schema-database.md#show-database-schema-as-csl-script).

1. Copy the CSL script output.
1. In the connection pane, select the database where you want to recreate the schema. If necessary, [create a database](create-cluster-and-database.md#create-a-database).
1. Run the following command with the copied script. If the database names differ, replace the name in the script commands with the name of the destination database.

    ```kusto
    .execute database script <|
        <CSLScript>
    ```

    This command runs the commands from the script, effectively recreating the database schema on the destination database. For more information, see [.execute database script command](kusto/management/execute-database-script.md).

1. Check the output. The `Result` column should show as `Complete`. For a `Failed` result, troubleshoot and retry.

## Related content

* [Cross-cluster and cross-database queries](kusto/query/cross-cluster-or-database-queries.md)
* [Ingest from query](kusto/management/data-ingestion/ingest-from-query.md)
