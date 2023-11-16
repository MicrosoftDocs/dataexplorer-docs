---
title: Connect from common apps - Azure Data Explorer
description: This article describes how to connect to Azure Data Explorer with SQL Server emulation from various apps in Azure Data Explorer.
ms.topic: reference
ms.date: 07/04/2023
---

# Connect from common apps

This article gives examples on how to connect to Azure Data Explorer from [LINQPad](#linqpad), [Azure Data Studio](#azure-data-studio-134-and-above), [DBeaver](#dbeaver-533-and-above), and [Microsoft SQL Server Management Studio](#microsoft-sql-server-management-studio-v18x).

For more information, see the overview on [SQL Server emulation in Azure Data Explorer](sql-server-emulation-overview.md).

## LINQPad

You can connect to Azure Data Explorer from LINQPad as if Azure Data Explorer were an SQL server.

1. Select **Add connection**.

1. Set **Build data context automatically**.

1. Set **Default (LINQ to SQL)**, the LINQPad driver.

1. Set **SQL Azure**.

1. For the server, specify the name of the Azure Data Explorer cluster. For example, *mykusto.kusto.windows.net*.

1. Set **Windows Authentication (Active Directory)**, for signing in.

1. Select **Test** to verify connectivity.

1. Select **OK**. The browser window displays the tree view with the databases.

1. Now, you can browse through the databases, tables, and columns, and run SQLand LINQ queries in the query window. Specify the SQL language, and select a connection to the database. For example, select a table in the browser window. Select **Count**, and let it run.

## Azure Data Studio (1.3.4 and above)

To connect to Azure Data Explorer from Azure Data Studio, follow these steps.

1. Set the connection type to **Microsoft SQL Server**.

1. Specify the name of the Azure Data Explorer cluster as a server name. For example, *mykusto.kusto.windows.net*.

1. Set the authentication type **Microsoft Entra ID - Universal with MFA support**.

1. Specify the account that is provisioned in the Microsoft Entra ID. For example, *myname@contoso.com*. Add the account the first time.

1. Use **Database picker** to select the database.

1. Select **Connect** to take you to the database dashboard and set the connection.

1. Select **New Query** to open the query window, or select the **New Query** task on the dashboard.

## DBeaver (5.3.3 and above)

To configure DBeaver for handling result sets in a manner that is compatible with Azure Data Explorer, follow these steps.

1. Select **Preferences** in the **Window** menu.
1. Select **Data Editor** in the **Editors** section.
1. Make sure that **Refresh data on next page reading** is marked.

Now, you can create a connection to the Azure Data Explorer database by doing the following actions.

1. Select **New Connection** in the **Database** menu.

1. Look for **Azure** and set **Azure SQL Database**. Select **Next**.

1. Specify the host. For example, *mykusto.kusto.windows.net*.

1. Specify the database. For example, *mydatabase*.

   > [!WARNING]
   > Don't use *master* as the database name. Azure Data Explorer requires a connection to a specific database.

1. Set **Active Directory - Password** for *Authentication*.

1. Specify the credentials of the active directory user. For example, *myname@contoso.com*, and set the corresponding password for this user.

1. Select **Test Connection …** to verify that the connection details are correct.

## Microsoft SQL Server Management Studio (v18.x)

To connect to Azure Data Explorer from Microsoft SQL Server Management Studio, follow these steps.

1. Select **Connect**, and then **Database Engine** under **Object Explorer**.

1. Specify the name of Azure Data Explorer cluster as a server name. For example, *mykusto.region.kusto.windows.net*.

1. Set **Microsoft Entra ID - Universal with MFA** for authentication and specify the username.

1. Select **Options**.

1. Select **Browse Server** under **Connect to database** to browse available databases.

1. Select **Yes** to continue browsing.

1. The window displays a tree view with all the available databases. Select a database to connect to that database. Another possibility, is to select **default** under **Connect to database**, and then select **Connect**. Then, the object Explorer will display all the databases.

   > [!NOTE]
   > Browsing database objects via SSMS is not supported yet, since SSMS uses correlate subqueries to browse database schema.
   > Correlated subqueries are not supported by Azure Data Explorer. For more information, see [correlated subqueries](/azure/data-explorer/t-sql#correlated-sub-queries).

1. Select **New Query** to open the query window and set your database.

1. Now, you can run custom SQL queries from the query window.

## Related content

* [Query with T-SQL](t-sql.md)
* [Run KQL queries and call stored functions](sql-kql-queries-and-stored-functions.md)
