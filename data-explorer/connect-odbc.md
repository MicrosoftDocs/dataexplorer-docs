---
title: Connect to Azure Data Explorer with ODBC
description: In this article, you learn how to set up an Open Database Connectivity (ODBC) connection to Azure Data Explorer.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 09/02/2025
ms.custom: sfi-image-nochange
---

# Connect to Azure Data Explorer with ODBC

Open Database Connectivity ([ODBC](/sql/odbc/reference/odbc-overview)) is a widely accepted application programming interface (API) for database access. Azure Data Explorer is compatible with a subset of the SQL Server communication protocol (MS-TDS). This compatibility enables the use of the ODBC driver for SQL Server with Azure Data Explorer.

Consequently, you can establish a connection to Azure Data Explorer from any application that is equipped with support for the ODBC driver for SQL Server.

Watch the following video to learn how to create an ODBC connection.

> [!VIDEO https://www.youtube.com/embed/qA5wxhrOwog]

Alternatively, follow the steps to [connect to your cluster with ODBC](#connect-to-your-cluster-with-odbc).

> [!NOTE]
> Use dedicated connectors when possible. For a list of available connectors, see [Connectors overview](integrate-data-overview.md).

## Prerequisites

* [Microsoft ODBC Driver for SQL Server](/sql/connect/odbc/download-odbc-driver-for-sql-server) version 17.2.0.1 or later for your operating system.

## Connect to your cluster with ODBC

You can connect to your cluster in the following ways.

### [Connection string](#tab/connect-connection-string)

From an application that supports ODBC connection, you can connect to your cluster with a connection string of the following format:

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

### [DSN (Windows only)](#tab/connect-windows)

To configure an ODBC data source using the ODBC driver for SQL Server:

1. In Windows, search for *ODBC Data Sources*, and open the ODBC Data Sources desktop app.

1. Select **Add**.

:::image type="content" source="media/connect-odbc/add-data-source.png" alt-text="Screenshot of the ODBC Data Sources dialog showing the Add Data Source option and fields for creating a new DSN.":::

1. Select **ODBC Driver 17 for SQL Server** then **Finish**.

    :::image type="content" source="media/connect-odbc/select-driver.png" alt-text="Screenshot of the ODBC driver selection dialog showing ODBC Driver 17 for SQL Server selected.":::

1. Enter a name and description for the connection and the cluster you want to connect to, then select **Next**. The cluster URL should be in the form `\<ClusterName\>.\<Region\>.kusto.windows.net`.

    >[!NOTE]
    > When entering the cluster URL, don't include the prefix `https://`.

    :::image type="content" source="media/connect-odbc/select-server.png" alt-text="Screenshot of the Data Source Configuration window showing the Server field and an example cluster URL format.":::

1. Select **Active Directory Integrated** then **Next**.

    :::image type="content" source="media/connect-odbc/active-directory-integrated.png" alt-text="Screenshot of the authentication method dropdown showing Active Directory Integrated selected.":::

1. Select the database with the sample data then **Next**.

    :::image type="content" source="media/connect-odbc/change-default-database.png" alt-text="Screenshot of the default database selection dialog showing the sample data database chosen.":::

1. On the next screen, leave all options as defaults then select **Finish**.

1. Select **Test Data Source**.

    :::image type="content" source="media/connect-odbc/test-data-source.png" alt-text="Screenshot of the Test Data Source dialog showing the Test Data Source button and connection status fields.":::

1. Verify that the test succeeded then select **OK**. If the test didn't succeed, check the values that you specified in previous steps, and ensure you have sufficient permissions to connect to the cluster.

    :::image type="content" source="media/connect-odbc/test-succeeded.png" alt-text="Screenshot of the Test Data Source results showing a successful connection confirmation message.":::

---

> [!NOTE]
> Azure Data Explorer treats string values as `NVARCHAR(MAX)`, which can cause issues with some ODBC applications. Cast strings to `NVARCHAR(\<n\>)` by using the `Language` parameter in the connection string. For example, `Language=any@MaxStringSize:5000` encodes strings as `NVARCHAR(5000)`. For more information, see [tuning options](sql-server-emulation-overview.md#tuning-options).

## Application authentication

To use application principal authentication with ODBC, you must provide the Microsoft Entra tenant ID. You can set this configuration in the connection string, the Windows registry, or the odbc.ini file. See examples in the following tabs. For more information, see [tuning options](sql-server-emulation-overview.md#tuning-options).

### [Connection string](#tab/connection-string)

Set the application principal with `Language=any@AadAuthority:<aad_tenant_id>` in the connection string. Replace `<aad_tenant_id>`, `<aad_application_id>`, and `<aad_application_secret>` with the Microsoft Entra tenant ID, Microsoft Entra application ID, and the Microsoft Entra application secret respectively.

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=<adx_cluster_name>.<region_name>.kusto.windows.net;Database=<adx_database_name>;Authentication=ActiveDirectoryServicePrincipal;Language=any@AadAuthority:<aad_tenant_id>;UID=<aad_application_id>;PWD=<aad_application_secret>"
```

### [Windows registry](#tab/windows-registry)

Edit the `Language` field in the ODBC data source (DSN) in the registry for Windows as follows.

```odbc
[HKEY_CURRENT_USER\SOFTWARE\ODBC\ODBC.INI\MyUserDSN]
"Language"="any@AadAuthority:<aad_tenant_id>"
```

### [odbc.ini file](#tab/odbcini-file)

For Linux and macOS, edit the odbc.ini file, as follows.

```odbc
# [DSN name]
[MSSQLTest]
Driver = ODBC Driver 17 for SQL Server
# Server = [protocol:]server[,port]
Server = tcp:<adx_cluster_name>.<region_name>.kusto.windows.net,1433
Language = any@AadAuthority:<aad_tenant_id>
```

---

## Related content

* [SQL Server emulation in Azure Data Explorer](sql-server-emulation-overview.md)
* [Run Kusto Query Language (KQL) queries and call stored functions](sql-kql-queries-and-stored-functions.md)
