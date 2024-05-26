---
title: Connect to Azure Data Explorer with ODBC
description: In this article, you learn how to set up an Open Database Connectivity (ODBC) connection to Azure Data Explorer.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 05/26/2024
---

# Connect to Azure Data Explorer with ODBC

Open Database Connectivity ([ODBC](/sql/odbc/reference/odbc-overview)) is a widely accepted application programming interface (API) for database access. Azure Data Explorer is compatible with a subset of the SQL Server communication protocol (MS-TDS). This compatibility enables the use of the ODBC driver for SQL Server with Azure Data Explorer.

Consequently, you can establish a connection to Azure Data Explorer from any application that is equipped with support for the ODBC driver for SQL Server.

Watch the following video to learn to create an ODBC connection.

> [!VIDEO https://www.youtube.com/embed/qA5wxhrOwog]

Alternatively, follow the steps to [connect to your cluster with ODBC](#connect-to-your-cluster-with-odbc).

> [!NOTE]
> We recommend using dedicated connectors whenever possible. For a list of available connectors, see [Connectors overview](connector-overview.md).

## Prerequisites

* [Microsoft ODBC Driver for SQL Server version 17.2.0.1 or later](/sql/connect/odbc/download-odbc-driver-for-sql-server) for your operating system.

## Connect to your cluster with ODBC

You can connect to your cluster in the following ways.

### [Connection string](#tab/connection-string1)

From an application that supports ODBC connection, you can connect to your cluster with a connection string of the following format:

```odbc
"Driver={ODBC Driver 17 for SQL Server};Server=mykustocluster.kusto.windows.net;Database=mykustodatabase;Authentication=ActiveDirectoryIntegrated"
```

### [Windows](#tab/windows)

To configure an ODBC data source using the ODBC driver for SQL Server:

1. In Windows, search for *ODBC Data Sources*, and open the ODBC Data Sources desktop app.

1. Select **Add**.

    ![Add data source.](media/connect-odbc/add-data-source.png)

1. Select **ODBC Driver 17 for SQL Server** then **Finish**.

    ![Select driver.](media/connect-odbc/select-driver.png)

1. Enter a name and description for the connection and the cluster you want to connect to, then select **Next**. The cluster URL should be in the form *\<ClusterName\>.\<Region\>.kusto.windows.net*.

    >[!NOTE]
    > When entering the cluster URL, do not include the prefix "https://".

    ![Select server.](media/connect-odbc/select-server.png)

1. Select **Active Directory Integrated** then **Next**.

    ![Active Directory Integrated.](media/connect-odbc/active-directory-integrated.png)

1. Select the database with the sample data then **Next**.

    ![Change default database.](media/connect-odbc/change-default-database.png)

1. On the next screen, leave all options as defaults then select **Finish**.

1. Select **Test Data Source**.

    ![Test data source.](media/connect-odbc/test-data-source.png)

1. Verify that the test succeeded then select **OK**. If the test didn't succeed, check the values that you specified in previous steps, and ensure you have sufficient permissions to connect to the cluster.

    ![Test succeeded.](media/connect-odbc/test-succeeded.png)

---

> [!NOTE]
> Azure Data Explorer considers string values as `NVARCHAR(MAX)`, which may not work well with some ODBC applications. Cast the data to `NVARCHAR(`*n*`)` using the `Language` parameter in the connection string. For example, `Language=any@MaxStringSize:5000` will encode strings as `NVARCHAR(5000)`. For more information, see [tuning options](sql-server-emulation-overview.md#tuning-options).

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
* [Run KQL queries and call stored functions](sql-kql-queries-and-stored-functions.md)
