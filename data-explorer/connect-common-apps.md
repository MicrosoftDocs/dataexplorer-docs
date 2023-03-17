---
title: Connect from common SQL clients - Azure Data Explorer
description: This article describes how to connect to Azure Data Explorer with SQL Server emulation from various clients in Azure Data Explorer.
ms.topic: reference
ms.date: 03/08/2023
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

1. Set the authentication type **Azure Active Directory - Universal with MFA support**.

1. Specify the account that is provisioned in the Azure AD. For example, *myname@contoso.com*. Add the account the first time.

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

1. Set **Azure Active Directory - Universal with MFA** for authentication and specify the username.

1. Select **Options**.

1. Select **Browse Server** under **Connect to database** to browse available databases.

1. Select **Yes** to continue browsing.

1. The window displays a tree view with all the available databases. Select a database to connect to that database. Another possibility, is to select **default** under **Connect to database**, and then select **Connect**. Then, the object Explorer will display all the databases.

   > [!NOTE]
   > Browsing database objects via SSMS is not supported yet, since SSMS uses correlate subqueries to browse database schema.
   > Correlated subqueries are not supported by Azure Data Explorer. For more information, see [correlated subqueries](/azure/data-explorer/t-sql#correlated-sub-queries).

1. Select **New Query** to open the query window and set your database.

1. Now, you can run custom SQL queries from the query window.

## MATLAB

From MATLAB, you can connect to Azure Data Explorer using [JDBC](connect-jdbc.md). To connect, do the following:

1. Create a "javaclasspath.txt" file in your preferences directory. This file will be used to add the required JAR-files to the front of MATLAB's static classpath.

   ```java
   edit(fullfile(prefdir,'javaclasspath.txt'))
   ```

1. Add the paths to the required JAR-files by replacing `c:\full\path\to` with the actual full paths to these files.

   ```java
   <before>
   c:\full\path\to\accessors-smart-1.2.jar
   c:\full\path\to\activation-1.1.jar
   c:\full\path\to\adal4j-1.6.3.jar
   c:\full\path\to\asm-5.0.4.jar
   c:\full\path\to\commons-codec-1.11.jar
   c:\full\path\to\commons-lang3-3.5.jar
   c:\full\path\to\gson-2.8.0.jar
   c:\full\path\to\javax.mail-1.6.1.jar
   c:\full\path\to\jcip-annotations-1.0-1.jar
   c:\full\path\to\json-smart-2.3.jar
   c:\full\path\to\lang-tag-1.4.4.jar
   c:\full\path\to\mssql-jdbc-7.0.0.jre8.jar
   c:\full\path\to\nimbus-jose-jwt-6.5.jar
   c:\full\path\to\oauth2-oidc-sdk-5.64.4.jar
   c:\full\path\to\slf4j-api-1.7.21.jar
   ```

   > [!IMPORTANT]
   > You need the `<before>` at the top, so that these files are added to the front of the classpath.

1. Restart MATLAB to make sure that these classes are loaded.

1. In the MATLAB command window, run the following command to reset `TransformerFactory` to the default. MATLAB usually overloads this with `Saxon`, which is incompatible with the `adal4j` dependency.

   ```java
   java.lang.System.clearProperty('javax.xml.transform.TransformerFactory')
   ```

1. In the MATLAB command window, run the following command to connect to Azure Data Explorer.

   ```java
   conn = database('<database_name>','<AAD_user>','<AAD_user_password>','com.microsoft.sqlserver.jdbc.SQLServerDriver' ['jdbc:sqlserver://<cluster_name.region>.kusto.windows.net:1433;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.kusto.windows.net;loginTimeout=30;authentication=ActiveDirectoryPassword;database='])
   ```

   > [!NOTE]
   >
   > * If you end with `database=` without a value, the database name will be inferred.
   > * To use Azure Active Directory integrated authentication, replace **ActiveDirectoryPassword** with **ActiveDirectoryIntegrated**.

1. In the MATLAB command window, test the connection and run a sample [T-SQL](/azure/data-explorer/t-sql) query. Replace `<table_name>` with an existing table in Azure Data Explorer.

   ```java
   data = select(conn, 'SELECT * FROM <table_name>')
   data
   ```

## Next steps

* [Query with T-SQL](t-sql.md)
* [Run KQL queries and call stored functions](sql-kql-queries-and-stored-functions.md)